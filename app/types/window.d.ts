export {}

declare global {
  interface Window {
    fbq: (...args: unknown[]) => void;
    _fbq: (...args: unknown[]) => void;
    gtag?: (...args: unknown[]) => void;
    dataLayer?: unknown[];
    'ga-disable-UA-XXXXX-Y'?: boolean;
    __ddGtagInitialized?: boolean;
    [key: string]: unknown;
    [`ga-disable-${string}`]: boolean;
  }
} 
