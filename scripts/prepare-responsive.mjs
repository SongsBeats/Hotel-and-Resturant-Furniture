import sharp from 'sharp';
import { readdir } from 'node:fs/promises';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const imageRoot = fileURLToPath(new URL('../public/images/', import.meta.url));

async function prepare(directory) {
  const entries = await readdir(directory, { withFileTypes: true });
  for (const entry of entries) {
    const source = path.join(directory, entry.name);
    if (entry.isDirectory()) { await prepare(source); continue; }
    if (!entry.name.endsWith('.webp') || /-(480|800)\.webp$/.test(entry.name)) continue;
    for (const width of [480, 800]) {
      await sharp(source)
        .resize({ width, withoutEnlargement: true })
        .webp({ quality: 78, effort: 5 })
        .toFile(source.replace(/\.webp$/, `-${width}.webp`));
    }
  }
}

await prepare(imageRoot);
console.log('Responsive furniture photos prepared from the original-size web assets.');
