'use client'

import MoreFromArtist from '@/app/components/MoreFromArtist'
import { motion } from 'framer-motion'
import parse, { DOMNode, domToReact, Element } from 'html-react-parser'
import Image from 'next/image'
import { use, useEffect, useState } from 'react'
import RelatedNews from '../../components/RelatedNews'
import SocialShare from '../../components/SocialShare'
import EngagementCTA from '../../components/EngagementCTA'

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
    artist: number
  }
  meta: {
    _related_artist: string
  }
  _embedded?: {
    'wp:featuredmedia'?: [{
      source_url: string
      media_details?: {
        sizes?: {
          full?: {
            source_url: string
          }
        }
      }
    }]
  }
  related_artist: string
}

interface PageProps {
  params: Promise<{ slug: string }>
}

export default function NewsPostPage({ params }: PageProps) {
  const { slug } = use(params)
  const [post, setPost] = useState<NewsPost | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [artistName, setArtistName] = useState<string>('')

  const fetchArtistName = async (artistId: number) => {
    try {
      const response = await fetch(
        `https://admin.dnbdoctor.com/wp-json/wp/v2/artists/${artistId}`
      )
      const data = await response.json()
      return data.title.rendered
    } catch (error) {
      console.error('Error fetching artist:', error)
      return ''
    }
  }

  useEffect(() => {
    const fetchPost = async () => {
      try {
        const response = await fetch(
          `https://admin.dnbdoctor.com/wp-json/wp/v2/news?slug=${slug}&_embed`
        )
        const data = await response.json()
        if (data.length > 0) {
          console.log('Post data:', data[0])
          setPost(data[0])
          if (data[0].acf?.artist) {
            const name = await fetchArtistName(data[0].acf.artist)
            setArtistName(name)
          }
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

  const getImageUrl = () => {
    const media = post?._embedded?.['wp:featuredmedia']?.[0]
    return media?.source_url || media?.media_details?.sizes?.full?.source_url
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

      {getImageUrl() && (
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          className="relative w-full max-w-4xl mx-auto mb-12 aspect-[21/9] rounded-2xl overflow-hidden"
        >
          <Image
            src={getImageUrl()!}
            alt={post?.title.rendered || ''}
            fill
            className="object-cover"
            priority
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/30 to-transparent" />
        </motion.div>
      )}

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

        {/* Content using html-react-parser */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="prose prose-invert prose-purple max-w-none"
        >
          {parse(post.content.rendered || '', {
            replace: (domNode) => {
              if (domNode instanceof Element && domNode.name === 'img' && domNode.attribs) {
                const { src, alt, width, height } = domNode.attribs;

                // Basic validation
                if (!src || !width || !height) {
                  // Optionally return null or a placeholder if essential attributes are missing
                  return <></>;
                }

                // Convert width/height to numbers
                const imgWidth = parseInt(width, 10);
                const imgHeight = parseInt(height, 10);

                if (isNaN(imgWidth) || isNaN(imgHeight)) {
                   return <></>; // Skip if width/height are not valid numbers
                }

                return (
                  <div className="my-6"> {/* Add margin around the image container */}
                    <Image
                      src={src}
                      alt={alt || 'Post image'} // Provide default alt text
                      width={imgWidth}
                      height={imgHeight}
                      className="rounded-lg shadow-md w-full h-auto" // Ensure image is responsive and styled
                      priority // Add priority prop to disable lazy loading
                      // Add sizes attribute if needed for further optimization,
                      // but Next.js handles basic responsiveness well with width/height
                    />
                  </div>
                );
              } else if (domNode instanceof Element && domNode.name === 'figure') {
                // Handle figure elements: render its children using domToReact
                // Cast children to DOMNode[] to satisfy parser types
                // No need for nested replace here as the main replace handles the img inside
                return <>{domToReact(domNode.children as DOMNode[])}</>;
              }
              // Keep default rendering for other elements (return undefined or null)
              // Return undefined to let the parser handle the node default way
              return undefined;
            }
          })}
        </motion.div>

        <div className="h-12" />

          <SocialShare
            url={`https://dnbdoctor.com/news/${slug}`}
            title={post.title.rendered}
          />

        {artistName && artistName !== '' && (
          <MoreFromArtist
            artistName={artistName}
            currentPostId={post.id}
          />
        )}

        <div className="h-12" />

        {/* Add EngagementCTA */}
        <EngagementCTA />

        {/* Related News remains at the bottom */}
        {post && <RelatedNews currentPostId={post.id} />}
      </article>
    </section>
  )
}
