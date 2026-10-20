import crypto from 'crypto'

const SITE = 'https://dnbdoctor.com'

function secret() {
  const s = process.env.NEWSLETTER_SECRET || process.env.BETTER_AUTH_SECRET
  if (!s) throw new Error('NEWSLETTER_SECRET / BETTER_AUTH_SECRET is not set')
  return s
}

const norm = (email: string) => email.trim().toLowerCase()

/** Signed per-address token, so an unsubscribe link only works for the address it was sent to. */
export function unsubscribeToken(email: string) {
  return crypto.createHmac('sha256', secret()).update(`unsub:${norm(email)}`).digest('base64url').slice(0, 32)
}

export function verifyUnsubscribeToken(email: string, token: string | null | undefined) {
  if (!token) return false
  const a = Buffer.from(unsubscribeToken(email))
  const b = Buffer.from(token)
  return a.length === b.length && crypto.timingSafeEqual(a, b)
}

const query = (email: string) => `e=${encodeURIComponent(norm(email))}&t=${unsubscribeToken(email)}`

/** Link in the email footer: opens /unsub with the address filled in. */
export const unsubscribePageUrl = (email: string) => `${SITE}/unsub?${query(email)}`

/** RFC 8058 one-click endpoint for the List-Unsubscribe header (Gmail / Yahoo bulk-sender rule). */
export const oneClickUnsubscribeUrl = (email: string) => `${SITE}/api/unsubscribe?${query(email)}`
