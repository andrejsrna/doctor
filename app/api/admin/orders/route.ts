import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { auth } from '@/app/lib/auth'
import { validateAdminOrigin } from '@/app/lib/adminUtils'
import { z } from 'zod'
import type { Prisma } from '@prisma/client'

export const runtime = 'nodejs'

function unauthorized() {
  return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
}

export async function GET(request: NextRequest) {
  const session = await auth.api.getSession({ headers: request.headers })
  if (!session?.user) return unauthorized()

  const { searchParams } = new URL(request.url)
  const page = parseInt(searchParams.get('page') || '1')
  const limit = parseInt(searchParams.get('limit') || '20')
  const status = (searchParams.get('status') || '').trim()
  const search = (searchParams.get('search') || '').trim()

  const skip = (page - 1) * limit
  const StatusSchema = z.enum(['PENDING', 'PAID', 'CANCELED', 'PRINTIFY_CREATED', 'PRINTIFY_FAILED'])
  const where: Prisma.ShopOrderWhereInput = {}

  if (status) {
    const parsed = StatusSchema.safeParse(status)
    if (!parsed.success) return NextResponse.json({ error: 'Invalid status filter' }, { status: 400 })
    where.status = parsed.data
  }
  if (search) {
    where.OR = [
      { stripeSessionId: { contains: search, mode: 'insensitive' as const } },
      { customerEmail: { contains: search, mode: 'insensitive' as const } },
    ]
  }

  const [items, total] = await Promise.all([
    prisma.shopOrder.findMany({
      where,
      orderBy: { createdAt: 'desc' },
      skip,
      take: limit,
      select: {
        id: true,
        status: true,
        createdAt: true,
        currency: true,
        amountTotal: true,
        customerEmail: true,
        customerName: true,
        printifyShopId: true,
        printifyProductId: true,
        printifyVariantId: true,
        quantity: true,
        stripeSessionId: true,
        stripePaymentIntentId: true,
        printifyOrderId: true,
      },
    }),
    prisma.shopOrder.count({ where }),
  ])

  return NextResponse.json({
    items,
    pagination: { page, limit, total, pages: Math.ceil(total / limit) },
  })
}

export async function PATCH(request: NextRequest) {
  const session = await auth.api.getSession({ headers: request.headers })
  if (!session?.user) return unauthorized()
  validateAdminOrigin(request)

  const data = await request.json().catch(() => null)
  if (!data?.id) return NextResponse.json({ error: 'Missing id' }, { status: 400 })

  const updated = await prisma.shopOrder.update({
    where: { id: String(data.id) },
    data: {
      status: data.status ?? undefined,
      printifyOrderId: data.printifyOrderId ?? undefined,
    },
  })

  return NextResponse.json({ item: updated })
}
