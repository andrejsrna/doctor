'use client'

import { motion } from 'framer-motion'
import { AffiliateLink } from '@/lib/affiliates'

type Props = {
  links: AffiliateLink[]
  title?: string
  layout?: 'grid' | 'compact'
}

export default function AffiliateLinks({
  links,
  title = 'Recommended Tools',
  layout = 'grid',
}: Props) {
  if (layout === 'compact') {
    return (
      <div className="flex flex-wrap gap-4">
        {links.map((link, i) => (
          <motion.a
            key={link.name}
            href={link.url}
            target="_blank"
            rel="noopener noreferrer sponsored"
            initial={{ opacity: 0, y: 10 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: i * 0.05 }}
            whileHover={{ scale: 1.03 }}
            className="group flex items-center gap-2 px-4 py-2 rounded-lg
              bg-black/50 border border-purple-500/20 hover:border-purple-500/50
              text-gray-400 hover:text-white transition-all duration-300 text-sm"
          >
            <span className="w-1.5 h-1.5 rounded-full bg-purple-500/50 group-hover:bg-purple-500 transition-colors" />
            <span className="font-medium">{link.name}</span>
            {link.tagline && (
              <span className="text-gray-500 group-hover:text-gray-300 transition-colors hidden sm:inline">
                — {link.tagline}
              </span>
            )}
            <svg
              className="w-3 h-3 opacity-0 group-hover:opacity-100 transition-opacity"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
            </svg>
          </motion.a>
        ))}
      </div>
    )
  }

  return (
    <div>
      {title && (
        <motion.h3
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-xl font-bold text-green-500 uppercase tracking-wider mb-6"
        >
          {title}
        </motion.h3>
      )}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        {links.map((link, i) => (
          <motion.a
            key={link.name}
            href={link.url}
            target="_blank"
            rel="noopener noreferrer sponsored"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: i * 0.1 }}
            whileHover={{ scale: 1.02, y: -2 }}
            className="group block p-5 rounded-lg bg-black/50 border border-green-500/20
              hover:border-green-500/50 transition-all duration-300"
          >
            <div className="flex items-start justify-between mb-2">
              <h4 className="text-lg font-bold text-white group-hover:text-green-500 transition-colors">
                {link.name}
              </h4>
              <svg
                className="w-4 h-4 text-gray-500 group-hover:text-green-500 transition-all
                  group-hover:translate-x-0.5 group-hover:-translate-y-0.5"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
              </svg>
            </div>
            {link.tagline && (
              <p className="text-sm text-green-500/70 group-hover:text-green-500 transition-colors mb-1">
                {link.tagline}
              </p>
            )}
            <p className="text-sm text-gray-400 group-hover:text-gray-300 transition-colors">
              {link.description}
            </p>
          </motion.a>
        ))}
      </div>
    </div>
  )
}
