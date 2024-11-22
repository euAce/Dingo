import { BuyPage } from '@/pages/buy'
import { createLazyFileRoute } from '@tanstack/react-router'

export const Route = createLazyFileRoute('/buy')({
  component: BuyPage,
})
