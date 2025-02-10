import ReactPixel from 'react-facebook-pixel';

interface GoogleAnalytics {
  gtag: (command: string, action: string, params: object) => void;
}

export const initializeAnalytics = () => {
  if (typeof window === 'undefined') return;
  
  try {
    ReactPixel.init(process.env.NEXT_PUBLIC_FB_PIXEL_ID || '');
  } catch (error) {
    console.error('Failed to initialize analytics:', error);
  }
};

export const trackStreamingClick = (platform: string) => {
  if (typeof window === 'undefined') return;

  try {
    // Facebook Pixel
    ReactPixel.track('Purchase', {
      content_name: platform,
      content_type: 'streaming_click',
      content_category: 'Music'
    });

    // Google Analytics
    const w = window as unknown as Window & GoogleAnalytics;
    if (w.gtag) {
      w.gtag('event', 'streaming_click', {
        event_category: 'Music',
        event_label: platform,
        value: 1
      });
    }
  } catch (error) {
    console.error('Tracking error:', error);
  }
};

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