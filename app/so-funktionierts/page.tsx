import type { Metadata } from 'next'
import Link from 'next/link'
import HeroImage from '@/components/ui/HeroImage'
import { getRandomHeroSrc } from '@/lib/heroImages'
import { ClipboardList, MessageCircle, Banknote, Zap, BadgeEuro, Gift, Car, Handshake, FileText, Check } from 'lucide-react'

export const metadata: Metadata = {
  title: 'So funktioniert der Autoankauf | AutoAnkauf-Baden',
  description:
    'In 3 einfachen Schritten zum Angebot: Formular ausfüllen, persönliches Angebot per E-Mail erhalten, Termin & Barzahlung. Autoankauf in Baden – fair & unkompliziert.',
}

const schritte = [
  {
    num: '01',
    icon: <ClipboardList size={32} strokeWidth={2.5} />,
    titel: 'Fahrzeug beschreiben',
    dauer: '~2 Minuten',
    beschreibung:
      'Füll unser kurzes Formular aus: Marke, Modell, Kilometerstand, Baujahr und Zustand. Fotos helfen uns bei einer genaueren Einschätzung, sind aber optional. Das dauert keine 2 Minuten.',
    details: [
      'Fahrzeugdaten & Kilometerstand',
      'Zustand und bekannte Mängel',
      'Deine Kontaktdaten',
      'Fotos hochladen (optional)',
    ],
    cta: { label: 'Jetzt Formular ausfüllen →', href: '/fahrzeug-verkaufen' },
    farbe: 'bg-[#0369A1]',
    hellfarbe: 'bg-[#E8F4FD]',
    textfarbe: 'text-[#0369A1]',
  },
  {
    num: '02',
    icon: <MessageCircle size={32} strokeWidth={2.5} />,
    titel: 'Persönliches Angebot per E-Mail',
    dauer: '2–3 Stunden*',
    beschreibung:
      'Wir prüfen deine Angaben persönlich und erstellen auf Basis aktueller Marktdaten ein faires, individuelles Angebot – kein Callcenter, kein Automatismus. Du erhältst dein Angebot direkt per E-Mail.',
    details: [
      'Angebot per E-Mail in 2–3 Stunden*',
      'Faire Preisermittlung nach Marktdaten',
      'Individuell geprüft – kein Automat',
      'Angebot gilt 7 Tage – kein Druck',
    ],
    cta: null,
    farbe: 'bg-[#0EA5E9]',
    hellfarbe: 'bg-[#F0F9FF]',
    textfarbe: 'text-[#0EA5E9]',
  },
  {
    num: '03',
    icon: <Banknote size={32} strokeWidth={2.5} />,
    titel: 'Termin vorschlagen & kassieren',
    dauer: 'Nach deinem Wunsch',
    beschreibung:
      'Gefällt dir das Angebot? Schick uns einfach 1–2 Terminvorschläge – wir kommen zu dir, treffen uns an einem Wunschort oder du kommst direkt zu uns. Nach kurzer Prüfung zahlen wir sofort bar.',
    details: [
      'Du wählst Ort & Termin',
      'Kostenlose Abholung bei dir',
      'Barzahlung direkt vor Ort',
      'Kaufvertrag & Abmeldung inklusive',
    ],
    cta: null,
    farbe: 'bg-[#FB6F6F]',
    hellfarbe: 'bg-[#FFE4E4]',
    textfarbe: 'text-[#FB6F6F]',
  },
]

const vorteile = [
  { icon: <Zap size={22} strokeWidth={2.5} color="#0369A1" />, titel: 'Schnell', text: 'Angebot in 2–3 Std.*, Abholung nach Wunsch' },
  { icon: <BadgeEuro size={22} strokeWidth={2.5} color="#0369A1" />, titel: 'Fair', text: 'Preise basierend auf aktuellen Marktdaten' },
  { icon: <Gift size={22} strokeWidth={2.5} color="#0369A1" />, titel: 'Kostenlos', text: 'Kein Risiko, keine versteckten Gebühren' },
  { icon: <Car size={22} strokeWidth={2.5} color="#0369A1" />, titel: 'Flexibel', text: 'Alle Marken, alle Zustände, gesamte Region' },
  { icon: <Handshake size={22} strokeWidth={2.5} color="#0369A1" />, titel: 'Vertrauenswürdig', text: '6 Jahre Erfahrung im Autoankauf' },
  { icon: <FileText size={22} strokeWidth={2.5} color="#0369A1" />, titel: 'Vollservice', text: 'Kaufvertrag und Abmeldung übernehmen wir' },
]

export default function SoFunktioniertSPage() {
  const heroSrc = getRandomHeroSrc()

  return (
    <div className="min-h-screen bg-[#F8FAFC]">

      {/* Hero */}
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
                <span className="text-white text-sm font-medium">Einfach & transparent</span>
              </div>
              <h1 className="font-black text-white mb-4 leading-tight" style={{ fontSize: 'clamp(26px, 3.5vw, 38px)' }}>
                In 3 Schritten zum Angebot
              </h1>
              <p className="text-white/85 text-base leading-relaxed max-w-lg mb-7">
                Kein Inserieren, kein Stress. Formular ausfüllen – Angebot per E-Mail – fertig.
              </p>
              <Link
                href="/fahrzeug-verkaufen"
                className="inline-flex items-center justify-center px-7 py-3.5 bg-[#FB6F6F] hover:bg-[#f95c5c] text-white font-bold rounded-xl transition-colors duration-200 text-sm min-h-[48px]"
              >
                Jetzt kostenloses Angebot holen
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Steps */}
      <div className="container mx-auto px-4 md:px-6 lg:px-8 max-w-4xl py-14">
        <div className="space-y-6 md:space-y-8">
          {schritte.map((schritt, i) => (
            <div key={schritt.num} className="relative">
              {/* Connector line desktop */}
              {i < schritte.length - 1 && (
                <div className="hidden md:block absolute left-[52px] top-[104px] w-0.5 h-[calc(100%+24px)] bg-[#E2EDF7] z-0" />
              )}

              <div className="relative z-10 bg-white rounded-2xl border border-[#E2EDF7] overflow-hidden shadow-sm">
                <div className="flex flex-col md:flex-row">

                  {/* Left: Number + Icon */}
                  <div className={`${schritt.hellfarbe} px-6 py-5 md:p-10 flex flex-row md:flex-col items-center md:items-start gap-4 md:gap-3 md:min-w-[160px]`}>
                    <span className={`text-[40px] md:text-[44px] font-black ${schritt.textfarbe} leading-none`}>
                      {schritt.num}
                    </span>
                    <div className={schritt.textfarbe}>{schritt.icon}</div>
                    {/* Mobile: Titel & Badge inline */}
                    <div className="md:hidden flex-1 min-w-0">
                      <p className="font-bold text-[#0F172A] text-base leading-snug">{schritt.titel}</p>
                      <span className={`inline-block mt-1 text-[11px] font-semibold px-2.5 py-0.5 rounded-full ${schritt.hellfarbe} ${schritt.textfarbe} border border-current/20`}>
                        {schritt.dauer}
                      </span>
                    </div>
                  </div>

                  {/* Right: Content */}
                  <div className="p-6 md:p-8 flex-1">
                    {/* Desktop: Titel & Badge */}
                    <div className="hidden md:flex flex-wrap items-start gap-3 mb-3">
                      <h2 className="text-xl font-bold text-[#0F172A]">{schritt.titel}</h2>
                      <span className={`text-xs font-semibold px-3 py-1 rounded-full ${schritt.hellfarbe} ${schritt.textfarbe}`}>
                        {schritt.dauer}
                      </span>
                    </div>
                    <p className="text-[#64748B] text-sm leading-relaxed mb-5">
                      {schritt.beschreibung}
                    </p>
                    <ul className="grid sm:grid-cols-2 gap-2 mb-5">
                      {schritt.details.map(d => (
                        <li key={d} className="flex items-center gap-2 text-sm text-[#64748B]">
                          <span className={`w-5 h-5 rounded-full ${schritt.farbe} flex items-center justify-center flex-shrink-0`}>
                            <Check size={12} strokeWidth={2.5} color="white" />
                          </span>
                          {d}
                        </li>
                      ))}
                    </ul>
                    {schritt.cta && (
                      <Link
                        href={schritt.cta.href}
                        className={`inline-flex items-center gap-2 px-5 py-2.5 rounded-xl text-sm font-semibold text-white transition-colors duration-200 min-h-[44px] ${schritt.farbe} hover:opacity-90`}
                      >
                        {schritt.cta.label}
                      </Link>
                    )}
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* * Fußnote */}
        <div className="mt-6 rounded-xl border border-[#E2EDF7] bg-white px-5 py-4">
          <p className="text-xs text-[#64748B] leading-relaxed">
            <span className="font-semibold text-[#0F172A]">* Reaktionszeit:</span>{' '}
            Wir bearbeiten Anfragen persönlich –{' '}
            <strong className="text-[#0F172A]">Mo–Fr 7:30–18:30 Uhr</strong> und{' '}
            <strong className="text-[#0F172A]">Sa 8:00–15:00 Uhr</strong>.
            Außerhalb der Geschäftszeiten eingereichte Anfragen werden am nächsten Werktag bearbeitet.
          </p>
        </div>

        {/* Vorteile */}
        <div className="mt-20 pt-10 border-t border-[#E2EDF7]">
          <h2 className="text-2xl font-bold text-[#0F172A] text-center mb-2">
            Warum AutoAnkauf-Baden?
          </h2>
          <p className="text-sm text-[#64748B] text-center mb-8">Seit 6 Jahren fair, schnell und zuverlässig in der Region.</p>
          <div className="grid sm:grid-cols-2 md:grid-cols-3 gap-4">
            {vorteile.map(v => (
              <div key={v.titel} className="bg-white rounded-xl border border-[#E2EDF7] p-5 flex gap-4 shadow-sm">
                <span className="flex-shrink-0 mt-0.5">{v.icon}</span>
                <div>
                  <p className="font-semibold text-[#0F172A] text-sm mb-0.5">{v.titel}</p>
                  <p className="text-xs text-[#64748B] leading-relaxed">{v.text}</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* FAQ Teaser */}
        <div className="mt-10 bg-[#E8F4FD] rounded-2xl p-6 flex flex-col sm:flex-row items-center gap-4 justify-between">
          <div>
            <p className="font-bold text-[#0F172A] mb-1">Noch Fragen?</p>
            <p className="text-sm text-[#64748B]">In unserer FAQ findest du alle Antworten.</p>
          </div>
          <Link
            href="/faq"
            className="flex-shrink-0 inline-flex items-center gap-2 px-5 py-3 bg-[#0369A1] hover:bg-[#0284c7] text-white font-semibold rounded-xl transition-colors duration-200 text-sm min-h-[48px]"
          >
            Zur FAQ →
          </Link>
        </div>

        {/* Final CTA */}
        <div className="mt-8 text-center">
          <Link
            href="/fahrzeug-verkaufen"
            className="inline-flex items-center justify-center px-8 py-4 bg-[#FB6F6F] hover:bg-[#f95c5c] text-white font-bold rounded-xl transition-colors duration-200 text-base min-h-[52px]"
          >
            Jetzt kostenlos Angebot anfordern →
          </Link>
          <p className="text-xs text-[#94A3B8] mt-3">100% kostenlos · Unverbindlich · In 2 Min.</p>
        </div>
      </div>
    </div>
  )
}
