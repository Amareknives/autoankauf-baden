import { NextRequest, NextResponse } from 'next/server'
import { z } from 'zod'
import { cookies } from 'next/headers'
import { verifySessionToken } from '@/lib/auth'

const schema = z.object({
  modus: z.enum(['ablehnung', 'rueckfrage', 'freinachricht']),
  text: z.string().min(1).max(2000),
  vorgangSchliessen: z.boolean().optional().default(false),
})

async function getMitarbeiterId(): Promise<string | null> {
  try {
    const cookieStore = await cookies()
    const token = cookieStore.get('aab_session')?.value
    if (!token) return null
    return await verifySessionToken(token)
  } catch {
    return null
  }
}

export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params
    const body = await request.json()
    const data = schema.parse(body)

    const { prisma } = await import('@/lib/prisma')
    const mitarbeiterId = await getMitarbeiterId()

    const anfrage = await prisma.anfrage.findUnique({
      where: { id },
      select: {
        vorname: true,
        nachname: true,
        email: true,
        marke: true,
        modell: true,
        status: true,
        bearbeiter: { select: { vorname: true, nachname: true } },
      },
    })

    if (!anfrage) {
      return NextResponse.json({ error: 'Nicht gefunden' }, { status: 404 })
    }

    // Signatur: Bearbeiter des Falls hat Vorrang, Fallback auf eingeloggten User
    let bearbeiterName: string | null = null
    if (anfrage.bearbeiter) {
      bearbeiterName = `${anfrage.bearbeiter.vorname} ${anfrage.bearbeiter.nachname}`
    } else if (mitarbeiterId) {
      const ma = await prisma.mitarbeiter.findUnique({ where: { id: mitarbeiterId }, select: { vorname: true, nachname: true } })
      if (ma) bearbeiterName = `${ma.vorname} ${ma.nachname}`
    }

    const { getSiteSettings } = await import('@/lib/siteSettings')
    const settings = await getSiteSettings()

    const { sendEmail } = await import('@/lib/email')

    let mailTyp: string
    let aktionsLog: string

    if (data.modus === 'ablehnung') {
      const { ablehnungKunde } = await import('@/services/emailTemplates')
      const mail = ablehnungKunde({
        vorname: anfrage.vorname,
        marke: anfrage.marke,
        modell: anfrage.modell,
        grund: data.text,
        telefon: settings.telefon,
        whatsapp: settings.whatsapp,
        bearbeiterName,
      })
      await sendEmail({ to: anfrage.email, ...mail, _typ: 'ablehnung', _anfrageId: id })
      mailTyp = 'ablehnung'
      aktionsLog = `Ablehnungs-Mail gesendet: ${data.text.slice(0, 80)}${data.text.length > 80 ? '…' : ''}`

    } else if (data.modus === 'rueckfrage') {
      const { rueckfrageKunde } = await import('@/services/emailTemplates')
      const mail = rueckfrageKunde({
        vorname: anfrage.vorname,
        marke: anfrage.marke,
        modell: anfrage.modell,
        frage: data.text,
        telefon: settings.telefon,
        whatsapp: settings.whatsapp,
        bearbeiterName,
      })
      await sendEmail({ to: anfrage.email, ...mail, _typ: 'rueckfrage', _anfrageId: id })
      mailTyp = 'rueckfrage'
      aktionsLog = `Rückfrage gesendet: ${data.text.slice(0, 80)}${data.text.length > 80 ? '…' : ''}`

    } else {
      const { freieNachrichtKunde } = await import('@/services/emailTemplates')
      const mail = freieNachrichtKunde({
        vorname: anfrage.vorname,
        marke: anfrage.marke,
        modell: anfrage.modell,
        nachricht: data.text,
        telefon: settings.telefon,
        bearbeiterName,
      })
      await sendEmail({ to: anfrage.email, ...mail, _typ: 'freinachricht', _anfrageId: id })
      mailTyp = 'freinachricht'
      aktionsLog = `Freie Nachricht gesendet: ${data.text.slice(0, 80)}${data.text.length > 80 ? '…' : ''}`
    }

    // Status schließen wenn gewünscht (nur bei Ablehnung)
    let neuerStatus: string | null = null
    if (data.vorgangSchliessen && data.modus === 'ablehnung') {
      await prisma.anfrage.update({
        where: { id },
        data: {
          status: 'abgelehnt',
          archiviert: true,
          ablehnungsGrund: data.text,
        },
      })
      neuerStatus = 'abgelehnt'
    }

    // Aktivitätslog
    await prisma.aktivitaetsLog.create({
      data: {
        anfrageId: id,
        mitarbeiterId,
        aktion: mailTyp === 'ablehnung' ? 'ablehnung_mail_gesendet'
          : mailTyp === 'rueckfrage' ? 'rueckfrage_gesendet'
          : 'nachricht_gesendet',
        details: aktionsLog,
      },
    })

    if (neuerStatus) {
      await prisma.aktivitaetsLog.create({
        data: {
          anfrageId: id,
          mitarbeiterId,
          aktion: 'status_geaendert',
          details: `${anfrage.status} → abgelehnt`,
        },
      })
    }

    return NextResponse.json({ ok: true, neuerStatus })
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json({ error: 'Ungültige Daten' }, { status: 400 })
    }
    console.error('[nachricht POST]', error)
    return NextResponse.json({ error: 'Fehler beim Senden' }, { status: 500 })
  }
}
