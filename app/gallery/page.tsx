import type { Metadata } from 'next';
import { ArrowLeft, ArrowUpRight, Phone, WhatsappLogo } from '@phosphor-icons/react/dist/ssr';
import Header from '@/components/Header';
import Gallery from '@/components/Gallery';
import SiteFooter from '@/components/SiteFooter';
import FloatingContact from '@/components/FloatingContact';
import { business, siteUrl, whatsapp } from '@/lib/business';
import { galleryCategories, galleryItems } from '@/lib/gallery-data';
import './gallery.css';

const title = 'Furniture Gallery | Dining Sets & Restaurant Sofas | Vijayawada';
const description = 'Browse six-seater, couple and four-seater dining sets, plus restaurant sofas. Hotel and Restaurant Furniture, Vijayawada. Enquiries from Vizag and Hyderabad welcome.';
const cover = galleryItems.find((item) => item.id === galleryCategories[0].coverId)!;

export const metadata: Metadata = {
  title,
  description,
  ...(siteUrl ? { alternates: { canonical: '/gallery/' } } : {}),
  openGraph: {
    title,
    description,
    siteName: business.name,
    type: 'website',
    locale: 'en_IN',
    ...(siteUrl ? { url: `${siteUrl}/gallery/`, images: [{ url: `${siteUrl}${cover.image}`, width: cover.width, height: cover.height, alt: cover.alt }] } : {}),
  },
  twitter: { card: 'summary_large_image', title, description },
};

export default function GalleryPage() {
  const schema = {
    '@context': 'https://schema.org',
    '@graph': [
      {
        '@type': 'ImageGallery',
        name: `Furniture Gallery | ${business.name}`,
        description,
        inLanguage: 'en-IN',
        ...(siteUrl ? { '@id': `${siteUrl}/gallery/#gallery`, url: `${siteUrl}/gallery/`, about: { '@id': `${siteUrl}/#business` } } : {}),
        hasPart: galleryItems.map((item) => ({
          '@type': 'ImageObject',
          name: item.title,
          caption: item.alt,
          identifier: item.id,
          width: item.width,
          height: item.height,
          ...(siteUrl ? { contentUrl: `${siteUrl}${item.image}`, url: `${siteUrl}/gallery/?category=${item.category}#${item.id}` } : {}),
        })),
      },
      ...(siteUrl ? [{
        '@type': 'BreadcrumbList',
        itemListElement: [
          { '@type': 'ListItem', position: 1, name: 'Home', item: `${siteUrl}/` },
          { '@type': 'ListItem', position: 2, name: 'Furniture gallery', item: `${siteUrl}/gallery/` },
        ],
      }] : []),
    ],
  };

  return <>
    <a className="skip-link" href="#main">Skip to content</a>
    <Header />
    <main id="main" className="gallery-page">
      <section className="gallery-intro container" aria-labelledby="gallery-page-title">
        <nav className="gallery-breadcrumb" aria-label="Breadcrumb"><a href="/"><ArrowLeft size={15} aria-hidden="true" />Home</a><span aria-hidden="true">/</span><span aria-current="page">Furniture gallery</span></nav>
        <div className="gallery-intro-layout">
          <div><p className="eyebrow">The furniture gallery</p><h1 id="gallery-page-title">A seat for two.<br /><span>A setting for everyone.</span></h1></div>
          <div className="gallery-intro-copy"><p>Explore our six-seater, couple and four-seater dining sets, and restaurant sofas. Find a style for your hotel, restaurant or café, then talk to us about your space.</p><p className="gallery-local-note">Based in Vijayawada. Enquiries welcome from Vizag and Hyderabad.</p><a className="text-link" href={`tel:${business.telephone}`}><Phone size={18} aria-hidden="true" />Call {business.phone}<ArrowUpRight size={17} aria-hidden="true" /></a></div>
        </div>
      </section>

      <div className="container gallery-content"><Gallery /></div>

      <section className="gallery-visit" aria-labelledby="gallery-help-heading"><div className="container gallery-visit-inner"><div><p className="eyebrow">Found your kind of furniture?</p><h2 id="gallery-help-heading">Let’s find the right fit.</h2><p>Send us the design reference and your seating requirement. We’ll help you take the next step.</p></div><div className="gallery-visit-actions"><a className="button button-primary" href={whatsapp('Hello, I have been looking at your furniture gallery. I would like to discuss furniture for my space.')} target="_blank" rel="noopener noreferrer"><WhatsappLogo size={22} aria-hidden="true" /><span>WhatsApp <strong>{business.phone}</strong></span><ArrowUpRight size={18} aria-hidden="true" /></a><a className="text-link" href="/#visit">Visit us in Vijayawada<ArrowUpRight size={18} aria-hidden="true" /></a></div></div></section>
    </main>
    <SiteFooter />
    <FloatingContact />
    <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(schema).replace(/</g, '\\u003c') }} />
  </>;
}
