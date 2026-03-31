import { NextRequest, NextResponse } from 'next/server'
import { hashPassword } from '@/lib/password'

const SECRET = process.env.NEXTAUTH_SECRET || 'fallback-secret'
const TOKEN_TTL = 15 * 60 * 1000 // 15 Minuten

async function hmac(data: string): Promise<string> {
  const encoder = new TextEncoder()
  const key = await crypto.subtle.importKey('raw', encoder.encode(SECRET), { name: 'HMAC', hash: 'SHA-256' }, false, ['sign'])
  const sig = await crypto.subtle.sign('HMAC', key, encoder.encode(data))
  return Array.from(new Uint8Array(sig)).map(b => b.toString(16).padStart(2, '0')).join('')
}

export async function createResetToken(email: string): Promise<string> {
  const expiry = Date.now() + TOKEN_TTL
  const payload = `${email}:${expiry}`
  const sig = await hmac(payload)
  return Buffer.from(payload).toString('base64url') + '.' + sig
}

export async function verifyResetToken(token: string): Promise<string | null> {
  const dot = token.lastIndexOf('.')
  if (dot === -1) return null
  const payloadB64 = token.slice(0, dot)
  const sig = token.slice(dot + 1)
  try {
    const payload = Buffer.from(payloadB64, 'base64url').toString()
    const expected = await hmac(payload)
    if (expected !== sig) return null
    const [email, expiryStr] = payload.split(':')
    if (!email || !expiryStr) return null
    if (Date.now() > parseInt(expiryStr)) return null
    return email
  } catch {
    return null
  }
}

/** Schritt 1: Reset anfordern — sendet E-Mail mit Link, ändert KEIN Passwort */
export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const email = typeof body.email === 'string' ? body.email.toLowerCase().trim() : ''
    if (!email) return NextResponse.json({ error: 'E-Mail erforderlich' }, { status: 400 })

    const { prisma } = await import('@/lib/prisma')
    const mitarbeiter = await prisma.mitarbeiter.findUnique({
      where: { email },
      select: { id: true, vorname: true, aktiv: true },
    })

    // Immer gleiche Antwort — kein Hinweis ob E-Mail existiert
    if (!mitarbeiter || !mitarbeiter.aktiv) {
      await new Promise(r => setTimeout(r, 800))
      return NextResponse.json({ success: true })
    }

    const token = await createResetToken(email)
    const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || 'https://autoankauf-baden.de'
    const resetUrl = `${baseUrl}/dashboard/reset-password?token=${token}`

    void (async () => {
      try {
        const { sendEmail } = await import('@/lib/email')
        const html = `
          <div style="font-family:sans-serif;max-width:520px;margin:0 auto;padding:32px 24px;background:#0F172A;border-radius:16px;">
            <p style="color:#94A3B8;font-size:14px;margin:0 0 8px;">Hallo ${mitarbeiter.vorname},</p>
            <h2 style="color:#fff;font-size:22px;font-weight:800;margin:0 0 16px;">Passwort zurücksetzen</h2>
            <p style="color:#64748B;font-size:15px;line-height:1.7;margin:0 0 24px;">
              Klicke auf den Button um ein neues Passwort zu setzen. Der Link ist <strong style="color:#94A3B8;">15 Minuten</strong> gültig.
            </p>
            <a href="${resetUrl}" style="display:inline-block;background:#0369A1;color:#fff;font-size:15px;font-weight:700;text-decoration:none;padding:14px 28px;border-radius:10px;">
              Neues Passwort setzen →
            </a>
            <p style="color:#475569;font-size:12px;margin:24px 0 0;line-height:1.6;">
              Falls du kein Passwort angefordert hast, ignoriere diese E-Mail.<br>Dein bisheriges Passwort bleibt unverändert.
            </p>
          </div>`
        await sendEmail({ to: email, subject: '[AAB] Passwort zurücksetzen', html, _typ: 'intern', _anfrageId: undefined })
      } catch { /* E-Mail-Fehler still */ }
    })()

    return NextResponse.json({ success: true })
  } catch {
    return NextResponse.json({ error: 'Interner Fehler' }, { status: 500 })
  }
}

/** Schritt 2: Neues Passwort setzen — nur mit gültigem Token */
export async function PATCH(request: NextRequest) {
  try {
    const body = await request.json()
    const { token, passwort } = body as { token?: string; passwort?: string }

    if (!token || !passwort || passwort.length < 6) {
      return NextResponse.json({ error: 'Ungültige Anfrage' }, { status: 400 })
    }

    const email = await verifyResetToken(token)
    if (!email) {
      return NextResponse.json({ error: 'Link ungültig oder abgelaufen' }, { status: 400 })
    }

    const { prisma } = await import('@/lib/prisma')
    const mitarbeiter = await prisma.mitarbeiter.findUnique({ where: { email }, select: { id: true, aktiv: true } })
    if (!mitarbeiter || !mitarbeiter.aktiv) {
      return NextResponse.json({ error: 'Konto nicht gefunden' }, { status: 404 })
    }

    const hash = await hashPassword(passwort)
    await prisma.mitarbeiter.update({ where: { id: mitarbeiter.id }, data: { passwortHash: hash } })

    return NextResponse.json({ success: true })
  } catch {
    return NextResponse.json({ error: 'Interner Fehler' }, { status: 500 })
  }
}
