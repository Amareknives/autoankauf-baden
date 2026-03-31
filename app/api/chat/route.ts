import { NextRequest, NextResponse } from 'next/server';

const sessionMap = new Map<string, number>();

export async function POST(request: NextRequest) {
  const sessionId = request.headers.get('x-session-id') || 'default';
  const count = sessionMap.get(sessionId) || 0;
  if (count >= 20) {
    return NextResponse.json({ error: 'Sitzungs-Limit erreicht' }, { status: 429 });
  }
  sessionMap.set(sessionId, count + 1);

  try {
    const { messages } = await request.json() as {
      messages: { role: 'user' | 'assistant'; content: string }[];
    };

    if (!process.env.ANTHROPIC_API_KEY || process.env.ANTHROPIC_API_KEY === 'sk-ant-placeholder') {
      return NextResponse.json({ error: 'KI nicht konfiguriert' }, { status: 503 });
    }

    const Anthropic = (await import('@anthropic-ai/sdk')).default;
    const client = new Anthropic({ apiKey: process.env.ANTHROPIC_API_KEY });

    const stream = await client.messages.stream({
      model: 'claude-sonnet-4-20250514',
      max_tokens: 512,
      system: 'Du bist Max, freundlicher KI-Assistent von AutoAnkauf-Baden in Bruchsal. Wir kaufen seit 6 Jahren Autos in der Region Baden. Du-Form, freundlich, max 3-4 Saetze. Keine Preisschaetzungen.',
      messages,
    });

    const encoder = new TextEncoder();
    const readable = new ReadableStream({
      async start(controller) {
        for await (const event of stream) {
          if (event.type === 'content_block_delta' && event.delta.type === 'text_delta') {
            controller.enqueue(encoder.encode(event.delta.text));
          }
        }
        controller.close();
      },
    });

    return new NextResponse(readable, {
      headers: { 'Content-Type': 'text/plain; charset=utf-8' },
    });
  } catch {
    return NextResponse.json({ error: 'Fehler beim Chat' }, { status: 500 });
  }
}
