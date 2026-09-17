export const furnitureCategories = [
  'All furniture',
  'Dining sets',
  'Chairs & seating',
  'Tables & benches',
] as const;

export type FurnitureCategory = (typeof furnitureCategories)[number];

export type FurnitureItem = {
  id: string;
  title: string;
  category: Exclude<FurnitureCategory, 'All furniture'>;
  description: string;
  alt: string;
  width: number;
  height: number;
};

export const furniture: FurnitureItem[] = [
  {
    id: 'upholstered-dining-set',
    title: 'Upholstered dining set',
    category: 'Dining sets',
    description: 'A round marble-look table with upholstered chairs in muted pink and grey. A comfortable-looking combination for a café corner or an intimate dining space. Ask us about the finishes and configurations available.',
    alt: 'Round marble-look dining table with four upholstered armchairs in pink and grey',
    width: 1080,
    height: 766,
  },
  {
    id: 'classic-metal-dining-set',
    title: 'Classic metal dining set',
    category: 'Dining sets',
    description: 'A rectangular marble-look table paired with black metal chairs and wood-finish seats. A straightforward look for a restaurant or café dining area. Contact us to discuss your seating requirement.',
    alt: 'Rectangular marble-look table on a black frame with four black metal dining chairs',
    width: 1080,
    height: 1068,
  },
  {
    id: 'red-chair-dining-set',
    title: 'Red upholstered dining set',
    category: 'Dining sets',
    description: 'Red upholstered dining chairs around a dark rectangular table. A bold colour combination for a hotel dining room or restaurant. Ask about the current chair and table options.',
    alt: 'Red upholstered dining chairs with black legs around a dark rectangular table',
    width: 1077,
    height: 1062,
  },
  {
    id: 'wood-finish-dining-set',
    title: 'Wood-finish dining set',
    category: 'Dining sets',
    description: 'A wood-finish rectangular tabletop paired with framed armchairs and dark seat cushions. Bring your table count and room measurements, and we can discuss the options for your space.',
    alt: 'Wood-finish rectangular dining table with four brown framed chairs and dark seat cushions',
    width: 1280,
    height: 960,
  },
  {
    id: 'cafe-bench-set',
    title: 'Table & bench set',
    category: 'Tables & benches',
    description: 'A marble-look table and matching benches on dark crossed frames. A shared seating arrangement for casual dining spaces. Get in touch to confirm dimensions and availability.',
    alt: 'Marble-look rectangular table with matching benches on black crossed frames',
    width: 720,
    height: 540,
  },
  {
    id: 'seating-collection',
    title: 'Upholstered accent chairs',
    category: 'Chairs & seating',
    description: 'Upholstered armchair styles shown in pink, blue, grey and teal, with slim legs and a curved back. Ask us which colours and finishes are currently available for your café or hotel.',
    alt: 'Upholstered accent chair collection shown in pink, blue, grey and teal',
    width: 720,
    height: 773,
  },
  {
    id: 'white-round-dining-set',
    title: 'Round café dining set',
    category: 'Dining sets',
    description: 'A white round table with metal framed chairs and light seats. A simple, compact-looking dining arrangement. Contact us to check the size and discuss the number of sets you need.',
    alt: 'White round café table with four metal framed chairs and light coloured seats',
    width: 1080,
    height: 889,
  },
];

export function furnitureImage(item: FurnitureItem, size?: 480 | 800) {
  return `/images/${item.id}${size ? `-${size}` : ''}.webp`;
}

export function furnitureImageSet(item: FurnitureItem) {
  const mediumWidth = Math.min(item.width, 800);
  const fullWidth = Math.min(item.width, 1280);
  const sizes = [`${furnitureImage(item, 480)} ${Math.min(item.width, 480)}w`];
  if (mediumWidth > 480) sizes.push(`${furnitureImage(item, 800)} ${mediumWidth}w`);
  if (fullWidth > mediumWidth) sizes.push(`${furnitureImage(item)} ${fullWidth}w`);
  return sizes.join(', ');
}

export function furnitureEnquiry(item: FurnitureItem) {
  return `https://wa.me/918639121227?text=${encodeURIComponent(`Hello Hotel and Restaurant Furniture, I am interested in "${item.title}" (${item.category}). Please share the available options. My city is `)}`;
}
