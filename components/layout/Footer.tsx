import Link from 'next/link'
import Logo from './Logo'
import { getSiteSettings } from '@/lib/siteSettings'
import { FooterContactLinks } from './FooterContactLinks'
import { FooterInstallButton } from './FooterInstallButton'

const SOCIAL_ICONS: Record<string, { label: string; svg: React.ReactNode }> = {
  social_facebook: {
    label: 'Facebook',
    svg: (
      <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
        <path fillRule="evenodd" d="M22 12c0-5.523-4.477-10-10-10S2 6.477 2 12c0 4.991 3.657 9.128 8.438 9.878v-6.987h-2.54V12h2.54V9.797c0-2.506 1.492-3.89 3.777-3.89 1.094 0 2.238.195 2.238.195v2.46h-1.26c-1.243 0-1.63.771-1.63 1.562V12h2.773l-.443 2.89h-2.33v6.988C18.343 21.128 22 16.991 22 12z" clipRule="evenodd" />
      </svg>
    ),
  },
  social_instagram: {
    label: 'Instagram',
    svg: (
      <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
        <path fillRule="evenodd" d="M12.315 2c2.43 0 2.784.013 3.808.06 1.064.049 1.791.218 2.427.465a4.902 4.902 0 011.772 1.153 4.902 4.902 0 011.153 1.772c.247.636.416 1.363.465 2.427.048 1.067.06 1.407.06 4.123v.08c0 2.643-.012 2.987-.06 4.043-.049 1.064-.218 1.791-.465 2.427a4.902 4.902 0 01-1.153 1.772 4.902 4.902 0 01-1.772 1.153c-.636.247-1.363.416-2.427.465-1.067.048-1.407.06-4.123.06h-.08c-2.643 0-2.987-.012-4.043-.06-1.064-.049-1.791-.218-2.427-.465a4.902 4.902 0 01-1.772-1.153 4.902 4.902 0 01-1.153-1.772c-.247-.636-.416-1.363-.465-2.427-.047-1.024-.06-1.379-.06-3.808v-.63c0-2.43.013-2.784.06-3.808.049-1.064.218-1.791.465-2.427a4.902 4.902 0 011.153-1.772A4.902 4.902 0 015.45 2.525c.636-.247 1.363-.416 2.427-.465C8.901 2.013 9.256 2 11.685 2h.63zm-.081 1.802h-.468c-2.456 0-2.784.011-3.807.058-.975.045-1.504.207-1.857.344-.467.182-.8.398-1.15.748-.35.35-.566.683-.748 1.15-.137.353-.3.882-.344 1.857-.047 1.023-.058 1.351-.058 3.807v.468c0 2.456.011 2.784.058 3.807.045.975.207 1.504.344 1.857.182.466.399.8.748 1.15.35.35.683.566 1.15.748.353.137.882.3 1.857.344 1.054.048 1.37.058 4.041.058h.08c2.597 0 2.917-.01 3.96-.058.976-.045 1.505-.207 1.858-.344.466-.182.8-.398 1.15-.748.35-.35.566-.683.748-1.15.137-.353.3-.882.344-1.857.048-1.055.058-1.37.058-4.041v-.08c0-2.597-.01-2.917-.058-3.96-.045-.976-.207-1.505-.344-1.858a3.097 3.097 0 00-.748-1.15 3.098 3.098 0 00-1.15-.748c-.353-.137-.882-.3-1.857-.344-1.023-.047-1.351-.058-3.807-.058zM12 6.865a5.135 5.135 0 110 10.27 5.135 5.135 0 010-10.27zm0 1.802a3.333 3.333 0 100 6.666 3.333 3.333 0 000-6.666zm5.338-3.205a1.2 1.2 0 110 2.4 1.2 1.2 0 010-2.4z" clipRule="evenodd" />
      </svg>
    ),
  },
  social_x: {
    label: 'X (Twitter)',
    svg: (
      <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
        <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
      </svg>
    ),
  },
  social_youtube: {
    label: 'YouTube',
    svg: (
      <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
        <path fillRule="evenodd" d="M19.812 5.418c.861.23 1.538.907 1.768 1.768C21.998 8.746 22 12 22 12s0 3.255-.418 4.814a2.504 2.504 0 0 1-1.768 1.768c-1.56.419-7.814.419-7.814.419s-6.255 0-7.814-.419a2.505 2.505 0 0 1-1.768-1.768C2 15.255 2 12 2 12s0-3.255.417-4.814a2.507 2.507 0 0 1 1.768-1.768C5.744 5 11.998 5 11.998 5s6.255 0 7.814.418ZM15.194 12 10 15V9l5.194 3Z" clipRule="evenodd" />
      </svg>
    ),
  },
  social_xing: {
    label: 'Xing',
    svg: (
      <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
        <path d="M18.188 0c-.517 0-.741.325-.927.66 0 0-7.455 13.224-7.702 13.657.015.024 4.919 9.023 4.919 9.023.17.308.436.66.967.66h3.454c.211 0 .375-.078.463-.22.089-.151.089-.346-.009-.536l-4.879-8.916c-.004-.006-.004-.016 0-.022L22.139.756c.095-.191.097-.387.006-.535C22.056.078 21.894 0 21.686 0h-3.498zM3.648 4.74c-.211 0-.385.074-.473.216-.09.149-.078.339.02.531l2.34 4.05c.004.01.004.016 0 .021L1.86 16.051c-.099.188-.093.381 0 .529.085.142.239.234.45.234h3.461c.518 0 .766-.348.945-.667l3.734-6.609-2.378-4.155c-.172-.315-.434-.643-.962-.643H3.648z" />
      </svg>
    ),
  },
  social_linkedin: {
    label: 'LinkedIn',
    svg: (
      <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
        <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433a2.062 2.062 0 01-2.063-2.065 2.064 2.064 0 112.063 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z" />
      </svg>
    ),
  },
}

export default async function Footer() {
  const s = await getSiteSettings()

  const navigation = {
    main: [
      { name: 'Auto verkaufen', href: '/fahrzeug-verkaufen' },
      { name: "So funktioniert's", href: '/so-funktionierts' },
      { name: 'Händler', href: '/haendler' },
      { name: 'FAQ', href: '/faq' },
      { name: 'Über uns', href: '/ueber-uns' },
    ],
    legal: [
      { name: 'Datenschutz', href: '/datenschutz' },
      { name: 'AGB', href: '/agb' },
      { name: 'Impressum', href: '/impressum' },
    ],
  }

  const cities = [
    { name: 'Karlsruhe', slug: 'karlsruhe' },
    { name: 'Bruchsal', slug: 'bruchsal' },
    { name: 'Heidelberg', slug: 'heidelberg' },
    { name: 'Mannheim', slug: 'mannheim' },
    { name: 'Speyer', slug: 'speyer' },
    { name: 'Pforzheim', slug: 'pforzheim' },
    { name: 'Rastatt', slug: 'rastatt' },
    { name: 'Baden-Baden', slug: 'baden-baden' },
    { name: 'Ludwigshafen', slug: 'ludwigshafen' },
    { name: 'Stuttgart', slug: 'stuttgart' },
  ]

  // Nur ausgefüllte Social-Links anzeigen
  const socialLinks = (Object.keys(SOCIAL_ICONS) as (keyof typeof SOCIAL_ICONS)[])
    .map(key => ({ key, url: (s as unknown as Record<string, string>)[key] ?? '', ...SOCIAL_ICONS[key] }))
    .filter(item => item.url.trim() !== '')

  const mapsUrl = `https://maps.google.com/?q=${encodeURIComponent(`${s.strasse}, ${s.plz_firma} ${s.ort}`)}`

  return (
    <footer className="bg-[#0F172A] text-white">
      <div className="container mx-auto px-4 md:px-6 lg:px-8 py-12 lg:py-16">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-8 lg:gap-10">

          {/* Spalte 1+2: Logo + Kontakt + Erreichbarkeit + Social */}
          <div className="lg:col-span-2">
            <Link href="/" className="inline-block mb-3">
              <Logo variant="dark" height={32} showText={false} />
            </Link>
            <p className="text-white/60 text-sm leading-relaxed mb-3">
              Seit 6 Jahren fair, schnell &amp; persönlich.
            </p>

            {/* Adresse */}
            <div className="mb-1.5 flex items-start gap-1.5 text-white/45 text-xs leading-relaxed">
              <svg className="w-3.5 h-3.5 mt-0.5 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
              </svg>
              <span>{s.strasse}, {s.plz_firma} {s.ort}</span>
            </div>

            {/* Google Maps Link */}
            <a
              href={mapsUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1 text-[#0EA5E9] hover:text-white text-xs transition-colors duration-200 mb-5"
            >
              <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
              </svg>
              Auf Google Maps öffnen
            </a>

            {/* Kontakt */}
            <div className="border-t border-white/10 pt-4 mb-4">
              <h3 className="text-xs font-bold uppercase tracking-wider text-white/40 mb-3">Kontakt</h3>
              <FooterContactLinks
                telefon={s.telefon}
                whatsapp={s.whatsapp}
                email={s.email}
              />
            </div>

            {/* Erreichbarkeit */}
            <div className="border-t border-white/10 pt-4 mb-5">
              <p className="text-white/40 text-[10px] font-semibold uppercase tracking-wider mb-2">Erreichbarkeit</p>
              <div className="space-y-1 mb-2">
                <p className="text-white/60 text-xs">📞 Telefon &amp; 💬 WhatsApp</p>
                <p className="text-white/45 text-xs">Mo–Fr: 6:00–18:00 Uhr &nbsp;·&nbsp; Sa: 6:00–13:00 Uhr</p>
              </div>
              <p className="text-white/60 text-xs mb-0.5">✉️ E-Mail &amp; 💬 WhatsApp: jederzeit</p>
              <p className="text-white/30 text-[10px] leading-relaxed">
                Nachrichten außerhalb der Geschäftszeiten werden am nächsten Werktag beantwortet.
              </p>
            </div>

            {/* Social Media Icons – nur wenn eingetragen */}
            {socialLinks.length > 0 && (
              <div>
                <p className="text-white/40 text-[10px] font-semibold uppercase tracking-wider mb-2">Besucht uns auf:</p>
                <div className="flex items-center flex-wrap gap-2">
                  {socialLinks.map((social) => (
                    <a
                      key={social.key}
                      href={social.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      aria-label={social.label}
                      className="w-8 h-8 flex items-center justify-center rounded-lg bg-white/10 hover:bg-[#0369A1] text-white/60 hover:text-white transition-all duration-200"
                    >
                      {social.svg}
                    </a>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* Spalte 3: Navigation */}
          <div>
            <h3 className="text-xs font-bold uppercase tracking-wider text-white/40 mb-4">Navigation</h3>
            <ul className="space-y-2.5">
              {navigation.main.map((item) => (
                <li key={item.name}>
                  <Link href={item.href} className="text-white/65 hover:text-white transition-colors duration-200 text-sm">
                    {item.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Spalte 4: Städte */}
          <div>
            <h3 className="text-xs font-bold uppercase tracking-wider text-white/40 mb-4">Städte</h3>
            <ul className="space-y-2.5">
              {cities.map((city) => (
                <li key={city.slug}>
                  <Link href={`/${city.slug}`} className="text-white/65 hover:text-white transition-colors duration-200 text-sm">
                    Autoankauf {city.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Spalte 5: Partner */}
          <div>
            <h3 className="text-xs font-bold uppercase tracking-wider text-white/40 mb-4">Partner</h3>
            <ul className="space-y-2.5">
              <li>
                <a
                  href="https://autohausstern-graben.de/"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-white/65 hover:text-white transition-colors duration-200 text-sm"
                >
                  Autohaus Stern Graben-Neudorf
                </a>
              </li>
              <li>
                <a
                  href="https://flexdienstleistungen.de/"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-white/65 hover:text-white transition-colors duration-200 text-sm"
                >
                  Flex Dienstleistungen
                </a>
              </li>
            </ul>
          </div>

        </div>
      </div>

      {/* Bottom bar */}
      <div className="bg-[#0A0F1A]">
        <div className="container mx-auto px-4 md:px-6 lg:px-8 py-4">
          <div className="flex flex-col md:flex-row justify-between items-center gap-3">
            <p className="text-xs text-white/35">
              © {new Date().getFullYear()} {s.firmenname}. Alle Rechte vorbehalten.
            </p>
            <div className="flex flex-wrap items-center gap-5">
              {navigation.legal.map((item) => (
                <Link key={item.name} href={item.href} className="text-xs text-white/35 hover:text-white/60 transition-colors duration-200">
                  {item.name}
                </Link>
              ))}
              <FooterInstallButton />
            </div>
          </div>
        </div>
      </div>
    </footer>
  )
}
