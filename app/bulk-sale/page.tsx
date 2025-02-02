'use client'

import { motion } from 'framer-motion'
import Link from 'next/link'
import { FaBandcamp } from 'react-icons/fa'

export default function BulkSalePage() {
  return (
    <section className="py-32 px-4 min-h-screen relative">
      {/* Gradient Background */}
      <div className="absolute inset-0 bg-gradient-to-b from-black via-purple-900/10 to-black" />
      
      <div className="max-w-4xl mx-auto relative z-10">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="space-y-12"
        >
          {/* Header */}
          <div className="text-center space-y-4">
            <h1 className="text-4xl md:text-6xl font-bold bg-clip-text text-transparent 
              bg-gradient-to-r from-purple-500 via-pink-500 to-purple-500">
              Bulk Sale
            </h1>
            <p className="text-xl text-gray-300">
              Get our entire discography with a permanent 35% discount
            </p>
          </div>

          {/* Main Content */}
          <div className="bg-black/50 backdrop-blur-sm rounded-2xl p-8 border border-purple-500/10
            shadow-[0_0_15px_rgba(168,85,247,0.1)]">
            <div className="prose prose-invert prose-purple max-w-none">
              <p className="text-lg">
                You can buy our entire back-catalogue (discography) with permanent 35% discount. 
                To use this special offer, follow these steps:
              </p>

              <ol className="space-y-8 mt-8">
                <motion.li
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.1 }}
                  className="flex items-start gap-4"
                >
                  <span className="flex-shrink-0 w-8 h-8 flex items-center justify-center 
                    bg-purple-500/20 rounded-full text-purple-400 font-bold">
                    1
                  </span>
                  <div className="space-y-2">
                    <p>Click on the following link. This link will redirect you on our Bandcamp page, 
                      where the offer for bulk discount is located.</p>
                    <Link 
                      href="https://dnbdoctor.bandcamp.com/track/asana-neurofunk-code" 
                      target="_blank"
                      className="inline-flex items-center gap-2 px-4 py-2 bg-purple-500/20 
                        hover:bg-purple-500/30 rounded-lg transition-all duration-300"
                    >
                      <FaBandcamp className="w-5 h-5" />
                      <span>Visit our Bandcamp</span>
                    </Link>
                  </div>
                </motion.li>

                <motion.li
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.2 }}
                  className="flex items-start gap-4"
                >
                  <span className="flex-shrink-0 w-8 h-8 flex items-center justify-center 
                    bg-purple-500/20 rounded-full text-purple-400 font-bold">
                    2
                  </span>
                  <p>Click on &quot;Buy Digital Discography&quot;. It will open a new popup.</p>
                </motion.li>

                <motion.li
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.3 }}
                  className="flex items-start gap-4"
                >
                  <span className="flex-shrink-0 w-8 h-8 flex items-center justify-center 
                    bg-purple-500/20 rounded-full text-purple-400 font-bold">
                    3
                  </span>
                  <p>In the popup that opens, write the minimum price (or more if you want!), 
                    and click checkout. Then follow the classic Bandcamp checkout process and 
                    after purchasing the items, you will find them in your Bandcamp collection. 
                    You can redownload the files anytime you want!</p>
                </motion.li>
              </ol>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  )
} 