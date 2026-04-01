import { NextResponse } from 'next/server'

type MailTyp = 'kunde' | 'angebot' | 'intern' | 'followup' | 'termin' | 'termin_verschoben' | 'termin_abgesagt' | 'haendler'

export async function POST(request: Request) {
  try {
    const body = await request.json().catch(() => ({})) as { adressen?: string; typ?: MailTyp }

    const { prisma } = await import('@/lib/prisma')
    const rows = await prisma.einstellung.findMany()
    const settings: Record<string, string> = {}
    rows.forEach((r: { id: string; wert: string }) => { settings[r.id] = r.wert })

    const { sendEmail } = await import('@/lib/email')
    const {
      eingangsbestaetigung,
      neueAnfrageIntern,
      angebotEmail,
      terminBestaetigung,
      terminVerschoben,
      terminAbgesagt,
      followupEmail,
      haendlerBestaetigung,
    } = await import('@/services/emailTemplates')

    const firmaEmail = settings['email'] || process.env.NEXT_PUBLIC_FIRMA_EMAIL || 'anfrage@autoankauf-baden.de'

    // Zieladressen: aus Eingabefeld (kommagetrennt) oder Fallback auf Firma-Mail
    const empfaenger: string[] = body.adressen
      ? body.adressen.split(',').map((e: string) => e.trim()).filter(Boolean)
      : [firmaEmail]

    // Test-Daten
    const testVorname = 'Max'
    const testNachname = 'Mustermann'
    const testMarke = 'BMW'
    const testModell = '320d'
    const testKm = 87500
    const testJahr = 2019
    const testPlz = '76131'
    const testTelefon = '+49 176 64179764'
    const testAnfrageId = 'test-preview-123'
    const testPreis = 12500
    const testTermin = new Date(Date.now() + 2 * 24 * 60 * 60 * 1000).toISOString()

    // Nur die ausgewählte Vorlage senden
    const typ: MailTyp = body.typ ?? 'kunde'

    let mail: { subject: string; html: string }

    switch (typ) {
      case 'kunde':
        mail = eingangsbestaetigung({
          vorname: testVorname,
          marke: testMarke,
          modell: testModell,
          kilometerstand: testKm,
          erstzulassungJahr: testJahr,
          customBetreff: settings['email_kunde_betreff'],
          customInhalt: settings['email_kunde_inhalt'],
        })
        break
      case 'intern':
        mail = neueAnfrageIntern({
          vorname: testVorname,
          nachname: testNachname,
          marke: testMarke,
          modell: testModell,
          kilometerstand: testKm,
          plz: testPlz,
          telefon: testTelefon,
          anfrageId: testAnfrageId,
        })
        break
      case 'angebot':
        mail = angebotEmail({
          vorname: testVorname,
          marke: testMarke,
          modell: testModell,
          kilometerstand: testKm,
          angebotspreis: testPreis,
          angebotNachricht: 'Das Fahrzeug ist in einem sehr guten Zustand.',
          firmaEmail: firmaEmail,
          telefon: settings['telefon'] || '',
          whatsapp: settings['whatsapp'] || '',
        })
        break
      case 'termin':
        mail = terminBestaetigung({
          vorname: testVorname,
          marke: testMarke,
          modell: testModell,
          termin: testTermin,
          adresse: 'Heidelberger Str. 4, 76676 Graben-Neudorf',
          telefon: settings['telefon'] || '',
        })
        break
      case 'termin_verschoben':
        mail = terminVerschoben({
          vorname: testVorname,
          marke: testMarke,
          modell: testModell,
          alterTermin: testTermin,
          neuerTermin: new Date(Date.now() + 3 * 24 * 60 * 60 * 1000).toISOString(),
          telefon: settings['telefon'] || '',
        })
        break
      case 'termin_abgesagt':
        mail = terminAbgesagt({
          vorname: testVorname,
          marke: testMarke,
          modell: testModell,
          alterTermin: testTermin,
          kommentar: 'Leider müssen wir den Termin kurzfristig absagen.',
          ersatztermin1: new Date(Date.now() + 4 * 24 * 60 * 60 * 1000).toISOString(),
          telefon: settings['telefon'] || '',
          whatsapp: settings['whatsapp'] || '',
        })
        break
      case 'followup':
        mail = followupEmail({
          vorname: testVorname,
          marke: testMarke,
          modell: testModell,
          anfrageId: testAnfrageId,
          telefon: settings['telefon'] || '',
          whatsapp: settings['whatsapp'] || '',
        })
        break
      case 'haendler':
        mail = haendlerBestaetigung({
          vorname: testVorname,
          nachname: testNachname,
          firma: 'Mustermann Automobile GmbH',
          fahrzeugAnzahl: '2–3 Fahrzeuge',
          nachricht: 'Wir haben regelmäßig Leasingrückläufer.',
        })
        break
      default:
        return NextResponse.json({ error: 'Unbekannter Typ' }, { status: 400 })
    }

    for (const to of empfaenger) {
      await sendEmail({ to, subject: `[TEST] ${mail.subject}`, html: mail.html, _typ: 'test' })
    }

    return NextResponse.json({ ok: true, sentTo: empfaenger, typ })
  } catch (err) {
    console.error('[test-email]', err)
    return NextResponse.json({ error: 'Fehler beim Senden', detail: err instanceof Error ? err.message : String(err) }, { status: 500 })
  }
}
