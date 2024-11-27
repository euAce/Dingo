import { buildModule } from "@nomicfoundation/hardhat-ignition/modules";
import { ethers } from "hardhat";

// Определяем интерфейс для параметров
interface AggregatorParams {
  maximumGasPrice: number;
  reasonableGasPrice: number;
  microLinkPerEth: number;
  linkGweiPerObservation: number;
  linkGweiPerTransmission: number;
  minAnswer: number;
  maxAnswer: number;
  decimals: number;
  description: string;
}
const AggregatorDeployModule = buildModule("AccessControlledAggregatorDeployment", (m) => {

    // Arg [0] : _maximumGasPrice (uint32): 1000
    // Arg [1] : _reasonableGasPrice (uint32): 100
    // Arg [2] : _microLinkPerEth (uint32): 104073000
    // Arg [3] : _linkGweiPerObservation (uint32): 760000
    // Arg [4] : _linkGweiPerTransmission (uint32): 4750000
    // Arg [5] : _link (address): 0xf97f4df75117a78c1A5a0DBb814Af92458539FB4
    // Arg [6] : _minAnswer (int192): 100000
    // Arg [7] : _maxAnswer (int192): 10000000000
    // Arg [8] : _billingAccessController (address): 0x2bE843e2A5907fFf0B7c9337b5058617bfEc2bfE
    // Arg [9] : _requesterAccessController (address): 0xf1c3C8C14C31a5f74614572e922cD8F4fC626185
    // Arg [10] : _decimals (uint8): 8
    // Arg [11] : description (string): CNY / USD
    // Параметры конструктора
  const params: AggregatorParams = {
    maximumGasPrice: 1000,
    reasonableGasPrice: 100,
    microLinkPerEth: 1e6, // 1 LINK за 1 ETH
    linkGweiPerObservation: 760000,
    linkGweiPerTransmission: 4750000,
    minAnswer: 100000,
    maxAnswer: 10000000000,
    decimals: 8,
    description: "CNY / USD"
  };

  // Деплоим контроллеры доступа
  const requesterAccessController = m.contract("SimpleReadAccessController");
  const billingAccessController =  m.contract("SimpleWriteAccessController");

  // Деплоим тестовый LINK токен
  const linkToken = m.contract("StandardArbERC20");

  // Деплоим основной контракт
  const sequencerUptimeFeed = m.contract(
    "AccessControlledOffchainAggregator",
    [
      params.maximumGasPrice,
      params.reasonableGasPrice,
      params.microLinkPerEth,
      params.linkGweiPerObservation,
      params.linkGweiPerTransmission,
      linkToken,
      params.minAnswer,
      params.maxAnswer,
      billingAccessController,
      requesterAccessController,
      params.decimals,
      params.description
    ]
  );

  // Настраиваем права доступа
  const addAggregatorAccess = m.call(
    billingAccessController,
    "addAccess",
    [sequencerUptimeFeed]
  );

  return {
    requesterAccessController,
    billingAccessController,
    linkToken,
    sequencerUptimeFeed
  };
});

export default AggregatorDeployModule;

// npx hardhat ignition deploy ignition/modules/DeployAggregator.ts --network localhost