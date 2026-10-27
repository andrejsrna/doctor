import { createHmac, timingSafeEqual } from 'node:crypto'

// Minimal Stripe REST client — the shop needs two calls and webhook verification, not the whole SDK.

const API = 'https://api.stripe.com/v1'

export function stripeConfigured() {
  return Boolean(process.env.STRIPE_SECRET_KEY && process.env.STRIPE_WEBHOOK_SECRET)
}

function secretKey() {
  const key = process.env.STRIPE_SECRET_KEY
  if (!key) throw new Error('STRIPE_SECRET_KEY is not set')
  if (process.env.NODE_ENV === 'production' && key.startsWith('sk_test_') && process.env.STRIPE_ALLOW_TEST !== '1') {
    throw new Error('Test Stripe key in production (set STRIPE_ALLOW_TEST=1 for a deliberate test-mode run)')
  }
  return key
}

/** Flatten nested params into Stripe's bracket form encoding: { a: { b: 1 } } → a[b]=1. */
export function formEncode(params: Record<string, unknown>, prefix = '', out = new URLSearchParams()) {
  for (const [k, v] of Object.entries(params)) {
    if (v === undefined || v === null) continue
    const key = prefix ? `${prefix}[${k}]` : k
    if (Array.isArray(v)) v.forEach((item, i) => (typeof item === 'object' ? formEncode(item as Record<string, unknown>, `${key}[${i}]`, out) : out.append(`${key}[${i}]`, String(item))))
    else if (typeof v === 'object') formEncode(v as Record<string, unknown>, key, out)
    else out.append(key, String(v))
  }
  return out
}

async function stripe<T>(method: 'GET' | 'POST', path: string, params?: Record<string, unknown>, idempotencyKey?: string): Promise<T> {
  const headers: Record<string, string> = { Authorization: `Bearer ${secretKey()}` }
  let url = `${API}${path}`
  let body: string | undefined
  if (params && method === 'POST') {
    headers['Content-Type'] = 'application/x-www-form-urlencoded'
    body = formEncode(params).toString()
  } else if (params) url += `?${formEncode(params)}`
  if (idempotencyKey) headers['Idempotency-Key'] = idempotencyKey
  const res = await fetch(url, { method, headers, body, cache: 'no-store' })
  const json = await res.json()
  if (!res.ok) throw new Error(`Stripe ${res.status}: ${json?.error?.message || 'request failed'}`)
  return json as T
}

export type CheckoutSession = {
  id: string
  url: string | null
  status: 'open' | 'complete' | 'expired'
  payment_status: 'paid' | 'unpaid' | 'no_payment_required'
  payment_intent: string | null
  amount_total: number | null
  currency: string | null
  metadata: Record<string, string> | null
  customer_details: {
    email: string | null
    name: string | null
    address: Record<string, string | null> | null
    tax_ids?: { type: string; value: string }[] | null
  } | null
}

export function createCheckoutSession(params: Record<string, unknown>, idempotencyKey: string) {
  return stripe<CheckoutSession>('POST', '/checkout/sessions', params, idempotencyKey)
}

export function retrieveCheckoutSession(id: string) {
  return stripe<CheckoutSession>('GET', `/checkout/sessions/${encodeURIComponent(id)}`)
}

export type StripeEvent = { id: string; type: string; data: { object: Record<string, unknown> } }

/** Verify a `Stripe-Signature` header (v1 HMAC-SHA256 over `${t}.${payload}`) and parse the event. */
export function verifyWebhook(payload: string, header: string | null, secret: string, toleranceSec = 300, now = Date.now()): StripeEvent {
  if (!header) throw new Error('Missing signature')
  const parts = header.split(',').map((p) => p.split('=') as [string, string])
  const t = Number(parts.find(([k]) => k === 't')?.[1])
  const sigs = parts.filter(([k]) => k === 'v1').map(([, v]) => v)
  if (!t || !sigs.length) throw new Error('Malformed signature')
  if (Math.abs(now / 1000 - t) > toleranceSec) throw new Error('Signature timestamp outside tolerance')
  const expected = createHmac('sha256', secret).update(`${t}.${payload}`).digest()
  const ok = sigs.some((s) => {
    const got = Buffer.from(s, 'hex')
    return got.length === expected.length && timingSafeEqual(got, expected)
  })
  if (!ok) throw new Error('Invalid signature')
  return JSON.parse(payload) as StripeEvent
}
