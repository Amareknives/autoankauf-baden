export interface Termin {
  id: string;
  anfrageId: string;
  datum: Date;
  uhrzeit: string;
  adresse: string;
  art: 'abholung' | 'anlieferung';
  bestaetigt: boolean;
}
