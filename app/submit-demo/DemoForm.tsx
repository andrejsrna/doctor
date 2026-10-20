'use client'

import { useRef, useState, type ChangeEvent, type FormEvent } from 'react'
import Link from 'next/link'
import { Turnstile, type TurnstileInstance } from '@marsidev/react-turnstile'
import { FaArrowRight, FaCheck, FaDiscord, FaSkull, FaTimesCircle } from 'react-icons/fa'
import styles from './submit-demo.module.css'

const GENRES = ['Neurofunk', 'Techstep', 'Dark DnB', 'Crossbreed', 'Other']

const EMPTY = { artistName: '', email: '', genre: '', subject: '', acceptGuidelines: false, acceptPrivacy: false }

type Status = 'idle' | 'loading' | 'success' | 'error'

export default function DemoForm({ siteKey }: { siteKey: string }) {
  const [form, setForm] = useState(EMPTY)
  const [token, setToken] = useState<string | null>(null)
  const [status, setStatus] = useState<Status>('idle')
  const [message, setMessage] = useState('')
  const turnstile = useRef<TurnstileInstance>(null)

  const onChange = (e: ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const t = e.target
    setForm((f) => ({ ...f, [t.name]: t instanceof HTMLInputElement && t.type === 'checkbox' ? t.checked : t.value }))
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
      // `subject` is the track link — field name kept for the existing API contract
      const res = await fetch('/api/submit-demo', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ ...form, token }),
      })
      const data = await res.json().catch(() => ({}))
      if (!res.ok) throw new Error(data.message || 'Failed to submit demo')
      setStatus('success')
      setForm(EMPTY)
    } catch (err) {
      setStatus('error')
      setMessage(err instanceof Error ? err.message : 'Failed to submit demo')
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
        <p className={styles.doneTitle}>Transmission received.</p>
        <p>Thanks for your submission! We&apos;ll review your demo and get back to you soon.</p>
        <p>
          Want feedback or just to talk shop while you wait?{' '}
          <a href="https://discord.gg/GE2HWFdgXG" target="_blank" rel="noopener noreferrer">
            <FaDiscord aria-hidden="true" /> Join our Discord
          </a>
        </p>
        <button type="button" className={styles.again} onClick={() => setStatus('idle')}>
          Send another demo
        </button>
      </div>
    )
  }

  const busy = status === 'loading'
  const ready = form.acceptGuidelines && form.acceptPrivacy && !!token

  return (
    <form className={styles.form} onSubmit={onSubmit} data-status={status}>
      <div className={styles.row}>
        <label htmlFor="artistName">Your real name *</label>
        <input
          id="artistName"
          name="artistName"
          type="text"
          autoComplete="name"
          placeholder="Name / artist alias"
          value={form.artistName}
          onChange={onChange}
          disabled={busy}
          required
          maxLength={120}
        />
      </div>

      <div className={styles.row}>
        <label htmlFor="email">Email *</label>
        <input
          id="email"
          name="email"
          type="email"
          autoComplete="email"
          inputMode="email"
          placeholder="your@email.com"
          value={form.email}
          onChange={onChange}
          disabled={busy}
          required
          maxLength={200}
        />
      </div>

      <fieldset className={styles.genres} disabled={busy}>
        <legend>Genre *</legend>
        {GENRES.map((g) => (
          <label key={g} className={styles.chip}>
            <input type="radio" name="genre" value={g} checked={form.genre === g} onChange={onChange} required />
            <span>{g}</span>
          </label>
        ))}
      </fieldset>

      <div className={styles.row}>
        <label htmlFor="subject">
          SoundCloud link <small>secret or private link</small> *
        </label>
        <input
          id="subject"
          name="subject"
          type="url"
          inputMode="url"
          placeholder="https://soundcloud.com/you/track/s-xxxx"
          pattern="https?://.+"
          value={form.subject}
          onChange={onChange}
          disabled={busy}
          required
          maxLength={500}
        />
      </div>

      <label className={styles.consent}>
        <input type="checkbox" name="acceptGuidelines" checked={form.acceptGuidelines} onChange={onChange} disabled={busy} required />
        <span className={styles.box} aria-hidden="true" />
        <span>
          I have read and followed the{' '}
          <Link href="/guidelines" target="_blank">
            submission guidelines
          </Link>
          . My demo meets all the requirements. *
        </span>
      </label>

      <label className={styles.consent}>
        <input type="checkbox" name="acceptPrivacy" checked={form.acceptPrivacy} onChange={onChange} disabled={busy} required />
        <span className={styles.box} aria-hidden="true" />
        <span>
          I agree to the{' '}
          <Link href="/privacy-policy" target="_blank">
            privacy policy
          </Link>
          . *
        </span>
      </label>

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

      <button type="submit" className={styles.submit} disabled={busy || !ready}>
        <FaSkull aria-hidden="true" />
        <span>{busy ? 'Infecting…' : 'Submit demo'}</span>
        <FaArrowRight aria-hidden="true" />
      </button>

      <p className={styles.status} role="status" aria-live="polite" data-tone={status}>
        {message && <FaTimesCircle aria-hidden="true" />}
        {message}
      </p>
    </form>
  )
}
