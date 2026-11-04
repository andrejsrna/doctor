import { NextRequest, NextResponse } from 'next/server'
import { isMerchCountry, parseMerchLines } from '@/lib/shop/merchShared'
import { priceLines, printfulConfigured, shippingQuote } from '@/lib/shop/printful'

export const dynamic = 'force-dynamic'

const noStore = { 'Cache-Control': 'no-store' }

/**
 * Cart summary for the merch page: fresh prices, items no longer for sale, and the Printful shipping rate
 * to the chosen country. Without a country the visitor's Cloudflare country is suggested.
 */
export async function POST(request: NextRequest) {
  if (!printfulConfigured()) return NextResponse.json({ error: 'Merch is not available yet' }, { status: 503, headers: noStore })
  const body = (await request.json().catch(() => ({}))) as { items?: unknown; country?: unknown }
  const lines = parseMerchLines(body.items)
  if (!lines) return NextResponse.json({ error: 'Invalid cart' }, { status: 400, headers: noStore })
  const geo = request.headers.get('cf-ipcountry')?.toUpperCase()
  const country = isMerchCountry(body.country) ? body.country : isMerchCountry(geo) ? geo : null

  try {
    const { priced, invalid, currency } = await priceLines(lines)
    const itemsCents = priced.reduce((s, l) => s + l.unitCents * l.q, 0)
    const shipping = country && priced.length ? await shippingQuote(country, priced, currency) : null
    return NextResponse.json(
      {
        country,
        currency,
        invalid,
        items: priced.map((l) => ({ v: l.v, q: l.q, title: l.title, unitCents: l.unitCents })),
        itemsCents,
        shipping: shipping && { name: shipping.name, cents: shipping.cents, minDays: shipping.minDays, maxDays: shipping.maxDays },
        totalCents: itemsCents + (shipping?.cents ?? 0),
      },
      { headers: noStore },
    )
  } catch (e) {
    console.error('[merch] quote failed', e instanceof Error ? e.message : e)
    return NextResponse.json({ error: 'Shipping quote is temporarily unavailable' }, { status: 502, headers: noStore })
  }
}
