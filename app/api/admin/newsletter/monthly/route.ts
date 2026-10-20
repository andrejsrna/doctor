import { after, NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { requireRole } from '@/app/lib/roles'
import { defaultIntro, defaultPreheader, defaultSubject, loadMonthly, renderMonthly } from '@/lib/newsletter/monthly'
import { deliverCampaign, personalize, sendNewsletterEmail } from '@/lib/newsletter/mailer'

export const dynamic = 'force-dynamic'
export const maxDuration = 300

const EMAIL = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
const campaignName = (month: string) => `Monthly releases – ${month}`

/** Preview: JSON with defaults + rendered HTML, or the raw HTML (?format=html) for an iframe. */
export async function GET(request: NextRequest) {
  const guard = await requireRole(request, ['ADMIN'])
  if (guard.response) return guard.response

  const sp = request.nextUrl.searchParams
  const data = await loadMonthly(sp.get('month') || undefined)
  const opts = { intro: sp.get('intro') || undefined, preheader: sp.get('preheader') || undefined }
  const html = renderMonthly(data, opts)

  if (sp.get('format') === 'html') {
    return new NextResponse(personalize(html, { email: 'preview@dnbdoctor.com', name: guard.user?.name || 'there' }), {
      headers: { 'content-type': 'text/html; charset=utf-8', 'cache-control': 'no-store' },
    })
  }

  const [audience, previous] = await Promise.all([
    prisma.subscriber.count({ where: { status: 'ACTIVE' } }),
    prisma.emailCampaign.findFirst({ where: { name: campaignName(data.month), sentAt: { not: null } }, select: { sentAt: true, sentCount: true } }),
  ])
  return NextResponse.json({
    month: data.month,
    label: data.label,
    releases: data.releases.map((r) => ({ slug: r.slug, artist: r.artist, title: r.title, type: r.type, date: r.date })),
    mixes: data.mixes.map((m) => ({ slug: m.slug, title: m.title, date: m.date })),
    defaults: { subject: defaultSubject(data), intro: defaultIntro(), preheader: defaultPreheader(data) },
    audience,
    alreadySent: previous,
  })
}

type SendBody = {
  month?: string
  subject?: string
  intro?: string
  preheader?: string
  mode: 'test' | 'all'
  testEmails?: string[]
  confirm?: string
  force?: boolean
}

/** mode "test": up to 5 addresses, nothing logged. mode "all": every ACTIVE subscriber, requires confirm === month. */
export async function POST(request: NextRequest) {
  const guard = await requireRole(request, ['ADMIN'])
  if (guard.response) return guard.response

  const body = (await request.json()) as SendBody
  const data = await loadMonthly(body.month)
  if (!data.releases.length) return NextResponse.json({ error: `No releases published in ${data.label}` }, { status: 400 })

  const html = renderMonthly(data, { intro: body.intro, preheader: body.preheader })
  const subject = body.subject?.trim() || defaultSubject(data)

  if (body.mode === 'test') {
    const emails = [...new Set((body.testEmails || []).map((e) => e.trim().toLowerCase()).filter((e) => EMAIL.test(e)))].slice(0, 5)
    if (!emails.length) return NextResponse.json({ error: 'Add at least one valid test address' }, { status: 400 })
    const results = await Promise.allSettled(emails.map((email) => sendNewsletterEmail({ email, name: guard.user?.name }, `[TEST] ${subject}`, html)))
    const failed = results.flatMap((r, i) => (r.status === 'rejected' ? [`${emails[i]}: ${String(r.reason).slice(0, 120)}`] : []))
    return NextResponse.json({ success: failed.length === 0, sent: emails.length - failed.length, failed })
  }

  if (body.mode !== 'all') return NextResponse.json({ error: 'Unknown mode' }, { status: 400 })
  if (body.confirm !== data.month) return NextResponse.json({ error: `Type ${data.month} to confirm the send` }, { status: 400 })

  const previous = await prisma.emailCampaign.findFirst({ where: { name: campaignName(data.month), sentAt: { not: null } } })
  if (previous && !body.force) return NextResponse.json({ error: `${data.label} was already sent on ${previous.sentAt!.toISOString().slice(0, 10)}` }, { status: 409 })

  const recipients = await prisma.subscriber.findMany({ where: { status: 'ACTIVE' }, select: { id: true, email: true, name: true } })
  if (!recipients.length) return NextResponse.json({ error: 'No active subscribers' }, { status: 400 })

  const campaign = await prisma.emailCampaign.create({ data: { name: campaignName(data.month), subject, body: html, sentAt: new Date() } })
  // Respond right away; delivery continues after the response (progress is in EmailLog / campaign.sentCount).
  after(() => deliverCampaign(campaign.id, recipients, subject, html).catch((e) => console.error('monthly newsletter delivery failed', e)))

  return NextResponse.json({ success: true, campaignId: campaign.id, queued: recipients.length })
}
