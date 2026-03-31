/**
 * Session-Verwaltung
 * Token-Format: `${mitarbeiterId}.${hmac(mitarbeiterId)}`
 */

const SESSION_COOKIE = 'aab_session'
export const SESSION_MAX_AGE = 60 * 60 * 8 // 8 Stunden

async function hmac(data: string, secret: string): Promise<string> {
  const encoder = new TextEncoder()
  const key = await crypto.subtle.importKey(
    'raw', encoder.encode(secret), { name: 'HMAC', hash: 'SHA-256' }, false, ['sign']
  )
  const sig = await crypto.subtle.sign('HMAC', key, encoder.encode(data))
  return Array.from(new Uint8Array(sig)).map(b => b.toString(16).padStart(2, '0')).join('')
}

export async function createSessionToken(mitarbeiterId: string): Promise<string> {
  const secret = process.env.NEXTAUTH_SECRET || 'fallback-secret'
  const sig = await hmac(mitarbeiterId, secret)
  return `${mitarbeiterId}.${sig}`
}

export async function verifySessionToken(token: string): Promise<string | null> {
  const dot = token.indexOf('.')
  if (dot === -1) return null
  const mitarbeiterId = token.slice(0, dot)
  const sig = token.slice(dot + 1)
  const secret = process.env.NEXTAUTH_SECRET || 'fallback-secret'
  const expected = await hmac(mitarbeiterId, secret)
  return expected === sig ? mitarbeiterId : null
}

export { SESSION_COOKIE }
