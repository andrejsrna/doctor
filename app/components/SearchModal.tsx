'use client'

import { useState, useEffect, useRef } from 'react'
import { searchCatalog, type CatalogSearchResult } from '../lib/catalog-search'
import { motion, AnimatePresence } from 'framer-motion'
import { IoClose } from 'react-icons/io5'
import Link from 'next/link'
import { useRouter } from 'next/navigation'

interface SearchModalProps {
  isOpen: boolean
  onClose: () => void
}

export default function SearchModal({ isOpen, onClose }: SearchModalProps) {
  const [searchQuery, setSearchQuery] = useState('')
  const router = useRouter()
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
      const matches = await searchCatalog(query, 10)
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
      searchPosts(searchQuery)
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
          role="dialog"
          aria-modal="true"
          aria-label="Search catalogue"
          className="fixed inset-0 z-[200] bg-black/90 backdrop-blur-xl"
        >
          <div className="container mx-auto px-4 h-full overflow-y-auto">
            <div className="flex justify-end pt-6">
              <button
                onClick={onClose}
                aria-label="Close search"
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
                {searchError ? (
                  <p role="alert" className="text-center text-red-400">{searchError}</p>
                ) : isLoading ? (
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
                          <h3 className="text-lg font-semibold text-white mt-1">
                            {result.title.rendered}
                          </h3>
                        </div>
                      </Link>
                    ))}
                    
                    {results.length >= 4 && (
                      <button
                        onClick={handleViewAll}
                        className="w-full text-center text-purple-500 hover:text-purple-400 
                          transition-colors py-2 mt-4"
                      >
                        View search results
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