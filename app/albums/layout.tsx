import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'New Drum and Bass Albums | DnB Doctor - Latest DnB Album Releases',
  description: 'Discover the latest drum and bass albums and LP releases. New DnB albums updated daily with fresh neurofunk, liquid, and dark DnB album collections.',
  keywords: 'drum and bass albums, dnb albums, new dnb albums, neurofunk albums, liquid dnb albums, dark dnb albums, DnB Doctor albums, latest dnb releases, dnb LP, drum and bass LP',
  openGraph: {
    title: 'New Drum and Bass Albums | DnB Doctor',
    description: 'Discover the latest drum and bass albums and LP releases. New DnB albums updated daily with fresh neurofunk, liquid, and dark DnB album collections.',
    type: 'website',
    url: 'https://dnbdoctor.com/albums',
    images: [
      {
        url: '/music-bg.jpeg',
        width: 1200,
        height: 630,
        alt: 'New Drum and Bass Albums - DnB Doctor',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'New Drum and Bass Albums | DnB Doctor',
    description: 'Discover the latest drum and bass albums and LP releases. New DnB albums updated daily.',
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
    canonical: 'https://dnbdoctor.com/albums',
  },
}

export default function AlbumsLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return children
}
