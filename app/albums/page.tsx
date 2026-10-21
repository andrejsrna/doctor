import type { Metadata } from 'next'
import CollectionView from '@/app/components/collections/CollectionView'
import { countMixes, loadCollections } from '@/app/components/collections/collections'

export const revalidate = 300

const URL = 'https://dnbdoctor.com/albums'
const DESCRIPTION =
  'Neurofunk drum and bass albums from DnB Doctor: artist LPs like Asana – Raketa, yearly compilations and continuous label mixes. Preview, stream or buy.'

export const metadata: Metadata = {
  title: { absolute: 'Drum and Bass Albums: New Neurofunk DnB LPs | DnB Doctor' },
  description: DESCRIPTION,
  alternates: { canonical: URL },
  openGraph: {
    title: 'Drum and Bass Albums: New Neurofunk DnB LPs | DnB Doctor',
    description: DESCRIPTION,
    url: URL,
    siteName: 'DnB Doctor',
    type: 'website',
    images: [{ url: 'https://dnbdoctor.com/og-image.jpg', width: 1200, height: 630, alt: 'New Drum and Bass Albums | DnB Doctor' }],
  },
  twitter: { card: 'summary_large_image', images: ['https://dnbdoctor.com/og-image.jpg'] },
}

export default async function AlbumsPage() {
  return <CollectionView kind="albums" all={await loadCollections()} mixes={await countMixes()} />
}
