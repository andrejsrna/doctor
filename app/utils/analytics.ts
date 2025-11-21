'use client'

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

export const trackStreamingClick = (platform: string, slug?: string) => {
  if (typeof window === 'undefined') return;

  try {
    // Facebook Pixel
    import('react-facebook-pixel').then((ReactPixel) => {
      ReactPixel.default.track('Purchase', {
        content_name: platform,
        content_type: 'streaming_click',
        content_category: 'Music',
        ...(slug && { content_ids: [slug] }),
      });
    }).catch((error) => {
      console.error('Failed to track with Facebook Pixel:', error);
    });

    // Google Analytics
    const w = window as unknown as Window & GoogleAnalytics;
    if (w.gtag) {
      w.gtag('event', 'streaming_click', {
        event_category: 'Music',
        event_label: platform,
        value: 1,
        ...(slug && { release_slug: slug }),
      });
    }

    if (slug) {
      const body = JSON.stringify({ slug, platform })
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

export const trackEvent = (eventName: string, params?: object) => {
  if (typeof window === 'undefined') return;
  
  try {
    // Facebook Pixel
    if (window.fbq) {
      window.fbq('track', eventName, params)
    }
    
    // Google Analytics
    if (window.gtag) {
      window.gtag('event', eventName, params)
    }
  } catch (error) {
    console.error('Tracking error:', error);
  }
} 
