import { ethers } from "hardhat";
import hre from "hardhat";

import ExchangeRouterModule from "../ignition/modules/exchangeRouter4" 
import AddResearchModule from "../ignition/modules/addResearch"
import { buildModule } from "@nomicfoundation/hardhat-ignition/modules";
import { AbiCoder, keccak256, getBytes } from "ethers";
import MarketTokenArtifact from "../artifacts/contracts/ExchangeRouter/contracts/market/MarketToken.sol/MarketToken.json"; 
import { calculateCreate2 } from "eth-create2-calculator"; 
import TokensDeployModule from "../ignition/modules/deployTokens";


async function testsFuncAsync() {

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

const ethUsdMarketAddress = getMarketTokenAddress(
        await weth1.getAddress(),
        await weth1.getAddress(),
        await usdc1.getAddress(),
        DEFAULT_MARKET_TYPE,
        await marketFactory.getAddress(), 
        await roleStore.getAddress(),
        await dataStore.getAddress()
      );

const ethUsdMarket = await reader.getMarket(dataStore, ethUsdMarketAddress);

console.log("ethUsdMarketAddress", ethUsdMarketAddress)

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

console.log("ethUsdSpotOnlyMarketAddress", ethUsdSpotOnlyMarketAddress)


console.log(Date.now())

await usdc1.mint(wallet1WithProvider.address, ethers.parseUnits("50000000", 6));
await usdc1.approve(await exchangeRouter.getAddress(), ethers.parseUnits("50000000", 6));

const code = await provider.getCode(await depositVault.getAddress());
if (code === '0x' || code === '0x0') {
    throw new Error(`Контракт не развернут по адресу ${await exchangeRouter.getAddress()}`);
}

console.log("exchangeRouter.address", await exchangeRouter.getAddress())

const depositVaultAddress = await depositVault.getAddress()
await dataStore.setAddress(
  ethers.solidityPackedKeccak256(["string"], ["WNT"]), 
  await weth1.getAddress()
)
await dataStore.setAddress(
  hashString("WNT"), 
  await weth1.getAddress()
)
await dataStore.setAddress(hashString("HOLDING_ADDRESS"), wallet1WithProvider.address);
await dataStore.setUint(
                        hashData(
                          [
                            "bytes32", 
                            "address"
                          ],
                          [
                            hashString("TOKEN_TRANSFER_GAS_LIMIT"), 
                            await weth1.getAddress()
                          ]), 
                          10000000
                        );

console.log(
            ethers.solidityPackedKeccak256(["string"], ["WNT"]),
            await weth1.getAddress(), 
            hashString("WNT")
            )
const key = ethers.solidityPackedKeccak256(["string"], ["WNT"])
const sendWnt = await exchangeRouter.sendWnt(
    depositVaultAddress, 
    ethers.parseUnits("11", 18),
    {
      from: wallet1WithProvider.address,
      value: ethers.parseUnits("11", 18)
    }
);
console.log("sendWnt=============================> Done")

const receiptGrantRole = await roleStore.grantRole(
    await exchangeRouter.getAddress(), 
    "0xc82e6cc76072f8edb32d42796e58e13ab6e145524eb6b36c073be82f20d410f3")
const receiptGrantRoleTx = await receiptGrantRole.wait()
console.log("receiptGrantRoleTx=============================>", receiptGrantRoleTx)

console.log("roleStore.CONTROLLER =============>", roleStore.CONTROLLER)

const routerGrantRole = await roleStore.grantRole(
  await depositHandler.getAddress(), 
  "0x97adf037b2472f4a6a9825eff7d2dd45e37f2dc308df2a260d6a72af4189a65b"
  )
const routerGrantRoleTx = await routerGrantRole.wait()
console.log("routerGrantRoleTx=============================>", routerGrantRoleTx)
console.log("router.address =============>", await router.getAddress())
console.log(
  "roleStore.hasRole(await router.getAddress(), roleStore.CONTROLLER) =============>", 
  await roleStore.hasRole(
    await router.getAddress(), 
    "0x97adf037b2472f4a6a9825eff7d2dd45e37f2dc308df2a260d6a72af4189a65b"
  )
)

const routerApprove = await usdc1.approve(
    await router.getAddress(), 
    ethers.parseUnits("80000000", 6),
    {
      from: wallet1WithProvider.address
    }
);
const receiptRouterApprove = await routerApprove.wait()
console.log("receiptRouterApprove=============================>", receiptRouterApprove)

const routerApprove2 = await usdc1.approve(wallet1WithProvider.address, ethers.parseUnits("80000000", 6));
const receiptRouterApprove2 = await routerApprove2.wait()
console.log("receiptRouterApprove2=============================>", receiptRouterApprove2)

const sendTokens = await exchangeRouter.sendTokens(
    await usdc1.getAddress(),
    depositVaultAddress,
    ethers.parseUnits("500000", 6), 
    {
        value: ethers.parseUnits("11", 18),
        from: wallet1WithProvider.address
    }
);





const multicallParams = [
    exchangeRouter.interface.encodeFunctionData("sendWnt", [
        depositVaultAddress, 
        ethers.parseUnits("11", 18)
    ]),
    exchangeRouter.interface.encodeFunctionData("sendTokens", [
        await usdc1.getAddress(),
        await depositVault.getAddress(),
        ethers.parseUnits("50000000", 6)
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

    console.log("multicallParams", multicallParams)

    const tx = await exchangeRouter.multicall(
        multicallParams,
        {
          from: wallet1WithProvider.address,
          value: ethers.parseUnits("11", 18)
        }
    );

    const result = await tx.wait();

    console.log("result", result)   

    const depositKeys = await getDepositKeys(dataStore, 0, 1);
    const deposit = await reader.getDeposit(dataStore.address, depositKeys[0]);
   


    await logGasUsage({
      tx,
      label: "exchangeRouter.createDeposit",
    });

}

testsFuncAsync().
then(() => process.exit(0)).
catch((e) => {
    console.error(e);
    process.exit(1)
})

//! npx hardhat run scripts/gmxFunctions.ts --network localhost 

// 0x70997970c51812dc3a010c7d01b50e0d17dc79c89798999897989998
// 0x3 70997970c51812dc3a010c7d01b50e0d17dc79c8

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
