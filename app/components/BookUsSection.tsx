'use client'

import { motion } from 'framer-motion'
import { FaCalendarAlt, FaArrowRight } from 'react-icons/fa'
import Link from 'next/link'
import Image from 'next/image'

export default function BookUsSection() {
  return (
    <section className="relative py-24 overflow-hidden">
      {/* Background with gradient overlay */}
      <div className="absolute inset-0 z-0">
        <Image
          src="/party.jpg"
          alt="DJ Party"
          fill
          className="object-cover opacity-20"
          priority
        />
        <div className="absolute inset-0 bg-gradient-to-b from-black via-purple-900/10 to-black" />
      </div>

      <div className="relative z-10 max-w-7xl mx-auto px-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="grid lg:grid-cols-2 gap-12 items-center"
        >
          {/* Content */}
          <div className="space-y-8">
            <div className="inline-flex items-center px-4 py-2 rounded-full bg-purple-500/20 
              border border-purple-500/30 text-purple-400">
              <FaCalendarAlt className="w-4 h-4 mr-2" />
              Available for Bookings
            </div>
            
            <h2 className="text-4xl md:text-5xl font-bold bg-clip-text text-transparent 
              bg-gradient-to-r from-purple-500 via-pink-500 to-purple-500">
              Book Us At Your Party
            </h2>
            
            <p className="text-xl text-gray-300">
              Want to bring the neurofunk vibes to your event? We offer professional DJ services 
              for clubs, private parties, and special events.
            </p>

            <ul className="space-y-4">
              {[
                'Professional DJ Equipment',
                'Extensive Music Library',
                'Custom Playlists',
                'Sound System Available',
                'Experienced Performance',
                'Flexible Booking Options'
              ].map((feature, index) => (
                <motion.li
                  key={feature}
                  initial={{ opacity: 0, x: -20 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: index * 0.1 }}
                  className="flex items-center text-gray-300"
                >
                  <span className="w-2 h-2 rounded-full bg-purple-500 mr-3" />
                  {feature}
                </motion.li>
              ))}
            </ul>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.4 }}
            >
              <Link
                href="/contact"
                className="group inline-flex items-center gap-3 px-8 py-4 rounded-xl 
                  bg-gradient-to-r from-purple-500 to-pink-500 text-white font-medium 
                  hover:from-purple-600 hover:to-pink-600 transition-all duration-300 
                  transform hover:translate-x-1"
              >
                Book Now
                <FaArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
              </Link>
            </motion.div>
          </div>

          {/* Decorative Elements */}
          <div className="relative">
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6 }}
              className="aspect-square rounded-2xl overflow-hidden border border-purple-500/30 
                shadow-[0_0_50px_rgba(168,85,247,0.15)] relative"
            >
              <Image
                src="/dj-setup.jpg"
                alt="DJ Setup"
                fill
                className="object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent" />
              <div className="absolute z-10 bottom-0 left-0 right-0 bg-black/70 p-3 text-sm text-center">
               
                <Link 
                  href="https://www.instagram.com/greenland__dnb/"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-green-400 hover:text-green-300 transition-colors"
                >
                  Crowd at the event Green Land OA in Tešedíkovo @ IG
                </Link>
              </div>

              {/* Stats */}
              <div className="absolute bottom-10 left-0 right-0 p-8 grid grid-cols-2 gap-8">
                <div>
                  <div className="text-3xl font-bold text-purple-500">50+</div>
                  <div className="text-gray-300">Events Done</div>
                </div>
                <div>
                  <div className="text-3xl font-bold text-purple-500">100%</div>
                  <div className="text-gray-300">Satisfaction</div>
                </div>
              </div>
            </motion.div>

            {/* Floating Elements */}
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.3 }}
              className="absolute -right-4 -top-4 p-4 bg-black/80 backdrop-blur-sm rounded-xl 
                border border-purple-500/30"
            >
              <div className="text-2xl font-bold text-purple-500">5.0</div>
              <div className="text-gray-300">Rating</div>
            </motion.div>
          </div>
        </motion.div>
      </div>
    </section>
  )
} 