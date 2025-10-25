import Hero from './components/Hero'
import LatestMusic from './components/LatestMusic'
import WhatIsNeurofunk from './components/WhatIsNeurofunk'
import BookUsSection from './components/BookUsSection'
import FeaturedArtists from './components/FeaturedArtists'
import ListenNow from './components/ListenNow'
import { Suspense } from 'react'

export default function Home() {
  return (
    <main>
      <Hero />
      <Suspense fallback={<div style={{height: 600}} />}> 
        <LatestMusic />
      </Suspense>
      <Suspense fallback={<div style={{height: 400}} />}> 
        <ListenNow />
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
