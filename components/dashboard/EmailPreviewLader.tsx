'use client'

import { useEffect, useState } from 'react'
import { createPortal } from 'react-dom'

interface Props {
  title?: string
  subtitle?: string
}

export default function EmailPreviewLader({
  title = 'Vorschau wird erstellt…',
  subtitle = 'E-Mail wird für dich gerendert',
}: Props) {
  const [mounted, setMounted] = useState(false)
  useEffect(() => { setMounted(true) }, [])

  const content = (
    <div className="fixed inset-0 z-[9999] flex items-center justify-center bg-black/60 backdrop-blur-sm">
      <div className="bg-white rounded-2xl shadow-2xl px-10 py-8 flex flex-col items-center gap-5 min-w-[280px]">

        {/* Auto-Animation */}
        <div className="relative w-48 h-16 overflow-hidden">
          {/* Straße */}
          <div className="absolute bottom-0 left-0 right-0 h-1 bg-[#E2EDF7] rounded-full" />

          {/* Strichelmarkierung */}
          <div className="absolute bottom-0 left-0 right-0 h-1 flex items-center">
            {[0, 1, 2, 3, 4, 5].map(i => (
              <div
                key={i}
                className="h-0.5 w-5 bg-[#0369A1] rounded-full"
                style={{
                  marginLeft: i === 0 ? 0 : '10px',
                  opacity: 0.3,
                  animation: `roadDash 0.6s linear infinite`,
                  animationDelay: `${i * -0.1}s`,
                }}
              />
            ))}
          </div>

          {/* Auto SVG — fährt und wippt leicht */}
          <div
            className="absolute bottom-1"
            style={{ animation: 'carDrive 0.5s ease-in-out infinite alternate' }}
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 64 28"
              width="80"
              height="35"
              fill="none"
            >
              {/* Karosserie */}
              <rect x="4" y="12" width="56" height="12" rx="4" fill="#0369A1" />
              {/* Dach */}
              <path d="M16 12 Q20 4 44 4 Q50 4 54 12 Z" fill="#0284C7" />
              {/* Windschutzscheibe */}
              <path d="M20 12 Q23 6 38 6 Q43 6 46 12 Z" fill="#BAE6FD" opacity="0.9" />
              {/* Rad links */}
              <circle cx="16" cy="24" r="5" fill="#0F172A" />
              <circle cx="16" cy="24" r="2.5" fill="#94A3B8" style={{ animation: 'spin 0.4s linear infinite' }} />
              {/* Rad rechts */}
              <circle cx="48" cy="24" r="5" fill="#0F172A" />
              <circle cx="48" cy="24" r="2.5" fill="#94A3B8" style={{ animation: 'spin 0.4s linear infinite' }} />
              {/* Scheinwerfer */}
              <rect x="56" y="14" width="5" height="4" rx="2" fill="#FEF08A" />
              {/* Rücklicht */}
              <rect x="3" y="14" width="4" height="4" rx="2" fill="#FB6F6F" />
              {/* Tür-Linie */}
              <line x1="32" y1="13" x2="32" y2="23" stroke="#0284C7" strokeWidth="1" opacity="0.5" />
            </svg>
          </div>

          {/* Geschwindigkeits-Linien */}
          {[8, 16, 24].map((top, i) => (
            <div
              key={i}
              className="absolute left-0 h-0.5 bg-[#0369A1] rounded-full"
              style={{
                top: `${top}px`,
                animation: `speedLine 0.5s linear infinite`,
                animationDelay: `${i * 0.15}s`,
                opacity: 0.2,
              }}
            />
          ))}
        </div>

        {/* Text */}
        <div className="text-center">
          <p className="text-sm font-bold text-[#0F172A]">{title}</p>
          <p className="text-xs text-[#94A3B8] mt-1">{subtitle}</p>
        </div>

        {/* Lade-Punkte */}
        <div className="flex gap-1.5">
          {[0, 1, 2].map(i => (
            <div
              key={i}
              className="w-2 h-2 rounded-full bg-[#0369A1]"
              style={{
                animation: 'bounce 0.6s ease-in-out infinite alternate',
                animationDelay: `${i * 0.15}s`,
              }}
            />
          ))}
        </div>

      </div>

      <style>{`
        @keyframes carDrive {
          from { transform: translateY(0px); }
          to   { transform: translateY(-3px); }
        }
        @keyframes spin {
          from { transform: rotate(0deg); transform-origin: center; }
          to   { transform: rotate(360deg); transform-origin: center; }
        }
        @keyframes speedLine {
          from { width: 30px; opacity: 0.3; transform: translateX(0); }
          to   { width: 0px;  opacity: 0;   transform: translateX(-20px); }
        }
        @keyframes bounce {
          from { transform: translateY(0);    opacity: 0.4; }
          to   { transform: translateY(-6px); opacity: 1; }
        }
        @keyframes roadDash {
          from { transform: translateX(0); }
          to   { transform: translateX(-30px); }
        }
      `}</style>
    </div>
  )

  if (!mounted) return null
  return createPortal(content, document.body)
}
