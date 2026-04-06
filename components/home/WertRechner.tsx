'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { MARKEN_BELIEBTESTE, MARKEN_ALLE } from '@/constants/marken'
import { MODELLE_PRO_MARKE } from '@/constants/modelle'
import { ChevronRight } from 'lucide-react'
import { ChipSelect } from '@/components/ui/ChipSelect'

const MARKEN_SECTIONS = [
  { label: 'Beliebte Marken', items: MARKEN_BELIEBTESTE },
  { label: 'Alle Marken', items: [...MARKEN_ALLE, 'Sonstige'] },
]

const THIS_YEAR = new Date().getFullYear()
const YEAR_OPTIONS = [
  ...Array.from({ length: THIS_YEAR - 1949 }, (_, i) => String(THIS_YEAR - i)),
  'Vor 1950',
  'Nie zugelassen',
]

export default function WertRechner() {
  const router = useRouter()
  const [marke, setMarke] = useState('')
  const [modell, setModell] = useState('')
  const [jahr, setJahr] = useState('')
  const [km, setKm] = useState('')
  const [error, setError] = useState('')

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    if (!marke || !modell || !jahr || !km) {
      setError('Bitte alle Felder ausfüllen.')
      return
    }
    setError('')

    try {
      const existing = JSON.parse(localStorage.getItem('aab_form_v1') ?? '{}')
      localStorage.setItem(
        'aab_form_v1',
        JSON.stringify({
          ...existing,
          marke,
          modell,
          erstzulassungJahr: jahr === 'Vor 1950' ? 0 : jahr === 'Nie zugelassen' ? -1 : Number(jahr),
          kilometerstand: Number(km),
        })
      )
    } catch {
      // localStorage nicht verfügbar
    }

    router.push('/fahrzeug-verkaufen')
  }

  return (
    <section className="relative bg-[#0369A1] py-16 md:py-24 overflow-hidden">
      {/* Hintergrundbild mit Overlay */}
      <img
        src="/rechner-bg.webp"
        alt=""
        aria-hidden="true"
        className="absolute inset-0 w-full h-full object-cover object-top opacity-35"
        onError={e => { (e.target as HTMLImageElement).style.display = 'none' }}
      />
      <div className="absolute inset-0 bg-[#0369A1]/55" />
      <div className="relative container mx-auto px-4 md:px-6 lg:px-8">
        <div className="max-w-3xl mx-auto">
          <div className="w-full">
            <p className="text-white/60 text-xs font-bold uppercase tracking-widest mb-2">
              Kostenlose Fahrzeugbewertung
            </p>
            <h2 className="text-2xl md:text-3xl font-black text-white mb-2">
              Wie viel ist dein Auto noch wert?
            </h2>
            <p className="text-white text-sm mb-7">
              4 Angaben genügen – wir melden uns persönlich in 2–3 Stunden.*
            </p>

            <form onSubmit={handleSubmit} noValidate>
              <div className="grid grid-cols-2 gap-3 mb-3">

                {/* Marke */}
                <div>
                  <label className="block text-xs font-semibold text-white/80 mb-1.5">
                    Marke
                  </label>
                  <ChipSelect
                    sections={MARKEN_SECTIONS}
                    value={marke}
                    onChange={v => { setMarke(v); setModell('') }}
                    placeholder="z.B. VW, BMW"
                    rightPanel
                  />
                </div>

                {/* Modell */}
                <div>
                  <label className="block text-xs font-semibold text-white/80 mb-1.5">
                    Modell
                  </label>
                  <ChipSelect
                    options={MODELLE_PRO_MARKE[marke] ?? []}
                    value={modell}
                    onChange={v => setModell(v)}
                    placeholder="z.B. Golf, A4, 130i"
                    rightPanel
                    emptyHint={!marke ? 'Bitte zuerst eine Marke wählen' : undefined}
                  />
                </div>

                {/* Erstzulassung Jahr */}
                <div>
                  <label className="block text-xs font-semibold text-white/80 mb-1.5">
                    Erstzulassung
                  </label>
                  <ChipSelect
                    options={YEAR_OPTIONS}
                    value={jahr}
                    onChange={v => setJahr(v)}
                    placeholder="Jahr wählen"
                    rightPanel
                  />
                </div>

                {/* Kilometerstand */}
                <div>
                  <label className="block text-xs font-semibold text-white/80 mb-1.5">
                    Kilometerstand
                  </label>
                  <input
                    type="number"
                    inputMode="numeric"
                    placeholder="z.B. 85000"
                    min={0}
                    value={km}
                    onChange={e => setKm(e.target.value)}
                    className="w-full rounded-[10px] border bg-white py-3 px-4 text-[15px] text-[#0F172A] placeholder-[#94A3B8] outline-none transition-colors duration-200 hover:border-[#0369A1] focus:border-[#0369A1] border-[#E2EDF7]"
                  />
                </div>
              </div>

              {error && (
                <p className="text-xs text-white/90 bg-white/10 rounded-lg px-3 py-2 mb-3">
                  {error}
                </p>
              )}

              <button
                type="submit"
                className="w-full inline-flex items-center justify-center gap-2 px-6 py-3.5 bg-[#FB6F6F] hover:bg-[#f95c5c] text-white font-bold rounded-xl transition-colors duration-200 text-base min-h-[52px]"
              >
                Auto jetzt verkaufen
                <ChevronRight size={18} strokeWidth={2.5} />
              </button>

              <p className="text-white/60 text-[11px] mt-3">
                *Kostenlos &amp; unverbindlich · Kein Verkaufszwang · Werktags 7:30–18:30 Uhr · Sa 8–15 Uhr
              </p>
            </form>
          </div>
        </div>
      </div>
    </section>
  )
}
