import Link from 'next/link'
import { ClipboardList, Mail, Handshake, ChevronRight } from 'lucide-react'

const steps = [
  {
    num: '01',
    icon: ClipboardList,
    title: 'Formular ausfüllen',
    desc: 'Dauert nur 2 Minuten',
    iconBg: 'bg-white',
    iconColor: '#0369A1',
  },
  {
    num: '02',
    icon: Mail,
    title: 'Persönliches Angebot',
    desc: 'In 2–3 Stunden*',
    iconBg: 'bg-white',
    iconColor: '#0369A1',
  },
  {
    num: '03',
    icon: Handshake,
    title: 'Termin & Barzahlung',
    desc: 'Kostenlose Abholung',
    iconBg: 'bg-[#FB6F6F]',
    iconColor: '#ffffff',
  },
]

export default function HowItWorks() {
  return (
    <section
      id="wie-funktionierts"
      className="py-12 md:py-20 bg-[#0F172A]"
    >
      <div className="container mx-auto px-4 md:px-6 lg:px-8">

        {/* Header */}
        <div className="text-center mb-10 md:mb-14">
          <div className="inline-flex items-center gap-2 bg-white/15 border border-white/25 rounded-full px-4 py-1.5 mb-3">
            <span className="text-sm font-semibold text-white">So einfach geht&apos;s</span>
          </div>
          <h2 className="text-[22px] md:text-[26px] font-extrabold text-white">
            In 3 Schritten zum Angebot
          </h2>
        </div>

        {/* Steps */}
        <div className="relative max-w-3xl mx-auto">
          <div className="grid md:grid-cols-3 gap-4 md:gap-6">
            {steps.map((step, i) => {
              const Icon = step.icon
              return (
                <div key={step.num} className="relative flex md:flex-col items-center md:items-center gap-4 md:gap-0 md:text-center bg-white/10 rounded-2xl p-5 md:p-6 border border-white/20">

                  {/* Connector arrow – Desktop only */}
                  {i < steps.length - 1 && (
                    <div className="hidden md:flex absolute top-10 left-[calc(100%+6px)] items-center z-10 w-3">
                      <ChevronRight size={18} strokeWidth={2.5} color="rgba(255,255,255,0.4)" />
                    </div>
                  )}

                  {/* Step circle */}
                  <div className={`relative flex-shrink-0 w-14 h-14 md:w-16 md:h-16 ${step.iconBg} rounded-full flex flex-col items-center justify-center md:mx-auto md:mb-4 shadow-md gap-0.5`}>
                    <span className="text-[9px] font-bold tracking-wider leading-none" style={{ color: step.iconColor === '#ffffff' ? 'rgba(255,255,255,0.7)' : '#0369A1' }}>{step.num}</span>
                    <Icon size={22} strokeWidth={2.5} color={step.iconColor} />
                  </div>

                  {/* Text */}
                  <div className="flex-1 md:flex-none">
                    <h3 className="font-bold text-white text-[15px] md:text-[16px] mb-0.5 leading-tight">{step.title}</h3>
                    <p className="text-sm text-white/65">{step.desc}</p>
                  </div>
                </div>
              )
            })}
          </div>
        </div>

        {/* CTA */}
        <div className="text-center mt-10 md:mt-12">
          <Link
            href="/fahrzeug-verkaufen"
            className="inline-flex items-center justify-center px-8 py-4 bg-[#FB6F6F] hover:bg-[#f95c5c] text-white font-bold rounded-xl transition-colors duration-200 min-h-[52px] shadow-lg"
          >
            Jetzt Angebot holen
          </Link>
          <p className="mt-3 text-[11px] text-white/50">
            *Werktags 6–18 Uhr &amp; Samstag 6–13 Uhr
          </p>
        </div>
      </div>
    </section>
  )
}
