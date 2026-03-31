import fs from 'fs'
import path from 'path'

const EXTENSIONS = ['webp', 'jpg', 'png']
const PUBLIC_DIR = path.join(process.cwd(), 'public')

function heroExists(name: string): boolean {
  return EXTENSIONS.some(ext => fs.existsSync(path.join(PUBLIC_DIR, `${name}.${ext}`)))
}

function heroSrc(name: string): string {
  for (const ext of EXTENSIONS) {
    if (fs.existsSync(path.join(PUBLIC_DIR, `${name}.${ext}`))) {
      return `/${name}.${ext}`
    }
  }
  return ''
}

export function getRandomHeroSrc(): string {
  const candidates: string[] = []

  for (let i = 0; i <= 8; i++) {
    const name = i === 0 ? 'hero-home' : `hero-home${i}`
    if (heroExists(name)) candidates.push(heroSrc(name))
  }

  if (candidates.length === 0) return ''
  return candidates[Math.floor(Math.random() * candidates.length)]
}
