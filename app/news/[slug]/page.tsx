
import { prisma } from '@/lib/prisma'
import { notFound } from 'next/navigation'
import MoreFromArtist from '@/app/components/MoreFromArtist'
import parse, { DOMNode, domToReact, Element } from 'html-react-parser'
import Image from 'next/image'
import Link from 'next/link'
import RelatedNews from '../../components/RelatedNews'
import SocialShare from '../../components/SocialShare'
import EngagementCTA from '../../components/EngagementCTA'
import { sanitizeHtml } from '@/lib/sanitize'
import type { Metadata } from 'next'

interface PageProps { params: Promise<{ slug: string }> }

export const revalidate = 300

export default async function NewsPostPage({ params }: PageProps) {
  const { slug } = await params
  const post = await prisma.news.findUnique({
    where: { slug },
    include: {
      mixArtist: {
        select: { id: true, slug: true, name: true, bio: true, imageUrl: true, soundcloud: true, spotify: true, instagram: true },
      },
    },
  })
  if (!post) return notFound()
  const artistName = post.mixArtist?.name || post.relatedArtistName || ''
  const tracklistItems = (post.tracklist || '')
    .split(/\r?\n/)
    .map((line) => line.trim())
    .filter(Boolean)
  const showTracklist = post.categories?.includes('Mixes') && tracklistItems.length > 0
  const showMixDownload = post.categories?.includes('Mixes') && Boolean(post.mixDownloadUrl)

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
            '@type': post.mixArtist || post.relatedArtistName ? 'Person' : 'Organization',
            name: post.mixArtist?.name || post.relatedArtistName || 'DnB Doctor',
            ...(post.mixArtist && { url: `https://dnbdoctor.com/artists/${post.mixArtist.slug}` }),
            ...(!post.mixArtist && post.relatedArtistName && { url: `https://dnbdoctor.com/artists/${post.relatedArtistName.toLowerCase().replace(/\s+/g, '-')}` }),
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
          {post.categories?.includes('Mixes') && (
            <div className="mt-3 flex justify-center">
              <Link
                href="/neurofunk-dnb-mixes"
                className="inline-flex items-center gap-2 px-4 py-2 rounded-full border border-purple-500/40 bg-purple-600/20 text-purple-100 text-xs uppercase tracking-wide hover:border-purple-300 hover:text-white transition-colors"
              >
                Mixes
                <span aria-hidden className="text-purple-200">→</span>
              </Link>
            </div>
          )}
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

        {post.mixArtist && (
          <section className="mb-12 overflow-hidden rounded-2xl border border-pink-500/25 bg-gradient-to-br from-pink-950/25 via-purple-950/20 to-black p-5 md:p-6 shadow-[0_0_32px_rgba(236,72,153,0.12)]">
            <div className="flex flex-col gap-5 sm:flex-row sm:items-center">
              <Link href={`/artists/${post.mixArtist.slug}`} className="group relative h-24 w-24 shrink-0 overflow-hidden rounded-2xl border border-white/10 bg-purple-950/40">
                {post.mixArtist.imageUrl ? (
                  <Image src={post.mixArtist.imageUrl} alt={post.mixArtist.name} fill sizes="96px" className="object-cover transition-transform group-hover:scale-105" />
                ) : (
                  <div className="flex h-full w-full items-center justify-center text-3xl font-black text-purple-200">{post.mixArtist.name.slice(0, 1)}</div>
                )}
              </Link>
              <div className="min-w-0 flex-1">
                <p className="text-xs font-semibold uppercase tracking-[0.3em] text-pink-300">Featured Mix Artist</p>
                <Link href={`/artists/${post.mixArtist.slug}`} className="mt-1 inline-block text-2xl md:text-3xl font-black text-white hover:text-pink-200 transition-colors">
                  {post.mixArtist.name}
                </Link>
                {post.mixArtist.bio && (
                  <p className="mt-2 line-clamp-2 text-sm text-gray-300">{post.mixArtist.bio.replace(/<[^>]*>/g, '')}</p>
                )}
                <div className="mt-4 flex flex-wrap gap-2">
                  <Link href={`/artists/${post.mixArtist.slug}`} className="rounded-full border border-pink-400/30 bg-pink-500/10 px-3 py-1 text-xs font-semibold text-pink-100 hover:border-pink-300/60">Artist profile</Link>
                  {post.mixArtist.soundcloud && <a href={post.mixArtist.soundcloud} target="_blank" rel="noopener noreferrer" className="rounded-full border border-orange-400/30 bg-orange-500/10 px-3 py-1 text-xs font-semibold text-orange-100 hover:border-orange-300/60">SoundCloud</a>}
                  {post.mixArtist.spotify && <a href={post.mixArtist.spotify} target="_blank" rel="noopener noreferrer" className="rounded-full border border-green-400/30 bg-green-500/10 px-3 py-1 text-xs font-semibold text-green-100 hover:border-green-300/60">Spotify</a>}
                  {post.mixArtist.instagram && <a href={post.mixArtist.instagram} target="_blank" rel="noopener noreferrer" className="rounded-full border border-purple-400/30 bg-purple-500/10 px-3 py-1 text-xs font-semibold text-purple-100 hover:border-purple-300/60">Instagram</a>}
                </div>
              </div>
            </div>
          </section>
        )}

        {/* Content using html-react-parser */}
        <div className="prose prose-invert prose-purple max-w-none prose-headings:font-bold prose-h1:text-4xl prose-h2:text-3xl prose-h3:text-2xl prose-p:text-gray-300 prose-a:font-semibold prose-a:text-purple-300 prose-a:underline prose-a:decoration-purple-400 prose-a:decoration-2 prose-a:underline-offset-4 hover:prose-a:text-pink-300 hover:prose-a:decoration-pink-400">
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

        {showMixDownload && (
          <section className="mt-12 overflow-hidden rounded-2xl border border-cyan-400/25 bg-gradient-to-br from-cyan-950/30 via-purple-950/20 to-black p-6 md:p-8 shadow-[0_0_40px_rgba(34,211,238,0.12)]">
            <div className="flex flex-col gap-5 md:flex-row md:items-center md:justify-between">
              <div className="space-y-2">
                <p className="text-xs font-semibold uppercase tracking-[0.35em] text-cyan-300">Download Mix</p>
                <h2 className="text-2xl md:text-3xl font-black text-white">Take the full mix offline</h2>
                <p className="max-w-2xl text-sm md:text-base text-gray-300">
                  Download the mix file directly and keep it ready for the road, studio, or late-night listening.
                </p>
              </div>
              <a
                href={post.mixDownloadUrl!}
                download
                className="group inline-flex shrink-0 items-center justify-center gap-3 rounded-xl border border-cyan-300/40 bg-cyan-400/15 px-6 py-4 font-bold text-cyan-100 transition-all hover:border-cyan-200 hover:bg-cyan-300/25 hover:text-white hover:shadow-[0_0_24px_rgba(34,211,238,0.25)]"
              >
                <span className="text-xl" aria-hidden>↓</span>
                <span>Download Mix</span>
                <span className="text-cyan-200 transition-transform group-hover:translate-x-1" aria-hidden>→</span>
              </a>
            </div>
          </section>
        )}

        {showTracklist && (
          <details className="group mt-12 rounded-2xl border border-purple-500/25 bg-gradient-to-br from-purple-950/40 via-black/70 to-black/90 p-0 shadow-[0_0_35px_rgba(109,40,217,0.16)]">
            <summary className="flex cursor-pointer list-none items-center justify-between gap-4 p-6 md:p-8">
              <div className="flex items-center gap-3">
                <span className="h-px w-10 bg-purple-400" />
                <p className="text-xs font-semibold uppercase tracking-[0.35em] text-purple-300">Mix Tracklist</p>
              </div>
              <span className="rounded-full border border-purple-400/30 bg-purple-500/10 px-3 py-1 text-sm font-bold text-purple-100 transition-transform group-open:rotate-180">⌄</span>
            </summary>
            <div className="px-6 pb-6 md:px-8 md:pb-8">
              <ol className="space-y-3">
                {tracklistItems.map((track, index) => (
                  <li
                    key={`${track}-${index}`}
                    className="group/item flex gap-4 rounded-xl border border-white/5 bg-white/[0.03] px-4 py-3 transition-colors hover:border-purple-400/35 hover:bg-purple-500/10"
                  >
                    <span className="w-9 shrink-0 font-mono text-sm text-purple-300/80">
                      {String(index + 1).padStart(2, '0')}
                    </span>
                    <span className="text-gray-200 group-hover/item:text-white">{track.replace(/^\d+[.)\-\s]+/, '')}</span>
                  </li>
                ))}
              </ol>
            </div>
          </details>
        )}

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
          <RelatedNews currentPostId={post.wpId || 0} relatedBy={artistName || post.title} />
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
