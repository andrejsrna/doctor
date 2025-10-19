
import { prisma } from '@/lib/prisma'
import { notFound } from 'next/navigation'
import MoreFromArtist from '@/app/components/MoreFromArtist'
import parse, { DOMNode, domToReact, Element } from 'html-react-parser'
import Image from 'next/image'
import RelatedNews from '../../components/RelatedNews'
import SocialShare from '../../components/SocialShare'
import EngagementCTA from '../../components/EngagementCTA'
import { sanitizeHtml } from '@/lib/sanitize'
import type { Metadata } from 'next'

interface PageProps { params: Promise<{ slug: string }> }

export const revalidate = 300

export default async function NewsPostPage({ params }: PageProps) {
  const { slug } = await params
  const post = await prisma.news.findUnique({ where: { slug } })
  if (!post) return notFound()
  const artistName = post.relatedArtistName || ''

  const formatDate = (date: string | Date) => {
    const d = typeof date === 'string' ? new Date(date) : date
    return d.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    })
  }

  const getImageUrl = () => post?.coverImageUrl || undefined

  return (
    <section className="py-32 px-4 relative min-h-screen">
      <div className="absolute inset-0 bg-gradient-to-b from-black via-purple-900/10 to-black" />

      {getImageUrl() && (
        <div className="relative w-full max-w-4xl mx-auto mb-12 aspect-[21/9] rounded-2xl overflow-hidden">
          <Image
            src={getImageUrl()!}
            alt={post?.title || ''}
            fill
            sizes="(max-width: 768px) 100vw, 800px"
            className="object-cover"
            priority
            fetchPriority="high"
            placeholder="blur"
            blurDataURL="data:image/gif;base64,R0lGODlhAQABAIAAAAAAAP///ywAAAAAAQABAAACAUwAOw=="
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/30 to-transparent" />
        </div>
      )}

      <article className="max-w-4xl mx-auto relative z-10">
        <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify({
          '@context': 'https://schema.org',
          '@type': 'NewsArticle',
          headline: sanitizeHtml(post.title).replace(/<[^>]*>/g, ''),
          description: sanitizeHtml((post.content || '').replace(/<[^>]*>/g, '')).slice(0, 200),
          datePublished: post.publishedAt ? post.publishedAt.toISOString() : undefined,
          dateModified: post.updatedAt ? post.updatedAt.toISOString() : undefined,
          image: post.coverImageUrl ? [{
            '@type': 'ImageObject',
            url: post.coverImageUrl,
            width: 1200,
            height: 630,
          }] : undefined,
          author: {
            '@type': post.relatedArtistName ? 'Person' : 'Organization',
            name: post.relatedArtistName || 'DnB Doctor',
            ...(post.relatedArtistName && { url: `https://dnbdoctor.com/artists/${post.relatedArtistName.toLowerCase().replace(/\s+/g, '-')}` }),
          },
          publisher: {
            '@type': 'Organization',
            name: 'DnB Doctor',
            url: 'https://dnbdoctor.com',
            logo: {
              '@type': 'ImageObject',
              url: 'https://dnbdoctor.com/logo.png',
              width: 600,
              height: 60,
            },
          },
          mainEntityOfPage: {
            '@type': 'WebPage',
            '@id': `https://dnbdoctor.com/news/${slug}`,
          },
          articleSection: 'Music News',
          keywords: ['Drum and Bass', 'Neurofunk', 'DnB', 'Electronic Music', post.relatedArtistName].filter(Boolean).join(', '),
        }) }} />
        {/* Header */}
        <header className="text-center mb-12">
          <time className="text-purple-500 font-medium">
            {formatDate(post.publishedAt || '')}
          </time>
          <h1
            className="text-4xl md:text-6xl font-bold mt-4 bg-clip-text text-transparent
              bg-gradient-to-r from-purple-500 via-pink-500 to-purple-500"
             dangerouslySetInnerHTML={{ __html: sanitizeHtml(post.title) }}
          />
        </header>

        {/* SoundCloud Player */}
        {post.scsc && (
          <div className="mb-12 rounded-xl overflow-hidden bg-black/30 border border-white/5 p-6">
            <div
              className="w-full h-[166px]"
              dangerouslySetInnerHTML={{ __html: post.scsc }}
            />
          </div>
        )}

        {/* Content using html-react-parser */}
        <div className="prose prose-invert prose-purple max-w-none prose-headings:font-bold prose-h1:text-4xl prose-h2:text-3xl prose-h3:text-2xl prose-p:text-gray-300 prose-a:text-purple-400 hover:prose-a:text-pink-400">
          {parse(post.content || '', {
            replace: (domNode) => {
              if (domNode instanceof Element && domNode.name === 'img' && domNode.attribs) {
                const { src, alt, width, height } = domNode.attribs;

                // Basic validation
                if (!src || !width || !height) {
                  // Optionally return null or a placeholder if essential attributes are missing
                  return <></>;
                }

                // Convert width/height to numbers
                const imgWidth = parseInt(String(width || '0'), 10);
                const imgHeight = parseInt(String(height || '0'), 10);

                if (isNaN(imgWidth) || isNaN(imgHeight)) {
                   return <></>; // Skip if width/height are not valid numbers
                }

                 return (
                  <div className="my-6">
                    <Image
                      src={src}
                      alt={alt || 'Post image'}
                      width={imgWidth}
                      height={imgHeight}
                      className="rounded-lg shadow-md w-full h-auto"
                      sizes="(max-width: 1024px) 100vw, 800px"
                    />
                  </div>
                );
              } else if (domNode instanceof Element && domNode.name === 'figure') {
                // Handle figure elements: render its children using domToReact
                // Cast children to DOMNode[] to satisfy parser types
                // No need for nested replace here as the main replace handles the img inside
                return <>{domToReact(domNode.children as DOMNode[])}</>;
              } else if (domNode instanceof Element && ['h1','h2','h3'].includes(domNode.name)) {
                const level = domNode.name
                const cls = level === 'h1' ? 'text-4xl font-bold mt-6 mb-3'
                  : level === 'h2' ? 'text-3xl font-bold mt-5 mb-3'
                  : 'text-2xl font-bold mt-4 mb-2'
                return (
                  <div className={cls}>
                    {domToReact(domNode.children as DOMNode[])}
                  </div>
                )
              }
              // Keep default rendering for other elements (return undefined or null)
              // Return undefined to let the parser handle the node default way
              return undefined;
            }
          })}
        </div>

        <div className="h-12" />

          <SocialShare
            url={`https://dnbdoctor.com/news/${slug}`}
            title={post.title}
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

        {post && (
          <RelatedNews currentPostId={post.wpId || 0} relatedBy={post.relatedArtistName || post.title} />
        )}
      </article>
    </section>
  )
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { slug } = await params
  const post = await prisma.news.findUnique({ where: { slug } })
  if (!post) return {}
  const plainTitle = sanitizeHtml(post.title).replace(/<[^>]*>/g, '')
  const description = sanitizeHtml((post.content || '').replace(/<[^>]*>/g, '')).slice(0, 160)
  const url = `https://dnbdoctor.com/news/${slug}`
  return {
    title: `${plainTitle} | DNB Doctor`,
    description,
    openGraph: {
      title: plainTitle,
      description,
      url,
      type: 'article',
      images: post.coverImageUrl ? [{ url: post.coverImageUrl }] : undefined,
    },
    twitter: {
      card: 'summary_large_image',
      title: plainTitle,
      description,
      images: post.coverImageUrl ? [post.coverImageUrl] : undefined,
    },
    alternates: { canonical: url },
  }
}
