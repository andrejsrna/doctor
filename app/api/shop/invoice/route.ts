import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { auth } from '@/app/lib/auth'
import { staffSession } from '@/app/lib/roles'
import { invoicePdf } from '@/lib/shop/invoices'

export const dynamic = 'force-dynamic'

export async function GET(request: NextRequest) {
  const id = request.nextUrl.searchParams.get('order') || ''
  const session = await auth.api.getSession({ headers: request.headers })
  if (!session?.user) return NextResponse.json({ error: 'Sign in to download invoices' }, { status: 401 })

  const order = await prisma.order.findUnique({ where: { id }, select: { email: true, invoiceNumber: true, invoiceUrl: true } })
  const owner = session.user.emailVerified && order?.email === session.user.email.toLowerCase()
  if (!order?.invoiceUrl || !(owner || (await staffSession(request.headers)))) return NextResponse.json({ error: 'Invoice not found' }, { status: 404 })

  const pdf = await invoicePdf(order.invoiceUrl)
  if (!pdf) return NextResponse.json({ error: 'Invoice not found' }, { status: 404 })
  return new NextResponse(new Uint8Array(pdf), {
    headers: {
      'Content-Type': 'application/pdf',
      'Content-Disposition': `attachment; filename="faktura-${order.invoiceNumber}.pdf"`,
      'Cache-Control': 'private, no-store',
    },
  })
}
