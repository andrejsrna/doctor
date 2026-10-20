'use client'

import { useState } from 'react'
import { FaFacebookF, FaLink, FaWhatsapp } from 'react-icons/fa'
import { FaXTwitter } from 'react-icons/fa6'
import { trackEvent } from '@/app/utils/analytics'
import styles from './post.module.css'

const TARGETS = [
  { name: 'Facebook', icon: FaFacebookF, url: (u: string) => `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(u)}` },
  { name: 'X', icon: FaXTwitter, url: (u: string, t: string) => `https://twitter.com/intent/tweet?url=${encodeURIComponent(u)}&text=${encodeURIComponent(t)}` },
  { name: 'WhatsApp', icon: FaWhatsapp, url: (u: string, t: string) => `https://wa.me/?text=${encodeURIComponent(`${t} ${u}`)}` },
]

export default function ShareBar({ url, title }: { url: string; title: string }) {
  const [copied, setCopied] = useState(false)
  const track = (method: string) => trackEvent('share', { method, content_type: 'news', content_name: title })

  const copy = async () => {
    track('copy_link')
    try {
      await navigator.clipboard.writeText(url)
      setCopied(true)
      window.setTimeout(() => setCopied(false), 1800)
    } catch {
      /* clipboard blocked — nothing useful to do */
    }
  }

  return (
    <div className={styles.shareRow}>
      {TARGETS.map(({ name, icon: Icon, url: build }) => (
        <a
          key={name}
          href={build(url, title)}
          target="_blank"
          rel="noopener noreferrer"
          className={styles.shareBtn}
          onClick={() => track(name)}
          aria-label={`Share on ${name}`}
        >
          <Icon aria-hidden="true" />
        </a>
      ))}
      <button type="button" className={`${styles.shareBtn} ${styles.shareCopy}`} onClick={copy} data-copied={copied || undefined}>
        <FaLink aria-hidden="true" />
        <span>{copied ? 'Copied' : 'Copy link'}</span>
      </button>
    </div>
  )
}
