'use client'

import { useState } from 'react'
import Image from 'next/image'

interface Props {
  slug: string
  bildText: string
  stadtName: string
}

export default function StadtBild({ slug, bildText, stadtName }: Props) {
  const [fehler, setFehler] = useState(false)

  return (
    <div className="flex flex-col h-full">
      <div className="relative flex-1 min-h-[260px] rounded-2xl overflow-hidden">
        {fehler ? (
          <div className="w-full h-full bg-[#0369A1] flex items-center justify-center">
            <span className="text-white font-black text-2xl px-4 text-center">{stadtName}</span>
          </div>
        ) : (
          <Image
            src={`/${slug}.webp`}
            alt={`Autoankauf ${stadtName} – Stadtansicht`}
            fill
            className="object-cover"
            sizes="(max-width: 1024px) 100vw, 40vw"
            onError={() => setFehler(true)}
          />
        )}
      </div>
      <p className="text-xs text-[#94A3B8] mt-2 text-center">{bildText}</p>
    </div>
  )
}
