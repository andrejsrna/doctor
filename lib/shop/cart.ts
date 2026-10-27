// Shopping cart for digital products: kept in localStorage (no account needed), validated and priced
// on the server at checkout. Digital goods are quantity 1, so the cart is a list of unique slugs.

export type CartItem = {
  slug: string
  title: string
  price: string
  amountCents: number
  currency: string
  image?: string | null
  href?: string | null
}

export const CART_MAX = 20
const KEY = 'dnbd-cart-v1'
const CHANGE = 'dnbd-cart-change'
export const CART_OPEN = 'dnbd-cart-open'

const SLUG = /^[a-z0-9-]{1,120}$/

/** Request body → unique product slugs (`products: []`, or the single-product `product` field). */
export function parseProductSlugs(body: { product?: unknown; products?: unknown }): string[] | null {
  const raw = Array.isArray(body.products) ? body.products : typeof body.product === 'string' ? [body.product] : []
  const slugs = [...new Set(raw.filter((s): s is string => typeof s === 'string').map((s) => s.trim()))]
  if (!slugs.length || slugs.length > CART_MAX || !slugs.every((s) => SLUG.test(s))) return null
  return slugs
}

export function withItem(items: CartItem[], item: CartItem) {
  if (items.some((i) => i.slug === item.slug)) return items
  return [...items, item].slice(-CART_MAX)
}

export const cartTotal = (items: CartItem[]) => items.reduce((sum, i) => sum + i.amountCents, 0)

// Same format as the server-side `money()` in emails.ts (which can't be bundled for the browser).
export const formatMoney = (cents: number, currency = 'eur') =>
  new Intl.NumberFormat('en-IE', { style: 'currency', currency: currency.toUpperCase() }).format(cents / 100)

/* ---------- browser store (useSyncExternalStore) ---------- */

const EMPTY: CartItem[] = []
let cache: { raw: string | null; items: CartItem[] } = { raw: null, items: EMPTY }

function valid(i: unknown): i is CartItem {
  const c = i as CartItem
  return !!c && typeof c.slug === 'string' && SLUG.test(c.slug) && typeof c.title === 'string' && Number.isFinite(c.amountCents)
}

export function readCart(): CartItem[] {
  if (typeof window === 'undefined') return EMPTY
  let raw: string | null = null
  try {
    raw = window.localStorage.getItem(KEY)
  } catch {
    return EMPTY
  }
  if (raw === cache.raw) return cache.items
  let items = EMPTY
  try {
    const parsed = raw ? JSON.parse(raw) : []
    if (Array.isArray(parsed)) items = parsed.filter(valid).slice(0, CART_MAX)
  } catch {
    /* corrupted storage → empty cart */
  }
  cache = { raw, items }
  return items
}

function write(items: CartItem[]) {
  try {
    if (items.length) window.localStorage.setItem(KEY, JSON.stringify(items))
    else window.localStorage.removeItem(KEY)
  } catch {
    /* private mode / quota: cart lives for this page only */
  }
  window.dispatchEvent(new Event(CHANGE))
}

export function subscribeCart(cb: () => void) {
  const onStorage = (e: StorageEvent) => e.key === KEY && cb()
  window.addEventListener(CHANGE, cb)
  window.addEventListener('storage', onStorage) // other tabs
  return () => {
    window.removeEventListener(CHANGE, cb)
    window.removeEventListener('storage', onStorage)
  }
}

export const serverCart = () => EMPTY

export const addToCart = (item: CartItem) => write(withItem(readCart(), item))
export const removeFromCart = (slugs: string[]) => write(readCart().filter((i) => !slugs.includes(i.slug)))
export const openCart = () => window.dispatchEvent(new Event(CART_OPEN))
