import { prisma } from '@/lib/prisma'
import NewsListClient from './NewsListClient'
import type { Metadata } from 'next'

export const revalidate = 300

export default async function NewsPage() {
  const pageSize = 24
  const [posts, total] = await Promise.all([
    prisma.news.findMany({
    orderBy: { publishedAt: 'desc' },
    take: pageSize,
    select: { id: true, slug: true, title: true, coverImageUrl: true, publishedAt: true },
    }),
    prisma.news.count(),
  ])
  const safePosts = posts.map(p => ({
    ...p,
    publishedAt: p.publishedAt ? p.publishedAt.toISOString() : null,
  }))
  const totalPages = Math.max(1, Math.ceil(total / pageSize))

  return (
    <section className="py-32 px-4 relative min-h-screen">
      <div className="absolute inset-0">
        <div className="absolute inset-0 bg-gradient-to-b from-black via-purple-900/10 to-black" />
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,_var(--tw-gradient-stops))] from-purple-900/20 via-transparent to-transparent animate-pulse" />
      </div>
      <div className="max-w-7xl mx-auto relative z-10">
        <NewsListClient initialPosts={safePosts} initialTotalPages={totalPages} pageSize={pageSize} />
      </div>
    </section>
  )
}

export const metadata: Metadata = {
  title: 'Latest Drum & Bass News | DNB Doctor',
  description: 'Fresh drum & bass and neurofunk news, releases, and features curated by DNB Doctor.',
  openGraph: {
    title: 'Latest Drum & Bass News | DNB Doctor',
    description: 'Fresh drum & bass and neurofunk news, releases, and features curated by DNB Doctor.',
    url: 'https://dnbdoctor.com/news',
    type: 'website',
  },
  alternates: { canonical: 'https://dnbdoctor.com/news' },
}