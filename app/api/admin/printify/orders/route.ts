import { NextRequest, NextResponse } from 'next/server'
import { z } from 'zod'
import { auth } from '@/app/lib/auth'
import { validateAdminOrigin } from '@/app/lib/adminUtils'
import { createPrintifyOrder, resolvePrintifyShopId, PrintifyError } from '@/lib/printify'

export const runtime = 'nodejs'

function unauthorized() {
  return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
}

const CreateOrderSchema = z.object({
  shopId: z.number().int().positive().optional(),
  payload: z.record(z.string(), z.unknown()),
})

export async function POST(request: NextRequest) {
  const session = await auth.api.getSession({ headers: request.headers })
  if (!session?.user) return unauthorized()
  validateAdminOrigin(request)

  try {
    const parsed = CreateOrderSchema.safeParse(await request.json())
    if (!parsed.success) {
      return NextResponse.json({ error: 'Invalid request body', issues: parsed.error.issues }, { status: 400 })
    }

    const shopId = await resolvePrintifyShopId(parsed.data.shopId ?? null)
    const payload =
      parsed.data.payload.is_draft === undefined ? { ...parsed.data.payload, is_draft: true } : parsed.data.payload

    const order = await createPrintifyOrder(shopId, payload)
    return NextResponse.json({ shopId, order })
  } catch (error) {
    const status = error instanceof PrintifyError ? error.status : 500
    return NextResponse.json(
      { error: 'Failed to create Printify order', details: error instanceof PrintifyError ? error.details : undefined },
      { status },
    )
  }
}

