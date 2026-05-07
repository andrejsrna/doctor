# News Page Redesign Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Rewrite the news listing page from a plain card grid into an editorial magazine layout with a hero featured article, two side cards, filter pills, and a cover-image grid.

**Architecture:** All changes are isolated to `app/news/NewsListAnimated.tsx`. The file is rewritten with four inline sub-components (`FilterPills`, `HeroCard`, `SideCard`, `NewsCard`) plus a category badge helper. `page.tsx` and `NewsListClient.tsx` are untouched. No API or schema changes needed.

**Tech Stack:** Next.js 16, React 19, Framer Motion 12, Tailwind CSS v4, TypeScript

---

## File Map

| Action | File | Responsibility |
|--------|------|----------------|
| Rewrite | `app/news/NewsListAnimated.tsx` | All UI — badge helper, filter pills, hero card, side cards, news grid, load more |
| Unchanged | `app/news/page.tsx` | Server data fetching — no changes |
| Unchanged | `app/news/NewsListClient.tsx` | Dynamic import wrapper — no changes |

---

## Task 1: Badge helper + FilterPills

**Files:**
- Modify: `app/news/NewsListAnimated.tsx` (full rewrite starts here)

- [ ] **Step 1: Replace the entire file with the new skeleton + badge helper + FilterPills**

Open `app/news/NewsListAnimated.tsx` and replace all contents with:

```tsx
"use client"

import Image from 'next/image'
import Link from 'next/link'
import { motion, useReducedMotion } from 'framer-motion'
import { useEffect, useMemo, useState } from 'react'

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

// Placeholder — remaining components added in next tasks
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
  const totalPages = initialTotalPages ?? 1
  const hasMore = useMemo(() => page < totalPages, [page, totalPages])

  useEffect(() => {
    setItems(posts)
    setPage(1)
  }, [posts])

  const filteredItems = useMemo(() => {
    if (activeFilter === 'All') return items
    return items.filter((p) =>
      p.categories?.some((c) =>
        c.toLowerCase().includes(activeFilter.toLowerCase().replace(/s$/, ''))
      )
    )
  }, [items, activeFilter])

  const loadMore = async () => {
    const nextPage = page + 1
    const limit = pageSize ?? 24
    const res = await fetch(`/api/news?page=${nextPage}&limit=${limit}`, { cache: 'no-store' })
    const data = await res.json()
    setItems((prev) => [...prev, ...data.items])
    setPage(nextPage)
  }

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

      <p className="text-gray-500 text-sm">
        {filteredItems.length} articles
        {/* remaining layout added in next tasks */}
      </p>
    </div>
  )
}
```

- [ ] **Step 2: Verify TypeScript compiles**

```bash
cd /Users/andrejsrna/Documents/web/dnbdoctor && npx tsc --noEmit 2>&1 | head -30
```

Expected: no errors related to `NewsListAnimated.tsx`.

- [ ] **Step 3: Commit**

```bash
cd /Users/andrejsrna/Documents/web/dnbdoctor
git add app/news/NewsListAnimated.tsx
git commit -m "feat(news): add badge helper and filter pills skeleton"
```

---

## Task 2: HeroCard component

**Files:**
- Modify: `app/news/NewsListAnimated.tsx` — add `HeroCard` above the `export default`

- [ ] **Step 1: Add CoverImage helper and HeroCard component**

Insert the following block directly before the `export default function NewsListAnimated` line:

```tsx
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
  const badgeVariant = getBadgeVariant(post.categories)
  const label = post.categories?.[0] ?? 'News'

  return (
    <motion.article
      initial={reduce ? undefined : { opacity: 0, y: -10 }}
      animate={reduce ? undefined : { opacity: 1, y: 0 }}
      transition={reduce ? undefined : { duration: 0.4 }}
      className="relative rounded-2xl overflow-hidden group cursor-pointer"
    >
      <Link href={`/news/${post.slug}`} className="block">
        <div className="relative h-[340px]">
          <CoverImage src={post.coverImageUrl} alt={post.title} fill className="transition-transform duration-500 group-hover:scale-105" />
          <div className="absolute inset-0 bg-gradient-to-t from-[#040410] via-[#040410]/50 to-transparent" />
        </div>
        <div className="absolute bottom-0 left-0 right-0 p-7">
          <Badge label="Featured" variant="featured" />
          <h2
            className="text-xl md:text-2xl font-extrabold text-white mt-2.5 leading-snug tracking-tight"
            dangerouslySetInnerHTML={{ __html: post.title }}
          />
          <div className="flex items-center gap-3 mt-3">
            <time className="text-gray-500 text-xs">{formatDate(post.publishedAt)}</time>
            <span className="text-[#6F3DFF] text-xs font-semibold group-hover:text-[#a78bfa] transition-colors">Read more →</span>
          </div>
        </div>
      </Link>
    </motion.article>
  )
}
```

- [ ] **Step 2: Verify TypeScript compiles**

```bash
cd /Users/andrejsrna/Documents/web/dnbdoctor && npx tsc --noEmit 2>&1 | head -30
```

Expected: no new errors.

- [ ] **Step 3: Commit**

```bash
cd /Users/andrejsrna/Documents/web/dnbdoctor
git add app/news/NewsListAnimated.tsx
git commit -m "feat(news): add HeroCard and CoverImage components"
```

---

## Task 3: SideCard and NewsCard components

**Files:**
- Modify: `app/news/NewsListAnimated.tsx` — add `SideCard` and `NewsCard` above `export default`

- [ ] **Step 1: Add SideCard component**

Insert after the `HeroCard` function, before `export default`:

```tsx
function SideCard({ post, reduce, delay }: { post: NewsItem; reduce: boolean | null; delay: number }) {
  const variant = getBadgeVariant(post.categories)
  const label = post.categories?.[0] ?? 'News'

  return (
    <motion.article
      initial={reduce ? undefined : { opacity: 0, x: 16 }}
      animate={reduce ? undefined : { opacity: 1, x: 0 }}
      transition={reduce ? undefined : { duration: 0.35, delay }}
      className="flex flex-col bg-[#0d0d1a] border border-white/[0.04] rounded-xl overflow-hidden hover:border-[#6F3DFF]/25 hover:-translate-y-0.5 transition-all duration-200 cursor-pointer"
    >
      <Link href={`/news/${post.slug}`} className="flex flex-col flex-1">
        <div className="relative h-[100px] flex-shrink-0">
          <CoverImage src={post.coverImageUrl} alt={post.title} fill />
        </div>
        <div className="p-4 flex flex-col flex-1">
          <Badge label={label} variant={variant} />
          <h3
            className="text-sm font-bold text-gray-100 mt-2 leading-snug flex-1"
            dangerouslySetInnerHTML={{ __html: post.title }}
          />
          <time className="text-gray-600 text-[11px] mt-2">{formatDate(post.publishedAt)}</time>
        </div>
      </Link>
    </motion.article>
  )
}
```

- [ ] **Step 2: Add NewsCard component**

Insert after `SideCard`, before `export default`:

```tsx
function NewsCard({ post, reduce, index }: { post: NewsItem; reduce: boolean | null; index: number }) {
  const variant = getBadgeVariant(post.categories)
  const label = post.categories?.[0] ?? 'News'

  return (
    <motion.article
      initial={reduce ? undefined : { opacity: 0, y: 20 }}
      whileInView={reduce ? undefined : { opacity: 1, y: 0 }}
      viewport={reduce ? undefined : { once: true }}
      transition={reduce ? undefined : { delay: index * 0.04 }}
      className="bg-[#0d0d1a] border border-white/[0.04] rounded-xl overflow-hidden hover:border-[#6F3DFF]/25 hover:shadow-[0_0_20px_rgba(111,61,255,0.08)] transition-all duration-200 cursor-pointer"
    >
      <Link href={`/news/${post.slug}`} className="block">
        <div className="relative h-[160px]">
          <CoverImage src={post.coverImageUrl} alt={post.title} fill />
        </div>
        <div className="p-4">
          <Badge label={label} variant={variant} />
          <h3
            className="text-sm font-bold text-gray-100 mt-2 mb-2 leading-snug"
            dangerouslySetInnerHTML={{ __html: post.title }}
          />
          <time className="text-gray-600 text-[11px]">{formatDate(post.publishedAt)}</time>
        </div>
      </Link>
    </motion.article>
  )
}
```

- [ ] **Step 3: Verify TypeScript compiles**

```bash
cd /Users/andrejsrna/Documents/web/dnbdoctor && npx tsc --noEmit 2>&1 | head -30
```

Expected: no new errors.

- [ ] **Step 4: Commit**

```bash
cd /Users/andrejsrna/Documents/web/dnbdoctor
git add app/news/NewsListAnimated.tsx
git commit -m "feat(news): add SideCard and NewsCard components"
```

---

## Task 4: Wire up the magazine layout in the main component

**Files:**
- Modify: `app/news/NewsListAnimated.tsx` — replace the `return` body in `export default NewsListAnimated`

- [ ] **Step 1: Replace the return statement inside `NewsListAnimated`**

Find the `return (` block inside `export default function NewsListAnimated` and replace it entirely with:

```tsx
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

      {filteredItems.length === 0 && (
        <div className="text-center py-16 text-gray-600">No articles found.</div>
      )}

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

      {hasMore && (
        <div className="flex justify-center mt-10">
          <button
            onClick={loadMore}
            className="px-8 py-3 rounded-lg bg-[#111] border border-[#6F3DFF]/25 text-[#a78bfa] text-sm font-semibold hover:bg-[#6F3DFF]/10 hover:border-[#6F3DFF] hover:text-white transition-all duration-200"
          >
            Load more news ↓
          </button>
        </div>
      )}
    </div>
  )
```

Also remove the now-unused line `const hasMore = useMemo(...)` near the top — it's already defined; make sure it's not duplicated. The `filteredItems` destructuring `const [hero, second, third, ...rest] = filteredItems` goes right before the `return`.

- [ ] **Step 2: Verify TypeScript compiles**

```bash
cd /Users/andrejsrna/Documents/web/dnbdoctor && npx tsc --noEmit 2>&1 | head -40
```

Expected: no errors.

- [ ] **Step 3: Run the dev server and visually verify**

```bash
cd /Users/andrejsrna/Documents/web/dnbdoctor && npm run dev
```

Open http://localhost:3000/news and confirm:
- Hero card visible at top left, 2 side cards on the right
- Filter pills row visible above
- "More News" divider then 3-column grid below
- Cover images show (or placeholder gradient if null)
- "Load more" button appears if there are more pages

- [ ] **Step 4: Commit**

```bash
cd /Users/andrejsrna/Documents/web/dnbdoctor
git add app/news/NewsListAnimated.tsx
git commit -m "feat(news): wire magazine layout — hero, side cards, grid, filter pills"
```

---

## Task 5: Build verification

**Files:** none changed

- [ ] **Step 1: Run full production build**

```bash
cd /Users/andrejsrna/Documents/web/dnbdoctor && npm run build 2>&1 | tail -30
```

Expected: `✓ Compiled successfully` with no errors in `app/news`.

- [ ] **Step 2: If build passes, done. If it fails, fix errors and re-run.**

Common issues:
- `Image` with `fill` requires the parent to have `position: relative` and an explicit height — all covered in the code above.
- `dangerouslySetInnerHTML` on an `<h2>` or `<h3>` requires the element to have no children — already handled.

- [ ] **Step 3: Final commit if any fixes were made**

```bash
cd /Users/andrejsrna/Documents/web/dnbdoctor
git add app/news/NewsListAnimated.tsx
git commit -m "fix(news): resolve build errors in magazine layout"
```
