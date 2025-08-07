'use client'

import { useState } from 'react'
import { subscriberApi } from '../services/subscriberApi'

export default function TestSubscribePage() {
  const [email, setEmail] = useState('')
  const [status, setStatus] = useState<'idle' | 'loading' | 'success' | 'error'>('idle')
  const [message, setMessage] = useState('')

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setStatus('loading')

    try {
      const result = await subscriberApi.subscribe({
        email,
        group: 'Newsletter',
        source: 'test_page'
      })
      setStatus('success')
      setMessage(`Success: ${result.message}`)
      setEmail('')
    } catch (error) {
      setStatus('error')
      setMessage(error instanceof Error ? error.message : 'Failed to subscribe')
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-black via-gray-900 to-black text-white flex items-center justify-center">
      <div className="bg-black/50 backdrop-blur-sm border border-purple-500/30 rounded-xl p-8 w-full max-w-md">
        <h1 className="text-2xl font-bold mb-6">Test Subscribe API</h1>
        
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium mb-2">Email</label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full px-4 py-2 bg-black/50 border border-purple-500/30 rounded text-white"
              required
            />
          </div>
          
          <button
            type="submit"
            disabled={status === 'loading'}
            className="w-full px-4 py-2 bg-purple-900/50 text-purple-300 rounded hover:bg-purple-900/70 disabled:opacity-50"
          >
            {status === 'loading' ? 'Testing...' : 'Test Subscribe'}
          </button>
        </form>

        {message && (
          <div className={`mt-4 p-4 rounded ${
            status === 'error' 
              ? 'bg-red-500/10 border border-red-500/30 text-red-500' 
              : 'bg-green-500/10 border border-green-500/30 text-green-500'
          }`}>
            {message}
          </div>
        )}

        <div className="mt-6 text-sm text-gray-400">
          <p>This page tests the Prisma-based subscribe API.</p>
          <p>Check the browser console for detailed logs.</p>
        </div>
      </div>
    </div>
  )
} 