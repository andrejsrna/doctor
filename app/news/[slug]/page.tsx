'use client'

import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { use } from 'react'
import RelatedNews from '../../components/RelatedNews'
import SocialShare from '../../components/SocialShare'
import SubscribeCTA from '../../components/SubscribeCTA'
import DisqusComments from '@/app/components/DisqusComments'

interface NewsPost {
  id: number
  date: string
  title: {
    rendered: string
  }
  content: {
    rendered: string
    protected: boolean
  }
  acf: {
    scsc: string // SoundCloud iframe code
  }
}

interface PageProps {
  params: Promise<{ slug: string }>
}

export default function NewsPostPage({ params }: PageProps) {
  const { slug } = use(params)
  const [post, setPost] = useState<NewsPost | null>(null)
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    const fetchPost = async () => {
      try {
        const response = await fetch(
          `https://dnbdoctor.com/wp-json/wp/v2/news?slug=${slug}`
        )
        const data = await response.json()
        if (data.length > 0) {
          setPost(data[0])
        }
      } catch (error) {
        console.error('Error fetching post:', error)
      } finally {
        setIsLoading(false)
      }
    }

    fetchPost()
  }, [slug])

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
        <div className="animate-pulse text-purple-500">Loading...</div>
      </div>
    )
  }

  if (!post) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-red-500">Post not found</div>
      </div>
    )
  }

  return (
    <section className="py-32 px-4 relative min-h-screen">
      <div className="absolute inset-0 bg-gradient-to-b from-black via-purple-900/10 to-black" />
      
      <article className="max-w-4xl mx-auto relative z-10">
        {/* Header */}
        <motion.header 
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-12"
        >
          <time className="text-purple-500 font-medium">
            {formatDate(post.date)}
          </time>
          <h1 
            className="text-4xl md:text-6xl font-bold mt-4 bg-clip-text text-transparent 
              bg-gradient-to-r from-purple-500 via-pink-500 to-purple-500"
            dangerouslySetInnerHTML={{ __html: post.title.rendered }}
          />
        </motion.header>

        {/* SoundCloud Player */}
        {post.acf?.scsc && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="mb-12 rounded-xl overflow-hidden bg-black/30 border border-white/5 p-6"
          >
            <div 
              className="w-full h-[166px]"
              dangerouslySetInnerHTML={{ __html: post.acf.scsc }}
            />
          </motion.div>
        )}

        {/* Content */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="prose prose-invert prose-purple max-w-none"
          dangerouslySetInnerHTML={{ __html: post.content.rendered }}
        />

        <div className="mt-12">
          <DisqusComments
            url={`https://dnbdoctor.com/news/${slug}`}
            identifier={post.id.toString()}
            title={post.title.rendered}
          />
        </div>

        {/* Add SocialShare at the bottom */}
        <div className="mt-12">
          <SocialShare 
            url={`https://dnbdoctor.com/news/${slug}`}
            title={post.title.rendered}
          />
        </div>

        {/* Add SubscribeCTA */}
        <SubscribeCTA />

        {/* Related News remains at the bottom */}
        {post && <RelatedNews currentPostId={post.id} />}
      </article>
    </section>
  )
} 