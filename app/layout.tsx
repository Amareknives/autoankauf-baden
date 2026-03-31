import type { Metadata } from 'next'
import { Plus_Jakarta_Sans } from 'next/font/google'
import './globals.css'
import { GTMHead, GTMBody } from '@/lib/gtm'
import Footer from '@/components/layout/Footer'
import ClientLayout from '@/components/layout/ClientLayout'
import ClientFooter from '@/components/layout/ClientFooter'
import ChatWidget from '@/components/layout/ChatWidget'
import { Toaster } from 'react-hot-toast'
import { getSiteSettings } from '@/lib/siteSettings'

const plusJakartaSans = Plus_Jakarta_Sans({
  subsets: ['latin'],
  variable: '--font-plus-jakarta',
})

export const metadata: Metadata = {
  title: 'AutoAnkauf-Baden – Fair & Schnell | AutoAnkauf-Baden',
  description:
    'Auto verkaufen in Baden: Kostenlos bewerten, Angebot in 2–3h, kostenlose Abholung. Seit 6 Jahren in Karlsruhe, Bruchsal, Heidelberg, Mannheim, Speyer.',
  keywords:
    'Auto verkaufen, Baden, Karlsruhe, Bruchsal, Heidelberg, Mannheim, Speyer, Pforzheim, Rastatt, Baden-Baden, Ludwigshafen, Germersheim',
  authors: [{ name: 'AutoAnkauf-Baden' }],
  creator: 'AutoAnkauf-Baden',
  publisher: 'AutoAnkauf-Baden',
  formatDetection: {
    email: false,
    address: false,
    telephone: false,
  },
  metadataBase: new URL('https://autoankauf-baden.de'),
  alternates: {
    canonical: '/',
  },
  openGraph: {
    title: 'AutoAnkauf-Baden – Fair & Schnell',
    description:
      'Auto verkaufen in Baden: Kostenlos bewerten, Angebot in 2–3h, kostenlose Abholung. Seit 6 Jahren in der Region.',
    url: 'https://autoankauf-baden.de',
    siteName: 'AutoAnkauf-Baden',
    locale: 'de_DE',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'AutoAnkauf-Baden – Fair & Schnell',
    description:
      'Auto verkaufen in Baden: Kostenlos bewerten, Angebot in 2–3h, kostenlose Abholung.',
    creator: '@autoankaufbaden',
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-video-preview': -1,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
  },
}

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  const settings = await getSiteSettings()

  return (
    <html lang="de" className={`${plusJakartaSans.variable} h-full antialiased`}>
      <head>
        <GTMHead />
      </head>
      <body className="min-h-full flex flex-col font-sans">
        <GTMBody />
        <ClientLayout whatsapp={settings.whatsapp} telefon={settings.telefon}>
          {children}
        </ClientLayout>
        <ClientFooter>
          <Footer />
        </ClientFooter>
        {settings.chatEnabled === 'true' && <ChatWidget />}
      </body>
    </html>
  )
}
