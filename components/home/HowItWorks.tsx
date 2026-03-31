import Link from 'next/link'
import { ClipboardList, Mail, Handshake, ChevronRight } from 'lucide-react'

const steps = [
  {
    num: '01',
    icon: <ClipboardList size={28} strokeWidth={2.5} color="white" />,
    title: 'Formular ausfüllen',
    desc: 'Dauert nur 2 Minuten',
    color: 'bg-[#0369A1]',
  },
  {
    num: '02',
    icon: <Mail size={28} strokeWidth={2.5} color="white" />,
    title: 'Persönliches Angebot',
    desc: 'In 2–3 Stunden*',
    color: 'bg-[#0369A1]',
  },
  {
    num: '03',
    icon: <Handshake size={28} strokeWidth={2.5} color="white" />,
    title: 'Termin & Barzahlung',
    desc: 'Kostenlose Abholung',
    color: 'bg-[#FB6F6F]',
  },
]

export default function HowItWorks() {
  return (
    <section id="wie-funktionierts" className="py-16 md:py-20 bg-white">
      <div className="container mx-auto px-4 md:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center mb-12">
          <div className="inline-flex items-center gap-2 bg-[#E8F4FD] border border-[#F0F7FF] rounded-full px-4 py-2 mb-4">
            <span className="text-sm font-semibold text-[#0369A1]">So einfach geht&apos;s</span>
          </div>
          <h2 className="text-[24px] font-extrabold text-[#0F172A] mb-3">
            In 3 Schritten zum Angebot
          </h2>
        </div>

        {/* Steps */}
        <div className="relative max-w-4xl mx-auto">
          <div className="grid md:grid-cols-3 gap-6">
            {steps.map((step, i) => (
              <div key={step.num} className="relative flex flex-col items-center text-center">
                {/* Connector arrow — desktop only */}
                {i < steps.length - 1 && (
                  <div className="hidden md:flex absolute top-10 left-[calc(50%+56px)] items-center justify-end w-[calc(100%-112px)] z-0">
                    <ChevronRight size={20} strokeWidth={2.5} color="#CBD5E1" />
                  </div>
                )}

                {/* Step circle */}
                <div className={`relative z-10 w-20 h-20 ${step.color} rounded-full flex flex-col items-center justify-center mb-5 shadow-lg gap-1`}>
                  <span className="text-white/70 text-[10px] font-bold tracking-wider leading-none">{step.num}</span>
                  {step.icon}
                </div>

                <h3 className="font-bold text-[#0F172A] mb-1 text-[15px]">{step.title}</h3>
                <p className="text-sm text-[#64748B]">{step.desc}</p>
              </div>
            ))}
          </div>
        </div>

        {/* CTA */}
        <div className="text-center mt-12">
          <Link
            href="/fahrzeug-verkaufen"
            className="inline-flex items-center justify-center px-8 py-4 bg-[#FB6F6F] hover:bg-[#f95c5c] text-white font-bold rounded-xl transition-colors duration-200 min-h-[52px]"
          >
            Jetzt Angebot holen
          </Link>
          <p className="mt-3 text-[11px] text-[#94A3B8]">
            *Werktags 6–18 Uhr &amp; Samstag 6–13 Uhr · Wir kümmern uns persönlich um dich
          </p>
        </div>
      </div>
    </section>
  )
}
