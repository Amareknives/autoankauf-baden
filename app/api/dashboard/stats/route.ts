import { NextResponse } from 'next/server'

export async function GET() {
  try {
    const { prisma } = await import('@/lib/prisma')

    const now = new Date()
    const heuteStart = new Date(now.getFullYear(), now.getMonth(), now.getDate())
    const wocheStart = new Date(now)
    wocheStart.setDate(now.getDate() - 7)
    const letzteWocheStart = new Date(now)
    letzteWocheStart.setDate(now.getDate() - 14)
    const vor14Tagen = new Date(heuteStart)
    vor14Tagen.setDate(heuteStart.getDate() - 14)

    // Montag dieser Woche berechnen
    const wochentag = heuteStart.getDay() // 0=So, 1=Mo, ...
    const montag = new Date(heuteStart)
    montag.setDate(heuteStart.getDate() - (wochentag === 0 ? 6 : wochentag - 1))
    const naechsterMontag = new Date(montag)
    naechsterMontag.setDate(montag.getDate() + 7)
    const uebernachsterMontag = new Date(montag)
    uebernachsterMontag.setDate(montag.getDate() + 14)

    const [neueHeute, dieseWoche, letzteWoche, offeneAngebote, termineWoche, termineNaechsteWoche, haendlerAnfragen14Tage, archiviert] = await Promise.all([
      prisma.anfrage.count({ where: { createdAt: { gte: heuteStart } } }),
      prisma.anfrage.count({ where: { createdAt: { gte: wocheStart } } }),
      prisma.anfrage.count({ where: { createdAt: { gte: letzteWocheStart, lt: wocheStart } } }),
      prisma.anfrage.count({ where: { status: { in: ['neu', 'kontaktiert', 'angebot_gesendet'] }, archiviert: false } }),
      prisma.anfrage.count({ where: { status: 'termin_vereinbart', terminVorschlag1: { gte: montag, lt: naechsterMontag } } }),
      prisma.anfrage.count({ where: { status: 'termin_vereinbart', terminVorschlag1: { gte: naechsterMontag, lt: uebernachsterMontag } } }),
      prisma.haendlerAnfrage.count({ where: { createdAt: { gte: vor14Tagen } } }),
      prisma.anfrage.count({ where: { archiviert: true } }),
    ])

    const wocheTrend = letzteWoche > 0
      ? Math.round(((dieseWoche - letzteWoche) / letzteWoche) * 100)
      : 0

    return NextResponse.json({
      neueHeuteCount: neueHeute,
      wocheCount: dieseWoche,
      wocheTrend,
      offeneAngebotsCount: offeneAngebote,
      termineWocheCount: termineWoche,
      termineNaechsteWocheCount: termineNaechsteWoche,
      haendlerAnfragen14TageCount: haendlerAnfragen14Tage,
      archivCount: archiviert,
    })
  } catch {
    return NextResponse.json({
      neueHeuteCount: 0,
      wocheCount: 0,
      wocheTrend: 0,
      offeneAngebotsCount: 0,
      termineWocheCount: 0,
      termineNaechsteWocheCount: 0,
      haendlerAnfragen14TageCount: 0,
      archivCount: 0,
    })
  }
}
