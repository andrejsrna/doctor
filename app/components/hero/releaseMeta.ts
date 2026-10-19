/** Shared helpers for presenting a release (home hero + release detail). */

/** "Artist - Title" → { artist, title } when the release has no explicit artist. */
export function splitTitle(raw: string, artistName: string | null) {
  if (artistName) return { artist: artistName, title: raw }
  const m = raw.match(/^(.+?)\s+[-–—]\s+(.+)$/)
  if (m) return { artist: m[1].trim(), title: m[2].trim() }
  return { artist: null, title: raw }
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
