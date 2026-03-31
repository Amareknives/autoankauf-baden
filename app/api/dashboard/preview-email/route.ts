import { NextRequest, NextResponse } from 'next/server'
import { z } from 'zod'

const schema = z.object({
  typ: z.enum(['kunde', 'angebot', 'intern', 'followup', 'termin', 'termin_verschoben', 'termin_abgesagt', 'haendler', 'ablehnung', 'rueckfrage', 'freinachricht']),
  customBetreff: z.string().optional(),
  customInhalt: z.string().optional(),
})

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { typ, customBetreff, customInhalt } = schema.parse(body)

    const templates = await import('@/services/emailTemplates')

    const TEST = {
      vorname: 'Max',
      nachname: 'Mustermann',
      marke: 'BMW',
      modell: '320d',
      kilometerstand: 87500,
      erstzulassungJahr: 2019,
      plz: '76131',
      telefon: '+49 176 64179764',
      whatsapp: '4917664179764',
      firmaEmail: 'anfrage@autoankauf-baden.de',
      anfrageId: 'preview-123',
      angebotspreis: 4800,
      termin: new Date(Date.now() + 3 * 24 * 60 * 60 * 1000), // in 3 Tagen
      adresse: 'Heidelberger Str. 4, 76676 Graben-Neudorf',
    }

    let subject = ''
    let html = ''

    switch (typ) {
      case 'kunde': {
        const r = templates.eingangsbestaetigung({ ...TEST, customBetreff, customInhalt })
        subject = r.subject; html = r.html; break
      }
      case 'angebot': {
        const r = templates.angebotEmail({ ...TEST, angebotNachricht: null })
        subject = r.subject; html = r.html; break
      }
      case 'intern': {
        const r = templates.neueAnfrageIntern(TEST)
        subject = r.subject; html = r.html; break
      }
      case 'followup': {
        const r = templates.followupEmail({ ...TEST, customBetreff, customInhalt })
        subject = r.subject; html = r.html; break
      }
      case 'termin': {
        const r = templates.terminBestaetigung({ ...TEST, termin: TEST.termin })
        subject = r.subject; html = r.html; break
      }
      case 'termin_verschoben': {
        const r = templates.terminVerschoben({
          ...TEST,
          alterTermin: new Date(Date.now() + 2 * 24 * 60 * 60 * 1000),
          neuerTermin: new Date(Date.now() + 4 * 24 * 60 * 60 * 1000),
        })
        subject = r.subject; html = r.html; break
      }
      case 'termin_abgesagt': {
        const r = templates.terminAbgesagt({ ...TEST, alterTermin: new Date(Date.now() + 2 * 24 * 60 * 60 * 1000) })
        subject = r.subject; html = r.html; break
      }
      case 'haendler': {
        const r = templates.haendlerBestaetigung({
          vorname: 'Max',
          nachname: 'Mustermann',
          firma: 'Mustermann Automobile GmbH',
          fahrzeugAnzahl: '2–3 Fahrzeuge',
          nachricht: 'Wir haben regelmäßig Leasingrückläufer und Inzahlungnahmen.',
        })
        subject = r.subject; html = r.html; break
      }
      case 'ablehnung': {
        const r = templates.ablehnungKunde({
          ...TEST,
          grund: 'Leider entspricht dein Fahrzeug nicht unseren aktuellen Ankaufskriterien.',
        })
        subject = r.subject; html = r.html; break
      }
      case 'rueckfrage': {
        const r = templates.rueckfrageKunde({
          ...TEST,
          frage: 'Könntest du uns noch Fotos vom Fahrzeug zusenden – besonders von Schäden oder Besonderheiten?',
        })
        subject = r.subject; html = r.html; break
      }
      case 'freinachricht': {
        const r = templates.freieNachrichtKunde({
          ...TEST,
          nachricht: 'Vielen Dank für deine Anfrage! Wir möchten noch kurz Rücksprache halten und melden uns in Kürze persönlich bei dir.',
        })
        subject = r.subject; html = r.html; break
      }
    }

    return NextResponse.json({ subject, html })
  } catch (err) {
    if (err instanceof z.ZodError) {
      return NextResponse.json({ error: 'Ungültige Parameter' }, { status: 400 })
    }
    console.error('[preview-email]', err)
    return NextResponse.json({ error: 'Fehler beim Generieren' }, { status: 500 })
  }
}
