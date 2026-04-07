'use client'

import { useHeroImage } from '@/hooks/useHeroImage'
import HeroImage from './HeroImage'

const HERO_IMAGES = [
  '/hero-home.webp', '/hero-home1.webp', '/hero-home2.webp',
  '/hero-home3.webp', '/hero-home4.webp', '/hero-home5.webp',
  '/hero-home6.webp', '/hero-home7.webp', '/hero-home8.webp',
]

interface Props {
  position?: 'center' | 'top' | 'bottom'
}

export default function HeroImageRandom({ position = 'center' }: Props) {
  const src = useHeroImage(HERO_IMAGES)
  return <HeroImage src={src} position={position} />
}
