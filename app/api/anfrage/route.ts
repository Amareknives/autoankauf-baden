import { NextRequest, NextResponse } from 'next/server';
import { z } from 'zod';

const anfrageSchema = z.object({
  marke: z.string().min(1),
  modell: z.string().min(1),
  erstzulassungMonat: z.number().min(0).max(12),
  erstzulassungJahr: z.number().min(-1), // -1 = Nie zugelassen, 0 = Vor 1950
  kraftstoff: z.string().min(1),
  schadstoffklasse: z.string().min(1),
  leistungKw: z.number().min(0),
  hubraum: z.number().optional(),
  getriebe: z.string().min(1),
  bauform: z.string().min(1),
  anzahlTueren: z.string().min(1),
  anzahlSitze: z.number().min(1),
  huBis: z.string().min(1),
  farbe: z.string().min(1),
  kilometerstand: z.number().min(0),
  deutscheZulassung: z.boolean(),
  papiere: z.boolean(),
  finanziert: z.boolean(),
  optischerZustand: z.number().min(1).max(5),
  unfallfahrzeug: z.string(),
  repariert: z.boolean().optional(),
  fahrbereitschaft: z.string(),
  roststellen: z.boolean(),
  maengel: z.boolean(),
  maengelText: z.string().optional(),
  gewerblich: z.boolean(),
  firmenname: z.string().optional(),
  preisvorstellung: z.string().optional(),
  verkaufszeitpunkt: z.string(),
  abmeldung: z.boolean(),
  weitereInfos: z.string().optional(),
  ausstattung: z.array(z.string()),
  sonstigeAusstattung: z.string().optional(),
  fotos: z.array(z.string()),
  vorname: z.string().min(1),
  nachname: z.string().min(1),
  plz: z.string().min(4).max(5),
  email: z.string().email(),
  telefon: z.string().min(5).optional(),
  kontaktWeg: z.enum(['email_telefon', 'nur_email']).optional(),
  newsletter: z.boolean(),
  dsgvoAkzeptiert: z.boolean().refine((v) => v === true, 'DSGVO muss akzeptiert werden'),
});

const rateLimitMap = new Map<string, { count: number; resetAt: number }>();

function checkRateLimit(ip: string): boolean {
  const now = Date.now();
  const limit = rateLimitMap.get(ip);
  if (!limit || now > limit.resetAt) {
    rateLimitMap.set(ip, { count: 1, resetAt: now + 60 * 60 * 1000 });
    return true;
  }
  if (limit.count >= 5) return false;
  limit.count++;
  return true;
}

export async function POST(request: NextRequest) {
  const forwardedFor = request.headers.get('x-forwarded-for');
  const ip = forwardedFor ? forwardedFor.split(',')[0].trim() : 'unknown';
  if (!checkRateLimit(ip)) {
    return NextResponse.json(
      { error: 'Zu viele Anfragen. Bitte spaeter versuchen.' },
      { status: 429 }
    );
  }

  try {
    const body = await request.json();
    const data = anfrageSchema.parse(body);

    const { prisma } = await import('@/lib/prisma');
    const { getSiteSettings } = await import('@/lib/siteSettings');
    const settings = await getSiteSettings();
    const createData = settings.defaultBearbeiterId
      ? { ...data, bearbeiterId: settings.defaultBearbeiterId }
      : data;
    const anfrage = await prisma.anfrage.create({ data: createData });
    const anfrageId = anfrage.id;

    // Newsletter-Anmeldung dauerhaft speichern (unabhängig von der Anfrage)
    if (data.newsletter) {
      await prisma.newsletterAbonnent.upsert({
        where: { email: data.email },
        update: { vorname: data.vorname, nachname: data.nachname, plz: data.plz },
        create: { email: data.email, vorname: data.vorname, nachname: data.nachname, plz: data.plz, quelle: 'formular' },
      }).catch(() => { /* Fehler nicht an User weitergeben */ });
    }

    void (async () => {
      try {
        const { prisma: db } = await import('@/lib/prisma');
        const rows = await db.einstellung.findMany();
        const settings: Record<string, string> = {};
        rows.forEach((r: { id: string; wert: string }) => { settings[r.id] = r.wert; });

        const { sendEmail } = await import('@/lib/email');
        const { eingangsbestaetigung, neueAnfrageIntern } = await import('@/services/emailTemplates');
        const firmaEmail = settings['email'] || process.env.NEXT_PUBLIC_FIRMA_EMAIL || 'info@autoankauf-baden.de';

        const kundenMail = eingangsbestaetigung({
          vorname: data.vorname,
          marke: data.marke,
          modell: data.modell,
          kilometerstand: data.kilometerstand,
          erstzulassungJahr: data.erstzulassungJahr,
        });
        const internMail = neueAnfrageIntern({
          vorname: data.vorname,
          nachname: data.nachname,
          marke: data.marke,
          modell: data.modell,
          kilometerstand: data.kilometerstand,
          plz: data.plz,
          anfrageId,
          telefon: data.telefon,
        });
        await sendEmail({ to: data.email, ...kundenMail, _typ: 'eingangsbestaetigung', _anfrageId: anfrageId });
        await sendEmail({ to: firmaEmail, ...internMail, _typ: 'intern_benachrichtigung', _anfrageId: anfrageId });

        // Benachrichtigung: alle aktiven Mitarbeiter per konfiguriertem Kanal
        const { prisma: prismaWa } = await import('@/lib/prisma');
        const { buildNeueAnfrageMessage } = await import('@/lib/callmebot');
        const { notifyMitarbeiter } = await import('@/lib/notify');
        const msg = buildNeueAnfrageMessage({
          marke: data.marke,
          modell: data.modell,
          vorname: data.vorname,
          nachname: data.nachname,
          plz: data.plz,
          dashboardUrl: `${process.env.NEXT_PUBLIC_BASE_URL || 'https://autoankauf-baden.de'}/dashboard/anfragen/${anfrageId}`,
        });
        const aktiveMitarbeiter = await prismaWa.mitarbeiter.findMany({ where: { aktiv: true } });
        const subject = `[AAB] Neue Anfrage: ${data.marke} ${data.modell} (${data.vorname} ${data.nachname})`;
        await Promise.allSettled(aktiveMitarbeiter.map((m: import('@/lib/notify').MitarbeiterForNotify) => notifyMitarbeiter(m, msg, subject, { anfrageId })));
      } catch {
        // Benachrichtigungsfehler nicht an User weitergeben
      }
    })();

    return NextResponse.json({ success: true, id: anfrageId });
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json({ error: 'Ungueltige Daten', details: error.issues }, { status: 400 });
    }
    console.error('[/api/anfrage] Fehler:', error)
    return NextResponse.json({ error: 'Interner Fehler' }, { status: 500 });
  }
}
