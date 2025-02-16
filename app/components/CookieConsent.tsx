'use client'

import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import Cookies from 'js-cookie'

type CookieSettings = {
  analytics: boolean
  marketing: boolean
}

const COOKIE_CONSENT_KEY = 'cookie-consent'
const COOKIE_EXPIRY_DAYS = 365

export default function CookieConsent() {
  const [isVisible, setIsVisible] = useState(false)
  const [isMounted, setIsMounted] = useState(false)

  // Optimalizovaná funkcia pre správu analytických nástrojov
  const handleAnalyticsTools = (settings: CookieSettings) => {
    if (typeof window === 'undefined') return

    // Google Analytics
    const gaKey = `ga-disable-${process.env.NEXT_PUBLIC_GA_ID}`
    if (settings.analytics) {
      window[gaKey] = false
    } else {
      window[gaKey] = true
      const cookies = ['_ga', '_gat', '_gid']
      cookies.forEach(cookie => Cookies.remove(cookie))
    }

    // Facebook Pixel
    if (settings.marketing) {
      // Lazy load Facebook Pixel
      import('react-facebook-pixel').then((ReactPixel) => {
        const options = {
          autoConfig: true,
          debug: process.env.NODE_ENV !== 'production',
        }
        ReactPixel.default.init(process.env.NEXT_PUBLIC_FB_PIXEL_ID as string, undefined, options)
        ReactPixel.default.grantConsent()
        ReactPixel.default.pageView()
      })
    } else {
      // Remove FB pixel cookies
      Object.keys(Cookies.get()).forEach(cookieName => {
        if (cookieName.startsWith('_fb') || cookieName.startsWith('fb')) {
          Cookies.remove(cookieName)
        }
      })
    }
  }

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
      } catch (error) {
        console.error('Error parsing cookie consent:', error);
        // Set default values if parsing fails
        handleAnalyticsTools({ analytics: false, marketing: false });
      }
    }
  }, [])

  const saveConsent = (settings: CookieSettings) => {
    Cookies.set(COOKIE_CONSENT_KEY, JSON.stringify(settings), { 
      expires: COOKIE_EXPIRY_DAYS,
      sameSite: 'strict'
    })
    handleAnalyticsTools(settings)
    setIsVisible(false)
  }

  if (!isMounted || !isVisible) return null

  return (
    <motion.div
      initial={{ opacity: 0, y: 50 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: 50 }}
      className="fixed bottom-0 left-0 right-0 z-[201] bg-black/95 backdrop-blur-xl p-6"
    >
      <div className="container mx-auto max-w-4xl">
        <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
          <div className="flex-1">
            <h3 className="text-lg font-semibold text-white mb-2">
              We value your privacy
            </h3>
            <p className="text-gray-300 text-sm">
              We use cookies to enhance your browsing experience, serve personalized content, 
              and analyze our traffic. By clicking &quot;Accept All&quot;, you consent to our use of 
              cookies. Visit our <a href="/terms" className="text-purple-500 hover:text-purple-400">
              Privacy Policy</a> to learn more.
            </p>
          </div>
          <div className="flex flex-col sm:flex-row gap-3">
            <button
              onClick={() => saveConsent({ analytics: false, marketing: false })}
              className="px-6 py-2 text-sm font-medium text-white hover:bg-white/10 
                border border-white/20 rounded-lg transition-colors"
            >
              Reject All
            </button>
            <button
              onClick={() => saveConsent({ analytics: true, marketing: true })}
              className="px-6 py-2 text-sm font-medium text-white bg-purple-600 
                hover:bg-purple-700 rounded-lg transition-colors"
            >
              Accept All
            </button>
          </div>
        </div>
      </div>
    </motion.div>
  )
} 