'use client'

import { useRef, useState, type ChangeEvent, type FormEvent } from 'react'
import Link from 'next/link'
import { Turnstile, type TurnstileInstance } from '@marsidev/react-turnstile'
import { FaArrowRight, FaCheck, FaPaperPlane, FaTimesCircle } from 'react-icons/fa'
import { REASONS } from './reasons'
import styles from './contact.module.css'

const EMPTY = { reason: '', name: '', email: '', subject: '', message: '', website: '' }

type Status = 'idle' | 'loading' | 'success' | 'error'

export default function ContactForm({ siteKey }: { siteKey: string }) {
  const [form, setForm] = useState(EMPTY)
  const [token, setToken] = useState<string | null>(null)
  const [status, setStatus] = useState<Status>('idle')
  const [message, setMessage] = useState('')
  const turnstile = useRef<TurnstileInstance>(null)

  const onChange = (e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target
    setForm((f) => ({ ...f, [name]: value }))
  }

  const onSubmit = async (e: FormEvent) => {
    e.preventDefault()
    if (!token) {
      setStatus('error')
      setMessage('Please complete the security check')
      return
    }
    setStatus('loading')
    setMessage('')
    try {
      const res = await fetch('/api/contact', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ ...form, token }),
      })
      const data = await res.json().catch(() => ({}))
      if (!res.ok) throw new Error(data.message || 'Failed to send message')
      setStatus('success')
      setForm(EMPTY)
    } catch (err) {
      setStatus('error')
      setMessage(err instanceof Error ? err.message : 'Failed to send message')
    } finally {
      setToken(null)
      turnstile.current?.reset()
    }
  }

  if (status === 'success') {
    return (
      <div className={styles.done} role="status">
        <span className={styles.doneIcon} aria-hidden="true">
          <FaCheck />
        </span>
        <p className={styles.doneTitle}>Message received.</p>
        <p>Thank you for your message! We&apos;ll reply to the email you gave us.</p>
        <button type="button" className={styles.again} onClick={() => setStatus('idle')}>
          Send another message
        </button>
      </div>
    )
  }

  const busy = status === 'loading'
  const isDemo = form.reason === 'Demo'

  return (
    <form className={styles.form} onSubmit={onSubmit} data-status={status}>
      <fieldset className={styles.reasons} disabled={busy}>
        <legend>What&apos;s it about? *</legend>
        {REASONS.map((r) => (
          <label key={r} className={styles.chip}>
            <input type="radio" name="reason" value={r} checked={form.reason === r} onChange={onChange} required />
            <span>{r}</span>
          </label>
        ))}
      </fieldset>

      {isDemo ? (
        <div className={styles.demoNote} role="note">
          <p>
            Demos go through our demo form — there we get your SoundCloud link, genre and contact in one place, and
            nothing gets lost in the inbox.
          </p>
          <Link href="/submit-demo" className={styles.submit}>
            <span>Go to submit demo</span>
            <FaArrowRight aria-hidden="true" />
          </Link>
        </div>
      ) : (
        <>
          <div className={styles.pair}>
            <div className={styles.row}>
              <label htmlFor="name">Your name *</label>
              <input id="name" name="name" type="text" autoComplete="name" placeholder="Name / alias" value={form.name} onChange={onChange} disabled={busy} required maxLength={120} />
            </div>
            <div className={styles.row}>
              <label htmlFor="email">Email *</label>
              <input id="email" name="email" type="email" autoComplete="email" inputMode="email" placeholder="your@email.com" value={form.email} onChange={onChange} disabled={busy} required maxLength={200} />
            </div>
          </div>

          <div className={styles.row}>
            <label htmlFor="subject">Subject *</label>
            <input id="subject" name="subject" type="text" placeholder="Short summary" value={form.subject} onChange={onChange} disabled={busy} required maxLength={200} />
          </div>

          <div className={styles.row}>
            <label htmlFor="message">
              Message * <small>{form.message.length}/5000</small>
            </label>
            <textarea id="message" name="message" rows={7} placeholder="Tell us what you have in mind…" value={form.message} onChange={onChange} disabled={busy} required minLength={10} maxLength={5000} />
          </div>

          {/* honeypot — bots fill it, people never see it */}
          <div className={styles.hp} aria-hidden="true">
            <label htmlFor="website">Website</label>
            <input id="website" name="website" type="text" tabIndex={-1} autoComplete="off" value={form.website} onChange={onChange} />
          </div>

          <div className={styles.captcha}>
            <Turnstile
              ref={turnstile}
              siteKey={siteKey}
              onSuccess={setToken}
              onExpire={() => setToken(null)}
              onError={() => {
                setToken(null)
                setStatus('error')
                setMessage('Security check failed. Please try again.')
              }}
              options={{ theme: 'dark', size: 'flexible' }}
            />
          </div>

          <button type="submit" className={styles.submit} disabled={busy || !token}>
            <FaPaperPlane aria-hidden="true" />
            <span>{busy ? 'Sending…' : 'Send message'}</span>
            <FaArrowRight aria-hidden="true" />
          </button>
        </>
      )}

      <p className={styles.status} role="status" aria-live="polite" data-tone={status}>
        {message && <FaTimesCircle aria-hidden="true" />}
        {message}
      </p>
    </form>
  )
}
