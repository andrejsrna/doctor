import { createHmac, timingSafeEqual } from 'node:crypto'

// Signed, expiring download links for guest buyers: `${itemId}.${expiresSec}.${sig}`. No DB row needed.

function secret() {
  const s = process.env.SHOP_SECRET || process.env.BETTER_AUTH_SECRET
  if (!s) throw new Error('SHOP_SECRET is not set')
  return s
}

const sign = (payload: string) => createHmac('sha256', secret()).update(`download:${payload}`).digest('base64url')

export const DOWNLOAD_LINK_DAYS = 30

export function downloadToken(itemId: string, now = Date.now(), days = DOWNLOAD_LINK_DAYS) {
  const exp = Math.floor(now / 1000) + days * 86400
  return `${itemId}.${exp}.${sign(`${itemId}.${exp}`)}`
}

/** Returns the order item id when the token is genuine and unexpired, otherwise null. */
export function verifyDownloadToken(token: string, now = Date.now()): string | null {
  const [itemId, expRaw, sig] = token.split('.')
  if (!itemId || !expRaw || !sig) return null
  const exp = Number(expRaw)
  if (!Number.isFinite(exp) || exp * 1000 < now) return null
  const expected = Buffer.from(sign(`${itemId}.${exp}`))
  const got = Buffer.from(sig)
  return got.length === expected.length && timingSafeEqual(got, expected) ? itemId : null
}
