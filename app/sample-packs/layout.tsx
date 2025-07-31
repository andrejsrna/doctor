import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Neurofunk Samples & Sample Packs | DnB Doctor - Professional Drum & Bass Sounds',
  description: 'Download professional neurofunk sample packs, drum loops, bass samples, and sound design tools. High-quality DnB samples for producers, featuring rolling basslines, complex drums, and dark atmospheres.',
  keywords: 'neurofunk samples, dnb sample packs, drum and bass samples, neurofunk loops, bass samples, dnb drums, rolling basslines, dark atmospheres, electronic music samples, dnb doctor samples',
  openGraph: {
    title: 'Neurofunk Samples & Sample Packs | DnB Doctor',
    description: 'Professional neurofunk sample packs with rolling basslines, complex drums, and dark atmospheres for DnB producers.',
    type: 'website',
    url: 'https://dnbdoctor.com/sample-packs',
    images: [
      {
        url: '/music-bg.jpeg',
        width: 1200,
        height: 630,
        alt: 'Neurofunk Samples and Sample Packs',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Neurofunk Samples & Sample Packs | DnB Doctor',
    description: 'Professional neurofunk sample packs with rolling basslines and complex drums.',
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
    canonical: 'https://dnbdoctor.com/sample-packs',
  },
  other: {
    'article:section': 'Sample Packs',
    'article:tag': ['neurofunk', 'drum and bass', 'samples', 'music production'],
  },
}

export default function SamplePacksLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return children
} 