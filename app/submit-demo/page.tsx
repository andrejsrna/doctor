'use client'

import { useState, useRef } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import {
  FaCheck, FaSpinner,
  FaSkull, FaLock, FaUser, FaEnvelope, FaMusic, FaLink, FaTimesCircle,
  FaHandshake, FaVolumeUp, FaChartLine, FaCoins, FaShieldAlt, FaBullhorn
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

const collaborationFaq = [
  {
    question: 'How does a release with DnB Doctor usually work?',
    answer:
      'If we feel the track fits the label, we talk through the release plan, assets, loudness target, promotion and timeline with you directly. We try to keep the process clear and practical: good audio, proper presentation, and steady communication before the release goes live.',
    icon: FaHandshake
  },
  {
    question: 'Do you pay artists?',
    answer:
      'Yes. We usually offer a fixed fee per accepted track. The fee is set individually for each release based on the artist, current statistics, audience size, track potential and the scope of the campaign. If a track performs exceptionally well, we are open to paying an extra bonus.',
    icon: FaCoins
  },
  {
    question: 'Why fixed fees instead of normal royalties?',
    answer:
      'Streaming income in underground drum and bass is honestly very small. In reality, we still lose money on most releases because promotion, distribution, design and time cost more than the track earns back. The fixed fee is our way to give artists at least some motivating cash upfront, while many labels pay no royalties at all.',
    icon: FaShieldAlt
  },
  {
    question: 'How loud should the final master be?',
    answer:
      'We care a lot about volume and punch. For our sound, releases usually need to feel club-ready and aggressive, often around -4 to -3 LUFS when the mix can handle it without falling apart. Loudness is not the only thing that matters, but the track has to hit hard.',
    icon: FaVolumeUp
  },
  {
    question: 'Why is DnB Doctor added as a collaborating artist?',
    answer:
      'On selected releases we add the DnB Doctor artist profile as a collaborator to help boost algorithmic reach and connect the track with the label audience. It can help with discovery, playlist signals, release radar behaviour and overall visibility around the campaign.',
    icon: FaChartLine
  },
  {
    question: 'Can artists trust the label?',
    answer:
      'We work with artists who keep coming back for more releases, and we care about long-term relationships more than one-off uploads. We are direct about the numbers, what we can realistically do, and where the release stands. If something needs more work, we say it clearly.',
    icon: FaBullhorn
  }
]

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
                        : 'bg-green-500/10 border border-green-500/30 text-secondary'
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

      <div className="bg-black py-16 border-t border-purple-500/10">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="max-w-6xl mx-auto px-4"
        >
          <div className="max-w-3xl mb-10">
            <p className="text-purple-400 text-sm font-semibold uppercase tracking-[0.2em] mb-3">
              Artist collaboration FAQ
            </p>
            <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">
              What happens after we like your demo?
            </h2>
            <p className="text-gray-300 leading-relaxed">
              We want artists to know the deal before sending music. Here is how we think about
              fees, mastering loudness, algorithm support and long-term label cooperation.
            </p>
          </div>

          <div className="grid md:grid-cols-2 gap-5">
            {collaborationFaq.map((item, index) => (
              <motion.div
                key={item.question}
                initial={{ opacity: 0, y: 16 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.06 }}
                className="bg-black/40 border border-purple-500/15 rounded-xl p-6 backdrop-blur-sm hover:border-purple-500/40 transition-all duration-300"
              >
                <div className="flex items-start gap-4">
                  <div className="shrink-0 w-11 h-11 rounded-xl bg-purple-500/10 border border-purple-500/25 flex items-center justify-center">
                    <item.icon className="w-5 h-5 text-purple-400" />
                  </div>
                  <div>
                    <h3 className="text-lg font-semibold text-white mb-2">
                      {item.question}
                    </h3>
                    <p className="text-gray-300 leading-relaxed">
                      {item.answer}
                    </p>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </motion.div>
      </div>
    </section>
  )
} 
