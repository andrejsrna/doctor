'use client'

import { useState } from 'react'
import { motion } from 'framer-motion'
import { FaSyringe, FaSkull } from 'react-icons/fa'
import { subscriberApi } from '../services/subscriberApi'
import Button from './Button'

export default function SubscribeCTA() {
  const [email, setEmail] = useState('')
  const [status, setStatus] = useState<'idle' | 'loading' | 'success' | 'error'>('idle')
  const [message, setMessage] = useState('')
  const [acceptedPolicy, setAcceptedPolicy] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    
    if (!acceptedPolicy) {
      setStatus('error')
      setMessage('Please accept the privacy policy to continue')
      return
    }

    setStatus('loading')

    try {
      await subscriberApi.subscribe({
        email,
        group: 'Customers_final'
      })
      setStatus('success')
      setMessage('Thanks for subscribing!')
      setEmail('')
    } catch (error) {
      setStatus('error')
      setMessage(error instanceof Error ? error.message : 'Failed to subscribe')
    }
  }

  return (
    <motion.div 
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="mt-20 pt-12 border-t border-white/10"
    >
      <div className="bg-gradient-to-r from-purple-900/20 to-pink-900/20 rounded-2xl p-8 md:p-12 text-center relative overflow-hidden group">
        {/* Animated border effect */}
        <div className="absolute inset-0 bg-gradient-to-r from-purple-500/20 via-pink-500/20 to-purple-500/20 opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
        <div className="absolute inset-0 backdrop-blur-[1px] opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
        
        <motion.div 
          className="inline-block p-4 bg-purple-500/20 rounded-full mb-6 group/icon"
          whileHover={{ scale: 1.1, rotate: 12 }}
        >
          <FaSyringe className="w-8 h-8 text-purple-500 transform group-hover/icon:rotate-45 transition-transform duration-300" />
        </motion.div>

        <h2 className="text-3xl md:text-4xl font-bold mb-4 bg-clip-text text-transparent 
          bg-gradient-to-r from-purple-500 to-pink-500">
          Stay Updated
        </h2>
        <p className="text-gray-300 mb-8 max-w-2xl mx-auto">
          Subscribe to our newsletter and never miss the latest releases, exclusive content, and special announcements.
        </p>
        <form 
          onSubmit={handleSubmit}
          className="flex flex-col max-w-md mx-auto gap-4 relative z-10"
        >
          <div className="flex flex-col sm:flex-row gap-4">
            <motion.div className="flex-1" whileHover={{ scale: 1.02 }}>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="Enter your email"
                disabled={status === 'loading'}
                className="w-full px-6 py-3 rounded-full bg-black/50 border border-purple-500/30 
                  text-white placeholder-gray-400 focus:outline-none focus:border-purple-500 
                  transition-all duration-300 disabled:opacity-50 hover:border-purple-500/50
                  focus:ring-2 focus:ring-purple-500/20"
                required
              />
            </motion.div>
            
            <motion.div whileHover={{ scale: 1.02 }}>
              <Button
                type="submit"
                disabled={status === 'loading'}
                variant="infected"
                className="w-full sm:w-auto group"
              >
                {status === 'loading' ? (
                  <>
                    <FaSkull className="w-5 h-5 mr-2 animate-pulse" />
                    <span>Infecting...</span>
                  </>
                ) : (
                  <>
                    <FaSyringe className="w-5 h-5 mr-2 transform group-hover:rotate-45 transition-transform duration-300" />
                    <span>Subscribe</span>
                  </>
                )}
              </Button>
            </motion.div>
          </div>

          <div className="flex items-center gap-2 text-sm text-gray-300">
            <input
              type="checkbox"
              id="privacy-policy"
              checked={acceptedPolicy}
              onChange={(e) => setAcceptedPolicy(e.target.checked)}
              className="w-4 h-4 rounded border-purple-500/30 bg-black/50 
                checked:bg-purple-500 focus:ring-purple-500 focus:ring-offset-0
                hover:border-purple-500/50 transition-colors duration-300
                cursor-pointer"
            />
            <label htmlFor="privacy-policy" className="cursor-pointer group">
              I agree to the{' '}
              <a 
                href="/privacy-policy" 
                className="text-purple-500 group-hover:text-pink-500 underline transition-colors duration-300"
                target="_blank"
                rel="noopener noreferrer"
              >
                privacy policy
              </a>
            </label>
          </div>
          
          {message && (
            <motion.p 
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              className={`mt-4 ${
                status === 'error' 
                  ? 'text-red-500 bg-red-500/10 border border-red-500/30' 
                  : 'text-green-500 bg-green-500/10 border border-green-500/30'
              } py-2 px-4 rounded-lg`}
            >
              {message}
            </motion.p>
          )}
        </form>
      </div>
    </motion.div>
  )
} 