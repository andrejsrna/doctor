'use client'

import { useEffect } from 'react'

/** Empty the merch bag after a paid checkout. */
export default function ClearBag() {
  useEffect(() => {
    localStorage.removeItem('dnbd-merch-bag')
    window.dispatchEvent(new Event('dnbd-merch-bag'))
  }, [])
  return null
}
