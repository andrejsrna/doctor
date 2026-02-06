'use client'

import { motion } from 'framer-motion'
import Image from 'next/image'

const galleryItems = [
  {
    type: 'image',
    src: '/gallery/wax.jpeg',
    alt: 'DnB Doctor Live Performance',
    title: 'Live at Wax (2024)',
    description: 'With a packed house and a great vibe, we played a great set and had a lot of fun!',
  },
  {
    type: 'video',
    src: '/gallery/neurotikum.mp4',
    poster: '/gallery/cooking.jpeg',
    alt: 'DnB Doctor in Action',
    title: 'Cooking with Neurotikum (2023)',
    description: 'Sun shininig in our faces, fresh neurofunk coming from the speakers and Dynamo doing quality control.',
  },
  {
    type: 'image',
    src: '/gallery/minidynamo.jpeg',
    alt: 'Studio Session',
    title: 'Mini & Dynamo (2023 & 2021)',
    description: 'The best neurofunk cats in the game, together at last.',
  },
  {
    type: 'image',
    src: '/gallery/moordoor.jpeg',
    alt: 'Live Event',
    title: 'Moordoor (2024)',
    description: 'We played a great set at Moordoor in Prague. It was a lot of fun and we had a great time!',
  },
]

export default function Gallery() {
  return (
    <section className="py-20 relative overflow-hidden">
      {/* Background Elements */}
      <div className="absolute inset-0 bg-gradient-to-b from-black via-purple-900/10 to-black" />
      <div className="absolute inset-0 bg-[url('/pattern.png')] opacity-20" />
      
      <div className="max-w-7xl mx-auto px-4 relative z-10">
        <div className="text-center mb-16">
          <motion.h2 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-4xl md:text-5xl font-bold mb-6"
          >
            Doctor & <span className="text-transparent bg-clip-text bg-gradient-to-r from-purple-500 to-purple-300">You</span>
          </motion.h2>
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.2 }}
            className="text-gray-400 max-w-2xl mx-auto text-lg"
          >
            Experience the energy and passion of DnB Doctor through our visual journey. From studio sessions to live performances, these moments capture the essence of our musical adventure.
          </motion.p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {galleryItems.map((item, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.1 }}
              className="group"
            >
              {/* Media Container */}
              <div className="relative aspect-video mb-4">
                <div className="absolute inset-0 bg-purple-500/10 rounded-xl transform group-hover:scale-95 transition-transform duration-500" />
                
                {item.type === 'video' ? (
                  <div className="relative w-full h-full rounded-xl overflow-hidden">
                    <video
                      poster={item.poster}
                      controls
                      className="w-full h-full object-cover"
                    >
                      <source src={item.src} type="video/mp4" />
                      Your browser does not support the video tag.
                    </video>
                  </div>
                ) : (
                  <div className="relative w-full h-full rounded-xl overflow-hidden">
                    <Image
                      src={item.src}
                      alt={item.alt}
                      fill
                      sizes="(max-width: 768px) 100vw, 50vw"
                      className="object-cover transform group-hover:scale-105 transition-transform duration-500"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                  </div>
                )}
              </div>

              {/* Content */}
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1 + 0.2 }}
                className="bg-white/5 backdrop-blur-sm rounded-xl p-6 border border-white/10"
              >
                <h3 className="text-xl font-bold mb-2 bg-gradient-to-r from-white to-gray-300 bg-clip-text text-transparent">
                  {item.title}
                </h3>
                <p className="text-gray-400 text-sm leading-relaxed">
                  {item.description}
                </p>
              </motion.div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  )
} 
