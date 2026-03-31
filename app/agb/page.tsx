import type { Metadata } from 'next'
import Link from 'next/link'

export const metadata: Metadata = {
  title: 'AGB – Allgemeine Geschäftsbedingungen | AutoAnkauf-Baden',
  description: 'Allgemeine Geschäftsbedingungen der autoankauf-baden.de – Muhammet Demir, Einzelunternehmen.',
  robots: { index: false },
}

const paragraphen = [
  {
    titel: '§ 1 Geltungsbereich, Vertragspartner und Begriffsbestimmungen',
    absaetze: [
      'Diese Allgemeinen Geschäftsbedingungen (im Folgenden „AGB") gelten für alle gegenwärtigen und zukünftigen Geschäftsbeziehungen, Anfragen, vorvertraglichen Verhandlungen und Kaufverträge zwischen dem Einzelunternehmen Muhammet Demir, handelnd unter der Geschäftsbezeichnung „autoankauf-baden.de", Heidelberger Str. 4, 76676 Graben-Neudorf (im Folgenden „Ankäufer" oder „Wir") und dem jeweiligen Kunden (im Folgenden „Verkäufer"), die über die Internetpräsenz www.autoankauf-baden.de oder in direkter Folge daraus angebahnt und physisch geschlossen werden.',
      'Maßgeblich ist jeweils die zum Zeitpunkt der Anfrage beziehungsweise des Vertragsschlusses gültige Fassung dieser AGB. Abweichende, entgegenstehende, einschränkende oder ergänzende Allgemeine Geschäftsbedingungen des Verkäufers werden nur dann und insoweit Bestandteil des Vertrages, als der Ankäufer ihrer Geltung ausdrücklich und in Schriftform zugestimmt hat.',
      'Das Dienstleistungs- und Ankaufsangebot des Ankäufers richtet sich sowohl an Verbraucher im Sinne des § 13 BGB als auch an Unternehmer, Kaufleute, juristische Personen des öffentlichen Rechts und öffentlich-rechtliche Sondervermögen im Sinne des § 14 BGB.',
    ],
  },
  {
    titel: '§ 2 Vertragsgegenstand und detaillierte Leistungsbeschreibung',
    absaetze: [
      'Der Ankäufer betreibt ein spezialisiertes Online-Portal zum Zwecke des gewerblichen Ankaufs von gebrauchten Kraftfahrzeugen aller Art und Klassifizierungen. Dies schließt explizit unfallfreie Fahrzeuge, Neufahrzeuge, reguläre Gebrauchtwagen sowie Fahrzeuge mit erheblichen Unfallschäden, Motorschäden, Getriebeschäden, wirtschaftlichen Totalschäden, fehlender Hauptuntersuchung (TÜV) oder sonstigen Mängeln vollumfänglich mit ein.',
      'Die auf der Website bereitgestellte digitale Leistung des Ankäufers besteht in der Bereitstellung einer Eingabemaske und der Ermöglichung einer unkomplizierten Kontaktaufnahme zur strukturierten Übermittlung von Fahrzeugdaten. Auf Basis dieser Daten gibt der Ankäufer eine vorläufige Ersteinschätzung ab und führt im Anschluss bei beiderseitigem Interesse einen rechtsverbindlichen Ankaufsprozess im Rahmen eines physischen Termins durch.',
    ],
  },
  {
    titel: '§ 3 Unverbindliche Online-Anfrage und Rechtsnatur der Ersteinschätzung',
    absaetze: [
      'Die Präsentation des Ankaufsportals auf der Website autoankauf-baden.de stellt kein rechtlich bindendes Angebot zum Abschluss eines Kaufvertrages dar. Es handelt sich ausschließlich um eine unverbindliche Aufforderung zur Abgabe von Informationen und zur Einleitung von Vertragsverhandlungen durch den Verkäufer (invitatio ad offerendum).',
      'Der Verkäufer kann über das auf der Website bereitgestellte Kontaktformular die Daten seines Fahrzeugs unverbindlich an den Ankäufer übermitteln. Der Verkäufer verpflichtet sich hierbei, sämtliche Parameter nach bestem Wissen und Gewissen wahrheitsgemäß und so vollständig wie möglich anzugeben.',
      'Basierend auf der Auswertung der übermittelten Daten und aktueller Marktkennzahlen erhält der Verkäufer vom Ankäufer (in der Regel per E-Mail oder im Rahmen eines Telefongesprächs) ein Angebot in Form einer vorläufigen Ersteinschätzung des Ankaufspreises.',
      'Diese Ersteinschätzung stellt ausdrücklich keinen rechtsverbindlichen Kaufvertrag und keine unwiderrufliche Kaufzusage dar. Die Ersteinschätzung steht rechtlich zwingend unter der aufschiebenden Bedingung (§ 158 Abs. 1 BGB) einer für den Ankäufer zufriedenstellenden physischen und technischen Begutachtung des Fahrzeugs vor Ort.',
      'Die in der Ersteinschätzung genannte Preisschätzung hat eine Systemgültigkeit von 7 Tagen ab Übermittlung, strikt vorbehaltlich der Prüfung des tatsächlichen Fahrzeugzustands.',
    ],
  },
  {
    titel: '§ 4 Physische Besichtigung, Preisfindung und verbindlicher Vertragsschluss',
    absaetze: [
      'Sofern der Verkäufer mit dem Rahmen der Ersteinschätzung einverstanden ist, vereinbaren die Parteien einen zeitnahen Termin zur physischen Besichtigung des Fahrzeugs am Standort des Verkäufers oder an einem anderen vereinbarten Ort.',
      'Im Rahmen der Besichtigung wird der tatsächliche optische, technische und rechtliche Zustand des Fahrzeugs durch den Ankäufer detailliert auf Übereinstimmung mit den online übermittelten Daten geprüft. Dies schließt Probefahrten, Lackschichtdickenmessungen und das Auslesen des Fehlerspeichers ausdrücklich ein.',
      'Der Ankäufer behält sich ausdrücklich das Recht vor, den in der Ersteinschätzung genannten Preis nach Abschluss der Begutachtung anzupassen – sowohl nach oben (bei werterhöhenden Merkmalen) als auch nach unten (bei wertmindernden Faktoren wie Schäden, Verschleiß oder fehlenden Dokumenten).',
      'Ein rechtsverbindlicher Kaufvertrag kommt erst dann zustande, wenn sich beide Parteien nach der vollständigen Besichtigung vor Ort auf einen endgültigen, beiderseits akzeptierten Kaufpreis einigen und einen gesonderten, schriftlichen Kaufvertrag unterzeichnen.',
      'Kommt keine Einigung zustande, gilt der Vorgang für beide Seiten als vollumfänglich und kostenfrei erledigt. Ansprüche auf Aufwendungsersatz, Verdienstausfall oder Transportkosten bestehen für keine der Parteien.',
    ],
  },
  {
    titel: '§ 5 Obliegenheiten des Verkäufers, Zusicherungen und Eigentumsnachweise',
    absaetze: [
      'Der Verkäufer sichert bei Abschluss des schriftlichen Kaufvertrags ausdrücklich zu, dass er der alleinige, rechtmäßige Eigentümer des angebotenen Fahrzeugs ist oder über eine gültige, schriftliche Verkaufsvollmacht des rechtmäßigen Eigentümers verfügt.',
      'Der Verkäufer garantiert, dass das Fahrzeug vollständig frei von Rechten Dritter ist – insbesondere keine Pfandrechte, laufende Finanzierungen, Sicherungsübereignungen oder Leasingverträge bestehen, es sei denn, diese wurden dem Ankäufer vorab ausdrücklich kommuniziert.',
      'Zwingende Offenbarungspflicht: Der Verkäufer ist verpflichtet, dem Ankäufer unaufgefordert, vollständig und wahrheitsgemäß sämtliche bekannten Sach- und Rechtsmängel mitzuteilen. Hierzu zählen insbesondere: Unfallschäden (auch reparierte), Vorschäden an Motor und Getriebe, Eigenschaften als Importfahrzeug, die Nutzung als Taxi oder Mietwagen sowie jede bekannte Abweichung des Kilometerstandes von der tatsächlichen Gesamtlaufleistung.',
    ],
  },
  {
    titel: '§ 6 Fahrzeugübergabe, Gefahrübergang und Zahlungsmodalitäten',
    absaetze: [
      'Nach erfolgreicher Unterzeichnung des schriftlichen Kaufvertrags vor Ort erfolgt die physische Übergabe des Fahrzeugs Zug-um-Zug gegen Zahlung des vereinbarten Kaufpreises.',
      'Mit dem Fahrzeug sind sämtliche existierenden Fahrzeugschlüssel sowie die vollständigen Original-Fahrzeugpapiere (Zulassungsbescheinigung Teil I und II, aktueller HU/AU-Bericht, Serviceheft) an den Ankäufer auszuhändigen.',
      'Die Zahlung des vereinbarten Kaufpreises erfolgt grundsätzlich in bar vor Ort gegen Aushändigung einer ordnungsgemäßen Empfangsquittung. Eine bargeldlose Zahlung per Banküberweisung ist nur nach vorheriger, ausdrücklicher Vereinbarung in dokumentierten Ausnahmefällen möglich und erfolgt ausschließlich auf ein Konto, das auf den Namen des Verkäufers lautet. Die Auszahlung auf Konten Dritter ist aus Gründen der Geldwäscheprävention ausgeschlossen.',
      'Das Eigentum am Fahrzeug geht auf den Ankäufer erst mit der bestätigten und vollständigen Erfüllung der Kaufpreiszahlung über. Der Gefahrübergang gemäß § 446 BGB erfolgt mit der physischen Übergabe des Fahrzeugs, der Schlüssel und der vollständigen Papiere.',
    ],
  },
  {
    titel: '§ 7 Modifikation der Sachmängelhaftung, Garantien und Rückabwicklung bei Arglist',
    absaetze: [
      'Bei privaten Verkäufern (Verbraucher im Sinne des § 13 BGB) erfolgt der Verkauf des gebrauchten Fahrzeugs an den Ankäufer grundsätzlich unter Ausschluss jeglicher Sachmängelhaftung – „gekauft wie gesehen" nach eingehender Besichtigung.',
      'Dieser Gewährleistungsausschluss gilt gemäß § 444 BGB ausdrücklich nicht, sofern der Verkäufer bestimmte Eigenschaften garantiert hat oder Mängel arglistig verschwiegen hat (insbesondere Unfallschäden, Tachomanipulationen, Motoren- oder Getriebeschäden, Nutzung als Taxi oder Mietwagen).',
      'Bei arglistigem Verschweigen ist der Ankäufer berechtigt: (a) Minderung des Kaufpreises zu verlangen, (b) vom Kaufvertrag zurückzutreten, oder (c) Schadensersatz einschließlich Transport-, Abschlepp- und Gutachterkosten zu fordern.',
      'Ist der Verkäufer Unternehmer im Sinne des § 14 BGB, gelten die gesetzlichen Bestimmungen des BGB und des HGB.',
    ],
  },
  {
    titel: '§ 8 Expliziter Ausschluss des Widerrufsrechts für den Verkäufer',
    absaetze: [
      'Da der Verkäufer in diesem C2B-Geschäftsmodell dem unternehmerisch handelnden Ankäufer ein Fahrzeug veräußert, greifen die verbraucherschützenden Vorschriften zum gesetzlichen Widerrufsrecht bei Fernabsatz- oder Außergeschäftsraumverträgen (§§ 312g, 355 BGB) rechtlich nicht. Ein Widerrufsrecht des Verkäufers nach Abschluss des rechtsgültigen Kaufvertrags ist hiermit ausdrücklich ausgeschlossen. Der Vertrag ist mit der beiderseitigen Unterzeichnung endgültig und bindend.',
    ],
  },
  {
    titel: '§ 9 Datenschutz, differenzierte Löschfristen und Newsletter-Verwaltung',
    absaetze: [
      'Der Ankäufer verarbeitet personenbezogene Daten des Verkäufers im strikten Einklang mit den Bestimmungen der DSGVO und dem BDSG. Die Verarbeitung erfolgt primär zur Bearbeitung der Anfrage, zur Durchführung vorvertraglicher Maßnahmen und zur Erfüllung des Kaufvertrages (Rechtsgrundlage: Art. 6 Abs. 1 lit. b DSGVO).',
      'Löschungsfrist für ungenutzte Anfragen (Lead-Daten): Kommt kein Kaufvertrag zustande, werden sämtliche erhobenen personenbezogenen Daten innerhalb von 24 Monaten vollständig gelöscht (Rechtsgrundlage: berechtigtes Interesse gem. Art. 6 Abs. 1 lit. f DSGVO).',
      'Gesetzliche Aufbewahrungsfristen bei erfolgreichem Ankauf: Kaufverträge, Rechnungen und Quittungen müssen gemäß § 147 AO und § 257 HGB für 6 bis 10 Jahre archiviert werden. Eine Löschung dieser Daten nach 24 Monaten ist gesetzlich ausgeschlossen (Art. 17 Abs. 3 lit. b DSGVO). Diese Daten werden nach 24 Monaten für jede weitere Verarbeitung, insbesondere für werbliche Zwecke, gesperrt.',
      'Newsletter: Hat der Verkäufer den Newsletter abonniert, werden die dafür notwendigen Daten auf Grundlage der erteilten Einwilligung (Art. 6 Abs. 1 lit. a DSGVO) gespeichert. Die Einwilligung kann jederzeit widerrufen werden, z. B. durch einen Abmelde-Link oder eine Nachricht an den Ankäufer.',
    ],
  },
  {
    titel: '§ 10 Alternative Streitbeilegung und Schlussbestimmungen',
    absaetze: [
      'Die Europäische Kommission stellt eine Plattform zur Online-Streitbeilegung (OS) bereit: https://ec.europa.eu/consumers/odr/. Der Ankäufer ist weder bereit noch verpflichtet, an einem Streitbeilegungsverfahren vor einer Verbraucherschlichtungsstelle teilzunehmen.',
      'Auf alle Verträge und Rechtsbeziehungen findet ausschließlich das Recht der Bundesrepublik Deutschland unter Ausschluss des UN-Kaufrechts (CISG) Anwendung.',
      'Ist der Verkäufer Kaufmann im Sinne des HGB, juristische Person des öffentlichen Rechts oder ein öffentlich-rechtliches Sondervermögen, ist ausschließlicher Gerichtsstand der Geschäftssitz des Ankäufers (Graben-Neudorf). Für Verbraucher gelten die gesetzlichen Gerichtsstände.',
      'Salvatorische Klausel: Sollten einzelne Bestimmungen dieser AGB unwirksam sein oder werden, berührt dies die Wirksamkeit der übrigen Bestimmungen nicht. An die Stelle der unwirksamen Bestimmung tritt diejenige gesetzlich zulässige Regelung, die dem wirtschaftlichen Zweck der unwirksamen Bestimmung am nächsten kommt.',
    ],
  },
]

export default function AgbPage() {
  return (
    <div className="min-h-screen bg-[#F8FAFC]">
      {/* Hero */}
      <div className="bg-[#0369A1] py-12">
        <div className="container mx-auto px-4 md:px-6 lg:px-8 max-w-3xl">
          <p className="text-[#BAE6FD] text-sm font-medium mb-2">Rechtliches</p>
          <h1 className="text-3xl md:text-4xl font-black text-white">Allgemeine Geschäftsbedingungen</h1>
        </div>
      </div>

      {/* Content */}
      <div className="container mx-auto px-4 md:px-6 lg:px-8 max-w-3xl py-12">
        <div className="bg-white rounded-2xl border border-[#E2EDF7] p-8 md:p-10">

          <p className="text-sm text-[#64748B] mb-8 pb-6 border-b border-[#E2EDF7]">
            <strong className="text-[#0F172A]">autoankauf-baden.de</strong> · Muhammet Demir · Heidelberger Str. 4, 76676 Graben-Neudorf<br />
            Stand: 2026
          </p>

          <div className="space-y-8">
            {paragraphen.map((p) => (
              <section key={p.titel}>
                <h2 className="text-base font-bold text-[#0F172A] mb-3">{p.titel}</h2>
                <div className="space-y-3">
                  {p.absaetze.map((text, i) => (
                    <p key={i} className="text-sm text-[#64748B] leading-relaxed">
                      {p.absaetze.length > 1 && (
                        <span className="font-medium text-[#94A3B8] mr-2">({i + 1})</span>
                      )}
                      {text}
                    </p>
                  ))}
                </div>
              </section>
            ))}
          </div>

        </div>

        <div className="mt-6 text-center">
          <Link href="/" className="text-sm text-[#64748B] hover:text-[#0369A1] transition-colors duration-200">
            ← Zurück zur Startseite
          </Link>
        </div>
      </div>
    </div>
  )
}
