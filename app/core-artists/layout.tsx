import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Core Artists | DnB Doctor',
  description:
    'CORE ARTISTS are the foundation collaborators of DnB Doctor — long-term, committed, and aligned with the dark & technical Drum & Bass vision.',
  keywords:
    'DnB Doctor core artists, drum and bass label, neurofunk label, dark dnb, technical dnb, dnb releases, artist development',
  openGraph: {
    title: 'Core Artists | DnB Doctor',
    description:
      'DnB Doctor is a long-term Drum & Bass project. CORE ARTISTS help shape the sound, visuals, and direction — committed, not contractual.',
    type: 'website',
    url: 'https://dnbdoctor.com/core-artists',
    images: [
      {
        url: '/music-bg.jpeg',
        width: 1200,
        height: 630,
        alt: 'DnB Doctor — Core Artists',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Core Artists | DnB Doctor',
    description:
      'CORE ARTISTS are the foundation collaborators of DnB Doctor — committed, not contractual.',
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
    canonical: 'https://dnbdoctor.com/core-artists',
  },
  other: {
    'article:section': 'Artists',
    'article:tag': ['core artists', 'drum and bass', 'neurofunk', 'label'],
  },
}

export default function CoreArtistsLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return children
}

