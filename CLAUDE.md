# CLAUDE.md – AutoAnkauf Baden

## Projekt
- **Name:** AutoAnkauf Baden
- **Domain:** autoankauf-baden.de
- **Standort:** Bruchsal, Baden-Württemberg
- **Erfahrung:** 6 JAHRE (NIEMALS 8!)
- **Sprache:** Deutsch, Du-Form durchgehend

## Tech Stack
- Next.js 15 (App Router, Turbopack)
- TypeScript strict — **kein `any`**
- Tailwind CSS 3.4
- Prisma ORM + PostgreSQL (Supabase)
- NextAuth.js 4
- Resend (E-Mail)
- @anthropic-ai/sdk (KI Chat "Max")
- React Hook Form + Zod
- Framer Motion
- react-hot-toast, react-dropzone, recharts, date-fns

## Design System

### Farben (Tailwind Variablen in tailwind.config.ts)
| Name | Hex |
|---|---|
| primary | #0369A1 |
| primary-light | #0EA5E9 |
| primary-bg | #E8F4FD |
| primary-subtle | #F0F7FF |
| coral | #FB6F6F |
| coral-light | #FFE4E4 |
| background | #F8FAFC |
| card | #FFFFFF |
| border | #E2EDF7 |
| text-primary | #0F172A |
| text-secondary | #64748B |
| text-hint | #94A3B8 |
| sidebar | #0F172A |

### Typografie
- Font: **'Plus Jakarta Sans'** (Google Fonts)
- H1: clamp(28px,4vw,40px), weight 900
- H2: 24px, weight 800
- Body: 15px, weight 400, line-height 1.65

### Regeln
- Border-radius: 12px (standard), 8px (klein), 20px (groß), 999px (pill)
- Transition: 200ms ease
- Mobile-First, min 48px Touch-Targets
- Logo immer als SVG inline — kein img-Tag
- Dashboard: Sidebar #0F172A (dunkel), Content #F8FAFC (hell)

## Wichtige Regeln
1. TypeScript strict — kein `any`
2. 6 JAHRE Erfahrung (nicht 8!)
3. Font: 'Plus Jakarta Sans'
4. Hero-Bild: /public/hero-bg.jpg (Fallback: #0369A1)
5. Formular Autosave: localStorage Key "aab_form_v1"
6. `npm run dev` muss auch ohne .env starten
7. Keine hardcodierten Secrets
8. Rechtliche Texte immer mit Anwalt-Hinweis
9. Fotos: nur jpg/png/webp, max 5MB
10. Social Links: nur anzeigen wenn in DB gesetzt
11. DSGVO Checkbox PFLICHT, nie vorausgefüllt
12. IP nicht speichern
13. Rate Limiting: 5 Anfragen/IP/Stunde, 20 Chat/Session
14. E-Mails: alle Deutsch, Du-Form
15. Alle API Routes: Auth-Check + Zod-Validierung

## Lokale Entwicklung
```bash
npm run dev        # http://localhost:3000
npm run build      # Produktions-Build
npx prisma studio  # Datenbank-GUI
```

## Stadtseiten (10 — EINZIGARTIGER Content, kein Duplicate!)
Karlsruhe, Bruchsal, Heidelberg, Mannheim, Speyer, Pforzheim, Rastatt, Baden-Baden, Ludwigshafen, Germersheim

## Status-Flow Anfragen
neu → kontaktiert → angebot_gesendet → termin_vereinbart → abgeschlossen → abgelehnt

## KI Chat Max
- Modell: claude-sonnet-4-20250514
- Streaming, Rate Limit 20/Session
- Auto-öffnen nach 8 Sek. auf Homepage (einmalig, localStorage 'aab_chat_shown')
- Keine Preisschätzungen — bei Preisfragen auf Formular verweisen
