// server component
import Image from 'next/image'
import Link from 'next/link'
import { FaSpotify, FaSoundcloud, FaYoutube } from 'react-icons/fa'
import { prisma } from '@/lib/prisma'
import PreviewPlayer from './PreviewPlayer'
import { sanitizeHtml } from '@/app/utils/sanitize'

interface StreamingLink {
  name: string
  url: string | undefined
  icon: React.ComponentType<{ className?: string }>
  color: string
  bgColor: string
}

type FeaturedRelease = {
  id: string
  slug: string
  title: string
  artistName: string | null
  coverImageUrl: string | null
  content: string | null
  previewUrl: string | null
  spotify: string | null
  soundcloud: string | null
  beatport: string | null
  youtubeMusic: string | null
  publishedAt: Date | null
  categories: string[]
}

export default async function Hero() {
  const release = await prisma.release.findFirst({
    orderBy: { publishedAt: 'desc' },
    where: { publishedAt: { not: null } },
    select: {
      id: true,
      slug: true,
      title: true,
      artistName: true,
      coverImageUrl: true,
      content: true,
      previewUrl: true,
      spotify: true,
      soundcloud: true,
      beatport: true,
      youtubeMusic: true,
      publishedAt: true,
      categories: true,
    },
  }) as FeaturedRelease | null

  if (!release) {
    // Fallback if no release is available
    return (
      <div className="relative py-20 px-4">
        <div className="max-w-4xl mx-auto text-center">
          <h1 className="text-4xl md:text-6xl font-bold mb-8 bg-clip-text text-transparent bg-gradient-to-r from-purple-500 via-pink-500 to-purple-500">
            DNB Doctor
          </h1>
          <p className="text-gray-400 text-lg md:text-xl max-w-2xl mx-auto mb-8">
            Your source for the latest neurofunk and drum & bass releases
          </p>
          <div className="flex flex-col sm:flex-row justify-center items-center gap-4">
            <Link 
              href="/music" 
              className="px-8 py-3 bg-purple-500 hover:bg-purple-600 text-white rounded-lg font-medium transition-colors"
            >
              Browse Music
            </Link>
            <Link 
              href="/submit-demo" 
              className="px-8 py-3 bg-gray-700 hover:bg-gray-600 text-white rounded-lg font-medium transition-colors"
            >
              Submit Demo
            </Link>
          </div>
        </div>
      </div>
    )
  }

  const streamingLinks: StreamingLink[] = [
    { 
      name: 'Spotify', 
      url: release.spotify || undefined, 
      icon: FaSpotify, 
      color: 'text-green-400',
      bgColor: 'bg-green-500/10 hover:bg-green-500/20'
    },
    { 
      name: 'Beatport', 
      url: release.beatport || undefined, 
      icon: () => (
        <Image src="/beatport.svg" alt="Beatport" width={16} height={16} className="w-4 h-4" />
      ), 
      color: 'text-cyan-400',
      bgColor: 'bg-cyan-500/10 hover:bg-cyan-500/20'
    },
    { 
      name: 'SoundCloud', 
      url: release.soundcloud || undefined, 
      icon: FaSoundcloud, 
      color: 'text-orange-400',
      bgColor: 'bg-orange-500/10 hover:bg-orange-500/20'
    },
    { 
      name: 'YouTube Music', 
      url: release.youtubeMusic || undefined, 
      icon: FaYoutube, 
      color: 'text-red-400',
      bgColor: 'bg-red-500/10 hover:bg-red-500/20'
    },
  ].filter(link => link.url)

  const formatDate = (date: Date | null) => {
    if (!date) return ''
    return new Date(date).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    })
  }

  const excerpt = (() => {
    if (!release?.content) return ''
    const clean = sanitizeHtml(release.content)
      .replace(/<[^>]+>/g, ' ')
      .replace(/\s+/g, ' ')
      .trim()
    if (!clean) return ''
    const sentences = clean.split(/(?<=[.!?])\s+/).filter(Boolean)
    if (sentences.length === 0) return clean.slice(0, 240)
    return sentences.slice(0, 2).join(' ')
  })()

  return (
    <div className="relative py-24 md:py-32 px-4 overflow-hidden">
      {/* Background Elements */}
      <div className="absolute inset-0 bg-gradient-to-b from-black via-purple-900/20 to-black" />
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,_rgba(168,85,247,0.22)_0%,_transparent_60%)] opacity-50" />
      <div className="absolute -top-20 left-1/2 h-72 w-[120vw] -translate-x-1/2 bg-[radial-gradient(circle_at_center,_rgba(16,185,129,0.18)_0%,_transparent_65%)]" />
      
      <div className="max-w-6xl mx-auto relative z-10">
        {/* Out Now Badge */}
        <div className="text-center mb-10">
          <span className="inline-block px-6 py-2.5 bg-purple-500/20 text-purple-200 rounded-full text-sm md:text-base font-semibold border border-purple-500/40 tracking-[0.2em]">
            OUT NOW
          </span>
        </div>

        {/* Main Card */}
        <div className="bg-black/50 backdrop-blur-2xl rounded-3xl border border-white/10 p-8 md:p-12 max-w-5xl mx-auto shadow-[0_40px_140px_rgba(0,0,0,0.65)]">
          <div className="grid md:grid-cols-2 gap-10 items-center">
            {/* Cover Art */}
            <div className="relative aspect-square group animate-hero-float motion-reduce:animate-none">
              <div className="absolute inset-0 bg-purple-500/15 rounded-2xl transform group-hover:scale-95 transition-transform duration-500" />
              {release.coverImageUrl ? (
                <Link href={`/music/${release.slug}`}>
                  <Image
                    src={release.coverImageUrl}
                    alt={release.title}
                    fill
                    className="object-contain p-4 transform group-hover:scale-105 transition-transform duration-500 drop-shadow-[0_0_35px_rgba(168,85,247,0.55)]"
                    sizes="(max-width: 768px) 100vw, (max-width: 1024px) 50vw, 33vw"
                  />
                </Link>
              ) : (
                <div className="absolute inset-0 flex items-center justify-center text-gray-500">
                  No image available
                </div>
              )}
            </div>

            {/* Content */}
            <div className="flex flex-col gap-8">
              {/* Artist & Title */}
              <div>
                {release.artistName && (
                  <p className="text-purple-300 text-xl md:text-2xl font-semibold mb-3 tracking-wide">
                    {release.artistName}
                  </p>
                )}
                <h1 className="text-4xl md:text-6xl font-extrabold text-white mb-3 drop-shadow-[0_0_26px_rgba(168,85,247,0.45)]">
                  {release.title}
                </h1>
                <p className="text-gray-300 text-sm md:text-base">
                  Released {formatDate(release.publishedAt)}
                </p>
              </div>

              {/* Story Excerpt */}
              {excerpt && (
                <p className="text-base md:text-lg text-gray-200/90 leading-relaxed">
                  {excerpt}
                </p>
              )}

              {/* CTAs */}
              <div className="flex flex-wrap md:flex-nowrap items-center gap-3">
                  {streamingLinks.slice(0, 2).map((platform) => (
                    <a
                      key={platform.name}
                      href={platform.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className={`flex items-center gap-2 px-6 py-3 rounded-xl ${platform.bgColor} transition-all duration-300 group border border-white/10 hover:border-white/25 shadow-[0_0_24px_rgba(0,0,0,0.35)] animate-toxic-pulse motion-reduce:animate-none`}
                      style={{ animationDelay: platform.name === 'Spotify' ? '0.1s' : '0.35s' }}
                    >
                      <platform.icon className={`w-4 h-4 ${platform.color}`} />
                      <span className={`text-sm md:text-base font-semibold ${platform.color}`}>
                        {platform.name}
                      </span>
                    </a>
                  ))}
                {release.previewUrl && (
                  <div className="animate-toxic-pulse motion-reduce:animate-none" style={{ animationDelay: '0.55s' }}>
                    <PreviewPlayer 
                      previewUrl={release.previewUrl}
                      title={release.title}
                      artistName={release.artistName}
                    />
                  </div>
                )}
                <Link 
                  href={`/music/${release.slug}`}
                  className="flex items-center gap-2 px-6 py-3 bg-purple-500/30 hover:bg-purple-500/40 text-purple-100 rounded-xl transition-colors border border-purple-500/50 font-semibold shadow-[0_0_24px_rgba(168,85,247,0.35)] animate-toxic-pulse motion-reduce:animate-none"
                  style={{ animationDelay: '0.75s' }}
                >
                  <span className="text-sm md:text-base">Show More</span>
                </Link>
              </div>
            </div>
          </div>
        </div>

        {/* Additional Links */}
        <div className="text-center mt-8">
          <div className="flex flex-col sm:flex-row justify-center items-center gap-4 text-sm">
            <Link href="/music" className="text-purple-400 hover:text-purple-300 transition-colors">
              Browse All Releases
            </Link>
            <span className="text-gray-600 hidden sm:inline">•</span>
            <Link href="/submit-demo" className="text-purple-400 hover:text-purple-300 transition-colors">
              Submit Your Demo
            </Link>
          </div>
        </div>
      </div>
    </div>
  )
} 
