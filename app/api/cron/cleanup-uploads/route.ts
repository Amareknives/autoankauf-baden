import { NextResponse } from 'next/server'
import { readdir, unlink, stat } from 'fs/promises'
import path from 'path'

/**
 * POST /api/cron/cleanup-uploads
 * Löscht Dateien in uploads/temp/ die älter als 48 Stunden sind.
 * Geschützt durch CRON_SECRET Header – gleiche Logik wie /api/cron/followup.
 */
export async function POST(request: Request) {
  const secret = request.headers.get('x-cron-secret')
  const expectedSecret = process.env.CRON_SECRET
  if (expectedSecret && secret !== expectedSecret) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  const UPLOAD_DIR = process.env.UPLOAD_DIR
    ? path.resolve(process.env.UPLOAD_DIR)
    : path.join(process.cwd(), 'uploads')

  const TEMP_DIR = path.join(UPLOAD_DIR, 'temp')
  const MAX_AGE_MS = 48 * 60 * 60 * 1000 // 48 Stunden

  try {
    let files: string[]
    try {
      files = await readdir(TEMP_DIR)
    } catch {
      // temp/-Ordner existiert noch nicht – kein Fehler
      return NextResponse.json({ deleted: 0, message: 'temp-Ordner leer oder nicht vorhanden' })
    }

    const now = Date.now()
    let deleted = 0

    await Promise.allSettled(
      files.map(async (filename) => {
        const filepath = path.join(TEMP_DIR, filename)
        const fileStat = await stat(filepath)
        const ageMs = now - fileStat.mtimeMs
        if (ageMs > MAX_AGE_MS) {
          await unlink(filepath)
          deleted++
        }
      })
    )

    return NextResponse.json({ deleted, total: files.length })
  } catch (err) {
    console.error('[cron/cleanup-uploads]', err)
    return NextResponse.json({ error: 'Fehler beim Cleanup' }, { status: 500 })
  }
}
