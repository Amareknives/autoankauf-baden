'use client'

import { useState, useEffect, useRef } from 'react'
import { MessageCircle, Phone, ChevronLeft, ChevronRight } from 'lucide-react'
import { gtmEvents } from '@/lib/gtm'

interface Props {
  whatsapp: string
  telefon: string
}

const SESSION_KEY = 'aab_floating_dismissed'

export default function FloatingButtons({ whatsapp, telefon }: Props) {
  const [visible, setVisible] = useState(true)
  const timerRef = useRef<ReturnType<typeof setTimeout> | undefined>(undefined)
  const dismissedRef = useRef(false)

  useEffect(() => {
    // Wurde in dieser Session manuell weggeklickt? → dauerhaft weg
    if (sessionStorage.getItem(SESSION_KEY) === '1') {
      dismissedRef.current = true
      setVisible(false)
      return
    }

    const handleScroll = () => {
      if (dismissedRef.current) return
      clearTimeout(timerRef.current)
      setVisible(false)
      timerRef.current = setTimeout(() => setVisible(true), 3000)
    }
    window.addEventListener('scroll', handleScroll, { passive: true })
    return () => {
      window.removeEventListener('scroll', handleScroll)
      clearTimeout(timerRef.current)
    }
  }, [])

  const handleTabClick = () => {
    clearTimeout(timerRef.current)
    const next = !visible
    if (!next) {
      // Manuell weggeklickt → für diese Session merken
      dismissedRef.current = true
      sessionStorage.setItem(SESSION_KEY, '1')
    }
    setVisible(next)
  }

  const cleanWa = whatsapp?.replace(/[\s+\-()]/g, '') ?? ''

  return (
    <>
      {/* Desktop: WhatsApp normal, Phone versteckt (unverändert) */}
      {whatsapp && (
        <a
          href={`https://wa.me/${cleanWa}`}
          onClick={() => gtmEvents.whatsapp_click({ location: 'floating_button' })}
          target="_blank"
          rel="noopener noreferrer"
          aria-label="WhatsApp Chat öffnen"
          className="hidden md:flex fixed bottom-5 right-5 z-40 w-14 h-14 rounded-full bg-[#25D366] items-center justify-center shadow-lg hover:scale-105 transition-transform duration-200"
          style={{ boxShadow: '0 4px 12px rgba(37,211,102,0.4)' }}
        >
          <MessageCircle size={26} strokeWidth={2.5} color="white" fill="white" />
        </a>
      )}

      {/* Mobile: Smart Peek Container */}
      <div
        className="md:hidden fixed bottom-5 right-0 z-40 flex items-center"
        style={{
          transition: 'transform 350ms cubic-bezier(0.4,0,0.2,1)',
          transform: visible ? 'translateX(0)' : 'translateX(76px)',
        }}
      >
        {/* Arrow Tab – immer sichtbarer Streifen */}
        <button
          onClick={handleTabClick}
          className="flex-shrink-0 w-5 h-14 bg-[#0369A1] rounded-l-xl flex items-center justify-center shadow-md"
          aria-label={visible ? 'Buttons ausblenden' : 'Kontakt anzeigen'}
        >
          {visible
            ? <ChevronRight size={12} color="white" strokeWidth={3} />
            : <ChevronLeft size={12} color="white" strokeWidth={3} />
          }
        </button>

        {/* Buttons */}
        <div className="flex flex-col gap-3 pl-2 pr-5">
          {telefon && (
            <a
              href={`tel:${telefon}`}
              onClick={() => gtmEvents.phone_click({ location: 'floating_button' })}
              aria-label="Jetzt anrufen"
              className="w-14 h-14 rounded-full bg-[#0369A1] flex items-center justify-center"
              style={{ boxShadow: '0 4px 12px rgba(3,105,161,0.4)' }}
            >
              <Phone size={22} strokeWidth={2.5} color="white" />
            </a>
          )}
          {whatsapp && (
            <a
              href={`https://wa.me/${cleanWa}`}
              onClick={() => gtmEvents.whatsapp_click({ location: 'floating_button' })}
              target="_blank"
              rel="noopener noreferrer"
              aria-label="WhatsApp Chat öffnen"
              className="w-14 h-14 rounded-full bg-[#25D366] flex items-center justify-center"
              style={{ boxShadow: '0 4px 12px rgba(37,211,102,0.4)' }}
            >
              <MessageCircle size={26} strokeWidth={2.5} color="white" fill="white" />
            </a>
          )}
        </div>
      </div>
    </>
  )
}
