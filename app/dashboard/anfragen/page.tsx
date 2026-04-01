'use client'

import { useState, useEffect, useCallback, Fragment } from 'react'
import { useSearchParams } from 'next/navigation'
import Link from 'next/link'
import { ChevronDown, Download } from 'lucide-react'

interface AktivitaetKurz {
  id: string
  aktion: string
  details: string | null
  createdAt: string
}

interface MitarbeiterKurz {
  id: string
  vorname: string
  nachname: string
  kuerzel: string | null
  farbe: string
}

interface Anfrage {
  id: string
  vorname: string
  nachname: string
  marke: string
  modell: string
  status: string
  createdAt: string
  plz: string
  telefon: string
  email: string
  kilometerstand: number
  erstzulassungJahr: number
  fahrbereitschaft: string
  archiviert: boolean
  terminVorschlag1: string | null
  abholadresse: string | null
  notizen: string | null
  angebotspreis: number | null
  aktivitaeten: AktivitaetKurz[]
  bearbeiterId: string | null
  bearbeiter: { id: string; vorname: string; nachname: string; kuerzel: string | null; farbe: string } | null
}

const STATUS_CONFIG: Record<string, { label: string; bg: string; text: string }> = {
  neu:               { label: 'Neu',               bg: 'bg-blue-100',    text: 'text-blue-800' },
  kontaktiert:       { label: 'Kontaktiert',        bg: 'bg-yellow-100',  text: 'text-yellow-800' },
  angebot_gesendet:  { label: 'Angebot gesendet',   bg: 'bg-purple-100',  text: 'text-purple-800' },
  termin_vereinbart: { label: 'Termin vereinbart',  bg: 'bg-green-100',   text: 'text-green-800' },
  abgeschlossen:     { label: 'Abgeschlossen',      bg: 'bg-emerald-100', text: 'text-emerald-800' },
  abgelehnt:         { label: 'Abgelehnt',          bg: 'bg-red-100',     text: 'text-red-800' },
}

const AKTION_LABEL: Record<string, string> = {
  status_geaendert:      'Status geändert',
  angebot_mail_gesendet: 'Angebot gesendet',
  termin_bestaetigt:     'Terminbestätigung gesendet',
  termin_verschoben:     'Termin verschoben',
  termin_abgesagt:       'Terminabsage gesendet',
  termin_mail_erneut:    'Bestätigungs-Mail erneut gesendet',
  reaktiviert:           'Reaktiviert',
  archiviert:            'Archiviert',
}

const STATUS_OPTIONS = [
  { value: 'all', label: 'Alle Status' },
  ...Object.entries(STATUS_CONFIG).map(([value, { label }]) => ({ value, label })),
]

export default function AnfragenPage() {
  const searchParams = useSearchParams()
  const [anfragen, setAnfragen] = useState<Anfrage[]>([])
  const [total, setTotal] = useState(0)
  const [search, setSearch] = useState('')
  const [statusFilter, setStatusFilter] = useState('all')
  const [showArchiv, setShowArchiv] = useState(() => searchParams.get('archiv') === '1')
  const [loading, setLoading] = useState(true)
  const [reaktivierendId, setReaktivierendId] = useState<string | null>(null)
  const [expandedId, setExpandedId] = useState<string | null>(null)
  const [mitarbeiter, setMitarbeiter] = useState<MitarbeiterKurz[]>([])
  const [dropdownId, setDropdownId] = useState<string | null>(null)

  const exportCsv = () => {
    const params = new URLSearchParams()
    if (statusFilter !== 'all') params.set('status', statusFilter)
    if (showArchiv) params.set('archiviert', 'true')
    window.location.href = `/api/dashboard/export?${params}`
  }

  const load = useCallback(async () => {
    setLoading(true)
    try {
      const params = new URLSearchParams({ limit: '50' })
      if (statusFilter !== 'all') params.set('status', statusFilter)
      if (search.trim()) params.set('search', search.trim())
      if (showArchiv) params.set('archiviert', 'true')
      const res = await fetch(`/api/dashboard/anfragen?${params}`)
      if (res.ok) {
        const data = await res.json() as { anfragen: Anfrage[]; total: number }
        setAnfragen(data.anfragen)
        setTotal(data.total)
      }
    } finally {
      setLoading(false)
    }
  }, [statusFilter, search, showArchiv])

  useEffect(() => {
    const t = setTimeout(() => void load(), 300)
    return () => clearTimeout(t)
  }, [load])

  useEffect(() => {
    void fetch('/api/dashboard/mitarbeiter')
      .then(r => r.json())
      .then((d: MitarbeiterKurz[]) => setMitarbeiter(d))
      .catch(() => {})
  }, [])

  // Klick außerhalb schließt Dropdown
  useEffect(() => {
    if (!dropdownId) return
    const close = () => setDropdownId(null)
    document.addEventListener('click', close)
    return () => document.removeEventListener('click', close)
  }, [dropdownId])

  const formatDate = (d: string) =>
    new Date(d).toLocaleDateString('de-DE', { day: '2-digit', month: '2-digit', year: 'numeric' })

  const formatDateTime = (d: string) =>
    new Date(d).toLocaleString('de-DE', { day: '2-digit', month: '2-digit', year: 'numeric', hour: '2-digit', minute: '2-digit' })

  const reaktivieren = async (id: string) => {
    setReaktivierendId(id)
    try {
      const res = await fetch(`/api/dashboard/anfragen/${id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ archiviert: false, status: 'kontaktiert' }),
      })
      if (res.ok) {
        setAnfragen(prev => prev.filter(a => a.id !== id))
        setTotal(t => t - 1)
      }
    } finally {
      setReaktivierendId(null)
    }
  }

  const toggleExpand = (id: string) =>
    setExpandedId(prev => prev === id ? null : id)

  const assignBearbeiter = async (anfrageId: string, bearbeiterId: string | null) => {
    setDropdownId(null)
    const ma = bearbeiterId ? mitarbeiter.find(m => m.id === bearbeiterId) ?? null : null
    setAnfragen(prev => prev.map(a => a.id === anfrageId
      ? { ...a, bearbeiterId, bearbeiter: ma }
      : a
    ))
    await fetch(`/api/dashboard/anfragen/${anfrageId}`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ bearbeiterId }),
    })
  }

  const DetailPanel = ({ a }: { a: Anfrage }) => {
    const letzteAkt = a.aktivitaeten[0]
    const hatDetails = a.notizen || a.angebotspreis || a.terminVorschlag1 || letzteAkt
    if (!hatDetails) return (
      <p className="text-xs text-[#94A3B8] italic">Keine weiteren Details vorhanden.</p>
    )
    return (
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
        {a.notizen && (
          <div className="bg-[#FFFBEB] border border-[#FDE68A] rounded-xl px-3 py-2.5">
            <p className="text-[10px] font-semibold text-[#92400E] uppercase tracking-wide mb-1">Notiz</p>
            <p className="text-xs text-[#0F172A] line-clamp-3">{a.notizen}</p>
          </div>
        )}
        {a.angebotspreis && (
          <div className="bg-[#F5F3FF] border border-[#DDD6FE] rounded-xl px-3 py-2.5">
            <p className="text-[10px] font-semibold text-[#6D28D9] uppercase tracking-wide mb-1">Angebot</p>
            <p className="text-sm font-bold text-[#0F172A]">{a.angebotspreis.toLocaleString('de-DE')} €</p>
          </div>
        )}
        {a.terminVorschlag1 && (
          <div className="bg-[#F0FDF4] border border-[#86EFAC] rounded-xl px-3 py-2.5">
            <p className="text-[10px] font-semibold text-[#166534] uppercase tracking-wide mb-1">Termin</p>
            <p className="text-xs font-semibold text-[#0F172A]">{formatDateTime(a.terminVorschlag1)} Uhr</p>
            {a.abholadresse && <p className="text-[10px] text-[#64748B] mt-0.5 truncate">{a.abholadresse}</p>}
          </div>
        )}
        {letzteAkt && (
          <div className="bg-[#F0F7FF] border border-[#BFDBFE] rounded-xl px-3 py-2.5">
            <p className="text-[10px] font-semibold text-[#1E40AF] uppercase tracking-wide mb-1">Letzte Aktion</p>
            <p className="text-xs font-semibold text-[#0F172A]">{AKTION_LABEL[letzteAkt.aktion] ?? letzteAkt.aktion.replace(/_/g, ' ')}</p>
            {letzteAkt.details && <p className="text-[10px] text-[#64748B] mt-0.5 truncate">{letzteAkt.details}</p>}
            <p className="text-[10px] text-[#94A3B8] mt-0.5">{formatDateTime(letzteAkt.createdAt)} Uhr</p>
          </div>
        )}
      </div>
    )
  }

  return (
    <div className="p-4 md:p-8">
      {/* Header */}
      <div className="flex items-center justify-between mb-5">
        <div>
          <h1 className="text-2xl font-black text-[#0F172A]">
            {showArchiv ? 'Archiv' : 'Anfragen'}
          </h1>
          <p className="text-[#64748B] text-sm mt-0.5">{total} {showArchiv ? 'archivierte Einträge' : 'gesamt'}</p>
        </div>
        <div className="flex items-center gap-2">
          <button
            onClick={exportCsv}
            className="flex items-center gap-2 px-4 py-2 border border-[#E2EDF7] rounded-xl text-sm font-semibold text-[#64748B] hover:text-[#0369A1] hover:border-[#0369A1] transition-colors bg-white"
            title="Aktuelle Ansicht als CSV exportieren"
          >
            <Download size={15} strokeWidth={2.5} />
            <span className="hidden sm:inline">CSV Export</span>
          </button>
          <a
            href="/api/dashboard/export?newsletter=true"
            download
            className="flex items-center gap-2 px-4 py-2 border border-[#86EFAC] rounded-xl text-sm font-semibold text-[#166534] hover:bg-[#F0FDF4] transition-colors bg-white"
            title="Alle Newsletter-Abonnenten als CSV"
          >
            <Download size={15} strokeWidth={2.5} />
            <span className="hidden sm:inline">Newsletter</span>
          </a>
        </div>
      </div>

      {/* Filter */}
      <div className="bg-white rounded-2xl border border-[#E2EDF7] p-4 mb-5 flex flex-col sm:flex-row gap-3">
        <input
          type="text"
          placeholder="Name, Marke, Modell, PLZ…"
          value={search}
          onChange={e => setSearch(e.target.value)}
          className="flex-1 px-4 py-2.5 border border-[#E2EDF7] rounded-xl text-sm text-[#0F172A] placeholder:text-[#94A3B8] focus:outline-none focus:ring-2 focus:ring-[#0369A1] focus:border-transparent"
        />
        <select
          value={statusFilter}
          onChange={e => setStatusFilter(e.target.value)}
          className="px-4 py-2.5 border border-[#E2EDF7] rounded-xl text-sm text-[#0F172A] bg-white focus:outline-none focus:ring-2 focus:ring-[#0369A1] focus:border-transparent"
        >
          {STATUS_OPTIONS.map(o => (
            <option key={o.value} value={o.value}>{o.label}</option>
          ))}
        </select>
        <label className="flex items-center gap-2 cursor-pointer select-none sm:whitespace-nowrap">
          <div
            onClick={() => setShowArchiv(v => !v)}
            className={`w-10 h-5 rounded-full transition-colors duration-200 relative flex-shrink-0 cursor-pointer ${showArchiv ? 'bg-[#64748B]' : 'bg-[#E2EDF7]'}`}
          >
            <span className={`absolute top-0.5 w-4 h-4 bg-white rounded-full shadow transition-transform duration-200 ${showArchiv ? 'translate-x-5' : 'translate-x-0.5'}`} />
          </div>
          <span className="text-sm text-[#64748B] font-medium">Archiv</span>
        </label>
      </div>

      {showArchiv && (
        <div className="bg-[#FFF7ED] border border-[#FED7AA] rounded-xl px-4 py-3 mb-4 text-sm text-[#92400E]">
          Archivierte Anfragen — über „Reaktivieren" wieder in die aktive Liste aufnehmen.
        </div>
      )}

      {/* Mobile: Cards */}
      <div className="sm:hidden space-y-3">
        {loading ? (
          <div className="py-12 text-center text-[#94A3B8] text-sm">Lädt…</div>
        ) : anfragen.length === 0 ? (
          <div className="py-12 text-center text-[#94A3B8] text-sm">
            {showArchiv ? 'Keine archivierten Anfragen.' : 'Keine Anfragen gefunden.'}
          </div>
        ) : anfragen.map(a => {
          const s = STATUS_CONFIG[a.status] ?? { label: a.status, bg: 'bg-gray-100', text: 'text-gray-800' }
          const isExpanded = expandedId === a.id
          return (
            <div key={a.id} className={`bg-white rounded-2xl border border-[#E2EDF7] overflow-hidden ${a.archiviert ? 'opacity-60' : ''}`}>
              <div className="p-4">
                <div className="flex items-start justify-between gap-2 mb-3">
                  <div>
                    <p className="font-bold text-[#0F172A]">{a.vorname} {a.nachname}</p>
                    <p className="text-xs text-[#64748B] mt-0.5">{a.telefon}</p>
                  </div>
                  <div className="flex items-center gap-1.5 shrink-0">
                    <div className="relative" onClick={e => e.stopPropagation()}>
                      <button
                        onClick={() => setDropdownId(d => d === a.id ? null : a.id)}
                        title={a.bearbeiter ? `${a.bearbeiter.vorname} ${a.bearbeiter.nachname} — klicken zum Ändern` : 'Bearbeiter zuweisen'}
                        className={`inline-flex items-center justify-center w-6 h-6 rounded-full text-[10px] font-bold transition-opacity hover:opacity-80 ${
                          a.bearbeiter ? 'text-white' : 'text-[#94A3B8] border-2 border-dashed border-[#CBD5E1] bg-white'
                        }`}
                        style={a.bearbeiter ? { background: a.bearbeiter.farbe } : {}}
                      >
                        {a.bearbeiter
                          ? (a.bearbeiter.kuerzel ?? (a.bearbeiter.vorname[0] + a.bearbeiter.nachname[0]).toUpperCase())
                          : '+'}
                      </button>
                      {dropdownId === a.id && mitarbeiter.length > 0 && (
                        <div className="absolute right-0 top-8 z-50 bg-white rounded-xl border border-[#E2EDF7] shadow-lg min-w-[160px] py-1">
                          {mitarbeiter.map(m => (
                            <button key={m.id} onClick={() => void assignBearbeiter(a.id, m.id)}
                              className={`w-full flex items-center gap-2 px-3 py-2 text-left text-sm hover:bg-[#F8FAFC] transition-colors ${a.bearbeiterId === m.id ? 'text-[#0369A1] font-semibold' : 'text-[#0F172A]'}`}>
                              <span className="w-5 h-5 rounded-full flex items-center justify-center text-white text-[9px] font-bold shrink-0" style={{ background: m.farbe }}>
                                {m.kuerzel ?? (m.vorname[0] + m.nachname[0]).toUpperCase()}
                              </span>
                              {m.vorname} {m.nachname}
                              {a.bearbeiterId === m.id && <span className="ml-auto">✓</span>}
                            </button>
                          ))}
                          {a.bearbeiterId && (
                            <button onClick={() => void assignBearbeiter(a.id, null)}
                              className="w-full px-3 py-2 text-left text-xs text-[#94A3B8] hover:text-[#DC2626] hover:bg-[#FEF2F2] transition-colors border-t border-[#E2EDF7] mt-1">
                              Zuweisung entfernen
                            </button>
                          )}
                        </div>
                      )}
                    </div>
                    <span className={`px-2.5 py-1 rounded-full text-xs font-semibold ${s.bg} ${s.text}`}>
                      {s.label}
                    </span>
                  </div>
                </div>
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-semibold text-[#0F172A]">{a.marke} {a.modell}</p>
                    <p className="text-xs text-[#64748B]">{a.kilometerstand.toLocaleString('de-DE')} km · EZ {a.erstzulassungJahr} · {formatDate(a.createdAt)}</p>
                  </div>
                  <div className="flex items-center gap-2 ml-3 shrink-0">
                    {a.archiviert && (
                      <button
                        disabled={reaktivierendId === a.id}
                        onClick={() => void reaktivieren(a.id)}
                        className="px-3 py-1.5 border border-[#86EFAC] rounded-lg text-xs text-[#166534] hover:bg-[#F0FDF4] disabled:opacity-50 transition-colors font-medium"
                      >
                        {reaktivierendId === a.id ? '…' : '↩'}
                      </button>
                    )}
                    <button
                      onClick={() => toggleExpand(a.id)}
                      className={`p-1.5 rounded-lg border transition-colors ${isExpanded ? 'bg-[#EFF6FF] border-[#0369A1] text-[#0369A1]' : 'border-[#E2EDF7] text-[#94A3B8]'}`}
                    >
                      <ChevronDown size={14} className={`transition-transform ${isExpanded ? 'rotate-180' : ''}`} />
                    </button>
                    <Link
                      href={`/dashboard/anfragen/${a.id}`}
                      className="px-3 py-1.5 border border-[#E2EDF7] rounded-lg text-xs text-[#64748B] hover:text-[#0369A1] hover:border-[#0369A1] transition-colors font-medium"
                    >
                      →
                    </Link>
                  </div>
                </div>
              </div>
              {isExpanded && (
                <div className="px-4 pb-4 pt-0 border-t border-[#E2EDF7]">
                  <div className="pt-3">
                    <DetailPanel a={a} />
                  </div>
                </div>
              )}
            </div>
          )
        })}
      </div>

      {/* Desktop: Tabelle */}
      <div className="hidden sm:block bg-white rounded-2xl border border-[#E2EDF7] overflow-hidden">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-[#E2EDF7] bg-[#F8FAFC]">
              <th className="text-left px-5 py-3 font-semibold text-[#64748B]">Kunde</th>
              <th className="text-left px-5 py-3 font-semibold text-[#64748B]">Fahrzeug</th>
              <th className="text-left px-5 py-3 font-semibold text-[#64748B]">Status</th>
              <th className="text-left px-5 py-3 font-semibold text-[#64748B] hidden lg:table-cell">Erstellt</th>
              <th className="px-5 py-3" />
            </tr>
          </thead>
          <tbody className="divide-y divide-[#E2EDF7]">
            {loading ? (
              <tr><td colSpan={5} className="px-5 py-12 text-center text-[#94A3B8]">Lädt…</td></tr>
            ) : anfragen.length === 0 ? (
              <tr><td colSpan={5} className="px-5 py-12 text-center text-[#94A3B8]">
                {showArchiv ? 'Keine archivierten Anfragen.' : 'Keine Anfragen gefunden.'}
              </td></tr>
            ) : anfragen.map(a => {
              const s = STATUS_CONFIG[a.status] ?? { label: a.status, bg: 'bg-gray-100', text: 'text-gray-800' }
              const isExpanded = expandedId === a.id
              return (
                <Fragment key={a.id}>
                  <tr className={`hover:bg-[#F8FAFC] transition-colors ${a.archiviert ? 'opacity-60' : ''}`}>
                    <td className="px-5 py-4">
                      <p className="font-semibold text-[#0F172A]">{a.vorname} {a.nachname}</p>
                      <p className="text-xs text-[#64748B] mt-0.5">{a.email}</p>
                      <p className="text-xs text-[#64748B]">{a.telefon} · PLZ {a.plz}</p>
                    </td>
                    <td className="px-5 py-4">
                      <p className="font-semibold text-[#0F172A]">{a.marke} {a.modell}</p>
                      <p className="text-xs text-[#64748B] mt-0.5">{a.kilometerstand.toLocaleString('de-DE')} km · EZ {a.erstzulassungJahr}</p>
                    </td>
                    <td className="px-5 py-4">
                      <div className="flex flex-wrap gap-1.5 items-center">
                        <span className={`inline-block px-2.5 py-1 rounded-full text-xs font-semibold ${s.bg} ${s.text}`}>
                          {s.label}
                        </span>
                        <div className="relative" onClick={e => e.stopPropagation()}>
                          <button
                            onClick={() => setDropdownId(d => d === `d-${a.id}` ? null : `d-${a.id}`)}
                            title={a.bearbeiter ? `${a.bearbeiter.vorname} ${a.bearbeiter.nachname} — klicken zum Ändern` : 'Bearbeiter zuweisen'}
                            className={`inline-flex items-center justify-center w-6 h-6 rounded-full text-[10px] font-bold transition-opacity hover:opacity-80 ${
                              a.bearbeiter ? 'text-white' : 'text-[#94A3B8] border-2 border-dashed border-[#CBD5E1] bg-white'
                            }`}
                            style={a.bearbeiter ? { background: a.bearbeiter.farbe } : {}}
                          >
                            {a.bearbeiter
                              ? (a.bearbeiter.kuerzel ?? (a.bearbeiter.vorname[0] + a.bearbeiter.nachname[0]).toUpperCase())
                              : '+'}
                          </button>
                          {dropdownId === `d-${a.id}` && mitarbeiter.length > 0 && (
                            <div className="absolute left-0 top-8 z-50 bg-white rounded-xl border border-[#E2EDF7] shadow-lg min-w-[160px] py-1">
                              {mitarbeiter.map(m => (
                                <button key={m.id} onClick={() => void assignBearbeiter(a.id, m.id)}
                                  className={`w-full flex items-center gap-2 px-3 py-2 text-left text-sm hover:bg-[#F8FAFC] transition-colors ${a.bearbeiterId === m.id ? 'text-[#0369A1] font-semibold' : 'text-[#0F172A]'}`}>
                                  <span className="w-5 h-5 rounded-full flex items-center justify-center text-white text-[9px] font-bold shrink-0" style={{ background: m.farbe }}>
                                    {m.kuerzel ?? (m.vorname[0] + m.nachname[0]).toUpperCase()}
                                  </span>
                                  {m.vorname} {m.nachname}
                                  {a.bearbeiterId === m.id && <span className="ml-auto">✓</span>}
                                </button>
                              ))}
                              {a.bearbeiterId && (
                                <button onClick={() => void assignBearbeiter(a.id, null)}
                                  className="w-full px-3 py-2 text-left text-xs text-[#94A3B8] hover:text-[#DC2626] hover:bg-[#FEF2F2] transition-colors border-t border-[#E2EDF7] mt-1">
                                  Zuweisung entfernen
                                </button>
                              )}
                            </div>
                          )}
                        </div>
                        {a.archiviert && (
                          <span className="inline-block px-2 py-0.5 rounded-full text-xs font-semibold bg-gray-100 text-gray-500">Archiv</span>
                        )}
                        {a.notizen?.trim() && (
                          <span className="inline-flex items-center gap-0.5 px-2 py-0.5 bg-[#FFFBEB] border border-[#FDE68A] rounded-full text-[10px] font-bold text-[#92400E]" title="Interne Notiz vorhanden">
                            📝
                          </span>
                        )}
                      </div>
                    </td>
                    <td className="px-5 py-4 text-xs text-[#64748B] hidden lg:table-cell whitespace-nowrap">{formatDate(a.createdAt)}</td>
                    <td className="px-5 py-4 text-right">
                      <div className="flex items-center justify-end gap-2">
                        {a.archiviert && (
                          <button
                            disabled={reaktivierendId === a.id}
                            onClick={() => void reaktivieren(a.id)}
                            className="inline-flex items-center gap-1 px-3 py-1.5 border border-[#86EFAC] rounded-lg text-xs text-[#166534] hover:bg-[#F0FDF4] disabled:opacity-50 transition-colors font-medium whitespace-nowrap"
                          >
                            {reaktivierendId === a.id ? '…' : '↩ Reaktivieren'}
                          </button>
                        )}
                        <button
                          onClick={() => toggleExpand(a.id)}
                          className={`p-1.5 rounded-lg border transition-colors ${isExpanded ? 'bg-[#EFF6FF] border-[#0369A1] text-[#0369A1]' : 'border-[#E2EDF7] text-[#94A3B8] hover:border-[#0369A1] hover:text-[#0369A1]'}`}
                          title="Details ein-/ausklappen"
                        >
                          <ChevronDown size={14} className={`transition-transform ${isExpanded ? 'rotate-180' : ''}`} />
                        </button>
                        <Link
                          href={`/dashboard/anfragen/${a.id}`}
                          className="inline-flex items-center gap-1 px-3 py-1.5 rounded-lg text-xs bg-[#FB6F6F] hover:bg-[#f95c5c] text-white font-semibold transition-colors"
                        >
                          Details →
                        </Link>
                      </div>
                    </td>
                  </tr>
                  {isExpanded && (
                    <tr className="bg-[#F8FAFC]">
                      <td colSpan={5} className="px-5 py-4">
                        <DetailPanel a={a} />
                      </td>
                    </tr>
                  )}
                </Fragment>
              )
            })}
          </tbody>
        </table>
      </div>
    </div>
  )
}
