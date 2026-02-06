'use client'

type CookieSettings = {
  analytics: boolean
  marketing: boolean
}

const LS_CONSENT_KEY = 'dd-cookie-consent'
const COOKIE_CONSENT_KEY = 'cookie-consent'

const safeJsonParse = <T,>(value: string): T | null => {
  try {
    return JSON.parse(value) as T
  } catch {
    return null
  }
}

const readConsent = (): CookieSettings | null => {
  if (typeof window === 'undefined') return null

  try {
    const ls = window.localStorage.getItem(LS_CONSENT_KEY)
    if (ls) {
      const parsed = safeJsonParse<CookieSettings>(ls)
      if (parsed && typeof parsed.analytics === 'boolean' && typeof parsed.marketing === 'boolean') return parsed
    }
  } catch {
    // ignore
  }

  try {
    const cookie = document.cookie
      .split('; ')
      .find(part => part.startsWith(`${COOKIE_CONSENT_KEY}=`))
      ?.split('=')[1]
    if (!cookie) return null
    const raw = decodeURIComponent(cookie)
    if (raw === 'refused') return { analytics: false, marketing: false }
    const parsed = safeJsonParse<CookieSettings>(raw)
    if (parsed && typeof parsed.analytics === 'boolean' && typeof parsed.marketing === 'boolean') return parsed
  } catch {
    // ignore
  }

  return null
}

const hasMarketingConsent = () => {
  const consent = readConsent()
  return !!consent?.marketing
}

const hasAnalyticsConsent = () => {
  const consent = readConsent()
  return !!consent?.analytics
}

const DEFAULT_GOOGLE_ADS_ID = 'AW-16864411727'

const ensureGtagReady = (idForScriptLoad: string) => {
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
}

const generateEventId = () => {
  try {
    if (typeof crypto !== 'undefined' && 'randomUUID' in crypto) return crypto.randomUUID()
  } catch {
    // ignore
  }
  return `dd_${Date.now()}_${Math.random().toString(16).slice(2)}`
}

export const initializeAnalytics = () => {
  if (typeof window === 'undefined') return;
  
  try {
    import('react-facebook-pixel').then((ReactPixel) => {
      ReactPixel.default.init(process.env.NEXT_PUBLIC_FB_PIXEL_ID || '');
    }).catch((error) => {
      console.error('Failed to initialize Facebook Pixel:', error);
    });
  } catch (error) {
    console.error('Failed to initialize analytics:', error);
  }
};

interface GoogleAnalytics {
  gtag: (command: string, action: string, params: object) => void;
}

const trackGoogleAdsPurchaseConversion = (params: { eventId: string; platform: string; slug?: string }) => {
  if (typeof window === 'undefined') return
  const sendTo = process.env.NEXT_PUBLIC_GOOGLE_ADS_PURCHASE_SEND_TO
  if (!sendTo) return

  const adsId =
    process.env.NEXT_PUBLIC_GOOGLE_ADS_ID ||
    process.env.NEXT_PUBLIC_GOOGLE_TAG ||
    DEFAULT_GOOGLE_ADS_ID
  ensureGtagReady(adsId)
  try {
    window.gtag?.('consent', 'update', {
      ad_storage: 'granted',
      ad_user_data: 'granted',
      ad_personalization: 'granted',
    })
  } catch {
    // ignore
  }
  try {
    window.gtag?.('config', adsId)
  } catch {
    // ignore
  }

  const rawValue = process.env.NEXT_PUBLIC_GOOGLE_ADS_PURCHASE_VALUE
  const value = rawValue ? Number.parseFloat(rawValue) : undefined
  const currency = process.env.NEXT_PUBLIC_GOOGLE_ADS_PURCHASE_CURRENCY || 'EUR'

  try {
    window.gtag?.('event', 'conversion', {
      send_to: sendTo,
      ...(Number.isFinite(value) ? { value } : {}),
      currency,
      transaction_id: params.eventId,
      ...(params.slug ? { item_id: params.slug } : {}),
      platform: params.platform,
    })
  } catch {
    // ignore
  }
}

export const trackStreamingClick = (platform: string, slug?: string) => {
  if (typeof window === 'undefined') return;

  try {
    const eventId = generateEventId()

    // Facebook Pixel
    if (hasMarketingConsent()) {
      import('react-facebook-pixel').then((ReactPixel) => {
        const pixelId = process.env.NEXT_PUBLIC_FB_PIXEL_ID
        if (pixelId && !('fbq' in window)) {
          ReactPixel.default.init(pixelId)
        }
        ReactPixel.default.fbq('track', 'Purchase', {
          content_name: platform,
          content_type: 'streaming_click',
          content_category: 'Music',
          ...(slug && { content_ids: [slug] }),
        }, { eventID: eventId })
      }).catch(() => null)

      trackGoogleAdsPurchaseConversion({ eventId, platform, slug })
    }

    // Google Analytics
    const w = window as unknown as Window & GoogleAnalytics;
    if (hasAnalyticsConsent() && w.gtag) {
      w.gtag('event', 'streaming_click', {
        event_category: 'Music',
        event_label: platform,
        value: 1,
        ...(slug && { release_slug: slug }),
      });
    }

    if (slug) {
      const body = JSON.stringify({ slug, platform, eventId, eventSourceUrl: window.location.href })
      if (typeof navigator !== 'undefined' && navigator.sendBeacon) {
        const blob = new Blob([body], { type: 'application/json' })
        navigator.sendBeacon('/api/streaming-click', blob)
      } else {
        // Fire-and-forget fallback
        fetch('/api/streaming-click', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body,
          keepalive: true,
        }).catch(() => null)
      }
    }
  } catch (error) {
    console.error('Tracking error:', error);
  }
};

export const trackReleaseView = (slug: string, title?: string) => {
  if (typeof window === 'undefined') return

  try {
    const eventId = generateEventId()

    if (hasMarketingConsent()) {
      import('react-facebook-pixel')
        .then((ReactPixel) => {
          const pixelId = process.env.NEXT_PUBLIC_FB_PIXEL_ID
          if (pixelId && !('fbq' in window)) {
            ReactPixel.default.init(pixelId)
          }
          ReactPixel.default.fbq('track', 'ViewContent', {
            ...(title && { content_name: title }),
            content_type: 'product',
            content_category: 'Music',
            content_ids: [slug],
          }, { eventID: eventId })
        })
        .catch(() => null)
    }

    const body = JSON.stringify({ slug, title, eventId, eventSourceUrl: window.location.href })
    if (typeof navigator !== 'undefined' && navigator.sendBeacon) {
      const blob = new Blob([body], { type: 'application/json' })
      navigator.sendBeacon('/api/release-view', blob)
    } else {
      fetch('/api/release-view', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body,
        keepalive: true,
      }).catch(() => null)
    }
  } catch (error) {
    console.error('Tracking error:', error)
  }
}

export const trackEvent = (eventName: string, params?: object) => {
  if (typeof window === 'undefined') return;
  
  try {
    // Facebook Pixel
    if (window.fbq) {
      window.fbq('track', eventName, params)
    }
    
    // Google Analytics
    if (hasAnalyticsConsent() && window.gtag) {
      window.gtag('event', eventName, params)
    }
  } catch (error) {
    console.error('Tracking error:', error);
  }
} 
