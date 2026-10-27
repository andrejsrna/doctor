import { NextRequest, NextResponse } from 'next/server'
import { verifyWebhook, type CheckoutSession } from '@/lib/shop/stripe'
import { fulfilSession, markExpired, markRefunded } from '@/lib/shop/orders'
import { issueInvoice, retryPendingInvoices } from '@/lib/shop/invoices'

export const dynamic = 'force-dynamic'

export async function POST(request: NextRequest) {
  const secret = process.env.STRIPE_WEBHOOK_SECRET
  if (!secret) return NextResponse.json({ error: 'Not configured' }, { status: 503 })

  const payload = await request.text()
  let event
  try {
    event = verifyWebhook(payload, request.headers.get('stripe-signature'), secret)
  } catch {
    return NextResponse.json({ error: 'Invalid signature' }, { status: 400 })
  }

  try {
    const obj = event.data.object
    switch (event.type) {
      case 'checkout.session.completed':
      case 'checkout.session.async_payment_succeeded':
      {
        const r = await fulfilSession(obj as unknown as CheckoutSession)
        // Invoice failures never fail the webhook: the order stays PENDING-invoice and is retried.
        if (r.status === 'paid') await issueInvoice(String((obj as { metadata?: { orderId?: string } }).metadata?.orderId))
        break
      }
      case 'checkout.session.expired':
      case 'checkout.session.async_payment_failed':
        await markExpired(String(obj.id))
        break
      case 'charge.refunded':
        if (typeof obj.payment_intent === 'string') await markRefunded(obj.payment_intent, obj.amount_refunded === obj.amount)
        break
    }
  } catch (e) {
    // 500 makes Stripe retry with backoff; handlers are idempotent.
    console.error('[shop] webhook failed', event.type, event.id, e instanceof Error ? e.message : e)
    return NextResponse.json({ error: 'Handler failed' }, { status: 500 })
  }
  await retryPendingInvoices().catch(() => 0)
  return NextResponse.json({ received: true })
}
