"use client"

import React, { useEffect } from "react"
import posthog from "posthog-js"
import { PostHogProvider as PHProvider } from "posthog-js/react"

export function PostHogProvider({ children }: { children: React.ReactNode }) {
  useEffect(() => {
    const consent = (() => {
      try {
        const raw = window.localStorage.getItem('dd-cookie-consent') || ''
        return raw ? JSON.parse(raw) : null
      } catch {
        return null
      }
    })()

    const shouldEnableAnalytics = !!consent?.analytics

    if (shouldEnableAnalytics && process.env.NEXT_PUBLIC_POSTHOG_KEY) {
      posthog.init(process.env.NEXT_PUBLIC_POSTHOG_KEY, {
        api_host: "/ingest",
        ui_host: "https://eu.posthog.com",
        defaults: '2025-05-24',
        capture_exceptions: true,
        debug: process.env.NODE_ENV === "development",
      })
    }

    const handler = (e: CustomEvent) => {
      if (e.detail?.analytics && !posthog.__loaded) {
        posthog.init(process.env.NEXT_PUBLIC_POSTHOG_KEY!, {
          api_host: "/ingest",
          ui_host: "https://eu.posthog.com",
          capture_exceptions: true,
          debug: process.env.NODE_ENV === "development",
        })
      }
    }
    window.addEventListener('dd-consent-changed', handler as EventListener)
    return () => window.removeEventListener('dd-consent-changed', handler as EventListener)
  }, [])

  return <PHProvider client={posthog}>{children}</PHProvider>
}