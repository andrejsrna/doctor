import type { Metadata } from 'next'
import Link from 'next/link'
import { prisma } from '@/lib/prisma'
import { retrieveCheckoutSession, stripeConfigured } from '@/lib/shop/stripe'
import { fulfilMerchSession, isMerchSession, type MerchSession } from '@/lib/shop/merch'
import ClearBag from './ClearBag'

export const dynamic = 'force-dynamic'
export const metadata: Metadata = { title: 'Thank you | DnB Doctor merch', robots: { index: false, follow: false } }

export default async function MerchThanksPage({ searchParams }: { searchParams: Promise<{ session_id?: string }> }) {
  const { session_id } = await searchParams
  let state: 'paid' | 'processing' | 'unknown' = 'unknown'
  let email: string | null = null
  let items: string[] = []

  if (session_id && /^cs_[A-Za-z0-9_]+$/.test(session_id) && stripeConfigured()) {
    try {
      // Don't wait for the webhook: confirm with Stripe directly (same idempotent path).
      const session = (await retrieveCheckoutSession(session_id)) as MerchSession
      if (isMerchSession(session)) {
        if (session.payment_status === 'paid') {
          await fulfilMerchSession(session)
          state = 'paid'
        } else if (session.status === 'complete') state = 'processing'
        const order = await prisma.merchOrder.findUnique({ where: { stripeSessionId: session_id }, include: { items: { select: { title: true, quantity: true } } } })
        email = order?.email ?? session.customer_details?.email ?? null
        items = order?.items.map((i) => (i.quantity > 1 ? `${i.quantity}× ${i.title}` : i.title)) ?? []
      }
    } catch (e) {
      console.error('[merch] thanks page', e instanceof Error ? e.message : e)
    }
  }

  return (
    <main className="mx-auto min-h-[70vh] max-w-2xl px-5 pb-24 pt-36 text-[#e8e8ec]">
      {state === 'paid' && <ClearBag />}
      <p className="font-mono text-xs uppercase tracking-[0.25em] text-[#39ff14]">{state === 'paid' ? 'Payment received' : state === 'processing' ? 'Payment processing' : 'Merch order'}</p>
      <h1 className="mt-3 text-4xl font-bold uppercase leading-none text-white md:text-6xl">{state === 'unknown' ? 'Order status' : 'Thank you'}</h1>
      {state === 'paid' && (
        <div className="mt-8 space-y-4 text-lg leading-relaxed">
          {items.length > 0 && <p>Your order: <strong className="text-white">{items.join(', ')}</strong>.</p>}
          <p>Each piece is now printed to order. Production usually takes 2 to 5 business days and we email you the tracking link{email ? <> at <strong className="text-white">{email}</strong></> : ''} as soon as it ships.</p>
          <p>The order confirmation and the invoice are on their way to your inbox.</p>
        </div>
      )}
      {state === 'processing' && <p className="mt-8 text-lg">Your payment is still being confirmed by your bank. We start production and email you as soon as it completes.</p>}
      {state === 'unknown' && <p className="mt-8 text-lg">We could not find this order. If you were charged, check your email for the confirmation or write to info@dnbdoctor.com.</p>}
      <div className="mt-10 flex flex-wrap gap-3">
        <Link href="/merch" className="bg-[#39ff14] px-5 py-3 font-mono text-sm font-bold uppercase tracking-widest text-black hover:opacity-90">Back to merch</Link>
        <Link href="/music" className="border border-white/20 px-5 py-3 font-mono text-sm uppercase tracking-widest hover:bg-white/5">Listen to the label</Link>
      </div>
    </main>
  )
}
