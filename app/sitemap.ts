import type { MetadataRoute } from 'next';
import { STAEDTE } from '@/constants/stadtData';

const baseUrl = 'https://autoankauf-baden.de';

const HIGH_PRIORITY_CITIES = ['karlsruhe', 'mannheim', 'heidelberg', 'bruchsal'];

export default function sitemap(): MetadataRoute.Sitemap {
  return [
    { url: baseUrl, lastModified: new Date(), changeFrequency: 'weekly', priority: 1.0 },
    { url: `${baseUrl}/fahrzeug-verkaufen`, lastModified: new Date(), changeFrequency: 'monthly', priority: 0.9 },
    { url: `${baseUrl}/so-funktionierts`, lastModified: new Date(), changeFrequency: 'monthly', priority: 0.8 },
    { url: `${baseUrl}/haendler`, lastModified: new Date(), changeFrequency: 'monthly', priority: 0.75 },
    { url: `${baseUrl}/faq`, lastModified: new Date(), changeFrequency: 'monthly', priority: 0.85 },
    { url: `${baseUrl}/ueber-uns`, lastModified: new Date(), changeFrequency: 'monthly', priority: 0.7 },
    { url: `${baseUrl}/datenschutz`, lastModified: new Date(), changeFrequency: 'yearly', priority: 0.3 },
    { url: `${baseUrl}/agb`, lastModified: new Date(), changeFrequency: 'yearly', priority: 0.3 },
    { url: `${baseUrl}/impressum`, lastModified: new Date(), changeFrequency: 'yearly', priority: 0.3 },
    ...STAEDTE.map((stadt) => ({
      url: `${baseUrl}/${stadt.slug}`,
      lastModified: new Date(),
      changeFrequency: 'monthly' as const,
      priority: HIGH_PRIORITY_CITIES.includes(stadt.slug) ? 0.95 : 0.85,
    })),
  ];
}
