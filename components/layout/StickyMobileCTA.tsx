'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { useEffect, useState } from 'react'

const HIDE_ON = ['/fahrzeug-verkaufen', '/danke', '/termin-bestaetigung']

export default function StickyMobileCTA() {
  const pathname = usePathname()
  const [footerVisible, setFooterVisible] = useState(false)

  useEffect(() => {
    const footer = document.querySelector('footer')
    if (!footer) return
    const observer = new IntersectionObserver(
      ([entry]) => setFooterVisible(entry.isIntersecting),
      { threshold: 0.05 }
    )
    observer.observe(footer)
    return () => observer.disconnect()
  }, [])

  const shouldHide =
    HIDE_ON.some((p) => pathname.startsWith(p)) ||
    pathname.startsWith('/dashboard') ||
    footerVisible

  if (shouldHide) return null

  return (
    <div className="fixed bottom-4 left-3 right-[84px] z-40 md:hidden">
      <Link
        href="/fahrzeug-verkaufen"
        className="flex items-center justify-center gap-2 w-full py-3.5 bg-[#FB6F6F] hover:bg-[#f95c5c] text-white font-bold rounded-xl shadow-xl text-[15px] transition-colors duration-200"
      >
        <svg className="w-4 h-4 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
        </svg>
        Kostenloses Angebot
      </Link>
    </div>
  )
}
