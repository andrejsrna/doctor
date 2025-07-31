import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'DnB Latest Releases | DnB Doctor - Latest Drum & Bass Music 2024',
  description: 'Discover the latest DnB releases, newest drum and bass tracks, and fresh neurofunk music. Updated daily with the hottest DnB tracks, latest releases, and new drum and bass music from top artists.',
  keywords: 'dnb latest, latest dnb releases, newest drum and bass, latest dnb tracks, fresh dnb music, new drum and bass 2024, latest neurofunk, dnb doctor latest, newest dnb releases',
  openGraph: {
    title: 'DnB Latest Releases | DnB Doctor',
    description: 'Latest drum and bass releases, newest DnB tracks, and fresh neurofunk music updated daily.',
    type: 'website',
    url: 'https://dnbdoctor.com/music',
    images: [
      {
        url: '/music-bg.jpeg',
        width: 1200,
        height: 630,
        alt: 'Latest DnB Releases and New Drum and Bass Music',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'DnB Latest Releases | DnB Doctor',
    description: 'Latest drum and bass releases and newest DnB tracks.',
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
    canonical: 'https://dnbdoctor.com/music',
  },
  other: {
    'article:section': 'Latest Releases',
    'article:tag': ['dnb latest', 'drum and bass', 'latest releases', 'neurofunk'],
  },
}

export default function MusicLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return children
} 