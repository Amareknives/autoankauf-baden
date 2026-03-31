import type { MetadataRoute } from 'next';

export default function robots(): MetadataRoute.Robots {
  return {
    rules: {
      userAgent: '*',
      allow: '/',
      disallow: ['/dashboard', '/api/', '/danke'],
    },
    sitemap: 'https://autoankauf-baden.de/sitemap.xml',
  };
}
