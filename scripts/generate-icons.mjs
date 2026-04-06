/**
 * PWA Icon + Splash Screen Generator
 *
 * Icons:   public/icon-source.png         → alle App-Icons (Android + iOS + Manifest)
 * Splash:  public/pwa/windows/SplashScreen.scale-100.png → iOS Splash Screens
 */

import sharp from 'sharp'
import path from 'path'
import fs from 'fs'
import { fileURLToPath } from 'url'

const __dirname = path.dirname(fileURLToPath(import.meta.url))
const ROOT   = path.resolve(__dirname, '..')
const OUT    = path.join(ROOT, 'public')
const SOURCE = path.join(OUT, 'icon-source.png')
const SPLASH_SOURCE = path.join(OUT, 'pwa', 'windows', 'SplashScreen.scale-100.png')

// Icon-Quelle sichern
if (!fs.existsSync(SOURCE)) {
  const fallback = path.join(OUT, 'web-app-manifest-512x512.png')
  if (!fs.existsSync(fallback)) { console.error('Keine icon-source.png gefunden!'); process.exit(1) }
  fs.copyFileSync(fallback, SOURCE)
  console.log('icon-source.png angelegt.')
}

// ── Icon ────────────────────────────────────────────────────────────────────
async function makeIcon(size, paddingPercent, destPath) {
  const pad   = Math.round(size * paddingPercent)
  const inner = size - pad * 2
  const white = { r: 255, g: 255, b: 255, alpha: 1 }
  await sharp(SOURCE)
    .resize(inner, inner, { fit: 'contain', background: white })
    .extend({ top: pad, bottom: pad, left: pad, right: pad, background: white })
    .png()
    .toFile(destPath)
  console.log(`✓  ${path.relative(ROOT, destPath).padEnd(58)} ${size}×${size}`)
}

// ── Splash ───────────────────────────────────────────────────────────────────
// Logo wird auf 55% der Canvas-Breite skaliert (mit mind. 40px Rand), vertikal zentriert
async function makeSplash(w, h, destPath) {
  const white     = { r: 255, g: 255, b: 255, alpha: 1 }
  const logoW     = Math.round(w * 0.65)
  // Logo-Quelle ist 620×300 → Verhältnis 2.067
  const logoH     = Math.round(logoW / (620 / 300))
  const padLeft   = Math.round((w - logoW) / 2)
  const padTop    = Math.round((h - logoH) / 2)
  const padRight  = w - logoW - padLeft
  const padBottom = h - logoH - padTop

  await sharp(SPLASH_SOURCE)
    .flatten({ background: white })   // Transparenz → Weiß (verhindert schwarzen Hintergrund)
    .resize(logoW, logoH, { fit: 'fill' })
    .extend({ top: padTop, bottom: padBottom, left: padLeft, right: padRight, background: white })
    .png()
    .toFile(destPath)
  console.log(`✓  ${path.relative(ROOT, destPath).padEnd(58)} ${w}×${h}`)
}

async function run() {
  for (const dir of ['pwa/android', 'pwa/ios', 'pwa/ios/splash']) {
    fs.mkdirSync(path.join(OUT, dir), { recursive: true })
  }

  console.log('\n── Manifest-Icons ───────────────────────────────────────')
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

  console.log('\n── iOS Splash Screens ───────────────────────────────────')
  const splashes = [
    { w: 640,  h: 1136, name: 'iphone-se'          },  // iPhone SE 1./2. Gen
    { w: 750,  h: 1334, name: 'iphone-8'           },  // iPhone 6/7/8/SE 3.
    { w: 1125, h: 2436, name: 'iphone-x'           },  // iPhone X/XS/11 Pro
    { w: 828,  h: 1792, name: 'iphone-xr'          },  // iPhone XR/11
    { w: 1170, h: 2532, name: 'iphone-12'          },  // iPhone 12/13/14
    { w: 1179, h: 2556, name: 'iphone-14-pro'      },  // iPhone 14/15 Pro
    { w: 1284, h: 2778, name: 'iphone-14-plus'     },  // iPhone 14 Plus/13 Pro Max
    { w: 1290, h: 2796, name: 'iphone-14-pro-max'  },  // iPhone 14/15 Pro Max
    { w: 1488, h: 2266, name: 'ipad-mini'          },  // iPad Mini 6
    { w: 1640, h: 2360, name: 'ipad-air'           },  // iPad Air 4/5
    { w: 1668, h: 2388, name: 'ipad-pro-11'        },  // iPad Pro 11"
    { w: 2048, h: 2732, name: 'ipad-pro-129'       },  // iPad Pro 12.9"
  ]
  for (const s of splashes) {
    await makeSplash(s.w, s.h, path.join(OUT, 'pwa', 'ios', 'splash', `${s.name}.png`))
  }

  console.log('\n✅  Fertig!')
}

run().catch(err => { console.error(err); process.exit(1) })
