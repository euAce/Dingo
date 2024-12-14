import { HardhatRuntimeEnvironment } from "hardhat/types";
import { ethers } from "hardhat";
import hre from "hardhat";
import * as keys from "../utils/keys";

import ExchangeRouterModule from "../ignition/modules/exchangeRouter4" 
import AddResearchModule from "../ignition/modules/addResearch"
import { buildModule } from "@nomicfoundation/hardhat-ignition/modules";
import { AbiCoder, keccak256, getBytes } from "ethers";
import MarketTokenArtifact from "../artifacts/contracts/ExchangeRouter/contracts/market/MarketToken.sol/MarketToken.json"; 
import { calculateCreate2 } from "eth-create2-calculator"; 
import TokensDeployModule from "../ignition/modules/deployTokens";
import { updateGeneralConfig } from "../scripts/updateGeneralConfigUtils";
import { expandDecimals } from "../utils/math";
// import { getMarketTokenAddress } from "../ignition/modules/addMainTokens";

async function main(hre: HardhatRuntimeEnvironment) {

const provider = new ethers.JsonRpcProvider(`http://127.0.0.1:8545/`)
const privateKeySepAcc = '0x59c6995e998f97a5a0044966f0945389dc9e86dae88c7a8412f4603b6b78690d'
const wallet1 = new ethers.Wallet(privateKeySepAcc, provider)
const wallet1WithProvider = wallet1.connect(provider)

console.log(`Wallet 1: ${ethers.formatEther(await provider.getBalance(wallet1WithProvider))} ETH`)

const {
    roleStore,
    dataStore,
    weth1,
    usdc1,
    marketToken,
  } = await hre.ignition.deploy(TokensDeployModule);



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
    // orderVault,
    swapHandler,
    // referralStorage 
} = await hre.ignition.deploy(ExchangeRouterModule);


const {
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
    } = await hre.ignition.deploy(AddResearchModule);


    console.log("dataStore.getUint(BORROWING_FEE_RECEIVER_FACTOR) =============>", 
        await dataStore.getUint(hashString("BORROWING_FEE_RECEIVER_FACTOR"))
    )

    

const depositKeys = await getDepositKeys(dataStore, 0, 1);
    console.log("depositKeys is geted", depositKeys)   
    console.log("depositKeys[0] is geted", depositKeys[0])

const deposit = await reader.getDeposit(
      dataStore, 
      depositKeys[0]
    );
    console.log("deposit is geted", deposit)


}

main(hre).
then(() => process.exit(0)).
catch((e) => {
    console.error(e);
    process.exit(1)
})


//! npx hardhat run scriptsResearch/getDeposites.ts --network localhost > outputGetters.log 2>&1

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
  const byteCode = MarketTokenArtifact.bytecode;
  return calculateCreate2(marketFactoryAddress, salt, byteCode, {
    params: [roleStoreAddress, dataStoreAddress],
    types: ["address", "address"],
  });
}

export function hashData(dataTypes: string[], dataValues: string[]) {
    const abiCoder = new AbiCoder();
    const bytes = abiCoder.encode(dataTypes, dataValues);
    const hash = keccak256(getBytes(bytes));
    return hash;
  }

  export function hashString(string: string) {
    return hashData(["string"], [string]);
  }

  export const DEFAULT_MARKET_TYPE = hashString("basic-v1");

  export async function logGasUsage({ tx, label }: { tx: any, label: string }) {
    const { provider } = ethers;
    const result = await tx.wait();
  
    if (label) {
      console.info(label, result.gasUsed.toString());
    }
  
    return result;
  }

  export const DEPOSIT_LIST = hashString("DEPOSIT_LIST");

  export function getDepositKeys(dataStore: any, start: number, end: number) {
    return dataStore.getBytes32ValuesAt(DEPOSIT_LIST, start, end);
  }