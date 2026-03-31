import BewertungenCarousel from '@/components/ui/BewertungenCarousel'

export default function ReviewsSection() {
  return (
    <section className="py-16 md:py-20 bg-[#F8FAFC]">
      <div className="container mx-auto px-4 md:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center mb-10">
          <div className="inline-flex items-center gap-2 bg-[#FFE4E4] border border-[#FFE4E4] rounded-full px-4 py-2 mb-4">
            <span className="text-sm font-semibold text-[#FB6F6F]">Das sagen unsere Kunden</span>
          </div>
          <h2 className="text-[24px] font-extrabold text-[#0F172A] mb-3">
            4.9 von 5 Sternen
          </h2>
          <p className="text-[#64748B] text-sm">
            Basierend auf 200+ Bewertungen · Google &amp; ProvenExpert
          </p>
        </div>

        {/* Zufällige Bewertungen beim Laden */}
        <div className="max-w-5xl mx-auto">
          <BewertungenCarousel anzahl={3} />
        </div>
      </div>
    </section>
  )
}
