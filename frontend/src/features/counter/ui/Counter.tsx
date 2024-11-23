import React, { useState, useEffect } from 'react';
import { useWriteContract, useAccount, useReadContract } from 'wagmi';
import counterAbi from '../api/counter.abi.json';
import { Button } from '@/shared/ui/Button';

const CONTRACT_ADDRESS = '0x49ef4385c4d5Ac318D457a0aABB493C865C49A01';

export const Counter: React.FC = () => {
  const [count, setCount] = useState(0);
  const { address, isConnected } = useAccount();
  const { writeContract } = useWriteContract();

  const { data: counterValue, refetch } = useReadContract({
    address: CONTRACT_ADDRESS,
    abi: counterAbi.abi,
    functionName: 'getUserCounter',
    args: [address],
  });

  useEffect(() => {
    if (counterValue) {
      setCount(Number(counterValue));
    }
  }, [counterValue]);

  const handleIncrement = async () => {
    try {
      writeContract({
        abi: counterAbi.abi,
        address: CONTRACT_ADDRESS,
        functionName: 'incrementUserCounter',
      });
      await refetch();
    } catch (error) {
      console.error('Failed to increment:', error);
    }
  };

  const handleDecrement = async () => {
    try {
      console.log('Decrementing', address);
      writeContract({
        abi: counterAbi.abi,
        address: CONTRACT_ADDRESS,
        functionName: 'decrementUserCounter',
      });
      await refetch();
    } catch (error) {
      console.error('Failed to decrement:', error);
    }
  };

  if (!isConnected) {
    return (
      <div className="flex">
        <h2>Please connect your wallet to use the counter</h2>
      </div>
    );
  }

  return (
    <div>
      <h1>Counter</h1>
      <p>{count}</p>
      <Button onClick={handleIncrement}>Increment</Button>
      <Button onClick={handleDecrement}>Decrement</Button>
    </div>
  );
};
