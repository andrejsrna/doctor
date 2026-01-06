import Link from 'next/link'
import { notFound } from 'next/navigation'
import { prisma } from '@/lib/prisma'
import { isShopEnabled } from '@/app/utils/shop'

export const revalidate = 0

export default async function ShopSuccessPage({ searchParams }: { searchParams: Promise<{ session_id?: string }> }) {
  if (!isShopEnabled()) notFound()
  const sp = await searchParams
  const sessionId = sp.session_id || ''

  const order = sessionId
    ? await prisma.shopOrder.findUnique({
        where: { stripeSessionId: sessionId },
        select: { id: true, status: true, createdAt: true, printifyOrderId: true },
      })
    : null

  return (
    <div className="min-h-screen bg-black text-white">
      <section className="max-w-2xl mx-auto px-4 py-20 space-y-6">
        <h1 className="text-3xl font-bold">Thanks — payment received</h1>
        {sessionId ? (
          order ? (
            <div className="rounded-2xl border border-green-500/20 bg-green-500/10 p-5 space-y-1">
              <p className="text-green-100">Order status: {order.status}</p>
              <p className="text-sm text-green-200/80">Order ID: {order.id}</p>
              {order.printifyOrderId && <p className="text-sm text-green-200/80">Printify: {order.printifyOrderId}</p>}
            </div>
          ) : (
            <div className="rounded-2xl border border-white/10 bg-white/5 p-5 text-gray-200">
              We’re confirming your order. Refresh this page in a moment.
            </div>
          )
        ) : (
          <div className="rounded-2xl border border-white/10 bg-white/5 p-5 text-gray-200">Missing session id.</div>
        )}
        <div className="flex gap-3 flex-wrap">
          <Link href="/shop" className="px-4 py-2 rounded-lg border border-purple-400/50 hover:border-purple-300 text-purple-100">
            Back to shop
          </Link>
          <Link href="/contact" className="px-4 py-2 rounded-lg border border-white/10 hover:border-white/20 text-gray-100">
            Support
          </Link>
        </div>
      </section>
    </div>
  )
}
