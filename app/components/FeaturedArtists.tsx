// server component
import Image from 'next/image'
import Link from 'next/link'
import { FaSoundcloud, FaUserMd } from 'react-icons/fa'
import Button from './Button'
import { prisma } from '@/lib/prisma'


export default async function FeaturedArtists() {
  const artists = await prisma.artist.findMany({
    orderBy: { createdAt: 'desc' },
    take: 3,
    select: {
      id: true,
      slug: true,
      name: true,
      imageUrl: true,
      soundcloud: true,
    },
  })

  // Helper function to get the best available image URL
  const getImageUrl = (artist: { imageUrl: string | null }) => artist.imageUrl || '/placeholder-artist.jpg'

  if (!artists?.length) return null

  return (
    <section className="py-24 relative overflow-hidden">
      {/* Background Pattern */}
      <div className="absolute inset-0 opacity-5">
        <Image
          src="/pattern.png"
          alt=""
          fill
          sizes="100vw"
          className="object-cover"
        />
      </div>

      <div className="max-w-7xl mx-auto px-4 relative z-10">
        {/* Section Header */}
        <div className="text-center mb-16 space-y-4">
          <h2 className="text-4xl md:text-5xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-purple-500 via-pink-500 to-purple-500">Featured Artists</h2>
          <p className="text-xl text-gray-400 max-w-2xl mx-auto">Meet the talented producers and DJs behind our signature neurofunk sound</p>
        </div>

        {/* Artists Grid */}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8 mb-16">
          {artists.map((artist) => (
            <div key={artist.id} className="group relative">
              <div className="relative aspect-[3/4] rounded-2xl overflow-hidden 
                border border-purple-500/30 shadow-[0_0_30px_rgba(168,85,247,0.15)]">
                <Link 
                  href={`/artists/${artist.slug}`}
                  className="block absolute inset-0 z-10"
                >
                  <span className="sr-only">View {artist.name}&apos;s profile</span>
                </Link>
                
                <Image
                  src={getImageUrl(artist)}
                  alt={artist.name}
                  fill
                  sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                  className="object-cover transition-transform duration-500 
                    group-hover:scale-110"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black via-black/50 to-transparent" />
                
                {/* Artist Info */}
                <div className="absolute bottom-0 left-0 right-0 p-6">
                  <h3 className="text-2xl font-bold text-white mb-1">
                    {artist.name}
                  </h3>
                  
                  {/* Action Buttons */}
                  <div className="flex gap-2">
                    <div className="flex-1">
                      <a 
                        href={artist.soundcloud || '#'}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="block"
                      >
                        <Button
                          variant="toxic"
                          size="sm"
                          className="group w-full"
                        >
                          <FaSoundcloud className="w-4 h-4 transform group-hover:scale-110 transition-transform duration-300" />
                          <span>SoundCloud</span>
                        </Button>
                      </a>
                    </div>
                    
                    <div className="flex-1">
                      <Link href={`/artists/${artist.slug}`}>
                        <Button
                          variant="infected"
                          size="sm"
                          className="group w-full"
                        >
                          <FaUserMd className="w-4 h-4 transform group-hover:scale-110 transition-transform duration-300" />
                          <span>View More</span>
                        </Button>
                      </Link>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>

        <div className="text-center">
          <div className="inline-block">
            <Button href="/artists" variant="infected" size="lg" className="group">
              <svg className="w-5 h-5 mr-2" viewBox="0 0 24 24" fill="currentColor" aria-hidden>
                <path d="M12 12c2.761 0 5-2.686 5-6s-2.239-6-5-6-5 2.686-5 6 2.239 6 5 6zm0 2c-3.33 0-10 1.667-10 5v3h20v-3c0-3.333-6.67-5-10-5z"/>
              </svg>
              <span>Meet All Artists</span>
              <svg className="w-4 h-4 ml-2" viewBox="0 0 24 24" fill="currentColor" aria-hidden>
                <path d="M12 4l1.41 1.41L8.83 10H20v2H8.83l4.58 4.59L12 18l-8-8 8-8z" transform="scale(-1,1) translate(-24,0)"/>
              </svg>
            </Button>
          </div>
        </div>
      </div>
    </section>
  )
} 
