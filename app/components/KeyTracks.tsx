"use client"
import { motion } from 'framer-motion'
import { keyTrackEmbedUrls } from './data/keyTracks'

export default function KeyTracks({ title = 'Key Tracks' }: { title?: string }) {
  return (
    <section className="max-w-6xl mx-auto px-6 py-16">
      <div className="mb-8 text-center">
        <h2 className="text-3xl md:text-4xl font-bold">{title}</h2>
        <p className="mt-2 text-gray-400">Essential cuts that define the sound.</p>
      </div>
      <div className="grid gap-6 max-w-3xl mx-auto">
        {keyTrackEmbedUrls.map((src, idx) => (
          <motion.div
            key={src}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.15 * (idx + 1) }}
            className="bg-black/30 border border-purple-500/10 rounded-xl p-6 backdrop-blur-sm"
          >
            <iframe
              width="100%"
              height="166"
              scrolling="no"
              frameBorder="no"
              allow="autoplay"
              src={src}
              className="rounded-lg"
            />
          </motion.div>
        ))}
      </div>
    </section>
  )
}


