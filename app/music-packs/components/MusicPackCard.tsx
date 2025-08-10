'use client'

import Image from 'next/image'
import { motion } from 'framer-motion'
import Button from '../../components/Button'
import { FaInfoCircle, FaPause, FaPlay } from 'react-icons/fa'

export type MusicPackItem = {
  id: string | number
  title: string
  slug: string
  imageUrl?: string | null
  previewUrl?: string | null
}

type Props = {
  item: MusicPackItem
  isPlaying: boolean
  error: string | undefined
  onTogglePlay: (id: string | number) => void
}

export default function MusicPackCard({ item, isPlaying, error, onTogglePlay }: Props) {
  const audioId = `audio-${item.id}`
  return (
    <motion.article initial={{ opacity: 1, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} className="group relative aspect-square bg-black/50 backdrop-blur-lg rounded-lg overflow-hidden border border-purple-500/30 hover:border-purple-500/50 transition-all duration-300">
      {item.previewUrl && (
        <audio id={audioId} preload="none">
          <source src={item.previewUrl} type="audio/mpeg" />
        </audio>
      )}
      {item.imageUrl ? (
        <div className="relative aspect-square">
          <Image src={item.imageUrl} alt={item.title} fill sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw" className="object-contain p-4 group-hover:scale-105 transition-transform duration-500" />
        </div>
      ) : (
        <div className="absolute inset-0 flex items-center justify-center text-gray-500">No image</div>
      )}
      <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex flex-col justify-end p-6">
        <h3 className="text-xl font-bold text-white mb-4 line-clamp-2">{item.title}</h3>
        <div className="flex gap-3">
          {item.previewUrl && (
            <motion.div whileHover={{ scale: 1.02 }} className="flex-1">
              <Button onClick={(e) => { e.preventDefault(); onTogglePlay(item.id) }} variant="toxic" className="w-full group">
                {isPlaying ? (
                  <>
                    <FaPause className="w-4 h-4 mr-2" />
                    <span>Pause</span>
                  </>
                ) : (
                  <>
                    <FaPlay className="w-4 h-4 mr-2" />
                    <span>{error ? 'Error' : 'Preview'}</span>
                  </>
                )}
              </Button>
            </motion.div>
          )}
          {error && <div className="absolute bottom-20 left-0 right-0 text-center text-red-500 text-sm bg-red-500/10 border border-red-500/30 py-2">{error}</div>}
          <motion.div whileHover={{ scale: 1.02 }} className="flex-1">
            <Button href={`/music/${item.slug}`} variant="infected" className="w-full group">
              <FaInfoCircle className="w-4 h-4 mr-2" />
              <span>Show More</span>
            </Button>
          </motion.div>
        </div>
      </div>
    </motion.article>
  )
}


