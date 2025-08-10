// server component
import Image from 'next/image'
import Link from 'next/link'
import { FaSpotify, FaApple, FaSoundcloud, FaBandcamp, FaYoutube, FaDeezer } from 'react-icons/fa'
import { prisma } from '@/lib/prisma'

interface StreamingLink {
  name: string
  url: string | undefined
  icon: React.ComponentType<{ className?: string }> | string
  color: string
  bgColor: string
  priority?: number
}   

type FeaturedRelease = {
  id: string
  slug: string
  title: string
  coverImageUrl: string | null
  previewUrl: string | null
  spotify: string | null
  beatport: string | null
  soundcloud: string | null
  appleMusic: string | null
  deezer: string | null
  youtubeMusic: string | null
  bandcamp: string | null
  tidal: string | null
}


export default async function FeaturedTrack() {
  const release = await prisma.release.findFirst({
    orderBy: { publishedAt: 'desc' },
    where: { publishedAt: { not: null } },
    select: {
      id: true,
      slug: true,
      title: true,
      coverImageUrl: true,
      previewUrl: true,
      spotify: true,
      beatport: true,
      soundcloud: true,
      appleMusic: true,
      deezer: true,
      youtubeMusic: true,
      gumroad: true,
      tidal: true,
    },
  }) as unknown as (FeaturedRelease & { gumroad: string | null }) | null

  if (!release) return null

  const streamingLinks: StreamingLink[] = [
    { 
      name: 'Spotify', 
      url: release.spotify || undefined, 
      icon: FaSpotify, 
      color: 'text-green-400',
      bgColor: 'bg-green-500/10 hover:bg-green-500/20',
      priority: 3
    },
    { 
      name: 'Beatport', 
      url: release.beatport || undefined, 
      icon: '/beatport.svg', 
      color: 'text-cyan-400',
      bgColor: 'bg-cyan-500/10 hover:bg-cyan-500/20',
      priority: 3
    },
    { 
      name: 'Apple Music', 
      url: release.appleMusic || undefined, 
      icon: FaApple, 
      color: 'text-pink-400',
      bgColor: 'bg-pink-500/10 hover:bg-pink-500/20',
      priority: 2
    },
    { 
      name: 'Deezer', 
      url: release.deezer || undefined, 
      icon: FaDeezer, 
      color: 'text-pink-400',
      bgColor: 'bg-pink-500/10 hover:bg-pink-500/20'
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
    { 
      name: 'Bandcamp', 
      url: undefined, 
      icon: FaBandcamp, 
      color: 'text-blue-400',
      bgColor: 'bg-blue-500/10 hover:bg-blue-500/20'
    },
    { 
      name: 'Tidal', 
      url: release.tidal || undefined, 
      icon: '/tidal.svg', 
      color: 'text-blue-400',
      bgColor: 'bg-blue-500/10 hover:bg-blue-500/20'
    },
  ]

  const renderIcon = (icon: StreamingLink['icon']) => {
    if (typeof icon === 'string') {
      if (icon.startsWith('/')) {
        return <Image src={icon} alt="" width={24} height={24} className="w-6 h-6" />
      }
      return null
    }
    const Comp = icon
    return <Comp className="w-6 h-6" />
  }

  return (
    <section className="py-20 relative overflow-hidden">
      {/* Background Elements */}
      <div className="absolute inset-0 bg-gradient-to-b from-black via-purple-900/10 to-black" />
      
      {/* Static subtle radial background */}
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,_rgba(168,85,247,0.1)_0%,_transparent_100%)] opacity-30" />

      {/* Decorative particles removed for performance */}

      {/* Decorative blobs removed for performance */}
      
      <div className="max-w-7xl mx-auto px-4 relative z-10">
        <h2 className="text-4xl md:text-5xl font-bold mb-16 text-center">Latest <span className="text-transparent bg-clip-text bg-gradient-to-r from-purple-500 to-purple-300">Infection</span></h2>

        <div className="relative">
          {/* Decorative elements */}
          <div className="absolute -left-4 -top-4 w-24 h-24 bg-purple-500/10 rounded-full blur-xl" />
          <div className="absolute -right-4 -bottom-4 w-32 h-32 bg-purple-500/10 rounded-full blur-xl" />
          
          {/* Main content */}
          <div className="bg-black/40 backdrop-blur-xl rounded-2xl border border-white/5 p-8">
            <div className="grid md:grid-cols-2 gap-12 items-center">
              {/* Image Side */}
              <div className="relative aspect-square group">
                <div className="absolute inset-0 bg-purple-500/10 rounded-xl transform group-hover:scale-95 transition-transform duration-500" />
                {release.coverImageUrl ? (
                 <Link href={`/music/${release.slug}`}> <Image
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

              {/* Content Side */}
              <div className="flex flex-col gap-8">



   <div className="grid grid-cols-1 sm:grid-cols-1 lg:grid-cols-2 gap-4">
                  {streamingLinks
                    .filter(platform => platform.url)
                    .map((platform) => (
                      <a
                        key={platform.name}
                        href={platform.url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className={`flex items-center gap-4 p-4 rounded-xl
                          ${platform.bgColor} backdrop-blur-sm
                          transition-all duration-300 group relative overflow-hidden`}
                      >
                        <div className={`p-3 rounded-lg ${platform.bgColor}`}>
                          {renderIcon(platform.icon)}
                        </div>
                        <div className="flex flex-col">
                          <span className="text-sm text-gray-400">Listen on</span>
                           <span className={`text-lg font-medium ${platform.color}`}>
                            {platform.name}
                          </span>
                        </div>
                        <div className="absolute right-4">
                          <svg className={`w-6 h-6 ${platform.color}`} fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                          </svg>
                        </div>
                      </a>
                    ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Animations removed */}
    </section>
  )
} 