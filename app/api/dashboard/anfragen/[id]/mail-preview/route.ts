import { NextRequest, NextResponse } from 'next/server'
import { z } from 'zod'

const schema = z.object({
  typ: z.enum([
    'angebot',
    'termin_bestaetigung',
    'termin_verschoben',
    'termin_abgesagt',
    'termin_kunde_abgesagt',
    'ablehnung',
    'rueckfrage',
    'freinachricht',
    'bearbeiter_geaendert',
  ]),
  // Angebot
  angebotspreis: z.number().optional(),
  angebotNachricht: z.string().nullable().optional(),
  // Termin
  termin: z.string().optional(),
  alterTermin: z.string().optional(),
  adresse: z.string().optional(),
  adresseZusatz: z.string().nullable().optional(),
  terminMitarbeiterId: z.string().nullable().optional(),
  // Termin-Absage
  ersatztermin1: z.string().nullable().optional(),
  ersatztermin2: z.string().nullable().optional(),
  kommentar: z.string().nullable().optional(),
  // Nachricht / Ablehnung / Rückfrage
  text: z.string().optional(),
  // Bearbeiter
  bearbeiterId: z.string().nullable().optional(),
})

export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params
    const body = await request.json()
    const data = schema.parse(body)

    const { prisma } = await import('@/lib/prisma')
    const { getSiteSettings } = await import('@/lib/siteSettings')

    const [anfrage, settings] = await Promise.all([
      prisma.anfrage.findUnique({
        where: { id },
        select: {
          vorname: true,
          marke: true,
          modell: true,
          kilometerstand: true,
          email: true,
          angebotspreis: true,
          angebotNachricht: true,
          terminVorschlag1: true,
          abholadresse: true,
          abholAdresseZusatz: true,
          bearbeiter: {
            select: { vorname: true, nachname: true, telefon: true, whatsapp: true },
          },
        },
      }),
      getSiteSettings(),
    ])

    if (!anfrage) {
      return NextResponse.json({ error: 'Nicht gefunden' }, { status: 404 })
    }

    const templates = await import('@/services/emailTemplates')

    // Bearbeiter für die Preview ermitteln (terminMitarbeiterId hat Vorrang)
    let previewBearbeiter: { vorname: string; nachname: string; telefon: string | null; whatsapp: string | null } | null = null
    if (data.terminMitarbeiterId) {
      const ma = await prisma.mitarbeiter.findUnique({
        where: { id: data.terminMitarbeiterId },
        select: { vorname: true, nachname: true, telefon: true, whatsapp: true },
      })
      if (ma) previewBearbeiter = { vorname: ma.vorname, nachname: ma.nachname, telefon: ma.telefon ?? null, whatsapp: ma.whatsapp ?? null }
    } else if (data.bearbeiterId) {
      const ma = await prisma.mitarbeiter.findUnique({
        where: { id: data.bearbeiterId },
        select: { vorname: true, nachname: true, telefon: true, whatsapp: true },
      })
      if (ma) previewBearbeiter = { vorname: ma.vorname, nachname: ma.nachname, telefon: ma.telefon ?? null, whatsapp: ma.whatsapp ?? null }
    } else if (anfrage.bearbeiter) {
      previewBearbeiter = anfrage.bearbeiter
    }

    const bearbeiterName = previewBearbeiter
      ? `${previewBearbeiter.vorname} ${previewBearbeiter.nachname}`
      : null

    const adresse = data.adresse ?? anfrage.abholadresse ?? `${settings.strasse}, ${settings.plz_firma} ${settings.ort}`
    const adresseZusatz = data.adresseZusatz !== undefined ? data.adresseZusatz : (anfrage.abholAdresseZusatz ?? null)

    let subject = ''
    let html = ''

    switch (data.typ) {
      case 'angebot': {
        const preis = data.angebotspreis ?? anfrage.angebotspreis ?? 0
        const r = templates.angebotEmail({
          vorname: anfrage.vorname,
          marke: anfrage.marke,
          modell: anfrage.modell,
          kilometerstand: anfrage.kilometerstand,
          angebotspreis: preis,
          angebotNachricht: data.angebotNachricht !== undefined ? data.angebotNachricht : (anfrage.angebotNachricht ?? null),
          firmaEmail: settings.email,
          telefon: settings.telefon,
          whatsapp: settings.whatsapp,
          bearbeiterName,
        })
        subject = r.subject; html = r.html; break
      }
      case 'termin_bestaetigung': {
        const termin = data.termin ? new Date(data.termin) : anfrage.terminVorschlag1 ?? new Date()
        const r = templates.terminBestaetigung({
          vorname: anfrage.vorname,
          marke: anfrage.marke,
          modell: anfrage.modell,
          termin,
          adresse,
          adresseZusatz,
          telefon: settings.telefon,
          bearbeiter: previewBearbeiter,
        })
        subject = r.subject; html = r.html; break
      }
      case 'termin_verschoben': {
        const alterTermin = data.alterTermin ? new Date(data.alterTermin) : anfrage.terminVorschlag1 ?? new Date()
        const neuerTermin = data.termin ? new Date(data.termin) : new Date()
        const r = templates.terminVerschoben({
          vorname: anfrage.vorname,
          marke: anfrage.marke,
          modell: anfrage.modell,
          alterTermin,
          neuerTermin,
          adresse,
          adresseZusatz,
          telefon: settings.telefon,
          bearbeiter: previewBearbeiter,
        })
        subject = r.subject; html = r.html; break
      }
      case 'termin_abgesagt': {
        const alterTermin = data.alterTermin ? new Date(data.alterTermin) : anfrage.terminVorschlag1 ?? new Date()
        const r = templates.terminAbgesagt({
          vorname: anfrage.vorname,
          marke: anfrage.marke,
          modell: anfrage.modell,
          alterTermin,
          telefon: settings.telefon,
          whatsapp: settings.whatsapp,
          ersatztermin1: data.ersatztermin1 ? new Date(data.ersatztermin1) : null,
          ersatztermin2: data.ersatztermin2 ? new Date(data.ersatztermin2) : null,
          kommentar: data.kommentar ?? null,
        })
        subject = r.subject; html = r.html; break
      }
      case 'termin_kunde_abgesagt': {
        const alterTermin = data.alterTermin ? new Date(data.alterTermin) : anfrage.terminVorschlag1 ?? new Date()
        const r = templates.terminKundeAbgesagt({
          vorname: anfrage.vorname,
          marke: anfrage.marke,
          modell: anfrage.modell,
          alterTermin,
          telefon: settings.telefon,
          whatsapp: settings.whatsapp,
          kommentar: data.kommentar ?? null,
        })
        subject = r.subject; html = r.html; break
      }
      case 'ablehnung': {
        const r = templates.ablehnungKunde({
          vorname: anfrage.vorname,
          marke: anfrage.marke,
          modell: anfrage.modell,
          grund: data.text,
          telefon: settings.telefon,
          whatsapp: settings.whatsapp,
          bearbeiterName,
        })
        subject = r.subject; html = r.html; break
      }
      case 'rueckfrage': {
        const r = templates.rueckfrageKunde({
          vorname: anfrage.vorname,
          marke: anfrage.marke,
          modell: anfrage.modell,
          frage: data.text ?? '',
          telefon: settings.telefon,
          whatsapp: settings.whatsapp,
          bearbeiterName,
        })
        subject = r.subject; html = r.html; break
      }
      case 'freinachricht': {
        const r = templates.freieNachrichtKunde({
          vorname: anfrage.vorname,
          marke: anfrage.marke,
          modell: anfrage.modell,
          nachricht: data.text ?? '',
          telefon: settings.telefon,
          bearbeiterName,
        })
        subject = r.subject; html = r.html; break
      }
      case 'bearbeiter_geaendert': {
        if (!previewBearbeiter) {
          return NextResponse.json({ error: 'Kein Bearbeiter ausgewählt' }, { status: 400 })
        }
        const r = templates.bearbeiterGeaendert({
          vorname: anfrage.vorname,
          marke: anfrage.marke,
          modell: anfrage.modell,
          bearbeiterVorname: previewBearbeiter.vorname,
          bearbeiterNachname: previewBearbeiter.nachname,
          bearbeiterTelefon: previewBearbeiter.telefon,
          bearbeiterWhatsapp: previewBearbeiter.whatsapp,
        })
        subject = r.subject; html = r.html; break
      }
    }

    return NextResponse.json({ subject, html })
  } catch (err) {
    if (err instanceof Error && err.constructor.name === 'ZodError') {
      return NextResponse.json({ error: 'Ungültige Parameter' }, { status: 400 })
    }
    console.error('[mail-preview]', err)
    return NextResponse.json({ error: 'Fehler beim Generieren der Vorschau' }, { status: 500 })
  }
}
