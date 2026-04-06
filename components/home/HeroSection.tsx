'use client'

import Link from 'next/link'
import { gtmEvents } from '@/lib/gtm'
import { useHeroImage } from '@/hooks/useHeroImage'

const HERO_IMAGES = [
  '/hero-home.webp', '/hero-home1.webp', '/hero-home2.webp',
  '/hero-home3.webp', '/hero-home4.webp', '/hero-home5.webp',
  '/hero-home6.webp', '/hero-home7.webp', '/hero-home8.webp',
]

export default function HeroSection() {
  const heroSrc = useHeroImage(HERO_IMAGES)

  const handleCTAClick = () => {
    gtmEvents.form_start({ page: '/' })
  }

  return (
    <section className="relative overflow-hidden flex items-center" style={{ minHeight: 'clamp(360px, 55vw, 440px)' }}>
      {/* Background Image with CSS fallback */}
      <div className="absolute inset-0 bg-[#0369A1]">
        {heroSrc && (
          // eslint-disable-next-line @next/next/no-img-element
          <img
            src={heroSrc}
            alt=""
            aria-hidden="true"
            className="absolute inset-0 w-full h-full object-cover object-center"
            onError={e => { (e.target as HTMLImageElement).style.display = 'none' }}
          />
        )}
        <div className="absolute inset-0 hero-overlay" />
      </div>

      {/* Content */}
      <div className="relative z-10 w-full">
        <div className="container mx-auto px-5 md:px-6 lg:px-8">
          <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-8 py-14 md:py-16 lg:py-20">

            {/* Left Content */}
            <div className="max-w-[520px]">
              {/* Badge */}
              <div className="inline-flex items-center gap-2 bg-white/10 backdrop-blur-sm border border-white/20 rounded-full px-4 py-2 mb-6">
                <span className="w-2 h-2 rounded-full bg-[#22C55E] animate-pulse flex-shrink-0" />
                <span className="text-white text-sm font-medium">Bereits 1.000+ Fahrzeuge angekauft</span>
              </div>

              {/* H1 */}
              <h1
                className="font-black text-white mb-5 leading-tight"
                style={{ fontSize: 'clamp(28px, 4vw, 40px)' }}
              >
                Auto verkaufen in Baden – fair, schnell &amp; persönlich.
              </h1>

              {/* Subtext */}
              <p className="text-white/85 text-base mb-8 leading-relaxed max-w-lg">
                Kein Inserieren, kein Stress. Angebot in 2–3 Stunden*, Bezahlung sofort bar. Wir kaufen in Karlsruhe, Bruchsal, Heidelberg, Mannheim und der ganzen Region Baden.
              </p>

              {/* CTA Buttons */}
              <div className="flex flex-col sm:flex-row gap-3 mb-5">
                <Link
                  href="/fahrzeug-verkaufen"
                  onClick={handleCTAClick}
                  className="inline-flex items-center justify-center px-7 py-4 bg-[#FB6F6F] hover:bg-[#f95c5c] text-white font-bold rounded-xl transition-colors duration-200 text-center min-h-[52px]"
                >
                  Jetzt Angebot anfordern
                </Link>
                <Link
                  href="/so-funktionierts"
                  className="inline-flex items-center justify-center px-7 py-4 border-2 border-white/40 hover:border-white/70 text-white font-semibold rounded-xl transition-colors duration-200 text-center min-h-[52px]"
                >
                  Wie funktioniert&apos;s?
                </Link>
              </div>

              {/* Hint */}
              <p className="text-white/70 text-[13px]">
                ✓ Kostenlos &nbsp;·&nbsp; ✓ Unverbindlich &nbsp;·&nbsp; ✓ 2–3 Std.*
              </p>
              <p className="text-white/45 text-[11px] mt-1.5">
                *Werktags 7:30–18:30 Uhr · Samstag 8–15 Uhr · Wir kümmern uns persönlich um dich
              </p>
            </div>

            {/* Right floating Card — Desktop only */}
            <div className="hidden lg:block flex-shrink-0">
              <div className="bg-white rounded-[18px] shadow-2xl p-7 w-[280px]">
                <p className="text-[11px] font-semibold uppercase tracking-wider text-[#64748B] mb-5">
                  Deine Vorteile
                </p>

                <div className="space-y-4 mb-6">
                  <div className="flex items-center gap-3">
                    <div className="w-9 h-9 rounded-lg bg-[#E8F4FD] flex items-center justify-center flex-shrink-0">
                      <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#0369A1" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                        <path d="M5 17H3a2 2 0 01-2-2V5a2 2 0 012-2h11a2 2 0 012 2v3m-9 7l3 3 6-7" />
                        <rect x="9" y="11" width="14" height="10" rx="2" />
                        <path d="M9 15h.01M13 15h.01M17 15h.01" />
                      </svg>
                    </div>
                    <div>
                      <div className="font-bold text-[#0369A1] text-lg leading-none">1.000+</div>
                      <div className="text-[#64748B] text-xs mt-0.5">Fahrzeuge angekauft</div>
                    </div>
                  </div>

                  <div className="flex items-center gap-3">
                    <div className="w-9 h-9 rounded-lg bg-[#FFE4E4] flex items-center justify-center flex-shrink-0">
                      <span className="text-[#FB6F6F] text-base">★</span>
                    </div>
                    <div>
                      <div className="font-bold text-[#FB6F6F] text-lg leading-none">4.9★</div>
                      <div className="text-[#64748B] text-xs mt-0.5">Kundenbewertung</div>
                    </div>
                  </div>

                  <div className="flex items-center gap-3">
                    <div className="w-9 h-9 rounded-lg bg-[#E0F2FE] flex items-center justify-center flex-shrink-0">
                      <svg width="16" height="16" viewBox="0 0 24 24" fill="#0EA5E9">
                        <path d="M13 2L3 14h9l-1 8 10-12h-9l1-8z" />
                      </svg>
                    </div>
                    <div>
                      <div className="font-bold text-[#0EA5E9] text-lg leading-none">2–3h*</div>
                      <div className="text-[#64748B] text-xs mt-0.5">Angebot garantiert</div>
                    </div>
                  </div>
                </div>

                <hr className="border-[#E2EDF7] mb-5" />

                <Link
                  href="/fahrzeug-verkaufen"
                  onClick={handleCTAClick}
                  className="flex items-center justify-center w-full px-5 py-3 bg-[#FB6F6F] hover:bg-[#f95c5c] text-white font-semibold rounded-xl transition-colors duration-200 text-sm"
                >
                  Angebot einholen →
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
