import type { Metadata } from 'next'
import RecommendedToolsClient from './RecommendedToolsClient'

export const metadata: Metadata = {
  title: 'Recommended Tools for DJs & Producers',
  description:
    'Curated selection of the best platforms for DJing and music production. Beatport, DJCity, Plugin Boutique, Loopcloud, and Loopmasters.',
  openGraph: {
    title: 'Recommended Tools for DJs & Producers | DnB Doctor',
    description:
      'Curated selection of the best platforms for DJing and music production.',
    url: 'https://dnbdoctor.com/recommended-tools',
  },
  alternates: {
    canonical: 'https://dnbdoctor.com/recommended-tools',
  },
}

export default function RecommendedToolsPage() {
  return <RecommendedToolsClient />
}
