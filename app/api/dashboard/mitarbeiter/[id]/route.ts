import { NextRequest, NextResponse } from 'next/server'
import { z } from 'zod'
import { hashPassword } from '@/lib/password'

const updateSchema = z.object({
  vorname:    z.string().min(1).optional(),
  nachname:   z.string().min(1).optional(),
  email:      z.string().email().optional(),
  kuerzel:    z.string().max(3).nullable().optional(),
  telefon:    z.string().nullable().optional(),
  whatsapp:   z.string().nullable().optional(),
  waApiKey:   z.string().nullable().optional(),
  farbe:      z.string().optional(),
  istDefault:            z.boolean().optional(),
  aktiv:                 z.boolean().optional(),
  passwort:              z.string().min(6).optional(),
  benachrichtigungKanal: z.enum(['beide', 'whatsapp', 'email']).optional(),
})

export async function PATCH(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params
    const body = await request.json()
    const data = updateSchema.parse(body)
    const { prisma } = await import('@/lib/prisma')

    if (data.istDefault) {
      await prisma.mitarbeiter.updateMany({ data: { istDefault: false } })
    }

    const updateData: Record<string, unknown> = {}
    if (data.vorname    !== undefined) updateData.vorname    = data.vorname
    if (data.nachname   !== undefined) updateData.nachname   = data.nachname
    if (data.email      !== undefined) updateData.email      = data.email?.toLowerCase().trim()
    if (data.kuerzel    !== undefined) updateData.kuerzel    = data.kuerzel
    if (data.telefon    !== undefined) updateData.telefon    = data.telefon
    if (data.whatsapp   !== undefined) updateData.whatsapp   = data.whatsapp
    if (data.waApiKey   !== undefined) updateData.waApiKey   = data.waApiKey
    if (data.farbe      !== undefined) updateData.farbe      = data.farbe
    if (data.istDefault !== undefined) updateData.istDefault = data.istDefault
    if (data.aktiv                 !== undefined) updateData.aktiv                 = data.aktiv
    if (data.benachrichtigungKanal !== undefined) updateData.benachrichtigungKanal = data.benachrichtigungKanal
    if (data.passwort) updateData.passwortHash = await hashPassword(data.passwort)

    const updated = await prisma.mitarbeiter.update({ where: { id }, data: updateData })
    return NextResponse.json(updated)
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json({ error: 'Ungültige Daten' }, { status: 400 })
    }
    return NextResponse.json({ error: 'Datenbankfehler' }, { status: 500 })
  }
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params
    const { prisma } = await import('@/lib/prisma')

    // Prüfen ob offene Vorgänge vorhanden (Bearbeiter ODER Termin-Zuständiger)
    const [offeneBearbeiter, offeneTermin] = await Promise.all([
      prisma.anfrage.count({ where: { bearbeiterId: id, archiviert: false } }),
      prisma.anfrage.count({ where: { terminZustaendigId: id, archiviert: false } }),
    ])
    const offeneAnfragen = offeneBearbeiter + offeneTermin

    // nachfolgerId aus Query-Param
    const { searchParams } = request.nextUrl
    const nachfolgerId = searchParams.get('nachfolgerId')

    if (offeneAnfragen > 0 && !nachfolgerId) {
      return NextResponse.json(
        { error: 'transfer_required', offeneAnfragen, offeneBearbeiter, offeneTermin },
        { status: 409 }
      )
    }

    if (nachfolgerId) {
      // bearbeiterId und terminZustaendigId unabhängig übertragen
      await Promise.all([
        prisma.anfrage.updateMany({
          where: { bearbeiterId: id },
          data: { bearbeiterId: nachfolgerId },
        }),
        prisma.anfrage.updateMany({
          where: { terminZustaendigId: id },
          data: { terminZustaendigId: nachfolgerId },
        }),
      ])

      // Nachfolger per WhatsApp über Übernahme informieren
      if (offeneAnfragen > 0) {
        try {
          const { notifyMitarbeiter } = await import('@/lib/notify')
          const nachfolger = await prisma.mitarbeiter.findUnique({
            where: { id: nachfolgerId },
            select: { vorname: true, nachname: true, telefon: true, whatsapp: true, waApiKey: true, benachrichtigungKanal: true },
          })
          const altMa = await prisma.mitarbeiter.findUnique({
            where: { id },
            select: { vorname: true, nachname: true },
          })
          if (nachfolger) {
            const teile: string[] = [`👤 Vorgänge übernommen von ${altMa?.vorname ?? ''} ${altMa?.nachname ?? ''}`.trim()]
            if (offeneBearbeiter > 0) teile.push(`📋 ${offeneBearbeiter} Anfrage${offeneBearbeiter !== 1 ? 'n' : ''} als Bearbeiter`)
            if (offeneTermin > 0) teile.push(`📅 ${offeneTermin} Termin${offeneTermin !== 1 ? 'e' : ''} als Termin-Zuständiger`)
            await notifyMitarbeiter(nachfolger, teile.join('\n'), '[AAB] Vorgänge übernommen', {})
          }
        } catch { /* Benachrichtigung ist optional */ }
      }
    }

    // permanent=true → endgültig löschen (nur wenn bereits inaktiv)
    const permanent = searchParams.get('permanent') === 'true'
    if (permanent) {
      const ma = await prisma.mitarbeiter.findUnique({ where: { id }, select: { aktiv: true } })
      if (ma?.aktiv) return NextResponse.json({ error: 'Nur inaktive Mitarbeiter können gelöscht werden' }, { status: 400 })
      await prisma.mitarbeiter.delete({ where: { id } })
      return NextResponse.json({ ok: true })
    }

    // Mitarbeiter deaktivieren statt löschen → Verlauf bleibt erhalten
    await prisma.mitarbeiter.update({
      where: { id },
      data: { aktiv: false },
    })

    return NextResponse.json({ ok: true })
  } catch {
    return NextResponse.json({ error: 'Fehler beim Deaktivieren' }, { status: 500 })
  }
}
