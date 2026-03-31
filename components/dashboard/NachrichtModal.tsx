'use client'

import { useState } from 'react'
import toast from 'react-hot-toast'

type Modus = 'ablehnung' | 'rueckfrage' | 'freinachricht'

const MODUS_CONFIG: Record<Modus, { label: string; emoji: string; btnKlasse: string; ringKlasse: string }> = {
  ablehnung:     { label: 'Ablehnung',      emoji: '✗', btnKlasse: 'bg-red-600 hover:bg-red-700',       ringKlasse: 'focus:ring-red-400' },
  rueckfrage:    { label: 'Rückfrage',      emoji: '?', btnKlasse: 'bg-[#0369A1] hover:bg-[#0284C7]',  ringKlasse: 'focus:ring-[#0369A1]' },
  freinachricht: { label: 'Freie Nachricht',emoji: '✉', btnKlasse: 'bg-[#0F172A] hover:bg-[#1E293B]',  ringKlasse: 'focus:ring-[#0369A1]' },
}

const VORLAGEN: Record<Modus, string[]> = {
  ablehnung: [
    'Leider entspricht dein Fahrzeug nicht unseren aktuellen Ankaufskriterien.',
    'Wir können dir für dein Fahrzeug leider keinen wirtschaftlich fairen Preis anbieten.',
    'Das Fahrzeug liegt leider außerhalb unseres Einzugsgebiets.',
    'Der Unfallschaden übersteigt unsere derzeitigen Ankaufsmöglichkeiten.',
    'Der Reparaturbedarf ist leider zu hoch, um ein faires Angebot machen zu können.',
    'Wir haben dich leider nicht erreichen können und schließen die Anfrage daher ab.',
    'Das Fahrzeug wurde uns leider als bereits anderweitig verkauft gemeldet.',
    'Wir haben uns intern entschieden, dein Fahrzeug diesmal nicht anzukaufen.',
  ],
  rueckfrage: [
    'Könntest du uns noch Fotos vom Fahrzeug zusenden – besonders von Schäden oder Besonderheiten?',
    'Kannst du uns den genauen Kilometerstand mitteilen?',
    'Ist ein Serviceheft vorhanden, und wenn ja, ist es vollständig gestempelt?',
    'Sind alle Fahrzeugschlüssel vorhanden?',
    'Wie lange ist die HU (TÜV) noch gültig?',
    'Kannst du uns noch mehr Details zum Unfallschaden mitteilen?',
    'Wann wäre das Fahrzeug frühestens abholbereit?',
    'Handelt es sich um ein privates oder gewerbliches Fahrzeug?',
  ],
  freinachricht: [],
}

interface Props {
  anfrageId: string
  vorname: string
  marke: string
  modell: string
  initialModus?: Modus
  onClose: () => void
  onGesendet: (neuerStatus?: string, mailTyp?: string) => void
}

export default function NachrichtModal({
  anfrageId,
  vorname,
  marke,
  modell,
  initialModus = 'ablehnung',
  onClose,
  onGesendet,
}: Props) {
  const modus = initialModus
  const cfg = MODUS_CONFIG[modus]
  const vorlagen = VORLAGEN[modus]

  const [text, setText] = useState('')
  const [vorgangSchliessen, setVorgangSchliessen] = useState(true)
  const [sending, setSending] = useState(false)

  const handleVorlage = (vorlage: string) => {
    setText(prev => prev.trim() ? prev.trimEnd() + '\n' + vorlage : vorlage)
  }

  const handleSend = async () => {
    if (!text.trim()) {
      toast.error('Bitte einen Text eingeben.')
      return
    }
    setSending(true)
    try {
      const res = await fetch(`/api/dashboard/anfragen/${anfrageId}/nachricht`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ modus, text: text.trim(), vorgangSchliessen }),
      })
      if (res.ok) {
        const data = await res.json() as { neuerStatus?: string }
        const label = modus === 'ablehnung' ? 'Ablehnungs-Mail'
          : modus === 'rueckfrage' ? 'Rückfrage'
          : 'Nachricht'
        toast.success(`${label} gesendet · Vorschau wird geladen…`)
        onGesendet(data.neuerStatus, modus)
        onClose()
      } else {
        toast.error('Fehler beim Senden')
      }
    } catch {
      toast.error('Verbindungsfehler')
    }
    setSending(false)
  }

  return (
    /* Overlay — auf Mobile: Bottom-Sheet, auf Desktop: zentriert */
    <div
      className="fixed inset-0 z-50 flex items-end sm:items-center justify-center bg-black/50 p-0 sm:p-4"
      onClick={e => { if (e.target === e.currentTarget) onClose() }}
    >
      <div className="bg-white w-full sm:max-w-lg rounded-t-2xl sm:rounded-2xl shadow-2xl border border-[#E2EDF7] flex flex-col max-h-[92vh]">

        {/* Drag-Handle (nur Mobile sichtbar) */}
        <div className="flex justify-center pt-3 pb-1 sm:hidden">
          <div className="w-10 h-1 bg-[#E2EDF7] rounded-full" />
        </div>

        {/* Scrollbarer Inhalt */}
        <div className="overflow-y-auto flex-1 px-5 py-4 sm:p-6">

          {/* Header */}
          <div className="flex items-start justify-between gap-3 mb-4">
            <div className="min-w-0">
              <div className="flex items-center gap-2 mb-0.5 flex-wrap">
                <span className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-lg text-xs font-bold text-white ${cfg.btnKlasse.split(' ')[0]}`}>
                  {cfg.emoji} {cfg.label}
                </span>
              </div>
              <p className="text-sm font-bold text-[#0F172A] truncate">{vorname} · {marke} {modell}</p>
            </div>
            <button
              onClick={onClose}
              className="flex-shrink-0 w-10 h-10 flex items-center justify-center rounded-full hover:bg-[#F1F5F9] text-[#94A3B8] hover:text-[#0F172A] transition-colors text-xl leading-none"
              aria-label="Schließen"
            >
              ×
            </button>
          </div>

          {/* Vorlagen-Dropdown */}
          {vorlagen.length > 0 && (
            <div className="mb-4">
              <label className="block text-xs font-semibold text-[#64748B] mb-1.5">
                Vorlage einfügen
              </label>
              <div className="relative">
                <select
                  defaultValue=""
                  onChange={e => {
                    if (e.target.value) {
                      handleVorlage(e.target.value)
                      e.currentTarget.value = ''
                    }
                  }}
                  className="w-full pl-3 pr-8 py-2.5 border border-[#E2EDF7] rounded-xl text-sm text-[#0F172A] bg-white appearance-none cursor-pointer focus:outline-none focus:ring-2 focus:ring-[#0369A1] focus:border-transparent min-h-[48px]"
                >
                  <option value="">— Vorlage auswählen —</option>
                  {vorlagen.map((v, i) => (
                    <option key={i} value={v}>
                      {v.length > 70 ? v.slice(0, 70) + '…' : v}
                    </option>
                  ))}
                </select>
                {/* Pfeil-Icon */}
                <span className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 text-[#94A3B8]">
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                    <path d="M6 9l6 6 6-6" strokeLinecap="round" strokeLinejoin="round"/>
                  </svg>
                </span>
              </div>
              <p className="text-[11px] text-[#94A3B8] mt-1">Mehrfach wählbar — wird an den Text angehängt</p>
            </div>
          )}

          {/* Textarea */}
          <div className="mb-4">
            <label className="block text-xs font-semibold text-[#64748B] mb-1.5">
              {modus === 'ablehnung' ? 'Ablehnungsgrund (wird an Kunden gesendet)'
                : modus === 'rueckfrage' ? 'Deine Frage an den Kunden'
                : 'Nachrichtentext'}
            </label>
            <textarea
              value={text}
              onChange={e => setText(e.target.value)}
              rows={4}
              placeholder={
                modus === 'ablehnung' ? 'Vorlage wählen oder direkt eingeben…'
                  : modus === 'rueckfrage' ? 'Was möchtest du den Kunden fragen?'
                  : 'Deine Nachricht an den Kunden…'
              }
              className={`w-full px-3 py-2.5 border border-[#E2EDF7] rounded-xl text-sm text-[#0F172A] resize-none focus:outline-none focus:ring-2 focus:border-transparent ${cfg.ringKlasse}`}
            />
            <p className="text-[11px] text-[#94A3B8] mt-1">
              Anrede, Fahrzeuginfo und Grußformel werden automatisch ergänzt.
            </p>
          </div>

          {/* Vorgang schließen Toggle (nur Ablehnung) */}
          {modus === 'ablehnung' && (
            <button
              type="button"
              onClick={() => setVorgangSchliessen(v => !v)}
              className="w-full flex items-center gap-3 mb-4 p-3 rounded-xl border border-[#E2EDF7] hover:border-red-200 hover:bg-red-50 transition-colors text-left min-h-[48px]"
            >
              <div className={`w-10 h-6 rounded-full flex-shrink-0 relative transition-colors duration-200 ${vorgangSchliessen ? 'bg-red-500' : 'bg-[#E2EDF7]'}`}>
                <span className={`absolute top-1 w-4 h-4 bg-white rounded-full shadow transition-all duration-200 ${vorgangSchliessen ? 'left-5' : 'left-1'}`} />
              </div>
              <div>
                <span className="text-sm font-semibold text-[#0F172A]">Vorgang nach dem Senden schließen</span>
                <p className="text-xs text-[#94A3B8]">Status → Abgelehnt, Anfrage archiviert</p>
              </div>
            </button>
          )}

        </div>

        {/* Sticky Footer mit Buttons */}
        <div className="flex gap-2 px-5 py-4 sm:px-6 border-t border-[#E2EDF7] bg-white rounded-b-2xl">
          <button
            onClick={onClose}
            className="flex-1 px-4 py-3 border border-[#E2EDF7] rounded-xl text-sm font-semibold text-[#64748B] hover:bg-[#F8FAFC] transition-colors min-h-[48px]"
          >
            Abbrechen
          </button>
          <button
            onClick={handleSend}
            disabled={sending || !text.trim()}
            className={`flex-1 px-4 py-3 text-white text-sm font-bold rounded-xl transition-colors disabled:opacity-50 min-h-[48px] ${cfg.btnKlasse}`}
          >
            {sending ? 'Sendet…'
              : modus === 'ablehnung' ? 'Ablehnung senden'
              : modus === 'rueckfrage' ? 'Rückfrage senden'
              : 'Nachricht senden'}
          </button>
        </div>

      </div>
    </div>
  )
}
