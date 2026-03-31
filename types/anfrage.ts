export type AnfrageStatus =
  | 'neu'
  | 'kontaktiert'
  | 'angebot_gesendet'
  | 'termin_vereinbart'
  | 'abgeschlossen'
  | 'abgelehnt';

export interface AnfrageFormData {
  marke: string;
  modell: string;
  erstzulassungMonat: number;
  erstzulassungJahr: number;
  kraftstoff: string;
  schadstoffklasse: string;
  leistungKw: number;
  hubraum?: number;
  getriebe: string;
  bauform: string;
  anzahlTueren: string;
  anzahlSitze: number;
  huBis: string;
  farbe: string;
  kilometerstand: number;
  deutscheZulassung: boolean;
  papiere: boolean;
  finanziert: boolean;
  optischerZustand: number;
  unfallfahrzeug: string;
  repariert?: boolean;
  fahrbereitschaft: string;
  roststellen: boolean;
  maengel: boolean;
  maengelText?: string;
  gewerblich: boolean;
  firmenname?: string;
  preisvorstellung?: string;
  verkaufszeitpunkt: string;
  abmeldung: boolean;
  weitereInfos?: string;
  fotos: File[];
  ausstattung: string[];
  sonstigeAusstattung?: string;
  vorname: string;
  nachname: string;
  plz: string;
  email: string;
  telefon?: string;
  kontaktWeg?: 'email_telefon' | 'nur_email';
  newsletter: boolean;
  dsgvoAkzeptiert: boolean;
}
