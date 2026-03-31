import { NextRequest, NextResponse } from 'next/server'

export async function PATCH(
  _req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params
    const { prisma } = await import('@/lib/prisma')
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    await (prisma as any).mailLog.update({
      where: { id },
      data: { status: 'behoben' },
    })
    return NextResponse.json({ ok: true })
  } catch {
    return NextResponse.json({ error: 'Datenbankfehler' }, { status: 500 })
  }
}

export async function GET(
  _req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params
    const { prisma } = await import('@/lib/prisma')

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const log = await (prisma as any).mailLog.findUnique({
      where: { id },
      select: {
        id: true,
        createdAt: true,
        anfrageId: true,
        typ: true,
        empfaenger: true,
        betreff: true,
        htmlBody: true,
        status: true,
        fehler: true,
      },
    })

    if (!log) {
      return NextResponse.json({ error: 'Nicht gefunden' }, { status: 404 })
    }

    return NextResponse.json({ log })
  } catch {
    return NextResponse.json({ error: 'Datenbankfehler' }, { status: 500 })
  }
}
