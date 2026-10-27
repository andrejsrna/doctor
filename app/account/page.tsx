import type { Metadata } from 'next'
import Link from 'next/link'
import { headers } from 'next/headers'
import { auth } from '@/app/lib/auth'
import { prisma } from '@/lib/prisma'
import { money } from '@/lib/shop/emails'
import MagicLinkForm, { SignOutButton } from './MagicLinkForm'

export const dynamic = 'force-dynamic'
export const metadata: Metadata = { title: 'My account | DnB Doctor', robots: { index: false, follow: false } }

const mb = (b: number | null) => (b ? `${(b / 1024 / 1024).toFixed(0)} MB` : '')

export default async function AccountPage({ searchParams }: { searchParams: Promise<{ error?: string }> }) {
  const { error } = await searchParams
  const session = await auth.api.getSession({ headers: await headers() }).catch(() => null)
  const email = session?.user?.emailVerified ? session.user.email.toLowerCase() : null

  // Guest purchases are linked by the verified email address, so they appear here on first sign-in.
  const orders = email
    ? await prisma.order.findMany({
        where: { email, status: { in: ['PAID', 'REFUNDED'] } },
        orderBy: { paidAt: 'desc' },
        include: { items: { include: { product: { select: { fileName: true, fileSize: true, release: { select: { slug: true, coverImageUrl: true } } } } } } },
      })
    : []

  return (
    <main className="mx-auto min-h-[70vh] max-w-3xl px-5 pb-24 pt-36 text-[#e8e8ec]">
      <p className="font-mono text-xs uppercase tracking-[0.25em] text-[#39ff14]">DnB Doctor</p>
      <h1 className="mt-3 text-4xl font-bold uppercase leading-none text-white md:text-6xl">My account</h1>

      {!session ? (
        <div className="mt-10 max-w-md space-y-6">
          <p className="text-lg leading-relaxed">Sign in with the email you used at checkout to download your sample packs and invoices. No password needed.</p>
          {error && <p role="alert" className="text-sm text-red-300">That sign-in link has expired or was already used. Request a new one.</p>}
          <MagicLinkForm />
        </div>
      ) : !email ? (
        <div className="mt-10 space-y-4">
          <p>Your email address is not verified yet. Sign out and sign in again with an email link.</p>
          <SignOutButton />
        </div>
      ) : (
        <div className="mt-10 space-y-8">
          <div className="flex flex-wrap items-center justify-between gap-3 border-b border-white/10 pb-4">
            <p className="text-gray-300">Signed in as <strong className="text-white">{email}</strong></p>
            <SignOutButton />
          </div>
          {orders.length === 0 ? (
            <div className="space-y-4">
              <p className="text-lg">No purchases yet for this email.</p>
              <Link href="/sample-packs" className="inline-block bg-[#39ff14] px-5 py-3 font-mono text-sm font-bold uppercase tracking-widest text-black hover:opacity-90">Browse sample packs</Link>
            </div>
          ) : (
            <ul className="space-y-4">
              {orders.map((o) => (
                <li key={o.id} className="border border-white/10 bg-white/[0.02] p-5">
                  <div className="flex flex-wrap items-baseline justify-between gap-2 font-mono text-xs uppercase tracking-widest text-gray-400">
                    <span>{o.paidAt?.toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' })}</span>
                    <span>{money(o.amountTotal, o.currency)}{o.status === 'REFUNDED' ? ' · refunded' : ''}</span>
                  </div>
                  {o.items.map((i) => (
                    <div key={i.id} className="mt-3 flex flex-wrap items-center justify-between gap-3">
                      <div>
                        <p className="text-lg font-bold text-white">{i.title}</p>
                        <p className="text-sm text-gray-400">{[i.product.fileName, mb(i.product.fileSize)].filter(Boolean).join(' · ')}</p>
                      </div>
                      {o.status === 'PAID' && (
                        <a href={`/api/shop/download?item=${encodeURIComponent(i.id)}`} className="bg-[#39ff14] px-4 py-2 font-mono text-sm font-bold uppercase tracking-widest text-black hover:opacity-90">Download</a>
                      )}
                    </div>
                  ))}
                  <div className="mt-4 text-sm">
                    {o.invoiceNumber ? (
                      <a href={`/api/shop/invoice?order=${encodeURIComponent(o.id)}`} className="text-[#39ff14] underline">Invoice {o.invoiceNumber} (PDF)</a>
                    ) : (
                      <span className="text-gray-500">Invoice is being prepared</span>
                    )}
                  </div>
                </li>
              ))}
            </ul>
          )}
        </div>
      )}
    </main>
  )
}
