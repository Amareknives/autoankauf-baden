import { NextRequest, NextResponse } from 'next/server'

export async function GET(
  _request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params
    const { prisma } = await import('@/lib/prisma')

    const anfrage = await prisma.anfrage.findUnique({
      where: { id },
      select: {
        vorname: true,
        nachname: true,
        marke: true,
        modell: true,
        telefon: true,
        terminVorschlag1: true,
        abholadresse: true,
      },
    })

    if (!anfrage || !anfrage.terminVorschlag1) {
      return NextResponse.json({ error: 'Kein Termin vorhanden' }, { status: 404 })
    }

    const start = new Date(anfrage.terminVorschlag1)
    const end = new Date(start.getTime() + 60 * 60 * 1000) // 1 Stunde

    const pad = (n: number) => String(n).padStart(2, '0')
    const toICS = (d: Date) =>
      `${d.getUTCFullYear()}${pad(d.getUTCMonth() + 1)}${pad(d.getUTCDate())}T${pad(d.getUTCHours())}${pad(d.getUTCMinutes())}00Z`

    const uid = `anfrage-${id}@autoankauf-baden.de`
    const title = `Fahrzeugabholung: ${anfrage.marke} ${anfrage.modell} – ${anfrage.vorname} ${anfrage.nachname}`
    const location = anfrage.abholadresse || ''
    const description = `Kunde: ${anfrage.vorname} ${anfrage.nachname}\\nTel: ${anfrage.telefon}\\nFahrzeug: ${anfrage.marke} ${anfrage.modell}`

    const ics = [
      'BEGIN:VCALENDAR',
      'VERSION:2.0',
      'PRODID:-//AutoAnkauf-Baden//DE',
      'CALSCALE:GREGORIAN',
      'METHOD:PUBLISH',
      'BEGIN:VEVENT',
      `UID:${uid}`,
      `DTSTART:${toICS(start)}`,
      `DTEND:${toICS(end)}`,
      `SUMMARY:${title}`,
      `DESCRIPTION:${description}`,
      location ? `LOCATION:${location}` : '',
      `DTSTAMP:${toICS(new Date())}`,
      'END:VEVENT',
      'END:VCALENDAR',
    ].filter(Boolean).join('\r\n')

    return new NextResponse(ics, {
      headers: {
        'Content-Type': 'text/calendar; charset=utf-8',
        'Content-Disposition': `attachment; filename="termin-${anfrage.marke}-${anfrage.modell}.ics"`,
      },
    })
  } catch {
    return NextResponse.json({ error: 'Fehler' }, { status: 500 })
  }
}
