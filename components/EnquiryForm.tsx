'use client';

import { useState } from 'react';
import { ArrowUpRight, WhatsappLogo } from '@phosphor-icons/react';
import { business, whatsapp } from '@/lib/business';

export default function EnquiryForm() {
  const [prepared, setPrepared] = useState<string>();
  const [error, setError] = useState('');
  function submit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const form = new FormData(event.currentTarget);
    const name = String(form.get('name') ?? '').trim();
    if (!name) { setError('Please enter your name.'); event.currentTarget.querySelector<HTMLInputElement>('#enquiry-name')?.focus(); return; }
    setError('');
    const message = `Hello, I’m ${name}. I’m looking for furniture for a ${form.get('space')} in ${form.get('city')}.\n${String(form.get('requirements') || '').trim() || 'Please help me explore the available options.'}`;
    const url = whatsapp(message);
    setPrepared(url);
    window.open(url, '_blank', 'noopener,noreferrer');
  }
  return <form className="enquiry-form" onSubmit={submit}>
    <h3>A few details to get started.</h3>
    <div className="form-field"><label htmlFor="enquiry-name">Your name</label><input id="enquiry-name" name="name" autoComplete="name" placeholder="Your name" required maxLength={80} aria-invalid={Boolean(error)} aria-describedby={error ? 'name-error' : undefined} onChange={() => setError('')} />{error && <p id="name-error" className="form-error" role="alert">{error}</p>}</div>
    <div className="form-row"><div className="form-field"><label htmlFor="enquiry-space">Your space</label><select id="enquiry-space" name="space" defaultValue="restaurant"><option value="restaurant">Restaurant</option><option value="café">Café</option><option value="hotel">Hotel</option><option value="canteen or dining space">Canteen / other</option></select></div><div className="form-field"><label htmlFor="enquiry-city">Your city</label><select id="enquiry-city" name="city" defaultValue="Vijayawada"><option>Vijayawada</option><option>Visakhapatnam (Vizag)</option><option>Hyderabad</option><option>Another city</option></select></div></div>
    <div className="form-field"><label htmlFor="enquiry-requirements">What do you have in mind? <span>(optional)</span></label><textarea id="enquiry-requirements" name="requirements" rows={3} maxLength={1000} placeholder="Tables, chairs, approximate quantity, or a style you like…" /></div>
    <button type="submit" className="button button-primary"><WhatsappLogo size={20} aria-hidden="true" /> WhatsApp {business.phone}<ArrowUpRight size={18} aria-hidden="true" /></button>
    <p className="form-note">Opens WhatsApp with your details. You send the message.</p>
    {prepared && <p role="status" className="form-status">Your message is ready. <a href={prepared} target="_blank" rel="noopener noreferrer">Continue in WhatsApp</a> to send your enquiry.</p>}
  </form>;
}
