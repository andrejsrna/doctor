import { PostHog } from 'posthog-node'

let instance: PostHog | null = null

export function getPosthogServer(): PostHog | null {
  if (!process.env.NEXT_PUBLIC_POSTHOG_KEY) return null
  if (!instance) {
    instance = new PostHog(process.env.NEXT_PUBLIC_POSTHOG_KEY, {
      host: process.env.NEXT_PUBLIC_POSTHOG_HOST || 'https://eu.i.posthog.com',
      flushAt: 1,
    })
  }
  return instance
}

export function captureServerEvent(event: string, properties?: Record<string, unknown>) {
  const ph = getPosthogServer()
  if (!ph) return
  ph.capture({ distinctId: 'server', event, properties })
}


