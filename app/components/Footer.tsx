'use client'

import { motion } from 'framer-motion'
import Link from 'next/link'
import { FaFacebook, FaInstagram, FaYoutube, FaNewspaper } from 'react-icons/fa'
import { useState, useEffect } from 'react'
import { subscriberApi } from '../services/subscriberApi'

const socialLinks = [
  {
    name: 'Facebook',
    href: 'https://www.facebook.com/dnbdoctor',
    icon: FaFacebook,
    hoverColor: 'hover:text-blue-500'
  },
  {
    name: 'Instagram',
    href: 'https://www.instagram.com/dnbdoctor/',
    icon: FaInstagram,
    hoverColor: 'hover:text-pink-500'
  },
  {
    name: 'YouTube',
    href: 'https://www.youtube.com/@dnbdoctor1',
    icon: FaYoutube,
    hoverColor: 'hover:text-red-500'
  }
]

export default function Footer() {
  const [isMounted, setIsMounted] = useState(false)
  const [email, setEmail] = useState('')
  const [acceptedPrivacy, setAcceptedPrivacy] = useState(false)
  const [status, setStatus] = useState<'idle' | 'loading' | 'success' | 'error'>('idle')
  const [message, setMessage] = useState('')

  useEffect(() => {
    setIsMounted(true)
  }, [])

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

  // Initial render with minimal content
  if (!isMounted) {
    return (
      <footer className="relative overflow-hidden bg-black border-t border-green-500/20">
        <div className="max-w-7xl mx-auto px-4 py-16">
          <div className="text-center text-gray-400">
            © {new Date().getFullYear()} DnB Doctor. All rights reserved.
          </div>
        </div>
      </footer>
    )
  }

  return (
    <footer className="relative overflow-hidden bg-black border-t border-green-500/20">
      {/* Background Effects */}
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(0,255,0,0.03)_1px,transparent_1px)] bg-[size:2rem_2rem] opacity-30" />
      
      <div className="max-w-7xl mx-auto px-4 py-16">
        <div className="relative z-10 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12 lg:gap-8">
          {/* Social Media Section */}
          <div className="space-y-6">
            <motion.h3 
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="text-xl font-bold text-green-500 uppercase tracking-wider"
            >
              Follow Us
            </motion.h3>
            <div className="flex gap-6">
              {socialLinks.map((link, index) => (
                <motion.a
                  key={link.name}
                  href={link.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: index * 0.1 }}
                  className={`text-gray-400 ${link.hoverColor} transition-colors`}
                >
                  <link.icon className="w-6 h-6" />
                  <span className="sr-only">{link.name}</span>
                </motion.a>
              ))}
              <motion.a
                href="/newsletter"
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: 0.3 }}
                className="text-gray-400 hover:text-green-500 transition-colors"
              >
                <FaNewspaper className="w-6 h-6" />
                <span className="sr-only">Newsletter</span>
              </motion.a>
            </div>
          </div>

          {/* Quick Links */}
          <div className="space-y-6">
            <motion.h3 
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="text-xl font-bold text-green-500 uppercase tracking-wider"
            >
              Quick Links
            </motion.h3>
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="flex flex-col space-y-3"
            >
              <Link href="/about" className="text-gray-400 hover:text-green-500 transition-colors">
                About Us
              </Link>
              <Link href="/contact" className="text-gray-400 hover:text-green-500 transition-colors">
                Contact
              </Link>
              <Link href="/privacy-policy" className="text-gray-400 hover:text-green-500 transition-colors">
                Privacy Policy
              </Link>
              <Link href="/terms" className="text-gray-400 hover:text-green-500 transition-colors">
                Terms & Conditions
              </Link>
            </motion.div>
          </div>

          {/* Newsletter Section */}
          <div className="space-y-6 lg:col-span-2">
            <motion.h3 
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="text-xl font-bold text-green-500 uppercase tracking-wider"
            >
              Stay Updated
            </motion.h3>
            <motion.p
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="text-gray-400"
            >
              Subscribe to our newsletter for the latest releases and updates.
            </motion.p>
            <motion.form 
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="space-y-4"
              onSubmit={handleSubmit}
            >
              <div className="flex flex-col sm:flex-row gap-2">
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="Enter your email"
                  disabled={status === 'loading'}
                  required
                  className="flex-1 bg-black/50 border border-green-500/30 rounded-full px-4 py-2 
                    text-white placeholder-gray-500 focus:outline-none focus:border-green-500 
                    transition-colors disabled:opacity-50"
                />
                <button 
                  type="submit"
                  disabled={status === 'loading' || !acceptedPrivacy}
                  className="px-6 py-2 rounded-full bg-gradient-to-r from-green-500 to-green-600 
                    text-white font-medium hover:from-green-600 hover:to-green-700 
                    transition-colors disabled:opacity-50 disabled:hover:from-green-500 
                    disabled:hover:to-green-600"
                >
                  {status === 'loading' ? 'Subscribing...' : 'Subscribe'}
                </button>
              </div>

              <div className="flex items-start space-x-2 text-sm">
                <div className="flex items-center h-5 mt-0.5">
                  <input
                    id="privacy"
                    type="checkbox"
                    checked={acceptedPrivacy}
                    onChange={(e) => setAcceptedPrivacy(e.target.checked)}
                    disabled={status === 'loading'}
                    className="w-4 h-4 rounded border-green-500/30 bg-black/50 
                      text-green-500 focus:ring-green-500 focus:ring-offset-0"
                    required
                  />
                </div>
                <label htmlFor="privacy" className="text-gray-400">
                  I agree to the{' '}
                  <Link 
                    href="/privacy-policy" 
                    className="text-green-500 hover:text-green-400 underline"
                    target="_blank"
                  >
                    privacy policy
                  </Link>
                </label>
              </div>

              {message && (
                <motion.p 
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className={`text-sm ${status === 'error' ? 'text-red-500' : 'text-green-500'}`}
                >
                  {message}
                </motion.p>
              )}
            </motion.form>
          </div>
        </div>

        {/* Copyright */}
        <motion.div 
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          className="relative z-10 mt-16 pt-8 border-t border-green-500/20 text-center text-gray-400"
        >
          <p>© {new Date().getFullYear()} DnB Doctor. All rights reserved. <Link href="https://synthbit.cz" className="text-green-500 hover:text-green-400 underline">SynthBit, s.r.o.</Link></p>
        </motion.div>
      </div>
    </footer>
  )
} 