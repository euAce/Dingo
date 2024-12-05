// ПОКУПКА GM токенов
import { ethers, JsonRpcProvider } from 'ethers';
import 'dotenv/config'; 

import ExchangeRouterJson from './gmx-synthetics/deployments/arbitrum/ExchangeRouter.json';
import RouterJson from './gmx-synthetics/deployments/arbitrum/Router.json';
import DepositVault from './gmx-synthetics/deployments/arbitrum/DepositVault.json';

const ROUTER_ADDRESS = RouterJson.address; 

const privateKey = process.env.PRIVATE_KEY;
const ARBITRUM_RPC = 'https://arb-mainnet.g.alchemy.com/v2/_75NBUSjVYDRzy5PEM0AwQccB9DwVLxR';
const provider = new JsonRpcProvider(ARBITRUM_RPC);

const USDC_ADDRESS = '0xaf88d065e77c8cC2239327C5EDb3A432268e5831';

const EXCHANGE_ROUTER_ADDRESS = ExchangeRouterJson.address; 
const EXCHANGE_ROUTER_ABI = ExchangeRouterJson.abi;

const MARKET_ADDRESS = '0x70d95587d40A2caf56bd97485aB3Eec10Bee6336';

const DEPOSIT_VAULT_ADDRESS = DepositVault.address;

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
    approveAmount: ethers.parseUnits('3', 6), // Одобряем 3 USDC
    address: ROUTER_ADDRESS,
  })

  const fee  = ethers.parseUnits('0.001', 18); // 0.001 ETH
  console.log(`Fee: ${ethers.formatUnits(fee, 18)} ETH`);


  //sentWnt
  const sentWnt = exchangeRouterInterface.encodeFunctionData('sendWnt', [
    DEPOSIT_VAULT_ADDRESS,
    fee,
  ]);

  //sendTokens
  const sendTokens = exchangeRouterInterface.encodeFunctionData('sendTokens', [
    USDC_ADDRESS,
    DEPOSIT_VAULT_ADDRESS,
    ethers.parseUnits('3', 6),
  ]);

  //createDeposit
  const createDeposit = exchangeRouterInterface.encodeFunctionData('createDeposit', [
    {
        receiver: wallet.address,
        callbackContract: ethers.ZeroAddress,
        uiFeeReceiver: ethers.ZeroAddress,
        market: MARKET_ADDRESS,
        initialLongToken: "0x82af49447d8a07e3bd95bd0d56f35241523fbab1", // ethUsdMarket.longToken 
        initialShortToken: "0xaf88d065e77c8cc2239327c5edb3a432268e5831", // ethUsdMarket.shortToken
        longTokenSwapPath: [], 
        shortTokenSwapPath: [],
        minMarketTokens: 100,
        shouldUnwrapNativeToken: false,
        executionFee: fee,
        callbackGasLimit: 0,
      },
  ]);
  

  const tx = await exchangeRouterWallet.multicall([sentWnt, sendTokens, createDeposit], {
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
