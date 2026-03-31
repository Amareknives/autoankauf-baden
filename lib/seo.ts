import type { Metadata } from 'next';

export function generateStadtMetadata(stadt: string, beschreibung: string): Metadata {
  return {
    title: `Autoankauf ${stadt} – Fair & Schnell | AutoAnkauf-Baden`,
    description: `${stadt} Auto verkaufen: Kostenlos bewerten lassen, Angebot in 2–3h, kostenlose Abholung. Seit 6 Jahren dein Autoankauf in ${stadt} und der Region Baden.`,
    alternates: {
      canonical: `https://autoankauf-baden.de/${stadt.toLowerCase().replace(/\s/g, '-')}`,
    },
    openGraph: {
      title: `Autoankauf ${stadt} – Fair & Schnell | AutoAnkauf-Baden`,
      description: beschreibung,
    },
  };
}
