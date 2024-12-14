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

    console.log(
      "Tokens:", 
      await weth1.getAddress(),
      await usdc1.getAddress()
    )
  

  // console.log("tokenTransferGasLimit(await weth1.getAddress()) =============>", 
  //   tokenTransferGasLimit(await weth1.getAddress())
  // )

  console.log("tokenTransferGasLimit(await weth1.getAddress()) =============>", 
    keys.tokenTransferGasLimit(await weth1.getAddress()),
    hashData(
              ["bytes32", "address"],
              [
                hashString("TOKEN_TRANSFER_GAS_LIMIT"), 
                await weth1.getAddress()
              ]
            ), 
  )

  //! Насстройки для транзакций с токенами
  await dataStore.setUint(
    keys.tokenTransferGasLimit(await weth1.getAddress()), 
    // hashData(
    //           ["bytes32", "address"],
    //           [hashString("TOKEN_TRANSFER_GAS_LIMIT"), await weth1.getAddress()]
    //       ), 
    200000
  );

  console.log("dataStore.getUint(tokenTransferGasLimit(await weth1.getAddress())) =============>", 
    await dataStore.getUint(keys.tokenTransferGasLimit(await weth1.getAddress())),
    await dataStore.getUint(hashData(
      ["bytes32", "address"], 
      [hashString("TOKEN_TRANSFER_GAS_LIMIT"), await weth1.getAddress()]
    )),
  )



  await dataStore.setAddress(
      hashString("WNT"), 
      await weth1.getAddress()
  )
  await dataStore.setAddress(
      hashString("HOLDING_ADDRESS"), 
      wallet1WithProvider.address
  );
  console.log("dataStore.getAddress(hashString('HOLDING_ADDRESS')) =============> (1)") 

    await usdc1.mint(wallet1WithProvider.address, expandDecimals(50 * 1000, 6));
    await usdc1.approve(await router.getAddress(), expandDecimals(50 * 1000, 6));

    console.log("dataStore.getAddress(hashString('HOLDING_ADDRESS')) =============> (2)") 

    // const ethUsdMarket = await marketFactory.createMarket(
    //                                                  await weth1.getAddress(),
    //                                                  await weth1.getAddress(),
    //                                                  await usdc1.getAddress(),
    //                                                  DEFAULT_MARKET_TYPE
    //                                                  ) 
    const ethUsdMarketAddress = getMarketTokenAddress(
      await weth1.getAddress(),
      await weth1.getAddress(),
      await usdc1.getAddress(),
      DEFAULT_MARKET_TYPE,
      await marketFactory.getAddress(), 
      await roleStore.getAddress(),
      await dataStore.getAddress()
    );
    console.log("ethUsdMarketAddress =============>", ethUsdMarketAddress)
    const ethUsdMarket = await reader.getMarket(dataStore, ethUsdMarketAddress);
    console.log("ethUsdMarket =============>", ethUsdMarket)
    // 0x48b72a94bECB8e202154b4D60A3cd21D203f99b9

    // const ethUsdSpotOnlyMarket = await marketFactory.createMarket(
    // ethers.ZeroAddress,
    // await weth1.getAddress(),
    // await usdc1.getAddress(),
    // DEFAULT_MARKET_TYPE
    // )
    const ethUsdSpotOnlyMarketAddress = getMarketTokenAddress(
      ethers.ZeroAddress,
      await weth1.getAddress(),
      await usdc1.getAddress(),
      DEFAULT_MARKET_TYPE,
      await marketFactory.getAddress(),
      await roleStore.getAddress(),
      await dataStore.getAddress()
    );
    const ethUsdSpotOnlyMarket = await reader.getMarket(dataStore, ethUsdSpotOnlyMarketAddress);
    console.log("ethUsdSpotOnlyMarket =============>", ethUsdSpotOnlyMarket)


    const depositVaultAddress = await depositVault.getAddress()

    const multicallParams = [
      exchangeRouter.interface.encodeFunctionData("sendWnt", [
          depositVaultAddress, 
          ethers.parseUnits("11", 18)
      ]),
      exchangeRouter.interface.encodeFunctionData("sendTokens", [
          await usdc1.getAddress(),
          depositVaultAddress, 
          ethers.parseUnits("44000", 6)
      ]),
      exchangeRouter.interface.encodeFunctionData("createDeposit", 
          [
              {
                  receiver: wallet1WithProvider.address, 
                  callbackContract: wallet1WithProvider.address,
                  uiFeeReceiver: wallet1WithProvider.address,
                  market: ethUsdMarket.marketToken,
                  initialLongToken: ethUsdMarket.longToken,
                  initialShortToken: ethUsdMarket.shortToken,
                  longTokenSwapPath: [ethUsdMarket.marketToken, ethUsdSpotOnlyMarket.marketToken],
                  shortTokenSwapPath: [ethUsdSpotOnlyMarket.marketToken, ethUsdMarket.marketToken],
                  minMarketTokens: 100,
                  shouldUnwrapNativeToken: true,
                  executionFee: ethers.parseUnits("1", 18),
                  callbackGasLimit: "200000",
              }
          ]
      )
  ]

  console.log("multicallParams =============>", multicallParams)


  const tx = await exchangeRouter.multicall(
    multicallParams,
    {
      from: wallet1WithProvider.address,
      value: ethers.parseUnits("11", 18)
    }
);

const result = await tx.wait();

console.log("result is geted")   

const depositKeys = await getDepositKeys(dataStore, 0, 6);
    console.log("depositKeys is geted", depositKeys)   
    console.log("depositKeys[0] is geted", depositKeys[0])

const deposit = await reader.getDeposit(
      dataStore, 
      depositKeys[5]
    );
    console.log("deposit is geted", deposit)

await logGasUsage({
      tx,
      label: "exchangeRouter.createDeposit",
    });

}

main(hre).
then(() => process.exit(0)).
catch((e) => {
    console.error(e);
    process.exit(1)
})


//! npx hardhat run scriptsResearch/codeResearch1.ts --network localhost > outputLogicsCode1.log 2>&1

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