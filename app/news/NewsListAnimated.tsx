
"use client"

import { motion, useReducedMotion } from 'framer-motion'
import { FaNewspaper, FaArrowRight, FaCalendarAlt } from 'react-icons/fa'
import Button from '../components/Button'
import { sanitizeHtml } from '@/lib/sanitize'
import { useEffect, useMemo, useState } from 'react'

type NewsItem = { id: string; slug: string; title: string; coverImageUrl?: string | null; publishedAt?: string | null }

function formatDate(date?: string | null) {
  if (!date) return ''
  return new Date(date).toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  })
}

export default function NewsListAnimated({ posts, initialTotalPages, pageSize }: { posts: NewsItem[]; initialTotalPages?: number; pageSize?: number }) {
  const shouldReduce = useReducedMotion()
  const [items, setItems] = useState<NewsItem[]>(posts)
  const [page, setPage] = useState(1)
  const totalPages = initialTotalPages ?? 1
  const hasMore = useMemo(() => page < totalPages, [page, totalPages])

  useEffect(() => {
    setItems(posts)
    setPage(1)
  }, [posts])

  const loadMore = async () => {
    const nextPage = page + 1
    const limit = pageSize ?? 24
    const res = await fetch(`/api/news?page=${nextPage}&limit=${limit}`, { cache: 'no-store' })
    const data = await res.json()
    setItems(prev => [...prev, ...data.items])
    setPage(nextPage)
  }

  return (
    <>
      <motion.div
        initial={shouldReduce ? undefined : { opacity: 0, y: -20 }}
        animate={shouldReduce ? undefined : { opacity: 1, y: 0 }}
        className="text-center mb-16"
      >
        <div className="inline-block p-4 bg-purple-500/20 rounded-full mb-6 backdrop-blur-sm">
          <FaNewspaper className="w-12 h-12 text-purple-500" />
        </div>
        <h1 className="text-4xl md:text-6xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-purple-500 via-pink-500 to-purple-500">
          Latest News
        </h1>
      </motion.div>

      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
        {items.map((post, index) => (
          <motion.article
            key={post.id}
            initial={shouldReduce ? undefined : { opacity: 0, y: 20 }}
            whileInView={shouldReduce ? undefined : { opacity: 1, y: 0 }}
            viewport={shouldReduce ? undefined : { once: true }}
            transition={shouldReduce ? undefined : { delay: index * 0.05 }}
            className="group bg-black/30 border border-purple-500/20 rounded-xl overflow-hidden hover:border-purple-500/40 transition-all duration-300 backdrop-blur-sm hover:shadow-[0_0_15px_rgba(168,85,247,0.15)]"
          >
            <div className="p-6">
              <div className="flex items-center gap-2 text-sm text-purple-500">
                <FaCalendarAlt className="w-4 h-4" />
                <time>{formatDate(post.publishedAt)}</time>
              </div>
              <h2
                className="text-xl font-bold mt-2 mb-4 bg-clip-text text-transparent bg-gradient-to-r from-white to-gray-300 group-hover:from-purple-500 group-hover:to-pink-500 transition-all duration-300"
                dangerouslySetInnerHTML={{ __html: sanitizeHtml(post.title) }}
              />

              <motion.div whileHover={shouldReduce ? undefined : { scale: 1.02 }} className="inline-block">
                <Button href={`/news/${post.slug}`} variant="infected" className="group">
                  <span>Read More</span>
                  <FaArrowRight className="w-4 h-4 ml-2 transform group-hover:translate-x-1 transition-transform duration-300" />
                </Button>
              </motion.div>
            </div>
          </motion.article>
        ))}
      </div>

      {items.length === 0 && (
        <motion.div
          initial={shouldReduce ? undefined : { opacity: 0 }}
          animate={shouldReduce ? undefined : { opacity: 1 }}
          className="text-center py-12 px-6 rounded-lg border border-purple-500/30 bg-purple-500/5 backdrop-blur-sm mt-8"
        >
          <p className="text-gray-400">No news articles found</p>
        </motion.div>
      )}

      {hasMore && (
        <div className="flex justify-center mt-10">
          <Button onClick={loadMore} variant="infected">Load More</Button>
        </div>
      )}
    </>
  )
}


