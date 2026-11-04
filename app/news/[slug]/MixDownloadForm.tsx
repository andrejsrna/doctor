'use client'

import { useId, useState } from 'react'
import Link from 'next/link'
import styles from './post.module.css'

export default function MixDownloadForm({ slug, format }: { slug: string; format: string }) {
  const id = useId()
  const [email, setEmail] = useState('')
  const [website, setWebsite] = useState('')
  const [privacy, setPrivacy] = useState(false)
  const [newsletter, setNewsletter] = useState(false)
  const [status, setStatus] = useState<'idle' | 'loading' | 'sent' | 'error'>('idle')
  const [error, setError] = useState('')

  if (status === 'sent') {
    return (
      <p className={styles.dlMsg} role="status">
        Check your inbox: the download link is on its way (valid for 7 days).
      </p>
    )
  }

  return (
    <form
      className={styles.dlForm}
      onSubmit={async (e) => {
        e.preventDefault()
        setError('')
        setStatus('loading')
        try {
          const res = await fetch(`/api/news/${encodeURIComponent(slug)}/request-download`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ email, website, acceptPrivacy: privacy, acceptNewsletter: newsletter }),
          })
          const json = await res.json().catch(() => null)
          if (!res.ok) throw new Error(json?.error || 'Something went wrong')
          setStatus('sent')
        } catch (err) {
          setError(err instanceof Error ? err.message : 'Something went wrong')
          setStatus('error')
        }
      }}
    >
      <div className={styles.hp} aria-hidden="true">
        <input type="text" name="website" tabIndex={-1} autoComplete="off" value={website} onChange={(e) => setWebsite(e.target.value)} />
      </div>
      <label className={styles.label} htmlFor={`${id}-email`}>
        Free {format} download · enter your email
      </label>
      <div className={styles.dlRow}>
        <input
          id={`${id}-email`}
          type="email"
          required
          autoComplete="email"
          placeholder="you@domain.com"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          className={styles.dlInput}
        />
        <button type="submit" className={styles.dlBtn} disabled={status === 'loading' || !privacy || !newsletter}>
          <span aria-hidden="true">↓</span> {status === 'loading' ? 'Sending…' : 'Email me the mix'}
        </button>
      </div>
      <label className={styles.dlCheck}>
        <input type="checkbox" checked={privacy} onChange={(e) => setPrivacy(e.target.checked)} />
        <span>
          I agree to the <Link href="/privacy-policy">Privacy Policy</Link>.
        </span>
      </label>
      <label className={styles.dlCheck}>
        <input type="checkbox" checked={newsletter} onChange={(e) => setNewsletter(e.target.checked)} />
        <span>Add me to the DnB Doctor newsletter: new releases, mixes and drops once a month. Unsubscribe anytime.</span>
      </label>
      {status === 'error' && (
        <p className={styles.dlMsg} data-state="error" role="alert">
          {error}
        </p>
      )}
    </form>
  )
}
