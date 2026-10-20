/** URL-safe key for a category name ("EP's" → "eps", "Single Tracks" → "single-tracks"). */
export const slugify = (v: string) =>
  v
    .toLowerCase()
    .replace(/['’]/g, '')
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '')

const ALIASES: Record<string, string> = {
  single: 'single-tracks',
  singles: 'single-tracks',
  'single-track': 'single-tracks',
  ep: 'eps',
  lp: 'albums',
  lps: 'albums',
  album: 'albums',
  'music-pack': 'music-packs',
  'sample-pack': 'sample-packs',
}

/** Map a ?category= value (old links, nav, aliases) to a known chip slug, or '' for "all". */
export function resolveCategory(param: string | null, known: string[]) {
  if (!param) return ''
  const s = slugify(param)
  if (known.includes(s)) return s
  const alias = ALIASES[s]
  return alias && known.includes(alias) ? alias : ''
}
