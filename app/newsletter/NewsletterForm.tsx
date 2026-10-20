'use client'

import { useState, type FormEvent } from 'react'
import Link from 'next/link'
import toast from 'react-hot-toast'
import { FaArrowRight, FaCheck, FaSkull, FaTimesCircle } from 'react-icons/fa'
import { subscriberApi } from '../services/subscriberApi'
import styles from './newsletter.module.css'

type Status = 'idle' | 'loading' | 'success' | 'error'

export default function NewsletterForm() {
  const [email, setEmail] = useState('')
  const [accepted, setAccepted] = useState(false)
  const [website, setWebsite] = useState('') // honeypot, checked by /api/subscribe
  const [status, setStatus] = useState<Status>('idle')
  const [message, setMessage] = useState('')

  const onSubmit = async (e: FormEvent) => {
    e.preventDefault()
    if (!accepted) {
      setStatus('error')
      setMessage('Please accept the privacy policy')
      return
    }
    setStatus('loading')
    setMessage('')
    try {
      const res = await subscriberApi.subscribe({ email, group: 'Newsletter', source: 'newsletter_page', ...(website && { website }) })
      setStatus('success')
      setMessage(res?.message || 'Successfully infected! Welcome to the horde!')
      toast.success('Subscribed to Newsletter')
      setEmail('')
      setAccepted(false)
    } catch (error) {
      const msg = error instanceof Error ? error.message : 'Infection failed. Please try again.'
      setStatus('error')
      setMessage(msg)
      toast.error(msg)
    }
  }

  const busy = status === 'loading'

  return (
    <form className={styles.form} onSubmit={onSubmit} data-status={status}>
      <label htmlFor="nl-email" className={styles.fieldLabel}>
        Infection vector (email)
      </label>
      <div className={styles.field}>
        <span className={styles.prompt} aria-hidden="true">
          &gt;
        </span>
        <input
          id="nl-email"
          type="email"
          name="email"
          autoComplete="email"
          inputMode="email"
          placeholder="you@frequency.com"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          disabled={busy}
          required
          aria-describedby={message ? 'nl-status' : undefined}
        />
      </div>

      {/* honeypot: invisible to people, bots fill it */}
      <input
        className={styles.hp}
        type="text"
        name="website"
        tabIndex={-1}
        autoComplete="off"
        aria-hidden="true"
        value={website}
        onChange={(e) => setWebsite(e.target.value)}
      />

      <label className={styles.consent}>
        <input type="checkbox" checked={accepted} onChange={(e) => setAccepted(e.target.checked)} disabled={busy} required />
        <span className={styles.box} aria-hidden="true" />
        <span>
          I accept the terms of infection and the{' '}
          <Link href="/privacy-policy" target="_blank">
            privacy policy
          </Link>
        </span>
      </label>

      <button type="submit" className={styles.submit} disabled={busy || !accepted}>
        <FaSkull aria-hidden="true" />
        <span>{busy ? 'Spreading infection…' : 'Join the horde'}</span>
        <FaArrowRight aria-hidden="true" />
      </button>

      <p id="nl-status" className={styles.status} role="status" aria-live="polite" data-tone={status}>
        {message && (status === 'error' ? <FaTimesCircle aria-hidden="true" /> : <FaCheck aria-hidden="true" />)}
        {message}
      </p>
    </form>
  )
}
