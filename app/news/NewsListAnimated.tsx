"use client"

import Image from 'next/image'
import Link from 'next/link'
import { motion, useReducedMotion } from 'framer-motion'
import { useEffect, useMemo, useState } from 'react'
import { sanitizeHtml } from '@/app/utils/sanitize'

type NewsItem = {
  id: string
  slug: string
  title: string
  coverImageUrl?: string | null
  publishedAt?: string | null
  categories?: string[]
}

function formatDate(date?: string | null) {
  if (!date) return ''
  return new Date(date).toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  })
}

type BadgeVariant = 'featured' | 'release' | 'interview' | 'mix' | 'event' | 'default'

const BADGE_STYLES: Record<BadgeVariant, string> = {
  featured: 'bg-[#6F3DFF] text-white',
  release:  'bg-[#74F2CE]/10 text-[#74F2CE] border border-[#74F2CE]/25',
  interview:'bg-[#c084fc]/10 text-[#c084fc] border border-[#c084fc]/25',
  mix:      'bg-[#f59e0b]/10 text-[#f59e0b] border border-[#f59e0b]/25',
  event:    'bg-[#ef4444]/10 text-[#ef4444] border border-[#ef4444]/25',
  default:  'bg-[#6F3DFF]/10 text-[#a78bfa] border border-[#6F3DFF]/25',
}

function getBadgeVariant(categories?: string[]): BadgeVariant {
  if (!categories?.length) return 'default'
  const c = categories[0].toLowerCase()
  if (c.includes('release')) return 'release'
  if (c.includes('interview')) return 'interview'
  if (c.includes('mix')) return 'mix'
  if (c.includes('event')) return 'event'
  return 'default'
}

function Badge({ label, variant }: { label: string; variant: BadgeVariant }) {
  return (
    <span className={`inline-block px-2.5 py-0.5 rounded text-[10px] font-bold uppercase tracking-wider ${BADGE_STYLES[variant]}`}>
      {label}
    </span>
  )
}

const FILTER_CATEGORIES = ['All', 'Releases', 'Interviews', 'Mixes', 'Events']

const FILTER_MAP: Record<string, string> = {
  Releases:   'release',
  Interviews: 'interview',
  Mixes:      'mix',
  Events:     'event',
}

function FilterPills({
  active,
  onChange,
}: {
  active: string
  onChange: (cat: string) => void
}) {
  return (
    <div className="flex flex-wrap gap-2 mb-10">
      {FILTER_CATEGORIES.map((cat) => (
        <button
          key={cat}
          type="button"
          onClick={() => onChange(cat)}
          className={`px-4 py-1.5 rounded-full text-xs font-semibold uppercase tracking-wider transition-colors duration-150 ${
            active === cat
              ? 'bg-[#6F3DFF] text-white'
              : 'bg-[#111] text-gray-600 border border-[#222] hover:border-[#6F3DFF]/30 hover:text-gray-400'
          }`}
        >
          {cat}
        </button>
      ))}
    </div>
  )
}

function CoverImage({
  src,
  alt,
  fill = false,
  className = '',
}: {
  src?: string | null
  alt: string
  fill?: boolean
  className?: string
}) {
  if (src) {
    return (
      <Image
        src={src}
        alt={alt}
        fill={fill}
        sizes={fill ? '(min-width: 768px) 800px, 100vw' : undefined}
        className={`object-cover ${className}`}
        placeholder="blur"
        blurDataURL="data:image/gif;base64,R0lGODlhAQABAIAAAAAAAP///ywAAAAAAQABAAACAUwAOw=="
      />
    )
  }
  return (
    <div
      className={`bg-gradient-to-br from-[#1a0a2e] to-[#050410] ${className}`}
      aria-hidden
    />
  )
}

function HeroCard({ post, reduce }: { post: NewsItem; reduce: boolean | null }) {
  return (
    <motion.article
      initial={reduce ? undefined : { opacity: 0, y: -10 }}
      animate={reduce ? undefined : { opacity: 1, y: 0 }}
      transition={reduce ? undefined : { duration: 0.4 }}
      className="relative rounded-2xl overflow-hidden group cursor-pointer"
    >
      <Link href={`/news/${post.slug}`} className="block">
        <div className="relative h-[340px]">
          <CoverImage src={post.coverImageUrl} alt={post.title.replace(/<[^>]*>/g, '')} fill className="transition-transform duration-500 group-hover:scale-105" />
          <div className="absolute inset-0 bg-gradient-to-t from-[#040410] via-[#040410]/50 to-transparent" />
        </div>
        <div className="absolute bottom-0 left-0 right-0 p-7">
          <Badge label="Featured" variant="featured" />
          <h2
            className="text-xl md:text-2xl font-extrabold text-white mt-2.5 leading-snug tracking-tight"
            dangerouslySetInnerHTML={{ __html: sanitizeHtml(post.title) }}
          />
          <div className="flex items-center gap-3 mt-3">
            <time dateTime={post.publishedAt ?? undefined} className="text-gray-500 text-xs">{formatDate(post.publishedAt)}</time>
            <span className="text-[#6F3DFF] text-xs font-semibold group-hover:text-[#a78bfa] transition-colors">Read more →</span>
          </div>
        </div>
      </Link>
    </motion.article>
  )
}

function SideCard({ post, reduce, delay }: { post: NewsItem; reduce: boolean | null; delay: number }) {
  const variant = getBadgeVariant(post.categories)
  const label = post.categories?.[0] ?? 'News'

  return (
    <motion.article
      initial={reduce ? undefined : { opacity: 0, x: 16 }}
      animate={reduce ? undefined : { opacity: 1, x: 0 }}
      transition={reduce ? undefined : { duration: 0.35, delay }}
      whileHover={reduce ? undefined : { y: -2 }}
      className="flex flex-col bg-[#0d0d1a] border border-white/[0.04] rounded-xl overflow-hidden hover:border-[#6F3DFF]/25 transition-[border-color] duration-200 cursor-pointer"
    >
      <Link href={`/news/${post.slug}`} className="flex flex-col flex-1">
        <div className="relative h-[100px] flex-shrink-0">
          <CoverImage src={post.coverImageUrl} alt={post.title.replace(/<[^>]*>/g, '')} fill />
        </div>
        <div className="p-4 flex flex-col flex-1">
          <Badge label={label} variant={variant} />
          <h3
            className="text-sm font-bold text-gray-100 mt-2 leading-snug flex-1"
            dangerouslySetInnerHTML={{ __html: sanitizeHtml(post.title) }}
          />
          <time dateTime={post.publishedAt ?? undefined} className="text-gray-600 text-[11px] mt-2">{formatDate(post.publishedAt)}</time>
        </div>
      </Link>
    </motion.article>
  )
}

function NewsCard({ post, reduce, index }: { post: NewsItem; reduce: boolean | null; index: number }) {
  const variant = getBadgeVariant(post.categories)
  const label = post.categories?.[0] ?? 'News'

  return (
    <motion.article
      initial={reduce ? undefined : { opacity: 0, y: 20 }}
      whileInView={reduce ? undefined : { opacity: 1, y: 0 }}
      viewport={reduce ? undefined : { once: true }}
      transition={reduce ? undefined : { delay: Math.min(index * 0.04, 0.3) }}
      className="bg-[#0d0d1a] border border-white/[0.04] rounded-xl overflow-hidden hover:border-[#6F3DFF]/25 hover:shadow-[0_0_20px_rgba(111,61,255,0.08)] transition-[border-color,box-shadow] duration-200 cursor-pointer"
    >
      <Link href={`/news/${post.slug}`} className="block">
        <div className="relative h-[160px]">
          <CoverImage src={post.coverImageUrl} alt={post.title.replace(/<[^>]*>/g, '')} fill />
        </div>
        <div className="p-4">
          <Badge label={label} variant={variant} />
          <h3
            className="text-sm font-bold text-gray-100 mt-2 mb-2 leading-snug"
            dangerouslySetInnerHTML={{ __html: sanitizeHtml(post.title) }}
          />
          <time dateTime={post.publishedAt ?? undefined} className="text-gray-600 text-[11px]">{formatDate(post.publishedAt)}</time>
        </div>
      </Link>
    </motion.article>
  )
}

export default function NewsListAnimated({
  posts,
  initialTotalPages,
  pageSize,
}: {
  posts: NewsItem[]
  initialTotalPages?: number
  pageSize?: number
}) {
  const shouldReduce = useReducedMotion()
  const [items, setItems] = useState<NewsItem[]>(posts)
  const [page, setPage] = useState(1)
  const [activeFilter, setActiveFilter] = useState('All')
  const [loadError, setLoadError] = useState(false)
  const totalPages = initialTotalPages ?? 1
  const hasMore = useMemo(() => page < totalPages, [page, totalPages])

  useEffect(() => {
    setItems(posts)
    setPage(1)
  }, [posts])

  const filteredItems = useMemo(() => {
    if (activeFilter === 'All') return items
    const term = FILTER_MAP[activeFilter] ?? activeFilter.toLowerCase()
    return items.filter((p) =>
      p.categories?.some((c) => c.toLowerCase().includes(term))
    )
  }, [items, activeFilter])

  const loadMore = async () => {
    setLoadError(false)
    const nextPage = page + 1
    const limit = pageSize ?? 24
    try {
      const res = await fetch(`/api/news?page=${nextPage}&limit=${limit}`, { cache: 'no-store' })
      if (!res.ok) { setLoadError(true); return }
      const data = await res.json()
      if (!Array.isArray(data.items)) { setLoadError(true); return }
      setItems((prev) => [...prev, ...data.items])
      setPage(nextPage)
    } catch {
      setLoadError(true)
    }
  }

  const [hero, second, third, ...rest] = filteredItems

  return (
    <div>
      {/* Page header */}
      <motion.div
        initial={shouldReduce ? undefined : { opacity: 0, y: -16 }}
        animate={shouldReduce ? undefined : { opacity: 1, y: 0 }}
        className="mb-8"
      >
        <h1 className="text-4xl md:text-5xl font-black tracking-tight">
          Latest <span className="text-[#6F3DFF]">News</span>
        </h1>
        <p className="text-gray-600 text-sm mt-2">Drum &amp; Bass · Neurofunk · Electronic Music</p>
      </motion.div>

      <FilterPills active={activeFilter} onChange={setActiveFilter} />

      {filteredItems.length === 0 ? (
        <div className="text-center py-16 text-gray-600">No articles found.</div>
      ) : (
        <>
          {/* Featured row */}
          {hero && (
            <div className="grid md:grid-cols-[1.7fr_1fr] gap-4 mb-4">
              <HeroCard post={hero} reduce={shouldReduce} />
              <div className="flex flex-col gap-4">
                {second && <SideCard post={second} reduce={shouldReduce} delay={0.1} />}
                {third && <SideCard post={third} reduce={shouldReduce} delay={0.2} />}
              </div>
            </div>
          )}

          {/* Section divider */}
          {rest.length > 0 && (
            <div className="flex items-center gap-4 mb-5 mt-2">
              <span className="text-xs font-bold uppercase tracking-widest text-gray-700 whitespace-nowrap">More News</span>
              <div className="flex-1 h-px bg-white/[0.05]" />
            </div>
          )}

          {/* Grid */}
          {rest.length > 0 && (
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4 mb-4">
              {rest.map((post, i) => (
                <NewsCard key={post.id} post={post} reduce={shouldReduce} index={i} />
              ))}
            </div>
          )}
        </>
      )}

      {hasMore && (
        <div className="flex flex-col items-center gap-2 mt-10">
          <button
            type="button"
            onClick={loadMore}
            className="px-8 py-3 rounded-lg bg-[#111] border border-[#6F3DFF]/25 text-[#a78bfa] text-sm font-semibold hover:bg-[#6F3DFF]/10 hover:border-[#6F3DFF] hover:text-white transition-all duration-200"
          >
            Load more news ↓
          </button>
          {loadError && (
            <p className="text-red-500/70 text-xs">Failed to load — please try again.</p>
          )}
        </div>
      )}
    </div>
  )
}
