'use client'

import { useEffect } from 'react'

export default function GlobalErrorReporter() {
  useEffect(() => {
    const handler = (event: ErrorEvent) => {
      try {
        fetch('/api/_errors', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            message: event.error?.message || event.message,
            stack: event.error?.stack,
            path: window.location.pathname,
          }),
          keepalive: true,
        })
      } catch {}
    }
    const rejHandler = (event: PromiseRejectionEvent) => {
      try {
        const reason = event.reason || {}
        fetch('/api/_errors', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            message: reason?.message || 'unhandledrejection',
            stack: reason?.stack,
            path: window.location.pathname,
          }),
          keepalive: true,
        })
      } catch {}
    }
    window.addEventListener('error', handler)
    window.addEventListener('unhandledrejection', rejHandler)
    return () => {
      window.removeEventListener('error', handler)
      window.removeEventListener('unhandledrejection', rejHandler)
    }
  }, [])
  return null
}


