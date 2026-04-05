'use client'

import { useState } from 'react'
import { TELEFON } from '@/lib/constants'

const faqs = [
  {
    question: 'Wie funktioniert der Autoankauf?',
    answer: 'Einfach das Formular ausfüllen (dauert 2 Minuten), wir melden uns innerhalb von 2–3 Stunden* persönlich mit einem Angebot zurück. Bei Zusage vereinbaren wir einen Abholtermin und zahlen sofort bar. (*Werktags 6–18 Uhr, Samstag 6–13 Uhr)',
  },
  {
    question: 'Was kostet der Service?',
    answer: 'Unser Service ist komplett kostenlos und unverbindlich. Du gehst keinerlei Verpflichtungen ein. Auch die Abholung ist für dich kostenfrei.',
  },
  {
    question: 'Wie schnell bekomme ich ein Angebot?',
    answer: 'Innerhalb der Geschäftszeiten (Mo–Fr 6–18 Uhr, Sa 6–13 Uhr) in 2–3 Stunden. Das Formular ist 24/7 verfügbar – Anfragen außerhalb der Geschäftszeiten werden am nächsten Werktag bearbeitet. Wir prüfen jede Anfrage persönlich.',
  },
  {
    question: 'Wie wird das Auto abgeholt?',
    answer: 'Wir holen dein Fahrzeug kostenlos bei dir zuhause oder an einem anderen Wunschort ab. Du bestimmst Datum und Uhrzeit – wir sind flexibel.',
  },
  {
    question: 'Was passiert wenn das Auto finanziert ist?',
    answer: 'Kein Problem! Wir klären gemeinsam mit dir die Restschuldablöse beim Finanzierungsinstitut. Das übernehmen wir für dich – unkompliziert und transparent.',
  },
  {
    question: 'Welche Autos kauft ihr an?',
    answer: 'Wir kaufen alle Marken, alle Modelle – unabhängig von Alter, Kilometerstand oder Zustand. Auch Unfallfahrzeuge, nicht fahrfähige Autos und Fahrzeuge mit Motorschaden sind willkommen.',
  },
  {
    question: 'Wie wird der Preis ermittelt?',
    answer: 'Der Preis basiert auf aktuellen Marktdaten, dem Zustand deines Fahrzeugs, Kilometerstand, Baujahr und Ausstattung. Wir sind transparent – du siehst, wie wir zum Preis kommen.',
  },
  {
    question: 'In welchen Regionen seid ihr tätig?',
    answer: 'Wir sind in ganz Baden und der Pfalz tätig: Karlsruhe, Bruchsal, Heidelberg, Mannheim, Speyer, Pforzheim, Rastatt, Baden-Baden, Ludwigshafen und Germersheim – und dem gesamten Umland.',
  },
  {
    question: 'Bietet ihr auch Fahrzeuge zum Kauf an oder kann ich verrechnen?',
    answer: 'Ja! Autohaus Stern in Graben-Neudorf ist unser eigener AutoAnkauf Baden Verkaufsstandort – mit großer Fahrzeugauswahl, direkter Inzahlungnahme und Werkstatt & Service vor Ort. Mehr Infos: autoankauf-baden.de/fahrzeuge-kaufen',
  },
  {
    question: 'Wie läuft die Inzahlungnahme genau ab?',
    answer: 'Du bringst dein Altfahrzeug einfach mit zum Termin beim Autohaus Stern in Graben-Neudorf. Wir bewerten dein Fahrzeug fair und rechnen den Wert direkt als Anzahlung auf dein neues Auto an. Kein Umweg über privaten Verkauf, kein Stress – alles in einem Termin erledigt.',
  },
  {
    question: 'Welche Werkstatt- und Serviceleistungen bietet ihr an?',
    answer: 'In unserer Werkstatt beim Autohaus Stern in Graben-Neudorf bieten wir Ölwechsel, TÜV-Vorbereitung, Bremsen-Check und -Wechsel sowie allgemeine Wartungsarbeiten an. Alles zu fairen Preisen und mit persönlichem Ansprechpartner vor Ort.',
  },
  {
    question: 'Kann ich mein Auto verkaufen und direkt ein neues kaufen?',
    answer: 'Genau das ist unser Angebot. AutoAnkauf Baden kauft dein Fahrzeug an – und direkt an unserem Verkaufsstandort Autohaus Stern in Graben-Neudorf kannst du gleichzeitig ein neues Fahrzeug aussuchen. Inzahlungnahme, Beratung und Übergabe alles an einem Ort.',
  },
  {
    question: 'Wo befindet sich euer Verkaufsstandort Autohaus Stern?',
    answer: 'Autohaus Stern – unser AutoAnkauf Baden Verkaufsstandort – liegt in Graben-Neudorf, Heidelberger Str. 4. Gut erreichbar aus dem Raum Karlsruhe, Bruchsal, Speyer und Heidelberg. Öffnungszeiten: Mo–Fr 9–18 Uhr, Sa 9–14 Uhr. Einfach vorbeikommen oder vorab auf autoankauf-baden.de/fahrzeuge-kaufen informieren.',
  },
]

const faqSchema = {
  '@context': 'https://schema.org',
  '@type': 'FAQPage',
  mainEntity: faqs.map(f => ({
    '@type': 'Question',
    name: f.question,
    acceptedAnswer: {
      '@type': 'Answer',
      text: f.answer,
    },
  })),
}

export default function FaqAccordion() {
  const [openIndex, setOpenIndex] = useState<number | null>(0)

  const toggle = (i: number) => {
    setOpenIndex(openIndex === i ? null : i)
  }

  return (
    <section className="py-16 md:py-20 bg-white">
      {/* JSON-LD Schema */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(faqSchema) }}
      />

      <div className="container mx-auto px-4 md:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center mb-12">
          <div className="inline-flex items-center gap-2 bg-[#E8F4FD] border border-[#F0F7FF] rounded-full px-4 py-2 mb-4">
            <span className="text-sm font-semibold text-[#0369A1]">Häufige Fragen</span>
          </div>
          <h2 className="text-[24px] font-extrabold text-[#0F172A] mb-3">
            Alles was du wissen musst
          </h2>
        </div>

        {/* Accordion */}
        <div className="max-w-3xl mx-auto divide-y divide-[#E2EDF7] border border-[#E2EDF7] rounded-2xl overflow-hidden">
          {faqs.map((faq, i) => {
            const isOpen = openIndex === i
            return (
              <div key={i} className="bg-white">
                <button
                  onClick={() => toggle(i)}
                  className="w-full flex items-center justify-between gap-4 px-6 py-5 text-left hover:bg-[#F8FAFC] transition-colors duration-200"
                  aria-expanded={isOpen}
                >
                  <span className="font-semibold text-[#0F172A] text-[15px] leading-snug">
                    {faq.question}
                  </span>
                  <span
                    className="flex-shrink-0 w-6 h-6 rounded-full flex items-center justify-center text-lg font-light leading-none transition-colors duration-200"
                    style={{
                      backgroundColor: isOpen ? '#0369A1' : '#F1F5F9',
                      color: isOpen ? 'white' : '#64748B',
                    }}
                    aria-hidden="true"
                  >
                    {isOpen ? '−' : '+'}
                  </span>
                </button>

                {/* Animated answer */}
                <div
                  style={{
                    maxHeight: isOpen ? '400px' : '0',
                    overflow: 'hidden',
                    transition: 'max-height 280ms ease',
                  }}
                >
                  <p className="px-6 pb-5 text-[#64748B] text-sm leading-relaxed">
                    {faq.answer}
                  </p>
                </div>
              </div>
            )
          })}
        </div>

        {/* CTA */}
        {TELEFON && (
          <div className="text-center mt-10">
            <p className="text-[#64748B] text-sm mb-3">Noch eine Frage?</p>
            <a
              href={`tel:${TELEFON}`}
              className="inline-flex items-center gap-2 text-[#0369A1] hover:text-[#0EA5E9] font-semibold transition-colors duration-200"
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
              </svg>
              Ruf uns direkt an: {TELEFON}
            </a>
          </div>
        )}
      </div>
    </section>
  )
}
