import { buildModule } from "@nomicfoundation/hardhat-ignition/modules";
import { ethers } from "hardhat";
import RoleAndDataStoresModule from "./roleAndDataStores";
const TokensDeployModule = buildModule("TokensDeployment", (m) => {
  const _owner = m.getAccount(0);
  const _admin = m.getAccount(1);

  const signatureChecker = m.library("SignatureChecker");

    // const roleStore = m.contract("RoleStore", [], {from: _owner});
    // const dataStore = m.contract("DataStore", [roleStore], {from: _owner});

  const { roleStore, dataStore } = m.useModule(RoleAndDataStoresModule);
  // aeWETH
  const weth = m.contract("aeWETH", [], {from: _owner});
  // m.call(weth, "initialize", [
  //   "",
  //   "",
  //   18,
  //   "0x0000000000000000000000000000000000000001",
  //   "0x0000000000000000000000000000000000000001",
  // ]);
  const proxyAdmin = m.contract("ProxyAdmin", [], {from: _owner});
  const transparentUpgradeableProxy = m.contract("TransparentUpgradeableProxy", 
    [
      weth,
      proxyAdmin,
      "0x",
    ], {from: _owner});
  const weth1 = m.contractAt("aeWETH", transparentUpgradeableProxy, {id: "weth1_initialize"});
  m.call(weth1, "initialize", [
    "Wrapped Ether",
    "WETH",
    18,
    // transparentUpgradeableProxy ====> 
    // L2WethGateway =====> 
    // transparentUpgradeableProxy
    // ====> L2GatewayRouter(implementation) ====>
    "0x0000000000000000000000000000000000000001", 
    "0x0000000000000000000000000000000000000001",
  ]);                                                                              

  // FiatTokenV2_2
  const usdc = m.contract("FiatTokenV2_2", [], {
    libraries: {
      SignatureChecker: signatureChecker,    
    }, 
    from: _owner});
  // m.call(usdc, "initializeV2_2", [
  //   [],
  //   "",
  // ]);
  const fiatTokenProxy = m.contract("FiatTokenProxy", [usdc], {from: _admin});

  const usdc1 = m.contractAt("FiatTokenV2_2", fiatTokenProxy, {id: "usdc1_initialize"});

  const masterMinter = m.contract("MasterMinter", [fiatTokenProxy], {from: _owner});
  const pauser = m.getAccount(2);
  const blacklister = m.getAccount(2);
  const owner = _owner;
  m.call(usdc1, "initializeV2_2", [
    [],
    "USDC",
  ], {from: _owner});
  m.call(usdc1, "initializeV2_1", [
    _owner,
  ], {from: _owner});
  m.call(usdc1, "initializeV2", [
    "USD Coin",
  ], {from: _owner});
  m.call(usdc1, "initialize", [
    "USD Coin",
    "USDC",
    "USD",
    6,
    masterMinter,
    pauser,
    blacklister,
    owner,
  ], {from: _owner});

  // MarketToken
  const marketToken = m.contract("MarketToken", [roleStore, dataStore], {from: _owner});

  // const receiptGrantRole = await roleStore.grantRole(
  //   wallet1WithProvider.address, 
  //   "0x97adf037b2472f4a6a9825eff7d2dd45e37f2dc308df2a260d6a72af4189a65b")

  m.call(roleStore, "grantRole", [
    _owner,
    "0x97adf037b2472f4a6a9825eff7d2dd45e37f2dc308df2a260d6a72af4189a65b",
  ]);

  m.call(marketToken, "mint", [
    _owner,
    "1000000000000000000000000",
  ]);

  m.call(usdc1, "configureMinter", [
    _owner,
    "10000000000000000000000000",
  ]);

  m.call(usdc1, "mint", [
    _owner,
    "1000000000000000000000000",
  ], {from: _owner});

  m.call(weth1, "bridgeMint", [
    _owner,
    "1000000000000000000000000",
  ], {from: _owner});

  return {
    roleStore,
    dataStore,
    weth1,
    usdc1,
    marketToken,
  };
});

export default TokensDeployModule;

//! npx hardhat ignition deploy ignition/modules/deployTokens.ts --network localhost


// initial args:
// FiatTokenProxy
// 0000000000000000000000000f4fb9474303d10905ab86aa8d5a65fe44b6e04a

// -----Decoded View---------------
// Arg [0] : implementationContract (address): 0x0f4fb9474303d10905AB86aA8d5A65FE44b6E04A

// -----Encoded View---------------
// 1 Constructor Arguments found :
// Arg [0] : 0000000000000000000000000f4fb9474303d10905ab86aa8d5a65fe44b6e04a

// TransparentUpgradeableProxy
//0000000000000000000000008b194beae1d3e0788a1a35173978001acdfba668000000000000000000000000d570ace65c43af47101fc6250fd6fc63d1c22a86000000000000000000000000000000000000000000000000000000000000006000000000000000000000000000000000000000000000000000000000000000000000

// -----Decoded View---------------
// Arg [0] : _logic (address): 0x8b194bEae1d3e0788A1a35173978001ACDFba668
// Arg [1] : admin_ (address): 0xd570aCE65C43af47101fC6250FD6fC63D1c22a86
// Arg [2] : _data (bytes): 0x

// -----Encoded View---------------
