export const KRAFTSTOFF_OPTIONS = [
  'Benzin', 'Diesel', 'Elektro', 'Hybrid (Benzin)', 'Hybrid (Diesel)',
  'Plug-in-Hybrid', 'Erdgas (CNG)', 'Autogas (LPG)',
];
export const SCHADSTOFFKLASSE_OPTIONS = [
  'Euro 6d', 'Euro 6d-TEMP', 'Euro 6c', 'Euro 6b', 'Euro 5', 'Euro 4',
  'Euro 3', 'Euro 2', 'Euro 1', 'Keine',
];
export const GETRIEBE_OPTIONS = ['Schaltgetriebe', 'Automatik', 'Halbautomatik'];
export const BAUFORM_OPTIONS = [
  'Limousine', 'Kombi', 'SUV', 'Geländewagen', 'Cabrio', 'Coupé',
  'Van/Minivan', 'Kleintransporter', 'Andere',
];
export const TUEREN_OPTIONS = ['2/3', '4/5'];
const _HU_YEAR = new Date().getFullYear();
export const HU_JAHR_OPTIONS = [
  'Keine HU',
  'Abgelaufen',
  ...Array.from({ length: 6 }, (_, i) => String(_HU_YEAR + 2 - i)),
];
export const FARBEN_OPTIONS = [
  'Schwarz', 'Weiß', 'Silber', 'Grau', 'Blau', 'Rot', 'Grün', 'Braun',
  'Beige', 'Gold', 'Orange', 'Gelb', 'Violett', 'Andere',
];
export const ZUSTAND_LABELS: Record<number, string> = {
  1: 'Stark beschädigt',
  2: 'Viele Gebrauchsspuren',
  3: 'Normal gebraucht',
  4: 'Gut gepflegt',
  5: 'Wie neu / Ausstellungsfahrzeug',
};
export const FAHRBEREITSCHAFT_OPTIONS = [
  'Ja, voll fahrbereit',
  'Bedingt fahrbereit (kleine Mängel)',
  'Nicht fahrbereit',
];
export const UNFALLFAHRZEUG_OPTIONS = [
  'Nein, kein Unfallfahrzeug',
  'Ja, Unfallfahrzeug (repariert)',
  'Ja, Unfallfahrzeug (nicht repariert)',
];
export const VERKAUFSZEITPUNKT_OPTIONS = [
  'So schnell wie möglich',
  'Innerhalb von 2 Wochen',
  'Innerhalb von 1 Monat',
  'Ich bin noch unentschlossen',
];
export const AUSSTATTUNG_GRUPPEN: Record<string, string[]> = {
  'Ausstattung': [
    'Navigationssystem', 'Sitzheizung', 'Ledersitze', 'Panoramadach',
    'Schiebedach', 'Elektrische Sitze', 'Beheiztes Lenkrad', 'Head-Up Display',
    'Rueckfahrkamera', '360 Kamera', 'Keyless Go', 'Elektrische Heckklappe',
  ],
  'Fahrerhilfen': [
    'Tempomat / Cruise Control', 'Totwinkelassistent', 'Spurhalteassistent',
    'Notbremsassistent', 'Adaptiver Tempomat (ACC)', 'Verkehrszeichenerkennung',
  ],
  'Einparkhilfen': [
    'Einparkhilfe vorne', 'Einparkhilfe hinten', 'Einparkhilfe vorne+hinten',
    'Automatisches Einparken',
  ],
  'Klimatisierung': [
    'Klimaanlage', 'Klimaautomatik', 'Zweizonen-Klimaautomatik',
    'Dreizonen-Klimaautomatik', 'Standheizung',
  ],
};
