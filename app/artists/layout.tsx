import type { Metadata } from 'next'

interface Props {
  children: React.ReactNode
}

export const metadata: Metadata = {
  title: 'Artists | DnB Doctor - Neurofunk Label',
  description: 'Discover our talented roster of drum and bass artists. Listen to their latest releases, mixes, and exclusive content on DnB Doctor.',
  keywords: 'dnb artists, drum and bass producers, neurofunk artists, electronic music producers, dnb doctor artists',
  openGraph: {
    title: 'Artists | DnB Doctor',
    description: 'Explore our roster of talented drum and bass artists and producers.',
    url: 'https://dnbdoctor.com/artists',
    siteName: 'DnB Doctor',
    images: [
      {
        url: 'https://dnbdoctor.com/artists-banner.jpg',
        width: 1200,
        height: 630,
        alt: 'DnB Doctor Artists',
      },
    ],
    locale: 'en_US',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Artists | DnB Doctor',
    description: 'Discover our talented roster of drum and bass artists.',
    images: ['https://dnbdoctor.com/artists-banner.jpg'],
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
}

export default function ArtistsLayout({ children }: Props) {
  return children
} 