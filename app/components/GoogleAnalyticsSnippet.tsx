'use client'

import { useEffect } from 'react'

declare global {
  interface Window {
    __ddPublicEnv?: Record<string, string>
    dataLayer?: unknown[]
    gtag?: (...args: unknown[]) => void
    __ddGtagInitialized?: boolean
    Cookiebot?: { consent?: { statistics?: boolean } }
    CookiebotOnAccept?: () => void
    CookiebotOnConsentReady?: () => void
    CookiebotOnDecline?: () => void
  }
}

const DEFAULT_GA_ID = 'G-2T70HCKY2Z'

const getGaId = () => {
  const env = window.__ddPublicEnv || {}
  return (env.GA_ID || DEFAULT_GA_ID).trim()
}

const hasStatsConsent = () => {
  try {
    return Boolean(window.Cookiebot?.consent?.statistics)
  } catch {
    return false
  }
}

const ensureGtagBase = () => {
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
}

const ensureScript = (idForScriptLoad: string) => {
  const existing = document.querySelector('script[src^="https://www.googletagmanager.com/gtag/js"]')
  if (existing) return
  const s = document.createElement('script')
  s.async = true
  s.src = `https://www.googletagmanager.com/gtag/js?id=${encodeURIComponent(idForScriptLoad)}`
  document.head.appendChild(s)
}

const configureGa = () => {
  const gaId = getGaId()
  if (!gaId) return
  ensureGtagBase()
  ensureScript(gaId)
  try {
    window.gtag?.('config', gaId)
  } catch {
    // ignore
  }
}

export default function GoogleAnalyticsSnippet() {
  useEffect(() => {
    const update = () => {
      if (!hasStatsConsent()) return
      configureGa()
    }

    // Run once on mount.
    update()

    // Hook into Cookiebot callbacks (chain if already defined).
    const chain = (name: 'CookiebotOnAccept' | 'CookiebotOnConsentReady' | 'CookiebotOnDecline') => {
      const prev = window[name]
      window[name] = () => {
        try {
          prev?.()
        } finally {
          update()
        }
      }
    }

    chain('CookiebotOnAccept')
    chain('CookiebotOnConsentReady')
    chain('CookiebotOnDecline')
  }, [])

  return null
}
