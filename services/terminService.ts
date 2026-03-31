import { generateICS } from '@/lib/ics';

export function generateTerminICS(params: {
  vorname: string;
  nachname: string;
  marke: string;
  modell: string;
  termin: Date;
  adresse: string;
}): string {
  return generateICS({
    startDate: params.termin,
    title: `Autoankauf: ${params.marke} ${params.modell} - ${params.vorname} ${params.nachname}`,
    description: `Autoankauf-Termin bei AutoAnkauf-Baden.\nFahrzeug: ${params.marke} ${params.modell}\nKunde: ${params.vorname} ${params.nachname}`,
    location: params.adresse,
  });
}
