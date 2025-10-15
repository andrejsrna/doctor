import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Best Neurofunk DnB Playlists on Spotify | DNB Doctor',
  description: 'Discover the best Neurofunk DnB playlists on Spotify — from dark rollers to tech-driven anthems. Curated by DNB Doctor and top underground artists.',
  keywords: 'neurofunk spotify, neurofunk playlists, dnb spotify playlists, drum and bass spotify, neurofunk music, dark dnb playlists, neurofunk artists, DNB Doctor spotify',
  openGraph: {
    title: 'Best Neurofunk DnB Playlists on Spotify | DNB Doctor',
    description: 'Discover the best Neurofunk DnB playlists on Spotify — from dark rollers to tech-driven anthems. Curated by DNB Doctor and top underground artists.',
    type: 'website',
    url: 'https://dnbdoctor.com/neurofunk-spotify',
    images: [
      {
        url: '/music-bg.jpeg',
        width: 1200,
        height: 630,
        alt: 'Best Neurofunk DnB Playlists on Spotify',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Best Neurofunk DnB Playlists on Spotify | DNB Doctor',
    description: 'Discover the best Neurofunk DnB playlists on Spotify — from dark rollers to tech-driven anthems.',
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
    canonical: 'https://dnbdoctor.com/neurofunk-spotify',
  },
}

export default function NeurofunkSpotifyLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return children
}
