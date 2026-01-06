import { NextResponse } from 'next/server'
import { listPrintifyShops, PrintifyError } from '@/lib/printify'
import { isShopEnabled } from '@/app/utils/shop'

export const runtime = 'nodejs'

export async function GET() {
  if (!isShopEnabled()) return NextResponse.json({ error: 'Not found' }, { status: 404 })
  try {
    const shops = await listPrintifyShops()
    const res = NextResponse.json({ shops })
    res.headers.set('Cache-Control', 'public, s-maxage=300, stale-while-revalidate=86400')
    return res
  } catch (error) {
    const status = error instanceof PrintifyError ? error.status : 500
    return NextResponse.json(
      { error: 'Failed to load Printify shops', details: error instanceof PrintifyError ? error.details : undefined },
      { status },
    )
  }
}
