import type { Metadata } from 'next'
import Link from 'next/link'
import HaendlerForm from '@/components/haendler/HaendlerForm'
import { Handshake, RefreshCw, FileText, Zap, Building2, Key, Store, Car, Scale, Truck, ShieldAlert, UserRound } from 'lucide-react'
import fs from 'fs'
import path from 'path'

function getHaendlerHeroSrc(): string {
  const exts = ['webp', 'jpg', 'png']
  for (const ext of exts) {
    if (fs.existsSync(path.join(process.cwd(), 'public', `hero-haendler.${ext}`))) {
      return `/hero-haendler.${ext}`
    }
  }
  return ''
}

export const metadata: Metadata = {
  title: 'Händler-Kooperation | AutoAnkauf-Baden',
  description:
    'Regelmäßig Fahrzeuge abgeben? AutoAnkauf-Baden sucht langfristige Händlerpartner in der Region Baden – auch Unfallwagen und beschädigte Fahrzeuge.',
}

const vorteile = [
  {
    icon: <Handshake size={22} strokeWidth={2.5} color="#0369A1" />,
    titel: 'Langfristige Partnerschaft',
    text: 'Wir suchen keine Einmalkäufe, sondern verlässliche Partner. Hast du regelmäßig Fahrzeuge verfügbar, sind wir die richtige Adresse.',
  },
  {
    icon: <ShieldAlert size={22} strokeWidth={2.5} color="#0369A1" />,
    titel: 'Auch Unfall- & Schadenfahrzeuge',
    text: 'Wir kaufen nicht nur einwandfreie Autos – auch Unfallwagen, Fahrzeuge mit Motorschaden, Hagelschäden oder sonstigen Defekten sind willkommen.',
  },
  {
    icon: <RefreshCw size={22} strokeWidth={2.5} color="#0369A1" />,
    titel: 'Fester Ansprechpartner',
    text: 'Als Kooperationspartner bekommst du einen direkten Ansprechpartner, kurze Wege und schnelle Rückmeldungen ohne langes Hin und Her.',
  },
  {
    icon: <FileText size={22} strokeWidth={2.5} color="#0369A1" />,
    titel: 'Vollständige Dokumentation',
    text: 'Kaufvertrag, Rechnung, Zahlungsbeleg, Abmeldung – wir liefern die vollständige kaufmännische Dokumentation. Alles revisionssicher und buchungsfertig.',
  },
  {
    icon: <Zap size={22} strokeWidth={2.5} color="#0369A1" />,
    titel: 'Sofortige Zahlung',
    text: 'Keine langen Zahlungsziele. Zahlung direkt bei Fahrzeugübergabe – wahlweise per sofortiger Banküberweisung oder in bar. Buchungsbeleg und Kaufvertrag inklusive.',
  },
]

const zielgruppen = [
  { label: 'Autoflotten & Firmenwagen', icon: <Building2 size={18} strokeWidth={2.5} color="#0369A1" /> },
  { label: 'Leasinggesellschaften', icon: <Key size={18} strokeWidth={2.5} color="#0369A1" /> },
  { label: 'Autohäuser & Händler', icon: <Store size={18} strokeWidth={2.5} color="#0369A1" /> },
  { label: 'Mietwagenanbieter', icon: <Car size={18} strokeWidth={2.5} color="#0369A1" /> },
  { label: 'Insolvenzverwalter', icon: <Scale size={18} strokeWidth={2.5} color="#0369A1" /> },
  { label: 'Speditionen & Transporter', icon: <Truck size={18} strokeWidth={2.5} color="#0369A1" /> },
]

export default function HaendlerPage() {
  const heroSrc = getHaendlerHeroSrc()

  return (
    <div className="min-h-screen bg-[#F8FAFC]">
      {/* Hero */}
      <div className="relative bg-[#0F172A] py-16 overflow-hidden">
        {/* Hintergrundbild – subtil durch dunkles Overlay */}
        {heroSrc && (
          // eslint-disable-next-line @next/next/no-img-element
          <img
            src={heroSrc}
            alt=""
            aria-hidden="true"
            className="absolute inset-0 w-full h-full object-cover object-top opacity-20"
          />
        )}
        <div className="relative z-10 container mx-auto px-4 md:px-6 lg:px-8 max-w-5xl">
          <div className="grid md:grid-cols-2 gap-8 items-center">
            <div>
              <div className="inline-flex items-center gap-2 bg-white/10 border border-white/20 rounded-full px-4 py-2 mb-4">
                <span className="text-sm font-semibold text-[#0EA5E9]">B2B Ankauf</span>
              </div>
              <h1 className="text-3xl md:text-4xl font-black text-white mb-4">
                Händler-Kooperation gesucht
              </h1>
              <p className="text-[#94A3B8] text-base mb-6">
                Du hast regelmäßig Fahrzeuge abzugeben – egal ob Leasingrückläufer, Inzahlungnahmen,
                Unfallwagen oder Firmenfahrzeuge? Wir suchen langfristige Partner in der Region Baden.
              </p>
              <div className="flex flex-wrap gap-3">
                {['Unfallwagen', 'Leasingrückläufer', 'Inzahlungnahmen', 'Schadenfahrzeuge'].map(tag => (
                  <span
                    key={tag}
                    className="px-3 py-1.5 bg-white/10 text-white text-sm rounded-full border border-white/20"
                  >
                    {tag}
                  </span>
                ))}
              </div>
              <div className="mt-6 md:hidden">
                <a
                  href="#haendler-formular"
                  className="inline-flex items-center gap-2 px-6 py-3.5 bg-[#FB6F6F] hover:bg-[#f95c5c] text-white font-bold rounded-xl transition-colors text-base w-full justify-center"
                >
                  Jetzt Partnerschaft anfragen ↓
                </a>
              </div>
            </div>

            {/* Quick Stats */}
            <div className="grid grid-cols-2 gap-3">
              {[
                { zahl: '6+', label: 'Jahre Erfahrung' },
                { zahl: 'Sofort', label: 'Zahlung bei Übergabe' },
                { zahl: 'Langfristig', label: 'Partnerschaft' },
                { zahl: '48h', label: 'Rückmeldung' },
              ].map(s => (
                <div key={s.label} className="bg-white/5 border border-white/10 rounded-xl p-4">
                  <p className="text-xl font-black text-[#0EA5E9]">{s.zahl}</p>
                  <p className="text-xs text-[#94A3B8] mt-0.5">{s.label}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4 md:px-6 lg:px-8 max-w-5xl py-12">
        <div className="grid md:grid-cols-[1fr_400px] gap-8 items-start">

          {/* Left: Content */}
          <div className="space-y-8">

            {/* Vorteile */}
            <div className="bg-white rounded-2xl border border-[#E2EDF7] p-8">
              <h2 className="text-xl font-bold text-[#0F172A] mb-6">Was wir dir bieten</h2>
              <div className="space-y-5">
                {vorteile.map(v => (
                  <div key={v.titel} className="flex gap-4">
                    <span className="text-2xl flex-shrink-0">{v.icon}</span>
                    <div>
                      <h3 className="font-bold text-[#0F172A] text-[15px] mb-1">{v.titel}</h3>
                      <p className="text-sm text-[#64748B] leading-relaxed">{v.text}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Zielgruppen */}
            <div className="bg-white rounded-2xl border border-[#E2EDF7] p-8">
              <h2 className="text-xl font-bold text-[#0F172A] mb-5">Für wen ist das gedacht?</h2>
              <div className="grid sm:grid-cols-2 gap-3">
                {zielgruppen.map(z => (
                  <div
                    key={z.label}
                    className="flex items-center gap-3 p-3 bg-[#F8FAFC] rounded-xl border border-[#E2EDF7]"
                  >
                    <span className="text-xl">{z.icon}</span>
                    <span className="text-sm font-medium text-[#0F172A]">{z.label}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Ablauf */}
            <div className="bg-white rounded-2xl border border-[#E2EDF7] p-8">
              <h2 className="text-xl font-bold text-[#0F172A] mb-5">So starten wir zusammen</h2>
              <ol className="space-y-4">
                {[
                  { num: '1', text: 'Kurze Anfrage über das Formular oder per Anruf' },
                  { num: '2', text: 'Wir melden uns innerhalb von 24–48h für ein erstes Gespräch' },
                  { num: '3', text: 'Wir schauen uns deine Fahrzeuge an und machen dir faire Angebote' },
                  { num: '4', text: 'Kaufvertrag, Zahlungsbeleg & sofortige Zahlung per Überweisung oder bar – transparent und buchungsfertig' },
                  { num: '5', text: 'Regelmäßige Zusammenarbeit nach deinen Möglichkeiten' },
                ].map(s => (
                  <li key={s.num} className="flex items-center gap-4">
                    <span className="w-8 h-8 rounded-full bg-[#0369A1] text-white flex items-center justify-center text-sm font-bold flex-shrink-0">
                      {s.num}
                    </span>
                    <span className="text-sm text-[#64748B]">{s.text}</span>
                  </li>
                ))}
              </ol>
            </div>

            {/* Privat CTA */}
            <div className="bg-[#E8F4FD] rounded-xl p-5 flex items-center gap-4">
              <UserRound size={22} strokeWidth={2.5} color="#0369A1" className="flex-shrink-0" />
              <div>
                <p className="font-semibold text-[#0F172A] text-sm">Privatkunde?</p>
                <p className="text-xs text-[#64748B] mt-0.5">
                  Für Privatpersonen haben wir ein eigenes Formular mit sofortigem Angebot.{' '}
                  <Link href="/fahrzeug-verkaufen" className="text-[#0369A1] hover:underline font-medium">
                    Hier entlang →
                  </Link>
                </p>
              </div>
            </div>
          </div>

          {/* Right: Form */}
          <div className="sticky top-6" id="haendler-formular">
            <HaendlerForm />
          </div>
        </div>
      </div>
    </div>
  )
}
