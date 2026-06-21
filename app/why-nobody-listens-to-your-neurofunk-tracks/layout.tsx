import type { Metadata } from 'next'

const title = 'Why Nobody Listens to Your Neurofunk Tracks — And How to Fix It'
const description = 'Finished a heavy neurofunk track but nobody listens? Learn how to fix weak positioning, release strategy, branding, content, playlists, and fan conversion.'
const url = 'https://dnbdoctor.com/why-nobody-listens-to-your-neurofunk-tracks'
const image = '/articles/why-nobody-listens-neurofunk-tracks.png'

export const metadata: Metadata = {
  title,
  description,
  keywords: [
    'why nobody listens to my music',
    'how to get fans as a neurofunk producer',
    'how to promote neurofunk',
    'neurofunk producer marketing',
    'how to get listeners for dnb tracks',
    'drum and bass promotion',
    'neurofunk release strategy',
  ],
  openGraph: {
    title,
    description,
    type: 'article',
    url,
    images: [
      {
        url: image,
        width: 1672,
        height: 941,
        alt: 'Neurofunk producer building real listeners and fans',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title,
    description,
    images: [image],
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
    canonical: url,
  },
}

export default function NeurofunkListenersLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return children
}
