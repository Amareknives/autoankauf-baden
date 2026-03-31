# AutoAnkauf Baden – Ablauf-Dokumentation

> **Pflege-Hinweis:** Diese Datei bei JEDER Änderung am Status-Flow, E-Mail-Logik oder API-Verhalten aktualisieren.
> Letzte Aktualisierung: 2026-03-28 (Mitarbeiter-Login, WA-Bearbeiter, Verlauf-Kürzel)

---

## 1. Status-Flow

```
neu → kontaktiert → angebot_gesendet → termin_vereinbart → abgeschlossen
                                                         ↘ abgelehnt
```

| Status | Farbe | Bedeutung |
|--------|-------|-----------|
| `neu` | blau | Anfrage eingegangen, noch keine Aktion |
| `kontaktiert` | gelb | Kundenkontakt aufgenommen |
| `angebot_gesendet` | lila | Angebot an Kunden verschickt |
| `termin_vereinbart` | grün | Besichtigungstermin festgelegt |
| `abgeschlossen` | smaragd | Fahrzeug gekauft – **Auto-Archivierung** |
| `abgelehnt` | rot | Kein Kauf – **Auto-Archivierung** |

**Auto-Archivierung:** `abgeschlossen` und `abgelehnt` setzen `archiviert = true` automatisch.

---

## 2. Aktionen & E-Mails

### 2.1 Angebot

| Aktion | Status-Änderung | Mail | Log-Eintrag |
|--------|----------------|------|-------------|
| Nur speichern | – | ❌ | – |
| Angebot senden | → `angebot_gesendet` | ✅ `angebotEmail()` | `angebot_mail_gesendet: "3500 €"` |

**Felder:** `angebotspreis`, `angebotNachricht`, `angebotGesendetAm` (wird beim Senden gesetzt)

---

### 2.2 Termin – 3 Szenarien

#### A) Neuer Termin
- **Voraussetzung:** kein Termin vorhanden
- **Status:** → `termin_vereinbart`
- **Mail:** `terminBestaetigung()` + `termin.ics`
- **Log:** `termin_bestaetigt: "01.05.2026 15:00 Uhr"`

#### B) Termin geändert
- **Voraussetzung:** Termin vorhanden, Zeit oder Adresse wurde geändert
- **Status:** bleibt `termin_vereinbart`
- **Mail:** `terminVerschoben()` + `termin.ics`
- **Log:** `termin_verschoben: "01.05. 15:00 → 02.05. 14:00"`

#### C) Termin gelöscht – 3 Gründe

| Grund | Status-Änderung | Mail | Log-Eintrag |
|-------|----------------|------|-------------|
| `wir_sagen_ab` | → `kontaktiert` (API) | ✅ `terminAbgesagt()` (opt. Ersatztermine) | `termin_abgesagt: "Wir haben abgesagt — [Datum]"` |
| `kunde_andertermin` | → `kontaktiert` (API) | ✅ `terminKundeAbgesagt()` | `termin_abgesagt: "Kunde hat abgesagt, möchte neuen Termin — [Datum]"` |
| `kein_interesse` | → `abgelehnt` + archiviert | ❌ | `archiviert: "Kein Interesse — Termin gelöscht"` |

> ⚠️ **Wichtig:** Bei `wir_sagen_ab` und `kunde_andertermin` muss der Status im Frontend explizit auf `kontaktiert` gesetzt werden (API ändert Status bei diesen Gründen nicht automatisch).

---

### 2.3 Termin-Mail erneut senden
- **Voraussetzung:** Termin ist gesetzt
- **Mail:** `terminBestaetigung()` + `termin.ics`
- **Log:** `termin_mail_erneut: "[Datum]"`
- **Status:** keine Änderung

---

### 2.4 Archivierung & Reaktivierung

| Aktion | Status-Änderung | Mail | Log-Eintrag |
|--------|----------------|------|-------------|
| Manuell archivieren | → `abgelehnt` | ❌ | *(keiner)* |
| Auto-Archiv (abgeschlossen/abgelehnt) | bereits gesetzt | ❌ | *(über status_geaendert)* |
| Reaktivieren | → `kontaktiert` | ❌ | `reaktiviert: null` |
| Endgültig löschen | — | ❌ | Datensatz gelöscht |

---

## 3. Alle Aktivitätslog-Einträge (aktion-Werte)

| aktion | Details-Format | Wann |
|--------|---------------|------|
| `status_geaendert` | `"neu → kontaktiert"` | Jede Status-Änderung |
| `angebot_mail_gesendet` | `"3500 €"` | Angebot gesendet |
| `termin_bestaetigt` | `"01.05.2026 15:00 Uhr"` | Neuer Termin |
| `termin_verschoben` | `"01.05. 15:00 → 02.05. 14:00"` | Termin geändert |
| `termin_abgesagt` | `"Wir haben abgesagt — [Datum]"` oder `"Kunde hat abgesagt..."` | Termin gelöscht (Grund 1 oder 2) |
| `termin_mail_erneut` | `"01.05.2026 15:00 Uhr"` | Mail erneut gesendet |
| `archiviert` | `"Kein Interesse — Termin gelöscht"` | Termin gelöscht mit Grund kein_interesse |
| `reaktiviert` | null | Reaktivierung |

---

## 4. E-Mail-Templates (Übersicht)

| Template | Empfänger | Wann |
|----------|-----------|------|
| `eingangsbestaetigung()` | Kunde | Automatisch bei Formular-Submit |
| `neueAnfrageIntern()` | Firma intern | Automatisch bei Formular-Submit |
| `angebotEmail()` | Kunde | Button "Angebot senden" |
| `terminBestaetigung()` | Kunde | Neuer Termin / Mail erneut |
| `terminVerschoben()` | Kunde | Termin geändert |
| `terminAbgesagt()` | Kunde | Termin gelöscht, Grund "wir_sagen_ab" |
| `terminKundeAbgesagt()` | Kunde | Termin gelöscht, Grund "kunde_andertermin" |
| `followupEmail()` | Kunde | Manuelle Follow-up-Erinnerung |
| `haendlerBestaetigung()` | Händler | Kooperationsanfrage |

---

## 5. Datenfelder bei Status-Übergängen

| Feld | Wird gesetzt bei | Wert |
|------|-----------------|------|
| `status` | Jeder Übergang | neuer Status-Wert |
| `archiviert` | `abgeschlossen`/`abgelehnt`/manuell | `true` |
| `angebotspreis` | Angebot speichern/senden | Zahl |
| `angebotGesendetAm` | Nur wenn `sendeAngebotMail: true` | `new Date()` |
| `angebotNachricht` | Angebot speichern/senden | Text (optional) |
| `terminVorschlag1` | Termin setzen/ändern/löschen | Date oder `null` |
| `abholadresse` | Termin setzen | Adresse oder `null` |
| `abholAdresseZusatz` | Termin setzen | Zusatz oder `null` |
| `notizen` | Manuell | Text |
| `bearbeiterId` | Mitarbeiter-Zuweisung | ID oder `null` |

---

## 6. Happy-Path Szenarien

### Szenario 1: Kompletter Kauf
```
neu → kontaktiert → angebot_gesendet (Mail) → termin_vereinbart (Mail+ICS) → abgeschlossen (archiviert)
```
Logs: status_geaendert × 4 + angebot_mail_gesendet + termin_bestaetigt

### Szenario 2: Termin verschoben
```
termin_vereinbart → (Zeit geändert) → terminVerschoben-Mail → termin_vereinbart
```
Logs: termin_verschoben

### Szenario 3: Wir sagen Termin ab
```
termin_vereinbart → (Termin gelöscht, wir_sagen_ab) → terminAbgesagt-Mail → kontaktiert
```
Logs: termin_abgesagt

### Szenario 4: Kunde sagt ab, möchte neuen Termin
```
termin_vereinbart → (Termin gelöscht, kunde_andertermin) → terminKundeAbgesagt-Mail → kontaktiert
```
Logs: termin_abgesagt

### Szenario 5: Kein Interesse
```
termin_vereinbart → (Termin gelöscht, kein_interesse) → kein Mail → abgelehnt + archiviert
```
Logs: archiviert

### Szenario 6: Reaktivierung
```
archiviert → Reaktivieren → kontaktiert + archiviert=false
```
Logs: reaktiviert

---

## 7. Bekannte Einschränkungen / Offene Punkte

- [x] ~~`angebotGesendetAm` wurde auch beim "Nur speichern" gesetzt~~ → behoben 2026-03-28
- [x] ~~Manuelles Archivieren hinterließ keinen Log-Eintrag~~ → behoben 2026-03-28
- [x] ~~`wir_sagen_ab`/`kunde_andertermin`: Status-Rücksetzung lief über Frontend~~ → behoben 2026-03-28 (API übernimmt)
- [ ] **Verlauf-Anzeige** in der Anfragen-Liste zeigt nur den neuesten Log-Eintrag (`take: 1`)

---

## 8. Technischer Stack (relevant für Ablauf)

- **API:** Next.js 15 App Router, PATCH `/api/dashboard/anfragen/[id]`
- **E-Mail:** Fire-and-Forget (async IIFE), Resend via `lib/email.ts`
- **DB:** Prisma + SQLite (`dev.db`) / PostgreSQL (Supabase in Prod)
- **Validierung:** Zod auf API-Seite
- **ICS:** `lib/email.ts` → `generateIcs()`
