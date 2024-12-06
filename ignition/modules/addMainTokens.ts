import { buildModule } from "@nomicfoundation/hardhat-ignition/modules";
import { ethers } from "hardhat";
import { AbiCoder, keccak256, getBytes } from "ethers";
import MarketTokenArtifact from "../../artifacts/contracts/ExchangeRouter/contracts/market/MarketToken.sol/MarketToken.json"; 
import { calculateCreate2 } from "eth-create2-calculator";  


const AddMainTokensModule = buildModule("AddMainTokens", (m) => { 
    const _owner = m.getAccount(0);
    const _admin = m.getAccount(1);



    //* GMX: {
    //     address: "0xfc5A1A6EB076a2C7aD06eD22C90d7E710E35ad0a",
    //     decimals: 18,
    //     transferGasLimit: 200 * 1000,
    //     dataStreamFeedId: "0x0003169a4ebb9178e5ec6281913d1a8a4f676f414c94b60a4cb2e432f9081c60",
    //     dataStreamFeedDecimals: 18,
    //     oracleTimestampAdjustment: 1,
    //     priceFeed: {
    //       address: "0xDB98056FecFff59D032aB628337A4887110df3dB",
    //       decimals: 8,
    //       heartbeatDuration: (24 + 1) * 60 * 60,
    //     },
    //   },

    //* WETH: {
    //     address: "0x82aF49447D8a07e3bd95BD0d56f35241523fBab1",
    //     decimals: 18,
    //     wrappedNative: true,
    //     transferGasLimit: 200 * 1000,
    //     dataStreamFeedId: "0x000362205e10b3a147d02792eccee483dca6c7b44ecce7012cb8c6e0b68b3ae9",
    //     dataStreamFeedDecimals: 18,
    //     priceFeed: {
    //       address: "0x639Fe6ab55C921f74e7fac1ee960C0B6293ba612",
    //       decimals: 8,
    //       heartbeatDuration: (24 + 1) * 60 * 60,
    //     },
    //   },

    //* USDC: {
    //     address: "0xaf88d065e77c8cC2239327C5EDb3A432268e5831",
    //     decimals: 6,
    //     transferGasLimit: 200 * 1000,
    //     dataStreamFeedId: "0x00038f83323b6b08116d1614cf33a9bd71ab5e0abf0c9f1b783a74a43e7bd992",
    //     dataStreamFeedDecimals: 18,
    //     priceFeed: {
    //       address: "0x50834F3163758fcC1Df9973b6e91f0F0F0434aD3",
    //       decimals: 8,
    //       heartbeatDuration: (24 + 1) * 60 * 60,
    //       stablePrice: decimalToFloat(1),
    //     },
    //   },

    //* USDT: {
    //     address: "0xFd086bC7CD5C481DCC9C85ebE478A1C0b69FCbb9",
    //     decimals: 6,
    //     transferGasLimit: 200 * 1000,
    //     dataStreamFeedId: "0x0003a910a43485e0685ff5d6d366541f5c21150f0634c5b14254392d1a1c06db",
    //     dataStreamFeedDecimals: 18,
    //     oracleTimestampAdjustment: 1,
    //     priceFeed: {
    //       address: "0x3f3f5dF88dC9F13eac63DF89EC16ef6e7E25DdE7",
    //       decimals: 8,
    //       heartbeatDuration: (24 + 1) * 60 * 60,
    //       stablePrice: decimalToFloat(1),
    //     },
    //   },

    const ethUsdMarketAddress = getMarketTokenAddress(
        wnt.address,
        wnt.address,
        usdc.address,
        DEFAULT_MARKET_TYPE,
        marketFactory.address,
        roleStore.address,
        dataStore.address
      );
      const ethUsdMarket = await reader.getMarket(dataStore.address, ethUsdMarketAddress);

    
    
    return {

    };
});

export default AddMainTokensModule;


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