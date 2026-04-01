export interface SiteSettings {
  firmenname: string
  inhaber: string
  strasse: string
  plz_firma: string
  ort: string
  telefon: string
  whatsapp: string
  email: string
  gtmId: string
  chatEnabled: string
  // Social Media
  social_facebook: string
  social_instagram: string
  social_x: string
  social_youtube: string
  social_xing: string
  social_linkedin: string
  defaultBearbeiterId: string
}

const DEFAULTS: SiteSettings = {
  firmenname: 'autoankauf baden',
  inhaber: 'Muhammet Demir',
  strasse: 'Heidelberger Str. 4',
  plz_firma: '76676',
  ort: 'Graben-Neudorf',
  telefon: process.env.NEXT_PUBLIC_TELEFON || '+49 176 64179764',
  whatsapp: process.env.NEXT_PUBLIC_WHATSAPP || '4917664179764',
  email: process.env.NEXT_PUBLIC_FIRMA_EMAIL || 'anfrage@autoankauf-baden.de',
  gtmId: process.env.NEXT_PUBLIC_GTM_ID || '',
  chatEnabled: 'true',
  social_facebook: '',
  social_instagram: '',
  social_x: '',
  social_youtube: '',
  social_xing: '',
  social_linkedin: '',
  defaultBearbeiterId: '',
}

export async function getSiteSettings(): Promise<SiteSettings> {
  try {
    const { prisma } = await import('./prisma')
    const rows = await prisma.einstellung.findMany()
    const db: Record<string, string> = {}
    rows.forEach((r: { id: string; wert: string }) => { db[r.id] = r.wert })
    return { ...DEFAULTS, ...db } as SiteSettings
  } catch {
    return DEFAULTS
  }
}
