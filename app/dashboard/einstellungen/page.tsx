'use client'

import { useState, useEffect } from 'react'
import toast from 'react-hot-toast'

interface Settings {
  // Unternehmen
  firmenname: string
  inhaber: string
  strasse: string
  plz_firma: string
  ort: string
  // Kontakt
  telefon: string
  whatsapp: string
  email: string
  // WhatsApp Benachrichtigungen (bis zu 5 Nummern)
  wa_nummer_1: string
  wa_api_key_1: string
  wa_nummer_2: string
  wa_api_key_2: string
  wa_nummer_3: string
  wa_api_key_3: string
  wa_nummer_4: string
  wa_api_key_4: string
  wa_nummer_5: string
  wa_api_key_5: string
  // Automatisierung
  followup_aktiv: string
  followup_tage: string
  archiv_tage: string
  auto_loeschen_aktiv: string
  auto_loeschen_monate: string
  // E-Mail Vorlagen
  email_kunde_betreff: string
  email_kunde_inhalt: string
  email_followup_betreff: string
  email_followup_inhalt: string
  // Tracking
  gtmId: string
  // Features
  chatEnabled: string
  // Social Media
  social_facebook: string
  social_instagram: string
  social_x: string
  social_youtube: string
  social_xing: string
  social_linkedin: string
}

const defaultSettings: Settings = {
  firmenname: 'autoankauf baden',
  inhaber: 'Muhammet Demir',
  strasse: 'Heidelberger Str. 4',
  plz_firma: '76676',
  ort: 'Graben-Neudorf',
  telefon: '+49 176 64179764',
  whatsapp: '4917664179764',
  email: 'anfrage@autoankauf-baden.de',
  wa_nummer_1: '', wa_api_key_1: '',
  wa_nummer_2: '', wa_api_key_2: '',
  wa_nummer_3: '', wa_api_key_3: '',
  wa_nummer_4: '', wa_api_key_4: '',
  wa_nummer_5: '', wa_api_key_5: '',
  followup_aktiv: 'true',
  followup_tage: '5',
  archiv_tage: '30',
  auto_loeschen_aktiv: 'false',
  auto_loeschen_monate: '24',
  email_kunde_betreff: '',
  email_kunde_inhalt: '',
  email_followup_betreff: '',
  email_followup_inhalt: '',
  gtmId: '',
  chatEnabled: 'true',
  social_facebook: '',
  social_instagram: '',
  social_x: '',
  social_youtube: '',
  social_xing: '',
  social_linkedin: '',
}

function Field({ label, value, onChange, placeholder, hint, type = 'text', monospace = false }: {
  label: string; value: string; onChange: (v: string) => void
  placeholder?: string; hint?: string; type?: string; monospace?: boolean
}) {
  return (
    <div>
      <label className="block text-xs font-semibold text-[#64748B] mb-1.5 uppercase tracking-wide">{label}</label>
      <input
        type={type} value={value} onChange={e => onChange(e.target.value)} placeholder={placeholder}
        className={`w-full px-3 py-2.5 border border-[#E2EDF7] rounded-xl text-sm text-[#0F172A] placeholder:text-[#94A3B8] focus:outline-none focus:ring-2 focus:ring-[#0369A1] focus:border-transparent transition-all ${monospace ? 'font-mono' : ''}`}
      />
      {hint && <p className="text-xs text-[#94A3B8] mt-1">{hint}</p>}
    </div>
  )
}

function Textarea({ label, value, onChange, placeholder, hint, rows = 4 }: {
  label: string; value: string; onChange: (v: string) => void
  placeholder?: string; hint?: string; rows?: number
}) {
  return (
    <div>
      <label className="block text-xs font-semibold text-[#64748B] mb-1.5 uppercase tracking-wide">{label}</label>
      <textarea
        value={value} onChange={e => onChange(e.target.value)} placeholder={placeholder} rows={rows}
        className="w-full px-3 py-2.5 border border-[#E2EDF7] rounded-xl text-sm text-[#0F172A] placeholder:text-[#94A3B8] focus:outline-none focus:ring-2 focus:ring-[#0369A1] focus:border-transparent transition-all resize-y"
      />
      {hint && <p className="text-xs text-[#94A3B8] mt-1">{hint}</p>}
    </div>
  )
}

function Toggle({ label, sub, checked, onChange }: { label: string; sub?: string; checked: boolean; onChange: (v: boolean) => void }) {
  return (
    <label className="flex items-center gap-3 cursor-pointer">
      <div onClick={() => onChange(!checked)}
        className={`w-11 h-6 rounded-full transition-colors duration-200 relative flex-shrink-0 cursor-pointer ${checked ? 'bg-[#0369A1]' : 'bg-[#E2EDF7]'}`}
      >
        <span className={`absolute top-1 w-4 h-4 bg-white rounded-full shadow transition-transform duration-200 ${checked ? 'translate-x-6' : 'translate-x-1'}`} />
      </div>
      <div>
        <p className="text-sm font-medium text-[#0F172A]">{label}</p>
        {sub && <p className="text-xs text-[#64748B]">{sub}</p>}
      </div>
    </label>
  )
}

function Card({ title, children, badge }: { title: string; children: React.ReactNode; badge?: string }) {
  return (
    <div className="bg-white rounded-2xl border border-[#E2EDF7] p-6">
      <div className="flex items-center gap-3 mb-5">
        <h2 className="font-bold text-[#0F172A]">{title}</h2>
        {badge && <span className="px-2 py-0.5 bg-[#E8F4FD] text-[#0369A1] text-xs font-semibold rounded-full">{badge}</span>}
      </div>
      {children}
    </div>
  )
}

const FARBEN = ['#0369A1', '#7C3AED', '#059669', '#D97706', '#DC2626', '#DB2777', '#0F172A', '#EA580C']

interface MitarbeiterTyp {
  id: string
  vorname: string
  nachname: string
  email: string
  kuerzel: string | null
  telefon: string | null
  whatsapp: string | null
  waApiKey: string | null
  farbe: string
  istDefault: boolean
  aktiv: boolean
  benachrichtigungKanal: string
}

const INP = 'w-full px-3 py-2 border border-[#E2EDF7] rounded-xl text-sm text-[#0F172A] focus:outline-none focus:ring-2 focus:ring-[#0369A1]'

function DefaultBearbeiterCard({ liste }: { liste: MitarbeiterTyp[] }) {
  const [defaultId, setDefaultId] = useState('')
  const [saving, setSaving] = useState(false)
  const [bulkLoading, setBulkLoading] = useState(false)

  useEffect(() => {
    void fetch('/api/dashboard/einstellungen')
      .then(r => r.json())
      .then((d: Record<string, string>) => { if (d.defaultBearbeiterId) setDefaultId(d.defaultBearbeiterId) })
      .catch(() => {})
  }, [])

  const save = async (val: string) => {
    setDefaultId(val)
    setSaving(true)
    try {
      await fetch('/api/dashboard/einstellungen', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ defaultBearbeiterId: val }),
      })
    } finally {
      setSaving(false)
    }
  }

  const aktive = liste.filter(m => m.aktiv)
  if (aktive.length === 0) return null

  return (
    <Card title="Standard-Bearbeiter">
      <p className="text-xs text-[#64748B] mb-4">
        Neue Anfragen werden automatisch diesem Mitarbeiter zugewiesen. Du kannst die Zuweisung jederzeit pro Fall ändern.
      </p>
      <select
        value={defaultId}
        onChange={e => void save(e.target.value)}
        disabled={saving}
        className="w-full px-3 py-2 border border-[#E2EDF7] rounded-xl text-sm text-[#0F172A] focus:outline-none focus:ring-2 focus:ring-[#0369A1] disabled:opacity-50"
      >
        <option value="">— Kein Standard (manuell zuweisen) —</option>
        {aktive.map(m => (
          <option key={m.id} value={m.id}>{m.vorname} {m.nachname}{m.kuerzel ? ` (${m.kuerzel})` : ''}</option>
        ))}
      </select>
      {defaultId && (
        <>
          <p className="mt-2 text-[11px] text-[#0369A1]">
            ✓ Jede neue Anfrage geht automatisch an {aktive.find(m => m.id === defaultId)?.vorname ?? '…'}
          </p>
          <div className="mt-3 pt-3 border-t border-[#E2EDF7]">
            <p className="text-xs text-[#64748B] mb-2">Bestehende Anfragen ohne Zuweisung nachträglich zuweisen:</p>
            <button
              disabled={bulkLoading}
              onClick={async () => {
                setBulkLoading(true)
                try {
                  const res = await fetch('/api/dashboard/anfragen/assign-default', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ bearbeiterId: defaultId }),
                  })
                  const d = await res.json() as { aktualisiert?: number; error?: string }
                  if (res.ok) {
                    const n = d.aktualisiert ?? 0
                    toast.success(n > 0 ? `${n} Anfragen zugewiesen` : 'Alle Anfragen haben bereits einen Bearbeiter')
                  } else {
                    toast.error(d.error ?? 'Fehler')
                  }
                } finally {
                  setBulkLoading(false)
                }
              }}
              className="px-4 py-2 bg-[#0369A1] text-white text-xs font-bold rounded-xl hover:bg-[#0284C7] disabled:opacity-50 transition-colors"
            >
              {bulkLoading ? 'Läuft…' : 'Alle unzugewiesenen Anfragen jetzt zuweisen'}
            </button>
          </div>
        </>
      )}
    </Card>
  )
}

function MitarbeiterVerwaltung() {
  const [liste, setListe] = useState<MitarbeiterTyp[]>([])
  const [ichId, setIchId] = useState<string | null>(null)
  const [meLoaded, setMeLoaded] = useState(false)
  const [neu, setNeu] = useState({ vorname: '', nachname: '', email: '', passwort: '', kuerzel: '', telefon: '', farbe: FARBEN[0] })
  const [adding, setAdding] = useState(false)
  const [saving, setSaving] = useState(false)
  const [editPw, setEditPw] = useState<{ id: string; pw: string } | null>(null)
  const [editEmail, setEditEmail] = useState<{ id: string; email: string } | null>(null)
  const [editProfil, setEditProfil] = useState<{ id: string; vorname: string; nachname: string; kuerzel: string; telefon: string; farbe: string } | null>(null)
  const [transferModal, setTransferModal] = useState<{ id: string; name: string; offeneAnfragen: number } | null>(null)
  const [transferZiel, setTransferZiel] = useState('')

  const load = async () => {
    const res = await fetch('/api/dashboard/mitarbeiter')
    if (res.ok) setListe(await res.json() as MitarbeiterTyp[])
  }

  useEffect(() => {
    void load()
    void fetch('/api/dashboard/me').then(r => r.ok ? r.json() : null).then((d: { id: string } | null) => { if (d) setIchId(d.id); setMeLoaded(true) })
  }, [])

  const ichBinDefault = meLoaded ? (liste.find(m => m.id === ichId)?.istDefault ?? false) : true

  const handleAdd = async () => {
    if (!neu.vorname.trim() || !neu.nachname.trim() || !neu.email.trim() || !neu.passwort.trim()) return
    setSaving(true)
    const res = await fetch('/api/dashboard/mitarbeiter', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        vorname: neu.vorname.trim(),
        nachname: neu.nachname.trim(),
        email: neu.email.trim(),
        passwort: neu.passwort,
        kuerzel: neu.kuerzel || undefined,
        telefon: neu.telefon || undefined,
        farbe: neu.farbe,
      }),
    })
    if (res.ok) {
      setNeu({ vorname: '', nachname: '', email: '', passwort: '', kuerzel: '', telefon: '', farbe: FARBEN[0] })
      setAdding(false)
      await load()
      toast.success('Mitarbeiter angelegt')
    } else {
      const err = await res.json() as { error?: string }
      toast.error(err.error ?? 'Fehler')
    }
    setSaving(false)
  }

  const handleDelete = async (id: string) => {
    const m = liste.find(x => x.id === id)
    if (!m) return
    const andereAktive = liste.filter(x => x.aktiv && x.id !== id)
    const res = await fetch(`/api/dashboard/mitarbeiter/${id}`, { method: 'DELETE' })
    if (res.status === 409) {
      const data = await res.json() as { offeneAnfragen: number }
      // Nur ein anderer aktiver Mitarbeiter → automatisch übertragen
      if (andereAktive.length === 1) {
        const url = `/api/dashboard/mitarbeiter/${id}?nachfolgerId=${andereAktive[0].id}`
        const r2 = await fetch(url, { method: 'DELETE' })
        if (r2.ok) { await load(); toast.success(`Anfragen übertragen an ${andereAktive[0].vorname} ${andereAktive[0].nachname} – Mitarbeiter deaktiviert`) }
        else toast.error('Fehler beim Deaktivieren')
        return
      }
      setTransferModal({ id, name: `${m.vorname} ${m.nachname}`, offeneAnfragen: data.offeneAnfragen })
      setTransferZiel('')
      return
    }
    if (res.ok) { await load(); toast.success('Mitarbeiter deaktiviert') }
    else toast.error('Fehler beim Deaktivieren')
  }

  const handleTransferUndLoeschen = async () => {
    if (!transferModal || !transferZiel) return
    const url = `/api/dashboard/mitarbeiter/${transferModal.id}?nachfolgerId=${transferZiel}`
    const res = await fetch(url, { method: 'DELETE' })
    if (res.ok) {
      setTransferModal(null)
      await load()
      toast.success('Anfragen übertragen & Mitarbeiter deaktiviert')
    } else {
      toast.error('Fehler bei der Übertragung')
    }
  }

  const handleDefault = async (id: string) => {
    const res = await fetch(`/api/dashboard/mitarbeiter/${id}`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ istDefault: true }),
    })
    if (res.ok) { await load(); toast.success('Standard gesetzt') }
  }

  const handleToggleAktiv = async (id: string, aktiv: boolean) => {
    const res = await fetch(`/api/dashboard/mitarbeiter/${id}`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ aktiv: !aktiv }),
    })
    if (res.ok) { await load(); toast.success(!aktiv ? 'Aktiviert' : 'Deaktiviert') }
  }

  const handlePwChange = async () => {
    if (!editPw || editPw.pw.length < 6) return
    setSaving(true)
    const res = await fetch(`/api/dashboard/mitarbeiter/${editPw.id}`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ passwort: editPw.pw }),
    })
    if (res.ok) { setEditPw(null); toast.success('Passwort geändert') }
    else toast.error('Fehler beim Ändern')
    setSaving(false)
  }

  const handleEmailChange = async () => {
    if (!editEmail || !editEmail.email.includes('@')) return
    setSaving(true)
    const res = await fetch(`/api/dashboard/mitarbeiter/${editEmail.id}`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email: editEmail.email.trim() }),
    })
    if (res.ok) { setEditEmail(null); await load(); toast.success('E-Mail geändert') }
    else toast.error('Fehler beim Ändern')
    setSaving(false)
  }

  const handleProfilChange = async () => {
    if (!editProfil || !editProfil.vorname.trim() || !editProfil.nachname.trim()) return
    setSaving(true)
    const res = await fetch(`/api/dashboard/mitarbeiter/${editProfil.id}`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ vorname: editProfil.vorname.trim(), nachname: editProfil.nachname.trim(), kuerzel: editProfil.kuerzel.trim() || null, telefon: editProfil.telefon.trim() || null, farbe: editProfil.farbe }),
    })
    if (res.ok) { setEditProfil(null); await load(); toast.success('Profil gespeichert') }
    else toast.error('Fehler beim Speichern')
    setSaving(false)
  }

  const handleKanalChange = async (id: string, kanal: string) => {
    setListe(prev => prev.map(m => m.id === id ? { ...m, benachrichtigungKanal: kanal } : m))
    const res = await fetch(`/api/dashboard/mitarbeiter/${id}`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ benachrichtigungKanal: kanal }),
    })
    if (res.ok) { toast.success('Benachrichtigungskanal gespeichert') }
    else { await load(); toast.error('Fehler beim Speichern') }
  }

  return (
    <>
    <Card title="Team / Mitarbeiter" badge={`${liste.length}/5`}>
      <p className="text-xs text-[#64748B] mb-4">
        Jeder Mitarbeiter erhält eigene Login-Daten (E-Mail + Passwort). Max. 5 Personen.
      </p>

      {liste.length > 0 && (
        <div className="space-y-2 mb-5">
          {liste.map(m => (
            <div key={m.id} className={`rounded-xl border px-4 py-3 ${m.aktiv ? 'border-[#E2EDF7] bg-[#F8FAFC]' : 'border-[#E2EDF7] bg-white opacity-60'}`}>
              <div className="flex items-center gap-3">
                <div
                  className="w-9 h-9 rounded-full flex items-center justify-center text-white text-xs font-bold shrink-0"
                  style={{ backgroundColor: m.farbe }}
                >
                  {m.kuerzel ?? (m.vorname[0] + m.nachname[0]).toUpperCase()}
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 flex-wrap">
                    <p className="text-sm font-semibold text-[#0F172A]">{m.vorname} {m.nachname}</p>
                    {m.istDefault && <span className="px-1.5 py-0.5 bg-[#E8F4FD] text-[#0369A1] text-[10px] font-bold rounded-full">Standard</span>}
                    {!m.aktiv && <span className="px-1.5 py-0.5 bg-[#F1F5F9] text-[#94A3B8] text-[10px] font-bold rounded-full">Inaktiv</span>}
                  </div>
                  <p className="text-xs text-[#64748B] truncate">{m.email}</p>
                </div>
                <div className="flex items-center gap-1 shrink-0 flex-wrap justify-end">
                  {ichBinDefault && !m.istDefault && m.aktiv && (
                    <button onClick={() => void handleDefault(m.id)} className="text-xs text-[#64748B] hover:text-[#0369A1] px-2 py-1 rounded-lg hover:bg-[#EFF6FF] transition-colors">
                      Standard
                    </button>
                  )}
                  {(ichBinDefault || m.id === ichId) && (
                    <button onClick={() => { setEditProfil({ id: m.id, vorname: m.vorname, nachname: m.nachname, kuerzel: m.kuerzel ?? '', telefon: m.telefon ?? '', farbe: m.farbe }); setEditPw(null); setEditEmail(null) }} className="text-xs text-[#64748B] hover:text-[#0369A1] px-2 py-1 rounded-lg hover:bg-[#EFF6FF] transition-colors">
                      Bearbeiten
                    </button>
                  )}
                  {(ichBinDefault || m.id === ichId) && (
                    <button onClick={() => { setEditEmail({ id: m.id, email: m.email }); setEditPw(null); setEditProfil(null) }} className="text-xs text-[#64748B] hover:text-[#0369A1] px-2 py-1 rounded-lg hover:bg-[#EFF6FF] transition-colors">
                      E-Mail
                    </button>
                  )}
                  {(ichBinDefault || m.id === ichId) && (
                    <button onClick={() => { setEditPw({ id: m.id, pw: '' }); setEditEmail(null); setEditProfil(null) }} className="text-xs text-[#64748B] hover:text-[#0369A1] px-2 py-1 rounded-lg hover:bg-[#EFF6FF] transition-colors">
                      Passwort
                    </button>
                  )}
                  {ichBinDefault && !m.istDefault && (
                    <button onClick={() => void (m.aktiv ? handleDelete(m.id) : handleToggleAktiv(m.id, m.aktiv))} className="text-xs text-[#64748B] hover:text-[#D97706] px-2 py-1 rounded-lg hover:bg-[#FFF7ED] transition-colors">
                      {m.aktiv ? 'Deaktivieren' : 'Aktivieren'}
                    </button>
                  )}
                  {ichBinDefault && !m.istDefault && !m.aktiv && (
                    <button onClick={() => {
                      if (confirm(`${m.vorname} ${m.nachname} endgültig löschen? Dies kann nicht rückgängig gemacht werden.`)) {
                        void fetch(`/api/dashboard/mitarbeiter/${m.id}?permanent=true`, { method: 'DELETE' })
                          .then(r => { if (r.ok) { void load(); toast.success('Mitarbeiter gelöscht') } else toast.error('Fehler beim Löschen') })
                      }
                    }} className="text-xs text-[#DC2626] px-2 py-1 rounded-lg hover:bg-[#FEF2F2] transition-colors">
                      Löschen
                    </button>
                  )}
                </div>
              </div>
              {/* Info-Hinweis Termin-Mails */}
              <p className="mt-2 text-[11px] text-[#94A3B8] leading-relaxed">
                💡 Name, Telefon und WhatsApp werden dem Kunden in Termin-Mails als Ansprechpartner angezeigt.
              </p>
              {/* Benachrichtigungs-Kanal */}
              <div className="mt-3 pt-3 border-t border-[#E2EDF7] flex items-center justify-between gap-3 flex-wrap">
                <span className="text-xs text-[#64748B] font-medium">Benachrichtigungen via</span>
                <select
                  value={m.benachrichtigungKanal ?? 'beide'}
                  onChange={e => void handleKanalChange(m.id, e.target.value)}
                  className="text-xs px-2 py-1.5 border border-[#E2EDF7] rounded-lg text-[#0F172A] focus:outline-none focus:ring-1 focus:ring-[#0369A1]"
                >
                  <option value="beide">WhatsApp + E-Mail</option>
                  <option value="whatsapp">Nur WhatsApp</option>
                  <option value="email">Nur E-Mail</option>
                </select>
              </div>
              {/* Passwort-Ändern Inline */}
              {editPw?.id === m.id && (
                <div className="mt-3 pt-3 border-t border-[#E2EDF7] flex gap-2 items-center">
                  <input
                    type="password"
                    placeholder="Neues Passwort (min. 6 Zeichen)"
                    value={editPw.pw}
                    onChange={e => setEditPw(p => p ? { ...p, pw: e.target.value } : null)}
                    className={`${INP} flex-1`}
                  />
                  <button onClick={() => void handlePwChange()} disabled={saving || editPw.pw.length < 6}
                    className="px-3 py-2 bg-[#0369A1] text-white text-xs font-bold rounded-xl disabled:opacity-40">
                    Speichern
                  </button>
                  <button onClick={() => setEditPw(null)} className="px-3 py-2 border border-[#E2EDF7] text-xs rounded-xl text-[#64748B]">
                    ✕
                  </button>
                </div>
              )}
              {/* Profil-Bearbeiten Inline */}
              {editProfil?.id === m.id && (
                <div className="mt-3 pt-3 border-t border-[#E2EDF7] space-y-3">
                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <label className="block text-xs font-semibold text-[#64748B] mb-1 uppercase tracking-wide">Vorname *</label>
                      <input value={editProfil.vorname} onChange={e => setEditProfil(p => p ? { ...p, vorname: e.target.value } : null)} className={INP} />
                    </div>
                    <div>
                      <label className="block text-xs font-semibold text-[#64748B] mb-1 uppercase tracking-wide">Nachname *</label>
                      <input value={editProfil.nachname} onChange={e => setEditProfil(p => p ? { ...p, nachname: e.target.value } : null)} className={INP} />
                    </div>
                  </div>
                  <div className="grid grid-cols-2 gap-3 items-end">
                    <div>
                      <label className="block text-xs font-semibold text-[#64748B] mb-1 uppercase tracking-wide">Telefon</label>
                      <input value={editProfil.telefon} onChange={e => setEditProfil(p => p ? { ...p, telefon: e.target.value } : null)} className={INP} />
                    </div>
                    <div>
                      <label className="block text-xs font-semibold text-[#64748B] mb-1 uppercase tracking-wide">Kürzel (2–3 Buchst.)</label>
                      <input value={editProfil.kuerzel} onChange={e => setEditProfil(p => p ? { ...p, kuerzel: e.target.value.toUpperCase() } : null)} maxLength={3} className={INP} />
                    </div>
                  </div>
                  <div>
                    <label className="block text-xs font-semibold text-[#64748B] mb-1 uppercase tracking-wide">Farbe</label>
                    <div className="flex gap-2 flex-wrap">
                      {FARBEN.map(f => (
                        <button key={f} onClick={() => setEditProfil(p => p ? { ...p, farbe: f } : null)}
                          className={`w-7 h-7 rounded-full border-2 transition-transform ${editProfil.farbe === f ? 'border-[#0F172A] scale-110' : 'border-transparent hover:scale-105'}`}
                          style={{ backgroundColor: f }} />
                      ))}
                    </div>
                  </div>
                  <div className="flex gap-2 pt-1">
                    <button onClick={() => void handleProfilChange()} disabled={saving || !editProfil.vorname.trim() || !editProfil.nachname.trim()}
                      className="flex-1 px-4 py-2 bg-[#0369A1] text-white text-sm font-semibold rounded-xl hover:bg-[#0284c7] disabled:bg-[#94A3B8] transition-colors">
                      {saving ? 'Speichern…' : 'Speichern'}
                    </button>
                    <button onClick={() => setEditProfil(null)} className="px-4 py-2 border border-[#E2EDF7] text-sm font-semibold rounded-xl text-[#64748B] hover:border-[#0369A1] transition-colors">
                      Abbrechen
                    </button>
                  </div>
                </div>
              )}
              {/* E-Mail-Ändern Inline */}
              {editEmail?.id === m.id && (
                <div className="mt-3 pt-3 border-t border-[#E2EDF7] flex gap-2 items-center">
                  <input
                    type="email"
                    placeholder="Neue E-Mail-Adresse"
                    value={editEmail.email}
                    onChange={e => setEditEmail(p => p ? { ...p, email: e.target.value } : null)}
                    className={`${INP} flex-1`}
                  />
                  <button onClick={() => void handleEmailChange()} disabled={saving || !editEmail.email.includes('@')}
                    className="px-3 py-2 bg-[#0369A1] text-white text-xs font-bold rounded-xl disabled:opacity-40">
                    Speichern
                  </button>
                  <button onClick={() => setEditEmail(null)} className="px-3 py-2 border border-[#E2EDF7] text-xs rounded-xl text-[#64748B]">
                    ✕
                  </button>
                </div>
              )}
            </div>
          ))}
        </div>
      )}

      {liste.length < 5 && !adding && (
        <button onClick={() => setAdding(true)}
          className="w-full py-2.5 border border-dashed border-[#CBD5E1] rounded-xl text-sm text-[#64748B] hover:border-[#0369A1] hover:text-[#0369A1] transition-colors font-medium">
          + Mitarbeiter hinzufügen
        </button>
      )}

      {adding && (
        <div className="border border-[#E2EDF7] rounded-xl p-4 space-y-3">
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-semibold text-[#64748B] mb-1 uppercase tracking-wide">Vorname *</label>
              <input value={neu.vorname} onChange={e => setNeu(p => ({ ...p, vorname: e.target.value }))} className={INP} />
            </div>
            <div>
              <label className="block text-xs font-semibold text-[#64748B] mb-1 uppercase tracking-wide">Nachname *</label>
              <input value={neu.nachname} onChange={e => setNeu(p => ({ ...p, nachname: e.target.value }))} className={INP} />
            </div>
          </div>
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-semibold text-[#64748B] mb-1 uppercase tracking-wide">E-Mail (Login) *</label>
              <input type="email" value={neu.email} onChange={e => setNeu(p => ({ ...p, email: e.target.value }))} className={INP} />
            </div>
            <div>
              <label className="block text-xs font-semibold text-[#64748B] mb-1 uppercase tracking-wide">Passwort *</label>
              <input type="password" value={neu.passwort} onChange={e => setNeu(p => ({ ...p, passwort: e.target.value }))} placeholder="min. 6 Zeichen" className={INP} />
            </div>
          </div>
          <div className="grid grid-cols-2 gap-3 items-end">
            <div>
              <label className="block text-xs font-semibold text-[#64748B] mb-1 uppercase tracking-wide">Telefon</label>
              <input value={neu.telefon} onChange={e => setNeu(p => ({ ...p, telefon: e.target.value }))} className={INP} />
            </div>
            <div>
              <label className="block text-xs font-semibold text-[#64748B] mb-1 uppercase tracking-wide">Kürzel (2–3 Buchst.)</label>
              <input value={neu.kuerzel} onChange={e => setNeu(p => ({ ...p, kuerzel: e.target.value }))} maxLength={3} className={INP} />
            </div>
          </div>
          <div>
            <label className="block text-xs font-semibold text-[#64748B] mb-1 uppercase tracking-wide">Farbe</label>
            <div className="flex gap-2 flex-wrap">
              {FARBEN.map(f => (
                <button key={f} onClick={() => setNeu(p => ({ ...p, farbe: f }))}
                  className={`w-7 h-7 rounded-full border-2 transition-transform ${neu.farbe === f ? 'border-[#0F172A] scale-110' : 'border-transparent hover:scale-105'}`}
                  style={{ backgroundColor: f }} />
              ))}
            </div>
          </div>
          <div className="flex gap-2 pt-1">
            <button onClick={() => void handleAdd()}
              disabled={saving || !neu.vorname.trim() || !neu.nachname.trim() || !neu.email.trim() || neu.passwort.length < 6}
              className="flex-1 px-4 py-2 bg-[#0369A1] text-white text-sm font-semibold rounded-xl hover:bg-[#0284c7] disabled:bg-[#94A3B8] transition-colors">
              {saving ? 'Speichern…' : 'Anlegen'}
            </button>
            <button onClick={() => setAdding(false)}
              className="px-4 py-2 border border-[#E2EDF7] text-sm font-semibold rounded-xl text-[#64748B] hover:border-[#0369A1] transition-colors">
              Abbrechen
            </button>
          </div>
        </div>
      )}

      {liste.length === 0 && !adding && (
        <p className="text-xs text-[#94A3B8] text-center py-4">Noch keine Mitarbeiter angelegt.</p>
      )}
    </Card>

    <DefaultBearbeiterCard liste={liste} />

    {/* Transfer-Modal */}
    {transferModal && (
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50">
        <div className="bg-white rounded-2xl w-full max-w-md shadow-2xl p-6">
          <div className="w-12 h-12 bg-[#FEF9C3] rounded-full flex items-center justify-center mx-auto mb-4">
            <span className="text-2xl">⚠️</span>
          </div>
          <h3 className="text-base font-black text-[#0F172A] text-center mb-1">
            Mitarbeiter deaktivieren
          </h3>
          <p className="text-sm text-[#64748B] text-center mb-5">
            <strong>{transferModal.name}</strong> hat noch{' '}
            <strong>{transferModal.offeneAnfragen} offene Anfrage{transferModal.offeneAnfragen > 1 ? 'n' : ''}</strong>.
            Bitte einen Nachfolger auswählen – alle Anfragen werden übertragen.
            Der Verlauf (Notizen, Aktivitäten) bleibt vollständig erhalten.
          </p>
          <label className="block text-xs font-semibold text-[#64748B] mb-1.5 uppercase tracking-wide">
            Anfragen übertragen an
          </label>
          <select
            value={transferZiel}
            onChange={e => setTransferZiel(e.target.value)}
            className="w-full px-3 py-2.5 border border-[#E2EDF7] rounded-xl text-sm text-[#0F172A] focus:outline-none focus:ring-2 focus:ring-[#0369A1] mb-5"
          >
            <option value="">— Mitarbeiter auswählen —</option>
            {liste.filter(m => m.aktiv && m.id !== transferModal.id).map(m => (
              <option key={m.id} value={m.id}>{m.vorname} {m.nachname}</option>
            ))}
          </select>
          <div className="flex gap-3">
            <button
              onClick={() => setTransferModal(null)}
              className="flex-1 px-4 py-2.5 border border-[#E2EDF7] rounded-xl text-sm font-semibold text-[#64748B] hover:border-[#0369A1] transition-colors"
            >
              Abbrechen
            </button>
            <button
              onClick={() => void handleTransferUndLoeschen()}
              disabled={!transferZiel}
              className="flex-1 px-4 py-2.5 bg-[#DC2626] hover:bg-[#b91c1c] disabled:bg-[#94A3B8] text-white text-sm font-bold rounded-xl transition-colors"
            >
              Übertragen & Deaktivieren
            </button>
          </div>
        </div>
      </div>
    )}
    </>
  )
}

function WaTab() {
  const [mitarbeiter, setMitarbeiter] = useState<MitarbeiterTyp[]>([])
  const [saving, setSaving] = useState<string | null>(null)
  const [testing, setTesting] = useState<string | null>(null)
  const [waData, setWaData] = useState<Record<string, { whatsapp: string; waApiKey: string }>>({})

  useEffect(() => {
    void fetch('/api/dashboard/mitarbeiter').then(r => r.json()).then((liste: MitarbeiterTyp[]) => {
      setMitarbeiter(liste)
      const init: Record<string, { whatsapp: string; waApiKey: string }> = {}
      liste.forEach(m => { init[m.id] = { whatsapp: m.whatsapp ?? '', waApiKey: m.waApiKey ?? '' } })
      setWaData(init)
    })
  }, [])

  const aktiveMitarbeiter = mitarbeiter.filter(m => m.aktiv)

  const handleSave = async (id: string) => {
    setSaving(id)
    const d = waData[id]
    await fetch(`/api/dashboard/mitarbeiter/${id}`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ whatsapp: d?.whatsapp || null, waApiKey: d?.waApiKey || null }),
    })
    setSaving(null)
    toast.success('Gespeichert')
  }

  const handleTest = async (id: string) => {
    const d = waData[id]
    if (!d?.whatsapp || !d?.waApiKey) {
      toast.error('Bitte zuerst Nummer und API-Key eintragen und speichern.')
      return
    }
    setTesting(id)
    try {
      const res = await fetch('/api/dashboard/test-whatsapp', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ nummer: d.whatsapp, apiKey: d.waApiKey }),
      })
      const data = await res.json() as { ok: boolean; error?: string }
      if (data.ok) {
        toast.success('Test-Nachricht gesendet! Bitte WhatsApp prüfen.')
      } else {
        toast.error(`Fehler: ${data.error ?? 'Unbekannt'}`)
      }
    } catch {
      toast.error('Verbindungsfehler')
    }
    setTesting(null)
  }

  return (
    <>
      <div className="bg-[#F0F9FF] border border-[#BAE6FD] rounded-xl p-5 text-sm">
        <p className="font-bold text-[#0369A1] mb-3 text-base">Einrichtung CallMeBot (kostenlos)</p>
        <ol className="space-y-3 text-[#0F172A]">
          <li className="flex gap-3">
            <span className="flex-shrink-0 w-6 h-6 bg-[#0369A1] text-white rounded-full flex items-center justify-center text-xs font-bold">1</span>
            <span>Nummer <strong className="font-mono text-[#0369A1]">+34 644 26 33 77</strong> als Kontakt speichern.</span>
          </li>
          <li className="flex gap-3">
            <span className="flex-shrink-0 w-6 h-6 bg-[#0369A1] text-white rounded-full flex items-center justify-center text-xs font-bold">2</span>
            <span>Von der eigenen WhatsApp-Nummer an diesen Kontakt schreiben:<br />
              <code className="inline-block mt-1 bg-white border border-[#BAE6FD] px-2 py-1 rounded-lg font-mono text-xs">I allow callmebot to send me messages</code>
            </span>
          </li>
          <li className="flex gap-3">
            <span className="flex-shrink-0 w-6 h-6 bg-[#0369A1] text-white rounded-full flex items-center justify-center text-xs font-bold">3</span>
            <span>API-Key aus der Antwort hier eintragen.</span>
          </li>
        </ol>
      </div>

      {aktiveMitarbeiter.length === 0 ? (
        <div className="bg-[#F8FAFC] border border-[#E2EDF7] rounded-xl p-5 text-center text-sm text-[#94A3B8]">
          Noch keine aktiven Mitarbeiter. Lege sie zuerst im <strong>Team</strong>-Tab an.
        </div>
      ) : (
        <div className="space-y-4">
          {aktiveMitarbeiter.map(m => (
            <Card key={m.id} title={`${m.vorname} ${m.nachname}`}>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-4">
                <div>
                  <label className="block text-xs font-semibold text-[#64748B] mb-1.5 uppercase tracking-wide">
                    WA-Nummer (ohne + und Leerzeichen)
                  </label>
                  <input
                    className={INP} placeholder="4917664179764" value={waData[m.id]?.whatsapp ?? ''}
                    onChange={e => setWaData(p => ({ ...p, [m.id]: { ...p[m.id], whatsapp: e.target.value } }))}
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-[#64748B] mb-1.5 uppercase tracking-wide">
                    API-Key (CallMeBot)
                  </label>
                  <input
                    className={INP} placeholder="123456" value={waData[m.id]?.waApiKey ?? ''}
                    onChange={e => setWaData(p => ({ ...p, [m.id]: { ...p[m.id], waApiKey: e.target.value } }))}
                  />
                </div>
              </div>
              <div className="flex gap-3 flex-wrap">
                <button
                  onClick={() => void handleSave(m.id)}
                  disabled={saving === m.id}
                  className="px-4 py-2 bg-[#0369A1] text-white text-sm font-semibold rounded-xl hover:bg-[#0284c7] disabled:opacity-50 transition-colors"
                >
                  {saving === m.id ? 'Speichern…' : 'Speichern'}
                </button>
                <button
                  onClick={() => void handleTest(m.id)}
                  disabled={testing === m.id || !waData[m.id]?.whatsapp || !waData[m.id]?.waApiKey}
                  className="px-4 py-2 bg-[#16A34A] text-white text-sm font-semibold rounded-xl hover:bg-[#15803d] disabled:opacity-50 transition-colors"
                >
                  {testing === m.id ? 'Sende…' : '✓ Test senden'}
                </button>
              </div>
            </Card>
          ))}
        </div>
      )}

      <div className="bg-[#F0FDF4] border border-[#86EFAC] rounded-xl p-4 text-sm text-[#166534]">
        <p className="font-bold mb-2">Wann werden WA-Nachrichten gesendet?</p>
        <ul className="space-y-1 text-xs list-disc list-inside">
          <li>Neue Anfrage → an alle aktiven Mitarbeiter mit WA-Nummer</li>
          <li>Termin vereinbart / verschoben / abgesagt → nur an den zugewiesenen Bearbeiter</li>
          <li>Status-Änderungen (wichtige) → nur an den zugewiesenen Bearbeiter</li>
          <li>Bearbeiter-Zuweisung → Benachrichtigung an den neu zugewiesenen Mitarbeiter</li>
        </ul>
      </div>
    </>
  )
}

export default function EinstellungenPage() {
  const [settings, setSettings] = useState<Settings>(defaultSettings)
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [cronLaueft, setCronLaueft] = useState(false)
  const [cronResult, setCronResult] = useState<string | null>(null)
  const [testMailSending, setTestMailSending] = useState(false)
  const [testMailAdressen, setTestMailAdressen] = useState('')
  const [testMailStatus, setTestMailStatus] = useState<{ ok: boolean; msg: string } | null>(null)
  const [activeTab, setActiveTab] = useState<'basis' | 'team' | 'whatsapp' | 'email' | 'auto' | 'tools' | 'datenschutz'>('basis')
  const [previewTyp, setPreviewTyp] = useState<'kunde' | 'angebot' | 'intern' | 'followup' | 'termin' | 'termin_verschoben' | 'termin_abgesagt' | 'haendler' | 'ablehnung' | 'rueckfrage' | 'freinachricht'>('kunde')
  const [previewHtml, setPreviewHtml] = useState<string | null>(null)
  const [previewBetreff, setPreviewBetreff] = useState('')
  const [previewLoading, setPreviewLoading] = useState(false)
  const [cleanupLaueft, setCleanupLaueft] = useState(false)
  const [cleanupResult, setCleanupResult] = useState<string | null>(null)

  // Datenschutz-Tab State
  type CleanupPreview = { dryRun: boolean; leadsZuLoeschen: number; kaeufeZuAnonymisieren: number }
  type CleanupResult = { leadsGeloescht: number; kaeufeAnonymisiert: number; durchgefuehrtAm: string }
  const [dsPreview, setDsPreview] = useState<CleanupPreview | null>(null)
  const [dsResult, setDsResult] = useState<CleanupResult | null>(null)
  const [dsLaueft, setDsLaueft] = useState(false)
  const [dsBestaetigung, setDsBestaetigung] = useState(false)

  const ladeDsVorschau = async () => {
    setDsLaueft(true)
    setDsPreview(null)
    setDsResult(null)
    setDsBestaetigung(false)
    try {
      const res = await fetch('/api/dashboard/cleanup?dry=true', { method: 'POST' })
      if (res.ok) setDsPreview(await res.json() as CleanupPreview)
      else toast.error('Vorschau fehlgeschlagen')
    } finally { setDsLaueft(false) }
  }

  const fuehreDsDurchAus = async () => {
    setDsLaueft(true)
    setDsResult(null)
    try {
      const res = await fetch('/api/dashboard/cleanup', { method: 'POST' })
      if (res.ok) {
        setDsResult(await res.json() as CleanupResult)
        setDsPreview(null)
        setDsBestaetigung(false)
        toast.success('Bereinigung abgeschlossen')
      } else toast.error('Bereinigung fehlgeschlagen')
    } finally { setDsLaueft(false) }
  }

  useEffect(() => {
    async function load() {
      try {
        const res = await fetch('/api/dashboard/einstellungen')
        if (res.ok) {
          const data = await res.json() as Partial<Settings>
          setSettings(prev => ({ ...prev, ...data }))
        }
      } finally {
        setLoading(false)
      }
    }
    void load()
  }, [])

  const handleSave = async () => {
    setSaving(true)
    try {
      const res = await fetch('/api/dashboard/einstellungen', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(settings),
      })
      if (res.ok) toast.success('Einstellungen gespeichert')
      else toast.error('Fehler beim Speichern')
    } catch {
      toast.error('Verbindungsfehler')
    }
    setSaving(false)
  }

  const handleTestMail = async () => {
    setTestMailSending(true)
    setTestMailStatus(null)
    try {
      const res = await fetch('/api/dashboard/test-email', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ adressen: testMailAdressen, typ: previewTyp }),
      })
      const data = await res.json() as { sentTo?: string[]; error?: string; detail?: string }
      if (res.ok) {
        setTestMailStatus({ ok: true, msg: `Gesendet an: ${data.sentTo?.join(', ')}` })
      } else {
        setTestMailStatus({ ok: false, msg: data.error || 'Fehler beim Senden' })
      }
    } catch {
      setTestMailStatus({ ok: false, msg: 'Verbindungsfehler — Server nicht erreichbar' })
    }
    setTestMailSending(false)
  }

  const handleCleanup = async () => {
    setCleanupLaueft(true)
    setCleanupResult(null)
    try {
      const res = await fetch('/api/dashboard/anfragen/cleanup', { method: 'POST' })
      const data = await res.json() as { ok?: boolean; geloescht?: number; info?: string; error?: string }
      if (res.ok) {
        setCleanupResult(data.info ?? `✓ ${data.geloescht} Anfrage(n) endgültig gelöscht`)
        toast.success('Bereinigung abgeschlossen')
      } else {
        setCleanupResult(`Fehler: ${data.error ?? 'Unbekannt'}`)
        toast.error('Fehler bei der Bereinigung')
      }
    } catch {
      toast.error('Verbindungsfehler')
    }
    setCleanupLaueft(false)
  }

  const handleCronJetzt = async () => {
    setCronLaueft(true)
    setCronResult(null)
    try {
      const res = await fetch('/api/cron/followup', { method: 'POST' })
      const data = await res.json() as { followupGesendet?: number; archiviert?: number; error?: string }
      if (res.ok) {
        setCronResult(`✓ ${data.followupGesendet} Follow-up Mail(s) gesendet · ${data.archiviert} archiviert`)
        toast.success('Automatisierung ausgeführt')
      } else {
        setCronResult(`Fehler: ${data.error ?? 'Unbekannt'}`)
        toast.error('Fehler beim Ausführen')
      }
    } catch {
      toast.error('Verbindungsfehler')
    }
    setCronLaueft(false)
  }

  const set = (key: keyof Settings) => (value: string) => setSettings(prev => ({ ...prev, [key]: value }))

  const handlePreview = async (typ: 'kunde' | 'angebot' | 'intern' | 'followup' | 'termin' | 'termin_verschoben' | 'termin_abgesagt' | 'haendler' | 'ablehnung' | 'rueckfrage' | 'freinachricht') => {
    setPreviewTyp(typ)
    setPreviewLoading(true)
    setPreviewHtml(null)
    try {
      const res = await fetch('/api/dashboard/preview-email', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          typ,
          customBetreff: typ === 'kunde' ? settings.email_kunde_betreff || undefined
                       : typ === 'followup' ? settings.email_followup_betreff || undefined
                       : undefined,
          customInhalt: typ === 'kunde' ? settings.email_kunde_inhalt || undefined
                      : typ === 'followup' ? settings.email_followup_inhalt || undefined
                      : undefined,
        }),
      })
      const data = await res.json() as { subject?: string; html?: string; error?: string }
      if (res.ok && data.html) {
        setPreviewHtml(data.html)
        setPreviewBetreff(data.subject ?? '')
      } else {
        toast.error(data.error || 'Vorschau fehlgeschlagen')
      }
    } catch {
      toast.error('Verbindungsfehler')
    }
    setPreviewLoading(false)
  }

  const TABS = [
    { id: 'basis' as const, label: 'Basisdaten' },
    { id: 'team' as const, label: 'Team' },
    { id: 'whatsapp' as const, label: 'WhatsApp' },
    { id: 'email' as const, label: 'E-Mail Vorlagen' },
    { id: 'auto' as const, label: 'Automatisierung' },
    { id: 'tools' as const, label: 'Tracking & Tools' },
    { id: 'datenschutz' as const, label: 'Datenschutz & Löschung' },
  ]

  if (loading) return <div className="p-8 text-center text-[#94A3B8]">Lädt...</div>

  return (
    <div className="p-6 md:p-8">
      <div className="mb-6">
        <h1 className="text-2xl font-black text-[#0F172A]">Einstellungen</h1>
        <p className="text-[#64748B] text-sm mt-0.5">Werden im Footer, Impressum und überall auf der Website verwendet.</p>
      </div>

      {/* Tabs */}
      <div className="flex gap-1 bg-[#F8FAFC] border border-[#E2EDF7] rounded-xl p-1 mb-6 overflow-x-auto">
        {TABS.map(tab => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            className={`px-4 py-2 rounded-lg text-sm font-semibold whitespace-nowrap transition-all ${
              activeTab === tab.id
                ? 'bg-white text-[#0369A1] shadow-sm border border-[#E2EDF7]'
                : 'text-[#64748B] hover:text-[#0F172A]'
            }`}
          >
            {tab.label}
          </button>
        ))}
      </div>

      <div className="max-w-2xl space-y-6">

        {/* ── BASISDATEN ── */}
        {activeTab === 'basis' && <>
          <Card title="Unternehmen">
            <div className="space-y-4">
              <Field label="Firmenname" value={settings.firmenname} onChange={set('firmenname')} placeholder="autoankauf baden" hint="Wird in Kleinschreibung überall verwendet" />
              <Field label="Inhaber / Geschäftsführer" value={settings.inhaber} onChange={set('inhaber')} placeholder="Muhammet Demir" />
            </div>
          </Card>
          <Card title="Adresse">
            <div className="space-y-4">
              <Field label="Straße & Hausnummer" value={settings.strasse} onChange={set('strasse')} placeholder="Heidelberger Str. 4" />
              <div className="grid grid-cols-2 gap-4">
                <Field label="PLZ" value={settings.plz_firma} onChange={set('plz_firma')} placeholder="76676" />
                <Field label="Ort" value={settings.ort} onChange={set('ort')} placeholder="Graben-Neudorf" />
              </div>
            </div>
          </Card>
          <Card title="Kontakt">
            <div className="space-y-4">
              <Field label="Telefon" value={settings.telefon} onChange={set('telefon')} placeholder="+49 176 64179764" type="tel" />
              <Field label="WhatsApp (Ziffern ohne +)" value={settings.whatsapp} onChange={set('whatsapp')} placeholder="4917664179764" hint="Nur für den WhatsApp-Button auf der Website" />
              <Field label="E-Mail" value={settings.email} onChange={set('email')} placeholder="anfrage@autoankauf-baden.de" type="email" />
            </div>
          </Card>
          <Card title="Social Media" badge="Nur anzeigen wenn eingetragen">
            <p className="text-xs text-[#94A3B8] mb-4">Vollständige URL eintragen (z.B. https://www.instagram.com/deinprofil). Icons erscheinen im Footer nur wenn ausgefüllt.</p>
            <div className="space-y-4">
              <Field label="Facebook" value={settings.social_facebook} onChange={set('social_facebook')} placeholder="https://www.facebook.com/..." />
              <Field label="Instagram" value={settings.social_instagram} onChange={set('social_instagram')} placeholder="https://www.instagram.com/..." />
              <Field label="X (Twitter)" value={settings.social_x} onChange={set('social_x')} placeholder="https://x.com/..." />
              <Field label="YouTube" value={settings.social_youtube} onChange={set('social_youtube')} placeholder="https://www.youtube.com/..." />
              <Field label="Xing" value={settings.social_xing} onChange={set('social_xing')} placeholder="https://www.xing.com/profile/..." />
              <Field label="LinkedIn" value={settings.social_linkedin} onChange={set('social_linkedin')} placeholder="https://www.linkedin.com/in/..." />
            </div>
          </Card>
          {/* Vorschau */}
          <div className="bg-[#F0F7FF] border border-[#BAE0F9] rounded-xl p-4">
            <p className="text-xs font-semibold text-[#0369A1] mb-2">Vorschau Adressblock</p>
            <p className="text-sm text-[#0F172A] font-medium">{settings.firmenname}</p>
            <p className="text-sm text-[#64748B]">{settings.inhaber}</p>
            <p className="text-sm text-[#64748B]">{settings.strasse}</p>
            <p className="text-sm text-[#64748B]">{settings.plz_firma} {settings.ort}</p>
            <p className="text-sm text-[#64748B] mt-1">{settings.telefon} · {settings.email}</p>
          </div>
        </>}

        {/* ── TEAM ── */}
        {activeTab === 'team' && <MitarbeiterVerwaltung />}

        {/* ── WHATSAPP ── */}
        {activeTab === 'whatsapp' && <WaTab />}

        {/* ── E-MAIL VORLAGEN ── */}
        {activeTab === 'email' && <>
          {/* Vorschau */}
          <Card title="E-Mail Vorschau" badge="Live">
            <p className="text-xs text-[#64748B] mb-4">Zeigt die E-Mail direkt hier an — mit deinen aktuellen Texten (noch nicht gespeicherte Änderungen werden berücksichtigt).</p>
            <div className="flex flex-wrap gap-2 mb-4">
              {([
                { typ: 'kunde' as const, label: '📩 Eingang' },
                { typ: 'angebot' as const, label: '💰 Angebot' },
                { typ: 'intern' as const, label: '🔔 Intern' },
                { typ: 'termin' as const, label: '📅 Termin' },
                { typ: 'termin_verschoben' as const, label: '🔄 Verschoben' },
                { typ: 'termin_abgesagt' as const, label: '❌ Abgesagt' },
                { typ: 'followup' as const, label: '🔁 Follow-up' },
                { typ: 'haendler' as const, label: '🤝 Händler' },
                { typ: 'ablehnung' as const, label: '✗ Ablehnung' },
                { typ: 'rueckfrage' as const, label: '? Rückfrage' },
                { typ: 'freinachricht' as const, label: '✉ Freie Nachricht' },
              ]).map(({ typ, label }) => (
                <button
                  key={typ}
                  onClick={() => void handlePreview(typ)}
                  disabled={previewLoading}
                  className={`px-4 py-2 rounded-xl text-sm font-semibold transition-all border ${
                    previewTyp === typ && previewHtml
                      ? 'bg-[#0369A1] text-white border-[#0369A1]'
                      : 'bg-white text-[#0F172A] border-[#E2EDF7] hover:border-[#0369A1] hover:text-[#0369A1]'
                  } disabled:opacity-50`}
                >
                  {previewLoading && previewTyp === typ ? 'Lädt...' : label}
                </button>
              ))}
            </div>
            {previewHtml && (
              <div className="border border-[#E2EDF7] rounded-xl overflow-hidden">
                <div className="bg-[#F8FAFC] border-b border-[#E2EDF7] px-4 py-2.5 flex items-center gap-2">
                  <span className="text-xs text-[#64748B] font-medium">Betreff:</span>
                  <span className="text-xs text-[#0F172A] font-semibold truncate">{previewBetreff}</span>
                </div>
                <iframe
                  srcDoc={previewHtml}
                  className="w-full border-0"
                  style={{ height: '520px' }}
                  title="E-Mail Vorschau"
                  sandbox="allow-same-origin"
                />
              </div>
            )}
            {!previewHtml && !previewLoading && (
              <div className="border-2 border-dashed border-[#E2EDF7] rounded-xl h-32 flex items-center justify-center text-[#94A3B8] text-sm">
                Wähle eine Vorlage zum Anzeigen
              </div>
            )}
          </Card>

          {/* Test senden */}
          <div className="bg-[#F0F7FF] border border-[#BAE0F9] rounded-xl p-4 space-y-3">
            <div>
              <p className="text-sm font-bold text-[#0F172A]">Als Test-Mail senden</p>
              <p className="text-xs text-[#64748B] mt-0.5">
                Sendet die <strong>oben ausgewählte Vorlage</strong> als Test.
                {previewHtml
                  ? <> Aktuell: <span className="text-[#0369A1] font-semibold">{previewTyp}</span></>
                  : <span className="text-[#DC2626]"> Bitte zuerst oben eine Vorlage auswählen.</span>
                }
              </p>
            </div>
            <div className="flex gap-2">
              <input
                type="text"
                value={testMailAdressen}
                onChange={e => { setTestMailAdressen(e.target.value); setTestMailStatus(null) }}
                placeholder="Leer lassen = Firma-E-Mail wird verwendet"
                className="flex-1 px-3 py-2.5 border border-[#E2EDF7] rounded-xl text-sm text-[#0F172A] placeholder:text-[#94A3B8] focus:outline-none focus:ring-2 focus:ring-[#0369A1] focus:border-transparent"
              />
              <button
                onClick={handleTestMail}
                disabled={testMailSending || !previewHtml}
                title={!previewHtml ? 'Bitte zuerst eine Vorlage auswählen' : undefined}
                className="flex-shrink-0 px-5 py-2.5 bg-[#0369A1] text-white text-sm font-bold rounded-xl hover:bg-[#0284c7] transition-colors disabled:bg-[#94A3B8] disabled:cursor-not-allowed whitespace-nowrap"
              >
                {testMailSending ? (
                  <span className="flex items-center gap-2">
                    <svg className="animate-spin w-4 h-4" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"/>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8z"/>
                    </svg>
                    Sendet…
                  </span>
                ) : '📧 Test senden'}
              </button>
            </div>
            {testMailStatus && (
              <div className={`flex items-start gap-2.5 rounded-xl px-4 py-3 text-sm font-medium ${
                testMailStatus.ok
                  ? 'bg-[#F0FDF4] border border-[#86EFAC] text-[#166534]'
                  : 'bg-[#FEF2F2] border border-[#FECACA] text-[#991B1B]'
              }`}>
                <span className="text-base leading-none mt-0.5">{testMailStatus.ok ? '✓' : '✕'}</span>
                <span>{testMailStatus.msg}</span>
              </div>
            )}
          </div>
          <div className="bg-[#F0F9FF] border border-[#BAE6FD] rounded-xl p-4">
            <p className="text-sm font-medium text-[#0369A1] mb-1">Vorlagen werden im Code gepflegt</p>
            <p className="text-xs text-[#64748B] leading-relaxed">
              Alle 7 E-Mail-Vorlagen (Eingang, Angebot, Termin, Verschoben, Abgesagt, Follow-up, Intern) sind in <code className="bg-white px-1.5 py-0.5 rounded border border-[#BAE6FD] font-mono text-xs">services/emailTemplates.ts</code> definiert. Dort können sie direkt angepasst werden. Die Vorschau oben zeigt immer den aktuellen Stand.
            </p>
          </div>
        </>}

        {/* ── AUTOMATISIERUNG ── */}
        {activeTab === 'auto' && <>
          <Card title="Follow-up & Archivierung">
            <div className="space-y-5">
              <Toggle
                label="Follow-up automatisch senden"
                sub="Sendet eine Zweiterinnerung wenn keine Antwort kam"
                checked={settings.followup_aktiv === 'true'}
                onChange={v => set('followup_aktiv')(v ? 'true' : 'false')}
              />
              <Field
                label="Follow-up nach X Tagen (nach Angebot)"
                value={settings.followup_tage}
                onChange={set('followup_tage')}
                placeholder="5"
                type="number"
                hint="Empfehlung: 5–7 Tage"
              />
              <Field
                label="Ins Archiv nach X Tagen (nach Follow-up ohne Antwort)"
                value={settings.archiv_tage}
                onChange={set('archiv_tage')}
                placeholder="60"
                type="number"
                hint="Empfehlung: 60 Tage"
              />
            </div>
          </Card>

          <Card title="Jetzt manuell ausführen">
            <p className="text-sm text-[#64748B] mb-4">
              Prüft alle Anfragen und sendet fällige Follow-up Mails bzw. archiviert inaktive Anfragen.
              Normalerweise läuft das automatisch — hier kannst du es manuell starten.
            </p>
            <button
              onClick={handleCronJetzt}
              disabled={cronLaueft}
              className="px-6 py-2.5 bg-[#0F172A] text-white text-sm font-bold rounded-xl hover:bg-[#1E293B] transition-colors disabled:bg-[#94A3B8]"
            >
              {cronLaueft ? 'Läuft...' : 'Jetzt ausführen'}
            </button>
            {cronResult && (
              <p className="mt-3 text-sm text-[#0369A1] font-medium">{cronResult}</p>
            )}
          </Card>

          <Card title="Automatisches Löschen">
            <div className="space-y-5">
              <Toggle
                label="Alte Archiv-Einträge automatisch löschen"
                sub="Endgültig löschen — kann nicht rückgängig gemacht werden"
                checked={settings.auto_loeschen_aktiv === 'true'}
                onChange={v => set('auto_loeschen_aktiv')(v ? 'true' : 'false')}
              />
              <Field
                label="Löschen nach X Monaten (ab Archivierung)"
                value={settings.auto_loeschen_monate}
                onChange={set('auto_loeschen_monate')}
                placeholder="24"
                type="number"
                hint="Empfehlung: 24 Monate (DSGVO: spätestens nach 2 Jahren)"
              />
              <div className="pt-2 border-t border-[#E2EDF7]">
                <p className="text-xs text-[#64748B] mb-3">
                  Manuell jetzt alle archivierten Anfragen löschen, die älter als die eingestellte Zeit sind.
                </p>
                <button
                  onClick={handleCleanup}
                  disabled={cleanupLaueft}
                  className="px-5 py-2.5 bg-[#FEF2F2] hover:bg-[#FEE2E2] text-[#991B1B] text-sm font-bold rounded-xl transition-colors disabled:opacity-50 border border-[#FECACA]"
                >
                  {cleanupLaueft ? 'Läuft...' : '🗑 Jetzt bereinigen'}
                </button>
                {cleanupResult && (
                  <p className="mt-3 text-sm text-[#0369A1] font-medium">{cleanupResult}</p>
                )}
              </div>
            </div>
          </Card>
        </>}

        {/* ── TOOLS ── */}
        {activeTab === 'tools' && <>
          <Card title="Tracking">
            <div className="space-y-4">
              <Field label="Google Tag Manager ID" value={settings.gtmId} onChange={set('gtmId')} placeholder="GTM-XXXXXXX" />
            </div>
          </Card>
          <Card title="Features">
            <Toggle
              label='KI-Chat "Max" aktivieren'
              sub="Öffnet automatisch nach 8 Sekunden auf der Homepage"
              checked={settings.chatEnabled === 'true'}
              onChange={v => set('chatEnabled')(v ? 'true' : 'false')}
            />
          </Card>
        </>}

        {/* ── DATENSCHUTZ & LÖSCHUNG ── */}
        {activeTab === 'datenschutz' && (
          <div className="space-y-5">
            <Card title="Löschkonzept (DSGVO + § 147 AO)">
              <div className="space-y-4 text-sm text-[#475569] leading-relaxed">
                <div className="grid grid-cols-1 gap-3">
                  <div className="bg-[#F0F7FF] border border-[#BFDBFE] rounded-xl p-4">
                    <p className="font-semibold text-[#0369A1] mb-1">Phase 1 – Leads (24 Monate)</p>
                    <p>Anfragen <strong>ohne Kaufabschluss</strong> (Neu, Kontaktiert, Angebot, Termin, Abgelehnt) werden nach 24 Monaten vollständig gelöscht inkl. Fotos und Aktivitätslog.</p>
                  </div>
                  <div className="bg-[#F0FDF4] border border-[#86EFAC] rounded-xl p-4">
                    <p className="font-semibold text-[#16A34A] mb-1">Phase 2 – Käufe (10 Jahre)</p>
                    <p>Abgeschlossene Ankäufe werden nach 10 Jahren <strong>anonymisiert</strong>. Kaufrelevante Daten (Preis, Datum, Fahrzeug) bleiben für die steuerliche Aufbewahrungspflicht gemäß § 147 AO erhalten.</p>
                  </div>
                  <div className="bg-[#F8FAFC] border border-[#E2EDF7] rounded-xl p-4">
                    <p className="font-semibold text-[#64748B] mb-1">Newsletter – kein automatisches Löschen</p>
                    <p>Newsletter-Abonnenten werden dauerhaft gesammelt. Abmelde-Funktion wird vor dem ersten Versand eingerichtet.</p>
                  </div>
                </div>

                <button
                  onClick={ladeDsVorschau}
                  disabled={dsLaueft}
                  className="w-full py-3 bg-[#F8FAFC] hover:bg-[#F0F7FF] border border-[#E2EDF7] hover:border-[#BFDBFE] text-[#0369A1] font-semibold rounded-xl transition-colors text-sm disabled:opacity-50"
                >
                  {dsLaueft ? 'Analysiere...' : '🔍 Vorschau – was würde gelöscht?'}
                </button>

                {dsPreview && (
                  <div className="bg-[#F8FAFC] border border-[#E2EDF7] rounded-xl p-5 space-y-3">
                    <p className="font-semibold text-[#0F172A]">Vorschau (noch nichts gelöscht)</p>
                    <div className="space-y-2 text-sm">
                      <div className="flex justify-between"><span className="text-[#64748B]">Leads zu löschen (älter 24 Monate)</span><span className="font-bold text-[#DC2626]">{dsPreview.leadsZuLoeschen}</span></div>
                      <div className="flex justify-between"><span className="text-[#64748B]">Käufe zu anonymisieren (älter 10 Jahre)</span><span className="font-bold text-[#D97706]">{dsPreview.kaeufeZuAnonymisieren}</span></div>
                    </div>
                    {(dsPreview.leadsZuLoeschen + dsPreview.kaeufeZuAnonymisieren) === 0 ? (
                      <p className="text-[#16A34A] font-semibold text-sm">✅ Alles in Ordnung – keine fälligen Löschungen.</p>
                    ) : (
                      <div className="space-y-3 pt-2 border-t border-[#E2EDF7]">
                        <label className="flex items-start gap-3 cursor-pointer">
                          <input type="checkbox" checked={dsBestaetigung} onChange={e => setDsBestaetigung(e.target.checked)} className="mt-0.5 w-4 h-4 rounded" />
                          <span className="text-sm text-[#475569]">Ich bestätige, dass ich die Datenschutz-Bereinigung durchführen möchte. Gelöschte Daten können nicht wiederhergestellt werden.</span>
                        </label>
                        <button
                          onClick={fuehreDsDurchAus}
                          disabled={!dsBestaetigung || dsLaueft}
                          className="w-full py-3 bg-[#DC2626] hover:bg-[#b91c1c] disabled:bg-[#94A3B8] text-white font-bold rounded-xl transition-colors text-sm"
                        >
                          {dsLaueft ? 'Wird durchgeführt...' : '🗑 Bereinigung jetzt starten'}
                        </button>
                      </div>
                    )}
                  </div>
                )}

                {dsResult && (
                  <div className="bg-[#F0FDF4] border border-[#86EFAC] rounded-xl p-5 space-y-2">
                    <p className="font-semibold text-[#16A34A]">✅ Bereinigung abgeschlossen</p>
                    <div className="space-y-1 text-sm">
                      <div className="flex justify-between"><span className="text-[#64748B]">Leads gelöscht</span><span className="font-bold">{dsResult.leadsGeloescht}</span></div>
                      <div className="flex justify-between"><span className="text-[#64748B]">Käufe anonymisiert</span><span className="font-bold">{dsResult.kaeufeAnonymisiert}</span></div>
                      <p className="text-[#94A3B8] text-xs pt-1">Durchgeführt am {new Date(dsResult.durchgefuehrtAm).toLocaleString('de-DE')}</p>
                    </div>
                  </div>
                )}
              </div>
            </Card>
          </div>
        )}

        {/* Speichern – nur wenn nicht Datenschutz-Tab */}
        {activeTab !== 'datenschutz' && (
        <button
          onClick={handleSave}
          disabled={saving}
          className="w-full py-3.5 bg-[#0369A1] hover:bg-[#0284c7] disabled:bg-[#94A3B8] text-white font-bold rounded-xl transition-colors duration-200 text-sm min-h-[52px]"
        >
          {saving ? 'Speichert...' : 'Einstellungen speichern'}
        </button>
        )}
      </div>
    </div>
  )
}
