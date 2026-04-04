const items = [
  { value: '1.000+', label: 'Fahrzeuge angekauft', color: 'text-[#0369A1]' },
  { value: '4.9★', label: 'Kundenbewertung', color: 'text-[#FB6F6F]' },
  { value: '2–3h', label: 'Angebot garantiert', color: 'text-[#0369A1]' },
  { value: '6 Jahre', label: 'Erfahrung', color: 'text-[#0369A1]' },
  { value: '100%', label: 'Kostenlos', color: 'text-[#22C55E]' },
]

export default function TrustCounter() {
  return (
    <section className="bg-white border-b border-[#E2EDF7]">
      {/* Mobile: horizontaler Scroll-Strip */}
      <div className="flex overflow-x-auto scrollbar-hide divide-x divide-[#E2EDF7] md:hidden">
        {items.map((item) => (
          <div key={item.label} className="flex-none w-[40%] flex flex-col items-center py-4 px-3 text-center">
            <div className={`text-xl font-black ${item.color} mb-0.5 leading-none`}>{item.value}</div>
            <div className="text-[11px] text-[#64748B] leading-snug mt-0.5">{item.label}</div>
          </div>
        ))}
      </div>

      {/* Desktop: 5-spaltig mit Dividers */}
      <div className="hidden md:grid md:grid-cols-5 divide-x divide-[#E2EDF7] container mx-auto px-6 lg:px-8">
        {items.map((item) => (
          <div key={item.label} className="flex flex-col items-center py-5 px-4 text-center">
            <div className={`text-2xl font-black ${item.color} mb-1 leading-none`}>{item.value}</div>
            <div className="text-sm text-[#64748B] leading-snug">{item.label}</div>
          </div>
        ))}
      </div>
    </section>
  )
}
