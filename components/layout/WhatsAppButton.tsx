'use client'

import { MessageCircle } from 'lucide-react'
import { gtmEvents } from '@/lib/gtm'

export default function WhatsAppButton({ nummer }: { nummer: string }) {
  if (!nummer) return null

  const handleClick = () => {
    gtmEvents.whatsapp_click({ location: 'floating_button' })
  }

  const clean = nummer.replace(/[\s+\-()]/g, '')

  return (
    <a
      href={`https://wa.me/${clean}`}
      onClick={handleClick}
      target="_blank"
      rel="noopener noreferrer"
      aria-label="WhatsApp Chat öffnen"
      className="whatsapp-button"
      style={{
        position: 'fixed',
        bottom: '20px',
        right: '20px',
        zIndex: 40,
        width: '56px',
        height: '56px',
        borderRadius: '50%',
        backgroundColor: '#25D366',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        boxShadow: '0 4px 12px rgba(37, 211, 102, 0.4)',
        transition: 'transform 200ms ease, box-shadow 200ms ease',
      }}
      onMouseEnter={e => {
        const el = e.currentTarget as HTMLAnchorElement
        el.style.transform = 'scale(1.08)'
        el.style.boxShadow = '0 6px 20px rgba(37, 211, 102, 0.55)'
      }}
      onMouseLeave={e => {
        const el = e.currentTarget as HTMLAnchorElement
        el.style.transform = 'scale(1)'
        el.style.boxShadow = '0 4px 12px rgba(37, 211, 102, 0.4)'
      }}
    >
      <MessageCircle size={26} strokeWidth={2.5} color="white" fill="white" aria-hidden="true" />
    </a>
  )
}
