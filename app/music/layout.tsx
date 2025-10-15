import type { Metadata } from 'next'

const currentYear = new Date().getFullYear()

export const metadata: Metadata = {
  title: `Drum and Bass New Releases | Latest DnB Tracks ${currentYear} | DnB Doctor`,
  description: 'Discover drum and bass new releases updated daily. Stream the latest DnB tracks, newest neurofunk music, and fresh releases from top artists. Your premier source for new drum and bass music.',
  keywords: `drum and bass new releases, latest dnb releases, new drum and bass, latest drum and bass tracks, fresh dnb music, new drum and bass ${currentYear}, drum and bass music, neurofunk new releases, dnb doctor`,
  openGraph: {
    title: 'Drum and Bass New Releases | Latest DnB Tracks | DnB Doctor',
    description: 'Drum and bass new releases updated daily. Discover the latest DnB tracks, newest neurofunk music, and fresh releases from top artists.',
    type: 'website',
    url: 'https://dnbdoctor.com/music',
    images: [
      {
        url: '/music-bg.jpeg',
        width: 1200,
        height: 630,
        alt: 'Drum and Bass New Releases - Latest DnB Tracks',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Drum and Bass New Releases | DnB Doctor',
    description: 'Drum and bass new releases updated daily. Latest DnB tracks and newest neurofunk music.',
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
    'article:section': 'Drum and Bass New Releases',
    'article:tag': ['drum and bass new releases', 'latest dnb', 'new drum and bass', 'neurofunk releases', 'dnb music'],
  },
}

export default function MusicLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return children
} 