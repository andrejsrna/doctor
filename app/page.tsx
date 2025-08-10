import Hero from './components/Hero'
import FeaturedTrack from './components/FeaturedTrack'
import LatestMusic from './components/LatestMusic'
import WhatIsNeurofunk from './components/WhatIsNeurofunk'
import BookUsSection from './components/BookUsSection'
import FeaturedArtists from './components/FeaturedArtists'
import SpotifyPlaylists from './components/SpotifyPlaylists'
import { Suspense } from 'react'

export default function Home() {
  return (
    <main>
      <Hero />
      <Suspense fallback={<div style={{height: 400}} />}> 
        {/* server-rendered, cached */}
        <FeaturedTrack />
      </Suspense>
      <Suspense fallback={<div style={{height: 600}} />}> 
        <LatestMusic />
      </Suspense>
      <Suspense fallback={<div style={{height: 400}} />}> 
        <SpotifyPlaylists />
      </Suspense>
      <WhatIsNeurofunk />
      <Suspense fallback={<div style={{height: 500}} />}> 
        <FeaturedArtists />
      </Suspense>
      <Suspense fallback={<div style={{height: 500}} />}> 
        <BookUsSection />
      </Suspense>
    </main>
  )
}
