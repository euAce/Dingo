import { buildModule } from "@nomicfoundation/hardhat-ignition/modules";
import LibrariesModule from "./LibrariesModule4";

export default buildModule("LibrariesModule3", (m) => {

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
      positionEventUtils
    } =  m.useModule(LibrariesModule);


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

    const callbackUtils =  m.library("CallbackUtils");
    const shiftStoreUtils =  m.library("ShiftStoreUtils");
    const shiftEventUtils =  m.library("ShiftEventUtils");
    const shiftUtils =  m.library("ShiftUtils", {
        libraries: {
            DepositEventUtils: depositEventUtils,
            ExecuteDepositUtils: executeDepositUtils,
            GasUtils: gasUtils,
            MarketStoreUtils: marketStoreUtils,
            ShiftEventUtils: shiftEventUtils,
            ShiftStoreUtils: shiftStoreUtils,
            ExecuteWithdrawalUtils: executeWithdrawalUtils,
            WithdrawalEventUtils: withdrawalEventUtils
        }
    });


    return { 
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
    };
});


// npx hardhat ignition deploy ignition/modules/LibrariesModule3.ts --network localhost
