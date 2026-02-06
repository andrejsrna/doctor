import { NextResponse } from 'next/server'

const ALLOWED_HOSTS = new Set([
  'cdn.dnbdoctor.com',
  'dnbdoctor.com',
  'www.dnbdoctor.com',
  process.env.R2_PUBLIC_HOSTNAME || ''
].filter(Boolean))

function isPrivateIp(hostname: string): boolean {
  if (/^(localhost|127\.0\.0\.1|\[::1\])$/i.test(hostname)) return true
  if (/^10\./.test(hostname)) return true
  if (/^192\.168\./.test(hostname)) return true
  if (/^172\.(1[6-9]|2[0-9]|3[0-1])\./.test(hostname)) return true
  return false
}

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url)
  const audioUrl = searchParams.get('url')
  const download = searchParams.get('download') === '1' || searchParams.get('dl') === '1'
  const nameParam = searchParams.get('name') || undefined

  if (!audioUrl) {
    return NextResponse.json({ error: 'No URL provided' }, { status: 400 })
  }

  try {
    let url: URL
    try { url = new URL(audioUrl) } catch { return NextResponse.json({ error: 'Invalid URL' }, { status: 400 }) }
    if (isPrivateIp(url.hostname)) return NextResponse.json({ error: 'Forbidden host' }, { status: 403 })
    if (ALLOWED_HOSTS.size && !ALLOWED_HOSTS.has(url.hostname)) return NextResponse.json({ error: 'Host not allowed' }, { status: 403 })

    const controller = new AbortController()
    const timeout = setTimeout(() => controller.abort(), 8000)
    const response = await fetch(url.toString(), { signal: controller.signal, headers: { 'Accept': 'audio/*' } })
    clearTimeout(timeout)
    if (!response.ok) return NextResponse.json({ error: 'Upstream error' }, { status: 502 })
    const contentType = response.headers.get('content-type') || 'application/octet-stream'
    if (!/^audio\//i.test(contentType)) return NextResponse.json({ error: 'Unsupported content-type' }, { status: 415 })
    const arrayBuffer = await response.arrayBuffer()
    const urlPath = (() => { try { return new URL(audioUrl).pathname } catch { return '' } })()
    const inferredName = urlPath.split('/').filter(Boolean).slice(-1)[0] || 'file'
    const originalName = nameParam || inferredName
    const extMatch = /\.[A-Za-z0-9]+$/.exec(inferredName)
    const ext = extMatch ? extMatch[0] : ''
      const asciiNameBase = originalName
      .normalize('NFKD')
      .replace(/[\u0300-\u036f]/g, '') // strip diacritics
      .replace(/[^\x20-\x7E]/g, '') // strip non-ASCII
      .replace(/[/\\?%*:|"<>]/g, '-')
      .trim()
      || 'file'
    const asciiName = asciiNameBase.endsWith(ext) || !ext ? asciiNameBase : `${asciiNameBase}${ext}`
    const contentDisposition = download
      ? `attachment; filename="${asciiName}"; filename*=UTF-8''${encodeURIComponent(originalName)}`
      : undefined

    return new NextResponse(arrayBuffer, {
      headers: {
        'Content-Type': contentType,
        ...(contentDisposition ? { 'Content-Disposition': contentDisposition } : {})
      }
    })
  } catch (error) {
    console.error('Audio proxy error:', error)
    return NextResponse.json({ error: 'Failed to fetch audio' }, { status: 500 })
  }
} 
