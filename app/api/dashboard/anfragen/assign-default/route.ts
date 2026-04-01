import { NextRequest, NextResponse } from 'next/server'
import { cookies } from 'next/headers'
import { verifySessionToken } from '@/lib/auth'

export async function POST(request: NextRequest) {
  const cookieStore = await cookies()
  const token = cookieStore.get('aab_session')?.value
  if (!token || !(await verifySessionToken(token))) {
    return NextResponse.json({ error: 'Nicht autorisiert' }, { status: 401 })
  }

  let bearbeiterId: string | null = null

  // Erst aus Body lesen (direkt übergeben)
  try {
    const body = await request.json() as { bearbeiterId?: string }
    if (body.bearbeiterId) bearbeiterId = body.bearbeiterId
  } catch { /* kein Body */ }

  // Fallback: aus Settings laden
  if (!bearbeiterId) {
    const { getSiteSettings } = await import('@/lib/siteSettings')
    const settings = await getSiteSettings()
    if (settings.defaultBearbeiterId) bearbeiterId = settings.defaultBearbeiterId
  }

  if (!bearbeiterId) {
    return NextResponse.json({ error: 'Kein Standard-Bearbeiter gesetzt' }, { status: 400 })
  }

  const { prisma } = await import('@/lib/prisma')

  // Mitarbeiter validieren
  const ma = await prisma.mitarbeiter.findUnique({ where: { id: bearbeiterId }, select: { id: true, aktiv: true } })
  if (!ma || !ma.aktiv) {
    return NextResponse.json({ error: 'Mitarbeiter nicht gefunden oder inaktiv' }, { status: 400 })
  }

  const result = await prisma.anfrage.updateMany({
    where: { bearbeiterId: null, archiviert: false },
    data: { bearbeiterId },
  })

  return NextResponse.json({ aktualisiert: result.count })
}
