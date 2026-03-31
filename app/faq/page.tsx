import type { Metadata } from 'next'
import Link from 'next/link'
import HeroImage from '@/components/ui/HeroImage'
import { getRandomHeroSrc } from '@/lib/heroImages'
import FaqPageAccordion from '@/components/faq/FaqPageAccordion'
import { TELEFON } from '@/lib/constants'

export const metadata: Metadata = {
  title: 'FAQ – Häufige Fragen zum Autoankauf | AutoAnkauf-Baden',
  description:
    'Alle Antworten zum Autoankauf in Baden: Wie funktioniert der Prozess, wie schnell bekomme ich ein Angebot, was kostet es? Jetzt informieren.',
}

export default function FaqPage() {
  const heroSrc = getRandomHeroSrc()

  return (
    <div className="min-h-screen bg-[#F8FAFC]">

      {/* Hero Banner – gleiche Struktur wie /so-funktionierts */}
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
                <span className="text-white text-sm font-medium">Häufige Fragen</span>
              </div>

              <h1
                className="font-black text-white mb-4 leading-tight"
                style={{ fontSize: 'clamp(26px, 3.5vw, 38px)' }}
              >
                Alles was du wissen musst
              </h1>

              <p className="text-white/85 text-base leading-relaxed max-w-lg mb-7">
                Antworten auf die häufigsten Fragen zum Autoankauf. Nicht dabei? Ruf uns einfach an.
              </p>

              {TELEFON && (
                <a
                  href={`tel:${TELEFON}`}
                  className="inline-flex items-center gap-2 px-7 py-3.5 bg-white/15 hover:bg-white/25 border border-white/30 text-white font-semibold rounded-xl transition-colors duration-200 text-sm min-h-[48px] backdrop-blur-sm"
                >
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                  </svg>
                  Jetzt anrufen
                </a>
              )}
            </div>
          </div>
        </div>
      </section>

      {/* FAQ Content */}
      <div className="container mx-auto px-4 md:px-6 lg:px-8 max-w-4xl py-12">
        <FaqPageAccordion />

        {/* CTA */}
        <div className="mt-12 bg-white border border-[#E2EDF7] rounded-2xl p-8">
          <div className="flex flex-col sm:flex-row items-center gap-6 justify-between">
            <div>
              <h3 className="text-lg font-bold text-[#0F172A] mb-1">Frage nicht dabei?</h3>
              <p className="text-[#64748B] text-sm">
                Ruf uns direkt an oder fordere gleich dein kostenloses Angebot an.
              </p>
            </div>
            <div className="flex flex-col sm:flex-row gap-3 flex-shrink-0">
              {TELEFON && (
                <a
                  href={`tel:${TELEFON}`}
                  className="inline-flex items-center justify-center gap-2 px-5 py-3 border border-[#E2EDF7] hover:border-[#0369A1] text-[#0369A1] font-semibold rounded-xl transition-colors duration-200 min-h-[48px] text-sm"
                >
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                  </svg>
                  Anrufen
                </a>
              )}
              <Link
                href="/fahrzeug-verkaufen"
                className="inline-flex items-center justify-center gap-2 px-5 py-3 bg-[#FB6F6F] hover:bg-[#f95c5c] text-white font-semibold rounded-xl transition-colors duration-200 min-h-[48px] text-sm"
              >
                Angebot anfordern →
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
