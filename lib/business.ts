export const business = {
  name: 'Hotel and Restaurant Furniture',
  phone: '+91 8639121227',
  telephone: '+918639121227',
  hoursDisplay: 'Monday–Saturday, 8 AM–10 PM. Closed on Sunday.',
  googleProfile: 'https://maps.app.goo.gl/ZTwRGQu86QNqKCMQ8',
  address: 'Ambapuram Road, Near Karthikeya hospital, Andhra prabha colony, 4th line, Sing Nager, Vijayawada-520015',
  map: 'https://www.google.com/maps?q=16.546791076660156,80.64033508300781&z=17&hl=en',
  directions: 'https://www.google.com/maps/dir/?api=1&destination=16.546791076660156,80.64033508300781',
};

export function whatsapp(message = 'Hello, I would like to enquire about furniture for my hotel, restaurant or café.') {
  return `https://wa.me/918639121227?text=${encodeURIComponent(message)}`;
}

const productionHost = process.env.VERCEL_PROJECT_PRODUCTION_URL?.trim();
const configuredUrl = process.env.NEXT_PUBLIC_SITE_URL?.trim() || (productionHost ? `https://${productionHost}` : undefined);
function getSiteUrl() {
  if (!configuredUrl) return undefined;
  const url = new URL(configuredUrl);
  if (url.protocol !== 'https:' || url.pathname !== '/' || url.search || url.hash) {
    throw new Error('NEXT_PUBLIC_SITE_URL must be an HTTPS origin with no path, query or fragment.');
  }
  return url.origin;
}
export const siteUrl = getSiteUrl();

export const faqs = [
  {
    question: 'What kind of furniture can I enquire about?',
    answer: 'Explore couple seating, four-seater and six-seater dining sets, restaurant sofas, chairs and table-and-bench sets for hotels, restaurants and cafés. We also welcome enquiries for office furniture, school furniture, college furniture and hostel furniture. Share your requirements or a gallery reference to discuss availability.',
  },
  {
    question: 'Where are you located in Vijayawada?',
    answer: 'Hotel and Restaurant Furniture is located on Ambapuram Road, near Karthikeya hospital, Andhra prabha colony, 4th line, Sing Nager, Vijayawada-520015. Call +91 8639121227 to plan your visit.',
  },
  {
    question: 'Can I enquire from Vizag or Hyderabad?',
    answer: 'Yes. We welcome furniture enquiries from Vijayawada, Visakhapatnam (Vizag) and Hyderabad. Our location is in Vijayawada. Contact us with your city and requirements to discuss availability and delivery arrangements.',
  },
  {
    question: 'Can I discuss furniture for a full restaurant?',
    answer: 'Yes. Tell us your seating requirement, the furniture you like and your location. We can discuss suitable options and quantities for your restaurant, café or hotel dining space.',
  },
  {
    question: 'How do I check colours, sizes and availability?',
    answer: 'Call or WhatsApp +91 8639121227 with the furniture photo or collection name. Confirm the dimensions, colour options, quantities and current availability directly before placing an order.',
  },
];

export const structuredData = {
  '@context': 'https://schema.org',
  '@type': 'FurnitureStore',
  name: business.name,
  telephone: business.telephone,
  description: 'Hotel, restaurant, office, school, college and hostel furniture in Vijayawada, with enquiries welcome from Visakhapatnam (Vizag) and Hyderabad.',
  ...(siteUrl ? { '@id': `${siteUrl}/#business`, url: siteUrl, image: `${siteUrl}/images/upholstered-dining-set.webp` } : {}),
  address: {
    '@type': 'PostalAddress',
    streetAddress: 'Ambapuram Road, Near Karthikeya hospital, Andhra prabha colony, 4th line, Sing Nager',
    addressLocality: 'Vijayawada',
    addressRegion: 'Andhra Pradesh',
    postalCode: '520015',
    addressCountry: 'IN',
  },
  geo: { '@type': 'GeoCoordinates', latitude: 16.546791076660156, longitude: 80.64033508300781 },
  hasMap: business.map,
  sameAs: [business.googleProfile],
  openingHoursSpecification: [{
    '@type': 'OpeningHoursSpecification',
    dayOfWeek: ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'],
    opens: '08:00',
    closes: '22:00',
  }],
  areaServed: [
    { '@type': 'City', name: 'Vijayawada' },
    { '@type': 'City', name: 'Visakhapatnam', alternateName: 'Vizag' },
    { '@type': 'City', name: 'Hyderabad' },
  ],
};
