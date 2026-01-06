import { NextRequest, NextResponse } from 'next/server'
import { listPrintifyProducts, resolvePrintifyShopId, PrintifyError } from '@/lib/printify'
import { isShopEnabled } from '@/app/utils/shop'

export const runtime = 'nodejs'

export async function GET(request: NextRequest) {
  if (!isShopEnabled()) return NextResponse.json({ error: 'Not found' }, { status: 404 })
  try {
    const { searchParams } = new URL(request.url)
    const shopIdParam = searchParams.get('shopId')
    const page = searchParams.get('page') ? Number(searchParams.get('page')) : undefined
    const limit = searchParams.get('limit') ? Number(searchParams.get('limit')) : undefined

    const shopId = await resolvePrintifyShopId(shopIdParam ? Number(shopIdParam) : null)
    const result = await listPrintifyProducts(shopId, { page, limit })

    const res = NextResponse.json({ shopId, ...result })
    res.headers.set('Cache-Control', 'public, s-maxage=300, stale-while-revalidate=86400')
    return res
  } catch (error) {
    const status = error instanceof PrintifyError ? error.status : 500
    return NextResponse.json(
      { error: 'Failed to load Printify products', details: error instanceof PrintifyError ? error.details : undefined },
      { status },
    )
  }
}
