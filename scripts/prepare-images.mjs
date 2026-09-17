import sharp from 'sharp';
import { mkdir } from 'node:fs/promises';
import { fileURLToPath } from 'node:url';
import path from 'node:path';

const root = fileURLToPath(new URL('../', import.meta.url));
const output = path.join(root, 'public', 'images');

// These are resized encodings of the owner's photographs. Preserve the complete
// source framing; do not crop, retouch, invent, or replace furniture details.
const sources = [
  ['WhatsApp Image 2026-09-17 at 9.45.38 AM.jpeg', 'upholstered-dining-set'],
  ['WhatsApp Image 2026-09-17 at 9.45.37 AM.jpeg', 'classic-metal-dining-set'],
  ['WhatsApp Image 2026-09-17 at 9.45.40 AM.jpeg', 'red-chair-dining-set'],
  ['WhatsApp Image 2026-09-17 at 9.45.39 AM (1).jpeg', 'wood-finish-dining-set'],
  ['WhatsApp Image 2026-09-17 at 9.45.40 AM (1).jpeg', 'cafe-bench-set'],
  ['WhatsApp Image 2026-09-17 at 9.45.40 AM (2).jpeg', 'seating-collection'],
  ['WhatsApp Image 2026-09-17 at 9.45.38 AM (1).jpeg', 'white-round-dining-set'],
  ['WhatsApp Image 2026-09-17 at 9.45.38 AM (2).jpeg', 'cafe-interior'],
  ['WhatsApp Image 2026-09-17 at 9.45.39 AM.jpeg', 'restaurant-interior'],
];

await mkdir(output, { recursive: true });
for (const [source, slug] of sources) {
  const input = path.join(root, source);
  const metadata = await sharp(input).metadata();
  for (const width of [480, 800, 1280]) {
    const suffix = width === 1280 ? '' : `-${width}`;
    const result = await sharp(input)
      .rotate()
      .resize({ width, withoutEnlargement: true })
      .webp({ quality: 78, effort: 6 })
      .toFile(path.join(output, `${slug}${suffix}.webp`));
    console.log(`${slug}${suffix}.webp: ${result.width} x ${result.height}, ${Math.round(result.size / 1024)} KB`);
  }
  console.log(`Source ${slug}: ${metadata.width} x ${metadata.height}`);
}
