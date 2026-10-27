'use client'

import { useSyncExternalStore } from 'react'
import { FaCheck, FaPlus } from 'react-icons/fa'
import { addToCart, openCart, readCart, serverCart, subscribeCart } from '@/lib/shop/cart'
import type { BuyOffer } from './BuyButton'

export const useCart = () => useSyncExternalStore(subscribeCart, readCart, serverCart)

/** Adds a product to the cart and opens it; once inside, the button opens the cart instead. */
export default function AddToCartButton({ offer, className }: { offer: BuyOffer; className?: string }) {
  const inCart = useCart().some((i) => i.slug === offer.productSlug)
  const amountCents = offer.amountCents ?? Math.round((offer.amount ?? 0) * 100)

  return (
    <button
      type="button"
      className={className}
      data-in-cart={inCart ? '' : undefined}
      onClick={() => {
        if (!inCart && amountCents > 0) {
          addToCart({
            slug: offer.productSlug,
            title: offer.title,
            price: offer.price,
            amountCents,
            currency: (offer.currency ?? 'EUR').toLowerCase(),
            image: offer.image ?? null,
            href: offer.href ?? null,
          })
        }
        openCart()
      }}
    >
      {inCart ? <FaCheck aria-hidden="true" /> : <FaPlus aria-hidden="true" />} {inCart ? 'In cart' : 'Add to cart'}
    </button>
  )
}
