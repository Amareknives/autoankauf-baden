import type { NextConfig } from "next";

const securityHeaders = [
  // Kein Einbetten der Seite in iframes (Clickjacking-Schutz)
  { key: 'X-Frame-Options', value: 'DENY' },
  // Browser darf MIME-Typ nicht raten
  { key: 'X-Content-Type-Options', value: 'nosniff' },
  // Referrer nur bei gleichem Origin vollständig senden
  { key: 'Referrer-Policy', value: 'strict-origin-when-cross-origin' },
  // Unnötige Browser-Features deaktivieren
  { key: 'Permissions-Policy', value: 'camera=(), microphone=(), geolocation=(), payment=()' },
  // HTTPS erzwingen (1 Jahr, inkl. Subdomains)
  { key: 'Strict-Transport-Security', value: 'max-age=31536000; includeSubDomains' },
  // XSS-Schutz (moderne Browser nutzen CSP, ältere diesen Header)
  { key: 'X-XSS-Protection', value: '1; mode=block' },
  // Content Security Policy
  {
    key: 'Content-Security-Policy',
    value: [
      "default-src 'self'",
      "script-src 'self' 'unsafe-inline' 'unsafe-eval'", // Next.js benötigt unsafe-inline für Hydration
      "style-src 'self' 'unsafe-inline' https://fonts.googleapis.com",
      "font-src 'self' https://fonts.gstatic.com",
      "img-src 'self' data: blob: https:",
      "connect-src 'self'",
      "frame-ancestors 'none'",
      "base-uri 'self'",
      "form-action 'self'",
    ].join('; '),
  },
];

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
        // Security Headers auf allen Seiten
        source: '/:path*',
        headers: securityHeaders,
      },
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
