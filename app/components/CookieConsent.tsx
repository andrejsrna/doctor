'use client'

import { useState, useEffect, useCallback } from 'react'
import { motion } from 'framer-motion'
import Cookies from 'js-cookie'
import ReactPixel from 'react-facebook-pixel'

interface CookieSettings {
  analytics: boolean
  marketing: boolean
}

export default function CookieConsent() {
  const [isVisible, setIsVisible] = useState(false)

  const applyCookieSettings = useCallback((settings: CookieSettings) => {
    // Handle Google Analytics
    if (settings.analytics) {
      window[`ga-disable-${process.env.NEXT_PUBLIC_GA_ID}`] = false
    } else {
      window[`ga-disable-${process.env.NEXT_PUBLIC_GA_ID}`] = true
      Cookies.remove('_ga')
      Cookies.remove('_gat')
      Cookies.remove('_gid')
    }

    // Handle Facebook Pixel
    if (settings.marketing) {
      initializeFacebookPixel()
      ReactPixel.grantConsent()
      ReactPixel.pageView()
    } else {
      ReactPixel.revokeConsent()
      // Remove FB pixel cookies
      Object.keys(Cookies.get()).forEach(cookieName => {
        if (cookieName.startsWith('_fb') || cookieName.startsWith('fb')) {
          Cookies.remove(cookieName)
        }
      })
    }
  }, [])

  useEffect(() => {
    // Check if user has already made a choice
    const consent = Cookies.get('cookie-consent')
    if (!consent) {
      setIsVisible(true)
    } else {
      // If consent exists, apply saved settings
      const savedSettings = JSON.parse(consent) as CookieSettings
      applyCookieSettings(savedSettings)
    }
  }, [applyCookieSettings])

  const initializeFacebookPixel = () => {
    const options = {
      autoConfig: true,
      debug: process.env.NODE_ENV !== 'production',
    }
    ReactPixel.init(process.env.NEXT_PUBLIC_FB_PIXEL_ID as string, undefined, options)
  }

  const handleAcceptAll = () => {
    const newSettings = { analytics: true, marketing: true }
    saveConsent(newSettings)
  }

  const handleRejectAll = () => {
    const newSettings = { analytics: false, marketing: false }
    saveConsent(newSettings)
  }

  const saveConsent = (settings: CookieSettings) => {
    // Save settings in cookie (expires in 365 days)
    Cookies.set('cookie-consent', JSON.stringify(settings), { expires: 365 })
    
    applyCookieSettings(settings)
    setIsVisible(false)
  }

  if (!isVisible) return null

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
              onClick={handleRejectAll}
              className="px-6 py-2 text-sm font-medium text-white hover:bg-white/10 
                border border-white/20 rounded-lg transition-colors"
            >
              Reject All
            </button>
            <button
              onClick={handleAcceptAll}
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