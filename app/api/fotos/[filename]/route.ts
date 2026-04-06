import { NextRequest, NextResponse } from 'next/server'
import { readFile } from 'fs/promises'
import path from 'path'

const UPLOAD_DIR = process.env.UPLOAD_DIR
  ? path.resolve(process.env.UPLOAD_DIR)
  : path.join(process.cwd(), 'uploads')

// Nur UUID-basierte Dateinamen erlaubt – verhindert Path-Traversal
const SAFE_FILENAME = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}\.(jpg|png|webp)$/i

export async function GET(
  _request: NextRequest,
  { params }: { params: Promise<{ filename: string }> }
) {
  const { filename } = await params

  if (!SAFE_FILENAME.test(filename)) {
    return NextResponse.json({ error: 'Ungültig' }, { status: 400 })
  }

  try {
    const filepath = path.join(UPLOAD_DIR, filename)
    const buffer = await readFile(filepath)
    const ext = filename.split('.').pop()!.toLowerCase()
    const contentType =
      ext === 'png' ? 'image/png' : ext === 'webp' ? 'image/webp' : 'image/jpeg'

    return new NextResponse(buffer, {
      headers: {
        'Content-Type': contentType,
        'Cache-Control': 'public, max-age=31536000, immutable',
      },
    })
  } catch {
    return NextResponse.json({ error: 'Nicht gefunden' }, { status: 404 })
  }
}
