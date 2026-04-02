import { NextRequest, NextResponse } from 'next/server'

const SESSION_COOKIE = 'aab_session'

async function verifyToken(token: string, secret: string): Promise<boolean> {
  const dot = token.indexOf('.')
  if (dot === -1) return false
  const mitarbeiterId = token.slice(0, dot)
  const sig = token.slice(dot + 1)
  if (!mitarbeiterId || !sig) return false

  const encoder = new TextEncoder()
  const key = await crypto.subtle.importKey(
    'raw', encoder.encode(secret), { name: 'HMAC', hash: 'SHA-256' }, false, ['sign']
  )
  const sigBytes = await crypto.subtle.sign('HMAC', key, encoder.encode(mitarbeiterId))
  const expected = Array.from(new Uint8Array(sigBytes))
    .map(b => b.toString(16).padStart(2, '0')).join('')
  return expected === sig
}

export async function proxy(request: NextRequest) {
  const { pathname } = request.nextUrl

  if (!pathname.startsWith('/dashboard') || pathname === '/dashboard/login' || pathname.startsWith('/dashboard/reset-password')) {
    return NextResponse.next()
  }

  const sessionCookie = request.cookies.get(SESSION_COOKIE)

  if (!sessionCookie?.value) {
    return NextResponse.redirect(new URL('/dashboard/login', request.url))
  }

  const secret = process.env.NEXTAUTH_SECRET || 'fallback-secret'
  const valid = await verifyToken(sessionCookie.value, secret)

  if (!valid) {
    const response = NextResponse.redirect(new URL('/dashboard/login', request.url))
    response.cookies.delete(SESSION_COOKIE)
    return response
  }

  return NextResponse.next()
}

export const config = {
  matcher: ['/dashboard/:path*'],
}
