export class PrintifyError extends Error {
  status: number
  details?: unknown

  constructor(message: string, status: number, details?: unknown) {
    super(message)
    this.name = 'PrintifyError'
    this.status = status
    this.details = details
  }
}

const PRINTIFY_API_BASE = 'https://api.printify.com/v1'

function getPrintifyToken(): string {
  const token = process.env.PRINTIFY_API
  if (!token) {
    throw new PrintifyError('Missing PRINTIFY_API env var', 500)
  }
  return token
}

function withQuery(path: string, query?: Record<string, string | number | boolean | undefined | null>): string {
  if (!query) return path
  const params = new URLSearchParams()
  for (const [key, value] of Object.entries(query)) {
    if (value === undefined || value === null) continue
    params.set(key, String(value))
  }
  const qs = params.toString()
  return qs ? `${path}?${qs}` : path
}

async function readErrorBody(res: Response): Promise<unknown> {
  const contentType = res.headers.get('content-type') || ''
  try {
    if (contentType.includes('application/json')) return await res.json()
    const text = await res.text()
    return text ? { message: text } : undefined
  } catch {
    return undefined
  }
}

export async function printifyRequest<T>(
  path: string,
  options?: {
    method?: 'GET' | 'POST' | 'PUT' | 'PATCH' | 'DELETE'
    query?: Record<string, string | number | boolean | undefined | null>
    body?: unknown
  },
): Promise<T> {
  const url = `${PRINTIFY_API_BASE}${withQuery(path, options?.query)}`
  const res = await fetch(url, {
    method: options?.method || 'GET',
    headers: {
      Authorization: `Bearer ${getPrintifyToken()}`,
      Accept: 'application/json',
      ...(options?.body ? { 'Content-Type': 'application/json' } : {}),
    },
    body: options?.body ? JSON.stringify(options.body) : undefined,
    cache: 'no-store',
  })

  if (!res.ok) {
    const details = await readErrorBody(res)
    throw new PrintifyError(`Printify API error (${res.status})`, res.status, details)
  }

  return (await res.json()) as T
}

export type PrintifyShop = {
  id: number
  title: string
  sales_channel?: string | null
}

export type PrintifyProductImage = {
  src: string
  variant_ids?: number[]
  position?: string
  is_default?: boolean
}

export type PrintifyProductVariant = {
  id: number
  title: string
  price: number
  is_enabled: boolean
  sku?: string | null
}

export type PrintifyProduct = {
  id: string
  title: string
  description: string
  visible: boolean
  is_locked: boolean
  images: PrintifyProductImage[]
  variants: PrintifyProductVariant[]
}

export async function listPrintifyShops(): Promise<PrintifyShop[]> {
  return printifyRequest<PrintifyShop[]>('/shops.json')
}

export async function resolvePrintifyShopId(explicitShopId?: number | null): Promise<number> {
  if (explicitShopId && Number.isFinite(explicitShopId)) return explicitShopId
  const fromEnv = process.env.PRINTIFY_SHOP_ID ? Number(process.env.PRINTIFY_SHOP_ID) : NaN
  if (Number.isFinite(fromEnv) && fromEnv > 0) return fromEnv
  const shops = await listPrintifyShops()
  const first = shops[0]?.id
  if (!first) throw new PrintifyError('No Printify shops found for token', 500)
  return first
}

export async function listPrintifyProducts(
  shopId: number,
  options?: { page?: number; limit?: number },
): Promise<{ data: PrintifyProduct[]; current_page: number; last_page: number; total: number }> {
  return printifyRequest(`/shops/${shopId}/products.json`, { query: { page: options?.page, limit: options?.limit } })
}

export async function getPrintifyProduct(shopId: number, productId: string): Promise<PrintifyProduct> {
  return printifyRequest(`/shops/${shopId}/products/${productId}.json`)
}

export async function createPrintifyOrder(shopId: number, payload: unknown): Promise<unknown> {
  return printifyRequest(`/shops/${shopId}/orders.json`, { method: 'POST', body: payload })
}

export async function estimatePrintifyStandardShippingCents(options: {
  shopId: number
  productId: string
  variantId: number
  quantity: number
  country: string
}): Promise<number> {
  const result = await printifyRequest<Record<string, number>>(`/shops/${options.shopId}/orders/shipping.json`, {
    method: 'POST',
    body: {
      line_items: [{ product_id: options.productId, variant_id: options.variantId, quantity: options.quantity }],
      address_to: { country: options.country },
    },
  })

  const standard = result?.standard
  if (!Number.isFinite(standard)) throw new PrintifyError('Failed to estimate Printify shipping', 500, result)
  return standard
}
