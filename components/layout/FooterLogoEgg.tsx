'use client'

import { useRef } from 'react'
import Link from 'next/link'
import Logo from './Logo'

export function FooterLogoEgg() {
  const clicksRef = useRef(0)
  const timerRef = useRef<ReturnType<typeof setTimeout> | undefined>(undefined)

  const handleClick = () => {
    clicksRef.current += 1
    clearTimeout(timerRef.current)

    if (clicksRef.current >= 5) {
      clicksRef.current = 0
      window.open('/dashboard', '_blank', 'noopener')
      return
    }

    timerRef.current = setTimeout(() => {
      clicksRef.current = 0
    }, 2000)
  }

  return (
    <span onClick={handleClick} className="inline-block cursor-pointer">
      <Logo variant="dark" height={32} showText={false} />
    </span>
  )
}
