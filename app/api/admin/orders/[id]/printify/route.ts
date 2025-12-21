import { NextRequest, NextResponse } from 'next/server'
import { z } from 'zod'
import { auth } from '@/app/lib/auth'
import { validateAdminOrigin } from '@/app/lib/adminUtils'
import { prisma } from '@/lib/prisma'
import { createPrintifyOrder, resolvePrintifyShopId, PrintifyError } from '@/lib/printify'
import { Prisma } from '@prisma/client'

export const runtime = 'nodejs'

function unauthorized() {
  return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
}

const CreatePrintifySchema = z.object({
  shippingMethod: z.number().int().positive().optional(),
  isDraft: z.boolean().optional(),
})

export async function POST(request: NextRequest, ctx: { params: Promise<{ id: string }> }) {
  const session = await auth.api.getSession({ headers: request.headers })
  if (!session?.user) return unauthorized()
  validateAdminOrigin(request)

  const { id } = await ctx.params
  const order = await prisma.shopOrder.findUnique({ where: { id } })
  if (!order) return NextResponse.json({ error: 'Order not found' }, { status: 404 })
  if (order.status !== 'PAID' && order.status !== 'PRINTIFY_FAILED') {
    return NextResponse.json({ error: `Order status must be PAID (or PRINTIFY_FAILED). Current: ${order.status}` }, { status: 400 })
  }

  const parsed = CreatePrintifySchema.safeParse(await request.json().catch(() => ({})))
  if (!parsed.success) {
    return NextResponse.json({ error: 'Invalid request body', issues: parsed.error.issues }, { status: 400 })
  }

  const shopId = await resolvePrintifyShopId(order.printifyShopId ?? null)
  const shipping = (order.shippingAddress || {}) as Prisma.JsonObject

  const payload: Record<string, unknown> = {
    external_id: `stripe_${order.stripeSessionId}`,
    label: `DnBDoctor ${order.id}`,
    is_draft: parsed.data.isDraft ?? true,
    line_items: [
      {
        product_id: order.printifyProductId,
        variant_id: order.printifyVariantId,
        quantity: order.quantity,
      },
    ],
  }

  if (parsed.data.shippingMethod) payload.shipping_method = parsed.data.shippingMethod

  const country = typeof shipping.country === 'string' ? shipping.country : null
  if (country) {
    payload.address_to = {
      first_name: typeof shipping.first_name === 'string' ? shipping.first_name : 'Customer',
      last_name: typeof shipping.last_name === 'string' ? shipping.last_name : '',
      email:
        order.customerEmail ||
        (typeof shipping.email === 'string' ? shipping.email : undefined),
      phone: typeof shipping.phone === 'string' ? shipping.phone : undefined,
      country,
      region: typeof shipping.region === 'string' ? shipping.region : undefined,
      address1: typeof shipping.address1 === 'string' ? shipping.address1 : undefined,
      address2: typeof shipping.address2 === 'string' ? shipping.address2 : undefined,
      city: typeof shipping.city === 'string' ? shipping.city : undefined,
      zip: typeof shipping.zip === 'string' ? shipping.zip : undefined,
    }
  }

  try {
    const created = await createPrintifyOrder(shopId, payload)
    const createdObj = (created && typeof created === 'object' ? (created as Record<string, unknown>) : null)
    const printifyOrderId = createdObj && 'id' in createdObj ? String((createdObj as { id: unknown }).id) : null
    const printifyRaw = createdObj ? (JSON.parse(JSON.stringify(createdObj)) as Prisma.InputJsonValue) : Prisma.JsonNull

    const updated = await prisma.shopOrder.update({
      where: { id: order.id },
      data: {
        status: 'PRINTIFY_CREATED',
        printifyOrderId: printifyOrderId ?? undefined,
        printifyRaw,
      },
    })

    return NextResponse.json({ shopId, order: updated, printify: created })
  } catch (error) {
    const details = error instanceof PrintifyError ? error.details : undefined
    const printifyRaw = details !== undefined ? (JSON.parse(JSON.stringify(details)) as Prisma.InputJsonValue) : Prisma.JsonNull
    await prisma.shopOrder.update({
      where: { id: order.id },
      data: {
        status: 'PRINTIFY_FAILED',
        printifyRaw,
      },
    })
    return NextResponse.json({ error: 'Failed to create Printify order', details }, { status: error instanceof PrintifyError ? error.status : 500 })
  }
}
