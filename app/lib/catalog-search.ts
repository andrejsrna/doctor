/** Client helper for /api/search — shared by the header search overlay and /search. */

export type SearchHit = {
  kind: 'artist' | 'release' | 'news'
  href: string
  title: string
  /** Artist credit (releases) or label (Mix / News) */
  sub: string | null
  image: string | null
  tag: string
  date: string | null
}

export type SearchGroups = { artists: SearchHit[]; releases: SearchHit[]; news: SearchHit[] }

type Api = {
  artists: { slug: string; name: string; image: string | null }[]
  releases: { slug: string; artist: string | null; title: string; cover: string | null; type: string; date: string | null }[]
  news: { slug: string; title: string; cover: string | null; kind: string; date: string | null }[]
}

export const EMPTY_GROUPS: SearchGroups = { artists: [], releases: [], news: [] }

export async function searchSite(query: string, limit = 6, signal?: AbortSignal): Promise<SearchGroups> {
  const q = query.trim()
  if (q.length < 2) return EMPTY_GROUPS
  const res = await fetch(`/api/search?q=${encodeURIComponent(q)}&limit=${limit}`, { signal })
  if (!res.ok) throw new Error('Search is unavailable. Please try again.')
  const d: Api = await res.json()
  return {
    artists: d.artists.map((a) => ({ kind: 'artist', href: `/artists/${a.slug}`, title: a.name, sub: null, image: a.image, tag: 'Artist', date: null })),
    releases: d.releases.map((r) => ({ kind: 'release', href: `/music/${r.slug}`, title: r.title, sub: r.artist, image: r.cover, tag: r.type, date: r.date })),
    news: d.news.map((n) => ({ kind: 'news', href: `/news/${n.slug}`, title: n.title, sub: null, image: n.cover, tag: n.kind, date: n.date })),
  }
}

export const flatHits = (g: SearchGroups) => [...g.artists, ...g.releases, ...g.news]
