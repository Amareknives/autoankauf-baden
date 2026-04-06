import { NextRequest, NextResponse } from 'next/server'
import { writeFile, mkdir } from 'fs/promises'
import path from 'path'
import { randomUUID } from 'crypto'

const UPLOAD_DIR = process.env.UPLOAD_DIR
  ? path.resolve(process.env.UPLOAD_DIR)
  : path.join(process.cwd(), 'uploads')

// Temporärer Ordner – Dateien bleiben hier bis das Formular abgesendet wird
const TEMP_DIR = path.join(UPLOAD_DIR, 'temp')

const MAX_SIZE = 8 * 1024 * 1024 // 8 MB
const ALLOWED_TYPES = ['image/jpeg', 'image/png', 'image/webp']
const MAX_FILES = 8

const rateLimitMap = new Map<string, { count: number; resetAt: number }>()
function checkRateLimit(ip: string): boolean {
  const now = Date.now()
  const limit = rateLimitMap.get(ip)
  if (!limit || now > limit.resetAt) {
    rateLimitMap.set(ip, { count: 1, resetAt: now + 60 * 60 * 1000 })
    return true
  }
  if (limit.count >= 10) return false
  limit.count++
  return true
}

export async function POST(request: NextRequest) {
  const forwardedFor = request.headers.get('x-forwarded-for')
  const ip = forwardedFor ? forwardedFor.split(',')[0].trim() : 'unknown'
  if (!checkRateLimit(ip)) {
    return NextResponse.json({ error: 'Zu viele Anfragen' }, { status: 429 })
  }

  try {
    const formData = await request.formData()
    const files = formData.getAll('files') as File[]

    if (!files.length) {
      return NextResponse.json({ error: 'Keine Dateien' }, { status: 400 })
    }
    if (files.length > MAX_FILES) {
      return NextResponse.json({ error: `Max. ${MAX_FILES} Dateien` }, { status: 400 })
    }

    for (const file of files) {
      if (!ALLOWED_TYPES.includes(file.type)) {
        return NextResponse.json({ error: 'Nur JPG, PNG und WebP erlaubt' }, { status: 400 })
      }
      if (file.size > MAX_SIZE) {
        return NextResponse.json({ error: 'Datei zu groß (max. 8 MB)' }, { status: 400 })
      }
    }

    await mkdir(TEMP_DIR, { recursive: true })

    const filenames: string[] = []
    for (const file of files) {
      const ext = file.type === 'image/png' ? 'png' : file.type === 'image/webp' ? 'webp' : 'jpg'
      const filename = `${randomUUID()}.${ext}`
      const buffer = Buffer.from(await file.arrayBuffer())
      await writeFile(path.join(TEMP_DIR, filename), buffer)
      filenames.push(filename)
    }

    return NextResponse.json({ filenames })
  } catch {
    return NextResponse.json({ error: 'Upload fehlgeschlagen' }, { status: 500 })
  }
}
