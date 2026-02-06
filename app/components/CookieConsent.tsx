'use client'

import { useState, useEffect, useCallback } from 'react'
import { motion } from 'framer-motion'
import Cookies from 'js-cookie'
import { FaSkull, FaSyringe, FaShieldVirus } from 'react-icons/fa'
import Button from './Button'

type CookieSettings = {
  analytics: boolean
  marketing: boolean
}

const COOKIE_CONSENT_KEY = 'cookie-consent'
const LS_CONSENT_KEY = 'dd-cookie-consent'
const COOKIE_EXPIRY_DAYS = 365
const DEFAULT_GOOGLE_ADS_ID = 'AW-16864411727'

export default function CookieConsent() {
  const [isVisible, setIsVisible] = useState(false)
  const [isMounted, setIsMounted] = useState(false)

  useEffect(() => {
    if (typeof window === 'undefined') return
    const handler = () => setIsVisible(true)
    window.addEventListener('dd-open-cookie-settings', handler)
    return () => window.removeEventListener('dd-open-cookie-settings', handler)
  }, [])

  const ensureGtagReady = useCallback((idForScriptLoad: string) => {
    if (typeof window === 'undefined') return
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
  }, [])

  const loadGoogleAnalytics = useCallback(() => {
    if (typeof window === 'undefined') return
    const gaId = process.env.NEXT_PUBLIC_GA_ID
    if (!gaId) return
    ensureGtagReady(gaId)
    window.gtag?.('config', gaId, { page_title: document.title, page_location: window.location.href })
  }, [ensureGtagReady])

  const loadGoogleAds = useCallback(() => {
    if (typeof window === 'undefined') return
    const adsId = process.env.NEXT_PUBLIC_GOOGLE_ADS_ID || DEFAULT_GOOGLE_ADS_ID
    if (!adsId) return
    ensureGtagReady(adsId)
    window.gtag?.('config', adsId)
  }, [ensureGtagReady])

  // Optimalizovaná funkcia pre správu analytických nástrojov
  const handleAnalyticsTools = useCallback((settings: CookieSettings) => {
    if (typeof window === 'undefined') return

    // Google Analytics
    const gaId = process.env.NEXT_PUBLIC_GA_ID
    const gaKey = gaId ? `ga-disable-${gaId}` : null
    if (gaKey) {
      if (settings.analytics) {
        ;(globalThis as unknown as Record<string, unknown>)[gaKey] = false
      } else {
        ;(globalThis as unknown as Record<string, unknown>)[gaKey] = true
      }
    }
    if (!settings.analytics) {
      const cookies = ['_ga', '_gat', '_gid']
      cookies.forEach(cookie => Cookies.remove(cookie))
    }

    // Google Ads
    if (settings.marketing) {
      loadGoogleAds()
    } else {
      try {
        window.gtag?.('consent', 'update', {
          ad_storage: 'denied',
          ad_user_data: 'denied',
          ad_personalization: 'denied',
        })
      } catch {
        // ignore
      }
      Object.keys(Cookies.get()).forEach(cookieName => {
        if (cookieName.startsWith('_gcl_')) Cookies.remove(cookieName)
      })
    }

    // Facebook Pixel
    if (settings.marketing) {
      const pixelId = process.env.NEXT_PUBLIC_FB_PIXEL_ID as string | undefined
      if (!pixelId) return
      // Lazy load Facebook Pixel
      import('react-facebook-pixel').then((ReactPixel) => {
        try {
          const options = {
            autoConfig: true,
            debug: process.env.NODE_ENV !== 'production',
          }
          ReactPixel.default.init(pixelId, undefined, options)
          ReactPixel.default.grantConsent()
          ReactPixel.default.pageView()
          
          
        } catch {
          // Silently handle Facebook Pixel errors
        }
      }).catch(() => {
        // Silently handle import errors
      })
    } else {
      try {
        if (typeof window !== 'undefined' && 'fbq' in window && typeof window.fbq === 'function') {
          window.fbq('consent', 'revoke')
        }
      } catch {
        // ignore
      }
      // Remove FB pixel cookies
      Object.keys(Cookies.get()).forEach(cookieName => {
        if (cookieName.startsWith('_fb') || cookieName.startsWith('fb')) {
          Cookies.remove(cookieName)
        }
      })
    }
  }, [loadGoogleAds])

  const loadCloudflareAnalytics = useCallback(() => {
    if (typeof window === 'undefined') return
    if (document.querySelector('script[data-cf-beacon]')) return
    const token = process.env.NEXT_PUBLIC_CF_BEACON_TOKEN
    if (!token) return
    const sc = document.createElement('script')
    sc.defer = true
    sc.src = 'https://static.cloudflareinsights.com/beacon.min.js'
    sc.setAttribute('data-cf-beacon', JSON.stringify({ token }))
    document.body.appendChild(sc)
  }, [])

  const removeCloudflareAnalytics = useCallback(() => {
    if (typeof window === 'undefined') return
    const existing = document.querySelector('script[src*="cloudflareinsights.com/beacon.min.js"]')
    if (existing && existing.parentNode) existing.parentNode.removeChild(existing)
  }, [])

  useEffect(() => {
    setIsMounted(true)
    const consent = Cookies.get(COOKIE_CONSENT_KEY)
    
    if (!consent) {
      setIsVisible(true)
    } else {
      try {
        const savedSettings = consent === 'refused' 
          ? { analytics: false, marketing: false } 
          : JSON.parse(consent) as CookieSettings;
        handleAnalyticsTools(savedSettings);
        try { window.localStorage.setItem(LS_CONSENT_KEY, JSON.stringify(savedSettings)) } catch {}
        if (savedSettings.analytics) {
          loadGoogleAnalytics()
          loadCloudflareAnalytics()
        } else {
          removeCloudflareAnalytics()
        }
      } catch (error) {
        console.error('Error parsing cookie consent:', error);
        // Set default values if parsing fails
        handleAnalyticsTools({ analytics: false, marketing: false });
      }
    }
  }, [handleAnalyticsTools, loadCloudflareAnalytics, loadGoogleAnalytics, removeCloudflareAnalytics])

  const saveConsent = (settings: CookieSettings) => {
    Cookies.set(COOKIE_CONSENT_KEY, JSON.stringify(settings), { 
      expires: COOKIE_EXPIRY_DAYS,
      sameSite: 'strict'
    })
    try { window.localStorage.setItem(LS_CONSENT_KEY, JSON.stringify(settings)) } catch {}
    handleAnalyticsTools(settings)
    if (settings.analytics) {
      loadGoogleAnalytics()
      loadCloudflareAnalytics()
    } else {
      removeCloudflareAnalytics()
    }
    try {
      const evt = new CustomEvent('dd-consent-changed', { detail: settings })
      window.dispatchEvent(evt)
    } catch {}
    setIsVisible(false)
  }

  if (!isMounted || !isVisible) return null

  return (
    <motion.div
      initial={{ opacity: 0, y: 50 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: 50 }}
      className="fixed bottom-0 left-0 right-0 z-[201] bg-black/95 backdrop-blur-xl border-t border-purple-500/20"
    >
      <div className="container mx-auto max-w-4xl p-3 md:p-6">
        <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-3 md:gap-6">
          <div className="flex-1 space-y-2 md:space-y-4">
            <div className="flex items-center gap-2 md:gap-3">
              <div className="p-1.5 md:p-2 rounded-full bg-purple-500/20 border border-purple-500/30">
                <FaShieldVirus className="w-4 h-4 md:w-5 md:h-5 text-purple-500" />
              </div>
              <h3 className="text-base md:text-lg font-semibold text-white">
              We value your privacy
            </h3>
            </div>
            <motion.p 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.2 }}
              className="text-gray-300 text-xs md:text-sm"
            >
              We use cookies to enhance your browsing experience, serve personalized content, 
              and analyze our traffic. By clicking &quot;Accept All&quot;, you consent to our use of 
              cookies. Visit our{' '}
              <a 
                href="/privacy-policy" 
                className="text-purple-500 hover:text-pink-500 transition-colors duration-300 underline"
              >
                Privacy Policy
              </a>
              {' '}to learn more.
            </motion.p>
          </div>
          <div className="flex flex-col sm:flex-row gap-2 md:gap-3">
            <motion.div
              whileHover={{ scale: 1.02 }}
              className="w-full sm:w-auto"
            >
              <Button
              onClick={() => saveConsent({ analytics: false, marketing: false })}
                variant="decayed"
                className="w-full sm:w-auto group text-xs md:text-sm py-2 md:py-3"
              >
                <FaSkull className="w-4 h-4 md:w-5 md:h-5 mr-1.5 md:mr-2 transform group-hover:rotate-12 transition-transform duration-300" />
                <span>Reject All</span>
              </Button>
            </motion.div>
            <motion.div
              whileHover={{ scale: 1.02 }}
              className="w-full sm:w-auto"
            >
              <Button
              onClick={() => saveConsent({ analytics: true, marketing: true })}
                variant="infected"
                className="w-full sm:w-auto group text-xs md:text-sm py-2 md:py-3"
              >
                <FaSyringe className="w-4 h-4 md:w-5 md:h-5 mr-1.5 md:mr-2 transform group-hover:rotate-45 transition-transform duration-300" />
                <span>Accept All</span>
              </Button>
            </motion.div>
          </div>
        </div>
      </div>
    </motion.div>
  )
} 
