import Hero from './components/Hero'
import FeaturedTrack from './components/FeaturedTrack'
import LatestMusic from './components/LatestMusic'
import WhatIsNeurofunk from './components/WhatIsNeurofunk'
import BookUsSection from './components/BookUsSection'
import FeaturedArtists from './components/FeaturedArtists'
import SpotifyPlaylists from './components/SpotifyPlaylists'

export default function Home() {
  return (
    <main>
      <Hero />
      <FeaturedTrack />
      <LatestMusic />
      <SpotifyPlaylists />
      <WhatIsNeurofunk />
      <FeaturedArtists />
      <BookUsSection />
    </main>
  )
}
