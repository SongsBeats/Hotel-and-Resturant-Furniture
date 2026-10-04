import type { Metadata, Viewport } from 'next';
import { business, siteUrl } from '@/lib/business';
import './globals.css';

const description = 'Discover hotel, restaurant and café furniture at Andhra Hotel and Restaurant Furniture in Vijayawada. Dining sets, chairs and tables for Vijayawada, Vizag and Hyderabad. Call +91 8639121227.';

export const metadata: Metadata = {
  title: 'Andhra Hotel and Restaurant Furniture | Vijayawada',
  description,
  applicationName: business.name,
  ...(siteUrl ? { metadataBase: new URL(siteUrl), alternates: { canonical: '/' } } : {}),
  robots: { index: Boolean(siteUrl), follow: true },
  openGraph: {
    title: 'Furniture for the way you welcome | Andhra Hotel and Restaurant Furniture',
    description,
    siteName: business.name,
    locale: 'en_IN',
    type: 'website',
    ...(siteUrl ? { url: siteUrl, images: [{ url: `${siteUrl}/images/upholstered-dining-set.webp`, width: 1080, height: 766, alt: 'Round dining table with upholstered chairs' }] } : {}),
  },
  twitter: { card: 'summary_large_image', title: 'Andhra Hotel and Restaurant Furniture | Vijayawada', description },
  category: 'furniture',
  formatDetection: { telephone: false },
  icons: {
    icon: [
      { url: '/favicon.ico', sizes: '48x48' },
      { url: '/icon.svg', type: 'image/svg+xml' },
      { url: '/favicon-96x96.png', sizes: '96x96', type: 'image/png' },
    ],
    apple: [{ url: '/apple-touch-icon.png', sizes: '180x180', type: 'image/png' }],
  },
  manifest: '/site.webmanifest',
};

export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
  themeColor: [{ media: '(prefers-color-scheme: light)', color: '#fafbf8' }, { media: '(prefers-color-scheme: dark)', color: '#151b18' }],
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return <html lang="en-IN"><body>{children}</body></html>;
}
