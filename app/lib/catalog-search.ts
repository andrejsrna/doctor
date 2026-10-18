export interface CatalogSearchResult {
  id: string
  type: 'post' | 'news' | 'artist'
  title: { rendered: string }
  excerpt: { rendered: string }
  slug: string
  date: string
}

interface CatalogItem {
  id: string
  slug: string
  title?: string
  name?: string
  publishedAt?: string | null
}

export async function searchCatalog(query: string, limit = 10, signal?: AbortSignal): Promise<CatalogSearchResult[]> {
  const sources = [
    { endpoint: 'releases', type: 'post' as const },
    { endpoint: 'news', type: 'news' as const },
    { endpoint: 'artists', type: 'artist' as const },
  ]
  const groups = await Promise.all(sources.map(async ({ endpoint, type }) => {
    const response = await fetch(`/api/${endpoint}?search=${encodeURIComponent(query.trim())}&limit=${limit}`, { signal })
    if (!response.ok) throw new Error('Search is unavailable. Please try again.')
    const data: { items: CatalogItem[] } = await response.json()
    return data.items.map((item) => ({
      id: item.id,
      type,
      title: { rendered: item.title || item.name || '' },
      excerpt: { rendered: '' },
      slug: item.slug,
      date: item.publishedAt || '',
    }))
  }))
  const normalized = query.trim().toLowerCase()
  const score = (title: string) => title === normalized ? 0 : title.startsWith(normalized) ? 1 : title.includes(normalized) ? 2 : 3
  return groups.flat().sort((a, b) => score(a.title.rendered.toLowerCase()) - score(b.title.rendered.toLowerCase()) || a.title.rendered.localeCompare(b.title.rendered))
}
