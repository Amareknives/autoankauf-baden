'use client'

import { usePathname } from 'next/navigation'
import Header from './Header'
import FloatingButtons from './FloatingButtons'

export default function ClientLayout({
  children,
  whatsapp,
  telefon,
}: {
  children: React.ReactNode
  whatsapp: string
  telefon: string
}) {
  const pathname = usePathname()
  const isDashboard = pathname.startsWith('/dashboard')

  return (
    <>
      {!isDashboard && <Header telefon={telefon} />}
      <main className={isDashboard ? 'flex-1' : 'flex-1 pt-16'}>
        {children}
      </main>
      {!isDashboard && (
        <FloatingButtons
          whatsapp={whatsapp}
          telefon={telefon}
          quietMode={pathname === '/fahrzeug-verkaufen'}
        />
      )}
    </>
  )
}
