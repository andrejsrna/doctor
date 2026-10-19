'use client'

import Image from 'next/image'
import type { ComponentType, CSSProperties } from 'react'
import { trackEvent } from '@/app/utils/analytics'
import styles from './ChannelStack.module.css'

export type Channel = {
  id: string
  icon: ComponentType
  kicker: string
  word: string
  note: string
  cta: string
  href: string
  hue: string
  priority?: boolean
  /** Optional square artwork (e.g. playlist cover) shown in the kicker column. */
  thumb?: string
}

const isExternal = (href: string) => href.startsWith('http')

/**
 * Brutal full-width channel rows: huge word, colour wipe on hover.
 * Shared by the release outro ("Next drop") and the home "Listen now" section.
 * Rows carry data-reveal so a parent reveal hook can animate them in.
 */
export default function ChannelStack({ channels, badge = 'Priority' }: { channels: Channel[]; badge?: string }) {
  return (
    <ul className={styles.channels}>
      {channels.map((c, i) => {
        const Icon = c.icon
        const ext = isExternal(c.href)
        return (
          <li key={c.id} data-reveal="" style={{ '--i': i, '--hue': c.hue } as CSSProperties}>
            <a
              href={c.href}
              target={ext ? '_blank' : undefined}
              rel={ext ? 'noopener noreferrer' : undefined}
              className={styles.channel}
              data-priority={c.priority ? '' : undefined}
              onClick={() => trackEvent('engagement', { method: c.cta, content_type: 'cta', content_name: c.cta })}
            >
              <span className={styles.chKick}>
                {c.thumb && (
                  <span className={styles.chThumb}>
                    <Image src={c.thumb} alt="" fill sizes="88px" />
                  </span>
                )}
                <span>{String(i + 1).padStart(2, '0')}</span>
                <span>{c.kicker}</span>
                {c.priority && <b>{badge}</b>}
              </span>
              <span className={styles.chWord}>{c.word}</span>
              <span className={styles.chNote}>{c.note}</span>
              <span className={styles.chCta}>
                <span className={styles.chIcon}><Icon /></span>
                {c.cta} <span aria-hidden="true">→</span>
              </span>
            </a>
          </li>
        )
      })}
    </ul>
  )
}
