'use client'

import { gtmEvents } from '@/lib/gtm'

interface Props {
  telefon: string
  whatsapp: string
  email: string
}

export function FooterContactLinks({ telefon, whatsapp, email }: Props) {
  return (
    <div className="space-y-3">
      <div>
        <p className="text-white/40 text-[10px] mb-0.5">Telefon</p>
        <a
          href={`tel:${telefon.replace(/\s+/g, '')}`}
          onClick={() => gtmEvents.phone_click({ location: 'footer' })}
          className="text-white/80 hover:text-white transition-colors duration-200 text-sm font-medium"
        >
          {telefon}
        </a>
      </div>
      <div>
        <p className="text-white/40 text-[10px] mb-0.5">WhatsApp</p>
        <a
          href={`https://wa.me/${whatsapp}`}
          onClick={() => gtmEvents.whatsapp_click({ location: 'footer' })}
          target="_blank"
          rel="noopener noreferrer"
          className="text-white/80 hover:text-white transition-colors duration-200 text-sm font-medium"
        >
          {telefon}
        </a>
      </div>
      <div>
        <p className="text-white/40 text-[10px] mb-0.5">E-Mail</p>
        <a
          href={`mailto:${email}`}
          className="text-white/80 hover:text-white transition-colors duration-200 text-sm font-medium"
        >
          {email}
        </a>
      </div>
    </div>
  )
}
