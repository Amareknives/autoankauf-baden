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
      'Schriftform im Sinne dieser AGB umfasst neben der eigenhändigen Unterzeichnung eines Dokuments auch die Textform per E-Mail (§ 126b BGB), soweit nicht das Gesetz ausdrücklich die qualifizierte Schriftform erfordert. Kommunikation per Messenger-Dienst (z. B. WhatsApp) gilt als Textform, sofern der Absender eindeutig identifizierbar ist.',
      'Der Verkäufer muss zum Zeitpunkt des Vertragsschlusses voll geschäftsfähig sein (Mindestalter 18 Jahre). Beschränkt Geschäftsfähige können nur mit nachgewiesener Zustimmung ihres gesetzlichen Vertreters handeln. Der Ankäufer ist berechtigt, einen Nachweis hierüber zu verlangen.',
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
      'Basierend auf der Auswertung der übermittelten Daten und aktueller Marktkennzahlen erhält der Verkäufer vom Ankäufer (in der Regel per E-Mail) ein Angebot in Form einer vorläufigen Ersteinschätzung des Ankaufspreises.',
      'Diese Ersteinschätzung stellt ausdrücklich keinen rechtsverbindlichen Kaufvertrag und keine unwiderrufliche Kaufzusage dar. Die Ersteinschätzung steht rechtlich zwingend unter der aufschiebenden Bedingung (§ 158 Abs. 1 BGB) einer für den Ankäufer zufriedenstellenden physischen und technischen Begutachtung des Fahrzeugs vor Ort.',
      'Die in der Ersteinschätzung genannte Preisschätzung hat eine Systemgültigkeit von 7 Tagen ab Übermittlung, strikt vorbehaltlich der Prüfung des tatsächlichen Fahrzeugzustands.',
    ],
  },
  {
    titel: '§ 4 Physische Besichtigung, Preisfindung und verbindlicher Vertragsschluss',
    absaetze: [
      'Sofern der Verkäufer mit dem Rahmen der Ersteinschätzung einverstanden ist, vereinbaren die Parteien einen zeitnahen Termin zur physischen Besichtigung des Fahrzeugs am Standort des Verkäufers, am Standort des Ankäufers oder an einem anderen vereinbarten Ort.',
      'Im Rahmen der Besichtigung wird der tatsächliche optische, technische und rechtliche Zustand des Fahrzeugs durch den Ankäufer detailliert auf Übereinstimmung mit den online übermittelten Daten geprüft. Dies schließt Probefahrten, Lackschichtdickenmessungen und das Auslesen des Fehlerspeichers ausdrücklich ein.',
      'Der Ankäufer behält sich ausdrücklich das Recht vor, den in der Ersteinschätzung genannten Preis nach Abschluss der Begutachtung anzupassen – sowohl nach oben (bei werterhöhenden Merkmalen) als auch nach unten (bei wertmindernden Faktoren wie Schäden, Verschleiß oder fehlenden Dokumenten).',
      'Ein rechtsverbindlicher Kaufvertrag kommt erst dann zustande, wenn sich beide Parteien nach der vollständigen Besichtigung vor Ort auf einen endgültigen, beiderseits akzeptierten Kaufpreis einigen und einen gesonderten, schriftlichen Kaufvertrag unterzeichnen.',
      'Kommt keine Einigung über den Kaufpreis zustande, gilt der Vorgang für beide Seiten als vollumfänglich und kostenfrei erledigt. Ansprüche auf Aufwendungsersatz, Verdienstausfall oder Transportkosten bestehen für keine der Parteien, sofern das Scheitern nicht auf vorsätzlich oder grob fahrlässig falschen Angaben des Verkäufers im Vorfeld beruht.',
    ],
  },
  {
    titel: '§ 5 Obliegenheiten des Verkäufers, Zusicherungen und Eigentumsnachweise',
    absaetze: [
      'Der Verkäufer sichert bei Abschluss des schriftlichen Kaufvertrags ausdrücklich zu, dass er der alleinige, rechtmäßige Eigentümer des angebotenen Fahrzeugs ist oder über eine gültige, schriftliche Verkaufsvollmacht des rechtmäßigen Eigentümers verfügt. Eine Vollmacht ist im Original vorzulegen und muss den Namen und die Unterschrift des Eigentümers enthalten.',
      'Der Verkäufer garantiert, dass das Fahrzeug vollständig frei von Rechten Dritter ist – insbesondere keine Pfandrechte, laufenden Finanzierungen, Sicherungsübereignungen oder Leasingverträge bestehen, es sei denn, diese wurden dem Ankäufer vorab ausdrücklich kommuniziert und schriftlich bestätigt.',
      'Zwingende Offenbarungspflicht: Der Verkäufer ist verpflichtet, dem Ankäufer unaufgefordert, vollständig und wahrheitsgemäß sämtliche bekannten Sach- und Rechtsmängel mitzuteilen. Hierzu zählen insbesondere: Unfallschäden (auch reparierte), Vorschäden an Motor und Getriebe, Eigenschaften als Importfahrzeug, die Nutzung als Taxi oder Mietwagen sowie jede bekannte Abweichung des Kilometerstandes von der tatsächlichen Gesamtlaufleistung.',
      'Macht der Verkäufer im Online-Formular oder im Rahmen der Vorkorrespondenz wissentlich und vorsätzlich unrichtige Angaben über wesentliche wertbildende Eigenschaften des Fahrzeugs (insbesondere Kilometerstand, Unfallhistorie, Funktionsfähigkeit) und reist der Ankäufer aufgrund dieser Fehlinformationen zur Besichtigung an, behält sich der Ankäufer vor, die hierdurch entstandenen Anfahrts- und Aufwendungskosten gemäß §§ 280, 311 Abs. 2 BGB (vorvertragliches Schuldverhältnis) als Schadensersatz geltend zu machen.',
    ],
  },
  {
    titel: '§ 6 Fahrzeugübergabe, Gefahrübergang, Zahlungsmodalitäten und Geldwäscheprävention',
    absaetze: [
      'Nach erfolgreicher Unterzeichnung des schriftlichen Kaufvertrags vor Ort erfolgt die physische Übergabe des Fahrzeugs Zug-um-Zug gegen Zahlung des vereinbarten Kaufpreises.',
      'Mit dem Fahrzeug sind sämtliche existierenden Fahrzeugschlüssel sowie die vollständigen Original-Fahrzeugpapiere (Zulassungsbescheinigung Teil I und II, aktueller HU/AU-Bericht, Serviceheft) an den Ankäufer auszuhändigen. Fehlen Dokumente, ist dies vorab mitzuteilen und kann preismindernd berücksichtigt werden.',
      'Die Zahlung des vereinbarten Kaufpreises erfolgt grundsätzlich in bar vor Ort gegen Aushändigung einer ordnungsgemäßen Empfangsquittung. Eine bargeldlose Zahlung per Banküberweisung ist nur nach vorheriger, ausdrücklicher Vereinbarung in dokumentierten Ausnahmefällen möglich und erfolgt ausschließlich auf ein Konto, das auf den Namen des Verkäufers lautet. Die Auszahlung auf Konten Dritter ist aus Gründen der Geldwäscheprävention ausgeschlossen.',
      'Das Eigentum am Fahrzeug geht auf den Ankäufer erst mit der bestätigten und vollständigen Erfüllung der Kaufpreiszahlung über. Der Gefahrübergang gemäß § 446 BGB erfolgt mit der physischen Übergabe des Fahrzeugs, der Schlüssel und der vollständigen Papiere.',
      'Geldwäscheprävention (GwG): Der Ankäufer ist als gewerblicher Händler gemäß den Bestimmungen des Geldwäschegesetzes (GwG) zur Identifizierung des Vertragspartners verpflichtet. Der Verkäufer hat sich vor Abschluss des Kaufvertrags durch Vorlage eines gültigen amtlichen Lichtbildausweises (Personalausweis oder Reisepass) zu legitimieren. Der Ankäufer ist berechtigt, eine Kopie oder ein digitales Abbild des Ausweisdokuments für die Dauer der gesetzlichen Aufbewahrungsfristen zu speichern. Die Weigerung zur Identifikation berechtigt den Ankäufer, den Vertragsschluss zu verweigern.',
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
    titel: '§ 8 Widerrufsrecht – Rechtliche Einordnung',
    absaetze: [
      'Im vorliegenden Geschäftsmodell tritt der Verbraucher als Verkäufer auf und veräußert ein Fahrzeug an den gewerblich handelnden Ankäufer (sog. C2B-Transaktion). Nach überwiegender juristischer Auffassung finden die verbraucherschützenden Vorschriften zum gesetzlichen Widerrufsrecht bei Fernabsatz- (§ 312c BGB) oder Außergeschäftsraumverträgen (§ 312b BGB) auf Kaufverträge, bei denen der Verbraucher als Verkäufer auftritt, keine Anwendung, da diese Normen ausschließlich den Verbraucher in seiner Eigenschaft als Käufer schützen.',
      'Ungeachtet dieser rechtlichen Einordnung gilt: Beide Parteien können jederzeit und ohne Angabe von Gründen bis zur endgültigen Unterzeichnung des schriftlichen Kaufvertrags von den laufenden Vertragsverhandlungen zurücktreten. Nach beiderseitiger Unterzeichnung ist der Kaufvertrag für beide Parteien verbindlich und kann nur einvernehmlich oder aus gesetzlich anerkannten Gründen rückabgewickelt werden.',
      'Hinweis: Da die rechtliche Einordnung von C2B-Kaufverträgen in Bezug auf §§ 312b ff. BGB in der deutschen Rechtsprechung nicht abschließend höchstrichterlich geklärt ist, empfiehlt der Ankäufer dem Verkäufer, bei rechtlichen Unsicherheiten vor Vertragsunterzeichnung unabhängigen Rechtsrat einzuholen.',
    ],
  },
  {
    titel: '§ 9 Haftungsbeschränkung des Ankäufers',
    absaetze: [
      'Der Ankäufer haftet unbeschränkt bei Vorsatz und grober Fahrlässigkeit sowie für Schäden aus der Verletzung des Lebens, des Körpers oder der Gesundheit, unabhängig vom Grad des Verschuldens.',
      'Bei leichter Fahrlässigkeit haftet der Ankäufer nur bei Verletzung einer wesentlichen Vertragspflicht (Kardinalpflicht), deren Erfüllung die ordnungsgemäße Durchführung des Vertrags überhaupt erst ermöglicht und auf deren Einhaltung der Verkäufer regelmäßig vertrauen darf. In diesem Fall ist die Haftung auf den vertragstypisch vorhersehbaren Schaden begrenzt.',
      'Im Rahmen einer Probefahrt haftet der Ankäufer für Fahrzeugschäden nur bei Vorsatz oder grober Fahrlässigkeit. Der Verkäufer sorgt dafür, dass das Fahrzeug für die Dauer der Probefahrt über einen gültigen Kfz-Haftpflichtversicherungsschutz verfügt. Der Ankäufer übernimmt keine Haftung für Schäden, die auf einer unzureichenden oder erloschenen Versicherungsdeckung des Fahrzeugs beruhen.',
      'Eine weitergehende Haftung des Ankäufers – insbesondere für entgangenen Gewinn, mittelbare Schäden oder Folgeschäden – ist, soweit gesetzlich zulässig, ausgeschlossen.',
      'Eine etwaige Haftung nach dem Produkthaftungsgesetz (ProdHaftG) sowie zwingende gesetzliche Haftungsregelungen bleiben von den vorstehenden Einschränkungen unberührt.',
    ],
  },
  {
    titel: '§ 10 Datenschutz, Löschfristen und KI-gestützte Dienste',
    absaetze: [
      'Der Ankäufer verarbeitet personenbezogene Daten des Verkäufers im strikten Einklang mit den Bestimmungen der DSGVO und dem BDSG. Die Verarbeitung erfolgt primär zur Bearbeitung der Anfrage, zur Durchführung vorvertraglicher Maßnahmen und zur Erfüllung des Kaufvertrages (Rechtsgrundlage: Art. 6 Abs. 1 lit. b DSGVO).',
      'Löschungsfrist für ungenutzte Anfragen (Lead-Daten): Kommt kein Kaufvertrag zustande, werden sämtliche erhobenen personenbezogenen Daten innerhalb von 24 Monaten vollständig gelöscht (Rechtsgrundlage: berechtigtes Interesse gem. Art. 6 Abs. 1 lit. f DSGVO).',
      'Gesetzliche Aufbewahrungsfristen bei erfolgreichem Ankauf: Kaufverträge, Rechnungen und Quittungen müssen gemäß § 147 AO und § 257 HGB für 6 bis 10 Jahre archiviert werden. Eine Löschung dieser Daten nach 24 Monaten ist gesetzlich ausgeschlossen (Art. 17 Abs. 3 lit. b DSGVO). Diese Daten werden nach 24 Monaten für jede weitere Verarbeitung, insbesondere für werbliche Zwecke, gesperrt.',
      'Newsletter: Hat der Verkäufer den Newsletter abonniert, werden die dafür notwendigen Daten auf Grundlage der erteilten Einwilligung (Art. 6 Abs. 1 lit. a DSGVO) gespeichert. Die Einwilligung kann jederzeit widerrufen werden, z. B. durch einen Abmelde-Link oder eine Nachricht an den Ankäufer.',
      'KI-gestützte Kommunikation: Die Website kann einen KI-gestützten Assistenten (Chatbot) zur Beantwortung von Anfragen einsetzen. Dabei werden Gesprächseingaben an den Anbieter des KI-Systems (Anthropic, PBC, USA) übermittelt. Die Übertragung in ein Drittland (USA) erfolgt auf Grundlage von Standardvertragsklauseln gem. Art. 46 Abs. 2 lit. c DSGVO. Der Chatbot speichert keine personenbezogenen Daten dauerhaft und gibt keine verbindlichen Preis- oder Kaufzusagen ab. Näheres regelt die Datenschutzerklärung.',
    ],
  },
  {
    titel: '§ 11 Alternative Streitbeilegung und Schlussbestimmungen',
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
