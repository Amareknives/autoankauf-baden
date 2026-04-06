import { NextRequest, NextResponse } from 'next/server'
import { cookies } from 'next/headers'
import { verifySessionToken } from '@/lib/auth'
import { readdir, stat } from 'fs/promises'
import path from 'path'

const UPLOAD_DIR = process.env.UPLOAD_DIR
  ? path.resolve(process.env.UPLOAD_DIR)
  : path.join(process.cwd(), 'uploads')

function prettyBytes(bytes: number): string {
  if (bytes < 1024) return `${bytes} B`
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`
  if (bytes < 1024 * 1024 * 1024) return `${(bytes / (1024 * 1024)).toFixed(1)} MB`
  return `${(bytes / (1024 * 1024 * 1024)).toFixed(2)} GB`
}

async function getDirSize(dir: string): Promise<{ totalBytes: number; fileCount: number }> {
  try {
    const files = await readdir(dir)
    let totalBytes = 0
    let fileCount = 0
    for (const file of files) {
      try {
        const s = await stat(path.join(dir, file))
        if (s.isFile()) {
          totalBytes += s.size
          fileCount++
        }
      } catch {
        // Einzelne Datei nicht lesbar – überspringen
      }
    }
    return { totalBytes, fileCount }
  } catch {
    return { totalBytes: 0, fileCount: 0 }
  }
}

export async function GET(request: NextRequest) {
  const cookieStore = await cookies()
  const token = cookieStore.get('aab_session')?.value
  if (!token || !(await verifySessionToken(token))) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  try {
    const { prisma } = await import('@/lib/prisma')

    // Disk-Speicher des Upload-Ordners
    const { totalBytes: fotosDiskBytes, fileCount: fotosAnzahl } = await getDirSize(UPLOAD_DIR)

    // Anzahl Anfragen mit Fotos aus DB
    const [anfragenGesamt, anfragenMitFotos] = await Promise.all([
      prisma.anfrage.count(),
      prisma.anfrage.count({
        where: {
          NOT: [{ fotos: { equals: [] } }],
        },
      }),
    ])

    return NextResponse.json({
      fotosDiskBytes,
      fotosDiskPretty: prettyBytes(fotosDiskBytes),
      fotosAnzahl,
      anfragenMitFotos,
      anfragenGesamt,
      uploadDir: UPLOAD_DIR,
    })
  } catch {
    return NextResponse.json({ error: 'Nicht verfügbar' }, { status: 500 })
  }
}
