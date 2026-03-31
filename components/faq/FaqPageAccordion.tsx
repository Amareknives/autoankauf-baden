'use client'

import { useState } from 'react'

const kategorien = [
  {
    titel: 'Erreichbarkeit & Reaktionszeiten',
    items: [
      {
        frage: 'Wann seid ihr erreichbar?',
        antwort:
          'Per Telefon und WhatsApp sind wir montags bis freitags von 6:00 bis 18:00 Uhr und samstags von 6:00 bis 13:00 Uhr erreichbar. E-Mail-Anfragen können jederzeit – also auch nachts oder am Wochenende – eingereicht werden. Wir antworten dann innerhalb der nächsten Geschäftszeiten.',
      },
      {
        frage: 'Ich habe außerhalb der Geschäftszeiten eine WhatsApp geschrieben – wann bekomme ich Antwort?',
        antwort:
          'WhatsApp-Nachrichten außerhalb unserer Geschäftszeiten werden am nächsten Werktag beantwortet. Wir bitten um ein bisschen Geduld – wir prüfen dein Anliegen persönlich.',
      },
      {
        frage: 'Kann ich nachts oder am Wochenende eine Anfrage stellen?',
        antwort:
          'Ja, absolut! Das Online-Formular ist 24/7 verfügbar – du kannst deine Anfrage jederzeit einreichen. Wir bearbeiten sie dann am nächsten Werktag innerhalb von 2–3 Stunden. So geht keine Zeit verloren.',
      },
    ],
  },
  {
    titel: 'Ablauf & Prozess',
    items: [
      {
        frage: 'Wie funktioniert der Autoankauf bei euch?',
        antwort:
          'Ganz einfach in 3 Schritten: Du füllst unser Online-Formular aus (dauert ca. 2 Minuten), wir melden uns innerhalb von 2–3 Stunden persönlich mit einem vorläufigen Angebot zurück. Bei Zusage vereinbaren wir einen Termin – wir kommen zu dir, prüfen das Fahrzeug kurz und zahlen sofort bar. Kein Stress, kein Aufwand.',
      },
      {
        frage: 'Wie schnell bekomme ich ein Angebot?',
        antwort:
          'Du erhältst dein persönliches Angebot innerhalb von 2–3 Stunden nach der Anfrage – per E-Mail oder telefonisch. Wichtig: Das gilt werktags von 6–18 Uhr und samstags von 6–13 Uhr. Wir prüfen jede Anfrage persönlich.',
      },
      {
        frage: 'Muss ich zum Termin kommen oder kommt ihr zu mir?',
        antwort:
          'Wir kommen zu dir! Kostenlose Abholung bei dir zuhause, am Arbeitsplatz oder an einem anderen Wunschort. Du bestimmst Datum und Uhrzeit – wir sind flexibel.',
      },
      {
        frage: 'Wie läuft die Fahrzeugübergabe ab?',
        antwort:
          'Beim vereinbarten Termin prüfen wir das Fahrzeug kurz, du erhältst sofort dein Geld in bar, wir unterschreiben gemeinsam den Kaufvertrag und nehmen das Fahrzeug mit. Der ganze Prozess dauert in der Regel 30–45 Minuten.',
      },
      {
        frage: 'Was muss ich zum Termin mitbringen?',
        antwort:
          'Alle Fahrzeugpapiere (Zulassungsbescheinigung Teil I & II), alle Schlüssel, dein Personalausweis und – falls vorhanden – Serviceheft und AU/HU-Nachweis.',
      },
    ],
  },
  {
    titel: 'Fahrzeug & Zustand',
    items: [
      {
        frage: 'Welche Autos kauft ihr an?',
        antwort:
          'Wir kaufen alle Marken, alle Modelle – unabhängig von Alter, Kilometerstand oder Zustand. Auch Unfallfahrzeuge, nicht fahrtüchtige Autos, Fahrzeuge mit Motorschaden oder hohem TÜV-Aufwand sind willkommen.',
      },
      {
        frage: 'Kauft ihr auch Autos mit Unfallschaden?',
        antwort:
          'Ja, absolut. Unfallfahrzeuge gehören zu unseren häufigsten Ankäufen. Bitte gib im Formular alle bekannten Schäden ehrlich an – das beschleunigt den Prozess und sorgt für ein faires Angebot.',
      },
      {
        frage: 'Was ist, wenn mein Auto nicht mehr fährt?',
        antwort:
          'Kein Problem. Wir organisieren auch den Abtransport nicht fahrtüchtiger Fahrzeuge. Teile uns das einfach beim Ausfüllen des Formulars mit.',
      },
      {
        frage: 'Kauft ihr auch sehr alte Autos oder Autos mit hohem Kilometerstand?',
        antwort:
          'Ja. Kein Fahrzeug ist zu alt oder hat zu viele Kilometer. Der Preis richtet sich nach dem tatsächlichen Wert – aber wir kaufen grundsätzlich jedes Fahrzeug an.',
      },
    ],
  },
  {
    titel: 'Preis & Zahlung',
    items: [
      {
        frage: 'Wie wird der Ankaufspreis ermittelt?',
        antwort:
          'Der Preis basiert auf aktuellen Marktdaten, dem Zustand deines Fahrzeugs, dem Kilometerstand, dem Baujahr und der Ausstattung. Das Angebot per E-Mail ist vorläufig und basiert auf deinen Angaben im Formular – der endgültige Preis wird nach der persönlichen Besichtigung verbindlich festgelegt.',
      },
      {
        frage: 'Wie und wann bekomme ich das Geld?',
        antwort:
          'Du erhältst das Geld sofort bei der Fahrzeugübergabe – bar auf die Hand. Keine Wartezeiten, keine Überweisungen.',
      },
      {
        frage: 'Kostet mich das Angebot etwas?',
        antwort:
          'Nein, unser Service ist komplett kostenlos und unverbindlich. Auch die Abholung ist kostenlos. Es entstehen keinerlei Kosten, wenn du das Angebot ablehnst.',
      },
      {
        frage: 'Kann sich der Preis nach der Besichtigung noch ändern?',
        antwort:
          'Das Angebot steht unter dem Vorbehalt der persönlichen Besichtigung. Entspricht das Fahrzeug deinen Angaben, bleibt der Preis gleich. Du bist nie verpflichtet, ein geändertes Angebot anzunehmen.',
      },
    ],
  },
  {
    titel: 'Sonderfälle',
    items: [
      {
        frage: 'Was ist, wenn das Auto noch finanziert ist?',
        antwort:
          'Kein Problem! Wir klären gemeinsam die Restschuldablöse beim Finanzierungsinstitut und koordinieren die Abwicklung.',
      },
      {
        frage: 'Kauft ihr auch Autos mit ausländischer Zulassung?',
        antwort:
          'In der Regel ja. Schreib uns am besten direkt per E-Mail oder WhatsApp, damit wir den Einzelfall prüfen können.',
      },
      {
        frage: 'Was passiert, wenn das Auto auf jemand anderen zugelassen ist?',
        antwort:
          'Der Verkäufer muss der rechtmäßige Eigentümer sein oder eine Vollmacht mitbringen. Kontaktiere uns vorab, wenn das der Fall ist.',
      },
    ],
  },
  {
    titel: 'Tipps & Tricks beim Autoverkauf',
    items: [
      {
        frage: 'Wie bekomme ich den besten Preis für mein Auto?',
        antwort:
          'Vollständige und ehrliche Angaben sind das A und O. Gib alle Ausstattungsmerkmale an – Sitzheizung, Navi, Panoramadach – denn jedes Detail kann den Preis positiv beeinflussen. Ein sauber geputztes Auto bei der Besichtigung hinterlässt außerdem einen guten Eindruck. Wichtig: Verstecke keine Schäden – das kostet am Ende mehr Zeit und Vertrauen.',
      },
      {
        frage: 'Wann ist der beste Zeitpunkt, ein Auto zu verkaufen?',
        antwort:
          'Frühjahr und Herbst gelten als klassische Hochzeiten – viele Käufer wechseln dann ihr Fahrzeug. Für dich als Verkäufer spielt der Zeitpunkt bei uns allerdings keine Rolle: Wir kaufen das ganze Jahr, unabhängig von Saison oder Marktlage.',
      },
      {
        frage: 'Auto mit abgelaufenem TÜV verkaufen – geht das?',
        antwort:
          'Ja. Ein abgelaufener TÜV reduziert zwar den Wert etwas, ist aber kein Hindernis. Wir kaufen Fahrzeuge auch ohne gültige HU – du musst das Auto also nicht extra zur Hauptuntersuchung bringen, bevor du es verkaufst.',
      },
      {
        frage: 'Was muss ich vor dem Verkauf aus dem Auto räumen?',
        antwort:
          'Alle persönlichen Gegenstände, Kindersitze, Parkscheiben, Ladekabel und natürlich deine Wertsachen. Denk auch an die Heckklappe und den Kofferraumraum. Reserverad und Wagenheber gehören zum Fahrzeug und bleiben drin – es sei denn, es wurde ausdrücklich anders vereinbart.',
      },
      {
        frage: 'Kfz-Brief verloren – kann ich das Auto trotzdem verkaufen?',
        antwort:
          'Den Kfz-Brief (Zulassungsbescheinigung Teil II) kannst du bei der zuständigen Zulassungsstelle als verloren melden und einen Ersatz beantragen. Das dauert meist nur wenige Tage. Ohne diesen Schein ist ein rechtssicherer Verkauf nicht möglich – sprich uns an, wir helfen dir dabei den Prozess zu koordinieren.',
      },
      {
        frage: 'Muss ich das Auto abmelden, bevor ich es verkaufe?',
        antwort:
          'Nein. Bei einem Verkauf an uns übernehmen wir die Ummeldung. Du musst das Fahrzeug nicht vorher abmelden. Wir regeln das gemeinsam bei der Übergabe – inklusive aller nötigen Formulare.',
      },
    ],
  },
  {
    titel: 'Privatverkauf vs. Ankauf beim Händler',
    items: [
      {
        frage: 'Bekomme ich beim Privatverkauf mehr Geld als bei euch?',
        antwort:
          'Manchmal ja – auf dem Papier. Aber: Du wartest oft wochenlang auf einen Käufer, hast Besichtigungstourismus, Preisverhandlungen und haftest noch Monate nach dem Verkauf für Mängel. Bei uns bekommst du innerhalb von 24–48 Stunden Geld in der Hand – ohne Stress, ohne Risiko. Was deine Zeit wert ist, entscheidest du.',
      },
      {
        frage: 'Welche Risiken hat der Privatverkauf?',
        antwort:
          'Das größte Risiko: Käufer, die Wochen nach dem Kauf mit angeblichen Mängeln zurückkommen und Geld fordern. Auch wenn du "wie gesehen, ohne Gewährleistung" im Vertrag stehst – bei arglistig verschwiegenen Mängeln haftest du trotzdem. Hinzu kommt das Risiko von gefälschten Überweisungsbelegen oder Betrug beim Fahrzeugtransport. All das fällt bei uns weg.',
      },
    ],
  },
  {
    titel: 'Einzugsgebiet & Abholung',
    items: [
      {
        frage: 'In welchen Städten und Regionen kauft ihr Autos an?',
        antwort:
          'Unser Hauptgebiet umfasst Karlsruhe, Bruchsal, Heidelberg, Mannheim, Speyer, Pforzheim, Rastatt, Baden-Baden, Ludwigshafen und Germersheim – sowie das gesamte Umland. Grundsätzlich sind wir in ganz Baden und der Pfalz tätig. Bei Unsicherheit einfach kurz anfragen.',
      },
      {
        frage: 'Kommt ihr auch zu mir nach Hause?',
        antwort:
          'Ja, das ist unser Standard. Wir kommen zu dir – ob nach Hause, an den Arbeitsplatz oder an einen anderen Wunschort. Die Abholung ist kostenlos und du bestimmst Datum und Uhrzeit.',
      },
      {
        frage: 'Gibt es Besonderheiten beim Autoverkauf in Baden-Württemberg?',
        antwort:
          'Der Ablauf ist deutschlandweit weitgehend einheitlich – Kaufvertrag, Zulassungsübertragung, Abmeldung. In Baden-Württemberg gibt es einige regionale Zulassungsstellen mit unterschiedlichen Öffnungszeiten. Das ist aber dein geringster Stress: Wir koordinieren die Formalitäten und kümmern uns um alles.',
      },
    ],
  },
]

const faqSchema = {
  '@context': 'https://schema.org',
  '@type': 'FAQPage',
  mainEntity: kategorien.flatMap(k =>
    k.items.map(f => ({
      '@type': 'Question',
      name: f.frage,
      acceptedAnswer: { '@type': 'Answer', text: f.antwort },
    }))
  ),
}

export default function FaqPageAccordion() {
  const [offeneItems, setOffeneItems] = useState<Record<string, boolean>>({})

  const toggle = (key: string) => {
    setOffeneItems(prev => ({ ...prev, [key]: !prev[key] }))
  }

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(faqSchema) }}
      />

      <div className="space-y-10">
        {kategorien.map(kat => (
          <div key={kat.titel}>
            <h2 className="text-[18px] font-bold text-[#0F172A] mb-4 flex items-center gap-2">
              <span className="w-1.5 h-5 bg-[#0369A1] rounded-full inline-block" />
              {kat.titel}
            </h2>

            <div className="divide-y divide-[#E2EDF7] border border-[#E2EDF7] rounded-2xl overflow-hidden">
              {kat.items.map((item, i) => {
                const key = `${kat.titel}-${i}`
                const isOpen = !!offeneItems[key]
                return (
                  <div key={key} className="bg-white">
                    <button
                      onClick={() => toggle(key)}
                      className="w-full flex items-center justify-between gap-4 px-6 py-5 text-left hover:bg-[#F8FAFC] transition-colors duration-200"
                      aria-expanded={isOpen}
                    >
                      <span className="font-semibold text-[#0F172A] text-[15px] leading-snug">
                        {item.frage}
                      </span>
                      <span
                        className="flex-shrink-0 w-7 h-7 rounded-full flex items-center justify-center text-lg font-light leading-none transition-colors duration-200"
                        style={{
                          backgroundColor: isOpen ? '#0369A1' : '#F1F5F9',
                          color: isOpen ? 'white' : '#64748B',
                        }}
                      >
                        {isOpen ? '−' : '+'}
                      </span>
                    </button>
                    <div
                      style={{
                        maxHeight: isOpen ? '500px' : '0',
                        overflow: 'hidden',
                        transition: 'max-height 280ms ease',
                      }}
                    >
                      <p className="px-6 pb-5 text-[#64748B] text-sm leading-relaxed">
                        {item.antwort}
                      </p>
                    </div>
                  </div>
                )
              })}
            </div>
          </div>
        ))}
      </div>
    </>
  )
}
