import { prisma } from '@/lib/prisma'
import type { Metadata } from 'next'
import { plainTitle } from '@/app/components/hero/releaseMeta'
import NewsFeed, { type FeedPost } from './NewsFeed'

export const revalidate = 300

const PAGE_SIZE = 24

/** First ~200 chars of readable prose: no tags, links or emoji-only lines. */
function excerpt(html: string | null) {
  if (!html) return null
  const text = plainTitle(html.replace(/<\/(p|h\d|li|div)>/gi, ' \n'))
    .replace(/https?:\/\/\S+/g, '')
    .replace(/[\p{Extended_Pictographic}\uFE0F]/gu, '')
    .replace(/\s+/g, ' ')
    .trim()
  if (!text) return null
  if (text.length <= 200) return text
  const cut = text.slice(0, 200)
  return cut.slice(0, cut.lastIndexOf(' ')).replace(/[,;:—–-]$/, '') + '…'
}

async function load() {
  if (!process.env.DATABASE_URL) return { posts: [] as FeedPost[], total: 0, counts: [] as [string, number][] }
  try {
    const [rows, total, allCats] = await Promise.all([
      prisma.news.findMany({
        orderBy: { publishedAt: 'desc' },
        take: PAGE_SIZE,
        select: {
          id: true,
          slug: true,
          title: true,
          coverImageUrl: true,
          publishedAt: true,
          categories: true,
          content: true,
          youtubeUrl: true,
          soundcloudUrl: true,
        },
      }),
      prisma.news.count(),
      prisma.news.findMany({ select: { categories: true } }),
    ])
    const tally = new Map<string, number>()
    for (const { categories } of allCats) for (const c of categories.length ? categories : ['News']) tally.set(c, (tally.get(c) ?? 0) + 1)
    const posts: FeedPost[] = rows.map(({ content, youtubeUrl, soundcloudUrl, publishedAt, ...p }) => ({
      ...p,
      title: plainTitle(p.title),
      publishedAt: publishedAt ? publishedAt.toISOString() : null,
      excerpt: excerpt(content),
      video: Boolean(youtubeUrl),
      audio: Boolean(soundcloudUrl),
    }))
    return { posts, total, counts: [...tally.entries()].sort((a, b) => b[1] - a[1]) }
  } catch {
    return { posts: [] as FeedPost[], total: 0, counts: [] as [string, number][] }
  }
}

export default async function NewsPage() {
  const { posts, total, counts } = await load()

  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'Blog',
    name: 'DnB Doctor News',
    url: 'https://dnbdoctor.com/news',
    publisher: { '@type': 'Organization', name: 'DnB Doctor', url: 'https://dnbdoctor.com' },
    blogPost: posts.map((p) => ({
      '@type': 'BlogPosting',
      headline: p.title,
      url: `https://dnbdoctor.com/news/${p.slug}`,
      ...(p.publishedAt && { datePublished: p.publishedAt }),
      ...(p.coverImageUrl && { image: p.coverImageUrl }),
    })),
  }

  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />
      <NewsFeed posts={posts} total={total} counts={counts} pageSize={PAGE_SIZE} />
    </>
  )
}

export const metadata: Metadata = {
  title: { absolute: 'Latest Drum & Bass News | DNB Doctor' },
  description: 'Fresh drum & bass and neurofunk news, releases, and features curated by DNB Doctor.',
  openGraph: {
    title: 'Latest Drum & Bass News | DNB Doctor',
    description: 'Fresh drum & bass and neurofunk news, releases, and features curated by DNB Doctor.',
    url: 'https://dnbdoctor.com/news',
    type: 'website',
  },
  alternates: { canonical: 'https://dnbdoctor.com/news' },
}
