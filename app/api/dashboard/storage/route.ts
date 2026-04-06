import { NextRequest, NextResponse } from 'next/server'
import { cookies } from 'next/headers'
import { verifySessionToken } from '@/lib/auth'

export async function GET(request: NextRequest) {
  const cookieStore = await cookies()
  const token = cookieStore.get('aab_session')?.value
  if (!token || !(await verifySessionToken(token))) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  try {
    const { prisma } = await import('@/lib/prisma')

    // Größe der Foto-Spalte (Base64-Text) – funktioniert auf allen Supabase-Plänen
    const fotosSize = await prisma.$queryRaw<[{ fotos_bytes: bigint; fotos_pretty: string; anfragen_mit_fotos: bigint }]>`
      SELECT
        COALESCE(SUM(octet_length(fotos::text)), 0) AS fotos_bytes,
        pg_size_pretty(COALESCE(SUM(octet_length(fotos::text)), 0)) AS fotos_pretty,
        COUNT(*) FILTER (WHERE fotos::text != '[]' AND fotos::text != 'null') AS anfragen_mit_fotos
      FROM "Anfrage"
    `

    // Anzahl aller Anfragen
    const anfragenGesamt = await prisma.anfrage.count()

    // Gesamtgröße der Datenbank – erfordert erhöhte Rechte, daher optional
    let dbSizeBytes = 0
    let dbSizePretty = 'n/v'
    try {
      const dbSize = await prisma.$queryRaw<[{ size_bytes: bigint; size_pretty: string }]>`
        SELECT
          pg_database_size(current_database()) AS size_bytes,
          pg_size_pretty(pg_database_size(current_database())) AS size_pretty
      `
      dbSizeBytes = Number(dbSize[0].size_bytes)
      dbSizePretty = dbSize[0].size_pretty
    } catch {
      // pg_database_size nicht verfügbar (Supabase Free-Rechte) – kein Problem
    }

    return NextResponse.json({
      dbSizeBytes,
      dbSizePretty,
      fotosSizeBytes: Number(fotosSize[0].fotos_bytes),
      fotosSizePretty: fotosSize[0].fotos_pretty,
      anfragenMitFotos: Number(fotosSize[0].anfragen_mit_fotos),
      anfragenGesamt,
    })
  } catch {
    return NextResponse.json({ error: 'Nicht verfügbar' }, { status: 500 })
  }
}
