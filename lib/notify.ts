/**
 * Zentraler Benachrichtigungs-Helfer für Mitarbeiter.
 * Prüft benachrichtigungKanal und sendet WA / E-Mail / beides.
 * Fallback: wenn WA gewählt aber nicht konfiguriert → E-Mail.
 */

import { sendToMitarbeiter } from './callmebot'
import { sendEmail } from './email'

export interface MitarbeiterForNotify {
  id: string
  email: string
  vorname: string
  nachname: string
  whatsapp?: string | null
  waApiKey?: string | null
  benachrichtigungKanal?: string | null
}

export async function notifyMitarbeiter(
  ma: MitarbeiterForNotify,
  message: string,
  subject: string,
  opts?: { anfrageId?: string; dashboardPath?: string }
): Promise<void> {
  const kanal  = ma.benachrichtigungKanal ?? 'beide'
  const hatWa  = !!(ma.whatsapp?.trim() && ma.waApiKey?.trim())

  const sendeWa   = (kanal === 'whatsapp' || kanal === 'beide') && hatWa
  // E-Mail immer wenn: Kanal "email" oder "beide" ODER WA gewählt aber nicht konfiguriert
  const sendeMail = kanal === 'email' || kanal === 'beide' || (kanal === 'whatsapp' && !hatWa)

  const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || 'https://autoankauf-baden.de'
  const linkHref = opts?.dashboardPath
    ? `${baseUrl}${opts.dashboardPath}`
    : opts?.anfrageId
      ? `${baseUrl}/dashboard/anfragen/${opts.anfrageId}`
      : null

  if (sendeWa) {
    await sendToMitarbeiter(ma, message)
  }

  if (sendeMail) {
    const linkBlock = linkHref
      ? `<a href="${linkHref}" style="display:inline-block;margin-top:16px;padding:10px 20px;background:#0369A1;color:#fff;border-radius:8px;text-decoration:none;font-weight:bold">Öffnen →</a>`
      : ''
    const html = `<div style="font-family:sans-serif;max-width:520px;margin:0 auto;padding:24px">
      <p style="font-size:15px;color:#0F172A;line-height:1.6">${message.replace(/\n/g, '<br>')}</p>
      ${linkBlock}
    </div>`
    await sendEmail({
      to: ma.email,
      subject,
      html,
      _typ: 'intern',
      _anfrageId: opts?.anfrageId,
    })
  }
}
