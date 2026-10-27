import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { createCheckoutSession, stripeConfigured } from '@/lib/shop/stripe'
import { SITE } from '@/lib/shop/emails'
import { parseProductSlugs } from '@/lib/shop/cart'

export const dynamic = 'force-dynamic'

const noStore = { 'Cache-Control': 'no-store' }

export async function POST(request: NextRequest) {
  if (!stripeConfigured()) return NextResponse.json({ error: 'Shop is not available yet' }, { status: 503, headers: noStore })

  let body: { product?: unknown; products?: unknown; consent?: unknown }
  try {
    body = await request.json()
  } catch {
    return NextResponse.json({ error: 'Invalid request' }, { status: 400, headers: noStore })
  }
  // One product (Buy now) or the whole cart (`products`).
  const slugs = parseProductSlugs(body)
  if (!slugs) return NextResponse.json({ error: 'Unknown product' }, { status: 400, headers: noStore })
  // EU digital content: the buyer must expressly agree to immediate delivery and acknowledge losing the withdrawal right.
  if (body.consent !== true) return NextResponse.json({ error: 'Please confirm immediate delivery to continue' }, { status: 400, headers: noStore })

  const found = await prisma.product.findMany({ where: { slug: { in: slugs } }, include: { release: { select: { slug: true, coverImageUrl: true } } } })
  const bySlug = new Map(found.map((p) => [p.slug, p]))
  const invalid = slugs.filter((s) => {
    const p = bySlug.get(s)
    return !p || !p.active || !p.fileKey
  })
  if (invalid.length) {
    // The cart removes these and lets the buyer continue with the rest.
    const error = slugs.length === 1 ? 'This product is not for sale' : 'Some items are no longer available and were removed from your cart'
    return NextResponse.json({ error, invalid }, { status: slugs.length === 1 ? 404 : 409, headers: noStore })
  }
  const products = slugs.map((s) => bySlug.get(s)!)
  const currency = products[0].currency
  if (products.some((p) => p.currency !== currency)) return NextResponse.json({ error: 'Items in different currencies cannot be paid together' }, { status: 400, headers: noStore })

  // Prices always come from the DB, never from the client.
  const order = await prisma.order.create({
    data: {
      amountTotal: products.reduce((sum, p) => sum + p.priceCents, 0),
      currency,
      withdrawalConsentAt: new Date(),
      items: { create: products.map((p) => ({ productId: p.id, title: p.title, priceCents: p.priceCents })) },
    },
  })

  const single = products.length === 1 ? products[0] : null
  const back = single?.release ? `${SITE}/music/${single.release.slug}` : `${SITE}/music?cart=open`
  const summary = single ? single.title : `${products.length} items: ${products.map((p) => p.title).join(', ')}`.slice(0, 300)
  try {
    const session = await createCheckoutSession(
      {
        mode: 'payment',
        line_items: products.map((product) => ({
          quantity: 1,
          price_data: {
            currency: product.currency,
            unit_amount: product.priceCents,
            product_data: {
              name: product.title,
              description: 'Digital download',
              ...(product.release?.coverImageUrl?.startsWith('https://') ? { images: [product.release.coverImageUrl] } : {}),
            },
          },
        })),
        billing_address_collection: 'required',
        tax_id_collection: { enabled: true },
        metadata: { orderId: order.id },
        payment_intent_data: { metadata: { orderId: order.id }, description: `DnB Doctor — ${summary}` },
        custom_text: {
          submit: { message: 'Digital download, delivered immediately by email and in My account. You agreed to immediate delivery and lose the right of withdrawal once delivery begins.' },
        },
        success_url: `${SITE}/checkout/success?session_id={CHECKOUT_SESSION_ID}`,
        cancel_url: back,
        expires_at: Math.floor(Date.now() / 1000) + 60 * 60,
      },
      `checkout-${order.id}`,
    )
    await prisma.order.update({ where: { id: order.id }, data: { stripeSessionId: session.id } })
    if (!session.url) throw new Error('Checkout URL missing')
    return NextResponse.json({ url: session.url }, { headers: noStore })
  } catch (e) {
    console.error('[shop] checkout failed', order.id, e instanceof Error ? e.message : e)
    await prisma.order.update({ where: { id: order.id }, data: { status: 'CANCELED' } }).catch(() => null)
    return NextResponse.json({ error: 'Checkout is temporarily unavailable' }, { status: 502, headers: noStore })
  }
}
