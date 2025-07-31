import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Neurofunk Artists & Producers | DnB Doctor - Top Neurofunk Artists 2025',
  description: 'Discover the best neurofunk artists and producers in the drum and bass scene. Meet top neurofunk producers, explore their music, and find the latest neurofunk artists pushing the boundaries of the genre.',
  keywords: 'neurofunk artist, neurofunk producers, top neurofunk artists, best neurofunk producers, neurofunk dnb artists, neurofunk music producers, neurofunk scene artists, dnb doctor artists',
  openGraph: {
    title: 'Neurofunk Artists & Producers | DnB Doctor',
    description: 'Discover the best neurofunk artists and producers in the drum and bass scene. Top neurofunk producers and latest neurofunk artists.',
    type: 'website',
    url: 'https://dnbdoctor.com/artists',
    images: [
      {
        url: '/music-bg.jpeg',
        width: 1200,
        height: 630,
        alt: 'Neurofunk Artists and Producers',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Neurofunk Artists & Producers | DnB Doctor',
    description: 'Discover the best neurofunk artists and producers in the drum and bass scene.',
    images: ['/music-bg.jpeg'],
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
    canonical: 'https://dnbdoctor.com/artists',
  },
  other: {
    'article:section': 'Artists',
    'article:tag': ['neurofunk artist', 'neurofunk producers', 'drum and bass', 'artists'],
  },
}

export default function ArtistsLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return children
} 