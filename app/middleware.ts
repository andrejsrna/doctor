import type { NextFetchEvent, NextRequest } from 'next/server'
import { NextResponse } from 'next/server'
import { captureServerEvent } from '@/lib/posthogServer'

export function middleware(req: NextRequest, _evt: NextFetchEvent) {
  return NextResponse.next()
}

export const config = { matcher: [] }

export const reportError = (error: unknown, context?: Record<string, unknown>) => {
  captureServerEvent('server_error', {
    error: error instanceof Error ? error.message : String(error),
    stack: error instanceof Error ? error.stack : undefined,
    ...context,
  })
}


