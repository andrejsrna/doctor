import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'History of Drum and Bass | From Jungle Roots to Modern DnB',
  description: 'Explore the full history of Drum and Bass — from its jungle and rave origins in early \'90s UK to the global DnB and neurofunk movement of today.',
  keywords: ['drum and bass history', 'origins of dnb', 'jungle roots', 'drum and bass evolution', 'history of jungle music', 'neurofunk history', 'dnb timeline'],
  openGraph: {
    title: 'History of Drum and Bass | From Jungle Roots to Modern DnB',
    description: 'Explore the full history of Drum and Bass — from its jungle and rave origins in early \'90s UK to the global DnB and neurofunk movement of today.',
    type: 'article',
    url: 'https://dnbdoctor.com/drum-and-bass-history',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'History of Drum and Bass | From Jungle Roots to Modern DnB',
    description: 'Explore the full history of Drum and Bass — from its jungle and rave origins in early \'90s UK to the global DnB and neurofunk movement of today.',
  },
  alternates: {
    canonical: 'https://dnbdoctor.com/drum-and-bass-history',
  },
}

export default function DrumAndBassHistoryLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return children
}

