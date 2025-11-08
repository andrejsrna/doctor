'use client'

import { motion } from 'framer-motion'
import Link from 'next/link'
import { FaSyringe, FaSkull } from 'react-icons/fa'
import { useState, useEffect } from 'react'
import { subscriberApi } from '../services/subscriberApi'
import Button from './Button'
import toast from 'react-hot-toast'

const socialLinks = [
  { name: 'Facebook', href: 'https://www.facebook.com/dnbdoctor', icon: 'facebook' as const, hoverColor: 'hover:text-blue-500' },
  { name: 'Instagram', href: 'https://www.instagram.com/dnbdoctor/', icon: 'instagram' as const, hoverColor: 'hover:text-pink-500' },
  { name: 'YouTube', href: 'https://www.youtube.com/@dnbdoctor1', icon: 'youtube' as const, hoverColor: 'hover:text-red-500' },
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
        group: 'Newsletter',
        source: 'footer'
      })
      setStatus('success')
      setMessage('Thanks for subscribing!')
      toast.success('Subscribed to Newsletter')
      setEmail('')
      setAcceptedPrivacy(false)
    } catch (error) {
      setStatus('error')
      setMessage(error instanceof Error ? error.message : 'Failed to subscribe')
      toast.error(error instanceof Error ? error.message : 'Subscription failed')
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
                  whileHover={{ scale: 1.1, rotate: 12 }}
                  className={`text-gray-400 ${link.hoverColor} transition-colors`}
                >
                  {link.icon === 'facebook' && (
                    <svg className="w-6 h-6" viewBox="0 0 24 24" fill="currentColor" aria-hidden><path d="M22 12a10 10 0 1 0-11.5 9.9v-7h-2v-3h2v-2.3c0-2 1.2-3.1 3-3.1.9 0 1.8.1 1.8.1v2h-1c-1 0-1.3.6-1.3 1.2V12h2.2l-.4 3h-1.8v7A10 10 0 0 0 22 12z"/></svg>
                  )}
                  {link.icon === 'instagram' && (
                    <svg className="w-6 h-6" viewBox="0 0 24 24" fill="currentColor" aria-hidden><path d="M7 2h10a5 5 0 0 1 5 5v10a5 5 0 0 1-5 5H7a5 5 0 0 1-5-5V7a5 5 0 0 1 5-5zm0 2a3 3 0 0 0-3 3v10a3 3 0 0 0 3 3h10a3 3 0 0 0 3-3V7a3 3 0 0 0-3-3H7zm5 3a5 5 0 1 1 0 10 5 5 0 0 1 0-10zm6.5-.8a1.2 1.2 0 1 1-2.4 0 1.2 1.2 0 0 1 2.4 0z"/></svg>
                  )}
                  {link.icon === 'youtube' && (
                    <svg className="w-6 h-6" viewBox="0 0 24 24" fill="currentColor" aria-hidden><path d="M23.5 6.2s-.2-1.6-.8-2.2c-.8-.8-1.7-.8-2.2-.9C17.6 2.8 12 2.8 12 2.8h0s-5.6 0-8.5.3c-.5.1-1.4.1-2.2.9C.7 4.6.5 6.2.5 6.2S.2 8.1.2 10v1.9c0 1.9.2 3.8.2 3.8s.2 1.6.8 2.2c.8.8 1.8.8 2.3.9 1.7.2 7.2.3 7.2.3s5.6 0 8.5-.3c.5-.1 1.4-.1 2.2-.9.6-.6.8-2.2.8-2.2s.2-1.9.2-3.8V10c0-1.9-.2-3.8-.2-3.8zM9.8 14.6V7.9l6.1 3.3-6.1 3.4z"/></svg>
                  )}
                  <span className="sr-only">{link.name}</span>
                </motion.a>
              ))}
              <motion.a
                href="/newsletter"
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: 0.3 }}
                whileHover={{ scale: 1.1, rotate: 12 }}
                className="text-gray-400 hover:text-green-500 transition-colors"
              >
                <svg className="w-6 h-6" viewBox="0 0 24 24" fill="currentColor" aria-hidden>
                  <path d="M4 4h16v14a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2V4zm2 3v9h12V7H6zm-3 9V7H2v11a2 2 0 0 0 2 2h16v-2H5a2 2 0 0 1-2-2z"/>
                </svg>
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
              {[
                { href: '/about', text: 'About Us' },
                { href: '/contact', text: 'Contact' },
                { href: '/neurofunk-labels', text: 'Neurofunk Labels' },
                { href: '/privacy-policy', text: 'Privacy Policy' },
                { href: '/terms', text: 'Terms & Conditions' }
              ].map((link) => (
                <motion.div
                  key={link.href}
                  whileHover={{ x: 10 }}
                  className="group w-fit"
                >
                  <Link 
                    href={link.href} 
                    className="text-gray-400 group-hover:text-green-500 transition-colors flex items-center gap-2"
                  >
                    <span className="w-1.5 h-1.5 rounded-full bg-green-500/50 group-hover:bg-green-500 transition-colors" />
                    {link.text}
              </Link>
                </motion.div>
              ))}
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
                <motion.div className="flex-1" whileHover={{ scale: 1.02 }}>
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="Enter your email"
                  disabled={status === 'loading'}
                  required
                    className="w-full bg-black/50 border border-green-500/30 rounded-full px-4 py-2 
                    text-white placeholder-gray-500 focus:outline-none focus:border-green-500 
                      transition-all duration-300 disabled:opacity-50 hover:border-green-500/50
                      focus:ring-2 focus:ring-green-500/20"
                />
                </motion.div>
                <motion.div whileHover={{ scale: 1.02 }}>
                  <Button
                  type="submit"
                  disabled={status === 'loading' || !acceptedPrivacy}
                    variant="toxic"
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

              <div className="flex items-start space-x-2 text-sm">
                <div className="flex items-center h-5 mt-0.5">
                  <input
                    id="privacy"
                    type="checkbox"
                    checked={acceptedPrivacy}
                    onChange={(e) => setAcceptedPrivacy(e.target.checked)}
                    disabled={status === 'loading'}
                    className="w-4 h-4 rounded border-green-500/30 bg-black/50 
                      text-green-500 focus:ring-green-500 focus:ring-offset-0
                      hover:border-green-500/50 transition-colors duration-300
                      cursor-pointer"
                    required
                  />
                </div>
                <label htmlFor="privacy" className="text-gray-400 group">
                  I agree to the{' '}
                  <Link 
                    href="/privacy-policy" 
                    className="text-green-500 group-hover:text-pink-500 underline transition-colors duration-300"
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
                  className={`text-sm ${
                    status === 'error' 
                      ? 'text-red-500 bg-red-500/10 border border-red-500/30' 
                      : 'text-green-500 bg-green-500/10 border border-green-500/30'
                  } py-2 px-4 rounded-lg`}
                >
                  {message}
                </motion.p>
              )}
            </motion.form>
          </div>
        </div>

        {/* Other Links */}
        <motion.div 
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          className="relative z-10 mt-12 pt-8 border-t border-green-500/20"
        >
          <div className="text-center">
            <motion.h3 
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="text-lg font-bold text-green-500 uppercase tracking-wider mb-4"
            >
              Other Links
            </motion.h3>
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.1 }}
              className="flex flex-wrap justify-center gap-6"
            >
              <motion.div
                whileHover={{ scale: 1.05 }}
                className="group"
              >
                <Link 
                  href="/neurofunk-drum-and-bass" 
                  className="text-gray-400 group-hover:text-green-500 transition-colors duration-300 flex items-center gap-2"
                >
                  <span className="w-1.5 h-1.5 rounded-full bg-green-500/50 group-hover:bg-green-500 transition-colors" />
                  Neurofunk Drum & Bass
                </Link>
              </motion.div>
              <motion.div
                whileHover={{ scale: 1.05 }}
                className="group"
              >
                <Link 
                  href="/neurofunk-dnb" 
                  className="text-gray-400 group-hover:text-green-500 transition-colors duration-300 flex items-center gap-2"
                >
                  <span className="w-1.5 h-1.5 rounded-full bg-green-500/50 group-hover:bg-green-500 transition-colors" />
                  Neurofunk DnB
                </Link>
              </motion.div>
              <motion.div
                whileHover={{ scale: 1.05 }}
                className="group"
              >
                <Link 
                  href="/neurofunk-spotify" 
                  className="text-gray-400 group-hover:text-green-500 transition-colors duration-300 flex items-center gap-2"
                >
                  <span className="w-1.5 h-1.5 rounded-full bg-green-500/50 group-hover:bg-green-500 transition-colors" />
                  Neurofunk Spotify Playlists
                </Link>
              </motion.div>
              <motion.div
                whileHover={{ scale: 1.05 }}
                className="group"
              >
                <Link 
                  href="/albums" 
                  className="text-gray-400 group-hover:text-green-500 transition-colors duration-300 flex items-center gap-2"
                >
                  <span className="w-1.5 h-1.5 rounded-full bg-green-500/50 group-hover:bg-green-500 transition-colors" />
                  DnB Albums
                </Link>
              </motion.div>
              <motion.div
                whileHover={{ scale: 1.05 }}
                className="group"
              >
                <Link 
                  href="/what-is-drum-and-bass" 
                  className="text-gray-400 group-hover:text-green-500 transition-colors duration-300 flex items-center gap-2"
                >
                  <span className="w-1.5 h-1.5 rounded-full bg-green-500/50 group-hover:bg-green-500 transition-colors" />
                  What Is Drum and Bass?
                </Link>
              </motion.div>
              <motion.div
                whileHover={{ scale: 1.05 }}
                className="group"
              >
                <Link 
                  href="/drum-and-bass-history" 
                  className="text-gray-400 group-hover:text-green-500 transition-colors duration-300 flex items-center gap-2"
                >
                  <span className="w-1.5 h-1.5 rounded-full bg-green-500/50 group-hover:bg-green-500 transition-colors" />
                  History of Drum and Bass
                </Link>
              </motion.div>
              <motion.div
                whileHover={{ scale: 1.05 }}
                className="group"
              >
                <Link 
                  href="/neurofunk-labels" 
                  className="text-gray-400 group-hover:text-green-500 transition-colors duration-300 flex items-center gap-2"
                >
                  <span className="w-1.5 h-1.5 rounded-full bg-green-500/50 group-hover:bg-green-500 transition-colors" />
                  Neurofunk Labels Guide
                </Link>
              </motion.div>
            </motion.div>
          </div>
        </motion.div>

        {/* Copyright */}
        <motion.div 
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          className="relative z-10 mt-8 pt-8 border-t border-green-500/20 text-center text-gray-400"
        >
          <p>
            © {new Date().getFullYear()} DnB Doctor. All rights reserved.{' '}
            <Link 
              href="https://synthbit.cz" 
              className="text-green-500 hover:text-pink-500 underline transition-colors duration-300"
            >
              SynthBit, s.r.o.
            </Link>
          </p>
        </motion.div>
      </div>
    </footer>
  )
} 
