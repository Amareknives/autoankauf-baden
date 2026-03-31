import { NextRequest, NextResponse } from 'next/server'
import { z } from 'zod'

const einstellungenSchema = z.record(z.string(), z.string())

export async function GET() {
  try {
    const { prisma } = await import('@/lib/prisma')
    const einstellungen = await prisma.einstellung.findMany()
    const result: Record<string, string> = {}
    einstellungen.forEach(e => { result[e.id] = e.wert })
    return NextResponse.json(result)
  } catch {
    return NextResponse.json({})
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const data = einstellungenSchema.parse(body)

    const { prisma } = await import('@/lib/prisma')

    await Promise.all(
      Object.entries(data).map(([id, wert]) =>
        prisma.einstellung.upsert({
          where: { id },
          update: { wert },
          create: { id, wert },
        })
      )
    )

    return NextResponse.json({ success: true })
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json({ error: 'Ungültige Daten' }, { status: 400 })
    }
    console.error('[einstellungen POST]', error)
    return NextResponse.json({ error: 'Datenbankfehler' }, { status: 500 })
  }
}
