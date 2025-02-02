import Hero from './components/Hero'
import FeaturedTrack from './components/FeaturedTrack'
import LatestMusic from './components/LatestMusic'
import WhatIsNeurofunk from './components/WhatIsNeurofunk'
import BookUsSection from './components/BookUsSection'
import FeaturedArtists from './components/FeaturedArtists'

export default function Home() {
  return (
    <main>
      <Hero />
      <FeaturedTrack />
      <LatestMusic />
      <WhatIsNeurofunk />
      <FeaturedArtists />
      <BookUsSection />
    </main>
  )
}
