import type { Metadata } from 'next'
import CollectionView from '@/app/components/collections/CollectionView'
import { loadCollections } from '@/app/components/collections/collections'

export const revalidate = 300

const URL = 'https://dnbdoctor.com/music-packs'
const DESCRIPTION =
  'DnB Doctor music packs: neurofunk and drum & bass compilations and label showcases collecting multiple tracks in one release. Preview and buy on Beatport.'

export const metadata: Metadata = {
  title: { absolute: 'Neurofunk Music Packs & DnB Compilations | DnB Doctor' },
  description: DESCRIPTION,
  alternates: { canonical: URL },
  openGraph: {
    title: 'Neurofunk Music Packs & DnB Compilations | DnB Doctor',
    description: DESCRIPTION,
    url: URL,
    siteName: 'DnB Doctor',
    type: 'website',
    images: [{ url: 'https://dnbdoctor.com/og-image.jpg', width: 1200, height: 630, alt: 'Neurofunk Music Packs & DnB Compilations | DnB Doctor' }],
  },
  twitter: { card: 'summary_large_image', images: ['https://dnbdoctor.com/og-image.jpg'] },
}

export default async function MusicPacksPage() {
  return <CollectionView kind="music-packs" all={await loadCollections()} />
}
