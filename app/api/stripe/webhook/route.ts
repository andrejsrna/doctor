import { NextRequest, NextResponse } from 'next/server'
import { getStripe } from '@/lib/stripe'
import { prisma } from '@/lib/prisma'
import { Prisma } from '@prisma/client'
import type Stripe from 'stripe'
import { createPrintifyOrder, resolvePrintifyShopId, PrintifyError } from '@/lib/printify'
import nodemailer from 'nodemailer'
import { getBaseUrl } from '@/lib/stripe'
import type { ShopOrder } from '@prisma/client'

export const runtime = 'nodejs'

function splitName(full?: string | null): { first_name: string; last_name: string } {
  const name = (full || '').trim()
  if (!name) return { first_name: 'Customer', last_name: '' }
  const parts = name.split(/\s+/)
  if (parts.length === 1) return { first_name: parts[0]!, last_name: '' }
  return { first_name: parts[0]!, last_name: parts.slice(1).join(' ') }
}

function getString(obj: Prisma.JsonObject, key: string): string | null {
  const val = obj[key]
  return typeof val === 'string' && val.length ? val : null
}

function formatMoney(currency: string, amountTotal: number | null): string {
  if (!amountTotal) return '-'
  try {
    return new Intl.NumberFormat('de-DE', { style: 'currency', currency: currency.toUpperCase() }).format(amountTotal / 100)
  } catch {
    return `${amountTotal / 100} ${currency}`
  }
}

async function sendNewOrderEmail(order: ShopOrder): Promise<void> {
  const to = process.env.ORDER_NOTIFICATION_EMAIL || 'dnbdoctor1@gmail.com'
  const from = process.env.SMTP_FROM
  const host = process.env.SMTP_HOST
  const port = process.env.SMTP_PORT ? Number(process.env.SMTP_PORT) : NaN
  const user = process.env.SMTP_USER
  const pass = process.env.SMTP_PASS

  if (!to || !from || !host || !Number.isFinite(port) || !user || !pass) {
    console.warn('Order email not sent: missing SMTP config or ORDER_NOTIFICATION_EMAIL')
    return
  }

  const transporter = nodemailer.createTransport({
    host,
    port,
    secure: process.env.SMTP_SECURE === '1',
    auth: { user, pass },
  })

  const baseUrl = getBaseUrl()
  const subject = `New order: ${order.id} (${order.status})`
  const shipping = (order.shippingAddress && typeof order.shippingAddress === 'object' && !Array.isArray(order.shippingAddress))
    ? (order.shippingAddress as Prisma.JsonObject)
    : null

  const addressLines = shipping
    ? [
        [getString(shipping, 'address1'), getString(shipping, 'address2')].filter(Boolean).join(' '),
        [getString(shipping, 'zip'), getString(shipping, 'city')].filter(Boolean).join(' '),
        [getString(shipping, 'region'), getString(shipping, 'country')].filter(Boolean).join(', '),
      ].filter((l) => l && l.trim().length > 0)
    : []

  await transporter.sendMail({
    from: `"DnB Doctor Shop" <${from}>`,
    to,
    subject,
    text: [
      `New order`,
      `Order ID: ${order.id}`,
      `Status: ${order.status}`,
      `Amount: ${formatMoney(order.currency, order.amountTotal)}`,
      `Customer: ${order.customerEmail || '-'}`,
      `Product: ${order.printifyProductId} / ${order.printifyVariantId} x ${order.quantity}`,
      `Printify order: ${order.printifyOrderId || '-'}`,
      addressLines.length ? `Ship to:\n${addressLines.join('\n')}` : `Ship to: -`,
      `Admin: ${baseUrl}/admin/orders`,
    ].join('\n'),
    html: `
      <h2>New order</h2>
      <p><strong>Order ID:</strong> ${order.id}</p>
      <p><strong>Status:</strong> ${order.status}</p>
      <p><strong>Amount:</strong> ${formatMoney(order.currency, order.amountTotal)}</p>
      <p><strong>Customer:</strong> ${order.customerEmail || '-'}</p>
      <p><strong>Items:</strong> ${order.printifyProductId} / ${order.printifyVariantId} × ${order.quantity}</p>
      <p><strong>Printify:</strong> ${order.printifyOrderId || '-'}</p>
      <p><strong>Shipping:</strong><br/>${addressLines.length ? addressLines.map((l) => l.replace(/</g, '&lt;')).join('<br/>') : '-'}</p>
      <p><a href="${baseUrl}/admin/orders">Open admin orders</a></p>
    `,
  })
}

export async function POST(request: NextRequest) {
  const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET
  if (!webhookSecret) {
    return NextResponse.json({ error: 'Missing STRIPE_WEBHOOK_SECRET' }, { status: 500 })
  }

  const signature = request.headers.get('stripe-signature')
  if (!signature) return NextResponse.json({ error: 'Missing stripe-signature header' }, { status: 400 })

  const body = await request.text()
  const stripe = getStripe()

  let event
  try {
    event = stripe.webhooks.constructEvent(body, signature, webhookSecret)
  } catch {
    return NextResponse.json({ error: 'Invalid signature' }, { status: 400 })
  }

  try {
    if (event.type === 'checkout.session.completed') {
      const session = event.data.object as Stripe.Checkout.Session
      const metadata = session.metadata || {}
      const printifyShopId = metadata.shop_id ? Number(metadata.shop_id) : null
      const printifyProductId = metadata.printify_product_id || null
      const printifyVariantId = metadata.printify_variant_id ? Number(metadata.printify_variant_id) : null
      const quantity = metadata.quantity ? Number(metadata.quantity) : 1

      if (!printifyProductId || !printifyVariantId) {
        return NextResponse.json({ error: 'Missing Printify metadata' }, { status: 400 })
      }

      const shippingDetails = session.collected_information?.shipping_details || null
      const customerName = session.customer_details?.name || shippingDetails?.name || null
      const customerEmail = session.customer_details?.email || null
      const { first_name, last_name } = splitName(customerName)

      const shipping = shippingDetails?.address
        ? ({
            name: shippingDetails?.name || null,
            first_name,
            last_name,
            email: customerEmail,
            phone: session.customer_details?.phone || null,
            address1: shippingDetails.address.line1 || null,
            address2: shippingDetails.address.line2 || null,
            city: shippingDetails.address.city || null,
            region: shippingDetails.address.state || null,
            zip: shippingDetails.address.postal_code || null,
            country: shippingDetails.address.country || null,
          } satisfies Prisma.InputJsonObject)
        : null

      const stripeRaw = JSON.parse(JSON.stringify(session)) as Prisma.InputJsonValue

      let dbOrder = await prisma.shopOrder.upsert({
        where: { stripeSessionId: session.id },
        update: {
          status: session.payment_status === 'paid' ? 'PAID' : 'PENDING',
          stripePaymentIntentId: typeof session.payment_intent === 'string' ? session.payment_intent : null,
          currency: session.currency || 'usd',
          amountTotal: typeof session.amount_total === 'number' ? session.amount_total : null,
          printifyShopId: printifyShopId && Number.isFinite(printifyShopId) ? printifyShopId : null,
          printifyProductId,
          printifyVariantId,
          quantity,
          customerEmail,
          customerName,
          shippingAddress: shipping ? shipping : Prisma.JsonNull,
          stripeRaw,
        },
        create: {
          stripeSessionId: session.id,
          stripePaymentIntentId: typeof session.payment_intent === 'string' ? session.payment_intent : null,
          status: session.payment_status === 'paid' ? 'PAID' : 'PENDING',
          currency: session.currency || 'usd',
          amountTotal: typeof session.amount_total === 'number' ? session.amount_total : null,
          printifyShopId: printifyShopId && Number.isFinite(printifyShopId) ? printifyShopId : null,
          printifyProductId,
          printifyVariantId,
          quantity,
          customerEmail,
          customerName,
          shippingAddress: shipping ? shipping : Prisma.JsonNull,
          stripeRaw,
        },
      })

      // Auto-create Printify order after successful payment.
      // Safety: idempotent checks + always return 200 to Stripe even if Printify fails.
      if (
        session.payment_status === 'paid' &&
        dbOrder.status !== 'PRINTIFY_CREATED' &&
        !dbOrder.printifyOrderId &&
        dbOrder.shippingAddress !== null &&
        typeof dbOrder.shippingAddress === 'object' &&
        !Array.isArray(dbOrder.shippingAddress)
      ) {
        const shippingObj = dbOrder.shippingAddress as Prisma.JsonObject
        const country = getString(shippingObj, 'country')
        if (country) {
          try {
            const shopId = await resolvePrintifyShopId(dbOrder.printifyShopId ?? null)
            const payload: Record<string, unknown> = {
              external_id: `stripe_${dbOrder.stripeSessionId}`,
              label: `DnBDoctor ${dbOrder.id}`,
              is_draft: true,
              line_items: [
                {
                  product_id: dbOrder.printifyProductId,
                  variant_id: dbOrder.printifyVariantId,
                  quantity: dbOrder.quantity,
                },
              ],
              address_to: {
                first_name: getString(shippingObj, 'first_name') || 'Customer',
                last_name: getString(shippingObj, 'last_name') || '',
                email: dbOrder.customerEmail || getString(shippingObj, 'email') || undefined,
                phone: getString(shippingObj, 'phone') || undefined,
                country,
                region: getString(shippingObj, 'region') || undefined,
                address1: getString(shippingObj, 'address1') || undefined,
                address2: getString(shippingObj, 'address2') || undefined,
                city: getString(shippingObj, 'city') || undefined,
                zip: getString(shippingObj, 'zip') || undefined,
              },
            }

            const created = await createPrintifyOrder(shopId, payload)
            const createdObj = created && typeof created === 'object' ? (created as Record<string, unknown>) : null
            const printifyOrderId = createdObj && 'id' in createdObj ? String((createdObj as { id: unknown }).id) : null
            const printifyRaw = createdObj
              ? (JSON.parse(JSON.stringify(createdObj)) as Prisma.InputJsonValue)
              : Prisma.JsonNull

            dbOrder = await prisma.shopOrder.update({
              where: { id: dbOrder.id },
              data: {
                status: 'PRINTIFY_CREATED',
                printifyOrderId: printifyOrderId ?? undefined,
                printifyRaw,
              },
            })
          } catch (error) {
            const details = error instanceof PrintifyError ? error.details : undefined
            const printifyRaw =
              details !== undefined ? (JSON.parse(JSON.stringify(details)) as Prisma.InputJsonValue) : Prisma.JsonNull

            dbOrder = await prisma.shopOrder.update({
              where: { id: dbOrder.id },
              data: { status: 'PRINTIFY_FAILED', printifyRaw },
            })
          }
        }
      }

      if (dbOrder.status === 'PAID' || dbOrder.status === 'PRINTIFY_CREATED' || dbOrder.status === 'PRINTIFY_FAILED') {
        if (!dbOrder.notificationEmailSentAt) {
          try {
            await sendNewOrderEmail(dbOrder)
            dbOrder = await prisma.shopOrder.update({
              where: { id: dbOrder.id },
              data: { notificationEmailSentAt: new Date() },
            })
          } catch (e) {
            console.error('Failed to send order notification email', e)
          }
        }
      }
    }

    if (event.type === 'checkout.session.expired') {
      const session = event.data.object as Stripe.Checkout.Session
      const stripeRaw = JSON.parse(JSON.stringify(session)) as Prisma.InputJsonValue
      await prisma.shopOrder.updateMany({
        where: { stripeSessionId: session.id },
        data: { status: 'CANCELED', stripeRaw },
      })
    }

    return NextResponse.json({ received: true })
  } catch (e) {
    console.error('Stripe webhook handler error', e)
    return NextResponse.json({ error: 'Webhook handler failed' }, { status: 500 })
  }
}
