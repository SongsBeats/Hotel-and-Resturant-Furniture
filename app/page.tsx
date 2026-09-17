import { Armchair, ArrowDown, ArrowRight, ArrowUpRight, Check, MapPin, Phone, WhatsappLogo } from '@phosphor-icons/react/dist/ssr';
import Header from '@/components/Header';
import SiteFooter from '@/components/SiteFooter';
import FloatingContact from '@/components/FloatingContact';
import GalleryPreview from '@/components/GalleryPreview';
import Collection from '@/components/Collection';
import EnquiryForm from '@/components/EnquiryForm';
import LocationMap from '@/components/LocationMap';
import { business, faqs, structuredData, whatsapp } from '@/lib/business';

export default function Home() {
  return <>
    <a className="skip-link" href="#main">Skip to content</a>
    <Header />
    <main id="main">
      <section className="hero container" aria-labelledby="hero-heading">
        <div className="hero-copy">
          <p className="eyebrow">For the way you welcome</p>
          <h1 id="hero-heading">Good furniture.<br /><span>Great hospitality.</span></h1>
          <p className="hero-description">Chairs, tables and dining sets for hotels, restaurants and cafés. Based in Vijayawada, made for your next space.</p>
          <div className="hero-actions"><a className="button button-primary" href="#collection">Explore the collection <ArrowDown size={18} aria-hidden="true" /></a><a className="hero-phone" href={`tel:${business.telephone}`}><Phone size={19} aria-hidden="true" /><span>Let’s talk furniture<strong>{business.phone}</strong></span></a></div>
        </div>
        <figure className="hero-visual"><div className="hero-image-wrap"><img className="hero-image" src="/images/upholstered-dining-set.webp" srcSet="/images/upholstered-dining-set-480.webp 480w, /images/upholstered-dining-set-800.webp 800w, /images/upholstered-dining-set.webp 1080w" sizes="(max-width: 767px) calc(100vw - 40px), (max-width: 1399px) 48vw, 620px" alt="Round marble-look dining table with pink and sage upholstered chairs from our furniture collection" width={1080} height={766} fetchPriority="high" /></div><figcaption><span>Comfort looks good at the table.</span><a href="#collection" aria-label="View dining furniture"><ArrowUpRight size={23} aria-hidden="true" /></a></figcaption></figure>
      </section>

      <section className="service-intro container" aria-label="Furniture for hospitality spaces"><p>A seat for every setting.</p><div className="space-types"><span>Restaurants</span><span>Cafés &amp; bistros</span><span>Hotels</span><span>Dining spaces</span></div></section>

      <GalleryPreview />

      <section className="collection-section section-space" id="collection" aria-labelledby="collection-heading"><div className="container"><div className="section-heading"><h2 id="collection-heading">Find your kind of furniture.</h2><p>A closer look at our tables, chairs and dining sets. Find something you like, then let’s talk details.</p></div><Collection /><div className="collection-help"><span>Something caught your eye? Send us the photo.</span><a href={whatsapp()} target="_blank" rel="noopener noreferrer"><WhatsappLogo size={19} aria-hidden="true" />WhatsApp {business.phone}<ArrowUpRight size={17} aria-hidden="true" /></a></div></div></section>

      <section className="approach-section section-space container" id="approach" aria-labelledby="approach-heading"><div className="approach-copy"><p className="eyebrow">The right fit for your space</p><h2 id="approach-heading">A good space starts<br />with a good seat.</h2><p>From the first coffee to the last table of the evening, furniture is part of how your guests feel.</p><p>We help hotel, restaurant and café owners explore seating and dining furniture. Start with a style you like, and talk to us about your space.</p><ul className="approach-points"><li><Check size={18} aria-hidden="true" /> Dining tables and seating, considered together</li><li><Check size={18} aria-hidden="true" /> Options for a new space or a fresh start</li><li><Check size={18} aria-hidden="true" /> A direct conversation with a local business</li></ul><a className="text-link" href="#enquire">Tell us about your space <ArrowRight size={19} aria-hidden="true" /></a></div><div className="room-gallery"><figure className="room-large"><img src="/images/restaurant-interior.webp" srcSet="/images/restaurant-interior-480.webp 480w, /images/restaurant-interior.webp 720w" sizes="(max-width: 767px) 85vw, 40vw" alt="Blue upholstered chairs paired with marble-look tables in a restaurant dining area" width={720} height={454} loading="lazy" /></figure><figure className="room-small"><img src="/images/cafe-interior.webp" srcSet="/images/cafe-interior-480.webp 480w, /images/cafe-interior.webp 720w" sizes="(max-width: 767px) 58vw, 27vw" alt="Compact café seating layout with upholstered chairs and light dining tables" width={720} height={470} loading="lazy" /><figcaption>Different spaces. The same warm welcome.</figcaption></figure></div></section>

      <section className="areas-section" aria-labelledby="areas-heading"><div className="container areas-inner"><div><h2 id="areas-heading">Rooted in Vijayawada.<br />Ready for your next space.</h2><p>Furniture enquiries from Vijayawada, Vizag and Hyderabad.<br className="desktop-break" /> Tell us where you are, and we’ll discuss the details.</p></div><div className="city-list"><div><span>Vijayawada</span><small>Our home base</small><MapPin size={21} aria-hidden="true" /></div><div><span>Visakhapatnam <small className="inline-city">(Vizag)</small></span><small>Furniture enquiries</small><ArrowUpRight size={21} aria-hidden="true" /></div><div><span>Hyderabad</span><small>Furniture enquiries</small><ArrowUpRight size={21} aria-hidden="true" /></div></div></div></section>

      <section className="enquiry-section section-space container" id="enquire" aria-labelledby="enquiry-heading"><div className="enquiry-copy"><h2 id="enquiry-heading">Your next space<br />starts here.</h2><p>Opening a restaurant? Refreshing your café? Tell us what you’re planning. We’ll take it from there.</p><a className="enquiry-phone" href={`tel:${business.telephone}`}><span>Give us a call</span><strong>{business.phone}</strong><Phone size={27} weight="light" aria-hidden="true" /></a><div className="enquiry-tip"><Armchair size={31} weight="light" aria-hidden="true" /><p>A photo, a seat count, or just an idea.<br />That’s a good place to start.</p></div></div><EnquiryForm /></section>

      <section className="visit-section section-space" id="visit" aria-labelledby="visit-heading"><div className="container visit-grid"><div className="visit-copy"><p className="eyebrow">Come say hello</p><h2 id="visit-heading">Find us in<br />Vijayawada.</h2><h3>{business.name}</h3><address>Ambapuram Road, Near Karthikeya hospital,<br />Andhra prabha colony, 4th line, Sing Nager,<br />Vijayawada, Andhra Pradesh 520015</address><p className="visit-note">Call ahead to plan your visit.</p><a className="button button-primary" href={`tel:${business.telephone}`}><Phone size={18} aria-hidden="true" />Call {business.phone}</a></div><LocationMap /></div></section>

      <section className="faq-section section-space container" aria-labelledby="faq-heading"><div className="faq-heading"><h2 id="faq-heading">A few useful answers.</h2><p>Before we talk furniture.</p></div><div className="faq-list">{faqs.map(faq => <details key={faq.question}><summary>{faq.question}<span className="faq-plus" aria-hidden="true">+</span></summary><p>{faq.answer}</p></details>)}</div></section>
    </main>
    <SiteFooter />
    <FloatingContact />
    <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData).replace(/</g, '\\u003c') }} />
  </>;
}
