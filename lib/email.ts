import nodemailer from 'nodemailer'

export const FROM_EMAIL = process.env.SMTP_FROM || 'info@autoankauf-baden.de'

/** Transporter wird bei jedem Aufruf frisch erstellt – stellt sicher dass env-Vars korrekt geladen sind */
function createTransporter() {
  const smtpPort = Number(process.env.SMTP_PORT) || 587
  return nodemailer.createTransport({
    host: process.env.SMTP_HOST || 'smtp.strato.de',
    port: smtpPort,
    secure: smtpPort === 465,
    auth: {
      user: process.env.SMTP_USER,
      pass: process.env.SMTP_PASS,
    },
    tls: {
      rejectUnauthorized: false,
      minVersion: 'TLSv1.2',
    },
  })
}

interface Attachment {
  filename: string
  content: string
  contentType: string
}

export async function sendEmail(options: {
  to: string
  subject: string
  html: string
  attachments?: Attachment[]
  _typ?: string       // für Mail-Log (interner Hinweis)
  _anfrageId?: string // für Mail-Log
}) {
  // Firmen-Kürzel in jeden Betreff
  const subject = options.subject.includes('| AAB')
    ? options.subject
    : `${options.subject} | AAB`

  let status = 'gesendet'
  let fehler: string | undefined

  try {
    const transporter = createTransporter()
    await transporter.sendMail({
      from: FROM_EMAIL,
      to: options.to,
      subject,
      html: options.html,
      attachments: options.attachments,
    })
  } catch (err) {
    status = 'fehler'
    fehler = err instanceof Error ? err.message : String(err)
    // Fehler weiterwerfen damit Aufrufer es bemerkt
    throw err
  } finally {
    // Immer loggen — auch bei Fehler
    void logMail({
      anfrageId: options._anfrageId,
      typ: options._typ || 'unbekannt',
      empfaenger: options.to,
      betreff: subject,
      htmlBody: options.html,
      status,
      fehler,
    })
  }
}

async function logMail(entry: {
  anfrageId?: string
  typ: string
  empfaenger: string
  betreff: string
  htmlBody?: string
  status: string
  fehler?: string
}) {
  try {
    const { prisma } = await import('./prisma')
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    await (prisma as any).mailLog.create({
      data: {
        anfrageId: entry.anfrageId ?? null,
        typ: entry.typ,
        empfaenger: entry.empfaenger,
        betreff: entry.betreff,
        htmlBody: entry.htmlBody ?? null,
        status: entry.status,
        fehler: entry.fehler ?? null,
      },
    })
  } catch {
    // Log-Fehler nicht nach oben weitergeben
    console.error('[mailLog] Konnte nicht schreiben')
  }
}

/** Generiert ICS-Inhalt für einen Termin.
 *
 * - uid: stabile ID pro Anfrage (z.B. anfrageId) — Kalender erkennt Updates
 * - sequence: 0 = neu, 1 = erste Änderung, 2 = zweite Änderung usw.
 * - method: 'REQUEST' = neu/update, 'CANCEL' = Absage (löscht aus Kalender)
 */
export function generateIcs(params: {
  dtstart: Date
  uid: string                      // stabile ID — NIEMALS Date.now() verwenden
  sequence?: number                // 0=neu, increment bei jedem Update
  method?: 'REQUEST' | 'CANCEL'
  kundeVorname: string
  kundeNachname: string
  marke: string
  modell: string
  kilometerstand?: number
  bearbeiterName?: string          // weglassen wenn nicht gesetzt
  location?: string                // Abholadresse
}): string {
  const fmt = (d: Date) =>
    d.toISOString().replace(/[-:]/g, '').replace(/\.\d{3}/, '')

  const method   = params.method   ?? 'REQUEST'
  const sequence = params.sequence ?? 0
  const dtend    = new Date(params.dtstart.getTime() + 60 * 60 * 1000) // 1h

  // Beschreibung — nur vorhandene Felder
  const descLines: string[] = [
    `Fahrzeug: ${params.marke} ${params.modell}${params.kilometerstand ? ', ' + params.kilometerstand.toLocaleString('de-DE') + ' km' : ''}`,
    `Kunde: ${params.kundeVorname} ${params.kundeNachname}`,
  ]
  if (params.bearbeiterName) descLines.push(`Zuständig: ${params.bearbeiterName}`)
  if (params.location) {
    const mapsUrl = `https://maps.google.com/?q=${encodeURIComponent(params.location)}`
    descLines.push(`Adresse: ${params.location}`)
    descLines.push(`Google Maps: ${mapsUrl}`)
  }
  if (method === 'CANCEL') descLines.unshift('⚠️ Dieser Termin wurde abgesagt.')

  const summary = method === 'CANCEL'
    ? `ABGESAGT – Autoankauf ${params.marke} ${params.modell}`
    : `Autoankauf: ${params.kundeVorname} ${params.kundeNachname} – ${params.marke} ${params.modell}`

  return [
    'BEGIN:VCALENDAR',
    'VERSION:2.0',
    'PRODID:-//AutoAnkauf-Baden//DE',
    'CALSCALE:GREGORIAN',
    `METHOD:${method}`,
    'BEGIN:VEVENT',
    `DTSTART:${fmt(params.dtstart)}`,
    `DTEND:${fmt(dtend)}`,
    `SUMMARY:${summary}`,
    `DESCRIPTION:${descLines.join('\\n')}`,
    params.location ? `LOCATION:${params.location}` : '',
    `UID:aab-termin-${params.uid}@autoankauf-baden.de`,
    `SEQUENCE:${sequence}`,
    `STATUS:${method === 'CANCEL' ? 'CANCELLED' : 'CONFIRMED'}`,
    'END:VEVENT',
    'END:VCALENDAR',
  ].filter(Boolean).join('\r\n')
}
