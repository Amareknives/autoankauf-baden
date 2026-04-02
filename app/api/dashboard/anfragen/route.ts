import { NextRequest, NextResponse } from 'next/server'

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = request.nextUrl
    const status = searchParams.get('status')
    const search = searchParams.get('search')
    const page = parseInt(searchParams.get('page') || '1')
    const limit = parseInt(searchParams.get('limit') || '20')
    const archiviert = searchParams.get('archiviert') === 'true'
    const skip = (page - 1) * limit

    const { prisma } = await import('@/lib/prisma')

    const where: Record<string, unknown> = {
      archiviert,
    }

    if (status && status !== 'all') {
      where.status = status
    }

    if (search) {
      where.OR = [
        { vorname: { contains: search, mode: 'insensitive' } },
        { nachname: { contains: search, mode: 'insensitive' } },
        { marke: { contains: search, mode: 'insensitive' } },
        { modell: { contains: search, mode: 'insensitive' } },
        { plz: { contains: search, mode: 'insensitive' } },
        { email: { contains: search, mode: 'insensitive' } },
      ]
    }

    const [anfragen, total] = await Promise.all([
      prisma.anfrage.findMany({
        where,
        orderBy: { createdAt: 'desc' },
        skip,
        take: limit,
        select: {
          id: true,
          vorname: true,
          nachname: true,
          marke: true,
          modell: true,
          status: true,
          createdAt: true,
          plz: true,
          telefon: true,
          email: true,
          kilometerstand: true,
          erstzulassungJahr: true,
          optischerZustand: true,
          fahrbereitschaft: true,
          archiviert: true,
          terminVorschlag1: true,
          abholadresse: true,
          notizen: true,
          angebotspreis: true,
          bearbeiterId: true,
          bearbeiter: { select: { id: true, vorname: true, nachname: true, kuerzel: true, farbe: true } },
          aktivitaeten: {
            orderBy: { createdAt: 'desc' },
            take: 1,
            select: { id: true, aktion: true, details: true, createdAt: true },
          },
        },
      }),
      prisma.anfrage.count({ where }),
    ])

    return NextResponse.json({ anfragen, total, page, limit })
  } catch (err) {
    return NextResponse.json({ error: 'Datenbankfehler' }, { status: 500 })
  }
}
