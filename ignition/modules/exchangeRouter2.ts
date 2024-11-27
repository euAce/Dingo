// ignition/modules/exchangeRouterDeploy.ts
import { buildModule } from "@nomicfoundation/hardhat-ignition/modules";
import LibrariesModule3 from "./LibrariesModule3";
import LibrariesModule4 from "./LibrariesModule4";
import AccessControlledAggregatorDeployment from "./DeployAggregator";
import { ethers } from "hardhat";


const ExchangeRouterModule = buildModule("ExchangeRouterModule", (m) => {
    const owner = m.getAccount(0);
    
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

    // const {
    //     requesterAccessController,
    //     billingAccessController,
    //     linkToken,
    //     aggregator
    // } = m.useModule(AccessControlledAggregatorDeployment);

    // Базовые контракты
    const eventEmitter = m.contract("EventEmitter", [
        roleStore
    ], {after: [roleStore]});

    const sequencerUptimeFeed = m.contractAt("AggregatorV2V3Interface", "0x712516e61C8B383dF4A63CFe83d7701Bce54B03e", {}); 

    const oracle = m.contract("Oracle", [
        roleStore,
        dataStore,
        eventEmitter,
        sequencerUptimeFeed
    ], {after: [dataStore]});

    // Вспомогательные контракты
    const depositVault = m.contract("DepositVault", [
        roleStore,
        dataStore
    ], {after: [oracle]});

    const withdrawalVault = m.contract("WithdrawalVault", [
        roleStore,
        dataStore
    ], {after: [depositVault]});

    // Router с необходимыми параметрами
    const router = m.contract("Router", [
        roleStore
    ], {after: [oracle]});

    // Хендлеры с обновленными параметрами
    const depositHandler = m.contract("DepositHandler", [
        roleStore,
        dataStore,
        eventEmitter,
        oracle,
        depositVault
    ], {
        libraries: {
            DepositStoreUtils: depositStoreUtils,
            DepositUtils: depositUtils,
            ExecuteDepositUtils: executeDepositUtils
        },
        after: [router]
    });

    const withdrawalHandler = m.contract("WithdrawalHandler", [
        roleStore,
        dataStore,
        eventEmitter,
        oracle,
        withdrawalVault
    ], {
        libraries: {
            WithdrawalStoreUtils: withdrawalStoreUtils,
            WithdrawalUtils: withdrawalUtils,
            ExecuteWithdrawalUtils: executeWithdrawalUtils
        },
        after: [depositHandler]
    });

    // Хранилище ордеров
    const orderVault = m.contract("OrderVault", [
        roleStore,
        dataStore
    ], {after: [withdrawalVault]});

    const swapHandler = m.contract("SwapHandler", [
        roleStore
    ], {
        libraries: {
            SwapUtils: swapUtils
        },
        after: [orderVault]
    });

    // Деплой ReferralStorage
    // @desc Контракт для хранения реферальной информации
    const referralStorage = m.contract("ReferralStorage", [], {after: [swapHandler]});

    // Настройка начальных значений для реферальной системы
    m.call(referralStorage, "setTier", [
        0, // _tierId - базовый уровень
        1000, // _totalRebate - 10% общий рибейт
        5000 // _discountShare - 50% доля трейдера
    ]);

    // Предоставление прав на управление реферальной системой
    m.call(roleStore, "grantRole", [
        referralStorage,
        "0x97adf037b2472f4a6a9825eff7d2dd45e37f2dc308df2a260d6a72af4189a65b"
    ], {id: "referralStorageGrantRole"});
    
    m.call(roleStore, "grantRole", [
        owner,
        "0x97adf037b2472f4a6a9825eff7d2dd45e37f2dc308df2a260d6a72af4189a65b"
    ], {id: "ownerGrantRole"});

    const orderHandler = m.contract("OrderHandler", [
        roleStore,
        dataStore,
        eventEmitter,
        oracle,
        orderVault,
        swapHandler,
        referralStorage
    ], {libraries: {
            MarketStoreUtils: marketStoreUtils,
            ExecuteOrderUtils: executeOrderUtils,
            OrderEventUtils: orderEventUtils,
            OrderStoreUtils: orderStoreUtils,
            OrderUtils: orderUtils
    }, after: [referralStorage]});

    const shiftVault = m.contract("ShiftVault", [
        roleStore,
        dataStore
    ], {after: [orderHandler]});

    const shiftHandler = m.contract("ShiftHandler", [
        roleStore,
        dataStore,
        eventEmitter,
        oracle,
        shiftVault
    ], {libraries: {
        ShiftStoreUtils: shiftStoreUtils,
        ShiftUtils: shiftUtils 
    }, after: [shiftVault]});


    const externalHandler = m.contract("ExternalHandler", [], {after: [shiftHandler]}); 

    // ExchangeRouter с обновленными параметрами
    const exchangeRouter = m.contract("ExchangeRouter", [
        router,
        roleStore,
        dataStore,
        eventEmitter,
        depositHandler,
        withdrawalHandler,
        shiftHandler,
        orderHandler,
        externalHandler
    ], {libraries: {
            CallbackUtils: callbackUtils,
            DepositStoreUtils: depositStoreUtils,
            FeeUtils: feeUtils,
            MarketEventUtils: marketEventUtils,
            MarketStoreUtils: marketStoreUtils,
            OrderStoreUtils: orderStoreUtils,
            ReferralUtils: referralUtils,
            ShiftStoreUtils: shiftStoreUtils,
            WithdrawalStoreUtils: withdrawalStoreUtils            
    }, id: "ExchangeRouterDeploy", after: [externalHandler]});

    // // Настройка ролей
    m.call(roleStore, "grantRole", [
        exchangeRouter,
        "0x97adf037b2472f4a6a9825eff7d2dd45e37f2dc308df2a260d6a72af4189a65b",
    ], {id: "exchangeRouterGrantRole"});

    // Инициализация в DataStore
    m.call(dataStore, "setAddress", [
        ethers.solidityPackedKeccak256(
            ["string"],
            ["exchangeRouter"]
        ),
        exchangeRouter
    ]);

    // Настройка ролей для Oracle
    m.call(roleStore, "grantRole", [
        oracle,
        "0x97adf037b2472f4a6a9825eff7d2dd45e37f2dc308df2a260d6a72af4189a65b"
    ], {id: "oracleGrantRole"});

    // m.call(roleStore, "grantRole", [
    //     "ORACLE_KEEPER",
    //     owner // или специальный адрес oracle keeper
    // ]);

    return {
        roleStore,
        dataStore,
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
    };
});

export default ExchangeRouterModule;

// npx hardhat ignition deploy ignition/modules/exchangeRouter2.ts --network localhost
// cd C:\Users\Arwielao\Solidity\team4\repository_gmx\aggregatorDeploy 
// npx hardhat ignition deploy ignition/modules/DeployAggregator.ts --network localhost