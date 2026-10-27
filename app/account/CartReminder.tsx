'use client'

import { FaShoppingCart } from 'react-icons/fa'
import { useCart } from '@/app/components/shop/AddToCartButton'
import { cartTotal, formatMoney, openCart } from '@/lib/shop/cart'

/** Items left in the cart (same browser) get a nudge back to checkout. */
export default function CartReminder() {
  const items = useCart()
  if (!items.length) return null
  return (
    <div className="flex flex-wrap items-center justify-between gap-3 border border-[#9b5eff]/50 bg-[#9b5eff]/10 px-5 py-4">
      <p className="m-0 flex items-center gap-3 text-white">
        <FaShoppingCart className="text-[#9b5eff]" aria-hidden="true" />
        {items.length} {items.length === 1 ? 'item is' : 'items are'} waiting in your cart · {formatMoney(cartTotal(items), items[0].currency)}
      </p>
      <button type="button" onClick={openCart} className="font-mono text-sm font-bold uppercase tracking-widest text-[#39ff14] underline-offset-4 hover:underline">
        Open cart →
      </button>
    </div>
  )
}
