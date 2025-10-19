import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'What Is Drum and Bass? | The Origins and Sound of DnB',
  description: 'What is Drum and Bass? Learn the meaning, origins, and evolution of the DnB genre — from jungle roots to modern neurofunk and liquid styles.',
  keywords: 'what is drum and bass, dnb meaning, drum and bass genre, history of drum and bass, jungle music, neurofunk, liquid dnb, dnb subgenres',
  openGraph: {
    title: 'What Is Drum and Bass? | The Origins and Sound of DnB',
    description: 'What is Drum and Bass? Learn the meaning, origins, and evolution of the DnB genre — from jungle roots to modern neurofunk and liquid styles.',
    type: 'website',
    url: 'https://dnbdoctor.com/what-is-drum-and-bass',
    images: [
      {
        url: '/music-bg.jpeg',
        width: 1200,
        height: 630,
        alt: 'What Is Drum and Bass - The Origins and Sound of DnB',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'What Is Drum and Bass? | The Origins and Sound of DnB',
    description: 'What is Drum and Bass? Learn the meaning, origins, and evolution of the DnB genre — from jungle roots to modern neurofunk and liquid styles.',
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

