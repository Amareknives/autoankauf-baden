/**
 * PWA Icon Generator
 * Erzeugt alle Icons mit weißem Hintergrund und korrektem Padding.
 *
 * Quelle: public/icon-source.png (unverändertes Original, einmalig anlegen)
 * Falls noch nicht vorhanden: wird aus web-app-manifest-512x512.png kopiert.
 *
 * Padding-Regeln:
 * - "any"-Icons:      12% Padding  → normaler Homescreen, kein Abschneiden
 * - "maskable"-Icons: 20% Padding  → Android Safe Zone = innere 80% des Canvas
 * - iOS apple-touch:  10% Padding  → iOS rundet selbst, weniger nötig
 */

import sharp from 'sharp'
import path from 'path'
import fs from 'fs'
import { fileURLToPath } from 'url'

const __dirname = path.dirname(fileURLToPath(import.meta.url))
const ROOT = path.resolve(__dirname, '..')
const OUT = path.join(ROOT, 'public')
const SOURCE = path.join(OUT, 'icon-source.png')   // unverändertes Original

// Beim ersten Aufruf: Quelle aus vorhandener Datei sichern
if (!fs.existsSync(SOURCE)) {
  const fallback = path.join(OUT, 'web-app-manifest-512x512.png')
  if (!fs.existsSync(fallback)) {
    console.error('Keine Quelldatei gefunden! Lege public/icon-source.png an.')
    process.exit(1)
  }
  fs.copyFileSync(fallback, SOURCE)
  console.log('icon-source.png aus web-app-manifest-512x512.png erstellt.')
}

async function makeIcon(size, paddingPercent, destPath) {
  const pad    = Math.round(size * paddingPercent)
  const inner  = size - pad * 2
  const white  = { r: 255, g: 255, b: 255, alpha: 1 }

  await sharp(SOURCE)
    .resize(inner, inner, { fit: 'contain', background: white })
    .extend({ top: pad, bottom: pad, left: pad, right: pad, background: white })
    .png()
    .toFile(destPath)

  console.log(`✓  ${path.relative(ROOT, destPath).padEnd(55)} ${size}×${size}  pad=${pad}px`)
}

async function run() {
  // Ordner anlegen falls nötig
  for (const dir of ['pwa/android', 'pwa/ios']) {
    fs.mkdirSync(path.join(OUT, dir), { recursive: true })
  }

  console.log('\n── Manifest-Icons (any + maskable) ─────────────────────')
  await makeIcon(192, 0.12, path.join(OUT, 'web-app-manifest-192x192.png'))
  await makeIcon(512, 0.12, path.join(OUT, 'web-app-manifest-512x512.png'))
  await makeIcon(512, 0.20, path.join(OUT, 'web-app-manifest-512x512-maskable.png'))

  console.log('\n── Android Icons ────────────────────────────────────────')
  for (const size of [48, 72, 96, 144, 192, 512]) {
    await makeIcon(size, 0.12, path.join(OUT, 'pwa', 'android', `launchericon-${size}x${size}.png`))
  }

  console.log('\n── iOS Icons ────────────────────────────────────────────')
  const iosSizes = [16, 20, 29, 32, 40, 48, 50, 57, 58, 60, 64, 72, 76, 80, 87,
                    96, 100, 114, 120, 128, 144, 152, 167, 180, 192, 256, 512, 1024]
  for (const size of iosSizes) {
    await makeIcon(size, 0.10, path.join(OUT, 'pwa', 'ios', `${size}.png`))
  }

  console.log('\n✅  Alle Icons fertig!')
}

run().catch(err => { console.error(err); process.exit(1) })
