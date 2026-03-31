'use client'

import { useState, useEffect, useCallback } from 'react'
import Link from 'next/link'
import toast from 'react-hot-toast'
import { ChevronLeft, ChevronRight } from 'lucide-react'

interface Mitarbeiter {
  id: string
  vorname: string
  nachname: string
  kuerzel: string | null
  farbe: string
  aktiv?: boolean
}

interface Termin {
  id: string
  vorname: string
  nachname: string
  marke: string
  modell: string
  telefon: string
  email: string
  plz: string
  terminVorschlag1: string
  abholadresse: string | null
  status: string
  bearbeiter: Mitarbeiter | null
}

// ─── Mini-Kalender ────────────────────────────────────────────────────────────
function MiniKalender({ termine }: { termine: Termin[] }) {
  const [angezeigterMonat, setAngezeigterMonat] = useState(() => {
    const d = new Date()
    return new Date(d.getFullYear(), d.getMonth(), 1)
  })

  const heute = new Date()

  const Jahr = angezeigterMonat.getFullYear()
  const Monat = angezeigterMonat.getMonth()

  const ersterWochentag = new Date(Jahr, Monat, 1).getDay()
  // Montag als erster Tag (0=Mo, 6=So)
  const versatz = (ersterWochentag + 6) % 7
  const tageImMonat = new Date(Jahr, Monat + 1, 0).getDate()

  // Termine-Map: "YYYY-MM-DD" → Termin[]
  const terminMap: Record<string, Termin[]> = {}
  for (const t of termine) {
    const key = t.terminVorschlag1.slice(0, 10)
    const d = new Date(t.terminVorschlag1)
    if (d.getFullYear() === Jahr && d.getMonth() === Monat) {
      if (!terminMap[key]) terminMap[key] = []
      terminMap[key].push(t)
    }
  }

  const scrollToTag = (tag: number) => {
    const key = `${Jahr}-${String(Monat + 1).padStart(2, '0')}-${String(tag).padStart(2, '0')}`
    const el = document.getElementById(`tag-${key}`)
    if (el) el.scrollIntoView({ behavior: 'smooth', block: 'start' })
  }

  const tagLabel = ['Mo', 'Di', 'Mi', 'Do', 'Fr', 'Sa', 'So']

  const zellen: (number | null)[] = [
    ...Array(versatz).fill(null),
    ...Array.from({ length: tageImMonat }, (_, i) => i + 1),
  ]
  // Auf volle Wochen auffüllen
  while (zellen.length % 7 !== 0) zellen.push(null)

  return (
    <div className="bg-white rounded-2xl border border-[#E2EDF7] p-5 mb-6">
      {/* Kopfzeile */}
      <div className="flex items-center justify-between mb-4">
        <button
          onClick={() => setAngezeigterMonat(new Date(Jahr, Monat - 1, 1))}
          className="w-8 h-8 flex items-center justify-center rounded-lg text-[#64748B] hover:bg-[#F1F5F9] transition-colors"
        >
          <ChevronLeft size={16} strokeWidth={2.5} />
        </button>
        <p className="text-sm font-bold text-[#0F172A]">
          {angezeigterMonat.toLocaleDateString('de-DE', { month: 'long', year: 'numeric' })}
        </p>
        <button
          onClick={() => setAngezeigterMonat(new Date(Jahr, Monat + 1, 1))}
          className="w-8 h-8 flex items-center justify-center rounded-lg text-[#64748B] hover:bg-[#F1F5F9] transition-colors"
        >
          <ChevronRight size={16} strokeWidth={2.5} />
        </button>
      </div>

      {/* Wochentage */}
      <div className="grid grid-cols-7 mb-1">
        {tagLabel.map(t => (
          <div key={t} className="text-center text-[10px] font-semibold text-[#94A3B8] py-1">{t}</div>
        ))}
      </div>

      {/* Tage */}
      <div className="grid grid-cols-7 gap-y-1">
        {zellen.map((tag, i) => {
          if (!tag) return <div key={`leer-${i}`} />
          const key = `${Jahr}-${String(Monat + 1).padStart(2, '0')}-${String(tag).padStart(2, '0')}`
          const hatTermine = !!terminMap[key]
          const istHeute = heute.getDate() === tag && heute.getMonth() === Monat && heute.getFullYear() === Jahr
          const anzahl = terminMap[key]?.length ?? 0

          return (
            <button
              key={key}
              onClick={() => hatTermine && scrollToTag(tag)}
              disabled={!hatTermine}
              className={`relative flex flex-col items-center justify-center rounded-xl py-1.5 transition-colors text-xs font-medium
                ${istHeute ? 'bg-[#0369A1] text-white' : ''}
                ${hatTermine && !istHeute ? 'bg-[#E8F4FD] text-[#0369A1] hover:bg-[#0369A1] hover:text-white cursor-pointer' : ''}
                ${!hatTermine && !istHeute ? 'text-[#64748B] cursor-default' : ''}
              `}
            >
              {tag}
              {hatTermine && (
                <span className={`text-[9px] font-bold leading-none mt-0.5 ${istHeute ? 'text-white/80' : 'text-[#0369A1]'}`}>
                  {anzahl > 1 ? `${anzahl}×` : '●'}
                </span>
              )}
            </button>
          )
        })}
      </div>

      {Object.keys(terminMap).length === 0 && (
        <p className="text-center text-xs text-[#94A3B8] mt-2">Keine Termine in diesem Monat</p>
      )}
    </div>
  )
}

// ─── Termin-Card ─────────────────────────────────────────────────────────────
export default function TerminePage() {
  const [termine, setTermine] = useState<Termin[]>([])
  const [mitarbeiterListe, setMitarbeiterListe] = useState<Mitarbeiter[]>([])
  const [filterMitarbeiterId, setFilterMitarbeiterId] = useState<string | null>(null)
  const [loading, setLoading] = useState(true)
  const [editId, setEditId] = useState<string | null>(null)
  const [editDatum, setEditDatum] = useState('')
  const [saving, setSaving] = useState(false)
  const [transferTermin, setTransferTermin] = useState<{ id: string; name: string } | null>(null)
  const [transferZiel, setTransferZiel] = useState('')

  const load = useCallback(async () => {
    try {
      const [terminRes, maRes] = await Promise.all([
        fetch('/api/dashboard/anfragen?status=termin_vereinbart&limit=100'),
        fetch('/api/dashboard/mitarbeiter'),
      ])
      if (terminRes.ok) {
        const data = await terminRes.json() as { anfragen: Termin[] }
        setTermine(data.anfragen.filter((a: Termin) => a.terminVorschlag1))
      }
      if (maRes.ok) {
        const ma = await maRes.json() as Mitarbeiter[]
        setMitarbeiterListe(ma.filter(m => m.aktiv !== false))
      }
    } finally {
      setLoading(false)
    }
  }, [])

  useEffect(() => { void load() }, [load])

  const handleLoeschen = async (id: string, name: string) => {
    if (!confirm(`Termin von ${name} wirklich löschen?`)) return
    try {
      const res = await fetch(`/api/dashboard/anfragen/${id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ terminVorschlag1: null, status: 'kontaktiert' }),
      })
      if (res.ok) {
        toast.success('Termin gelöscht')
        setTermine(prev => prev.filter(t => t.id !== id))
      } else {
        toast.error('Fehler beim Löschen')
      }
    } catch {
      toast.error('Verbindungsfehler')
    }
  }

  const handleUebertragen = async () => {
    if (!transferTermin || !transferZiel) return
    setSaving(true)
    try {
      const res = await fetch(`/api/dashboard/anfragen/${transferTermin.id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ bearbeiterId: transferZiel }),
      })
      if (res.ok) {
        const neuerMA = mitarbeiterListe.find(m => m.id === transferZiel)
        toast.success(`Termin übertragen an ${neuerMA?.vorname ?? ''} ${neuerMA?.nachname ?? ''}`)
        setTransferTermin(null)
        setTransferZiel('')
        await load()
      } else {
        toast.error('Fehler beim Übertragen')
      }
    } catch {
      toast.error('Verbindungsfehler')
    }
    setSaving(false)
  }

  const handleVerschieben = async (id: string) => {
    if (!editDatum) return
    setSaving(true)
    try {
      const res = await fetch(`/api/dashboard/anfragen/${id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ terminVorschlag1: editDatum }),
      })
      if (res.ok) {
        toast.success('Termin verschoben')
        setEditId(null)
        setEditDatum('')
        await load()
      } else {
        toast.error('Fehler beim Speichern')
      }
    } catch {
      toast.error('Verbindungsfehler')
    }
    setSaving(false)
  }

  const heute = new Date()
  const gefilterteTermine = filterMitarbeiterId
    ? termine.filter(t => t.bearbeiter?.id === filterMitarbeiterId)
    : termine
  const termineHeute = gefilterteTermine.filter(t => new Date(t.terminVorschlag1).toDateString() === heute.toDateString())
  const termineKuenftig = gefilterteTermine
    .filter(t => new Date(t.terminVorschlag1) > heute && new Date(t.terminVorschlag1).toDateString() !== heute.toDateString())
    .sort((a, b) => new Date(a.terminVorschlag1).getTime() - new Date(b.terminVorschlag1).getTime())
  const termineVergangen = gefilterteTermine
    .filter(t => new Date(t.terminVorschlag1) < heute && new Date(t.terminVorschlag1).toDateString() !== heute.toDateString())
    .sort((a, b) => new Date(b.terminVorschlag1).getTime() - new Date(a.terminVorschlag1).getTime())

  const formatDate = (d: string) =>
    new Date(d).toLocaleDateString('de-DE', { weekday: 'long', day: 'numeric', month: 'long', hour: '2-digit', minute: '2-digit' })

  const toDatetimeLocal = (iso: string) => {
    const d = new Date(iso)
    const pad = (n: number) => String(n).padStart(2, '0')
    return `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}T${pad(d.getHours())}:${pad(d.getMinutes())}`
  }

  const TerminCard = ({ t }: { t: Termin }) => (
    <div className="bg-white rounded-2xl border border-[#E2EDF7] p-5 hover:border-[#0369A1] transition-colors">
      <div className="flex items-start justify-between gap-4 mb-3">
        <div className="flex items-start gap-3 min-w-0">
          {t.bearbeiter && (
            <div
              className="w-8 h-8 rounded-full flex items-center justify-center text-white text-[10px] font-bold shrink-0 mt-0.5"
              style={{ backgroundColor: t.bearbeiter.farbe }}
              title={`${t.bearbeiter.vorname} ${t.bearbeiter.nachname}`}
            >
              {t.bearbeiter.kuerzel ?? (t.bearbeiter.vorname[0] + t.bearbeiter.nachname[0]).toUpperCase()}
            </div>
          )}
          <div className="min-w-0">
            <p className="font-bold text-[#0F172A]">{t.vorname} {t.nachname}</p>
            <p className="text-sm text-[#64748B]">{t.marke} {t.modell}</p>
            {t.bearbeiter && (
              <p className="text-xs text-[#94A3B8] mt-0.5">Bearbeiter: {t.bearbeiter.vorname} {t.bearbeiter.nachname}</p>
            )}
          </div>
        </div>
        <p className="text-sm font-semibold text-[#0369A1] text-right whitespace-nowrap shrink-0">
          {formatDate(t.terminVorschlag1)}
        </p>
      </div>

      {t.abholadresse && (
        <div className="mb-3">
          <p className="text-xs text-[#64748B] mb-1.5">📍 {t.abholadresse}</p>
          <div className="flex gap-2">
            <a
              href={`https://maps.google.com/?q=${encodeURIComponent(t.abholadresse)}`}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-1.5 px-3 py-1.5 bg-white border border-[#E2EDF7] rounded-lg text-xs font-semibold text-[#64748B] hover:border-[#0369A1] hover:text-[#0369A1] transition-colors"
            >
              🗺 Google Maps
            </a>
            <a
              href={`https://maps.apple.com/?q=${encodeURIComponent(t.abholadresse)}`}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-1.5 px-3 py-1.5 bg-white border border-[#E2EDF7] rounded-lg text-xs font-semibold text-[#64748B] hover:border-[#0369A1] hover:text-[#0369A1] transition-colors"
            >
              🍎 Apple Maps
            </a>
          </div>
        </div>
      )}

      {/* Datum verschieben */}
      {editId === t.id && (
        <div className="mb-3 flex gap-2">
          <input
            type="datetime-local"
            value={editDatum}
            onChange={e => setEditDatum(e.target.value)}
            className="flex-1 px-3 py-2 border border-[#E2EDF7] rounded-xl text-sm text-[#0F172A] focus:outline-none focus:ring-2 focus:ring-[#0369A1]"
          />
          <button
            onClick={() => void handleVerschieben(t.id)}
            disabled={saving}
            className="px-4 py-2 bg-[#0369A1] text-white text-xs font-bold rounded-xl hover:bg-[#0284c7] transition-colors disabled:bg-[#94A3B8]"
          >
            {saving ? '...' : 'Speichern'}
          </button>
          <button
            onClick={() => { setEditId(null); setEditDatum('') }}
            className="px-3 py-2 border border-[#E2EDF7] text-[#64748B] text-xs rounded-xl hover:border-[#0369A1] transition-colors"
          >
            ✕
          </button>
        </div>
      )}

      <div className="flex flex-wrap items-center gap-2">
        <a
          href={`tel:${t.telefon}`}
          className="text-xs px-3 py-1.5 bg-[#E8F4FD] text-[#0369A1] rounded-lg font-medium hover:bg-[#0369A1] hover:text-white transition-colors"
        >
          📞 {t.telefon}
        </a>
        <a
          href={`https://wa.me/${t.telefon.replace(/\D/g, '')}`}
          target="_blank"
          rel="noopener noreferrer"
          className="text-xs px-3 py-1.5 bg-[#DCFCE7] text-[#16A34A] rounded-lg font-medium hover:bg-[#16A34A] hover:text-white transition-colors"
        >
          WhatsApp
        </a>
        <button
          onClick={() => { setEditId(t.id); setEditDatum(toDatetimeLocal(t.terminVorschlag1)) }}
          className="text-xs px-3 py-1.5 border border-[#E2EDF7] text-[#64748B] rounded-lg font-medium hover:border-[#0369A1] hover:text-[#0369A1] transition-colors"
        >
          ✏️ Verschieben
        </button>
        {mitarbeiterListe.length > 1 && (
          <button
            onClick={() => { setTransferTermin({ id: t.id, name: `${t.vorname} ${t.nachname}` }); setTransferZiel('') }}
            className="text-xs px-3 py-1.5 border border-[#E2EDF7] text-[#64748B] rounded-lg font-medium hover:border-[#7C3AED] hover:text-[#7C3AED] transition-colors"
          >
            👤 Übertragen
          </button>
        )}
        <button
          onClick={() => void handleLoeschen(t.id, `${t.vorname} ${t.nachname}`)}
          className="text-xs px-3 py-1.5 border border-[#FEE2E2] text-[#EF4444] rounded-lg font-medium hover:bg-[#EF4444] hover:text-white transition-colors"
        >
          Löschen
        </button>
        <a
          href={`/api/dashboard/anfragen/${t.id}/ics`}
          download
          className="text-xs px-3 py-1.5 border border-[#E2EDF7] text-[#64748B] rounded-lg font-medium hover:border-[#0369A1] hover:text-[#0369A1] transition-colors"
          title="In Outlook / Kalender importieren"
        >
          📅 .ics
        </a>
        <Link
          href={`/dashboard/anfragen/${t.id}`}
          className="text-xs px-3 py-1.5 rounded-lg bg-[#FB6F6F] hover:bg-[#f95c5c] text-white font-semibold transition-colors ml-auto"
        >
          Details →
        </Link>
      </div>
    </div>
  )

  const TerminGruppe = ({ label, items, dotColor, dimmed }: {
    label: string
    items: Termin[]
    dotColor: string
    dimmed?: boolean
  }) => {
    // Gruppen nach Datum für Scroll-Anker
    const tage = [...new Set(items.map(t => t.terminVorschlag1.slice(0, 10)))]

    return (
      <div className={dimmed ? 'opacity-60' : ''}>
        <h2 className="text-sm font-bold text-[#0F172A] mb-3 flex items-center gap-2">
          <span className="w-2 h-2 rounded-full" style={{ backgroundColor: dotColor }} />
          {label} ({items.length})
        </h2>
        <div className="space-y-3">
          {tage.map(tagKey => {
            const tagTermine = items.filter(t => t.terminVorschlag1.slice(0, 10) === tagKey)
            return (
              <div key={tagKey} id={`tag-${tagKey}`}>
                <p className="text-xs font-semibold text-[#94A3B8] mb-2 px-1">
                  {new Date(tagKey).toLocaleDateString('de-DE', { weekday: 'long', day: 'numeric', month: 'long' })}
                </p>
                <div className="space-y-2">
                  {tagTermine.map(t => <TerminCard key={t.id} t={t} />)}
                </div>
              </div>
            )
          })}
        </div>
      </div>
    )
  }

  return (
    <div className="p-6 md:p-8">
      <div className="mb-6">
        <h1 className="text-2xl font-black text-[#0F172A]">Termine</h1>
        <p className="text-[#64748B] text-sm mt-0.5">Alle bestätigten Abholtermine</p>
      </div>

      {/* Mitarbeiter-Filter */}
      {mitarbeiterListe.length > 0 && (
        <div className="flex flex-wrap gap-2 mb-6">
          <button
            onClick={() => setFilterMitarbeiterId(null)}
            className={`px-4 py-2 rounded-xl text-sm font-semibold transition-colors ${
              filterMitarbeiterId === null
                ? 'bg-[#0369A1] text-white'
                : 'bg-white border border-[#E2EDF7] text-[#64748B] hover:border-[#0369A1] hover:text-[#0369A1]'
            }`}
          >
            Alle ({termine.length})
          </button>
          {mitarbeiterListe.map(m => {
            const anzahl = termine.filter(t => t.bearbeiter?.id === m.id).length
            return (
              <button
                key={m.id}
                onClick={() => setFilterMitarbeiterId(m.id)}
                className={`flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-semibold transition-colors ${
                  filterMitarbeiterId === m.id
                    ? 'text-white'
                    : 'bg-white border border-[#E2EDF7] text-[#64748B] hover:border-[#0369A1] hover:text-[#0369A1]'
                }`}
                style={filterMitarbeiterId === m.id ? { backgroundColor: m.farbe } : {}}
              >
                <span
                  className="w-5 h-5 rounded-full flex items-center justify-center text-white text-[9px] font-bold shrink-0"
                  style={{ backgroundColor: filterMitarbeiterId === m.id ? 'rgba(255,255,255,0.3)' : m.farbe }}
                >
                  {(m.kuerzel ?? (m.vorname[0] + m.nachname[0])).toUpperCase()}
                </span>
                {m.vorname} ({anzahl})
              </button>
            )
          })}
        </div>
      )}

      {loading ? (
        <p className="text-[#94A3B8] text-sm">Lädt...</p>
      ) : (
        <>
          {/* Mini-Kalender */}
          <MiniKalender termine={gefilterteTermine} />

          {gefilterteTermine.length === 0 ? (
            <div className="bg-white rounded-2xl border border-[#E2EDF7] p-12 text-center">
              <p className="text-4xl mb-3">📅</p>
              <p className="font-bold text-[#0F172A] mb-1">Noch keine Termine</p>
              <p className="text-sm text-[#64748B]">Termine erscheinen hier, wenn Anfragen auf „Termin vereinbart" gesetzt sind.</p>
              <Link href="/dashboard/anfragen" className="inline-block mt-4 text-sm text-[#0369A1] hover:underline">
                Zu den Anfragen →
              </Link>
            </div>
          ) : (
            <div className="space-y-8">
              {termineHeute.length > 0 && (
                <TerminGruppe label="Heute" items={termineHeute} dotColor="#FB6F6F" />
              )}
              {termineKuenftig.length > 0 && (
                <TerminGruppe label="Kommende Termine" items={termineKuenftig} dotColor="#0369A1" />
              )}
              {termineVergangen.length > 0 && (
                <TerminGruppe label="Vergangene Termine" items={termineVergangen} dotColor="#CBD5E1" dimmed />
              )}
            </div>
          )}
        </>
      )}

      {/* Übertragen-Modal */}
      {transferTermin && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50">
          <div className="bg-white rounded-2xl w-full max-w-md shadow-2xl p-6">
            <h3 className="text-base font-black text-[#0F172A] mb-1">Termin übertragen</h3>
            <p className="text-sm text-[#64748B] mb-5">
              Termin von <strong>{transferTermin.name}</strong> an einen anderen Mitarbeiter übertragen.
              Der neue Mitarbeiter wird automatisch benachrichtigt.
            </p>
            <label className="block text-xs font-semibold text-[#64748B] mb-1.5 uppercase tracking-wide">
              Übertragen an
            </label>
            <select
              value={transferZiel}
              onChange={e => setTransferZiel(e.target.value)}
              className="w-full px-3 py-2.5 border border-[#E2EDF7] rounded-xl text-sm text-[#0F172A] focus:outline-none focus:ring-2 focus:ring-[#0369A1] mb-5"
            >
              <option value="">— Mitarbeiter auswählen —</option>
              {mitarbeiterListe
                .filter(m => m.id !== termine.find(t => t.id === transferTermin.id)?.bearbeiter?.id)
                .map(m => (
                  <option key={m.id} value={m.id}>{m.vorname} {m.nachname}</option>
                ))}
            </select>
            <div className="flex gap-3">
              <button
                onClick={() => setTransferTermin(null)}
                className="flex-1 px-4 py-2.5 border border-[#E2EDF7] rounded-xl text-sm font-semibold text-[#64748B] hover:border-[#0369A1] transition-colors"
              >
                Abbrechen
              </button>
              <button
                onClick={() => void handleUebertragen()}
                disabled={!transferZiel || saving}
                className="flex-1 px-4 py-2.5 bg-[#7C3AED] hover:bg-[#6d28d9] disabled:bg-[#94A3B8] text-white text-sm font-bold rounded-xl transition-colors"
              >
                {saving ? 'Übertrage…' : 'Übertragen'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
