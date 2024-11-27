// modules/LibrariesModule.ts
import { buildModule } from "@nomicfoundation/hardhat-ignition/modules";


export default buildModule("LibrariesModule2", (m) => {
  // Базовые утилиты

  const roleStore = m.contract("RoleStore", []);
    
  const dataStore = m.contract("DataStore", [
      roleStore
  ], {after: [roleStore]});
  const calc = m.library("Calc");  
  const precision = m.library("Precision", {after: [calc]});
  const eventUtils = m.library("EventUtils", {after: [precision]});
  const errorUtils = m.library("ErrorUtils", {after: [eventUtils]});
  const keys = m.library("Keys", {after: [errorUtils]});
  const gasUtils = m.library("GasUtils", {after: [keys]});
//     //   const feeUtils = m.library("FeeUtils", {
// //     libraries: {
// //         MarketUtils: marketUtils
// //     }
// //   });

//   // Market утилиты
  const marketEventUtils = m.library("MarketEventUtils", {after: [gasUtils]});
  const marketStoreUtils = m.library("MarketStoreUtils", {after: [marketEventUtils]});
  
  // Swap утилиты (перемещены вверх)
  const swapPricingUtils = m.library("SwapPricingUtils", {after: [marketStoreUtils]});
  
  const marketUtils = m.library("MarketUtils", {
    libraries: {
      MarketEventUtils: marketEventUtils,
      MarketStoreUtils: marketStoreUtils
    }, after: [marketStoreUtils]
  });

  const feeUtils = m.library("FeeUtils", {
    libraries: {
        MarketUtils: marketUtils
    }, after: [marketUtils]
  });

  const swapUtils = m.library("SwapUtils", {
    libraries: {
      FeeUtils: feeUtils,
      MarketEventUtils: marketEventUtils,
      SwapPricingUtils: swapPricingUtils
    }, after: [marketEventUtils]
  });
  const swapOrderUtils = m.library("SwapOrderUtils", {
    libraries: {
      SwapUtils: swapUtils
    }, after: [swapUtils]
  });

  

  // Position утилиты
  const positionStoreUtils = m.library("PositionStoreUtils", {after: [marketUtils]});
  const positionEventUtils = m.library("PositionEventUtils", {after: [positionStoreUtils]});

  const positionUtils = m.library("PositionUtils", {
    libraries: {
      MarketStoreUtils: marketStoreUtils,
      MarketUtils: marketUtils
    }, after: [marketUtils]
  });
  const referralEventUtils = m.library("ReferralEventUtils", {after: [positionUtils]});


  const increasePositionUtils = m.library("IncreasePositionUtils", {
    libraries: {
        FeeUtils: feeUtils,
        MarketEventUtils: marketEventUtils,
        MarketUtils: marketUtils,
        PositionEventUtils: positionEventUtils,
        PositionStoreUtils: positionStoreUtils,
        PositionUtils: positionUtils,
        ReferralEventUtils: referralEventUtils
    }, after: [marketEventUtils]
  });

  const orderEventUtils = m.library("OrderEventUtils", {after: [positionUtils]});

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
    }, after: [marketEventUtils]
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
    }, after: [marketEventUtils] 
  });
  
  
// return {
  //     calc } as const;
    // });
return {
  roleStore,
  dataStore,
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
    // positionPricingUtils,
    increasePositionUtils,
    // decreasePositionUtils,
    swapPricingUtils,
    swapUtils,
    swapOrderUtils,
    
    orderEventUtils,
    // orderStoreUtils,
    // orderUtils,
    // executeOrderUtils,
    referralEventUtils,
    // referralUtils
    decreasePositionCollateralUtils,
    decreasePositionSwapUtils,
    positionEventUtils
  } as const;
});



// npx hardhat ignition deploy ignition/modules/LibrariesModule2.ts --network localhost