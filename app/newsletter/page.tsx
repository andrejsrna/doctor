'use client'

import { useState } from 'react'
import { motion } from 'framer-motion'
import Link from 'next/link'
import { FaEnvelope, FaCheck, FaSpinner, FaSkull, FaLock, FaTimesCircle } from 'react-icons/fa'
import { subscriberApi } from '../services/subscriberApi'
import Image from 'next/image'
import Button from '../components/Button'

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
        group: 'Newsletter',
        source: 'newsletter_page'
      })
      setStatus('success')
      setMessage('Successfully infected! Welcome to the horde!')
      setEmail('')
      setAcceptedPrivacy(false)
    } catch (error) {
      setStatus('error')
      setMessage(error instanceof Error ? error.message : 'Infection failed. Please try again.')
    }
  }

  return (
    <section className="py-24 px-4 relative min-h-screen overflow-hidden">
      {/* Background with animated overlay */}
      <div className="absolute inset-0 z-0">
        <Image
          src="/newsletter1.jpeg"
          alt="Newsletter Background"
          fill
          className="object-cover opacity-20"
          priority
        />
        <div className="absolute inset-0 bg-gradient-to-b from-black via-purple-900/10 to-black" />
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,_var(--tw-gradient-stops))] from-purple-900/20 via-transparent to-transparent animate-pulse" />
      </div>
      
      <div className="max-w-3xl mx-auto relative z-10">
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="relative z-10 text-center px-4"
        >
          <h1 className={`text-5xl md:text-7xl font-bold mb-6 bg-clip-text text-transparent 
            bg-gradient-to-r from-purple-500 via-pink-500 to-purple-500}`}>
            Spread the Infection
          </h1>
          <p className="text-xl md:text-2xl text-gray-300 max-w-2xl mx-auto">
            Join our growing horde of bass cultists. Get infected with exclusive releases, mutated content, 
            and viral announcements from the DnB Doctor&apos;s laboratory.
          </p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="bg-black/30 border border-purple-500/30 hover:border-purple-500/40 
            rounded-2xl p-8 md:p-12 backdrop-blur-sm transition-all duration-300
            hover:shadow-[0_0_15px_rgba(168,85,247,0.15)]"
        >
          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label htmlFor="email" className="block text-sm font-medium text-gray-300 mb-2 flex items-center gap-2">
                <FaEnvelope className="w-4 h-4 text-purple-500" />
                Infection Vector (Email)
              </label>
              <div className="relative">
                <input
                  id="email"
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="Enter your transmission frequency"
                  disabled={status === 'loading'}
                  required
                  className="w-full px-6 py-3 rounded-full bg-black/50 border border-purple-500/30 
                    text-white placeholder-gray-400 focus:outline-none focus:border-purple-500 
                    transition-all duration-300 disabled:opacity-50 hover:border-purple-500/50"
                />
                {status === 'success' && (
                  <FaCheck className="absolute right-4 top-1/2 -translate-y-1/2 text-green-500" />
                )}
                {status === 'error' && (
                  <FaTimesCircle className="absolute right-4 top-1/2 -translate-y-1/2 text-red-500" />
                )}
              </div>
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
                    text-purple-500 focus:ring-purple-500 focus:ring-offset-0
                    hover:border-purple-500/50 transition-all duration-300"
                  required
                />
              </div>
              <label htmlFor="privacy" className="ml-3 text-sm text-gray-300 flex items-center gap-2">
                <FaLock className="w-4 h-4 text-purple-500" />
                <span className="mr-1">I accept the terms of infection and the</span>
                <Link 
                  href="/privacy-policy" 
                  className="text-purple-500 hover:text-purple-400 underline"
                  target="_blank"
                >
                  privacy policy
                </Link>
              </label>
            </div>

            <motion.div whileHover={{ scale: 1.02 }}>
              <Button
                onClick={(e) => handleSubmit(e)}
                disabled={status === 'loading' || !acceptedPrivacy}
                variant="infected"
                className="w-full group"
              >
                {status === 'loading' ? (
                  <>
                    <FaSpinner className="w-5 h-5 animate-spin" />
                    <span>Spreading Infection...</span>
                  </>
                ) : (
                  <>
                    <FaSkull className="w-5 h-5 transform group-hover:rotate-12 transition-transform duration-300" />
                    <span>Join the Horde</span>
                  </>
                )}
              </Button>
            </motion.div>
          </form>

          {message && (
            <motion.div 
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              className={`mt-4 p-4 rounded-lg border ${
                status === 'error' 
                  ? 'border-red-500/30 bg-red-500/10 text-red-500' 
                  : 'border-green-500/30 bg-green-500/10 text-green-500'
              }`}
            >
              <p className="flex items-center justify-center gap-2">
                {status === 'error' ? (
                  <FaTimesCircle className="w-4 h-4" />
                ) : (
                  <FaCheck className="w-4 h-4" />
                )}
                {message}
              </p>
            </motion.div>
          )}

          <div className="mt-8 text-center">
            <motion.div whileHover={{ scale: 1.02 }} className="inline-block">
              <Button
                href="/unsub"
                variant="decayed"
                className="group text-sm"
              >
                <FaTimesCircle className="w-4 h-4 transform group-hover:rotate-90 transition-transform duration-300" />
                <span>Unsubscribe</span>
              </Button>
            </motion.div>
          </div>
        </motion.div>
      </div>
    </section>
  )
} 