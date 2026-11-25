import Link from 'next/link'
import { headers } from 'next/headers'
import { redirect } from 'next/navigation'
import { prisma } from '@/lib/prisma'
import { staffSession } from '@/app/lib/roles'
import { attributionLabel, channelOf, parseAttribution } from '@/lib/attribution'

export const dynamic = 'force-dynamic'
export const metadata = { title: 'Orders & revenue', robots: { index: false, follow: false } }

const RANGES = { '30d': { label: 'Last 30 days', days: 30 }, '90d': { label: 'Last 90 days', days: 90 }, '12m': { label: 'Last 12 months', days: 365 }, all: { label: 'All time', days: 0 } } as const
type RangeKey = keyof typeof RANGES
const KINDS = { all: 'All', digital: 'Digital', merch: 'Merch' } as const
type KindKey = keyof typeof KINDS
const STATUSES = ['ALL', 'PAID', 'REFUNDED', 'CANCELED', 'PENDING'] as const
const TYPE_LABEL: Record<string, string> = { TRACK: 'WAV tracks', RELEASE: 'EP / album', SAMPLE_PACK: 'Sample packs', MERCH: 'Merch' }

const eur = (cents: number) => new Intl.NumberFormat('sk-SK', { style: 'currency', currency: 'EUR' }).format(cents / 100)
const pct = (n: number) => `${Math.round(n * 100)} %`
const monthKey = (d: Date) => `${d.getUTCFullYear()}-${String(d.getUTCMonth() + 1).padStart(2, '0')}`
const monthLabel = (k: string) => new Date(`${k}-01T00:00:00Z`).toLocaleDateString('en-GB', { month: 'short', year: '2-digit', timeZone: 'UTC' })
const pick = <T extends string>(v: string | string[] | undefined, allowed: readonly T[], fallback: T): T => (allowed.includes(v as T) ? (v as T) : fallback)

type Row = {
  id: string; kind: 'digital' | 'merch'; status: string; date: Date; email: string | null; name: string | null
  total: number; shipping: number; items: { title: string; type: string; cents: number; qty: number; release?: { id: string; title: string; slug: string } | null }[]
  invoice: string | null; note: string | null; source: string; sourceDetail: string
}

const source = (raw: unknown) => {
  const a = parseAttribution(raw)
  return { source: channelOf(a), sourceDetail: attributionLabel(a) }
}

async function load(since: Date | null): Promise<Row[]> {
  const where = since ? { createdAt: { gte: since } } : {}
  const [orders, merch] = await Promise.all([
    prisma.order.findMany({ where, orderBy: { createdAt: 'desc' }, include: { items: { include: { product: { select: { type: true, release: { select: { id: true, title: true, slug: true } } } } } } } }),
    prisma.merchOrder.findMany({ where, orderBy: { createdAt: 'desc' }, include: { items: true } }),
  ])
  const rows: Row[] = [
    ...orders.map((o) => ({
      id: o.id, kind: 'digital' as const, status: o.status, date: o.paidAt ?? o.createdAt, email: o.email, name: o.customerName,
      total: o.amountTotal, shipping: 0, invoice: o.invoiceNumber, ...source(o.attribution),
      items: o.items.map((i) => ({ title: i.title, type: i.product.type, cents: i.priceCents, qty: 1, release: i.product.release })),
      note: o.status === 'PAID' ? `${o.items.reduce((s, i) => s + i.downloadCount, 0)}× downloaded` : null,
    })),
    ...merch.map((o) => ({
      id: o.id, kind: 'merch' as const, status: o.status, date: o.paidAt ?? o.createdAt, email: o.email, name: o.customerName,
      total: o.amountTotal, shipping: o.shippingCents, invoice: o.invoiceNumber, ...source(o.attribution),
      items: o.items.map((i) => ({ title: [i.title, i.size, i.color].filter(Boolean).join(' · '), type: 'MERCH', cents: i.unitCents * i.quantity, qty: i.quantity })),
      note: o.status === 'PAID' ? `${o.fulfilment.toLowerCase()} · ${o.country}` : o.country,
    })),
  ]
  return rows.sort((a, b) => b.date.getTime() - a.date.getTime())
}

function stats(rows: Row[]) {
  const paid = rows.filter((r) => r.status === 'PAID')
  const refunded = rows.filter((r) => r.status === 'REFUNDED')
  const abandoned = rows.filter((r) => r.status === 'CANCELED' || r.status === 'PENDING')
  const revenue = paid.reduce((s, r) => s + r.total, 0)
  const shipping = paid.reduce((s, r) => s + r.shipping, 0)
  const items = paid.reduce((s, r) => s + r.items.reduce((n, i) => n + i.qty, 0), 0)
  const perCustomer = new Map<string, number>()
  for (const r of paid) if (r.email) perCustomer.set(r.email, (perCustomer.get(r.email) || 0) + 1)
  const repeat = [...perCustomer.values()].filter((n) => n > 1).length

  const byType = new Map<string, { cents: number; qty: number }>()
  const byProduct = new Map<string, { cents: number; qty: number; type: string }>()
  // A release's bundle and its single tracks count together.
  const byRelease = new Map<string, { cents: number; qty: number; title: string; slug: string; bundles: number; tracks: number }>()
  for (const r of paid) for (const i of r.items) {
    if (i.release) {
      const b = byRelease.get(i.release.id) || { cents: 0, qty: 0, title: i.release.title, slug: i.release.slug, bundles: 0, tracks: 0 }
      byRelease.set(i.release.id, { ...b, cents: b.cents + i.cents, qty: b.qty + 1, bundles: b.bundles + (i.type === 'TRACK' ? 0 : 1), tracks: b.tracks + (i.type === 'TRACK' ? 1 : 0) })
    }
    const t = byType.get(i.type) || { cents: 0, qty: 0 }
    byType.set(i.type, { cents: t.cents + i.cents, qty: t.qty + i.qty })
    const p = byProduct.get(i.title) || { cents: 0, qty: 0, type: i.type }
    byProduct.set(i.title, { ...p, cents: p.cents + i.cents, qty: p.qty + i.qty })
  }
  const decided = paid.length + refunded.length + abandoned.length
  return {
    revenue, shipping, net: revenue - shipping, paid: paid.length, items, aov: paid.length ? Math.round(revenue / paid.length) : 0,
    refunded: refunded.reduce((s, r) => s + r.total, 0), refundedCount: refunded.length, abandoned: abandoned.length,
    conversion: decided ? paid.length / decided : 0, customers: perCustomer.size, repeat,
    byType: [...byType.entries()].sort((a, b) => b[1].cents - a[1].cents),
    top: [...byProduct.entries()].sort((a, b) => b[1].cents - a[1].cents || b[1].qty - a[1].qty).slice(0, 10),
    releases: [...byRelease.entries()].sort((a, b) => b[1].cents - a[1].cents || b[1].qty - a[1].qty).slice(0, 15),
  }
}

/** Paid revenue per month for the last 12 months (UTC), independent of the range filter. */
function monthly(rows: Row[], now: Date) {
  const keys: string[] = []
  for (let i = 11; i >= 0; i--) keys.push(monthKey(new Date(Date.UTC(now.getUTCFullYear(), now.getUTCMonth() - i, 1))))
  const sums = new Map(keys.map((k) => [k, { cents: 0, orders: 0 }]))
  for (const r of rows) {
    if (r.status !== 'PAID') continue
    const m = sums.get(monthKey(r.date))
    if (m) { m.cents += r.total; m.orders += 1 }
  }
  return keys.map((k) => ({ key: k, ...sums.get(k)! }))
}

const card = 'rounded-xl border border-gray-800 bg-gray-950/70 p-5'
const chip = (on: boolean) => `rounded-full border px-3 py-1 text-xs ${on ? 'border-green-500 bg-green-900/60 text-green-100' : 'border-gray-700 text-gray-300 hover:bg-gray-800'}`
const statusColor: Record<string, string> = { PAID: 'text-green-300', REFUNDED: 'text-yellow-300', CANCELED: 'text-gray-500', PENDING: 'text-gray-400' }

function Stat({ label, value, sub }: { label: string; value: string; sub?: string }) {
  return <div className={card}>
    <p className="text-xs uppercase tracking-wide text-gray-400">{label}</p>
    <p className="mt-2 text-2xl font-bold">{value}</p>
    {sub && <p className="mt-1 text-xs text-gray-500">{sub}</p>}
  </div>
}

export default async function OrdersPage({ searchParams }: { searchParams: Promise<Record<string, string | string[] | undefined>> }) {
  if (!(await staffSession(await headers()).catch(() => null))) redirect('/admin')
  const sp = await searchParams
  const range = pick(sp.range, Object.keys(RANGES) as RangeKey[], '30d')
  const kind = pick(sp.kind, Object.keys(KINDS) as KindKey[], 'all')
  const status = pick(sp.status, STATUSES, 'ALL')
  const now = new Date()
  const days = RANGES[range].days
  const since = days ? new Date(now.getTime() - days * 86400_000) : null

  const yearAgo = new Date(Date.UTC(now.getUTCFullYear(), now.getUTCMonth() - 11, 1))
  const [inRange, lastYear] = await Promise.all([load(since), load(yearAgo)])
  const ofKind = (rows: Row[]) => (kind === 'all' ? rows : rows.filter((r) => r.kind === kind))
  const rows = ofKind(inRange)
  const s = stats(rows)
  const months = monthly(ofKind(lastYear), now)
  const maxMonth = Math.max(1, ...months.map((m) => m.cents))
  const list = status === 'ALL' ? rows : rows.filter((r) => r.status === status)
  // Clicks out to streams/stores are all-time counters (no dates), shown next to sales for context.
  const clicks = new Map(
    (await prisma.streamingClick.groupBy({ by: ['releaseId'], where: { releaseId: { in: s.releases.map(([id]) => id) } }, _sum: { count: true } }))
      .map((c) => [c.releaseId, c._sum.count ?? 0]),
  )
  const href = (p: Partial<{ range: string; kind: string; status: string }>) => {
    const q = new URLSearchParams({ range, kind, status, ...p })
    if (q.get('status') === 'ALL') q.delete('status')
    return `/admin/shop/orders?${q}`
  }

  return <div className="mx-auto max-w-6xl space-y-6 px-3 py-8 text-white sm:px-6">
    <div>
      <Link href="/admin/shop" className="text-sm text-gray-400 hover:text-white">Back to shop</Link>
      <h1 className="mt-3 text-3xl font-bold">Orders & revenue</h1>
      <p className="mt-2 text-sm text-gray-400">Digital downloads and Printful merch paid through Stripe. Amounts are gross (VAT included, before Stripe fees and Printful costs).</p>
    </div>

    <div className="flex flex-wrap items-center gap-2">
      {(Object.keys(RANGES) as RangeKey[]).map((k) => <Link key={k} href={href({ range: k })} className={chip(range === k)}>{RANGES[k].label}</Link>)}
      <span className="mx-2 h-5 w-px bg-gray-700" aria-hidden />
      {(Object.keys(KINDS) as KindKey[]).map((k) => <Link key={k} href={href({ kind: k })} className={chip(kind === k)}>{KINDS[k]}</Link>)}
    </div>

    <section className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
      <Stat label="Revenue" value={eur(s.revenue)} sub={s.shipping ? `${eur(s.net)} without shipping` : RANGES[range].label} />
      <Stat label="Paid orders" value={String(s.paid)} sub={`${s.items} items sold`} />
      <Stat label="Average order" value={eur(s.aov)} sub={`${s.customers} customers · ${s.repeat} returning`} />
      <Stat label="Checkout conversion" value={pct(s.conversion)} sub={`${s.abandoned} abandoned · ${s.refundedCount} refunded (${eur(s.refunded)})`} />
    </section>

    <section className={card}>
      <div className="flex items-baseline justify-between gap-3">
        <h2 className="text-lg font-semibold">Revenue by month</h2>
        <p className="text-xs text-gray-500">Last 12 months, paid orders{kind !== 'all' ? ` · ${KINDS[kind].toLowerCase()}` : ''}</p>
      </div>
      <div className="mt-6 grid h-48 grid-cols-12 items-end gap-1.5 sm:gap-3">
        {months.map((m) => <div key={m.key} className="flex h-full flex-col justify-end text-center" title={`${monthLabel(m.key)}: ${eur(m.cents)} · ${m.orders} orders`}>
          <span className="mb-1 hidden text-[10px] text-gray-400 sm:block">{m.cents ? eur(m.cents) : ''}</span>
          <div className="rounded-t bg-gradient-to-t from-purple-600 to-green-400" style={{ height: `${(m.cents / maxMonth) * 100}%`, minHeight: m.cents ? 4 : 1, opacity: m.cents ? 1 : 0.25 }} />
          <span className="mt-2 text-[10px] text-gray-500">{monthLabel(m.key)}</span>
        </div>)}
      </div>
    </section>

    <section className="grid gap-6 lg:grid-cols-2">
      <div className={card}>
        <h2 className="text-lg font-semibold">By product type</h2>
        {s.byType.length === 0 ? <p className="mt-4 text-sm text-gray-400">No sales in this period.</p> :
          <ul className="mt-4 space-y-3">{s.byType.map(([type, v]) => <li key={type}>
            <div className="flex justify-between text-sm"><span>{TYPE_LABEL[type] || type}</span><span className="text-gray-300">{eur(v.cents)} · {v.qty}×</span></div>
            <div className="mt-1 h-1.5 rounded bg-gray-800"><div className="h-full rounded bg-green-500" style={{ width: `${s.revenue ? (v.cents / s.revenue) * 100 : 0}%` }} /></div>
          </li>)}</ul>}
      </div>
      <div className={card}>
        <h2 className="text-lg font-semibold">Top products</h2>
        {s.top.length === 0 ? <p className="mt-4 text-sm text-gray-400">No sales in this period.</p> :
          <ol className="mt-4 divide-y divide-gray-800 text-sm">{s.top.map(([title, v], i) => <li key={title} className="flex justify-between gap-3 py-2">
            <span className="min-w-0 truncate"><span className="mr-2 text-gray-500">{i + 1}.</span>{title} <span className="text-xs text-gray-500">{TYPE_LABEL[v.type] || v.type}</span></span>
            <span className="shrink-0 text-gray-300">{eur(v.cents)} · {v.qty}×</span>
          </li>)}</ol>}
      </div>
    </section>

    <section className={card}>
      <div className="flex items-baseline justify-between gap-3">
        <h2 className="text-lg font-semibold">Top releases</h2>
        <p className="text-xs text-gray-500">EP/album bundles and their single tracks together · clicks out = all-time stream/store clicks</p>
      </div>
      {s.releases.length === 0 ? <p className="mt-4 text-sm text-gray-400">No release sales in this period.</p> :
        <div className="mt-4 overflow-x-auto"><table className="w-full min-w-[560px] text-left text-sm">
          <thead className="text-xs uppercase text-gray-400"><tr><th className="py-2">Release</th><th className="text-right">Revenue</th><th className="text-right">Bundles</th><th className="text-right">Tracks</th><th className="text-right">Clicks out</th></tr></thead>
          <tbody className="divide-y divide-gray-800">{s.releases.map(([id, v], i) => <tr key={id} className="[&>td]:py-2">
            <td className="pr-3"><span className="mr-2 text-gray-500">{i + 1}.</span><Link href={`/music/${v.slug}`} className="hover:text-green-300" target="_blank">{v.title}</Link></td>
            <td className="text-right">{eur(v.cents)}</td>
            <td className="text-right text-gray-300">{v.bundles || '—'}</td>
            <td className="text-right text-gray-300">{v.tracks || '—'}</td>
            <td className="text-right text-gray-400">{clicks.get(id) ?? 0}</td>
          </tr>)}</tbody>
        </table></div>}
    </section>

    <section className={card}>
      <div className="flex flex-wrap items-center justify-between gap-3">
        <h2 className="text-lg font-semibold">Orders <span className="text-sm font-normal text-gray-400">({list.length})</span></h2>
        <div className="flex flex-wrap gap-2">{STATUSES.map((st) => <Link key={st} href={href({ status: st })} className={chip(status === st)}>{st === 'ALL' ? 'All' : st.toLowerCase()}</Link>)}</div>
      </div>
      {list.length === 0 ? <p className="mt-4 text-sm text-gray-400">No orders in this period.</p> :
        <div className="mt-4 overflow-x-auto"><table className="w-full min-w-[880px] text-left text-sm">
          <thead className="text-xs uppercase text-gray-400"><tr><th className="py-2">Date</th><th>Type</th><th>Customer</th><th>Items</th><th className="text-right">Total</th><th className="pl-4">Status</th><th>Source</th><th>Invoice</th></tr></thead>
          <tbody className="divide-y divide-gray-800">{list.map((o) => <tr key={o.id} className="align-top [&>td]:py-3">
            <td className="whitespace-nowrap pr-3 text-gray-300">{o.date.toLocaleString('sk-SK', { timeZone: 'Europe/Bratislava', dateStyle: 'short', timeStyle: 'short' })}</td>
            <td className="pr-3"><span className={`rounded px-2 py-0.5 text-xs ${o.kind === 'merch' ? 'bg-purple-900/70 text-purple-200' : 'bg-gray-800 text-gray-300'}`}>{o.kind}</span></td>
            <td className="pr-3">{o.name || '—'}<div className="text-xs text-gray-500">{o.email || ''}</div></td>
            <td className="pr-3">{o.items.map((i, n) => <div key={n}>{i.qty > 1 ? `${i.qty}× ` : ''}{i.title}</div>)}{o.note && <div className="text-xs text-gray-500">{o.note}</div>}</td>
            <td className="whitespace-nowrap pr-3 text-right">{eur(o.total)}{o.shipping > 0 && <div className="text-xs text-gray-500">incl. {eur(o.shipping)} shipping</div>}</td>
            <td className={`pl-4 pr-3 ${statusColor[o.status] || ''}`}>{o.status.toLowerCase()}</td>
            <td className="pr-3 text-xs"><div className="text-gray-300">{o.source}</div>{o.sourceDetail && <div className="max-w-[180px] break-words text-gray-500">{o.sourceDetail}</div>}</td>
            <td className="text-gray-400">{o.invoice || '—'}</td>
          </tr>)}</tbody>
        </table></div>}
    </section>
  </div>
}
