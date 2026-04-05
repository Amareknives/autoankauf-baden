'use client'

import { useState, useEffect, useCallback } from 'react'
import { X, ChevronLeft, ChevronRight, ZoomIn } from 'lucide-react'

interface GalleryImage {
  src: string
  alt: string
}

function Lightbox({ images, index, onClose }: { images: GalleryImage[]; index: number; onClose: () => void }) {
  const [current, setCurrent] = useState(index)
  const total = images.length

  const prev = useCallback(() => setCurrent(i => (i - 1 + total) % total), [total])
  const next = useCallback(() => setCurrent(i => (i + 1) % total), [total])

  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose()
      if (e.key === 'ArrowLeft') prev()
      if (e.key === 'ArrowRight') next()
    }
    document.addEventListener('keydown', handler)
    document.body.style.overflow = 'hidden'
    return () => {
      document.removeEventListener('keydown', handler)
      document.body.style.overflow = ''
    }
  }, [onClose, prev, next])

  return (
    <div
      className="fixed inset-0 z-50 bg-black/95 flex items-center justify-center"
      onClick={onClose}
    >
      {/* Close */}
      <button
        onClick={onClose}
        className="absolute top-4 right-4 w-10 h-10 rounded-full bg-white/10 hover:bg-white/20 text-white flex items-center justify-center transition-colors z-10"
        aria-label="Schließen"
      >
        <X size={20} />
      </button>

      {/* Counter */}
      <div className="absolute top-4 left-4 text-white/50 text-sm font-medium">
        {current + 1} / {total}
      </div>

      {/* Prev */}
      {total > 1 && (
        <button
          onClick={e => { e.stopPropagation(); prev() }}
          className="absolute left-3 md:left-6 w-11 h-11 rounded-full bg-white/10 hover:bg-white/20 text-white flex items-center justify-center transition-colors z-10"
          aria-label="Vorheriges Bild"
        >
          <ChevronLeft size={24} />
        </button>
      )}

      {/* Image */}
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img
        src={images[current].src}
        alt={images[current].alt}
        className="max-h-[85vh] max-w-[88vw] object-contain select-none"
        onClick={e => e.stopPropagation()}
        draggable={false}
      />

      {/* Next */}
      {total > 1 && (
        <button
          onClick={e => { e.stopPropagation(); next() }}
          className="absolute right-3 md:right-6 w-11 h-11 rounded-full bg-white/10 hover:bg-white/20 text-white flex items-center justify-center transition-colors z-10"
          aria-label="Nächstes Bild"
        >
          <ChevronRight size={24} />
        </button>
      )}

      {/* Dots */}
      {total > 1 && (
        <div className="absolute bottom-5 left-1/2 -translate-x-1/2 flex gap-1.5">
          {images.map((_, i) => (
            <button
              key={i}
              onClick={e => { e.stopPropagation(); setCurrent(i) }}
              className="rounded-full transition-all duration-200"
              style={{ width: i === current ? 20 : 6, height: 6, backgroundColor: i === current ? 'white' : 'rgba(255,255,255,0.3)' }}
              aria-label={`Bild ${i + 1}`}
            />
          ))}
        </div>
      )}
    </div>
  )
}

/* ── Photo Mosaic (2×2 grid) ── */
export function PhotoMosaic({ images }: { images: GalleryImage[] }) {
  const [openAt, setOpenAt] = useState<number | null>(null)

  return (
    <>
      <div className="grid grid-cols-2 gap-2 rounded-2xl overflow-hidden">
        {images.map((img, i) => (
          <button
            key={img.src}
            onClick={() => setOpenAt(i)}
            className="relative overflow-hidden group block bg-[#E2EDF7]"
            style={{ aspectRatio: '16/10' }}
            aria-label={`${img.alt} vergrößern`}
          >
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={img.src}
              alt={img.alt}
              className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
            />
            <div className="absolute inset-0 bg-black/0 group-hover:bg-black/25 transition-colors duration-300 flex items-center justify-center">
              <ZoomIn size={24} className="text-white opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
            </div>
          </button>
        ))}
      </div>
      {openAt !== null && (
        <Lightbox images={images} index={openAt} onClose={() => setOpenAt(null)} />
      )}
    </>
  )
}

/* ── Service Cards (Werkstatt) ── */
interface ServiceCardItem {
  img: string
  title: string
  desc: string
  badge: string
}

export function ServiceCardGrid({ cards }: { cards: ServiceCardItem[] }) {
  const [openAt, setOpenAt] = useState<number | null>(null)
  const galleryImages = cards.map(c => ({ src: c.img, alt: c.title }))

  return (
    <>
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        {cards.map(({ img, title, desc, badge }, i) => (
          <div
            key={title}
            className="text-left rounded-2xl overflow-hidden flex flex-col group transition-transform duration-200 hover:-translate-y-0.5"
            style={{ backgroundColor: '#27272A' }}
          >
            {/* Bild – klickbar für Lightbox */}
            <button
              onClick={() => setOpenAt(i)}
              className="relative overflow-hidden block w-full cursor-zoom-in"
              style={{ aspectRatio: '1 / 1' }}
              aria-label={`${title} vergrößern`}
            >
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={img}
                alt={title}
                className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
              />
              <span className="absolute top-3 left-3 bg-[#EAB308] text-black text-[10px] font-black px-3 py-1 rounded-full uppercase tracking-wider">
                {badge}
              </span>
              <div className="absolute bottom-3 right-3 w-8 h-8 rounded-full bg-black/50 flex items-center justify-center">
                <ZoomIn size={15} className="text-white" />
              </div>
            </button>

            {/* Text + Link – bottom-aligned */}
            <div className="p-5 flex flex-col flex-1">
              <h3 className="text-white font-bold text-[15px] mb-1.5">{title}</h3>
              <p className="text-zinc-400 text-sm leading-relaxed flex-1">{desc}</p>
              <button
                onClick={() => setOpenAt(i)}
                className="mt-4 inline-flex items-center gap-1.5 text-sm font-bold transition-colors duration-200 self-start"
                style={{ color: '#EAB308' }}
              >
                Mehr Infos
                <ZoomIn size={14} />
              </button>
            </div>
          </div>
        ))}
      </div>
      {openAt !== null && (
        <Lightbox images={galleryImages} index={openAt} onClose={() => setOpenAt(null)} />
      )}
    </>
  )
}
