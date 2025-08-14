'use client'

import { useState, useRef } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import {
  FaCheck, FaSpinner,
  FaSkull, FaLock, FaUser, FaEnvelope, FaMusic, FaLink, FaTimesCircle
} from 'react-icons/fa'
import { Turnstile } from '@marsidev/react-turnstile'
import Button from '../components/Button'

interface FormData {
  email: string
  subject: string
  artistName: string
  genre: string
  acceptGuidelines: boolean
  acceptPrivacy: boolean
}

export default function SubmitDemoPage() {
  const [formData, setFormData] = useState<FormData>({
    email: '',
    subject: '',
    artistName: '',
    genre: '',
    acceptGuidelines: false,
    acceptPrivacy: false
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
      const response = await fetch('/api/submit-demo', {
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
        throw new Error(data.message || 'Failed to submit demo')
      }

      setStatus('success')
      setMessage("Thanks for your submission! We'll review your demo and get back to you soon.")
      setFormData({
        email: '',
        subject: '',
        artistName: '',
        genre: '',
        acceptGuidelines: false,
        acceptPrivacy: false
      })
      setToken(null)
      // @ts-expect-error: Turnstile types are not perfect
      turnstileRef.current?.reset()
    } catch (error) {
      setStatus('error')
      setMessage(error instanceof Error ? error.message : 'Failed to submit demo')
    }
  }

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const value = e.target.type === 'checkbox' ? (e.target as HTMLInputElement).checked : e.target.value;
    setFormData(prev => ({
      ...prev,
      [e.target.name]: value
    }))
  }

  return (
    <section className="py-16 relative overflow-hidden">
      {/* Form Section */}
      <div className="bg-black py-16">
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.4 }}
          className="max-w-6xl mx-auto px-4"
        >
          <div className="grid md:grid-cols-2 gap-8">
            {/* Guidelines */}
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.5 }}
              className="space-y-8"
            >
              <div>
                <h2 className="text-2xl md:text-3xl font-bold bg-clip-text text-transparent 
                  bg-gradient-to-r from-purple-500 to-pink-500 mb-6">
                  Submission Guidelines
                </h2>
                <div className="space-y-6">
                  <motion.div 
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.6 }}
                    className="bg-black/30 border border-purple-500/10 rounded-xl p-6 backdrop-blur-sm"
                  >
                    <h3 className="text-lg font-semibold text-purple-500 mb-2">
                      Exclusive Content
                    </h3>
                    <p className="text-gray-300">
                      Please make sure the track hasn&apos;t been made public anywhere yet.
                      We&apos;re looking for fresh, unreleased material.
                    </p>
                  </motion.div>

                  <motion.div 
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.7 }}
                    className="bg-black/30 border border-purple-500/10 rounded-xl p-6 backdrop-blur-sm"
                  >
                    <h3 className="text-lg font-semibold text-purple-500 mb-2">
                      Download Access
                    </h3>
                    <p className="text-gray-300">
                      Check if the download option is enabled on your track.
                      This helps us review and process your submission efficiently.
                    </p>
                  </motion.div>

                  <motion.div 
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.8 }}
                    className="bg-black/30 border border-purple-500/10 rounded-xl p-6 backdrop-blur-sm"
                  >
                    <h3 className="text-lg font-semibold text-purple-500 mb-2">
                      Valid Contact
                    </h3>
                    <p className="text-gray-300">
                      Make sure you supply us with a valid e-mail address.
                      We&apos;ll use this to contact you about your submission.
                    </p>
                  </motion.div>
                </div>
              </div>
            </motion.div>

            {/* Form */}
            <div className="bg-black/30 border border-purple-500/20 rounded-2xl p-8 md:p-12 backdrop-blur-sm
              hover:border-purple-500/40 transition-all duration-300
              hover:shadow-[0_0_15px_rgba(168,85,247,0.15)]">
              <form onSubmit={handleSubmit} className="space-y-6">
                <div className="grid gap-6">
                  <div>
                    <label htmlFor="artistName" className="text-sm font-medium text-gray-300 mb-2 flex items-center gap-2">
                      <FaUser className="w-4 h-4 text-purple-500" />
                      Your Real Name *
                    </label>
                    <input
                      id="artistName"
                      name="artistName"
                      type="text"
                      value={formData.artistName}
                      onChange={handleChange}
                      required
                      placeholder="Your artist/producer name"
                      className="w-full px-6 py-4 rounded-xl bg-black/50 border border-purple-500/30 
                        text-white placeholder-gray-400 focus:outline-none focus:border-purple-500 
                        transition-all duration-300 hover:border-purple-500/50"
                    />
                  </div>

                  <div>
                    <label htmlFor="email" className="text-sm font-medium text-gray-300 mb-2 flex items-center gap-2">
                      <FaEnvelope className="w-4 h-4 text-purple-500" />
                      Email *
                    </label>
                    <input
                      id="email"
                      name="email"
                      type="email"
                      value={formData.email}
                      onChange={handleChange}
                      required
                      placeholder="your@email.com"
                      className="w-full px-6 py-4 rounded-xl bg-black/50 border border-purple-500/30 
                        text-white placeholder-gray-400 focus:outline-none focus:border-purple-500 
                        transition-all duration-300 hover:border-purple-500/50"
                    />
                  </div>

                  <div>
                    <label htmlFor="genre" className="text-sm font-medium text-gray-300 mb-2 flex items-center gap-2">
                      <FaMusic className="w-4 h-4 text-purple-500" />
                      Genre *
                    </label>
                    <select
                      id="genre"
                      name="genre"
                      value={formData.genre}
                      onChange={handleChange}
                      required
                      className="w-full px-6 py-4 rounded-xl bg-black/50 border border-purple-500/30 
                        text-white placeholder-gray-400 focus:outline-none focus:border-purple-500 
                        transition-all duration-300 hover:border-purple-500/50 appearance-none cursor-pointer"
                    >
                      <option value="">Select genre</option>
                      <option value="Neurofunk">Neurofunk</option>
                      <option value="Techstep">Techstep</option>
                      <option value="Dark DnB">Dark DnB</option>
                      <option value="Crossbreed">Crossbreed</option>
                      <option value="Other">Other</option>
                    </select>
                  </div>

                  <div>
                    <label htmlFor="subject" className="text-sm font-medium text-gray-300 mb-2 flex items-center gap-2">
                      <FaLink className="w-4 h-4 text-purple-500" />
                      SoundCloud Link Secret or Private Link *
                    </label>
                    <input
                      id="subject"
                      name="subject"
                      type="url"
                      value={formData.subject}
                      onChange={handleChange}
                      required
                      placeholder="https://soundcloud.com/your-track"
                      className="w-full px-6 py-4 rounded-xl bg-black/50 border border-purple-500/30 
                        text-white placeholder-gray-400 focus:outline-none focus:border-purple-500 
                        transition-all duration-300 hover:border-purple-500/50"
                    />
                  </div>

                  <div>
                    <div className="flex items-start gap-2 mb-6">
                      <input
                        type="checkbox"
                        id="acceptGuidelines"
                        name="acceptGuidelines"
                        checked={formData.acceptGuidelines}
                        onChange={handleChange}
                        required
                        className="mt-1.5 rounded border-purple-500/30 bg-black/50 
                          text-purple-500 focus:ring-purple-500 focus:ring-offset-0
                          hover:border-purple-500/50 transition-all duration-300"
                      />
                      <label htmlFor="acceptGuidelines" className="text-sm text-gray-300 flex items-center gap-2">
                        <FaCheck className="w-4 h-4 text-purple-500" />
                        I have read and followed the{' '}
                        <a 
                          href="/guidelines" 
                          target="_blank"
                          rel="noopener noreferrer" 
                          className="text-purple-500 hover:text-purple-400 underline"
                        >
                          submission guidelines
                        </a>
                        . My demo meets all the requirements. *
                      </label>
                    </div>

                    <div className="flex items-start gap-2 mb-6">
                      <input
                        type="checkbox"
                        id="acceptPrivacy"
                        name="acceptPrivacy"
                        checked={formData.acceptPrivacy}
                        onChange={handleChange}
                        required
                        className="mt-1.5 rounded border-purple-500/30 bg-black/50 
                          text-purple-500 focus:ring-purple-500 focus:ring-offset-0
                          hover:border-purple-500/50 transition-all duration-300"
                      />
                      <label htmlFor="acceptPrivacy" className="text-sm text-gray-300 flex items-center gap-2">
                        <FaLock className="w-4 h-4 text-purple-500" />
                        I agree to the{' '}
                        <a 
                          href="/privacy-policy" 
                          target="_blank"
                          rel="noopener noreferrer" 
                          className="text-purple-500 hover:text-purple-400 underline"
                        >
                          privacy policy
                        </a>
                        . *
                      </label>
                    </div>
                  </div>
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
                    options={{
                      theme: 'dark',
                      size: 'normal'
                    }}
                  />
                </div>

                <motion.div whileHover={{ scale: 1.02 }}>
                  <Button
                    onClick={(e) => handleSubmit(e)}
                  disabled={status === 'loading'}
                    variant="infected"
                    className="w-full group"
                >
                  {status === 'loading' ? (
                      <>
                        <FaSpinner className="w-5 h-5 animate-spin" />
                        <span>Infecting...</span>
                      </>
                  ) : (
                    <>
                        <FaSkull className="w-5 h-5 transform group-hover:rotate-12 transition-transform duration-300" />
                        <span>Submit Demo</span>
                    </>
                  )}
                  </Button>
                </motion.div>
              </form>

              <AnimatePresence>
                {message && (
                  <motion.div 
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -10 }}
                    className={`mt-6 p-4 rounded-xl flex items-center gap-2 justify-center ${
                      status === 'error' 
                        ? 'bg-red-500/10 border border-red-500/30 text-red-500' 
                        : 'bg-green-500/10 border border-green-500/30 text-green-500'
                    }`}
                  >
                    {status === 'error' ? (
                      <FaTimesCircle className="w-4 h-4" />
                    ) : (
                      <FaCheck className="w-4 h-4" />
                    )}
                    {message}
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  )
} 