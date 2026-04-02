'use client'

import { useState, useEffect, useCallback, useRef } from 'react'
import Link from 'next/link'
import { ArrowLeft } from 'lucide-react'
import { MailVorschauModal } from '@/components/dashboard/MailVorschauModal'

interface MailLogEntry {
  id: string
  createdAt: string
  anfrageId: string | null
  typ: string
  empfaenger: string
  betreff: string
  status: string
  fehler: string | null
}

const TYP_LABELS: Record<string, string> = {
  eingangsbestaetigung:    'Eingang',
  intern_benachrichtigung: 'Intern',
  angebot:                 'Angebot',
  termin_bestaetigung:     'Termin',
  termin_verschoben:       'Verschoben',
  termin_abgesagt:         'Abgesagt',
  followup:                'Follow-up',
  test:                    'Test',
  unbekannt:               '—',
}

const TYP_COLORS: Record<string, string> = {
  eingangsbestaetigung:    'bg-blue-100 text-blue-800',
  intern_benachrichtigung: 'bg-gray-100 text-gray-700',
  angebot:                 'bg-purple-100 text-purple-800',
  termin_bestaetigung:     'bg-green-100 text-green-800',
  termin_verschoben:       'bg-yellow-100 text-yellow-800',
  termin_abgesagt:         'bg-red-100 text-red-800',
  followup:                'bg-orange-100 text-orange-800',
  test:                    'bg-cyan-100 text-cyan-800',
}

export default function MailLogPage() {
  const [logs, setLogs] = useState<MailLogEntry[]>([])
  const [loading, setLoading] = useState(true)
  const [nurFehler, setNurFehler] = useState(false)
  const [vorschauId, setVorschauId] = useState<string | null>(null)
  // Neu-Einträge seit letztem Laden (für Echtzeit-Feedback)
  const [neuIds, setNeuIds] = useState<Set<string>>(new Set())
  const prevIdsRef = useRef<Set<string>>(new Set())

  const load = useCallback(async (silent = false) => {
    if (!silent) setLoading(true)
    try {
      const params = new URLSearchParams({ limit: '200' })
      if (nurFehler) params.set('nurFehler', 'true')
      const res = await fetch(`/api/dashboard/mail-log?${params}`)
      if (res.ok) {
        const data = await res.json() as { logs: MailLogEntry[] }
        setLogs(prev => {
          const newIds = new Set(data.logs.map(l => l.id))
          // Einträge die vorher nicht da waren → highlighten
          const added = new Set<string>()
          for (const id of newIds) {
            if (!prevIdsRef.current.has(id)) added.add(id)
          }
          if (added.size > 0 && prevIdsRef.current.size > 0) {
            setNeuIds(added)
            setTimeout(() => setNeuIds(new Set()), 4000)
          }
          prevIdsRef.current = newIds
          return data.logs
        })
      }
    } finally {
      if (!silent) setLoading(false)
    }
  }, [nurFehler])

  useEffect(() => { void load() }, [load])

  // Auto-Refresh alle 30 Sek.
  useEffect(() => {
    const interval = setInterval(() => { void load(true) }, 30_000)
    return () => clearInterval(interval)
  }, [load])

  const formatDate = (d: string) =>
    new Date(d).toLocaleString('de-DE', {
      day: '2-digit', month: '2-digit', year: '2-digit',
      hour: '2-digit', minute: '2-digit',
    })

  const fehlerCount = logs.filter(l => l.status === 'fehler').length

  const markBehoben = async (id: string) => {
    await fetch(`/api/dashboard/mail-log/${id}`, { method: 'PATCH' })
    setLogs(prev => prev.map(l => l.id === id ? { ...l, status: 'behoben' } : l))
  }

  const markAllBehoben = async () => {
    const fehler = logs.filter(l => l.status === 'fehler')
    await Promise.all(fehler.map(l => fetch(`/api/dashboard/mail-log/${l.id}`, { method: 'PATCH' })))
    setLogs(prev => prev.map(l => l.status === 'fehler' ? { ...l, status: 'behoben' } : l))
  }

  return (
    <>
      <div className="p-4 md:p-8">
        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-3">
            <Link href="/dashboard" className="text-[#64748B] hover:text-[#0369A1] transition-colors shrink-0">
              <ArrowLeft size={20} strokeWidth={2.5} />
            </Link>
            <div>
              <h1 className="text-2xl font-black text-[#0F172A]">Mail-Protokoll</h1>
              <p className="text-[#64748B] text-sm mt-0.5">
                {logs.length} Einträge · {fehlerCount} Fehler
              </p>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <label className="flex items-center gap-2 cursor-pointer">
              <div
                onClick={() => setNurFehler(v => !v)}
                className={`w-10 h-5 rounded-full transition-colors duration-200 relative cursor-pointer ${nurFehler ? 'bg-red-500' : 'bg-[#E2EDF7]'}`}
              >
                <span className={`absolute top-0.5 w-4 h-4 bg-white rounded-full shadow transition-transform duration-200 ${nurFehler ? 'translate-x-5' : 'translate-x-0.5'}`} />
              </div>
              <span className="text-sm text-[#64748B] font-medium hidden sm:inline">Nur Fehler</span>
            </label>
            <button
              onClick={() => void load()}
              className="px-4 py-2 text-sm font-semibold border border-[#E2EDF7] rounded-xl text-[#64748B] hover:text-[#0369A1] hover:border-[#0369A1] transition-colors"
            >
              Aktualisieren
            </button>
          </div>
        </div>

        {/* Fehler-Banner */}
        {fehlerCount > 0 && (
          <div className="bg-[#FEF2F2] border border-[#FECACA] rounded-xl px-4 py-3 mb-6">
            <div className="flex items-start gap-3 mb-3">
              <span className="text-red-500 text-lg shrink-0">⚠️</span>
              <p className="text-sm text-[#991B1B] font-medium">
                {fehlerCount} E-Mail{fehlerCount > 1 ? 's' : ''} konnten nicht zugestellt werden.
                Bitte Mailserver-Konfiguration prüfen.
              </p>
            </div>
            <button
              onClick={() => void markAllBehoben()}
              className="w-full text-xs px-3 py-2 bg-[#991B1B] hover:bg-[#7f1d1d] text-white font-semibold rounded-lg transition-colors"
            >
              Alle als behoben markieren
            </button>
          </div>
        )}

        {/* Tabelle */}
        <div className="bg-white rounded-2xl border border-[#E2EDF7] overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-[#E2EDF7] bg-[#F8FAFC]">
                  <th className="text-left px-4 py-3 font-semibold text-[#64748B]">Zeit</th>
                  <th className="text-left px-4 py-3 font-semibold text-[#64748B]">Typ</th>
                  <th className="text-left px-4 py-3 font-semibold text-[#64748B] hidden sm:table-cell">Empfänger</th>
                  <th className="text-left px-4 py-3 font-semibold text-[#64748B] hidden lg:table-cell">Betreff</th>
                  <th className="text-left px-4 py-3 font-semibold text-[#64748B]">Status</th>
                  <th className="px-4 py-3" />
                </tr>
              </thead>
              <tbody className="divide-y divide-[#E2EDF7]">
                {loading ? (
                  <tr>
                    <td colSpan={6} className="px-5 py-12 text-center text-[#94A3B8]">Lädt…</td>
                  </tr>
                ) : logs.length === 0 ? (
                  <tr>
                    <td colSpan={6} className="px-5 py-12 text-center text-[#94A3B8]">
                      {nurFehler ? 'Keine Fehler gefunden.' : 'Noch keine E-Mails versendet.'}
                    </td>
                  </tr>
                ) : logs.map(log => {
                  const isNeu = neuIds.has(log.id)
                  const isFehler = log.status === 'fehler'
                  const isBehoben = log.status === 'behoben'
                  return (
                    <tr
                      key={log.id}
                      className={`transition-colors ${
                        isNeu
                          ? 'bg-[#F0F9FF] animate-pulse'
                          : isFehler
                            ? 'bg-[#FEF9F9] hover:bg-[#FEF2F2]'
                            : isBehoben
                              ? 'bg-[#F8FAFC] opacity-60 hover:opacity-100'
                              : 'hover:bg-[#F8FAFC]'
                      }`}
                    >
                      <td className="px-4 py-3 text-xs text-[#64748B] whitespace-nowrap">
                        {formatDate(log.createdAt)}
                        {isNeu && (
                          <span className="ml-1.5 inline-block px-1.5 py-0.5 bg-[#0369A1] text-white text-[10px] rounded-full font-bold leading-none">
                            NEU
                          </span>
                        )}
                      </td>
                      <td className="px-4 py-3">
                        <span className={`inline-block px-2 py-0.5 rounded-full text-xs font-semibold ${TYP_COLORS[log.typ] || 'bg-gray-100 text-gray-600'}`}>
                          {TYP_LABELS[log.typ] || log.typ}
                        </span>
                      </td>
                      <td className="px-4 py-3 text-xs text-[#0F172A] font-medium hidden sm:table-cell">
                        {log.empfaenger}
                      </td>
                      <td className="px-4 py-3 text-xs text-[#64748B] hidden lg:table-cell max-w-xs truncate">
                        {log.betreff}
                      </td>
                      <td className="px-4 py-3">
                        {isFehler ? (
                          <div>
                            <span className="inline-block px-2 py-0.5 rounded-full text-xs font-semibold bg-red-100 text-red-700">
                              ✕ Fehler
                            </span>
                            {log.fehler && (
                              <p className="text-xs text-red-600 mt-1 max-w-[140px] truncate">{log.fehler}</p>
                            )}
                          </div>
                        ) : log.status === 'behoben' ? (
                          <span className="inline-block px-2 py-0.5 rounded-full text-xs font-semibold bg-gray-100 text-gray-500">
                            ✓ Behoben
                          </span>
                        ) : (
                          <span className="inline-block px-2 py-0.5 rounded-full text-xs font-semibold bg-green-100 text-green-700">
                            ✓ Gesendet
                          </span>
                        )}
                      </td>
                      <td className="px-4 py-3">
                        <div className="flex items-center justify-end gap-2">
                          {isFehler && (
                            <button
                              onClick={() => void markBehoben(log.id)}
                              className="text-xs px-3 py-1.5 bg-[#FB6F6F] hover:bg-[#f95c5c] text-white font-semibold rounded-lg transition-colors whitespace-nowrap"
                              title="Als behoben markieren"
                            >
                              Behoben
                            </button>
                          )}
                          <button
                            onClick={() => setVorschauId(log.id)}
                            className="text-xs px-3 py-1.5 border border-[#E2EDF7] rounded-lg text-[#64748B] hover:text-[#0369A1] hover:border-[#0369A1] transition-colors whitespace-nowrap"
                            title="E-Mail Vorschau"
                          >
                            Vorschau
                          </button>
                          {log.anfrageId && (
                            <Link
                              href={`/dashboard/anfragen/${log.anfrageId}`}
                              className="text-xs px-3 py-1.5 border border-[#E2EDF7] rounded-lg text-[#64748B] hover:text-[#0369A1] hover:border-[#0369A1] transition-colors whitespace-nowrap hidden sm:inline-block"
                            >
                              Anfrage →
                            </Link>
                          )}
                        </div>
                      </td>
                    </tr>
                  )
                })}
              </tbody>
            </table>
          </div>
        </div>

        <p className="text-xs text-[#94A3B8] mt-4 text-center">
          Auto-Refresh alle 30 Sek. · Vorschau nur für neu versendete E-Mails verfügbar
        </p>
      </div>

      {/* Vorschau-Modal */}
      {vorschauId && (
        <MailVorschauModal
          logId={vorschauId}
          onClose={() => setVorschauId(null)}
        />
      )}
    </>
  )
}
