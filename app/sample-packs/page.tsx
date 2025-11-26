import SamplePacksClient from './SamplePacksClient'

export const revalidate = 900

type ReleaseItem = {
  id: string
  title: string
  slug: string
  imageUrl?: string | null
  coverImageUrl?: string | null
  previewUrl?: string | null
  publishedAt?: string | null
  categories?: string[]
}

type ReleasesResponse = {
  items?: ReleaseItem[]
  totalPages?: number
  total?: number
}

const DEFAULT_SITE_URL = 'https://dnbdoctor.com'

function getSiteUrl() {
  return (process.env.NEXT_PUBLIC_SITE_URL || DEFAULT_SITE_URL).replace(/\/$/, '')
}

function toAbsoluteUrl(url: string | null | undefined, siteUrl: string) {
  if (!url) return undefined
  if (url.startsWith('http')) return url
  return `${siteUrl}${url.startsWith('/') ? '' : '/'}${url}`
}

function productUrlFromSlug(slug: string, siteUrl: string) {
  if (!slug) return `${siteUrl}/sample-packs`
  if (slug.startsWith('http')) return slug
  const normalized = slug.startsWith('/') ? slug.slice(1) : slug
  if (normalized.startsWith('sample-packs')) return `${siteUrl}/${normalized}`
  return `${siteUrl}/music/${normalized}`
}

function buildFallbackItems(siteUrl: string): ReleaseItem[] {
  const fallbackImage = `${siteUrl}/music-bg.jpeg`
  return [
    {
      id: 'fallback-1',
      title: 'Neurofunk Starter Sample Pack',
      slug: 'sample-packs#starter-pack',
      imageUrl: fallbackImage,
      previewUrl: null,
      categories: ['Sample Pack'],
    },
    {
      id: 'fallback-2',
      title: 'Dark Rollers Drum Kit',
      slug: 'sample-packs#dark-rollers',
      imageUrl: fallbackImage,
      previewUrl: null,
      categories: ['Sample Pack'],
    },
    {
      id: 'fallback-3',
      title: 'Cinematic Atmospheres Toolkit',
      slug: 'sample-packs#cinematic-atmospheres',
      imageUrl: fallbackImage,
      previewUrl: null,
      categories: ['Sample Pack'],
    },
  ]
}

function buildSchema(items: ReleaseItem[], siteUrl: string) {
  const itemListElement = items.map((post, index) => ({
    '@type': 'ListItem',
    position: index + 1,
    item: {
      '@type': 'Product',
      name: post.title,
      description: `Professional neurofunk sample pack - ${post.title}`,
      category: 'Neurofunk Samples',
      url: productUrlFromSlug(post.slug, siteUrl),
      image: toAbsoluteUrl(post.imageUrl || post.coverImageUrl || '/music-bg.jpeg', siteUrl),
      offers: {
        '@type': 'Offer',
        availability: 'https://schema.org/InStock',
        price: '0.00',
        priceCurrency: 'USD',
      },
    },
  }))

  return {
    '@context': 'https://schema.org',
    '@type': 'ItemList',
    name: 'Neurofunk Sample Packs',
    description: 'Professional neurofunk sample packs with rolling basslines, complex drums, and dark atmospheres for DnB producers',
    url: `${siteUrl}/sample-packs`,
    numberOfItems: itemListElement.length,
    itemListElement,
  }
}

async function fetchCategories(siteUrl: string) {
  try {
    const res = await fetch(`${siteUrl}/api/admin/releases/categories`, {
      next: { revalidate: 1800 },
    })
    if (!res.ok) throw new Error('Failed categories fetch')
    const data = await res.json()
    return (data.categories || []) as string[]
  } catch (error) {
    console.error('Categories fetch error for sample-packs:', error)
    return []
  }
}

async function fetchReleases(siteUrl: string, category: string) {
  try {
    const params = new URLSearchParams({
      page: '1',
      limit: '12',
    })
    if (category) params.set('category', category)
    const res = await fetch(`${siteUrl}/api/releases?${params.toString()}`, {
      next: { revalidate: 900 },
    })
    if (!res.ok) throw new Error(`Failed releases fetch: ${res.status}`)
    const data = (await res.json()) as ReleasesResponse
    const posts =
      data.items?.map((item) => ({
        id: item.id,
        title: item.title,
        slug: item.slug,
        imageUrl: item.imageUrl || item.coverImageUrl || null,
        previewUrl: item.previewUrl || null,
        publishedAt: item.publishedAt || null,
        categories: item.categories || [],
      })) || []
    return {
      posts,
      totalPages: data.totalPages || 1,
      total: data.total || posts.length,
    }
  } catch (error) {
    console.error('Releases fetch error for sample-packs:', error)
    return { posts: [] as ReleaseItem[], totalPages: 1, total: 0 }
  }
}

export default async function SamplePacksPage() {
  const siteUrl = getSiteUrl()
  const categories = await fetchCategories(siteUrl)
  const matchedCategory =
    categories.find((c) => c.toLowerCase().includes('sample pack') || c.toLowerCase().includes('sample-pack')) || ''

  const initialData = await fetchReleases(siteUrl, matchedCategory)
  const fallbackItems = buildFallbackItems(siteUrl)
  const initialPosts = initialData.posts.length ? initialData.posts : fallbackItems

  const schema = buildSchema(initialPosts, siteUrl)

  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }} />
      <SamplePacksClient
        initialPosts={initialPosts}
        initialTotalPages={initialData.totalPages}
        initialCategory={matchedCategory}
        fallbackItems={fallbackItems}
      />
    </>
  )
}
