import fs from 'node:fs/promises';
import path from 'node:path';
import crypto from 'node:crypto';
import sharp from 'sharp';
import React from 'react';
import { renderToStaticMarkup } from 'react-dom/server';
import { Armchair } from '@phosphor-icons/react/dist/ssr/Armchair';

const root = process.cwd();
const output = path.join(root, 'business-profile');
await fs.mkdir(output, { recursive: true });
const groups = [
  ['Six Sittings', 'six-seater-sets'],
  ['Couple Sittings', 'couple-seating'],
  ['Four Sittin Set', 'four-seater-sets'],
  ['Resturant Sofas', 'restaurant-sofas'],
  ['.', 'featured-furniture'],
];
const photos = [];
const hashes = new Map();
for (const [folder, category] of groups) {
  const destination = path.join(output, 'photos', category);
  await fs.mkdir(destination, { recursive: true });
  const entries = (await fs.readdir(path.join(root, folder))).filter(name => /\.jpe?g$/i.test(name)).sort();
  for (const [index, name] of entries.entries()) {
    const source = path.join(root, folder, name);
    const bytes = await fs.readFile(source);
    const hash = crypto.createHash('sha256').update(bytes).digest('hex');
    const metadata = await sharp(bytes).metadata();
    const file = path.join(destination, `${category}-${String(index + 1).padStart(2, '0')}.jpg`);
    await fs.copyFile(source, file);
    const issues = [];
    if (bytes.length < 10000 || bytes.length > 5000000) issues.push('outside Google recommended file size');
    if (Math.min(metadata.width, metadata.height) < 250) issues.push('below minimum resolution');
    photos.push({ file, source, category, width: metadata.width, height: metadata.height, bytes: bytes.length, duplicateOf: hashes.get(hash) || null, issues });
    if (!hashes.has(hash)) hashes.set(hash, file);
  }
}

// Export the website's existing armchair brand symbol as a native vector logo.
// This is brand artwork, not a generated furniture or storefront photograph.
const chair = renderToStaticMarkup(React.createElement(Armchair, { size: 310, weight: 'light', color: '#f8faf5' })).replace('<svg ', '<svg x="357" y="216" ');
const logo = `<svg xmlns="http://www.w3.org/2000/svg" width="1024" height="1024" viewBox="0 0 1024 1024">
<rect width="1024" height="1024" fill="#214d39"/>
<rect x="110" y="110" width="804" height="804" rx="8" fill="none" stroke="#f8faf5" stroke-opacity=".32" stroke-width="2"/>
${chair}
<text x="512" y="626" fill="#f8faf5" font-family="Segoe UI,Arial,sans-serif" font-size="51" text-anchor="middle">Hotel and Restaurant</text>
<text x="512" y="710" fill="#f8faf5" font-family="Segoe UI,Arial,sans-serif" font-size="79" font-weight="600" text-anchor="middle">Furniture</text>
<path d="M460 764h104" stroke="#cfdbd1" stroke-width="2"/>
<text x="512" y="821" fill="#cfdbd1" font-family="Segoe UI,Arial,sans-serif" font-size="23" letter-spacing="6" text-anchor="middle">VIJAYAWADA</text>
</svg>`;
await fs.writeFile(path.join(output, 'logo.svg'), logo);
await sharp(Buffer.from(logo)).png().toFile(path.join(output, 'logo.png'));

// Keep the owner's real dining-set photograph unchanged for the cover.
const coverSource = path.join(root, 'WhatsApp Image 2026-09-17 at 9.45.38 AM.jpeg');
await fs.copyFile(coverSource, path.join(output, 'cover-photo.jpg'));
const manifest = {
  business: 'Hotel and Restaurant Furniture',
  prepared: '2026-09-17',
  website: 'https://hotel-and-resturant-furniture.vercel.app/',
  logo: path.join(output, 'logo.png'),
  cover: path.join(output, 'cover-photo.jpg'),
  coverSource,
  photos,
};
await fs.writeFile(path.join(output, 'upload-manifest.json'), JSON.stringify(manifest, null, 2));
console.log(JSON.stringify({ photos: photos.length, uniquePhotos: hashes.size, flagged: photos.filter(photo => photo.issues.length), logo: manifest.logo, cover: manifest.cover }, null, 2));
