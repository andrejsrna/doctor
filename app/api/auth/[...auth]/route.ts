import { auth } from '@/app/lib/auth'
import { toNextJsHandler } from 'better-auth/next-js'

const handler = toNextJsHandler(auth)

export const GET = handler.GET

// Accounts are created by admins (server-side auth.api.signUpEmail), never through the public HTTP endpoint.
export async function POST(request: Request) {
  if (new URL(request.url).pathname.endsWith('/sign-up/email')) {
    return Response.json({ error: 'Not found' }, { status: 404 })
  }
  return handler.POST(request)
}