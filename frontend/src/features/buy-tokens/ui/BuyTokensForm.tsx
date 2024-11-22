import { Button } from '@/shared/ui/Button';
import { Input } from '@/shared/ui/Input';
// import { useContractWrite } from 'wagmi';

export const BuyTokensForm = () => {
  // const { write } = useContractWrite({
  //   address: '0xContractAddress',
  //   abi: contractAbi,
  //   functionName: 'buyTokens',
  // });

  const handleBuy = () => {
    // write();
  };

  return (
    <div>
      <Input type="number" placeholder="Enter amount" />
      <Button onClick={handleBuy}>Buy Tokens</Button>
    </div>
  );
};
