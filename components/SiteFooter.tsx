import { Armchair, ArrowUpRight } from '@phosphor-icons/react/dist/ssr';
import { business } from '@/lib/business';

export default function SiteFooter() {
  return (
    <footer className="site-footer">
      <div className="container">
        <div className="footer-top">
          <a className="brand" href="/" aria-label="Andhra Hotel and Restaurant Furniture home">
            <span className="brand-symbol"><Armchair size={31} weight="light" aria-hidden="true" /></span>
            <span className="brand-name">Andhra Hotel and Restaurant{' '}<span>Furniture</span></span>
          </a>
          <p>Furniture for the way you welcome.</p>
          <a className="text-link" href={`tel:${business.telephone}`}>{business.phone}<ArrowUpRight size={20} aria-hidden="true" /></a>
        </div>
        <div className="footer-bottom">
          <p>© {new Date().getFullYear()} {business.name}</p>
          <nav aria-label="Footer navigation">
            <a href="/#categories">Collections</a>
            <a href="/gallery/">Gallery</a>
            <a href="/contact/">Contact us</a>
            <a href="/#visit">Location</a>
            <a href="/#enquire">Enquire</a>
            <a href={business.googleProfile} target="_blank" rel="noopener noreferrer">Google profile</a>
          </nav>
          <span>Vijayawada / Vizag / Hyderabad</span>
        </div>
      </div>
      <div className="managed-by" style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8, marginTop: 10, fontSize: 13 }}>
        Managed by{' '}
        <a href="https://vgrow.ai" target="_blank" rel="noopener" style={{ display: 'inline-flex', background: '#fff', borderRadius: 6, padding: '3px 8px' }}>
          <img src="/vgrow-logo.png" alt="vgrow.ai" height={18} style={{ height: 18, width: 'auto' }} />
        </a>
      </div>
    </footer>
  );
}
