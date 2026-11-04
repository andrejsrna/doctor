import crypto from 'crypto'

// Signed, expiring download links for DJ mixes. The link is emailed after opt-in, so the mix file URL
// never sits in the page HTML. No DB table: the HMAC binds slug + address + expiry.

const SITE = (process.env.NEXT_PUBLIC_SITE_URL || 'https://dnbdoctor.com').replace(/\/$/, '')
const TTL_MS = 7 * 24 * 60 * 60 * 1000

function secret() {
  const s = process.env.NEWSLETTER_SECRET || process.env.BETTER_AUTH_SECRET
  if (!s) throw new Error('NEWSLETTER_SECRET / BETTER_AUTH_SECRET is not set')
  return s
}

const sign = (slug: string, email: string, exp: number) =>
  crypto.createHmac('sha256', secret()).update(`mix:${slug}:${email.trim().toLowerCase()}:${exp}`).digest('base64url').slice(0, 32)

export function mixDownloadLink(slug: string, email: string, now = Date.now()) {
  const exp = Math.floor((now + TTL_MS) / 1000)
  const e = email.trim().toLowerCase()
  return `${SITE}/api/mix-download/${encodeURIComponent(slug)}?e=${encodeURIComponent(e)}&x=${exp}&t=${sign(slug, e, exp)}`
}

export function verifyMixDownload(slug: string, email: string | null, exp: string | null, token: string | null, now = Date.now()) {
  if (!email || !exp || !token || !/^\d+$/.test(exp)) return 'invalid' as const
  if (Number(exp) * 1000 < now) return 'expired' as const
  const a = Buffer.from(sign(slug, email, Number(exp)))
  const b = Buffer.from(token)
  return a.length === b.length && crypto.timingSafeEqual(a, b) ? ('ok' as const) : ('invalid' as const)
}
