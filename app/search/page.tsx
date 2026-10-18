'use client'

import { useState, useEffect, useRef, Suspense } from 'react'
import { searchCatalog, type CatalogSearchResult } from '../lib/catalog-search'
import Link from 'next/link'
import { motion } from 'framer-motion'
import { useSearchParams } from 'next/navigation'

function SearchContent() {
  const searchParams = useSearchParams()
  const urlQuery = searchParams?.get('q') ?? ''
  const [query, setQuery] = useState(urlQuery)
  const [results, setResults] = useState<CatalogSearchResult[]>([])
  const [isLoading, setIsLoading] = useState(false)
  const [searchError, setSearchError] = useState('')
  const requestId = useRef(0)

  const searchPosts = async (query: string) => {
    const currentRequest = ++requestId.current
    setSearchError('')
    if (!query.trim()) {
      setResults([])
      setIsLoading(false)
      return
    }
    setIsLoading(true)
    try {
      const matches = await searchCatalog(query, 100)
      if (currentRequest === requestId.current) setResults(matches)
    } catch {
      if (currentRequest === requestId.current) {
        setResults([])
        setSearchError('Search is unavailable. Please try again.')
      }
    } finally {
      if (currentRequest === requestId.current) setIsLoading(false)
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

  const getPostUrl = (result: CatalogSearchResult) => {
    switch (result.type) {
      case 'news':
        return `/news/${result.slug}`
      case 'artist':
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

        {searchError ? (
          <p role="alert" className="text-center text-red-400">{searchError}</p>
        ) : isLoading ? (
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
                    <h2 className="text-xl font-semibold text-white">
                      {result.title.rendered}
                    </h2>
                    {result.excerpt?.rendered && (
                      <div 
                        className="text-gray-400 text-sm"
                        dangerouslySetInnerHTML={{ 
                          __html: result.excerpt.rendered.substring(0, 150) + '...'
                        }}
                      />
                    )}
                    <time className="text-sm text-gray-500">
                      {result.date ? formatDate(result.date) : ''}
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
