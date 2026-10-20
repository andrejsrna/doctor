// server component: pulls the newest signings + their release footprint
import { getRosterArtists } from '@/lib/artistRoster'
import FeaturedArtistsRoster from './FeaturedArtistsRoster'

const COUNT = 8

export default async function FeaturedArtists() {
  const { artists, total } = await getRosterArtists(COUNT)
  if (!artists.length) return null
  return <FeaturedArtistsRoster artists={artists} total={total} />
}
