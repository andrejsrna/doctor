"use client"

import dynamic from 'next/dynamic'

type NewsItem = { id: string; slug: string; title: string; coverImageUrl?: string | null; publishedAt?: string | null; categories?: string[] }
type NewsListAnimatedProps = { posts: NewsItem[]; initialTotalPages?: number; pageSize?: number }

const NewsListAnimated = dynamic<NewsListAnimatedProps>(() => import('./NewsListAnimated'))

// removed unused formatDate

export default function NewsListClient({ initialPosts, initialTotalPages, pageSize }: { initialPosts: NewsItem[]; initialTotalPages: number; pageSize: number }) {
  return <NewsListAnimated posts={initialPosts} initialTotalPages={initialTotalPages} pageSize={pageSize} />
}

