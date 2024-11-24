import React from 'react';
import { Header } from '@/widgets/header';
import { Counter } from '@/features/counter';

export const CounterPage: React.FC = () => {
  return (
    <>
      <Header />
      <div className="flex">
        <Counter />
      </div>
    </>
  );
};
