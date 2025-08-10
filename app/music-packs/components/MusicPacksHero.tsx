'use client'

import Image from 'next/image'
import { motion } from 'framer-motion'
import { FaBox } from 'react-icons/fa'
import Button from '../../components/Button'

type Props = {
  onBrowse: () => void
}

export default function MusicPacksHero({ onBrowse }: Props) {
  return (
    <div className="relative h-[60vh] md:h-[70vh] flex items-center justify-center overflow-hidden">
      <div className="absolute inset-0 z-0">
        <Image src="/music-bg.jpeg" alt="Music Packs" fill className="object-cover opacity-80" priority />
        <div className="absolute inset-0 bg-gradient-to-b from-black via-purple-900/30 to-black" />
      </div>
      <div className="relative z-10 text-center px-4 max-w-4xl mx-auto">
        <motion.h1 initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }} className="text-5xl md:text-7xl font-bold mb-6">
          <span className="bg-clip-text text-transparent bg-gradient-to-r from-purple-500 via-pink-500 to-purple-500">Music Packs</span>
        </motion.h1>
        <motion.p initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }} className="text-xl md:text-2xl text-gray-300 flex items-center justify-center gap-3">
          <FaBox className="w-5 h-5 text-purple-500" />
          <span>Complete music collections</span>
          <FaBox className="w-5 h-5 text-purple-500" />
        </motion.p>
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 }} className="mt-8">
          <Button variant="infected" onClick={onBrowse} className="group text-lg">
            <span>Browse Music Packs</span>
            <FaBox className="w-5 h-5 ml-2 group-hover:rotate-180 transition-transform duration-500" />
          </Button>
        </motion.div>
      </div>
    </div>
  )
}


