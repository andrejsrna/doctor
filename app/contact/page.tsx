import type { Metadata } from 'next'
import Link from 'next/link'
import { FaDiscord, FaEnvelope, FaFacebookF, FaInstagram, FaSoundcloud } from 'react-icons/fa'
import { displayFont, monoFont } from '@/app/components/brandFonts'
import ContactForm from './ContactForm'
import styles from './contact.module.css'

// Email is shown as a label only (Cloudflare rewrites visible addresses → hydration error); the address lives in the href.
const CHANNELS = [
  { name: 'Email', note: 'General & business', href: 'mailto:info@dnbdoctor.com', icon: FaEnvelope },
  { name: 'Discord', note: 'Community & producer chat', href: 'https://discord.gg/GE2HWFdgXG', icon: FaDiscord },
  { name: 'Instagram', note: 'DMs & updates', href: 'https://www.instagram.com/dnbdoctor/', icon: FaInstagram },
  { name: 'Facebook', note: 'Messages & news', href: 'https://www.facebook.com/dnbdoctor', icon: FaFacebookF },
  { name: 'SoundCloud', note: 'Mixes & previews', href: 'https://soundcloud.com/dnbdoctor', icon: FaSoundcloud },
]

const jsonLd = {
  '@context': 'https://schema.org',
  '@type': 'ContactPage',
  name: 'Contact DnB Doctor',
  url: 'https://dnbdoctor.com/contact',
  publisher: {
    '@type': 'Organization',
    name: 'DnB Doctor',
    url: 'https://dnbdoctor.com',
    logo: 'https://dnbdoctor.com/email/dnb-doctor-logo.png',
    contactPoint: [
      { '@type': 'ContactPoint', contactType: 'customer service', email: 'info@dnbdoctor.com', availableLanguage: ['English', 'Slovak'], areaServed: 'Worldwide' },
      { '@type': 'ContactPoint', contactType: 'demo submission', url: 'https://dnbdoctor.com/submit-demo' },
    ],
    sameAs: CHANNELS.filter((c) => c.href.startsWith('http')).map((c) => c.href),
  },
}

export default function ContactPage() {
  return (
    <div className={`${styles.root} ${displayFont.variable} ${monoFont.variable}`}>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />

      <header className={styles.hero}>
        <nav className={styles.crumbs} aria-label="Breadcrumb">
          <Link href="/">DnB Doctor</Link> <span aria-hidden="true">/</span> <span aria-current="page">Contact</span>
          <span className={styles.crumbMeta}>
            <span className={styles.dot} aria-hidden="true" /> Inbox {'//'} open
          </span>
        </nav>
        <h1 className={styles.title}>
          <span className={styles.outline}>Contact</span>
          <span className={styles.solid}>the lab.</span>
        </h1>
        <p className={styles.lede}>Have a question or want to work with us? Get in touch and we&apos;ll get back to you soon.</p>
      </header>

      <section className={styles.grid} aria-label="Contact options">
        <div className={styles.side}>
          <div>
            <h2 className={styles.label}>01 / Channels</h2>
            <ul className={styles.channels}>
              {CHANNELS.map((c) => (
                <li key={c.name}>
                  <a href={c.href} {...(c.href.startsWith('http') ? { target: '_blank', rel: 'noopener noreferrer' } : {})}>
                    <c.icon aria-hidden="true" />
                    <span className={styles.chName}>{c.name}</span>
                    <span className={styles.chNote}>{c.note}</span>
                    <span className={styles.chArrow} aria-hidden="true">
                      ↗
                    </span>
                  </a>
                </li>
              ))}
            </ul>
          </div>

          <Link href="/submit-demo" className={styles.demo}>
            <span className={styles.demoKicker}>Producer?</span>
            <span className={styles.demoTitle}>Send demos here</span>
            <span className={styles.demoText}>Got a track? Skip the inbox and send it through the demo form — we listen to every submission.</span>
            <span className={styles.demoCta}>
              Submit demo <span aria-hidden="true">→</span>
            </span>
          </Link>

          <div>
            <h2 className={styles.label}>02 / Response time</h2>
            <p className={styles.reply}>We&apos;re a small team. We read every message and usually reply within a few working days.</p>
          </div>
        </div>

        <div className={styles.panel} id="contact-form">
          <p className={styles.panelHead}>
            <span>Message transmission</span>
            <span>We reply to your email</span>
          </p>
          <ContactForm siteKey={process.env.NEXT_PUBLIC_CF_TURNSTILE_SITE_KEY ?? ''} />
        </div>
      </section>
    </div>
  )
}

export const metadata: Metadata = {
  title: { absolute: 'Contact Us | DnB Doctor - Neurofunk Label' },
  description:
    'Get in touch with DnB Doctor. Contact us for collaborations, licensing, bookings or any questions about our neurofunk releases — demos go through the submit demo form.',
  alternates: { canonical: 'https://dnbdoctor.com/contact' },
  openGraph: {
    title: 'Contact DnB Doctor | Neurofunk Label',
    description: "Reach out to us for collaborations, licensing, bookings or questions. We're here to help!",
    url: 'https://dnbdoctor.com/contact',
    siteName: 'DnB Doctor',
    images: [{ url: 'https://dnbdoctor.com/og-image.jpg', width: 1200, height: 630, alt: 'Contact DnB Doctor' }],
    locale: 'en_US',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Contact DnB Doctor | Neurofunk Label',
    description: 'Get in touch with us for any inquiries or collaborations.',
    images: ['https://dnbdoctor.com/og-image.jpg'],
  },
}
