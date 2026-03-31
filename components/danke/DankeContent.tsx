'use client';

import { useSearchParams } from 'next/navigation';
import { useEffect } from 'react';
import { clearFormAutosave } from '@/hooks/useFormAutosave';
import Link from 'next/link';
import { Check, CheckCircle, MessageCircle, PartyPopper } from 'lucide-react';

export function DankeContent({ waNummerClean }: { waNummerClean: string }) {
  const searchParams = useSearchParams();
  const vorname = searchParams.get('vorname') ?? '';
  const marke = searchParams.get('marke') ?? '';
  const modell = searchParams.get('modell') ?? '';
  const nurEmail = searchParams.get('kontaktWeg') === 'nur_email';

  useEffect(() => {
    clearFormAutosave();
  }, []);

  const whatsappUrl = `https://wa.me/${waNummerClean}?text=${encodeURIComponent('Hallo, ich habe gerade eine Anfrage geschickt und habe noch eine Frage.')}`;

  return (
    <div className="min-h-screen bg-[#F8FAFC] flex items-center justify-center py-16 px-4">
      <div className="w-full max-w-lg text-center">
        {/* Animated checkmark */}
        <div className="mb-8 flex justify-center">
          <div className="relative flex h-24 w-24 items-center justify-center">
            <div className="absolute inset-0 rounded-full bg-[#22C55E] opacity-10 animate-ping" />
            <div className="relative flex h-20 w-20 items-center justify-center rounded-full bg-[#22C55E] shadow-lg">
              <Check size={40} strokeWidth={2.5} color="white" />
            </div>
          </div>
        </div>

        {/* Heading */}
        <h1 className="text-3xl font-bold text-[#0F172A] sm:text-4xl flex items-center justify-center gap-3">
          {vorname ? `Vielen Dank, ${vorname}!` : 'Vielen Dank!'}
          <PartyPopper size={32} strokeWidth={2} className="text-[#FB6F6F] flex-shrink-0" />
        </h1>
        <p className="mt-4 text-[#64748B] text-base sm:text-lg leading-relaxed">
          Wir melden uns innerhalb von{' '}
          <span className="font-semibold text-[#0369A1]">2–3 Stunden*</span> persönlich
          mit deinem Angebot.
        </p>

        {/* Fahrzeug-Box */}
        {marke && modell && (
          <div className="mt-6 rounded-[16px] border border-[#E2EDF7] bg-white px-6 py-5 shadow-sm text-left">
            <p className="text-[11px] font-semibold uppercase tracking-wide text-[#64748B]">
              Dein Fahrzeug
            </p>
            <p className="mt-1 text-xl font-bold text-[#0F172A]">
              {marke} {modell}
            </p>
            <div className="mt-3 flex items-center gap-2">
              <span className="inline-flex items-center gap-1.5 rounded-full bg-[#F0FDF4] px-3 py-1 text-xs font-medium text-[#166534] border border-[#86EFAC]">
                <CheckCircle size={14} strokeWidth={2.5} color="#22C55E" />
                Anfrage eingegangen
              </span>
            </div>
          </div>
        )}

        {/* Next steps */}
        <div className="mt-6 rounded-[16px] border border-[#E2EDF7] bg-white px-6 py-5 shadow-sm text-left">
          <p className="text-sm font-bold text-[#0F172A] mb-3">Wie geht es weiter?</p>
          <ol className="flex flex-col gap-3">
            {[
              { step: 1, text: 'Wir prüfen deine Anfrage sofort.' },
              { step: 2, text: nurEmail
                ? 'Du erhältst innerhalb von 2–3 Stunden* dein persönliches Angebot per E-Mail.'
                : 'Du erhältst innerhalb von 2–3 Stunden* dein persönliches Angebot per E-Mail oder Telefon.' },
              { step: 3, text: 'Bei Einigung holen wir dein Fahrzeug kostenlos ab.' },
            ].map(({ step, text }) => (
              <li key={step} className="flex items-start gap-3">
                <span className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-[#0369A1] text-xs font-bold text-white">
                  {step}
                </span>
                <span className="text-sm text-[#64748B]">{text}</span>
              </li>
            ))}
          </ol>
        </div>

        {/* Hinweis Reaktionszeit */}
        <div className="mt-4 rounded-xl border border-[#E2EDF7] bg-white px-5 py-4 text-left">
          <p className="text-xs font-semibold text-[#0F172A] mb-1.5">Ein kurzer Hinweis</p>
          <p className="text-xs text-[#64748B] leading-relaxed">
            Wir prüfen deine Anfrage persönlich und melden uns schnellstmöglich.
            Wir sind <strong>Mo–Fr 6–18 Uhr</strong> und <strong>Sa 6–13 Uhr</strong> erreichbar.
            E-Mail-Anfragen können jederzeit eingereicht werden – außerhalb der Geschäftszeiten melden wir uns
            am nächsten Werktag. Danke für dein Verständnis! 🙏
          </p>
        </div>

        {/* Actions */}
        <div className="mt-6 flex flex-col gap-3">
          <a
            href={whatsappUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center justify-center gap-2 rounded-[12px] bg-[#25D366] px-6 py-3.5 text-base font-semibold text-white hover:bg-[#1ebe5a] transition-colors duration-200"
          >
            <MessageCircle size={22} strokeWidth={2.5} fill="white" />
            Fragen? Auf WhatsApp schreiben
          </a>

          <Link
            href="/"
            className="inline-flex items-center justify-center gap-2 rounded-[12px] border-2 border-[#E2EDF7] bg-white px-6 py-3.5 text-base font-semibold text-[#0F172A] hover:border-[#0369A1] hover:text-[#0369A1] transition-colors duration-200"
          >
            Zurück zur Startseite
          </Link>
        </div>
      </div>
    </div>
  );
}
