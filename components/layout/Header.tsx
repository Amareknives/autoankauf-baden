'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import Logo from './Logo'
import { gtmEvents } from '@/lib/gtm'
import { Phone, Menu, X, Car } from 'lucide-react'

export default function Header({ telefon }: { telefon: string }) {
  const [isScrolled, setIsScrolled] = useState(false)
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20)
    }
    window.addEventListener('scroll', handleScroll)
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  useEffect(() => {
    if (isMobileMenuOpen) {
      document.body.style.overflow = 'hidden'
    } else {
      document.body.style.overflow = ''
    }
    return () => { document.body.style.overflow = '' }
  }, [isMobileMenuOpen])

  const handlePhoneClick = () => {
    gtmEvents.phone_click({ location: 'header' })
  }

  const navItems = [
    { href: '/so-funktionierts', label: "So funktioniert's" },
    { href: '/haendler', label: 'Händler' },
    { href: '/faq', label: 'FAQ' },
    { href: '/ueber-uns', label: 'Über uns' },
  ]

  return (
    <>
      <header
        className={`fixed top-0 left-0 right-0 z-50 transition-all duration-200 ${
          isScrolled
            ? 'bg-white/95 backdrop-blur-sm border-b border-[#E2EDF7] shadow-sm'
            : 'bg-white border-b border-[#E2EDF7]'
        }`}
      >
        <div className="container mx-auto px-4 md:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            {/* Logo */}
            <Link href="/" className="flex-shrink-0" onClick={() => setIsMobileMenuOpen(false)}>
              <Logo height={40} />
            </Link>

            {/* Desktop Navigation */}
            <nav className="hidden md:flex items-center space-x-8">
              {navItems.map((item) => (
                <Link
                  key={item.href}
                  href={item.href}
                  className="text-[#0F172A] hover:text-[#0369A1] transition-colors duration-200 font-medium relative group"
                >
                  {item.label}
                  <span className="absolute -bottom-0.5 left-0 w-0 h-0.5 bg-[#0369A1] group-hover:w-full transition-all duration-200" />
                </Link>
              ))}
            </nav>

            {/* Right Side */}
            <div className="flex items-center space-x-3">
              {/* Phone */}
              {telefon && (
                <a
                  href={`tel:${telefon}`}
                  onClick={handlePhoneClick}
                  className="hidden sm:flex items-center space-x-2 text-[#0F172A] hover:text-[#0369A1] transition-colors duration-200 font-medium text-sm"
                >
                  <Phone size={20} strokeWidth={2.5} color="#0369A1" />
                  <span>{telefon}</span>
                </a>
              )}

              {/* CTA Button */}
              <Link
                href="/fahrzeug-verkaufen"
                onClick={() => gtmEvents.form_start({ page: 'header' })}
                className="hidden sm:inline-flex items-center px-5 py-2.5 bg-[#FB6F6F] hover:bg-[#f95c5c] text-white font-semibold rounded-lg transition-colors duration-200 text-sm min-h-[48px]"
              >
                Auto jetzt verkaufen
              </Link>

              {/* Mobile Menu Button */}
              <button
                onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                className="md:hidden p-2 rounded-lg hover:bg-gray-100 transition-colors min-w-[48px] min-h-[48px] flex items-center justify-center"
                aria-label={isMobileMenuOpen ? 'Menü schließen' : 'Menü öffnen'}
              >
                {isMobileMenuOpen
                  ? <X size={20} strokeWidth={2.5} />
                  : <Menu size={20} strokeWidth={2.5} />
                }
              </button>
            </div>
          </div>
        </div>
      </header>

      {/* Mobile Menu Overlay */}
      {isMobileMenuOpen && (
        <div className="md:hidden fixed inset-0 z-40 flex flex-col pt-16" style={{ background: 'linear-gradient(160deg, #0F172A 0%, #1a2744 100%)' }}>
          {/* Nav-Links */}
          <nav className="flex flex-col px-5 pt-4">
            {navItems.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                className="flex items-center gap-3 px-3 py-3.5 rounded-xl mb-1 text-white/90 font-semibold text-[17px] active:bg-white/10 transition-colors duration-150"
                onClick={() => setIsMobileMenuOpen(false)}
              >
                {item.label}
              </Link>
            ))}
          </nav>

          {/* Divider */}
          <div className="mx-5 mt-2 mb-4 h-px bg-white/10" />

          {/* CTA + Phone */}
          <div className="px-5 space-y-3">
            <Link
              href="/fahrzeug-verkaufen"
              onClick={() => { gtmEvents.form_start({ page: 'header_mobile' }); setIsMobileMenuOpen(false) }}
              className="flex items-center justify-center w-full px-6 py-3.5 bg-[#FB6F6F] hover:bg-[#f95c5c] active:bg-[#f95c5c] text-white font-bold rounded-xl transition-colors duration-200 text-[15px] min-h-[52px]"
            >
              Auto jetzt verkaufen
            </Link>

            {telefon && (
              <a
                href={`tel:${telefon}`}
                onClick={() => { handlePhoneClick(); setIsMobileMenuOpen(false) }}
                className="flex items-center gap-3 px-3 py-3 rounded-xl text-white/80 font-medium text-[15px] min-h-[48px] active:bg-white/15 transition-colors duration-150"
                style={{ backgroundColor: 'rgba(255,255,255,0.06)' }}
              >
                <Phone size={18} strokeWidth={2} className="text-[#38BDF8] shrink-0" />
                <span>{telefon}</span>
              </a>
            )}
          </div>

          {/* Footer-Links */}
          <div className="mt-auto px-5 pb-8 pt-6">
            <div className="h-px bg-white/10 mb-4" />
            <div className="flex flex-wrap gap-x-4 gap-y-2">
              {[
                { href: '/impressum', label: 'Impressum' },
                { href: '/datenschutz', label: 'Datenschutz' },
                { href: '/agb', label: 'AGB' },
              ].map(l => (
                <Link
                  key={l.href}
                  href={l.href}
                  onClick={() => setIsMobileMenuOpen(false)}
                  className="text-white/35 hover:text-white/60 text-xs transition-colors duration-150"
                >
                  {l.label}
                </Link>
              ))}
            </div>
          </div>
        </div>
      )}
    </>
  )
}
