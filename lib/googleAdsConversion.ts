import type { NextRequest } from 'next/server'

type GoogleAdsConversionParams = {
  request: NextRequest
  eventId?: string
  value?: number
  currency?: string
  gclid?: string
  wbraid?: string
  gbraid?: string
}

const readCookieConsentMarketing = (request: NextRequest) => {
  const rawCookie = request.cookies.get('cookie-consent')?.value
  if (!rawCookie) return false
  const raw = (() => {
    try {
      return decodeURIComponent(rawCookie)
    } catch {
      return rawCookie
    }
  })()
  if (raw === 'refused') return false
  try {
    const parsed = JSON.parse(raw) as { marketing?: boolean }
    return !!parsed?.marketing
  } catch {
    return false
  }
}

const getSendTo = () =>
  process.env.GOOGLE_ADS_PURCHASE_SEND_TO || process.env.NEXT_PUBLIC_GOOGLE_ADS_PURCHASE_SEND_TO || ''

const parseSendTo = (sendTo: string) => {
  const trimmed = sendTo.trim()
  const match = /^AW-(\d+)\/(.+)$/.exec(trimmed)
  if (!match) return null
  return { conversionId: match[1], label: match[2] }
}

export const sendGoogleAdsConversion = async (params: GoogleAdsConversionParams) => {
  if (!readCookieConsentMarketing(params.request)) return { ok: false as const, reason: 'no_consent' as const }

  const sendTo = getSendTo()
  const parsed = parseSendTo(sendTo)
  if (!parsed) return { ok: false as const, reason: 'missing_send_to' as const }

  const valueEnv =
    process.env.GOOGLE_ADS_PURCHASE_VALUE || process.env.NEXT_PUBLIC_GOOGLE_ADS_PURCHASE_VALUE || ''
  const currencyEnv =
    process.env.GOOGLE_ADS_PURCHASE_CURRENCY || process.env.NEXT_PUBLIC_GOOGLE_ADS_PURCHASE_CURRENCY || ''

  const value = Number.isFinite(params.value) ? params.value : Number.parseFloat(valueEnv)
  const currency = params.currency || currencyEnv || 'EUR'

  const url = new URL(`https://www.googleadservices.com/pagead/conversion/${parsed.conversionId}/`)
  url.searchParams.set('label', parsed.label)
  url.searchParams.set('guid', 'ON')
  url.searchParams.set('script', '0')
  if (Number.isFinite(value)) url.searchParams.set('value', String(value))
  if (currency) url.searchParams.set('currency_code', currency)
  if (params.eventId) url.searchParams.set('transaction_id', params.eventId)
  if (params.gclid) url.searchParams.set('gclid', params.gclid)
  if (params.wbraid) url.searchParams.set('wbraid', params.wbraid)
  if (params.gbraid) url.searchParams.set('gbraid', params.gbraid)

  try {
    const res = await fetch(url.toString(), { method: 'GET', cache: 'no-store' })
    if (!res.ok) {
      return { ok: false as const, reason: 'ads_error' as const, status: res.status }
    }
    return { ok: true as const }
  } catch {
    return { ok: false as const, reason: 'network_error' as const }
  }
}
