import { NextResponse } from 'next/server'
import nodemailer from 'nodemailer'
import { prisma } from '@/lib/prisma'

const GENRES = ['Neurofunk', 'Techstep', 'Dark DnB', 'Crossbreed', 'Other']

const esc = (v: string) =>
  v.replace(/[&<>"']/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' })[c] as string)

/** Trimmed, length-capped fields, or an error message. */
function validate(b: Partial<RequestBody>) {
  const artistName = String(b.artistName ?? '').trim().slice(0, 120)
  const email = String(b.email ?? '').trim().toLowerCase().slice(0, 200)
  const genre = String(b.genre ?? '').trim()
  const subject = String(b.subject ?? '').trim().slice(0, 500)
  if (!artistName) return { error: 'Please enter your name' }
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) return { error: 'Please enter a valid email address' }
  if (!GENRES.includes(genre)) return { error: 'Please select a genre' }
  if (!/^https?:\/\/\S+$/i.test(subject)) return { error: 'Please enter a valid track link (https://…)' }
  return { data: { artistName, email, genre, subject } }
}

interface RequestBody {
  email: string
  subject: string
  artistName: string
  genre: string
  token: string
}

export async function POST(request: Request) {
  try {
    const body: RequestBody = await request.json()
    const { token } = body
    const checked = validate(body)
    if (!checked.data) {
      return NextResponse.json({ message: checked.error }, { status: 400 })
    }
    const formData = checked.data

    // Verify Turnstile token
    const verificationResponse = await fetch(
      'https://challenges.cloudflare.com/turnstile/v0/siteverify',
      {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          secret: process.env.CF_TURNSTILE_SECRET_KEY,
          response: token,
        }),
      }
    )

    const verificationData = await verificationResponse.json()

    if (!verificationData.success) {
      return NextResponse.json(
        { message: 'Invalid security check' },
        { status: 400 }
      )
    }

    // Save to database
    await prisma.demoSubmission.create({
      data: { 
        email: formData.email,
        artistName: formData.artistName,
        genre: formData.genre,
        trackLink: formData.subject,
      },
    })

    // Configure SMTP transporter
    const transporter = nodemailer.createTransport({
      host: process.env.SMTP_HOST,
      port: Number(process.env.SMTP_PORT),
      secure: false,
      auth: {
        user: process.env.SMTP_USER,
        pass: process.env.SMTP_PASS,
      },
    })

    // Send email to both admin emails
    const adminEmails = ['fatush23@gmail.com', 'releases@dnbdoctor.com'];
    
    await transporter.sendMail({
      from: `"DnB Doctor Demo Submission" <${process.env.SMTP_FROM}>`,
      to: adminEmails.join(', '),
      replyTo: { name: formData.artistName, address: formData.email },
      subject: 'New Demo Submission',
      text: `
New demo submission received:

Artist Name: ${formData.artistName}
Email: ${formData.email}
Genre: ${formData.genre}
Track Link: ${formData.subject}

Please review at your earliest convenience.
      `,
      html: `
        <h2>New Demo Submission</h2>
        <p><strong>Artist Name:</strong> ${esc(formData.artistName)}</p>
        <p><strong>Email:</strong> ${esc(formData.email)}</p>
        <p><strong>Genre:</strong> ${esc(formData.genre)}</p>
        <p><strong>Track Link:</strong> <a href="${esc(formData.subject)}">${esc(formData.subject)}</a></p>
        <p>Please review at your earliest convenience.</p>
      `
    })

    return NextResponse.json(
      { message: 'Demo submitted successfully' },
      { status: 200 }
    )
  } catch (error) {
    console.error('Demo submission error:', error)
    return NextResponse.json(
      { message: 'Failed to submit demo' },
      { status: 500 }
    )
  }
} 