import { prisma } from '@/lib/prisma'
import { deliverCampaign } from './mailer'
import { defaultSubject, loadMonthly, renderMonthly, type MonthlyOptions } from './monthly'

export const monthlyCampaignName = (month: string) => `Monthly releases – ${month}`

export type QueueResult =
  | { ok: true; campaignId: string; month: string; queued: number; deliver: () => Promise<{ sent: number; failed: number }> }
  | { ok: false; month: string; status: number; error: string }

/**
 * Create the campaign row for a month and return a `deliver` thunk (run it with `after()`).
 * Shared by the admin "send to all" button and the monthly cron. Refuses empty months and repeats.
 */
export async function queueMonthlyNewsletter(month?: string, opts: MonthlyOptions & { subject?: string; force?: boolean } = {}): Promise<QueueResult> {
  const data = await loadMonthly(month)
  if (!data.releases.length) return { ok: false, month: data.month, status: 400, error: `No releases published in ${data.label}` }

  const previous = await prisma.emailCampaign.findFirst({ where: { name: monthlyCampaignName(data.month), sentAt: { not: null } } })
  if (previous && !opts.force) return { ok: false, month: data.month, status: 409, error: `${data.label} was already sent on ${previous.sentAt!.toISOString().slice(0, 10)}` }

  const recipients = await prisma.subscriber.findMany({ where: { status: 'ACTIVE' }, select: { id: true, email: true, name: true } })
  if (!recipients.length) return { ok: false, month: data.month, status: 400, error: 'No active subscribers' }

  const subject = opts.subject?.trim() || defaultSubject(data)
  const html = renderMonthly(data, opts)
  const campaign = await prisma.emailCampaign.create({ data: { name: monthlyCampaignName(data.month), subject, body: html, sentAt: new Date() } })
  return { ok: true, campaignId: campaign.id, month: data.month, queued: recipients.length, deliver: () => deliverCampaign(campaign.id, recipients, subject, html) }
}
