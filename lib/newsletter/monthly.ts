import { prisma } from '@/lib/prisma'
import { plainTitle, splitTitle, typeLabel } from '@/app/components/hero/releaseMeta'

/**
 * Monthly "latest releases" newsletter: data for one calendar month + table-based email HTML.
 * Merge fields ({name}, {unsubscribeUrl}) are filled per recipient by lib/newsletter/mailer.ts.
 */

const SITE = 'https://dnbdoctor.com'
const C = { bg: '#050507', card: '#0e0d16', line: 'rgba(155,94,255,0.32)', green: '#39ff14', purple: '#9b5eff', crimson: '#ff004d', text: '#e9e9f2', muted: '#a3a3b8', dim: '#6b6b80' }
const FONT = "'Helvetica Neue',Helvetica,Arial,sans-serif"
const MONO = "'SFMono-Regular',Menlo,Consolas,'Courier New',monospace"

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

/** Pill button with an Outlook (VML) fallback, like the existing campaign templates. */
function button(href: string, label: string, bg: string, fg = '#050507', width = 190) {
  const h = esc(href)
  return `<!--[if mso]><v:roundrect xmlns:v="urn:schemas-microsoft-com:vml" xmlns:w="urn:schemas-microsoft-com:office:word" href="${h}" style="height:42px;v-text-anchor:middle;width:${width}px;" arcsize="50%" strokecolor="${bg}" fillcolor="${bg}"><w:anchorlock/><center style="color:${fg};font-family:${FONT};font-size:13px;font-weight:700;">${label}</center></v:roundrect><![endif]--><!--[if !mso]><!-- --><a href="${h}" style="display:inline-block;padding:12px 24px;border-radius:999px;background-color:${bg};color:${fg};font-family:${FONT};font-size:13px;font-weight:700;text-decoration:none;mso-hide:all;">${label}</a><!--<![endif]-->`
}

const kicker = (text: string, color = C.green) => `<p style="margin:0 0 6px;font-family:${MONO};font-size:11px;letter-spacing:3px;text-transform:uppercase;color:${color};font-weight:700;">${text}</p>`

function releaseRow(r: MonthlyRelease, campaign: string) {
  const href = track(`${SITE}/music/${r.slug}`, campaign, `release-${r.slug}`)
  const credit = r.artist ? `${esc(r.artist)} – ` : ''
  const cover = r.cover
    ? `<img src="${esc(r.cover)}" alt="${esc(r.title)}" width="76" height="76" style="display:block;width:76px;height:76px;border-radius:8px;border:0;object-fit:cover;" />`
    : `<div style="width:76px;height:76px;border-radius:8px;background:${C.purple};"></div>`
  return `<tr><td style="padding:0 0 10px;"><table role="presentation" width="100%" cellspacing="0" cellpadding="0" style="background-color:${C.card};border:1px solid ${C.line};border-radius:12px;">
  <tr>
    <td width="88" valign="middle" style="padding:12px 0 12px 12px;"><a href="${esc(href)}" style="text-decoration:none;">${cover}</a></td>
    <td valign="middle" style="padding:12px 14px;">
      <p style="margin:0 0 4px;font-family:${MONO};font-size:10px;letter-spacing:2px;text-transform:uppercase;color:${C.purple};">${esc(r.type)} · ${day(r.date)}</p>
      <p style="margin:0 0 6px;font-family:${FONT};font-size:15px;line-height:1.35;color:#ffffff;font-weight:700;"><a href="${esc(href)}" style="color:#ffffff;text-decoration:none;">${credit}${esc(r.title)}</a></p>
      <p style="margin:0;font-family:${FONT};font-size:12px;"><a href="${esc(href)}" style="color:${C.green};text-decoration:none;font-weight:700;">Listen&nbsp;→</a>${r.beatport ? `&nbsp;&nbsp;<a href="${esc(r.beatport)}" style="color:${C.muted};text-decoration:none;">Beatport</a>` : ''}${r.spotify ? `&nbsp;&nbsp;<a href="${esc(r.spotify)}" style="color:${C.muted};text-decoration:none;">Spotify</a>` : ''}</p>
    </td>
  </tr></table></td></tr>`
}

function mixRow(m: MonthlyMix, campaign: string) {
  const href = track(`${SITE}/news/${m.slug}`, campaign, `mix-${m.slug}`)
  return `<tr><td style="padding:0 0 10px;"><table role="presentation" width="100%" cellspacing="0" cellpadding="0" style="background-color:${C.card};border:1px solid rgba(255,0,77,0.3);border-radius:12px;">
  <tr>
    ${m.cover ? `<td width="88" valign="middle" style="padding:12px 0 12px 12px;"><a href="${esc(href)}"><img src="${esc(m.cover)}" alt="${esc(m.title)}" width="76" height="76" style="display:block;width:76px;height:76px;border-radius:8px;border:0;object-fit:cover;" /></a></td>` : ''}
    <td valign="middle" style="padding:12px 14px;">
      <p style="margin:0 0 4px;font-family:${MONO};font-size:10px;letter-spacing:2px;text-transform:uppercase;color:${C.crimson};">DJ mix · ${day(m.date)}</p>
      <p style="margin:0 0 6px;font-family:${FONT};font-size:15px;line-height:1.35;color:#ffffff;font-weight:700;"><a href="${esc(href)}" style="color:#ffffff;text-decoration:none;">${esc(m.title)}</a></p>
      <p style="margin:0;font-family:${FONT};font-size:12px;"><a href="${esc(href)}" style="color:${C.crimson};text-decoration:none;font-weight:700;">Play the mix&nbsp;→</a></p>
    </td>
  </tr></table></td></tr>`
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

/** Full email HTML. Intro text is plain text; blank lines become paragraphs. */
export function renderMonthly(d: MonthlyData, opts: MonthlyOptions = {}) {
  const campaign = `monthly-${d.month}`
  const intro = (opts.intro?.trim() || defaultIntro())
    .split(/\n\s*\n/)
    .map((p) => `<p style="margin:0 0 12px;font-family:${FONT};font-size:15px;line-height:1.7;color:${C.muted};">${esc(p.trim()).replace(/\n/g, '<br />')}</p>`)
    .join('')

  const releasesBlock = d.releases.length
    ? `<tr><td style="padding:0 2px 12px;">${kicker('New releases', C.purple)}<h2 style="margin:0;font-family:${FONT};font-size:20px;color:#ffffff;font-weight:800;">Fresh from the lab</h2></td></tr>${d.releases.map((r) => releaseRow(r, campaign)).join('')}`
    : ''
  const mixesBlock = d.mixes.length
    ? `<tr><td style="padding:16px 2px 12px;">${kicker('On rotation', C.crimson)}<h2 style="margin:0;font-family:${FONT};font-size:20px;color:#ffffff;font-weight:800;">New DJ mixes</h2></td></tr>${d.mixes.map((m) => mixRow(m, campaign)).join('')}`
    : ''

  const socials = [
    ['Spotify', 'https://open.spotify.com/playlist/2GD72ly17HcWc9OAEtdUBP'],
    ['Beatport', 'https://www.beatport.com/label/dnb-doctor/75618'],
    ['SoundCloud', 'https://soundcloud.com/dnbdoctor'],
    ['YouTube', 'https://www.youtube.com/@dnbdoctor1'],
    ['Instagram', 'https://www.instagram.com/dnbdoctor/'],
    ['Discord', 'https://discord.gg/GE2HWFdgXG'],
  ]

  return `<!DOCTYPE html>
<html lang="en" xmlns:v="urn:schemas-microsoft-com:vml"><head><meta charset="utf-8" /><meta name="viewport" content="width=device-width,initial-scale=1" /><meta name="color-scheme" content="dark" /><meta name="supported-color-schemes" content="dark" /><title>DnB Doctor · ${esc(d.label)}</title></head>
<body style="margin:0;padding:0;background-color:${C.bg};">
<div style="display:none;max-height:0;overflow:hidden;opacity:0;color:${C.bg};">${esc(opts.preheader?.trim() || defaultPreheader(d))}&#8199;&#65279;&#847;&#8199;&#65279;&#847;&#8199;&#65279;&#847;&#8199;&#65279;&#847;</div>
<table role="presentation" width="100%" cellspacing="0" cellpadding="0" style="background-color:${C.bg};"><tr><td align="center" style="padding:16px 12px 28px;">
<table role="presentation" width="100%" cellspacing="0" cellpadding="0" style="max-width:600px;">

<tr><td align="center" style="padding:6px 0 18px;"><a href="${track(SITE, campaign, 'logo')}"><img src="${SITE}/logo-1.png" alt="DnB Doctor" width="132" style="display:block;width:132px;height:auto;border:0;" /></a></td></tr>

<tr><td style="padding:0 0 22px;"><table role="presentation" width="100%" cellspacing="0" cellpadding="0" style="background-color:#0b0b0f;border:1px solid ${C.line};border-top:3px solid ${C.green};border-radius:16px;"><tr><td style="padding:26px 24px 16px;">
  ${kicker(`Monthly dispatch · ${esc(d.label)}`)}
  <h1 style="margin:0 0 14px;font-family:${FONT};font-size:34px;line-height:1.05;color:#ffffff;font-weight:900;text-transform:uppercase;letter-spacing:-0.5px;">Fresh signals<br /><span style="color:${C.purple};">from the lab.</span></h1>
  ${intro}
</td></tr></table></td></tr>

${releasesBlock}
${mixesBlock}

<tr><td align="center" style="padding:18px 0 6px;">${button(track(`${SITE}/music`, campaign, 'catalogue'), 'Browse the full catalogue', 'transparent', C.green, 240).replace(`background-color:transparent;`, `background-color:transparent;border:1px solid ${C.green};`)}</td></tr>

<tr><td align="center" style="padding:26px 0 0;border-top:1px solid rgba(255,255,255,0.08);">
  <p style="margin:18px 0 10px;font-family:${FONT};font-size:12px;">${socials.map(([t, u]) => `<a href="${u}" style="color:${C.green};text-decoration:none;">${t}</a>`).join(`<span style="color:${C.dim};">&nbsp;·&nbsp;</span>`)}</p>
  <p style="margin:0 0 6px;font-family:${FONT};font-size:11px;line-height:1.6;color:${C.dim};">You're getting this because you subscribed to DnB Doctor news at dnbdoctor.com.</p>
  <p style="margin:0;font-family:${FONT};font-size:11px;color:${C.dim};"><a href="{unsubscribeUrl}" style="color:${C.muted};text-decoration:underline;">Unsubscribe</a></p>
</td></tr>

</table></td></tr></table>
</body></html>`
}
