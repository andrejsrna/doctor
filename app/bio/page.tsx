'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { motion } from 'framer-motion'

interface Post {
  id: string
  type: 'news' | 'release'
  publishedAt: string | null
  title: string
  slug: string
  coverImageUrl?: string | null
  artistName?: string | null
}

export default function BioLinksPage() {
  const [posts, setPosts] = useState<Post[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [page, setPage] = useState(1)
  const [hasMore, setHasMore] = useState(true)
  const postsPerPage = 30
  const [isBrowser, setIsBrowser] = useState(false)

  const fetchPosts = async (pageNum: number) => {
    try {
      const response = await fetch(`/api/bio?page=${pageNum}&limit=${postsPerPage}`)
      
      if (!response.ok) {
        throw new Error(`Failed to fetch posts: ${response.status}`)
      }
      
      const data = await response.json()
      
      if (pageNum === 1) {
        setPosts(data.items)
      } else {
        setPosts(prev => [...prev, ...data.items])
      }
      
      setHasMore(data.hasMore)
      
    } catch (error) {
      console.error('Error fetching posts:', error)
    } finally {
      setIsLoading(false)
    }
  }

  useEffect(() => {
    fetchPosts(1)
  }, [])

  useEffect(() => {
    setIsBrowser(true)
  }, [])

  const loadMore = () => {
    if (!isLoading && hasMore) {
      setIsLoading(true)
      const nextPage = page + 1
      setPage(nextPage)
      fetchPosts(nextPage)
    }
  }

  const getPostUrl = (post: Post) => {
    switch (post.type) {
      case 'news':
        return `/news/${post.slug}`
      case 'release':
        return `/music/${post.slug}`
      default:
        console.warn('Unknown post type:', post.type)
        return '#'
    }
  }

  const formatDate = (date: string | null) => {
    if (!date) return 'No date'
    return new Date(date).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    })
  }

  // For initial render before hydration
  if (!isBrowser) {
    return null // or loading state
  }

  return (
    <div className="min-h-screen py-32 px-4">
      <div className="max-w-4xl mx-auto">
        <div className="flex justify-center mb-10">
          <Link
            href="https://open.spotify.com/playlist/5VPtC2C3IO8r9oFT3Jzj15"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 rounded-full bg-gradient-to-r from-purple-500 via-pink-500 to-purple-500 px-6 py-3 text-white font-semibold shadow-lg shadow-purple-500/30 transition-transform hover:scale-[1.02]"
          >
            Monthly Neurofunk Selection
            <svg
              className="h-4 w-4"
              viewBox="0 0 24 24"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
              aria-hidden
            >
              <path
                d="M5 12h14m0 0-6-6m6 6-6 6"
                stroke="currentColor"
                strokeWidth={1.5}
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
          </Link>
        </div>
        <h1 className="text-4xl font-bold text-center mb-8 bg-clip-text text-transparent 
          bg-gradient-to-r from-purple-500 via-pink-500 to-purple-500">
          Latest Updates
        </h1>

        <div className="space-y-6">
          {posts.map((post) => (
            <motion.article
              key={`${post.type}-${post.id}`}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="bg-white/5 rounded-lg p-6 hover:bg-white/10 transition-colors"
            >
              <Link 
                href={getPostUrl(post)}
                className="block"
              >
                <div className="flex flex-col space-y-2">
                  <span className="text-sm text-purple-500 font-medium uppercase">
                    {post.type === 'release' ? 'Music' : 'News'}
                  </span>
                  <h2 className="text-xl font-semibold text-white">
                    {post.title}
                  </h2>
                  {post.artistName && (
                    <p className="text-purple-400 text-sm">
                      by {post.artistName}
                    </p>
                  )}
                  <time className="text-sm text-gray-500">
                    {formatDate(post.publishedAt)}
                  </time>
                </div>
              </Link>
            </motion.article>
          ))}
        </div>

        {isLoading && (
          <div className="text-center py-8">
            <div className="animate-pulse text-purple-500">Loading...</div>
          </div>
        )}

        {hasMore && !isLoading && (
          <div className="text-center py-8">
            <button
              onClick={loadMore}
              className="px-6 py-2 bg-purple-500/20 hover:bg-purple-500/30 
                text-purple-300 rounded-full transition-colors"
            >
              Load More
            </button>
          </div>
        )}
      </div>
    </div>
  )
} 
