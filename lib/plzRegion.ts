// PLZ -> Region Mapping fuer Baden und Pfalz
const PLZ_REGIONS: Record<string, string> = {
  '76': 'Karlsruhe & Umgebung',
  '766': 'Bruchsal & Kraichgau',
  '762': 'Bruchsal & Kraichgau',
  '69': 'Heidelberg & Rhein-Neckar',
  '68': 'Mannheim & Umgebung',
  '672': 'Speyer & Vorderpfalz',
  '753': 'Pforzheim & Enzkreis',
  '754': 'Pforzheim & Enzkreis',
  '764': 'Rastatt & Murgtal',
  '763': 'Baden-Baden & Umgebung',
  '671': 'Ludwigshafen & Rheinpfalz',
  '674': 'Ludwigshafen & Rheinpfalz',
  '676': 'Germersheim & Suedpfalz',
};

export function getRegionByPlz(plz: string): string | null {
  if (!plz || plz.length < 2) return null;
  const prefix3 = plz.substring(0, 3);
  if (PLZ_REGIONS[prefix3]) return PLZ_REGIONS[prefix3];
  const prefix2 = plz.substring(0, 2);
  if (PLZ_REGIONS[prefix2]) return PLZ_REGIONS[prefix2];
  return null;
}

export function isInServiceArea(plz: string): boolean {
  return getRegionByPlz(plz) !== null;
}
