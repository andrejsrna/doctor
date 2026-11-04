import { NextRequest, NextResponse } from 'next/server'
import { verifyPrintfulWebhookToken } from '@/lib/shop/tokens'
import { handlePrintfulEvent } from '@/lib/shop/merch'

export const dynamic = 'force-dynamic'

/** Printful v1 webhooks (unsigned): authenticated by the secret `?token=` registered with the URL. */
export async function POST(request: NextRequest) {
  if (!verifyPrintfulWebhookToken(request.nextUrl.searchParams.get('token'))) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  const event = await request.json().catch(() => null)
  if (!event || typeof event.type !== 'string') return NextResponse.json({ error: 'Invalid payload' }, { status: 400 })
  try {
    const result = await handlePrintfulEvent(event)
    return NextResponse.json({ received: true, result })
  } catch (e) {
    console.error('[merch] printful webhook failed', event.type, e instanceof Error ? e.message : e)
    return NextResponse.json({ error: 'Handler failed' }, { status: 500 })
  }
}
