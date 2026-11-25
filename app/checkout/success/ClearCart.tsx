'use client'

import { useEffect, useRef } from 'react'
import { removeFromCart } from '@/lib/shop/cart'
import { trackShop } from '@/app/utils/shopAnalytics'
import { trackShopPurchase } from '@/app/utils/analytics'

type Purchase = { id: string; currency: string; items: { slug: string; title: string; priceCents: number }[] } | null

/** Paid items leave the cart (also when the buyer used Buy now on something that was already in it). */
export default function ClearCart({ slugs, purchase }: { slugs: string[]; purchase?: Purchase }) {
  const key = slugs.join(',')
  useEffect(() => {
    if (key) removeFromCart(key.split(','))
  }, [key])

  // GA4 purchase, once per order: a reload of the thank-you page must not count it twice.
  const order = useRef(purchase)
  const orderId = purchase?.id
  useEffect(() => {
    const p = order.current
    if (!p || !orderId) return
    const seen = `dd_purchase_${orderId}`
    try {
      if (window.localStorage.getItem(seen)) return
      window.localStorage.setItem(seen, '1')
    } catch {
      // storage blocked: report it for this visit anyway
    }
    trackShop('purchase', p.items.map((i) => ({ item_id: i.slug, item_name: i.title, price: i.priceCents / 100 })), {
      currency: p.currency,
      transaction_id: orderId,
    })
    const value = p.items.reduce((s, i) => s + i.priceCents, 0) / 100
    trackShopPurchase(orderId, value, p.currency, p.items.map((i) => i.slug))
  }, [orderId])
  return null
}
