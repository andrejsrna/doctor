import { prisma } from '@/lib/prisma'
import MusicClient from './MusicClient'
import { Suspense } from 'react'

export const revalidate = 300

export default async function MusicPage() {
  const [items, categories, total] = await Promise.all([
    prisma.release.findMany({
      orderBy: { publishedAt: 'desc' },
      take: 12,
      select: {
        id: true,
        slug: true,
        title: true,
        coverImageUrl: true,
        previewUrl: true,
        soundcloud: true,
        spotify: true,
        appleMusic: true,
        beatport: true,
        youtubeMusic: true,
        publishedAt: true,
      },
    }),
    (async () => {
      const rows = await prisma.release.findMany({ select: { categories: true } })
      const set = new Set<string>()
      for (const r of rows) (r.categories || []).forEach(c => c && set.add(c))
      return Array.from(set).sort((a, b) => a.localeCompare(b))
    })(),
    prisma.release.count(),
  ])

  const initialPosts = items.map(i => ({ ...i, publishedAt: i.publishedAt ? i.publishedAt.toISOString() : null }))
  const initialTotalPages = Math.max(1, Math.ceil(total / 12))

  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'ItemList',
    name: 'Drum and Bass New Releases',
    description: 'Drum and bass new releases updated daily - discover the latest DnB tracks, newest neurofunk music, and fresh releases from top artists',
    url: 'https://dnbdoctor.com/music',
    numberOfItems: initialPosts.length,
    itemListElement: initialPosts.map((post, index) => ({
      '@type': 'ListItem',
      position: index + 1,
      item: {
        '@type': 'MusicRecording',
        name: post.title,
        description: `New drum and bass release - ${post.title}`,
        genre: 'Drum and Bass',
        url: `https://dnbdoctor.com/music/${post.slug}`,
        image: post.coverImageUrl || undefined,
        datePublished: post.publishedAt || undefined,
        byArtist: { '@type': 'MusicGroup', name: 'DnB Doctor' },
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
        <MusicClient initialPosts={initialPosts} categories={categories} initialTotalPages={initialTotalPages} />
      </Suspense>
    </>
  )
}


