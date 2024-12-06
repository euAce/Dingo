// modules/LibrariesModule.ts
import { buildModule } from "@nomicfoundation/hardhat-ignition/modules";
import RoleAndDataStoresModule from "./roleAndDataStores";


export default buildModule("LibrariesModule2", (m) => {
  // Базовые утилиты

  // const roleStore = m.contract("RoleStore", []);
    
  // const dataStore = m.contract("DataStore", [
  //     roleStore
  // ], {after: [roleStore]});

  const { roleStore, dataStore } = m.useModule(RoleAndDataStoresModule);

  const calc = m.library("Calc");  
  const precision = m.library("Precision", {after: [calc]});
  const eventUtils = m.library("EventUtils", {after: [precision]});
  const errorUtils = m.library("ErrorUtils", {after: [eventUtils]});
  const keys = m.library("Keys", {after: [errorUtils]});
  const gasUtils = m.library("GasUtils", {after: [keys]});

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

  const decreasePositionSwapUtils = m.library("DecreasePositionSwapUtils", {
    libraries: {
        // MarketUtils: marketUtils,
        // PositionUtils: positionUtils,
        // SwapUtils: swapUtils, 
        // FeeUtils: feeUtils,
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
      
    }, after: [marketEventUtils] 
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
    positionEventUtils
  } as const;
});



// npx hardhat ignition deploy ignition/modules/LibrariesModule4.ts --network localhost