import { NextRequest, NextResponse } from 'next/server'

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = request.nextUrl
    const limit = Math.min(parseInt(searchParams.get('limit') || '100'), 500)
    const nurFehler = searchParams.get('nurFehler') === 'true'
    const anfrageId = searchParams.get('anfrageId') ?? undefined
    const typ = searchParams.get('typ') ?? undefined

    const { prisma } = await import('@/lib/prisma')

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const where: Record<string, unknown> = {}
    if (nurFehler) where.status = 'fehler'
    if (anfrageId) where.anfrageId = anfrageId
    if (typ) where.typ = typ

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const logs = await (prisma as any).mailLog.findMany({
      where: Object.keys(where).length > 0 ? where : undefined,
      orderBy: { createdAt: 'desc' },
      take: limit,
    })

    return NextResponse.json({ logs })
  } catch {
    return NextResponse.json({ error: 'Datenbankfehler' }, { status: 500 })
  }
}
