export interface StadtData {
  slug: string;
  name: string;
  region: string;
  einwohner: string;
  beschreibung: string;
  stadtHeadline: string;
  beschreibungLang: string;
  beschreibungExtra: string[];
  bildText: string;
  teaser: string;
  fakten: string[];
  naechsteStaedte?: string[];
}

export const STAEDTE: StadtData[] = [
  {
    slug: 'karlsruhe',
    name: 'Karlsruhe',
    region: 'Karlsruhe',
    einwohner: '310.000',
    beschreibung: 'Als Technologiestadt und IT-Hotspot ist Karlsruhe eine der wichtigsten Städte in Baden-Württemberg.',
    stadtHeadline: 'Karlsruhe – Fächerstadt & Technologiezentrum',
    beschreibungLang:
      'Karlsruhe ist Sitz des Bundesgerichtshofs und des Bundesverfassungsgerichts – mit über 310.000 Einwohnern eine der größten Städte Baden-Württembergs. Die Fächerstadt ist bekannt für ihr Technologie-Ökosystem rund um das KIT und das CyberForum: eine junge, dynamische Stadt mit hoher Fahrzeugfluktuation.',
    beschreibungExtra: [
      'Alle Straßen strahlen sternförmig vom Schloss aus – das macht Karlsruhe zu einer der am besten erreichbaren Städte der Region. Ob Durlach, Mühlburg, Rüppurr oder die Nordstadt: Wir kommen direkt zu dir, ohne Umwege.',
      'Wir holen dein Fahrzeug in allen Karlsruher Stadtteilen ab – unkompliziert, pünktlich und ohne versteckte Kosten. Eine faire Alternative zum aufwendigen Privatverkauf.',
    ],
    bildText: 'Karlsruhe – Fächerstadt in Baden-Württemberg',
    teaser: 'Auto verkaufen in Karlsruhe – schnell, fair und ohne Stress.',
    fakten: [
      'Direkte Abholung im gesamten Stadtgebiet – Nordstadt, Südstadt, Weststadt, Durlach',
      'Angebot in 2–3 Stunden* per E-Mail oder WhatsApp (Werktags 6–18 Uhr, Sa 6–13 Uhr)',
      'Keine Händlerprovision – du verhandelst direkt mit uns',
    ],
    naechsteStaedte: ['bruchsal', 'rastatt', 'pforzheim'],
  },
  {
    slug: 'bruchsal',
    name: 'Bruchsal',
    region: 'Kraichgau',
    einwohner: '45.000',
    beschreibung: 'Bruchsal ist unser Heimatstandort – hier kennen wir jeden Winkel und jeden Kunden persönlich.',
    stadtHeadline: 'Bruchsal – unser Zuhause im Kraichgau',
    beschreibungLang:
      'Bruchsal im Kraichgau ist unsere Heimatstadt. Seit 6 Jahren kaufen wir hier Fahrzeuge an – von der Innenstadt rund ums Barockschloss bis nach Heidelsheim, Obergrombach und Büchenau. Als lokales Unternehmen kennen wir die Region und ihre Menschen.',
    beschreibungExtra: [
      'Im Kraichgau pendeln viele Menschen täglich nach Karlsruhe, Heidelberg oder Mannheim. Pendlerfahrzeuge mit höherer Laufleistung sind unser tägliches Geschäft – wir bewerten sie fair und ohne Abzüge für normale Gebrauchsspuren.',
      'Kein Callcenter, keine anonymen Formulare: Du sprichst direkt mit dem Ankäufer. Über 80 % unserer Kunden kommen auf persönliche Empfehlung – das sagt alles.',
    ],
    bildText: 'Bruchsal – Barockstadt im Kraichgau',
    teaser: 'Autoankauf Bruchsal – direkt vor Ort, seit 6 Jahren.',
    fakten: [
      'Unser Hauptstandort – kürzeste Reaktionszeiten im gesamten Stadtgebiet',
      'Persönliche Abwicklung ohne Callcenter oder anonyme Formulare',
      'Bekannt aus Empfehlungen: über 80 % unserer Kunden kommen auf Empfehlung',
    ],
    naechsteStaedte: ['karlsruhe', 'heidelberg', 'speyer'],
  },
  {
    slug: 'heidelberg',
    name: 'Heidelberg',
    region: 'Rhein-Neckar',
    einwohner: '160.000',
    beschreibung: 'Die Universitätsstadt Heidelberg mit ihrem historischen Flair und modernem Wirtschaftsstandort.',
    stadtHeadline: 'Heidelberg – Universitätsstadt am Neckar',
    beschreibungLang:
      'Heidelberg zieht jährlich Millionen Touristen an – und ist gleichzeitig ein dynamischer Wirtschaftsstandort. Mit der ältesten Universität Deutschlands und dem Heidelberg Innovation Park lebt hier ein besonders mobiles Publikum: viele Akademiker, Forscher und Berufspendler, die ihr Auto regelmäßig wechseln.',
    beschreibungExtra: [
      'Besonders rund um Studienende oder Umzüge entstehen viele Verkaufsanlässe. Wir reagieren schnell und machen dir ein faires Angebot – ohne dass du deinen Alltag unterbrechen musst.',
      'Wir holen dein Fahrzeug in Heidelberg kostenlos ab – ob Rohrbach, Weststadt, Pfaffengrund, Kirchheim oder Emmertsgrund. Keine Anfahrtskosten, kein Aufwand.',
    ],
    bildText: 'Heidelberg – Romantikstadt am Neckar',
    teaser: 'Auto verkaufen in Heidelberg – Angebot in 2–3 Stunden*.',
    fakten: [
      'Abholung in allen Stadtteilen: Weststadt, Bergheim, Rohrbach, Emmertsgrund',
      'Ideal für Umzüge, Studienende oder Fahrzeugwechsel',
      'Faire Bewertung auch für Fahrzeuge mit Unfallschäden oder Motorproblemen',
    ],
    naechsteStaedte: ['mannheim', 'bruchsal', 'speyer'],
  },
  {
    slug: 'mannheim',
    name: 'Mannheim',
    region: 'Rhein-Neckar',
    einwohner: '310.000',
    beschreibung: 'Mannheim als Wirtschaftsmetropole in der Metropolregion Rhein-Neckar.',
    stadtHeadline: 'Mannheim – Quadratestadt am Rhein',
    beschreibungLang:
      'Mannheim ist das wirtschaftliche Herz der Metropolregion Rhein-Neckar. Mit Unternehmen wie Roche Diagnostics, John Deere und der Universität Mannheim leben und pendeln hier täglich hunderttausende Menschen – und irgendwann wechseln sie ihr Auto.',
    beschreibungExtra: [
      'Das einzigartige Quadrate-System macht Mannheim übersichtlich – und erleichtert auch uns die Abholung direkt bei dir, ob im Jungbusch, in Neckarau, Waldhof oder Sandhofen.',
      'Wir kennen den Mannheimer Markt und wissen, was Fahrzeuge hier wirklich wert sind. Kein Verhandlungsspielchen – du bekommst dein Angebot innerhalb von 2–3 Stunden*.',
    ],
    bildText: 'Mannheim – Quadratestadt am Rhein',
    teaser: 'Autoankauf Mannheim – faire Preise, kostenlose Abholung.',
    fakten: [
      'Abholung im gesamten Stadtgebiet – alle Quadrate und Außenstadtteile',
      'Auch Fahrzeuge mit hoher Laufleistung werden fair bewertet',
      'Auszahlung noch am gleichen Tag nach Besichtigung möglich',
    ],
    naechsteStaedte: ['heidelberg', 'ludwigshafen', 'speyer'],
  },
  {
    slug: 'speyer',
    name: 'Speyer',
    region: 'Vorderpfalz',
    einwohner: '51.000',
    beschreibung: 'Die Dom-Stadt Speyer liegt direkt am Rhein und ist ein wichtiger Standort in der Vorderpfalz.',
    stadtHeadline: 'Speyer – Dom-Stadt am Rhein',
    beschreibungLang:
      'Speyer ist eine der ältesten Städte Deutschlands – bekannt für den UNESCO-Welterbe-Dom und das Technik Museum. Die Stadt liegt verkehrsgünstig zwischen Mannheim und Karlsruhe an der B9 und der A61: ein wichtiger Knotenpunkt in der Vorderpfalz.',
    beschreibungExtra: [
      'Viele Speyerer pendeln täglich in die umliegenden Städte und legen dabei größere Strecken zurück. Pendlerfahrzeuge, Familienautos oder Gebrauchtwagen – wir bewerten alles fair.',
      'Wir holen dein Fahrzeug direkt in Speyer ab – egal ob Innenstadt, Speyer-West oder Industriegebiet Nord. Ein kurzer Anruf, und wir sind bei dir.',
    ],
    bildText: 'Speyer – Dom-Stadt am Rhein',
    teaser: 'Auto verkaufen in Speyer – wir kommen zu dir.',
    fakten: [
      'Günstige Lage zwischen Karlsruhe und Mannheim – schnelle Erreichbarkeit',
      'Auch Fahrzeuge aus dem Rhein-Pfalz-Kreis werden abgeholt',
      'Kostenlose Besichtigung ohne Kaufverpflichtung',
    ],
    naechsteStaedte: ['mannheim', 'speyer', 'heidelberg'],
  },
  {
    slug: 'pforzheim',
    name: 'Pforzheim',
    region: 'Enzkreis',
    einwohner: '125.000',
    beschreibung: 'Die Goldstadt Pforzheim am Eingang zum Schwarzwald.',
    stadtHeadline: 'Pforzheim – die Goldstadt am Schwarzwald',
    beschreibungLang:
      'Pforzheim liegt als Tor zum Schwarzwald an der A8 zwischen Karlsruhe und Stuttgart – eine der meistbefahrenen Strecken Deutschlands. Die Goldstadt ist bekannt für ihre Schmuck- und Uhrenindustrie und ist mit rund 125.000 Einwohnern die größte Stadt im Enzkreis.',
    beschreibungExtra: [
      'Viele Pforzheimer pendeln täglich in die Großstädte und nutzen ihr Fahrzeug intensiv. Auch Diesel-Fahrzeuge mit möglicher Fahrverbotsproblematik kaufen wir fair an – kein Schönreden, keine versteckten Abzüge.',
      'Wir holen dein Auto in Pforzheim und dem gesamten Enzkreis ab – direktes Angebot, Barzahlung vor Ort, fertig.',
    ],
    bildText: 'Pforzheim – Goldstadt am Schwarzwald',
    teaser: 'Autoankauf Pforzheim – schnell & unkompliziert.',
    fakten: [
      'Abholung in Pforzheim und dem gesamten Enzkreis',
      'Auch Diesel-Fahrzeuge mit Fahrverbotsproblematik werden bewertet',
      'Direktes Sofortangebot – kein wochenlanger Verkaufsprozess',
    ],
    naechsteStaedte: ['karlsruhe', 'rastatt'],
  },
  {
    slug: 'rastatt',
    name: 'Rastatt',
    region: 'Murgtal',
    einwohner: '50.000',
    beschreibung: 'Rastatt im Murgtal – bekannt durch Mercedes-Benz und das Barockschloss.',
    stadtHeadline: 'Rastatt – Mercedes-Stadt im Murgtal',
    beschreibungLang:
      'Rastatt ist untrennbar mit Mercedes-Benz verbunden: Im Werk Rastatt werden seit Jahrzehnten die kompakten Baureihen produziert. Das prägt die Stadt – und ihre Fahrzeuge. Viele Rastatter fahren gepflegte Dienstwagen oder gut gewartete Privatfahrzeuge.',
    beschreibungExtra: [
      'Die Stadt liegt ideal zwischen Karlsruhe und Baden-Baden an der B36 und der A5 – ein wichtiger Pendlerstandort im Murgtal. Viele Berufstätige legen täglich größere Strecken zurück und wechseln ihr Fahrzeug regelmäßig.',
      'Wir holen dein Auto direkt in Rastatt ab – aber auch aus den umliegenden Gemeinden wie Kuppenheim, Gaggenau, Gernsbach und Au am Rhein. Kurze Wege, schnelle Rückmeldung.',
    ],
    bildText: 'Rastatt – Barockstadt im Murgtal',
    teaser: 'Auto verkaufen in Rastatt – persönlich und fair.',
    fakten: [
      'Abholung in Rastatt und umliegenden Gemeinden: Kuppenheim, Gaggenau, Gernsbach',
      'Mercedes-gepflegte Fahrzeuge erfahren besondere Aufmerksamkeit bei der Bewertung',
      'Kurze Wege nach Karlsruhe und Baden-Baden – schnelle Terminfindung',
    ],
    naechsteStaedte: ['karlsruhe', 'baden-baden'],
  },
  {
    slug: 'baden-baden',
    name: 'Baden-Baden',
    region: 'Baden-Baden',
    einwohner: '55.000',
    beschreibung: 'Die weltbekannte Kurstadt Baden-Baden im nördlichen Schwarzwald.',
    stadtHeadline: 'Baden-Baden – Kurstadt mit Stil',
    beschreibungLang:
      'Baden-Baden zählt zu den exklusivsten Städten Deutschlands – mit weltberühmtem Casino, Caracalla Therme und Festspielhaus. Entsprechend hochwertig sind viele Fahrzeuge, die hier gefahren werden: Premiummarken und gepflegte Gebrauchtwagen sind überdurchschnittlich häufig vertreten.',
    beschreibungExtra: [
      'Wir haben Erfahrung im Ankauf hochwertiger Fahrzeuge und gehen diskret mit dem gesamten Prozess um. Ob BMW, Mercedes, Porsche oder Audi – wir bewerten fair und zahlen direkt bei Übergabe.',
      'Unser Abholservice umfasst das gesamte Stadtgebiet sowie die Region – von Sinzheim über Bühl bis nach Achern. Du sparst dir den Weg zum Händler.',
    ],
    bildText: 'Baden-Baden – Kurstadt im Schwarzwald',
    teaser: 'Autoankauf Baden-Baden – Ihr Auto, unser fairer Preis.',
    fakten: [
      'Erfahrung mit Premiumfahrzeugen: BMW, Mercedes, Porsche, Audi',
      'Diskrete Abwicklung – auch für Fahrzeuge im gehobenen Segment',
      'Kostenlose Abholung in Baden-Baden Stadt und Umland',
    ],
    naechsteStaedte: ['rastatt', 'karlsruhe'],
  },
  {
    slug: 'ludwigshafen',
    name: 'Ludwigshafen',
    region: 'Rheinpfalz',
    einwohner: '175.000',
    beschreibung: 'Ludwigshafen am Rhein – Heimat von BASF und wichtiger Industriestandort.',
    stadtHeadline: 'Ludwigshafen – BASF-Heimat am Rhein',
    beschreibungLang:
      'Ludwigshafen am Rhein liegt direkt gegenüber von Mannheim und ist vor allem als Sitz des Chemiekonzerns BASF bekannt – mit über 40.000 Mitarbeitern allein am Standort. Viele Pendler legen täglich erhebliche Strecken zurück und nutzen ihr Auto intensiv.',
    beschreibungExtra: [
      'Fahrzeuge mit hoher Laufleistung sind unser tägliches Geschäft – wir bewerten sie genauso fair wie Niedrigkilometerfahrzeuge. Die Rheinbrücke zu Mannheim ist in Minuten erreichbar, was kurze Termine ermöglicht.',
      'Wir kaufen Fahrzeuge in Ludwigshafen und dem gesamten Rhein-Pfalz-Kreis an – ehrliche Bewertung, Barzahlung vor Ort, kein Aufwand.',
    ],
    bildText: 'Ludwigshafen – Industriestadt am Rhein',
    teaser: 'Auto verkaufen in Ludwigshafen – Angebot in 2–3 Stunden*.',
    fakten: [
      'Abholung in Ludwigshafen und dem Rhein-Pfalz-Kreis',
      'Faire Bewertung auch bei hoher Laufleistung (BASF-Pendlerfahrzeuge)',
      'Brückenverbindung zu Mannheim – schnelle Erreichbarkeit aus beiden Städten',
    ],
    naechsteStaedte: ['mannheim', 'speyer', 'stuttgart'],
  },
  {
    slug: 'stuttgart',
    name: 'Stuttgart',
    region: 'Stuttgart',
    einwohner: '635.000',
    beschreibung: 'Stuttgart ist die Landeshauptstadt von Baden-Württemberg und ein wichtiger Automobil-Standort mit Daimler und Porsche.',
    stadtHeadline: 'Stuttgart – Automobilhauptstadt Deutschlands',
    beschreibungLang:
      'Stuttgart ist die Landeshauptstadt Baden-Württembergs und eines der wichtigsten Automobilzentren der Welt – Mercedes-Benz und Porsche sind hier zuhause. Mit rund 635.000 Einwohnern und einem starken Wirtschaftsumfeld fahren täglich hunderttausende Fahrzeuge durch den Kessel.',
    beschreibungExtra: [
      'Viele Stuttgarter haben ihr Auto täglich im Einsatz – besonders in den Außenstadtteilen wie Vaihingen, Möhringen, Feuerbach oder Bad Cannstatt, wo der ÖPNV weniger dicht ist. Ob Pendlerauto oder gepflegter Gebrauchtwagen: wir bewerten fair.',
      'Wir holen dein Auto in allen Stuttgarter Stadtteilen ab – von Stuttgart-Mitte über Zuffenhausen bis Vaihingen. Direkte Zahlung vor Ort, keine Umwege.',
    ],
    bildText: 'Stuttgart – Automobilstadt im Kessel',
    teaser: 'Autoankauf Stuttgart – faire Preise, kostenlose Abholung.',
    fakten: [
      'Abholung in allen Stadtteilen: Mitte, Nord, Ost, Süd, West, Bad Cannstatt, Zuffenhausen',
      'Erfahrung mit Premiumfahrzeugen aus der Mercedes- und Porsche-Region',
      'Angebot in 2–3 Stunden* – direkt per E-Mail oder WhatsApp',
    ],
    naechsteStaedte: ['pforzheim', 'karlsruhe', 'ludwigshafen'],
  },
];
