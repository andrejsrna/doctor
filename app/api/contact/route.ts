import { NextResponse } from 'next/server'

interface RequestBody {
  name: string
  email: string
  subject: string
  message: string
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

    // Send email using Brevo API
    const response = await fetch('https://api.brevo.com/v3/smtp/email', {
      method: 'POST',
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json',
        'api-key': process.env.BREVO_API_KEY!,
      },
      body: JSON.stringify({
        sender: {
          name: 'DnB Doctor Contact Form',
          email: 'noreply@dnbdoctor.com'
        },
        to: [{
          email: process.env.ADMIN_EMAIL,
          name: 'DnB Doctor'
        }],
        replyTo: {
          email: formData.email,
          name: formData.name
        },
        subject: `Contact Form: ${formData.subject}`,
        htmlContent: `
          <h2>New Contact Form Submission</h2>
          <p><strong>Name:</strong> ${formData.name}</p>
          <p><strong>Email:</strong> ${formData.email}</p>
          <p><strong>Subject:</strong> ${formData.subject}</p>
          <p><strong>Message:</strong></p>
          <p>${formData.message.replace(/\n/g, '<br>')}</p>
        `,
        textContent: `
Name: ${formData.name}
Email: ${formData.email}
Subject: ${formData.subject}

Message:
${formData.message}
        `
      })
    })

    if (!response.ok) {
      const error = await response.json()
      console.error('Brevo API error:', error)
      throw new Error('Failed to send email')
    }

    return NextResponse.json(
      { message: 'Message sent successfully' },
      { status: 200 }
    )
  } catch (error) {
    console.error('Contact form error:', error)
    return NextResponse.json(
      { message: 'Failed to send message' },
      { status: 500 }
    )
  }
} 