import { NextRequest, NextResponse } from 'next/server'
import { z } from 'zod'

const haendlerSchema = z.object({
  firma: z.string().min(2),
  vorname: z.string().min(2),
  nachname: z.string().min(2),
  telefon: z.string().min(6),
  email: z.string().email(),
  fahrzeugAnzahl: z.string().min(1),
  nachricht: z.string().optional(),
  datenschutz: z.boolean().refine((v) => v === true),
})

const rateLimitMap = new Map<string, { count: number; resetAt: number }>()

function checkRateLimit(ip: string): boolean {
  const now = Date.now()
  const limit = rateLimitMap.get(ip)
  if (!limit || now > limit.resetAt) {
    rateLimitMap.set(ip, { count: 1, resetAt: now + 60 * 60 * 1000 })
    return true
  }
  if (limit.count >= 5) return false
  limit.count++
  return true
}

export async function POST(request: NextRequest) {
  const forwardedFor = request.headers.get('x-forwarded-for')
  const ip = forwardedFor ? forwardedFor.split(',')[0].trim() : 'unknown'

  if (!checkRateLimit(ip)) {
    return NextResponse.json(
      { error: 'Zu viele Anfragen. Bitte später versuchen.' },
      { status: 429 }
    )
  }

  try {
    const body = await request.json()
    const data = haendlerSchema.parse(body)

    try {
      const { prisma } = await import('@/lib/prisma')
      await prisma.haendlerAnfrage.create({
        data: {
          firmenname: data.firma,
          ansprechpartner: `${data.vorname} ${data.nachname}`,
          telefon: data.telefon,
          email: data.email,
          anzahlFahrzeuge: data.fahrzeugAnzahl,
          fahrzeugarten: '',
          nachricht: data.nachricht ?? '',
        },
      })
    } catch {
      // DB nicht verfügbar – weiter ohne DB
    }

    const { sendEmail } = await import('@/lib/email')
    const { haendlerBestaetigung } = await import('@/services/emailTemplates')

    // Interne Benachrichtigung
    void sendEmail({
      to: process.env.NEXT_PUBLIC_FIRMA_EMAIL || 'info@autoankauf-baden.de',
      subject: `Neue Händleranfrage: ${data.firma}`,
      html: `
        <h2 style="font-family:sans-serif;">Neue Händleranfrage</h2>
        <p style="font-family:sans-serif;"><strong>Firma:</strong> ${data.firma}</p>
        <p style="font-family:sans-serif;"><strong>Ansprechpartner:</strong> ${data.vorname} ${data.nachname}</p>
        <p style="font-family:sans-serif;"><strong>Telefon:</strong> ${data.telefon}</p>
        <p style="font-family:sans-serif;"><strong>E-Mail:</strong> ${data.email}</p>
        <p style="font-family:sans-serif;"><strong>Fahrzeuge/Woche:</strong> ${data.fahrzeugAnzahl}</p>
        ${data.nachricht ? `<p style="font-family:sans-serif;"><strong>Nachricht:</strong> ${data.nachricht}</p>` : ''}
      `,
      _typ: 'haendler_intern',
    })

    // Bestätigungsmail an Händler
    const bestaetigung = haendlerBestaetigung({
      vorname: data.vorname,
      nachname: data.nachname,
      firma: data.firma,
      fahrzeugAnzahl: data.fahrzeugAnzahl,
      nachricht: data.nachricht,
    })
    void sendEmail({
      to: data.email,
      subject: bestaetigung.subject,
      html: bestaetigung.html,
      _typ: 'haendler_bestaetigung',
    })

    // Alle aktiven Mitarbeiter per konfiguriertem Kanal benachrichtigen
    try {
      const { prisma: db } = await import('@/lib/prisma')
      const mitarbeiter = await db.mitarbeiter.findMany({ where: { aktiv: true } })
      const rows = await db.einstellung.findMany()
      const settings: Record<string, string> = {}
      rows.forEach(r => { settings[r.id] = r.wert })

      const { notifyMitarbeiter } = await import('@/lib/notify')
      const { sendToAllNumbers } = await import('@/lib/callmebot')
      const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || 'http://localhost:3000'
      const message =
        `🏢 Neue Händleranfrage!\n` +
        `Firma: ${data.firma}\n` +
        `Kontakt: ${data.vorname} ${data.nachname}\n` +
        `Fahrzeuge: ${data.fahrzeugAnzahl}/Woche\n` +
        `📞 ${data.telefon}\n` +
        `👉 ${baseUrl}/dashboard`

      const subject = `[AAB] Neue Händleranfrage: ${data.firma}`
      const maPromises = mitarbeiter.map(m =>
        notifyMitarbeiter(m, message, subject, { dashboardPath: '/dashboard' })
      )

      // Auch globale WA-Nummern aus Einstellungen
      void Promise.allSettled([...maPromises, sendToAllNumbers(settings, message)])
    } catch {
      // Benachrichtigungs-Fehler nie blockieren
    }

    return NextResponse.json({ success: true })
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json({ error: 'Ungültige Daten', details: error.issues }, { status: 400 })
    }
    return NextResponse.json({ error: 'Interner Fehler' }, { status: 500 })
  }
}
