// server component
import Image from 'next/image'
import Link from 'next/link'
import { FaSpotify, FaSoundcloud, FaYoutube } from 'react-icons/fa'
import { prisma } from '@/lib/prisma'
import PreviewPlayer from './PreviewPlayer'
import { getSellingPointsForReleaseWithOverride } from './sellingPoints'

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

  return (
    <div className="relative py-20 px-4">
      {/* Background Elements */}
      <div className="absolute inset-0 bg-gradient-to-b from-black via-purple-900/10 to-black" />
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,_rgba(168,85,247,0.1)_0%,_transparent_100%)] opacity-30" />
      
      <div className="max-w-6xl mx-auto relative z-10">
        {/* Out Now Badge */}
        <div className="text-center mb-8">
          <span className="inline-block px-4 py-2 bg-purple-500/20 text-purple-300 rounded-full text-sm font-medium border border-purple-500/30">
            OUT NOW
          </span>
        </div>

        {/* Main Card */}
        <div className="bg-black/40 backdrop-blur-xl rounded-2xl border border-white/5 p-8 max-w-4xl mx-auto">
          <div className="grid md:grid-cols-2 gap-8 items-center">
            {/* Cover Art */}
            <div className="relative aspect-square group">
              <div className="absolute inset-0 bg-purple-500/10 rounded-xl transform group-hover:scale-95 transition-transform duration-500" />
              {release.coverImageUrl ? (
                <Link href={`/music/${release.slug}`}>
                  <Image
                    src={release.coverImageUrl}
                    alt={release.title}
                    fill
                    className="object-contain p-4 transform group-hover:scale-105 transition-transform duration-500"
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
            <div className="flex flex-col gap-6">
              {/* Artist & Title */}
              <div>
                {release.artistName && (
                  <p className="text-purple-400 text-lg font-medium mb-2">
                    {release.artistName}
                  </p>
                )}
                <h1 className="text-3xl md:text-4xl font-bold text-white mb-2">
                  {release.title}
                </h1>
                <p className="text-gray-400 text-sm">
                  Released {formatDate(release.publishedAt)}
                </p>
              </div>

              {/* Key Selling Points */}
              <div className="space-y-2">
                {getSellingPointsForReleaseWithOverride(release.slug, release.categories).map((point, index) => (
                  <div key={index} className="flex items-center gap-2 text-sm text-gray-300">
                    <div className="w-2 h-2 bg-purple-500 rounded-full"></div>
                    <span>{point}</span>
                  </div>
                ))}
              </div>

              {/* CTAs */}
              <div className="flex flex-col gap-3">
                {/* Primary CTA - Smart Link */}
                <div className="flex flex-wrap gap-2">
                  {streamingLinks.slice(0, 2).map((platform) => (
                    <a
                      key={platform.name}
                      href={platform.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className={`flex items-center gap-2 px-4 py-2 rounded-lg ${platform.bgColor} transition-all duration-300 group`}
                    >
                      <platform.icon className={`w-4 h-4 ${platform.color}`} />
                      <span className={`text-sm font-medium ${platform.color}`}>
                        {platform.name}
                      </span>
                    </a>
                  ))}
                </div>

                {/* Secondary CTAs */}
                <div className="flex gap-3">
                  {release.previewUrl && (
                    <PreviewPlayer 
                      previewUrl={release.previewUrl}
                      title={release.title}
                      artistName={release.artistName}
                    />
                  )}
                  <Link 
                    href={`/music/${release.slug}`}
                    className="flex items-center gap-2 px-4 py-2 bg-purple-500/20 hover:bg-purple-500/30 text-purple-300 rounded-lg transition-colors border border-purple-500/30"
                  >
                    <span className="text-sm">Show More</span>
                  </Link>
                </div>
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