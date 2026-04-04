export function generateWhatsAppLink(phone: string, message: string): string {
  const cleanPhone = phone.replace(/[^0-9]/g, '');
  return `https://wa.me/${cleanPhone}?text=${encodeURIComponent(message)}`;
}

export function generateAngebotWhatsApp(params: {
  vorname: string;
  marke: string;
  modell: string;
  preis: number;
  angebotsart: string;
  datum?: string;
  uhrzeit?: string;
  plz: string;
  bestaetigungslink: string;
  telefon: string;
}): string {
  const { vorname, marke, modell, preis, angebotsart, datum, uhrzeit, plz, bestaetigungslink, telefon } = params;
  const message = `Hallo ${vorname}\n\nWir haben dein Angebot für den ${marke} ${modell}:\n\nUnser Angebot: ${preis.toLocaleString('de-DE')} Euro\nArt: ${angebotsart}\n${datum ? `Terminvorschlag: ${datum} um ${uhrzeit} Uhr\n` : ''}Abholung bei dir: ${plz}\n\nKlick auf den Link um den Termin zu bestätigen:\n${bestaetigungslink}\n\nOder ruf uns direkt an: ${telefon}\n\nViele Grüße,\nAutoAnkauf-Baden`;
  return message;
}
