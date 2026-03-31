'use client'

import { useState, useEffect, useRef } from 'react'
import Link from 'next/link'

interface MailLogDetail {
  id: string
  createdAt: string
  anfrageId: string | null
  typ: string
  empfaenger: string
  betreff: string
  htmlBody: string | null
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
  ablehnung:               'Ablehnung',
  rueckfrage:              'Rückfrage',
  freinachricht:           'Nachricht',
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
  ablehnung:               'bg-red-100 text-red-800',
  rueckfrage:              'bg-blue-100 text-blue-800',
  freinachricht:           'bg-gray-100 text-gray-700',
  test:                    'bg-cyan-100 text-cyan-800',
}

export function MailVorschauModal({
  logId,
  onClose,
}: {
  logId: string
  onClose: () => void
}) {
  const [detail, setDetail] = useState<MailLogDetail | null>(null)
  const [loading, setLoading] = useState(true)
  const [fehler, setFehler] = useState<string | null>(null)
  const iframeRef = useRef<HTMLIFrameElement>(null)
  const overlayRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    void (async () => {
      try {
        const res = await fetch(`/api/dashboard/mail-log/${logId}`)
        if (!res.ok) throw new Error('Laden fehlgeschlagen')
        const data = await res.json() as { log: MailLogDetail }
        setDetail(data.log)
      } catch {
        setFehler('E-Mail konnte nicht geladen werden.')
      } finally {
        setLoading(false)
      }
    })()
  }, [logId])

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => { if (e.key === 'Escape') onClose() }
    document.addEventListener('keydown', onKey)
    document.body.style.overflow = 'hidden'
    return () => {
      document.removeEventListener('keydown', onKey)
      document.body.style.overflow = ''
    }
  }, [onClose])

  // Auf Mobile horizontal zur Mitte scrollen sobald iframe geladen
  const handleIframeLoad = () => {
    const iframe = iframeRef.current
    if (!iframe || window.innerWidth >= 640) return
    try {
      const doc = iframe.contentDocument || iframe.contentWindow?.document
      if (!doc) return
      const scrollWidth = doc.documentElement.scrollWidth
      const clientWidth = iframe.clientWidth
      if (scrollWidth > clientWidth) {
        iframe.contentWindow?.scrollTo((scrollWidth - clientWidth) / 2, 0)
      }
    } catch {
      // cross-origin: kein Zugriff
    }
  }

  const formatDate = (d: string) =>
    new Date(d).toLocaleString('de-DE', {
      day: '2-digit', month: '2-digit', year: 'numeric',
      hour: '2-digit', minute: '2-digit',
    })

  return (
    <div
      ref={overlayRef}
      className="fixed inset-0 z-50 flex items-end sm:items-center justify-center p-0 sm:p-4"
      style={{ backgroundColor: 'rgba(15,23,42,0.6)', backdropFilter: 'blur(2px)' }}
      onClick={(e) => { if (e.target === overlayRef.current) onClose() }}
    >
      <div className="bg-white w-full sm:max-w-4xl sm:rounded-2xl rounded-t-2xl shadow-2xl flex flex-col h-[88dvh] sm:h-[92vh]">

        {/* Header */}
        <div className="flex items-center justify-between px-5 py-4 border-b border-[#E2EDF7] shrink-0">
          <div className="flex items-center gap-2.5 min-w-0">
            <span className="text-lg">✉️</span>
            <span className="font-bold text-[#0F172A] text-sm truncate">E-Mail Vorschau</span>
            {detail && (
              <span className={`inline-block px-2 py-0.5 rounded-full text-xs font-semibold shrink-0 ${TYP_COLORS[detail.typ] ?? 'bg-gray-100 text-gray-600'}`}>
                {TYP_LABELS[detail.typ] ?? detail.typ}
              </span>
            )}
            {detail && (
              <span className={`inline-block px-2 py-0.5 rounded-full text-xs font-semibold shrink-0 ${detail.status === 'gesendet' ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'}`}>
                {detail.status === 'gesendet' ? '✓ Zugestellt' : '✕ Fehler'}
              </span>
            )}
          </div>
          <button
            onClick={onClose}
            className="w-8 h-8 flex items-center justify-center rounded-lg text-[#64748B] hover:bg-[#F1F5F9] hover:text-[#0F172A] transition-colors shrink-0 ml-2"
            aria-label="Schließen"
          >
            ✕
          </button>
        </div>

        {/* Meta */}
        {detail && (
          <div className="px-5 py-2.5 bg-[#F8FAFC] border-b border-[#E2EDF7] shrink-0 space-y-1">
            <div className="flex flex-wrap gap-x-6 gap-y-1 text-xs text-[#64748B]">
              <span><span className="font-semibold text-[#0F172A]">An:</span> {detail.empfaenger}</span>
              <span><span className="font-semibold text-[#0F172A]">Zeit:</span> {formatDate(detail.createdAt)}</span>
            </div>
            <div className="text-xs text-[#64748B]">
              <span className="font-semibold text-[#0F172A]">Betreff:</span> {detail.betreff}
            </div>
            {detail.status === 'fehler' && detail.fehler && (
              <div className="flex items-start gap-1.5 text-xs text-red-700 bg-red-50 rounded-lg px-3 py-2">
                <span className="shrink-0">⚠️</span>
                <span><span className="font-semibold">Fehler:</span> {detail.fehler}</span>
              </div>
            )}
          </div>
        )}

        {/* Iframe – füllt den Rest der Modal-Höhe vollständig */}
        <div className="flex-1 min-h-0 relative">
          {loading && (
            <div className="absolute inset-0 flex items-center justify-center text-[#94A3B8] text-sm">
              Lädt Vorschau…
            </div>
          )}
          {fehler && (
            <div className="absolute inset-0 flex items-center justify-center text-red-500 text-sm px-6 text-center">
              {fehler}
            </div>
          )}
          {detail && !loading && (
            detail.htmlBody ? (
              <iframe
                ref={iframeRef}
                srcDoc={detail.htmlBody}
                className="absolute inset-0 w-full h-full border-0"
                title="E-Mail Vorschau"
                sandbox="allow-same-origin"
                onLoad={handleIframeLoad}
              />
            ) : (
              <div className="absolute inset-0 flex items-center justify-center text-[#94A3B8] text-sm text-center px-6">
                Keine Vorschau gespeichert.<br />
                <span className="text-xs block mt-1">Nur bei neu versendeten E-Mails verfügbar.</span>
              </div>
            )
          )}
        </div>

        {/* Footer */}
        <div className="px-5 py-3 border-t border-[#E2EDF7] shrink-0 flex items-center justify-between gap-3">
          {detail?.anfrageId ? (
            <Link
              href={`/dashboard/anfragen/${detail.anfrageId}`}
              className="text-xs px-3 py-1.5 border border-[#E2EDF7] rounded-lg text-[#64748B] hover:text-[#0369A1] hover:border-[#0369A1] transition-colors"
              onClick={onClose}
            >
              Zur Anfrage →
            </Link>
          ) : (
            <span />
          )}
          <button
            onClick={onClose}
            className="text-xs px-4 py-2 bg-[#F1F5F9] hover:bg-[#E2EDF7] text-[#0F172A] font-semibold rounded-lg transition-colors"
          >
            Schließen
          </button>
        </div>
      </div>
    </div>
  )
}
