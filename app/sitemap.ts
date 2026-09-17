import type { MetadataRoute } from 'next';
import { siteUrl } from '@/lib/business';
export const dynamic = 'force-static';
export default function sitemap(): MetadataRoute.Sitemap {
  return siteUrl ? [
    { url: `${siteUrl}/`, changeFrequency: 'monthly', priority: 1 },
    { url: `${siteUrl}/gallery/`, changeFrequency: 'monthly', priority: 0.9 },
  ] : [];
}
