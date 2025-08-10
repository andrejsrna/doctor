import useSWR from 'swr'

// Define cache configuration
const CACHE_CONFIG = {
  posts: {
    ttl: 300, // 5 minutes
    revalidateOnFocus: false,
    revalidateOnReconnect: true,
    keepPreviousData: true,
  },
  media: {
    ttl: 3600, // 1 hour
    revalidateOnFocus: false,
    revalidateOnReconnect: false,
    keepPreviousData: true,
  },
}

// Remove cache-related code and use simple fetcher
const fetcher = async (url: string) => {
  const res = await fetch(url)
  if (!res.ok) throw new Error('Failed to fetch data')
  return res.json()
}

export function useLatestPosts(postsPerPage: number, page = 1, category = '', search = '') {
  return useSWR(
    [`releases`, postsPerPage, page, category, search],
    async () => {
      const params = new URLSearchParams({
        page: String(page),
        limit: String(postsPerPage),
        category,
        search,
      })
      const response = await fetch(`/api/releases?${params}`)
      if (!response.ok) throw new Error('Failed to fetch releases')
      const data = await response.json()
      const posts = (data.items || []).map((item: {
        id: string
        title: string
        coverImageUrl?: string | null
        imageUrl?: string | null
        previewUrl?: string | null
        slug: string
      }) => ({
        id: item.id,
        title: item.title,
        coverImageUrl: item.imageUrl || item.coverImageUrl || null,
        previewUrl: item.previewUrl || null,
        slug: item.slug,
      }))
      return { posts, totalPages: data.totalPages || 1, total: data.total || 0 }
    },
    CACHE_CONFIG.posts
  )
}

export function useMediaPreview(mediaId: string | number | null) {
  return useSWR(
    mediaId ? `https://admin.dnbdoctor.com/wp-json/wp/v2/media/${mediaId}` : null,
    fetcher,
    CACHE_CONFIG.media
  )
}

export function useMultipleMediaPreviews(ids: string[]) {
  return useSWR(
    ids.length ? ['mediaPreviews', ids] : null,
    async () => {
      const previews = await Promise.all(
        ids.map(async (id) => {
          const response = await fetch(`https://admin.dnbdoctor.com/wp-json/wp/v2/media/${id}`)
          if (!response.ok) throw new Error(`Failed to fetch media ${id}`)
          const data = await response.json()
          return {
            id: id,
            source_url: data.source_url
          }
        })
      )
      // Return an object with IDs as keys for easier matching
      return previews.reduce((acc, preview) => {
        acc[preview.id] = preview.source_url
        return acc
      }, {} as Record<string, string>)
    },
    CACHE_CONFIG.media
  )
}

export function useCategories() {
  return useSWR(
    'categories',
    async () => {
      const res = await fetch('/api/admin/releases/categories')
      if (!res.ok) throw new Error('Failed to fetch categories')
      const data = await res.json()
      return data.categories || []
    },
    CACHE_CONFIG.posts
  )
}

export function useSingleRelease(slug: string) {
  return useSWR(
    slug ? [`release`, slug] : null,
    async () => {
      const response = await fetch(`/api/releases/${slug}`)
      if (!response.ok) throw new Error('Failed to fetch release')
      const data = await response.json()
      return data.item || null
    },
    {
      ...CACHE_CONFIG.posts,
      revalidateOnMount: true,
      dedupingInterval: 60000,
    }
  )
}

export function useReleasePreview(previewId: string | null) {
  return useSWR(
    previewId ? [`preview`, previewId] : null,
    async () => {
      const response = await fetch(
        `https://admin.dnbdoctor.com/wp-json/wp/v2/media/${previewId}`
      )
      if (!response.ok) throw new Error('Failed to fetch preview')
      const data = await response.json()
      return data.source_url
    },
    CACHE_CONFIG.media
  )
} 