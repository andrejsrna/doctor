'use client'

import { useEffect } from 'react'
import { readConsent } from '@/app/utils/analytics'

const AD_CLICK_ID_KEYS = ['gclid', 'wbraid', 'gbraid'] as const
type AdClickIdKey = typeof AD_CLICK_ID_KEYS[number]
type AdClickIds = Partial<Record<AdClickIdKey, string>>

const readAdClickIdsFromUrl = () => {
  const ids: AdClickIds = {}
  try {
    const params = new URLSearchParams(window.location.search)
    AD_CLICK_ID_KEYS.forEach((key) => {
      const value = params.get(key)
      if (value) ids[key] = value
    })
  } catch {
    // ignore
  }
  return ids
}

const storeAdClickIds = (ids: AdClickIds) => {
  const maxAgeDays = 90
  const maxAgeSeconds = maxAgeDays * 24 * 60 * 60
  AD_CLICK_ID_KEYS.forEach((key) => {
    const value = ids[key]
    if (!value) return
    try {
      document.cookie = `dd_${key}=${encodeURIComponent(value)}; Path=/; Max-Age=${maxAgeSeconds}; SameSite=Lax; Secure`
    } catch {
      // ignore
    }
    try {
      window.localStorage.setItem(`dd_${key}`, value)
    } catch {
      // ignore
    }
  })
}

const clearAdClickIds = () => {
  AD_CLICK_ID_KEYS.forEach((key) => {
    try {
      document.cookie = `dd_${key}=; Path=/; Max-Age=0; SameSite=Lax; Secure`
    } catch {
      // ignore
    }
    try {
      window.localStorage.removeItem(`dd_${key}`)
    } catch {
      // ignore
    }
  })
}

const PENDING_KEY = 'dd_pending_ad_click_ids'

const storePendingAdClickIds = (ids: AdClickIds) => {
  if (!ids || Object.keys(ids).length === 0) return
  try {
    const existingRaw = window.sessionStorage.getItem(PENDING_KEY)
    const existing = existingRaw ? (JSON.parse(existingRaw) as AdClickIds) : {}
    const merged = { ...existing, ...ids }
    window.sessionStorage.setItem(PENDING_KEY, JSON.stringify(merged))
  } catch {
    // ignore
  }
}

const readPendingAdClickIds = (): AdClickIds => {
  try {
    const raw = window.sessionStorage.getItem(PENDING_KEY)
    if (!raw) return {}
    const parsed = JSON.parse(raw) as AdClickIds
    return parsed && typeof parsed === 'object' ? parsed : {}
  } catch {
    return {}
  }
}

const clearPendingAdClickIds = () => {
  try {
    window.sessionStorage.removeItem(PENDING_KEY)
  } catch {
    // ignore
  }
}

export default function AdsAttribution() {
  // Always capture gclid/wbraid/gbraid from the landing URL into sessionStorage.
  // If the user accepts marketing later (possibly after navigating), we can still persist them.
  useEffect(() => {
    const ids = readAdClickIdsFromUrl()
    if (Object.keys(ids).length > 0) storePendingAdClickIds(ids)
  }, [])

  useEffect(() => {
    const consent = readConsent()
    if (!consent?.marketing) return

    const ids = { ...readPendingAdClickIds(), ...readAdClickIdsFromUrl() }
    if (Object.keys(ids).length > 0) {
      storeAdClickIds(ids)
      clearPendingAdClickIds()
    }
  }, [])

  useEffect(() => {
    const handler = (event: Event) => {
      const detail = (event as CustomEvent).detail as { marketing?: boolean } | undefined
      if (detail?.marketing) {
        const ids = { ...readPendingAdClickIds(), ...readAdClickIdsFromUrl() }
        if (Object.keys(ids).length > 0) {
          storeAdClickIds(ids)
          clearPendingAdClickIds()
        }
      } else if (detail && detail.marketing === false) {
        clearAdClickIds()
        clearPendingAdClickIds()
      }
    }
    window.addEventListener('dd-consent-changed', handler)
    return () => window.removeEventListener('dd-consent-changed', handler)
  }, [])

  return null
}
