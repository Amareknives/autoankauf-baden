'use client'

import Link from 'next/link'
import { useState } from 'react'

export default function PersonSection() {
  const [imgError, setImgError] = useState(false)
  return (
    <section className="py-16 md:py-20 bg-[#E8F4FD]">
      <div className="container mx-auto px-4 md:px-6 lg:px-8">
        <div className="max-w-4xl mx-auto">
          <div className="flex flex-col md:flex-row gap-12 items-center">

            {/* Left: Avatar + Info */}
            <div className="flex flex-col items-center md:items-start text-center md:text-left flex-shrink-0">
              {!imgError ? (
                <img
                  src="/muhammet-demir_abb3.webp"
                  alt="Muhammet Demir – Inhaber AutoAnkauf-Baden"
                  width={208}
                  height={208}
                  onError={() => setImgError(true)}
                  className="w-52 h-52 rounded-full object-cover mb-4 shadow-lg"
                />
              ) : (
                <div className="w-52 h-52 rounded-full bg-[#0369A1] flex items-center justify-center text-white text-2xl font-black mb-4 shadow-lg">
                  MD
                </div>
              )}
              <div className="font-bold text-[#0F172A] text-lg mb-0.5">Muhammet Demir</div>
              <div className="text-[#64748B] text-sm">Inhaber &amp; Gründer, AutoAnkauf-Baden</div>
            </div>

            {/* Right: Quote */}
            <div className="flex-1">
              {/* Large quote mark */}
              <div className="text-[#0369A1] text-7xl font-serif leading-none mb-2 select-none opacity-30">&ldquo;</div>

              <blockquote className="text-[#0F172A] text-lg leading-relaxed mb-4 -mt-6">
                Seit 6 Jahren kaufen wir Autos in der Region Baden an – fair, transparent und persönlich.
                Unser Ziel ist es, dir den Autoverkauf so einfach wie möglich zu machen.
                Kein Stress, kein Inserieren, einfach ein faires Angebot.
              </blockquote>

              <p className="text-[#0369A1] font-semibold text-sm mb-6 italic">
                &ldquo;Ich stehe persönlich für jeden Ankauf.&rdquo;
              </p>

              <Link
                href="/fahrzeug-verkaufen"
                className="inline-flex items-center justify-center px-7 py-3.5 bg-[#FB6F6F] hover:bg-[#f95c5c] text-white font-bold rounded-xl transition-colors duration-200 min-h-[48px]"
              >
                Jetzt kostenlos Angebot holen
              </Link>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
