'use client'

import Link from 'next/link'
import Image from 'next/image'
import { gtmEvents } from '@/lib/gtm'

const cities = [
  { name: 'Karlsruhe', slug: 'karlsruhe', region: 'Baden', img: '/karlsruhe.webp' },
  { name: 'Bruchsal', slug: 'bruchsal', region: 'Baden', img: '/bruchsal.webp' },
  { name: 'Heidelberg', slug: 'heidelberg', region: 'Baden', img: '/heidelberg.webp' },
  { name: 'Mannheim', slug: 'mannheim', region: 'Baden', img: '/mannheim.webp' },
  { name: 'Speyer', slug: 'speyer', region: 'Pfalz', img: '/speyer.webp' },
  { name: 'Pforzheim', slug: 'pforzheim', region: 'Baden', img: '/pforzheim.webp' },
  { name: 'Rastatt', slug: 'rastatt', region: 'Baden', img: '/rastatt.webp' },
  { name: 'Baden-Baden', slug: 'baden-baden', region: 'Baden', img: '/baden-baden.webp' },
  { name: 'Ludwigshafen', slug: 'ludwigshafen', region: 'Pfalz', img: '/ludwigshafen.webp' },
  { name: 'Stuttgart', slug: 'stuttgart', region: 'Stuttgart', img: '/stuttgart.webp' },
]

export default function StadtGrid() {
  return (
    <section className="py-12 md:py-20 bg-[#F8FAFC]">
      <div className="container mx-auto px-4 md:px-6 lg:px-8">

        {/* Header */}
        <div className="text-center mb-8 md:mb-10">
          <h2 className="text-[22px] md:text-[24px] font-extrabold text-[#0F172A] mb-2">
            Autoankauf in deiner Region
          </h2>
          <p className="text-[#64748B] text-sm md:text-base">
            Wir kaufen Autos in ganz Baden und der Pfalz
          </p>
        </div>

        {/* Grid – Stadtfotos als Card-Hintergrund */}
        <div className="grid grid-cols-2 md:grid-cols-5 gap-3 max-w-4xl mx-auto">
          {cities.map((city) => (
            <Link
              key={city.slug}
              href={`/${city.slug}`}
              onClick={() => gtmEvents.stadtseite_view({ stadt: city.name })}
              className="group relative overflow-hidden rounded-xl h-[120px] md:h-[140px] block"
              aria-label={`Autoankauf ${city.name}`}
            >
              {/* Stadtfoto */}
              <Image
                src={city.img}
                alt={`Autoankauf ${city.name}`}
                fill
                className="object-cover transition-transform duration-500 group-hover:scale-105"
                sizes="(max-width: 768px) 50vw, 20vw"
              />

              {/* CI-Blauer Gradient-Overlay */}
              <div className="absolute inset-0 bg-gradient-to-t from-[#0369A1]/85 via-[#0369A1]/25 to-transparent transition-opacity duration-300 group-hover:from-[#0369A1]/95" />

              {/* Stadtname */}
              <div className="absolute bottom-0 left-0 right-0 p-3">
                <div className="font-bold text-white text-sm leading-tight">{city.name}</div>
                <div className="text-white/65 text-[10px] mt-0.5">{city.region}</div>
              </div>

              {/* Hover-Pfeil */}
              <div className="absolute top-2.5 right-2.5 w-6 h-6 bg-white/20 rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-200">
                <svg className="w-3 h-3 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M9 5l7 7-7 7" />
                </svg>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </section>
  )
}
