import { NextRequest, NextResponse } from 'next/server'
import { verifyToken, COOKIE_NAME } from '@/lib/auth'

const PROTECTED_ROUTES = ['/agent', '/admin']
const AUTH_ROUTES = ['/login', '/register']

export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl
  const token = request.cookies.get(COOKIE_NAME)?.value

  const isProtected = PROTECTED_ROUTES.some((r) => pathname.startsWith(r))
  const isAuthRoute = AUTH_ROUTES.some((r) => pathname.startsWith(r))

  if (isProtected) {
    if (!token) {
      return NextResponse.redirect(new URL('/login', request.url))
    }
    const payload = await verifyToken(token)
    if (!payload) {
      return NextResponse.redirect(new URL('/login', request.url))
    }
    // Protect /agent to AGENT and ADMIN only
    if (pathname.startsWith('/agent') && payload.role === 'USER') {
      return NextResponse.redirect(new URL('/', request.url))
    }
  }

  // Redirect authenticated users away from login/register
  if (isAuthRoute && token) {
    const payload = await verifyToken(token)
    if (payload) {
      return NextResponse.redirect(new URL('/', request.url))
    }
  }

  return NextResponse.next()
}

export const config = {
  matcher: ['/agent/:path*', '/admin/:path*', '/login', '/register'],
}
