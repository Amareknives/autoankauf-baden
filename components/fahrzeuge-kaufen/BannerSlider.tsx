'use client'

import { useState, useEffect, useCallback } from 'react'
import { ChevronLeft, ChevronRight } from 'lucide-react'

const IMAGES = [
  { src: '/autohaus/1.webp', alt: 'Fahrzeug Angebot 1 – Autohaus Stern Graben-Neudorf' },
  { src: '/autohaus/2.webp', alt: 'Fahrzeug Angebot 2 – Autohaus Stern Graben-Neudorf' },
  { src: '/autohaus/3.webp', alt: 'Fahrzeug Angebot 3 – Autohaus Stern Graben-Neudorf' },
  { src: '/autohaus/4.webp', alt: 'Fahrzeug Angebot 4 – Autohaus Stern Graben-Neudorf' },
]

export function BannerSlider() {
  const [current, setCurrent] = useState(0)

  const next = useCallback(() => setCurrent(i => (i + 1) % IMAGES.length), [])
  const prev = useCallback(() => setCurrent(i => (i - 1 + IMAGES.length) % IMAGES.length), [])

  useEffect(() => {
    const timer = setInterval(next, 4500)
    return () => clearInterval(timer)
  }, [next])

  return (
    <div className="relative w-full rounded-2xl overflow-hidden bg-[#0B1120]" style={{ height: 260 }}>
      <style>{`@media (min-width: 768px) { .banner-slider { height: 420px !important; } }`}</style>

      {/* Slides */}
      {IMAGES.map((img, i) => (
        <div
          key={img.src}
          className="absolute inset-0 transition-opacity duration-700"
          style={{ opacity: i === current ? 1 : 0 }}
          aria-hidden={i !== current}
        >
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={img.src}
            alt={img.alt}
            className="w-full h-full object-cover"
          />
        </div>
      ))}

      {/* Gradient unten */}
      <div className="absolute bottom-0 left-0 right-0 h-20 bg-gradient-to-t from-black/50 to-transparent pointer-events-none z-10" />

      {/* Dots */}
      <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex gap-2 z-20">
        {IMAGES.map((_, i) => (
          <button
            key={i}
            onClick={() => setCurrent(i)}
            aria-label={`Bild ${i + 1}`}
            className="h-2 rounded-full transition-all duration-300"
            style={{ width: i === current ? 24 : 8, backgroundColor: i === current ? 'white' : 'rgba(255,255,255,0.4)' }}
          />
        ))}
      </div>

      {/* Pfeile */}
      <button
        onClick={prev}
        aria-label="Vorheriges Bild"
        className="absolute left-3 top-1/2 -translate-y-1/2 w-10 h-10 rounded-full bg-black/40 hover:bg-black/60 text-white flex items-center justify-center transition-colors duration-200 z-20"
      >
        <ChevronLeft size={22} />
      </button>
      <button
        onClick={next}
        aria-label="Nächstes Bild"
        className="absolute right-3 top-1/2 -translate-y-1/2 w-10 h-10 rounded-full bg-black/40 hover:bg-black/60 text-white flex items-center justify-center transition-colors duration-200 z-20"
      >
        <ChevronRight size={22} />
      </button>
    </div>
  )
}
