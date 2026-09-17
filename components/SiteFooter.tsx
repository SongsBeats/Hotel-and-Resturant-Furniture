import { Armchair, ArrowUpRight } from '@phosphor-icons/react/dist/ssr';
import { business } from '@/lib/business';

export default function SiteFooter() {
  return (
    <footer className="site-footer">
      <div className="container">
        <div className="footer-top">
          <a className="brand" href="/" aria-label="Hotel and Restaurant Furniture home">
            <span className="brand-symbol"><Armchair size={31} weight="light" aria-hidden="true" /></span>
            <span className="brand-name">Hotel and Restaurant{' '}<span>Furniture</span></span>
          </a>
          <p>Furniture for the way you welcome.</p>
          <a className="text-link" href={`tel:${business.telephone}`}>{business.phone}<ArrowUpRight size={20} aria-hidden="true" /></a>
        </div>
        <div className="footer-bottom">
          <p>© {new Date().getFullYear()} {business.name}</p>
          <nav aria-label="Footer navigation">
            <a href="/#categories">Collections</a>
            <a href="/gallery/">Gallery</a>
            <a href="/#visit">Location</a>
            <a href="/#enquire">Enquire</a>
            <a href={business.googleProfile} target="_blank" rel="noopener noreferrer">Google profile</a>
          </nav>
          <span>Vijayawada / Vizag / Hyderabad</span>
        </div>
      </div>
    </footer>
  );
}
