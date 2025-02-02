'use client'

import { useState, useRef } from 'react'
import { motion } from 'framer-motion'
import { FaEnvelope, FaFacebook, FaInstagram, FaPaperPlane } from 'react-icons/fa'
import { Turnstile } from '@marsidev/react-turnstile'

interface FormData {
  name: string
  email: string
  subject: string
  message: string
}

const socialLinks = [
  {
    name: 'Email',
    href: 'mailto:info@dnbdoctor.com',
    icon: FaEnvelope,
    color: 'hover:text-purple-500'
  },
  {
    name: 'Facebook',
    href: 'https://www.facebook.com/dnbdoctor',
    icon: FaFacebook,
    color: 'hover:text-blue-500'
  },
  {
    name: 'Instagram',
    href: 'https://www.instagram.com/dnbdoctor/',
    icon: FaInstagram,
    color: 'hover:text-pink-500'
  }
]

export default function ContactPage() {
  const [formData, setFormData] = useState<FormData>({
    name: '',
    email: '',
    subject: '',
    message: ''
  })
  const [status, setStatus] = useState<'idle' | 'loading' | 'success' | 'error'>('idle')
  const [message, setMessage] = useState('')
  const [token, setToken] = useState<string | null>(null)
  const turnstileRef = useRef(null)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    
    if (!token) {
      setStatus('error')
      setMessage('Please complete the security check')
      return
    }

    setStatus('loading')

    try {
      const response = await fetch('/api/contact', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          ...formData,
          token
        }),
      })

      const data = await response.json()

      if (!response.ok) {
        throw new Error(data.message || 'Something went wrong')
      }

      setStatus('success')
      setMessage('Thank you for your message!')
      setFormData({ name: '', email: '', subject: '', message: '' })
      setToken(null)
      // @ts-expect-error: Turnstile types are not perfect
      turnstileRef.current?.reset()
    } catch (error) {
      setStatus('error')
      setMessage(error instanceof Error ? error.message : 'Failed to send message')
    }
  }

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setFormData(prev => ({
      ...prev,
      [e.target.name]: e.target.value
    }))
  }

  return (
    <section className="py-32 px-4 relative min-h-screen overflow-hidden">
      <div className="absolute inset-0 z-0">
        <div className="absolute inset-0 bg-gradient-to-b from-black via-purple-900/10 to-black" />
      </div>
      
      <div className="max-w-6xl mx-auto relative z-10">
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-16"
        >
          <h1 className="text-4xl md:text-6xl font-bold mb-6 bg-clip-text text-transparent 
            bg-gradient-to-r from-purple-500 via-pink-500 to-purple-500">
            Contact Us
          </h1>
          <p className="text-xl text-gray-300 max-w-2xl mx-auto">
            Have a question or want to work with us? Get in touch and we&apos;ll get back to you soon.
          </p>
        </motion.div>

        <div className="grid md:grid-cols-2 gap-12">
          {/* Contact Info */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.2 }}
            className="space-y-8"
          >
            <div>
              <h2 className="text-2xl font-bold text-white mb-6">Get in Touch</h2>
              <div className="space-y-6">
                {socialLinks.map((link, index) => (
                  <motion.a
                    key={link.name}
                    href={link.href}
                    target={link.name !== 'Email' ? '_blank' : undefined}
                    rel={link.name !== 'Email' ? 'noopener noreferrer' : undefined}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.3 + index * 0.1 }}
                    className={`flex items-center gap-4 p-4 bg-black/30 border border-purple-500/10 
                      rounded-xl ${link.color} transition-colors group backdrop-blur-sm`}
                  >
                    <link.icon className="w-6 h-6 transition-transform group-hover:scale-110" />
                    <span className="text-lg">{link.name}</span>
                  </motion.a>
                ))}
              </div>
            </div>

            <div>
              <h2 className="text-2xl font-bold text-white mb-6">Office Hours</h2>
              <p className="text-gray-300">
                Monday - Friday<br />
                9:00 AM - 5:00 PM (CET)
              </p>
            </div>
          </motion.div>

          {/* Contact Form */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.2 }}
            className="bg-black/30 border border-purple-500/10 rounded-2xl p-8 backdrop-blur-sm"
          >
            <form onSubmit={handleSubmit} className="space-y-6">
              <div>
                <label htmlFor="name" className="block text-sm font-medium text-gray-300 mb-2">
                  Your Name *
                </label>
                <input
                  id="name"
                  name="name"
                  type="text"
                  value={formData.name}
                  onChange={handleChange}
                  required
                  className="w-full px-6 py-3 rounded-xl bg-black/50 border border-purple-500/30 
                    text-white placeholder-gray-400 focus:outline-none focus:border-purple-500 
                    transition-colors focus:ring-2 focus:ring-purple-500/20"
                />
              </div>

              <div>
                <label htmlFor="email" className="block text-sm font-medium text-gray-300 mb-2">
                  Email *
                </label>
                <input
                  id="email"
                  name="email"
                  type="email"
                  value={formData.email}
                  onChange={handleChange}
                  required
                  className="w-full px-6 py-3 rounded-xl bg-black/50 border border-purple-500/30 
                    text-white placeholder-gray-400 focus:outline-none focus:border-purple-500 
                    transition-colors focus:ring-2 focus:ring-purple-500/20"
                />
              </div>

              <div>
                <label htmlFor="subject" className="block text-sm font-medium text-gray-300 mb-2">
                  Subject *
                </label>
                <input
                  id="subject"
                  name="subject"
                  type="text"
                  value={formData.subject}
                  onChange={handleChange}
                  required
                  className="w-full px-6 py-3 rounded-xl bg-black/50 border border-purple-500/30 
                    text-white placeholder-gray-400 focus:outline-none focus:border-purple-500 
                    transition-colors focus:ring-2 focus:ring-purple-500/20"
                />
              </div>

              <div>
                <label htmlFor="message" className="block text-sm font-medium text-gray-300 mb-2">
                  Message *
                </label>
                <textarea
                  id="message"
                  name="message"
                  value={formData.message}
                  onChange={handleChange}
                  required
                  rows={6}
                  className="w-full px-6 py-3 rounded-xl bg-black/50 border border-purple-500/30 
                    text-white placeholder-gray-400 focus:outline-none focus:border-purple-500 
                    transition-colors focus:ring-2 focus:ring-purple-500/20"
                />
              </div>

              <div className="flex justify-center">
                <Turnstile
                  ref={turnstileRef}
                  siteKey={process.env.NEXT_PUBLIC_CF_TURNSTILE_SITE_KEY!}
                  onSuccess={setToken}
                  onError={() => {
                    setToken(null)
                    setStatus('error')
                    setMessage('Security check failed. Please try again.')
                  }}
                />
              </div>

              <button 
                type="submit"
                disabled={status === 'loading'}
                className="w-full px-8 py-4 rounded-xl bg-gradient-to-r from-purple-500 to-pink-500 
                  text-white font-medium hover:from-purple-600 hover:to-pink-600 
                  transition-all disabled:opacity-50 disabled:hover:from-purple-500 
                  disabled:hover:to-pink-500 flex items-center justify-center gap-2"
              >
                <FaPaperPlane className={`${status === 'loading' ? 'animate-ping' : ''}`} />
                {status === 'loading' ? 'Sending...' : 'Send Message'}
              </button>
            </form>

            {message && (
              <motion.div 
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                className={`mt-6 p-4 rounded-xl ${
                  status === 'error' 
                    ? 'bg-red-500/10 border border-red-500/30 text-red-500' 
                    : 'bg-green-500/10 border border-green-500/30 text-green-500'
                }`}
              >
                {message}
              </motion.div>
            )}
          </motion.div>
        </div>
      </div>
    </section>
  )
} 