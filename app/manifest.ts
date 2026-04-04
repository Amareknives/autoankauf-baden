import { MetadataRoute } from 'next'

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: 'AutoAnkauf Baden',
    short_name: 'AutoAnkauf',
    description: 'Auto verkaufen in Baden – Fair & Schnell. Angebot in 2–3h.',
    start_url: '/',
    display: 'standalone',
    background_color: '#0369A1',
    theme_color: '#0369A1',
    orientation: 'portrait',
    icons: [
      {
        src: '/apple-icon',
        sizes: '180x180',
        type: 'image/png',
      },
      {
        src: '/icon-512',
        sizes: '512x512',
        type: 'image/png',
        purpose: 'maskable',
      },
    ],
  }
}
