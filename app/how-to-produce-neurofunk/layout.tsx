import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'How to Produce Neurofunk | Sound Design & Drum and Bass Production Guide',
  description: 'Learn how to produce neurofunk – from bass design and drum programming to arrangement, mixing, and mastering. Complete neurofunk production guide for DnB producers.',
  keywords: 'how to produce neurofunk, neurofunk production, neurofunk bass tutorial, neurofunk sound design, make neurofunk bass, neurofunk drums, dnb production',
  openGraph: {
    title: 'How to Produce Neurofunk | Sound Design & Drum and Bass Production Guide',
    description: 'Learn how to produce neurofunk – from bass design and drum programming to arrangement, mixing, and mastering. Complete neurofunk production guide for DnB producers.',
    type: 'article',
    url: 'https://dnbdoctor.com/how-to-produce-neurofunk',
    images: [
      {
        url: '/music-bg.jpeg',
        width: 1200,
        height: 630,
        alt: 'How to Produce Neurofunk - Complete Production Guide',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'How to Produce Neurofunk | Sound Design & Drum and Bass Production Guide',
    description: 'Learn how to produce neurofunk – from bass design and drum programming to arrangement, mixing, and mastering.',
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
    canonical: 'https://dnbdoctor.com/how-to-produce-neurofunk',
  },
}

export default function HowToProduceNeurofunkLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return children
}

