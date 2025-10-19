import { prisma } from '@/lib/prisma'
import { Metadata } from 'next'
import ArtistDetailClient, { ArtistDetail } from './ArtistDetailClient'
import { sanitizeHtml } from '@/lib/sanitize'

interface PageProps { params: Promise<{ slug: string }> }

export const revalidate = 300

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { slug } = await params
  const artist = await prisma.artist.findUnique({ where: { slug } })
  
  if (!artist) {
    return {
      title: 'Artist Not Found',
      description: 'This artist could not be found.',
    }
  }

  const cleanDescription = artist.bio 
    ? sanitizeHtml(artist.bio).replace(/<[^>]+>/g, '').slice(0, 160) 
    : `Discover ${artist.name} on DnB Doctor - Neurofunk & Drum and Bass label`
  
  const canonicalUrl = `https://dnbdoctor.com/artists/${slug}`
  const imageUrl = artist.imageUrl || 'https://dnbdoctor.com/og-image.jpg'

  return {
    title: `${artist.name} | DnB Doctor`,
    description: cleanDescription,
    alternates: {
      canonical: canonicalUrl,
    },
    openGraph: {
      type: 'profile',
      title: `${artist.name} | DnB Doctor`,
      description: cleanDescription,
      url: canonicalUrl,
      siteName: 'DnB Doctor',
      images: [{
        url: imageUrl,
        width: 1200,
        height: 630,
        alt: artist.name,
      }],
    },
    twitter: {
      card: 'summary_large_image',
      title: `${artist.name} | DnB Doctor`,
      description: cleanDescription,
      images: [imageUrl],
      creator: '@dnbdoctor',
    },
  }
}

export default async function ArtistPage({ params }: PageProps) {
  const { slug } = await params
  const item = await prisma.artist.findUnique({ where: { slug } })
  if (!item) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-red-500">Artist not found</div>
      </div>
    )
  }
  const artist: ArtistDetail = {
    id: item.id,
    slug: item.slug,
    name: item.name,
    bio: item.bio,
    imageUrl: item.imageUrl || undefined,
    soundcloud: item.soundcloud || undefined,
    spotify: item.spotify || undefined,
    facebook: item.facebook || undefined,
    instagram: item.instagram || undefined,
  }

  // JSON-LD structured data for artist
  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'MusicGroup',
    name: item.name,
    genre: ['Drum and Bass', 'Neurofunk', 'Electronic Music'],
    url: `https://dnbdoctor.com/artists/${slug}`,
    ...(item.imageUrl && { image: item.imageUrl }),
    ...(item.bio && { description: sanitizeHtml(item.bio).replace(/<[^>]+>/g, '').slice(0, 200) }),
    ...(item.spotify && { 
      sameAs: [
        item.spotify,
        ...(item.soundcloud ? [item.soundcloud] : []),
        ...(item.facebook ? [item.facebook] : []),
        ...(item.instagram ? [item.instagram] : []),
      ].filter(Boolean)
    }),
  }

  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />
      <ArtistDetailClient artist={artist} />
    </>
  )
}