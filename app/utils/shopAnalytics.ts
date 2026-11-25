'use client'

/** GA4 e-commerce events pushed to the GTM dataLayer (GTM applies consent mode and forwards them to GA4/Ads). */
export type ShopItem = { item_id: string; item_name: string; price: number; quantity?: number; item_category?: string }

type ShopEvent = 'view_item' | 'add_to_cart' | 'begin_checkout' | 'purchase'

export function trackShop(event: ShopEvent, items: ShopItem[], extra?: { currency?: string; transaction_id?: string }) {
  if (typeof window === 'undefined' || items.length === 0) return
  try {
    const w = window as unknown as { dataLayer?: unknown[] }
    w.dataLayer = w.dataLayer || []
    const list = items.map((i) => ({ quantity: 1, ...i }))
    const value = Math.round(list.reduce((s, i) => s + i.price * i.quantity, 0) * 100) / 100
    // Clear the previous ecommerce object first, as GA4 recommends.
    w.dataLayer.push({ ecommerce: null })
    w.dataLayer.push({ event, ecommerce: { currency: extra?.currency ?? 'EUR', value, items: list, ...(extra?.transaction_id && { transaction_id: extra.transaction_id }) } })
  } catch {
    // tracking must never break the shop
  }
}

/** Shapes a BuyOffer or cart line into a GA4 item. */
export const shopItem = (o: { productSlug?: string; slug?: string; title: string; amountCents?: number; amount?: number; type?: string }): ShopItem => ({
  item_id: o.productSlug ?? o.slug ?? '',
  item_name: o.title,
  price: o.amountCents != null ? o.amountCents / 100 : o.amount ?? 0,
  ...(o.type && { item_category: o.type }),
})
