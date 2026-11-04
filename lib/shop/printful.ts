import { slugify, type MerchLine, type MerchProduct } from './merchShared'

// Minimal Printful REST client (v1 API, "Manual order / API" store). Server-only: the token never reaches the browser.

const API = 'https://api.printful.com'

export function printfulConfigured() {
  return Boolean(process.env.PRINTFUL_API_KEY && process.env.PRINTFUL_STORE_ID)
}

type Init = { method?: 'GET' | 'POST' | 'DELETE'; body?: unknown; revalidate?: number | false }

export class PrintfulError extends Error {
  constructor(
    public status: number,
    message: string,
  ) {
    super(message)
  }
}

async function pf<T>(path: string, { method = 'GET', body, revalidate = false }: Init = {}): Promise<T> {
  const key = process.env.PRINTFUL_API_KEY
  const store = process.env.PRINTFUL_STORE_ID
  if (!key || !store) throw new Error('Printful is not configured')
  const res = await fetch(`${API}${path}`, {
    method,
    headers: { Authorization: `Bearer ${key}`, 'X-PF-Store-Id': store, ...(body ? { 'Content-Type': 'application/json' } : {}) },
    body: body ? JSON.stringify(body) : undefined,
    ...(revalidate === false ? { cache: 'no-store' as const } : { next: { revalidate } }),
    signal: AbortSignal.timeout(20000),
  })
  const json = (await res.json().catch(() => ({}))) as { result?: unknown; error?: { message?: string } }
  if (!res.ok) throw new PrintfulError(res.status, `Printful ${res.status}: ${json?.error?.message || (typeof json.result === 'string' ? json.result : 'request failed')}`)
  return json.result as T
}

type SyncFile = { type: string; preview_url: string | null; thumbnail_url: string | null }
type SyncVariant = {
  id: number
  variant_id: number
  name: string
  size: string | null
  color: string | null
  retail_price: string
  currency: string
  is_ignored: boolean
  availability_status: string
  files: SyncFile[]
  product: { product_id: number; name: string; image: string }
}
type SyncProductFull = { sync_product: { id: number; name: string; thumbnail_url: string | null; is_ignored: boolean }; sync_variants: SyncVariant[] }

const cents = (price: string) => Math.round(Number(price) * 100)
const SIZE_ORDER = ['XS', 'S', 'M', 'L', 'XL', '2XL', '3XL', '4XL', '5XL', 'S/M', 'M/L', 'L/XL']
const sizeRank = (s: string | null) => (s ? (SIZE_ORDER.indexOf(s) + 1 || 99) : 0)

/** Material/fit bullets from the Printful catalogue text, without the US-only production lines. */
function blankDetails(description: string | undefined) {
  if (!description) return []
  return description
    .split('\n')
    .map((l) => l.trim())
    .filter((l) => l.startsWith('•'))
    .map((l) => l.replace(/^•\s*/, ''))
    .filter((l) => !/\b(in the US|sourced from|disclaimer|blank product|color is)\b/i.test(l))
    .map((l) => l.replace(/\s+for production in Europe$/i, ''))
    .slice(0, 6)
}

async function blankInfo(productId: number, revalidate: number | false) {
  try {
    const r = await pf<{ product: { title: string; description: string } }>(`/products/${productId}`, { revalidate: revalidate === false ? 86400 : revalidate * 6 })
    return { title: r.product.title, details: blankDetails(r.product.description) }
  } catch {
    return { title: null, details: [] }
  }
}

/**
 * All synced, non-ignored store products with their variants. Prices are the Printful retail prices
 * set by the user in the Printful dashboard. `revalidate: false` = always fresh (checkout).
 */
export async function listMerch(revalidate: number | false = 600): Promise<MerchProduct[]> {
  const list = await pf<{ id: number; is_ignored: boolean; synced: number }[]>('/store/products?limit=100', { revalidate })
  const full = await Promise.all(list.filter((p) => !p.is_ignored && p.synced > 0).map((p) => pf<SyncProductFull>(`/store/products/${p.id}`, { revalidate })))
  const products = await Promise.all(
    full.map(async ({ sync_product: sp, sync_variants }) => {
      const variants = sync_variants.filter((v) => !v.is_ignored).sort((a, b) => sizeRank(a.size) - sizeRank(b.size))
      if (!variants.length) return null
      const first = variants[0]
      const file = (t: RegExp) => first.files.find((f) => t.test(f.type))?.preview_url ?? null
      const blank = await blankInfo(first.product.product_id, revalidate)
      const mapped = variants.map((v) => ({ id: v.id, catalogId: v.variant_id, size: v.size, color: v.color, priceCents: cents(v.retail_price), available: v.availability_status === 'active' }))
      return {
        id: sp.id,
        slug: slugify(sp.name),
        name: sp.name,
        image: file(/^preview$/) ?? sp.thumbnail_url,
        backImage: file(/^back/),
        currency: (first.currency || 'EUR').toLowerCase(),
        minPriceCents: Math.min(...mapped.map((v) => v.priceCents)),
        details: blank.details,
        blank: blank.title,
        variants: mapped,
      } satisfies MerchProduct
    }),
  )
  return products.filter((p): p is MerchProduct => p !== null).sort((a, b) => b.minPriceCents - a.minPriceCents)
}

export type PricedLine = { v: number; catalogId: number; q: number; title: string; productName: string; size: string | null; color: string | null; unitCents: number; image: string | null }

/** Price cart lines against fresh Printful data. Returns the lines that are no longer for sale in `invalid`. */
export async function priceLines(lines: MerchLine[]) {
  const products = await listMerch(false)
  const byVariant = new Map(products.flatMap((p) => p.variants.map((v) => [v.id, { p, v }] as const)))
  const invalid: number[] = []
  const priced: PricedLine[] = []
  for (const l of lines) {
    const hit = byVariant.get(l.v)
    if (!hit || !hit.v.available) {
      invalid.push(l.v)
      continue
    }
    const label = [hit.v.size && !/^one size$/i.test(hit.v.size) ? hit.v.size : null, hit.v.color].filter(Boolean).join(' / ')
    priced.push({ v: l.v, catalogId: hit.v.catalogId, q: l.q, title: label ? `${hit.p.name} (${label})` : hit.p.name, productName: hit.p.name, size: hit.v.size, color: hit.v.color, unitCents: hit.v.priceCents, image: hit.p.image })
  }
  const currency = products[0]?.currency ?? 'eur'
  return { priced, invalid, currency }
}

export type ShippingQuote = { id: string; name: string; cents: number; currency: string; minDays: number | null; maxDays: number | null }

// Printful needs a state for these countries; the rate is flat per country, so quote with a representative one.
const QUOTE_STATE: Record<string, string> = { US: 'NY', CA: 'ON', AU: 'NSW', JP: '13' }

const quoteCache = new Map<string, { at: number; quote: ShippingQuote }>()

/** Cheapest Printful shipping rate for these catalogue variants to `country` (cached 10 min per cart+country). */
export async function shippingQuote(country: string, lines: Pick<PricedLine, 'catalogId' | 'q'>[], currency = 'EUR'): Promise<ShippingQuote> {
  const key = `${country}|${currency}|${lines.map((l) => `${l.catalogId}x${l.q}`).sort().join(',')}`
  const hit = quoteCache.get(key)
  if (hit && Date.now() - hit.at < 10 * 60_000) return hit.quote
  const rates = await pf<{ id: string; name: string; rate: string; currency: string; minDeliveryDays?: number; maxDeliveryDays?: number }[]>('/shipping/rates', {
    method: 'POST',
    body: { recipient: { country_code: country, ...(QUOTE_STATE[country] ? { state_code: QUOTE_STATE[country] } : {}) }, items: lines.map((l) => ({ variant_id: l.catalogId, quantity: l.q })), currency: currency.toUpperCase(), locale: 'en_US' },
  })
  const best = rates.filter((r) => r.currency.toUpperCase() === currency.toUpperCase()).sort((a, b) => Number(a.rate) - Number(b.rate))[0]
  if (!best) throw new Error(`No shipping rate to ${country}`)
  const quote: ShippingQuote = {
    id: best.id,
    // "Flat Rate (Estimated delivery: Nov 9⁠–12) " → "Standard shipping"; the estimate is shown from the day counts.
    name: best.id === 'STANDARD' ? 'Standard shipping' : best.name.replace(/\s*\(.*$/, '').replace(/[\u2060]/g, '').trim() || 'Shipping',
    cents: cents(best.rate),
    currency: best.currency.toLowerCase(),
    minDays: best.minDeliveryDays ?? null,
    maxDays: best.maxDeliveryDays ?? null,
  }
  if (quoteCache.size > 500) quoteCache.clear()
  quoteCache.set(key, { at: Date.now(), quote })
  return quote
}

export type PrintfulRecipient = {
  name: string
  address1: string
  address2?: string | null
  city: string
  state_code?: string | null
  country_code: string
  zip: string
  email?: string | null
  phone?: string | null
}

type PfOrder = { id: number; external_id: string | null; status: string }

/**
 * Create the Printful order for a paid merch order. Idempotent through `external_id` (our order id):
 * when Printful already has it, the existing order is returned.
 */
export async function createPrintfulOrder(input: {
  externalId: string
  shipping: string
  recipient: PrintfulRecipient
  items: { syncVariantId: number; quantity: number; unitCents: number }[]
  shippingCents: number
  currency: string
  confirm: boolean
}): Promise<PfOrder> {
  const existing = await pf<PfOrder>(`/orders/@${encodeURIComponent(input.externalId)}`).catch((e) => {
    if (e instanceof PrintfulError && e.status === 404) return null
    throw e
  })
  if (existing) return existing
  return pf<PfOrder>(`/orders?confirm=${input.confirm ? 'true' : 'false'}`, {
    method: 'POST',
    body: {
      external_id: input.externalId,
      shipping: input.shipping,
      recipient: input.recipient,
      items: input.items.map((i) => ({ sync_variant_id: i.syncVariantId, quantity: i.quantity, retail_price: (i.unitCents / 100).toFixed(2) })),
      retail_costs: { currency: input.currency.toUpperCase(), shipping: (input.shippingCents / 100).toFixed(2) },
    },
  })
}

export function cancelPrintfulOrder(id: number) {
  return pf<PfOrder>(`/orders/${id}`, { method: 'DELETE' })
}

export function setPrintfulWebhook(url: string, types: string[]) {
  return pf<{ url: string; types: string[] }>('/webhooks', { method: 'POST', body: { url, types } })
}
