import { prisma } from '@/lib/prisma'
import { sendEmail } from '@/app/services/email'
import { htmlToText } from '@/lib/newsletter/mailer'
import type { CheckoutSession } from './stripe'
import { normEmail } from './orders'
import { createPrintfulOrder, printfulConfigured } from './printful'
import { addressLines, requestScrmInvoice, scrmConfigured, storeInvoicePdf } from './invoices'
import { invoiceEmailHtml, sendMerchAdminEmail, sendMerchOrderEmail, sendMerchShippedEmail, type MerchMailLine } from './emails'

// Paid merch orders → Printful. Every step is idempotent: Stripe retries webhooks, the thanks page runs the
// same path, and failed Printful/SCRM calls are retried on later webhooks.

const MAX_ATTEMPTS = 6

type StripeAddress = { line1?: string | null; line2?: string | null; city?: string | null; state?: string | null; postal_code?: string | null; country?: string | null }
type ShippingDetails = { name?: string | null; address?: StripeAddress | null; phone?: string | null }
export type MerchSession = CheckoutSession & {
  shipping_details?: ShippingDetails | null
  collected_information?: { shipping_details?: ShippingDetails | null } | null
  customer_details?: (CheckoutSession['customer_details'] & { phone?: string | null }) | null
}

/** Stripe moved shipping details under `collected_information` in newer API versions; accept both. */
export const sessionShipping = (s: MerchSession): ShippingDetails | null => s.collected_information?.shipping_details ?? s.shipping_details ?? null

export const isMerchSession = (s: { metadata?: Record<string, string> | null }) => s.metadata?.kind === 'merch'

const lines = (items: { title: string; quantity: number; unitCents: number }[]): MerchMailLine[] => items.map(({ title, quantity, unitCents }) => ({ title, quantity, unitCents }))

export async function fulfilMerchSession(session: MerchSession) {
  if (session.payment_status !== 'paid') return { status: 'unpaid' as const }
  const orderId = session.metadata?.merchOrderId
  if (!orderId) throw new Error('Merch session without merchOrderId')
  const order = await prisma.merchOrder.findUnique({ where: { id: orderId } })
  if (!order || order.stripeSessionId !== session.id) throw new Error('Merch order/session mismatch')
  if (session.amount_total !== order.amountTotal || (session.currency || '').toLowerCase() !== order.currency) throw new Error('Merch amount mismatch')

  const ship = sessionShipping(session)
  if (!ship?.address?.line1) throw new Error('Merch session without shipping address')
  const d = session.customer_details
  const won = await prisma.merchOrder.updateMany({
    where: { id: order.id, status: 'PENDING' },
    data: {
      status: 'PAID',
      paidAt: new Date(),
      email: normEmail(d?.email) ?? order.email,
      customerName: ship.name?.trim() || d?.name?.trim() || null,
      shippingAddress: { ...ship.address, phone: ship.phone ?? d?.phone ?? null },
      stripePaymentIntentId: session.payment_intent,
    },
  })
  if (won.count === 0) return { status: 'already' as const }

  const paid = await prisma.merchOrder.findUniqueOrThrow({ where: { id: order.id }, include: { items: true } })
  if (paid.email) {
    try {
      await sendMerchOrderEmail(paid.email, paid, lines(paid.items), addressLines(paid.shippingAddress as StripeAddress))
      await prisma.merchOrder.update({ where: { id: paid.id }, data: { emailSentAt: new Date() } })
    } catch (e) {
      console.error('[merch] confirmation email failed', paid.id, e instanceof Error ? e.message : e)
    }
  }
  const pf = await pushToPrintful(paid.id)
  await sendMerchAdminEmail(paid, lines(paid.items), pf.ok ? `order #${pf.printfulOrderId} ${pf.fulfilment === 'DRAFT' ? 'created as DRAFT — confirm it in Printful' : 'confirmed, in production'}` : `FAILED (${pf.error}) — will retry automatically`).catch((e) =>
    console.error('[merch] admin email failed', paid.id, e instanceof Error ? e.message : e),
  )
  await issueMerchInvoice(paid.id)
  return { status: 'paid' as const }
}

/** Create the Printful order for a paid merch order. Never throws. */
export async function pushToPrintful(orderId: string): Promise<{ ok: boolean; printfulOrderId?: number; fulfilment?: string; error?: string }> {
  const order = await prisma.merchOrder.findUnique({ where: { id: orderId }, include: { items: true } })
  if (!order || order.status !== 'PAID') return { ok: false, error: 'Order is not paid' }
  if (order.printfulOrderId) return { ok: true, printfulOrderId: order.printfulOrderId, fulfilment: order.fulfilment }
  if (!printfulConfigured()) return { ok: false, error: 'Printful not configured' }
  const a = (order.shippingAddress ?? {}) as StripeAddress & { phone?: string | null }
  const confirm = process.env.PRINTFUL_CONFIRM === '1'
  try {
    const pf = await createPrintfulOrder({
      externalId: order.id,
      shipping: order.shippingRate,
      confirm,
      currency: order.currency,
      shippingCents: order.shippingCents,
      recipient: {
        name: order.customerName || order.email || 'Customer',
        address1: a.line1 || '',
        address2: a.line2 || null,
        city: a.city || '',
        state_code: a.state || null,
        country_code: a.country || order.country,
        zip: a.postal_code || '',
        email: order.email,
        phone: a.phone || null,
      },
      items: order.items.map((i) => ({ syncVariantId: Number(i.syncVariantId), quantity: i.quantity, unitCents: i.unitCents })),
    })
    const fulfilment = pf.status === 'draft' ? 'DRAFT' : 'SUBMITTED'
    await prisma.merchOrder.update({ where: { id: order.id }, data: { printfulOrderId: pf.id, fulfilment, printfulError: null, printfulAttempts: { increment: 1 } } })
    return { ok: true, printfulOrderId: pf.id, fulfilment }
  } catch (e) {
    const error = e instanceof Error ? e.message : String(e)
    console.error('[merch] printful order failed', order.id, error)
    const attempts = order.printfulAttempts + 1
    await prisma.merchOrder.update({ where: { id: order.id }, data: { printfulAttempts: attempts, printfulError: error.slice(0, 500), fulfilment: attempts >= MAX_ATTEMPTS ? 'FAILED' : 'PENDING' } })
    return { ok: false, error }
  }
}

/** SCRM invoice for a paid merch order: goods + shipping lines. Never throws. */
export async function issueMerchInvoice(orderId: string): Promise<{ ok: boolean; number?: string; error?: string }> {
  const order = await prisma.merchOrder.findUnique({ where: { id: orderId }, include: { items: true } })
  if (!order || !order.paidAt || order.status === 'PENDING' || order.status === 'CANCELED') return { ok: false, error: 'Order is not paid' }
  if (order.invoiceState === 'ISSUED' && order.invoiceNumber) return { ok: true, number: order.invoiceNumber }
  if (!scrmConfigured()) return { ok: false, error: 'SCRM not configured' }
  try {
    const invoice = await requestScrmInvoice({
      orderId: order.id,
      paidAt: order.paidAt,
      paymentReference: order.stripePaymentIntentId,
      currency: order.currency,
      customer: { name: order.customerName || order.email, email: order.email, addressLines: addressLines(order.shippingAddress as StripeAddress), vatId: null },
      items: [
        ...order.items.map((i) => ({ description: `${i.title} (tovar vyrobený na objednávku)`, quantity: i.quantity, unitPrice: i.unitCents / 100 })),
        { description: `Doprava${order.shippingName ? ` (${order.shippingName})` : ''}`, quantity: 1, unitPrice: order.shippingCents / 100 },
      ],
    })
    const { pdf, key } = await storeInvoicePdf(order.id, invoice)
    await prisma.merchOrder.update({ where: { id: order.id }, data: { invoiceState: 'ISSUED', invoiceNumber: invoice.number, invoiceUrl: key, invoiceError: null, invoiceAttempts: { increment: 1 } } })
    if (order.email) {
      const html = invoiceEmailHtml(invoice.number)
      await sendEmail({ to: order.email, subject: `Invoice ${invoice.number} — DnB Doctor`, html, text: htmlToText(html), attachments: [{ filename: `faktura-${invoice.number}.pdf`, content: pdf, contentType: 'application/pdf' }] }).catch((e) =>
        console.error('[merch] invoice email failed', order.id, e instanceof Error ? e.message : e),
      )
    }
    return { ok: true, number: invoice.number }
  } catch (e) {
    const error = e instanceof Error ? e.message : String(e)
    console.error('[merch] invoice failed', order.id, error)
    const attempts = order.invoiceAttempts + 1
    await prisma.merchOrder.update({ where: { id: order.id }, data: { invoiceAttempts: attempts, invoiceError: error.slice(0, 500), invoiceState: attempts >= 8 ? 'FAILED' : 'PENDING' } })
    return { ok: false, error }
  }
}

/** Retry Printful orders and invoices that failed earlier (called after every Stripe webhook). */
export async function retryMerch(limit = 5) {
  const cutoff = new Date(Date.now() - 60_000)
  const [pf, inv] = await Promise.all([
    prisma.merchOrder.findMany({ where: { status: 'PAID', fulfilment: 'PENDING', printfulOrderId: null, paidAt: { lt: cutoff } }, orderBy: { paidAt: 'asc' }, take: limit, select: { id: true } }),
    scrmConfigured()
      ? prisma.merchOrder.findMany({ where: { status: { in: ['PAID', 'REFUNDED'] }, invoiceState: 'PENDING', paidAt: { lt: cutoff } }, orderBy: { paidAt: 'asc' }, take: limit, select: { id: true } })
      : [],
  ])
  for (const o of pf) await pushToPrintful(o.id)
  for (const o of inv) await issueMerchInvoice(o.id)
  return pf.length + inv.length
}

export async function markMerchExpired(sessionId: string) {
  const r = await prisma.merchOrder.updateMany({ where: { stripeSessionId: sessionId, status: 'PENDING' }, data: { status: 'CANCELED' } })
  return r.count
}

export async function markMerchRefunded(paymentIntentId: string, fully: boolean) {
  if (!fully) return 0
  const r = await prisma.merchOrder.updateMany({ where: { stripePaymentIntentId: paymentIntentId, status: 'PAID' }, data: { status: 'REFUNDED', refundedAt: new Date() } })
  return r.count
}

type PrintfulEvent = {
  type: string
  data?: {
    order?: { id?: number; external_id?: string | null; status?: string }
    shipment?: { tracking_number?: string | null; tracking_url?: string | null; carrier?: string | null; service?: string | null }
    reason?: string
  }
}

/** Printful webhook: shipment tracking → customer email; failures/cancellations → order state. */
export async function handlePrintfulEvent(event: PrintfulEvent) {
  const externalId = event.data?.order?.external_id
  if (!externalId) return 'ignored'
  const order = await prisma.merchOrder.findUnique({ where: { id: externalId } })
  if (!order) return 'unknown order'
  switch (event.type) {
    case 'package_shipped': {
      const s = event.data?.shipment ?? {}
      const won = await prisma.merchOrder.updateMany({
        where: { id: order.id, shippedAt: null },
        data: { fulfilment: 'SHIPPED', shippedAt: new Date(), trackingNumber: s.tracking_number ?? null, trackingUrl: s.tracking_url ?? null, carrier: [s.carrier, s.service].filter(Boolean).join(' ') || null },
      })
      if (won.count && order.email) {
        await sendMerchShippedEmail(order.email, order, { url: s.tracking_url ?? null, number: s.tracking_number ?? null, carrier: s.carrier ?? null }).catch((e) =>
          console.error('[merch] shipped email failed', order.id, e instanceof Error ? e.message : e),
        )
      }
      return 'shipped'
    }
    case 'order_created':
    case 'order_updated':
      if (event.data?.order?.status && event.data.order.status !== 'draft' && order.fulfilment === 'DRAFT') await prisma.merchOrder.update({ where: { id: order.id }, data: { fulfilment: 'SUBMITTED' } })
      return 'updated'
    case 'order_failed':
      await prisma.merchOrder.update({ where: { id: order.id }, data: { fulfilment: 'FAILED', printfulError: (event.data?.reason || 'order_failed').slice(0, 500) } })
      return 'failed'
    case 'order_canceled':
      await prisma.merchOrder.update({ where: { id: order.id }, data: { fulfilment: 'CANCELED', printfulError: event.data?.reason?.slice(0, 500) ?? null } })
      return 'canceled'
    default:
      return 'ignored'
  }
}
