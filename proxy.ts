import { NextRequest, NextResponse } from 'next/server'

const SESSION_COOKIE = 'aab_session'

// ── Rate Limiting ────────────────────────────────────────────────────────────
// In-Memory (ausreichend für Single-Instance PM2 Deployment)
const rateLimitMap = new Map<string, { count: number; resetAt: number }>()

const RATE_LIMITS: Record<string, { max: number; windowMs: number }> = {
  '/api/anfrage':          { max: 5,  windowMs: 60 * 60 * 1000 }, // 5/Stunde
  '/api/haendler-anfrage': { max: 5,  windowMs: 60 * 60 * 1000 }, // 5/Stunde
  '/api/chat':             { max: 20, windowMs: 60 * 60 * 1000 }, // 20/Stunde
}

let lastCleanup = Date.now()
function cleanupExpired() {
  const now = Date.now()
  if (now - lastCleanup < 10 * 60 * 1000) return
  lastCleanup = now
  for (const [key, entry] of rateLimitMap.entries()) {
    if (entry.resetAt < now) rateLimitMap.delete(key)
  }
}

function getClientIp(req: NextRequest): string {
  const forwarded = req.headers.get('x-forwarded-for')
  if (forwarded) return forwarded.split(',')[0].trim()
  return 'unknown'
}

function checkRateLimit(req: NextRequest): NextResponse | null {
  const { pathname } = req.nextUrl
  const limit = RATE_LIMITS[pathname]
  if (!limit || req.method !== 'POST') return null

  const ip = getClientIp(req)
  const key = `${pathname}:${ip}`
  const now = Date.now()
  const entry = rateLimitMap.get(key)

  if (!entry || entry.resetAt < now) {
    rateLimitMap.set(key, { count: 1, resetAt: now + limit.windowMs })
    return null
  }

  if (entry.count >= limit.max) {
    const retryAfter = Math.ceil((entry.resetAt - now) / 1000)
    return NextResponse.json(
      { error: 'Zu viele Anfragen. Bitte später erneut versuchen.' },
      {
        status: 429,
        headers: {
          'Retry-After': String(retryAfter),
          'X-RateLimit-Limit': String(limit.max),
          'X-RateLimit-Remaining': '0',
        },
      }
    )
  }

  entry.count++
  return null
}

// ── Auth Token Verifikation ──────────────────────────────────────────────────
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

// ── Proxy Hauptfunktion ──────────────────────────────────────────────────────
export async function proxy(request: NextRequest) {
  cleanupExpired()

  const { pathname } = request.nextUrl

  // Rate Limiting für öffentliche API-Routen
  const rateLimitResponse = checkRateLimit(request)
  if (rateLimitResponse) return rateLimitResponse

  // Dashboard Auth-Schutz
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
  matcher: [
    '/dashboard/:path*',
    '/api/anfrage',
    '/api/haendler-anfrage',
    '/api/chat',
  ],
}
