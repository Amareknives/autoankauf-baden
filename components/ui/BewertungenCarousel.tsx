'use client'

import { useState, useEffect } from 'react'
import { Star } from 'lucide-react'

interface Bewertung {
  name: string
  ort: string
  text: string
  sterne: number
}

const ALLE_BEWERTUNGEN: Bewertung[] = [
  {
    name: 'Thomas R.',
    ort: 'Karlsruhe',
    sterne: 5,
    text: 'Hatte einen alten Kombi mit fast 250.000 km. Hab ehrlich gesagt nicht viel erwartet, aber das Angebot war fair. Abwicklung hat keine 2 Stunden gedauert.',
  },
  {
    name: 'Sandra K.',
    ort: 'Bruchsal',
    sterne: 5,
    text: 'Unkompliziert und ehrlich. Kein Feilschen, der Preis war von Anfang an in Ordnung. Würde jederzeit wieder verkaufen.',
  },
  {
    name: 'Marco S.',
    ort: 'Karlsruhe',
    sterne: 5,
    text: 'Angebot am Vormittag, Auto abgeholt am Nachmittag. Hätte nicht gedacht, dass das so schnell geht.',
  },
  {
    name: 'Julia M.',
    ort: 'Heidelberg',
    sterne: 5,
    text: 'Musste wegen Umzug schnell verkaufen. Kurzfristiger Termin war kein Problem, hat super geklappt.',
  },
  {
    name: 'Michael B.',
    ort: 'Mannheim',
    sterne: 4,
    text: 'Das Angebot kam etwas später als die 2 Stunden, aber war trotzdem in Ordnung. Preis war realistisch, Abholung pünktlich.',
  },
  {
    name: 'Anna L.',
    ort: 'Rastatt',
    sterne: 5,
    text: 'Hatte einen Unfallwagen, der seit Monaten in der Garage stand. Endlich weg damit – und der Preis war besser als ich gedacht hätte.',
  },
  {
    name: 'Stefan W.',
    ort: 'Baden-Baden',
    sterne: 5,
    text: 'Alter Diesel, dachte das wird wegen Fahrverboten schwierig. War aber kein Problem, Preis war fair.',
  },
  {
    name: 'Katrin H.',
    ort: 'Speyer',
    sterne: 5,
    text: 'Angebot über WhatsApp bekommen, sehr praktisch. Alles so abgelaufen wie versprochen.',
  },
  {
    name: 'Frank D.',
    ort: 'Pforzheim',
    sterne: 4,
    text: 'Ehrliche Kommunikation, kein Überreden. Hätte mir vielleicht 100 € mehr gewünscht, aber insgesamt war es fair.',
  },
  {
    name: 'Petra N.',
    ort: 'Ludwigshafen',
    sterne: 5,
    text: 'Zum zweiten Mal dabei. Auch diesmal alles reibungslos gelaufen. Empfehle ich auf jeden Fall weiter.',
  },
  {
    name: 'Andreas M.',
    ort: 'Stuttgart',
    sterne: 5,
    text: 'Sind extra nach Stuttgart gefahren um das Auto abzuholen. Hat alles gepasst, pünktlich und freundlich.',
  },
  {
    name: 'Lisa S.',
    ort: 'Bruchsal',
    sterne: 5,
    text: 'Beim Papierkram haben die mir geholfen, bin damit nicht so vertraut. Sehr unkompliziert und nett.',
  },
  {
    name: 'Tobias K.',
    ort: 'Karlsruhe',
    sterne: 5,
    text: 'Beide Autos von uns verkauft, innerhalb einer Woche. Lief beides problemlos.',
  },
  {
    name: 'Maria V.',
    ort: 'Mannheim',
    sterne: 5,
    text: 'Motorschaden, Auto fuhr nicht mehr. Trotzdem noch einen vernünftigen Preis bekommen. Hat mich positiv überrascht.',
  },
  {
    name: 'Ralf G.',
    ort: 'Heidelberg',
    sterne: 4,
    text: 'Solide Abwicklung, nichts zu beanstanden. Wäre schön wenn Samstags frühere Termine möglich wären, aber sonst alles gut.',
  },
  {
    name: 'Christine B.',
    ort: 'Karlsruhe',
    sterne: 5,
    text: 'Hab für meine Mutter angerufen, sie wusste nicht wie das geht. Sehr geduldig erklärt und alles problemlos abgewickelt.',
  },
  {
    name: 'Jürgen S.',
    ort: 'Mannheim',
    sterne: 5,
    text: 'Hab das Auto online eingetragen und innerhalb von 90 Minuten einen Rückruf bekommen. Sehr flott.',
  },
  {
    name: 'Nina W.',
    ort: 'Heidelberg',
    sterne: 4,
    text: 'Alles reibungslos gelaufen. Einziger Punkt: Hätte mir vorher gewünscht zu wissen, welche Unterlagen ich bereithalten soll. Aber Preis und Abwicklung top.',
  },
  {
    name: 'Markus T.',
    ort: 'Karlsruhe',
    sterne: 5,
    text: 'Dritter Verkauf über AutoAnkauf-Baden. Immer fair, immer zuverlässig. Ich gehe nirgendwo anders mehr hin.',
  },
  {
    name: 'Sabine F.',
    ort: 'Baden-Baden',
    sterne: 5,
    text: 'Gepflegter BMW, wollte keinen Privatverkauf mit Probefahrten und Verhandlungen. Hier alles in einem Termin erledigt.',
  },
]

function Sterne({ anzahl }: { anzahl: number }) {
  return (
    <div className="flex items-center gap-0.5">
      {Array.from({ length: 5 }).map((_, i) => (
        <Star
          key={i}
          size={13}
          fill={i < anzahl ? '#F59E0B' : '#E2EDF7'}
          color={i < anzahl ? '#F59E0B' : '#E2EDF7'}
        />
      ))}
    </div>
  )
}

function zufaelligeIndizes(vorherige: number[], anzahl: number): number[] {
  const pool = ALLE_BEWERTUNGEN.map((_, i) => i).filter((i) => !vorherige.includes(i))
  const result: number[] = []
  while (result.length < anzahl && pool.length > 0) {
    const idx = Math.floor(Math.random() * pool.length)
    result.push(pool.splice(idx, 1)[0])
  }
  return result
}

export default function BewertungenCarousel({ anzahl = 2 }: { anzahl?: number }) {
  const [indizes, setIndizes] = useState<number[]>(() =>
    Array.from({ length: anzahl }, (_, i) => i)
  )

  useEffect(() => {
    setIndizes(zufaelligeIndizes([], anzahl))
  }, [anzahl])

  return (
    <div className="bg-white border border-[#E2EDF7] rounded-2xl p-6">
      <h3 className="text-sm font-bold text-[#0F172A] mb-4">Das sagen unsere Kunden</h3>

      <div className="space-y-4">
        {indizes.map((idx) => {
          const b = ALLE_BEWERTUNGEN[idx]
          return (
            <div key={idx} className="pb-4 last:pb-0 border-b border-[#E2EDF7] last:border-0">
              <div className="flex items-center justify-between mb-1.5">
                <Sterne anzahl={b.sterne} />
                <span className="text-xs text-[#94A3B8]">{b.ort}</span>
              </div>
              <p className="text-sm text-[#64748B] leading-relaxed italic">„{b.text}"</p>
              <p className="text-xs text-[#94A3B8] mt-1.5 font-medium">{b.name}</p>
            </div>
          )
        })}
      </div>

    </div>
  )
}
