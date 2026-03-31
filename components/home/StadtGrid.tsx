'use client'

import Link from 'next/link'
import { gtmEvents } from '@/lib/gtm'

const cities = [
  { name: 'Karlsruhe', slug: 'karlsruhe', region: 'Baden' },
  { name: 'Bruchsal', slug: 'bruchsal', region: 'Baden' },
  { name: 'Heidelberg', slug: 'heidelberg', region: 'Baden' },
  { name: 'Mannheim', slug: 'mannheim', region: 'Baden' },
  { name: 'Speyer', slug: 'speyer', region: 'Pfalz' },
  { name: 'Pforzheim', slug: 'pforzheim', region: 'Baden' },
  { name: 'Rastatt', slug: 'rastatt', region: 'Baden' },
  { name: 'Baden-Baden', slug: 'baden-baden', region: 'Baden' },
  { name: 'Ludwigshafen', slug: 'ludwigshafen', region: 'Pfalz' },
  { name: 'Stuttgart', slug: 'stuttgart', region: 'Stuttgart' },
]

export default function StadtGrid() {
  return (
    <section className="py-16 md:py-20 bg-[#F8FAFC]">
      <div className="container mx-auto px-4 md:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center mb-10">
          <h2 className="text-[24px] font-extrabold text-[#0F172A] mb-3">
            Autoankauf in deiner Region
          </h2>
          <p className="text-[#64748B] text-base">
            Wir kaufen Autos in ganz Baden und der Pfalz
          </p>
        </div>

        {/* Grid */}
        <div className="grid grid-cols-2 md:grid-cols-5 gap-3 max-w-4xl mx-auto">
          {cities.map((city) => (
            <Link
              key={city.slug}
              href={`/${city.slug}`}
              onClick={() => gtmEvents.stadtseite_view({ stadt: city.name })}
              className="group bg-white border border-[#E2EDF7] rounded-xl p-5 flex items-center justify-between hover:border-[#0369A1] hover:bg-[#F0F7FF] transition-all duration-200"
            >
              <div>
                <div className="font-semibold text-[#0F172A] group-hover:text-[#0369A1] transition-colors duration-200 text-sm">
                  {city.name}
                </div>
                <div className="text-xs text-[#94A3B8] mt-0.5">{city.region}</div>
              </div>
              <svg
                className="w-4 h-4 text-[#CBD5E1] group-hover:text-[#0369A1] transition-colors duration-200 flex-shrink-0 ml-2"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
              </svg>
            </Link>
          ))}
        </div>
      </div>
    </section>
  )
}
