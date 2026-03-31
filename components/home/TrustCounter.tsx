export default function TrustCounter() {
  const items = [
    { value: '1.000+', label: 'Fahrzeuge angekauft', color: 'text-[#0369A1]' },
    { value: '4.9★', label: 'Kundenbewertung', color: 'text-[#FB6F6F]' },
    { value: '2–3h*', label: 'Angebot garantiert', color: 'text-[#0369A1]' },
    { value: '6 Jahre', label: 'Erfahrung in Baden', color: 'text-[#0369A1]' },
    { value: '100%', label: 'Kostenlos & unverbindlich', color: 'text-[#22C55E]' },
  ]

  return (
    <section className="bg-white border-y border-[#E2EDF7] py-6">
      <div className="container mx-auto px-4 md:px-6 lg:px-8">
        <div className="grid grid-cols-2 md:grid-cols-5 gap-6 text-center">
          {items.map((item) => (
            <div key={item.label} className="flex flex-col items-center py-2">
              <div className={`text-2xl font-bold ${item.color} mb-1`}>{item.value}</div>
              <div className="text-sm text-[#64748B] leading-snug">{item.label}</div>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
