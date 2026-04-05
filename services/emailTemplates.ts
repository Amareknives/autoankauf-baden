const BASE_URL = process.env.NEXT_PUBLIC_BASE_URL || 'https://autoankauf-baden.de'
const YEAR = new Date().getFullYear()

// Logo SVG inline — CI-Farben: blau #0369A1, koralle #FB6F6F, hellblau #0EA5E9
const LOGO_SVG = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1453.33 425.33" width="64" height="19" style="display:block;" aria-hidden="true">
  <path d="M312.12,114.42c-64.75,114.24-94.6,181.59-166.98,310.48-.8-1.29-146.52,2.49-145.13-1.33C1.39,422.74,227.01-.03,229.43.54c0,0,165.45,0,165.45,0,.27.55,115.49,200.33,114.43,201.11-13.83,2.3-31.75,8.31-36.89,9.19-32.91,8.32-62.31,17.84-90.7,25.48,0,0-69.61-121.9-69.61-121.9Z" fill="#0369A1"/>
  <path d="M542.23,195.29c-3.69-.61,106.88-193.84,107.45-194.67,1.03.78,177.83-1.15,178.36.49,25.53,45.92,58.86,98.43,84.07,147.81-44.02,2.88-69.27,4.09-109.63,7.7-12.76.69-26.14,4.14-37.48,2.43,0,0-22.21-44.61-22.21-44.61-.27-.57-1.14-.58-1.42,0,0,0-27.18,52.41-27.18,52.41-.4.77-1.19,1.25-2.05,1.26-66.59,7.88-90.2,11.22-169.91,27.19Z" fill="#FB6F6F"/>
  <path d="M1069.98,424.92c-.74-.45-165.65.86-165.99-.45-.9-.28-87.59-167.58-89.23-166.56-7.51,4.36-17.82,9.88-26.61,15.63-50.89,31.53-87.3,64.78-124.58,115.2-8.12,11.23-16.14,23.07-24.06,35.51-.66,1.93-137.9.01-139.12.67-.45,0-.72-.59-.4-.92,9.39-9.95,20.43-23.96,31.26-34.93,7.76-7.84,16.32-17.56,24.52-25.31,12.19-10.96,14.43-14.63,23.6-21.64.39-.23,1.2-1.34.38-1.54,0,0-71.57-3.14-71.57-3.14-3.72,1.14-6.16,3.99-11.54,7.93-35.14,27.13-57.2,50.49-86.11,79.49-86.12-.42-155.3,1.1-217.89-.53,25.03-19.73,54.83-41.24,82.04-57.15,136.8-80.17,265.41-124.18,416.22-156.89,204.61-41.44,361.81-46.89,575.5-45.29,17.38.44,38.81-12.7,38.29-33.03.58-9.72-2.69-21.75-10.56-28.32-39.25-18.9-65.86-4.54-234.71-8.79-1.6.25-4.4-.58-5.25.73-.52.55,1,51-.54,50.9-34.54-.53-65.38,1.32-102.05,1.55-37.6-64.05-36.78-64.72-83.93-145.96,122.83-4.48,250.76-.06,376.16-1.58,21.81-.47,50.77.34,68.85,3.61,42.49,6.63,87.36,31.45,100.58,74.94,14.06,43.19,6.22,102.34-38.41,124.89-.99.33-.57,1.46.27,1.51,12.11,3.6,24.48,8.41,34.7,15.61,74.57,51.06,48.56,181.62-41.78,197.02-20.55,4.86-41.49,7.27-64.37,6.9-42.05-.08-107.08-.08-194.87-.04-1.69-1.35-2.07-4.54-3.82-6.72-44.67-77.09-83.49-148.24-118.71-207.6-.71.1-35.98,4.85-36,4.86-2.06.94,121.31,208.52,119.73,209.44ZM695.51,236.95c.92-.18,44.43,2.13,45.23,1.52,26.27-12.23,52.99-23.65,80.26-31.92,14.3-6.53-38.71,3.21-42.72,4.21-33.68,7.19-37.09,9.5-72.4,20.6-1.96,1.04-14.33,3.56-10.37,5.59ZM706.23,253.35c-20.52,2.85-52.38-1.69-64.8,2.86-41.7,19.74-71.46,36.37-107.74,62.17,22.16,1.25,52.46,1.51,75.41.94,36.25-27.39,47.46-35.02,80.18-54.44,11.92-7.31,20.52-9.8,16.95-11.53ZM1100.76,257.76v68.7c0,.77.62,1.39,1.39,1.39h185.02c20.48,0,37.09-14.91,37.09-33.31,2.15-20.5-14.38-38.18-37.09-38.17-1.39,1.35-186.7-2.61-186.41,1.39Z" fill="#0EA5E9"/>
</svg>`

function emailLayout(content: string, preheader = '') {
  return `<!DOCTYPE html>
<html lang="de">
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width,initial-scale=1">
  <meta name="x-apple-disable-message-reformatting">
  <meta name="format-detection" content="telephone=no,address=no,email=no">
  <title>autoankauf baden</title>
  <!--[if mso]><noscript><xml><o:OfficeDocumentSettings><o:PixelsPerInch>96</o:PixelsPerInch></o:OfficeDocumentSettings></xml></noscript><![endif]-->
  <style>
    @media only screen and (max-width:620px) {
      .header-cell { padding:20px !important; }
      .body-cell   { padding:24px 20px !important; }
      .footer-cell { padding:18px 20px !important; }
    }
  </style>
</head>
<body style="margin:0;padding:0;background:#F1F5F9;font-family:'Helvetica Neue',Helvetica,Arial,sans-serif;">
  ${preheader ? `<div style="display:none;max-height:0;overflow:hidden;mso-hide:all;">${preheader}</div>` : ''}
  <table width="100%" cellpadding="0" cellspacing="0" style="background:#F1F5F9;padding:32px 16px;">
    <tr><td align="center">
      <table width="600" cellpadding="0" cellspacing="0" style="max-width:600px;width:100%;">

        <!-- HEADER -->
        <tr>
          <td class="header-cell" style="background:#0F172A;border-radius:16px 16px 0 0;padding:28px 40px;">
            <table width="100%" cellpadding="0" cellspacing="0">
              <tr>
                <td style="vertical-align:middle;">
                  ${LOGO_SVG}
                  <table cellpadding="0" cellspacing="0" style="margin-top:6px;">
                    <tr>
                      <td style="font-size:13px;font-weight:600;letter-spacing:0.3px;padding-right:1px;color:#0369A1;font-family:'Helvetica Neue',Helvetica,Arial,sans-serif;">auto</td>
                      <td style="font-size:13px;font-weight:600;letter-spacing:0.3px;padding-right:1px;color:#FB6F6F;font-family:'Helvetica Neue',Helvetica,Arial,sans-serif;">ankauf</td>
                      <td style="font-size:13px;font-weight:600;letter-spacing:0.3px;padding-left:2px;color:#0EA5E9;font-family:'Helvetica Neue',Helvetica,Arial,sans-serif;">baden</td>
                    </tr>
                  </table>
                </td>
                <td style="vertical-align:middle;text-align:right;">
                  <p style="margin:0;color:rgba(255,255,255,0.4);font-size:11px;letter-spacing:0.5px;text-transform:uppercase;line-height:1.5;">Dein Autoankauf<br>in der Region</p>
                </td>
              </tr>
            </table>
          </td>
        </tr>

        <!-- BODY -->
        <tr>
          <td class="body-cell" style="background:#ffffff;padding:40px;border-left:1px solid #E2E8F0;border-right:1px solid #E2E8F0;">
            ${content}
          </td>
        </tr>

        <!-- FOOTER -->
        <tr>
          <td class="footer-cell" style="background:#0F172A;border-radius:0 0 16px 16px;padding:24px 40px;text-align:center;">
            <p style="margin:0 0 6px;color:rgba(255,255,255,0.4);font-size:12px;line-height:1.6;">
              autoankauf baden · Muhammet Demir · Heidelberger Str. 4, 76676 Graben-Neudorf
            </p>
            <p style="margin:0;color:rgba(255,255,255,0.25);font-size:11px;">
              © ${YEAR} autoankauf baden ·
              <a href="${BASE_URL}/datenschutz" style="color:rgba(255,255,255,0.3);text-decoration:none;">Datenschutz</a> ·
              <a href="${BASE_URL}/impressum" style="color:rgba(255,255,255,0.3);text-decoration:none;">Impressum</a>
            </p>
          </td>
        </tr>

      </table>
    </td></tr>
  </table>
</body>
</html>`
}

// ─── Hilfs-Funktion: Datum formatieren ────────────────────────────────────────
function formatDatum(d: Date | string): string {
  return new Date(d).toLocaleString('de-DE', {
    weekday: 'long', day: '2-digit', month: 'long',
    year: 'numeric', hour: '2-digit', minute: '2-digit',
  }) + ' Uhr'
}

// ─── MAIL 1: Kundenbestätigung nach Anfrage ───────────────────────────────────
export function eingangsbestaetigung(params: {
  vorname: string
  marke: string
  modell: string
  kilometerstand: number
  erstzulassungJahr: number
  customBetreff?: string
  customInhalt?: string
}) {
  const subject = params.customBetreff?.replace('{{vorname}}', params.vorname) ||
    `Deine Anfrage ist eingegangen, ${params.vorname} ✓`

  const inhalt = params.customInhalt
    ? params.customInhalt
        .replace(/{{vorname}}/g, params.vorname)
        .replace(/{{marke}}/g, params.marke)
        .replace(/{{modell}}/g, params.modell)
    : ''

  const html = emailLayout(`
    <h2 style="margin:0 0 8px;color:#0F172A;font-size:20px;font-weight:800;">Hallo ${params.vorname},</h2>
    <p style="margin:0 0 24px;color:#475569;font-size:15px;line-height:1.7;">
      ${inhalt || `schön, dass du dich bei uns meldest! Deine Anfrage ist sicher bei uns angekommen. Wir schauen uns alles in Ruhe an und melden uns <strong>innerhalb von 2–3 Stunden*</strong> persönlich mit einem fairen Angebot zurück — kostenlos und unverbindlich.`}
    </p>

    <!-- Fahrzeug-Box -->
    <table width="100%" cellpadding="0" cellspacing="0" style="background:#F0F9FF;border:1px solid #BAE6FD;border-radius:12px;margin-bottom:24px;">
      <tr><td style="padding:20px 24px;">
        <p style="margin:0 0 12px;color:#0369A1;font-size:12px;font-weight:700;letter-spacing:1px;text-transform:uppercase;">Dein Fahrzeug</p>
        <table width="100%" cellpadding="0" cellspacing="0">
          <tr>
            <td style="padding:5px 0;color:#64748B;font-size:14px;width:140px;">Fahrzeug</td>
            <td style="padding:5px 0;color:#0F172A;font-size:14px;font-weight:700;">${params.marke} ${params.modell}</td>
          </tr>
          <tr>
            <td style="padding:5px 0;color:#64748B;font-size:14px;">Kilometerstand</td>
            <td style="padding:5px 0;color:#0F172A;font-size:14px;font-weight:700;">${params.kilometerstand.toLocaleString('de-DE')} km</td>
          </tr>
          <tr>
            <td style="padding:5px 0;color:#64748B;font-size:14px;">Erstzulassung</td>
            <td style="padding:5px 0;color:#0F172A;font-size:14px;font-weight:700;">${params.erstzulassungJahr}</td>
          </tr>
        </table>
      </td></tr>
    </table>

    <!-- Nächste Schritte -->
    <p style="margin:0 0 16px;color:#0F172A;font-size:15px;font-weight:700;">Was passiert als nächstes?</p>
    <table width="100%" cellpadding="0" cellspacing="0" style="margin-bottom:28px;">
      ${['Wir prüfen deine Angaben und ermitteln den besten Preis.',
         'Du erhältst innerhalb von 2–3 Stunden* ein vorläufiges Angebot auf Basis deiner Angaben.',
         'Bei Einigung vereinbaren wir einen Termin — kostenlos & unverbindlich.']
        .map((t, i) => `
      <tr>
        <td style="padding:6px 0;vertical-align:top;width:32px;">
          <span style="display:inline-block;width:24px;height:24px;background:#0369A1;color:white;border-radius:50%;text-align:center;line-height:24px;font-size:12px;font-weight:700;">${i + 1}</span>
        </td>
        <td style="padding:6px 0;color:#475569;font-size:14px;line-height:1.5;">${t}</td>
      </tr>`).join('')}
    </table>

    <!-- CTA -->
    <table width="100%" cellpadding="0" cellspacing="0" style="margin-bottom:24px;">
      <tr><td align="center">
        <a href="${BASE_URL}" style="display:inline-block;background:#FB6F6F;color:white;font-size:15px;font-weight:700;text-decoration:none;padding:14px 32px;border-radius:10px;">
          Zur Website →
        </a>
      </td></tr>
    </table>
    <p style="margin:0 0 16px;color:#94A3B8;font-size:13px;text-align:center;">
      Fragen? <a href="tel:+4917664179764" style="color:#0369A1;text-decoration:none;">+49 176 64179764</a>
    </p>
    <p style="margin:0 0 20px;color:#94A3B8;font-size:12px;line-height:1.7;border-top:1px solid #F1F5F9;padding-top:16px;">
      <strong style="color:#64748B;">Ein kurzer Hinweis:</strong> Wir prüfen deine Anfrage persönlich und melden uns schnellstmöglich.<br>
      Wir sind <strong style="color:#64748B;">Mo–Fr 6–18 Uhr</strong> und <strong style="color:#64748B;">Sa 6–13 Uhr</strong> erreichbar.
      Anfragen außerhalb dieser Zeiten werden am nächsten Werktag bearbeitet. Wir danken dir für dein Verständnis!
    </p>

    <!-- P.S. Partnerhinweis -->
    <table width="100%" cellpadding="0" cellspacing="0">
      <tr>
        <td style="background:#1C1917;border-left:3px solid #EAB308;border-radius:6px;padding:12px 16px;">
          <p style="margin:0 0 3px;color:#EAB308;font-size:11px;font-weight:700;letter-spacing:0.5px;">P.S. – Auch auf der Suche nach einem neuen Fahrzeug?</p>
          <p style="margin:0;color:rgba(255,255,255,0.55);font-size:12px;line-height:1.6;">
            Unser Partnerstandort <strong style="color:rgba(255,255,255,0.8);">Autohaus Stern</strong> in Graben-Neudorf bietet eine große Auswahl – Inzahlungnahme direkt möglich.<br>
            <a href="${BASE_URL}/fahrzeuge-kaufen" style="color:#EAB308;text-decoration:none;font-weight:600;">Mehr Infos →</a>
          </p>
        </td>
      </tr>
    </table>
  `, `Deine Anfrage für ${params.marke} ${params.modell} ist eingegangen`)

  return { subject, html }
}

// ─── MAIL 2: Angebot an Kunden ────────────────────────────────────────────────
export function angebotEmail(params: {
  vorname: string
  marke: string
  modell: string
  kilometerstand: number
  angebotspreis: number
  angebotNachricht?: string | null
  firmaEmail: string
  telefon: string
  whatsapp: string
  bearbeiterName?: string | null
}) {
  const preisFormatiert = params.angebotspreis.toLocaleString('de-DE')
  const waLink = `https://wa.me/${params.whatsapp}`
  const mailtoBetreff = encodeURIComponent(`Terminvorschlag für meinen ${params.marke} ${params.modell}`)
  const mailtoBody = encodeURIComponent(
    `Hallo,\n\nich bin an eurem Angebot interessiert und schlage folgende Termine vor:\n\nWunschtermin 1: [z.B. Montag, 05.05.2026 um 14:00 Uhr]\nWunschtermin 2: [z.B. Dienstag, 06.05.2026 um 10:00 Uhr]\n\nMit freundlichen Grüßen\n${params.vorname}`
  )
  const mailtoLink = `mailto:${params.firmaEmail}?subject=${mailtoBetreff}&body=${mailtoBody}`

  const html = emailLayout(`
    <h2 style="margin:0 0 8px;color:#0F172A;font-size:20px;font-weight:800;">Hallo ${params.vorname},</h2>
    <p style="margin:0 0 ${params.angebotNachricht ? '16px' : '24px'};color:#475569;font-size:15px;line-height:1.7;">
      wir haben deinen <strong>${params.marke} ${params.modell}</strong> geprüft und freuen uns, dir ein persönliches Angebot machen zu können. Überzeuge dich selbst — fair, transparent und ohne versteckte Kosten.
    </p>
    ${params.angebotNachricht ? `
    <div style="background:#F0F7FF;border-left:3px solid #0369A1;border-radius:4px;padding:12px 16px;margin-bottom:24px;">
      <p style="margin:0;color:#0F172A;font-size:14px;line-height:1.6;">${params.angebotNachricht.replace(/\n/g, '<br>')}</p>
    </div>` : ''}

    <!-- Preis-Box -->
    <table width="100%" cellpadding="0" cellspacing="0" style="background:#0369A1;border-radius:16px;margin-bottom:28px;">
      <tr><td style="padding:28px 32px;text-align:center;">
        <p style="margin:0 0 6px;color:rgba(255,255,255,0.75);font-size:12px;letter-spacing:1px;text-transform:uppercase;font-weight:600;">Unser Angebot für deinen</p>
        <p style="margin:0 0 14px;color:#BAE6FD;font-size:15px;font-weight:600;">${params.marke} ${params.modell} · ${params.kilometerstand.toLocaleString('de-DE')} km</p>
        <p style="margin:0;color:#ffffff;font-size:48px;font-weight:900;letter-spacing:-2px;line-height:1;">${preisFormatiert} €</p>
        <p style="margin:10px 0 0;color:rgba(255,255,255,0.6);font-size:13px;">Kostenlos · Unverbindlich · Barzahlung bei Abholung</p>
      </td></tr>
    </table>

    <!-- Nächste Schritte -->
    <p style="margin:0 0 16px;color:#0F172A;font-size:15px;font-weight:700;">Interesse? So geht's weiter:</p>
    <p style="margin:0 0 20px;color:#475569;font-size:14px;line-height:1.6;">
      Melde dich einfach über einen der folgenden Wege bei uns — wir vereinbaren dann gemeinsam einen passenden Termin zur Besichtigung:
    </p>

    <!-- 3 Kontaktwege -->
    <table width="100%" cellpadding="0" cellspacing="0" style="margin-bottom:28px;">
      <tr>
        <td style="padding:10px 8px 10px 0;width:33%;vertical-align:top;text-align:center;">
          <a href="tel:${params.telefon}" style="display:block;background:#F0F9FF;border:1px solid #BAE6FD;border-radius:12px;padding:16px 12px;text-decoration:none;">
            <p style="margin:0 0 4px;font-size:20px;">📞</p>
            <p style="margin:0 0 3px;color:#0369A1;font-size:13px;font-weight:700;">Anrufen</p>
            <p style="margin:0;color:#64748B;font-size:11px;">${params.telefon}</p>
          </a>
        </td>
        <td style="padding:10px 4px;width:33%;vertical-align:top;text-align:center;">
          <a href="${waLink}" style="display:block;background:#F0FDF4;border:1px solid #86EFAC;border-radius:12px;padding:16px 12px;text-decoration:none;">
            <p style="margin:0 0 4px;font-size:20px;">💬</p>
            <p style="margin:0 0 3px;color:#16A34A;font-size:13px;font-weight:700;">WhatsApp</p>
            <p style="margin:0;color:#64748B;font-size:11px;">Nachricht senden</p>
          </a>
        </td>
        <td style="padding:10px 0 10px 8px;width:33%;vertical-align:top;text-align:center;">
          <a href="${mailtoLink}" style="display:block;background:#FFF7ED;border:1px solid #FED7AA;border-radius:12px;padding:16px 12px;text-decoration:none;">
            <p style="margin:0 0 4px;font-size:20px;">✉️</p>
            <p style="margin:0 0 3px;color:#C2410C;font-size:13px;font-weight:700;">Per E-Mail</p>
            <p style="margin:0;color:#64748B;font-size:11px;">2 Terminvorschläge</p>
          </a>
        </td>
      </tr>
    </table>

    <div style="background:#F8FAFC;border-left:3px solid #0369A1;border-radius:4px;padding:14px 18px;margin-bottom:16px;">
      <p style="margin:0;color:#475569;font-size:13px;line-height:1.6;">
        <strong style="color:#0F172A;">Tipp:</strong> Klicke auf "Per E-Mail" — wir haben bereits eine Vorlage mit zwei Terminvorschlägen für dich vorbereitet. Du musst nur noch Datum und Uhrzeit eintragen. 📅
      </p>
    </div>

    ${params.bearbeiterName ? `
    <p style="margin:0 0 20px;color:#475569;font-size:14px;line-height:1.6;">
      Mit freundlichen Grüßen<br>
      <strong style="color:#0F172A;">${params.bearbeiterName} | AutoAnkauf-Baden-Team</strong>
    </p>` : ''}

    <p style="margin:0;color:#94A3B8;font-size:11px;line-height:1.6;">
      * Dieses Angebot basiert auf deinen Angaben im Formular und ist 7 Tage gültig. Der endgültige Ankaufspreis wird nach Besichtigung des Fahrzeugs festgelegt und kann bei Abweichungen vom beschriebenen Zustand variieren.
    </p>
  `, `Dein Angebot: ${preisFormatiert} € für ${params.marke} ${params.modell}`)

  return {
    subject: `✅ Dein Angebot: ${preisFormatiert} € für deinen ${params.marke} ${params.modell}`,
    html,
  }
}

// ─── MAIL 3: Terminbestätigung ────────────────────────────────────────────────
export function terminBestaetigung(params: {
  vorname: string
  marke: string
  modell: string
  termin: Date | string
  adresse?: string | null
  adresseZusatz?: string | null
  telefon: string
  bearbeiter?: { vorname: string; nachname: string; telefon?: string | null; whatsapp?: string | null } | null
}) {
  const terminText = formatDatum(params.termin)

  const html = emailLayout(`
    <h2 style="margin:0 0 8px;color:#0F172A;font-size:20px;font-weight:800;">Hallo ${params.vorname},</h2>
    <p style="margin:0 0 24px;color:#475569;font-size:15px;line-height:1.7;">
      dein Besichtigungstermin ist bestätigt! Wir freuen uns darauf, deinen <strong>${params.marke} ${params.modell}</strong> persönlich kennenzulernen.
    </p>

    <!-- Termin-Box -->
    <table width="100%" cellpadding="0" cellspacing="0" style="background:#0F172A;border-radius:16px;margin-bottom:24px;">
      <tr><td style="padding:28px 32px;">
        <p style="margin:0 0 6px;color:rgba(255,255,255,0.5);font-size:12px;letter-spacing:1px;text-transform:uppercase;font-weight:600;">Dein Termin</p>
        <p style="margin:0 0 12px;color:#ffffff;font-size:20px;font-weight:800;line-height:1.3;">📅 ${terminText}</p>
        ${params.adresse ? `
          <p style="margin:0 0 4px;color:rgba(255,255,255,0.7);font-size:14px;">📍 ${params.adresse}</p>
          ${params.adresseZusatz ? `<p style="margin:0 0 10px;color:rgba(255,255,255,0.55);font-size:13px;padding-left:20px;">${params.adresseZusatz}</p>` : '<span style="display:block;margin-bottom:10px;"></span>'}
          <a href="https://maps.google.com/?q=${encodeURIComponent(params.adresse)}" target="_blank" style="display:inline-block;background:rgba(255,255,255,0.12);color:#ffffff;font-size:12px;font-weight:600;text-decoration:none;padding:6px 14px;border-radius:8px;border:1px solid rgba(255,255,255,0.2);">🗺️ In Google Maps öffnen</a>
        ` : ''}
      </td></tr>
    </table>

    <!-- Hinweise -->
    <table width="100%" cellpadding="0" cellspacing="0" style="background:#F0FDF4;border:1px solid #86EFAC;border-radius:12px;margin-bottom:24px;">
      <tr><td style="padding:18px 24px;">
        <p style="margin:0 0 10px;color:#166534;font-size:13px;font-weight:700;">Wichtige Hinweise zum Termin:</p>
        <table cellpadding="0" cellspacing="0">
          ${[
            'Bringe bitte alle verfügbaren Fahrzeugdokumente mit (Fahrzeugschein, Serviceheft, TÜV-Bericht).',
            'Falls du den Termin nicht wahrnehmen kannst, melde dich bitte <strong>mindestens 24 Stunden vorher</strong>.',
            'Wir zahlen direkt in bar — keine Wartezeit, kein Papierkram.',
          ].map(t => `
          <tr>
            <td style="padding:4px 8px 4px 0;vertical-align:top;color:#166534;font-size:16px;">✓</td>
            <td style="padding:4px 0;color:#166534;font-size:13px;line-height:1.5;">${t}</td>
          </tr>`).join('')}
        </table>
      </td></tr>
    </table>

    ${params.bearbeiter ? `
    <!-- Ansprechpartner -->
    <table width="100%" cellpadding="0" cellspacing="0" style="background:#F0F9FF;border:1px solid #BAE6FD;border-radius:12px;margin-bottom:16px;">
      <tr><td style="padding:16px 24px;">
        <p style="margin:0 0 6px;color:#0369A1;font-size:11px;font-weight:700;letter-spacing:1px;text-transform:uppercase;">Dein Ansprechpartner vor Ort</p>
        <p style="margin:0 0 6px;color:#0F172A;font-size:15px;font-weight:700;">${params.bearbeiter.vorname} ${params.bearbeiter.nachname}</p>
        ${params.bearbeiter.telefon ? `<p style="margin:0 0 2px;color:#475569;font-size:14px;">📞 <a href="tel:${params.bearbeiter.telefon}" style="color:#0369A1;text-decoration:none;">${params.bearbeiter.telefon}</a></p>` : ''}
        ${params.bearbeiter.whatsapp ? `<p style="margin:0;color:#475569;font-size:14px;">💬 <a href="https://wa.me/${params.bearbeiter.whatsapp.replace(/[^0-9]/g, '')}" style="color:#0369A1;text-decoration:none;">WhatsApp schreiben</a></p>` : ''}
      </td></tr>
    </table>

    <p style="margin:0 0 12px;color:#94A3B8;font-size:13px;text-align:center;">
      Allgemeine Fragen zum Ablauf? Unsere Zentrale ist gerne für dich da:
    </p>
    ` : `
    <p style="margin:0 0 12px;color:#475569;font-size:14px;text-align:center;">
      Bei Fragen oder Terminänderungen erreichst du uns direkt:
    </p>
    `}

    <!-- CTA Zentrale -->
    <table width="100%" cellpadding="0" cellspacing="0" style="margin-bottom:16px;">
      <tr><td align="center">
        <a href="tel:${params.telefon}" style="display:inline-block;background:#0369A1;color:white;font-size:15px;font-weight:700;text-decoration:none;padding:14px 32px;border-radius:10px;">
          📞 ${params.telefon}
        </a>
      </td></tr>
    </table>
    <p style="margin:0;color:#94A3B8;font-size:13px;text-align:center;">
      Oder antworte einfach auf diese E-Mail — wir helfen dir gerne weiter.
    </p>
  `, `Terminbestätigung: ${terminText}`)

  return {
    subject: `📅 Terminbestätigung: ${new Date(params.termin).toLocaleDateString('de-DE', { weekday: 'long', day: '2-digit', month: 'long' })}`,
    html,
  }
}

// ─── MAIL 4: Termin verschoben ────────────────────────────────────────────────
export function terminVerschoben(params: {
  vorname: string
  marke: string
  modell: string
  alterTermin: Date | string
  neuerTermin: Date | string
  adresse?: string | null
  adresseZusatz?: string | null
  telefon: string
  bearbeiter?: { vorname: string; nachname: string; telefon?: string | null; whatsapp?: string | null } | null
}) {
  const altText = formatDatum(params.alterTermin)
  const neuText = formatDatum(params.neuerTermin)

  const html = emailLayout(`
    <h2 style="margin:0 0 8px;color:#0F172A;font-size:20px;font-weight:800;">Hallo ${params.vorname},</h2>
    <p style="margin:0 0 24px;color:#475569;font-size:15px;line-height:1.7;">
      dein Besichtigungstermin für den <strong>${params.marke} ${params.modell}</strong> wurde auf einen neuen Zeitpunkt verschoben. Hier sind die aktualisierten Infos:
    </p>

    <!-- Alter Termin (durchgestrichen) -->
    <table width="100%" cellpadding="0" cellspacing="0" style="background:#FEF2F2;border:1px solid #FECACA;border-radius:12px;margin-bottom:12px;">
      <tr><td style="padding:16px 24px;">
        <p style="margin:0 0 4px;color:#991B1B;font-size:11px;font-weight:700;letter-spacing:1px;text-transform:uppercase;">Alter Termin (abgesagt)</p>
        <p style="margin:0;color:#64748B;font-size:15px;text-decoration:line-through;">📅 ${altText}</p>
      </td></tr>
    </table>

    <!-- Neuer Termin -->
    <table width="100%" cellpadding="0" cellspacing="0" style="background:#0F172A;border-radius:12px;margin-bottom:24px;">
      <tr><td style="padding:20px 24px;">
        <p style="margin:0 0 4px;color:rgba(255,255,255,0.5);font-size:11px;font-weight:700;letter-spacing:1px;text-transform:uppercase;">Neuer Termin</p>
        <p style="margin:0 0 8px;color:#ffffff;font-size:18px;font-weight:800;">📅 ${neuText}</p>
        ${params.adresse ? `
          <p style="margin:0 0 4px;color:rgba(255,255,255,0.65);font-size:13px;">📍 ${params.adresse}</p>
          ${params.adresseZusatz ? `<p style="margin:0 0 10px;color:rgba(255,255,255,0.5);font-size:12px;padding-left:20px;">${params.adresseZusatz}</p>` : '<span style="display:block;margin-bottom:10px;"></span>'}
          <a href="https://maps.google.com/?q=${encodeURIComponent(params.adresse)}" target="_blank" style="display:inline-block;background:rgba(255,255,255,0.12);color:#ffffff;font-size:12px;font-weight:600;text-decoration:none;padding:6px 14px;border-radius:8px;border:1px solid rgba(255,255,255,0.2);">🗺️ In Google Maps öffnen</a>
        ` : ''}
      </td></tr>
    </table>

    <p style="margin:0 0 24px;color:#475569;font-size:14px;line-height:1.6;">
      Sollte der neue Termin für dich nicht passen, melde dich bitte <strong>mindestens 24 Stunden vorher</strong> bei uns — wir finden gemeinsam eine passende Zeit.
    </p>

    ${params.bearbeiter ? `
    <!-- Ansprechpartner -->
    <table width="100%" cellpadding="0" cellspacing="0" style="background:#F0F9FF;border:1px solid #BAE6FD;border-radius:12px;margin-bottom:16px;">
      <tr><td style="padding:16px 24px;">
        <p style="margin:0 0 6px;color:#0369A1;font-size:11px;font-weight:700;letter-spacing:1px;text-transform:uppercase;">Dein Ansprechpartner vor Ort</p>
        <p style="margin:0 0 6px;color:#0F172A;font-size:15px;font-weight:700;">${params.bearbeiter.vorname} ${params.bearbeiter.nachname}</p>
        ${params.bearbeiter.telefon ? `<p style="margin:0 0 2px;color:#475569;font-size:14px;">📞 <a href="tel:${params.bearbeiter.telefon}" style="color:#0369A1;text-decoration:none;">${params.bearbeiter.telefon}</a></p>` : ''}
        ${params.bearbeiter.whatsapp ? `<p style="margin:0;color:#475569;font-size:14px;">💬 <a href="https://wa.me/${params.bearbeiter.whatsapp.replace(/[^0-9]/g, '')}" style="color:#0369A1;text-decoration:none;">WhatsApp schreiben</a></p>` : ''}
      </td></tr>
    </table>

    <p style="margin:0 0 12px;color:#94A3B8;font-size:13px;text-align:center;">
      Allgemeine Fragen zum Ablauf? Unsere Zentrale ist gerne für dich da:
    </p>
    ` : `
    <p style="margin:0 0 12px;color:#475569;font-size:14px;text-align:center;">
      Passt der neue Termin nicht? Ruf uns einfach an:
    </p>
    `}

    <table width="100%" cellpadding="0" cellspacing="0">
      <tr><td align="center">
        <a href="tel:${params.telefon}" style="display:inline-block;background:#0369A1;color:white;font-size:15px;font-weight:700;text-decoration:none;padding:14px 32px;border-radius:10px;">
          📞 ${params.telefon}
        </a>
      </td></tr>
    </table>
  `, `Terminänderung: ${params.marke} ${params.modell}`)

  return {
    subject: `🔄 Dein Termin wurde verschoben — ${new Date(params.neuerTermin).toLocaleDateString('de-DE', { weekday: 'long', day: '2-digit', month: 'long' })}`,
    html,
  }
}

// ─── MAIL 5a: Termin abgesagt (von uns) ───────────────────────────────────────
export function terminAbgesagt(params: {
  vorname: string
  marke: string
  modell: string
  alterTermin: Date | string
  telefon: string
  whatsapp: string
  ersatztermin1?: Date | string | null
  ersatztermin2?: Date | string | null
  kommentar?: string | null
}) {
  const altText = formatDatum(params.alterTermin)
  const waLink = `https://wa.me/${params.whatsapp}`

  const ersatzBox = (params.ersatztermin1 || params.ersatztermin2) ? `
    <!-- Ersatztermine -->
    <table width="100%" cellpadding="0" cellspacing="0" style="background:#EFF6FF;border:1px solid #BFDBFE;border-radius:12px;margin-bottom:24px;">
      <tr><td style="padding:18px 24px;">
        <p style="margin:0 0 12px;color:#1E40AF;font-size:13px;font-weight:700;">Mögliche Ersatztermine:</p>
        ${params.ersatztermin1 ? `<p style="margin:0 0 8px;color:#1E3A8A;font-size:15px;font-weight:700;">📅 ${formatDatum(params.ersatztermin1)}</p>` : ''}
        ${params.ersatztermin2 ? `<p style="margin:0;color:#1E3A8A;font-size:15px;font-weight:700;">📅 ${formatDatum(params.ersatztermin2)}</p>` : ''}
      </td></tr>
    </table>` : ''

  const kommentarBox = params.kommentar ? `
    <p style="margin:0 0 24px;color:#475569;font-size:15px;line-height:1.6;font-style:italic;">
      "${params.kommentar}"
    </p>` : ''

  const html = emailLayout(`
    <h2 style="margin:0 0 8px;color:#0F172A;font-size:20px;font-weight:800;">Hallo ${params.vorname},</h2>
    <p style="margin:0 0 16px;color:#475569;font-size:15px;line-height:1.7;">
      leider müssen wir deinen Besichtigungstermin am <strong>${altText}</strong> für den <strong>${params.marke} ${params.modell}</strong> kurzfristig absagen. Wir entschuldigen uns für die Unannehmlichkeiten.
    </p>
    ${kommentarBox}
    ${ersatzBox || `<p style="margin:0 0 24px;color:#475569;font-size:15px;line-height:1.6;">
      Wir melden uns in Kürze, um gemeinsam einen neuen Termin zu finden — das Angebot steht natürlich weiterhin für dich bereit.
    </p>`}

    <!-- Kontakt -->
    <table width="100%" cellpadding="0" cellspacing="0" style="margin-bottom:24px;">
      <tr>
        <td style="padding:0 6px 0 0;width:50%;vertical-align:top;">
          <a href="tel:${params.telefon}" style="display:block;background:#0369A1;color:white;font-size:14px;font-weight:700;text-decoration:none;padding:14px 16px;border-radius:10px;text-align:center;">
            📞 Jetzt anrufen
          </a>
        </td>
        <td style="padding:0 0 0 6px;width:50%;vertical-align:top;">
          <a href="${waLink}" style="display:block;background:#25D366;color:white;font-size:14px;font-weight:700;text-decoration:none;padding:14px 16px;border-radius:10px;text-align:center;">
            💬 WhatsApp
          </a>
        </td>
      </tr>
    </table>
    <p style="margin:0;color:#94A3B8;font-size:13px;text-align:center;">
      Oder antworte einfach auf diese E-Mail — wir sind für dich da.
    </p>
  `, `Terminabsage: ${params.marke} ${params.modell}`)

  return {
    subject: `❌ Terminabsage: ${new Date(params.alterTermin).toLocaleDateString('de-DE', { day: '2-digit', month: 'long' })} — ${params.marke} ${params.modell}`,
    html,
  }
}

// ─── MAIL 5b: Kunde hat abgesagt, möchte neuen Termin ────────────────────────
export function terminKundeAbgesagt(params: {
  vorname: string
  marke: string
  modell: string
  alterTermin: Date | string
  telefon: string
  whatsapp: string
  kommentar?: string | null
}) {
  const altText = formatDatum(params.alterTermin)
  const waLink = `https://wa.me/${params.whatsapp}`

  const kommentarBox = params.kommentar ? `
    <table width="100%" cellpadding="0" cellspacing="0" style="background:#F8FAFC;border:1px solid #E2EDF7;border-radius:12px;margin-bottom:24px;">
      <tr><td style="padding:16px 20px;">
        <p style="margin:0;color:#475569;font-size:14px;line-height:1.6;font-style:italic;">"${params.kommentar}"</p>
      </td></tr>
    </table>` : ''

  const html = emailLayout(`
    <h2 style="margin:0 0 8px;color:#0F172A;font-size:20px;font-weight:800;">Hallo ${params.vorname},</h2>
    <p style="margin:0 0 16px;color:#475569;font-size:15px;line-height:1.7;">
      kein Problem — wir haben deine Absage für den <strong>${altText}</strong> erhalten. Dein <strong>${params.marke} ${params.modell}</strong> interessiert uns weiterhin, und wir melden uns in Kürze, um einen neuen Termin zu finden.
    </p>
    ${kommentarBox}
    <p style="margin:0 0 24px;color:#475569;font-size:15px;line-height:1.6;">
      Du kannst uns auch jederzeit selbst kontaktieren — wir sind flexibel.
    </p>

    <!-- Kontakt -->
    <table width="100%" cellpadding="0" cellspacing="0" style="margin-bottom:24px;">
      <tr>
        <td style="padding:0 6px 0 0;width:50%;vertical-align:top;">
          <a href="tel:${params.telefon}" style="display:block;background:#0369A1;color:white;font-size:14px;font-weight:700;text-decoration:none;padding:14px 16px;border-radius:10px;text-align:center;">
            📞 Jetzt anrufen
          </a>
        </td>
        <td style="padding:0 0 0 6px;width:50%;vertical-align:top;">
          <a href="${waLink}" style="display:block;background:#25D366;color:white;font-size:14px;font-weight:700;text-decoration:none;padding:14px 16px;border-radius:10px;text-align:center;">
            💬 WhatsApp
          </a>
        </td>
      </tr>
    </table>
    <p style="margin:0;color:#94A3B8;font-size:13px;text-align:center;">
      Oder antworte einfach auf diese E-Mail — wir melden uns bald bei dir.
    </p>
  `, `Terminabsage bestätigt: ${params.marke} ${params.modell}`)

  return {
    subject: `Kein Problem — wir melden uns für einen neuen Termin`,
    html,
  }
}

// ─── MAIL 6: Follow-up / Zweiterinnerung ──────────────────────────────────────
export function followupEmail(params: {
  vorname: string
  marke: string
  modell: string
  anfrageId: string
  telefon?: string
  whatsapp?: string
  customBetreff?: string
  customInhalt?: string
}) {
  const subject = params.customBetreff?.replace('{{vorname}}', params.vorname) ||
    `Noch Interesse, ${params.vorname}? Dein Angebot wartet`

  const defaultInhalt = `vor einigen Tagen hast du eine Anfrage für deinen <strong>${params.marke} ${params.modell}</strong> gestellt. Wir würden uns freuen, dir noch ein Angebot zu machen — falls du noch überlegst oder einfach Fragen hast, sind wir gerne für dich da.`

  const inhalt = params.customInhalt
    ? params.customInhalt
        .replace(/{{vorname}}/g, params.vorname)
        .replace(/{{marke}}/g, params.marke)
        .replace(/{{modell}}/g, params.modell)
    : defaultInhalt

  const tel = params.telefon || '+49 176 64179764'
  const wa = params.whatsapp || '4917664179764'

  const html = emailLayout(`
    <h2 style="margin:0 0 8px;color:#0F172A;font-size:20px;font-weight:800;">Hallo ${params.vorname},</h2>
    <p style="margin:0 0 24px;color:#475569;font-size:15px;line-height:1.7;">${inhalt}</p>

    <!-- Fahrzeug -->
    <table width="100%" cellpadding="0" cellspacing="0" style="background:#FFF7ED;border:1px solid #FED7AA;border-radius:12px;margin-bottom:24px;">
      <tr><td style="padding:18px 24px;">
        <p style="margin:0 0 4px;color:#92400E;font-size:12px;font-weight:700;text-transform:uppercase;letter-spacing:1px;">Dein Fahrzeug</p>
        <p style="margin:0;color:#0F172A;font-size:17px;font-weight:800;">${params.marke} ${params.modell}</p>
      </td></tr>
    </table>

    <p style="margin:0 0 20px;color:#475569;font-size:14px;line-height:1.6;">
      Melde dich einfach bei uns — telefonisch, per WhatsApp oder antworte auf diese E-Mail. Wir nehmen uns die Zeit für dich.
    </p>

    <table width="100%" cellpadding="0" cellspacing="0" style="margin-bottom:16px;">
      <tr>
        <td style="padding:0 6px 0 0;width:50%;vertical-align:top;">
          <a href="tel:${tel}" style="display:block;background:#FB6F6F;color:white;font-size:14px;font-weight:700;text-decoration:none;padding:14px 16px;border-radius:10px;text-align:center;">
            📞 Jetzt anrufen
          </a>
        </td>
        <td style="padding:0 0 0 6px;width:50%;vertical-align:top;">
          <a href="https://wa.me/${wa}" style="display:block;background:#25D366;color:white;font-size:14px;font-weight:700;text-decoration:none;padding:14px 16px;border-radius:10px;text-align:center;">
            💬 WhatsApp
          </a>
        </td>
      </tr>
    </table>
    <p style="margin:0;color:#94A3B8;font-size:13px;text-align:center;">
      Das Angebot gilt noch — wir freuen uns auf deine Nachricht.
    </p>
  `, `Noch Interesse an einem Angebot für deinen ${params.marke} ${params.modell}?`)

  return { subject, html }
}

// ─── Interne Benachrichtigung (für Firma) ─────────────────────────────────────
export function neueAnfrageIntern(params: {
  vorname: string
  nachname: string
  marke: string
  modell: string
  kilometerstand: number
  plz: string
  anfrageId: string
  telefon?: string
}) {
  const dashboardUrl = `${BASE_URL}/dashboard/anfragen/${params.anfrageId}`

  const html = emailLayout(`
    <div style="background:#ECFDF5;border:1px solid #6EE7B7;border-radius:10px;padding:16px 20px;margin-bottom:24px;">
      <p style="margin:0;color:#065F46;font-size:14px;font-weight:700;">🚗 Neue Anfrage eingegangen!</p>
    </div>

    <table width="100%" cellpadding="0" cellspacing="0" style="background:#F8FAFC;border:1px solid #E2EDF7;border-radius:12px;margin-bottom:24px;">
      <tr><td style="padding:20px 24px;">
        <p style="margin:0 0 12px;color:#64748B;font-size:12px;font-weight:700;letter-spacing:1px;text-transform:uppercase;">Fahrzeug</p>
        <p style="margin:0 0 4px;color:#0F172A;font-size:20px;font-weight:800;">${params.marke} ${params.modell}</p>
        <p style="margin:0;color:#64748B;font-size:14px;">${params.kilometerstand.toLocaleString('de-DE')} km</p>
      </td></tr>
    </table>

    <table width="100%" cellpadding="0" cellspacing="0" style="margin-bottom:28px;">
      <tr>
        <td style="padding:6px 0;color:#64748B;font-size:14px;width:120px;">Kunde</td>
        <td style="padding:6px 0;color:#0F172A;font-size:14px;font-weight:600;">${params.vorname} ${params.nachname}</td>
      </tr>
      <tr>
        <td style="padding:6px 0;color:#64748B;font-size:14px;">PLZ</td>
        <td style="padding:6px 0;color:#0F172A;font-size:14px;font-weight:600;">${params.plz}</td>
      </tr>
      ${params.telefon ? `
      <tr>
        <td style="padding:6px 0;color:#64748B;font-size:14px;">Telefon</td>
        <td style="padding:6px 0;font-size:14px;font-weight:600;">
          <a href="tel:${params.telefon}" style="color:#0369A1;text-decoration:none;">${params.telefon}</a>
        </td>
      </tr>` : ''}
    </table>

    <table width="100%" cellpadding="0" cellspacing="0">
      <tr><td align="center">
        <a href="${dashboardUrl}" style="display:inline-block;background:#0369A1;color:white;font-size:15px;font-weight:700;text-decoration:none;padding:14px 32px;border-radius:10px;">
          Im Dashboard öffnen →
        </a>
      </td></tr>
    </table>
  `, `Neue Anfrage: ${params.marke} ${params.modell} von ${params.vorname} ${params.nachname}`)

  return {
    subject: `🚗 Neue Anfrage: ${params.marke} ${params.modell} – ${params.plz}`,
    html,
  }
}

// ─── Händler-Bestätigung (an Kooperationspartner) ────────────────────────────
export function haendlerBestaetigung(params: {
  vorname: string
  nachname: string
  firma: string
  fahrzeugAnzahl: string
  nachricht?: string
}) {
  const subject = 'Ihre Kooperationsanfrage bei AutoAnkauf-Baden'

  const html = emailLayout(`
    <p style="margin:0 0 8px;color:#64748B;font-size:14px;">Guten Tag ${params.vorname} ${params.nachname},</p>
    <h2 style="margin:0 0 20px;color:#0F172A;font-size:20px;font-weight:800;line-height:1.3;">
      Ihre Anfrage ist bei uns eingegangen!
    </h2>
    <p style="margin:0 0 24px;color:#64748B;font-size:15px;line-height:1.7;">
      Vielen Dank für Ihr Interesse an einer Zusammenarbeit mit AutoAnkauf-Baden. Wir haben Ihre Anfrage erhalten und melden uns innerhalb von <strong style="color:#0F172A;">48 Stunden (werktags)</strong> persönlich bei Ihnen.
    </p>

    <table width="100%" cellpadding="0" cellspacing="0" style="background:#F8FAFC;border:1px solid #E2EDF7;border-radius:12px;margin-bottom:28px;">
      <tr><td style="padding:20px 24px;">
        <p style="margin:0 0 14px;color:#64748B;font-size:12px;font-weight:700;letter-spacing:1px;text-transform:uppercase;">Deine Angaben</p>
        <table width="100%" cellpadding="0" cellspacing="0">
          <tr>
            <td style="padding:5px 0;color:#64748B;font-size:13px;width:130px;">Firma</td>
            <td style="padding:5px 0;color:#0F172A;font-size:13px;font-weight:600;">${params.firma}</td>
          </tr>
          <tr>
            <td style="padding:5px 0;color:#64748B;font-size:13px;">Fahrzeuge / Woche</td>
            <td style="padding:5px 0;color:#0F172A;font-size:13px;font-weight:600;">${params.fahrzeugAnzahl}</td>
          </tr>
          ${params.nachricht ? `
          <tr>
            <td style="padding:5px 0;color:#64748B;font-size:13px;vertical-align:top;">Nachricht</td>
            <td style="padding:5px 0;color:#0F172A;font-size:13px;">${params.nachricht}</td>
          </tr>` : ''}
        </table>
      </td></tr>
    </table>

    <div style="background:#E8F4FD;border-radius:10px;padding:16px 20px;margin-bottom:28px;">
      <p style="margin:0;color:#0369A1;font-size:14px;line-height:1.6;">
        <strong>Was passiert als Nächstes?</strong><br>
        Wir schauen uns Ihre Angaben in Ruhe an und melden uns innerhalb von 1–2 Werktagen bei Ihnen.
      </p>
    </div>

    <table width="100%" cellpadding="0" cellspacing="0">
      <tr><td align="center">
        <a href="${BASE_URL}/haendler" style="display:inline-block;background:#0369A1;color:white;font-size:15px;font-weight:700;text-decoration:none;padding:14px 32px;border-radius:10px;">
          Mehr zur Händler-Kooperation →
        </a>
      </td></tr>
    </table>
  `, `Ihre Anfrage bei AutoAnkauf-Baden ist eingegangen – wir melden uns in 48h.`)

  return { subject, html }
}

// ─── Passwort-Reset (internes Admin-Tool) ─────────────────────────────────────
export function passwortZugesendet(params: {
  vorname: string
  tempPasswort: string
}) {
  const subject = '[AAB] Dein temporäres Passwort'

  const html = emailLayout(`
    <p style="margin:0 0 8px;color:#64748B;font-size:14px;">Hallo ${params.vorname},</p>
    <h2 style="margin:0 0 20px;color:#0F172A;font-size:20px;font-weight:800;line-height:1.3;">
      Dein temporäres Passwort
    </h2>
    <p style="margin:0 0 24px;color:#64748B;font-size:15px;line-height:1.7;">
      Hier ist dein temporäres Passwort für das AutoAnkauf-Baden Dashboard. Bitte ändere es nach dem ersten Login unter <strong style="color:#0F172A;">Einstellungen → Mitarbeiter</strong>.
    </p>

    <table width="100%" cellpadding="0" cellspacing="0" style="background:#F0F7FF;border:2px solid #0369A1;border-radius:12px;margin-bottom:28px;">
      <tr><td style="padding:20px 24px;text-align:center;">
        <p style="margin:0 0 8px;color:#64748B;font-size:12px;font-weight:700;letter-spacing:1px;text-transform:uppercase;">Temporäres Passwort</p>
        <p style="margin:0;color:#0F172A;font-size:24px;font-weight:900;letter-spacing:4px;font-family:monospace;">${params.tempPasswort}</p>
      </td></tr>
    </table>

    <table width="100%" cellpadding="0" cellspacing="0">
      <tr><td align="center">
        <a href="${BASE_URL}/dashboard/login" style="display:inline-block;background:#0369A1;color:white;font-size:15px;font-weight:700;text-decoration:none;padding:14px 32px;border-radius:10px;">
          Zum Login →
        </a>
      </td></tr>
    </table>

    <p style="margin:24px 0 0;color:#94A3B8;font-size:12px;text-align:center;line-height:1.6;">
      Falls du kein Passwort angefordert hast, kannst du diese E-Mail ignorieren.
    </p>
  `, 'Dein temporäres Dashboard-Passwort')

  return { subject, html }
}

// ─── MAIL 10: Ablehnung Kunde ─────────────────────────────────────────────────
export function ablehnungKunde(params: {
  vorname: string
  marke: string
  modell: string
  grund?: string
  telefon?: string
  whatsapp?: string
  bearbeiterName?: string | null
}) {
  const subject = `Zu deiner Anfrage – ${params.marke} ${params.modell}`

  const html = emailLayout(`
    <h2 style="margin:0 0 8px;color:#0F172A;font-size:20px;font-weight:800;">Hallo ${params.vorname},</h2>
    <p style="margin:0 0 20px;color:#475569;font-size:15px;line-height:1.7;">
      vielen Dank für dein Vertrauen und deine Anfrage zu deinem <strong>${params.marke} ${params.modell}</strong>.
      Wir haben alles sorgfältig geprüft und möchten uns jetzt bei dir melden.
    </p>

    <table width="100%" cellpadding="0" cellspacing="0" style="background:#FEF2F2;border:1px solid #FECACA;border-radius:12px;margin-bottom:24px;">
      <tr><td style="padding:20px 24px;">
        <p style="margin:0 0 8px;color:#B91C1C;font-size:12px;font-weight:700;letter-spacing:1px;text-transform:uppercase;">Unsere Rückmeldung</p>
        <p style="margin:0;color:#7F1D1D;font-size:15px;line-height:1.7;">
          ${params.grund
            ? params.grund
            : 'Leider müssen wir dir mitteilen, dass wir dein Fahrzeug zu diesem Zeitpunkt nicht ankaufen können.'}
        </p>
      </td></tr>
    </table>

    <p style="margin:0 0 20px;color:#475569;font-size:15px;line-height:1.7;">
      Wir wissen, dass das nicht die Antwort ist, die du dir erhofft hast – und das tut uns wirklich leid.
      Falls sich die Situation ändert oder du ein anderes Fahrzeug verkaufen möchtest, sind wir gerne wieder für dich da.
    </p>

    ${params.telefon || params.whatsapp ? `
    <table width="100%" cellpadding="0" cellspacing="0" style="background:#F0F9FF;border:1px solid #BAE6FD;border-radius:12px;margin-bottom:24px;">
      <tr><td style="padding:20px 24px;">
        <p style="margin:0 0 8px;color:#0369A1;font-size:12px;font-weight:700;letter-spacing:1px;text-transform:uppercase;">Noch Fragen?</p>
        <p style="margin:0;color:#475569;font-size:14px;line-height:1.6;">
          Wenn du etwas besprechen möchtest, erreichst du uns gerne:
          ${params.telefon ? `<br>📞 <a href="tel:${params.telefon}" style="color:#0369A1;text-decoration:none;">${params.telefon}</a>` : ''}
          ${params.whatsapp ? `<br>💬 WhatsApp: <a href="https://wa.me/${params.whatsapp.replace(/[^0-9]/g, '')}" style="color:#0369A1;text-decoration:none;">${params.whatsapp}</a>` : ''}
        </p>
      </td></tr>
    </table>
    ` : ''}

    <p style="margin:24px 0 0;color:#475569;font-size:15px;line-height:1.7;">
      Alles Gute und viel Erfolg beim Verkauf deines Fahrzeugs!<br><br>
      Herzliche Grüße<br>
      <strong>${params.bearbeiterName ? `${params.bearbeiterName} | ` : ''}AutoAnkauf-Baden-Team</strong>
    </p>
  `, `Rückmeldung zu deiner Anfrage – ${params.marke} ${params.modell}`)

  return { subject, html }
}

// ─── MAIL 11: Rückfrage an Kunde ──────────────────────────────────────────────
export function rueckfrageKunde(params: {
  vorname: string
  marke: string
  modell: string
  frage: string
  telefon?: string
  whatsapp?: string
  bearbeiterName?: string | null
}) {
  const subject = `Kurze Rückfrage zu deiner Anfrage – ${params.marke} ${params.modell}`

  const html = emailLayout(`
    <h2 style="margin:0 0 8px;color:#0F172A;font-size:20px;font-weight:800;">Hallo ${params.vorname},</h2>
    <p style="margin:0 0 20px;color:#475569;font-size:15px;line-height:1.7;">
      wir prüfen gerade deine Anfrage zu deinem <strong>${params.marke} ${params.modell}</strong> und sind fast fertig.
      Damit wir dir ein wirklich passendes Angebot machen können, haben wir noch eine kurze Frage:
    </p>

    <table width="100%" cellpadding="0" cellspacing="0" style="background:#F0F9FF;border:1px solid #BAE6FD;border-radius:12px;margin-bottom:24px;">
      <tr><td style="padding:20px 24px;">
        <p style="margin:0 0 8px;color:#0369A1;font-size:12px;font-weight:700;letter-spacing:1px;text-transform:uppercase;">Unsere Rückfrage</p>
        <p style="margin:0;color:#0F172A;font-size:15px;line-height:1.7;">${params.frage}</p>
      </td></tr>
    </table>

    <p style="margin:0 0 20px;color:#475569;font-size:15px;line-height:1.7;">
      Du kannst uns einfach auf diese E-Mail antworten – wir melden uns dann <strong>schnellstmöglich</strong> bei dir zurück.
      ${params.telefon ? `Oder ruf uns direkt an: <a href="tel:${params.telefon}" style="color:#0369A1;text-decoration:none;">${params.telefon}</a>` : ''}
    </p>

    <p style="margin:0;color:#475569;font-size:15px;line-height:1.7;">
      Vielen Dank für deine Mithilfe!<br><br>
      Herzliche Grüße<br>
      <strong>${params.bearbeiterName ? `${params.bearbeiterName} | ` : ''}AutoAnkauf-Baden-Team</strong>
    </p>
  `, `Rückfrage zu deiner Anfrage – ${params.marke} ${params.modell}`)

  return { subject, html }
}

// ─── MAIL 12: Freie Nachricht an Kunde ────────────────────────────────────────
export function freieNachrichtKunde(params: {
  vorname: string
  marke: string
  modell: string
  nachricht: string
  telefon?: string
  bearbeiterName?: string | null
}) {
  const subject = `Nachricht zu deiner Anfrage – ${params.marke} ${params.modell}`

  const html = emailLayout(`
    <h2 style="margin:0 0 8px;color:#0F172A;font-size:20px;font-weight:800;">Hallo ${params.vorname},</h2>
    <p style="margin:0 0 20px;color:#475569;font-size:15px;line-height:1.7;">
      wir melden uns wegen deiner Anfrage zu deinem <strong>${params.marke} ${params.modell}</strong>:
    </p>

    <table width="100%" cellpadding="0" cellspacing="0" style="background:#F8FAFC;border:1px solid #E2EDF7;border-radius:12px;margin-bottom:24px;">
      <tr><td style="padding:20px 24px;">
        <p style="margin:0;color:#0F172A;font-size:15px;line-height:1.7;white-space:pre-wrap;">${params.nachricht}</p>
      </td></tr>
    </table>

    ${params.telefon ? `
    <p style="margin:0 0 20px;color:#475569;font-size:15px;line-height:1.7;">
      Bei Fragen erreichst du uns jederzeit unter <a href="tel:${params.telefon}" style="color:#0369A1;text-decoration:none;">${params.telefon}</a>.
    </p>
    ` : ''}

    <p style="margin:0;color:#475569;font-size:15px;line-height:1.7;">
      Herzliche Grüße<br>
      <strong>${params.bearbeiterName ? `${params.bearbeiterName} | ` : ''}AutoAnkauf-Baden-Team</strong>
    </p>
  `, `Nachricht zu deiner Anfrage – ${params.marke} ${params.modell}`)

  return { subject, html }
}

// ─── MAIL 13: Bearbeiter-Wechsel Benachrichtigung ─────────────────────────────
export function bearbeiterGeaendert(params: {
  vorname: string
  marke: string
  modell: string
  bearbeiterVorname: string
  bearbeiterNachname: string
  bearbeiterTelefon?: string | null
  bearbeiterWhatsapp?: string | null
}) {
  const subject = `Dein neuer Ansprechpartner – ${params.marke} ${params.modell}`

  const html = emailLayout(`
    <h2 style="margin:0 0 8px;color:#0F172A;font-size:20px;font-weight:800;">Hallo ${params.vorname},</h2>
    <p style="margin:0 0 24px;color:#475569;font-size:15px;line-height:1.7;">
      wir möchten dich kurz informieren: Für deine Anfrage zu deinem <strong>${params.marke} ${params.modell}</strong> ist ab sofort ein neuer Ansprechpartner für dich zuständig.
    </p>

    <table width="100%" cellpadding="0" cellspacing="0" style="background:#F0F9FF;border:1px solid #BAE6FD;border-radius:12px;margin-bottom:24px;">
      <tr><td style="padding:20px 24px;">
        <p style="margin:0 0 6px;color:#0369A1;font-size:11px;font-weight:700;letter-spacing:1px;text-transform:uppercase;">Dein neuer Ansprechpartner</p>
        <p style="margin:0 ${params.bearbeiterTelefon || params.bearbeiterWhatsapp ? '0 10px' : ''};color:#0F172A;font-size:17px;font-weight:700;">${params.bearbeiterVorname} ${params.bearbeiterNachname}</p>
        ${params.bearbeiterTelefon ? `<p style="margin:0 0 4px;color:#475569;font-size:14px;">📞 <a href="tel:${params.bearbeiterTelefon}" style="color:#0369A1;text-decoration:none;">${params.bearbeiterTelefon}</a></p>` : ''}
        ${params.bearbeiterWhatsapp ? `<p style="margin:0;color:#475569;font-size:14px;">💬 <a href="https://wa.me/${params.bearbeiterWhatsapp.replace(/[^0-9]/g, '')}" style="color:#0369A1;text-decoration:none;">WhatsApp schreiben</a></p>` : ''}
      </td></tr>
    </table>

    <p style="margin:0;color:#475569;font-size:15px;line-height:1.7;">
      Bei Fragen rund um deine Anfrage kannst du dich gerne direkt bei ihm melden — wir sind für dich da!<br><br>
      Herzliche Grüße<br>
      <strong>Dein AutoAnkauf-Baden-Team</strong>
    </p>
  `, `Dein neuer Ansprechpartner: ${params.bearbeiterVorname} ${params.bearbeiterNachname}`)

  return { subject, html }
}
