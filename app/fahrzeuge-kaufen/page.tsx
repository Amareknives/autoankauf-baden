import type { Metadata } from 'next'
import Link from 'next/link'
import HeroImage from '@/components/ui/HeroImage'
import Logo from '@/components/layout/Logo'
import { PhotoMosaic, ServiceCardGrid } from '@/components/fahrzeuge-kaufen/GalleryViewer'
import { AUTOHAUS_URL, AUTOHAUS_FAHRZEUGE_URL, AUTOHAUS_NAME, AUTOHAUS_ADRESSE, WHATSAPP } from '@/lib/constants'
import {
  Car, RefreshCw, Wrench, MapPin, Clock,
  ExternalLink, ArrowRight, CheckCircle, Zap, Phone,
} from 'lucide-react'

export const metadata: Metadata = {
  title: 'Fahrzeuge kaufen & Inzahlungnahme – Autohaus Stern | AutoAnkauf Baden',
  description:
    'Fahrzeug verkaufen und direkt neu kaufen – beim Partnerstandort Autohaus Stern in Graben-Neudorf. Inzahlungnahme, große Auswahl, faire Werkstattpreise. Alles aus einer Hand.',
  robots: { index: true, follow: true },
  alternates: { canonical: '/fahrzeuge-kaufen' },
}

const jsonLd = {
  '@context': 'https://schema.org',
  '@type': 'AutoDealer',
  name: AUTOHAUS_NAME,
  url: AUTOHAUS_URL,
  address: {
    '@type': 'PostalAddress',
    streetAddress: 'Heidelberger Str. 4',
    postalCode: '76676',
    addressLocality: 'Graben-Neudorf',
    addressRegion: 'Baden-Württemberg',
    addressCountry: 'DE',
  },
  openingHoursSpecification: [
    { '@type': 'OpeningHoursSpecification', dayOfWeek: ['Monday','Tuesday','Wednesday','Thursday','Friday'], opens: '09:00', closes: '18:00' },
    { '@type': 'OpeningHoursSpecification', dayOfWeek: ['Saturday'], opens: '09:00', closes: '14:00' },
  ],
  sameAs: ['https://autoankauf-baden.de'],
}

const USPS = [
  {
    icon: Car,
    title: 'Große Fahrzeugauswahl',
    desc: 'Pkw aller Marken und Preisklassen – gepflegt, geprüft und sofort verfügbar.',
    color: '#000000',
    bgColor: '#EAB308',
  },
  {
    icon: RefreshCw,
    title: 'Einfache Inzahlungnahme',
    desc: 'Dein Altfahrzeug als direkte Anzahlung – faire Bewertung, kein Aufwand.',
    color: '#000000',
    bgColor: '#EAB308',
  },
  {
    icon: Wrench,
    title: 'Werkstatt & Komplettservice',
    desc: 'Wartung, Reparatur & TÜV-Service – kompetent, fair und direkt vor Ort.',
    color: '#000000',
    bgColor: '#EAB308',
  },
]

const GALLERY_IMAGES = [
  { src: '/autohaus/ahg1.webp', alt: 'Autohaus Stern Graben-Neudorf – Ausstellungsgelände' },
  { src: '/autohaus/ahg2.webp', alt: 'Autohaus Stern – Fahrzeugangebot' },
  { src: '/autohaus/ahg3.webp', alt: 'Autohaus Stern – Fahrzeugauswahl' },
  { src: '/autohaus/ahg4.webp', alt: 'Autohaus Stern – Außengelände' },
]

const SERVICE_CARDS = [
  {
    img: '/autohaus/oelwechsel.jpeg',
    title: 'Ölwechsel',
    desc: 'Motoröl + Filtercheck + Sichtprüfung – alles in einem. Schnell, günstig, zuverlässig.',
    badge: 'Angebot',
  },
  {
    img: '/autohaus/tuev.jpeg',
    title: 'TÜV-Vorbereitung',
    desc: 'Wir checken alles durch, bevor es zur Hauptuntersuchung geht. Kein böses Erwachen.',
    badge: 'Service',
  },
  {
    img: '/autohaus/bremsen-angebot.jpeg',
    title: 'Bremsen-Check & -Wechsel',
    desc: 'Bremsbeläge, Scheiben, Bremsflüssigkeit – deine Sicherheit zu fairen Preisen.',
    badge: 'Angebot',
  },
]

const HOURS = [
  { day: 'Mo – Fr', time: '09:00 – 18:00 Uhr' },
  { day: 'Samstag', time: '09:00 – 14:00 Uhr' },
  { day: 'Sonntag', time: 'Geschlossen' },
]

const AUTOHAUS_HERO = ['/autohaus/1.webp', '/autohaus/2.webp', '/autohaus/3.webp', '/autohaus/4.webp']

export default function FahrzeugeKaufenPage() {
  const heroSrc = AUTOHAUS_HERO[Math.floor(Math.random() * AUTOHAUS_HERO.length)]

  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />

      <div className="min-h-screen bg-[#F8FAFC]">

        {/* ─── Hero ─── */}
        <section className="relative overflow-hidden flex items-center" style={{ minHeight: 'clamp(280px, 40vw, 400px)' }}>
          <div className="absolute inset-0 bg-[#0B1120]">
            <HeroImage src={heroSrc} position="center" />
            <div className="absolute inset-0" style={{ background: 'linear-gradient(135deg, rgba(10,10,10,0.96) 0%, rgba(3,105,161,0.75) 55%, rgba(15,23,42,0.88) 100%)' }} />
          </div>
          <div className="relative z-10 w-full">
            <div className="container mx-auto px-5 md:px-6 lg:px-8 py-14 md:py-18">
              <div className="max-w-[580px]">
                <div className="inline-flex items-center gap-2 bg-white/10 backdrop-blur-sm border border-white/20 rounded-full px-4 py-2 mb-5">
                  <span className="w-2 h-2 rounded-full bg-[#22C55E] animate-pulse flex-shrink-0" />
                  <span className="text-white text-sm font-medium">Unser Verkaufsstandort · Graben-Neudorf</span>
                </div>
                <h1 className="font-black text-white mb-4 leading-tight" style={{ fontSize: 'clamp(26px, 3.8vw, 42px)' }}>
                  Direkt neu kaufen –<br />Altfahrzeug verrechnen
                </h1>
                <p className="text-white/80 text-[15px] leading-relaxed max-w-lg mb-8">
                  Du möchtest dein Auto verkaufen und gleichzeitig ein neues finden?
                  <strong className="text-white"> AutoAnkauf Baden</strong> macht das einfach –
                  fairer Ankauf, große Fahrzeugauswahl und Werkstattservice –
                  direkt bei unserem AutoAnkauf Baden Verkaufsstandort{' '}
                  <strong className="text-white">Autohaus Stern</strong> in Graben-Neudorf.
                  Alles in einem Vorgang, ein Ansprechpartner.
                </p>
                <div className="flex flex-wrap gap-3">
                  <a
                    href={AUTOHAUS_FAHRZEUGE_URL}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-2 px-6 py-3.5 font-bold rounded-xl transition-opacity duration-200 hover:opacity-90 text-sm min-h-[48px]"
                    style={{ backgroundColor: '#EAB308', color: '#0F172A' }}
                  >
                    Direkt kaufen
                    <ExternalLink size={15} />
                  </a>
                  <Link
                    href="/fahrzeug-verkaufen"
                    className="inline-flex items-center gap-2 px-6 py-3.5 bg-white hover:bg-[#F0F9FF] text-[#0369A1] font-bold rounded-xl transition-colors duration-200 text-sm min-h-[48px]"
                  >
                    Auto verkaufen
                    <ArrowRight size={15} />
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* ─── Logo-Bar ─── */}
        <div style={{ backgroundColor: '#212121' }}>
          <div className="container mx-auto px-4 md:px-6 lg:px-8 max-w-4xl">
            <div className="flex items-center gap-8 py-5 flex-wrap">
              <Logo variant="light" height={45} showText darkTagline />
              <div className="h-10 w-px" style={{ backgroundColor: 'rgba(255,255,255,0.15)' }} />
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src="/autohaus/logo_autuhausstern-graben.webp"
                alt="Autohaus Stern Graben-Neudorf"
                style={{ height: 45, width: 'auto', objectFit: 'contain' }}
              />
            </div>
          </div>
        </div>

        {/* ─── USPs ─── */}
        <div className="container mx-auto px-4 md:px-6 lg:px-8 max-w-4xl py-12">
          <div className="mb-8">
            <p className="text-xs font-bold uppercase tracking-widest mb-1.5" style={{ color: '#EAB308' }}>Rundum-Sorglos</p>
            <h2 className="text-[22px] md:text-[26px] font-extrabold text-[#0F172A] leading-snug">
              Dein kompletter Partner –<br className="hidden sm:block" /> Ankauf, Fahrzeugkauf & Service
            </h2>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 md:gap-4">
            {USPS.map(({ icon: Icon, title, desc, color, bgColor }) => (
              <div key={title} className="bg-white rounded-2xl border border-[#E2EDF7] p-5 flex gap-4 items-start">
                <div
                  className="rounded-xl flex items-center justify-center flex-shrink-0 mt-0.5"
                  style={{ backgroundColor: bgColor, width: 40, height: 40, minWidth: 40 }}
                >
                  <Icon size={20} strokeWidth={2.2} style={{ color }} />
                </div>
                <div>
                  <h3 className="font-bold text-[#0F172A] text-[15px] mb-1 leading-snug">{title}</h3>
                  <p className="text-sm text-[#64748B] leading-relaxed">{desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* ─── Foto-Mosaic ─── */}
        <div className="container mx-auto px-4 md:px-6 lg:px-8 max-w-4xl pb-12">
          <div className="flex items-center justify-between mb-4">
            <div>
              <p className="text-xs font-bold uppercase tracking-widest mb-0.5" style={{ color: '#EAB308' }}>Einblick</p>
              <h2 className="text-lg font-bold text-[#0F172A]">Autohaus Stern · Graben-Neudorf</h2>
              <p className="text-sm text-[#64748B] mt-1 max-w-lg">
                Komm vorbei und überzeug dich selbst – große Fahrzeugauswahl, persönliche Beratung und direkte Inzahlungnahme deines Altfahrzeugs.
              </p>
            </div>
            <span className="text-xs text-[#64748B] hidden sm:block">Zum Vergrößern klicken</span>
          </div>
          <PhotoMosaic images={GALLERY_IMAGES} />
        </div>

        {/* ─── Werkstatt & Service ─── */}
        <div className="py-14" style={{ backgroundColor: '#18181B' }}>
          <div className="container mx-auto px-4 md:px-6 lg:px-8 max-w-4xl">
            <div className="flex items-center gap-2 mb-2">
              <div className="w-6 h-6 rounded-md bg-[#EAB308] flex items-center justify-center">
                <Zap size={13} color="#000" strokeWidth={2.5} />
              </div>
              <p className="text-xs font-bold uppercase tracking-widest text-[#EAB308]">Werkstatt & Service</p>
            </div>
            <div className="flex flex-col sm:flex-row sm:items-end sm:justify-between gap-4 mb-8">
              <h2 className="text-[22px] md:text-[26px] font-extrabold text-white leading-snug">
                Faire Preise.<br className="sm:hidden" /> Echter Service. Echter Ansprechpartner.
              </h2>
              <a
                href={AUTOHAUS_FAHRZEUGE_URL}
                target="_blank"
                rel="noopener noreferrer"
                className="flex-shrink-0 inline-flex items-center gap-2 px-5 py-3 bg-[#EAB308] hover:bg-[#ca9a07] text-black font-bold rounded-xl transition-colors duration-200 text-sm min-h-[44px]"
              >
                Alle Angebote
                <ExternalLink size={14} />
              </a>
            </div>
            <ServiceCardGrid cards={SERVICE_CARDS} />
          </div>
        </div>

        {/* ─── Partner-Infokarte ─── */}
        <div className="container mx-auto px-4 md:px-6 lg:px-8 max-w-4xl py-12">
          <div className="bg-white rounded-2xl border border-[#E2EDF7] overflow-hidden">

            {/* Header – dunkel wie Sidebar */}
            <div className="px-6 py-6 flex items-start justify-between gap-4" style={{ backgroundColor: '#212121', borderTop: '5px solid #212121', borderBottom: '5px solid #212121' }}>
              <div>
                <p className="text-[10px] font-bold uppercase tracking-widest mb-1" style={{ color: '#EAB308' }}>Unser Verkaufsstandort</p>
                <h2 className="text-[18px] md:text-[20px] font-extrabold leading-snug" style={{ color: '#FFFFFF' }}>{AUTOHAUS_NAME}</h2>
                <p className="text-sm mt-0.5" style={{ color: '#FB6F6F' }}>{AUTOHAUS_ADRESSE}</p>
              </div>
              {/* Logo direkt auf dunklem Hintergrund */}
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src="/autohaus/logo_autuhausstern-graben.webp"
                alt="Autohaus Stern"
                style={{ height: 36, width: 'auto', objectFit: 'contain', flexShrink: 0 }}
              />
            </div>

            {/* Body */}
            <div className="p-6 grid md:grid-cols-2 gap-6">

              {/* Öffnungszeiten */}
              <div>
                <div className="flex items-center gap-2 mb-4">
                  <Clock size={15} className="text-[#0369A1]" />
                  <span className="font-bold text-[#0F172A] text-sm">Öffnungszeiten</span>
                </div>
                <div className="space-y-2">
                  {HOURS.map(({ day, time }) => (
                    <div key={day} className="flex justify-between text-sm pb-2 border-b border-[#F1F5F9] last:border-0 last:pb-0">
                      <span className="text-[#64748B]">{day}</span>
                      <span className={`font-semibold ${time === 'Geschlossen' ? 'text-[#94A3B8]' : 'text-[#0F172A]'}`}>{time}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Adresse + Vorteile */}
              <div>
                <div className="flex items-center gap-2 mb-4">
                  <MapPin size={15} className="text-[#0369A1]" />
                  <span className="font-bold text-[#0F172A] text-sm">Adresse & Anfahrt</span>
                </div>
                <p className="text-sm text-[#64748B] mb-3 leading-relaxed">
                  Heidelberger Str. 4<br />76676 Graben-Neudorf
                </p>
                <a
                  href={`https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(AUTOHAUS_ADRESSE)}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-1.5 text-[13px] text-[#0369A1] font-semibold hover:text-[#0EA5E9] transition-colors duration-200 mb-5"
                >
                  <MapPin size={12} />
                  In Google Maps öffnen
                </a>
                <div className="space-y-2">
                  {[
                    'Große Fahrzeugauswahl – alle Marken',
                    'Inzahlungnahme direkt möglich',
                    'Eigene Werkstatt & TÜV-Service',
                  ].map(f => (
                    <div key={f} className="flex items-center gap-2">
                      <CheckCircle size={13} className="text-[#22C55E] flex-shrink-0" />
                      <span className="text-xs text-[#64748B]">{f}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* CTAs */}
            <div className="px-6 pb-6 flex flex-col sm:flex-row gap-3">
              <a
                href={AUTOHAUS_FAHRZEUGE_URL}
                target="_blank"
                rel="noopener noreferrer"
                className="flex-1 inline-flex items-center justify-center gap-2 bg-[#FB6F6F] hover:bg-[#f95c5c] text-white font-bold text-[15px] px-6 py-4 rounded-xl transition-colors duration-200 min-h-[52px]"
              >
                Alle Fahrzeuge ansehen
                <ExternalLink size={16} />
              </a>
              <Link
                href="/fahrzeug-verkaufen"
                className="flex-1 inline-flex items-center justify-center gap-2 bg-[#F8FAFC] hover:bg-[#E2EDF7] border border-[#E2EDF7] text-[#0F172A] font-bold text-[15px] px-6 py-4 rounded-xl transition-colors duration-200 min-h-[52px]"
              >
                Dein Auto verkaufen
                <ArrowRight size={16} />
              </Link>
            </div>
          </div>

          {/* ─── CTA Banner ─── */}
          <div className="mt-6 rounded-2xl p-6 flex flex-col sm:flex-row items-center gap-4 justify-between" style={{ backgroundColor: '#212121' }}>
            <div className="flex items-start gap-3">
              <Phone size={20} style={{ color: '#EAB308', flexShrink: 0, marginTop: 2 }} />
              <div>
                <p className="font-bold text-white mb-0.5">Fragen zum Fahrzeugkauf oder zur Inzahlungnahme?</p>
                <p className="text-sm" style={{ color: 'rgba(255,255,255,0.6)' }}>
                  <strong style={{ color: '#EAB308' }}>AutoAnkauf Baden</strong> berät dich persönlich – wir begleiten dich vom Verkauf bis zum neuen Auto.
                </p>
              </div>
            </div>
            <a
              href={`https://wa.me/${WHATSAPP.replace(/\D/g, '')}`}
              target="_blank"
              rel="noopener noreferrer"
              className="flex-shrink-0 inline-flex items-center gap-2 px-6 py-3 font-bold rounded-xl transition-opacity duration-200 hover:opacity-90 text-sm min-h-[48px] whitespace-nowrap"
              style={{ backgroundColor: '#EAB308', color: '#0F172A' }}
            >
              Kostenlos anfragen →
            </a>
          </div>
        </div>

      </div>
    </>
  )
}
