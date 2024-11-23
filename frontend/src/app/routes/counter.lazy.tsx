import { CounterPage } from '@/pages/counter';
import { createLazyFileRoute } from '@tanstack/react-router';

export const Route = createLazyFileRoute('/counter')({
  component: CounterPage,
});
