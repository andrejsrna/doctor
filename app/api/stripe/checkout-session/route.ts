import { NextRequest, NextResponse } from 'next/server'
import { z } from 'zod'
import { getStripe, getBaseUrl } from '@/lib/stripe'
import { estimatePrintifyStandardShippingCents, getPrintifyProduct, resolvePrintifyShopId } from '@/lib/printify'
import type Stripe from 'stripe'
import { isShopEnabled } from '@/app/utils/shop'

export const runtime = 'nodejs'

const CreateCheckoutSchema = z.object({
  shopId: z.number().int().positive().optional(),
  productId: z.string().min(1),
  variantId: z.number().int().positive(),
  quantity: z.number().int().positive().max(10).default(1),
  country: z.string().length(2),
})

export async function POST(request: NextRequest) {
  if (!isShopEnabled()) return NextResponse.json({ error: 'Not found' }, { status: 404 })
  try {
    const body = await request.json()
    const parsed = CreateCheckoutSchema.safeParse(body)
    if (!parsed.success) {
      return NextResponse.json({ error: 'Invalid request body', issues: parsed.error.issues }, { status: 400 })
    }

    const { productId, variantId, quantity } = parsed.data
    const country = parsed.data.country.toUpperCase()
    if (!/^[A-Z]{2}$/.test(country)) {
      return NextResponse.json({ error: 'Invalid country' }, { status: 400 })
    }
    const shopId = await resolvePrintifyShopId(parsed.data.shopId ?? null)

    const product = await getPrintifyProduct(shopId, productId)
    const variant = (product.variants || []).find((v) => v.id === variantId)
    if (!variant || !variant.is_enabled) {
      return NextResponse.json({ error: 'Variant not available' }, { status: 400 })
    }

    const shippingCents = await estimatePrintifyStandardShippingCents({
      shopId,
      productId,
      variantId,
      quantity,
      country,
    })

    const cover = product.images?.find((i) => i.is_default)?.src || product.images?.[0]?.src || null
    const images = cover && cover.startsWith('https://') ? [cover] : undefined

    const stripe = getStripe()
    const baseUrl = getBaseUrl()

    const session = await stripe.checkout.sessions.create({
      mode: 'payment',
      line_items: [
        {
          quantity,
          price_data: {
            currency: 'eur',
            unit_amount: variant.price,
            product_data: {
              name: `${product.title} — ${variant.title}`,
              images,
              metadata: {
                printify_product_id: productId,
                printify_variant_id: String(variantId),
              },
            },
          },
        },
      ],
      shipping_options: [
        {
          shipping_rate_data: {
            display_name: 'Standard shipping',
            fixed_amount: { currency: 'eur', amount: shippingCents },
          },
        },
      ],
      success_url: `${baseUrl}/shop/success?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${baseUrl}/shop/cancel`,
      phone_number_collection: { enabled: true },
      shipping_address_collection: {
        // lock to selected country so shipping price stays correct
        allowed_countries: [country as Stripe.Checkout.SessionCreateParams.ShippingAddressCollection.AllowedCountry],
      },
      metadata: {
        shop_id: String(shopId),
        printify_product_id: productId,
        printify_variant_id: String(variantId),
        quantity: String(quantity),
        shipping_country: country,
        shipping_cents: String(shippingCents),
      },
    })

    if (!session.url) {
      return NextResponse.json({ error: 'Stripe session created without URL' }, { status: 500 })
    }

    return NextResponse.json({ id: session.id, url: session.url })
  } catch (error) {
    console.error('Stripe checkout session error', error)
    return NextResponse.json({ error: 'Failed to create checkout session' }, { status: 500 })
  }
}
