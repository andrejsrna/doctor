import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Neurofunk DnB – The Dark Energy of Drum and Bass | DnB Doctor',
  description: 'Neurofunk DnB blends dark basslines, precise rhythms, and futuristic energy. Discover modern neurofunk sound and DNB Doctor releases.',
  keywords: 'neurofunk, neurofunk dnb, drum and bass, dark basslines, precise rhythms, futuristic energy, DNB Doctor, electronic music, techstep, Ed Rush Optical, Noisia, Phace, Black Sun Empire',
  openGraph: {
    title: 'Neurofunk DnB – The Dark Energy of Drum and Bass',
    description: 'Neurofunk DnB blends dark basslines, precise rhythms, and futuristic energy. Discover modern neurofunk sound and DNB Doctor releases.',
    type: 'website',
    url: 'https://dnbdoctor.com/neurofunk-dnb',
    images: [
      {
        url: '/music-bg.jpeg',
        width: 1200,
        height: 630,
        alt: 'Neurofunk DnB - The Dark Energy of Drum and Bass',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Neurofunk DnB – The Dark Energy of Drum and Bass',
    description: 'Neurofunk DnB blends dark basslines, precise rhythms, and futuristic energy. Discover modern neurofunk sound and DNB Doctor releases.',
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
