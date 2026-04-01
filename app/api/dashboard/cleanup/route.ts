import { NextRequest, NextResponse } from 'next/server'
import { cookies } from 'next/headers'
import { verifySessionToken } from '@/lib/auth'

/**
 * Datenschutz-Löschkonzept gemäß DSGVO + § 147 AO
 *
 * Phase 1 – Leads (24 Monate):
 *   Anfragen ohne Kaufabschluss (alle Status außer "abgeschlossen") werden
 *   vollständig gelöscht inkl. Fotos, Logs und Anhängen.
 *
 * Phase 2 – Vertragsdaten (10 Jahre):
 *   Abgeschlossene Käufe werden anonymisiert (§ 147 AO – steuerliche
 *   Aufbewahrungspflicht). Personenbezogene Daten werden entfernt,
 *   kaufrelevante Daten (Preise, Datum, Fahrzeug) bleiben erhalten.
 *
 * Phase 3 – Newsletter (36 Monate):
 *   Abonnenten ohne jede Aktivität seit 36 Monaten werden gelöscht.
 */

export async function GET(request: NextRequest) {
  const cookieStore = await cookies()
  const token = cookieStore.get('aab_session')?.value
  if (!token || !(await verifySessionToken(token))) {
    return NextResponse.json({ error: 'Nicht autorisiert' }, { status: 401 })
  }

  const { prisma } = await import('@/lib/prisma')
  const jetzt = new Date()
  const cutoff24Monate = new Date(jetzt)
  cutoff24Monate.setMonth(cutoff24Monate.getMonth() - 24)
  const cutoff10Jahre = new Date(jetzt)
  cutoff10Jahre.setFullYear(cutoff10Jahre.getFullYear() - 10)

  const [zuLoeschendeLeads, zuAnonymisierendeKaeufe] = await Promise.all([
    prisma.anfrage.findMany({ where: { createdAt: { lt: cutoff24Monate }, status: { notIn: ['abgeschlossen'] } }, select: { id: true } }),
    prisma.anfrage.findMany({ where: { createdAt: { lt: cutoff10Jahre }, status: 'abgeschlossen' }, select: { id: true } }),
  ])

  return NextResponse.json({
    dryRun: true,
    leadsZuLoeschen: zuLoeschendeLeads.length,
    kaeufeZuAnonymisieren: zuAnonymisierendeKaeufe.length,
  })
}

export async function POST(request: NextRequest) {
  const cookieStore = await cookies()
  const token = cookieStore.get('aab_session')?.value
  if (!token || !(await verifySessionToken(token))) {
    return NextResponse.json({ error: 'Nicht autorisiert' }, { status: 401 })
  }

  const { searchParams } = request.nextUrl
  const dryRun = searchParams.get('dry') === 'true'

  const { prisma } = await import('@/lib/prisma')

  const jetzt = new Date()

  // Cutoff-Daten berechnen
  const cutoff24Monate = new Date(jetzt)
  cutoff24Monate.setMonth(cutoff24Monate.getMonth() - 24)

  const cutoff10Jahre = new Date(jetzt)
  cutoff10Jahre.setFullYear(cutoff10Jahre.getFullYear() - 10)

  // ── Phase 1: Leads älter als 24 Monate löschen ──────────────────────────────
  const zuLoeschendeLeads = await prisma.anfrage.findMany({
    where: {
      createdAt: { lt: cutoff24Monate },
      status: { notIn: ['abgeschlossen'] },
    },
    select: { id: true },
  })

  // ── Phase 2: Abgeschlossene Käufe älter als 10 Jahre anonymisieren ───────────
  const zuAnonymisierendeKaeufe = await prisma.anfrage.findMany({
    where: {
      createdAt: { lt: cutoff10Jahre },
      status: 'abgeschlossen',
    },
    select: { id: true },
  })

  const counts = {
    leadsZuLoeschen: zuLoeschendeLeads.length,
    kaeufeZuAnonymisieren: zuAnonymisierendeKaeufe.length,
  }

  if (dryRun) {
    return NextResponse.json({ dryRun: true, ...counts })
  }

  // ── Ausführung ───────────────────────────────────────────────────────────────
  const leadIds = zuLoeschendeLeads.map((a: { id: string }) => a.id)
  const kaufIds = zuAnonymisierendeKaeufe.map((a: { id: string }) => a.id)

  // Phase 1: Leads vollständig löschen (Cascade löscht Logs)
  if (leadIds.length > 0) {
    await prisma.anfrage.deleteMany({ where: { id: { in: leadIds } } })
  }

  // Phase 2: Personendaten anonymisieren, steuerliche Daten behalten
  if (kaufIds.length > 0) {
    await prisma.anfrage.updateMany({
      where: { id: { in: kaufIds } },
      data: {
        vorname: '[anonymisiert]',
        nachname: '[anonymisiert]',
        email: '[anonymisiert]',
        telefon: null,
        plz: '00000',
        notizen: null,
        abholadresse: null,
        abholAdresseZusatz: null,
        fotos: '[]',
        // Kaufrelevante Daten bleiben: abschlussPreis, createdAt, marke, modell,
        // kilometerstand, erstzulassungJahr – für § 147 AO erforderlich
      },
    })
  }

  return NextResponse.json({
    dryRun: false,
    leadsGeloescht: leadIds.length,
    kaeufeAnonymisiert: kaufIds.length,
    durchgefuehrtAm: jetzt.toISOString(),
  })
}
