import type { Metadata } from 'next'

export const metadata: Metadata = {
  metadataBase: new URL('https://dnbdoctor.com'),
  title: 'What Is Drum and Bass (DnB)? Definition, 174 BPM & Subgenres',
  description: 'Learn what Drum and Bass (DnB) is: a quick definition, typical 174 BPM tempo, origins from jungle, and key subgenres like liquid and neurofunk.',
  keywords: 'what is drum and bass, dnb meaning, drum and bass genre, history of drum and bass, jungle music, neurofunk, liquid dnb, dnb subgenres',
  openGraph: {
    title: 'What Is Drum and Bass (DnB)? Definition, 174 BPM & Subgenres',
    description: 'Learn what Drum and Bass (DnB) is: a quick definition, typical 174 BPM tempo, origins from jungle, and key subgenres like liquid and neurofunk.',
    type: 'article',
    url: 'https://dnbdoctor.com/what-is-drum-and-bass',
    images: [
      {
        url: 'https://dnbdoctor.com/music-bg.jpeg',
        width: 1200,
        height: 630,
        alt: 'What Is Drum and Bass (DnB) — definition, BPM, and subgenres',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'What Is Drum and Bass (DnB)? Definition, 174 BPM & Subgenres',
    description: 'Learn what Drum and Bass (DnB) is: a quick definition, typical 174 BPM tempo, origins from jungle, and key subgenres like liquid and neurofunk.',
    images: ['https://dnbdoctor.com/music-bg.jpeg'],
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
    canonical: 'https://dnbdoctor.com/what-is-drum-and-bass',
  },
}

export default function WhatIsDrumAndBassLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return children
}
