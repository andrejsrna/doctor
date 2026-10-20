import type { Metadata } from 'next'
import CollectionView from '@/app/components/collections/CollectionView'
import { loadCollections } from '@/app/components/collections/collections'

export const revalidate = 300

const URL = 'https://dnbdoctor.com/albums'
const DESCRIPTION =
  'Discover the latest drum and bass albums and LP releases. New DnB albums updated daily with fresh neurofunk, liquid, and dark DnB album collections.'

export const metadata: Metadata = {
  title: 'New Drum and Bass Albums | DnB Doctor - Latest DnB Album Releases',
  description: DESCRIPTION,
  alternates: { canonical: URL },
  openGraph: {
    title: 'New Drum and Bass Albums | DnB Doctor',
    description: DESCRIPTION,
    url: URL,
    siteName: 'DnB Doctor',
    type: 'website',
    images: [{ url: 'https://dnbdoctor.com/og-image.jpg', width: 1200, height: 630, alt: 'New Drum and Bass Albums | DnB Doctor' }],
  },
  twitter: { card: 'summary_large_image', images: ['https://dnbdoctor.com/og-image.jpg'] },
}

export default async function AlbumsPage() {
  return <CollectionView kind="albums" all={await loadCollections()} />
}
