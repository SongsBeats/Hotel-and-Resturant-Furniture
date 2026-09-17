'use client';

import { useState } from 'react';
import { MapPin, ArrowUpRight } from '@phosphor-icons/react';
import { business } from '@/lib/business';

export default function LocationMap() {
  const [loaded, setLoaded] = useState(false);
  return <div className="location-map">
    {loaded ? <iframe src="https://maps.google.com/maps?q=16.546791076660156,80.64033508300781&z=16&output=embed" title="Hotel and Restaurant Furniture location in Vijayawada" loading="lazy" referrerPolicy="no-referrer-when-downgrade" allowFullScreen /> : <div className="map-intro"><MapPin size={38} weight="light" aria-hidden="true" /><h3>Find us in Vijayawada.</h3><p>Ambapuram Road, near Karthikeya hospital</p><button className="button button-outline" onClick={() => setLoaded(true)}>Load Google Map <ArrowUpRight size={18} aria-hidden="true" /></button></div>}
    <a className="map-directions" href={business.directions} target="_blank" rel="noopener noreferrer">Get directions on Google Maps <ArrowUpRight size={19} aria-hidden="true" /></a>
  </div>;
}
