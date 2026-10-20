import crypto from 'crypto'
import { after, NextRequest, NextResponse } from 'next/server'
import { queueMonthlyNewsletter } from '@/lib/newsletter/sendMonthly'

export const dynamic = 'force-dynamic'
export const maxDuration = 300

function authorized(request: NextRequest) {
  const expected = process.env.CRON_SECRET
  const given = request.headers.get('x-cron-token') || ''
  if (!expected || given.length !== expected.length) return false
  return crypto.timingSafeEqual(Buffer.from(given), Buffer.from(expected))
}

/**
 * Monthly releases newsletter, called by the Coolify scheduled task on the 1st of each month.
 * Sends the PREVIOUS calendar month to every ACTIVE subscriber with the default subject/intro.
 * Safe to re-run: an already-sent month or a month without releases is skipped.
 */
export async function POST(request: NextRequest) {
  if (!authorized(request)) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  const result = await queueMonthlyNewsletter(request.nextUrl.searchParams.get('month') || undefined)
  if (!result.ok) {
    console.log(`[cron] monthly newsletter ${result.month} skipped: ${result.error}`)
    return NextResponse.json({ skipped: true, month: result.month, reason: result.error })
  }

  after(async () => {
    const { sent, failed } = await result.deliver()
    console.log(`[cron] monthly newsletter ${result.month}: ${sent} sent, ${failed} failed`)
  })
  console.log(`[cron] monthly newsletter ${result.month}: queued ${result.queued}`)
  return NextResponse.json({ success: true, month: result.month, campaignId: result.campaignId, queued: result.queued })
}
