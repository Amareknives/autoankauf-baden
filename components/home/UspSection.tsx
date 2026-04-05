'use client'

import { useState } from 'react'
import { motion } from 'framer-motion'

const IconShield = () => (
  <svg width="26" height="26" viewBox="0 0 26 26" fill="none" aria-hidden="true">
    <path d="M13 2L3 7v6C3 19.5 7.5 24.5 13 26 18.5 24.5 23 19.5 23 13V7L13 2z" fill="#0369A1" fillOpacity="0.14"/>
    <path d="M13 4.5L6 9v4c0 4.5 3.1 8.5 7 10 3.9-1.5 7-5.5 7-10V9L13 4.5z" fill="#0369A1" fillOpacity="0.18" stroke="#0369A1" strokeWidth="1.6"/>
    <path d="M9.5 13.5l2.5 2.5 5-5.5" stroke="#0369A1" strokeWidth="2.1" strokeLinecap="round" strokeLinejoin="round"/>
  </svg>
)

const IconClock = () => (
  <svg width="26" height="26" viewBox="0 0 26 26" fill="none" aria-hidden="true">
    <circle cx="12" cy="13" r="10" fill="#0EA5E9" fillOpacity="0.14"/>
    <circle cx="12" cy="13" r="10" stroke="#0EA5E9" strokeWidth="1.75"/>
    <path d="M12 8V13l3.5 2.5" stroke="#0EA5E9" strokeWidth="2.1" strokeLinecap="round" strokeLinejoin="round"/>
    <path d="M20 4.5l1.5 1.5M22 7.5h1.5M20.5 10.5l1 1" stroke="#0EA5E9" strokeWidth="1.5" strokeLinecap="round"/>
  </svg>
)

const IconEuro = () => (
  <svg width="26" height="26" viewBox="0 0 26 26" fill="none" aria-hidden="true">
    <rect x="2" y="6" width="18" height="11" rx="2.5" fill="#22C55E" fillOpacity="0.1" stroke="#22C55E" strokeWidth="1.4" strokeOpacity="0.45"/>
    <rect x="5" y="9" width="18" height="11" rx="2.5" fill="#22C55E" fillOpacity="0.14"/>
    <rect x="5" y="9" width="18" height="11" rx="2.5" stroke="#22C55E" strokeWidth="1.75"/>
    <path d="M16.5 12.5c-.5-1.1-1.6-1.9-2.9-1.9-1.8 0-3.2 1.4-3.2 3.2s1.4 3.2 3.2 3.2c1.3 0 2.4-.8 2.9-1.9" stroke="#22C55E" strokeWidth="1.75" strokeLinecap="round"/>
    <path d="M9.5 14.5h4.5M9.5 16.3h4" stroke="#22C55E" strokeWidth="1.5" strokeLinecap="round"/>
  </svg>
)

const IconCar = () => (
  <svg width="26" height="26" viewBox="0 0 26 26" fill="none" aria-hidden="true">
    <path d="M21.5 2C19.8 2 18.5 3.3 18.5 5c0 2.5 3 5.5 3 5.5S24.5 7.5 24.5 5c0-1.7-1.3-3-3-3z" fill="#FB6F6F" fillOpacity="0.22" stroke="#FB6F6F" strokeWidth="1.5"/>
    <circle cx="21.5" cy="5" r="1.2" fill="#FB6F6F"/>
    <path d="M3.5 12l3-4h9l3 4" stroke="#FB6F6F" strokeWidth="1.8" strokeLinejoin="round"/>
    <rect x="1.5" y="12" width="18" height="7" rx="2" fill="#FB6F6F" fillOpacity="0.13" stroke="#FB6F6F" strokeWidth="1.8"/>
    <circle cx="5.5" cy="19" r="2.2" fill="#FB6F6F" fillOpacity="0.22" stroke="#FB6F6F" strokeWidth="1.5"/>
    <circle cx="15.5" cy="19" r="2.2" fill="#FB6F6F" fillOpacity="0.22" stroke="#FB6F6F" strokeWidth="1.5"/>
  </svg>
)

const usps = [
  {
    Icon: IconShield,
    color: '#0369A1',
    bg: '#E8F4FD',
    title: 'Ehrlich & fair',
    short: 'Keine versteckten Abzüge – du weißt immer, wie dein Preis zustande kommt.',
  },
  {
    Icon: IconClock,
    color: '#0EA5E9',
    bg: '#E0F2FE',
    title: 'Angebot in 2–3h',
    short: 'Ein echtes Teammitglied meldet sich persönlich bei dir – kein Bot, keine Automation.',
  },
  {
    Icon: IconEuro,
    color: '#22C55E',
    bg: '#DCFCE7',
    title: 'Sofort bar bezahlt',
    short: 'Du bekommst dein Geld direkt beim Termin – bar auf die Hand.',
  },
  {
    Icon: IconCar,
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
          {usps.map((usp, i) => {
            const { Icon } = usp
            return (
              <motion.div
                key={usp.title}
                initial={{ opacity: 0, y: 22 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: '-40px' }}
                transition={{ delay: i * 0.09, duration: 0.38, ease: 'easeOut' }}
                whileHover={{
                  y: -8,
                  boxShadow: '0 18px 40px -10px rgba(3,105,161,0.14)',
                  transition: { duration: 0.18, ease: 'easeOut' },
                }}
                className="group bg-white border border-[#E2EDF7] rounded-[14px] p-5 md:p-7 flex flex-col cursor-default"
                style={{ borderTop: `3px solid ${usp.color}` }}
              >
                <div
                  className="w-11 h-11 rounded-xl flex items-center justify-center mb-4 flex-shrink-0 transition-transform duration-200 group-hover:scale-110 group-hover:rotate-6"
                  style={{ background: usp.bg }}
                >
                  <Icon />
                </div>
                <h3 className="font-bold text-[#0F172A] mb-1.5 text-[14px] md:text-[15px] leading-tight">{usp.title}</h3>
                <p className="text-xs md:text-sm text-[#64748B] leading-relaxed">{usp.short}</p>
              </motion.div>
            )
          })}
        </div>
      </div>
    </section>
  )
}
