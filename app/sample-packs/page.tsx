import type { Metadata } from 'next'
import CollectionView from '@/app/components/collections/CollectionView'
import { countMixes, loadCollections } from '@/app/components/collections/collections'

export const revalidate = 300

const URL = 'https://dnbdoctor.com/sample-packs'
const DESCRIPTION =
  'Download professional neurofunk sample packs, drum loops, bass samples, and sound design tools. High-quality DnB samples for producers, featuring rolling basslines, complex drums, and dark atmospheres.'

export const metadata: Metadata = {
  title: { absolute: 'Neurofunk Samples & Sample Packs | DnB Doctor - Professional Drum & Bass Sounds' },
  description: DESCRIPTION,
  alternates: { canonical: URL },
  openGraph: {
    title: 'Neurofunk Samples & Sample Packs | DnB Doctor',
    description: DESCRIPTION,
    url: URL,
    siteName: 'DnB Doctor',
    type: 'website',
    images: [{ url: 'https://dnbdoctor.com/og-image.jpg', width: 1200, height: 630, alt: 'Neurofunk Samples & Sample Packs | DnB Doctor' }],
  },
  twitter: { card: 'summary_large_image', images: ['https://dnbdoctor.com/og-image.jpg'] },
}

export default async function SamplePacksPage() {
  return <CollectionView kind="sample-packs" all={await loadCollections()} mixes={await countMixes()} />
}
