'use client'

import { useState } from 'react'
import { motion } from 'framer-motion'
import Link from 'next/link'
import { FaEnvelope, FaCheck } from 'react-icons/fa'
import { subscriberApi } from '../services/subscriberApi'
import Image from 'next/image'

export default function NewsletterPage() {
  const [email, setEmail] = useState('')
  const [acceptedPrivacy, setAcceptedPrivacy] = useState(false)
  const [status, setStatus] = useState<'idle' | 'loading' | 'success' | 'error'>('idle')
  const [message, setMessage] = useState('')

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    
    if (!acceptedPrivacy) {
      setStatus('error')
      setMessage('Please accept the privacy policy')
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
      setAcceptedPrivacy(false)
    } catch (error) {
      setStatus('error')
      setMessage(error instanceof Error ? error.message : 'Failed to subscribe')
    }
  }

  return (
    <section className="py-24 px-4 relative min-h-screen overflow-hidden">
      <div className="absolute inset-0 z-0">
        <Image
          src="/newsletter.jpeg"
          alt="Newsletter Background"
          fill
          className="object-cover opacity-20"
          priority
        />
        <div className="absolute inset-0 bg-gradient-to-b from-black via-purple-900/10 to-black" />
      </div>
      
      <div className="max-w-3xl mx-auto relative z-10">
        
      <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="relative z-10 text-center px-4"
        >
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ delay: 0.2 }}
            className="inline-block p-4 bg-purple-500/20 rounded-full mb-6 backdrop-blur-sm"
          >
            <FaEnvelope className="w-16 h-16 text-purple-500" />
          </motion.div>
          <h1 className="text-5xl md:text-7xl font-bold mb-6 bg-clip-text text-transparent 
            bg-gradient-to-r from-purple-500 via-pink-500 to-purple-500">
            Join Our Newsletter
          </h1>
          <p className="text-xl md:text-2xl text-gray-300 max-w-2xl mx-auto">
            Stay up to date with the latest releases, exclusive content, and special announcements 
            from DnB Doctor.
          </p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="bg-black/30 border border-white/5 rounded-2xl p-8 md:p-12 backdrop-blur-sm"
        >
          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label htmlFor="email" className="block text-sm font-medium text-gray-300 mb-2">
                Email Address
              </label>
              <input
                id="email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="Enter your email"
                disabled={status === 'loading'}
                required
                className="w-full px-6 py-3 rounded-full bg-black/50 border border-purple-500/30 
                  text-white placeholder-gray-400 focus:outline-none focus:border-purple-500 
                  transition-colors disabled:opacity-50"
              />
            </div>

            <div className="flex items-start">
              <div className="flex items-center h-5">
                <input
                  id="privacy"
                  type="checkbox"
                  checked={acceptedPrivacy}
                  onChange={(e) => setAcceptedPrivacy(e.target.checked)}
                  disabled={status === 'loading'}
                  className="w-4 h-4 rounded border-purple-500/30 bg-black/50 
                    text-purple-500 focus:ring-purple-500 focus:ring-offset-0"
                  required
                />
              </div>
              <label htmlFor="privacy" className="ml-3 text-sm text-gray-300">
                I agree to the{' '}
                <Link 
                  href="/privacy-policy" 
                  className="text-purple-500 hover:text-purple-400 underline"
                  target="_blank"
                >
                  privacy policy
                </Link>
              </label>
            </div>

            <button 
              type="submit"
              disabled={status === 'loading' || !acceptedPrivacy}
              className="w-full px-8 py-3 rounded-full bg-purple-500 text-white font-medium 
                hover:bg-purple-600 transition-colors disabled:opacity-50 
                disabled:hover:bg-purple-500 flex items-center justify-center gap-2"
            >
              {status === 'loading' ? (
                'Subscribing...'
              ) : (
                <>
                  Subscribe <FaCheck className="w-4 h-4" />
                </>
              )}
            </button>
          </form>

          {message && (
            <motion.p 
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              className={`mt-4 text-center ${status === 'error' ? 'text-red-500' : 'text-green-500'}`}
            >
              {message}
            </motion.p>
          )}

          <div className="mt-8 text-center text-sm text-gray-400">
            <Link 
              href="/unsub" 
              className="hover:text-purple-400 transition-colors underline"
            >
              Want to unsubscribe?
            </Link>
          </div>
        </motion.div>
      </div>
    </section>
  )
} 