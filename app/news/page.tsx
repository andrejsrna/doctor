'use client'

import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { FaNewspaper, FaArrowRight, FaSpinner, FaCalendarAlt } from 'react-icons/fa'
import Button from '../components/Button'

interface NewsPost {
  id: number
  date: string
  slug: string
  title: {
    rendered: string
  }
  content: {
    rendered: string
    protected: boolean
  }
  acf: {
    scsc: string
  }
}

export default function NewsPage() {
  const [posts, setPosts] = useState<NewsPost[]>([])
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    fetchPosts()
  }, [])

  const fetchPosts = async () => {
    try {
      const response = await fetch('https://admin.dnbdoctor.com/wp-json/wp/v2/news')
      const data = await response.json()
      setPosts(data)
    } catch (error) {
      console.error('Error fetching posts:', error)
    } finally {
      setIsLoading(false)
    }
  }

  const formatDate = (date: string) => {
    return new Date(date).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    })
  }

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <motion.div 
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="flex items-center gap-3 text-purple-500"
        >
          <FaSpinner className="w-6 h-6 animate-spin" />
          <span className="text-lg">Infecting news feed...</span>
        </motion.div>
      </div>
    )
  }

  return (
    <section className="py-32 px-4 relative min-h-screen">
      {/* Background with animated gradient */}
      <div className="absolute inset-0">
        <div className="absolute inset-0 bg-gradient-to-b from-black via-purple-900/10 to-black" />
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,_var(--tw-gradient-stops))] from-purple-900/20 via-transparent to-transparent animate-pulse" />
      </div>
      
      <div className="max-w-7xl mx-auto relative z-10">
        <motion.div 
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-16"
        >
          <div className="inline-block p-4 bg-purple-500/20 rounded-full mb-6 backdrop-blur-sm">
            <FaNewspaper className="w-12 h-12 text-purple-500" />
          </div>
          <h1 className="text-4xl md:text-6xl font-bold bg-clip-text text-transparent 
            bg-gradient-to-r from-purple-500 via-pink-500 to-purple-500">
            Latest News
          </h1>
        </motion.div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
          {posts.map((post, index) => (
            <motion.article
              key={post.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
              className="group bg-black/30 border border-purple-500/20 rounded-xl overflow-hidden 
                hover:border-purple-500/40 transition-all duration-300 backdrop-blur-sm
                hover:shadow-[0_0_15px_rgba(168,85,247,0.15)]"
            >
              <div className="p-6">
                <div className="flex items-center gap-2 text-sm text-purple-500">
                  <FaCalendarAlt className="w-4 h-4" />
                  <time>{formatDate(post.date)}</time>
                </div>
                
                <h2 
                  className="text-xl font-bold mt-2 mb-4 bg-clip-text text-transparent 
                    bg-gradient-to-r from-white to-gray-300 group-hover:from-purple-500 
                    group-hover:to-pink-500 transition-all duration-300"
                  dangerouslySetInnerHTML={{ __html: post.title.rendered }}
                />

                <motion.div whileHover={{ scale: 1.02 }} className="inline-block">
                  <Button
                    href={`/news/${post.slug}`}
                    variant="infected"
                    className="group"
                  >
                    <span>Read More</span>
                    <FaArrowRight className="w-4 h-4 ml-2 transform group-hover:translate-x-1 transition-transform duration-300" />
                  </Button>
                </motion.div>
              </div>
            </motion.article>
          ))}
        </div>

        {posts.length === 0 && !isLoading && (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="text-center py-12 px-6 rounded-lg border border-purple-500/30 
              bg-purple-500/5 backdrop-blur-sm mt-8"
          >
            <p className="text-gray-400">No news articles found</p>
          </motion.div>
        )}
      </div>
    </section>
  )
} 