import Hero from './components/Hero'
import LatestMusic from './components/LatestMusic'
import MusicPacksSection from './components/MusicPacksSection'
import SamplePacksSection from './components/SamplePacksSection'
import NeurofunkDnBMixesSection from './components/NeurofunkDnBMixesSection'
import ExperienceAndBooking from './components/ExperienceAndBooking'
import FeaturedArtists from './components/FeaturedArtists'
import ListenNow from './components/ListenNow'
import { Suspense } from 'react'
import type { Metadata } from 'next'

export const revalidate = 300

const SITE = 'https://dnbdoctor.com'
const TITLE = 'DnB Doctor – Neurofunk Drum & Bass Record Label'
const DESCRIPTION =
  'Independent neurofunk drum & bass label with 140+ releases from 70+ artists. Stream new music, grab a free sample pack, listen to DJ mixes or submit your demo.'

export const metadata: Metadata = {
  title: { absolute: TITLE },
  description: DESCRIPTION,
  alternates: { canonical: SITE },
  openGraph: { title: TITLE, description: DESCRIPTION, url: SITE, type: 'website', siteName: 'DnB Doctor' },
  twitter: { card: 'summary_large_image', title: TITLE, description: DESCRIPTION },
}

const jsonLd = [
  {
    '@context': 'https://schema.org',
    '@type': 'Organization',
    '@id': `${SITE}/#organization`,
    name: 'DnB Doctor',
    url: SITE,
    logo: `${SITE}/brand/dnb-doctor-logo.webp`,
    description: 'Independent neurofunk drum & bass record label.',
    sameAs: [
      'https://www.instagram.com/dnbdoctor/',
      'https://www.facebook.com/dnbdoctor',
      'https://www.youtube.com/@dnbdoctor1',
      'https://soundcloud.com/dnbdoctor',
      'https://dnbdoctor.bandcamp.com/',
      'https://www.beatport.com/label/dnb-doctor/75618',
    ],
  },
  {
    '@context': 'https://schema.org',
    '@type': 'WebSite',
    '@id': `${SITE}/#website`,
    name: 'DnB Doctor',
    url: SITE,
    publisher: { '@id': `${SITE}/#organization` },
    potentialAction: {
      '@type': 'SearchAction',
      target: { '@type': 'EntryPoint', urlTemplate: `${SITE}/search?q={search_term_string}` },
      'query-input': 'required name=search_term_string',
    },
  },
]

export default function Home() {
  return (
    <main>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />
      <Hero />
      <Suspense fallback={<div style={{height: 600}} />}>
        <LatestMusic />
      </Suspense>
      <Suspense fallback={<div style={{height: 600}} />}>
        <MusicPacksSection />
      </Suspense>
      <Suspense fallback={<div style={{height: 600}} />}>
        <SamplePacksSection />
      </Suspense>
      <Suspense fallback={<div style={{height: 520}} />}>
        <NeurofunkDnBMixesSection />
      </Suspense>
      <Suspense fallback={<div style={{height: 400}} />}>
        <ListenNow />
      </Suspense>
      <Suspense fallback={<div style={{height: 500}} />}>
        <FeaturedArtists />
      </Suspense>
      <Suspense fallback={<div style={{height: 900}} />}>
        <ExperienceAndBooking />
      </Suspense>
    </main>
  )
}
