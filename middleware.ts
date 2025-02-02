import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl

  // Check if the URL doesn't start with /music/ and isn't a system path
  if (!pathname.startsWith('/music/') && 
      !pathname.startsWith('/api/') && 
      !pathname.startsWith('/_next/') && 
      !pathname.startsWith('/static/') &&
      pathname !== '/' &&
      !pathname.startsWith('/terms') &&
      !pathname.startsWith('/search')) {
    
    // Remove leading and trailing slashes and get the slug
    const slug = pathname.replace(/^\/+|\/+$/g, '')
    
    if (slug) {
      // Create new URL with /music/ prefix
      const newUrl = new URL(`/music/${slug}`, request.url)
      return NextResponse.redirect(newUrl, 301) // 301 for permanent redirect
    }
  }

  return NextResponse.next()
}

export const config = {
  matcher: [
    // Match all paths except static files and api routes
    '/((?!api|_next/static|_next/image|favicon.ico|.*\\.).*)',
  ],
} 