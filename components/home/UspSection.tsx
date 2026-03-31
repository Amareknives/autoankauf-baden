import { Shield, Zap, Banknote, MapPin } from 'lucide-react'

const usps = [
  {
    icon: <Shield size={36} strokeWidth={2} color="#0369A1" />,
    title: 'Ehrlich & fair',
    text: 'Du weißt immer, wie dein Preis zustande kommt. Keine versteckten Abzüge, keine Überraschungen.',
  },
  {
    icon: <Zap size={36} strokeWidth={2} color="#0369A1" />,
    title: 'Angebot in 2–3 Stunden*',
    text: 'Persönlich von uns – nicht automatisch. Abholung wann und wo du willst.',
  },
  {
    icon: <Banknote size={36} strokeWidth={2} color="#0369A1" />,
    title: 'Sofort bar bezahlt',
    text: 'Du bekommst dein Geld direkt beim Termin – bar auf die Hand. Keine Wartezeiten.',
  },
  {
    icon: <MapPin size={36} strokeWidth={2} color="#0369A1" />,
    title: 'Kostenlose Abholung',
    text: 'Wir kommen zu dir – kostenlos, in ganz Baden, der Pfalz und der Region Karlsruhe.',
  },
]

export default function UspSection() {
  return (
    <section className="py-16 md:py-20 bg-[#F8FAFC]">
      <div className="container mx-auto px-4 md:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center mb-12">
          <div className="inline-flex items-center gap-2 bg-[#E8F4FD] border border-[#F0F7FF] rounded-full px-4 py-2 mb-4">
            <span className="text-sm font-semibold text-[#0369A1]">Seit 6 Jahren Autoankauf in der Region Baden</span>
          </div>
          <h2 className="text-[24px] font-extrabold text-[#0F172A] mb-3">
            Dein Autoankauf in der Region Baden – fair, direkt &amp; persönlich
          </h2>
          <p className="text-[#64748B] text-base max-w-2xl mx-auto leading-relaxed">
            Seit 6 Jahren kaufen wir Fahrzeuge in ganz Baden an – von Karlsruhe über Bruchsal und Heidelberg bis nach Mannheim, Speyer, Germersheim und Stuttgart.
            Wir sind aus der Region, kennen den Markt und machen das, weil uns alles rund ums Auto wirklich Spaß macht.
            Bei uns läuft alles persönlich und auf Augenhöhe – du weißt immer, woran du bist.
            Egal welche Marke, welcher Kilometerstand oder welcher Zustand – wir holen dein Auto kostenlos ab und zahlen sofort bar.
          </p>
          <p className="text-[#94A3B8] text-xs mt-3 max-w-sm mx-auto">
            *Antwortzeit werktags 6–18 Uhr &amp; samstags 6–13 Uhr
          </p>
        </div>

        {/* Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-5">
          {usps.map((usp) => (
            <div
              key={usp.title}
              className="bg-white border border-[#E2EDF7] rounded-[14px] p-8 hover:shadow-lg hover:border-[#0369A1]/20 transition-all duration-200 flex flex-col"
            >
              <div className="w-14 h-14 rounded-2xl bg-[#E8F4FD] flex items-center justify-center mb-5 flex-shrink-0">
                {usp.icon}
              </div>
              <h3 className="font-bold text-[#0F172A] mb-2 text-[16px]">{usp.title}</h3>
              <p className="text-sm text-[#64748B] leading-relaxed">{usp.text}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
