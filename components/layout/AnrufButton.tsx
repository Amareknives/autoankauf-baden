'use client'

import { Phone } from 'lucide-react'
import { gtmEvents } from '@/lib/gtm'

export default function AnrufButton({ nummer }: { nummer: string }) {
  if (!nummer) return null

  const handleClick = () => {
    gtmEvents.phone_click({ location: 'floating_button' })
  }

  return (
    <a
      href={`tel:${nummer}`}
      onClick={handleClick}
      aria-label={`Jetzt anrufen: ${nummer}`}
      className="md:hidden"
      style={{
        position: 'fixed',
        bottom: '88px',
        right: '20px',
        zIndex: 40,
        width: '56px',
        height: '56px',
        borderRadius: '50%',
        backgroundColor: '#0369A1',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        boxShadow: '0 4px 12px rgba(3, 105, 161, 0.4)',
        transition: 'transform 200ms ease, box-shadow 200ms ease',
      }}
      onMouseEnter={e => {
        const el = e.currentTarget as HTMLAnchorElement
        el.style.transform = 'scale(1.08)'
        el.style.boxShadow = '0 6px 20px rgba(3, 105, 161, 0.55)'
      }}
      onMouseLeave={e => {
        const el = e.currentTarget as HTMLAnchorElement
        el.style.transform = 'scale(1)'
        el.style.boxShadow = '0 4px 12px rgba(3, 105, 161, 0.4)'
      }}
    >
      <Phone size={22} strokeWidth={2.5} color="white" aria-hidden="true" />
    </a>
  )
}
