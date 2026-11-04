// Merch helpers shared by the browser cart and the API routes (no server-only imports here).

export type MerchVariant = {
  /** Printful sync variant id */
  id: number
  /** Printful catalogue variant id (needed for shipping rates) */
  catalogId: number
  size: string | null
  color: string | null
  priceCents: number
  available: boolean
}

export type MerchProduct = {
  id: number
  slug: string
  name: string
  /** Front mockup (Printful preview) */
  image: string | null
  /** Back print artwork, when the product has one */
  backImage: string | null
  currency: string
  minPriceCents: number
  details: string[]
  blank: string | null
  variants: MerchVariant[]
}

export type MerchLine = { v: number; q: number }

export const MERCH_MAX_LINES = 20
export const MERCH_MAX_QTY = 10

/** Countries Printful ships to that we offer at checkout (EU + EEA + UK/CH + main export markets). */
export const MERCH_COUNTRIES: [code: string, name: string][] = [
  ['AT', 'Austria'], ['BE', 'Belgium'], ['BG', 'Bulgaria'], ['HR', 'Croatia'], ['CY', 'Cyprus'], ['CZ', 'Czechia'],
  ['DK', 'Denmark'], ['EE', 'Estonia'], ['FI', 'Finland'], ['FR', 'France'], ['DE', 'Germany'], ['GR', 'Greece'],
  ['HU', 'Hungary'], ['IE', 'Ireland'], ['IT', 'Italy'], ['LV', 'Latvia'], ['LT', 'Lithuania'], ['LU', 'Luxembourg'],
  ['MT', 'Malta'], ['NL', 'Netherlands'], ['PL', 'Poland'], ['PT', 'Portugal'], ['RO', 'Romania'], ['SK', 'Slovakia'],
  ['SI', 'Slovenia'], ['ES', 'Spain'], ['SE', 'Sweden'], ['NO', 'Norway'], ['IS', 'Iceland'], ['CH', 'Switzerland'],
  ['GB', 'United Kingdom'], ['US', 'United States'], ['CA', 'Canada'], ['AU', 'Australia'], ['NZ', 'New Zealand'], ['JP', 'Japan'],
]
const COUNTRY_CODES = new Set(MERCH_COUNTRIES.map(([c]) => c))
export const isMerchCountry = (c: unknown): c is string => typeof c === 'string' && COUNTRY_CODES.has(c)

/** Request body → merged, bounded cart lines, or null when malformed. */
export function parseMerchLines(raw: unknown): MerchLine[] | null {
  if (!Array.isArray(raw) || raw.length === 0 || raw.length > MERCH_MAX_LINES) return null
  const merged = new Map<number, number>()
  for (const l of raw) {
    const v = Number((l as MerchLine)?.v)
    const q = Number((l as MerchLine)?.q)
    if (!Number.isSafeInteger(v) || v <= 0 || !Number.isInteger(q) || q < 1 || q > MERCH_MAX_QTY) return null
    merged.set(v, Math.min(MERCH_MAX_QTY, (merged.get(v) ?? 0) + q))
  }
  return [...merged].map(([v, q]) => ({ v, q }))
}

export const slugify = (s: string) =>
  s
    .toLowerCase()
    .normalize('NFKD')
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '')

export const variantLabel = (v: Pick<MerchVariant, 'size' | 'color'>) =>
  [v.size && !/^one size$/i.test(v.size) ? v.size : null, v.color].filter(Boolean).join(' · ') || 'One size'
