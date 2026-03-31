import { Metadata } from 'next'
import { STAEDTE } from '@/constants/stadtData'
import { notFound } from 'next/navigation'
import Link from 'next/link'
import { Check, MapPin, Clock, CheckCircle, ArrowRight } from 'lucide-react'
import HeroImage from '@/components/ui/HeroImage'
import { getRandomHeroSrc } from '@/lib/heroImages'
import StadtBild from '@/components/ui/StadtBild'
import TextExpand from '@/components/ui/TextExpand'
import BewertungenCarousel from '@/components/ui/BewertungenCarousel'

export function generateStaticParams() {
  return STAEDTE.map((stadt) => ({ stadt: stadt.slug }))
}

export async function generateMetadata({ params }: { params: Promise<{ stadt: string }> }): Promise<Metadata> {
  const { stadt } = await params
  const stadtData = STAEDTE.find((s) => s.slug === stadt)
  if (!stadtData) return {}

  return {
    title: `Autoankauf ${stadtData.name} – Fair & Schnell | AutoAnkauf-Baden`,
    description: `Auto verkaufen in ${stadtData.name}: Kostenlose Bewertung, Angebot in 2–3h, kostenlose Abholung. Seit 6 Jahren dein Autoankauf in ${stadtData.region}. ${stadtData.beschreibung}`,
    keywords: `Auto verkaufen ${stadtData.name}, Autoankauf ${stadtData.name}, Gebrauchtwagen ${stadtData.name}, Auto bewerten ${stadtData.name}, KFZ Ankauf ${stadtData.region}`,
    alternates: {
      canonical: `https://autoankauf-baden.de/${stadtData.slug}`,
    },
  }
}

export default async function StadtPage({ params }: { params: Promise<{ stadt: string }> }) {
  const { stadt } = await params
  const stadtData = STAEDTE.find((s) => s.slug === stadt)
  if (!stadtData) notFound()

  const heroSrc = getRandomHeroSrc()
  const naechsteStaedteData = (stadtData.naechsteStaedte ?? [])
    .map((s) => STAEDTE.find((x) => x.slug === s))
    .filter(Boolean)

  return (
    <main>
      {/* Hero Section */}
      <section className="relative overflow-hidden flex items-center" style={{ minHeight: 'clamp(360px, 55vw, 440px)' }}>
        <div className="absolute inset-0 bg-[#0369A1]">
          <HeroImage src={heroSrc} />
          <div className="absolute inset-0 hero-overlay" />
        </div>

        <div className="relative z-10 w-full">
          <div className="container mx-auto px-5 md:px-6 lg:px-8">
            <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-8 py-14 md:py-16 lg:py-20">
              <div className="max-w-[520px]">
                <div className="inline-flex items-center gap-2 bg-white/10 backdrop-blur-sm border border-white/20 rounded-full px-4 py-2 mb-6">
                  <span className="w-2 h-2 rounded-full bg-[#22C55E] animate-pulse flex-shrink-0" />
                  <span className="text-white text-sm font-medium">Bereits 1.000+ Fahrzeuge angekauft</span>
                </div>

                <h1
                  className="font-black text-white mb-5 leading-tight"
                  style={{ fontSize: 'clamp(28px, 4vw, 40px)' }}
                >
                  {stadtData.teaser}
                </h1>

                <p className="text-white/90 text-lg mb-8 leading-relaxed">
                  {stadtData.beschreibung} Wir kaufen dein Auto fair, schnell und unkompliziert – direkt in {stadtData.name}.
                </p>

                <Link
                  href="/fahrzeug-verkaufen"
                  className="inline-flex items-center gap-3 bg-[#FB6F6F] hover:bg-[#f95c5c] text-white font-bold px-8 py-4 rounded-xl transition-colors duration-200"
                >
                  Jetzt Auto bewerten
                  <ArrowRight size={22} strokeWidth={2.5} />
                </Link>
              </div>

              <div className="lg:flex-shrink-0">
                <div className="bg-white/10 backdrop-blur-sm border border-white/20 rounded-2xl p-6 max-w-sm">
                  <h3 className="text-white font-bold text-lg mb-4">Warum AutoAnkauf-Baden?</h3>
                  <ul className="space-y-3 text-white/90">
                    {[
                      'Angebot in 2–3 Stunden*',
                      'Kostenlose Abholung',
                      'Seit 6 Jahren in der Region',
                    ].map((item) => (
                      <li key={item} className="flex items-start gap-3">
                        <span className="w-5 h-5 rounded-full bg-[#22C55E] flex items-center justify-center flex-shrink-0 mt-0.5">
                          <Check size={12} strokeWidth={2.5} color="white" />
                        </span>
                        <span>{item}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Stadt-Info + Bild Section */}
      <section className="py-16 md:py-20 bg-background">
        <div className="container mx-auto px-5 md:px-6 lg:px-8">
          <div className="grid lg:grid-cols-[3fr_2fr] gap-10 items-stretch">

            {/* Stadtbild – zuerst im DOM → auf Mobile oben */}
            <div className="lg:order-2">
              <StadtBild
                slug={stadtData.slug}
                bildText={stadtData.bildText}
                stadtName={stadtData.name}
              />
            </div>

            {/* Text + Schritte – auf Desktop links */}
            <div className="lg:order-1 space-y-4">

              {/* Stadtspezifische Headline */}
              <h2 className="text-lg font-bold text-text-primary mb-4">
                {stadtData.stadtHeadline}
              </h2>

              {/* Stadtinfo – auf Mobile einklappbar */}
              <TextExpand>
                <div className="space-y-3">
                  <p className="text-body text-text-secondary leading-relaxed">
                    {stadtData.beschreibungLang}
                  </p>
                  <p className="text-body text-text-secondary leading-relaxed">
                    {stadtData.beschreibungExtra[0]}
                  </p>
                </div>
              </TextExpand>

              {/* Subheadline: so läuft es ab */}
              <h3 className="text-base font-bold text-text-primary pt-2">
                Autoankauf in {stadtData.name} – so läuft es ab
              </h3>

              <p className="text-body text-text-secondary leading-relaxed">
                {stadtData.beschreibungExtra[1]}
              </p>

              <Link
                href="/fahrzeug-verkaufen"
                className="inline-flex items-center gap-3 bg-[#FB6F6F] hover:bg-[#f95c5c] text-white font-bold px-7 py-3.5 rounded-xl transition-colors duration-200"
              >
                Jetzt kostenlos bewerten
                <ArrowRight size={18} strokeWidth={2.5} />
              </Link>

              {/* 3 Schritte */}
              <div className="pt-4 border-t border-border">
                <h3 className="font-bold text-base text-text-primary mb-4">In 3 Schritten zum Verkauf</h3>
                <ol className="space-y-4">
                  {[
                    {
                      num: '1',
                      title: 'Fahrzeug beschreiben',
                      text: 'Füll unser kurzes Formular aus – Marke, Modell, Kilometerstand und Zustand. Dauert unter 3 Minuten.',
                    },
                    {
                      num: '2',
                      title: 'Angebot erhalten',
                      text: 'Wir melden uns innerhalb von 2–3 Stunden* persönlich mit einem fairen Angebot per E-Mail oder Telefon.',
                    },
                    {
                      num: '3',
                      title: `Abholung in ${stadtData.name}`,
                      text: 'Du nimmst an, wir kommen zu dir – kostenlose Abholung, Barzahlung vor Ort, fertig.',
                    },
                  ].map((s) => (
                    <li key={s.num} className="flex items-start gap-4">
                      <span className="w-8 h-8 rounded-full bg-primary text-white flex items-center justify-center text-sm font-bold flex-shrink-0 mt-0.5">
                        {s.num}
                      </span>
                      <div>
                        <p className="font-semibold text-text-primary text-sm">{s.title}</p>
                        <p className="text-text-secondary text-sm leading-relaxed">{s.text}</p>
                      </div>
                    </li>
                  ))}
                </ol>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Lokale Vorteile */}
      <section className="py-16 md:py-20 bg-card border-y border-border">
        <div className="container mx-auto px-5 md:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-h1 text-text-primary mb-4">Warum in {stadtData.name} bei uns verkaufen?</h2>
            <p className="text-body text-text-secondary max-w-2xl mx-auto">
              Als lokaler Autoankauf in {stadtData.region} kennen wir die Besonderheiten deiner Region und bieten dir den besten Service.
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            <div className="bg-background border border-border rounded-xl p-6">
              <div className="w-12 h-12 bg-primary-bg rounded-lg flex items-center justify-center mb-4">
                <MapPin size={22} strokeWidth={2.5} color="#0369A1" />
              </div>
              <h3 className="font-bold text-lg text-text-primary mb-2">Lokaler Service</h3>
              <p className="text-text-secondary">
                Wir kommen direkt zu dir nach {stadtData.name} – keine langen Fahrten zum Händler.
              </p>
            </div>

            <div className="bg-background border border-border rounded-xl p-6">
              <div className="w-12 h-12 bg-primary-bg rounded-lg flex items-center justify-center mb-4">
                <Clock size={22} strokeWidth={2.5} color="#0369A1" />
              </div>
              <h3 className="font-bold text-lg text-text-primary mb-2">Schnelle Abwicklung</h3>
              <p className="text-text-secondary">
                Innerhalb von 2–3 Stunden* erhältst du dein persönliches Angebot – persönlich und transparent.
              </p>
            </div>

            <div className="bg-background border border-border rounded-xl p-6">
              <div className="w-12 h-12 bg-primary-bg rounded-lg flex items-center justify-center mb-4">
                <CheckCircle size={22} strokeWidth={2.5} color="#0369A1" />
              </div>
              <h3 className="font-bold text-lg text-text-primary mb-2">Faire Preise</h3>
              <p className="text-text-secondary">
                Wir bieten dir den besten Preis für dein Fahrzeug – transparent und ohne versteckte Kosten.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Kundenstimmen */}
      <section className="py-12 md:py-16 bg-background">
        <div className="container mx-auto px-5 md:px-6 lg:px-8 max-w-2xl">
          <BewertungenCarousel anzahl={3} />
        </div>
      </section>

      {/* Weitere Städte */}
      {naechsteStaedteData.length > 0 && (
        <section className="py-12 md:py-16 bg-background border-b border-border">
          <div className="container mx-auto px-5 md:px-6 lg:px-8">
            <h2 className="text-lg font-bold text-text-primary mb-6 text-center">
              Autoankauf auch in deiner Nähe
            </h2>
            <div className="flex flex-wrap justify-center gap-3">
              {naechsteStaedteData.map((s) => s && (
                <Link
                  key={s.slug}
                  href={`/${s.slug}`}
                  className="px-5 py-2.5 bg-card border border-border rounded-full text-sm text-text-secondary hover:border-primary hover:text-primary transition-colors"
                >
                  Autoankauf {s.name}
                </Link>
              ))}
              <Link
                href="/fahrzeug-verkaufen"
                className="px-5 py-2.5 bg-[#FB6F6F] hover:bg-[#f95c5c] text-white rounded-xl text-sm font-medium transition-colors duration-200"
              >
                Jetzt Angebot holen
              </Link>
            </div>
          </div>
        </section>
      )}

      {/* CTA Section */}
      <section className="py-16 md:py-20 bg-primary">
        <div className="container mx-auto px-5 md:px-6 lg:px-8 text-center">
          <h2 className="text-h1 text-white mb-4">Bereit, dein Auto in {stadtData.name} zu verkaufen?</h2>
          <p className="text-white/90 text-lg mb-8 max-w-2xl mx-auto">
            Starte jetzt mit der kostenlosen Bewertung. Wir melden uns innerhalb von 2–3 Stunden* persönlich mit einem fairen Angebot – direkt aus {stadtData.region}.
          </p>
          <Link
            href="/fahrzeug-verkaufen"
            className="inline-flex items-center gap-3 bg-[#FB6F6F] hover:bg-[#f95c5c] text-white font-bold px-8 py-4 rounded-xl transition-colors duration-200"
          >
            Jetzt kostenlos bewerten
            <ArrowRight size={22} strokeWidth={2.5} />
          </Link>
        </div>
      </section>

      {/* Lokales JSON-LD Schema */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            '@context': 'https://schema.org',
            '@type': 'AutoDealer',
            name: `AutoAnkauf-Baden – ${stadtData.name}`,
            description: stadtData.beschreibung,
            areaServed: {
              '@type': 'City',
              name: stadtData.name,
            },
            address: {
              '@type': 'PostalAddress',
              addressLocality: 'Bruchsal',
              addressRegion: 'Baden-Württemberg',
              addressCountry: 'DE',
            },
            url: `https://autoankauf-baden.de/${stadtData.slug}`,
            telephone: '+49-7251-000000',
            priceRange: 'fair',
            openingHoursSpecification: {
              '@type': 'OpeningHoursSpecification',
              dayOfWeek: ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'],
              opens: '08:00',
              closes: '20:00',
            },
          }),
        }}
      />
    </main>
  )
}
