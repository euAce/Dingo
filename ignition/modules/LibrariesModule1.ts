// modules/LibrariesModule.ts
import { buildModule } from "@nomicfoundation/hardhat-ignition/modules";

export default buildModule("LibrariesModule", (m) => {
  // Базовые утилиты
  const calc = m.library("Calc");
  const precision = m.library("Precision");
  const eventUtils = m.library("EventUtils");
  const errorUtils = m.library("ErrorUtils");
  const keys = m.library("Keys");
  const gasUtils = m.library("GasUtils");
//   const feeUtils = m.library("FeeUtils", {
//     libraries: {
//         MarketUtils: marketUtils
//     }
//   });

  // Market утилиты
  const marketEventUtils = m.library("MarketEventUtils");
  const marketStoreUtils = m.library("MarketStoreUtils");
  
  // Swap утилиты (перемещены вверх)
  const swapPricingUtils = m.library("SwapPricingUtils");
  
  const marketUtils = m.library("MarketUtils", {
    libraries: {
      MarketEventUtils: marketEventUtils,
      MarketStoreUtils: marketStoreUtils
    }
  });

  const feeUtils = m.library("FeeUtils", {
    libraries: {
        MarketUtils: marketUtils
    }
  });

  const swapUtils = m.library("SwapUtils", {
    libraries: {
      FeeUtils: feeUtils,
      MarketEventUtils: marketEventUtils,
      SwapPricingUtils: swapPricingUtils
    }
  });
  const swapOrderUtils = m.library("SwapOrderUtils", {
    libraries: {
      SwapUtils: swapUtils
    }
  });

  

  // Position утилиты
  const positionStoreUtils = m.library("PositionStoreUtils");
  const positionEventUtils = m.library("PositionEventUtils");

  const positionUtils = m.library("PositionUtils", {
    libraries: {
      MarketStoreUtils: marketStoreUtils,
      MarketUtils: marketUtils
    }
  });
  const referralEventUtils = m.library("ReferralEventUtils");


  const increasePositionUtils = m.library("IncreasePositionUtils", {
    libraries: {
        FeeUtils: feeUtils,
        MarketEventUtils: marketEventUtils,
        MarketUtils: marketUtils,
        PositionEventUtils: positionEventUtils,
        PositionStoreUtils: positionStoreUtils,
        PositionUtils: positionUtils,
        ReferralEventUtils: referralEventUtils
    }   
  });

  const orderEventUtils = m.library("OrderEventUtils");

//   import "../../@openzeppelin/contracts/utils/math/SafeCast.sol";

// import "../utils/Precision.sol";

// import "./Position.sol";

// import "../data/DataStore.sol";
// import "../data/Keys.sol";

// import "../pricing/PositionPricingUtils.sol";
// import "../order/BaseOrderUtils.sol";

  const decreasePositionSwapUtils = m.library("DecreasePositionSwapUtils", {
    libraries: {
        // MarketUtils: marketUtils,
        // PositionUtils: positionUtils,
        // SwapUtils: swapUtils, 
        // FeeUtils: feeUtils,
        // PositionUtils: positionUtils,
        // MarketEventUtils: marketEventUtils,
        // Position: position,
        // PositionEventUtils: positionEventUtils,
        // ReferralEventUtils: referralEventUtils,
        // SwapPricingUtils: swapPricingUtils
    }
  });

  const decreasePositionCollateralUtils = m.library("DecreasePositionCollateralUtils", {
    libraries: {
      PositionUtils: positionUtils,
    //   SwapUtils: swapUtils,
      FeeUtils: feeUtils,
      MarketEventUtils: marketEventUtils,
      PositionEventUtils: positionEventUtils,
      OrderEventUtils: orderEventUtils,
      DecreasePositionSwapUtils: decreasePositionSwapUtils
    //   ReferralEventUtils: referralEventUtils
    }
  });
  
  const decreasePositionUtils = m.library("DecreasePositionUtils", {
    libraries: {
      MarketEventUtils: marketEventUtils,
      MarketUtils: marketUtils, 
      OrderEventUtils: orderEventUtils,
      DecreasePositionCollateralUtils: decreasePositionCollateralUtils,
      DecreasePositionSwapUtils: decreasePositionSwapUtils,
      PositionEventUtils: positionEventUtils,
      PositionStoreUtils: positionStoreUtils,
      PositionUtils: positionUtils,
      ReferralEventUtils: referralEventUtils
    }
  });

  const positionPricingUtils = m.library("PositionPricingUtils");

  // Increase/Decrease Order утилиты (перемещены после базовых зависимостей)
  const increaseOrderUtils = m.library("IncreaseOrderUtils", {
    libraries: {
      IncreasePositionUtils: increasePositionUtils,
      PositionStoreUtils: positionStoreUtils,
      SwapUtils: swapUtils
    }
  });
  const decreaseOrderUtils = m.library("DecreaseOrderUtils", {
    libraries: {
      DecreasePositionUtils: decreasePositionUtils,
      PositionStoreUtils: positionStoreUtils
    }
  });

  // Referral утилиты
  const referralUtils = m.library("ReferralUtils", {
    libraries: {
      MarketUtils: marketUtils,
      ReferralEventUtils: referralEventUtils
    }
  });

  // Deposit утилиты
  const depositEventUtils = m.library("DepositEventUtils");
  const depositStoreUtils = m.library("DepositStoreUtils");
  const depositUtils = m.library("DepositUtils", {
    libraries: {
      DepositEventUtils: depositEventUtils,
      DepositStoreUtils: depositStoreUtils,
      GasUtils: gasUtils,
      MarketStoreUtils: marketStoreUtils
    }
  });
  const executeDepositUtils = m.library("ExecuteDepositUtils", {
    libraries: {
      DepositEventUtils: depositEventUtils,
      DepositStoreUtils: depositStoreUtils,
      FeeUtils: feeUtils,
      GasUtils: gasUtils,
      MarketEventUtils: marketEventUtils,
      MarketStoreUtils: marketStoreUtils,
      MarketUtils: marketUtils,
      PositionUtils: positionUtils,
      SwapPricingUtils: swapPricingUtils,
      SwapUtils: swapUtils
    }
  });

  // Withdrawal утилиты
  const withdrawalEventUtils = m.library("WithdrawalEventUtils");
  const withdrawalStoreUtils = m.library("WithdrawalStoreUtils");
  const withdrawalUtils = m.library("WithdrawalUtils", {
    libraries: {
      GasUtils: gasUtils,
      MarketStoreUtils: marketStoreUtils,
      WithdrawalEventUtils: withdrawalEventUtils,
      WithdrawalStoreUtils: withdrawalStoreUtils
    }
  });
  const executeWithdrawalUtils = m.library("ExecuteWithdrawalUtils", {
    libraries: {
      FeeUtils: feeUtils,
      GasUtils: gasUtils,
      MarketEventUtils: marketEventUtils,
      MarketStoreUtils: marketStoreUtils,
      MarketUtils: marketUtils,
      PositionUtils: positionUtils,
      SwapPricingUtils: swapPricingUtils,
      SwapUtils: swapUtils,
      WithdrawalEventUtils: withdrawalEventUtils,
      WithdrawalStoreUtils: withdrawalStoreUtils
    }
  });

  // Order утилиты
  const orderStoreUtils = m.library("OrderStoreUtils");
  const orderUtils = m.library("OrderUtils", {
    libraries: {
      GasUtils: gasUtils,
      MarketStoreUtils: marketStoreUtils,
      OrderEventUtils: orderEventUtils,
      OrderStoreUtils: orderStoreUtils
    }
  });
  const executeOrderUtils = m.library("ExecuteOrderUtils", {
    libraries: {
      GasUtils: gasUtils,
      MarketUtils: marketUtils,
      DecreaseOrderUtils: decreaseOrderUtils,
      IncreaseOrderUtils: increaseOrderUtils,
      OrderEventUtils: orderEventUtils,
      OrderStoreUtils: orderStoreUtils,
      SwapOrderUtils: swapOrderUtils,
      PositionUtils: positionUtils
    }
  });

  return {
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
    positionPricingUtils,
    increasePositionUtils,
    decreasePositionUtils,
    swapPricingUtils,
    swapUtils,
    swapOrderUtils,
    increaseOrderUtils,
    decreaseOrderUtils,
    depositEventUtils,
    depositStoreUtils,
    depositUtils,
    executeDepositUtils,
    withdrawalEventUtils,
    withdrawalStoreUtils,
    withdrawalUtils,
    executeWithdrawalUtils,
    orderEventUtils,
    orderStoreUtils,
    orderUtils,
    executeOrderUtils,
    referralEventUtils,
    referralUtils
  };
});


// npx hardhat ignition deploy ignition/modules/LibrariesModule1.ts --network localhost