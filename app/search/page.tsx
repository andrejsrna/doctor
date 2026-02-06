'use client'

import { useState, useEffect, Suspense } from 'react'
import Link from 'next/link'
import { motion } from 'framer-motion'
import { useSearchParams } from 'next/navigation'

interface SearchResult {
  id: number
  type: 'post' | 'news' | 'artists'
  title: {
    rendered: string
  }
  excerpt: {
    rendered: string
  }
  slug: string
  date: string
}

// Add interface for WordPress post response
interface WPPost {
  id: number
  title: {
    rendered: string
  }
  excerpt: {
    rendered: string
  }
  slug: string
  date: string
}

function SearchContent() {
  const searchParams = useSearchParams()
  const urlQuery = searchParams?.get('q') ?? ''
  const [query, setQuery] = useState(urlQuery)
  const [results, setResults] = useState<SearchResult[]>([])
  const [isLoading, setIsLoading] = useState(false)

  const searchPosts = async (searchQuery: string) => {
    if (!searchQuery.trim()) {
      setResults([])
      return
    }

    setIsLoading(true)
    try {
      const types = ['posts', 'news', 'artists']
      const searchPromises = types.map(type => 
        fetch(`https://admin.dnbdoctor.com/wp-json/wp/v2/${type}?search=${encodeURIComponent(searchQuery)}&per_page=100`)
          .then(res => res.json())
          .then(posts => {
            if (!Array.isArray(posts)) {
              console.warn(`Invalid response for type ${type}:`, posts)
              return []
            }
            return posts.map((post: WPPost) => ({
              ...post,
              type: type.replace(/s$/, '') as 'post' | 'news' | 'artists'
            }))
          })
          .catch(error => {
            console.error(`Error fetching ${type}:`, error)
            return []
          })
      )

      const allResults = await Promise.all(searchPromises)
      const flattenedResults = allResults.flat()

      // Sort results by relevance
      const sortedResults = flattenedResults.sort((a, b) => {
        const aTitle = a.title.rendered.toLowerCase()
        const bTitle = b.title.rendered.toLowerCase()
        const query = searchQuery.toLowerCase()

        // Exact matches first
        const aExactMatch = aTitle === query
        const bExactMatch = bTitle === query
        if (aExactMatch && !bExactMatch) return -1
        if (!aExactMatch && bExactMatch) return 1

        // Starts with query second
        const aStartsWith = aTitle.startsWith(query)
        const bStartsWith = bTitle.startsWith(query)
        if (aStartsWith && !bStartsWith) return -1
        if (!aStartsWith && bStartsWith) return 1

        // Contains query third
        const aContains = aTitle.includes(query)
        const bContains = bTitle.includes(query)
        if (aContains && !bContains) return -1
        if (!aContains && bContains) return 1

        // Sort by date if relevance is equal
        return new Date(b.date).getTime() - new Date(a.date).getTime()
      })

      setResults(sortedResults as SearchResult[])
    } catch (error) {
      console.error('Search error:', error)
      setResults([])
    } finally {
      setIsLoading(false)
    }
  }

  useEffect(() => {
    const debounceTimer = setTimeout(() => {
      searchPosts(query)
    }, 300)

    return () => clearTimeout(debounceTimer)
  }, [query])

  useEffect(() => {
    setQuery(urlQuery)
  }, [urlQuery])

  const formatDate = (date: string) => {
    return new Date(date).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    })
  }

  const getPostUrl = (result: SearchResult) => {
    switch (result.type) {
      case 'news':
        return `/news/${result.slug}`
      case 'artists':
        return `/artists/${result.slug}`
      default:
        return `/music/${result.slug}`
    }
  }

  return (
    <div className="min-h-screen py-32 px-4">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-4xl font-bold text-center mb-8 bg-clip-text text-transparent 
          bg-gradient-to-r from-purple-500 via-pink-500 to-purple-500">
          Search
        </h1>

        <div className="mb-8">
          <input
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search for music, artists, news..."
            className="w-full bg-white/10 border border-purple-500/30 rounded-lg px-4 py-3 
              text-white placeholder-gray-400 focus:outline-none focus:border-purple-500
              transition-colors"
            autoFocus
          />
        </div>

        {isLoading ? (
          <div className="text-center text-gray-400">
            Searching...
          </div>
        ) : results.length > 0 ? (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="space-y-6"
          >
            {results.map((result) => (
              <motion.article
                key={`${result.type}-${result.id}`}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="bg-white/5 rounded-lg p-6 hover:bg-white/10 transition-colors"
              >
                <Link href={getPostUrl(result)}>
                  <div className="flex flex-col space-y-2">
                    <span className="text-sm text-purple-500 font-medium uppercase">
                      {result.type}
                    </span>
                    <h2 
                      className="text-xl font-semibold text-white"
                      dangerouslySetInnerHTML={{ __html: result.title.rendered }}
                    />
                    {result.excerpt?.rendered && (
                      <div 
                        className="text-gray-400 text-sm"
                        dangerouslySetInnerHTML={{ 
                          __html: result.excerpt.rendered.substring(0, 150) + '...'
                        }}
                      />
                    )}
                    <time className="text-sm text-gray-500">
                      {formatDate(result.date)}
                    </time>
                  </div>
                </Link>
              </motion.article>
            ))}
          </motion.div>
        ) : query && (
          <div className="text-center text-gray-400">
            No results found for &quot;{query}&quot;
          </div>
        )}
      </div>
    </div>
  )
}

export default function SearchPage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-pulse text-purple-500">Loading...</div>
      </div>
    }>
      <SearchContent />
    </Suspense>
  )
} 
