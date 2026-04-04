import Anthropic from '@anthropic-ai/sdk';

const client = new Anthropic({
  apiKey: process.env.ANTHROPIC_API_KEY || '',
});

export const CHAT_SYSTEM_PROMPT = `Du bist Max, freundlicher KI-Assistent von AutoAnkauf-Baden in Bruchsal. Wir kaufen seit 6 Jahren Autos in der Region Baden (Karlsruhe, Bruchsal, Heidelberg, Mannheim, Speyer, Pforzheim).

Deine Aufgaben:
- Fragen zum Autoverkauf beantworten
- Formularfelder erklären (Zulassungsbescheinigung Felder)
- Verkaufsprozess erklären
- Vertrauen aufbauen, zur Anfrage ermutigen

Regeln:
- Du-Form, freundlich, max 3-4 Sätze
- KEINE Preisschätzungen
- Bei Preisfragen: auf Formular verweisen
- Bei Zulassung: Felder erklären (B=Halter, P.1=Hubraum, P.2=Leistung kW, P.3=Kraftstoff, V.9=Schadstoffklasse)`;

export async function streamChatMessage(
  messages: { role: 'user' | 'assistant'; content: string }[],
  onChunk: (text: string) => void,
  onComplete: () => void,
  onError: (error: Error) => void,
) {
  try {
    const stream = client.messages.stream({
      model: 'claude-sonnet-4-20250514',
      max_tokens: 512,
      system: CHAT_SYSTEM_PROMPT,
      messages,
    });

    for await (const event of stream) {
      if (
        event.type === 'content_block_delta' &&
        event.delta.type === 'text_delta'
      ) {
        onChunk(event.delta.text);
      }
    }
    onComplete();
  } catch (error) {
    onError(error instanceof Error ? error : new Error('Unbekannter Fehler'));
  }
}
