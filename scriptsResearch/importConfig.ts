import { HardhatRuntimeEnvironment } from "hardhat/types";
import  getConfig from "../config/general";
import getMarkets from "../config/markets";
import getTokens from "../config/tokens";
import getOracle from "../config/oracle";
import getRoles from "../config/roles";
import { ethers } from "hardhat";
import hre from "hardhat";
import { MAX_SWAP_PATH_LENGTH, tokenTransferGasLimit } from "../utils/keys";
// import { hashString, hashData } from "../utils/hash";
import LibrariesModule3 from "../ignition/modules/LibrariesModule3";
import { getMarketTokenAddress, DEFAULT_MARKET_TYPE } from "../utils/market";


import ExchangeRouterModule from "../ignition/modules/exchangeRouter4" 
import AddResearchModule from "../ignition/modules/addResearch"
import { buildModule } from "@nomicfoundation/hardhat-ignition/modules";
import { AbiCoder, keccak256, getBytes } from "ethers";
import MarketTokenArtifact from "../artifacts/contracts/ExchangeRouter/contracts/market/MarketToken.sol/MarketToken.json"; 
import { calculateCreate2 } from "eth-create2-calculator"; 
import TokensDeployModule from "../ignition/modules/deployTokens";
import { updateGeneralConfig } from "../scripts/updateGeneralConfigUtils";

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




    const markets = await getMarkets(hre);
    const tokensList = await getTokens(hre);
    const oracleConfig = await getOracle(hre);
    const configGeneral = await getConfig(hre);
    const rolesConfig = await getRoles(hre);

    console.log("\n=== Итерация по ролям ===")
    for (const [key, value] of Object.entries(rolesConfig)) {
        console.log(`Параметр роли ${key}:`, value);
        const GrantRoleOwner = await roleStore.grantRole(
            wallet1WithProvider, 
            hashString(typeof key === 'string' ? key.toUpperCase() : JSON.stringify(key).toUpperCase())
        )
        await GrantRoleOwner.wait()
        // console.log("GrantRoleOwner", key.toUpperCase(), "CONFIG_KEEPER")
        // if (key === "CONFIG_KEEPER" || key === "CONTROLLER") {
        console.log(
          "0x97adf037b2472f4a6a9825eff7d2dd45e37f2dc308df2a260d6a72af4189a65b", "\n",
          "0x901fb3de937a1dcb6ecaf26886fda47a088e74f36232a0673eade97079dc225b", "\n",
           key.toUpperCase(), "\n",
           hashString(key.toUpperCase()),
           hashData(["string"], [key.toUpperCase()])
        )
        // }
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

    console.log("\n=== Итерация по токенам ==================================================================")
    Object.entries(tokensList).forEach(([key, value]) => {
        console.log(`Токен ${key}:`, value);
    });

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
    // Если нужны только ключи
    Object.entries(markets).forEach(([key, value]) => {
        // console.log(`Параметр рынка ${key}:`, value);
    });

    console.log("\n=== Итерация по конфигу ==================================================================")
    let encodeDatas = [];
    // Object.entries(configGeneral).forEach(([key, value]) => {
    for (const [key, value] of Object.entries(configGeneral)) {
        console.log("key", key, typeof key, camelToSnakeCase(key))
        console.log(hashString(camelToSnakeCase(key)))

      // if (
      //     key === "holdingAddress" || 
      //     key === "feeReceiver" || 
      //     key === "sequencerUptimeFeed" || 
      //     key === "sequencerGraceDuration" || 
      //     key === "maxUiFeeFactor" || 
      //     key === "maxAutoCancelOrders" || 
      //     key === "maxTotalCallbackGasLimitForAutoCancelOrders" || 
      //     key === "minHandleExecutionErrorGas" || 
      //     key === "minHandleExecutionErrorGasToForward" || 
      //     key === "minAdditionalGasForExecution" || 
      //     key === "refundExecutionFeeGasLimit" || 
      //     key === "depositGasLimit" || 
      //     key === "shiftGasLimit" || 
      //     key === "withdrawalGasLimit" || 
      //     key === "singleSwapGasLimit" || 
      //     key === "increaseOrderGasLimit" || 
      //     key === "decreaseOrderGasLimit" || 
      //     key === "swapOrderGasLimit" || 
      //     key === "glvPerMarketGasLimit" || 
      //     key === "glvDepositGasLimit" || 
      //     key === "glvWithdrawalGasLimit" || 
      //     key === "glvShiftGasLimit" || 
      //     key === "glvLiquidationGasLimit" || 
      //     key === "glvOrderGasLimit" || 
      //     key === "glvIncreaseOrderGasLimit" || 
      //     key === "glvDecreaseOrderGasLimit" || 
      //     key === "glvSwapOrderGasLimit" || 
      //     key === "glvLiquidationGasLimit" || 
      //     key === "glvShiftGasLimit" || 
      //     key === "glvWithdrawalGasLimit" || 
      //     key === "glvDepositGasLimit" || 
      //     key === "glvPerMarketGasLimit" ||
      //     key === "tokenTransferGasLimit" ||
      //     key === "nativeTokenTransferGasLimit" ||
      //     key === "estimatedGasFeeBaseAmount"   ||
      //     key === "estimatedGasPerOraclePrice" ||
      //     key === "estimatedGasFeeMultiplierFactor"  ||
      //     key === "executionGasFeeBaseAmount" ||
      //     key === "executionGasPerOraclePrice" ||
      //     key === "executionGasFeeMultiplierFactor" ||
      //     key === "executionGasFeeBaseAmount" ||
      //     key === "executionGasPerOraclePrice" ||
      //     key === "executionGasFeeMultiplierFactor" || 
      //     key === "requestExpirationTime" ||
      //     key === "maxSwapPathLength" || 
      //     key === "maxCallbackGasLimit" ||
      //     key === "maxTotalCallbackGasLimitForAutoCancelOrders" ||
      //     key === "minHandleExecutionErrorGas" ||
      //     key === "minHandleExecutionErrorGasToForward" ||
      //     key === "minAdditionalGasForExecution" ||
      //     key === "refundExecutionFeeGasLimit"
      //   ) {
      //       console.log("continue") 
 
      //       continue;
      //   }


        // await dataStore["setUint256"](convertedKey, convertedValue)
        const {method, convertedKey, convertedValue} = getMethod(key, value)
        if (method === undefined) {
            continue;
        }
        console.log("method", 
          await roleStore.hasRole(
            "70997970c51812dc3a010c7d01b50e0d17dc79c8", 
            "0x901fb3de937a1dcb6ecaf26886fda47a088e74f36232a0673eade97079dc225b"
          ), 
          await roleStore.hasRole(
            "70997970c51812dc3a010c7d01b50e0d17dc79c8", 
            "0xb49beded4d572a2d32002662fc5c735817329f4337b3a488aab0b5e835c01ba7"
          )
        )
// type MethodName = 'setUint' | 'setBytes32' | 'setAddress' | 'setBool' | 'setString';

        // const configMethods: Record<MethodName, (convertedKey: any, convertedValue: any) => Promise<void>> = {
        //   setUint: (convertedKey: any, convertedValue: any) => config.setUint(convertedKey, "0x", convertedValue),
        //   setBytes32: (convertedKey: any, convertedValue: any) => config.setBytes32(convertedKey,"0x", convertedValue),
        //   setAddress: (convertedKey: any, convertedValue: any) => config.setAddress(convertedKey, "0x", convertedValue),
        //   setBool: (convertedKey: any, convertedValue: any) => config.setBool(convertedKey, "0x", convertedValue),
        //   setString: (convertedKey: any, convertedValue: string) => config.setString(convertedKey, "0x", convertedValue),
        // };
        
        // const methodName = 'setUint';
        // configMethods[methodName](convertedKey, convertedValue as any); // "Hello"
        // const nonce = await provider.getTransactionCount(wallet1WithProvider.address);
        // console.log("nonce ============================================>", nonce)
        // const data = await config.setAddress.populateTransaction(convertedKey, "0x", convertedValue).then(tx => tx.data);
        // console.log("data", data)
        // const configAddress = await config.getAddress();
        // console.log(
        //   "configAddress", "\n",
        //   config.interface.encodeFunctionData(method, [convertedKey, "0x", convertedValue])
        // )
        // await wallet1WithProvider.sendTransaction({
        //   to: configAddress,
        //   data: config.interface.encodeFunctionData(method, [convertedKey, "0x", convertedValue])
        // });
        const setGeneralConfig = await config.multicall(
          [
            config.interface.encodeFunctionData("setAddress", [convertedKey, "0x", convertedValue])
          ],
          {
            from: wallet1WithProvider.address
          }
        );
    const resultTx = await setGeneralConfig.wait();

        // try {
        //   await wallet1WithProvider.sendTransaction({
        //     to: await config.getAddress(),
        //     data: config.interface.encodeFunctionData(method, [convertedKey, "0x", convertedValue])
        //   });
        // } catch (error)
        //   {
        //     console.log("Основной метод не сработал, пробуем запасной");
        //     try { 
        //       await wallet1WithProvider.sendTransaction({
        //         to: await dataStore.getAddress(),
        //         data: dataStore.interface.encodeFunctionData(method, [convertedKey, convertedValue])
        //       });
        //     } catch (error) {
        //       console.log("Запасной метод тоже не сработал");
        //     }
        // }
        // console.log("==================================================================", 
        //                     convertedKey, "\n",
        //                     key, "\n",
        //                     typeof value, "\n",
        //                     value, "\n",
        //                     convertedValue,
        //                     method
        //                 );
                        // setUint(bytes32 key, uint256 value)
        encodeDatas.push(config.interface.encodeFunctionData(method, [convertedKey, "0x", convertedValue]))
    };
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

//! npx hardhat run scriptsResearch/importConfig.ts --network localhost  > outputImportConfig.log 2>&1 

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