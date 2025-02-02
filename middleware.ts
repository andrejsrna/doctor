import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

const PUBLIC_PATHS = [
  '/',
  '/artists',
  '/terms',
  '/bio',
  '/privacy',
  '/feedback',
  '/search',
  '/contact',
  '/releases',
  '/bulk-sale',
  '/contact',
  '/api',
  '/about/'
  
]

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl

  // Skip middleware for static files and API routes
  if (pathname.startsWith('/_next/') || 
      pathname.startsWith('/api/') || 
      pathname.startsWith('/static/') ||
      pathname.match(/\.(ico|png|jpg|jpeg|svg|css|js)$/)) {
    return NextResponse.next()
  }

  // Skip middleware for public paths
  if (PUBLIC_PATHS.includes(pathname) || PUBLIC_PATHS.includes(pathname + '/')) {
    return NextResponse.next()
  }

  // If path starts with /music/, let it through
  if (pathname.startsWith('/music/')) {
    return NextResponse.next()
  }

  // Remove leading and trailing slashes
  const slug = pathname.replace(/^\/+|\/+$/g, '')
  
  if (slug) {
    // Redirect to /music/ path
    const newUrl = new URL(`/music/${slug}`, request.url)
    return NextResponse.redirect(newUrl, 301)
  }

  return NextResponse.next()
}

export const config = {
  matcher: [
    '/((?!api|_next/static|_next/image|favicon.ico|.*\\.).*)',
  ],
} 