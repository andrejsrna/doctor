import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl

  // Check if the URL matches the old format (no /music/ prefix and ends with /)
  if (!pathname.startsWith('/music/') && pathname.endsWith('/')) {
    // Remove trailing slash and get the slug
    const slug = pathname.slice(0, -1).split('/').pop()
    
    // Only redirect if it's not a system path
    if (slug && 
        !pathname.startsWith('/api/') && 
        !pathname.startsWith('/_next/') && 
        !pathname.startsWith('/static/')) {
      // Create new URL with /music/ prefix
      const newUrl = new URL(`/music/${slug}`, request.url)
      return NextResponse.redirect(newUrl)
    }
  }

  return NextResponse.next()
}

export const config = {
  matcher: [
    // Match all paths that don't start with these prefixes
    '/((?!api|_next/static|_next/image|favicon.ico).*)',
  ],
} 