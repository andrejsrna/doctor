'use client'

import { useEffect } from 'react'

// Minimal, bulletproof-ish Google Ads conversion helper.
// Defines window.gtag_report_conversion(url?) compatible with Google's snippet.

declare global {
  interface Window {
    __ddPublicEnv?: Record<string, string>
    dataLayer?: unknown[]
    gtag?: (...args: any[]) => void
    __ddGtagInitialized?: boolean
    gtag_report_conversion?: (url?: string) => boolean
  }
}

const DEFAULT_GOOGLE_ADS_ID = 'AW-16864411727'

const getAdsId = () => {
  const env = window.__ddPublicEnv || {}
  return (env.GOOGLE_ADS_ID || DEFAULT_GOOGLE_ADS_ID).trim()
}

const getSendTo = () => {
  const env = window.__ddPublicEnv || {}
  return (env.GOOGLE_ADS_PURCHASE_SEND_TO || '').trim()
}

const ensureGtagReady = (idForScriptLoad: string) => {
  if (!idForScriptLoad) return

  window.dataLayer = window.dataLayer || []
  window.gtag =
    window.gtag ||
    function gtag(...args: unknown[]) {
      window.dataLayer?.push(args)
    }

  if (!window.__ddGtagInitialized) {
    window.gtag('js', new Date())
    window.__ddGtagInitialized = true
  }

  const existing = document.querySelector('script[src^="https://www.googletagmanager.com/gtag/js"]')
  if (!existing) {
    const src = `https://www.googletagmanager.com/gtag/js?id=${encodeURIComponent(idForScriptLoad)}`
    const s = document.createElement('script')
    s.async = true
    s.src = src
    document.head.appendChild(s)
  }

  try {
    window.gtag?.('config', idForScriptLoad)
  } catch {
    // ignore
  }
}

export default function GoogleAdsConversionSnippet() {
  useEffect(() => {
    const adsId = getAdsId()
    const sendTo = getSendTo()

    // Define Google's expected helper.
    window.gtag_report_conversion = (url?: string) => {
      try {
        // Ensure gtag exists & script is injected.
        ensureGtagReady(adsId)

        // If send_to is missing, still run callback navigation.
        const callback = function () {
          if (typeof url !== 'undefined' && url) {
            window.location.href = url
          }
        }

        if (!sendTo) {
          callback()
          return false
        }

        window.gtag?.('event', 'conversion', {
          send_to: sendTo,
          transaction_id: '',
          event_callback: callback,
          event_timeout: 2000,
        })

        // Fallback: if callback never fires, navigate after timeout.
        if (url) {
          window.setTimeout(() => {
            try {
              window.location.href = url
            } catch {
              // ignore
            }
          }, 2100)
        }
      } catch {
        // In worst case: still navigate.
        if (typeof url !== 'undefined' && url) {
          window.location.href = url
        }
      }
      return false
    }

    // Preload gtag early when marketing consent is already granted.
    // (Consent handling is managed elsewhere; this just ensures the function exists.)
    if (sendTo) {
      ensureGtagReady(adsId)
    }
  }, [])

  return null
}
