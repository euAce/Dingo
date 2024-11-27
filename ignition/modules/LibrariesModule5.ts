import { buildModule } from "@nomicfoundation/hardhat-ignition/modules";
import LibrariesModule from "./LibrariesModule4";
import LibrariesModule3 from "./LibrariesModule3";


export default buildModule("LibrariesModule5", (m) => {

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
        executeOrderUtils } = m.useModule(LibrariesModule3);


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

//   npx hardhat ignition deploy ignition/modules/LibrariesModule5.ts --network localhost