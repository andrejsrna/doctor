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
    [`posts`, postsPerPage, page, category, search],
    async () => {
      let url = `https://admin.dnbdoctor.com/wp-json/wp/v2/posts?_embed&per_page=${postsPerPage}&page=${page}`
      if (category) url += `&categories=${category}`
      if (search) url += `&search=${encodeURIComponent(search)}`
      
      const response = await fetch(url)
      if (!response.ok) throw new Error('Failed to fetch posts')
      
      const data = await response.json()
      return {
        posts: data,
        totalPages: Number(response.headers.get('X-WP-TotalPages')) || 1,
        total: Number(response.headers.get('X-WP-Total')) || 0
      }
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
      const response = await fetch('https://admin.dnbdoctor.com/wp-json/wp/v2/categories')
      if (!response.ok) throw new Error('Failed to fetch categories')
      return response.json()
    },
    CACHE_CONFIG.posts
  )
}

export function useSingleRelease(slug: string) {
  return useSWR(
    slug ? [`release`, slug] : null,
    async () => {
      const response = await fetch(
        `https://admin.dnbdoctor.com/wp-json/wp/v2/posts?slug=${slug}&_embed`
      )
      if (!response.ok) throw new Error('Failed to fetch release')
      const data = await response.json()
      return data[0] || null
    },
    {
      ...CACHE_CONFIG.posts,
      revalidateOnMount: true,
      dedupingInterval: 60000, // 1 minute
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