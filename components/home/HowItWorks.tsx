'use client'

import Link from 'next/link'
import { motion } from 'framer-motion'

const steps = [
  {
    num: '1',
    icon: '/1-form.svg',
    color: '#0369A1',
    title: 'Einfach Formular ausfüllen',
    desc: 'Nur 2–3 Minuten: Fahrzeugdaten bequem auf dem PC oder Handy eingeben und an uns senden – wir kümmern uns um den Rest.',
    badge: null,
  },
  {
    num: '2',
    icon: '/2-call.svg',
    color: '#0EA5E9',
    title: 'Angebot in 2–3 Stunden*',
    desc: 'Wir senden dir eine E-Mail oder melden uns – wenn gewünscht auch telefonisch – und machen dir ein faires Angebot.',
    badge: 'Echter Mensch – kein Bot',
  },
  {
    num: '3',
    icon: '/3-sell.svg',
    color: '#FB6F6F',
    title: 'Termin, Zahlung & Übergabe',
    desc: 'Wir vereinbaren einen Wunschtermin und holen dein Fahrzeug kostenlos ab – du bekommst dein Geld sofort bar. Auf Wunsch übernehmen wir die Abmeldung.',
    badge: null,
  },
]

export default function HowItWorks() {
  return (
    <section id="wie-funktionierts" className="py-12 md:py-20 bg-[#0F172A]">
      <div className="container mx-auto px-4 md:px-6 lg:px-8">

        {/* Header */}
        <motion.div
          className="text-center mb-10 md:mb-14"
          initial={{ opacity: 0, y: 18 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.4, ease: 'easeOut' }}
        >
          <div className="inline-flex items-center gap-2 bg-white/15 border border-white/25 rounded-full px-4 py-1.5 mb-3">
            <span className="text-sm font-semibold text-white">So einfach geht&apos;s</span>
          </div>
          <h2 className="text-[22px] md:text-[26px] font-extrabold text-white mb-2">
            In 3 Schritten zu deinem fairen Angebot
          </h2>
          <p className="text-white/55 text-sm md:text-base">
            Schnell. Persönlich. Unkompliziert – wir kümmern uns um alles.
          </p>
        </motion.div>

        {/* Steps */}
        <div className="relative max-w-3xl mx-auto">
          <div className="grid md:grid-cols-3 gap-4 md:gap-6">
            {steps.map((step, i) => {
              return (
                <motion.div
                  key={step.num}
                  initial={{ opacity: 0, y: 24 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true, margin: '-30px' }}
                  transition={{ delay: i * 0.1 + 0.15, duration: 0.4, ease: 'easeOut' }}
                  whileHover={{ scale: 1.04, transition: { duration: 0.15 } }}
                  className="group relative flex md:flex-col items-center gap-4 md:gap-0 md:text-center bg-white/10 rounded-2xl p-5 md:p-6 border border-white/20 cursor-default"
                >
                  {/* Connector Arrow – Desktop */}
                  {i < steps.length - 1 && (
                    <div className="hidden md:flex absolute top-12 left-[calc(100%+7px)] items-center z-10">
                      <svg width="16" height="16" viewBox="0 0 16 16" fill="none" aria-hidden="true">
                        <path d="M3 8h10M9 4l4 4-4 4" stroke="rgba(255,255,255,0.3)" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                      </svg>
                    </div>
                  )}

                  {/* Icon-Box mit Nummer als Wasserzeichen */}
                  <div className="flex-shrink-0 md:mb-5 md:mx-auto">
                    <div
                      className="relative w-[72px] h-[72px] rounded-2xl overflow-hidden shadow-lg transition-transform duration-200 group-hover:scale-105"
                      style={{ background: step.color }}
                    >
                      {/* Nummer als großes Wasserzeichen im Hintergrund */}
                      <span
                        className="absolute -bottom-2 -right-1 text-[64px] font-black leading-none select-none pointer-events-none"
                        style={{ color: 'rgba(255,255,255,0.25)' }}
                        aria-hidden="true"
                      >
                        {step.num}
                      </span>
                      {/* SVG Icon zentriert – brightness(0) invert(1) = schwarz → weiß */}
                      <div className="absolute inset-0 flex items-center justify-center">
                        {/* eslint-disable-next-line @next/next/no-img-element */}
                        <img
                          src={step.icon}
                          alt=""
                          aria-hidden="true"
                          className="w-9 h-9 object-contain"
                          style={{ filter: 'brightness(0) invert(1)' }}
                        />
                      </div>
                    </div>
                  </div>

                  {/* Text */}
                  <div className="flex-1 md:flex-none">
                    <h3 className="font-bold text-white text-[15px] md:text-[16px] mb-1.5 leading-tight">{step.title}</h3>
                    {step.badge && (
                      <div className="inline-flex items-center gap-1.5 bg-[#0EA5E9]/20 border border-[#0EA5E9]/40 rounded-full px-2.5 py-0.5 mb-2">
                        <span className="w-1.5 h-1.5 rounded-full bg-[#0EA5E9] flex-shrink-0" />
                        <span className="text-[10px] font-semibold text-[#0EA5E9] leading-none">{step.badge}</span>
                      </div>
                    )}
                    <p className="text-sm text-white/65">{step.desc}</p>
                  </div>
                </motion.div>
              )
            })}
          </div>

        </div>

        {/* CTA */}
        <div className="text-center mt-10 md:mt-12">
          <div className="relative inline-block">
            <motion.div
              className="absolute inset-0 rounded-xl bg-[#FB6F6F]"
              animate={{ scale: [1, 1.08, 1], opacity: [0.45, 0, 0.45] }}
              transition={{ duration: 2.2, repeat: Infinity, ease: 'easeOut' }}
            />
            <Link
              href="/fahrzeug-verkaufen"
              className="relative inline-flex items-center justify-center px-8 py-4 bg-[#FB6F6F] hover:bg-[#f95c5c] text-white font-bold rounded-xl transition-colors duration-200 min-h-[52px] shadow-lg"
            >
              Jetzt Angebot holen
            </Link>
          </div>
          <p className="mt-3 text-[11px] text-white/45">
            *Erreichbarkeit: Werktags 6–18 Uhr &amp; Samstag 6–13 Uhr – wir antworten persönlich
          </p>
        </div>
      </div>
    </section>
  )
}
