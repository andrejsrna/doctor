import { NextRequest, NextResponse } from 'next/server'
import { estimatePrintifyStandardShippingCents, resolvePrintifyShopId, PrintifyError } from '@/lib/printify'
import { isShopEnabled } from '@/app/utils/shop'

export const runtime = 'nodejs'

export async function GET(request: NextRequest) {
  if (!isShopEnabled()) return NextResponse.json({ error: 'Not found' }, { status: 404 })
  try {
    const { searchParams } = new URL(request.url)
    const shopIdParam = searchParams.get('shopId')
    const productId = searchParams.get('productId') || ''
    const variantId = searchParams.get('variantId') ? Number(searchParams.get('variantId')) : NaN
    const quantity = searchParams.get('quantity') ? Number(searchParams.get('quantity')) : 1
    const country = (searchParams.get('country') || '').toUpperCase()

    if (!productId) return NextResponse.json({ error: 'Missing productId' }, { status: 400 })
    if (!Number.isFinite(variantId) || variantId <= 0) return NextResponse.json({ error: 'Missing/invalid variantId' }, { status: 400 })
    if (!Number.isFinite(quantity) || quantity <= 0 || quantity > 10) return NextResponse.json({ error: 'Invalid quantity' }, { status: 400 })
    if (!/^[A-Z]{2}$/.test(country)) return NextResponse.json({ error: 'Invalid country' }, { status: 400 })

    const shopId = await resolvePrintifyShopId(shopIdParam ? Number(shopIdParam) : null)
    const standardCents = await estimatePrintifyStandardShippingCents({
      shopId,
      productId,
      variantId,
      quantity,
      country,
    })

    return NextResponse.json({ shopId, country, standardCents })
  } catch (error) {
    const status = error instanceof PrintifyError ? error.status : 500
    return NextResponse.json(
      { error: 'Failed to estimate shipping', details: error instanceof PrintifyError ? error.details : undefined },
      { status },
    )
  }
}
