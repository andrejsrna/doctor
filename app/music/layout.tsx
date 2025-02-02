import type { Metadata } from 'next'

interface Props {
  children: React.ReactNode
}

export const metadata: Metadata = {
  title: 'Music | DnB Doctor - Latest Neurofunk Releases',
  description: 'Explore our latest neurofunk and drum & bass releases. Listen to previews, download tracks, and discover new electronic music from DnB Doctor.',
  keywords: 'neurofunk releases, drum and bass music, dnb tracks, electronic music downloads, dnb doctor releases, new neurofunk',
  openGraph: {
    title: 'Latest Releases | DnB Doctor',
    description: 'Check out our newest neurofunk and drum & bass releases. High-quality electronic music from DnB Doctor.',
    url: 'https://dnbdoctor.com/music',
    siteName: 'DnB Doctor',
    images: [
      {
        url: 'https://dnbdoctor.com/music-banner.jpg',
        width: 1200,
        height: 630,
        alt: 'DnB Doctor Music Releases',
      },
    ],
    locale: 'en_US',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Latest Neurofunk Releases | DnB Doctor',
    description: 'Stream and download our newest drum & bass tracks.',
    images: ['https://dnbdoctor.com/music-banner.jpg'],
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-video-preview': -1,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
  },
  alternates: {
    canonical: 'https://dnbdoctor.com/music',
  },
  // Schema.org structured data for music collection
  verification: {
    other: {
      'schema:CollectionPage': JSON.stringify({
        '@context': 'https://schema.org',
        '@type': 'CollectionPage',
        name: 'DnB Doctor Music Releases',
        description: 'Collection of neurofunk and drum & bass releases from DnB Doctor.',
        publisher: {
          '@type': 'Organization',
          name: 'DnB Doctor',
          url: 'https://dnbdoctor.com'
        },
        about: {
          '@type': 'MusicAlbum',
          byArtist: {
            '@type': 'MusicGroup',
            name: 'DnB Doctor'
          },
          genre: ['Neurofunk', 'Drum and Bass', 'Electronic'],
        },
        offers: {
          '@type': 'AggregateOffer',
          priceCurrency: 'EUR',
          availability: 'https://schema.org/InStock',
          seller: {
            '@type': 'Organization',
            name: 'DnB Doctor'
          }
        },
        isPartOf: {
          '@type': 'MusicGroup',
          name: 'DnB Doctor',
          url: 'https://dnbdoctor.com',
          genre: ['Neurofunk', 'Drum and Bass'],
          sameAs: [
            'https://soundcloud.com/dnbdoctor',
            'https://www.facebook.com/dnbdoctor',
            'https://www.instagram.com/dnbdoctor/'
          ]
        }
      })
    }
  }
}

export default function MusicLayout({ children }: Props) {
  return children
} 