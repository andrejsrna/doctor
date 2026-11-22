import type { Metadata } from 'next'
import CollectionView from '@/app/components/collections/CollectionView'
import { countMixes, loadCollections } from '@/app/components/collections/collections'

export const revalidate = 300

const URL = 'https://dnbdoctor.com/sample-packs'
const TITLE = 'Free Neurofunk Sample Pack: Loops, One-Shots & Serum Presets'
const DESCRIPTION =
  'Free neurofunk sample pack: 60 royalty-free 24-bit WAVs at 174 BPM — bass loops, drum loops, tops and bass one-shots. Plus the Yehor DnB sample pack with 11 Serum presets.'

export const metadata: Metadata = {
  title: { absolute: `${TITLE} | DnB Doctor` },
  description: DESCRIPTION,
  alternates: { canonical: URL },
  openGraph: {
    title: TITLE,
    description: DESCRIPTION,
    url: URL,
    siteName: 'DnB Doctor',
    type: 'website',
    images: [{ url: 'https://dnbdoctor.com/og-image.jpg', width: 1200, height: 630, alt: TITLE }],
  },
  twitter: { card: 'summary_large_image', images: ['https://dnbdoctor.com/og-image.jpg'] },
}

export default async function SamplePacksPage() {
  return <CollectionView kind="sample-packs" all={await loadCollections()} mixes={await countMixes()} />
}
