import Hero from './components/Hero'
import LatestMusic from './components/LatestMusic'
import WhatIsNeurofunk from './components/WhatIsNeurofunk'
import BookUsSection from './components/BookUsSection'
import FeaturedArtists from './components/FeaturedArtists'

export default function Home() {
  return (
    <main>
      <Hero />
      <LatestMusic />
      <WhatIsNeurofunk />
      <FeaturedArtists />
      <BookUsSection />
    </main>
  )
}
