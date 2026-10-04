import type { Metadata } from 'next';
import { ArrowLeft, ArrowUpRight, Clock, EnvelopeSimple, MapPin, Phone, Storefront, WhatsappLogo } from '@phosphor-icons/react/dist/ssr';
import Header from '@/components/Header';
import SiteFooter from '@/components/SiteFooter';
import FloatingContact from '@/components/FloatingContact';
import EnquiryForm from '@/components/EnquiryForm';
import LocationMap from '@/components/LocationMap';
import { business, siteUrl, whatsapp, structuredData } from '@/lib/business';
import './contact.css';

const title = 'Contact Us | Andhra Hotel and Restaurant Furniture | Vijayawada';
const description = 'Contact Andhra Hotel and Restaurant Furniture in Vijayawada. Call or WhatsApp +91 8639121227. Ambapuram Road, Sing Nager. Visit our showroom or enquire online.';

export const metadata: Metadata = {
  title,
  description,
  ...(siteUrl ? { alternates: { canonical: '/contact/' } } : {}),
  openGraph: {
    title,
    description,
    siteName: business.name,
    type: 'website',
    locale: 'en_IN',
    ...(siteUrl ? { url: `${siteUrl}/contact/`, images: [{ url: `${siteUrl}/images/upholstered-dining-set.webp`, width: 1080, height: 766, alt: 'Andhra Hotel and Restaurant Furniture showroom' }] } : {}),
  },
  twitter: { card: 'summary_large_image', title, description },
};

export default function ContactPage() {
  const schema = {
    '@context': 'https://schema.org',
    '@graph': [
      {
        '@type': 'ContactPage',
        name: `Contact Us | ${business.name}`,
        description,
        inLanguage: 'en-IN',
        ...(siteUrl ? { '@id': `${siteUrl}/contact/#page`, url: `${siteUrl}/contact/`, mainEntity: { '@id': `${siteUrl}/#business` } } : {}),
      },
      structuredData,
      ...(siteUrl ? [{
        '@type': 'BreadcrumbList',
        itemListElement: [
          { '@type': 'ListItem', position: 1, name: 'Home', item: `${siteUrl}/` },
          { '@type': 'ListItem', position: 2, name: 'Contact us', item: `${siteUrl}/contact/` },
        ],
      }] : []),
    ],
  };

  return <>
    <a className="skip-link" href="#main">Skip to content</a>
    <Header />
    <main id="main" className="contact-page">
      <section className="contact-intro container" aria-labelledby="contact-heading">
        <nav className="contact-breadcrumb" aria-label="Breadcrumb">
          <a href="/"><ArrowLeft size={15} aria-hidden="true" />Home</a>
          <span aria-hidden="true">/</span>
          <span aria-current="page">Contact us</span>
        </nav>
        <p className="eyebrow" style={{ marginTop: '20px' }}>Official Business Contact</p>
        <h1 id="contact-heading">Contact Andhra Hotel<br /><span>and Restaurant Furniture</span></h1>
        <p className="contact-intro-copy">
          We manufacture and wholesale commercial furniture for hotels, restaurants, cafés, offices, schools, colleges and hostels in Vijayawada. Enquiries are welcome from Vijayawada, Visakhapatnam (Vizag) and Hyderabad. Reach out to discuss materials, dimensions, finishes, custom specifications or plan your showroom visit.
        </p>
      </section>

      <section className="container" aria-label="Business contact details">
        <div className="contact-grid">
          <div className="contact-card">
            <div className="contact-card-icon" aria-hidden="true"><Phone size={24} weight="regular" /></div>
            <h2>Call &amp; WhatsApp</h2>
            <p>Direct line for furniture enquiries, custom quotes and bulk orders:</p>
            <div className="contact-card-links">
              <a className="contact-card-link" href={`tel:${business.telephone}`}>
                <Phone size={17} aria-hidden="true" />
                <span>Call {business.phone}</span>
              </a>
              <a className="contact-card-link" href={whatsapp()} target="_blank" rel="noopener noreferrer">
                <WhatsappLogo size={18} aria-hidden="true" />
                <span>WhatsApp {business.phone}</span>
                <ArrowUpRight size={14} aria-hidden="true" />
              </a>
              <a className="contact-card-link" href={`mailto:${business.email}`}>
                <EnvelopeSimple size={18} aria-hidden="true" />
                <span>{business.email}</span>
              </a>
            </div>
            <span className="contact-card-badge">Instant customer response</span>
          </div>

          <div className="contact-card">
            <div className="contact-card-icon" aria-hidden="true"><MapPin size={24} weight="regular" /></div>
            <h2>Showroom &amp; Works</h2>
            <address>
              <strong>{business.name}</strong><br />
              Ambapuram Road, Near Karthikeya hospital,<br />
              Andhra prabha colony, 4th line, Sing Nager,<br />
              Vijayawada, Andhra Pradesh 520015
            </address>
            <div className="contact-card-links">
              <a className="contact-card-link" href={business.directions} target="_blank" rel="noopener noreferrer">
                <span>Get directions on Google Maps</span>
                <ArrowUpRight size={15} aria-hidden="true" />
              </a>
            </div>
            <span className="contact-card-badge">Sing Nager, Vijayawada</span>
          </div>

          <div className="contact-card">
            <div className="contact-card-icon" aria-hidden="true"><Storefront size={24} weight="regular" /></div>
            <h2>Business Hours &amp; Info</h2>
            <p><strong>Opening Hours:</strong></p>
            <p style={{ marginTop: '4px' }}>
              Monday–Saturday: 08:00–22:00 (8 AM – 10 PM)<br />
              Sunday: Closed
            </p>
            <p style={{ marginTop: '12px' }}>
              <strong>Business Type:</strong> Furniture wholesaler &amp; Manufacturer<br />
              <strong>Categories:</strong> Bar Restaurant Furniture Shop, Office Furniture Shop
            </p>
            <span className="contact-card-badge">Mon–Sat: 8 AM–10 PM</span>
          </div>
        </div>

        <div className="contact-layout">
          <div className="contact-form-wrap">
            <h2>Send a furniture enquiry</h2>
            <p>Tell us about your space, seat count or requirements. We will prepare design suggestions and availability details.</p>
            <EnquiryForm />
          </div>

          <div className="contact-map-wrap">
            <div>
              <h2>Find us on the map</h2>
              <p>Located on Ambapuram Road near Karthikeya hospital in Sing Nager, Vijayawada.</p>
            </div>
            <LocationMap />
          </div>
        </div>
      </section>
    </main>
    <SiteFooter />
    <FloatingContact />
    <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(schema).replace(/</g, '\\u003c') }} />
  </>;
}
