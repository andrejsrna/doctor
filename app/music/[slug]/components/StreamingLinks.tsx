'use client'

import { motion } from 'framer-motion'
import Image from 'next/image'
import { FaHeadphonesAlt, FaAngleRight } from 'react-icons/fa'
import Button from '@/app/components/Button'
import { StreamingLink } from '@/app/types/release'

interface StreamingLinksProps {
  links: StreamingLink[]
  gumroadUrl?: string
}

const StreamingLinks = ({ links, gumroadUrl }: StreamingLinksProps) => {
  const availableLinks = links.filter((link) => link.url)

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="space-y-6"
    >
      <div className="text-center">
        <h2 className="text-3xl font-bold mb-2">
          Select Your Favorite Service
        </h2>
        <p className="text-gray-400">
          Listen or download on your preferred platform.
        </p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
        {availableLinks
          .sort((a, b) => (b.priority ?? 0) - (a.priority ?? 0))
          .map((platform, index) => (
            <motion.div
              key={platform.name}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: index * 0.05 }}
            >
              <a
                href={platform.url}
                target="_blank"
                rel="noopener noreferrer"
                className="block"
              >
                <Button
                  variant="infected"
                  className="w-full group !p-3 !justify-start"
                >
                  <div className="flex items-center gap-3 w-full">
                    <div className="w-8 h-8 flex items-center justify-center">
                      {typeof platform.icon === 'string' ? (
                        <Image
                          src={platform.icon}
                          alt={platform.name}
                          width={24}
                          height={24}
                          className="w-6 h-6"
                        />
                      ) : (
                        <platform.icon className="w-6 h-6" />
                      )}
                    </div>

                    <span className="font-semibold text-md text-left flex-grow">
                      {platform.name}
                    </span>

                    <FaAngleRight className="w-5 h-5 opacity-50 group-hover:opacity-100 transition-opacity" />
                  </div>
                </Button>
              </a>
            </motion.div>
          ))}
      </div>

      {gumroadUrl && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="mt-6 flex justify-center"
        >
          <a
            href={gumroadUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="block w-full"
          >
            <Button
              variant="toxic"
              size="lg"
              className="w-full group text-xl py-4 px-8"
            >
              <FaHeadphonesAlt className="w-6 h-6 mr-3" />
              <span>Get Sample Pack on Gumroad</span>
            </Button>
          </a>
        </motion.div>
      )}
    </motion.div>
  )
}

export default StreamingLinks 