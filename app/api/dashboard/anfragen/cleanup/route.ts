import { NextResponse } from 'next/server'

export async function POST() {
  try {
    const { prisma } = await import('@/lib/prisma')

    const rows = await prisma.einstellung.findMany()
    const settings: Record<string, string> = {}
    rows.forEach((r: { id: string; wert: string }) => { settings[r.id] = r.wert })

    if (settings['auto_loeschen_aktiv'] !== 'true') {
      return NextResponse.json({ ok: true, geloescht: 0, info: 'Auto-Löschen deaktiviert' })
    }

    const monate = parseInt(settings['auto_loeschen_monate'] ?? '24', 10)
    const grenze = new Date()
    grenze.setMonth(grenze.getMonth() - monate)

    const result = await prisma.anfrage.deleteMany({
      where: {
        archiviert: true,
        updatedAt: { lt: grenze },
      },
    })

    return NextResponse.json({ ok: true, geloescht: result.count, grenze: grenze.toISOString() })
  } catch (err) {
    console.error('[cleanup]', err)
    return NextResponse.json({ error: 'Fehler beim Bereinigen' }, { status: 500 })
  }
}
