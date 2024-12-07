// Продажа GM токенов
import { ethers, JsonRpcProvider } from 'ethers';
import 'dotenv/config'; 

import ExchangeRouterJson from './gmx-synthetics/deployments/arbitrum/ExchangeRouter.json';
import RouterJson from './gmx-synthetics/deployments/arbitrum/Router.json';
import WithdrawaltVault from './gmx-synthetics/deployments/arbitrum/WithdrawalVault.json';

const ROUTER_ADDRESS = RouterJson.address; 

const privateKey = process.env.PRIVATE_KEY;
const ARBITRUM_RPC = 'https://arb-mainnet.g.alchemy.com/v2/_75NBUSjVYDRzy5PEM0AwQccB9DwVLxR';
const provider = new JsonRpcProvider(ARBITRUM_RPC);

const USDC_ADDRESS = '0xaf88d065e77c8cC2239327C5EDb3A432268e5831';

const EXCHANGE_ROUTER_ADDRESS = ExchangeRouterJson.address; 
const EXCHANGE_ROUTER_ABI = ExchangeRouterJson.abi;

const MARKET_ADDRESS = '0x70d95587d40A2caf56bd97485aB3Eec10Bee6336'; // also token address

const WINTHDRAWAL_VAULT_ADDRESS = WithdrawaltVault.address;

async function main() {
  const wallet = new ethers.Wallet(privateKey, provider);

  await showBalance(wallet);

  await createDeposit({
    wallet,
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


async function createDeposit({
  wallet,
}) {
  const exchangeRouterWallet = new ethers.Contract(EXCHANGE_ROUTER_ADDRESS, EXCHANGE_ROUTER_ABI, wallet);
  const exchangeRouterInterface = new ethers.Interface(EXCHANGE_ROUTER_ABI);


  await aproveToken({
    wallet,
    approveAmount: ethers.parseUnits('1', 77), // Одобряем 1 GM
    address: ROUTER_ADDRESS,
  })

  const fee  = ethers.parseUnits('0.001', 18);
  console.log(`Fee: ${ethers.formatUnits(fee, 18)} ETH`);


  //sentWnt
  const sentWnt = exchangeRouterInterface.encodeFunctionData('sendWnt', [
    WINTHDRAWAL_VAULT_ADDRESS,
    fee,
  ]);

  //sendTokens
  const sendTokens = exchangeRouterInterface.encodeFunctionData('sendTokens', [
    MARKET_ADDRESS,
    WINTHDRAWAL_VAULT_ADDRESS,
    ethers.parseUnits('1', 18),
  ]);

  //create Withdrawal
  const createWithdrawal = exchangeRouterInterface.encodeFunctionData('createWithdrawal', [
    {
        receiver: wallet.address,
        callbackContract: ethers.ZeroAddress,
        uiFeeReceiver: ethers.ZeroAddress,
        market: MARKET_ADDRESS,
        longTokenSwapPath: [], 
        shortTokenSwapPath: [],
        minLongTokenAmount: "233971352570968",
        minShortTokenAmount: "912602",
        shouldUnwrapNativeToken: true,
        executionFee: fee,
        callbackGasLimit:"0",
      },
  ]);
  

  const tx = await exchangeRouterWallet.multicall([sentWnt, sendTokens, createWithdrawal], {
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
  const marketTokenAbi = [
    'function approve(address spender, uint256 amount) public returns (bool)',
  ];
  const collateralToken = new ethers.Contract(MARKET_ADDRESS, marketTokenAbi, wallet);

  const approveTx = await collateralToken.approve(address, approveAmount);
  await approveTx.wait();
  console.log('Tokens approved', approveTx);
}

main().catch((error) => {
  console.error(error);
  process.exit(1);
});
