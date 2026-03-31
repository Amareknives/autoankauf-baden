import { NextRequest, NextResponse } from 'next/server'
import { z } from 'zod'
import { cookies } from 'next/headers'
import { verifySessionToken } from '@/lib/auth'

const updateSchema = z.object({
  status: z.string().optional(),
  notizen: z.string().optional(),
  angebotspreis: z.number().optional(),
  angebotNachricht: z.string().optional(),
  terminVorschlag1: z.string().nullable().optional(),
  abholadresse: z.string().nullable().optional(),
  abholAdresseZusatz: z.string().nullable().optional(),
  archiviert: z.boolean().optional(),
  sendeAngebotMail: z.boolean().optional(),
  sendeTerminMail: z.boolean().optional(),
  terminLoeschenGrund: z.enum(['kein_interesse', 'wir_sagen_ab', 'kunde_andertermin']).optional(),
  ersatztermin1: z.string().nullable().optional(),
  ersatztermin2: z.string().nullable().optional(),
  terminKommentar: z.string().nullable().optional(),
  bearbeiterId: z.string().nullable().optional(),
  abschlussPreis: z.number().nullable().optional(),
  ablehnungsGrund: z.string().nullable().optional(),
})

/** Holt die mitarbeiterId aus dem Session-Cookie (optional — null wenn kein Session) */
async function getMitarbeiterIdFromRequest(): Promise<string | null> {
  try {
    const cookieStore = await cookies()
    const token = cookieStore.get('aab_session')?.value
    if (!token) return null
    return await verifySessionToken(token)
  } catch {
    return null
  }
}

export async function DELETE(
  _request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params
    const { prisma } = await import('@/lib/prisma')
    await prisma.anfrage.delete({ where: { id } })
    return NextResponse.json({ ok: true })
  } catch {
    return NextResponse.json({ error: 'Fehler beim Löschen' }, { status: 500 })
  }
}

export async function GET(
  _request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params
    const { prisma } = await import('@/lib/prisma')

    const anfrage = await prisma.anfrage.findUnique({
      where: { id },
      include: {
        aktivitaeten: {
          orderBy: { createdAt: 'desc' },
          include: {
            mitarbeiter: { select: { id: true, kuerzel: true, farbe: true, vorname: true, nachname: true } },
          },
        },
        bearbeiter: {
          select: {
            id: true, vorname: true, nachname: true,
            kuerzel: true, farbe: true, telefon: true, whatsapp: true,
          },
        },
      },
    })

    if (!anfrage) {
      return NextResponse.json({ error: 'Nicht gefunden' }, { status: 404 })
    }

    return NextResponse.json(anfrage)
  } catch {
    return NextResponse.json({ error: 'Datenbankfehler' }, { status: 500 })
  }
}

export async function PATCH(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params
    const body = await request.json()
    const data = updateSchema.parse(body)

    const { prisma } = await import('@/lib/prisma')

    // Wer macht die Aktion?
    const mitarbeiterId = await getMitarbeiterIdFromRequest()

    // Alten Zustand laden
    const alt = await prisma.anfrage.findUnique({
      where: { id },
      select: {
        status: true,
        terminVorschlag1: true,
        vorname: true,
        nachname: true,
        email: true,
        marke: true,
        modell: true,
        kilometerstand: true,
        angebotspreis: true,
        abholadresse: true,
        abholAdresseZusatz: true,
        bearbeiterId: true,
        notizen: true,
        bearbeiter: { select: { vorname: true, nachname: true, kuerzel: true } },
      },
    })

    const updateData: Record<string, unknown> = {}
    if (data.status !== undefined) updateData.status = data.status
    if (data.status === 'abgeschlossen' || data.status === 'abgelehnt') {
      updateData.archiviert = true
    }
    if (data.notizen !== undefined) updateData.notizen = data.notizen
    if (data.angebotspreis !== undefined) {
      updateData.angebotspreis = data.angebotspreis
      if (data.sendeAngebotMail) updateData.angebotGesendetAm = new Date()
    }
    if (data.angebotNachricht !== undefined) updateData.angebotNachricht = data.angebotNachricht
    if (data.terminVorschlag1 !== undefined) {
      updateData.terminVorschlag1 = data.terminVorschlag1 ? new Date(data.terminVorschlag1) : null
    }
    if (data.abholadresse !== undefined) updateData.abholadresse = data.abholadresse
    if (data.abholAdresseZusatz !== undefined) updateData.abholAdresseZusatz = data.abholAdresseZusatz
    if (data.archiviert !== undefined) updateData.archiviert = data.archiviert
    if (data.bearbeiterId !== undefined) updateData.bearbeiterId = data.bearbeiterId
    if (data.abschlussPreis !== undefined) updateData.abschlussPreis = data.abschlussPreis
    if (data.ablehnungsGrund !== undefined) updateData.ablehnungsGrund = data.ablehnungsGrund

    const updated = await prisma.anfrage.update({
      where: { id },
      data: updateData,
      include: {
        bearbeiter: { select: { id: true, vorname: true, nachname: true, email: true, whatsapp: true, waApiKey: true, kuerzel: true, benachrichtigungKanal: true } },
      },
    })

    // ── Aktivitätslog: Status-Änderung ────────────────────────────────────────
    if (data.status && alt?.status !== data.status) {
      await prisma.aktivitaetsLog.create({
        data: {
          anfrageId: id,
          mitarbeiterId,
          aktion: 'status_geaendert',
          details: `${alt?.status} → ${data.status}`,
        },
      })
    }

    // ── Aktivitätslog: Bearbeiter-Zuweisung ───────────────────────────────────
    if (data.bearbeiterId !== undefined && data.bearbeiterId !== alt?.bearbeiterId) {
      const neuerBearbeiter = updated.bearbeiter
      const alterName = alt?.bearbeiter
        ? (alt.bearbeiter.kuerzel ?? `${alt.bearbeiter.vorname} ${alt.bearbeiter.nachname}`)
        : null
      const neuerName = neuerBearbeiter
        ? (neuerBearbeiter.kuerzel ?? `${neuerBearbeiter.vorname} ${neuerBearbeiter.nachname}`)
        : null
      const details = neuerName
        ? (alterName ? `${alterName} → ${neuerName}` : `Zugewiesen an ${neuerName}`)
        : 'Zuweisung entfernt'
      await prisma.aktivitaetsLog.create({
        data: {
          anfrageId: id,
          mitarbeiterId: data.bearbeiterId ?? mitarbeiterId,
          aktion: 'bearbeiter_zugewiesen',
          details,
        },
      })
    }

    // ── Aktivitätslog: Notiz geändert ────────────────────────────────────────
    if (data.notizen !== undefined && (data.notizen ?? '') !== (alt?.notizen ?? '')) {
      const snippet = data.notizen ? data.notizen.slice(0, 80) + (data.notizen.length > 80 ? '…' : '') : '(gelöscht)'
      await prisma.aktivitaetsLog.create({
        data: {
          anfrageId: id,
          mitarbeiterId,
          aktion: 'notiz_gespeichert',
          details: snippet,
        },
      })
    }

    // ── Aktivitätslog: Manuelles Archivieren ─────────────────────────────────
    if (data.archiviert === true && alt?.status !== 'abgeschlossen' && alt?.status !== 'abgelehnt') {
      await prisma.aktivitaetsLog.create({
        data: { anfrageId: id, mitarbeiterId, aktion: 'archiviert', details: 'Manuell archiviert' },
      })
    }

    // ── Aktivitätslog: Reaktivierung ──────────────────────────────────────────
    if (data.archiviert === false) {
      await prisma.aktivitaetsLog.create({
        data: { anfrageId: id, mitarbeiterId, aktion: 'reaktiviert', details: null },
      })
    }

    // ── Async Benachrichtigungen & E-Mails (fire-and-forget) ─────────────────
    void (async () => {
      try {
        const { sendEmail, generateIcs } = await import('@/lib/email')
        const { getSiteSettings } = await import('@/lib/siteSettings')
        const settings = await getSiteSettings()
        const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || 'https://autoankauf-baden.de'
        const bearbeiter = updated.bearbeiter

        // ── Helfer: Bearbeiter per konfiguriertem Kanal benachrichtigen ──
        const { notifyMitarbeiter } = await import('@/lib/notify')
        const notifyBearbeiter = async (betreff: string, text: string) => {
          if (!bearbeiter) return
          await notifyMitarbeiter(bearbeiter, text, betreff, { anfrageId: id })
        }

        // ── Angebots-Mail an Kunden ────────────────────────────────────────
        if (data.sendeAngebotMail && updated.angebotspreis) {
          const { angebotEmail } = await import('@/services/emailTemplates')
          const mail = angebotEmail({
            vorname: updated.vorname,
            marke: updated.marke,
            modell: updated.modell,
            kilometerstand: updated.kilometerstand,
            angebotspreis: updated.angebotspreis!,
            angebotNachricht: updated.angebotNachricht,
            firmaEmail: settings.email,
            telefon: settings.telefon,
            whatsapp: settings.whatsapp,
          })
          await sendEmail({ to: updated.email, ...mail, _typ: 'angebot', _anfrageId: id })
          await prisma.aktivitaetsLog.create({
            data: {
              anfrageId: id,
              mitarbeiterId,
              aktion: 'angebot_mail_gesendet',
              details: `${updated.angebotspreis} €`,
            },
          })
        }

        // ── Status-Benachrichtigung an Bearbeiter ─────────────────────────
        if (data.status && alt?.status !== data.status && bearbeiter) {
          const statusLabels: Record<string, string> = {
            termin_vereinbart: 'Termin vereinbart',
            abgeschlossen: 'Abgeschlossen',
            abgelehnt: 'Abgelehnt',
            angebot_gesendet: 'Angebot gesendet',
          }
          const label = statusLabels[data.status]
          if (label) {
            const msg = `📋 ${label}\n👤 ${updated.vorname} ${updated.nachname}\n🚗 ${updated.marke} ${updated.modell}`
            await notifyBearbeiter(`[AAB] ${label}: ${updated.vorname} ${updated.nachname}`, msg)
          }
        }

        // ── Bearbeiter-Zuweisung Benachrichtigung ─────────────────────────
        if (data.bearbeiterId && data.bearbeiterId !== alt?.bearbeiterId && bearbeiter) {
          if (alt?.terminVorschlag1) {
            const adresse = updated.abholadresse || `${settings.strasse}, ${settings.plz_firma} ${settings.ort}`
            const mapsUrl = `https://maps.google.com/?q=${encodeURIComponent(adresse)}`
            const terminStr = new Date(alt.terminVorschlag1).toLocaleString('de-DE', {
              weekday: 'short', day: '2-digit', month: '2-digit', year: 'numeric',
              hour: '2-digit', minute: '2-digit',
            })
            const msg = [
              `📅 Dir wurde ein Termin übertragen!`,
              `👤 ${updated.vorname} ${updated.nachname}`,
              `🚗 ${updated.marke} ${updated.modell}`,
              `🗓 ${terminStr} Uhr`,
              `📍 ${adresse}`,
              `🗺 ${mapsUrl}`,
            ].join('\n')
            await notifyMitarbeiter(bearbeiter, msg, `[AAB] Termin übertragen: ${updated.vorname} ${updated.nachname}`, { anfrageId: id })
          } else {
            const msg = `👋 Dir wurde ein Fall zugewiesen\n👤 ${updated.vorname} ${updated.nachname}\n🚗 ${updated.marke} ${updated.modell}\nStatus: ${updated.status}`
            await notifyMitarbeiter(bearbeiter, msg, `[AAB] Zuweisung: ${updated.vorname} ${updated.nachname}`, { anfrageId: id })
          }
        }

        // ── Termin-Mails ───────────────────────────────────────────────────
        if (data.terminVorschlag1 !== undefined) {
          const altTermin = alt?.terminVorschlag1 ?? null
          const neuerTermin = updated.terminVorschlag1 ?? null

          const istNeu = !altTermin && !!neuerTermin
          const adresseGeaendert = data.abholadresse !== undefined &&
            (data.abholadresse ?? null) !== (alt?.abholadresse ?? null)
          const adresseZusatzGeaendert = data.abholAdresseZusatz !== undefined &&
            (data.abholAdresseZusatz ?? null) !== (alt?.abholAdresseZusatz ?? null)
          const istGeaendert = !!altTermin && !!neuerTermin && (
            new Date(altTermin).getTime() !== new Date(neuerTermin).getTime() ||
            adresseGeaendert ||
            adresseZusatzGeaendert
          )
          const istGeloescht = !!altTermin && !neuerTermin

          if (istNeu && neuerTermin) {
            const { terminBestaetigung } = await import('@/services/emailTemplates')
            const icsAdresse = updated.abholadresse || `${settings.strasse}, ${settings.plz_firma} ${settings.ort}`
            const icsContent = generateIcs({
              dtstart: new Date(neuerTermin),
              uid: id,
              sequence: 0,
              method: 'REQUEST',
              kundeVorname: updated.vorname,
              kundeNachname: updated.nachname,
              marke: updated.marke,
              modell: updated.modell,
              kilometerstand: updated.kilometerstand,
              bearbeiterName: bearbeiter ? `${bearbeiter.vorname} ${bearbeiter.nachname}` : undefined,
              location: icsAdresse,
            })
            const mail = terminBestaetigung({
              vorname: updated.vorname,
              marke: updated.marke,
              modell: updated.modell,
              termin: neuerTermin,
              adresse: updated.abholadresse || `${settings.strasse}, ${settings.plz_firma} ${settings.ort}`,
              adresseZusatz: updated.abholAdresseZusatz,
              telefon: settings.telefon,
            })
            await sendEmail({
              to: updated.email,
              ...mail,
              attachments: [{ filename: 'termin.ics', content: icsContent, contentType: 'text/calendar' }],
              _typ: 'termin_bestaetigung',
              _anfrageId: id,
            })
            await prisma.aktivitaetsLog.create({
              data: {
                anfrageId: id,
                mitarbeiterId,
                aktion: 'termin_bestaetigt',
                details: [
                  bearbeiter ? `${bearbeiter.kuerzel ?? bearbeiter.vorname} → ${updated.vorname} ${updated.nachname}` : `→ ${updated.vorname} ${updated.nachname}`,
                  new Date(neuerTermin).toLocaleString('de-DE', { day: '2-digit', month: '2-digit', year: 'numeric', hour: '2-digit', minute: '2-digit' }),
                ].join(' | '),
              },
            })
            // Bearbeiter benachrichtigen (Kanal-abhängig)
            if (bearbeiter) {
              const adresse = updated.abholadresse || `${settings.strasse}, ${settings.plz_firma} ${settings.ort}`
              const mapsUrl = `https://maps.google.com/?q=${encodeURIComponent(adresse)}`
              const terminStr = new Date(neuerTermin).toLocaleString('de-DE', {
                weekday: 'short', day: '2-digit', month: '2-digit', year: 'numeric',
                hour: '2-digit', minute: '2-digit',
              })
              const msg = [
                `📅 Neuer Termin für dich!`,
                `👤 ${updated.vorname} ${updated.nachname}`,
                `🚗 ${updated.marke} ${updated.modell} · ${updated.kilometerstand.toLocaleString('de-DE')} km`,
                `🗓 ${terminStr} Uhr`,
                `📍 ${adresse}`,
                `🗺 ${mapsUrl}`,
              ].join('\n')
              await notifyMitarbeiter(bearbeiter, msg, `[AAB] Neuer Termin: ${updated.vorname} ${updated.nachname}`, { anfrageId: id })
            }

          } else if (istGeaendert && altTermin && neuerTermin) {
            const { terminVerschoben } = await import('@/services/emailTemplates')
            const icsAdresse = updated.abholadresse || `${settings.strasse}, ${settings.plz_firma} ${settings.ort}`
            const icsContent = generateIcs({
              dtstart: new Date(neuerTermin),
              uid: id,
              sequence: Math.floor(Date.now() / 1000) % 10000, // steigt mit jeder Änderung
              method: 'REQUEST',
              kundeVorname: updated.vorname,
              kundeNachname: updated.nachname,
              marke: updated.marke,
              modell: updated.modell,
              kilometerstand: updated.kilometerstand,
              bearbeiterName: bearbeiter ? `${bearbeiter.vorname} ${bearbeiter.nachname}` : undefined,
              location: icsAdresse,
            })
            const mail = terminVerschoben({
              vorname: updated.vorname,
              marke: updated.marke,
              modell: updated.modell,
              alterTermin: altTermin,
              neuerTermin: neuerTermin,
              adresse: updated.abholadresse || `${settings.strasse}, ${settings.plz_firma} ${settings.ort}`,
              adresseZusatz: updated.abholAdresseZusatz,
              telefon: settings.telefon,
            })
            await sendEmail({
              to: updated.email,
              ...mail,
              attachments: [{ filename: 'termin.ics', content: icsContent, contentType: 'text/calendar' }],
              _typ: 'termin_verschoben',
              _anfrageId: id,
            })
            await prisma.aktivitaetsLog.create({
              data: {
                anfrageId: id,
                mitarbeiterId,
                aktion: 'termin_verschoben',
                details: `${new Date(altTermin).toLocaleString('de-DE')} → ${new Date(neuerTermin).toLocaleString('de-DE')}`,
              },
            })
            // Bearbeiter benachrichtigen (Kanal-abhängig)
            if (bearbeiter) {
              const adresse = updated.abholadresse || `${settings.strasse}, ${settings.plz_firma} ${settings.ort}`
              const mapsUrl = `https://maps.google.com/?q=${encodeURIComponent(adresse)}`
              const neuerTerminStr = new Date(neuerTermin).toLocaleString('de-DE', {
                weekday: 'short', day: '2-digit', month: '2-digit', year: 'numeric',
                hour: '2-digit', minute: '2-digit',
              })
              const alterTerminStr = new Date(altTermin).toLocaleString('de-DE', {
                weekday: 'short', day: '2-digit', month: '2-digit',
                hour: '2-digit', minute: '2-digit',
              })
              const msg = [
                `📅 Termin geändert!`,
                `👤 ${updated.vorname} ${updated.nachname}`,
                `🚗 ${updated.marke} ${updated.modell}`,
                `🗓 ${neuerTerminStr} Uhr`,
                `⬅️ Vorher: ${alterTerminStr} Uhr`,
                `📍 ${adresse}`,
                `🗺 ${mapsUrl}`,
              ].join('\n')
              await notifyMitarbeiter(bearbeiter, msg, `[AAB] Termin geändert: ${updated.vorname} ${updated.nachname}`, { anfrageId: id })
            }

          } else if (istGeloescht && altTermin) {
            const grund = data.terminLoeschenGrund ?? 'wir_sagen_ab'

            // Bearbeiter benachrichtigen: Termin fällt weg
            if (bearbeiter) {
              const terminStr = new Date(altTermin).toLocaleString('de-DE', {
                weekday: 'short', day: '2-digit', month: '2-digit', year: 'numeric',
                hour: '2-digit', minute: '2-digit',
              })
              const grundTexte: Record<string, string> = {
                kein_interesse: 'Kein Interesse – Anfrage archiviert',
                wir_sagen_ab: 'Wir haben abgesagt',
                kunde_andertermin: 'Kunde möchte anderen Termin',
              }
              const msg = [
                `❌ Termin abgesagt`,
                `👤 ${updated.vorname} ${updated.nachname}`,
                `🚗 ${updated.marke} ${updated.modell}`,
                `🗓 War: ${terminStr} Uhr`,
                `ℹ️ ${grundTexte[grund] ?? grund}`,
              ].join('\n')
              await notifyMitarbeiter(bearbeiter, msg, `[AAB] Termin abgesagt: ${updated.vorname} ${updated.nachname}`, { anfrageId: id })
            }

            if (grund === 'kein_interesse') {
              await prisma.anfrage.update({ where: { id }, data: { archiviert: true, status: 'abgelehnt' } })
              await prisma.aktivitaetsLog.create({
                data: { anfrageId: id, mitarbeiterId, aktion: 'archiviert', details: 'Kein Interesse — Termin gelöscht' },
              })

            } else if (grund === 'wir_sagen_ab') {
              await prisma.anfrage.update({ where: { id }, data: { status: 'kontaktiert' } })
              const { terminAbgesagt } = await import('@/services/emailTemplates')
              const mail = terminAbgesagt({
                vorname: updated.vorname,
                marke: updated.marke,
                modell: updated.modell,
                alterTermin: altTermin,
                telefon: settings.telefon,
                whatsapp: settings.whatsapp,
                ersatztermin1: data.ersatztermin1 ? new Date(data.ersatztermin1) : null,
                ersatztermin2: data.ersatztermin2 ? new Date(data.ersatztermin2) : null,
                kommentar: data.terminKommentar,
              })
              // Cancel-ICS → löscht Termin direkt aus dem Kalender des Kunden
              const cancelIcs = generateIcs({
                dtstart: new Date(altTermin),
                uid: id,
                sequence: Math.floor(Date.now() / 1000) % 10000,
                method: 'CANCEL',
                kundeVorname: updated.vorname,
                kundeNachname: updated.nachname,
                marke: updated.marke,
                modell: updated.modell,
              })
              await sendEmail({
                to: updated.email, ...mail, _typ: 'termin_abgesagt', _anfrageId: id,
                attachments: [{ filename: 'termin-abgesagt.ics', content: cancelIcs, contentType: 'text/calendar' }],
              })
              await prisma.aktivitaetsLog.create({
                data: {
                  anfrageId: id,
                  mitarbeiterId,
                  aktion: 'termin_abgesagt',
                  details: `Wir haben abgesagt — ${new Date(altTermin).toLocaleString('de-DE')}`,
                },
              })

            } else if (grund === 'kunde_andertermin') {
              await prisma.anfrage.update({ where: { id }, data: { status: 'kontaktiert' } })
              const { terminKundeAbgesagt } = await import('@/services/emailTemplates')
              const mail = terminKundeAbgesagt({
                vorname: updated.vorname,
                marke: updated.marke,
                modell: updated.modell,
                alterTermin: altTermin,
                telefon: settings.telefon,
                whatsapp: settings.whatsapp,
                kommentar: data.terminKommentar,
              })
              await sendEmail({ to: updated.email, ...mail, _typ: 'termin_abgesagt', _anfrageId: id })
              await prisma.aktivitaetsLog.create({
                data: {
                  anfrageId: id,
                  mitarbeiterId,
                  aktion: 'termin_abgesagt',
                  details: `Kunde hat abgesagt, möchte neuen Termin — ${new Date(altTermin).toLocaleString('de-DE')}`,
                },
              })
            }
          }
        }

        // ── Termin-Mail erneut senden ─────────────────────────────────────
        if (data.sendeTerminMail && updated.terminVorschlag1) {
          const { terminBestaetigung } = await import('@/services/emailTemplates')
          const icsAdresse = updated.abholadresse || `${settings.strasse}, ${settings.plz_firma} ${settings.ort}`
          const icsContent = generateIcs({
            dtstart: new Date(updated.terminVorschlag1),
            uid: id,
            sequence: Math.floor(Date.now() / 1000) % 10000,
            method: 'REQUEST',
            kundeVorname: updated.vorname,
            kundeNachname: updated.nachname,
            marke: updated.marke,
            modell: updated.modell,
            kilometerstand: updated.kilometerstand,
            bearbeiterName: bearbeiter ? `${bearbeiter.vorname} ${bearbeiter.nachname}` : undefined,
            location: icsAdresse,
          })
          const mail = terminBestaetigung({
            vorname: updated.vorname,
            marke: updated.marke,
            modell: updated.modell,
            termin: updated.terminVorschlag1,
            adresse: updated.abholadresse || `${settings.strasse}, ${settings.plz_firma} ${settings.ort}`,
            adresseZusatz: updated.abholAdresseZusatz,
            telefon: settings.telefon,
          })
          await sendEmail({
            to: updated.email,
            ...mail,
            attachments: [{ filename: 'termin.ics', content: icsContent, contentType: 'text/calendar' }],
            _typ: 'termin_bestaetigung',
            _anfrageId: id,
          })
          await prisma.aktivitaetsLog.create({
            data: {
              anfrageId: id,
              mitarbeiterId,
              aktion: 'termin_mail_erneut',
              details: new Date(updated.terminVorschlag1).toLocaleString('de-DE'),
            },
          })
        }

      } catch (err) {
        console.error('[anfrage PATCH notifications]', err)
      }
    })()

    return NextResponse.json(updated)
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json({ error: 'Ungültige Daten' }, { status: 400 })
    }
    return NextResponse.json({ error: 'Datenbankfehler' }, { status: 500 })
  }
}
