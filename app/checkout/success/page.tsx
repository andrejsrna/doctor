import type { Metadata } from 'next'
import Link from 'next/link'
import { prisma } from '@/lib/prisma'
import { retrieveCheckoutSession, stripeConfigured } from '@/lib/shop/stripe'
import { fulfilSession } from '@/lib/shop/orders'
import { issueInvoice } from '@/lib/shop/invoices'
import ClearCart from './ClearCart'

export const dynamic = 'force-dynamic'
export const metadata: Metadata = { title: 'Thank you | DnB Doctor', robots: { index: false, follow: false } }

const shell = 'mx-auto min-h-[70vh] max-w-2xl px-5 pb-24 pt-36 text-[#e8e8ec]'

export default async function CheckoutSuccessPage({ searchParams }: { searchParams: Promise<{ session_id?: string }> }) {
  const { session_id } = await searchParams
  let state: 'paid' | 'processing' | 'unknown' = 'unknown'
  let email: string | null = null
  let items: string[] = []
  let paidSlugs: string[] = []

  if (session_id && /^cs_[A-Za-z0-9_]+$/.test(session_id) && stripeConfigured()) {
    try {
      // Don't wait for the webhook: confirm with Stripe directly (same idempotent path).
      const session = await retrieveCheckoutSession(session_id)
      if (session.payment_status === 'paid') {
        const r = await fulfilSession(session)
        if (r.status === 'paid') await issueInvoice(String(session.metadata?.orderId))
        state = 'paid'
      } else if (session.status === 'complete') state = 'processing'
      const order = await prisma.order.findUnique({ where: { stripeSessionId: session_id }, include: { items: { select: { title: true, product: { select: { slug: true } } } } } })
      email = order?.email ?? session.customer_details?.email ?? null
      items = order?.items.map((i) => i.title) ?? []
      if (state === 'paid') paidSlugs = order?.items.map((i) => i.product.slug) ?? []
    } catch (e) {
      console.error('[shop] success page', e instanceof Error ? e.message : e)
    }
  }

  return (
    <main className={shell}>
      {paidSlugs.length > 0 && <ClearCart slugs={paidSlugs} />}
      <p className="font-mono text-xs uppercase tracking-[0.25em] text-[#39ff14]">{state === 'paid' ? 'Payment received' : state === 'processing' ? 'Payment processing' : 'Checkout'}</p>
      <h1 className="mt-3 text-4xl font-bold uppercase leading-none text-white md:text-6xl">{state === 'unknown' ? 'Order status' : 'Thank you'}</h1>
      {state === 'paid' && (
        <div className="mt-8 space-y-4 text-lg leading-relaxed">
          {items.length > 0 && <p>Your purchase: <strong className="text-white">{items.join(', ')}</strong>.</p>}
          <p>We sent the download link{email ? <> to <strong className="text-white">{email}</strong></> : ''}. The invoice follows in a separate email.</p>
          <p>You can download it any time from My account. Sign in with the same email address, no password needed.</p>
        </div>
      )}
      {state === 'processing' && <p className="mt-8 text-lg">Your payment is still being confirmed by your bank. You will receive the download link by email as soon as it completes.</p>}
      {state === 'unknown' && <p className="mt-8 text-lg">We could not find this checkout. If you were charged, check your email for the download link or contact us.</p>}
      <div className="mt-10 flex flex-wrap gap-3">
        <Link href="/account" className="bg-[#39ff14] px-5 py-3 font-mono text-sm font-bold uppercase tracking-widest text-black hover:opacity-90">My account</Link>
        <Link href="/music" className="border border-white/20 px-5 py-3 font-mono text-sm uppercase tracking-widest hover:bg-white/5">Back to music</Link>
      </div>
    </main>
  )
}
