'use client'

interface HeroImageProps {
  src: string
  position?: 'center' | 'top' | 'bottom'
}

export default function HeroImage({ src, position = 'center' }: HeroImageProps) {
  if (!src) return null
  const posClass = position === 'top' ? 'object-top' : position === 'bottom' ? 'object-bottom' : 'object-center'
  return (
    // eslint-disable-next-line @next/next/no-img-element
    <img
      src={src}
      alt=""
      aria-hidden="true"
      className={`absolute inset-0 w-full h-full object-cover ${posClass}`}
      onError={(e) => { (e.target as HTMLImageElement).style.display = 'none' }}
    />
  )
}
