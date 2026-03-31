import { NextRequest, NextResponse } from 'next/server'

function csvEscape(val: unknown): string {
  if (val === null || val === undefined) return ''
  const s = String(val)
  if (s.includes(';') || s.includes('"') || s.includes('\n')) {
    return `"${s.replace(/"/g, '""')}"`
  }
  return s
}

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = request.nextUrl
    const status = searchParams.get('status')
    const archiviert = searchParams.get('archiviert')
    const nurNewsletter = searchParams.get('newsletter') === 'true'

    const { prisma } = await import('@/lib/prisma')
    const datum = new Date().toISOString().slice(0, 10)
    const bom = '\uFEFF'

    // ── Newsletter-Export ──────────────────────────────────────────────────────
    if (nurNewsletter) {
      const abonnenten = await prisma.newsletterAbonnent.findMany({
        orderBy: { createdAt: 'desc' },
        select: { createdAt: true, vorname: true, nachname: true, email: true, plz: true, quelle: true },
      })
      const header = ['Anmeldedatum', 'Vorname', 'Nachname', 'E-Mail', 'PLZ', 'Quelle'].join(';')
      const rows = abonnenten.map(a => [
        new Date(a.createdAt).toLocaleDateString('de-DE'),
        a.vorname, a.nachname, a.email, a.plz ?? '', a.quelle,
      ].map(csvEscape).join(';'))
      const csv = [header, ...rows].join('\r\n')
      return new NextResponse(bom + csv, {
        headers: {
          'Content-Type': 'text/csv; charset=utf-8',
          'Content-Disposition': `attachment; filename="newsletter-${datum}.csv"`,
        },
      })
    }

    // ── Vollständiger Anfragen-Export ──────────────────────────────────────────
    const where: Record<string, unknown> = {}
    if (status && status !== 'all') where.status = status
    if (archiviert === 'true') where.archiviert = true
    else if (archiviert === 'false') where.archiviert = false

    const anfragen = await prisma.anfrage.findMany({
      where,
      orderBy: { createdAt: 'desc' },
      select: {
        id: true, createdAt: true, vorname: true, nachname: true,
        email: true, telefon: true, plz: true, marke: true, modell: true,
        erstzulassungJahr: true, erstzulassungMonat: true, kilometerstand: true,
        kraftstoff: true, getriebe: true, fahrbereitschaft: true,
        optischerZustand: true, unfallfahrzeug: true, status: true,
        archiviert: true, angebotspreis: true, abschlussPreis: true,
        ablehnungsGrund: true, terminVorschlag1: true, abholadresse: true,
        notizen: true, newsletter: true,
      },
    })

    const STATUS_LABEL: Record<string, string> = {
      neu: 'Neu', kontaktiert: 'Kontaktiert', angebot_gesendet: 'Angebot gesendet',
      termin_vereinbart: 'Termin vereinbart', abgeschlossen: 'Abgeschlossen', abgelehnt: 'Abgelehnt',
    }

    const header = [
      'Datum', 'Vorname', 'Nachname', 'E-Mail', 'Telefon', 'PLZ',
      'Marke', 'Modell', 'EZ Jahr', 'EZ Monat', 'KM-Stand',
      'Kraftstoff', 'Getriebe', 'Fahrbereit', 'Zustand (1-5)',
      'Unfallfahrzeug', 'Status', 'Archiviert',
      'Angebotspreis (€)', 'Bezahlt (€)', 'Ablehnungsgrund',
      'Termin', 'Adresse', 'Notizen', 'Newsletter',
    ].join(';')

    const rows = anfragen.map(a => [
      new Date(a.createdAt).toLocaleDateString('de-DE'),
      a.vorname, a.nachname, a.email, a.telefon ?? '', a.plz,
      a.marke, a.modell, a.erstzulassungJahr, a.erstzulassungMonat,
      a.kilometerstand, a.kraftstoff, a.getriebe, a.fahrbereitschaft,
      a.optischerZustand, a.unfallfahrzeug,
      STATUS_LABEL[a.status] ?? a.status,
      a.archiviert ? 'Ja' : 'Nein',
      a.angebotspreis ?? '', a.abschlussPreis ?? '', a.ablehnungsGrund ?? '',
      a.terminVorschlag1 ? new Date(a.terminVorschlag1).toLocaleString('de-DE', { day: '2-digit', month: '2-digit', year: 'numeric', hour: '2-digit', minute: '2-digit' }) : '',
      a.abholadresse ?? '', a.notizen ?? '',
      a.newsletter ? 'Ja' : 'Nein',
    ].map(csvEscape).join(';'))

    const csv = [header, ...rows].join('\r\n')

    return new NextResponse(bom + csv, {
      headers: {
        'Content-Type': 'text/csv; charset=utf-8',
        'Content-Disposition': `attachment; filename="anfragen-${datum}.csv"`,
      },
    })
  } catch {
    return NextResponse.json({ error: 'Export fehlgeschlagen' }, { status: 500 })
  }
}
