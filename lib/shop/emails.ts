import { sendEmail } from '@/app/services/email'
import { htmlToText } from '@/lib/newsletter/mailer'

export const SITE = (process.env.NEXT_PUBLIC_SITE_URL || 'https://dnbdoctor.com').replace(/\/$/, '')

const esc = (s: string) => s.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;')

export const money = (cents: number, currency = 'eur') =>
  new Intl.NumberFormat('en-IE', { style: 'currency', currency: currency.toUpperCase() }).format(cents / 100)

// Table-based, inline-styled shell in the site's look (black, square edges, green CTA); mail clients ignore <style>.
function shell(heading: string, body: string) {
  return `<!doctype html><html><body style="margin:0;background:#030305;color:#e8e8ec;font-family:Arial,Helvetica,sans-serif">
<table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="background:#030305"><tr><td align="center" style="padding:32px 16px">
<table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="max-width:560px;border:1px solid #26262e;background:#0b0b0f">
<tr><td style="padding:28px 28px 8px"><img src="${SITE}/email/dnb-doctor-logo.png" width="72" height="68" alt="DnB Doctor" style="display:block"></td></tr>
<tr><td style="padding:8px 28px 0"><h1 style="margin:0;font-size:26px;line-height:1.15;text-transform:uppercase;letter-spacing:.02em;color:#fff">${heading}</h1></td></tr>
<tr><td style="padding:16px 28px 28px;font-size:15px;line-height:1.6">${body}</td></tr>
<tr><td style="padding:16px 28px;border-top:1px solid #26262e;font-size:12px;line-height:1.5;color:#8b8b96">DnB Doctor · seller: Andrej Srna, Sokolská 11, 811 04 Bratislava, Slovakia · dnbdoctor1@gmail.com</td></tr>
</table></td></tr></table></body></html>`
}

const button = (href: string, label: string) =>
  `<a href="${esc(href)}" style="display:inline-block;background:#39ff14;color:#050505;font-weight:700;text-decoration:none;padding:13px 20px;font-family:'Courier New',monospace;font-size:13px;letter-spacing:.08em;text-transform:uppercase">${esc(label)}</a>`

export type ReceiptLine = { title: string; priceCents: number; downloadUrl: string }

export async function sendOrderEmail(to: string, order: { id: string; currency: string; amountTotal: number }, lines: ReceiptLine[]) {
  const items = lines
    .map((l) => `<tr><td style="padding:14px 0;border-bottom:1px solid #26262e"><strong style="color:#fff">${esc(l.title)}</strong><br><span style="color:#8b8b96">${money(l.priceCents, order.currency)}</span><div style="padding-top:12px">${button(l.downloadUrl, 'Download')}</div></td></tr>`)
    .join('')
  const html = shell(
    'Your download is ready',
    `<p style="margin:0 0 12px">Thanks for supporting DnB Doctor. Your payment of <strong style="color:#fff">${money(order.amountTotal, order.currency)}</strong> was received.</p>
<table role="presentation" width="100%" cellpadding="0" cellspacing="0">${items}</table>
<p style="margin:16px 0 0">These links work for 30 days. You can download your purchases at any time from <a href="${SITE}/account" style="color:#39ff14">My account</a> — sign in with this email address.</p>
<p style="margin:12px 0 0">Your invoice will follow in a separate email.</p>
<p style="margin:12px 0 0;color:#8b8b96;font-size:13px">Order ${esc(order.id)}. You agreed to immediate delivery of digital content and acknowledged that the right of withdrawal ends once delivery begins.</p>`,
  )
  await sendEmail({ to, subject: 'Your DnB Doctor download', html, text: htmlToText(html) })
}

export function invoiceEmailHtml(number: string) {
  return shell(
    `Invoice ${esc(number)}`,
    `<p style="margin:0 0 12px">Your invoice for your DnB Doctor purchase is attached as a PDF. It is already paid, no action is needed.</p>
<p style="margin:0">You can also download it any time from <a href="${SITE}/account" style="color:#39ff14">My account</a>.</p>`,
  )
}

export async function sendMagicLinkEmail(to: string, url: string) {
  const html = shell(
    'Sign in to My account',
    `<p style="margin:0 0 18px">Use the button below to sign in and see your purchases. The link works for 15 minutes and only once.</p>${button(url, 'Sign in')}
<p style="margin:18px 0 0;color:#8b8b96;font-size:13px">If you didn't request this, you can ignore this email.</p>`,
  )
  await sendEmail({ to, subject: 'Your DnB Doctor sign-in link', html, text: htmlToText(html) })
}
