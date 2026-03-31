'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import Logo from './Logo'
import { gtmEvents } from '@/lib/gtm'
import { Phone, Menu, X } from 'lucide-react'

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
    { href: '/fahrzeug-verkaufen', label: 'Auto verkaufen' },
    { href: '/so-funktionierts', label: "So funktioniert's" },
    { href: '/haendler', label: 'Händler' },
    { href: '/faq', label: 'FAQ' },
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
              <Logo height={27} />
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
                className="hidden sm:inline-flex items-center px-4 py-2.5 bg-[#FB6F6F] hover:bg-[#f95c5c] text-white font-semibold rounded-lg transition-colors duration-200 text-sm min-h-[48px]"
              >
                Kostenlos bewerten
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

      {/* Mobile Fullscreen Overlay */}
      {isMobileMenuOpen && (
        <div className="md:hidden fixed inset-0 z-40 bg-[#0F172A] flex flex-col pt-16">
          <div className="flex flex-col px-6 py-8 space-y-2 flex-1">
            {navItems.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                className="text-white hover:text-[#0EA5E9] transition-colors duration-200 font-semibold text-2xl py-4 border-b border-white/10"
                onClick={() => setIsMobileMenuOpen(false)}
              >
                {item.label}
              </Link>
            ))}

            <div className="pt-8 space-y-4">
              {telefon && (
                <a
                  href={`tel:${telefon}`}
                  onClick={() => {
                    handlePhoneClick()
                    setIsMobileMenuOpen(false)
                  }}
                  className="flex items-center space-x-3 text-white hover:text-[#0EA5E9] transition-colors duration-200 font-medium py-3 min-h-[48px]"
                >
                  <Phone size={20} strokeWidth={2.5} />
                  <span>{telefon}</span>
                </a>
              )}

              <Link
                href="/fahrzeug-verkaufen"
                onClick={() => {
                  gtmEvents.form_start({ page: 'header_mobile' })
                  setIsMobileMenuOpen(false)
                }}
                className="flex items-center justify-center w-full px-6 py-4 bg-[#FB6F6F] hover:bg-[#f95c5c] text-white font-bold rounded-xl transition-colors duration-200 text-lg min-h-[56px]"
              >
                Kostenlos bewerten
              </Link>
            </div>
          </div>
        </div>
      )}
    </>
  )
}
