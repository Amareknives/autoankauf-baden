import { NextResponse } from 'next/server'

/**
 * POST /api/cron/followup
 * Kann manuell aus dem Dashboard oder per Cron-Job aufgerufen werden.
 * Geschützt durch CRON_SECRET Header.
 *
 * Was passiert:
 * 1. Findet Anfragen mit Status angebot_gesendet, Angebot älter als followup_tage Tage,
 *    noch keine zweite Mail gesendet → sendet Follow-up E-Mail
 * 2. Findet Anfragen wo zweiteMailGesendetAm älter als archiv_tage Tage → archiviert sie
 */
export async function POST(request: Request) {
  // Einfacher Schutz: CRON_SECRET Header oder Dashboard-Session
  const secret = request.headers.get('x-cron-secret')
  const expectedSecret = process.env.CRON_SECRET
  if (expectedSecret && secret !== expectedSecret) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  try {
    const { prisma } = await import('@/lib/prisma')

    // Settings laden
    const rows = await prisma.einstellung.findMany()
    const settings: Record<string, string> = {}
    rows.forEach(r => { settings[r.id] = r.wert })

    const followupAktiv = settings['followup_aktiv'] !== 'false'
    const followupTage = parseInt(settings['followup_tage'] || '5', 10)
    const archivTage = parseInt(settings['archiv_tage'] || '30', 10)

    const jetzt = new Date()
    let followupGesendet = 0
    let archiviert = 0

    // ── 1. Follow-up E-Mails senden ──────────────────────────────────────────
    if (followupAktiv) {
      const followupAb = new Date(jetzt.getTime() - followupTage * 24 * 60 * 60 * 1000)

      const kandidaten = await prisma.anfrage.findMany({
        where: {
          status: 'angebot_gesendet',
          angebotGesendetAm: { lte: followupAb },
          zweiteMailGesendetAm: null,
          archiviert: false,
        },
        select: {
          id: true,
          vorname: true,
          nachname: true,
          marke: true,
          modell: true,
          email: true,
        },
      })

      for (const a of kandidaten) {
        try {
          const { sendEmail } = await import('@/lib/email')
          const { followupEmail } = await import('@/services/emailTemplates')
          const mail = followupEmail({
            vorname: a.vorname,
            marke: a.marke,
            modell: a.modell,
            anfrageId: a.id,
            telefon: settings['telefon'],
            whatsapp: settings['whatsapp'],
            customBetreff: settings['email_followup_betreff'],
            customInhalt: settings['email_followup_inhalt'],
          })
          await sendEmail({ to: a.email, ...mail })

          await prisma.anfrage.update({
            where: { id: a.id },
            data: { zweiteMailGesendetAm: jetzt },
          })
          await prisma.aktivitaetsLog.create({
            data: { anfrageId: a.id, aktion: 'followup_mail_gesendet', details: `Follow-up nach ${followupTage} Tagen` },
          })
          followupGesendet++
        } catch {
          // Einzelfehler nicht stoppen
        }
      }
    }

    // ── 2. Auto-Archivieren ───────────────────────────────────────────────────
    const archivAb = new Date(jetzt.getTime() - archivTage * 24 * 60 * 60 * 1000)

    const zuArchivieren = await prisma.anfrage.findMany({
      where: {
        zweiteMailGesendetAm: { lte: archivAb },
        archiviert: false,
        status: { in: ['angebot_gesendet', 'kontaktiert', 'neu'] },
      },
      select: { id: true },
    })

    for (const a of zuArchivieren) {
      await prisma.anfrage.update({
        where: { id: a.id },
        data: { archiviert: true },
      })
      await prisma.aktivitaetsLog.create({
        data: { anfrageId: a.id, aktion: 'archiviert', details: `Automatisch nach ${archivTage} Tagen archiviert` },
      })
      archiviert++
    }

    return NextResponse.json({
      ok: true,
      followupGesendet,
      archiviert,
      timestamp: jetzt.toISOString(),
    })
  } catch (err) {
    console.error('[cron/followup]', err)
    return NextResponse.json({ error: 'Fehler' }, { status: 500 })
  }
}
