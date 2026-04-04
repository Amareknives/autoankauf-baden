'use client'

import { useState } from 'react'
import { Shield, Zap, Banknote, MapPin } from 'lucide-react'

const usps = [
  {
    icon: Shield,
    color: '#0369A1',
    bg: '#E8F4FD',
    title: 'Ehrlich & fair',
    short: 'Keine versteckten Abzüge – du weißt immer, wie dein Preis zustande kommt.',
  },
  {
    icon: Zap,
    color: '#0EA5E9',
    bg: '#E0F2FE',
    title: 'Angebot in 2–3h',
    short: 'Persönlich von uns, nicht automatisch. Abholung wann und wo du willst.',
  },
  {
    icon: Banknote,
    color: '#22C55E',
    bg: '#DCFCE7',
    title: 'Sofort bar bezahlt',
    short: 'Du bekommst dein Geld direkt beim Termin – bar auf die Hand.',
  },
  {
    icon: MapPin,
    color: '#FB6F6F',
    bg: '#FFE4E4',
    title: 'Kostenlose Abholung',
    short: 'Wir kommen zu dir – kostenlos in ganz Baden, der Pfalz und der Region.',
  },
]

const FULL_TEXT = `Seit 6 Jahren kaufen wir Fahrzeuge in ganz Baden an – von Karlsruhe über Bruchsal und Heidelberg bis nach Mannheim, Speyer, Germersheim und Stuttgart. Wir sind aus der Region, kennen den Markt und machen das, weil uns alles rund ums Auto wirklich Spaß macht. Bei uns läuft alles persönlich und auf Augenhöhe – du weißt immer, woran du bist. Egal welche Marke, welcher Kilometerstand oder welcher Zustand – wir holen dein Auto kostenlos ab und zahlen sofort bar. Kein Inserieren, kein Stress, keine versteckten Kosten. Einfach Formular ausfüllen, persönliches Angebot in 2–3 Stunden erhalten und Termin vereinbaren – wir kümmern uns um alles.`

export default function UspSection() {
  const [expanded, setExpanded] = useState(false)

  return (
    <section className="py-12 md:py-20 bg-[#F8FAFC]">
      <div className="container mx-auto px-4 md:px-6 lg:px-8">

        {/* Header */}
        <div className="text-center mb-8 md:mb-12">
          <div className="inline-flex items-center gap-2 bg-[#E8F4FD] border border-[#D0E9F7] rounded-full px-4 py-1.5 mb-3">
            <span className="text-sm font-semibold text-[#0369A1]">Seit 6 Jahren Autoankauf in der Region Baden</span>
          </div>
          <h2 className="text-[22px] md:text-[24px] font-extrabold text-[#0F172A] mb-3">
            Fair, direkt &amp; persönlich – das ist unser Versprechen
          </h2>

          {/* SEO-Text: immer im DOM, visuell gekürzt/expandiert */}
          <div className="max-w-2xl mx-auto">
            <p className={`text-[#64748B] text-sm md:text-base leading-relaxed transition-all duration-300 ${expanded ? '' : 'line-clamp-2'}`}>
              {FULL_TEXT}
            </p>
            <button
              onClick={() => setExpanded((v) => !v)}
              className="mt-2 text-[#0369A1] text-sm font-semibold hover:underline focus:outline-none"
            >
              {expanded ? 'Weniger anzeigen ↑' : 'Mehr lesen ↓'}
            </button>
          </div>
        </div>

        {/* Cards – 2×2 Mobile, 4-spaltig Desktop */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 md:gap-5">
          {usps.map((usp) => {
            const Icon = usp.icon
            return (
              <div
                key={usp.title}
                className="bg-white border border-[#E2EDF7] rounded-[14px] p-5 md:p-7 hover:shadow-lg hover:border-[#0369A1]/20 transition-all duration-200 flex flex-col"
                style={{ borderTop: `3px solid ${usp.color}` }}
              >
                <div
                  className="w-11 h-11 rounded-xl flex items-center justify-center mb-4 flex-shrink-0"
                  style={{ background: usp.bg }}
                >
                  <Icon size={22} strokeWidth={2} color={usp.color} />
                </div>
                <h3 className="font-bold text-[#0F172A] mb-1.5 text-[14px] md:text-[15px] leading-tight">{usp.title}</h3>
                <p className="text-xs md:text-sm text-[#64748B] leading-relaxed">{usp.short}</p>
              </div>
            )
          })}
        </div>
      </div>
    </section>
  )
}
