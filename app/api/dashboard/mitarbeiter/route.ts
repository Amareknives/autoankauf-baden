import { NextRequest, NextResponse } from 'next/server'
import { z } from 'zod'
import { hashPassword } from '@/lib/password'

const createSchema = z.object({
  vorname:    z.string().min(1),
  nachname:   z.string().min(1),
  email:      z.string().email(),
  passwort:   z.string().min(6),
  kuerzel:    z.string().max(3).optional(),
  telefon:    z.string().optional(),
  whatsapp:   z.string().optional(),
  waApiKey:   z.string().optional(),
  farbe:      z.string().optional(),
  istDefault: z.boolean().optional(),
})

export async function GET() {
  try {
    const { prisma } = await import('@/lib/prisma')
    const mitarbeiter = await prisma.mitarbeiter.findMany({
      orderBy: [{ istDefault: 'desc' }, { createdAt: 'asc' }],
      select: {
        id: true, vorname: true, nachname: true, email: true,
        kuerzel: true, telefon: true, whatsapp: true, waApiKey: true,
        farbe: true, istDefault: true, aktiv: true,
      },
    })
    return NextResponse.json(mitarbeiter)
  } catch {
    return NextResponse.json({ error: 'Datenbankfehler' }, { status: 500 })
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const data = createSchema.parse(body)
    const { prisma } = await import('@/lib/prisma')

    const count = await prisma.mitarbeiter.count()
    if (count >= 10) {
      return NextResponse.json({ error: 'Maximal 10 Mitarbeiter erlaubt' }, { status: 400 })
    }

    if (data.istDefault) {
      await prisma.mitarbeiter.updateMany({ data: { istDefault: false } })
    }
    const istErster = count === 0
    const passwortHash = await hashPassword(data.passwort)

    const mitarbeiter = await prisma.mitarbeiter.create({
      data: {
        vorname:     data.vorname,
        nachname:    data.nachname,
        email:       data.email.toLowerCase().trim(),
        passwortHash,
        kuerzel:     data.kuerzel || (data.vorname[0] + data.nachname[0]).toUpperCase(),
        telefon:     data.telefon,
        whatsapp:    data.whatsapp,
        waApiKey:    data.waApiKey,
        farbe:       data.farbe ?? '#0369A1',
        istDefault:  data.istDefault ?? istErster,
      },
    })

    return NextResponse.json(mitarbeiter)
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json({ error: 'Ungültige Daten' }, { status: 400 })
    }
    return NextResponse.json({ error: 'Datenbankfehler' }, { status: 500 })
  }
}
