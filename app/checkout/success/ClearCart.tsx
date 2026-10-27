'use client'

import { useEffect } from 'react'
import { removeFromCart } from '@/lib/shop/cart'

/** Paid items leave the cart (also when the buyer used Buy now on something that was already in it). */
export default function ClearCart({ slugs }: { slugs: string[] }) {
  const key = slugs.join(',')
  useEffect(() => {
    if (key) removeFromCart(key.split(','))
  }, [key])
  return null
}
