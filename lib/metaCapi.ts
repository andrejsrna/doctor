import type { NextRequest } from 'next/server'

type MetaCapiEventName = 'ViewContent' | 'Purchase'

type MetaCapiSendParams = {
  request: NextRequest
  eventName: MetaCapiEventName
  eventId?: string
  eventSourceUrl?: string
  customData?: Record<string, unknown>
}

const getEnv = () => {
  const pixelId = process.env.NEXT_PUBLIC_FB_PIXEL_ID || process.env.FB_PIXEL_ID
  const token = process.env.FB_CAPI_TOKEN
  return { pixelId, token }
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

const getClientIp = (request: NextRequest) => {
  const xff = request.headers.get('x-forwarded-for')
  if (xff) return xff.split(',')[0]?.trim() || undefined
  const xrip = request.headers.get('x-real-ip')
  if (xrip) return xrip.trim() || undefined
  return undefined
}

export const sendMetaCapiEvent = async (params: MetaCapiSendParams) => {
  const { pixelId, token } = getEnv()
  if (!pixelId || !token) return { ok: false as const, reason: 'missing_env' as const }
  if (!readCookieConsentMarketing(params.request)) return { ok: false as const, reason: 'no_consent' as const }

  const eventTime = Math.floor(Date.now() / 1000)
  const userAgent = params.request.headers.get('user-agent') || undefined
  const clientIpAddress = getClientIp(params.request)
  const fbp = params.request.cookies.get('_fbp')?.value
  const fbc = params.request.cookies.get('_fbc')?.value

  const payload = {
    data: [
      {
        event_name: params.eventName,
        event_time: eventTime,
        action_source: 'website',
        ...(params.eventSourceUrl ? { event_source_url: params.eventSourceUrl } : {}),
        ...(params.eventId ? { event_id: params.eventId } : {}),
        user_data: {
          ...(clientIpAddress ? { client_ip_address: clientIpAddress } : {}),
          ...(userAgent ? { client_user_agent: userAgent } : {}),
          ...(fbp ? { fbp } : {}),
          ...(fbc ? { fbc } : {}),
        },
        ...(params.customData ? { custom_data: params.customData } : {}),
      },
    ],
  }

  try {
    const res = await fetch(`https://graph.facebook.com/v21.0/${pixelId}/events?access_token=${encodeURIComponent(token)}`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload),
      cache: 'no-store',
    })

    if (!res.ok) {
      return { ok: false as const, reason: 'meta_error' as const, status: res.status }
    }
    return { ok: true as const }
  } catch {
    return { ok: false as const, reason: 'network_error' as const }
  }
}

