import React from 'react';
import { BuyTokensForm } from '@/features/buy-tokens';
import { SellTokensForm } from '@/features/sell-tokens';
import { Header } from '@/widgets/header';

export const BuyPage: React.FC = () => {
  return (
    <>
      <Header />
      <div className="flex">
        <div>
          <h1>Buy</h1>
          <BuyTokensForm />
        </div>
        <div>
          <h1>Sell</h1>
          <SellTokensForm />
        </div>
      </div>
    </>
  );
};
