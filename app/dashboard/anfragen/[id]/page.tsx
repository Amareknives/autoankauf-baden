'use client'

import { useState, useEffect, use, useRef, useCallback } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import toast from 'react-hot-toast'
import { ChevronLeft, Phone, Mail, MessageCircle, Share2, Eye } from 'lucide-react'
import { MailVorschauModal } from '@/components/dashboard/MailVorschauModal'
import NachrichtModal from '@/components/dashboard/NachrichtModal'
import EmailVorschauConfirmModal from '@/components/dashboard/EmailVorschauConfirmModal'
import EmailPreviewLader from '@/components/dashboard/EmailPreviewLader'

interface AktivitaetsLog {
  id: string
  createdAt: string
  aktion: string
  details: string | null
  mitarbeiter: { kuerzel: string | null; farbe: string; vorname: string; nachname: string } | null
}

interface MailLogEntry {
  id: string
  typ: string
  createdAt: string
  status: string
  fehler: string | null
}

interface Anfrage {
  id: string
  createdAt: string
  vorname: string
  nachname: string
  email: string
  telefon: string | null
  plz: string
  marke: string
  modell: string
  erstzulassungJahr: number
  erstzulassungMonat: number
  kilometerstand: number
  kraftstoff: string
  schadstoffklasse: string | null
  leistungKw: number | null
  hubraum: number | null
  getriebe: string
  bauform: string | null
  anzahlTueren: string | null
  anzahlSitze: number | null
  huBis: string | null
  farbe: string | null
  deutscheZulassung: boolean
  papiere: boolean
  finanziert: boolean
  fahrbereitschaft: string
  optischerZustand: number
  unfallfahrzeug: string
  repariert: boolean | null
  maengel: boolean
  maengelText: string | null
  roststellen: boolean
  gewerblich: boolean
  firmenname: string | null
  preisvorstellung: string | null
  verkaufszeitpunkt: string | null
  abmeldung: boolean
  ausstattung: string[]
  sonstigeAusstattung: string | null
  weitereInfos: string | null
  status: string
  notizen: string | null
  archiviert: boolean
  angebotspreis: number | null
  abschlussPreis: number | null
  ablehnungsGrund: string | null
  angebotNachricht: string | null
  terminVorschlag1: string | null
  abholadresse: string | null
  abholAdresseZusatz: string | null
  fotos: string[]
  kontaktWeg: string | null
  newsletter: boolean
  aktivitaeten: AktivitaetsLog[]
  bearbeiterId: string | null
  bearbeiter: { id: string; vorname: string; nachname: string; kuerzel: string | null; farbe: string; telefon: string | null; whatsapp: string | null } | null
}

const STATUS_CONFIG: Record<string, { label: string; bg: string; text: string }> = {
  neu:               { label: 'Neu',               bg: 'bg-blue-100',    text: 'text-blue-800' },
  kontaktiert:       { label: 'Kontaktiert',        bg: 'bg-yellow-100',  text: 'text-yellow-800' },
  angebot_gesendet:  { label: 'Angebot gesendet',   bg: 'bg-purple-100',  text: 'text-purple-800' },
  termin_vereinbart: { label: 'Termin vereinbart',  bg: 'bg-green-100',   text: 'text-green-800' },
  abgeschlossen:     { label: 'Abgeschlossen',      bg: 'bg-emerald-100', text: 'text-emerald-800' },
  abgelehnt:         { label: 'Abgelehnt',          bg: 'bg-red-100',     text: 'text-red-800' },
}

const STATUS_FLOW = ['neu', 'kontaktiert', 'angebot_gesendet', 'termin_vereinbart', 'abgeschlossen']

interface MitarbeiterKurz {
  id: string
  vorname: string
  nachname: string
  kuerzel: string | null
  farbe: string
  telefon: string | null
  whatsapp: string | null
}

interface MitarbeiterOption {
  id: string
  vorname: string
  nachname: string
  kuerzel: string | null
  farbe: string
  aktiv: boolean
}

// ─── Marktrecherche-Links ─────────────────────────────────────────────────────
const FUEL_MOBILE: Record<string, string> = {
  'Benzin': 'PETROL', 'Diesel': 'DIESEL', 'Elektro': 'ELECTRIC',
  'Hybrid': 'HYBRID', 'Erdgas (CNG)': 'NATURAL_GAS', 'LPG': 'LPG',
}
const FUEL_AS24: Record<string, string> = {
  'Benzin': 'B', 'Diesel': 'D', 'Elektro': 'E',
  'Hybrid': 'H', 'Erdgas (CNG)': 'G', 'LPG': 'L',
}

function buildMarktUrls(marke: string, modell: string, jahr: number, km: number, kraftstoff: string) {
  const jahrVon = Math.max(2000, jahr - 2)
  const jahrBis = jahr + 2
  const kmVon = Math.max(0, km - 20000)
  const kmBis = km + 20000

  const q = encodeURIComponent(`${marke} ${modell}`)
  const makeSlug = marke.toLowerCase()
    .replace(/ä/g, 'ae').replace(/ö/g, 'oe').replace(/ü/g, 'ue').replace(/\s+/g, '-')
  const modelSlug = modell.toLowerCase()
    .replace(/ä/g, 'ae').replace(/ö/g, 'oe').replace(/ü/g, 'ue').replace(/\s+/g, '-')
  // Für AutoScout24: trailing Generationszahl entfernen (z.B. "golf-3" → "golf")
  const modelSlugAs24 = modelSlug.replace(/-\d+$/, '')

  const fuelMobile = FUEL_MOBILE[kraftstoff]
  const fuelAs24 = FUEL_AS24[kraftstoff]

  return [
    {
      name: 'mobile.de',
      icon: '🔶',
      borderClass: 'border-[#E8711A] hover:bg-orange-50 hover:text-[#E8711A]',
      url: `https://suchen.mobile.de/fahrzeuge/search.html?isSearchRequest=true&scopeId=C`,
    },
    {
      name: 'AutoScout24',
      icon: '🔵',
      borderClass: 'border-[#003E99] hover:bg-blue-50 hover:text-[#003E99]',
      url: `https://www.autoscout24.de/lst/${makeSlug}/${modelSlugAs24}?` +
        `sort=standard&desc=0&ustate=N%2CU&atype=C&cy=D` +
        `&ocs_listing=include&damaged_listing=exclude` +
        `&fregfrom=${jahrVon}` +
        `&fregto=${jahrBis}` +
        `&kmfrom=${kmVon}` +
        `&kmto=${kmBis}` +
        (fuelAs24 ? `&fuel=${fuelAs24}` : ''),
    },
    {
      name: 'Kleinanzeigen',
      icon: '🟥',
      borderClass: 'border-[#c8171e] hover:bg-red-50 hover:text-[#c8171e]',
      url: `https://www.kleinanzeigen.de/s-autos/${makeSlug}-${modelSlug}/k0c216` +
        `+autos.ez_i:${jahrVon}_${jahrBis}` +
        `+autos.kilometer_i:${kmVon}_${kmBis}`,
    },
  ]
}

function MarktrechercheLinks({ marke, modell, jahr, km, kraftstoff }: {
  marke: string; modell: string; jahr: number; km: number; kraftstoff: string
}) {
  const links = buildMarktUrls(marke, modell, jahr, km, kraftstoff)
  return (
    <div className="bg-white rounded-2xl border border-[#E2EDF7] p-6">
      <div className="flex items-center gap-2 mb-1">
        <h2 className="font-bold text-[#0F172A]">Marktrecherche</h2>
        <span className="px-2 py-0.5 bg-[#E8F4FD] text-[#0369A1] text-xs font-semibold rounded-full">Nur intern</span>
      </div>
      <p className="text-xs text-[#94A3B8] mb-4">
        Vergleichspreise für <strong className="text-[#64748B]">{marke} {modell}</strong>
        {' '}· EZ {jahr} · ca. {km.toLocaleString('de-DE')} km · {kraftstoff}
      </p>
      <div className="flex flex-col sm:flex-row gap-2">
        {links.map(l => (
          <a
            key={l.name}
            href={l.url}
            target="_blank"
            rel="noopener noreferrer"
            className={`flex-1 flex items-center justify-center gap-2 px-4 py-3 rounded-xl border-2 transition-all duration-150 text-sm font-semibold text-[#0F172A] ${l.borderClass}`}
          >
            <span className="text-base leading-none">{l.icon}</span>
            <span>Bei {l.name} suchen</span>
            <svg className="w-3.5 h-3.5 opacity-50" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
            </svg>
          </a>
        ))}
      </div>
      <p className="text-[10px] text-[#94A3B8] mt-3 text-center">Suche zeigt ±2 Jahre und ±20.000 km</p>
    </div>
  )
}

// ─────────────────────────────────────────────────────────────────────────────

function BearbeiterBlock({
  anfrage,
  saving,
  onAssign,
}: {
  anfrage: { bearbeiter: MitarbeiterKurz | null; bearbeiterId: string | null }
  saving: boolean
  onAssign: (id: string | null) => void
}) {
  const [mitarbeiter, setMitarbeiter] = useState<MitarbeiterKurz[]>([])
  const [open, setOpen] = useState(false)
  const [aktuell, setAktuell] = useState(anfrage.bearbeiter)
  const [aktuellId, setAktuellId] = useState(anfrage.bearbeiterId)

  // Props-Sync (wenn update() die Anfrage neu setzt)
  useEffect(() => { setAktuell(anfrage.bearbeiter) }, [anfrage.bearbeiter])
  useEffect(() => { setAktuellId(anfrage.bearbeiterId) }, [anfrage.bearbeiterId])

  useEffect(() => {
    void fetch('/api/dashboard/mitarbeiter')
      .then(r => r.json())
      .then((d: MitarbeiterKurz[]) => setMitarbeiter(d))
      .catch(() => {/* ignorieren */})
  }, [])

  const handleAssign = (id: string | null) => {
    // Optimistisches Update sofort
    const ma = id ? mitarbeiter.find(m => m.id === id) ?? null : null
    setAktuell(ma)
    setAktuellId(id)
    setOpen(false)
    onAssign(id)
  }

  return (
    <div className="bg-white rounded-2xl border border-[#E2EDF7] p-5">
      <div className="flex items-center justify-between mb-3">
        <h3 className="text-sm font-bold text-[#0F172A]">Bearbeiter</h3>
        {mitarbeiter.length > 0 && (
          <button
            onClick={() => setOpen(o => !o)}
            className="text-xs text-[#0369A1] hover:underline"
          >
            {open ? 'Abbrechen' : 'Ändern'}
          </button>
        )}
      </div>

      {aktuell ? (
        <div className="flex items-center gap-3">
          <div
            className="w-9 h-9 rounded-full flex items-center justify-center text-white text-xs font-bold shrink-0"
            style={{ backgroundColor: aktuell.farbe }}
          >
            {aktuell.kuerzel ?? (aktuell.vorname[0] + aktuell.nachname[0]).toUpperCase()}
          </div>
          <div>
            <p className="text-sm font-semibold text-[#0F172A]">{aktuell.vorname} {aktuell.nachname}</p>
            {aktuell.telefon && <p className="text-xs text-[#64748B]">{aktuell.telefon}</p>}
          </div>
        </div>
      ) : (
        <button
          onClick={() => setOpen(true)}
          className="w-full flex items-center gap-2 px-3 py-2.5 rounded-xl border-2 border-dashed border-[#FDE68A] bg-[#FFFBEB] text-[#92400E] text-xs font-semibold hover:bg-[#FEF3C7] transition-colors"
        >
          <span className="text-base">👤</span>
          Bearbeiter zuweisen — wer ist zuständig?
        </button>
      )}

      {open && mitarbeiter.length > 0 && (
        <div className="mt-3 space-y-1.5 border-t border-[#E2EDF7] pt-3">
          {mitarbeiter.map(m => (
            <button
              key={m.id}
              disabled={saving}
              onClick={() => handleAssign(m.id)}
              className={`w-full flex items-center gap-2.5 px-3 py-2 rounded-xl text-left transition-colors ${
                aktuellId === m.id
                  ? 'bg-[#EFF6FF] border border-[#0369A1]'
                  : 'hover:bg-[#F8FAFC] border border-transparent'
              }`}
            >
              <div
                className="w-7 h-7 rounded-full flex items-center justify-center text-white text-[10px] font-bold shrink-0"
                style={{ backgroundColor: m.farbe }}
              >
                {m.kuerzel ?? (m.vorname[0] + m.nachname[0]).toUpperCase()}
              </div>
              <span className="text-sm text-[#0F172A]">{m.vorname} {m.nachname}</span>
              {aktuellId === m.id && <span className="ml-auto text-xs text-[#0369A1] font-semibold">✓</span>}
            </button>
          ))}
          {aktuellId && (
            <button
              disabled={saving}
              onClick={() => handleAssign(null)}
              className="w-full text-left px-3 py-2 rounded-xl text-xs text-[#94A3B8] hover:text-[#DC2626] hover:bg-[#FEF2F2] transition-colors"
            >
              Zuweisung aufheben
            </button>
          )}
        </div>
      )}

      {mitarbeiter.length === 0 && (
        <p className="text-xs text-[#94A3B8] mt-2">
          Mitarbeiter in den{' '}
          <a href="/dashboard/einstellungen" className="text-[#0369A1] hover:underline">Einstellungen</a>{' '}
          anlegen.
        </p>
      )}
    </div>
  )
}

const snap15 = (value: string) => {
  if (!value) return value
  const d = new Date(value)
  d.setMinutes(Math.round(d.getMinutes() / 15) * 15, 0, 0)
  return d.toISOString().slice(0, 16)
}

function TerminFormular({
  terminVorschlag, setTerminVorschlag,
  abholadresse, setAbholadresse,
  abholAdresseZusatz, setAbholAdresseZusatz,
  terminMitarbeiterId, setTerminMitarbeiterId,
  mitarbeiterListe, firmaAdresse,
  saving, istAenderung, hatAenderung, nurMitarbeiterGeaendert,
  onSave, onSaveIntern, onAbbrechen, onLoeschen,
}: {
  terminVorschlag: string
  setTerminVorschlag: (v: string) => void
  abholadresse: string
  setAbholadresse: (v: string) => void
  abholAdresseZusatz: string
  setAbholAdresseZusatz: (v: string) => void
  terminMitarbeiterId: string
  setTerminMitarbeiterId: (v: string) => void
  mitarbeiterListe: MitarbeiterOption[]
  firmaAdresse: string
  saving: boolean
  istAenderung: boolean
  hatAenderung?: boolean
  nurMitarbeiterGeaendert?: boolean
  onSave: () => void
  onSaveIntern?: () => void
  onAbbrechen: (() => void) | null
  onLoeschen: (() => void) | null
}) {
  return (
    <div className="space-y-3 mt-1">
      {/* Schnellauswahl */}
      <div>
        <p className="text-xs text-[#64748B] mb-2">Schnellauswahl</p>
        <div className="grid grid-cols-2 gap-2">
          {[
            { tag: 'Morgen', times: [{ h: 10, m: 0 }, { h: 14, m: 0 }, { h: 15, m: 0 }, { h: 16, m: 0 }, { h: 17, m: 0 }], offset: 1 },
            { tag: 'Übermorgen', times: [{ h: 10, m: 0 }, { h: 14, m: 0 }, { h: 15, m: 0 }, { h: 16, m: 0 }, { h: 17, m: 0 }], offset: 2 },
          ].map(({ tag, times, offset }) => (
            <div key={tag}>
              <p className="text-[10px] text-[#94A3B8] font-semibold uppercase tracking-wide mb-1.5">{tag}</p>
              <div className="flex flex-wrap gap-1">
                {times.map(({ h, m }) => {
                  const val = (() => { const d = new Date(); d.setDate(d.getDate() + offset); d.setHours(h, m, 0, 0); return d.toISOString().slice(0, 16) })()
                  const label = `${String(h).padStart(2, '0')}:${String(m).padStart(2, '0')}`
                  return (
                    <button key={label} type="button" onClick={() => setTerminVorschlag(val)}
                      className={`px-2.5 py-1 rounded-lg text-xs font-medium border transition-colors min-h-[32px] ${terminVorschlag === val ? 'bg-[#0369A1] text-white border-[#0369A1]' : 'border-[#E2EDF7] text-[#64748B] hover:border-[#0369A1] hover:text-[#0369A1]'}`}>
                      {label}
                    </button>
                  )
                })}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Datum + Uhrzeit */}
      <div>
        <label className="block text-xs text-[#64748B] mb-1.5">Datum & Uhrzeit</label>
        <div className="flex gap-2">
          <input type="date" value={terminVorschlag.slice(0, 10)}
            onChange={e => setTerminVorschlag(e.target.value + 'T' + (terminVorschlag.slice(11, 16) || '15:00'))}
            className="flex-1 px-3 py-2.5 border border-[#E2EDF7] rounded-xl text-sm text-[#0F172A] focus:outline-none focus:ring-2 focus:ring-[#0369A1] focus:border-transparent" />
          <select value={terminVorschlag.slice(11, 16)}
            onChange={e => setTerminVorschlag((terminVorschlag.slice(0, 10) || new Date().toISOString().slice(0, 10)) + 'T' + e.target.value)}
            className="w-28 px-3 py-2.5 border border-[#E2EDF7] rounded-xl text-sm text-[#0F172A] focus:outline-none focus:ring-2 focus:ring-[#0369A1] focus:border-transparent">
            {Array.from({ length: 13 * 4 }, (_, i) => {
              const totalMin = 7 * 60 + i * 15
              const hh = String(Math.floor(totalMin / 60)).padStart(2, '0')
              const mm = String(totalMin % 60).padStart(2, '0')
              return <option key={`${hh}:${mm}`} value={`${hh}:${mm}`}>{hh}:{mm} Uhr</option>
            })}
          </select>
        </div>
      </div>

      {/* Adresse */}
      <div>
        <div className="flex items-center justify-between mb-1.5">
          <label className="text-xs text-[#64748B]">Adresse / Treffpunkt</label>
          {firmaAdresse && (
            <button
              type="button"
              onClick={() => setAbholadresse(firmaAdresse)}
              className="text-[11px] font-semibold text-[#0369A1] hover:text-[#025d8f] flex items-center gap-1 transition-colors"
              title={firmaAdresse}
            >
              <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 16 16" fill="currentColor" className="w-3 h-3">
                <path fillRule="evenodd" d="M8 1.5a5 5 0 1 0 0 10A5 5 0 0 0 8 1.5zM0 8a8 8 0 1 1 16 0A8 8 0 0 1 0 8zm9 1a1 1 0 1 0-2 0v1.5H5.5a1 1 0 1 0 0 2H7V14a1 1 0 1 0 2 0v-1.5h1.5a1 1 0 1 0 0-2H9V9z" clipRule="evenodd"/>
              </svg>
              Unsere Adresse einfügen
            </button>
          )}
        </div>
        <input type="text" value={abholadresse} onChange={e => setAbholadresse(e.target.value)}
          placeholder="z.B. Heidelberger Str. 4, 76676 Graben-Neudorf"
          className="w-full px-3 py-2.5 border border-[#E2EDF7] rounded-xl text-sm text-[#0F172A] focus:outline-none focus:ring-2 focus:ring-[#0369A1] focus:border-transparent" />
      </div>
      <div>
        <label className="block text-xs text-[#64748B] mb-1.5">Adresszusatz (optional)</label>
        <input type="text" value={abholAdresseZusatz} onChange={e => setAbholAdresseZusatz(e.target.value)}
          placeholder="z.B. Klingel bei Mayer, 3. Stock, Hintereingang"
          className="w-full px-3 py-2.5 border border-[#E2EDF7] rounded-xl text-sm text-[#0F172A] focus:outline-none focus:ring-2 focus:ring-[#0369A1] focus:border-transparent" />
      </div>

      {/* Zuständiger Mitarbeiter */}
      {mitarbeiterListe.length > 0 && (
        <div>
          <label className="block text-xs font-semibold text-[#0F172A] mb-1.5">
            Zuständiger Mitarbeiter {!istAenderung && <span className="text-[#DC2626]">*</span>}
          </label>
          <select
            value={terminMitarbeiterId}
            onChange={e => setTerminMitarbeiterId(e.target.value)}
            className={`w-full px-3 py-2.5 border rounded-xl text-sm text-[#0F172A] focus:outline-none focus:ring-2 focus:ring-[#0369A1] focus:border-transparent ${!terminMitarbeiterId && !istAenderung ? 'border-[#FCA5A5] bg-[#FEF2F2]' : 'border-[#E2EDF7]'}`}
          >
            <option value="">— Pflichtfeld: Mitarbeiter auswählen —</option>
            {mitarbeiterListe.map(m => (
              <option key={m.id} value={m.id}>
                {m.vorname} {m.nachname}{m.kuerzel ? ` (${m.kuerzel})` : ''}
              </option>
            ))}
          </select>
          {terminMitarbeiterId ? (
            <p className="text-[10px] text-[#64748B] mt-1">
              ✅ Beim Speichern erhält dieser Mitarbeiter eine WhatsApp-Benachrichtigung mit allen Termindaten.
            </p>
          ) : !istAenderung ? (
            <p className="text-[10px] text-[#DC2626] mt-1 font-medium">
              Pflichtfeld – ohne Auswahl kann der Termin nicht gespeichert werden.
            </p>
          ) : null}
        </div>
      )}

      {/* Adresse Pflichtfeld-Hinweis */}
      {!abholadresse.trim() && (
        <p className="text-xs text-[#DC2626] bg-[#FEF2F2] border border-[#FECACA] rounded-lg px-3 py-2">
          Bitte gib eine Adresse / einen Treffpunkt ein.
        </p>
      )}

      {/* Buttons */}
      <div className="flex gap-2 pt-1 flex-wrap">
        {/* Nur-Mitarbeiter-Wechsel: Intern speichern (kein Kunden-E-Mail) */}
        {istAenderung && nurMitarbeiterGeaendert && onSaveIntern && (
          <button type="button"
            disabled={saving}
            onClick={onSaveIntern}
            className="flex-1 px-4 py-2.5 bg-[#F1F5F9] hover:bg-[#E2EDF7] disabled:opacity-50 text-[#0F172A] text-sm font-semibold rounded-xl transition-colors border border-[#E2EDF7]"
            title="Speichert nur die Mitarbeiter-Zuweisung – kein E-Mail an den Kunden"
          >
            {saving ? '…' : '👤 Intern speichern'}
          </button>
        )}
        {/* Hauptbutton: nur anzeigen wenn Datum/Adresse geändert oder neuer Termin */}
        {(!istAenderung || !nurMitarbeiterGeaendert) && (
          <button type="button"
            disabled={saving || !terminVorschlag || !abholadresse.trim() || (!istAenderung && !terminMitarbeiterId) || (istAenderung && hatAenderung === false)}
            onClick={onSave}
            title={!istAenderung && !terminMitarbeiterId ? 'Bitte zuerst einen Mitarbeiter auswählen' : istAenderung && hatAenderung === false ? 'Keine Änderung vorgenommen' : undefined}
            className="flex-1 px-4 py-2.5 bg-[#0369A1] hover:bg-[#0284c7] disabled:bg-[#94A3B8] disabled:cursor-not-allowed text-white text-sm font-semibold rounded-xl transition-colors">
            {saving ? '…' : istAenderung ? '📅 Termin ändern & Senden' : 'Neuen Termin speichern & Senden'}
          </button>
        )}
        {onLoeschen && (
          <button type="button" disabled={saving} onClick={onLoeschen}
            className="px-4 py-2.5 bg-[#FEF2F2] hover:bg-[#FEE2E2] disabled:opacity-50 text-[#991B1B] text-sm font-semibold rounded-xl transition-colors border border-[#FECACA]">
            Löschen
          </button>
        )}
        {onAbbrechen && (
          <button type="button" onClick={onAbbrechen}
            className="px-4 py-2.5 bg-[#F1F5F9] hover:bg-[#E2EDF7] rounded-xl text-sm font-bold text-[#0F172A] transition-colors border border-[#CBD5E1]">
            ✕ Abbrechen
          </button>
        )}
      </div>
    </div>
  )
}

const AKTION_TO_MAIL_TYP: Record<string, string> = {
  angebot_mail_gesendet:    'angebot',
  termin_bestaetigt:        'termin_bestaetigung',
  termin_verschoben:        'termin_verschoben',      // Korrekt: 'termin_verschoben', nicht 'termin_bestaetigung'
  termin_abgesagt:          'termin_abgesagt',
  termin_mail_erneut:       'termin_bestaetigung',
  ablehnung_mail_gesendet:  'ablehnung',
  rueckfrage_gesendet:      'rueckfrage',
  nachricht_gesendet:       'freinachricht',
  bearbeiter_mail_gesendet: 'bearbeiter_geaendert',
}

const AKTION_TO_TITEL: Record<string, string> = {
  angebot_mail_gesendet:    'Gesendetes Angebot',
  termin_bestaetigt:        'Terminbestätigung',
  termin_verschoben:        'Terminänderung',
  termin_abgesagt:          'Terminabsage',
  termin_mail_erneut:       'Terminbestätigung (erneut)',
  ablehnung_mail_gesendet:  'Ablehnungs-Mail',
  rueckfrage_gesendet:      'Rückfrage',
  nachricht_gesendet:       'Freie Nachricht',
  bearbeiter_mail_gesendet: 'Ansprechpartner-Wechsel',
}

function findMatchingMailLog(aktLog: AktivitaetsLog, typ: string, mailLogs: MailLogEntry[]): MailLogEntry | null {
  const aktTime = new Date(aktLog.createdAt).getTime()
  const candidates = mailLogs
    .filter(l => l.typ === typ)
    .sort((a, b) =>
      Math.abs(new Date(a.createdAt).getTime() - aktTime) -
      Math.abs(new Date(b.createdAt).getTime() - aktTime)
    )
  const best = candidates[0]
  if (!best) return null
  if (Math.abs(new Date(best.createdAt).getTime() - aktTime) > 300000) return null
  return best
}

export default function AnfrageDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params)
  const router = useRouter()
  const [anfrage, setAnfrage] = useState<Anfrage | null>(null)
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)

  // Bearbeitungsfelder
  const [notizen, setNotizen] = useState('')
  const [angebotspreis, setAngebotspreis] = useState('')
  const [angebotNachricht, setAngebotNachricht] = useState('')
  const defaultTermin = () => {
    const d = new Date()
    d.setDate(d.getDate() + 1)
    d.setHours(15, 0, 0, 0)
    return d.toISOString().slice(0, 16)
  }
  const [terminVorschlag, setTerminVorschlag] = useState(defaultTermin)
  const [abholadresse, setAbholadresse] = useState('')
  const [abholAdresseZusatz, setAbholAdresseZusatz] = useState('')
  const [firmaAdresse, setFirmaAdresse] = useState('')
  const [terminMitarbeiterId, setTerminMitarbeiterId] = useState('')
  const [mitarbeiterListe, setMitarbeiterListe] = useState<MitarbeiterOption[]>([])
  const [ichId, setIchId] = useState<string | null>(null)
  const [sendingTerminMail, setSendingTerminMail] = useState(false)
  const [editingTermin, setEditingTermin] = useState(false)

  // Archivieren inline
  const [showArchivierenConfirm, setShowArchivierenConfirm] = useState(false)

  // Endgültig löschen
  const [showLoeschenModal, setShowLoeschenModal] = useState(false)
  const [deleting, setDeleting] = useState(false)

  const endgueltigLoeschen = async () => {
    setDeleting(true)
    try {
      const res = await fetch(`/api/dashboard/anfragen/${id}`, { method: 'DELETE' })
      if (res.ok) {
        toast.success('Anfrage endgültig gelöscht')
        router.push('/dashboard/anfragen')
      } else {
        toast.error('Fehler beim Löschen')
        setDeleting(false)
      }
    } catch {
      toast.error('Verbindungsfehler')
      setDeleting(false)
    }
  }

  // Foto-Galerie
  const [galerieFotoIndex, setGalerieFotoIndex] = useState<number | null>(null)

  // Angebot-Vorschau (letzter MailLog-Eintrag)
  const [angebotVorschauId, setAngebotVorschauId] = useState<string | null>(null)
  const [angebotVorschauLoading, setAngebotVorschauLoading] = useState(false)

  // Email-Vorschau-Confirm-Modal (vor dem Senden)
  const [sendVorschau, setSendVorschau] = useState<{ subject: string; html: string; onConfirm: () => void } | null>(null)
  const [loadingPreview, setLoadingPreview] = useState(false)

  // Allgemeine Mail-Vorschau (Ablehnung, Rückfrage, Freie Nachricht)
  const [mailVorschauId, setMailVorschauId] = useState<string | null>(null)

  // Verlauf-Mail-Eintrag: ID des gerade ladenden Eintrags
  const [verlaufMailLoading, setVerlaufMailLoading] = useState<string | null>(null)

  // Re-Send-Sperre für Angebot
  const [angebotSperreFreigegeben, setAngebotSperreFreigegeben] = useState(false)

  // Termin ohne Adresse Warnung
  const [showOhneAdresseWarnung, setShowOhneAdresseWarnung] = useState(false)

  // Abschluss-Modal
  const [showAbschlussModal, setShowAbschlussModal] = useState(false)
  const [abschlussPreisInput, setAbschlussPreisInput] = useState('')

  // Ablehnen-Modal (intern, kein E-Mail)
  const [showAblehnungModal, setShowAblehnungModal] = useState(false)
  const [ablehnungsGrund, setAblehnungsGrund] = useState('kein_interesse_kunde')
  const [ablehnungSonstiges, setAblehnungSonstiges] = useState('')

  // Nachricht-Modal
  const [showNachrichtModal, setShowNachrichtModal] = useState(false)
  const [nachrichtInitialModus, setNachrichtInitialModus] = useState<'ablehnung' | 'rueckfrage' | 'freinachricht'>('ablehnung')

  // Termin-Löschen-Modal
  const [showTerminModal, setShowTerminModal] = useState(false)
  const [terminLoeschenGrund, setTerminLoeschenGrund] = useState<'kein_interesse' | 'wir_sagen_ab' | 'kunde_andertermin'>('wir_sagen_ab')
  const [ersatztermin1, setErsatztermin1] = useState('')
  const [ersatztermin2, setErsatztermin2] = useState('')
  const [terminKommentar, setTerminKommentar] = useState('')

  useEffect(() => {
    async function load() {
      try {
        const [anfrageRes, mitarbeiterRes, meRes, settingsRes] = await Promise.all([
          fetch(`/api/dashboard/anfragen/${id}`),
          fetch('/api/dashboard/mitarbeiter'),
          fetch('/api/dashboard/me'),
          fetch('/api/dashboard/einstellungen'),
        ])
        let meId: string | null = null
        if (meRes.ok) {
          const meData = await meRes.json() as { id: string } | null
          meId = meData?.id ?? null
          setIchId(meId)
        }
        if (anfrageRes.ok) {
          const data = await anfrageRes.json() as Anfrage
          setAnfrage(data)
          setNotizen(data.notizen ?? '')
          setAngebotspreis(data.angebotspreis?.toString() ?? '')
          setAngebotNachricht(data.angebotNachricht ?? '')
          setAbholadresse(data.abholadresse ?? '')
          setAbholAdresseZusatz(data.abholAdresseZusatz ?? '')
          // Vorhandenen Bearbeiter übernehmen, sonst eingeloggten User als Default
          setTerminMitarbeiterId(data.bearbeiterId ?? meId ?? '')
        }
        if (mitarbeiterRes.ok) {
          const mData = await mitarbeiterRes.json() as MitarbeiterOption[]
          setMitarbeiterListe(mData.filter(m => m.aktiv))
        }
        if (settingsRes.ok) {
          const s = await settingsRes.json() as Record<string, string>
          const adresse = [s['strasse'], `${s['plz_firma'] ?? ''} ${s['ort'] ?? ''}`.trim()].filter(Boolean).join(', ')
          if (adresse) setFirmaAdresse(adresse)
        }
      } finally {
        setLoading(false)
      }
    }
    void load()
  }, [id])

  const refreshVerlauf = useCallback(async () => {
    try {
      const res = await fetch(`/api/dashboard/anfragen/${id}`)
      if (res.ok) {
        const data = await res.json() as Anfrage
        setAnfrage(prev => prev ? { ...prev, aktivitaeten: data.aktivitaeten } : data)
      }
    } catch { /* ignorieren */ }
  }, [id])

  const checkMailStatus = useCallback(async (typ: string) => {
    // Kurz warten, dann letzten Mail-Log-Eintrag prüfen
    await new Promise(r => setTimeout(r, 2500))
    try {
      const res = await fetch(`/api/dashboard/mail-log?limit=5`)
      if (!res.ok) return
      const data = await res.json() as { logs: { id: string; typ: string; anfrageId: string | null; status: string; fehler: string | null }[] }
      const entry = data.logs.find(l => l.typ === typ && l.anfrageId === id)
      if (entry) {
        if (entry.status === 'gesendet') {
          toast.success(`✓ E-Mail erfolgreich zugestellt`)
          if (typ === 'angebot') setAngebotVorschauId(entry.id)
          if (['ablehnung', 'rueckfrage', 'freinachricht'].includes(typ)) setMailVorschauId(entry.id)
        } else {
          toast.error(`E-Mail fehlgeschlagen: ${entry.fehler ?? 'Unbekannter Fehler'}`)
        }
      }
    } catch {
      // ignorieren
    }
    void refreshVerlauf()
  }, [id, refreshVerlauf])

  const update = async (patch: Record<string, unknown>) => {
    setSaving(true)
    const sendetMail = patch.sendeAngebotMail || patch.sendeTerminMail || patch.terminLoeschenGrund
    try {
      const res = await fetch(`/api/dashboard/anfragen/${id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(patch),
      })
      if (res.ok) {
        const updated = await res.json() as Anfrage
        setAnfrage(prev => prev ? { ...prev, ...updated } : updated)
        void refreshVerlauf()
        // Verzögerter Refresh für async E-Mail-Einträge
        setTimeout(() => void refreshVerlauf(), 3500)
        toast.success(sendetMail ? 'Gespeichert · E-Mail wird gesendet…' : 'Gespeichert')
        if (patch.sendeAngebotMail) {
          setAngebotNachricht('')
          setAngebotSperreFreigegeben(false)
          void checkMailStatus('angebot')
        } else if (patch.sendeTerminMail) void checkMailStatus('termin_bestaetigung')
        else if (patch.terminLoeschenGrund === 'wir_sagen_ab') void checkMailStatus('termin_abgesagt')
        else if (patch.terminLoeschenGrund === 'kunde_andertermin') void checkMailStatus('termin_abgesagt')
      } else {
        toast.error('Fehler beim Speichern')
      }
    } catch {
      toast.error('Verbindungsfehler')
    }
    setSaving(false)
  }

  /** Lädt Email-Preview und zeigt Bestätigungs-Modal. onConfirm wird beim Klick auf "Jetzt senden" ausgeführt. */
  const holeVorschau = async (
    previewParams: Record<string, unknown>,
    onConfirm: () => void
  ) => {
    setLoadingPreview(true)
    try {
      const res = await fetch(`/api/dashboard/anfragen/${id}/mail-preview`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(previewParams),
      })
      if (res.ok) {
        const data = await res.json() as { subject: string; html: string }
        setSendVorschau({ ...data, onConfirm })
      } else {
        toast.error('Vorschau konnte nicht geladen werden')
      }
    } catch {
      toast.error('Verbindungsfehler')
    }
    setLoadingPreview(false)
  }

  if (loading) {
    return (
      <div className="p-8 text-center text-[#94A3B8]">Lädt...</div>
    )
  }

  if (!anfrage) {
    return (
      <div className="p-8 text-center">
        <p className="text-[#64748B] mb-4">Anfrage nicht gefunden.</p>
        <Link href="/dashboard/anfragen" className="text-[#0369A1] hover:underline text-sm">← Zurück</Link>
      </div>
    )
  }

  const currentStatus = STATUS_CONFIG[anfrage.status] ?? { label: anfrage.status, bg: 'bg-gray-100', text: 'text-gray-800' }
  const wurdeReaktiviert = anfrage.aktivitaeten.some(a => a.aktion === 'reaktiviert')
  const letzteStatusVorReaktivierung = (() => {
    const reaktIdx = anfrage.aktivitaeten.findIndex(a => a.aktion === 'reaktiviert')
    if (reaktIdx < 0) return null
    const statusVorher = anfrage.aktivitaeten.slice(reaktIdx + 1).find(a => a.aktion === 'status_geaendert')
    return statusVorher?.details?.split(' → ')[1] ?? null
  })()

  return (
    <>
    <div className="p-6 md:p-8">
      {/* Reaktiviert-Banner */}
      {wurdeReaktiviert && (
        <div className="mb-4 flex items-start gap-3 bg-[#FFFBEB] border border-[#FDE68A] rounded-xl px-4 py-3">
          <span className="text-lg shrink-0">🔄</span>
          <div>
            <p className="text-xs font-bold text-[#92400E]">Reaktivierter Kontakt</p>
            <p className="text-xs text-[#92400E]">
              Diese Anfrage wurde reaktiviert.
              {letzteStatusVorReaktivierung && ` Früherer Status: ${STATUS_CONFIG[letzteStatusVorReaktivierung]?.label ?? letzteStatusVorReaktivierung}`}
              {' '}— Verlauf beachten.
            </p>
          </div>
        </div>
      )}

      {/* Header */}
      <div className="flex items-start gap-3 mb-6">
        <Link href="/dashboard/anfragen" className="text-[#64748B] hover:text-[#0369A1] transition-colors mt-1 shrink-0">
          <ChevronLeft size={22} strokeWidth={2.5} />
        </Link>
        <div className="flex-1 min-w-0">
          <div className="flex flex-wrap items-center gap-2">
            <h1 className="text-xl font-black text-[#0F172A] leading-tight">
              {anfrage.vorname} {anfrage.nachname}
            </h1>
            <span className={`px-3 py-1 rounded-full text-xs font-bold shrink-0 ${currentStatus.bg} ${currentStatus.text}`}>
              {currentStatus.label}
            </span>
            {anfrage.notizen?.trim() && (
              <span className="inline-flex items-center gap-1 px-2.5 py-1 bg-[#FFFBEB] border border-[#FDE68A] rounded-full text-[11px] font-bold text-[#92400E]">
                📝 Notiz
              </span>
            )}
          </div>
          <p className="text-[#64748B] text-sm mt-0.5">{anfrage.marke} {anfrage.modell} · {anfrage.id.slice(0, 8)}</p>
        </div>
      </div>

      <div className="grid lg:grid-cols-[1fr_340px] gap-6">
        {/* Left */}
        <div className="space-y-6">

          {/* Kontakt */}
          <div className="bg-white rounded-2xl border border-[#E2EDF7] p-6">
            <div className="flex items-center gap-3 mb-4">
              <h2 className="font-bold text-[#0F172A]">Kontaktdaten</h2>
              {anfrage.kontaktWeg === 'nur_email' && (
                <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full bg-[#FEF9C3] text-[#A16207] text-xs font-semibold border border-[#FDE68A]">
                  ✉️ Nur per E-Mail kontaktieren
                </span>
              )}
            </div>
            <div className="grid sm:grid-cols-2 gap-4">
              {[
                { label: 'Name', value: `${anfrage.vorname} ${anfrage.nachname}` },
                { label: 'PLZ', value: anfrage.plz },
                { label: 'E-Mail', value: anfrage.email, href: `mailto:${anfrage.email}` },
                { label: 'Telefon', value: anfrage.telefon, href: anfrage.telefon ? `tel:${anfrage.telefon}` : undefined },
              ].map(f => (
                <div key={f.label}>
                  <p className="text-xs text-[#64748B] mb-0.5">{f.label}</p>
                  {f.href ? (
                    <a href={f.href} className="text-sm font-medium text-[#0369A1] hover:underline">{f.value}</a>
                  ) : (
                    <p className="text-sm font-medium text-[#0F172A]">{f.value ?? '–'}</p>
                  )}
                </div>
              ))}
            </div>
            {anfrage.newsletter && (
              <div className="mt-3 pt-3 border-t border-[#E2EDF7]">
                <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#F0FDF4] border border-[#86EFAC] text-xs font-semibold text-[#166534]">
                  📧 Newsletter-Anmeldung gewünscht
                </span>
              </div>
            )}
          </div>

          {/* Fahrzeug */}
          <div className="bg-white rounded-2xl border border-[#E2EDF7] p-6">
            <h2 className="font-bold text-[#0F172A] mb-4">Fahrzeugdaten</h2>

            {/* Basis-Infos */}
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-x-4 gap-y-3">
              {[
                { label: 'Marke & Modell', value: `${anfrage.marke} ${anfrage.modell}` },
                { label: 'Erstzulassung', value: `${String(anfrage.erstzulassungMonat).padStart(2,'0')}/${anfrage.erstzulassungJahr}` },
                { label: 'Kilometerstand', value: `${anfrage.kilometerstand.toLocaleString('de-DE')} km` },
                { label: 'Kraftstoff', value: anfrage.kraftstoff },
                { label: 'Getriebe', value: anfrage.getriebe },
                { label: 'Bauform', value: anfrage.bauform || '–' },
                { label: 'Farbe', value: anfrage.farbe || '–' },
                { label: 'Türen', value: anfrage.anzahlTueren || '–' },
                { label: 'Sitze', value: anfrage.anzahlSitze ? String(anfrage.anzahlSitze) : '–' },
                { label: 'Leistung', value: anfrage.leistungKw ? `${anfrage.leistungKw} kW` : '–' },
                { label: 'Hubraum', value: anfrage.hubraum ? `${anfrage.hubraum} ccm` : '–' },
                { label: 'Schadstoffklasse', value: anfrage.schadstoffklasse || '–' },
                { label: 'HU gültig bis', value: anfrage.huBis || '–' },
              ].map(f => (
                <div key={f.label}>
                  <p className="text-[11px] text-[#94A3B8] mb-0.5">{f.label}</p>
                  <p className="text-sm font-medium text-[#0F172A]">{f.value}</p>
                </div>
              ))}
            </div>

            {/* Zustand */}
            <div className="mt-4 pt-4 border-t border-[#E2EDF7]">
              <p className="text-xs font-semibold text-[#64748B] uppercase tracking-wide mb-3">Zustand</p>
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-x-4 gap-y-3">
                <div>
                  <p className="text-[11px] text-[#94A3B8] mb-0.5">Optischer Zustand</p>
                  <p className="text-sm font-medium text-[#0F172A]">
                    {'★'.repeat(anfrage.optischerZustand)}{'☆'.repeat(5 - anfrage.optischerZustand)} ({anfrage.optischerZustand}/5)
                  </p>
                </div>
                <div>
                  <p className="text-[11px] text-[#94A3B8] mb-0.5">Fahrbereitschaft</p>
                  <p className="text-sm font-medium text-[#0F172A]">{anfrage.fahrbereitschaft}</p>
                </div>
                <div>
                  <p className="text-[11px] text-[#94A3B8] mb-0.5">Unfallfahrzeug</p>
                  <p className="text-sm font-medium text-[#0F172A]">{anfrage.unfallfahrzeug}</p>
                </div>
                <div>
                  <p className="text-[11px] text-[#94A3B8] mb-0.5">Roststellen</p>
                  <p className="text-sm font-medium text-[#0F172A]">{anfrage.roststellen ? 'Ja' : 'Nein'}</p>
                </div>
                <div>
                  <p className="text-[11px] text-[#94A3B8] mb-0.5">Mängel</p>
                  <p className="text-sm font-medium text-[#0F172A]">{anfrage.maengel ? 'Ja' : 'Keine'}</p>
                </div>
              </div>
              {anfrage.maengel && anfrage.maengelText && (
                <div className="mt-3 p-3 bg-[#FEF2F2] border border-[#FECACA] rounded-lg">
                  <p className="text-[11px] text-[#B91C1C] font-semibold mb-0.5">Mängelbeschreibung</p>
                  <p className="text-sm text-[#7F1D1D]">{anfrage.maengelText}</p>
                </div>
              )}
            </div>

            {/* Dokumente & Status */}
            <div className="mt-4 pt-4 border-t border-[#E2EDF7]">
              <p className="text-xs font-semibold text-[#64748B] uppercase tracking-wide mb-3">Dokumente & Status</p>
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-x-4 gap-y-3">
                {[
                  { label: 'Deutsche Zulassung', value: anfrage.deutscheZulassung ? 'Ja' : 'Nein' },
                  { label: 'Fahrzeugpapiere', value: anfrage.papiere ? 'Vorhanden' : 'Fehlen' },
                  { label: 'Finanziert', value: anfrage.finanziert ? 'Ja' : 'Nein' },
                  { label: 'Abmeldung', value: anfrage.abmeldung ? 'Kunde kümmert sich' : 'Wir übernehmen' },
                  { label: 'Verkaufszeitpunkt', value: anfrage.verkaufszeitpunkt || '–' },
                  ...(anfrage.gewerblich ? [{ label: 'Gewerblich', value: anfrage.firmenname || 'Ja' }] : []),
                ].map(f => (
                  <div key={f.label}>
                    <p className="text-[11px] text-[#94A3B8] mb-0.5">{f.label}</p>
                    <p className="text-sm font-medium text-[#0F172A]">{f.value}</p>
                  </div>
                ))}
              </div>
            </div>

            {/* Ausstattung */}
            {(anfrage.ausstattung?.length > 0 || anfrage.sonstigeAusstattung) && (
              <div className="mt-4 pt-4 border-t border-[#E2EDF7]">
                <p className="text-xs font-semibold text-[#64748B] uppercase tracking-wide mb-2">Ausstattung</p>
                <div className="flex flex-wrap gap-1.5">
                  {anfrage.ausstattung.map((a: string) => (
                    <span key={a} className="px-2 py-0.5 bg-[#E8F4FD] text-[#0F172A] text-xs rounded-md font-medium">{a}</span>
                  ))}
                  {anfrage.sonstigeAusstattung && (
                    <span className="px-2 py-0.5 bg-[#F1F5F9] text-[#0F172A] text-xs rounded-md font-medium">
                      Sonstige: {anfrage.sonstigeAusstattung}
                    </span>
                  )}
                </div>
              </div>
            )}

            {/* Weitere Infos */}
            {anfrage.weitereInfos && (
              <div className="mt-4 pt-4 border-t border-[#E2EDF7]">
                <p className="text-xs font-semibold text-[#64748B] uppercase tracking-wide mb-1">Weitere Infos vom Kunden</p>
                <p className="text-sm text-[#64748B] leading-relaxed">{anfrage.weitereInfos}</p>
              </div>
            )}
          </div>

          {/* Marktrecherche */}
          <MarktrechercheLinks
            marke={anfrage.marke}
            modell={anfrage.modell}
            jahr={anfrage.erstzulassungJahr}
            km={anfrage.kilometerstand}
            kraftstoff={anfrage.kraftstoff}
          />

          {/* Fotos */}
          {anfrage.fotos?.length > 0 && (
            <div className="bg-white rounded-2xl border border-[#E2EDF7] p-6">
              <div className="flex items-center justify-between mb-4">
                <h2 className="font-bold text-[#0F172A]">Fotos ({anfrage.fotos.length})</h2>
                <button
                  onClick={() => setGalerieFotoIndex(0)}
                  className="text-xs px-3 py-1.5 border border-[#E2EDF7] rounded-lg text-[#64748B] hover:text-[#0369A1] hover:border-[#0369A1] transition-colors flex items-center gap-1.5"
                >
                  <Eye size={13} /> Galerie öffnen
                </button>
              </div>
              <div className="grid grid-cols-3 sm:grid-cols-4 gap-2">
                {anfrage.fotos.map((src, i) => (
                  <button
                    key={i}
                    onClick={() => setGalerieFotoIndex(i)}
                    className="block group relative"
                  >
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img
                      src={src}
                      alt={`Foto ${i + 1}`}
                      className="w-full h-24 object-cover rounded-xl border border-[#E2EDF7] group-hover:border-[#0369A1] transition-colors"
                    />
                    <div className="absolute inset-0 bg-black/0 group-hover:bg-black/10 rounded-xl transition-colors flex items-center justify-center">
                      <Eye size={16} className="text-white opacity-0 group-hover:opacity-100 transition-opacity drop-shadow" />
                    </div>
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Angebot */}
          <div className="bg-white rounded-2xl border border-[#E2EDF7] p-6">
            {anfrage.preisvorstellung && (
              <div className="mb-4 flex items-center gap-3 p-3 bg-[#FFFBEB] border border-[#FDE68A] rounded-xl">
                <span className="text-lg">💰</span>
                <div>
                  <p className="text-[11px] font-semibold text-[#92400E] uppercase tracking-wide">Preisvorstellung des Kunden</p>
                  <p className="text-base font-bold text-[#78350F]">{anfrage.preisvorstellung}</p>
                </div>
              </div>
            )}
            <div className="flex items-center justify-between mb-1">
              <h2 className="font-bold text-[#0F172A]">Angebot erstellen</h2>
              {anfrage.angebotspreis && (
                <button
                  disabled={angebotVorschauLoading}
                  onClick={async () => {
                    if (angebotVorschauId) { setAngebotVorschauId(angebotVorschauId); return }
                    setAngebotVorschauLoading(true)
                    try {
                      const res = await fetch(`/api/dashboard/mail-log?anfrageId=${id}&limit=100`)
                      if (res.ok) {
                        const data = await res.json() as { logs: { id: string; typ: string; anfrageId: string | null }[] }
                        const entry = data.logs.find(l => l.typ === 'angebot')
                        if (entry) setAngebotVorschauId(entry.id)
                        else toast('Keine gespeicherte Angebots-Mail gefunden.', { icon: 'ℹ️' })
                      }
                    } finally {
                      setAngebotVorschauLoading(false)
                    }
                  }}
                  className="text-xs px-3 py-1.5 border border-[#E2EDF7] rounded-lg text-[#64748B] hover:text-[#0369A1] hover:border-[#0369A1] transition-colors flex items-center gap-1.5"
                >
                  <Eye size={13} /> {angebotVorschauLoading ? '…' : 'Gesendete Mail'}
                </button>
              )}
            </div>
            <p className="text-xs text-[#64748B] mb-4">Preis eingeben → &quot;📧 Angebot senden&quot; schickt dem Kunden eine Mail mit Preis und Kontaktmöglichkeiten.</p>
            <div className="space-y-4">
              <div>
                <label className="block text-xs text-[#64748B] mb-1.5">Angebotspreis (€)</label>
                <input
                  type="number"
                  value={angebotspreis}
                  onChange={e => setAngebotspreis(e.target.value)}
                  placeholder="z.B. 4500"
                  className="w-full px-3 py-2.5 border border-[#E2EDF7] rounded-xl text-sm text-[#0F172A] focus:outline-none focus:ring-2 focus:ring-[#0369A1] focus:border-transparent"
                />
              </div>
              <div>
                <label className="block text-xs text-[#64748B] mb-1.5">Persönliche Nachricht (optional)</label>
                <textarea
                  value={angebotNachricht}
                  onChange={e => setAngebotNachricht(e.target.value)}
                  rows={3}
                  placeholder="z.B. Das Fahrzeug ist gut erhalten, wir sind optimistisch..."
                  className="w-full px-3 py-2.5 border border-[#E2EDF7] rounded-xl text-sm text-[#0F172A] resize-none focus:outline-none focus:ring-2 focus:ring-[#0369A1] focus:border-transparent"
                />
              </div>
              {anfrage.status === 'angebot_gesendet' && !angebotSperreFreigegeben && (
                <div className="flex items-start gap-3 bg-[#FFFBEB] border border-[#FDE68A] rounded-xl px-3 py-3">
                  <span className="text-base shrink-0">⚠️</span>
                  <div className="flex-1">
                    <p className="text-xs font-bold text-[#92400E] mb-0.5">Angebot bereits gesendet</p>
                    <p className="text-xs text-[#B45309] mb-2">Es wurde bereits ein Angebot an den Kunden gesendet. Zum erneuten Senden bitte die Sperre aufheben.</p>
                    <button
                      onClick={() => setAngebotSperreFreigegeben(true)}
                      className="text-xs px-3 py-1.5 bg-[#FEF3C7] hover:bg-[#FDE68A] border border-[#FDE68A] text-[#92400E] font-semibold rounded-lg transition-colors"
                    >
                      🔓 Sperre aufheben – erneut senden
                    </button>
                  </div>
                </div>
              )}
              <div className="flex gap-2">
                <button
                  disabled={saving}
                  onClick={() => update({
                    angebotspreis: angebotspreis ? parseFloat(angebotspreis) : undefined,
                    angebotNachricht: angebotNachricht || undefined,
                  })}
                  className="flex-1 px-4 py-2 bg-[#F1F5F9] hover:bg-[#E2EDF7] disabled:opacity-50 text-[#0F172A] text-sm font-semibold rounded-xl transition-colors"
                >
                  Nur speichern
                </button>
                <button
                  disabled={saving || loadingPreview || !angebotspreis || (anfrage.status === 'angebot_gesendet' && !angebotSperreFreigegeben)}
                  onClick={() => {
                    const preis = angebotspreis ? parseFloat(angebotspreis) : undefined
                    void holeVorschau(
                      { typ: 'angebot', angebotspreis: preis, angebotNachricht: angebotNachricht || null },
                      () => update({
                        angebotspreis: preis,
                        angebotNachricht: angebotNachricht || undefined,
                        status: 'angebot_gesendet',
                        sendeAngebotMail: true,
                      })
                    )
                  }}
                  className="flex-1 px-4 py-2 bg-[#0369A1] hover:bg-[#0284c7] disabled:bg-[#94A3B8] text-white text-sm font-semibold rounded-xl transition-colors"
                  title="Zeigt Vorschau — dann an Kunden senden"
                >
                  {loadingPreview ? '…' : saving ? '...' : '📧 Angebot senden'}
                </button>
              </div>
            </div>
          </div>

          {/* Termin */}
          <div className="bg-white rounded-2xl border border-[#E2EDF7] p-6">
            <h2 className="font-bold text-[#0F172A] mb-1">Termin eintragen</h2>
            {(anfrage.status === 'neu' || anfrage.status === 'kontaktiert') && !anfrage.terminVorschlag1 && !anfrage.angebotspreis && (
              <div className="flex items-start gap-2 bg-[#FFFBEB] border border-[#FDE68A] rounded-xl px-3 py-2.5 mb-3">
                <span className="text-sm shrink-0">💡</span>
                <p className="text-xs text-[#92400E]">
                  <strong>Tipp:</strong> Normalerweise wird zuerst ein Angebot gesendet — dann erst der Termin vereinbart. Du kannst aber auch direkt einen Termin setzen.
                </p>
              </div>
            )}
            <p className="text-xs text-[#64748B] mb-4">
              {anfrage.terminVorschlag1
                ? 'Termin aktiv — Ändern schickt automatisch eine Verschiebungs-Mail, Löschen eine Absage-Mail.'
                : 'Termin setzen schickt automatisch eine Bestätigungs-Mail mit .ics-Datei an den Kunden.'}
            </p>
            {anfrage.terminVorschlag1 && (
              <div className="bg-[#F0FDF4] border border-[#86EFAC] rounded-xl px-4 py-3 mb-4">
                <p className="text-xs text-[#166534] font-semibold mb-0.5">Aktueller Termin</p>
                <p className="text-sm font-bold text-[#0F172A]">
                  {new Date(anfrage.terminVorschlag1).toLocaleString('de-DE', { weekday: 'short', day: '2-digit', month: '2-digit', year: 'numeric', hour: '2-digit', minute: '2-digit' })} Uhr
                </p>
                {anfrage.abholadresse && (
                  <div className="mt-2">
                    <p className="text-xs text-[#166534]">📍 {anfrage.abholadresse}</p>
                    {anfrage.abholAdresseZusatz && (
                      <p className="text-xs text-[#4ADE80] mt-0.5 pl-4">{anfrage.abholAdresseZusatz}</p>
                    )}
                    <div className="flex gap-2 mt-2">
                      <a
                        href={`https://maps.google.com/?q=${encodeURIComponent(anfrage.abholadresse)}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex items-center gap-1.5 px-3 py-1.5 bg-white border border-[#86EFAC] rounded-lg text-xs font-semibold text-[#166534] hover:bg-[#F0FDF4] transition-colors"
                      >
                        <span>🗺</span> Google Maps
                      </a>
                      <a
                        href={`https://maps.apple.com/?q=${encodeURIComponent(anfrage.abholadresse)}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex items-center gap-1.5 px-3 py-1.5 bg-white border border-[#86EFAC] rounded-lg text-xs font-semibold text-[#166534] hover:bg-[#F0FDF4] transition-colors"
                      >
                        <span>🍎</span> Apple Maps
                      </a>
                    </div>
                  </div>
                )}
                {!anfrage.abholadresse && anfrage.abholAdresseZusatz && (
                  <p className="text-xs text-[#4ADE80] mt-0.5 pl-4">{anfrage.abholAdresseZusatz}</p>
                )}
              </div>
            )}
            {/* Kein Termin: Formular direkt zeigen */}
            {!anfrage.terminVorschlag1 && (
              <TerminFormular
                terminVorschlag={terminVorschlag}
                setTerminVorschlag={setTerminVorschlag}
                abholadresse={abholadresse}
                setAbholadresse={setAbholadresse}
                abholAdresseZusatz={abholAdresseZusatz}
                setAbholAdresseZusatz={setAbholAdresseZusatz}
                terminMitarbeiterId={terminMitarbeiterId}
                setTerminMitarbeiterId={setTerminMitarbeiterId}
                mitarbeiterListe={mitarbeiterListe}
                firmaAdresse={firmaAdresse}
                saving={saving || loadingPreview}
                istAenderung={false}
                onSave={() => {
                  if (!abholadresse.trim()) { setShowOhneAdresseWarnung(true); return }
                  const updateParams = {
                    terminVorschlag1: terminVorschlag || undefined,
                    abholadresse: abholadresse || undefined,
                    abholAdresseZusatz: abholAdresseZusatz || null,
                    status: anfrage.status !== 'abgeschlossen' ? 'termin_vereinbart' : undefined,
                    bearbeiterId: terminMitarbeiterId || null,
                    terminBearbeiterWechsel: true,
                  }
                  void holeVorschau(
                    { typ: 'termin_bestaetigung', termin: terminVorschlag, adresse: abholadresse || undefined, adresseZusatz: abholAdresseZusatz || null, terminMitarbeiterId: terminMitarbeiterId || null },
                    () => void update(updateParams)
                  )
                }}
                onAbbrechen={null}
                onLoeschen={null}
              />
            )}

            {/* Termin vorhanden: Buttons anzeigen oder Edit-Modus */}
            {anfrage.terminVorschlag1 && !editingTermin && (
              <div className="flex gap-2 mt-2">
                <button
                  onClick={() => {
                    setEditingTermin(true)
                    if (anfrage.terminVorschlag1) {
                      setTerminVorschlag(new Date(anfrage.terminVorschlag1).toISOString().slice(0, 16))
                    }
                  }}
                  className="flex-1 px-4 py-2.5 border border-[#0369A1] text-[#0369A1] text-sm font-semibold rounded-xl hover:bg-[#EFF6FF] transition-colors"
                >
                  📅 Termin ändern
                </button>
                <button
                  disabled={saving}
                  onClick={() => {
                    setTerminLoeschenGrund('wir_sagen_ab')
                    setErsatztermin1(''); setErsatztermin2(''); setTerminKommentar('')
                    setShowTerminModal(true)
                  }}
                  className="px-4 py-2.5 bg-[#FEF2F2] hover:bg-[#FEE2E2] disabled:opacity-50 text-[#991B1B] text-sm font-semibold rounded-xl transition-colors border border-[#FECACA]"
                >
                  Löschen
                </button>
              </div>
            )}

            {anfrage.terminVorschlag1 && editingTermin && (
              <TerminFormular
                terminVorschlag={terminVorschlag}
                setTerminVorschlag={setTerminVorschlag}
                abholadresse={abholadresse}
                setAbholadresse={setAbholadresse}
                abholAdresseZusatz={abholAdresseZusatz}
                setAbholAdresseZusatz={setAbholAdresseZusatz}
                terminMitarbeiterId={terminMitarbeiterId}
                setTerminMitarbeiterId={setTerminMitarbeiterId}
                mitarbeiterListe={mitarbeiterListe}
                firmaAdresse={firmaAdresse}
                saving={saving || loadingPreview}
                istAenderung={true}
                hatAenderung={
                  terminVorschlag !== new Date(anfrage.terminVorschlag1).toISOString().slice(0, 16) ||
                  abholadresse !== (anfrage.abholadresse ?? '') ||
                  abholAdresseZusatz !== (anfrage.abholAdresseZusatz ?? '') ||
                  terminMitarbeiterId !== (anfrage.bearbeiterId ?? '')
                }
                nurMitarbeiterGeaendert={
                  terminMitarbeiterId !== (anfrage.bearbeiterId ?? '') &&
                  terminVorschlag === new Date(anfrage.terminVorschlag1).toISOString().slice(0, 16) &&
                  abholadresse === (anfrage.abholadresse ?? '') &&
                  abholAdresseZusatz === (anfrage.abholAdresseZusatz ?? '')
                }
                onSave={() => {
                  if (!abholadresse.trim()) { setShowOhneAdresseWarnung(true); return }
                  const updateParams = {
                    terminVorschlag1: terminVorschlag || undefined,
                    abholadresse: abholadresse || undefined,
                    abholAdresseZusatz: abholAdresseZusatz || null,
                    status: anfrage.status !== 'abgeschlossen' ? 'termin_vereinbart' : undefined,
                    bearbeiterId: terminMitarbeiterId || null,
                    terminBearbeiterWechsel: true,
                  }
                  void holeVorschau(
                    { typ: 'termin_verschoben', termin: terminVorschlag, alterTermin: anfrage.terminVorschlag1, adresse: abholadresse || undefined, adresseZusatz: abholAdresseZusatz || null, terminMitarbeiterId: terminMitarbeiterId || null },
                    () => { void update(updateParams); setEditingTermin(false) }
                  )
                }}
                onSaveIntern={() => {
                  void update({ bearbeiterId: terminMitarbeiterId || null })
                  setEditingTermin(false)
                }}
                onAbbrechen={() => setEditingTermin(false)}
                onLoeschen={() => {
                  setTerminLoeschenGrund('wir_sagen_ab')
                  setErsatztermin1(''); setErsatztermin2(''); setTerminKommentar('')
                  setShowTerminModal(true)
                  setEditingTermin(false)
                }}
              />
            )}

            {/* Mail erneut senden */}
            {anfrage.terminVorschlag1 && !editingTermin && (
              <button
                disabled={sendingTerminMail || loadingPreview}
                onClick={() => {
                  void holeVorschau(
                    { typ: 'termin_bestaetigung', terminMitarbeiterId: anfrage.bearbeiterId ?? null },
                    async () => {
                      setSendingTerminMail(true)
                      try {
                        const res = await fetch(`/api/dashboard/anfragen/${id}`, {
                          method: 'PATCH',
                          headers: { 'Content-Type': 'application/json' },
                          body: JSON.stringify({ sendeTerminMail: true }),
                        })
                        if (res.ok) toast.success('Bestätigungs-Mail erneut gesendet')
                        else toast.error('Fehler beim Senden')
                      } catch {
                        toast.error('Verbindungsfehler')
                      }
                      setSendingTerminMail(false)
                    }
                  )
                }}
                className="w-full mt-2 px-4 py-2 bg-[#F0FDF4] hover:bg-[#DCFCE7] disabled:opacity-50 text-[#166534] text-sm font-semibold rounded-xl transition-colors border border-[#86EFAC]"
              >
                {loadingPreview ? '…' : sendingTerminMail ? '...' : '📧 Bestätigungs-Mail erneut senden'}
              </button>
            )}
          </div>
        </div>

        {/* Right */}
        <div className="space-y-6">

          {/* Bearbeiter */}
          <BearbeiterBlock
            anfrage={anfrage}
            saving={saving}
            onAssign={(id) => void update({ bearbeiterId: id })}
          />

          {/* Reaktivieren / Löschen (wenn archiviert) */}
          {anfrage.archiviert && (
            <div className="bg-[#FFF7ED] border border-[#FED7AA] rounded-2xl p-5 space-y-2">
              <p className="text-sm font-bold text-[#92400E] mb-1">Archiviert</p>
              <p className="text-xs text-[#B45309] mb-3">Diese Anfrage ist archiviert und erscheint nicht in der aktiven Liste.</p>
              <button
                disabled={saving}
                onClick={() => update({ archiviert: false, status: 'kontaktiert' })}
                className="w-full px-4 py-2.5 bg-white hover:bg-[#FFF7ED] disabled:opacity-50 text-[#92400E] text-sm font-bold rounded-xl transition-colors border border-[#FED7AA]"
              >
                {saving ? '...' : '↩ Reaktivieren'}
              </button>
              <button
                onClick={() => setShowLoeschenModal(true)}
                className="w-full px-4 py-2.5 bg-[#FEF2F2] hover:bg-[#FEE2E2] text-[#991B1B] text-sm font-bold rounded-xl transition-colors border border-[#FECACA]"
              >
                🗑 Endgültig löschen
              </button>
            </div>
          )}

          {/* Status ändern */}
          <div className="bg-white rounded-2xl border border-[#E2EDF7] p-6">
            <h2 className="font-bold text-[#0F172A] mb-4">Status ändern</h2>
            <div className="space-y-2">
              {STATUS_FLOW.filter(s => s !== 'abgeschlossen').map(s => {
                const cfg = STATUS_CONFIG[s]
                const isActive = anfrage.status === s
                return (
                  <button
                    key={s}
                    onClick={() => update({ status: s })}
                    disabled={saving || isActive}
                    className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium transition-colors border ${
                      isActive
                        ? `${cfg.bg} ${cfg.text} border-transparent`
                        : 'border-[#E2EDF7] text-[#64748B] hover:border-[#0369A1] hover:text-[#0369A1]'
                    }`}
                  >
                    <span className={`w-2 h-2 rounded-full flex-shrink-0 ${isActive ? 'bg-current' : 'bg-[#E2EDF7]'}`} />
                    {cfg.label}
                    {isActive && <span className="ml-auto text-xs">← Aktuell</span>}
                  </button>
                )
              })}
              {/* Abgeschlossen – öffnet Modal */}
              <button
                onClick={() => {
                  setAbschlussPreisInput(anfrage.angebotspreis ? String(anfrage.angebotspreis) : '')
                  setShowAbschlussModal(true)
                }}
                disabled={saving || anfrage.status === 'abgeschlossen'}
                className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium transition-colors border ${
                  anfrage.status === 'abgeschlossen'
                    ? 'bg-emerald-100 text-emerald-800 border-transparent'
                    : 'border-[#E2EDF7] text-[#64748B] hover:border-emerald-400 hover:text-emerald-700'
                }`}
              >
                <span className={`w-2 h-2 rounded-full flex-shrink-0 ${anfrage.status === 'abgeschlossen' ? 'bg-current' : 'bg-[#E2EDF7]'}`} />
                Abgeschlossen
                {anfrage.status === 'abgeschlossen'
                  ? <span className="ml-auto text-xs">← Aktuell</span>
                  : <span className="ml-auto text-xs opacity-50">→ Preis erfassen</span>}
              </button>
              {anfrage.status === 'abgeschlossen' && anfrage.abschlussPreis && (
                <p className="text-xs text-emerald-700 bg-emerald-50 border border-emerald-200 rounded-lg px-3 py-2">
                  💰 Bezahlt: <strong>{anfrage.abschlussPreis.toLocaleString('de-DE')} €</strong>
                </p>
              )}
              {/* Abgelehnt – öffnet Nachricht-Modal mit Ablehnung-Modus */}
              <button
                onClick={() => { setNachrichtInitialModus('ablehnung'); setShowNachrichtModal(true) }}
                disabled={saving || anfrage.status === 'abgelehnt'}
                className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium transition-colors border ${
                  anfrage.status === 'abgelehnt'
                    ? 'bg-red-100 text-red-800 border-transparent'
                    : 'border-[#E2EDF7] text-[#64748B] hover:border-red-300 hover:text-red-600'
                }`}
              >
                <span className={`w-2 h-2 rounded-full flex-shrink-0 ${anfrage.status === 'abgelehnt' ? 'bg-current' : 'bg-[#E2EDF7]'}`} />
                Abgelehnt / Kein Kauf
                {anfrage.status === 'abgelehnt'
                  ? <span className="ml-auto text-xs">← Aktuell</span>
                  : <span className="ml-auto text-xs opacity-50">→ Grund angeben</span>}
              </button>
              {anfrage.status === 'abgelehnt' && anfrage.ablehnungsGrund && (
                <p className="text-xs text-red-700 bg-red-50 border border-red-200 rounded-lg px-3 py-2">
                  Grund: {anfrage.ablehnungsGrund}
                </p>
              )}
            </div>
          </div>

          {/* Notizen */}
          {(() => {
            const letzteNotiz = anfrage.aktivitaeten.find(a => a.aktion === 'notiz_gespeichert')
            const hatNotiz = !!anfrage.notizen?.trim()
            return (
              <div className={`bg-white rounded-2xl border-2 p-6 transition-colors ${hatNotiz ? 'border-[#FDE68A]' : 'border-[#E2EDF7]'}`}>
                <div className="flex items-center gap-2 mb-4">
                  {hatNotiz && (
                    <span className="inline-flex items-center gap-1 px-2 py-0.5 bg-[#FFFBEB] border border-[#FDE68A] rounded-full text-[11px] font-bold text-[#92400E]">
                      📝 Notiz vorhanden
                    </span>
                  )}
                  <h2 className="font-bold text-[#0F172A]">Interne Notizen</h2>
                </div>
                {letzteNotiz?.mitarbeiter && (
                  <p className="text-[11px] text-[#94A3B8] mb-2 flex items-center gap-1.5">
                    <span
                      className="inline-flex items-center justify-center w-4 h-4 rounded-full text-white text-[8px] font-bold"
                      style={{ backgroundColor: letzteNotiz.mitarbeiter.farbe }}
                    >
                      {letzteNotiz.mitarbeiter.kuerzel ?? (letzteNotiz.mitarbeiter.vorname[0] + letzteNotiz.mitarbeiter.nachname[0]).toUpperCase()}
                    </span>
                    Zuletzt von <span className="font-semibold text-[#64748B]">{letzteNotiz.mitarbeiter.vorname} {letzteNotiz.mitarbeiter.nachname}</span>
                    {' · '}
                    {new Date(letzteNotiz.createdAt).toLocaleString('de-DE', { day: '2-digit', month: '2-digit', year: 'numeric', hour: '2-digit', minute: '2-digit' })} Uhr
                  </p>
                )}
                {/* Schnellauswahl Notizen – Dropdown */}
                <div className="mb-2 relative">
                  <select
                    defaultValue=""
                    onChange={e => {
                      if (e.target.value) {
                        setNotizen(prev => prev.trim() ? prev.trimEnd() + '\n' + e.target.value : e.target.value)
                        e.currentTarget.value = ''
                      }
                    }}
                    className="w-full pl-3 pr-8 py-2.5 border border-[#E2EDF7] rounded-xl text-sm text-[#64748B] bg-white appearance-none cursor-pointer focus:outline-none focus:ring-2 focus:ring-[#0369A1] focus:border-transparent min-h-[48px]"
                  >
                    <option value="">Notiz-Vorlage einfügen…</option>
                    {[
                      'Wartet auf Rückmeldung',
                      'Preis verhandelbar',
                      'Termin ausstehend',
                      'Finanzierung läuft noch',
                      'Fahrzeug besichtigt',
                      'Mehrere Interessenten',
                      'Reparatur läuft noch',
                      'Wiedervorlage in 1 Woche',
                    ].map(v => <option key={v} value={v}>{v}</option>)}
                  </select>
                  <span className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 text-[#94A3B8]">
                    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                      <path d="M6 9l6 6 6-6" strokeLinecap="round" strokeLinejoin="round"/>
                    </svg>
                  </span>
                </div>
                <textarea
                  value={notizen}
                  onChange={e => setNotizen(e.target.value)}
                  rows={4}
                  placeholder="Interne Notizen (nur für das Team sichtbar)..."
                  className="w-full px-3 py-2.5 border border-[#E2EDF7] rounded-xl text-sm text-[#0F172A] resize-none focus:outline-none focus:ring-2 focus:ring-[#0369A1] focus:border-transparent"
                />
                <button
                  disabled={saving}
                  onClick={() => update({ notizen })}
                  className="mt-3 px-4 py-2 bg-[#F1F5F9] hover:bg-[#E2EDF7] disabled:opacity-50 text-[#0F172A] text-sm font-semibold rounded-xl transition-colors w-full"
                >
                  Notizen speichern
                </button>
              </div>
            )
          })()}

          {/* Archivieren (wenn nicht archiviert) */}
          {!anfrage.archiviert && (
            <div className="bg-white rounded-2xl border border-[#E2EDF7] p-5">
              {!showArchivierenConfirm ? (
                <button
                  onClick={() => setShowArchivierenConfirm(true)}
                  className="w-full text-xs text-[#64748B] hover:text-[#64748B] transition-colors text-left"
                >
                  🗄 Anfrage archivieren
                </button>
              ) : (
                <div>
                  <p className="text-sm font-bold text-[#0F172A] mb-1">Anfrage archivieren?</p>
                  <p className="text-xs text-[#64748B] mb-4">Keine Mail wird gesendet. Die Anfrage kann jederzeit reaktiviert werden.</p>
                  <div className="flex gap-2">
                    <button
                      onClick={() => setShowArchivierenConfirm(false)}
                      className="flex-1 px-3 py-2 border border-[#E2EDF7] rounded-xl text-xs text-[#64748B] hover:border-[#0369A1] hover:text-[#0369A1] transition-colors font-medium"
                    >
                      Abbrechen
                    </button>
                    <button
                      disabled={saving}
                      onClick={() => {
                        setShowArchivierenConfirm(false)
                        update({ archiviert: true, status: 'abgelehnt' })
                      }}
                      className="flex-1 px-3 py-2 bg-[#F1F5F9] hover:bg-[#E2EDF7] disabled:opacity-50 text-[#0F172A] text-xs font-bold rounded-xl transition-colors"
                    >
                      Ja, archivieren
                    </button>
                  </div>
                </div>
              )}
            </div>
          )}

          {/* Schnellzugriff */}
          <div className="bg-white rounded-2xl border border-[#E2EDF7] p-6">
            <h2 className="font-bold text-[#0F172A] mb-4">Schnellzugriff</h2>
            <div className="space-y-2">

              {/* Nachricht / Rückfrage senden */}
              <div className="flex gap-1.5">
                <button
                  onClick={() => { setNachrichtInitialModus('rueckfrage'); setShowNachrichtModal(true) }}
                  className="flex-1 flex items-center justify-center gap-2 px-3 py-2.5 border border-[#E2EDF7] rounded-xl text-xs font-semibold text-[#0369A1] hover:border-[#0369A1] hover:bg-[#E8F4FD] transition-colors"
                >
                  <span>?</span> Rückfrage
                </button>
                <button
                  onClick={() => { setNachrichtInitialModus('freinachricht'); setShowNachrichtModal(true) }}
                  className="flex-1 flex items-center justify-center gap-2 px-3 py-2.5 border border-[#E2EDF7] rounded-xl text-xs font-semibold text-[#64748B] hover:border-[#0369A1] hover:text-[#0369A1] transition-colors"
                >
                  <span>✉</span> Nachricht
                </button>
              </div>

              {anfrage.telefon ? (
                <a
                  href={`tel:${anfrage.telefon}`}
                  className="flex items-center gap-3 px-4 py-3 border border-[#E2EDF7] rounded-xl text-sm text-[#64748B] hover:text-[#0369A1] hover:border-[#0369A1] transition-colors"
                >
                  <Phone size={16} strokeWidth={2.5} color="#0369A1" />
                  {anfrage.telefon}
                </a>
              ) : (
                <div className="flex items-center gap-3 px-4 py-3 border border-[#E2EDF7] rounded-xl text-sm text-[#94A3B8] bg-[#F8FAFC]">
                  <Phone size={16} strokeWidth={2.5} color="#CBD5E1" />
                  Nur per E-Mail kontaktieren
                </div>
              )}
              <a
                href={`mailto:${anfrage.email}`}
                className="flex items-center gap-3 px-4 py-3 border border-[#E2EDF7] rounded-xl text-sm text-[#64748B] hover:text-[#0369A1] hover:border-[#0369A1] transition-colors"
              >
                <Mail size={16} strokeWidth={2.5} color="#0369A1" />
                {anfrage.email}
              </a>
              {anfrage.telefon && (
                <a
                  href={`https://wa.me/${anfrage.telefon.replace(/^\+/, '').replace(/^0049/, '49').replace(/^0([1-9])/, '49$1').replace(/\D/g, '')}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-3 px-4 py-3 border border-[#E2EDF7] rounded-xl text-sm text-[#64748B] hover:text-[#16A34A] hover:border-[#16A34A] transition-colors"
                >
                  <MessageCircle size={16} strokeWidth={2.5} color="#25D366" />
                  WhatsApp Kunde
                </a>
              )}
              <a
                href={`https://wa.me/?text=${encodeURIComponent(
                  `📋 Anfrage: ${anfrage.vorname} ${anfrage.nachname}\n🚗 ${anfrage.marke} ${anfrage.modell} (${anfrage.erstzulassungJahr})\n📏 ${anfrage.kilometerstand.toLocaleString('de-DE')} km · ${anfrage.kraftstoff}${anfrage.angebotspreis ? `\n💶 Angebot: ${anfrage.angebotspreis.toLocaleString('de-DE')} €` : ''}${anfrage.telefon ? `\n📞 ${anfrage.telefon}` : ''}`
                )}`}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-3 px-4 py-3 border border-[#E2EDF7] rounded-xl text-sm text-[#64748B] hover:text-[#16A34A] hover:border-[#16A34A] transition-colors"
              >
                <Share2 size={16} strokeWidth={2.5} color="#25D366" />
                An Kollegen teilen
              </a>
            </div>
          </div>

          {/* Aktivitätslog */}
          {anfrage.aktivitaeten.length > 0 && (() => {
            const VERLAUF_CONFIG: Record<string, { label: string; icon: string; dotColor: string; isMail?: boolean }> = {
              status_geaendert:         { label: 'Status geändert',                       icon: '↕',  dotColor: '#64748B' },
              reaktiviert:              { label: 'Reaktiviert',                           icon: '🔄', dotColor: '#0369A1' },
              angebot_mail_gesendet:    { label: 'Angebot-Mail gesendet',                 icon: '💌', dotColor: '#7C3AED', isMail: true },
              termin_bestaetigt:        { label: 'Terminbestätigung gesendet',            icon: '📅', dotColor: '#059669', isMail: true },
              termin_verschoben:        { label: 'Termin geändert – Mail gesendet',       icon: '🔄', dotColor: '#D97706', isMail: true },
              archiviert:               { label: 'Archiviert',                            icon: '📁', dotColor: '#64748B' },
              termin_abgesagt:          { label: 'Terminabsage gesendet',                 icon: '✉️', dotColor: '#DC2626', isMail: true },
              termin_mail_erneut:       { label: 'Bestätigungs-Mail erneut gesendet',     icon: '📧', dotColor: '#0369A1', isMail: true },
              ablehnung_mail_gesendet:  { label: 'Ablehnungs-Mail gesendet',              icon: '✗',  dotColor: '#DC2626', isMail: true },
              rueckfrage_gesendet:      { label: 'Rückfrage gesendet',                    icon: '?',  dotColor: '#0369A1', isMail: true },
              nachricht_gesendet:       { label: 'Nachricht gesendet',                    icon: '✉',  dotColor: '#0F172A', isMail: true },
              bearbeiter_mail_gesendet: { label: 'Ansprechpartner-Wechsel gesendet',      icon: '👤', dotColor: '#0369A1', isMail: true },
              notiz_gespeichert:        { label: 'Interne Notiz',                         icon: '📝', dotColor: '#F59E0B' },
              bearbeiter_zugewiesen:    { label: 'Bearbeiter zugewiesen',                 icon: '👤', dotColor: '#0369A1' },
            }
            return (
              <div className="bg-white rounded-2xl border border-[#E2EDF7] p-6">
                <h2 className="font-bold text-[#0F172A] mb-4">Verlauf</h2>
                <div className="space-y-2">
                  {anfrage.aktivitaeten.map(log => {
                    const cfg = VERLAUF_CONFIG[log.aktion] ?? { label: log.aktion.replace(/_/g, ' '), icon: '·', dotColor: '#94A3B8' }
                    const ma = log.mitarbeiter
                    const mailTyp = cfg.isMail ? AKTION_TO_MAIL_TYP[log.aktion] : undefined
                    const isClickable = !!mailTyp
                    const isLoading = verlaufMailLoading === log.id
                    const entryClass = `flex gap-3 rounded-xl px-3 py-2.5 ${cfg.isMail ? 'bg-[#F0F7FF] border border-[#BFDBFE]' : 'bg-[#F8FAFC]'}`
                    const innerContent = (
                      <>
                        <div className="shrink-0 w-7 h-7 rounded-full flex items-center justify-center text-sm bg-white border border-[#E2EDF7]">
                          {isLoading ? <span className="text-xs animate-spin">⟳</span> : cfg.icon}
                        </div>
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center gap-2 flex-wrap">
                            <p className={`text-xs font-semibold ${cfg.isMail ? 'text-[#1E3A8A]' : 'text-[#0F172A]'}`}>{cfg.label}</p>
                            {isClickable && (
                              <span className="text-[10px] text-[#0369A1] font-medium">
                                {isLoading ? 'Lädt…' : '👁 E-Mail anzeigen'}
                              </span>
                            )}
                            {ma && (
                              <span
                                className="shrink-0 inline-flex items-center justify-center w-5 h-5 rounded-full text-white text-[9px] font-bold"
                                style={{ backgroundColor: ma.farbe }}
                                title={`${ma.vorname} ${ma.nachname}`}
                              >
                                {ma.kuerzel ?? (ma.vorname[0] + ma.nachname[0]).toUpperCase()}
                              </span>
                            )}
                          </div>
                          {log.details && <p className="text-xs text-[#64748B] mt-0.5">{log.details}</p>}
                          <p className="text-xs text-[#94A3B8] mt-0.5">
                            {new Date(log.createdAt).toLocaleString('de-DE', { day: '2-digit', month: '2-digit', year: 'numeric', hour: '2-digit', minute: '2-digit' })} Uhr
                          </p>
                        </div>
                      </>
                    )
                    if (isClickable) {
                      return (
                        <button
                          key={log.id}
                          disabled={verlaufMailLoading !== null}
                          onClick={async () => {
                            setVerlaufMailLoading(log.id)
                            try {
                              const res = await fetch(`/api/dashboard/mail-log?anfrageId=${id}&typ=${mailTyp}&limit=20`)
                              if (res.ok) {
                                const data = await res.json() as { logs: MailLogEntry[] }
                                const aktTime = new Date(log.createdAt).getTime()
                                const best = data.logs.sort((a, b) =>
                                  Math.abs(new Date(a.createdAt).getTime() - aktTime) -
                                  Math.abs(new Date(b.createdAt).getTime() - aktTime)
                                )[0]
                                if (best) {
                                  setAngebotVorschauId(best.id)
                                } else {
                                  toast('Keine E-Mail-Vorschau verfügbar.', { icon: 'ℹ️' })
                                }
                              }
                            } catch {
                              toast.error('Fehler beim Laden der E-Mail')
                            }
                            setVerlaufMailLoading(null)
                          }}
                          className={`w-full text-left ${entryClass} hover:opacity-90 transition-opacity disabled:cursor-wait`}
                        >
                          {innerContent}
                        </button>
                      )
                    }
                    return (
                      <div key={log.id} className={entryClass}>
                        {innerContent}
                      </div>
                    )
                  })}
                </div>
              </div>
            )
          })()}
        </div>
      </div>
    </div>

    {/* Foto-Galerie-Modal */}
    {galerieFotoIndex !== null && anfrage.fotos?.length > 0 && (
      <div
        className="fixed inset-0 z-50 flex items-center justify-center bg-black/90"
        onClick={() => setGalerieFotoIndex(null)}
      >
        <button
          className="absolute top-4 right-4 w-10 h-10 flex items-center justify-center rounded-full bg-white/10 hover:bg-white/20 text-white transition-colors text-lg z-10"
          onClick={() => setGalerieFotoIndex(null)}
          aria-label="Schließen"
        >
          ✕
        </button>
        {/* Prev */}
        {galerieFotoIndex > 0 && (
          <button
            className="absolute left-3 sm:left-6 w-10 h-10 flex items-center justify-center rounded-full bg-white/10 hover:bg-white/20 text-white transition-colors text-xl z-10"
            onClick={e => { e.stopPropagation(); setGalerieFotoIndex(i => i! - 1) }}
            aria-label="Vorheriges Foto"
          >
            ‹
          </button>
        )}
        {/* Next */}
        {galerieFotoIndex < anfrage.fotos.length - 1 && (
          <button
            className="absolute right-3 sm:right-6 w-10 h-10 flex items-center justify-center rounded-full bg-white/10 hover:bg-white/20 text-white transition-colors text-xl z-10"
            onClick={e => { e.stopPropagation(); setGalerieFotoIndex(i => i! + 1) }}
            aria-label="Nächstes Foto"
          >
            ›
          </button>
        )}
        <div className="flex flex-col items-center gap-4 px-14 sm:px-20 max-w-5xl w-full" onClick={e => e.stopPropagation()}>
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={anfrage.fotos[galerieFotoIndex]}
            alt={`Foto ${galerieFotoIndex + 1}`}
            className="max-h-[75vh] max-w-full object-contain rounded-xl shadow-2xl"
          />
          <p className="text-white/60 text-sm">{galerieFotoIndex + 1} / {anfrage.fotos.length}</p>
          {/* Thumbnails */}
          <div className="flex gap-2 overflow-x-auto pb-1 max-w-full">
            {anfrage.fotos.map((src, i) => (
              <button
                key={i}
                onClick={() => setGalerieFotoIndex(i)}
                className={`shrink-0 w-14 h-14 rounded-lg overflow-hidden border-2 transition-colors ${i === galerieFotoIndex ? 'border-white' : 'border-transparent opacity-50 hover:opacity-80'}`}
              >
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img src={src} alt={`Thumb ${i + 1}`} className="w-full h-full object-cover" />
              </button>
            ))}
          </div>
        </div>
      </div>
    )}

    {/* Angebot-Mail-Vorschau-Modal */}
    {angebotVorschauId && (
      <MailVorschauModal
        logId={angebotVorschauId}
        onClose={() => setAngebotVorschauId(null)}
      />
    )}

    {mailVorschauId && (
      <MailVorschauModal
        logId={mailVorschauId}
        onClose={() => setMailVorschauId(null)}
      />
    )}

    {/* Auto-Preloader beim Erstellen der Email-Vorschau */}
    {loadingPreview && <EmailPreviewLader />}

    {/* Email-Vorschau-Confirm-Modal (vor dem Senden) */}
    {sendVorschau && (
      <EmailVorschauConfirmModal
        subject={sendVorschau.subject}
        html={sendVorschau.html}
        sending={saving || sendingTerminMail}
        onConfirm={() => {
          setSendVorschau(null)
          sendVorschau.onConfirm()
        }}
        onClose={() => setSendVorschau(null)}
      />
    )}

    {/* Warnung: Termin ohne Adresse */}
    {showOhneAdresseWarnung && (
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50">
        <div className="bg-white rounded-2xl w-full max-w-sm shadow-2xl p-6">
          <div className="w-12 h-12 bg-[#FFFBEB] rounded-full flex items-center justify-center mx-auto mb-4">
            <span className="text-2xl">📍</span>
          </div>
          <h3 className="text-base font-black text-[#0F172A] text-center mb-2">Keine Adresse angegeben</h3>
          <p className="text-sm text-[#64748B] text-center mb-6">
            Die Bestätigungs-Mail an den Kunden enthält dann keinen Treffpunkt. Trotzdem senden?
          </p>
          <div className="flex gap-2">
            <button
              onClick={() => setShowOhneAdresseWarnung(false)}
              className="flex-1 px-4 py-2.5 border border-[#E2EDF7] rounded-xl text-sm font-semibold text-[#64748B] hover:border-[#0369A1] hover:text-[#0369A1] transition-colors"
            >
              Abbrechen
            </button>
            <button
              onClick={() => {
                setShowOhneAdresseWarnung(false)
                void update({
                  terminVorschlag1: terminVorschlag || undefined,
                  abholadresse: undefined,
                  abholAdresseZusatz: null,
                  status: anfrage.status === 'neu' || anfrage.status === 'kontaktiert' || anfrage.status === 'angebot_gesendet'
                    ? 'termin_vereinbart' : undefined,
                })
              }}
              className="flex-1 px-4 py-2.5 bg-[#0369A1] hover:bg-[#0284c7] text-white text-sm font-bold rounded-xl transition-colors"
            >
              Trotzdem senden
            </button>
          </div>
        </div>
      </div>
    )}

    {/* Termin-Löschen-Modal */}
    {showTerminModal && (
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50">
        <div className="bg-white rounded-2xl border border-[#E2EDF7] w-full max-w-md shadow-2xl">
          <div className="p-6">
            <h3 className="text-base font-black text-[#0F172A] mb-1">Termin löschen</h3>
            <p className="text-xs text-[#64748B] mb-5">Was ist der Grund für die Absage?</p>

            {/* Optionen */}
            <div className="space-y-2 mb-5">
              {([
                { key: 'wir_sagen_ab', label: 'Wir sagen ab', desc: 'Kunde erhält Absage-Mail von uns (optional mit Ersatzterminen)' },
                { key: 'kunde_andertermin', label: 'Kunde hat abgesagt — möchte anderen Termin', desc: 'Neutrale Bestätigungs-Mail, wir melden uns für neuen Termin' },
                { key: 'kein_interesse', label: 'Kein Interesse', desc: 'Anfrage wird archiviert, keine Mail' },
              ] as const).map(opt => (
                <label key={opt.key} className={`flex items-start gap-3 px-4 py-3 rounded-xl border cursor-pointer transition-colors ${
                  terminLoeschenGrund === opt.key
                    ? 'bg-[#EFF6FF] border-[#0369A1]'
                    : 'border-[#E2EDF7] hover:border-[#0369A1]'
                }`}>
                  <input
                    type="radio"
                    name="terminGrund"
                    value={opt.key}
                    checked={terminLoeschenGrund === opt.key}
                    onChange={() => setTerminLoeschenGrund(opt.key)}
                    className="mt-0.5 accent-[#0369A1]"
                  />
                  <div>
                    <p className="text-sm font-semibold text-[#0F172A]">{opt.label}</p>
                    <p className="text-xs text-[#64748B]">{opt.desc}</p>
                  </div>
                </label>
              ))}
            </div>

            {/* Zusatzfelder je nach Option */}
            {terminLoeschenGrund === 'wir_sagen_ab' && (
              <div className="space-y-3 mb-5">
                <div>
                  <label className="block text-xs text-[#64748B] mb-1.5">Ersatztermin 1 (optional)</label>
                  <input
                    type="datetime-local"
                    value={ersatztermin1}
                    step={900}
                    onChange={e => setErsatztermin1(snap15(e.target.value))}
                    className="w-full px-3 py-2.5 border border-[#E2EDF7] rounded-xl text-sm text-[#0F172A] focus:outline-none focus:ring-2 focus:ring-[#0369A1] focus:border-transparent"
                  />
                </div>
                <div>
                  <label className="block text-xs text-[#64748B] mb-1.5">Ersatztermin 2 (optional)</label>
                  <input
                    type="datetime-local"
                    value={ersatztermin2}
                    step={900}
                    onChange={e => setErsatztermin2(snap15(e.target.value))}
                    className="w-full px-3 py-2.5 border border-[#E2EDF7] rounded-xl text-sm text-[#0F172A] focus:outline-none focus:ring-2 focus:ring-[#0369A1] focus:border-transparent"
                  />
                </div>
                <div>
                  <label className="block text-xs text-[#64748B] mb-1.5">Kommentar an Kunden (optional)</label>
                  <textarea
                    value={terminKommentar}
                    onChange={e => setTerminKommentar(e.target.value)}
                    rows={2}
                    placeholder="z.B. Wir haben leider einen Notfall..."
                    className="w-full px-3 py-2.5 border border-[#E2EDF7] rounded-xl text-sm text-[#0F172A] focus:outline-none focus:ring-2 focus:ring-[#0369A1] focus:border-transparent resize-none"
                  />
                </div>
              </div>
            )}

            {terminLoeschenGrund === 'kunde_andertermin' && (
              <div className="mb-5">
                <label className="block text-xs text-[#64748B] mb-1.5">Kommentar an Kunden (optional)</label>
                <textarea
                  value={terminKommentar}
                  onChange={e => setTerminKommentar(e.target.value)}
                  rows={2}
                  placeholder="z.B. Gerne bis Ende der Woche melden..."
                  className="w-full px-3 py-2.5 border border-[#E2EDF7] rounded-xl text-sm text-[#0F172A] focus:outline-none focus:ring-2 focus:ring-[#0369A1] focus:border-transparent resize-none"
                />
              </div>
            )}

            {terminLoeschenGrund === 'kein_interesse' && (
              <div className="bg-[#FEF2F2] border border-[#FECACA] rounded-xl px-4 py-3 mb-5">
                <p className="text-xs text-[#991B1B]">Die Anfrage wird als <strong>Abgelehnt</strong> archiviert. Es wird keine Mail an den Kunden gesendet.</p>
              </div>
            )}

            {/* Buttons */}
            <div className="flex gap-2">
              <button
                onClick={() => setShowTerminModal(false)}
                className="flex-1 px-4 py-2.5 border border-[#E2EDF7] rounded-xl text-sm font-semibold text-[#64748B] hover:border-[#0369A1] hover:text-[#0369A1] transition-colors"
              >
                Abbrechen
              </button>
              <button
                disabled={saving || loadingPreview}
                onClick={() => {
                  const doDelete = () => {
                    setShowTerminModal(false)
                    setTerminVorschlag(defaultTermin())
                    update({
                      terminVorschlag1: null,
                      terminLoeschenGrund,
                      ersatztermin1: ersatztermin1 || null,
                      ersatztermin2: ersatztermin2 || null,
                      terminKommentar: terminKommentar || null,
                    })
                  }
                  // Bei kein_interesse: kein Mail → direkt löschen
                  if (terminLoeschenGrund === 'kein_interesse') {
                    doDelete()
                    return
                  }
                  // Sonst: Vorschau zeigen
                  const previewTyp = terminLoeschenGrund === 'wir_sagen_ab' ? 'termin_abgesagt' : 'termin_kunde_abgesagt'
                  void holeVorschau(
                    {
                      typ: previewTyp,
                      alterTermin: anfrage.terminVorschlag1,
                      ersatztermin1: ersatztermin1 || null,
                      ersatztermin2: ersatztermin2 || null,
                      kommentar: terminKommentar || null,
                    },
                    doDelete
                  )
                }}
                className="flex-1 px-4 py-2.5 bg-[#991B1B] hover:bg-[#7F1D1D] disabled:opacity-50 text-white text-sm font-bold rounded-xl transition-colors"
              >
                {loadingPreview ? '…' : terminLoeschenGrund === 'kein_interesse' ? 'Löschen' : 'Vorschau & Löschen'}
              </button>
            </div>
          </div>
        </div>
      </div>
    )}

    {/* Abschluss-Modal */}
    {showAbschlussModal && (
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50">
        <div className="bg-white rounded-2xl border border-[#E2EDF7] w-full max-w-sm shadow-2xl">
          <div className="p-6">
            <div className="w-12 h-12 bg-[#F0FDF4] rounded-full flex items-center justify-center mx-auto mb-4">
              <span className="text-2xl">🤝</span>
            </div>
            <h3 className="text-base font-black text-[#0F172A] text-center mb-1">Kauf abschließen</h3>
            <p className="text-sm text-[#64748B] text-center mb-5">
              {anfrage.marke} {anfrage.modell} · {anfrage.vorname} {anfrage.nachname}
            </p>
            <div className="mb-4">
              <label className="block text-xs font-semibold text-[#0F172A] mb-1.5">
                Tatsächlich bezahlter Preis
                <span className="ml-1 text-[#94A3B8] font-normal">(optional, für interne Dokumentation)</span>
              </label>
              {anfrage.angebotspreis && (
                <p className="text-[11px] text-[#64748B] mb-2">
                  Angebotspreiss: <strong>{anfrage.angebotspreis.toLocaleString('de-DE')} €</strong>
                  {' '}
                  <button type="button" onClick={() => setAbschlussPreisInput(String(anfrage.angebotspreis))} className="text-[#0369A1] hover:underline">übernehmen</button>
                </p>
              )}
              <div className="relative">
                <input
                  type="number"
                  min="0"
                  placeholder="z.B. 4500"
                  value={abschlussPreisInput}
                  onChange={e => setAbschlussPreisInput(e.target.value)}
                  className="w-full px-3 py-2.5 pr-8 border border-[#E2EDF7] rounded-xl text-sm text-[#0F172A] focus:outline-none focus:ring-2 focus:ring-[#22C55E] focus:border-transparent"
                />
                <span className="absolute right-3 top-1/2 -translate-y-1/2 text-[#94A3B8] text-sm font-medium">€</span>
              </div>
            </div>
            <div className="flex gap-2">
              <button
                onClick={() => setShowAbschlussModal(false)}
                className="flex-1 px-4 py-2.5 border border-[#E2EDF7] rounded-xl text-sm font-semibold text-[#64748B] hover:bg-[#F8FAFC] transition-colors"
              >
                Abbrechen
              </button>
              <button
                disabled={saving}
                onClick={() => {
                  const preis = abschlussPreisInput ? parseFloat(abschlussPreisInput) : null
                  void update({ status: 'abgeschlossen', abschlussPreis: preis })
                  setShowAbschlussModal(false)
                }}
                className="flex-1 px-4 py-2.5 bg-emerald-600 hover:bg-emerald-700 disabled:opacity-50 text-white text-sm font-semibold rounded-xl transition-colors"
              >
                Abschließen ✓
              </button>
            </div>
          </div>
        </div>
      </div>
    )}

    {/* Nachricht-Modal (Ablehnung mit Mail / Rückfrage / Freie Nachricht) */}
    {showNachrichtModal && anfrage && (
      <NachrichtModal
        anfrageId={anfrage.id}
        vorname={anfrage.vorname}
        marke={anfrage.marke}
        modell={anfrage.modell}
        initialModus={nachrichtInitialModus}
        onClose={() => setShowNachrichtModal(false)}
        onGesendet={(neuerStatus, mailTyp) => {
          if (neuerStatus) {
            setAnfrage(prev => prev ? { ...prev, status: neuerStatus, archiviert: true } : prev)
          }
          void refreshVerlauf()
          if (mailTyp) void checkMailStatus(mailTyp)
        }}
      />
    )}

    {/* Ablehnen-Modal (intern, kein E-Mail – für schnelle Status-Änderung ohne Mail) */}
    {showAblehnungModal && (
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50">
        <div className="bg-white rounded-2xl border border-[#E2EDF7] w-full max-w-sm shadow-2xl">
          <div className="p-6">
            <div className="w-12 h-12 bg-[#FEF2F2] rounded-full flex items-center justify-center mx-auto mb-4">
              <span className="text-2xl">✗</span>
            </div>
            <h3 className="text-base font-black text-[#0F172A] text-center mb-1">Anfrage ablehnen</h3>
            <p className="text-sm text-[#64748B] text-center mb-5">
              {anfrage.marke} {anfrage.modell} · {anfrage.vorname} {anfrage.nachname}
            </p>
            <div className="mb-4 space-y-2">
              {[
                { value: 'kein_interesse_kunde', label: 'Kunde hat kein Interesse mehr' },
                { value: 'kein_interesse_wir', label: 'Fahrzeug entspricht nicht unseren Kriterien' },
                { value: 'keine_rueckmeldung', label: 'Keine Rückmeldung vom Kunden' },
                { value: 'sonstiges', label: 'Sonstiges' },
              ].map(opt => (
                <label key={opt.value} className={`flex items-center gap-3 px-3 py-2.5 rounded-xl border cursor-pointer transition-colors ${ablehnungsGrund === opt.value ? 'border-red-300 bg-red-50' : 'border-[#E2EDF7] hover:border-red-200'}`}>
                  <input type="radio" name="ablehnungsGrund" value={opt.value} checked={ablehnungsGrund === opt.value} onChange={() => setAblehnungsGrund(opt.value)} className="sr-only" />
                  <span className={`w-4 h-4 rounded-full border-2 flex-shrink-0 flex items-center justify-center ${ablehnungsGrund === opt.value ? 'border-red-500 bg-red-500' : 'border-[#CBD5E1]'}`}>
                    {ablehnungsGrund === opt.value && <span className="w-1.5 h-1.5 rounded-full bg-white" />}
                  </span>
                  <span className="text-sm text-[#0F172A]">{opt.label}</span>
                </label>
              ))}
              {ablehnungsGrund === 'sonstiges' && (
                <textarea
                  placeholder="Bitte kurz beschreiben..."
                  value={ablehnungSonstiges}
                  onChange={e => setAblehnungSonstiges(e.target.value)}
                  rows={2}
                  className="w-full px-3 py-2 border border-[#E2EDF7] rounded-xl text-sm text-[#0F172A] focus:outline-none focus:ring-2 focus:ring-red-300 resize-none"
                />
              )}
            </div>
            <div className="flex gap-2">
              <button
                onClick={() => setShowAblehnungModal(false)}
                className="flex-1 px-4 py-2.5 border border-[#E2EDF7] rounded-xl text-sm font-semibold text-[#64748B] hover:bg-[#F8FAFC] transition-colors"
              >
                Abbrechen
              </button>
              <button
                disabled={saving || (ablehnungsGrund === 'sonstiges' && !ablehnungSonstiges.trim())}
                onClick={() => {
                  const grund = ablehnungsGrund === 'sonstiges'
                    ? ablehnungSonstiges.trim()
                    : { kein_interesse_kunde: 'Kein Interesse – Kunde hat abgesagt', kein_interesse_wir: 'Kein Interesse – Fahrzeug entspricht nicht unseren Kriterien', keine_rueckmeldung: 'Keine Rückmeldung vom Kunden' }[ablehnungsGrund] ?? ablehnungsGrund
                  void update({ status: 'abgelehnt', ablehnungsGrund: grund })
                  setShowAblehnungModal(false)
                }}
                className="flex-1 px-4 py-2.5 bg-red-600 hover:bg-red-700 disabled:opacity-50 text-white text-sm font-semibold rounded-xl transition-colors"
              >
                Ablehnen
              </button>
            </div>
          </div>
        </div>
      </div>
    )}

    {/* Endgültig löschen Modal */}
    {showLoeschenModal && (
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50">
        <div className="bg-white rounded-2xl border border-[#E2EDF7] w-full max-w-sm shadow-2xl">
          <div className="p-6">
            <div className="w-12 h-12 bg-[#FEF2F2] rounded-full flex items-center justify-center mx-auto mb-4">
              <span className="text-2xl">🗑</span>
            </div>
            <h3 className="text-base font-black text-[#0F172A] text-center mb-2">Endgültig löschen?</h3>
            <p className="text-sm text-[#64748B] text-center mb-1">
              <strong>{anfrage.vorname} {anfrage.nachname}</strong> — {anfrage.marke} {anfrage.modell}
            </p>
            <p className="text-xs text-[#64748B] text-center mb-6">
              Alle Daten, Fotos und der Verlauf werden unwiderruflich gelöscht.
            </p>
            <div className="flex gap-2">
              <button
                onClick={() => setShowLoeschenModal(false)}
                disabled={deleting}
                className="flex-1 px-4 py-2.5 border border-[#E2EDF7] rounded-xl text-sm font-semibold text-[#64748B] hover:border-[#0369A1] hover:text-[#0369A1] transition-colors"
              >
                Abbrechen
              </button>
              <button
                onClick={() => void endgueltigLoeschen()}
                disabled={deleting}
                className="flex-1 px-4 py-2.5 bg-[#991B1B] hover:bg-[#7F1D1D] disabled:opacity-50 text-white text-sm font-bold rounded-xl transition-colors"
              >
                {deleting ? 'Löscht...' : 'Ja, löschen'}
              </button>
            </div>
          </div>
        </div>
      </div>
    )}
    </>
  )
}
