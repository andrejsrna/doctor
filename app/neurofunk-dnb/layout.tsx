import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Neurofunk DnB 2025 Guide – Releases, Playlists & Sound Design | DnB Doctor',
  description:
    'Explore the 2025 Neurofunk DnB guide: free playlists, Prague-born releases, and sound-design tips from DnB Doctor. Stream the latest drops and learn how modern neuro evolves.',
  keywords:
    'neurofunk, neurofunk dnb, drum and bass, neurofunk playlist, neurofunk releases, sound design tips, DNB Doctor, techstep, Eatbrain, Noisia, Prague neurofunk',
  openGraph: {
    title: 'Neurofunk DnB 2025 Guide – Releases, Playlists & Sound Design',
    description:
      'Discover Prague’s neurofunk heartbeat: exclusive DnB Doctor releases, curated playlists, and production tips for modern bass engineers.',
    type: 'website',
    url: 'https://dnbdoctor.com/neurofunk-dnb',
    images: [
      {
        url: '/music-bg.jpeg',
        width: 1200,
        height: 630,
        alt: 'Neurofunk DnB Guide – DnB Doctor',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Neurofunk DnB 2025 Guide – DnB Doctor',
    description:
      'Stream the latest neurofunk, grab playlists, and learn cutting-edge sound design from Prague’s DnB Doctor collective.',
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
    canonical: 'https://dnbdoctor.com/neurofunk-dnb',
  },
}

export default function NeurofunkDnbLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return children
}
