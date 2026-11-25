import type { NextRequest, NextResponse } from 'next/server'

/**
 * Where a visitor came from (last campaign touch, 30 days), stored in a first-party cookie by proxy.ts
 * and copied onto orders / subscribers. Click IDs (gclid, fbclid) are kept only as a yes/no flag.
 */
export const ATTR_COOKIE = 'dd_attr'
const MAX_AGE = 30 * 86400

export type Attribution = {
  source?: string
  medium?: string
  campaign?: string
  content?: string
  term?: string
  gclid?: boolean
  fbclid?: boolean
  referrer?: string
  landing?: string
  at: string
}

const clean = (v: unknown, max = 100) => (typeof v === 'string' && v.trim() ? v.trim().slice(0, max) : undefined)
const OWN_HOST = /(^|\.)dnbdoctor\.com$/i
// Payment / auth round-trips are not traffic sources.
const IGNORED_REFERRER = /(^|\.)(stripe\.com|checkout\.stripe\.com|accounts\.google\.com|dnbdoctor\.com)$/i

/** Parse + sanitise the cookie value (or a stored JSON value). Anything malformed → null. */
export function parseAttribution(raw: unknown): Attribution | null {
  let v: unknown = raw
  if (typeof raw === 'string') {
    try {
      v = JSON.parse(raw)
    } catch {
      return null
    }
  }
  if (!v || typeof v !== 'object') return null
  const o = v as Record<string, unknown>
  const a: Attribution = {
    source: clean(o.source),
    medium: clean(o.medium),
    campaign: clean(o.campaign),
    content: clean(o.content),
    term: clean(o.term),
    gclid: o.gclid === true || undefined,
    fbclid: o.fbclid === true || undefined,
    referrer: clean(o.referrer),
    landing: clean(o.landing, 200),
    at: clean(o.at, 40) || new Date(0).toISOString(),
  }
  return a.source || a.gclid || a.fbclid || a.referrer ? a : null
}

/** Attribution from the request's cookie (API routes). */
export const attributionFrom = (req: NextRequest) => parseAttribution(req.cookies.get(ATTR_COOKIE)?.value)

/**
 * Called by proxy.ts on page requests. Campaign links (utm_* / gclid / fbclid) always overwrite (last touch);
 * a plain external referrer is recorded only when nothing is stored yet; direct visits never overwrite.
 */
export function applyAttribution(req: NextRequest, res: NextResponse) {
  try {
    const q = req.nextUrl.searchParams
    const utm = (k: string) => clean(q.get(`utm_${k}`))?.toLowerCase()
    const gclid = q.has('gclid') || q.has('gbraid') || q.has('wbraid')
    const fbclid = q.has('fbclid')
    let refHost: string | undefined
    try {
      const r = req.headers.get('referer')
      refHost = r ? new URL(r).hostname.replace(/^www\./, '').toLowerCase() : undefined
    } catch {}
    if (refHost && (OWN_HOST.test(refHost) || IGNORED_REFERRER.test(refHost))) refHost = undefined

    const campaign = utm('source') || gclid || fbclid
    if (!campaign && !(refHost && !req.cookies.has(ATTR_COOKIE))) return res
    const a: Attribution = {
      source: utm('source'),
      medium: utm('medium'),
      campaign: utm('campaign'),
      content: utm('content'),
      term: utm('term'),
      gclid: gclid || undefined,
      fbclid: fbclid || undefined,
      referrer: refHost,
      landing: req.nextUrl.pathname.slice(0, 200),
      at: new Date().toISOString(),
    }
    res.cookies.set(ATTR_COOKIE, JSON.stringify(a), { maxAge: MAX_AGE, path: '/', sameSite: 'lax', secure: process.env.NODE_ENV === 'production', httpOnly: true })
  } catch {}
  return res
}

export const CHANNELS = ['Meta ads', 'Google Ads', 'Newsletter', 'Organic search', 'Social', 'Referral', 'Direct'] as const
export type Channel = (typeof CHANNELS)[number]

const SOCIAL_SRC = /^(facebook|instagram|fb|ig|meta|youtube|yt|soundcloud|tiktok|twitter|x|reddit|discord|linktree|spotify|bio)$/i
const SOCIAL_HOST = /(^|\.)(facebook\.com|fb\.com|fb\.me|instagram\.com|youtube\.com|youtu\.be|soundcloud\.com|tiktok\.com|twitter\.com|x\.com|t\.co|reddit\.com|discord\.com|linktr\.ee|spotify\.com)$/i
const SEARCH = /(^|\.)(google|bing|duckduckgo|yahoo|seznam|ecosia|yandex|baidu|startpage|brave)\./i
const PAID = /^(cpc|ppc|paid|paid_social|paidsocial|display|cpm)$/i

/** Bucket an attribution into one marketing channel. */
export function channelOf(a: Attribution | null | undefined): Channel {
  if (!a) return 'Direct'
  const src = a.source || ''
  const med = a.medium || ''
  if (/^(meta|facebook|fb|instagram|ig)$/i.test(src) && (PAID.test(med) || !med)) return 'Meta ads'
  if (a.gclid || (/^google/i.test(src) && PAID.test(med))) return 'Google Ads'
  if (src === 'newsletter' || med === 'email') return 'Newsletter'
  if (a.fbclid && !src) return 'Social'
  if (src) return SOCIAL_SRC.test(src) ? 'Social' : 'Referral'
  const ref = a.referrer || ''
  if (SEARCH.test(`${ref}.`)) return 'Organic search'
  if (SOCIAL_HOST.test(ref)) return 'Social'
  return ref ? 'Referral' : 'Direct'
}

/** Short human label: "meta / paid_social · sample_packs_2026_11 · vol3-video". */
export function attributionLabel(a: Attribution | null | undefined) {
  if (!a) return ''
  const sm = a.source ? [a.source, a.medium].filter(Boolean).join(' / ') : a.gclid ? 'google (gclid)' : a.fbclid ? 'facebook (fbclid)' : a.referrer || ''
  return [sm, a.campaign, a.content].filter(Boolean).join(' · ')
}

/** Subscriber.source gets the channel appended, e.g. "free-download:slug · Meta ads". */
export const sourceWithChannel = (source: string, a: Attribution | null) => (a ? `${source} · ${channelOf(a)}` : source)
