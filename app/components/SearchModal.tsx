'use client'

import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { IoClose } from 'react-icons/io5'
import Link from 'next/link'
import { useRouter } from 'next/navigation'

interface SearchModalProps {
  isOpen: boolean
  onClose: () => void
}

interface SearchResult {
  id: number
  type: 'post' | 'news' | 'artist'
  title: {
    rendered: string
  }
  excerpt: {
    rendered: string
  }
  slug: string
  date: string
}

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

export default function SearchModal({ isOpen, onClose }: SearchModalProps) {
  const [searchQuery, setSearchQuery] = useState('')
  const [results, setResults] = useState<SearchResult[]>([])
  const [isLoading, setIsLoading] = useState(false)
  const router = useRouter()

  const searchPosts = async (query: string) => {
    if (!query.trim()) {
      setResults([])
      return
    }

    setIsLoading(true)
    try {
      const types = ['posts', 'news', 'artists']
      const searchPromises = types.map(type => 
        fetch(`https://admin.dnbdoctor.com/wp-json/wp/v2/${type}?search=${encodeURIComponent(query)}&per_page=10`)
          .then(res => res.json())
          .then(posts => {
            if (!Array.isArray(posts)) {
              console.warn(`Invalid response for type ${type}:`, posts)
              return []
            }
            return posts.map((post: WPPost) => ({
              ...post,
              type: type.replace(/s$/, '') as 'post' | 'news' | 'artist'
            }))
          })
          .catch(error => {
            console.error(`Error fetching ${type}:`, error)
            return []
          })
      )

      const allResults = await Promise.all(searchPromises)
      const flatResults = allResults.flat()

      // Sort results by relevance
      const sortedResults = flatResults.sort((a, b) => {
        const aTitle = a.title.rendered.toLowerCase()
        const bTitle = b.title.rendered.toLowerCase()
        const searchQuery = query.toLowerCase()

        // Exact matches first
        const aExactMatch = aTitle === searchQuery
        const bExactMatch = bTitle === searchQuery
        if (aExactMatch && !bExactMatch) return -1
        if (!aExactMatch && bExactMatch) return 1

        // Starts with query second
        const aStartsWith = aTitle.startsWith(searchQuery)
        const bStartsWith = bTitle.startsWith(searchQuery)
        if (aStartsWith && !bStartsWith) return -1
        if (!aStartsWith && bStartsWith) return 1

        // Contains query third
        const aContains = aTitle.includes(searchQuery)
        const bContains = bTitle.includes(searchQuery)
        if (aContains && !bContains) return -1
        if (!aContains && bContains) return 1

        // Sort by date if relevance is equal
        return new Date(b.date).getTime() - new Date(a.date).getTime()
      })

      setResults(sortedResults)
    } catch (error) {
      console.error('Search error:', error)
      setResults([])
    } finally {
      setIsLoading(false)
    }
  }

  useEffect(() => {
    const debounceTimer = setTimeout(() => {
      if (searchQuery) {
        searchPosts(searchQuery)
      }
    }, 300)

    return () => clearTimeout(debounceTimer)
  }, [searchQuery])

  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose()
    }

    if (typeof window !== 'undefined') {
      window.addEventListener('keydown', handleEscape)
      return () => window.removeEventListener('keydown', handleEscape)
    }
  }, [onClose])

  const getPostUrl = (result: SearchResult) => {
    switch (result.type) {
      case 'news':
        return `/news/${result.slug}`
      case 'artist':
        return `/artists/${result.slug}`
      default:
        return `/music/${result.slug}`
    }
  }

  const handleViewAll = () => {
    router.push(`/search?q=${encodeURIComponent(searchQuery)}`)
    onClose()
  }

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-[200] bg-black/90 backdrop-blur-xl"
        >
          <div className="container mx-auto px-4 h-full overflow-y-auto">
            <div className="flex justify-end pt-6">
              <button
                onClick={onClose}
                className="text-gray-400 hover:text-white transition-colors"
              >
                <IoClose size={24} />
              </button>
            </div>
            
            <div className="max-w-3xl mx-auto mt-8">
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search for music, artists, news..."
                className="w-full bg-white/10 border border-purple-500/30 rounded-lg px-4 py-3 
                  text-white placeholder-gray-400 focus:outline-none focus:border-purple-500
                  transition-colors"
                autoFocus
              />
              
              <div className="mt-8">
                {isLoading ? (
                  <div className="text-center text-gray-400">
                    Searching...
                  </div>
                ) : results.length > 0 ? (
                  <div className="space-y-4">
                    {results.slice(0, 4).map((result) => (
                      <Link
                        key={`${result.type}-${result.id}`}
                        href={getPostUrl(result)}
                        onClick={onClose}
                      >
                        <div className="bg-white/5 rounded-lg p-4 hover:bg-white/10 transition-colors">
                          <span className="text-sm text-purple-500 font-medium uppercase">
                            {result.type}
                          </span>
                          <h3 
                            className="text-lg font-semibold text-white mt-1"
                            dangerouslySetInnerHTML={{ __html: result.title.rendered }}
                          />
                        </div>
                      </Link>
                    ))}
                    
                    {results.length >= 4 && (
                      <button
                        onClick={handleViewAll}
                        className="w-full text-center text-purple-500 hover:text-purple-400 
                          transition-colors py-2 mt-4"
                      >
                        View all {results.length} results
                      </button>
                    )}
                  </div>
                ) : searchQuery && (
                  <div className="text-center text-gray-400">
                    No results found for &quot;{searchQuery}&quot;
                  </div>
                )}
              </div>
            </div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  )
} 