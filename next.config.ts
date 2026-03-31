import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  compress: true,
  poweredByHeader: false,
  serverExternalPackages: ['@prisma/client', '@prisma/adapter-better-sqlite3', 'better-sqlite3'],
  images: {
    formats: ['image/webp', 'image/avif'],
    deviceSizes: [640, 750, 828, 1080, 1200, 1920, 2048, 3840],
    imageSizes: [16, 32, 48, 64, 96, 128, 256, 384],
  },
  experimental: {
    optimizePackageImports: ['lucide-react'],
  },
  async headers() {
    return [
      {
        // JS/CSS/Fonts – für immer cachen (Next.js Content-Hash im Dateinamen)
        source: '/_next/static/:path*',
        headers: [
          { key: 'Cache-Control', value: 'public, max-age=31536000, immutable' },
        ],
      },
      {
        // Bilder aus /public – 1 Tag cachen, 7 Tage stale-while-revalidate
        source: '/:path*.(ico|png|jpg|jpeg|webp|avif|svg|woff|woff2)',
        headers: [
          { key: 'Cache-Control', value: 'public, max-age=86400, stale-while-revalidate=604800' },
        ],
      },
    ]
  },
};

export default nextConfig;
