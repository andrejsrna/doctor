'use client'

import { useState, useEffect, useRef, Suspense } from 'react'
import { motion } from 'framer-motion'
import { useSearchParams } from 'next/navigation'
import Image from 'next/image'
import { feedbackApi } from '../services/feedbackApi'
import { FaStar, FaDownload, FaMusic } from 'react-icons/fa'

interface TrackInfo {
  id: number
  title: string
  url: string
  artist?: string
  cover_url?: string
}

function DemoFeedbackContent() {
  const searchParams = useSearchParams()
  const [trackInfo, setTrackInfo] = useState<TrackInfo | null>(null)
  const [tokenMeta, setTokenMeta] = useState<{ files?: Array<{ id: string; name: string; path?: string; fileCategory?: 'audio' | 'image' }>; subject?: string; release?: { title: string; slug: string } | null } | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [success, setSuccess] = useState(false)
  
  // Form state
  const [rating, setRating] = useState(0)
  const [hoveredRating, setHoveredRating] = useState(0)
  const [feedback, setFeedback] = useState('')
  const [name, setName] = useState('')
  const [submitting, setSubmitting] = useState(false)
  const wavesurferRef = useRef<{ destroy: () => void; load: (src: string) => Promise<void>; playPause: () => void; stop: () => void } | null>(null)
  const waveContainerRef = useRef<HTMLDivElement | null>(null)
  const [audioError, setAudioError] = useState<string | null>(null)
  const [currentAudioIndex, setCurrentAudioIndex] = useState(0)
  const [audioFiles, setAudioFiles] = useState<Array<{ id: string; name: string; path?: string; fileCategory?: 'audio' | 'image' }>>([])

  useEffect(() => {
    const fetchTrackAndMeta = async () => {
      try {
        const token = searchParams.get('token')
        const trackIdParam = searchParams.get('track_id') || searchParams.get('track')

        if (trackIdParam) {
          const info = await feedbackApi.getTrackInfo(parseInt(trackIdParam), token || undefined)
          if (!info) {
            throw new Error('Track information not found')
          }
          setTrackInfo(info)
        }

        if (token) {
          const metaRes = await fetch(`/api/feedback?token=${encodeURIComponent(token)}`, { cache: 'no-store' })
          if (metaRes.ok) {
            const meta = await metaRes.json()
            setTokenMeta(meta)
          }
        }

        if (!trackIdParam && !token) {
          setError('Missing token or track parameter in URL')
        }
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Failed to load track information')
        console.error('Feedback form error:', err)
      } finally {
        setLoading(false)
      }
    }

    fetchTrackAndMeta()
  }, [searchParams])

  // Helper function to detect if file is audio
  const isAudioFile = (file: { name: string; fileCategory?: 'audio' | 'image' }) => {
    // If we have fileCategory, use it
    if (file.fileCategory) {
      return file.fileCategory === 'audio';
    }
    
    // Fallback: check file extension
    const fileName = file.name.toLowerCase();
    const audioExtensions = ['.mp3', '.wav', '.flac', '.aac', '.ogg', '.m4a', '.wma'];
    const imageExtensions = ['.jpg', '.jpeg', '.png', '.gif', '.webp', '.bmp', '.svg'];
    
    // If it's clearly an image, return false
    if (imageExtensions.some(ext => fileName.endsWith(ext))) {
      return false;
    }
    
    // If it's clearly audio, return true
    if (audioExtensions.some(ext => fileName.endsWith(ext))) {
      return true;
    }
    
    // Default: assume it's audio if we can't determine (for backward compatibility)
    return true;
  };

  // Extract audio files when tokenMeta changes
  useEffect(() => {
    if (tokenMeta?.files) {
      const audioOnlyFiles = tokenMeta.files.filter(isAudioFile);
      setAudioFiles(audioOnlyFiles);
      setCurrentAudioIndex(0);
    } else {
      setAudioFiles([]);
      setCurrentAudioIndex(0);
    }
  }, [tokenMeta]);

  useEffect(() => {
    const setupWave = async () => {
      // Use current audio file or fallback to trackInfo
      const currentAudioFile = audioFiles[currentAudioIndex];
      const original = currentAudioFile?.path || trackInfo?.url;
      
      if (!original) {
        if (audioFiles.length === 0 && tokenMeta?.files?.length) {
          setAudioError('No audio files available for playback');
        }
        return;
      }
      
      // Reset any previous errors
      setAudioError(null);
      
      const src = original.startsWith('http') ? `/api/audio-proxy?url=${encodeURIComponent(original)}` : original
      if (!src || !waveContainerRef.current) return
      try {
        const WaveSurfer = (await import('wavesurfer.js')).default
        if (wavesurferRef.current) {
          wavesurferRef.current.destroy()
          wavesurferRef.current = null
        }
        const ws = WaveSurfer.create({
          container: waveContainerRef.current,
          waveColor: '#6b7280',
          progressColor: '#a855f7',
          cursorColor: '#a855f7',
          height: 64,
          barRadius: 2,
          barWidth: 2,
          barGap: 1,
          normalize: true,
          dragToSeek: true,
        })
        wavesurferRef.current = ws as unknown as {
          destroy: () => void;
          load: (src: string) => Promise<void>;
          playPause: () => void;
          stop: () => void;
        }
        await ws.load(src)
      } catch (error) {
        console.error('Audio player error:', error);
        const currentFile = audioFiles[currentAudioIndex];
        setAudioError(`Unable to initialize player${currentFile ? ` for ${currentFile.name}` : ''}`);
      }
    }
    setupWave()
    return () => {
      try { wavesurferRef.current?.destroy() } catch {}
    }
  }, [audioFiles, currentAudioIndex, trackInfo, tokenMeta?.files?.length])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    
    if (rating === 0) return
    
    const trackId = searchParams.get('track_id') || searchParams.get('track')
    const token = searchParams.get('token')
    
    try {
      setSubmitting(true)
      // Submit to our API (which also forwards to WordPress)
      const resp = await fetch('/api/feedback', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          track_id: trackId ? parseInt(trackId) : undefined,
          token: token || undefined,
          rating,
          feedback,
          name
        })
      })
      if (!resp.ok) {
        const data = await resp.json().catch(() => ({}))
        throw new Error(data.error || 'Failed to submit feedback')
      }
      setSuccess(true)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to submit feedback')
      console.error('Feedback submission error:', err)
    } finally {
      setSubmitting(false)
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-pulse text-purple-500">Loading...</div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-red-500">{error}</div>
      </div>
    )
  }

  if (success) {
    return (
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="min-h-screen flex items-center justify-center p-4"
      >
        <div className="text-center space-y-4">
          <h2 className="text-2xl font-bold text-purple-500">Thank You!</h2>
          <p className="text-gray-300">Your feedback has been submitted successfully.</p>
        </div>
      </motion.div>
    )
  }

  return (
    <section className="py-32 px-4 min-h-screen relative">
      {/* Gradient Background */}
      <div className="absolute inset-0 bg-gradient-to-b from-black via-purple-900/10 to-black" />
      
      <div className="max-w-2xl mx-auto relative z-10">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="space-y-8"
        >
          {/* Related Release */}
          {tokenMeta?.release && (
            <div className="bg-black/40 border border-purple-500/20 rounded-xl p-4">
              <div className="text-sm text-gray-300 mb-1">Related release</div>
              <a
                href={`/music/${tokenMeta.release.slug}`}
                className="text-purple-400 hover:text-purple-300 underline"
                target="_blank"
                rel="noopener noreferrer"
              >
                {tokenMeta.release.title}
              </a>
            </div>
          )}

          {/* Track Info */}
          <div className="text-center space-y-4">
            <h1 className="text-3xl md:text-4xl font-bold bg-clip-text text-transparent 
              bg-gradient-to-r from-purple-500 via-pink-500 to-purple-500">
              Feedback Form
            </h1>
            {trackInfo && (
              <div className="bg-black/50 p-6 rounded-xl backdrop-blur-sm border border-purple-500/10
                shadow-[0_0_15px_rgba(168,85,247,0.1)]">
                {trackInfo.cover_url && (
                  <div className="relative w-32 h-32 mx-auto mb-4">
                    <Image
                      src={trackInfo.cover_url}
                      alt={trackInfo.title}
                      fill
                      className="object-cover rounded-lg"
                    />
                  </div>
                )}
                <h2 className="text-xl font-bold text-white">{trackInfo.title}</h2>
                {trackInfo.artist && (
                  <p className="text-purple-400">{trackInfo.artist}</p>
                )}



                {/* Download Button */}
                <motion.a
                  href={trackInfo.url}
                  download
                  className="inline-flex items-center gap-2 mt-4 px-6 py-2 
                    bg-purple-500/20 hover:bg-purple-500/30 rounded-lg 
                    transition-all duration-300"
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                >
                  <FaDownload className="w-4 h-4" />
                  <span>Download Track</span>
                </motion.a>
              </div>
            )}
          </div>

          {/* Audio Waveform Player */}
          {(audioFiles.length > 0 || trackInfo?.url) && (
            <div className="bg-black/30 border border-purple-500/10 rounded-xl p-4">
              <div className="flex items-center justify-between mb-2">
                <h3 className="text-lg font-semibold text-white">Preview</h3>
                {audioFiles.length > 1 && (
                  <div className="text-sm text-gray-400">
                    {currentAudioIndex + 1} of {audioFiles.length}
                  </div>
                )}
              </div>
              
              {/* Track selector for multiple files */}
              {audioFiles.length > 1 && (
                <div className="mb-4 space-y-2">
                  <div className="text-sm text-gray-300">Select track:</div>
                  <div className="flex flex-wrap gap-2">
                    {audioFiles.map((file, index) => (
                      <button
                        key={file.id}
                        type="button"
                        onClick={() => setCurrentAudioIndex(index)}
                        className={`px-3 py-1.5 rounded text-sm transition-all ${
                          index === currentAudioIndex
                            ? 'bg-purple-500 text-white'
                            : 'bg-gray-700/50 text-gray-300 hover:bg-gray-700/70'
                        }`}
                      >
                        {file.name}
                      </button>
                    ))}
                  </div>
                </div>
              )}
              
              {/* Current track name */}
              {audioFiles[currentAudioIndex] && (
                <div className="mb-2 text-sm text-purple-300">
                  Now playing: {audioFiles[currentAudioIndex].name}
                </div>
              )}
              
              <div ref={waveContainerRef} className="w-full" />
              {audioError && (
                <div className="text-sm text-red-400 mt-2">{audioError}</div>
              )}
              {!audioError && (
                <div className="mt-3 flex gap-2">
                  <button
                    type="button"
                    onClick={() => wavesurferRef.current?.playPause()}
                    className="px-3 py-1.5 bg-purple-500/30 hover:bg-purple-500/50 rounded text-white text-sm"
                  >
                    Play / Pause
                  </button>
                  <button
                    type="button"
                    onClick={() => wavesurferRef.current?.stop()}
                    className="px-3 py-1.5 bg-gray-700/50 hover:bg-gray-700/70 rounded text-white text-sm"
                  >
                    Stop
                  </button>
                  {audioFiles.length > 1 && (
                    <>
                      <button
                        type="button"
                        onClick={() => setCurrentAudioIndex(Math.max(0, currentAudioIndex - 1))}
                        disabled={currentAudioIndex === 0}
                        className="px-3 py-1.5 bg-blue-500/30 hover:bg-blue-500/50 disabled:bg-gray-600/30 disabled:text-gray-500 rounded text-white text-sm"
                      >
                        Previous
                      </button>
                      <button
                        type="button"
                        onClick={() => setCurrentAudioIndex(Math.min(audioFiles.length - 1, currentAudioIndex + 1))}
                        disabled={currentAudioIndex === audioFiles.length - 1}
                        className="px-3 py-1.5 bg-blue-500/30 hover:bg-blue-500/50 disabled:bg-gray-600/30 disabled:text-gray-500 rounded text-white text-sm"
                      >
                        Next
                      </button>
                    </>
                  )}
                </div>
              )}
            </div>
          )}

          {/* Files Section */}
          {tokenMeta?.files?.length ? (
            <div className="bg-black/30 border border-purple-500/10 rounded-xl p-4">
              <h3 className="text-lg font-semibold text-white mb-4">All Files</h3>
              
              {/* Audio Files */}
              {audioFiles.length > 0 && (
                <div className="mb-4">
                  <h4 className="text-md font-medium text-purple-300 mb-2">Audio Files</h4>
                  <div className="space-y-2">
                    {audioFiles.map((f) => {
                      const isAbs = !!f.path && f.path.startsWith('http')
                      const viewHref = isAbs ? `/api/audio-proxy?url=${encodeURIComponent(f.path!)}` : f.path || '#'
                      const dlHref = isAbs ? `/api/audio-proxy?url=${encodeURIComponent(f.path!)}&download=1&name=${encodeURIComponent(f.name)}` : f.path || '#'
                      return (
                        <div key={f.id} className="flex items-center justify-between gap-3 p-2 bg-black/20 rounded">
                          <a href={viewHref} target="_blank" rel="noopener noreferrer" className="text-purple-400 hover:text-purple-300 underline truncate flex items-center gap-2">
                            <FaMusic className="w-3 h-3" />
                            {f.name}
                          </a>
                          <a href={dlHref} className="px-2 py-1 text-xs rounded bg-purple-500/20 border border-purple-500/30 text-purple-200 hover:bg-purple-500/30">Download</a>
                        </div>
                      )
                    })}
                  </div>
                </div>
              )}
              
              {/* Image Files */}
              {tokenMeta.files.filter(f => !isAudioFile(f)).length > 0 && (
                <div>
                  <h4 className="text-md font-medium text-blue-300 mb-2">Images</h4>
                  <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                    {tokenMeta.files
                      .filter(f => !isAudioFile(f))
                      .map((f) => {
                        const isAbs = !!f.path && f.path.startsWith('http')
                        const viewHref = isAbs ? `/api/audio-proxy?url=${encodeURIComponent(f.path!)}` : f.path || '#'
                        const dlHref = isAbs ? `/api/audio-proxy?url=${encodeURIComponent(f.path!)}&download=1&name=${encodeURIComponent(f.name)}` : f.path || '#'
                        return (
                          <div key={f.id} className="bg-black/20 rounded p-2">
                            <a href={viewHref} target="_blank" rel="noopener noreferrer">
                              {f.path && (
                                // eslint-disable-next-line @next/next/no-img-element
                                <img 
                                  src={f.path} 
                                  alt={f.name}
                                  className="w-full h-20 object-cover rounded mb-2"
                                />
                              )}
                              <div className="text-xs text-blue-300 truncate">{f.name}</div>
                            </a>
                            <a href={dlHref} className="inline-block mt-1 px-2 py-1 text-xs rounded bg-blue-500/20 border border-blue-500/30 text-blue-200 hover:bg-blue-500/30">Download</a>
                          </div>
                        )
                      })}
                  </div>
                </div>
              )}
            </div>
          ) : null}

          {/* Feedback Form */}
          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Rating */}
            <div className="space-y-2">
              <label className="block text-sm font-medium text-gray-300">
                Rating
              </label>
              <div className="flex justify-center gap-2">
                {[1, 2, 3, 4, 5].map((star) => (
                  <button
                    key={star}
                    type="button"
                    onClick={() => setRating(star)}
                    onMouseEnter={() => setHoveredRating(star)}
                    onMouseLeave={() => setHoveredRating(0)}
                    className="focus:outline-none"
                  >
                    <FaStar
                      className={`w-8 h-8 transition-colors ${
                        star <= (hoveredRating || rating)
                          ? 'text-yellow-500'
                          : 'text-gray-600'
                      }`}
                    />
                  </button>
                ))}
              </div>
            </div>

            {/* Name */}
            <div className="space-y-2">
              <label htmlFor="name" className="block text-sm font-medium text-gray-300">
                Your Name (optional)
              </label>
              <input
                type="text"
                id="name"
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="w-full px-4 py-2 bg-black/30 border border-purple-500/20 rounded-lg
                  focus:border-purple-500 focus:ring-1 focus:ring-purple-500 transition-colors"
                placeholder="Enter your name"
              />
            </div>

            {/* Feedback */}
            <div className="space-y-2">
              <label htmlFor="feedback" className="block text-sm font-medium text-gray-300">
                Your Feedback
              </label>
              <textarea
                id="feedback"
                value={feedback}
                onChange={(e) => setFeedback(e.target.value)}
                rows={4}
                className="w-full px-4 py-2 bg-black/30 border border-purple-500/20 rounded-lg
                  focus:border-purple-500 focus:ring-1 focus:ring-purple-500 transition-colors"
                placeholder="Share your thoughts about the track..."
              />
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              disabled={submitting || rating === 0}
              className="w-full py-3 px-6 bg-purple-500 hover:bg-purple-600 disabled:bg-purple-500/50
                rounded-lg font-medium text-white transition-colors duration-300"
            >
              {submitting ? 'Submitting...' : 'Submit Feedback'}
            </button>
          </form>
        </motion.div>
      </div>
    </section>
  )
}

export default function FeedbackForm() {
  return (
    <Suspense fallback={
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-pulse text-purple-500">Loading...</div>
      </div>
    }>
      <DemoFeedbackContent />
    </Suspense>
  )
} 