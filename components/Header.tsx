'use client';

import { useEffect, useRef, useState } from 'react';
import { Armchair, ArrowUpRight, List, MapPin, Phone, X } from '@phosphor-icons/react';
import { business } from '@/lib/business';

const links = [{ href: '/#categories', label: 'Our collection' }, { href: '/gallery/', label: 'Gallery' }, { href: '/#approach', label: 'Our approach' }, { href: '/#visit', label: 'Visit us' }];

export default function Header() {
  const [open, setOpen] = useState(false);
  const menuRef = useRef<HTMLButtonElement>(null);
  useEffect(() => {
    if (!open) return;
    function onKey(event: KeyboardEvent) {
      if (event.key === 'Escape') { setOpen(false); menuRef.current?.focus(); }
    }
    document.addEventListener('keydown', onKey);
    return () => document.removeEventListener('keydown', onKey);
  }, [open]);
  return <>
    <div className="location-bar"><div className="container location-bar-inner">
      <a href={business.map} target="_blank" rel="noopener noreferrer"><MapPin size={14} aria-hidden="true" /> Vijayawada, Andhra Pradesh <ArrowUpRight size={13} aria-hidden="true" /></a>
      <span>For spaces in Vijayawada, Vizag &amp; Hyderabad</span>
    </div></div>
    <header className="site-header">
      <div className="container header-inner">
        <a className="brand" href="/" aria-label="Hotel and Resturant Furniture home">
          <span className="brand-symbol"><Armchair size={31} weight="light" aria-hidden="true" /></span>
          <span className="brand-name">Hotel and Resturant{' '}<span>Furniture</span></span>
        </a>
        <nav aria-label="Main navigation" className="desktop-nav">{links.map(link => <a key={link.href} href={link.href}>{link.label}</a>)}</nav>
        <a className="button button-primary header-call" href={`tel:${business.telephone}`}><Phone size={17} aria-hidden="true" /><span>{business.phone}</span></a>
        <button ref={menuRef} className="icon-button menu-toggle" aria-label={open ? 'Close menu' : 'Open menu'} aria-expanded={open} aria-controls="mobile-menu" onClick={() => setOpen(!open)}>{open ? <X size={24} /> : <List size={24} />}</button>
      </div>
      {open && <nav className="mobile-menu" id="mobile-menu" aria-label="Mobile navigation">{links.map(link => <a key={link.href} href={link.href} onClick={() => setOpen(false)}>{link.label}<ArrowUpRight size={18} aria-hidden="true" /></a>)}<a href={`tel:${business.telephone}`}><Phone size={18} aria-hidden="true" /> Call {business.phone}</a></nav>}
    </header>
  </>;
}
