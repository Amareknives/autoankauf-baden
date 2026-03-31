import { NextRequest, NextResponse } from 'next/server'
import { cookies } from 'next/headers'
import { createSessionToken, SESSION_COOKIE, SESSION_MAX_AGE } from '@/lib/auth'
import { verifyPassword } from '@/lib/password'

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { email, password } = body as { email?: string; password?: string }

    if (!email || !password) {
      return NextResponse.json({ error: 'E-Mail und Passwort erforderlich' }, { status: 400 })
    }

    const { prisma } = await import('@/lib/prisma')

    const mitarbeiter = await prisma.mitarbeiter.findUnique({
      where: { email: email.toLowerCase().trim() },
      select: { id: true, aktiv: true, passwortHash: true },
    })

    // Timing-sicheres Verhalten auch wenn Nutzer nicht existiert
    const hash = mitarbeiter?.passwortHash ?? 'x'
    const passwordOk = await verifyPassword(password, hash)

    if (!mitarbeiter || !mitarbeiter.aktiv || !passwordOk) {
      await new Promise(r => setTimeout(r, 500))
      return NextResponse.json({ error: 'Ungültige Anmeldedaten' }, { status: 401 })
    }

    const token = await createSessionToken(mitarbeiter.id)
    const cookieStore = await cookies()
    cookieStore.set(SESSION_COOKIE, token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      maxAge: SESSION_MAX_AGE,
      path: '/',
    })

    return NextResponse.json({ success: true })
  } catch {
    return NextResponse.json({ error: 'Interner Fehler' }, { status: 500 })
  }
}
