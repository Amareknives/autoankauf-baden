'use client'

import { useState } from 'react'

interface Props {
  children: React.ReactNode
}

export default function TextExpand({ children }: Props) {
  const [expanded, setExpanded] = useState(false)

  return (
    <div>
      <div
        className={`relative transition-all duration-300 ${
          expanded
            ? ''
            : 'max-h-[200px] overflow-hidden lg:max-h-none lg:overflow-visible'
        }`}
      >
        {children}
        {!expanded && (
          <div className="absolute bottom-0 left-0 right-0 h-14 bg-gradient-to-t from-[#F8FAFC] to-transparent pointer-events-none lg:hidden" />
        )}
      </div>
      <button
        onClick={() => setExpanded(!expanded)}
        className="text-[#0369A1] text-sm font-semibold mt-1 lg:hidden hover:underline"
      >
        {expanded ? 'Weniger anzeigen ↑' : 'Mehr lesen ↓'}
      </button>
    </div>
  )
}
