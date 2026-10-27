'use client'

import { useEffect, useState } from 'react'
import BuyButton, { type BuyOffer } from '@/app/components/shop/BuyButton'
import styles from './pack.module.css'

/** Bottom buy bar that slides in once the hero's buy box has scrolled out of view. */
export default function StickyBuy({ offer, title, watch }: { offer: BuyOffer; title: string; watch: string }) {
  const [show, setShow] = useState(false)

  useEffect(() => {
    const el = document.getElementById(watch)
    if (!el || !('IntersectionObserver' in window)) return
    const io = new IntersectionObserver(([e]) => {
      // Keep the bar (and its open dialog) mounted while the buyer is in checkout consent.
      if (document.querySelector('dialog[open]')) return
      setShow(!e.isIntersecting && e.boundingClientRect.top < 0)
    })
    io.observe(el)
    return () => io.disconnect()
  }, [watch])

  return (
    <div className={styles.sticky} data-show={show ? '' : undefined} aria-hidden={!show} inert={!show}>
      <div className={styles.stickyInner}>
        <span className={styles.stickyTitle}>{title}</span>
        <span className={styles.stickyPrice}>{offer.price}</span>
        <BuyButton offer={offer} className={styles.buy} label="Buy now" />
      </div>
    </div>
  )
}
