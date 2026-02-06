import Stripe from 'stripe'

export class StripeEnvError extends Error {
  constructor(message: string) {
    super(message)
    this.name = 'StripeEnvError'
  }
}

export function getStripe(): Stripe {
  const key = process.env.STRIPE_SECRET_KEY
  if (!key) throw new StripeEnvError('Missing STRIPE_SECRET_KEY env var')
  return new Stripe(key, { apiVersion: '2026-01-28.clover' })
}

export function getBaseUrl(): string {
  return process.env.BASE_URL || process.env.NEXTAUTH_URL || 'http://localhost:3000'
}
