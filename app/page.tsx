import { Metadata } from 'next'
import HeroSection from '@/components/home/HeroSection'
import TrustCounter from '@/components/home/TrustCounter'
import UspSection from '@/components/home/UspSection'
import HowItWorks from '@/components/home/HowItWorks'
import ReviewsSection from '@/components/home/ReviewsSection'
import PersonSection from '@/components/home/PersonSection'
import HaendlerTeaser from '@/components/home/HaendlerTeaser'
import StadtGrid from '@/components/home/StadtGrid'
import FaqAccordion from '@/components/home/FaqAccordion'
import WertRechner from '@/components/home/WertRechner'

export const metadata: Metadata = {
  title: 'Autoankauf Baden – Fair & Schnell | AutoAnkauf-Baden',
  description:
    'Auto verkaufen in Baden: Kostenlos bewerten lassen, Angebot in 2–3h, kostenlose Abholung. Seit 6 Jahren dein Autoankauf in Karlsruhe, Bruchsal, Heidelberg & der Region.',
}

const jsonLd = {
  '@context': 'https://schema.org',
  '@graph': [
    {
      '@type': 'Organization',
      '@id': 'https://autoankauf-baden.de/#organization',
      name: 'AutoAnkauf-Baden',
      url: 'https://autoankauf-baden.de',
      logo: 'https://autoankauf-baden.de/logo-export.svg',
      description:
        'Seit 6 Jahren fairer Autoankauf in Bruchsal und der Region Baden. Persönlich, transparent, ohne Umwege.',
      foundingDate: '2019',
      founder: {
        '@type': 'Person',
        name: 'Muhammet Demir',
      },
      address: {
        '@type': 'PostalAddress',
        streetAddress: 'Heidelberger Str. 4',
        postalCode: '76676',
        addressLocality: 'Graben-Neudorf',
        addressRegion: 'Baden-Württemberg',
        addressCountry: 'DE',
      },
      areaServed: [
        'Karlsruhe', 'Bruchsal', 'Heidelberg', 'Mannheim', 'Speyer',
        'Pforzheim', 'Rastatt', 'Baden-Baden', 'Ludwigshafen', 'Germersheim',
      ],
    },
    {
      '@type': ['LocalBusiness', 'AutoDealer'],
      '@id': 'https://autoankauf-baden.de/#localbusiness',
      name: 'AutoAnkauf-Baden',
      url: 'https://autoankauf-baden.de',
      image: 'https://autoankauf-baden.de/logo-export.svg',
      description:
        'Faire Preise, kostenlose Abholung, Angebot in 2–3 Stunden. Wir kaufen alle Fahrzeuge an – egal ob Unfallwagen, defekt oder fahrbereit.',
      priceRange: '€€',
      address: {
        '@type': 'PostalAddress',
        streetAddress: 'Heidelberger Str. 4',
        postalCode: '76676',
        addressLocality: 'Graben-Neudorf',
        addressRegion: 'Baden-Württemberg',
        addressCountry: 'DE',
      },
      openingHoursSpecification: [
        {
          '@type': 'OpeningHoursSpecification',
          dayOfWeek: ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday'],
          opens: '06:00',
          closes: '18:00',
        },
        {
          '@type': 'OpeningHoursSpecification',
          dayOfWeek: ['Saturday'],
          opens: '06:00',
          closes: '13:00',
        },
      ],
      areaServed: [
        'Karlsruhe', 'Bruchsal', 'Heidelberg', 'Mannheim', 'Speyer',
        'Pforzheim', 'Rastatt', 'Baden-Baden', 'Ludwigshafen', 'Germersheim',
      ],
      hasOfferCatalog: {
        '@type': 'OfferCatalog',
        name: 'Autoankauf-Leistungen',
        itemListElement: [
          {
            '@type': 'Offer',
            itemOffered: {
              '@type': 'Service',
              name: 'Autoankauf – kostenlose Fahrzeugbewertung',
              description:
                'Kostenlose und unverbindliche Bewertung deines Fahrzeugs. Angebot in 2–3 Stunden, Bezahlung sofort bei Abholung.',
            },
          },
          {
            '@type': 'Offer',
            itemOffered: {
              '@type': 'Service',
              name: 'Kostenlose Fahrzeugabholung',
              description:
                'Wir holen dein Fahrzeug kostenlos bei dir ab – egal ob zuhause, bei der Arbeit oder einem anderen Wunschort.',
            },
          },
        ],
      },
    },
  ],
}

export default function HomePage() {
  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <main>
        <HeroSection />
        <TrustCounter />
        <UspSection />
        <HowItWorks />
        <WertRechner />
        <ReviewsSection />
        <PersonSection />
        <HaendlerTeaser />
        <StadtGrid />
        <FaqAccordion />
      </main>
    </>
  )
}
