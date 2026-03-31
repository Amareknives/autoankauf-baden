import type { Metadata } from 'next'
import Link from 'next/link'
import { getSiteSettings } from '@/lib/siteSettings'

export const metadata: Metadata = {
  title: 'Impressum | AutoAnkauf-Baden',
  description: 'Impressum und Pflichtangaben gemäß § 5 TMG für AutoAnkauf-Baden.',
  robots: { index: false, follow: false },
}

export default async function ImpressumPage() {
  const s = await getSiteSettings()
  return (
    <div className="min-h-screen bg-[#F8FAFC]">
      {/* Hero */}
      <div className="bg-[#0369A1] py-12">
        <div className="container mx-auto px-4 md:px-6 lg:px-8 max-w-3xl">
          <p className="text-[#BAE6FD] text-sm font-medium mb-2">Rechtliches</p>
          <h1 className="text-3xl md:text-4xl font-black text-white">Impressum</h1>
        </div>
      </div>

      {/* Content */}
      <div className="container mx-auto px-4 md:px-6 lg:px-8 max-w-3xl py-12">
        <div className="bg-white rounded-2xl border border-[#E2EDF7] p-8 md:p-10 space-y-8">

          {/* Angaben nach § 5 TMG */}
          <section>
            <h2 className="text-lg font-bold text-[#0F172A] mb-4">Angaben gemäß § 5 TMG</h2>
            <div className="text-[#64748B] text-sm leading-relaxed space-y-1">
              <p className="font-semibold text-[#0F172A]">{s.firmenname}</p>
              <p>{s.inhaber}</p>
              <p>{s.strasse}</p>
              <p>{s.plz_firma} {s.ort}</p>
              <p>Baden-Württemberg, Deutschland</p>
            </div>
          </section>

          <hr className="border-[#E2EDF7]" />

          {/* Kontakt */}
          <section>
            <h2 className="text-lg font-bold text-[#0F172A] mb-4">Kontakt</h2>
            <div className="text-[#64748B] text-sm leading-relaxed space-y-1">
              <p>
                <span className="font-medium text-[#0F172A]">Telefon:</span>{' '}
                <a href={`tel:${s.telefon.replace(/\s+/g, '')}`} className="text-[#0369A1] hover:underline">
                  {s.telefon}
                </a>
              </p>
              <p>
                <span className="font-medium text-[#0F172A]">E-Mail:</span>{' '}
                <a href={`mailto:${s.email}`} className="text-[#0369A1] hover:underline">
                  {s.email}
                </a>
              </p>
              <p>
                <span className="font-medium text-[#0F172A]">Website:</span>{' '}
                <span>www.autoankauf-baden.de</span>
              </p>
            </div>
          </section>

          <hr className="border-[#E2EDF7]" />

          {/* Umsatzsteuer */}
          <section>
            <h2 className="text-lg font-bold text-[#0F172A] mb-4">Umsatzsteuer-ID</h2>
            <p className="text-[#64748B] text-sm leading-relaxed">
              Umsatzsteuer-Identifikationsnummer gemäß § 27 a Umsatzsteuergesetz:
              <br />
              <span className="font-medium text-[#0F172A]">DE336379510</span>
            </p>
          </section>

          <hr className="border-[#E2EDF7]" />

          {/* Verantwortlich für Inhalte */}
          <section>
            <h2 className="text-lg font-bold text-[#0F172A] mb-4">
              Verantwortlich für den Inhalt nach § 55 Abs. 2 RStV
            </h2>
            <div className="text-[#64748B] text-sm leading-relaxed space-y-1">
              <p>{s.inhaber}</p>
              <p>{s.strasse}</p>
              <p>{s.plz_firma} {s.ort}</p>
            </div>
          </section>

          <hr className="border-[#E2EDF7]" />

          {/* Streitschlichtung */}
          <section>
            <h2 className="text-lg font-bold text-[#0F172A] mb-4">EU-Streitschlichtung</h2>
            <p className="text-[#64748B] text-sm leading-relaxed">
              Die Europäische Kommission stellt eine Plattform zur Online-Streitbeilegung (OS) bereit:{' '}
              <span className="text-[#0369A1]">https://ec.europa.eu/consumers/odr</span>
              <br />
              Unsere E-Mail-Adresse findest du oben im Impressum.
            </p>
          </section>

          <section>
            <h2 className="text-lg font-bold text-[#0F172A] mb-4">
              Verbraucherstreitbeilegung / Universalschlichtungsstelle
            </h2>
            <p className="text-[#64748B] text-sm leading-relaxed">
              Wir sind nicht bereit oder verpflichtet, an Streitbeilegungsverfahren vor einer
              Verbraucherschlichtungsstelle teilzunehmen.
            </p>
          </section>

          <hr className="border-[#E2EDF7]" />

          {/* Haftungsausschluss */}
          <section>
            <h2 className="text-lg font-bold text-[#0F172A] mb-4">Haftungsausschluss</h2>

            <h3 className="font-semibold text-[#0F172A] text-sm mb-2">Haftung für Inhalte</h3>
            <p className="text-[#64748B] text-sm leading-relaxed mb-4">
              Als Diensteanbieter sind wir gemäß § 7 Abs. 1 TMG für eigene Inhalte auf diesen Seiten
              nach den allgemeinen Gesetzen verantwortlich. Nach §§ 8 bis 10 TMG sind wir als
              Diensteanbieter jedoch nicht verpflichtet, übermittelte oder gespeicherte fremde
              Informationen zu überwachen oder nach Umständen zu forschen, die auf eine rechtswidrige
              Tätigkeit hinweisen.
            </p>

            <h3 className="font-semibold text-[#0F172A] text-sm mb-2">Haftung für Links</h3>
            <p className="text-[#64748B] text-sm leading-relaxed mb-4">
              Unser Angebot enthält Links zu externen Websites Dritter, auf deren Inhalte wir keinen
              Einfluss haben. Deshalb können wir für diese fremden Inhalte auch keine Gewähr
              übernehmen. Für die Inhalte der verlinkten Seiten ist stets der jeweilige Anbieter oder
              Betreiber der Seiten verantwortlich.
            </p>

            <h3 className="font-semibold text-[#0F172A] text-sm mb-2">Urheberrecht</h3>
            <p className="text-[#64748B] text-sm leading-relaxed">
              Die durch die Seitenbetreiber erstellten Inhalte und Werke auf diesen Seiten unterliegen
              dem deutschen Urheberrecht. Die Vervielfältigung, Bearbeitung, Verbreitung und jede Art
              der Verwertung außerhalb der Grenzen des Urheberrechtes bedürfen der schriftlichen
              Zustimmung des jeweiligen Autors bzw. Erstellers.
            </p>
          </section>

        </div>

        {/* Back Link */}
        <div className="mt-6 text-center">
          <Link
            href="/"
            className="text-sm text-[#64748B] hover:text-[#0369A1] transition-colors duration-200"
          >
            ← Zurück zur Startseite
          </Link>
        </div>
      </div>
    </div>
  )
}
