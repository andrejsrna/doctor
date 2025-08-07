'use client'

import { useState } from 'react'
import { motion } from 'framer-motion'
import { FaTimes } from 'react-icons/fa'
import { subscriberApi } from '../services/subscriberApi'
import Image from 'next/image'

export default function UnsubscribePage() {
  const [email, setEmail] = useState('')
  const [status, setStatus] = useState<'idle' | 'loading' | 'success' | 'error'>('idle')
  const [message, setMessage] = useState('')

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setStatus('loading')

    try {
      await subscriberApi.unsubscribe({
        email
      })
      setStatus('success')
      setMessage('You have been successfully unsubscribed.')
      setEmail('')
    } catch (error) {
      setStatus('error')
      setMessage(error instanceof Error ? error.message : 'Failed to unsubscribe')
    }
  }

  return (
    <section className="py-32 px-4 relative min-h-screen overflow-hidden">
      {/* Background Image */}
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
          className="text-center mb-12"
        >
          <div className="inline-block p-4 bg-purple-500/20 rounded-full mb-6">
            <FaTimes className="w-12 h-12 text-purple-500" />
          </div>
          <h1 className="text-4xl md:text-6xl font-bold mb-6 bg-clip-text text-transparent 
            bg-gradient-to-r from-purple-500 via-pink-500 to-purple-500">
            Unsubscribe
          </h1>
          <p className="text-xl text-gray-300 max-w-2xl mx-auto">
            We&apos;re sorry to see you go. Enter your email address below to unsubscribe from our newsletter.
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

            <button 
              type="submit"
              disabled={status === 'loading'}
              className="w-full px-8 py-3 rounded-full bg-purple-500 text-white font-medium 
                hover:bg-purple-600 transition-colors disabled:opacity-50 
                disabled:hover:bg-purple-500 flex items-center justify-center gap-2"
            >
              {status === 'loading' ? (
                'Processing...'
              ) : (
                <>
                  Unsubscribe <FaTimes className="w-4 h-4" />
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
        </motion.div>
      </div>
    </section>
  )
} 