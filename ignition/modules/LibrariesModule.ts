// modules/LibrariesModule.ts
import { buildModule } from "@nomicfoundation/hardhat-ignition/modules";

export default buildModule("LibrariesModule", (m) => {
  // Базовые утилиты
  const calc = m.library("Calc");
  const precision = m.library("Precision");
  const marketUtils = m.library("MarketUtils");
  const pricingUtils = m.library("PricingUtils");
  const positionUtils = m.library("PositionUtils");
  const positionPricingUtils = m.library("PositionPricingUtils");
  const referralUtils = m.library("ReferralUtils");
  const eventUtils = m.library("EventUtils");
  const errorUtils = m.library("ErrorUtils");
  const keys = m.library("Keys");

  // Deposit утилиты
  const depositStoreUtils = m.library("DepositStoreUtils");
  const depositUtils = m.library("DepositUtils");
  const executeDepositUtils = m.library("ExecuteDepositUtils");

  // Withdrawal утилиты
  const withdrawalStoreUtils = m.library("WithdrawalStoreUtils");
  const withdrawalUtils = m.library("WithdrawalUtils");
  const executeWithdrawalUtils = m.library("ExecuteWithdrawalUtils");

  // Order утилиты
  const orderStoreUtils = m.library("OrderStoreUtils");
  const orderUtils = m.library("OrderUtils");
  const executeOrderUtils = m.library("ExecuteOrderUtils");
  const increaseOrderUtils = m.library("IncreaseOrderUtils");
  const decreaseOrderUtils = m.library("DecreaseOrderUtils");
  const swapOrderUtils = m.library("SwapOrderUtils");

  // Swap утилиты
  const swapUtils = m.library("SwapUtils");
  const swapPricingUtils = m.library("SwapPricingUtils");

  // Bank утилиты
  const gasUtils = m.library("GasUtils");

  // Exchange утилиты
//   const exchangeUtils = m.library("ExchangeUtils");

  return {
    // Базовые утилиты
    calc,
    precision,
    marketUtils,
    pricingUtils,
    positionUtils,
    positionPricingUtils,
    referralUtils,
    eventUtils,
    errorUtils,
    keys,

    // Deposit утилиты
    depositStoreUtils,
    depositUtils,
    executeDepositUtils,

    // Withdrawal утилиты
    withdrawalStoreUtils,
    withdrawalUtils,
    executeWithdrawalUtils,

    // Order утилиты
    orderStoreUtils,
    orderUtils,
    executeOrderUtils,
    increaseOrderUtils,
    decreaseOrderUtils,
    swapOrderUtils,

    // Swap утилиты
    swapUtils,
    swapPricingUtils,

    // Gas утилиты
    gasUtils

    // Exchange утилиты
    // exchangeUtils
  };
});


// npx hardhat ignition deploy ignition/modules/LibrariesModule.ts --network localhost