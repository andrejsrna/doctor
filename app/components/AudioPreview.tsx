'use client'

import { useEffect, useRef, useState } from 'react'
import WaveSurfer from 'wavesurfer.js'
import { FaPlay, FaPause, FaVolumeUp, FaVolumeMute } from 'react-icons/fa'

interface AudioPreviewProps {
  url: string
  isPlaying: boolean
  onPlayPause: () => void
}

export default function AudioPreview({ url, isPlaying, onPlayPause }: AudioPreviewProps) {
  const waveformRef = useRef<HTMLDivElement>(null)
  const wavesurfer = useRef<WaveSurfer | null>(null)
  const [volume, setVolume] = useState(0.5)
  const [isMuted, setIsMuted] = useState(false)
  const [isReady, setIsReady] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [loadError, setLoadError] = useState<string | null>(null)
  const [audioUrl, setAudioUrl] = useState<string | null>(null)

  // First fetch the audio URL
  useEffect(() => {
    async function fetchAudioUrl() {
      try {
        const proxyUrl = `/api/audio-proxy?url=${encodeURIComponent(url)}`
        setAudioUrl(proxyUrl)
      } catch (err) {
        console.error('Error fetching audio URL:', err)
        setError('Failed to load audio URL')
      }
    }
    fetchAudioUrl()
  }, [url])

  // Initialize WaveSurfer only after we have the audio URL
  useEffect(() => {
    if (!audioUrl || !waveformRef.current || wavesurfer.current) return

    try {
      wavesurfer.current = WaveSurfer.create({
        container: waveformRef.current,
        waveColor: '#9333ea',
        progressColor: '#00FF00',
        cursorColor: '#00FF00',
        barWidth: 2,
        barGap: 3,
        height: 60,
        barRadius: 3,
        normalize: true,
        backend: 'WebAudio'
      })

      wavesurfer.current.on('ready', () => {
        setIsReady(true)
        setError(null)
        wavesurfer.current?.setVolume(volume)
      })

      wavesurfer.current.on('error', (err) => {
        console.error('WaveSurfer error:', err)
        setError('Failed to load audio')
        setLoadError(err.message)
      })

      wavesurfer.current.load(audioUrl)

      return () => {
        if (wavesurfer.current) {
          wavesurfer.current.pause()
          wavesurfer.current.destroy()
          wavesurfer.current = null
        }
      }
    } catch (err) {
      console.error('WaveSurfer init error:', err)
      setError('Failed to initialize audio player')
    }
  }, [audioUrl, volume])

  useEffect(() => {
    if (wavesurfer.current && isReady) {
      if (isPlaying) {
        wavesurfer.current.play()
      } else {
        wavesurfer.current.pause()
      }
    }
  }, [isPlaying, isReady])

  const handleVolumeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newVolume = parseFloat(e.target.value)
    setVolume(newVolume)
    if (wavesurfer.current && isReady) {
      wavesurfer.current.setVolume(newVolume)
    }
    if (newVolume === 0) {
      setIsMuted(true)
    } else {
      setIsMuted(false)
    }
  }

  const toggleMute = () => {
    if (!wavesurfer.current || !isReady) return

    if (isMuted) {
      wavesurfer.current.setVolume(volume)
      setIsMuted(false)
    } else {
      wavesurfer.current.setVolume(0)
      setIsMuted(true)
    }
  }

  return (
    <div className="bg-black/50 rounded-xl p-6 backdrop-blur-sm border border-[#00FF00]/20">
      <div className="flex items-center gap-4 mb-4">
        <button
          onClick={onPlayPause}
          disabled={!isReady || !!error}
          className="w-12 h-12 flex items-center justify-center rounded-full 
            bg-[#00FF00] text-black hover:bg-[#00FF00]/90 transition-colors
            disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {isPlaying ? <FaPause size={20} /> : <FaPlay size={20} className="ml-1" />}
        </button>
        
        <div className="flex items-center gap-3 flex-1">
          <button
            onClick={toggleMute}
            disabled={!isReady || !!error}
            className="text-[#00FF00] hover:text-[#00FF00]/80 transition-colors
              disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isMuted ? <FaVolumeMute size={20} /> : <FaVolumeUp size={20} />}
          </button>
          <input
            type="range"
            min="0"
            max="1"
            step="0.01"
            value={isMuted ? 0 : volume}
            onChange={handleVolumeChange}
            disabled={!isReady || !!error}
            className="w-24 accent-[#00FF00] disabled:opacity-50"
          />
        </div>
      </div>

      <div ref={waveformRef} className="w-full relative">
        {error && (
          <div className="absolute inset-0 flex items-center justify-center 
            bg-black/50 text-red-500 text-sm">
            {error}
            {loadError && <span className="ml-1">({loadError})</span>}
          </div>
        )}
        {!isReady && !error && (
          <div className="absolute inset-0 flex items-center justify-center 
            bg-black/50 text-[#00FF00] text-sm">
            Loading...
          </div>
        )}
      </div>
    </div>
  )
} 