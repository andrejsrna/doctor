import type { Metadata } from 'next'
import Link from 'next/link'
import { headers } from 'next/headers'
import { auth } from '@/app/lib/auth'
import { prisma } from '@/lib/prisma'
import { money } from '@/lib/shop/emails'
import { getReleaseImageUrl } from '@/app/utils'
import MagicLinkForm, { SignOutButton } from './MagicLinkForm'
import OrderList, { type AccountOrder } from './OrderList'
import CartReminder from './CartReminder'

export const dynamic = 'force-dynamic'
export const metadata: Metadata = { title: 'My account | DnB Doctor', robots: { index: false, follow: false } }

const mb = (b: number | null) => (b ? `${Math.max(1, Math.round(b / 1024 / 1024))} MB` : '')

const PERKS = [
  ['Unlimited re-downloads', 'Every file you bought, any time, without the download limit of email links.'],
  ['Invoices in PDF', 'Each order has its invoice ready to download for your records.'],
  ['Guest orders included', 'Bought without an account? Sign in with the same email and your purchases are already here.'],
  ['No password', 'We email you a one-time sign-in link that works for 15 minutes.'],
] as const

const label = 'font-mono text-[11px] uppercase tracking-[0.18em] text-gray-500'

export default async function AccountPage({ searchParams }: { searchParams: Promise<{ error?: string }> }) {
  const { error } = await searchParams
  const session = await auth.api.getSession({ headers: await headers() }).catch(() => null)
  const email = session?.user?.emailVerified ? session.user.email.trim().toLowerCase() : null

  // Guest purchases are linked by the verified email address, so they appear here on first sign-in.
  const rows = email
    ? await prisma.order.findMany({
        where: { email, status: { in: ['PAID', 'REFUNDED'] } },
        orderBy: { paidAt: 'desc' },
        include: {
          items: {
            include: { product: { select: { fileName: true, fileSize: true, release: { select: { slug: true, coverImageUrl: true, coverImageKey: true } } } } },
          },
        },
      })
    : []

  const orders: AccountOrder[] = rows.map((o) => ({
    id: o.id,
    paidAt: o.paidAt,
    total: money(o.amountTotal, o.currency),
    refunded: o.status === 'REFUNDED',
    invoiceNumber: o.invoiceNumber,
    items: o.items.map((i) => ({
      id: i.id,
      title: i.title,
      file: [i.product.fileName, mb(i.product.fileSize)].filter(Boolean).join(' · '),
      image: i.product.release ? getReleaseImageUrl(i.product.release) ?? null : null,
      href: i.product.release ? `/music/${i.product.release.slug}` : null,
    })),
  }))
  const files = orders.filter((o) => !o.refunded).reduce((n, o) => n + o.items.length, 0)

  return (
    <main className="mx-auto min-h-[70vh] max-w-5xl px-5 pb-24 pt-36 text-[#e8e8ec]">
      <p className="font-mono text-xs uppercase tracking-[0.25em] text-[#39ff14]">DnB Doctor · Downloads</p>
      <h1 className="mt-3 text-4xl font-bold uppercase leading-none text-white md:text-6xl">My account</h1>

      {!session ? (
        <div className="mt-10 grid gap-10 md:grid-cols-[minmax(0,1fr)_minmax(0,0.9fr)] md:gap-14">
          <div className="space-y-6">
            <p className="text-lg leading-relaxed">Sign in with the email you used at checkout to download your sample packs, tracks and invoices.</p>
            {error && <p role="alert" className="text-sm text-red-300">That sign-in link has expired or was already used. Request a new one.</p>}
            <MagicLinkForm />
            <CartReminder />
          </div>
          <ul className="m-0 list-none space-y-5 border-t border-white/10 p-0 pt-8 md:border-l md:border-t-0 md:pl-10 md:pt-0">
            {PERKS.map(([title, text]) => (
              <li key={title}>
                <p className="m-0 font-mono text-xs font-bold uppercase tracking-[0.18em] text-[#39ff14]">{title}</p>
                <p className="m-0 mt-1 text-sm leading-relaxed text-gray-300">{text}</p>
              </li>
            ))}
          </ul>
        </div>
      ) : !email ? (
        <div className="mt-10 space-y-4">
          <p>Your email address is not verified yet. Sign out and sign in again with an email link.</p>
          <SignOutButton />
        </div>
      ) : (
        <div className="mt-10 space-y-8">
          <div className="flex flex-wrap items-center justify-between gap-4 border-y border-white/10 py-4">
            <dl className="m-0 flex flex-wrap gap-x-8 gap-y-3">
              <div>
                <dt className={label}>Signed in as</dt>
                <dd className="m-0 break-all text-white">{email}</dd>
              </div>
              <div>
                <dt className={label}>Orders</dt>
                <dd className="m-0 text-white">{orders.length}</dd>
              </div>
              <div>
                <dt className={label}>Downloads</dt>
                <dd className="m-0 text-white">{files} {files === 1 ? 'file' : 'files'}</dd>
              </div>
            </dl>
            <SignOutButton />
          </div>

          <CartReminder />

          {orders.length === 0 ? (
            <div className="space-y-4 border border-dashed border-white/15 p-6">
              <p className="m-0 text-lg text-white">No purchases yet for this email.</p>
              <p className="m-0 text-sm text-gray-400">Bought with a different address? Sign out and use the email from your receipt.</p>
              <div className="flex flex-wrap gap-3">
                <Link href="/sample-packs" className="inline-block bg-[#39ff14] px-5 py-3 font-mono text-sm font-bold uppercase tracking-widest text-black hover:opacity-90">Browse sample packs</Link>
                <Link href="/music" className="inline-block border border-white/20 px-5 py-3 font-mono text-sm uppercase tracking-widest text-white hover:bg-white/5">All releases</Link>
              </div>
            </div>
          ) : (
            <section aria-labelledby="orders-title" className="space-y-4">
              <h2 id="orders-title" className="m-0 font-mono text-sm font-bold uppercase tracking-[0.2em] text-gray-300">Your purchases</h2>
              <OrderList orders={orders} />
            </section>
          )}

          <p className="text-sm text-gray-400">
            Problem with a download or invoice? Write to{' '}
            <a href="mailto:info@dnbdoctor.com" className="text-[#39ff14] underline-offset-4 hover:underline">info@dnbdoctor.com</a>.
          </p>
        </div>
      )}
    </main>
  )
}
