'use client'

import { motion, useReducedMotion } from 'framer-motion'
import ArtistCardsGrid, { type ArtistCardItem } from './ArtistCardsGrid'
import Button from '@/app/components/Button'

export default function ArtistsListAnimated({ artists }: { artists: ArtistCardItem[] }) {
  const shouldReduce = useReducedMotion()
  return (
    <>
      <motion.h1
        initial={shouldReduce ? undefined : { opacity: 0, y: -20 }}
        animate={shouldReduce ? undefined : { opacity: 1, y: 0 }}
        className="text-4xl md:text-6xl font-bold text-center mb-8 bg-clip-text text-transparent bg-gradient-to-r from-purple-500 via-pink-500 to-purple-500"
      >
        Neurofunk Artists
      </motion.h1>

      <div className="flex flex-col items-center gap-4 mb-10">
        <p className="text-gray-300 text-center max-w-3xl">
          Building catalogs over time. See what it means to be a{' '}
          <span className="text-green-500 font-semibold">CORE ARTIST</span> at DnB Doctor.
        </p>
        <Button href="/core-artists" variant="toxic" className="justify-center">
          CORE ARTISTS
        </Button>
      </div>

      <h3 className="text-2xl font-bold mb-8 text-center text-white">Featured <span className="text-purple-500">Neurofunk Artists</span></h3>
      <ArtistCardsGrid artists={artists} />
    </>
  )
}
