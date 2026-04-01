// Einmaliges Script: Ersten Admin-Account in Supabase anlegen
import { createRequire } from 'module'
import { readFileSync } from 'fs'
import { join, dirname } from 'path'
import { fileURLToPath } from 'url'

const __dirname = dirname(fileURLToPath(import.meta.url))

// .env.local manuell laden
const envPath = join(__dirname, '..', '.env.local')
const envContent = readFileSync(envPath, 'utf8')
for (const line of envContent.split('\n')) {
  const trimmed = line.trim()
  if (!trimmed || trimmed.startsWith('#')) continue
  const idx = trimmed.indexOf('=')
  if (idx === -1) continue
  const key = trimmed.slice(0, idx)
  let val = trimmed.slice(idx + 1)
  if (val.startsWith('"') && val.endsWith('"')) val = val.slice(1, -1)
  process.env[key] = val
}

const email = process.env.DASHBOARD_EMAIL || 'admin@autoankauf-baden.de'
const password = process.env.DASHBOARD_PASSWORD || 'admin123'

// PBKDF2 Hash (identisch mit lib/password.ts)
async function hashPassword(pw) {
  const encoder = new TextEncoder()
  const salt = crypto.getRandomValues(new Uint8Array(16))
  const key = await crypto.subtle.importKey('raw', encoder.encode(pw), 'PBKDF2', false, ['deriveBits'])
  const bits = await crypto.subtle.deriveBits(
    { name: 'PBKDF2', salt, hash: 'SHA-256', iterations: 100_000 },
    key, 256
  )
  const toHex = arr => Array.from(arr).map(b => b.toString(16).padStart(2, '0')).join('')
  return `${toHex(salt)}:${toHex(new Uint8Array(bits))}`
}

const { PrismaClient } = await import('@prisma/client')
const { PrismaPg } = await import('@prisma/adapter-pg')
const adapter = new PrismaPg({ connectionString: process.env.DIRECT_URL })
const prisma = new PrismaClient({ adapter })

try {
  const existing = await prisma.mitarbeiter.findUnique({ where: { email } })
  if (existing) {
    console.log(`✓ Account existiert bereits: ${email}`)
    process.exit(0)
  }

  const hash = await hashPassword(password)
  const mitarbeiter = await prisma.mitarbeiter.create({
    data: {
      email,
      passwortHash: hash,
      vorname: 'Admin',
      nachname: 'AutoAnkauf',
      kuerzel: 'AA',
      aktiv: true,
      istDefault: true,
      benachrichtigungKanal: 'beide',
    }
  })
  console.log(`✅ Admin angelegt: ${mitarbeiter.email} (ID: ${mitarbeiter.id})`)
} finally {
  await prisma.$disconnect()
}
