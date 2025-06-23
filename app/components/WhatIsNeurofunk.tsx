'use client'

import { motion } from 'framer-motion'
import { useRef } from 'react'
import Image from 'next/image'
import Link from 'next/link'
import Button from './Button'
import { FaUserPlus, FaInfoCircle } from 'react-icons/fa'

export default function WhatIsNeurofunk() {
  const containerRef = useRef<HTMLDivElement>(null)

  return (
    <section ref={containerRef} className="relative py-24 overflow-hidden">
      {/* Background Effects */}
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(0,255,0,0.03)_1px,transparent_1px)] bg-[size:2rem_2rem] opacity-30" />
      <div className="absolute inset-0 bg-gradient-to-b from-black via-green-900/5 to-black" />
      
      <div className="max-w-7xl mx-auto px-4">
        {/* Main Content */}
        <div className="relative z-10 grid lg:grid-cols-2 gap-12 lg:gap-20 items-center">
          {/* Left Column - Image */}
          <motion.div
            initial={{ opacity: 0, x: -50 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
            className="relative aspect-[4/3] lg:aspect-square"
          >
            <div className="absolute inset-4 rounded-2xl overflow-hidden">
              <Image
                src="/about.jpg"
                alt="About DnB Doctor"
                fill
                className="object-cover object-center"
                priority
              />
              <div className="absolute inset-0 bg-green-500/20 mix-blend-overlay" />
              
              {/* Image Caption */}
              <div className="absolute z-10 bottom-0 left-0 right-0 bg-black/70 p-3 text-sm text-center">
                <Link 
                  href="https://www.instagram.com/moor_door_music/"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-green-400 hover:text-green-300 transition-colors"
                >
                  Asana playing at moor.door.music event in Prague @ IG
                </Link>
              </div>
              
              {/* Animated Border */}
              <motion.div
                className="absolute inset-0 border border-green-500/30"
                animate={{
                  boxShadow: ['0 0 20px rgba(0,255,0,0.2)', '0 0 40px rgba(0,255,0,0.2)', '0 0 20px rgba(0,255,0,0.2)']
                }}
                transition={{ duration: 2, repeat: Infinity }}
              />
            </div>

            {/* Decorative Elements */}
            <div className="absolute inset-0 rounded-2xl border border-green-500/20 rotate-3 transition-transform" />
            <div className="absolute inset-0 rounded-2xl border border-green-500/20 -rotate-3 transition-transform" />
          </motion.div>

          {/* Right Column - Text Content */}
          <div className="space-y-8">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="space-y-4"
            >
              <h2 className="text-sm uppercase tracking-wider text-green-500 font-mono">About Us</h2>
              <h3 className="text-4xl md:text-5xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-green-500 via-purple-500 to-green-500">
                The DnB Doctor Experience
              </h3>
            </motion.div>

            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.2 }}
              className="prose prose-invert prose-green max-w-none"
            >
              <p className="text-lg text-gray-300 leading-relaxed">
                DnB Doctor is more than just a record label – we&apos;re a movement dedicated to pushing the boundaries of Neurofunk and Drum & Bass. Our mission is to cultivate and showcase the most innovative sounds in the scene.
              </p>
              
              <div className="grid md:grid-cols-2 gap-6 mt-8">
                {[
                  {
                    title: "Innovation",
                    description: "Pushing boundaries with cutting-edge sound design"
                  },
                  {
                    title: "Community",
                    description: "Building connections through shared passion"
                  },
                  {
                    title: "Quality",
                    description: "Curating the finest selections in neurofunk"
                  },
                  {
                    title: "Growth",
                    description: "Supporting emerging talent in the scene"
                  }
                ].map((item, index) => (
                  <motion.div
                    key={item.title}
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ delay: 0.2 + index * 0.1 }}
                    className="relative group"
                  >
                    <div className="absolute inset-0 bg-green-500/5 rounded-lg -z-10 group-hover:bg-green-500/10 transition-colors" />
                    <div className="p-4">
                      <h4 className="text-green-500 font-bold mb-2">{item.title}</h4>
                      <p className="text-sm text-gray-400">{item.description}</p>
                    </div>
                  </motion.div>
                ))}
              </div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              viewport={{ once: true }}
              transition={{ delay: 0.4 }}
              className="flex flex-wrap gap-4"
            >
              <motion.div
                whileHover={{ scale: 1.02 }}
                className="flex-1 min-w-[200px]"
              >
                <Button
                  href="/contact"
                  variant="infected"
                  className="w-full group"
                >
                  <FaUserPlus className="w-5 h-5 mr-2 transform group-hover:rotate-12 transition-transform duration-300" />
                  <span>Join the Movement</span>
                </Button>
              </motion.div>
              
              <motion.div
                whileHover={{ scale: 1.02 }}
                className="flex-1 min-w-[200px]"
              >
                <Button
                  href="/about"
                  variant="decayed"
                  className="w-full group"
                >
                  <FaInfoCircle className="w-5 h-5 mr-2 transform group-hover:rotate-180 transition-transform duration-500" />
                  <span>Learn More</span>
                </Button>
              </motion.div>
            </motion.div>
          </div>
        </div>
      </div>
    </section>
  )
} 