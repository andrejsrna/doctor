import { prisma } from '@/lib/prisma'
import AlbumsClient from './AlbumsClient'
import { Suspense } from 'react'

export const revalidate = 300

export default async function AlbumsPage() {
  // Get all categories first
  const allCategories = await (async () => {
    const rows = await prisma.release.findMany({ select: { categories: true } })
    const set = new Set<string>()
    for (const r of rows) (r.categories || []).forEach(c => c && set.add(c))
    return Array.from(set).sort((a, b) => a.localeCompare(b))
  })()
  
  // Find album-related categories (only Albums)
  const albumCategories = allCategories.filter(cat => {
    const lower = cat.toLowerCase()
    return lower.includes('album')
  })
  
  // Get initial releases filtered by album categories
  const [items, total] = await Promise.all([
    prisma.release.findMany({
      where: albumCategories.length > 0 ? {
        categories: {
          hasSome: albumCategories
        }
      } : undefined,
      orderBy: { publishedAt: 'desc' },
      take: 12,
      select: {
        id: true,
        slug: true,
        title: true,
        artistName: true,
        coverImageUrl: true,
        previewUrl: true,
        soundcloud: true,
        spotify: true,
        appleMusic: true,
        beatport: true,
        youtubeMusic: true,
        publishedAt: true,
        categories: true,
      },
    }),
    prisma.release.count({
      where: albumCategories.length > 0 ? {
        categories: {
          hasSome: albumCategories
        }
      } : undefined
    })
  ])

  const initialPosts = items.map(i => ({ 
    ...i, 
    publishedAt: i.publishedAt ? i.publishedAt.toISOString() : null 
  }))
  const initialTotalPages = Math.max(1, Math.ceil(total / 12))

  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'ItemList',
    name: 'New Drum and Bass Albums',
    description: 'Latest drum and bass albums and LP releases from DnB Doctor - discover new DnB albums, neurofunk albums, and dark DnB collections',
    url: 'https://dnbdoctor.com/albums',
    numberOfItems: initialPosts.length,
    itemListElement: initialPosts.map((post, index) => ({
      '@type': 'ListItem',
      position: index + 1,
      item: {
        '@type': 'MusicAlbum',
        name: post.title,
        description: `New drum and bass album - ${post.title}`,
        genre: 'Drum and Bass',
        url: `https://dnbdoctor.com/music/${post.slug}`,
        image: post.coverImageUrl || undefined,
        datePublished: post.publishedAt || undefined,
        byArtist: { '@type': 'MusicGroup', name: post.artistName || 'DnB Doctor' },
      }
    }))
  }

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <Suspense fallback={<div className="min-h-[300px]" />}> 
        <AlbumsClient 
          initialPosts={initialPosts} 
          categories={allCategories}
          albumCategories={albumCategories}
          initialTotalPages={initialTotalPages} 
        />
      </Suspense>
    </>
  )
}
