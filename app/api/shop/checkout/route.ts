import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { createCheckoutSession, stripeConfigured } from '@/lib/shop/stripe'
import { SITE } from '@/lib/shop/emails'

export const dynamic = 'force-dynamic'

const noStore = { 'Cache-Control': 'no-store' }

export async function POST(request: NextRequest) {
  if (!stripeConfigured()) return NextResponse.json({ error: 'Shop is not available yet' }, { status: 503, headers: noStore })

  let body: { product?: unknown; consent?: unknown }
  try {
    body = await request.json()
  } catch {
    return NextResponse.json({ error: 'Invalid request' }, { status: 400, headers: noStore })
  }
  const slug = typeof body.product === 'string' ? body.product.trim().slice(0, 120) : ''
  if (!/^[a-z0-9-]+$/.test(slug)) return NextResponse.json({ error: 'Unknown product' }, { status: 400, headers: noStore })
  // EU digital content: the buyer must expressly agree to immediate delivery and acknowledge losing the withdrawal right.
  if (body.consent !== true) return NextResponse.json({ error: 'Please confirm immediate delivery to continue' }, { status: 400, headers: noStore })

  const product = await prisma.product.findUnique({ where: { slug }, include: { release: { select: { slug: true, coverImageUrl: true } } } })
  if (!product || !product.active || !product.fileKey) return NextResponse.json({ error: 'This product is not for sale' }, { status: 404, headers: noStore })

  // Price always comes from the DB, never from the client.
  const order = await prisma.order.create({
    data: {
      amountTotal: product.priceCents,
      currency: product.currency,
      withdrawalConsentAt: new Date(),
      items: { create: { productId: product.id, title: product.title, priceCents: product.priceCents } },
    },
  })

  const back = product.release ? `${SITE}/music/${product.release.slug}` : SITE
  try {
    const session = await createCheckoutSession(
      {
        mode: 'payment',
        line_items: [
          {
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
          },
        ],
        billing_address_collection: 'required',
        tax_id_collection: { enabled: true },
        metadata: { orderId: order.id },
        payment_intent_data: { metadata: { orderId: order.id }, description: `DnB Doctor — ${product.title}` },
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
