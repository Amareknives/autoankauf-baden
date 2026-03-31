'use client'

import Link from 'next/link'
import { gtmEvents } from '@/lib/gtm'

export default function HaendlerTeaser() {
  return (
    <section className="py-16 md:py-20 bg-[#0369A1]">
      <div className="container mx-auto px-4 md:px-6 lg:px-8">
        <div className="max-w-4xl mx-auto flex flex-col md:flex-row items-center justify-between gap-8">

          {/* Left */}
          <div className="text-center md:text-left">
            <div className="inline-flex items-center gap-2 bg-white/20 rounded-full px-4 py-1.5 mb-4">
              <span className="text-white text-sm font-medium">Für Autohäuser &amp; Fuhrparks</span>
            </div>
            <h2 className="text-[28px] font-extrabold text-white mb-3 leading-tight">
              Autohaus oder Fuhrparkbetreiber?
            </h2>
            <p className="text-white/80 text-base max-w-md leading-relaxed">
              Wir kaufen regelmäßig und zu fairen Festpreisen. Persönlicher Ansprechpartner, schnelle Abwicklung.
            </p>
          </div>

          {/* Right */}
          <div className="flex-shrink-0">
            <Link
              href="/haendler"
              onClick={() => gtmEvents.haendler_form()}
              className="inline-flex items-center justify-center px-8 py-4 bg-white hover:bg-gray-50 text-[#0369A1] font-bold rounded-xl transition-colors duration-200 whitespace-nowrap min-h-[52px] shadow-lg"
            >
              Jetzt Kontakt aufnehmen
            </Link>
          </div>
        </div>
      </div>
    </section>
  )
}
