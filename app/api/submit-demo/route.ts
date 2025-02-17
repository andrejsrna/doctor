import { NextResponse } from 'next/server'
import nodemailer from 'nodemailer'

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
    const { token, ...formData } = body

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

    // Send email
    await transporter.sendMail({
      from: `"DnB Doctor Demo Submission" <${process.env.SMTP_FROM}>`,
      to: process.env.ADMIN_EMAIL,
      replyTo: `"${formData.artistName}" <${formData.email}>`,
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
        <p><strong>Artist Name:</strong> ${formData.artistName}</p>
        <p><strong>Email:</strong> ${formData.email}</p>
        <p><strong>Genre:</strong> ${formData.genre}</p>
        <p><strong>Track Link:</strong> <a href="${formData.subject}">${formData.subject}</a></p>
        <p>Please review at your earliest convenience.</p>
      `
    })

    return NextResponse.json(
      { message: 'Demo submitted successfully' },
      { status: 200 }
    )
  } catch (error) {
    console.error('Submit demo error:', error)
    return NextResponse.json(
      { message: 'Failed to process request' },
      { status: 500 }
    )
  }
} 