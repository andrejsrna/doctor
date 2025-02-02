import { NextResponse } from 'next/server'

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

    // Send to Fluent Forms
    const fluentResponse = await fetch('https://admin.dnbdoctor.com/wp-json/fluentform/v1/test-submit', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        form_id: 1,
        data: { 
          ...formData
        }
      })
    })

    if (!fluentResponse.ok) {
      throw new Error('Failed to submit to Fluent Forms')
    }

    // Send notification email using Brevo API
    const response = await fetch('https://api.brevo.com/v3/smtp/email', {
      method: 'POST',
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json',
        'api-key': process.env.BREVO_API_KEY!,
      },
      body: JSON.stringify({
        sender: {
          name: 'DnB Doctor Demo Submission',
          email: 'noreply@dnbdoctor.com'
        },
        to: [{
          email: process.env.ADMIN_EMAIL,
          name: 'DnB Doctor'
        }],
        replyTo: {
          email: formData.email,
          name: formData.artistName
        },
        subject: 'New Demo Submission',
        htmlContent: `
          <h2>New Demo Submission</h2>
          <p><strong>Artist Name:</strong> ${formData.artistName}</p>
          <p><strong>Email:</strong> ${formData.email}</p>
          <p><strong>Genre:</strong> ${formData.genre}</p>
          <p><strong>Track Link:</strong> <a href="${formData.subject}">${formData.subject}</a></p>
          <p>Please review at your earliest convenience.</p>
        `,
        textContent: `
New demo submission received:

Artist Name: ${formData.artistName}
Email: ${formData.email}
Genre: ${formData.genre}
Track Link: ${formData.subject}

Please review at your earliest convenience.
        `
      })
    })

    if (!response.ok) {
      const error = await response.json()
      console.error('Brevo API error:', error)
      throw new Error('Failed to send email notification')
    }

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