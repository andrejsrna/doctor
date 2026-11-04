import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { createCheckoutSession, stripeConfigured } from '@/lib/shop/stripe'
import { SITE } from '@/lib/shop/emails'
import { isMerchCountry, parseMerchLines } from '@/lib/shop/merchShared'
import { priceLines, printfulConfigured, shippingQuote } from '@/lib/shop/printful'

export const dynamic = 'force-dynamic'

const noStore = { 'Cache-Control': 'no-store' }

export async function POST(request: NextRequest) {
  if (!stripeConfigured() || !printfulConfigured()) return NextResponse.json({ error: 'Merch checkout is not available yet' }, { status: 503, headers: noStore })
  const body = (await request.json().catch(() => ({}))) as { items?: unknown; country?: unknown }
  const lines = parseMerchLines(body.items)
  if (!lines) return NextResponse.json({ error: 'Invalid cart' }, { status: 400, headers: noStore })
  if (!isMerchCountry(body.country)) return NextResponse.json({ error: 'Choose the country we ship to' }, { status: 400, headers: noStore })
  const country = body.country

  // Prices and shipping always come from Printful on the server, never from the client.
  let priced, currency, shipping
  try {
    const r = await priceLines(lines)
    if (r.invalid.length) return NextResponse.json({ error: 'Some items are no longer available and were removed from your cart', invalid: r.invalid }, { status: 409, headers: noStore })
    priced = r.priced
    currency = r.currency
    shipping = await shippingQuote(country, priced, currency)
  } catch (e) {
    console.error('[merch] pricing failed', e instanceof Error ? e.message : e)
    return NextResponse.json({ error: 'Checkout is temporarily unavailable' }, { status: 502, headers: noStore })
  }

  const itemsCents = priced.reduce((s, l) => s + l.unitCents * l.q, 0)
  const order = await prisma.merchOrder.create({
    data: {
      country,
      currency,
      itemsCents,
      shippingCents: shipping.cents,
      amountTotal: itemsCents + shipping.cents,
      shippingRate: shipping.id,
      shippingName: shipping.name,
      items: { create: priced.map((l) => ({ syncVariantId: BigInt(l.v), title: l.title, size: l.size, color: l.color, imageUrl: l.image, quantity: l.q, unitCents: l.unitCents })) },
    },
  })

  const summary = priced.map((l) => (l.q > 1 ? `${l.q}× ${l.title}` : l.title)).join(', ').slice(0, 300)
  const estimate = shipping.minDays && shipping.maxDays ? { minimum: { unit: 'business_day', value: shipping.minDays }, maximum: { unit: 'business_day', value: shipping.maxDays } } : undefined
  try {
    const session = await createCheckoutSession(
      {
        mode: 'payment',
        line_items: priced.map((l) => ({
          quantity: l.q,
          price_data: {
            currency,
            unit_amount: l.unitCents,
            product_data: { name: l.title, description: 'Printed to order', ...(l.image?.startsWith('https://') ? { images: [l.image] } : {}) },
          },
        })),
        shipping_address_collection: { allowed_countries: [country] },
        shipping_options: [{ shipping_rate_data: { type: 'fixed_amount', display_name: shipping.name, fixed_amount: { amount: shipping.cents, currency }, ...(estimate ? { delivery_estimate: estimate } : {}) } }],
        billing_address_collection: 'auto',
        metadata: { kind: 'merch', merchOrderId: order.id },
        payment_intent_data: { metadata: { kind: 'merch', merchOrderId: order.id }, description: `DnB Doctor merch — ${summary}` },
        custom_text: {
          shipping_address: { message: 'Printed to order and shipped by our production partner. Double-check the address: it can\'t be changed once production starts.' },
        },
        success_url: `${SITE}/merch/thanks?session_id={CHECKOUT_SESSION_ID}`,
        cancel_url: `${SITE}/merch?cart=open`,
        expires_at: Math.floor(Date.now() / 1000) + 60 * 60,
      },
      `merch-checkout-${order.id}`,
    )
    await prisma.merchOrder.update({ where: { id: order.id }, data: { stripeSessionId: session.id } })
    if (!session.url) throw new Error('Checkout URL missing')
    return NextResponse.json({ url: session.url }, { headers: noStore })
  } catch (e) {
    console.error('[merch] checkout failed', order.id, e instanceof Error ? e.message : e)
    await prisma.merchOrder.update({ where: { id: order.id }, data: { status: 'CANCELED' } }).catch(() => null)
    return NextResponse.json({ error: 'Checkout is temporarily unavailable' }, { status: 502, headers: noStore })
  }
}
