'use client'

import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import Cookies from 'js-cookie'
import { FaSkull, FaSyringe, FaShieldVirus } from 'react-icons/fa'
import Button from './Button'

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
      className="fixed bottom-0 left-0 right-0 z-[201] bg-black/95 backdrop-blur-xl border-t border-purple-500/20"
    >
      <div className="container mx-auto max-w-4xl p-6">
        <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
          <div className="flex-1 space-y-4">
            <div className="flex items-center gap-3">
              <div className="p-2 rounded-full bg-purple-500/20 border border-purple-500/30">
                <FaShieldVirus className="w-5 h-5 text-purple-500" />
              </div>
              <h3 className="text-lg font-semibold text-white">
              We value your privacy
            </h3>
            </div>
            <motion.p 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.2 }}
              className="text-gray-300 text-sm"
            >
              We use cookies to enhance your browsing experience, serve personalized content, 
              and analyze our traffic. By clicking &quot;Accept All&quot;, you consent to our use of 
              cookies. Visit our{' '}
              <a 
                href="/terms" 
                className="text-purple-500 hover:text-pink-500 transition-colors duration-300 underline"
              >
                Privacy Policy
              </a>
              {' '}to learn more.
            </motion.p>
          </div>
          <div className="flex flex-col sm:flex-row gap-3">
            <motion.div
              whileHover={{ scale: 1.02 }}
              className="w-full sm:w-auto"
            >
              <Button
              onClick={() => saveConsent({ analytics: false, marketing: false })}
                variant="decayed"
                className="w-full sm:w-auto group"
              >
                <FaSkull className="w-5 h-5 mr-2 transform group-hover:rotate-12 transition-transform duration-300" />
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
                className="w-full sm:w-auto group"
              >
                <FaSyringe className="w-5 h-5 mr-2 transform group-hover:rotate-45 transition-transform duration-300" />
                <span>Accept All</span>
              </Button>
            </motion.div>
          </div>
        </div>
      </div>
    </motion.div>
  )
} 