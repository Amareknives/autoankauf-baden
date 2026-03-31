/**
 * Passwort-Hashing mit PBKDF2 (kein npm-Paket notwendig)
 * Format: "salt_hex:hash_hex"
 */

export async function hashPassword(password: string): Promise<string> {
  const encoder = new TextEncoder()
  const salt = crypto.getRandomValues(new Uint8Array(16))
  const key = await crypto.subtle.importKey('raw', encoder.encode(password), 'PBKDF2', false, ['deriveBits'])
  const bits = await crypto.subtle.deriveBits(
    { name: 'PBKDF2', salt, hash: 'SHA-256', iterations: 100_000 },
    key, 256
  )
  const toHex = (arr: Uint8Array) => Array.from(arr).map(b => b.toString(16).padStart(2, '0')).join('')
  return `${toHex(salt)}:${toHex(new Uint8Array(bits))}`
}

export async function verifyPassword(password: string, stored: string): Promise<boolean> {
  if (!stored || !stored.includes(':')) return false
  const [saltHex, hashHex] = stored.split(':')
  const salt = new Uint8Array(saltHex.match(/../g)!.map(h => parseInt(h, 16)))
  const encoder = new TextEncoder()
  const key = await crypto.subtle.importKey('raw', encoder.encode(password), 'PBKDF2', false, ['deriveBits'])
  const bits = await crypto.subtle.deriveBits(
    { name: 'PBKDF2', salt, hash: 'SHA-256', iterations: 100_000 },
    key, 256
  )
  const computed = Array.from(new Uint8Array(bits)).map(b => b.toString(16).padStart(2, '0')).join('')
  return computed === hashHex
}
