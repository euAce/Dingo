import { Button } from '@/shared/ui/Button';
import { Input } from '@/shared/ui/Input';

export const SellTokensForm = () => {

  const handleBuy = () => {};

  return (
    <div>
      <Input type="number" placeholder="Enter amount" />
      <Button onClick={handleBuy}>Sell Tokens</Button>
    </div>
  );
};
