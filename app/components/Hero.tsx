'use client'

import { motion } from 'framer-motion'
import Image from 'next/image'
import { useState, useEffect } from 'react'

// Pre-calculated positions for server rendering
const STATIC_SPORES = Array(40).fill(null).map((_, i) => ({
  left: `${(i * 2.5) % 100}%`,
  top: `${(i * 2.5) % 100}%`,
  background: i % 3 === 0 
    ? 'rgba(0,255,0,0.2)' 
    : i % 3 === 1 
    ? 'rgba(255,0,255,0.2)' 
    : 'rgba(255,192,203,0.2)'
}))

const STATIC_TENTACLES = Array(12).fill(null).map((_, i) => ({
  d: `M ${-10 + (i * 10)} 110 Q 50 50 ${110 + (i * 10)} -10`
}))

export default function Hero() {
  const [isMounted, setIsMounted] = useState(false)

  useEffect(() => {
    setIsMounted(true)
  }, [])

  const renderTentacles = () => (
    <div className="absolute inset-0 overflow-hidden opacity-30">
      <svg className="w-full h-full" viewBox="0 0 100 100" preserveAspectRatio="none">
        {(isMounted ? Array(12).fill(null) : STATIC_TENTACLES).map((_, i) => (
          <motion.path
            key={i}
            d={isMounted ? undefined : STATIC_TENTACLES[i].d}
            className="stroke-green-500/20 fill-none"
            strokeWidth="0.5"
            animate={isMounted ? {
              d: [
                `M ${-10 + (i * 10)} 110 Q ${50 + Math.sin(i) * 40} ${50 + Math.cos(i) * 40} ${110 + Math.sin(i) * 20} ${-10 + (i * 10)}`,
                `M ${-10 + (i * 10)} 110 Q ${50 - Math.sin(i) * 40} ${50 - Math.cos(i) * 40} ${110 - Math.sin(i) * 20} ${-10 + (i * 10)}`,
                `M ${-10 + (i * 10)} 110 Q ${50 + Math.sin(i) * 40} ${50 + Math.cos(i) * 40} ${110 + Math.sin(i) * 20} ${-10 + (i * 10)}`
              ]
            } : undefined}
            transition={{ duration: 10 + i, repeat: Infinity, ease: "easeInOut" }}
          />
        ))}
      </svg>
    </div>
  )

  const renderSpores = () => (
    <>
      {(isMounted ? Array(40).fill(null) : STATIC_SPORES).map((spore, i) => (
        <motion.div
          key={i}
          className="absolute w-1 h-1 rounded-full"
          style={isMounted ? {
            background: `rgba(${
              Math.random() > 0.6 ? '0,255,0' : 
              Math.random() > 0.3 ? '255,0,255' : 
              '255,192,203'
            }, ${Math.random() * 0.3})`,
            left: `${Math.random() * 100}%`,
            top: `${Math.random() * 100}%`,
          } : {
            background: STATIC_SPORES[i].background,
            left: STATIC_SPORES[i].left,
            top: STATIC_SPORES[i].top,
          }}
          animate={isMounted ? {
            y: [-20, -40, -20],
            x: [-10, 10, -10],
            scale: [1, 1.5, 1],
            opacity: [0.2, 0.5, 0.2],
          } : undefined}
          transition={{
            duration: 3 + (i * 0.1),
            repeat: Infinity,
            delay: i * 0.1,
            ease: "easeInOut"
          }}
        />
      ))}
    </>
  )

  return (
    <div className="relative min-h-screen flex items-center justify-center overflow-hidden">
      {/* Corrupted Background Layers */}
      <div className="absolute inset-0 bg-gradient-to-b from-green-900/30 via-black to-black" />
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(0,255,0,0.03)_1px,transparent_1px)] bg-[size:2rem_2rem] opacity-50" />
      
      {/* Animated Blobs */}
      <div className="absolute inset-0 overflow-hidden">
        <motion.div 
          className="absolute -top-1/2 -left-1/2 w-full h-full rounded-full bg-green-500/10 blur-[100px] animate-blob"
          animate={{
            scale: [1, 1.2, 1],
            opacity: [0.3, 0.2, 0.3],
          }}
          transition={{ duration: 8, repeat: Infinity }}
        />
        <motion.div 
          className="absolute -bottom-1/2 -right-1/2 w-full h-full rounded-full bg-purple-800/20 blur-[100px] animate-blob animation-delay-2000"
          animate={{
            scale: [1, 1.1, 1],
            opacity: [0.2, 0.3, 0.2],
          }}
          transition={{ duration: 10, repeat: Infinity }}
        />
        <motion.div 
          className="absolute top-1/2 left-1/2 w-full h-full rounded-full bg-pink-500/10 blur-[100px] animate-blob animation-delay-4000"
          animate={{
            scale: [1, 1.3, 1],
            opacity: [0.2, 0.1, 0.2],
          }}
          transition={{ duration: 12, repeat: Infinity }}
        />
      </div>

      {renderTentacles()}

      {/* Content */}
      <div className="relative z-10 w-full pt-24 max-w-7xl mx-auto px-4 flex flex-col md:flex-row items-center gap-8 md:gap-16">
        {/* Text Content */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="text-center md:text-left flex-1"
        >
          {/* Corrupted Title */}
          <motion.h2 
            className="text-green-500 font-mono text-xl mb-4 relative inline-block"
            animate={{ textShadow: ['0 0 8px rgb(0,255,0)', '0 0 12px rgb(0,255,0)', '0 0 8px rgb(0,255,0)'] }}
            transition={{ duration: 2, repeat: Infinity }}
          >
            Welcome to the Laboratory
          </motion.h2>
          
          <h1 className="text-5xl md:text-7xl font-bold mb-8 tracking-tighter">
            The<br />
            <span className="bg-clip-text text-transparent bg-gradient-to-r from-green-500 via-purple-500 to-pink-500">
              DnB Doctor
            </span><br />
            will see you now
          </h1>

          <motion.p 
            className="text-gray-400 text-lg md:text-xl max-w-2xl mx-auto md:mx-0 mb-12"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.3 }}
          >
            Step into our sonic laboratory where we cultivate the most infectious strains of neurofunk. Your prescription for auditory elevation awaits.
          </motion.p>

          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.5 }}
            className="space-x-4 flex flex-col md:flex-row md:space-y-0 space-y-4" 
          >
            <motion.button 
              className="relative group px-8 py-3 rounded-full overflow-hidden"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => {
                window.open('https://dnbdoctor.com/music', '_blank')
              }}
            >
              <span className="absolute inset-0 bg-gradient-to-r from-green-500 via-purple-500 to-pink-500 group-hover:opacity-80 transition-opacity" />
              <span className="relative text-white font-medium flex items-center gap-2">
                Enter Laboratory
                <motion.span
                  animate={{ x: [0, 5, 0] }}
                  transition={{ duration: 1.5, repeat: Infinity }}
                >
                  →
                </motion.span>
              </span>
            </motion.button>

            <motion.button 
              className="relative group px-8 py-3 rounded-full overflow-hidden border border-green-500/30"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => {
                window.open('https://dnbdoctor.com/submit-demo', '_blank')
              }}
            >
              <span className="absolute inset-0 bg-green-500/10 group-hover:bg-green-500/20 transition-colors" />
              <span className="relative text-green-500 font-medium">
                Submit Sample
              </span>
            </motion.button>
          </motion.div>
        </motion.div>

        {/* Doctor Image */}
        <motion.div
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 1, delay: 0.2 }}
          className="relative w-full md:w-1/2 aspect-square md:aspect-auto md:h-[600px]"
        >
          <div className="absolute inset-0 rounded-3xl overflow-hidden">
            <Image
              src="/doctor.webp"
              alt="DnB Doctor"
              fill
              className="object-cover object-center"
              priority
              sizes="(max-width: 768px) 100vw, 50vw"
            />
            {/* Glowing overlay */}
            <div className="absolute inset-0 bg-gradient-to-t from-black via-transparent to-transparent" />
            <div className="absolute inset-0 bg-green-500/20 mix-blend-overlay" />
            
            {/* Animated border */}
            <motion.div
              className="absolute inset-0 border-2 border-green-500/30 rounded-3xl"
              animate={{
                boxShadow: ['0 0 20px rgba(0,255,0,0.2)', '0 0 40px rgba(0,255,0,0.2)', '0 0 20px rgba(0,255,0,0.2)']
              }}
              transition={{ duration: 2, repeat: Infinity }}
            />
          </div>
        </motion.div>
      </div>

      {renderSpores()}
    </div>
  )
} 