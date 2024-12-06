import { buildModule } from "@nomicfoundation/hardhat-ignition/modules";
import { ethers } from "hardhat";

const RoleAndDataStoresModule = buildModule("RoleAndDataStores", (m) => { 
    const _owner = m.getAccount(0);
    const _admin = m.getAccount(1);

    const roleStore = m.contract("RoleStore", [], {from: _owner});
    const dataStore = m.contract("DataStore", [roleStore], {from: _owner});
    // const wnt = m.contract("WETH", [], {from: _owner});
    return {
        roleStore,
        dataStore,
        // wnt
    };
});

export default RoleAndDataStoresModule;
