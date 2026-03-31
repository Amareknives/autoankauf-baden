import { NextResponse } from 'next/server'
import { sendWhatsAppNotification } from '@/lib/callmebot'

export async function POST(request: Request) {
  try {
    const body = await request.json() as { nummer?: string; apiKey?: string }

    if (!body.nummer || !body.apiKey) {
      return NextResponse.json({ error: 'Nummer und API-Key erforderlich' }, { status: 400 })
    }

    const message =
      `✅ Test von AutoAnkauf-Baden\n` +
      `WhatsApp-Benachrichtigungen funktionieren korrekt.\n` +
      `📅 ${new Date().toLocaleDateString('de-DE', { day: '2-digit', month: '2-digit', year: 'numeric', hour: '2-digit', minute: '2-digit' })}`

    const result = await sendWhatsAppNotification({
      nummer: body.nummer.replace(/[^0-9]/g, ''),
      apiKey: body.apiKey,
      message,
    })

    if (!result.ok) {
      return NextResponse.json({ ok: false, error: result.error }, { status: 500 })
    }

    return NextResponse.json({ ok: true })
  } catch (err) {
    return NextResponse.json(
      { error: 'Fehler', detail: err instanceof Error ? err.message : String(err) },
      { status: 500 }
    )
  }
}
