'use client'

import { motion } from 'framer-motion'
import Image from 'next/image'
import { FaHeadphones, FaMicrochip } from 'react-icons/fa'
import AffiliateLinks from '../components/AffiliateLinks'
import { djLinks, producerLinks } from '@/lib/affiliates'

export default function RecommendedToolsClient() {
  return (
    <>
      {/* Hero */}
      <div className="relative min-h-[50vh] flex items-center justify-center overflow-hidden">
        <div className="absolute inset-0 z-0">
          <Image
            src="/music-bg.jpeg"
            alt="Recommended Tools Background"
            fill
            sizes="100vw"
            className="object-cover opacity-60"
            priority
          />
          <div className="absolute inset-0 bg-gradient-to-b from-black via-purple-900/30 to-black" />
        </div>

        <div className="relative z-10 text-center px-4 max-w-4xl mx-auto">
          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="text-5xl md:text-7xl font-bold mb-6"
          >
            <span className="bg-clip-text text-transparent bg-gradient-to-r from-green-500 via-purple-500 to-green-500">
              Recommended Tools
            </span>
          </motion.h1>
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="text-xl text-gray-300 max-w-2xl mx-auto"
          >
            Our hand-picked selection of the best platforms for DJing and music production.
          </motion.p>
        </div>
      </div>

      {/* DJ Section */}
      <section className="py-20 px-4 relative">
        <div className="absolute inset-0 bg-gradient-to-b from-black via-green-900/5 to-black" />
        <div className="max-w-7xl mx-auto relative z-10">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="flex items-center gap-4 mb-10"
          >
            <FaHeadphones className="w-8 h-8 text-green-500" />
            <h2 className="text-4xl font-bold text-white">
              For <span className="text-green-500">DJs</span>
            </h2>
          </motion.div>
          <p className="text-gray-400 mb-10 max-w-3xl">
            Whether you&apos;re playing clubs or festivals, these platforms give you access to
            the latest tracks, exclusive edits, and essential DJ tools.
          </p>
          <AffiliateLinks links={djLinks} title={undefined} layout="grid" />
        </div>
      </section>

      {/* Producer Section */}
      <section className="py-20 px-4 relative">
        <div className="absolute inset-0 bg-gradient-to-b from-black via-purple-900/5 to-black" />
        <div className="max-w-7xl mx-auto relative z-10">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="flex items-center gap-4 mb-10"
          >
            <FaMicrochip className="w-8 h-8 text-purple-500" />
            <h2 className="text-4xl font-bold text-white">
              For <span className="text-purple-500">Producers</span>
            </h2>
          </motion.div>
          <p className="text-gray-400 mb-10 max-w-3xl">
            From VST plugins to sample packs — everything you need to craft neurofunk basslines,
            complex drums, and dark atmospheres.
          </p>
          <AffiliateLinks links={producerLinks} title={undefined} layout="grid" />
        </div>
      </section>

      {/* Disclosure */}
      <section className="py-10 px-4">
        <div className="max-w-7xl mx-auto text-center">
          <p className="text-sm text-gray-500">
            Some of the links above are affiliate links. If you make a purchase through them,
            we may earn a commission at no extra cost to you. This helps support DnB Doctor.
          </p>
        </div>
      </section>
    </>
  )
}
