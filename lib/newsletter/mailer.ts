import nodemailer from 'nodemailer'
import { prisma } from '@/lib/prisma'
import { oneClickUnsubscribeUrl, unsubscribePageUrl } from './unsubscribe'

export type Recipient = { id?: string; email: string; name?: string | null }

let transporter: ReturnType<typeof nodemailer.createTransport> | null = null

function getTransporter() {
  if (!process.env.SMTP_HOST || !process.env.SMTP_USER || !process.env.SMTP_PASS) throw new Error('SMTP is not configured')
  transporter ??= nodemailer.createTransport({
    host: process.env.SMTP_HOST,
    port: parseInt(process.env.SMTP_PORT || '587'),
    secure: false,
    auth: { user: process.env.SMTP_USER, pass: process.env.SMTP_PASS },
  })
  return transporter
}

/** Fill the merge fields used by every newsletter template. A missing name never leaks as "{name}". */
export function personalize(text: string, r: Recipient) {
  const name = r.name?.trim()
  return text
    .replace(/\{name\}/g, name || 'there')
    .replace(/\{email\}/g, r.email)
    .replace(/\{unsubscribeUrl\}/g, unsubscribePageUrl(r.email))
}

/** HTML → readable plain-text part (spam filters penalise HTML-only mail). */
export function htmlToText(html: string) {
  return html
    .replace(/<(style|head)[\s\S]*?<\/\1>/gi, '')
    .replace(/<a [^>]*href="([^"]+)"[^>]*>([\s\S]*?)<\/a>/gi, (_, href, label) => `${label.replace(/<[^>]+>/g, '').trim()} (${href})`)
    .replace(/<\/(p|h\d|tr|div)>|<br\s*\/?>/gi, '\n')
    .replace(/<[^>]+>/g, '')
    .replace(/&nbsp;/g, ' ')
    .replace(/&amp;/g, '&')
    .replace(/&lt;/g, '<')
    .replace(/&gt;/g, '>')
    .replace(/&quot;/g, '"')
    .replace(/&#39;/g, "'")
    .replace(/[ \t]+/g, ' ')
    .replace(/\n\s*\n\s*\n+/g, '\n\n')
    .trim()
}

/** One personalised newsletter email with List-Unsubscribe headers. */
export async function sendNewsletterEmail(r: Recipient, subject: string, html: string) {
  const body = personalize(html, r)
  await getTransporter().sendMail({
    from: process.env.SMTP_FROM || process.env.SMTP_USER,
    to: r.email,
    subject: personalize(subject, r),
    html: body,
    text: htmlToText(body),
    headers: {
      'List-Unsubscribe': `<${oneClickUnsubscribeUrl(r.email)}>`,
      'List-Unsubscribe-Post': 'List-Unsubscribe=One-Click',
    },
  })
}

/**
 * Deliver a campaign to subscribers with limited concurrency, logging every attempt.
 * Callers that answer an HTTP request should not await this for large lists.
 */
export async function deliverCampaign(campaignId: string, recipients: { id: string; email: string; name?: string | null }[], subject: string, html: string, concurrency = 6) {
  let sent = 0
  let failed = 0
  let next = 0
  const worker = async () => {
    while (next < recipients.length) {
      const r = recipients[next++]
      try {
        await sendNewsletterEmail(r, subject, html)
        sent++
        await prisma.emailLog.create({ data: { campaignId, subscriberId: r.id, email: r.email, status: 'SENT', sentAt: new Date() } })
        await prisma.subscriber.update({ where: { id: r.id }, data: { emailCount: { increment: 1 }, lastEmailSent: new Date() } })
      } catch (error) {
        failed++
        await prisma.emailLog
          .create({ data: { campaignId, subscriberId: r.id, email: r.email, status: 'FAILED', error: error instanceof Error ? error.message : String(error) } })
          .catch(() => {})
      }
    }
  }
  await Promise.all(Array.from({ length: Math.min(concurrency, recipients.length) }, worker))
  await prisma.emailCampaign.update({ where: { id: campaignId }, data: { sentCount: sent } }).catch(() => {})
  return { sent, failed }
}
