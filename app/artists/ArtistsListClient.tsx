'use client'

import dynamic from 'next/dynamic'
const ArtistsListAnimated = dynamic(() => import('./ArtistsListAnimated'))

type ArtistItem = {
  id: string
  slug: string
  name: string
  imageUrl?: string | null
  soundcloud?: string | null
  spotify?: string | null
}

export default function ArtistsListClient({ artists }: { artists: ArtistItem[] }) {
  return <ArtistsListAnimated artists={artists} />
}


