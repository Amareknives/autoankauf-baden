import { NextResponse } from 'next/server'
import { cookies } from 'next/headers'
import { verifySessionToken } from '@/lib/auth'

export async function GET() {
  try {
    const cookieStore = await cookies()
    const token = cookieStore.get('aab_session')?.value
    if (!token) return NextResponse.json(null)

    const mitarbeiterId = await verifySessionToken(token)
    if (!mitarbeiterId) return NextResponse.json(null)

    const { prisma } = await import('@/lib/prisma')
    const me = await prisma.mitarbeiter.findUnique({
      where: { id: mitarbeiterId },
      select: { id: true, vorname: true, nachname: true, kuerzel: true, farbe: true, aktiv: true },
    })

    return NextResponse.json(me)
  } catch {
    return NextResponse.json(null)
  }
}
