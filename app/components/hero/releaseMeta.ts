/** Shared helpers for presenting a release (home hero + release detail). */

/** "Artist - Title" → { artist, title }; an explicit artistName wins for the credit. */
export function splitTitle(raw: string, artistName: string | null) {
  const m = raw.match(/^(.+?)\s+[-–—]\s+(.+)$/)
  if (m) return { artist: artistName || m[1].trim(), title: m[2].trim() }
  return { artist: artistName || null, title: raw }
}

/** First credited act of "A & B", "A, B", "A ft. B" (for linking a profile). */
export function primaryArtist(credit: string) {
  return credit.split(/\s*(?:&|,|\s(?:feat\.|ft\.)\s)\s*/i)[0].replace(/\s*\([^)]*\)$/, '').trim()
}

export function typeLabel(title: string, categories: string[]) {
  const hay = `${title} ${categories.join(' ')}`
  if (/\bEPs?\b/i.test(hay)) return 'EP'
  if (/\b(LPs?|albums?)\b/i.test(hay)) return 'Album'
  if (/\bpack\b/i.test(hay)) return 'Pack'
  return 'Single'
}

const NAMED: Record<string, string> = { amp: '&', lt: '<', gt: '>', quot: '"', apos: "'", nbsp: ' ', ndash: '–', mdash: '—', rsquo: '’', lsquo: '‘', hellip: '…' }

/** Plain text from a WordPress-era title (strips tags, decodes entities). */
export function plainTitle(raw: string) {
  return raw
    .replace(/<[^>]+>/g, '')
    .replace(/&#(x?)([0-9a-f]+);/gi, (_, hex, n) => String.fromCodePoint(parseInt(n, hex ? 16 : 10)))
    .replace(/&([a-z]+);/gi, (m, name) => NAMED[name.toLowerCase()] ?? m)
    .trim()
}
