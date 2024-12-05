// ОТКРЫТИЕ ШОРТ ПОЗИЦИЙ
import { ethers, JsonRpcProvider } from 'ethers';
import 'dotenv/config'; 

import ExchangeRouterJson from './gmx-synthetics/deployments/arbitrum/ExchangeRouter.json';
import RouterJson from './gmx-synthetics/deployments/arbitrum/Router.json';
import OrderVaultJson from './gmx-synthetics/deployments/arbitrum/OrderVault.json';
import ReaderJson from "./gmx-synthetics/deployments/arbitrum/Reader.json"
import dataStore from "./gmx-synthetics/deployments/arbitrum/DataStore.json"


const ROUTER_ADDRESS = RouterJson.address; 
const ROUTER_ABI = RouterJson.abi;

const READER_ADDRESS = ReaderJson.address;
const READER_ABI = ReaderJson.abi;

const DATA_STORE_ADDRESS = dataStore.address;

const privateKey = process.env.PRIVATE_KEY;
const ARBITRUM_RPC = 'https://arb-mainnet.g.alchemy.com/v2/_75NBUSjVYDRzy5PEM0AwQccB9DwVLxR';
const provider = new JsonRpcProvider(ARBITRUM_RPC);

const USDC_ADDRESS = '0xaf88d065e77c8cC2239327C5EDb3A432268e5831'; // USDC 

const EXCHANGE_ROUTER_ADDRESS = ExchangeRouterJson.address; 
const EXCHANGE_ROUTER_ABI = ExchangeRouterJson.abi;

const ORDER_VAULT_ADDRESS = OrderVaultJson.address;

async function main() {
  const wallet = new ethers.Wallet(privateKey, provider);

  await showBalance(wallet);

  await createOrder({
    wallet,
  });

  // // читаем позиции с нашего кошелька
  const readerContract = new ethers.Contract(READER_ADDRESS, READER_ABI, provider);
  const positions = await readerContract.getAccountOrders(DATA_STORE_ADDRESS, wallet.address, 0, 100);
  positions.forEach((position: any) => {
    console.log(`Позиция: ${position}`);
  });
}

export async function showBalance(wallet) {
  const usdcAbi = ['function balanceOf(address owner) view returns (uint256)'];
  const usdcContract = new ethers.Contract(USDC_ADDRESS, usdcAbi, wallet);
  const usdcBalance = await usdcContract.balanceOf(wallet.address);
  console.log(`USDC Balance: ${ethers.formatUnits(usdcBalance, 6)} USDC`);

  const ethBalance = await provider.getBalance(wallet.address);
  console.log(`ETH Balance: ${ethers.formatUnits(ethBalance, 18)} ETH`);
}



async function createOrder({
  wallet,
}) {
  const MARKET_ADDRESS = '0x70d95587d40A2caf56bd97485aB3Eec10Bee6336';

  const exchangeRouterWallet = new ethers.Contract(EXCHANGE_ROUTER_ADDRESS, EXCHANGE_ROUTER_ABI, wallet);
  const exchangeRouterInterface = new ethers.Interface(EXCHANGE_ROUTER_ABI);

  await aproveToken({
    wallet,
    approveAmount: ethers.parseUnits('3', 6), // Одобряем 3 USDC
    address: ROUTER_ADDRESS,
  })

  const fee  = ethers.parseUnits('0.001', 18); // 0.001 ETH
  console.log(`Fee: ${ethers.formatUnits(fee, 18)} ETH`);

  // Параметры ордера
  const createOrderParams = {
    addresses: {
      receiver: wallet.address,
      cancellationReceiver: ethers.ZeroAddress,
      callbackContract: ethers.ZeroAddress,
      uiFeeReceiver: ethers.ZeroAddress,
      market: MARKET_ADDRESS,
      initialCollateralToken: USDC_ADDRESS,
      swapPath: [],
    },
    numbers: {
      sizeDeltaUsd: ethers.parseUnits('5', 30),
      initialCollateralDeltaAmount: 0,
      triggerPrice: 0, 
      acceptablePrice: 0,
      executionFee: fee,
      callbackGasLimit: 0,
      minOutputAmount: 0,
      validFromTime: 0,
    },
    orderType: 2,
    decreasePositionSwapType: 0,
    isLong: false,
    shouldUnwrapNativeToken: false,
    autoCancel: false,
    referralCode:ethers.encodeBytes32String(''),
  };


  //sentWnt
  const sentWnt = exchangeRouterInterface.encodeFunctionData('sendWnt', [
    ORDER_VAULT_ADDRESS,
    fee,
  ]);

  //sendTokens
  const sendTokens = exchangeRouterInterface.encodeFunctionData('sendTokens', [
    USDC_ADDRESS,
    ORDER_VAULT_ADDRESS,
    ethers.parseUnits('3', 6),
  ]);

  //createOrder
  const createOrderCalldata = exchangeRouterInterface.encodeFunctionData('createOrder', [
    createOrderParams,
  ]);
  

  const tx = await exchangeRouterWallet.multicall([sentWnt, sendTokens, createOrderCalldata], {
    value: fee,
  });

  console.log(`Transaction hash: ${tx.hash}`);
  await tx.wait();
  console.log('Short position opened successfully');
}

async function aproveToken({
  wallet, 
  approveAmount,
  address,
}) {
  const collateralTokenAbi = [
    'function approve(address spender, uint256 amount) public returns (bool)',
  ];
  const collateralToken = new ethers.Contract(USDC_ADDRESS, collateralTokenAbi, wallet);

  const approveTx = await collateralToken.approve(address, approveAmount);
  await approveTx.wait();
  console.log('Tokens approved', approveTx);
}

main().catch((error) => {
  console.error(error);
  process.exit(1);
});
