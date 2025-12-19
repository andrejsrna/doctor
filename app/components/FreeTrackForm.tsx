'use client'

import { useState } from 'react'
import toast from 'react-hot-toast'

export default function FreeTrackForm() {
  const [email, setEmail] = useState('')
  const [name, setName] = useState('')
  const [loading, setLoading] = useState(false)
  const [msg, setMsg] = useState<string>('')
  const [ok, setOk] = useState<boolean | null>(null)
  const [website, setWebsite] = useState('') // Honeypot field

  const onSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setMsg('')
    setOk(null)
    try {
      const emailLc = email.toLowerCase().trim()
      const res = await fetch('/api/subscribe', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: emailLc, name, website, group: 'FreeTrack', source: 'new_fans_free_track' })
      })
      const data = await res.json()
      if (!res.ok) throw new Error(data?.error || 'Failed to subscribe')
      setOk(true)
      setMsg('Check your email for the download link!')
      toast.success('Subscribed. Check your email for the track!')
      setEmail('')
      setName('')
    } catch (err) {
      setOk(false)
      const message = err instanceof Error ? err.message : 'Something went wrong'
      setMsg(message)
      toast.error(message)
    } finally {
      setLoading(false)
    }
  }

  return (
    <form onSubmit={onSubmit} className="bg-black/50 border border-purple-500/20 rounded-xl p-6 max-w-lg mx-auto">
      {/* Honeypot field - keeping it real simple to trap bots */}
      <div className="absolute opacity-0 -z-10 h-0 w-0 overflow-hidden">
        <input
          type="text"
          name="website"
          value={website}
          onChange={(e) => setWebsite(e.target.value)}
          tabIndex={-1}
          autoComplete="off"
        />
      </div>
      <h3 className="text-xl font-semibold mb-3">Get a free track</h3>
      <p className="text-gray-400 mb-4">Join the list and we’ll email you a download link.</p>
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mb-3">
        <input value={name} onChange={(e) => setName(e.target.value)} placeholder="Your name (optional)" className="px-4 py-3 rounded-lg bg-black/50 border border-white/10 text-white" />
        <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} placeholder="Your email" required className="px-4 py-3 rounded-lg bg-black/50 border border-white/10 text-white" />
      </div>
      <button type="submit" disabled={loading} className="px-5 py-3 rounded-lg bg-purple-700 hover:bg-purple-600 border border-purple-500/40 disabled:opacity-50">
        {loading ? 'Sending…' : 'Email me the track'}
      </button>
      {msg && (
        <div className={`mt-3 text-sm ${ok ? 'text-green-400' : 'text-red-400'}`}>{msg}</div>
      )}
    </form>
  )
}


