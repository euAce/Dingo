import { HardhatRuntimeEnvironment } from "hardhat/types";
import  getConfig from "../config/general";
import getMarkets from "../config/markets";
import getTokens from "../config/tokens";
import getOracle from "../config/oracle";
import getRoles from "../config/roles";
import { config, ethers } from "hardhat";
import hre from "hardhat";
import { MAX_SWAP_PATH_LENGTH, tokenTransferGasLimit } from "../utils/keys";
// import { hashString, hashData } from "../utils/hash";
import LibrariesModule3 from "../ignition/modules/LibrariesModule3";
import { getMarketTokenAddress, DEFAULT_MARKET_TYPE } from "../utils/market";
import * as keys from "../utils/keys";



import ExchangeRouterModule from "../ignition/modules/exchangeRouter4" 
import AddResearchModule from "../ignition/modules/addResearch"
import { buildModule } from "@nomicfoundation/hardhat-ignition/modules";
import { AbiCoder, keccak256, getBytes } from "ethers";
import MarketTokenArtifact from "../artifacts/contracts/ExchangeRouter/contracts/market/MarketToken.sol/MarketToken.json"; 
import { calculateCreate2 } from "eth-create2-calculator"; 
import TokensDeployModule from "../ignition/modules/deployTokens";
import { updateGeneralConfig } from "../scripts/updateGeneralConfigUtils";
import { encodeData } from "../utils/hash";

async function main(hre: HardhatRuntimeEnvironment) {

const provider = new ethers.JsonRpcProvider(`http://127.0.0.1:8545/`)
const privateKeySepAcc = '0x59c6995e998f97a5a0044966f0945389dc9e86dae88c7a8412f4603b6b78690d'
const wallet1 = new ethers.Wallet(privateKeySepAcc, provider)
const wallet1WithProvider = wallet1.connect(provider)

console.log(`Wallet 1: ${ethers.formatEther(await provider.getBalance(wallet1WithProvider))} ETH`)

const { 
  // roleStore,
  // dataStore,
  // calc,
  // precision,
  // eventUtils,
  // errorUtils,
  keys
  // gasUtils,
  // feeUtils,
  // marketEventUtils,
  // marketStoreUtils,
  // marketUtils,
  // positionStoreUtils,
  // positionUtils,
  // increasePositionUtils,
  // swapPricingUtils,
  // swapUtils,
  // swapOrderUtils,
  // orderEventUtils,
  // referralEventUtils,
  // decreasePositionCollateralUtils,
  // decreasePositionSwapUtils,
  // positionEventUtils, 
  // decreasePositionUtils, 
  // positionPricingUtils, 
  // increaseOrderUtils, 
  // decreaseOrderUtils, 
  // referralUtils, 
  // depositEventUtils, 
  // depositStoreUtils, 
  // depositUtils, 
  // executeDepositUtils, 
  // withdrawalEventUtils, 
  // withdrawalStoreUtils, 
  // withdrawalUtils, 
  // executeWithdrawalUtils, 
  // orderStoreUtils, 
  // orderUtils, 
  // executeOrderUtils,
  // callbackUtils,
  // shiftStoreUtils,
  // shiftEventUtils,
  // shiftUtils
} = await hre.ignition.deploy(LibrariesModule3);

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




    const markets: { [key: string]: any } = await getMarkets(hre);
    const tokensList = await getTokens(hre);
    const oracleConfig = await getOracle(hre);
    const configGeneral = await getConfig(hre);
    const rolesConfig = await getRoles(hre);

    const ethUsdMarket = await marketFactory.createMarket(
                                                     await weth1.getAddress(),
                                                     await weth1.getAddress(),
                                                     await usdc1.getAddress(),
                                                     DEFAULT_MARKET_TYPE
                                                     ) 

    console.log("ethUsdMarket", ethUsdMarket)

    console.log("\n=== Итерация по ролям ===")
    for (const [key, value] of Object.entries(rolesConfig)) {
        console.log(`Параметр роли ${key}:`, value);
        let GrantRoleOwner = await roleStore.grantRole(
            wallet1WithProvider, 
            hashString(key.toUpperCase())
        )
        await GrantRoleOwner.wait()

        console.log(
            "hasRoleOwner",
            await roleStore.hasRole(
                wallet1WithProvider, 
                hashString(key.toUpperCase())
            )
        )
        // console.log("GrantRoleOwner", key.toUpperCase(), "CONFIG_KEEPER")
        // if (key === "CONFIG_KEEPER" || key === "CONTROLLER") {
        // console.log(
        //   "0x97adf037b2472f4a6a9825eff7d2dd45e37f2dc308df2a260d6a72af4189a65b", "\n",
        //   "0x901fb3de937a1dcb6ecaf26886fda47a088e74f36232a0673eade97079dc225b", "\n",
        //    key.toUpperCase(), "\n",
        //    hashString(key.toUpperCase()),
        //    hashData(["string"], [key.toUpperCase()])
        // )
    }


    const GrantRole1 = await roleStore.grantRole(
        await adlHandler.getAddress(), 
        hashString("CONTROLLER")
      )
      await GrantRole1.wait() 

    const GrantRole2 = await roleStore.grantRole(
        await config.getAddress(), 
        hashString("CONTROLLER")
      )
      await GrantRole2.wait()

      console.log(
        "hasRoleConfig ==========================================================>",
        await roleStore.hasRole(
            await config.getAddress(), 
            hashString("CONTROLLER")
        )
    )
    
    const GrantRole3 = await roleStore.grantRole(
        await configSyncer.getAddress(), 
        hashString("CONFIG_KEEPER")
      )
      await GrantRole3.wait() 

    const GrantRole3_1 = await roleStore.grantRole(
        await configSyncer.getAddress(), 
        hashString("CONTROLLER")
      )
      await GrantRole3_1.wait() 

    const GrantRole4 = await roleStore.grantRole(
        await depositHandler.getAddress(), 
        hashString("CONTROLLER")
      )
      await GrantRole4.wait() 
    
    const GrantRole5 = await roleStore.grantRole(
        await exchangeRouter.getAddress(), 
        hashString("ROUTER_PLUGIN")
      )
      await GrantRole5.wait() 
    
      const GrantRole5_1 = await roleStore.grantRole(
        await exchangeRouter.getAddress(), 
        hashString("CONTROLLER")
      )
      await GrantRole5_1.wait() 

    const GrantRole6 = await roleStore.grantRole(
        await feeHandler.getAddress(), 
        hashString("CONTROLLER")
      )
      await GrantRole6.wait() 

    const GrantRole7 = await roleStore.grantRole(
        await glvHandler.getAddress(), 
        hashString("CONTROLLER")
      )
      await GrantRole7.wait() 

      const GrantRole8 = await roleStore.grantRole(
        await glvRouter.getAddress(), 
        hashString("ROUTER_PLUGIN")
      )
      await GrantRole8.wait() 

      const GrantRole8_1 = await roleStore.grantRole(
        await glvRouter.getAddress(), 
        hashString("CONTROLLER")
      )
      await GrantRole8_1.wait()
      
      const GrantRole9 = await roleStore.grantRole(
        await liquidationHandler.getAddress(), 
        hashString("CONTROLLER")
      )
      await GrantRole9.wait()

      const GrantRole10 = await roleStore.grantRole(
        await marketFactory.getAddress(), 
        hashString("CONTROLLER")
      )
      await GrantRole10.wait()

      const GrantRole11 = await roleStore.grantRole(
        await oracle.getAddress(), 
        hashString("CONTROLLER")
      )
      await GrantRole11.wait()

      const GrantRole12 = await roleStore.grantRole(
        await oracleStore.getAddress(), 
        hashString("CONTROLLER")
      )
      await GrantRole12.wait()

      const GrantRole13 = await roleStore.grantRole(
        await orderHandler.getAddress(), 
        hashString("CONTROLLER")
      )
      await GrantRole13.wait()

      const GrantRole14 = await roleStore.grantRole(
        await shiftHandler.getAddress(), 
        hashString("CONTROLLER")
      )
      await GrantRole14.wait()

      const GrantRole15 = await roleStore.grantRole(
        await subaccountRouter.getAddress(), 
        hashString("CONTROLLER")
      )
      await GrantRole15.wait()

      const GrantRole15_1 = await roleStore.grantRole(
        await subaccountRouter.getAddress(), 
        hashString("ROUTER_PLUGIN")
      )
      await GrantRole15_1.wait()

      const GrantRole16 = await roleStore.grantRole(
        await swapHandler.getAddress(), 
        hashString("ROLE_ADMIN")
      )
      await GrantRole16.wait()

      const GrantRole17 = await roleStore.grantRole(
        await timelock.getAddress(), 
        hashString("CONTROLLER")
      )
      await GrantRole17.wait()

      const GrantRole17_1 = await roleStore.grantRole(
        await timelock.getAddress(), 
        hashString("ROLE_ADMIN")
      )
      await GrantRole17_1.wait()

      const GrantRole19 = await roleStore.grantRole(
        await withdrawalHandler.getAddress(), 
        hashString("CONTROLLER")
      )
      await GrantRole19.wait()


    console.log("\n=== Итерация по оракулу ==================================================================")
    let encodeOracleDatas = [];
    for (const [key, value] of Object.entries(oracleConfig)) {
        console.log(`Параметр оракула ${key}:`, value);
        console.log("key", typeof key)
        // if (key === "signers" || key === "maxRefPriceDeviationFactor" || key === "minOracleSigners") 
        if (key === "signers" || key === "minOracleBlockConfirmations" || key === "minOracleSigners" || key === "maxOraclePriceAge" || key === "maxOracleTimestampRange" || key === "maxRefPriceDeviationFactor") // MIN_ORACLE_BLOCK_CONFIRMATIONS MIN_ORACLE_SIGNERS MAX_ORACLE_TIMESTAMP_RANGE MAX_REF_PRICE_DEVIATION_FACTOR
        {
            console.log("signers next to")
            continue;
        }
        const {method, convertedKey, convertedValue} = getMethod(key, value)
        encodeOracleDatas.push(config.interface.encodeFunctionData("setUint", [convertedKey, "0x", convertedValue]))

        console.log("==================================================================", 
            convertedKey, "\n",
            key, "\n",
            typeof value, "\n",
            value, "\n",
            convertedValue,
            method
        );
    }
    const setOracleConfig = await config.multicall(
        encodeOracleDatas,
        {
          from: wallet1WithProvider.address
        }
    );
    const resultOracleTx = await setOracleConfig.wait();
     // const setOracleConfig = await config.multicall(encodeOracleDatas);

    console.log("\n=== Итерация по рынку ==================================================================")
    for (const [key, value] of Object.entries(markets)) {
      for (const [key1, value1] of Object.entries(value)) {
        console.log(`Параметр рынка ${key1}:`, value1);
        if (key1 === "minCollateralFactor" && value1 !== undefined) {
          console.log("minCollateralFactor", value1)
          const {method, convertedKey, convertedValue} = getMethod(key1, value1)
          keys.minCollateralFactorKey(ethUsdMarket.marketToken)
          dataStore.setUint(keys.minCollateralFactorKey(ethUsdMarket.marketToken), value1)

        }
      }
    }

    console.log("\n=== Итерация по конфигу ==================================================================")
    let encodeDatas = [];
    // Object.entries(configGeneral).forEach(([key, value]) => {
    for (const [key, value] of Object.entries(configGeneral)) {
        console.log("key", key, typeof key, camelToSnakeCase(key))
        console.log(hashString(camelToSnakeCase(key)))

        const {method, convertedKey, convertedValue} = getMethod(key, value)
        if (method === undefined) {
            continue;
        }
        console.log("method", method)
        console.log("convertedKey", convertedKey)
        console.log("convertedValue", convertedValue)

        if (method === "setUint") {
          try {
            await config.setUint(convertedKey, "0x", convertedValue)
          } catch (e) {
            console.error("Error setUint", e)
            await dataStore.setUint(convertedKey, convertedValue)
            console.log("---------------------------------------------------------------------");
            console.log("setUint failed", await dataStore.getUint(convertedKey));
            console.log("---------------------------------------------------------------------");
          }
        }
        if (method === "setBytes32") {
          try {
            await config.setBytes32(convertedKey, "0x", convertedValue)
          } catch (e) {
            console.error("Error setBytes32", e)
            await dataStore.setBytes32(convertedKey, convertedValue)
          }
        }
        if (method === "setAddress") {
          try {
            await config.setAddress(convertedKey, "0x", convertedValue)
          } catch (e) {
            console.error("Error setAddress", e)
            await dataStore.setAddress(convertedKey, convertedValue)
          }
        }
        if (method === "setBool") {
          try {
            await config.setBool(convertedKey, "0x", convertedValue)
          } catch (e) {
            console.error("Error setBool", e)
            await dataStore.setBool(convertedKey, convertedValue)
          }
        }
        if (method === "setString") {
          try {
            await config.setString(convertedKey, "0x", convertedValue)
          } catch (e) {
            console.error("Error setString", e)
            await dataStore.setString(convertedKey, convertedValue)
          }
        }

        // await wallet1WithProvider.sendTransaction({
        //     to: await dataStore.getAddress(),
        //     data: dataStore.interface.encodeFunctionData(method, [convertedKey, convertedValue])
        //   });
        // console.log("method", 
        //   await roleStore.hasRole(
        //     "70997970c51812dc3a010c7d01b50e0d17dc79c8", 
        //     "0x901fb3de937a1dcb6ecaf26886fda47a088e74f36232a0673eade97079dc225b"
        //   ), 
        //   await roleStore.hasRole(
        //     "70997970c51812dc3a010c7d01b50e0d17dc79c8", 
        //     "0xb49beded4d572a2d32002662fc5c735817329f4337b3a488aab0b5e835c01ba7"
        //   )
        // )

        // encodeDatas.push(config.interface.encodeFunctionData(method, [convertedKey, "0x", convertedValue]))
    };
    // console.log(
    //   "await dataStore.getBool(convertedKey) No error", 
    //   await dataStore.getUint("0x174a3ec23a145772d821721199b827025a0b7e3f95163596932ed2239f6d3e11"),
    //   await dataStore.getBool("0x6b11e342f6958fd7970dd58c6f71142d5edf77c480f9322a8e9c96b6cc7f7888")
    // )

    // const setGeneralConfig = await config.multicall(
    //     encodeDatas,
    //     {
    //       from: wallet1WithProvider.address
    //     }
    // );
    // const resultTx = await setGeneralConfig.wait();


/*   
    contractName: "AdlHandler", CONTROLLER
    contractName: "AutoCancelSyncer", CONTROLLER
    contractName: "Config", CONTROLLER
    contractName: "ConfigSyncer", CONTROLLER, CONFIG_KEEPER
    contractName: "DepositHandler", CONTROLLER
    contractName: "ExchangeRouter", CONTROLLER, ROUTER_PLUGIN
    contractName: "FeeHandler", CONTROLLER
    contractName: "GlvHandler", CONTROLLER
    contractName: "GlvRouter", CONTROLLER, ROUTER_PLUGIN
    contractName: "LiquidationHandler", CONTROLLER
    contractName: "MarketFactory", CONTROLLER
    contractName: "Oracle", CONTROLLER
    contractName: "OracleStore", CONTROLLER 
    contractName: "OrderHandler", CONTROLLER
    contractName: "ShiftHandler", CONTROLLER
    contractName: "SubaccountRouter", CONTROLLER, ROUTER_PLUGIN
    contractName: "SwapHandler", CONTROLLER
    contractName: "Timelock", CONTROLLER, ROLE_ADMIN
    contractName: "TimestampInitializer", CONTROLLER
    contractName: "WithdrawalHandler", CONTROLLER
*/
}

main(hre).
then(() => process.exit(0)).
catch((e) => {
    console.error(e);
    process.exit(1)
})

//! npx hardhat run scriptsResearch/importConfig1.ts --network localhost  > outputImportConfig1.log 2>&1 

function camelToSnakeCase(str: string): string {
    return str
        // вставляем '_' перед заглавными буквами
        .replace(/([A-Z])/g, '_$1')
        // удаляем '_' в начале строки если он есть
        .replace(/^_/, '')
        // преобразуем в верхний регистр
        .toUpperCase();
}

// export function getMarketTokenAddress(
//     indexToken: string,
//     longToken: string,
//     shortToken: string,
//     marketType: string,
//     marketFactoryAddress: string,
//     roleStoreAddress: string,
//     dataStoreAddress: string
//   ) {
//     const salt = hashData(
//       ["string", "address", "address", "address", "bytes32"],
//       ["GMX_MARKET", indexToken, longToken, shortToken, marketType]
//     );
//     const byteCode = MarketTokenArtifact.bytecode;
//     return calculateCreate2(marketFactoryAddress, salt, byteCode, {
//       params: [roleStoreAddress, dataStoreAddress],
//       types: ["address", "address"],
//     });
//   }

//   export function hashData(dataTypes: string[], dataValues: string[]) {
//     const abiCoder = new AbiCoder();
//     const bytes = abiCoder.encode(dataTypes, dataValues);
//     const hash = keccak256(getBytes(bytes));
//     return hash;
//   }

//   export function hashString(string: string) {
//     return hashData(["string"], [string]);
//   }

//   export const DEFAULT_MARKET_TYPE = hashString("basic-v1");

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

  // Функция для преобразования number в uint256
function numberToUint256(value: number): bigint {
    // Проверяем, что число положительное
    if (value < 0) throw new Error("Значение должно быть положительным");
    // Преобразуем в BigInt
    return BigInt(value);
}

// Функция для преобразования bigint в uint256
function bigintToUint256(value: bigint): bigint {
    // Проверяем, что число положительное
    if (value < 0n) throw new Error("Значение должно быть положительным");
    // Проверяем, что число не превышает максимальное значение uint256
    if (value > BigInt("0xffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffff")) {
        throw new Error("Значение превышает максимальное значение uint256");
    }
    return value;
}

// Пример использования при итерации:
function convertConfig(value: any) {
    // console.log("\n=== Итерация по конфигу ==================================================================") 
    // Object.entries(iterable).forEach(([key, value]) => {
        // const snakeCaseKey = camelToSnakeCase(key);
        let convertedValue = value;
        
        if (typeof value === 'number') {
            try {
                convertedValue = numberToUint256(value);
            } catch (e) {
                console.error(`Ошибка конвертации для ${value}:`, e);
            }
        } else if (typeof value === 'bigint') {
            try {
                convertedValue = bigintToUint256(value);
            } catch (e) {
                console.error(`Ошибка конвертации для ${value}:`, e);
            }
        }
        
        // console.log(`Параметр конфига \n    ${value}:`, convertedValue);
    // });
    return convertedValue;
}

function isChecksumAddress(address: string): boolean {
    try {
        // Проверка базового формата
        if (!address.match(/^0x[0-9a-fA-F]{40}$/)) {
            return false;
        }
        // Проверка через ethers с учетом контрольной суммы
        const checksumAddress = ethers.getAddress(address);
        console.log("checksumAddress", checksumAddress.toLowerCase() === address.toLowerCase())
        console.log("address", address)
        if (checksumAddress.toLowerCase() === address.toLowerCase()) {
            return true;
        } else {
            return false;
        }
    } catch {
        return false;
    }
}

// Проверка, является ли строка корректным bytes32
function isBytes32(value: string): boolean {
    // Проверяем, начинается ли строка с 0x
    if (!value.startsWith('0x')) {
        return false;
    }
    
    // Убираем префикс 0x и проверяем длину (должна быть 64 символа для bytes32)
    const hex = value.slice(2);
    if (hex.length !== 64) {
        return false;
    }
    
    // Проверяем, содержит ли строка только шестнадцатеричные символы
    return /^[0-9a-fA-F]{64}$/.test(hex);
}

function getMethod(key: any, value: any) {
    let method;
    let convertedValue = value;
        if (typeof value === 'number' || typeof value === 'bigint' ) { 
            method = "setUint"
        } else if (typeof value === 'string' && isBytes32(value)) {
            method = "setBytes32"
        } else if (typeof value === 'string' && !isBytes32(value) && isChecksumAddress(value)) {
            method = "setAddress"
        } else if (typeof value === 'boolean') {
            method = "setBool"
        } else if (typeof value === 'string' && !isBytes32(value) && !isChecksumAddress(value)) {
            method = "setString"
        }
    let convertedKey = key;
        if (typeof key === 'string') { 
            convertedKey = hashString(camelToSnakeCase(key))
        } else {
            convertedKey = hashString(camelToSnakeCase(key.toString()))
        }
        // convertedKey = 
    // console.log("convertedKey", camelToSnakeCase(key.toString()))
    // console.log("convertedKey", convertedKey)

    return {method, convertedKey, convertedValue}
}

function hashData(dataTypes: string[], dataValues: string[]) {
  const abiCoder = new AbiCoder();
  const bytes = abiCoder.encode(dataTypes, dataValues);
  const hash = keccak256(getBytes(bytes));
  return hash;
}

export function hashString(string: string) {
  return hashData(["string"], [string]);
}

async function actMethod(
  key: string, 
  value: any, 
  config: any, 
  dataStore: any, 
  isMarketConfig: boolean = false,
  market: any
) {
  const {method, convertedKey, convertedValue} = getMethod(key, value)
  if (method === undefined) {
      return;
  }

  if (isMarketConfig) {
    let fullKey = getFullKey(key, market)
    if (fullKey !== undefined && method !== undefined) {
      addToDataStore(fullKey, value, dataStore, method)
    }
    return;
  }

  if (method === "setUint") {
    try {
      await config.setUint(convertedKey, "0x", convertedValue)
    } catch (e) {
      console.error("Error setUint", e)
      await dataStore.setUint(convertedKey, convertedValue)
    }
  }
  if (method === "setBytes32") {
    try {
      await config.setBytes32(convertedKey, "0x", convertedValue)
    } catch (e) {
      console.error("Error setBytes32", e)
      await dataStore.setBytes32(convertedKey, convertedValue)
    }
  }
  if (method === "setAddress") {
    try {
      await config.setAddress(convertedKey, "0x", convertedValue)
    } catch (e) {
      console.error("Error setAddress", e)
      await dataStore.setAddress(convertedKey, convertedValue)
    }
  }
  if (method === "setBool") {
    try {
      await config.setBool(convertedKey, "0x", convertedValue)
    } catch (e) {
      console.error("Error setBool", e)
      await dataStore.setBool(convertedKey, convertedValue)
    }
  }
  if (method === "setString") {
    try {
      await config.setString(convertedKey, "0x", convertedValue)
    } catch (e) {
      console.error("Error setString", e)
      await dataStore.setString(convertedKey, convertedValue)
    }
  }
}

function addToDataStore(fullKey: string, value: any, dataStore: any, method: string) {
  if (method === "setUint") {
    dataStore.setUint(fullKey, value)
  }
  if (method === "setBytes32") {
    dataStore.setBytes32(fullKey, value)
  }
  if (method === "setAddress") {
    dataStore.setAddress(fullKey, value)
  }
  if (method === "setBool") {
    dataStore.setBool(fullKey, value)
  }
  if (method === "setString") {
    dataStore.setString(fullKey, value)
  }
}

function getFullKey(key: string, market: any) {
  if (key === "minCollateralFactor") {
    // keys.MIN_COLLATERAL_FACTOR,
    // encodeData(["address"], [marketToken]),
    return hashData(["bytes32", "address"], [keys.MIN_COLLATERAL_FACTOR, market.marketToken])
  }
  if (key === "minCollateralFactorForOpenInterestMultiplier") {
    return keys.MIN_COLLATERAL_FACTOR_FOR_OPEN_INTEREST_MULTIPLIER
  }
  if (key === "reserveFactor") {
    return keys.RESERVE_FACTOR
  }
  if (key === "openInterestReserveFactor") {
    return keys.OPEN_INTEREST_RESERVE_FACTOR
  }
  if (key === "maxPnlFactorForTraders") {
    return keys.MAX_PNL_FACTOR_FOR_TRADERS
  }
  if (key === "maxPnlFactorForAdl") {
    return keys.MAX_PNL_FACTOR_FOR_ADL
  }
  if (key === "minPnlFactorAfterAdl") {
    return keys.MIN_PNL_FACTOR_AFTER_ADL
  }
  if (key === "maxPnlFactorForDeposits") {
    return keys.MAX_PNL_FACTOR_FOR_DEPOSITS
  }
  if (key === "maxPnlFactorForWithdrawals") {
    return keys.MAX_PNL_FACTOR_FOR_WITHDRAWALS
  }
  if (key === "positionFeeFactorForPositiveImpact") {
    // keys.POSITION_FEE_FACTOR,
    // encodeData(["address", "bool"], [marketToken, true]),
    return hashData(["bytes32", "address", "bool"], [keys.POSITION_FEE_FACTOR, market.marketToken, true])
  }
  if (key === "positionFeeFactorForNegativeImpact") {
    // keys.POSITION_FEE_FACTOR,
    // encodeData(["address", "bool"], [marketToken, false]),
    return hashData(["bytes32", "address", "bool"], [keys.POSITION_FEE_FACTOR, market.marketToken, false])
  }
  if (key === "negativePositionImpactFactor") {
    // keys.POSITION_IMPACT_FACTOR,
    // encodeData(["address", "bool"], [marketToken, false]),    
    return hashData(["bytes32", "address", "bool"], [keys.POSITION_IMPACT_FACTOR, market.marketToken, false])
  }
  if (key === "positivePositionImpactFactor") {
    // keys.POSITION_IMPACT_FACTOR,
    // encodeData(["address", "bool"], [marketToken, true]),
    return hashData(["bytes32", "address", "bool"], [keys.POSITION_IMPACT_FACTOR, market.marketToken, true])
  }
  if (key === "positionImpactExponentFactor") {
    // keys.POSITION_IMPACT_EXPONENT_FACTOR,
    // encodeData(["address"], [marketToken]),
    return hashData(["bytes32", "address"], [keys.POSITION_IMPACT_EXPONENT_FACTOR, market.marketToken])
  }
  if (key === "negativeMaxPositionImpactFactor") {
    // keys.MAX_POSITION_IMPACT_FACTOR,
    // encodeData(["address", "bool"], [marketToken, false]),
    return hashData(["bytes32", "address", "bool"], [keys.MAX_POSITION_IMPACT_FACTOR, market.marketToken, false])
  }
  if (key === "positiveMaxPositionImpactFactor") {
    // keys.MAX_POSITION_IMPACT_FACTOR,
    // encodeData(["address", "bool"], [marketToken, true]),
    return hashData(["bytes32", "address", "bool"], [keys.MAX_POSITION_IMPACT_FACTOR, market.marketToken, true])
  }
  if (key === "maxPositionImpactFactorForLiquidations") {
    // keys.MAX_POSITION_IMPACT_FACTOR_FOR_LIQUIDATIONS,
    // encodeData(["address"], [marketToken]),
    return hashData(
      ["bytes32", "address"], 
      [keys.MAX_POSITION_IMPACT_FACTOR_FOR_LIQUIDATIONS, market.marketToken]
    )
  }
  if (key === "swapFeeFactorForPositiveImpact") {
    // keys.SWAP_FEE_FACTOR,
    // encodeData(["address", "bool"], [marketToken, true]),
    return hashData(["bytes32", "address", "bool"], [keys.SWAP_FEE_FACTOR, market.marketToken, true])
  }
  if (key === "swapFeeFactorForNegativeImpact") {
    // keys.SWAP_FEE_FACTOR,
    // encodeData(["address", "bool"], [marketToken, false]),
    return hashData(["bytes32", "address", "bool"], [keys.SWAP_FEE_FACTOR, market.marketToken, false])
  }
  if (key === "atomicSwapFeeFactor") {
    // keys.ATOMIC_SWAP_FEE_FACTOR,
    // encodeData(["address"], [marketToken]),
    return hashData(["bytes32", "address"], [keys.ATOMIC_SWAP_FEE_FACTOR, market.marketToken])
  }
  if (key === "negativeSwapImpactFactor") {
    // keys.SWAP_IMPACT_FACTOR,
    // encodeData(["address", "bool"], [marketToken, false]),
    return hashData(["bytes32", "address", "bool"], [keys.SWAP_IMPACT_FACTOR, market.marketToken, false])
  }
  if (key === "positiveSwapImpactFactor") {
    // keys.SWAP_IMPACT_FACTOR,
    // encodeData(["address", "bool"], [marketToken, true]),
    return hashData(["bytes32", "address", "bool"], [keys.SWAP_IMPACT_FACTOR, market.marketToken, true])
  }
  if (key === "swapImpactExponentFactor") {
    // keys.SWAP_IMPACT_EXPONENT_FACTOR,
    // encodeData(["address"], [marketToken]),
    return hashData(["bytes32", "address"], [keys.SWAP_IMPACT_EXPONENT_FACTOR, market.marketToken])
  }
  if (key === "minCollateralUsd") {
    // keys.MIN_COLLATERAL_USD,
    // encodeData(["address"], [marketToken]),
    return keys.MIN_COLLATERAL_USD
  }
  if (key === "borrowingFactor") {
    // keys.BORROWING_FACTOR,
    // encodeData(["address"], [marketToken]),
    return keys.BORROWING_FACTOR
  }
  if (key === "optimalUsageFactor") {
    // keys.OPTIMAL_USAGE_FACTOR,
    // encodeData(["address", "bool"], [marketToken, false]),
    return keys.OPTIMAL_USAGE_FACTOR
  }
  if (key === "baseBorrowingFactor") {
    // keys.BASE_BORROWING_FACTOR,
    // encodeData(["address"], [marketToken]),
    return keys.BASE_BORROWING_FACTOR
  }
  if (key === "aboveOptimalUsageBorrowingFactor") {
    // keys.ABOVE_OPTIMAL_USAGE_BORROWING_FACTOR,
    // encodeData(["address"], [marketToken]),
    return keys.ABOVE_OPTIMAL_USAGE_BORROWING_FACTOR
  }
  if (key === "borrowingExponentFactor") {
    // keys.BORROWING_EXPONENT_FACTOR,
    // encodeData(["address"], [marketToken]),
    return keys.BORROWING_EXPONENT_FACTOR
  }
  if (key === "fundingFactor") {
    // keys.FUNDING_FACTOR,
    // encodeData(["address"], [marketToken]),
    return hashData(["bytes32", "address"], [keys.FUNDING_FACTOR, market.marketToken])
  }
  if (key === "fundingExponentFactor") {
    // keys.FUNDING_EXPONENT_FACTOR,
    // encodeData(["address"], [marketToken]),
    return hashData(["bytes32", "address"], [keys.FUNDING_EXPONENT_FACTOR, market.marketToken])
  }
  if (key === "fundingIncreaseFactorPerSecond") {
    // keys.FUNDING_INCREASE_FACTOR_PER_SECOND,
    // encodeData(["address"], [marketToken]),
    return hashData(["bytes32", "address"], [keys.FUNDING_INCREASE_FACTOR_PER_SECOND, market.marketToken])
  }
  if (key === "fundingDecreaseFactorPerSecond") {
    // keys.FUNDING_DECREASE_FACTOR_PER_SECOND,
    // encodeData(["address"], [marketToken]),
    return hashData(["bytes32", "address"], [keys.FUNDING_DECREASE_FACTOR_PER_SECOND, market.marketToken])
  }
  if (key === "thresholdForStableFunding") {
    // keys.THRESHOLD_FOR_STABLE_FUNDING,
    // encodeData(["address"], [marketToken]),
    return hashData(["bytes32", "address"], [keys.THRESHOLD_FOR_STABLE_FUNDING, market.marketToken])
  }
  if (key === "minFundingFactorPerSecond") {
    // keys.MIN_FUNDING_FACTOR_PER_SECOND,
    // encodeData(["address"], [marketToken]),
    return hashData(["bytes32", "address"], [keys.MIN_FUNDING_FACTOR_PER_SECOND, market.marketToken])
  }
  if (key === "maxFundingFactorPerSecond") {
    // keys.MAX_FUNDING_FACTOR_PER_SECOND,
    // encodeData(["address"], [marketToken]),
    return hashData(["bytes32", "address"], [keys.MAX_FUNDING_FACTOR_PER_SECOND, market.marketToken])
  }
  if (key === "thresholdForDecreaseFunding") {
    // keys.THRESHOLD_FOR_DECREASE_FUNDING,
    // encodeData(["address"], [marketToken]),
    return hashData(["bytes32", "address"], [keys.THRESHOLD_FOR_DECREASE_FUNDING, market.marketToken])
  }
  if (key === "positionImpactPoolDistributionRate") {
    // keys.POSITION_IMPACT_POOL_DISTRIBUTION_RATE,
    // encodeData(["address"], [marketToken]),
    return hashData(["bytes32", "address"], [keys.POSITION_IMPACT_POOL_DISTRIBUTION_RATE, market.marketToken])
  }
  if (key === "minPositionImpactPoolAmount") {
    // keys.MIN_POSITION_IMPACT_POOL_AMOUNT,
    // encodeData(["address"], [marketToken]),
    return hashData(["bytes32", "address"], [keys.MIN_POSITION_IMPACT_POOL_AMOUNT, market.marketToken])
  }
  if (key === "reserveFactorLongs") {
    // keys.RESERVE_FACTOR,
    // encodeData(["address", "bool"], [marketToken, true]),
    return hashData(["bytes32", "address", "bool"], [keys.RESERVE_FACTOR, market.marketToken, true])
  }
  if (key === "reserveFactorShorts") {
    // keys.RESERVE_FACTOR,
    //   encodeData(["address", "bool"], [marketToken, false]),
    return hashData(["bytes32", "address", "bool"], [keys.RESERVE_FACTOR, market.marketToken, false])
  }
  if (key === "openInterestReserveFactorLongs") {
    // keys.OPEN_INTEREST_RESERVE_FACTOR,
    // encodeData(["address", "bool"], [marketToken, true]),
    return hashData(
      ["bytes32", "address", "bool"], 
      [keys.OPEN_INTEREST_RESERVE_FACTOR, market.marketToken, true]
    )
  }
  if (key === "openInterestReserveFactorShorts") {
    // keys.OPEN_INTEREST_RESERVE_FACTOR,
    // encodeData(["address", "bool"], [marketToken, false]),
    return hashData(["bytes32", "address", "bool"], [keys.OPEN_INTEREST_RESERVE_FACTOR, market.marketToken, false])
  }
  if (key === "minCollateralFactorForOpenInterestMultiplierLong") {
    // keys.MIN_COLLATERAL_FACTOR_FOR_OPEN_INTEREST_MULTIPLIER,
    // encodeData(["address", "bool"], [marketToken, true]),
    return hashData(["bytes32", "address", "bool"], [keys.MIN_COLLATERAL_FACTOR_FOR_OPEN_INTEREST_MULTIPLIER, market.marketToken, true])
  }
  if (key === "minCollateralFactorForOpenInterestMultiplierShort") {
    // keys.MIN_COLLATERAL_FACTOR_FOR_OPEN_INTEREST_MULTIPLIER,
    // encodeData(["address", "bool"], [marketToken, false]),
    return hashData(
      ["bytes32", "address", "bool"], 
      [keys.MIN_COLLATERAL_FACTOR_FOR_OPEN_INTEREST_MULTIPLIER, market.marketToken, false]
    )
  }
  if (key === "maxLongTokenPoolUsdForDeposit") {
    // keys.MAX_POOL_USD_FOR_DEPOSIT,
    // encodeData(["address", "address"], [marketToken, longToken]),
    return hashData(
      ["bytes32", "address", "address"], 
      [keys.MAX_POOL_USD_FOR_DEPOSIT, market.marketToken, market.longToken]
    )
  }
  if (key === "maxShortTokenPoolUsdForDeposit") {
    // keys.MAX_POOL_USD_FOR_DEPOSIT,
    // encodeData(["address", "address"], [marketToken, shortToken]),
    return hashData(
      ["bytes32", "address", "address"], 
      [keys.MAX_POOL_USD_FOR_DEPOSIT, market.marketToken, market.shortToken]
    )
  }
  if (key === "maxOpenInterestForLongs") {
    // keys.MAX_OPEN_INTEREST,
    // encodeData(["address", "bool"], [marketToken, true]),
    return hashData(["bytes32", "address", "bool"], [keys.MAX_OPEN_INTEREST, market.marketToken, true])
  }
  if (key === "maxOpenInterestForShorts") {
    // keys.MAX_OPEN_INTEREST,
    // encodeData(["address", "bool"], [marketToken, false]),
    return hashData(["bytes32", "address", "bool"], [keys.MAX_OPEN_INTEREST, market.marketToken, false])
  }
  if (key === "maxPnlFactorForTradersLongs") {
      // keys.MAX_PNL_FACTOR,
      // encodeData(["bytes32", "address", "bool"], [keys.MAX_PNL_FACTOR_FOR_TRADERS, marketToken, true]),
    return hashData(
      ["bytes32", "bytes32", "address", "bool"], 
      [keys.MAX_PNL_FACTOR, keys.MAX_PNL_FACTOR_FOR_TRADERS, market.marketToken, true]
    )
  }
  if (key === "maxPnlFactorForTradersShorts") {
    // keys.MAX_PNL_FACTOR,
    // encodeData(["bytes32", "address", "bool"], [keys.MAX_PNL_FACTOR_FOR_TRADERS, marketToken, false]),
    return hashData(
      ["bytes32", "bytes32", "address", "bool"], 
      [keys.MAX_PNL_FACTOR, keys.MAX_PNL_FACTOR_FOR_TRADERS, market.marketToken, false]
    )
  }
  if (key === "maxPnlFactorForAdlLongs") {
    // keys.MAX_PNL_FACTOR,
    // encodeData(["bytes32", "address", "bool"], [keys.MAX_PNL_FACTOR_FOR_ADL, marketToken, true]),
    return hashData(
      ["bytes32", "bytes32", "address", "bool"], 
      [keys.MAX_PNL_FACTOR, keys.MAX_PNL_FACTOR_FOR_ADL, market.marketToken, true]
    )
  }
  if (key === "maxPnlFactorForAdlShorts") {
    // keys.MAX_PNL_FACTOR,
    //   encodeData(["bytes32", "address", "bool"], [keys.MAX_PNL_FACTOR_FOR_ADL, marketToken, false]),
    return hashData(
      ["bytes32", "bytes32", "address", "bool"], 
      [keys.MAX_PNL_FACTOR, keys.MAX_PNL_FACTOR_FOR_ADL, market.marketToken, false]
    )
  }
  if (key === "minPnlFactorAfterAdlLongs") {
    // keys.MIN_PNL_FACTOR_AFTER_ADL,
    // encodeData(["address", "bool"], [marketToken, true]),
    return hashData(
      ["bytes32", "address", "bool"], 
      [keys.MIN_PNL_FACTOR_AFTER_ADL, market.marketToken, true]
    )
  }
  if (key === "minPnlFactorAfterAdlShorts") {
    // keys.MIN_PNL_FACTOR_AFTER_ADL,
    // encodeData(["address", "bool"], [marketToken, false]),
    return hashData(
      ["bytes32", "address", "bool"], 
      [keys.MIN_PNL_FACTOR_AFTER_ADL, market.marketToken, false]
    )
  }
  if (key === "maxPnlFactorForDepositsLongs") { 
    // keys.MAX_PNL_FACTOR,
    // encodeData(["bytes32", "address", "bool"], [keys.MAX_PNL_FACTOR_FOR_DEPOSITS, marketToken, true]),
    return hashData(
      ["bytes32", "bytes32", "address", "bool"], 
      [keys.MAX_PNL_FACTOR, keys.MAX_PNL_FACTOR_FOR_DEPOSITS, market.marketToken, true]
    )
  }
  if (key === "maxPnlFactorForDepositsShorts") {  
    // keys.MAX_PNL_FACTOR,
    // encodeData(["bytes32", "address", "bool"], [keys.MAX_PNL_FACTOR_FOR_DEPOSITS, marketToken, false]),
    return hashData(
      ["bytes32", "bytes32", "address", "bool"], 
      [keys.MAX_PNL_FACTOR, keys.MAX_PNL_FACTOR_FOR_DEPOSITS, market.marketToken, false]
    )
  }
  if (key === "maxPnlFactorForWithdrawalsLongs") {
    // keys.MAX_PNL_FACTOR,
    // encodeData(["bytes32", "address", "bool"], [keys.MAX_PNL_FACTOR_FOR_WITHDRAWALS, marketToken, true]), true]),
    return hashData(
      ["bytes32", "bytes32", "address", "bool"], 
      [keys.MAX_PNL_FACTOR, keys.MAX_PNL_FACTOR_FOR_WITHDRAWALS, market.marketToken, true]
    )
  }
  if (key === "maxPnlFactorForWithdrawalsShorts") {
    // keys.MAX_PNL_FACTOR,
    // encodeData(["bytes32", "address", "bool"], [keys.MAX_PNL_FACTOR_FOR_WITHDRAWALS, marketToken, false])
    return hashData(
      ["bytes32", "bytes32", "address", "bool"], 
      [keys.MAX_PNL_FACTOR, keys.MAX_PNL_FACTOR_FOR_WITHDRAWALS, market.marketToken, false]
    )
  }
  if (key === "aboveOptimalUsageBorrowingFactorForLongs") {
    // keys.ABOVE_OPTIMAL_USAGE_BORROWING_FACTOR,
    // encodeData(["address", "bool"], [marketToken, true]),
    return hashData(["bytes32", "address", "bool"], [keys.ABOVE_OPTIMAL_USAGE_BORROWING_FACTOR, market.marketToken, true])
  }
  if (key === "aboveOptimalUsageBorrowingFactorForShorts") {
    // keys.ABOVE_OPTIMAL_USAGE_BORROWING_FACTOR,
    // encodeData(["address", "bool"], [marketToken, false]),
    return hashData(
      ["bytes32", "address", "bool"], 
      [keys.ABOVE_OPTIMAL_USAGE_BORROWING_FACTOR, market.marketToken, false]
    )
  }
  if (key === "baseBorrowingFactorForLongs") {
    // keys.BASE_BORROWING_FACTOR,
    // encodeData(["address", "bool"], [marketToken, true]),
    return hashData(["bytes32", "address", "bool"], [keys.BASE_BORROWING_FACTOR, market.marketToken, true])
  }
  if (key === "baseBorrowingFactorForShorts") {
    // keys.BASE_BORROWING_FACTOR,
    // encodeData(["address", "bool"], [marketToken, false]),
    return hashData(["bytes32", "address", "bool"], [keys.BASE_BORROWING_FACTOR, market.marketToken, false])
  }
  if (key === "optimalUsageFactorForLongs") {
    // keys.OPTIMAL_USAGE_FACTOR,
    // encodeData(["address", "bool"], [marketToken, true]),
    return hashData(["bytes32", "address", "bool"], [keys.OPTIMAL_USAGE_FACTOR, market.marketToken, true])
  }
  if (key === "optimalUsageFactorForShorts") {
    // keys.OPTIMAL_USAGE_FACTOR,
    // encodeData(["address", "bool"], [marketToken, false]),
    return hashData(["bytes32", "address", "bool"], [keys.OPTIMAL_USAGE_FACTOR, market.marketToken, false])
  }
  if (key === "borrowingFactorForLongs") {
    // keys.BORROWING_FACTOR,
    // encodeData(["address", "bool"], [marketToken, true]),
    return hashData(["bytes32", "address", "bool"], [keys.BORROWING_FACTOR, market.marketToken, true])
  }
  if (key === "borrowingFactorForShorts") {
    // keys.BORROWING_FACTOR,
    //     encodeData(["address", "bool"], [marketToken, false]),
    return hashData(["bytes32", "address", "bool"], [keys.BORROWING_FACTOR, market.marketToken, false])
  }
  if (key === "borrowingExponentFactorForLongs") {
    // keys.BORROWING_EXPONENT_FACTOR,
    //     encodeData(["address", "bool"], [marketToken, true]),
    return hashData(["bytes32", "address", "bool"], [keys.BORROWING_EXPONENT_FACTOR, market.marketToken, true])
  }
  if (key === "borrowingExponentFactorForShorts") {
    // keys.BORROWING_EXPONENT_FACTOR,
    // encodeData(["address", "bool"], [marketToken, false]),
    return hashData(["bytes32", "address", "bool"], [keys.BORROWING_EXPONENT_FACTOR, market.marketToken, false])
  }
  return undefined

}

// Параметр рынка minCollateralFactor: 10000000000000000000000000000n
// Параметр рынка minCollateralFactorForOpenInterestMultiplier: 0
// Параметр рынка reserveFactor: 950000000000000000000000000000n
// key --------------------------------------------------------- markets[key] 950000000000000000000000000000n
// Параметр рынка openInterestReserveFactor: 900000000000000000000000000000n
// key --------------------------------------------------------- markets[key] 900000000000000000000000000000n
// Параметр рынка maxPnlFactorForTraders: 900000000000000000000000000000n
// key --------------------------------------------------------- markets[key] 900000000000000000000000000000n
// Параметр рынка maxPnlFactorForAdl: 850000000000000000000000000000n
// key --------------------------------------------------------- markets[key] 850000000000000000000000000000n
// Параметр рынка minPnlFactorAfterAdl: 770000000000000000000000000000n
// key --------------------------------------------------------- markets[key] 770000000000000000000000000000n
// Параметр рынка maxPnlFactorForDeposits: 900000000000000000000000000000n
// key --------------------------------------------------------- markets[key] 900000000000000000000000000000n
// Параметр рынка maxPnlFactorForWithdrawals: 700000000000000000000000000000n
// key --------------------------------------------------------- markets[key] 700000000000000000000000000000n
// Параметр рынка positionFeeFactorForPositiveImpact: 500000000000000000000000000n
// Параметр рынка positionFeeFactorForNegativeImpact: 700000000000000000000000000n
// Параметр рынка negativePositionImpactFactor: 100000000000000000000000n
// Параметр рынка positivePositionImpactFactor: 50000000000000000000000n
// Параметр рынка positionImpactExponentFactor: 2000000000000000000000000000000n
// Параметр рынка negativeMaxPositionImpactFactor: 5000000000000000000000000000n
// Параметр рынка positiveMaxPositionImpactFactor: 5000000000000000000000000000n
// Параметр рынка maxPositionImpactFactorForLiquidations: 0n
// Параметр рынка swapFeeFactorForPositiveImpact: 500000000000000000000000000n
// Параметр рынка swapFeeFactorForNegativeImpact: 700000000000000000000000000n
// Параметр рынка atomicSwapFeeFactor: 5000000000000000000000000000n
// Параметр рынка negativeSwapImpactFactor: 10000000000000000000000000n
// Параметр рынка positiveSwapImpactFactor: 5000000000000000000000000n
// Параметр рынка swapImpactExponentFactor: 2000000000000000000000000000000n
// Параметр рынка minCollateralUsd: 1000000000000000000000000000000n
// Параметр рынка borrowingFactor: 6250000000000000000000n
// Параметр рынка optimalUsageFactor: 0
// Параметр рынка baseBorrowingFactor: 0
// Параметр рынка aboveOptimalUsageBorrowingFactor: 0
// Параметр рынка borrowingExponentFactor: 1000000000000000000000000000000n
// Параметр рынка fundingFactor: 20000000000000000000000n
// Параметр рынка fundingExponentFactor: 1000000000000000000000000000000n
// Параметр рынка fundingIncreaseFactorPerSecond: 0
// Параметр рынка fundingDecreaseFactorPerSecond: 0
// Параметр рынка thresholdForStableFunding: 0
// Параметр рынка thresholdForDecreaseFunding: 0
// Параметр рынка minFundingFactorPerSecond: 0
// Параметр рынка maxFundingFactorPerSecond: 100000000000000000000000n
// Параметр рынка positionImpactPoolDistributionRate: 0n
// Параметр рынка minPositionImpactPoolAmount: 0
// Параметр рынка reserveFactorLongs: 950000000000000000000000000000n
// Параметр рынка reserveFactorShorts: 950000000000000000000000000000n
// Параметр рынка openInterestReserveFactorLongs: 900000000000000000000000000000n
// Параметр рынка openInterestReserveFactorShorts: 900000000000000000000000000000n
// Параметр рынка minCollateralFactorForOpenInterestMultiplierLong: 0
// Параметр рынка minCollateralFactorForOpenInterestMultiplierShort: 0
// Параметр рынка maxLongTokenPoolUsdForDeposit: undefined
// Параметр рынка maxShortTokenPoolUsdForDeposit: undefined
// Параметр рынка maxOpenInterestForLongs: undefined
// Параметр рынка maxOpenInterestForShorts: undefined
// Параметр рынка maxPnlFactorForTradersLongs: 900000000000000000000000000000n
// Параметр рынка maxPnlFactorForTradersShorts: 900000000000000000000000000000n
// Параметр рынка maxPnlFactorForAdlLongs: 850000000000000000000000000000n
// Параметр рынка maxPnlFactorForAdlShorts: 850000000000000000000000000000n
// Параметр рынка minPnlFactorAfterAdlLongs: 770000000000000000000000000000n
// Параметр рынка minPnlFactorAfterAdlShorts: 770000000000000000000000000000n
// Параметр рынка maxPnlFactorForDepositsLongs: 900000000000000000000000000000n
// Параметр рынка maxPnlFactorForDepositsShorts: 900000000000000000000000000000n
// Параметр рынка maxPnlFactorForWithdrawalsLongs: 700000000000000000000000000000n
// Параметр рынка maxPnlFactorForWithdrawalsShorts: 700000000000000000000000000000n
// Параметр рынка aboveOptimalUsageBorrowingFactorForLongs: 0
// Параметр рынка aboveOptimalUsageBorrowingFactorForShorts: 0
// Параметр рынка baseBorrowingFactorForLongs: 0
// Параметр рынка baseBorrowingFactorForShorts: 0
// Параметр рынка optimalUsageFactorForLongs: 0
// Параметр рынка optimalUsageFactorForShorts: 0
// Параметр рынка borrowingFactorForLongs: 6250000000000000000000n
// Параметр рынка borrowingFactorForShorts: 6250000000000000000000n
// Параметр рынка borrowingExponentFactorForLongs: 1000000000000000000000000000000n
// Параметр рынка borrowingExponentFactorForShorts: 1000000000000000000000000000000n

function addToConfigOrDataStore(
  key: string, 
  value: bigint, 
  market: any, 
  dataStore: any, 
  method: string
) {
  let fullKey = getFullKey(key, market)
  if (fullKey !== undefined && method !== undefined) {
    addToDataStore(fullKey, value, dataStore, method)
  }
}
