import { NextRequest, NextResponse } from 'next/server'

export async function POST(req: NextRequest) {
  try {
    const body = await req.json().catch(() => ({}))
    // Intentionally no third-party analytics here.
    // Keep this endpoint as a no-op sink so the client can POST errors without breaking.
    if (process.env.NODE_ENV !== 'production') {
      console.error('client_error', {
        message: body?.message,
        stack: body?.stack,
        component: body?.component,
        path: body?.path,
        ua: req.headers.get('user-agent') || undefined,
      })
    }
    return NextResponse.json({ ok: true })
  } catch {
    return NextResponse.json({ ok: false }, { status: 500 })
  }
}
