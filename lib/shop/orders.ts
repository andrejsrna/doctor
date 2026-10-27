import { prisma } from '@/lib/prisma'
import type { CheckoutSession } from './stripe'
import { downloadToken } from './tokens'
import { sendOrderEmail, SITE } from './emails'

export const normEmail = (e: string | null | undefined) => (e ? e.trim().toLowerCase() : null)

export const downloadUrl = (itemId: string) => `${SITE}/api/shop/download?t=${encodeURIComponent(downloadToken(itemId))}`

/**
 * Mark the order paid from a completed Checkout Session. Idempotent: Stripe retries webhooks and
 * may deliver `completed` and `async_payment_succeeded` for the same session — only the first
 * PENDING→PAID transition sends the email.
 */
export async function fulfilSession(session: CheckoutSession) {
  if (session.payment_status !== 'paid') return { status: 'unpaid' as const }
  const orderId = session.metadata?.orderId
  if (!orderId) throw new Error('Session without orderId')
  const order = await prisma.order.findUnique({ where: { id: orderId }, include: { items: true } })
  if (!order || order.stripeSessionId !== session.id) throw new Error('Order/session mismatch')
  if (session.amount_total !== order.amountTotal || (session.currency || '').toLowerCase() !== order.currency) {
    throw new Error('Amount mismatch')
  }

  const d = session.customer_details
  const won = await prisma.order.updateMany({
    where: { id: order.id, status: 'PENDING' },
    data: {
      status: 'PAID',
      paidAt: new Date(),
      email: normEmail(d?.email) ?? order.email,
      customerName: d?.name?.trim() || null,
      billingAddress: d?.address ?? undefined,
      taxIds: d?.tax_ids?.length ? d.tax_ids : undefined,
      stripePaymentIntentId: session.payment_intent,
    },
  })
  if (won.count === 0) return { status: 'already' as const }
  await sendReceipt(order.id)
  return { status: 'paid' as const }
}

/** (Re)send the download email. Failures are recorded, not thrown, so the webhook still acknowledges. */
export async function sendReceipt(orderId: string) {
  const order = await prisma.order.findUniqueOrThrow({ where: { id: orderId }, include: { items: true } })
  if (order.status !== 'PAID' || !order.email) return false
  try {
    await sendOrderEmail(order.email, order, order.items.map((i) => ({ title: i.title, priceCents: i.priceCents, downloadUrl: downloadUrl(i.id) })))
    await prisma.order.update({ where: { id: order.id }, data: { emailSentAt: new Date() } })
    return true
  } catch (e) {
    console.error('[shop] receipt email failed', order.id, e instanceof Error ? e.message : e)
    return false
  }
}

export async function markRefunded(paymentIntentId: string, fully: boolean) {
  if (!fully) return 0
  const r = await prisma.order.updateMany({
    where: { stripePaymentIntentId: paymentIntentId, status: 'PAID' },
    data: { status: 'REFUNDED', refundedAt: new Date() },
  })
  return r.count
}

export async function markExpired(sessionId: string) {
  const r = await prisma.order.updateMany({ where: { stripeSessionId: sessionId, status: 'PENDING' }, data: { status: 'CANCELED' } })
  return r.count
}
