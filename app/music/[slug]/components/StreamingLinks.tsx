'use client'

import { motion } from 'framer-motion'
import Image from 'next/image'
import { FaBiohazard, FaSkull, FaSyringe } from 'react-icons/fa'
import Button from '@/app/components/Button'
import SafeIcon from '@/app/components/SafeIcon'
import { StreamingLink } from '@/app/types/release'

interface StreamingLinksProps {
  links: StreamingLink[]
  gumroadUrl?: string
}

const StreamingLinks = ({ links, gumroadUrl }: StreamingLinksProps) => {
  const availableLinks = links.filter(link => link.url);

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="space-y-8"
    >
      <div className="text-center">
        <motion.div
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{ 
            type: "spring",
            stiffness: 260,
            damping: 20 
          }}
          className="inline-flex items-center justify-center w-20 h-20 
            rounded-full bg-purple-500/20 mb-4 relative group
            before:absolute before:inset-0 before:rounded-full 
            before:bg-gradient-to-r before:from-purple-500/20 before:to-pink-500/20 
            before:animate-spin-slow"
        >
          <div className="absolute inset-0 rounded-full bg-gradient-to-r from-purple-500/20 to-pink-500/20 
            blur-xl group-hover:blur-2xl transition-all duration-500" />
          
          <SafeIcon 
            Icon={FaBiohazard} 
            className="w-10 h-10 text-purple-500 relative z-10 
              group-hover:scale-110 group-hover:rotate-180 transition-all duration-500" 
          />
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="relative"
        >
          <h2 className="text-3xl font-bold mb-2 bg-clip-text text-transparent 
            bg-gradient-to-r from-purple-500 via-pink-500 to-purple-500
            pb-1"
          >
            Choose Your Infection Vector
          </h2>
          <p className="text-gray-400 flex items-center justify-center gap-2">
            <SafeIcon Icon={FaSyringe} className="w-4 h-4 text-purple-500 rotate-45" />
            <span>Select your preferred method of contamination</span>
            <SafeIcon Icon={FaSyringe} className="w-4 h-4 text-purple-500 -rotate-45" />
          </p>
        </motion.div>
      </div>

      <div className="grid grid-cols-1 gap-3">
        {availableLinks
          .sort((a, b) => (b.priority ?? 0) - (a.priority ?? 0))
          .map((platform, index) => (
            <motion.div
              key={platform.name}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: index * 0.1 }}
            >
              <Button
                variant="infected"
                onClick={(e) => {
                  e.preventDefault();
                  setTimeout(() => {
                    if (typeof window !== 'undefined') {
                      window?.open(platform.url, '_blank', 'noopener,noreferrer');
                    }
                  }, 100);
                }}
                className="w-full group relative overflow-hidden"
              >
                <div className="flex items-center gap-4 p-4">
                  <div className="relative">
                    <div className="absolute inset-0 bg-purple-500/20 blur-xl 
                      group-hover:bg-purple-500/40 transition-all duration-500" />
                    {typeof platform.icon === 'string' ? (
                      <Image 
                        src={platform.icon}
                        alt={platform.name}
                        width={24}
                        height={24}
                        className="w-8 h-8 relative z-10"
                      />
                    ) : (
                      <platform.icon className="w-8 h-8 relative z-10" />
                    )}
                  </div>
                  
                  <div className="flex flex-col items-start flex-1">
                    <span className="text-sm opacity-70 group-hover:opacity-90 transition-opacity
                      flex items-center gap-2"
                    >
                      <SafeIcon Icon={FaSkull} className="w-3 h-3" />
                      <span>Spread through</span>
                    </span>
                    <span className="text-xl font-bold">
                      {platform.name}
                    </span>
                  </div>

                  <SafeIcon 
                    Icon={FaSyringe} 
                    className="w-5 h-5 transform rotate-45 
                      group-hover:translate-x-1 group-hover:-translate-y-1 
                      transition-transform duration-300" 
                  />
                </div>
              </Button>
            </motion.div>
          ))}
      </div>

      {gumroadUrl && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="mt-8 flex justify-center"
        >
          <a
            href={gumroadUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="block w-full max-w-md"
          >
            <Button
              variant="toxic"
              size="lg"
              className="w-full group text-2xl py-6 px-12 flex items-center justify-center"
            >
              <svg className="w-7 h-7 mr-3" viewBox="0 0 32 32" fill="none" xmlns="http://www.w3.org/2000/svg">
                <rect width="32" height="32" rx="8" fill="#fff"/>
                <path d="M23.5 10.5c-1.1 0-2 .9-2 2v7c0 1.1-.9 2-2 2h-7c-1.1 0-2-.9-2-2v-7c0-1.1.9-2 2-2h7c1.1 0 2 .9 2 2v7c0 1.1-.9 2-2 2h-7" stroke="#00B6B9" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                <path d="M13 19c0 1.1.9 2 2 2s2-.9 2-2" stroke="#00B6B9" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
              <span>Get Sample Pack on Gumroad</span>
            </Button>
          </a>
        </motion.div>
      )}
    </motion.div>
  )
}

export default StreamingLinks 