import { NextResponse } from 'next/server'
import nodemailer from 'nodemailer'
import { REASONS } from '@/app/contact/reasons'

const EMAIL_RE = /^[^\s@<>"]+@[^\s@<>"]+\.[^\s@<>"]{2,}$/

const esc = (s: string) => s.replace(/[&<>"']/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' })[c]!)
/** Single line, trimmed, capped — no CR/LF can reach mail headers. */
const line = (v: unknown, max: number) => (typeof v === 'string' ? v.replace(/[\r\n\t]+/g, ' ').trim().slice(0, max) : '')

export async function POST(request: Request) {
  let body: Record<string, unknown>
  try {
    body = await request.json()
  } catch {
    return NextResponse.json({ message: 'Invalid request' }, { status: 400 })
  }

  // Honeypot: pretend success so bots don't retry
  if (typeof body.website === 'string' && body.website.trim()) return NextResponse.json({ message: 'Message sent successfully' })

  const name = line(body.name, 120)
  const email = line(body.email, 200)
  const subject = line(body.subject, 200)
  const message = typeof body.message === 'string' ? body.message.replace(/\r\n?/g, '\n').trim().slice(0, 5000) : ''
  // Older clients send no reason → "Other"
  const reason = REASONS.find((r) => r === body.reason) ?? 'Other'
  const token = typeof body.token === 'string' ? body.token : ''

  if (!name || !subject) return NextResponse.json({ message: 'Please fill in your name and subject' }, { status: 400 })
  if (!EMAIL_RE.test(email)) return NextResponse.json({ message: 'Please enter a valid email address' }, { status: 400 })
  if (message.length < 10) return NextResponse.json({ message: 'Your message is too short' }, { status: 400 })
  if (!token) return NextResponse.json({ message: 'Please complete the security check' }, { status: 400 })

  const secret = process.env.CF_TURNSTILE_SECRET_KEY
  if (!secret || !process.env.ADMIN_EMAIL) {
    console.error('Contact form misconfigured: CF_TURNSTILE_SECRET_KEY or ADMIN_EMAIL missing')
    return NextResponse.json({ message: 'Failed to send message' }, { status: 500 })
  }

  try {
    const verification = await fetch('https://challenges.cloudflare.com/turnstile/v0/siteverify', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ secret, response: token }),
    }).then((r) => r.json())
    if (!verification.success) return NextResponse.json({ message: 'Invalid security check' }, { status: 400 })

    const transporter = nodemailer.createTransport({
      host: process.env.SMTP_HOST,
      port: Number(process.env.SMTP_PORT),
      secure: false,
      auth: { user: process.env.SMTP_USER, pass: process.env.SMTP_PASS },
    })

    await transporter.sendMail({
      from: { name: 'DnB Doctor Contact Form', address: process.env.SMTP_FROM || '' },
      to: process.env.ADMIN_EMAIL,
      replyTo: { name, address: email },
      subject: `Contact [${reason}]: ${subject}`,
      text: `Reason: ${reason}\nName: ${name}\nEmail: ${email}\nSubject: ${subject}\n\nMessage:\n${message}\n`,
      html: `
        <h2>New contact form submission</h2>
        <p><strong>Reason:</strong> ${esc(reason)}</p>
        <p><strong>Name:</strong> ${esc(name)}</p>
        <p><strong>Email:</strong> ${esc(email)}</p>
        <p><strong>Subject:</strong> ${esc(subject)}</p>
        <p><strong>Message:</strong></p>
        <p style="white-space:pre-wrap">${esc(message)}</p>
      `,
    })

    return NextResponse.json({ message: 'Message sent successfully' })
  } catch (error) {
    console.error('Contact form error:', error)
    return NextResponse.json({ message: 'Failed to send message' }, { status: 500 })
  }
}
