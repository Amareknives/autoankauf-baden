/**
 * CallMeBot WhatsApp API
 * Setup: https://www.callmebot.com/blog/free-api-whatsapp-messages/
 * 1. Nummer +34 644 26 33 77 als Kontakt speichern
 * 2. WhatsApp-Nachricht senden: "I allow callmebot to send me messages"
 * 3. API-Key aus Antwort in Dashboard → Einstellungen eintragen
 *
 * Später austauschbar gegen Twilio oder andere WhatsApp-APIs —
 * nur diese Datei muss angepasst werden.
 */

export async function sendWhatsAppNotification(params: {
  nummer: string   // z.B. "4917664179764" (ohne + und Leerzeichen)
  apiKey: string
  message: string
}): Promise<{ ok: boolean; error?: string }> {
  try {
    const url = new URL('https://api.callmebot.com/whatsapp.php')
    url.searchParams.set('phone', params.nummer)
    url.searchParams.set('text', params.message)
    url.searchParams.set('apikey', params.apiKey)

    const res = await fetch(url.toString(), {
      method: 'GET',
      signal: AbortSignal.timeout(10000),
    })

    if (!res.ok) return { ok: false, error: `HTTP ${res.status}` }
    return { ok: true }
  } catch (err) {
    return { ok: false, error: err instanceof Error ? err.message : String(err) }
  }
}

/**
 * Sendet an alle konfigurierten Nummern (bis zu 5).
 * Settings-Keys: wa_nummer_1/wa_key_1 … wa_nummer_5/wa_key_5
 */
export async function sendToAllNumbers(
  settings: Record<string, string>,
  message: string
): Promise<void> {
  const promises: Promise<void>[] = []

  for (let i = 1; i <= 5; i++) {
    const nummer = settings[`wa_nummer_${i}`]?.trim()
    const key    = settings[`wa_api_key_${i}`]?.trim()
    if (!nummer || !key) continue

    promises.push(
      sendWhatsAppNotification({ nummer, apiKey: key, message }).then(result => {
        if (!result.ok) console.error(`[callmebot] Nummer ${i} (${nummer}): ${result.error}`)
      })
    )
  }

  await Promise.allSettled(promises)
}

/**
 * Sendet an einen einzelnen Mitarbeiter (wenn WA-Nummer + API-Key gesetzt).
 */
export async function sendToMitarbeiter(
  mitarbeiter: { whatsapp?: string | null; waApiKey?: string | null },
  message: string
): Promise<void> {
  const nummer = mitarbeiter.whatsapp?.trim()
  const key    = mitarbeiter.waApiKey?.trim()
  if (!nummer || !key) return
  const result = await sendWhatsAppNotification({ nummer, apiKey: key, message })
  if (!result.ok) console.error('[callmebot] Mitarbeiter-WA fehlgeschlagen:', result.error)
}

export function buildNeueAnfrageMessage(params: {
  marke: string
  modell: string
  vorname: string
  nachname: string
  plz: string
  dashboardUrl: string
}): string {
  const datum = new Date().toLocaleDateString('de-DE', {
    day: '2-digit', month: '2-digit', year: 'numeric',
    hour: '2-digit', minute: '2-digit',
  })
  return (
    `🚗 Neue Anfrage: ${params.marke} ${params.modell}\n` +
    `👤 ${params.vorname} ${params.nachname} | PLZ ${params.plz}\n` +
    `📅 ${datum}\n` +
    `👉 ${params.dashboardUrl}`
  )
}
