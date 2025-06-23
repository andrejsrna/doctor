'use client'

import { motion } from 'framer-motion'
import Image from 'next/image'
import { useState, useEffect } from 'react'
import Button from './Button'

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
      {/* Background Image with Overlay */}
      <div className="absolute inset-0">
        <Image
          src="/mainbg.jpeg"
          alt="Hero Background"
          fill
          className="object-cover"
          priority
          sizes="100vw"
        />
        <div className="absolute inset-0 bg-gradient-to-b from-green-900/30 via-black/70 to-black" />
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(0,255,0,0.03)_1px,transparent_1px)] bg-[size:2rem_2rem] opacity-50" />
      </div>
      

      {/* Centered Content */}
      <div className="relative z-10 max-w-4xl mx-auto px-4 text-center">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
        >
          <motion.h2 
            className="text-green-500 font-mono text-xl mb-4 inline-block"
            animate={{ textShadow: ['0 0 8px rgb(0,255,0)', '0 0 12px rgb(0,255,0)', '0 0 8px rgb(0,255,0)'] }}
            transition={{ duration: 2, repeat: Infinity }}
          >
            Biohazard Level: Maximum
          </motion.h2>
          
          <h1 className="text-5xl md:text-7xl font-bold mb-8 tracking-tighter">
            The<br />
            <span className="bg-clip-text text-transparent bg-gradient-to-r from-green-500 via-purple-500 to-pink-500">
              Infection
            </span><br />
            Spreads Tonight
          </h1>

          <motion.p 
            className="text-gray-400 text-lg md:text-xl max-w-2xl mx-auto mb-12"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.3 }}
          >
            Enter our contaminated soundscape where we engineer the most virulent strains of neurofunk. Let the bass infection take control as we mutate your audio DNA.
          </motion.p>

          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.5 }}
            className="flex flex-col sm:flex-row justify-center items-center gap-4"
          >
            <motion.div 
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="relative group"
            >
              <svg className="absolute -inset-4 w-[calc(100%+2rem)] h-[calc(100%+2rem)]">
                <defs>
                  <filter id="toxic-noise">
                    <feTurbulence type="fractalNoise" baseFrequency="0.015" numOctaves="4" />
                    <feDisplacementMap in="SourceGraphic" scale="10" />
                  </filter>
                </defs>
                <motion.path
                  d="M20,20 Q30,10 50,10 T80,20 Q90,40 80,60 T50,90 Q30,90 20,60 T20,20"
                  fill="none"
                  stroke="rgba(0,255,0,0.3)"
                  strokeWidth="2"
                  filter="url(#toxic-noise)"
                  animate={{
                    d: [
                      "M20,20 Q30,10 50,10 T80,20 Q90,40 80,60 T50,90 Q30,90 20,60 T20,20",
                      "M25,25 Q35,15 50,15 T75,25 Q85,45 75,65 T50,85 Q35,85 25,65 T25,25"
                    ]
                  }}
                  transition={{ duration: 8, repeat: Infinity, ease: "easeInOut" }}
                />
              </svg>
              <Button 
                href="/music"
                variant="toxic"
                size="lg"
                className="relative"
              >
                Initiate Infection
                <motion.span
                  animate={{ x: [0, 5, 0] }}
                  transition={{ duration: 1.5, repeat: Infinity }}
                  className="ml-2"
                >
                  →
                </motion.span>
              </Button>
            </motion.div>

            <motion.div 
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="relative group"
            >
              <svg className="absolute -inset-4 w-[calc(100%+2rem)] h-[calc(100%+2rem)]">
                <defs>
                  <filter id="infected-noise">
                    <feTurbulence type="fractalNoise" baseFrequency="0.02" numOctaves="4" />
                    <feDisplacementMap in="SourceGraphic" scale="8" />
                  </filter>
                </defs>
                <motion.path
                  d="M20,20 Q30,10 50,10 T80,20 Q90,40 80,60 T50,90 Q30,90 20,60 T20,20"
                  fill="none"
                  stroke="rgba(255,0,255,0.3)"
                  strokeWidth="2"
                  filter="url(#infected-noise)"
                  animate={{
                    d: [
                      "M20,20 Q30,10 50,10 T80,20 Q90,40 80,60 T50,90 Q30,90 20,60 T20,20",
                      "M25,25 Q35,15 50,15 T75,25 Q85,45 75,65 T50,85 Q35,85 25,65 T25,25"
                    ]
                  }}
                  transition={{ duration: 8, repeat: Infinity, ease: "easeInOut", delay: 0.5 }}
                />
              </svg>
              <Button
                href="/submit-demo"
                variant="infected"
                size="lg"
                className="relative"
              >
                Submit Specimen
              </Button>
            </motion.div>
          </motion.div>
        </motion.div>
      </div>

    </div>
  )
} 