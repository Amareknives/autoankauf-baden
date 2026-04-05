import Link from 'next/link'
import { Car, ArrowRight } from 'lucide-react'

export default function AutohausTeaser() {
  return (
    <section style={{ backgroundColor: '#212121', borderTop: '1px solid #333' }}>
      <div className="container mx-auto px-4 md:px-6 lg:px-8 py-5 md:py-6">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">

          <div className="flex items-start sm:items-center gap-3.5">
            <div className="w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0" style={{ backgroundColor: 'rgba(234,179,8,0.15)' }}>
              <Car size={20} style={{ color: '#EAB308' }} />
            </div>
            <div>
              <p className="font-bold text-white text-[14px] leading-snug">
                Auch auf der Suche nach einem Fahrzeug?
              </p>
              <p className="text-[12px] mt-0.5" style={{ color: 'rgba(255,255,255,0.55)' }}>
                Ankauf & Verkauf aus einer Hand · Inzahlungnahme · Werkstatt & Service
              </p>
            </div>
          </div>

          <Link
            href="/fahrzeuge-kaufen"
            className="inline-flex items-center gap-2 font-semibold text-[13px] px-4 py-2.5 rounded-xl transition-colors duration-200 whitespace-nowrap flex-shrink-0"
            style={{ backgroundColor: '#EAB308', color: '#0F172A' }}
          >
            Mehr Infos
            <ArrowRight size={14} />
          </Link>

        </div>
      </div>
    </section>
  )
}
