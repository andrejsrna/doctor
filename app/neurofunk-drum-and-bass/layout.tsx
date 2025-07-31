import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Neurofunk Drum & Bass | DnB Doctor - The Future of Electronic Music',
  description: 'Experience the cutting-edge sound of neurofunk drum and bass. Discover innovative beats, dark atmospheres, and technical precision in the electronic music scene.',
  keywords: 'neurofunk, drum and bass, dnb, electronic music, dark atmospheres, technical precision, innovative beats, dnb doctor',
  openGraph: {
    title: 'Neurofunk Drum & Bass | DnB Doctor',
    description: 'Experience the cutting-edge sound of neurofunk drum and bass. Discover innovative beats and dark atmospheres.',
    type: 'website',
    url: 'https://dnbdoctor.com/neurofunk-drum-and-bass',
    images: [
      {
        url: '/music-bg.jpeg',
        width: 1200,
        height: 630,
        alt: 'Neurofunk Drum and Bass',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Neurofunk Drum & Bass | DnB Doctor',
    description: 'Experience the cutting-edge sound of neurofunk drum and bass.',
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
    canonical: 'https://dnbdoctor.com/neurofunk-drum-and-bass',
  },
}

export default function NeurofunkDrumAndBassLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return children
} 