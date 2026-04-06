import type { Metadata } from 'next';
import AngebotForm from '@/components/form/AngebotForm';
import HeroImage from '@/components/ui/HeroImage';
import { getRandomHeroSrc } from '@/lib/heroImages';
import { Check, Clock, Banknote, Truck, ShieldCheck, Phone } from 'lucide-react';
import BewertungenCarousel from '@/components/ui/BewertungenCarousel';
import Link from 'next/link';

export const metadata: Metadata = {
  title: 'Auto verkaufen – Kostenlos Angebot holen | AutoAnkauf-Baden',
  description:
    'Jetzt Auto verkaufen in Baden: Formular ausfüllen, in 2–3h Angebot erhalten, kostenlose Abholung.',
};

const vorteile = [
  { icon: <Clock size={17} strokeWidth={2.5} color="#0369A1" />, text: 'Angebot in 2–3 Stunden* – persönlich von uns' },
  { icon: <Banknote size={17} strokeWidth={2.5} color="#0369A1" />, text: 'Sofortige Bezahlung bei Abholung' },
  { icon: <Truck size={17} strokeWidth={2.5} color="#0369A1" />, text: 'Kostenlose Abholung bei dir' },
  { icon: <ShieldCheck size={17} strokeWidth={2.5} color="#0369A1" />, text: 'Keine versteckten Kosten' },
  { icon: <Check size={17} strokeWidth={2.5} color="#0369A1" />, text: 'Auch Unfall- & Schadenfahrzeuge' },
  { icon: <Check size={17} strokeWidth={2.5} color="#0369A1" />, text: 'Alle Marken & Laufleistungen' },
]

const stats = [
  { zahl: '1.000+', label: 'Fahrzeuge angekauft' },
  { zahl: '6', label: 'Jahre Erfahrung' },
  { zahl: '2–3h*', label: 'Ø Angebotsdauer' },
  { zahl: '100%', label: 'Kostenlos & unverbindlich' },
]


import { getSiteSettings } from '@/lib/siteSettings'

export default async function FahrzeugVerkaufenPage() {
  const heroSrc = getRandomHeroSrc()
  const settings = await getSiteSettings()
  return (
    <div className="min-h-screen bg-[#F8FAFC]">

      {/* Hero Banner */}
      <section className="relative overflow-hidden flex items-center" style={{ minHeight: 'clamp(280px, 40vw, 380px)' }}>
        <div className="absolute inset-0 bg-[#0369A1]">
          <HeroImage src={heroSrc} position="top" />
          <div className="absolute inset-0 hero-overlay" />
        </div>

        <div className="relative z-10 w-full">
          <div className="container mx-auto px-5 md:px-6 lg:px-8 py-14 md:py-16">
            <div className="max-w-[560px]">
              <div className="inline-flex items-center gap-2 bg-white/10 backdrop-blur-sm border border-white/20 rounded-full px-4 py-2 mb-5">
                <span className="w-2 h-2 rounded-full bg-[#22C55E] animate-pulse flex-shrink-0" />
                <span className="text-white text-sm font-medium">Kostenlos & unverbindlich</span>
              </div>

              <h1
                className="font-black text-white mb-4 leading-tight"
                style={{ fontSize: 'clamp(28px, 4vw, 40px)' }}
              >
                Dein Auto verkaufen – Angebot in 2–3 Stunden
              </h1>

              <p className="text-white/90 text-base md:text-lg mb-6 leading-relaxed">
                Formular ausfüllen, in 2–3 Stunden* Angebot erhalten, kostenlose Abholung.
                Schnell, fair und unverbindlich.
              </p>

              <div className="flex flex-wrap gap-4">
                {['100% kostenlos', 'Unverbindlich', 'Angebot in 2–3 Std.*'].map((label) => (
                  <span key={label} className="flex items-center gap-2 text-white/90 text-sm font-medium">
                    <span className="inline-flex h-5 w-5 items-center justify-center rounded-full bg-[#22C55E] flex-shrink-0">
                      <Check size={12} strokeWidth={2.5} color="white" />
                    </span>
                    {label}
                  </span>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Zweispaltig: Form + Sidebar */}
      <div className="container mx-auto px-4 md:px-6 lg:px-8 max-w-6xl py-12">
        <div className="grid lg:grid-cols-[1fr_380px] gap-10 items-start">

          {/* Form */}
          <div>
            <div className="mb-5 p-4 bg-[#E8F4FD] border border-[#BAE6FD] rounded-xl">
              <p className="text-sm text-[#0F172A] leading-relaxed">
                <span className="sm:hidden">Ca. 2–3 Min. · Antwort in 2–3 Stunden.*</span>
                <span className="hidden sm:inline">Fülle das Formular mit allen relevanten Pflichtfeldern aus, damit wir dir ein faires Angebot machen können.{' '}
                <span className="font-semibold">Dauer: ca. 2–3 Minuten.</span>{' '}
                Du erhältst deine Antwort innerhalb von 2–3 Stunden.*</span>
              </p>
            </div>
            <AngebotForm />
          </div>

          {/* Sticky Sidebar */}
          <aside className="space-y-5 sticky top-6">

            {/* Vorteile */}
            <div className="bg-white border border-[#E2EDF7] rounded-2xl p-6">
              <h2 className="text-lg font-bold text-[#0F172A] mb-4">Warum AutoAnkauf-Baden?</h2>
              <ul className="space-y-3">
                {vorteile.map((v, i) => (
                  <li key={i} className="flex items-center gap-3">
                    <span className="w-8 h-8 rounded-lg bg-[#E8F4FD] flex items-center justify-center flex-shrink-0">
                      {v.icon}
                    </span>
                    <span className="text-sm text-[#0F172A]">{v.text}</span>
                  </li>
                ))}
              </ul>
            </div>

            {/* Stats */}
            <div className="grid grid-cols-2 gap-3">
              {stats.map((s) => (
                <div key={s.label} className="bg-white border border-[#E2EDF7] rounded-xl p-4 text-center">
                  <p className="text-2xl font-black text-[#0369A1]">{s.zahl}</p>
                  <p className="text-xs text-[#64748B] mt-0.5 leading-snug">{s.label}</p>
                </div>
              ))}
            </div>

            {/* Hinweis Reaktionszeit */}
            <p className="text-[11px] text-[#94A3B8] leading-relaxed px-1">
              *Antwortzeit werktags 7:30–18:30 Uhr und samstags 8–15 Uhr. Wir prüfen jede Anfrage persönlich – transparent und fair.
            </p>

            {/* Kundenstimmen */}
            <BewertungenCarousel />

            {/* Direktkontakt */}
            <div className="bg-[#0369A1] rounded-2xl p-5 text-center">
              <p className="text-white font-bold text-sm mb-1">Lieber direkt kontaktieren?</p>
              <div className="text-white/70 text-xs mb-3 space-y-0.5">
                <p>📞 Telefon &amp; 💬 WhatsApp: Mo–Fr 7:30–18:30 · Sa 8–15 Uhr</p>
                <p>✉️ E-Mail: jederzeit – Antwort innerhalb der Geschäftszeiten</p>
              </div>
              <Link
                href={`tel:${settings.telefon}`}
                className="inline-flex items-center gap-2 bg-white text-[#0369A1] font-bold text-sm px-5 py-2.5 rounded-xl hover:bg-white/90 transition-colors duration-200"
              >
                <Phone size={15} strokeWidth={2.5} />
                {settings.telefon}
              </Link>
              <p className="text-white/40 text-[10px] mt-2 leading-relaxed">
                Nachrichten außerhalb der Geschäftszeiten werden am nächsten Werktag beantwortet.
              </p>
            </div>

          </aside>
        </div>
      </div>
    </div>
  );
}
