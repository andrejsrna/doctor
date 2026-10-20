import { prisma } from '@/lib/prisma'
import { plainTitle, splitTitle, typeLabel } from '@/app/components/hero/releaseMeta'

/**
 * Monthly "latest releases" newsletter: data for one calendar month + table-based email HTML.
 * Merge fields ({name}, {unsubscribeUrl}) are filled per recipient by lib/newsletter/mailer.ts.
 */

const SITE = 'https://dnbdoctor.com'
// Site palette (globals: --c-green / --c-purple / --c-crimson) on pure black, square edges like the new site
const C = { bg: '#000000', panel: '#0a0a0a', line: '#262626', green: '#39ff14', purple: '#9b5eff', crimson: '#ff004d', text: '#ffffff', muted: '#bdbdbd', dim: '#7a7a7a' }
// Big Shoulders / JetBrains Mono load where clients allow web fonts (Apple Mail, iOS); the rest fall back to condensed system faces
const DISPLAY = "'Big Shoulders Display','Big Shoulders',Impact,'Arial Narrow Bold','Arial Narrow',sans-serif"
const MONO = "'JetBrains Mono','SFMono-Regular',Menlo,Consolas,'Courier New',monospace"
const FONT = "'Helvetica Neue',Helvetica,Arial,sans-serif"

export type MonthlyRelease = { slug: string; artist: string | null; title: string; type: string; cover: string | null; date: Date; spotify: string | null; beatport: string | null }
export type MonthlyMix = { slug: string; title: string; cover: string | null; date: Date }
export type MonthlyData = { month: string; label: string; releases: MonthlyRelease[]; mixes: MonthlyMix[] }
export type MonthlyOptions = { intro?: string; preheader?: string }

/** "2026-10" → [start, end) in UTC. Defaults to the previous calendar month (send on the 1st). */
export function monthRange(month?: string) {
  const now = new Date()
  const m = month?.match(/^(\d{4})-(\d{2})$/)
  const y = m ? +m[1] : now.getUTCMonth() === 0 ? now.getUTCFullYear() - 1 : now.getUTCFullYear()
  const mo = m ? +m[2] - 1 : (now.getUTCMonth() + 11) % 12
  const start = new Date(Date.UTC(y, mo, 1))
  const end = new Date(Date.UTC(y, mo + 1, 1))
  return { key: `${y}-${String(mo + 1).padStart(2, '0')}`, start, end, label: start.toLocaleString('en-US', { month: 'long', year: 'numeric', timeZone: 'UTC' }) }
}

export async function loadMonthly(month?: string): Promise<MonthlyData> {
  const { key, start, end, label } = monthRange(month)
  const [rel, news] = await Promise.all([
    prisma.release.findMany({
      where: { publishedAt: { gte: start, lt: end } },
      orderBy: { publishedAt: 'desc' },
      select: { slug: true, title: true, artistName: true, categories: true, coverImageUrl: true, publishedAt: true, spotify: true, beatport: true },
    }),
    prisma.news.findMany({
      where: { publishedAt: { gte: start, lt: end }, categories: { has: 'Mixes' } },
      orderBy: { publishedAt: 'desc' },
      select: { slug: true, title: true, coverImageUrl: true, publishedAt: true },
    }),
  ])
  return {
    month: key,
    label,
    releases: rel.map((r) => {
      const raw = plainTitle(r.title)
      const { artist, title } = splitTitle(raw, r.artistName)
      return { slug: r.slug, artist, title, type: typeLabel(raw, r.categories), cover: r.coverImageUrl, date: r.publishedAt!, spotify: r.spotify, beatport: r.beatport }
    }),
    mixes: news.map((n) => ({ slug: n.slug, title: plainTitle(n.title), cover: n.coverImageUrl, date: n.publishedAt! })),
  }
}

const esc = (s: string) => s.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;')
const day = (d: Date) => d.toLocaleString('en-US', { month: 'short', day: 'numeric', timeZone: 'UTC' })
const plural = (n: number, one: string, many = `${one}s`) => `${n} ${n === 1 ? one : many}`

function track(url: string, campaign: string, content: string) {
  if (!url.startsWith(SITE)) return url
  const u = new URL(url)
  u.searchParams.set('utm_source', 'newsletter')
  u.searchParams.set('utm_medium', 'email')
  u.searchParams.set('utm_campaign', campaign)
  u.searchParams.set('utm_content', content)
  return u.toString()
}

/** Square button like the site's CTAs; solid (green) or outline. Outlook gets a VML rect. */
function button(href: string, label: string, kind: 'solid' | 'outline' = 'solid', width = 200) {
  const h = esc(href)
  const bg = kind === 'solid' ? C.green : C.bg
  const fg = kind === 'solid' ? '#000000' : C.text
  const stroke = kind === 'solid' ? C.green : '#5a5a5a'
  return `<!--[if mso]><v:rect xmlns:v="urn:schemas-microsoft-com:vml" xmlns:w="urn:schemas-microsoft-com:office:word" href="${h}" style="height:40px;v-text-anchor:middle;width:${width}px;" strokecolor="${stroke}" fillcolor="${bg}"><w:anchorlock/><center style="color:${fg};font-family:${MONO};font-size:12px;font-weight:700;letter-spacing:2px;">${label.toUpperCase()}</center></v:rect><![endif]--><!--[if !mso]><!-- --><a href="${h}" style="display:inline-block;padding:12px 20px;background-color:${bg};border:1px solid ${stroke};color:${fg};font-family:${MONO};font-size:12px;font-weight:700;letter-spacing:2px;text-transform:uppercase;text-decoration:none;mso-hide:all;">${label}</a><!--<![endif]-->`
}

/** Mono, spaced, uppercase label ("● OUT NOW", section kickers). */
const label = (text: string, color = C.dim, size = 11) =>
  `<span style="font-family:${MONO};font-size:${size}px;letter-spacing:3px;text-transform:uppercase;color:${color};font-weight:700;">${text}</span>`

/** Bordered chip like the hero's DNBDOC / SINGLE / date tags. */
const chip = (text: string, color: string) =>
  `<span style="display:inline-block;padding:4px 8px;margin:0 4px 4px 0;border:1px solid ${color};font-family:${MONO};font-size:10px;letter-spacing:2px;text-transform:uppercase;color:${color === C.green ? C.green : C.muted};">${text}</span>`

/** Section heading: kicker + condensed uppercase title + hairline. */
const section = (kicker: string, title: string, color: string, pad = '30px 0 14px') =>
  `<tr><td style="padding:${pad};">${label(kicker, color)}<h2 style="margin:6px 0 0;font-family:${DISPLAY};font-size:30px;line-height:1;color:${C.text};font-weight:800;text-transform:uppercase;letter-spacing:0.5px;">${title}</h2></td></tr>`

/** One card: square cover, chips, artist + condensed title, links. Shared by releases and mixes. */
function card(o: { href: string; cover: string | null; alt: string; chips: string; artist: string | null; title: string; accent: string; links: string }) {
  const cover = o.cover
    ? `<a href="${esc(o.href)}" style="text-decoration:none;"><img src="${esc(o.cover)}" alt="${esc(o.alt)}" width="112" height="112" class="cvi" style="display:block;width:112px;height:112px;border:1px solid ${C.line};object-fit:cover;" /></a>`
    : `<div style="width:112px;height:112px;background:${C.panel};border:1px solid ${C.line};"></div>`
  return `<tr><td style="padding:0 0 12px;"><table role="presentation" width="100%" cellspacing="0" cellpadding="0" style="background-color:${C.panel};border:1px solid ${C.line};border-left:3px solid ${o.accent};">
  <tr>
    <td class="cv" width="126" valign="top" style="padding:14px 0 14px 14px;">${cover}</td>
    <td valign="top" style="padding:14px 16px 12px;">
      <div style="margin:0 0 8px;font-size:0;line-height:0;">${o.chips}</div>
      ${o.artist ? `<p style="margin:0 0 2px;font-family:${DISPLAY};font-size:17px;line-height:1.1;color:${C.purple};font-weight:800;text-transform:uppercase;letter-spacing:1px;">${esc(o.artist)}</p>` : ''}
      <p style="margin:0 0 10px;font-family:${DISPLAY};font-size:26px;line-height:1;color:${C.text};font-weight:800;text-transform:uppercase;"><a href="${esc(o.href)}" style="color:${C.text};text-decoration:none;">${esc(o.title)}</a></p>
      <p class="lk" style="margin:0;font-family:${MONO};font-size:11px;letter-spacing:2px;text-transform:uppercase;">${o.links}</p>
    </td>
  </tr></table></td></tr>`
}

const link = (href: string, text: string, color: string) => `<a href="${esc(href)}" style="color:${color};text-decoration:none;font-weight:700;">${text}</a>`
const sep = `&nbsp; <span style="color:#3a3a3a;">/</span> &nbsp;`

function releaseRow(r: MonthlyRelease, campaign: string) {
  const href = track(`${SITE}/music/${r.slug}`, campaign, `release-${r.slug}`)
  const links = [link(href, 'Listen&nbsp;→', C.green), r.spotify && link(r.spotify, 'Spotify', C.muted), r.beatport && link(r.beatport, 'Beatport', C.muted)].filter(Boolean).join(sep)
  return card({ href, cover: r.cover, alt: r.artist ? `${r.artist} – ${r.title}` : r.title, chips: chip(esc(r.type), C.purple) + chip(day(r.date), C.purple), artist: r.artist, title: r.title, accent: C.green, links })
}

function mixRow(m: MonthlyMix, campaign: string) {
  const href = track(`${SITE}/news/${m.slug}`, campaign, `mix-${m.slug}`)
  return card({ href, cover: m.cover, alt: m.title, chips: chip('DJ mix', C.crimson) + chip(day(m.date), C.purple), artist: null, title: m.title, accent: C.crimson, links: link(href, 'Play the mix&nbsp;→', C.crimson) })
}

export const defaultSubject = (d: MonthlyData) => {
  const lead = d.releases[0]
  if (!d.releases.length) return `DnB Doctor · ${d.label}`
  return d.releases.length === 1 && lead.artist
    ? `${d.label}: new ${lead.type.toLowerCase()} from ${lead.artist}`
    : `${d.label}: ${plural(d.releases.length, 'new release')}${lead.artist ? ` — ${lead.artist} & more` : ''}`
}

/** Static hero copy — the same every month; the release list below carries the specifics. */
export const defaultIntro = () =>
  `Hey {name} — here's what's new from the DnB Doctor lab: the latest releases from our roster, fresh DJ mixes and everything worth turning up. Hit play below.`

export const defaultPreheader = (d: MonthlyData) =>
  d.releases.slice(0, 3).map((r) => (r.artist ? `${r.artist} – ${r.title}` : r.title)).join(' · ') || `News from DnB Doctor`

const SOCIALS = [
  ['Instagram', 'https://www.instagram.com/dnbdoctor/'],
  ['Spotify', 'https://open.spotify.com/playlist/2GD72ly17HcWc9OAEtdUBP'],
  ['Beatport', 'https://www.beatport.com/label/dnb-doctor/75618'],
  ['SoundCloud', 'https://soundcloud.com/dnbdoctor'],
  ['YouTube', 'https://www.youtube.com/@dnbdoctor1'],
  ['Discord', 'https://discord.gg/GE2HWFdgXG'],
]

/** Hairline in the site's purple → green → purple gradient (solid green fallback for Outlook). */
const rule = `<tr><td height="1" style="height:1px;line-height:1px;font-size:0;background-color:${C.green};background-image:linear-gradient(90deg,${C.bg},${C.purple} 18%,${C.green} 50%,${C.purple} 82%,${C.bg});">&nbsp;</td></tr>`

/** Full email HTML. Intro text is plain text; blank lines become paragraphs. */
export function renderMonthly(d: MonthlyData, opts: MonthlyOptions = {}) {
  const campaign = `monthly-${d.month}`
  const intro = (opts.intro?.trim() || defaultIntro())
    .split(/\n\s*\n/)
    .map((p) => `<p style="margin:0 0 12px;font-family:${FONT};font-size:15px;line-height:1.7;color:${C.muted};">${esc(p.trim()).replace(/\n/g, '<br />')}</p>`)
    .join('')

  const releasesBlock = d.releases.length ? section('New releases', 'Fresh from the lab', C.green) + d.releases.map((r) => releaseRow(r, campaign)).join('') : ''
  const mixesBlock = d.mixes.length ? section('On rotation', 'New DJ mixes', C.crimson) + d.mixes.map((m) => mixRow(m, campaign)).join('') : ''

  return `<!DOCTYPE html>
<html lang="en" xmlns:v="urn:schemas-microsoft-com:vml"><head><meta charset="utf-8" /><meta name="viewport" content="width=device-width,initial-scale=1" /><meta name="color-scheme" content="dark" /><meta name="supported-color-schemes" content="dark" /><title>DnB Doctor · ${esc(d.label)}</title>
<!--[if !mso]><!--><link href="https://fonts.googleapis.com/css2?family=Big+Shoulders+Display:wght@800&amp;family=JetBrains+Mono:wght@700&amp;display=swap" rel="stylesheet" /><!--<![endif]-->
<style>:root{color-scheme:dark;}body{margin:0;padding:0;background:#000;}a{text-decoration:none;}@media (max-width:480px){.hero-title{font-size:46px !important;}.cv{width:86px !important;padding:12px 0 12px 12px !important;}.cvi{width:74px !important;height:74px !important;}.lk{font-size:10px !important;letter-spacing:1px !important;}}</style>
</head>
<body style="margin:0;padding:0;background-color:${C.bg};">
<div style="display:none;max-height:0;overflow:hidden;opacity:0;color:${C.bg};">${esc(opts.preheader?.trim() || defaultPreheader(d))}&#8199;&#65279;&#847;&#8199;&#65279;&#847;&#8199;&#65279;&#847;&#8199;&#65279;&#847;</div>
<table role="presentation" width="100%" cellspacing="0" cellpadding="0" bgcolor="${C.bg}" style="background-color:${C.bg};"><tr><td align="center" style="padding:20px 14px 32px;">
<table role="presentation" width="100%" cellspacing="0" cellpadding="0" style="max-width:600px;">

<tr><td align="center" style="padding:4px 0 18px;"><a href="${track(SITE, campaign, 'logo')}"><img src="${SITE}/email/dnb-doctor-logo.png" alt="DnB Doctor" width="150" height="142" style="display:block;width:150px;height:auto;border:0;" /></a></td></tr>
${rule}

<tr><td style="padding:14px 0 0;"><table role="presentation" width="100%" cellspacing="0" cellpadding="0"><tr>
  <td>${label(`<span style="color:${C.green};">&#9679;</span>&nbsp; ${esc(d.label)}`, C.green)}</td>
  <td align="right">${label('174 BPM', C.dim)}</td>
</tr></table></td></tr>

<tr><td style="padding:22px 0 8px;">
  ${chip('Monthly dispatch', C.green)}${chip('Neurofunk &amp; DnB', C.purple)}
  <h1 class="hero-title" style="margin:14px 0 18px;font-family:${DISPLAY};font-size:60px;line-height:0.92;color:${C.text};font-weight:800;text-transform:uppercase;letter-spacing:0.5px;"><span style="color:${C.purple};">Fresh signals</span><br />from the lab</h1>
  ${intro}
</td></tr>

${releasesBlock}
${mixesBlock}

<tr><td style="padding:22px 0 30px;"><table role="presentation" cellspacing="0" cellpadding="0"><tr>
  <td style="padding:0 10px 8px 0;">${button(track(`${SITE}/music`, campaign, 'catalogue'), 'All releases', 'solid', 180)}</td>
  <td style="padding:0 0 8px;">${button(track(`${SITE}/neurofunk-dnb-mixes`, campaign, 'mixes'), 'DJ mixes', 'outline', 150)}</td>
</tr></table></td></tr>

${rule}
<tr><td align="center" style="padding:22px 0 0;">
  <p style="margin:0 0 14px;font-family:${MONO};font-size:11px;letter-spacing:2px;text-transform:uppercase;line-height:2;">${SOCIALS.map(([t, u]) => `<a href="${u}" style="color:${C.muted};text-decoration:none;">${t}</a>`).join(`&nbsp; <span style="color:#3a3a3a;">/</span> &nbsp;`)}</p>
  <p style="margin:0 0 6px;font-family:${FONT};font-size:11px;line-height:1.6;color:${C.dim};">DnB Doctor · Neurofunk &amp; drum and bass label. You're getting this because you subscribed at dnbdoctor.com.</p>
  <p style="margin:0;font-family:${MONO};font-size:10px;letter-spacing:2px;text-transform:uppercase;"><a href="{unsubscribeUrl}" style="color:${C.muted};text-decoration:underline;">Unsubscribe</a></p>
</td></tr>

</table></td></tr></table>
</body></html>`
}
