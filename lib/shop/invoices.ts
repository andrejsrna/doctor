import { GetObjectCommand, PutObjectCommand, S3Client } from '@aws-sdk/client-s3'
import { prisma } from '@/lib/prisma'
import { sendEmail } from '@/app/services/email'
import { htmlToText } from '@/lib/newsletter/mailer'
import { invoiceEmailHtml } from './emails'

// Invoices are issued by SCRM (crm.andrejsrna.sk) for Andrej Srna (private seller) and stored there;
// we keep a private copy of the PDF in R2 so My account can serve it without calling SCRM.

const MAX_ATTEMPTS = 8

export function scrmConfigured() {
  return Boolean(process.env.SCRM_URL && process.env.SCRM_SHOP_TOKEN)
}

function r2() {
  const { R2_ENDPOINT: endpoint, R2_ACCESS_KEY_ID: accessKeyId, R2_SECRET_ACCESS_KEY: secretAccessKey } = process.env
  const bucket = process.env.R2_BUCKET || process.env.R2_BUCKET_NAME
  if (!endpoint || !accessKeyId || !secretAccessKey || !bucket) throw new Error('R2 not configured')
  return { bucket, client: new S3Client({ region: 'auto', endpoint, forcePathStyle: true, credentials: { accessKeyId, secretAccessKey } }) }
}

type Address = { line1?: string | null; line2?: string | null; postal_code?: string | null; city?: string | null; state?: string | null; country?: string | null }

export function addressLines(a: Address | null | undefined) {
  if (!a) return []
  const city = [a.postal_code, a.city].filter(Boolean).join(' ')
  return [a.line1, a.line2, [city, a.state].filter(Boolean).join(', '), a.country].filter((x): x is string => Boolean(x && x.trim()))
}

/** Issue (or re-fetch) the SCRM invoice for a paid order, keep the PDF, email it. Never throws. */
export async function issueInvoice(orderId: string): Promise<{ ok: boolean; number?: string; error?: string }> {
  const order = await prisma.order.findUnique({ where: { id: orderId }, include: { items: true } })
  if (!order || order.status === 'PENDING' || order.status === 'CANCELED' || !order.paidAt) return { ok: false, error: 'Order is not paid' }
  if (order.invoiceState === 'ISSUED' && order.invoiceNumber) return { ok: true, number: order.invoiceNumber }
  if (!scrmConfigured()) return { ok: false, error: 'SCRM not configured' }

  try {
    const taxIds = Array.isArray(order.taxIds) ? (order.taxIds as { type: string; value: string }[]) : []
    const res = await fetch(`${process.env.SCRM_URL!.replace(/\/$/, '')}/api/integrations/shop/invoices`, {
      method: 'POST',
      headers: { Authorization: `Bearer ${process.env.SCRM_SHOP_TOKEN}`, 'Content-Type': 'application/json' },
      body: JSON.stringify({
        orderId: order.id,
        source: 'dnbdoctor',
        paidAt: order.paidAt.toISOString(),
        paymentReference: order.stripePaymentIntentId,
        currency: order.currency.toUpperCase(),
        customer: {
          name: order.customerName || order.email,
          email: order.email,
          addressLines: addressLines(order.billingAddress as Address | null),
          vatId: taxIds.find((t) => t.type === 'eu_vat')?.value ?? null,
        },
        items: order.items.map((i) => ({ description: `${i.title} (digitálny produkt na stiahnutie)`, quantity: 1, unitPrice: i.priceCents / 100 })),
      }),
      signal: AbortSignal.timeout(20000),
      cache: 'no-store',
    })
    const json = (await res.json().catch(() => ({}))) as { number?: string; pdfBase64?: string; error?: string }
    if (!res.ok || !json.number || !json.pdfBase64) throw new Error(json.error || `SCRM ${res.status}`)

    const pdf = Buffer.from(json.pdfBase64, 'base64')
    const key = `shop/invoices/${order.id}/faktura-${json.number}.pdf`
    const { client, bucket } = r2()
    await client.send(new PutObjectCommand({ Bucket: bucket, Key: key, Body: pdf, ContentType: 'application/pdf' }))
    await prisma.order.update({
      where: { id: order.id },
      data: { invoiceState: 'ISSUED', invoiceNumber: json.number, invoiceUrl: key, invoiceError: null, invoiceAttempts: { increment: 1 } },
    })

    if (order.email) {
      const html = invoiceEmailHtml(json.number)
      await sendEmail({
        to: order.email,
        subject: `Invoice ${json.number} — DnB Doctor`,
        html,
        text: htmlToText(html),
        attachments: [{ filename: `faktura-${json.number}.pdf`, content: pdf, contentType: 'application/pdf' }],
      }).catch((e) => console.error('[shop] invoice email failed', order.id, e instanceof Error ? e.message : e))
    }
    return { ok: true, number: json.number }
  } catch (e) {
    const error = e instanceof Error ? e.message : String(e)
    console.error('[shop] invoice failed', order.id, error)
    const attempts = order.invoiceAttempts + 1
    await prisma.order.update({
      where: { id: order.id },
      data: { invoiceAttempts: attempts, invoiceError: error.slice(0, 500), invoiceState: attempts >= MAX_ATTEMPTS ? 'FAILED' : 'PENDING' },
    })
    return { ok: false, error }
  }
}

/** Paid orders whose invoice is still pending — retried on later webhooks and from the admin. */
export async function retryPendingInvoices(limit = 5) {
  if (!scrmConfigured()) return 0
  const pending = await prisma.order.findMany({
    where: { status: { in: ['PAID', 'REFUNDED'] }, invoiceState: 'PENDING', paidAt: { lt: new Date(Date.now() - 60_000) } },
    orderBy: { paidAt: 'asc' },
    take: limit,
    select: { id: true },
  })
  for (const o of pending) await issueInvoice(o.id)
  return pending.length
}

export async function invoicePdf(key: string) {
  const { client, bucket } = r2()
  const obj = await client.send(new GetObjectCommand({ Bucket: bucket, Key: key }))
  return obj.Body ? Buffer.from(await obj.Body.transformToByteArray()) : null
}
