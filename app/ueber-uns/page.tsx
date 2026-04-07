import type { Metadata } from 'next'
import Link from 'next/link'
import { Handshake, Zap, Heart, MapPin } from 'lucide-react'
import HeroImageRandom from '@/components/ui/HeroImageRandom'

export const metadata: Metadata = {
  title: 'Über uns – AutoAnkauf-Baden | Dein Autoankauf in Bruchsal',
  description:
    'AutoAnkauf-Baden – seit 6 Jahren fairer Autoankauf in Bruchsal und der ganzen Region Baden. Persönlich, transparent und ohne Umwege.',
  openGraph: { images: [{ url: '/og/og-ueber-uns.webp', width: 1200, height: 630 }] },
  twitter: { card: 'summary_large_image', images: ['/og/og-ueber-uns.webp'] },
}

const werte = [
  {
    icon: <Handshake size={24} strokeWidth={2.5} color="#0369A1" />,
    titel: 'Ehrlichkeit',
    text: 'Wir sagen dir, wie wir den Preis berechnen. Keine versteckten Abzüge, keine Überraschungen beim Termin.',
  },
  {
    icon: <Zap size={24} strokeWidth={2.5} color="#0369A1" />,
    titel: 'Schnelligkeit',
    text: 'Du bekommst dein Angebot in 2–3 Stunden* – persönlich – schnell und fair. Das Geld gibt es sofort beim Termin – bar auf die Hand.',
  },
  {
    icon: <Heart size={24} strokeWidth={2.5} color="#0369A1" />,
    titel: 'Fairness',
    text: 'Wir zahlen faire Marktpreise. Kein Drücken, kein Tricksieren. Wenn das Angebot nicht passt, ist das absolut okay.',
  },
  {
    icon: <MapPin size={24} strokeWidth={2.5} color="#0369A1" />,
    titel: 'Lokalität',
    text: 'Wir sind ein Unternehmen aus Bruchsal. Die Region Baden ist unsere Heimat – hier sind wir bekannt und verankert.',
  },
]

const zahlen = [
  { zahl: '6+', label: 'Jahre Erfahrung' },
  { zahl: '1.000+', label: 'Fahrzeuge angekauft' },
  { zahl: '10', label: 'Städte in der Region' },
  { zahl: '2–3h*', label: 'Angebot garantiert' },
]

export default function UeberUnsPage() {
  return (
    <div className="min-h-screen bg-[#F8FAFC]">
      {/* Hero */}
      <section className="relative overflow-hidden flex items-center" style={{ minHeight: 'clamp(280px, 40vw, 380px)' }}>
        <div className="absolute inset-0 bg-[#0369A1]">
          <HeroImageRandom position="top" />
          <div className="absolute inset-0 hero-overlay" />
        </div>
        <div className="relative z-10 w-full py-16">
          <div className="container mx-auto px-4 md:px-6 lg:px-8 max-w-4xl">
            <div className="inline-flex items-center gap-2 bg-white/10 border border-white/20 rounded-full px-4 py-2 mb-4">
              <span className="text-sm font-semibold text-white">Unser Unternehmen</span>
            </div>
            <h1 className="text-3xl md:text-4xl font-black text-white mb-4 max-w-2xl">
              Autoankauf mit Herz — seit 6 Jahren in Baden
            </h1>
            <p className="text-[#BAE6FD] text-base max-w-xl">
              Wir sind kein anonymes Unternehmen. Wir sind ein Team aus Graben-Neudorf, das Auto kaufen
              einfach, fair und menschlich machen will.
            </p>
          </div>
        </div>
      </section>

      <div className="container mx-auto px-4 md:px-6 lg:px-8 max-w-4xl py-12">

        {/* Story */}
        <div className="bg-white rounded-2xl border border-[#E2EDF7] p-8 md:p-10 mb-8">
          <h2 className="text-2xl font-bold text-[#0F172A] mb-5">Unsere Geschichte</h2>
          <div className="prose prose-sm max-w-none text-[#64748B] leading-relaxed space-y-4">
            <p>
              Die Wurzeln von AutoAnkauf-Baden liegen im{' '}
              <a
                href="https://autohausstern-graben.de/"
                target="_blank"
                rel="noopener noreferrer"
                className="text-[#0369A1] hover:underline font-medium"
              >
                Autohaus Stern Graben-Neudorf
              </a>
              {' '}– einem Betrieb, der seit Jahren für fairen Service und transparente Preise in der
              Region bekannt ist und bis heute erfolgreich besteht.
            </p>
            <p>
              Aus der jahrelangen Erfahrung im Automobilhandel und einer stetig wachsenden Nachfrage
              von Privatpersonen, die ihr Fahrzeug schnell und unkompliziert verkaufen wollten,
              entstand AutoAnkauf-Baden. Ein spezialisiertes Angebot – mit denselben Werten:
              Fairness, Transparenz und persönlicher Kontakt.
            </p>
            <p>
              Heute kaufen wir Fahrzeuge jeder Art in Graben-Neudorf und der gesamten Region Baden
              an – egal ob neuwertig, älter, mit Mängeln oder nicht mehr fahrtüchtig. Kein
              Call-Center, kein automatischer Rechner. Du sprichst direkt mit uns und bekommst ein
              faires Angebot – ohne Druck.
            </p>
            <p>
              Übrigens: Falls du nach dem Verkauf ein anderes Auto suchst, können wir dir über das
              Autohaus Stern direkt etwas Passendes zeigen. Schau einfach mal rein.
            </p>

            {/* Persönliches Zitat */}
            <div className="mt-6 border-l-4 border-[#0369A1] pl-5 py-1">
              <p className="text-[#0F172A] font-medium text-base leading-relaxed">
                „Uns macht einfach alles rund ums Auto Spaß – die Menschen, die Geschichten hinter
                den Fahrzeugen, der Handschlag am Ende. Egal wer kommt, egal was er fährt – wir
                nehmen uns Zeit und zahlen fair. Und wenn's nicht passt, ist das völlig okay.
                Nicht jeder Deal muss sein."
              </p>
              <p className="text-sm text-[#94A3B8] mt-2">— Muhammet Demir</p>
            </div>
          </div>
        </div>

        {/* Zahlen */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
          {zahlen.map(z => (
            <div key={z.label} className="bg-white rounded-xl border border-[#E2EDF7] p-6 text-center">
              <p className="text-3xl font-black text-[#0369A1] mb-1">{z.zahl}</p>
              <p className="text-xs text-[#64748B] font-medium">{z.label}</p>
            </div>
          ))}
        </div>

        {/* Werte */}
        <div className="bg-white rounded-2xl border border-[#E2EDF7] p-8 md:p-10 mb-8">
          <h2 className="text-2xl font-bold text-[#0F172A] mb-6">Was uns ausmacht</h2>
          <div className="grid sm:grid-cols-2 gap-6">
            {werte.map(w => (
              <div key={w.titel} className="flex gap-4">
                <span className="text-2xl flex-shrink-0 mt-0.5">{w.icon}</span>
                <div>
                  <h3 className="font-bold text-[#0F172A] mb-1 text-[15px]">{w.titel}</h3>
                  <p className="text-sm text-[#64748B] leading-relaxed">{w.text}</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Region */}
        <div className="bg-white rounded-2xl border border-[#E2EDF7] p-8 md:p-10 mb-8">
          <h2 className="text-2xl font-bold text-[#0F172A] mb-4">Unser Einsatzgebiet</h2>
          <p className="text-[#64748B] text-sm leading-relaxed mb-5">
            Wir sind in ganz Baden und der Pfalz aktiv. Unser Heimatstandort ist Bruchsal, von
            hier aus fahren wir in die gesamte Region:
          </p>
          <div className="flex flex-wrap gap-2">
            {[
              'Karlsruhe', 'Bruchsal', 'Heidelberg', 'Mannheim', 'Speyer',
              'Pforzheim', 'Rastatt', 'Baden-Baden', 'Ludwigshafen', 'Germersheim',
            ].map(stadt => (
              <Link
                key={stadt}
                href={`/${stadt.toLowerCase().replace(/ü/g, 'ue').replace(/ä/g, 'ae').replace(/ö/g, 'oe')}`}
                className="px-3 py-1.5 bg-[#E8F4FD] text-[#0369A1] text-sm font-medium rounded-lg hover:bg-[#0369A1] hover:text-white transition-colors duration-200"
              >
                {stadt}
              </Link>
            ))}
          </div>
        </div>

        {/* CTA */}
        <div className="bg-[#0369A1] rounded-2xl p-8 md:p-10 text-center">
          <h2 className="text-2xl font-bold text-white mb-3">
            Bereit, dein Auto zu verkaufen?
          </h2>
          <p className="text-[#BAE6FD] text-sm mb-6 max-w-md mx-auto">
            Lern uns kennen – mit einer kostenlosen, unverbindlichen Anfrage. Du bist in guten
            Händen.
          </p>
          <Link
            href="/fahrzeug-verkaufen"
            className="inline-flex items-center justify-center px-8 py-4 bg-[#FB6F6F] hover:bg-[#f95c5c] text-white font-bold rounded-xl transition-colors duration-200 text-base min-h-[52px]"
          >
            Jetzt kostenlos Angebot anfordern →
          </Link>
        </div>
      </div>
    </div>
  )
}
