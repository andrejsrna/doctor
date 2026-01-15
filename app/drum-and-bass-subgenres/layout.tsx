import type { Metadata } from 'next'

export const metadata: Metadata = {
  metadataBase: new URL('https://dnbdoctor.com'),
  title: 'DnB Subgenres Explained: Liquid, Neurofunk, Jump-Up, Jungle & More',
  description:
    'A clear guide to Drum and Bass (DnB) subgenres: what each one sounds like, key traits, who it’s for, and where to start listening.',
  keywords:
    'dnb subgenres, drum and bass subgenres, liquid dnb, neurofunk, jump up dnb, jungle, techstep, drum and bass styles',
  openGraph: {
    title: 'DnB Subgenres Explained: Liquid, Neurofunk, Jump-Up, Jungle & More',
    description:
      'A clear guide to Drum and Bass (DnB) subgenres: what each one sounds like, key traits, who it’s for, and where to start listening.',
    type: 'article',
    url: 'https://dnbdoctor.com/drum-and-bass-subgenres',
    images: [
      {
        url: 'https://dnbdoctor.com/music-bg.jpeg',
        width: 1200,
        height: 630,
        alt: 'DnB subgenres explained',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'DnB Subgenres Explained: Liquid, Neurofunk, Jump-Up, Jungle & More',
    description:
      'A clear guide to Drum and Bass (DnB) subgenres: what each one sounds like, key traits, who it’s for, and where to start listening.',
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
    canonical: 'https://dnbdoctor.com/drum-and-bass-subgenres',
  },
}

export default function DrumAndBassSubgenresLayout({ children }: { children: React.ReactNode }) {
  return children
}

