'use client'

export const ENABLE_OUTBOUND_INTERSTITIAL =
  typeof window !== 'undefined' &&
  (process.env.NEXT_PUBLIC_OUTBOUND_INTERSTITIAL === '1' ||
    process.env.NEXT_PUBLIC_OUTBOUND_INTERSTITIAL === 'true')


