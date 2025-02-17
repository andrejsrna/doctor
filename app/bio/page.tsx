'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { motion } from 'framer-motion'

interface Post {
  id: number
  type: string
  date: string
  title: {
    rendered: string
  }
  excerpt?: {
    rendered: string
  }
  slug: string
  acf: {
    url?: string
    thumbnail?: string
  }
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
      const types = ['bio_links', 'posts', 'news']
      const fetchPromises = types.map(type => {
        // Keep the original type name for the API request
        const embedParam = '&_embed'  // Simplified since it's the same for all types
        
        return fetch(`https://admin.dnbdoctor.com/wp-json/wp/v2/${type}?page=${pageNum}&per_page=${postsPerPage}${embedParam}`)
          .then(async res => {
            // Check if the response is ok
            if (!res.ok) {
              // If response is not ok, return empty array instead of throwing
              console.warn(`No data for ${type} on page ${pageNum}`)
              return []
            }
            
            // Store total pages info
            const total = res.headers.get('X-WP-TotalPages')
            if (total && pageNum >= parseInt(total)) {
              setHasMore(false)
            }
            
            const data = await res.json()
            return data
          })
          .then(posts => {
            if (!Array.isArray(posts)) {
              console.warn(`Invalid response for type ${type}:`, posts)
              return []
            }
            // Store the original type without modification
            return posts.map(post => ({
              ...post,
              type: type === 'posts' ? 'post' : type === 'news' ? 'news' : 'bio_link'
            }))
          })
          .catch(error => {
            console.error(`Error fetching ${type}:`, error)
            return []
          })
      })

      const results = await Promise.all(fetchPromises)
      const allPosts = results.flat()

      // Only process if we have posts
      if (allPosts.length > 0) {
        // Sort by date, newest first
        const sortedPosts = allPosts.sort((a, b) => 
          new Date(b.date).getTime() - new Date(a.date).getTime()
        )

        if (pageNum === 1) {
          setPosts(sortedPosts)
        } else {
          setPosts(prev => [...prev, ...sortedPosts])
        }
      } else if (pageNum > 1) {
        // If we got no posts on a page after the first, we've reached the end
        setHasMore(false)
      }
      
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
    console.log('Post type:', post.type, 'Slug:', post.slug) // Add this for debugging

    // If it's a bio link with url, use that
    if (post.type === 'bio_link' && post.acf?.url) {
      return post.acf.url
    }

    // Otherwise use internal routing
    switch (post.type) {
      case 'news':
        return `/news/${post.slug}`
      case 'post':
        return `/music/${post.slug}`
      default:
        console.warn('Unknown post type:', post.type) // Add this for debugging
        return '#'
    }
  }

  const formatDate = (date: string) => {
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
                target={post.type === 'bio_link' ? '_blank' : undefined}
                rel={post.type === 'bio_link' ? 'noopener noreferrer' : undefined}
                className="block"
              >
                <div className="flex flex-col space-y-2">
                  <span className="text-sm text-purple-500 font-medium uppercase">
                    {post.type === 'bio_link' ? 'Link' : post.type === 'post' ? 'Music' : 'News'}
                  </span>
                  <h2 
                    className="text-xl font-semibold text-white"
                    dangerouslySetInnerHTML={{ __html: post.title.rendered }}
                  />
                  {post.excerpt?.rendered && (
                    <div 
                      className="text-gray-400 text-sm"
                      dangerouslySetInnerHTML={{ 
                        __html: post.excerpt.rendered.substring(0, 150) + '...'
                      }}
                    />
                  )}
                  <time className="text-sm text-gray-500">
                    {formatDate(post.date)}
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