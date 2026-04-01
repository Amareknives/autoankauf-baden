'use client'

interface Props {
  subject: string
  html: string
  sending: boolean
  onConfirm: () => void
  onClose: () => void
}

export default function EmailVorschauConfirmModal({ subject, html, sending, onConfirm, onClose }: Props) {
  return (
    <div
      className="fixed inset-0 z-50 flex items-end sm:items-center justify-center bg-black/50 p-0 sm:p-4"
      onClick={e => { if (e.target === e.currentTarget) onClose() }}
    >
      <div className="bg-white w-full sm:max-w-2xl rounded-t-2xl sm:rounded-2xl shadow-2xl border border-[#E2EDF7] flex flex-col max-h-[92vh]">

        {/* Drag-Handle (nur Mobile) */}
        <div className="flex justify-center pt-3 pb-1 sm:hidden">
          <div className="w-10 h-1 bg-[#E2EDF7] rounded-full" />
        </div>

        {/* Header */}
        <div className="flex items-center justify-between px-5 py-4 sm:px-6 border-b border-[#E2EDF7] shrink-0">
          <div className="min-w-0">
            <p className="text-xs font-semibold text-[#64748B] uppercase tracking-wide mb-0.5">E-Mail Vorschau</p>
            <p className="text-sm font-bold text-[#0F172A] truncate">{subject}</p>
          </div>
          <button
            onClick={onClose}
            className="ml-3 flex-shrink-0 w-10 h-10 flex items-center justify-center rounded-full hover:bg-[#F1F5F9] text-[#94A3B8] hover:text-[#0F172A] transition-colors text-xl leading-none"
            aria-label="Schließen"
          >
            ×
          </button>
        </div>

        {/* Hinweis-Banner */}
        <div className="px-5 sm:px-6 py-2.5 bg-[#FFFBEB] border-b border-[#FDE68A] shrink-0">
          <p className="text-xs text-[#92400E] font-medium">
            👁 Vorschau — noch nicht gesendet. Bitte prüfen und dann bestätigen.
          </p>
        </div>

        {/* Email-Vorschau (scrollbar) */}
        <div className="flex-1 overflow-y-auto bg-[#F1F5F9]">
          <iframe
            srcDoc={html}
            className="w-full border-0"
            style={{ minHeight: '480px', height: '100%' }}
            title="E-Mail Vorschau"
            sandbox="allow-same-origin"
          />
        </div>

        {/* Footer */}
        <div className="flex gap-2 px-5 py-4 sm:px-6 border-t border-[#E2EDF7] bg-white rounded-b-2xl shrink-0">
          <button
            onClick={onClose}
            disabled={sending}
            className="flex-1 px-4 py-3 border border-[#E2EDF7] rounded-xl text-sm font-semibold text-[#64748B] hover:bg-[#F8FAFC] transition-colors disabled:opacity-50 min-h-[48px]"
          >
            Abbrechen
          </button>
          <button
            onClick={onConfirm}
            disabled={sending}
            className="flex-1 px-4 py-3 bg-[#0369A1] hover:bg-[#0284c7] disabled:opacity-50 text-white text-sm font-bold rounded-xl transition-colors min-h-[48px]"
          >
            {sending ? 'Wird gesendet…' : '📧 Jetzt senden'}
          </button>
        </div>

      </div>
    </div>
  )
}
