import { calculateCreate2 } from "eth-create2-calculator";
import { expandDecimals } from "./math";
import { hashData, hashString } from "./hash";
import { poolAmountKey, swapImpactPoolAmountKey } from "./keys";
import * as keys from "./keys";

interface DataStore {
  getAddressCount: (key: string) => Promise<number>;
  getAddressValuesAt: (key: string, start: number, end: number) => Promise<string[]>;
  getUint: (key: string) => Promise<number>;
}

// import MarketTokenArtifact from "../artifacts/contracts/market/MarketToken.sol/MarketToken.json";
// import MarketTokenArtifact from "../ignition/deployments/chain-31337/artifacts/TokensDeployment#MarketToken.json";
import MarketTokenArtifact from "../artifacts/contracts/ExchangeRouter/contracts/market/MarketToken.sol/MarketToken.json";
import { ethers } from "ethers";

export const DEFAULT_MARKET_TYPE = hashString("basic-v1");

export function getMarketCount(dataStore: DataStore) {
  return dataStore.getAddressCount(keys.MARKET_LIST);
}

export function getMarketKeys(dataStore: DataStore, start: number, end: number) {
  return dataStore.getAddressValuesAt(keys.MARKET_LIST, start, end);
}

export async function getPoolAmount(dataStore: DataStore, market: string, token: string) {
  const key = poolAmountKey(market, token);
  return await dataStore.getUint(key);
}

export async function getSwapImpactPoolAmount(dataStore: DataStore, market: string, token: string) {
  const key = swapImpactPoolAmountKey(market, token);
  return await dataStore.getUint(key);
}

export async function getMarketTokenPrice(fixture: any, overrides: any = {}) {
  return (await getMarketTokenPriceWithPoolValue(fixture, overrides))[0];
}

export async function getMarketTokenPriceWithPoolValue(fixture: any, overrides: any = {}) {
  const { reader, dataStore, ethUsdMarket } = fixture.contracts;
  const market = overrides.market || ethUsdMarket;
  const pnlFactorType = overrides.pnlFactorType || keys.MAX_PNL_FACTOR_FOR_TRADERS;

  const overridePrices = overrides.prices || {};

  const indexTokenPrice = overridePrices.indexTokenPrice || {
    min: expandDecimals(5000, 4 + 8),
    max: expandDecimals(5000, 4 + 8),
  };

  const longTokenPrice = overridePrices.longTokenPrice || {
    min: expandDecimals(5000, 4 + 8),
    max: expandDecimals(5000, 4 + 8),
  };

  const shortTokenPrice = overridePrices.shortTokenPrice || {
    min: expandDecimals(1, 6 + 18),
    max: expandDecimals(1, 6 + 18),
  };

  const maximize = overrides.maximize === undefined ? true : overrides.maximize;

  return await reader.getMarketTokenPrice(
    dataStore.address,
    market,
    indexTokenPrice,
    longTokenPrice,
    shortTokenPrice,
    pnlFactorType,
    maximize
  );
}

export function getMarketTokenAddress(
  indexToken: string,
  longToken: string,
  shortToken: string,
  marketType: string,
  marketFactoryAddress: string,
  roleStoreAddress: string,
  dataStoreAddress: string
) {
  const salt = hashData(
    ["string", "address", "address", "address", "bytes32"],
    ["GMX_MARKET", indexToken, longToken, shortToken, marketType]
  );
  console.log("salt ==========>", salt);
  const byteCode = MarketTokenArtifact.bytecode;
  console.log("byteCode ==========>", byteCode);
  return calculateCreate2(marketFactoryAddress, salt, byteCode, {
    params: [roleStoreAddress, dataStoreAddress],
    types: ["address", "address"],
  });
}

export function getMarketKey(indexToken: string, longToken: string, shortToken: string) {
  return [indexToken, longToken, shortToken].join(":");
}

export function createMarketConfigByKey({ marketConfigs, tokens }: { marketConfigs: any, tokens: any }) {
  const marketConfigByKey: Record<string, any> = {};

  for (const marketConfig of marketConfigs) {
    const [indexToken, longToken, shortToken] = getMarketTokenAddresses(marketConfig, tokens);
    const marketKey: string = getMarketKey(indexToken, longToken, shortToken);
    marketConfigByKey[marketKey] = marketConfig;
  }

  return marketConfigByKey;
}

export async function getOnchainMarkets(
  read: (...args: any[]) => any,
  dataStoreAddress: string
): Promise<
  Record<
    string,
    {
      indexToken: string;
      longToken: string;
      shortToken: string;
      marketToken: string;
    }
  >
> {
  const onchainMarkets = await read("Reader", "getMarkets", dataStoreAddress, 0, 1000);
  return Object.fromEntries(
    onchainMarkets.map((market: any) => {
      const { indexToken, longToken, shortToken } = market;
      const marketKey = getMarketKey(indexToken, longToken, shortToken);
      return [marketKey, market];
    })
  );
}

export function getMarketTokenAddresses(marketConfig: any, tokens: any) {
  if (!marketConfig.swapOnly && !tokens[marketConfig.tokens.indexToken]) {
    throw new Error("invalid indexToken");
  }

  if (!tokens[marketConfig.tokens.longToken]) {
    throw new Error("invalid longToken");
  }

  if (!tokens[marketConfig.tokens.shortToken]) {
    throw new Error("invalid shortToken");
  }

  const indexToken = marketConfig.swapOnly
    ? ethers.ZeroAddress
    : tokens[marketConfig.tokens.indexToken].address;
  const longToken = tokens[marketConfig.tokens.longToken].address;
  const shortToken = tokens[marketConfig.tokens.shortToken].address;
  return [indexToken, longToken, shortToken];
}
