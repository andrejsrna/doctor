'use client'

import { useState, type FormEvent } from 'react'
import Image from 'next/image'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import toast from 'react-hot-toast'
import { FaArrowRight, FaArrowUp, FaBandcamp, FaDiscord, FaFacebookF, FaInstagram, FaSoundcloud, FaSpotify, FaYoutube } from 'react-icons/fa'
import { SiBeatport } from 'react-icons/si'
import { subscriberApi } from '../services/subscriberApi'
import { displayFont, monoFont } from './brandFonts'
import styles from './Footer.module.css'

const PLATFORMS = [
  { title: 'Instagram', href: 'https://www.instagram.com/dnbdoctor/', icon: FaInstagram },
  { title: 'Facebook', href: 'https://www.facebook.com/dnbdoctor', icon: FaFacebookF },
  { title: 'Discord', href: 'https://discord.gg/GE2HWFdgXG', icon: FaDiscord },
  { title: 'YouTube', href: 'https://www.youtube.com/@dnbdoctor1', icon: FaYoutube },
  { title: 'Spotify', href: 'https://open.spotify.com/playlist/2GD72ly17HcWc9OAEtdUBP', icon: FaSpotify },
  { title: 'SoundCloud', href: 'https://soundcloud.com/dnbdoctor', icon: FaSoundcloud },
  { title: 'Bandcamp', href: 'https://dnbdoctor.bandcamp.com/', icon: FaBandcamp },
  { title: 'Beatport', href: 'https://www.beatport.com/label/dnb-doctor/75618', icon: SiBeatport },
]

const COLUMNS = [
  {
    title: 'Label',
    links: [
      { href: '/about', text: 'About us' },
      { href: '/core-artists', text: 'Core artists' },
      { href: '/albums', text: 'DnB albums' },
      { href: '/newsletter', text: 'Newsletter' },
      { href: '/contact', text: 'Contact' },
    ],
  },
  {
    title: 'Learn',
    links: [
      { href: '/how-to-produce-neurofunk', text: 'How to make neurofunk' },
      { href: '/recommended-tools', text: 'Recommended tools' },
      { href: '/neurofunk-labels', text: 'Neurofunk labels guide' },
      { href: '/types-of-dnb', text: 'Types of DnB' },
      { href: '/what-is-drum-and-bass', text: 'What is drum and bass?' },
      { href: '/drum-and-bass-history', text: 'History of drum and bass' },
    ],
  },
  {
    title: 'Listen',
    links: [
      { href: '/neurofunk-drum-and-bass', text: 'Neurofunk drum & bass' },
      { href: '/neurofunk-dnb', text: 'Neurofunk DnB' },
      { href: '/neurofunk-spotify', text: 'Neurofunk Spotify playlists' },
    ],
  },
]

const PARTNERS = [
  { name: 'Beatport', href: 'https://www.beatport.com/?a_aid=69dac828ced75' },
  { name: 'DJCity', href: 'https://www.djcity.com/?a_aid=69dac828ced75' },
  { name: 'Plugin Boutique', href: 'https://www.pluginboutique.com/?a_aid=69dac828ced75' },
  { name: 'Loopcloud', href: 'https://www.loopcloud.com/?a_aid=69dac828ced75' },
  { name: 'Loopmasters', href: 'https://www.loopmasters.com/?a_aid=69dac828ced75' },
]

type Status = 'idle' | 'loading' | 'success' | 'error'

export default function Footer() {
  const onNewsletterPage = usePathname() === '/newsletter'
  const [email, setEmail] = useState('')
  const [acceptedPrivacy, setAcceptedPrivacy] = useState(false)
  const [status, setStatus] = useState<Status>('idle')
  const [message, setMessage] = useState('')

  const openCookieSettings = () => {
    try {
      window.dispatchEvent(new Event('dd-open-cookie-settings'))
    } catch {
      // ignore
    }
  }

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault()
    if (!acceptedPrivacy) {
      setStatus('error')
      setMessage('Please accept the privacy policy')
      return
    }
    setStatus('loading')
    try {
      await subscriberApi.subscribe({ email, group: 'Newsletter', source: 'footer' })
      setStatus('success')
      setMessage('Thanks for subscribing!')
      toast.success('Subscribed to Newsletter')
      setEmail('')
      setAcceptedPrivacy(false)
    } catch (error) {
      const msg = error instanceof Error ? error.message : 'Failed to subscribe'
      setStatus('error')
      setMessage(msg)
      toast.error(msg)
    }
  }

  return (
    <footer className={`${styles.root} ${displayFont.variable} ${monoFont.variable}`}>
      {/* 01 newsletter transmission */}
      {/* /newsletter has its own form — skip the duplicate */}
      {!onNewsletterPage && (
      <section className={styles.signal} aria-labelledby="footer-newsletter">
        <div className={styles.signalHead}>
          <p className={styles.kicker}>
            <span className={styles.dot} aria-hidden="true" /> Transmission {'//'} label news &amp; releases
          </p>
          <h2 id="footer-newsletter" className={styles.signalTitle}>
            <span className={styles.outline}>Stay</span> <span>updated</span>
          </h2>
          <p className={styles.signalText}>Subscribe to our newsletter for the latest releases and updates.</p>
        </div>

        <form className={styles.form} onSubmit={handleSubmit}>
          <div className={styles.field}>
            <label htmlFor="footer-email" className={styles.srOnly}>
              Email
            </label>
            <span className={styles.prompt} aria-hidden="true">
              &gt;_
            </span>
            <input
              id="footer-email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="your@email.com"
              autoComplete="email"
              disabled={status === 'loading'}
              required
            />
            <button type="submit" disabled={status === 'loading' || !acceptedPrivacy}>
              {status === 'loading' ? 'Sending…' : 'Subscribe'} <FaArrowRight aria-hidden="true" />
            </button>
          </div>
          <label className={styles.consent}>
            <input
              type="checkbox"
              checked={acceptedPrivacy}
              onChange={(e) => setAcceptedPrivacy(e.target.checked)}
              disabled={status === 'loading'}
              required
            />
            <span className={styles.box} aria-hidden="true" />
            <span>
              I agree to the{' '}
              <Link href="/privacy-policy" target="_blank">
                privacy policy
              </Link>
            </span>
          </label>
          {message && (
            <p className={styles.status} data-state={status} role="status">
              {message}
            </p>
          )}
        </form>
      </section>
      )}

      {/* 02 directory */}
      <div className={styles.directory}>
        <div className={styles.brand}>
          <Link href="/" className={styles.logo} aria-label="DnB Doctor home">
            <Image src="/brand/dnb-doctor-logo.webp" alt="" width={640} height={605} sizes="96px" />
          </Link>
          <p className={styles.tagline}>
            Neurofunk &amp; drum and bass label. Releases, packs and mixes at <b>174 BPM</b>.
          </p>
          <ul className={styles.platforms} aria-label="DnB Doctor on other platforms">
            {PLATFORMS.map(({ title, href, icon: Icon }) => (
              <li key={title}>
                <a href={href} target="_blank" rel="noopener noreferrer" aria-label={title} title={title}>
                  <Icon aria-hidden="true" />
                </a>
              </li>
            ))}
          </ul>
        </div>

        {COLUMNS.map((col) => (
          <nav key={col.title} className={styles.col} aria-label={col.title}>
            <h3 className={styles.colTitle}>{col.title}</h3>
            <ul>
              {col.links.map((l) => (
                <li key={l.href}>
                  <Link href={l.href}>{l.text}</Link>
                </li>
              ))}
            </ul>
          </nav>
        ))}

        <nav className={styles.col} aria-label="Partners">
          <h3 className={styles.colTitle}>Partners</h3>
          <ul>
            {PARTNERS.map((p) => (
              <li key={p.name}>
                <a href={p.href} target="_blank" rel="noopener noreferrer sponsored">
                  {p.name} <span aria-hidden="true">↗</span>
                </a>
              </li>
            ))}
            <li>
              <Link href="/recommended-tools" className={styles.more}>
                View all →
              </Link>
            </li>
          </ul>
        </nav>
      </div>

      {/* 03 wordmark */}
      <div className={styles.wordmark} aria-hidden="true">
        <span>DnB</span>
        <span>Doctor</span>
      </div>

      {/* 04 legal bar */}
      <div className={styles.legal}>
        <p suppressHydrationWarning>
          © {new Date().getFullYear()} DnB Doctor. All rights reserved.{' '}
          <a href="https://synthbit.cz" target="_blank" rel="noopener noreferrer">
            SynthBit, s.r.o.
          </a>
        </p>
        <ul>
          <li>
            <Link href="/privacy-policy">Privacy policy</Link>
          </li>
          <li>
            <Link href="/terms">Terms &amp; conditions</Link>
          </li>
          <li>
            <button type="button" onClick={openCookieSettings}>
              Cookie settings
            </button>
          </li>
          <li>
            <button type="button" onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}>
              Back to top <FaArrowUp aria-hidden="true" />
            </button>
          </li>
        </ul>
      </div>
    </footer>
  )
}
