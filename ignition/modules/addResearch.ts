import { buildModule } from "@nomicfoundation/hardhat-ignition/modules";
import { ethers } from "hardhat";
import hre from "hardhat";
import ExchangeRouterModule from "./exchangeRouter4";
import LibrariesModule3 from "./LibrariesModule3";


const AddResearchModule = buildModule("AddResearch", (m) => { 
    const _owner = m.getAccount(0);
    const _admin = m.getAccount(1);

  const {
    // roleStore,
    // dataStore,
    eventEmitter,
    depositVault,
    withdrawalVault,
    router,
    depositHandler,
    withdrawalHandler,
    shiftHandler,
    orderHandler,
    externalHandler,
    exchangeRouter,
    oracle,
    requesterAccessController,
    billingAccessController,
    linkToken,
    sequencerUptimeFeed,
    orderVault,
    swapHandler,
    referralStorage 
} = m.useModule(ExchangeRouterModule);

const { 
    roleStore,
    dataStore,
    calc,
    precision,
    eventUtils,
    errorUtils,
    keys,
    gasUtils,
    feeUtils,
    marketEventUtils,
    marketStoreUtils,
    marketUtils,
    positionStoreUtils,
    positionUtils,
    increasePositionUtils,
    swapPricingUtils,
    swapUtils,
    swapOrderUtils,
    orderEventUtils,
    referralEventUtils,
    decreasePositionCollateralUtils,
    decreasePositionSwapUtils,
    positionEventUtils, 
    decreasePositionUtils, 
    positionPricingUtils, 
    increaseOrderUtils, 
    decreaseOrderUtils, 
    referralUtils, 
    depositEventUtils, 
    depositStoreUtils, 
    depositUtils, 
    executeDepositUtils, 
    withdrawalEventUtils, 
    withdrawalStoreUtils, 
    withdrawalUtils, 
    executeWithdrawalUtils, 
    orderStoreUtils, 
    orderUtils, 
    executeOrderUtils,
    callbackUtils,
    shiftStoreUtils,
    shiftEventUtils,
    shiftUtils
  } = m.useModule(LibrariesModule3);

  const config = m.contract("Config", [
    roleStore,
    dataStore,
    eventEmitter
  ], {libraries: {
    MarketUtils: marketUtils
  }});
  // RoleStore _roleStore,
  // Config _config,
  // DataStore _dataStore,
  // EventEmitter _eventEmitter,
  // address _riskOracle

  //* Мок риск оракула

  const riskOracle = m.contract("MockRiskOracle", [
    [
      _owner,
      _admin
    ],
    ["price"]
  ], {after: []});

  const configSyncer = m.contract("ConfigSyncer", [
    roleStore,
    config,
    dataStore,
    eventEmitter,
    riskOracle
  ], {after: [config]});
  // const mockRiskOracle = m.contract("MockRiskOracle", [], {after: [configSyncer]});
  // RoleStore _roleStore,
  // DataStore _dataStore,
  // EventEmitter _eventEmitter,
  // OracleStore _oracleStore,
  // uint256 _timelockDelay
  const oracleStore = m.contract("OracleStore", [
    roleStore,
    eventEmitter
  ], {after: []});

  const timelock = m.contract("Timelock", [
    roleStore,
    dataStore,
    eventEmitter,
    oracleStore,
    5 * 24 * 60 * 60
  ], {after: []});

  //* Утилиты для работы с хранилищем депозитов

  const readerDepositUtils = m.contract("ReaderDepositUtils", [], {
    libraries: {
      MarketUtils: marketUtils,
      SwapPricingUtils: swapPricingUtils
    },
    after: [],
  }); 
//   * contracts/ExchangeRouter/contracts/market/MarketUtils.sol:MarketUtils
// * contracts/ExchangeRouter/contracts/pricing/SwapPricingUtils.sol:SwapPricingUtils



//   * contracts/ExchangeRouter/contracts/market/MarketStoreUtils.sol:MarketStoreUtils
// * contracts/ExchangeRouter/contracts/position/PositionStoreUtils.sol:PositionStoreUtils
// * contracts/ExchangeRouter/contracts/position/PositionUtils.sol:PositionUtils
// * contracts/ExchangeRouter/contracts/reader/ReaderPricingUtils.sol:ReaderPricingUtils

  const readerPricingUtils = m.contract("ReaderPricingUtils", [], {
    libraries: {
      PositionUtils: positionUtils,
      SwapPricingUtils: swapPricingUtils
    },
    after: [],
  });

  const readerPositionUtils = m.contract("ReaderPositionUtils", [

  ], {
    libraries: {
      MarketStoreUtils: marketStoreUtils,
      PositionStoreUtils: positionStoreUtils,
      PositionUtils: positionUtils,
      ReaderPricingUtils: readerPricingUtils
    },
    after: [],
  });

  //   * contracts/ExchangeRouter/contracts/position/PositionUtils.sol:PositionUtils
  // * contracts/ExchangeRouter/contracts/pricing/SwapPricingUtils.sol:SwapPricingUtils

  const readerUtils = m.contract("ReaderUtils", [], {
    libraries: {
      MarketStoreUtils: marketStoreUtils,
      OrderStoreUtils: orderStoreUtils,
      ReaderPositionUtils: readerPositionUtils
    },
    after: [],
  });

//   * contracts/ExchangeRouter/contracts/market/MarketStoreUtils.sol:MarketStoreUtils
// * contracts/ExchangeRouter/contracts/order/OrderStoreUtils.sol:OrderStoreUtils
// * contracts/ExchangeRouter/contracts/reader/ReaderPositionUtils.sol:ReaderPositionUtils


  const readerWithdrawalUtils = m.contract("ReaderWithdrawalUtils", [], {
    libraries: {
      MarketUtils: marketUtils
    },
    after: [],
  });

  // * contracts/ExchangeRouter/contracts/market/MarketUtils.sol:MarketUtils
  const reader = m.contract("Reader", [], {
      after: [timelock],
      libraries: {
        DepositStoreUtils: depositStoreUtils,
        MarketStoreUtils: marketStoreUtils,
        PositionStoreUtils: positionStoreUtils,
        ReaderDepositUtils: readerDepositUtils,
        ReaderPositionUtils: readerPositionUtils,
        ReaderPricingUtils: readerPricingUtils,
        ReaderUtils: readerUtils,
        ReaderWithdrawalUtils: readerWithdrawalUtils,
        ShiftStoreUtils: shiftStoreUtils,
        WithdrawalStoreUtils: withdrawalStoreUtils,
        MarketUtils: marketUtils,
        PositionUtils: positionUtils
      }
  });

  // * contracts/ExchangeRouter/contracts/market/MarketUtils.sol:MarketUtils
  // * contracts/ExchangeRouter/contracts/position/PositionUtils.sol:PositionUtils

  
  const shiftVault = m.contract("ShiftVault", [roleStore, dataStore], {
      after: [],
  });
  
  // const oracleStore = m.contract("OracleStore", [roleStore], {after: [shiftVault]});
  // const orderVault = m.contract("OrderVault", [roleStore, dataStore], {after: [oracleStore]});
  const glvVault = m.contract("GlvVault", [roleStore, dataStore], {after: [orderVault]});
  
  // const marketFactory = m.contract("MarketFactory", [roleStore, dataStore], {
  //     after: [glvVault],
  //     libraries: {
  //         MarketStoreUtils: marketStoreUtils
  //     }
  // });



  

  // Утилиты для работы с хранилищем GLV депозитов
  const glvDepositStoreUtils = m.library("GlvDepositStoreUtils", {
    after: [],
  });

  // Утилиты для работы с хранилищем GLV выводов
  const glvWithdrawalStoreUtils = m.library("GlvWithdrawalStoreUtils", {
    after: [],
  });

  // Утилиты для работы с хранилищем GLV шифтов
  const glvShiftStoreUtils = m.library("GlvShiftStoreUtils", {
    after: [],
  });

  // Основные утилиты для работы с GLV
  const glvStoreUtils = m.library("GlvStoreUtils", {
    after: [],
  });

  //* Утилиты для работы с GLV
  const glvUtils = m.contract("GlvUtils", [], {
    libraries: {
      GlvStoreUtils: glvStoreUtils,
      MarketStoreUtils: marketStoreUtils,
      MarketUtils: marketUtils
    },
    after: [],
  });

//   * contracts/ExchangeRouter/contracts/glv/GlvStoreUtils.sol:GlvStoreUtils
// * contracts/ExchangeRouter/contracts/market/MarketStoreUtils.sol:MarketStoreUtils
// * contracts/ExchangeRouter/contracts/market/MarketUtils.sol:MarketUtils

  const glvReader = m.contract("GlvReader", [], {
    after: [reader],
    libraries: {
      GlvStoreUtils: glvStoreUtils,
      GlvUtils: glvUtils,
      GlvDepositStoreUtils: glvDepositStoreUtils,
      GlvShiftStoreUtils: glvShiftStoreUtils,
      GlvWithdrawalStoreUtils: glvWithdrawalStoreUtils,
      MarketStoreUtils: marketStoreUtils,
      MarketUtils: marketUtils
    }
});

// * contracts/ExchangeRouter/contracts/market/MarketUtils.sol:MarketUtils


  // Фабрика GLV

  const glvFactory = m.contract("GlvFactory", [
    roleStore,
    dataStore,
    eventEmitter
  ], {libraries: {
    GlvStoreUtils: glvStoreUtils
  }, after: []});

  const glvDepositEventUtils = m.library("GlvDepositEventUtils", {
    after: []
  });

  const glvShiftEventUtils = m.library("GlvShiftEventUtils", {
    after: []
  });

  const glvWithdrawalEventUtils = m.library("GlvWithdrawalEventUtils", {
    after: []
  });

  const glvDepositUtils = m.library("GlvDepositUtils", {
    libraries: {
      DepositEventUtils: depositEventUtils,
      ExecuteDepositUtils: executeDepositUtils,
      GasUtils: gasUtils,
      GlvUtils: glvUtils,
      GlvDepositEventUtils: glvDepositEventUtils,
      GlvDepositStoreUtils: glvDepositStoreUtils,
      MarketStoreUtils: marketStoreUtils,
      MarketUtils: marketUtils
    },
    after: []});
    // * contracts/ExchangeRouter/contracts/deposit/DepositEventUtils.sol:DepositEventUtils
    // * contracts/ExchangeRouter/contracts/deposit/ExecuteDepositUtils.sol:ExecuteDepositUtils
    // * contracts/ExchangeRouter/contracts/gas/GasUtils.sol:GasUtils
    // * contracts/ExchangeRouter/contracts/glv/GlvUtils.sol:GlvUtils
    // * contracts/ExchangeRouter/contracts/glv/glvDeposit/GlvDepositEventUtils.sol:GlvDepositEventUtils
    // * contracts/ExchangeRouter/contracts/glv/glvDeposit/GlvDepositStoreUtils.sol:GlvDepositStoreUtils
    // * contracts/ExchangeRouter/contracts/market/MarketStoreUtils.sol:MarketStoreUtils
    // * contracts/ExchangeRouter/contracts/market/MarketUtils.sol:MarketUtils


  const glvShiftUtils = m.library("GlvShiftUtils", {
    libraries: {
      GlvUtils: glvUtils,
      GlvShiftEventUtils: glvShiftEventUtils,
      GlvShiftStoreUtils: glvShiftStoreUtils,
      MarketStoreUtils: marketStoreUtils,
      MarketUtils: marketUtils,
      ShiftEventUtils: shiftEventUtils,
      ShiftUtils: shiftUtils
    },
    after: []});
  const glvWithdrawalUtils = m.library("GlvWithdrawalUtils", {
    libraries: {
      GasUtils: gasUtils,
      GlvUtils: glvUtils,
      GlvWithdrawalEventUtils: glvWithdrawalEventUtils,
      GlvWithdrawalStoreUtils: glvWithdrawalStoreUtils,
      MarketStoreUtils: marketStoreUtils,
      MarketUtils: marketUtils,
      ExecuteWithdrawalUtils: executeWithdrawalUtils,
      WithdrawalEventUtils: withdrawalEventUtils
    },
    after: []});



  const glvHandler = m.contract("GlvHandler", [
    roleStore,
    dataStore,
    eventEmitter,
    oracle,
    glvVault,
    shiftVault
  ], {
    after: [glvFactory],
    libraries: {
      GlvDepositStoreUtils: glvDepositStoreUtils,
      GlvWithdrawalStoreUtils: glvWithdrawalStoreUtils,
      GlvShiftStoreUtils: glvShiftStoreUtils,
      GlvUtils: glvUtils,
      GlvDepositUtils: glvDepositUtils,
      GlvShiftUtils: glvShiftUtils,
      GlvWithdrawalUtils: glvWithdrawalUtils
    }
  });

//   * contracts/ExchangeRouter/contracts/glv/GlvUtils.sol:GlvUtils
// * contracts/ExchangeRouter/contracts/glv/glvDeposit/GlvDepositUtils.sol:GlvDepositUtils
// * contracts/ExchangeRouter/contracts/glv/glvShift/GlvShiftUtils.sol:GlvShiftUtils
// * contracts/ExchangeRouter/contracts/glv/glvWithdrawal/GlvWithdrawalUtils.sol:GlvWithdrawalUtils

  // Маршрутизатор GLV операций
  const glvRouter: any = m.contract("GlvRouter", [
    router,
    roleStore,
    dataStore,
    eventEmitter,
    glvHandler,
    externalHandler
  ], {libraries: {
    GlvDepositStoreUtils: glvDepositStoreUtils,
    GlvWithdrawalStoreUtils: glvWithdrawalStoreUtils
  }, after: []});

  // Базовые утилиты для работы с ордерами
  const baseOrderUtils = m.contract("BaseOrderUtils", [], {
    after: [glvRouter],
  });



  // RoleStore _roleStore,
  // DataStore _dataStore,
  // EventEmitter _eventEmitter,
  // Oracle _oracle,
  // OrderVault _orderVault,
  // SwapHandler _swapHandler,
  // IReferralStorage _referralStorage

  const liquidationUtils = m.library("LiquidationUtils", {
    libraries: {
      OrderEventUtils: orderEventUtils,
      OrderStoreUtils: orderStoreUtils,
      PositionStoreUtils: positionStoreUtils
    },
    after: [],
  });

  // * contracts/ExchangeRouter/contracts/order/OrderEventUtils.sol:OrderEventUtils
  // * contracts/ExchangeRouter/contracts/order/OrderStoreUtils.sol:OrderStoreUtils
  // * contracts/ExchangeRouter/contracts/position/PositionStoreUtils.sol:PositionStoreUtils

  // Обработчик ликвидаций
  const liquidationHandler = m.contract("LiquidationHandler", [
    roleStore,
    dataStore,
    eventEmitter,
    oracle,
    orderVault,
    swapHandler,
    referralStorage
  ], {libraries: {
    LiquidationUtils: liquidationUtils,
    MarketStoreUtils: marketStoreUtils,
    ExecuteOrderUtils: executeOrderUtils,
    OrderStoreUtils: orderStoreUtils
  }, after: [glvRouter]});

  const adlUtils = m.library("AdlUtils", {
    libraries: {
      MarketStoreUtils: marketStoreUtils,
      OrderEventUtils: orderEventUtils,
      OrderStoreUtils: orderStoreUtils,
      PositionStoreUtils: positionStoreUtils
    },
    after: [],
  });

//   * contracts/ExchangeRouter/contracts/market/MarketStoreUtils.sol:MarketStoreUtils
// * contracts/ExchangeRouter/contracts/order/OrderEventUtils.sol:OrderEventUtils
// * contracts/ExchangeRouter/contracts/order/OrderStoreUtils.sol:OrderStoreUtils
// * contracts/ExchangeRouter/contracts/position/PositionStoreUtils.sol:PositionStoreUtils

  // Обработчик ADL (Auto-Deleveraging)
  const adlHandler = m.contract("AdlHandler", [
    roleStore,
    dataStore,
    eventEmitter,
    oracle,
    orderVault,
    swapHandler,
    referralStorage
  ], {libraries: {
    AdlUtils: adlUtils,
    MarketStoreUtils: marketStoreUtils,
    ExecuteOrderUtils: executeOrderUtils,
    OrderStoreUtils: orderStoreUtils
  }, after: [glvRouter]});

  // Router _router,
  // RoleStore _roleStore,
  // DataStore _dataStore,
  // EventEmitter _eventEmitter,
  // IOrderHandler _orderHandler,
  // OrderVault _orderVault

  const subaccountRouter = m.contract("SubaccountRouter", [
    router,
    roleStore,
    dataStore,
    eventEmitter,
    orderHandler,
    orderVault
  ], {libraries: {
    OrderStoreUtils: orderStoreUtils
  }, after: [glvRouter]});
  
  // Провайдер оракула для GM токенов
  const gmOracleProvider = m.contract("GmOracleProvider", [
    roleStore,
    dataStore,
    oracleStore
  ], {after: [glvRouter]});
  
  // Провайдер цен Chainlink
  const chainlinkPriceFeedProvider = m.contract("ChainlinkPriceFeedProvider", [
    dataStore
  ], {after: [glvRouter]});

  // DataStore _dataStore,
  // address _oracle,
  // IChainlinkDataStreamVerifier _verifier

  const chainlinkDataStreamVerifier = m.contract("MockDataStreamVerifier", [], {
    after: [],
  });
  
  // Провайдер потока данных Chainlink
  const chainlinkDataStreamProvider = m.contract("ChainlinkDataStreamProvider", [
    dataStore,
    oracle,
    chainlinkDataStreamVerifier
  ], {after: [glvRouter]});
  
  // Хранилище реферальной системы
  // const referralStorage = m.contract("ReferralStorage", [
  //   roleStore
  // ], {
  //   after: [glvRouter],
  //   libraries: {
  //     ReferralUtils: referralUtils,
  //     ReferralEventUtils: referralEventUtils
  //   }
  // });
  // RoleStore _roleStore,
  // Oracle _oracle,
  // DataStore _dataStore,
  // EventEmitter _eventEmitter,
  // IVaultV1 _vaultV1,
  // address _gmx

  const vaultV1 = m.contract("MockVaultV1", [
    "0x0000000000000000000000000000000000000001" // gov
  ], {after: []});
  // Обработчик комиссий
  const feeHandler = m.contract("FeeHandler", [
    roleStore,  
    oracle,
    dataStore,
    eventEmitter,
    vaultV1,
    "0x0000000000000000000000000000000000000001" // gmx
  ], {
    libraries: {
      MarketUtils: marketUtils
    },
    after: [glvRouter],
  });
  
  // // Мок старой версии хранилища для тестирования
  // const mockVaultV1 = m.contract("MockVaultV1", [
  //   roleStore,
  //   dataStore
  // ], {after: [glvRouter]});
  const marketFactory = m.contract("MarketFactory", [
    roleStore,
    dataStore,
    eventEmitter
  ], {
    libraries: {
      MarketStoreUtils: marketStoreUtils
    },
    after: [glvRouter]}); 

    return {
      config,
      configSyncer,
      // mockRiskOracle,
      timelock,
      reader,
      glvReader,
      shiftVault,
      oracleStore,
      orderVault,
      glvVault,
      marketFactory,
      glvFactory,
      glvHandler,
      glvRouter,
      glvDepositStoreUtils,
      glvWithdrawalStoreUtils,
      glvShiftStoreUtils,
      glvStoreUtils,
      baseOrderUtils,
      liquidationHandler,
      adlHandler,
      subaccountRouter,
      gmOracleProvider,
      chainlinkPriceFeedProvider,
      chainlinkDataStreamProvider,
      referralStorage,
      feeHandler
      // mockVaultV1
      };
});

export default AddResearchModule;

//! npx hardhat ignition deploy ignition/modules/addResearch.ts --network localhost > outputDeploy.log 2>&1
    