import { Phone, WhatsappLogo } from '@phosphor-icons/react/dist/ssr';
import { business, whatsapp } from '@/lib/business';

export default function FloatingContact() {
  return (
    <nav className="floating-contact" aria-label="Quick contact">
      <a href={`tel:${business.telephone}`}>
        <Phone size={23} aria-hidden="true" />
        <span>Call{' '}<strong>{business.phone}</strong></span>
      </a>
      <a href={whatsapp()} target="_blank" rel="noopener noreferrer">
        <WhatsappLogo size={25} aria-hidden="true" />
        <span>WhatsApp{' '}<strong>{business.phone}</strong></span>
      </a>
    </nav>
  );
}
