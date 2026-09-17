import fs from 'node:fs/promises';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import sharp from 'sharp';

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const output = path.join(root, 'public', 'images', 'gallery');

// Explicit source order keeps the image references stable when a folder grows.
// Captions describe visible details; folder names supply the seating categories.
const categories = [
  {
    id: 'six-seater',
    folder: 'Six Sittings',
    label: 'Six-seater sets',
    description: 'Larger dining tables, chairs and bench seating for shared meals.',
    coverId: 'six-seater-05',
    items: [
      ['10.46.22 AM (1)', 'Brown padded-chair dining set', 'Dark wood-look rectangular table with brown padded chairs, viewed from above'],
      ['10.46.22 AM', 'Dark dining set', 'Dark rectangular dining table with black padded chairs'],
      ['10.46.23 AM (1)', 'Table and bench set', 'Light wood-look rectangular table with matching benches and black frames'],
      ['10.46.23 AM', 'Dark tabletop with brown chairs', 'Dark wood-look tabletop surrounded by brown padded dining chairs'],
      ['10.46.24 AM', 'Wheel-base dining set', 'Wood-look rectangular table with decorative wheel-shaped supports and black chairs'],
    ],
  },
  {
    id: 'couple',
    folder: 'Couple Sittings',
    label: 'Couple seating',
    description: 'Compact tables and seating arrangements for cafés and smaller spaces.',
    coverId: 'couple-03',
    items: [
      ['10.16.54 AM', 'Compact table and stools', 'Square wood-look table with matching stools on black open frames'],
      ['10.16.55 AM (1)', 'Pink-accent café seating', 'Small light tabletop on a pink base with pink and white chairs'],
      ['10.16.55 AM (2)', 'Square table with frame chairs', 'Square light wood-look table with two black-frame chairs'],
      ['10.16.55 AM', 'Compact black-chair dining sets', 'Small light wood-look tables paired with black chairs in a dining space'],
      ['10.45.01 AM (1)', 'Red and white café seating', 'Café interior with compact tables and red and white open-pattern chairs'],
      ['10.45.01 AM', 'Colourful café corner', 'Small café tables and brightly coloured chairs along a green wall'],
    ],
  },
  {
    id: 'four-seater',
    folder: 'Four Sittin Set',
    label: 'Four-seater sets',
    description: 'Everyday dining arrangements in a range of colours and table styles.',
    coverId: 'four-seater-06',
    items: [
      ['10.30.23 AM (1)', 'Wood-look table with black chairs', 'Rectangular wood-look tabletop with four black padded chairs'],
      ['10.30.23 AM', 'Red-accent dining chairs', 'Dark patterned tabletop with black chairs featuring red and white backrest panels'],
      ['10.30.24 AM (1)', 'Light table and bench seating', 'Light wood-look table and matching bench seats with black rectangular frames'],
      ['10.30.24 AM', 'Black and white dining set', 'Dark patterned table with four black chairs with white backrest panels'],
      ['10.37.47 AM', 'Pink padded-chair set', 'Dark veined tabletop surrounded by four pink padded chairs with black frames'],
      ['10.37.48 AM (1)', 'Light tabletop with gold-tone chairs', 'Light rectangular tabletop and four rounded-back chairs with gold-tone frames'],
      ['10.37.48 AM', 'Golden table with wheel base', 'Golden-coloured table with a decorative wheel base and black-frame chairs'],
      ['10.37.49 AM (1)', 'Cross-base dining table', 'Wood-look table with crossed black legs and rounded-back chairs'],
      ['10.37.49 AM (2)', 'Wheel-base table arrangement', 'Wood-look rectangular dining table with wheel-shaped supports and black chairs, side view'],
      ['10.37.49 AM', 'White and blue dining set', 'White dining table and white-frame chairs with bright blue seats'],
      ['10.37.50 AM (1)', 'Classic black-chair table set', 'Wood-look dining table with wheel-shaped supports and black chairs, front view'],
      ['10.37.50 AM', 'Restaurant dining layout', 'Restaurant interior with rows of wood-look dining tables and black chairs'],
      ['10.37.51 AM', 'Restaurant table arrangement', 'A row of wood-look tables and black chairs in a restaurant dining room'],
      ['10.41.25 AM (1)', 'White tabletop with black chairs', 'White rectangular tabletop on a black pedestal with four black chairs'],
      ['10.41.25 AM', 'Blue café dining set', 'Bright blue rectangular tabletop with four matching blue chairs'],
      ['10.41.26 AM (1)', 'Tall-back restaurant seating', 'Square restaurant table with four tall-back brown chairs under coloured lighting'],
      ['10.41.26 AM', 'Mixed-colour café chairs', 'White rectangular tabletop with blue, yellow, black and red chairs'],
      ['10.44.23 AM', 'Light wood-look dining set', 'Light wood-look rectangular table with four tall black padded chairs'],
      ['10.44.24 AM (1)', 'Café seating arrangement', 'Red and white open-pattern café chairs arranged around compact tables'],
      ['10.44.24 AM', 'Round dark-top dining set', 'Round dark tabletop with four silver-tone ladder-back chairs'],
      ['10.44.25 AM (1)', 'Colourful dining chairs in use', 'People seated around a dark veined table with yellow and red padded chairs'],
      ['10.44.25 AM (2)', 'Yellow and red padded-chair set', 'Dark veined tabletop with rounded yellow and red padded chairs'],
      ['10.44.25 AM', 'Dark table with silver-tone chairs', 'Dark rectangular tabletop paired with silver-tone ladder-back chairs'],
      ['10.44.26 AM', 'Wraparound dining chair design', 'Design image of a rounded square dark table with white and orange wraparound chairs'],
    ],
  },
  {
    id: 'sofas',
    folder: 'Resturant Sofas',
    label: 'Restaurant sofas',
    description: 'Booths, benches and sofa seating for comfortable dining spaces.',
    coverId: 'sofas-10',
    items: [
      ['10.53.15 AM (1)', 'Brown individual booth seats', 'Rows of brown padded booth seats with tall backrests'],
      ['10.53.15 AM', 'Orange diamond-stitched seat', 'Orange restaurant seat with a tall diamond-stitched backrest'],
      ['10.53.16 AM (1)', 'Black booth dining layout', 'Restaurant tables paired with black button-detail booth benches'],
      ['10.53.16 AM', 'Orange booth seating row', 'Four orange restaurant seats with tall diamond-stitched backrests arranged together'],
      ['10.53.17 AM (1)', 'Black and yellow booth set', 'Opposing black booth benches with yellow accents and a matching table'],
      ['10.53.17 AM (2)', 'Grey tall-back bench', 'Grey padded restaurant bench with a tall backrest on a dark frame'],
      ['10.53.17 AM', 'Café bench dining corner', 'Brown padded café bench with an orange table and chairs against a green wall'],
      ['10.53.18 AM (1)', 'Blue and yellow booth set', 'Blue booth benches with yellow accents placed opposite each other around a table'],
      ['10.53.18 AM', 'Restaurant sofa design selection', 'Reference collage showing restaurant sofa and bench designs in several colours'],
      ['10.53.19 AM (1)', 'Blue diamond-stitched bench', 'Blue restaurant bench with a tall diamond-stitched backrest'],
      ['10.53.19 AM', 'Red bench and chair arrangement', 'Red restaurant bench and matching red chairs around a rectangular red table'],
      ['10.53.20 AM (1)', 'Brown button-back bench', 'Brown restaurant bench with a tall buttoned backrest'],
      ['10.53.20 AM (2)', 'Tan straight-back bench seating', 'Tan padded restaurant benches with plain straight backrests arranged in a row'],
      ['10.53.20 AM', 'Blue tall-back booth seat', 'Deep blue restaurant bench with a tall plain backrest'],
      ['10.53.21 AM', 'Beige booth bench', 'Beige padded booth bench with a plain tall backrest'],
      ['10.53.22 AM (1)', 'Cream and brown booth seating', 'A row of cream restaurant seats with dark brown backrest accents'],
      ['10.53.22 AM', 'Brown straight-back bench', 'Brown padded restaurant bench with a tall straight backrest'],
      ['10.53.23 AM (1)', 'Individual booth seat colours', 'Individual restaurant booth seats displayed in brown, cream, pink, black and blue'],
      ['10.53.23 AM', 'Yellow restaurant benches', 'Yellow restaurant benches with dark bases and stitched backrests'],
      ['10.53.24 AM', 'Brown diamond-button bench', 'Brown restaurant bench with a diamond-pattern buttoned backrest'],
    ],
  },
];

await fs.mkdir(output, { recursive: true });
await fs.mkdir(path.join(root, 'lib'), { recursive: true });
const galleryItems = [];
const report = [];

for (const category of categories) {
  const sourceDirectory = path.join(root, category.folder);
  const sourceFiles = (await fs.readdir(sourceDirectory)).filter(file => /\.(jpe?g|png|webp|avif)$/i.test(file));
  const registeredFiles = category.items.map(([time]) => `WhatsApp Image 2026-09-17 at ${time}.jpeg`);
  const missing = registeredFiles.filter(file => !sourceFiles.includes(file));
  const unregistered = sourceFiles.filter(file => !registeredFiles.includes(file));
  if (missing.length || unregistered.length) {
    throw new Error(`${category.folder}: update the gallery catalogue before processing. Missing: ${missing.join(', ') || 'none'}. Unregistered: ${unregistered.join(', ') || 'none'}.`);
  }

  for (const [index, [, title, alt]] of category.items.entries()) {
    const id = `${category.id}-${String(index + 1).padStart(2, '0')}`;
    const source = path.join(sourceDirectory, registeredFiles[index]);
    const original = await sharp(source).metadata();
    const base = path.join(output, `${id}.webp`);
    const info = await sharp(source)
      .rotate()
      .resize({ width: 1600, height: 1600, fit: 'inside', withoutEnlargement: true })
      .webp({ quality: 85, effort: 5 })
      .toFile(base);

    // Responsive copies retain the entire original composition.
    for (const width of [480, 800]) {
      await sharp(base)
        .resize({ width, withoutEnlargement: true })
        .webp({ quality: 82, effort: 5 })
        .toFile(path.join(output, `${id}-${width}.webp`));
    }

    galleryItems.push({ id, category: category.id, title, alt, width: info.width, height: info.height, image: `/images/gallery/${id}.webp` });
    report.push({ id, source: path.relative(root, source), original: `${original.width}x${original.height}`, webp: `${info.width}x${info.height}`, bytes: info.size });
  }
}

const galleryCategories = categories.map(({id, label, description, coverId}) => ({id, label, description, coverId}));
for (const category of galleryCategories) {
  if (!galleryItems.some(item => item.id === category.coverId && item.category === category.id)) {
    throw new Error(`Invalid cover for ${category.id}`);
  }
}

const data = `// Generated by scripts/prepare-gallery.mjs. Edit its catalogue and rerun to update.\n\n` +
  `export type GalleryCategoryId = 'six-seater' | 'couple' | 'four-seater' | 'sofas';\n\n` +
  `export type GalleryCategory = {\n  id: GalleryCategoryId;\n  label: string;\n  description: string;\n  coverId: string;\n};\n\n` +
  `export type GalleryItem = {\n  id: string;\n  category: GalleryCategoryId;\n  title: string;\n  alt: string;\n  width: number;\n  height: number;\n  image: string;\n};\n\n` +
  `export const galleryCategories: GalleryCategory[] = ${JSON.stringify(galleryCategories, null, 2)};\n\n` +
  `export const galleryItems: GalleryItem[] = ${JSON.stringify(galleryItems, null, 2)};\n`;
await fs.writeFile(path.join(root, 'lib', 'gallery-data.ts'), data);

console.table(report);
console.log(`Prepared ${galleryItems.length} gallery images in ${galleryCategories.length} categories (${galleryItems.length * 3} WebP files).`);
