export const trackEvent = (eventName: string, params?: object) => {
  if (typeof window !== 'undefined') {
    // Facebook Pixel
    if (window.fbq) {
      window.fbq('track', eventName, params)
    }
    
    // Google Analytics
    if (window.gtag) {
      window.gtag('event', eventName, params)
    }
  }
} 