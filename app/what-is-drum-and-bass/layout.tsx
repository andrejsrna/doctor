import type { Metadata } from 'next'

export const metadata: Metadata = {
  metadataBase: new URL('https://dnbdoctor.com'),
  title: 'What Is Drum and Bass? (The Only Guide You Need) — DnB Doctor',
  description: 'Drum and Bass explained in 2 minutes: 174 BPM, heavy bass, 7 subgenres — from liquid to neurofunk. Hear the difference with audio examples.',
  keywords: 'what is drum and bass, dnb meaning, drum and bass genre, history of drum and bass, jungle music, neurofunk, liquid dnb, dnb subgenres',
  openGraph: {
    title: 'What Is Drum and Bass? (The Only Guide You Need) — DnB Doctor',
    description: 'Drum and Bass explained in 2 minutes: 174 BPM, heavy bass, 7 subgenres — from liquid to neurofunk. Hear the difference with audio examples.',
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
    title: 'What Is Drum and Bass? (The Only Guide You Need) — DnB Doctor',
    description: 'Drum and Bass explained in 2 minutes: 174 BPM, heavy bass, 7 subgenres — from liquid to neurofunk. Hear the difference with audio examples.',
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
