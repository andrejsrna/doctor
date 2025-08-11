import { NextRequest, NextResponse } from 'next/server'
import { captureServerEvent } from '@/lib/posthogServer'

export async function POST(req: NextRequest) {
  try {
    const body = await req.json().catch(() => ({}))
    captureServerEvent('client_error', {
      message: body?.message,
      stack: body?.stack,
      component: body?.component,
      path: body?.path,
      ua: req.headers.get('user-agent') || undefined,
    })
    return NextResponse.json({ ok: true })
  } catch (e) {
    return NextResponse.json({ ok: false }, { status: 500 })
  }
}


