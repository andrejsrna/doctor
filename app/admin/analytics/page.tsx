import Link from 'next/link'
import { headers } from 'next/headers'
import { redirect } from 'next/navigation'
import { prisma } from '@/lib/prisma'
import { staffSession } from '@/app/lib/roles'
import { CHANNELS, attributionLabel, channelOf, parseAttribution, type Attribution, type Channel } from '@/lib/attribution'

export const dynamic = 'force-dynamic'
export const metadata = { title: 'Traffic sources', robots: { index: false, follow: false } }

const RANGES = { '7d': { label: 'Last 7 days', days: 7 }, '30d': { label: 'Last 30 days', days: 30 }, '90d': { label: 'Last 90 days', days: 90 }, all: { label: 'All time', days: 0 } } as const
type RangeKey = keyof typeof RANGES

const eur = (cents: number) => new Intl.NumberFormat('sk-SK', { style: 'currency', currency: 'EUR' }).format(cents / 100)
const pct = (n: number) => `${Math.round(n * 100)} %`
const card = 'rounded-xl border border-gray-800 bg-gray-950/70 p-5'
const chip = (on: boolean) => `rounded-full border px-3 py-1 text-xs ${on ? 'border-green-500 bg-green-900/60 text-green-100' : 'border-gray-700 text-gray-300 hover:bg-gray-800'}`
const CHANNEL_COLOR: Record<Channel, string> = {
  'Meta ads': 'bg-blue-900/70 text-blue-200',
  'Google Ads': 'bg-yellow-900/60 text-yellow-200',
  Newsletter: 'bg-green-900/60 text-green-200',
  'Organic search': 'bg-teal-900/60 text-teal-200',
  Social: 'bg-purple-900/70 text-purple-200',
  Referral: 'bg-gray-800 text-gray-200',
  Direct: 'bg-gray-900 text-gray-400',
}
const Badge = ({ c }: { c: Channel }) => <span className={`whitespace-nowrap rounded px-2 py-0.5 text-xs ${CHANNEL_COLOR[c]}`}>{c}</span>

type Sale = { id: string; paid: boolean; total: number; date: Date; items: string[]; attr: Attribution | null }
type Bucket = { orders: number; revenue: number; checkouts: number; downloads: number; subscribers: number }
const empty = (): Bucket => ({ orders: 0, revenue: 0, checkouts: 0, downloads: 0, subscribers: 0 })

/** Subscriber.source carries the channel as a " · Channel" suffix (lib/attribution.ts sourceWithChannel). */
function subscriberChannel(source: string | null): Channel | null {
  const c = source?.split(' · ').pop()
  return c && (CHANNELS as readonly string[]).includes(c) ? (c as Channel) : null
}

export default async function TrafficSourcesPage({ searchParams }: { searchParams: Promise<Record<string, string | string[] | undefined>> }) {
  if (!(await staffSession(await headers(), ['ADMIN']).catch(() => null))) redirect('/admin')
  const sp = await searchParams
  const range: RangeKey = (Object.keys(RANGES) as RangeKey[]).includes(sp.range as RangeKey) ? (sp.range as RangeKey) : '30d'
  const days = RANGES[range].days
  const since = days ? new Date(Date.now() - days * 86400_000) : null
  const created = since ? { createdAt: { gte: since } } : {}

  const [orders, merch, tokens, subs] = await Promise.all([
    prisma.order.findMany({ where: created, select: { id: true, status: true, amountTotal: true, createdAt: true, paidAt: true, attribution: true, items: { select: { title: true } } } }),
    prisma.merchOrder.findMany({ where: created, select: { id: true, status: true, amountTotal: true, createdAt: true, paidAt: true, attribution: true, items: { select: { title: true, quantity: true } } } }),
    prisma.releaseDownloadToken.findMany({ where: created, select: { attribution: true, release: { select: { title: true, slug: true } } } }),
    prisma.subscriber.findMany({ where: since ? { subscribedAt: { gte: since } } : {}, select: { source: true } }),
  ])

  const sales: Sale[] = [
    ...orders.map((o) => ({ id: o.id, paid: o.status === 'PAID', total: o.amountTotal, date: o.paidAt ?? o.createdAt, items: o.items.map((i) => i.title), attr: parseAttribution(o.attribution) })),
    ...merch.map((o) => ({ id: o.id, paid: o.status === 'PAID', total: o.amountTotal, date: o.paidAt ?? o.createdAt, items: o.items.map((i) => `${i.quantity > 1 ? `${i.quantity}× ` : ''}${i.title}`), attr: parseAttribution(o.attribution) })),
  ].sort((a, b) => b.date.getTime() - a.date.getTime())

  const byChannel = new Map<Channel, Bucket>(CHANNELS.map((c) => [c, empty()]))
  const byCampaign = new Map<string, Bucket & { channel: Channel }>()
  const campaignOf = (a: Attribution | null) => {
    if (!a || !(a.source || a.gclid || a.fbclid)) return null
    const key = attributionLabel(a)
    if (!byCampaign.has(key)) byCampaign.set(key, { ...empty(), channel: channelOf(a) })
    return byCampaign.get(key)!
  }
  for (const s of sales) {
    for (const b of [byChannel.get(channelOf(s.attr))!, campaignOf(s.attr)]) {
      if (!b) continue
      b.checkouts++
      if (s.paid) { b.orders++; b.revenue += s.total }
    }
  }
  const freeByPack = new Map<string, { title: string; slug: string; n: Map<Channel, number> }>()
  for (const t of tokens) {
    const a = parseAttribution(t.attribution)
    const ch = channelOf(a)
    byChannel.get(ch)!.downloads++
    const k = campaignOf(a)
    if (k) k.downloads++
    const p = freeByPack.get(t.release.slug) || { title: t.release.title, slug: t.release.slug, n: new Map<Channel, number>() }
    p.n.set(ch, (p.n.get(ch) || 0) + 1)
    freeByPack.set(t.release.slug, p)
  }
  let subsUnknown = 0
  for (const s of subs) {
    const ch = subscriberChannel(s.source)
    if (ch) byChannel.get(ch)!.subscribers++
    else subsUnknown++
  }

  const paid = sales.filter((s) => s.paid)
  const revenue = paid.reduce((n, s) => n + s.total, 0)
  const tracked = paid.filter((s) => s.attr).length
  const channels = CHANNELS.map((c) => [c, byChannel.get(c)!] as const).filter(([, b]) => b.checkouts || b.downloads || b.subscribers)
  const campaigns = [...byCampaign.entries()].sort((a, b) => b[1].revenue - a[1].revenue || b[1].orders - a[1].orders || b[1].downloads - a[1].downloads || b[1].checkouts - a[1].checkouts)
  const recent = paid.slice(0, 25)

  return <div className="mx-auto max-w-6xl space-y-6 px-3 py-8 text-white sm:px-6">
    <div>
      <Link href="/admin" className="text-sm text-gray-400 hover:text-white">Back to admin</Link>
      <h1 className="mt-3 text-3xl font-bold">Traffic sources</h1>
      <p className="mt-2 max-w-3xl text-sm text-gray-400">
        Which channel brought each order, free download and new subscriber: the last campaign link (utm_*, Google gclid, Facebook fbclid)
        or external referrer within the visitor&apos;s last 30 days. Tracked from 26 Nov 2026; older rows count as Direct. Page views and sessions stay in GA4.
      </p>
    </div>

    <div className="flex flex-wrap gap-2">{(Object.keys(RANGES) as RangeKey[]).map((k) => <Link key={k} href={`/admin/analytics?range=${k}`} className={chip(range === k)}>{RANGES[k].label}</Link>)}</div>

    <section className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
      {[
        ['Revenue', eur(revenue), `${paid.length} paid orders`],
        ['Known source', paid.length ? pct(tracked / paid.length) : '—', `${tracked} of ${paid.length} paid orders`],
        ['Free downloads', String(tokens.length), `${freeByPack.size} free releases`],
        ['New subscribers', String(subs.length), `${subsUnknown} without channel info`],
      ].map(([l, v, s]) => <div key={l} className={card}><p className="text-xs uppercase tracking-wide text-gray-400">{l}</p><p className="mt-2 text-2xl font-bold">{v}</p><p className="mt-1 text-xs text-gray-500">{s}</p></div>)}
    </section>

    <section className={card}>
      <h2 className="text-lg font-semibold">By channel</h2>
      {channels.length === 0 ? <p className="mt-4 text-sm text-gray-400">No data in this period.</p> :
        <div className="mt-4 overflow-x-auto"><table className="w-full min-w-[680px] text-left text-sm">
          <thead className="text-xs uppercase text-gray-400"><tr><th className="py-2">Channel</th><th className="text-right">Revenue</th><th className="text-right">Paid orders</th><th className="text-right">Checkouts</th><th className="text-right">Conversion</th><th className="text-right">Free downloads</th><th className="text-right">New subscribers</th></tr></thead>
          <tbody className="divide-y divide-gray-800">{channels.map(([c, b]) => <tr key={c} className="[&>td]:py-2">
            <td><Badge c={c} /></td>
            <td className="text-right">{eur(b.revenue)}</td>
            <td className="text-right text-gray-300">{b.orders}</td>
            <td className="text-right text-gray-400">{b.checkouts}</td>
            <td className="text-right text-gray-400">{b.checkouts ? pct(b.orders / b.checkouts) : '—'}</td>
            <td className="text-right text-gray-300">{b.downloads || '—'}</td>
            <td className="text-right text-gray-300">{b.subscribers || '—'}</td>
          </tr>)}</tbody>
        </table></div>}
    </section>

    <section className={card}>
      <div className="flex flex-wrap items-baseline justify-between gap-3">
        <h2 className="text-lg font-semibold">Campaigns and ads</h2>
        <p className="text-xs text-gray-500">source / medium · utm_campaign · utm_content (the ad or email link)</p>
      </div>
      {campaigns.length === 0 ? <p className="mt-4 text-sm text-gray-400">No campaign traffic converted in this period yet.</p> :
        <div className="mt-4 overflow-x-auto"><table className="w-full min-w-[680px] text-left text-sm">
          <thead className="text-xs uppercase text-gray-400"><tr><th className="py-2">Campaign</th><th className="text-right">Revenue</th><th className="text-right">Paid</th><th className="text-right">Checkouts</th><th className="text-right">Free downloads</th></tr></thead>
          <tbody className="divide-y divide-gray-800">{campaigns.map(([k, b]) => <tr key={k} className="[&>td]:py-2">
            <td className="pr-3"><Badge c={b.channel} /> <span className="ml-1 text-gray-200">{k}</span></td>
            <td className="text-right">{eur(b.revenue)}</td>
            <td className="text-right text-gray-300">{b.orders}</td>
            <td className="text-right text-gray-400">{b.checkouts}</td>
            <td className="text-right text-gray-300">{b.downloads || '—'}</td>
          </tr>)}</tbody>
        </table></div>}
    </section>

    {freeByPack.size > 0 && <section className={card}>
      <h2 className="text-lg font-semibold">Free downloads by channel</h2>
      <ul className="mt-4 divide-y divide-gray-800 text-sm">{[...freeByPack.values()].map((p) => <li key={p.slug} className="flex flex-wrap items-center justify-between gap-2 py-2">
        <Link href={`/music/${p.slug}`} target="_blank" className="hover:text-green-300">{p.title}</Link>
        <span className="flex flex-wrap gap-1.5">{[...p.n.entries()].sort((a, b) => b[1] - a[1]).map(([c, n]) => <span key={c} className={`rounded px-2 py-0.5 text-xs ${CHANNEL_COLOR[c]}`}>{c} {n}</span>)}</span>
      </li>)}</ul>
    </section>}

    <section className={card}>
      <div className="flex flex-wrap items-baseline justify-between gap-3">
        <h2 className="text-lg font-semibold">Latest paid orders</h2>
        <Link href="/admin/shop/orders" className="text-xs text-gray-400 hover:text-white">All orders →</Link>
      </div>
      {recent.length === 0 ? <p className="mt-4 text-sm text-gray-400">No paid orders in this period.</p> :
        <div className="mt-4 overflow-x-auto"><table className="w-full min-w-[680px] text-left text-sm">
          <thead className="text-xs uppercase text-gray-400"><tr><th className="py-2">Date</th><th>Items</th><th className="text-right">Total</th><th className="pl-4">Source</th></tr></thead>
          <tbody className="divide-y divide-gray-800">{recent.map((s) => <tr key={s.id} className="align-top [&>td]:py-2">
            <td className="whitespace-nowrap pr-3 text-gray-300">{s.date.toLocaleString('sk-SK', { timeZone: 'Europe/Bratislava', dateStyle: 'short', timeStyle: 'short' })}</td>
            <td className="pr-3">{s.items.map((t, i) => <div key={i}>{t}</div>)}</td>
            <td className="whitespace-nowrap text-right">{eur(s.total)}</td>
            <td className="pl-4"><Badge c={channelOf(s.attr)} /><div className="mt-1 text-xs text-gray-500">{attributionLabel(s.attr)}</div></td>
          </tr>)}</tbody>
        </table></div>}
    </section>
  </div>
}
