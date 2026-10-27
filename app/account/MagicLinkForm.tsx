'use client'

import { useState } from 'react'
import { authClient } from '@/app/lib/authClient'

export default function MagicLinkForm() {
  const [email, setEmail] = useState('')
  const [state, setState] = useState<'idle' | 'sending' | 'sent'>('idle')
  const [error, setError] = useState('')

  async function submit(e: React.FormEvent) {
    e.preventDefault()
    setState('sending'); setError('')
    const res = await fetch('/api/auth/sign-in/magic-link', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email: email.trim(), callbackURL: '/account', errorCallbackURL: '/account?error=link' }),
    }).catch(() => null)
    if (!res?.ok) {
      setError(res?.status === 429 ? 'Too many attempts. Try again in a minute.' : 'Could not send the link. Check the address and try again.')
      setState('idle')
      return
    }
    setState('sent')
  }

  if (state === 'sent') {
    return (
      <div role="status" className="border border-[#39ff14]/40 bg-[#39ff14]/5 p-5">
        <p className="font-bold text-white">Check your inbox</p>
        <p className="mt-2 text-gray-300">We sent a sign-in link to <strong className="text-white">{email}</strong>. It works for 15 minutes.</p>
        <button type="button" className="mt-3 text-sm text-[#39ff14] underline" onClick={() => setState('idle')}>Use a different email</button>
      </div>
    )
  }

  return (
    <form onSubmit={submit} className="space-y-4">
      <label className="block text-sm text-gray-300">
        Email used at checkout
        <input
          type="email"
          required
          autoComplete="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          className="mt-2 w-full border border-white/20 bg-black px-4 py-3 text-white outline-none focus:border-[#39ff14]"
          placeholder="you@example.com"
        />
      </label>
      {error && <p role="alert" className="text-sm text-red-300">{error}</p>}
      <button disabled={state === 'sending'} className="bg-[#39ff14] px-5 py-3 font-mono text-sm font-bold uppercase tracking-widest text-black hover:opacity-90 disabled:opacity-50">
        {state === 'sending' ? 'Sending...' : 'Email me a sign-in link'}
      </button>
    </form>
  )
}

export function SignOutButton() {
  return (
    <button type="button" className="text-sm text-gray-400 underline hover:text-white" onClick={async () => { await authClient.signOut(); window.location.assign('/account') }}>
      Sign out
    </button>
  )
}
