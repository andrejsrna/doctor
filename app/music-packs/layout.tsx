import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Neurofunk Music Packs & DnB Compilations | DnB Doctor',
  description:
    'DnB Doctor music packs: neurofunk and drum & bass compilations and label showcases collecting multiple tracks in one release. Preview and buy on Beatport.',
  alternates: { canonical: 'https://dnbdoctor.com/music-packs' },
  openGraph: {
    title: 'Neurofunk Music Packs & DnB Compilations | DnB Doctor',
    description: 'Neurofunk and drum & bass compilations and label showcases from DnB Doctor.',
    url: 'https://dnbdoctor.com/music-packs',
    siteName: 'DnB Doctor',
    type: 'website',
    images: [{ url: 'https://dnbdoctor.com/og-image.jpg', width: 1200, height: 630, alt: 'DnB Doctor music packs' }],
  },
  twitter: { card: 'summary_large_image', images: ['https://dnbdoctor.com/og-image.jpg'] },
}

export default function MusicPacksLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <div className="min-h-screen bg-black">
      {children}
    </div>
  )
}
