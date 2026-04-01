import { NextResponse } from 'next/server'
import { cookies } from 'next/headers'
import { verifySessionToken } from '@/lib/auth'

export async function POST() {
  const cookieStore = await cookies()
  const token = cookieStore.get('aab_session')?.value
  if (!token || !(await verifySessionToken(token))) {
    return NextResponse.json({ error: 'Nicht autorisiert' }, { status: 401 })
  }

  const { prisma } = await import('@/lib/prisma')
  const { getSiteSettings } = await import('@/lib/siteSettings')
  const settings = await getSiteSettings()

  if (!settings.defaultBearbeiterId) {
    return NextResponse.json({ error: 'Kein Standard-Bearbeiter gesetzt' }, { status: 400 })
  }

  // Nur nicht-archivierte Anfragen ohne Zuweisung
  const result = await prisma.anfrage.updateMany({
    where: { bearbeiterId: null, archiviert: false },
    data: { bearbeiterId: settings.defaultBearbeiterId },
  })

  return NextResponse.json({ aktualisiert: result.count })
}
