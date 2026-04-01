'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { MARKEN_BELIEBTESTE, MARKEN_ALLE } from '@/constants/marken'
import { MODELLE_PRO_MARKE } from '@/constants/modelle'
import { ChevronRight } from 'lucide-react'

const ALLE_MARKEN = [...MARKEN_BELIEBTESTE, ...MARKEN_ALLE, 'Sonstige']

const currentYear = new Date().getFullYear()
const JAHRE = Array.from({ length: currentYear - 1989 }, (_, i) => currentYear - i)

const INPUT_CLASS = 'w-full h-12 px-4 rounded-xl border-2 border-white/20 bg-white/10 text-white placeholder-white/60 text-[15px] focus:outline-none focus:border-white/50 focus:ring-2 focus:ring-white/20 transition-colors duration-200'

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
          erstzulassungJahr: Number(jahr),
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
      <div className="relative z-10 container mx-auto px-4 md:px-6 lg:px-8">
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
                    <label className="block text-xs font-semibold text-white/80 mb-1.5">Marke</label>
                    <input
                      list="rechner-marken"
                      placeholder="z.B. VW, BMW"
                      value={marke}
                      onChange={e => { setMarke(e.target.value); setModell('') }}
                      autoCapitalize="words"
                      autoComplete="off"
                      className={INPUT_CLASS}
                    />
                    <datalist id="rechner-marken">
                      {ALLE_MARKEN.map(m => <option key={m} value={m} />)}
                    </datalist>
                  </div>

                  {/* Modell */}
                  <div>
                    <label className="block text-xs font-semibold text-white/80 mb-1.5">Modell</label>
                    <input
                      list="rechner-modelle"
                      placeholder="z.B. Golf, A4, 130i"
                      value={modell}
                      onChange={e => setModell(e.target.value)}
                      autoCapitalize="words"
                      autoComplete="off"
                      className={INPUT_CLASS}
                    />
                    <datalist id="rechner-modelle">
                      {(MODELLE_PRO_MARKE[marke] ?? []).map(m => (
                        <option key={m} value={m} />
                      ))}
                    </datalist>
                  </div>

                  {/* Baujahr */}
                  <div>
                    <label className="block text-xs font-semibold text-white/80 mb-1.5">Erstzulassung</label>
                    <input
                      list="rechner-jahre"
                      inputMode="numeric"
                      placeholder="z.B. 2018"
                      value={jahr}
                      onChange={e => setJahr(e.target.value)}
                      autoComplete="off"
                      className={INPUT_CLASS}
                    />
                    <datalist id="rechner-jahre">
                      {JAHRE.map(j => <option key={j} value={j} />)}
                    </datalist>
                  </div>

                  {/* Kilometerstand */}
                  <div>
                    <label className="block text-xs font-semibold text-white/80 mb-1.5">Kilometerstand</label>
                    <input
                      type="number"
                      inputMode="numeric"
                      placeholder="z.B. 85000"
                      min={0}
                      value={km}
                      onChange={e => setKm(e.target.value)}
                      className={INPUT_CLASS}
                    />
                  </div>
                </div>

                {error && (
                  <p className="text-xs text-white/90 bg-white/10 rounded-lg px-3 py-2 mb-3">{error}</p>
                )}

                <button
                  type="submit"
                  className="w-full inline-flex items-center justify-center gap-2 px-6 py-3.5 bg-[#FB6F6F] hover:bg-[#f95c5c] text-white font-bold rounded-xl transition-colors duration-200 text-base min-h-[52px]"
                >
                  Jetzt kostenlos bewerten lassen
                  <ChevronRight size={18} strokeWidth={2.5} />
                </button>

                <p className="text-white/60 text-[11px] mt-3">
                  *Kostenlos &amp; unverbindlich · Kein Verkaufszwang · Werktags 6–18 Uhr · Sa 6–13 Uhr
                </p>
              </form>
            </div>

        </div>
      </div>
    </section>
  )
}

