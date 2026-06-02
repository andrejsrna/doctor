import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Drum and Bass History: From Jungle Raves to Global Movement (1990–2025)',
  description: 'The complete history of Drum and Bass — from Amen break jungle in 1990s UK raves to today\'s global neurofunk scene. Key artists, pivotal tracks, and how DnB conquered the world.',
  keywords: ['drum and bass history', 'origins of dnb', 'jungle roots', 'drum and bass evolution', 'history of jungle music', 'neurofunk history', 'dnb timeline'],
  openGraph: {
    title: 'Drum and Bass History: From Jungle Raves to Global Movement (1990–2025)',
    description: 'The complete history of Drum and Bass — from Amen break jungle in 1990s UK raves to today\'s global neurofunk scene. Key artists, pivotal tracks, and how DnB conquered the world.',
    type: 'article',
    url: 'https://dnbdoctor.com/drum-and-bass-history',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Drum and Bass History: From Jungle Raves to Global Movement (1990–2025)',
    description: 'The complete history of Drum and Bass — from Amen break jungle in 1990s UK raves to today\'s global neurofunk scene. Key artists, pivotal tracks, and how DnB conquered the world.',
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

