import { ethers } from "hardhat";
import hre from "hardhat";

import ExchangeRouterModule from "../ignition/modules/exchangeRouter3" 


async function testsFuncAsync() {

const provider = new ethers.JsonRpcProvider(`http://127.0.0.1:8545/`)

const privateKeySepAcc = '0x59c6995e998f97a5a0044966f0945389dc9e86dae88c7a8412f4603b6b78690d'

const wallet1 = new ethers.Wallet(privateKeySepAcc, provider)

const wallet1WithProvider = wallet1.connect(provider)

console.log(`Wallet 1: ${ethers.formatEther(await provider.getBalance(wallet1WithProvider))} ETH`)

const {
    roleStore,
    dataStore,
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
} = await hre.ignition.deploy(ExchangeRouterModule);


console.log(Date.now())

const receiptGrantRole = await roleStore.grantRole(
    wallet1WithProvider.address, 
    "0x97adf037b2472f4a6a9825eff7d2dd45e37f2dc308df2a260d6a72af4189a65b")
const receiptGrantRoleTx = await receiptGrantRole.wait()
console.log("receiptGrantRoleTx=============================>", receiptGrantRoleTx)




// console.log(`Баланс GLV токенов: ${glvBalanceFormatted} GLV`)


}

testsFuncAsync().
then(() => process.exit(0)).
catch((e) => {
    console.error(e);
    process.exit(1)
})

// npx hardhat run scripts/GMXLocalInit.ts --network localhost 

// 0x70997970c51812dc3a010c7d01b50e0d17dc79c89798999897989998
// 0x3 70997970c51812dc3a010c7d01b50e0d17dc79c8
