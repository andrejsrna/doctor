import type { Metadata } from 'next'
import Image from 'next/image'
import Link from 'next/link'
import { prisma } from '@/lib/prisma'
import { retrieveCheckoutSession, stripeConfigured } from '@/lib/shop/stripe'
import { fulfilSession } from '@/lib/shop/orders'
import { issueInvoice } from '@/lib/shop/invoices'
import { getReleaseImageUrl } from '@/app/utils'
import { primaryArtist } from '@/app/components/hero/releaseMeta'
import { money } from '@/lib/shop/emails'
import ClearCart from './ClearCart'

type More = { slug: string; title: string; artist: string; image: string | null; from: string }

/** Up to 3 other releases sold here: same artist first, then the newest ones. */
async function moreToBuy(releaseIds: string[], artists: string[]): Promise<{ heading: string; list: More[] }> {
  const pick = (where: object) =>
    prisma.release.findMany({
      where: { id: { notIn: releaseIds }, publishedAt: { lte: new Date() }, products: { some: { active: true, fileKey: { not: null } } }, ...where },
      orderBy: { publishedAt: 'desc' },
      take: 3,
      select: { slug: true, title: true, artistName: true, coverImageUrl: true, coverImageKey: true, products: { where: { active: true }, select: { priceCents: true, currency: true } } },
    })
  const same = artists.length ? await pick({ OR: artists.map((a) => ({ artistName: { contains: a, mode: 'insensitive' as const } })) }) : []
  const rows = same.length ? same : await pick({})
  const list = rows.map((r) => {
    const low = r.products.reduce((m, p) => (p.priceCents < m.priceCents ? p : m), r.products[0])
    return { slug: r.slug, title: r.title, artist: r.artistName ?? '', image: getReleaseImageUrl(r) || null, from: low ? money(low.priceCents, low.currency) : '' }
  })
  return { heading: same.length ? `More from ${artists[0]}` : 'Fresh on DnB Doctor', list }
}

export const dynamic = 'force-dynamic'
export const metadata: Metadata = { title: 'Thank you | DnB Doctor', robots: { index: false, follow: false } }

const shell = 'mx-auto min-h-[70vh] max-w-2xl px-5 pb-24 pt-36 text-[#e8e8ec]'

export default async function CheckoutSuccessPage({ searchParams }: { searchParams: Promise<{ session_id?: string }> }) {
  const { session_id } = await searchParams
  let state: 'paid' | 'processing' | 'unknown' = 'unknown'
  let email: string | null = null
  let items: string[] = []
  let paidSlugs: string[] = []
  let purchase: { id: string; currency: string; items: { slug: string; title: string; priceCents: number }[] } | null = null
  let more: { heading: string; list: More[] } | null = null

  if (session_id && /^cs_[A-Za-z0-9_]+$/.test(session_id) && stripeConfigured()) {
    try {
      // Don't wait for the webhook: confirm with Stripe directly (same idempotent path).
      const session = await retrieveCheckoutSession(session_id)
      if (session.payment_status === 'paid') {
        const r = await fulfilSession(session)
        if (r.status === 'paid') await issueInvoice(String(session.metadata?.orderId))
        state = 'paid'
      } else if (session.status === 'complete') state = 'processing'
      const order = await prisma.order.findUnique({ where: { stripeSessionId: session_id }, include: { items: { select: { title: true, priceCents: true, product: { select: { slug: true, release: { select: { id: true, artistName: true } } } } } } } })
      email = order?.email ?? session.customer_details?.email ?? null
      items = order?.items.map((i) => i.title) ?? []
      if (state === 'paid') paidSlugs = order?.items.map((i) => i.product.slug) ?? []
      if (state === 'paid' && order) {
        const rel = order.items.map((i) => i.product.release).filter((x): x is { id: string; artistName: string | null } => !!x)
        more = await moreToBuy([...new Set(rel.map((x) => x.id))], [...new Set(rel.map((x) => (x.artistName ? primaryArtist(x.artistName) : '')).filter(Boolean))]).catch(() => null)
      }
      if (state === 'paid' && order) purchase = { id: order.id, currency: order.currency.toUpperCase(), items: order.items.map((i) => ({ slug: i.product.slug, title: i.title, priceCents: i.priceCents })) }
    } catch (e) {
      console.error('[shop] success page', e instanceof Error ? e.message : e)
    }
  }

  return (
    <main className={shell}>
      {paidSlugs.length > 0 && <ClearCart slugs={paidSlugs} purchase={purchase} />}
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
      {more && more.list.length > 0 && (
        <section className="mt-16 border-t border-white/10 pt-8" aria-labelledby="more-heading">
          <h2 id="more-heading" className="font-mono text-xs uppercase tracking-[0.25em] text-[#39ff14]">{more.heading}</h2>
          <ul className="mt-5 grid gap-4 sm:grid-cols-3">
            {more.list.map((m) => (
              <li key={m.slug}>
                <Link href={`/music/${m.slug}`} className="group block">
                  {m.image ? (
                    <Image src={m.image} alt="" width={300} height={300} className="aspect-square w-full object-cover transition-opacity group-hover:opacity-85" />
                  ) : (
                    <span className="block aspect-square w-full bg-white/5" aria-hidden="true" />
                  )}
                  <span className="mt-2 block truncate text-sm text-gray-400">{m.artist}</span>
                  <span className="block truncate font-bold uppercase text-white group-hover:text-[#39ff14]">{m.title}</span>
                  {m.from && <span className="font-mono text-sm text-[#39ff14]">WAV from {m.from}</span>}
                </Link>
              </li>
            ))}
          </ul>
        </section>
      )}
    </main>
  )
}
