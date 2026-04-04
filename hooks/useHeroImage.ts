'use client'

import { useState, useEffect } from 'react'

const STORAGE_KEY = 'aab_hero_queue'

/** Fisher-Yates shuffle */
function shuffle<T>(arr: T[]): T[] {
  const a = [...arr]
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1))
    ;[a[i], a[j]] = [a[j], a[i]]
  }
  return a
}

/**
 * Kartendeck-Rotation für Hero-Bilder.
 * – Zieht immer das nächste Bild aus einer gemischten Queue (localStorage).
 * – Wenn die Queue leer ist, wird neu gemischt – aber das letzte gezeigte Bild
 *   kommt nicht an erster Stelle des neuen Decks.
 * – Preloaded das übernächste Bild still im Hintergrund.
 */
export function useHeroImage(images: string[]): string {
  const [src, setSrc] = useState('')

  useEffect(() => {
    if (!images.length) return

    let queue: string[] = []

    try {
      const stored = localStorage.getItem(STORAGE_KEY)
      if (stored) queue = JSON.parse(stored) as string[]
    } catch {
      // localStorage nicht verfügbar
    }

    // Queue leer oder ungültig → neu mischen
    if (!queue.length || !queue.every(s => images.includes(s))) {
      queue = shuffle(images)
    }

    const current = queue[0]
    const remaining = queue.slice(1)

    // Beim nächsten Neu-Mischen: aktuelles Bild nicht an Pos 0 erlauben
    let nextQueue = remaining.length ? remaining : (() => {
      let fresh = shuffle(images)
      if (fresh[0] === current) {
        // Tausche erstes mit zweitem Element
        ;[fresh[0], fresh[1]] = [fresh[1], fresh[0]]
      }
      return fresh
    })()

    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(nextQueue))
    } catch {
      // ignorieren
    }

    setSrc(current)

    // Preload des nächsten Bildes
    if (nextQueue[0]) {
      const img = new Image()
      img.src = nextQueue[0]
    }
  }, []) // eslint-disable-line react-hooks/exhaustive-deps

  return src
}
