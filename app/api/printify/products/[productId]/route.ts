import { NextRequest, NextResponse } from 'next/server'
import { getPrintifyProduct, resolvePrintifyShopId, PrintifyError } from '@/lib/printify'

export const runtime = 'nodejs'

export async function GET(request: NextRequest, context: { params: Promise<{ productId: string }> }) {
  try {
    const { productId } = await context.params
    const { searchParams } = new URL(request.url)
    const shopIdParam = searchParams.get('shopId')

    const shopId = await resolvePrintifyShopId(shopIdParam ? Number(shopIdParam) : null)
    const product = await getPrintifyProduct(shopId, productId)

    const res = NextResponse.json({ shopId, product })
    res.headers.set('Cache-Control', 'public, s-maxage=300, stale-while-revalidate=86400')
    return res
  } catch (error) {
    const status = error instanceof PrintifyError ? error.status : 500
    return NextResponse.json(
      { error: 'Failed to load Printify product', details: error instanceof PrintifyError ? error.details : undefined },
      { status },
    )
  }
}

