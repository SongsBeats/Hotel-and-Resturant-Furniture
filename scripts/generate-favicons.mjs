import fs from 'node:fs/promises';
import path from 'node:path';
import sharp from 'sharp';

const root = process.cwd();
const publicDir = path.join(root, 'public');
const appDir = path.join(root, 'app');

// Professional brand favicon SVG with armchair icon
const brandSvg = `<svg xmlns="http://www.w3.org/2000/svg" width="512" height="512" viewBox="0 0 512 512">
  <rect width="512" height="512" rx="100" fill="#214d39"/>
  <svg x="80" y="80" width="352" height="352" viewBox="0 0 256 256" fill="#f8faf5">
    <path d="M214,90.48V72a38,38,0,0,0-38-38H80A38,38,0,0,0,42,72V90.48a38,38,0,0,0,0,75.05V200a14,14,0,0,0,14,14H200a14,14,0,0,0,14-14V165.53a38,38,0,0,0,0-75ZM80,46h96a26,26,0,0,1,26,26V90.48A38.05,38.05,0,0,0,170,128v2H86v-2A38.05,38.05,0,0,0,54,90.48V72A26,26,0,0,1,80,46ZM208.35,154H208a6,6,0,0,0-6,6v40a2,2,0,0,1-2,2H56a2,2,0,0,1-2-2V160h0a6,6,0,0,0-6-6h-.35A26,26,0,1,1,74,128v40a6,6,0,0,0,12,0V142h84v26a6,6,0,0,0,12,0V128a26,26,0,1,1,26.35,26Z"/>
  </svg>
</svg>`;

// 1. Write app/icon.svg (Next.js automatically uses this)
await fs.writeFile(path.join(appDir, 'icon.svg'), brandSvg, 'utf-8');
console.log('✓ Wrote app/icon.svg');

// 2. Write public/favicon.svg
await fs.writeFile(path.join(publicDir, 'favicon.svg'), brandSvg, 'utf-8');
console.log('✓ Wrote public/favicon.svg');

// 3. Generate PNGs at required sizes
const svgBuffer = Buffer.from(brandSvg);

const pngTargets = [
  { file: 'favicon-96x96.png', size: 96 },
  { file: 'apple-touch-icon.png', size: 180 },
  { file: 'web-app-manifest-192x192.png', size: 192 },
  { file: 'web-app-manifest-512x512.png', size: 512 },
];

for (const target of pngTargets) {
  const destination = path.join(publicDir, target.file);
  await sharp(svgBuffer).resize(target.size, target.size).png().toFile(destination);
  console.log(`✓ Generated public/${target.file} (${target.size}x${target.size})`);
}

// 4. Generate multi-resolution public/favicon.ico (16, 32, 48)
const icoSizes = [16, 32, 48];
const icoPngBuffers = await Promise.all(
  icoSizes.map((size) => sharp(svgBuffer).resize(size, size).png().toBuffer())
);

const header = Buffer.alloc(6);
header.writeUInt16LE(0, 0); // reserved
header.writeUInt16LE(1, 2); // icon type: 1 = ICO
header.writeUInt16LE(icoSizes.length, 4); // count

let offset = 6 + icoSizes.length * 16;
const entries = [];
for (let i = 0; i < icoSizes.length; i++) {
  const size = icoSizes[i];
  const buf = icoPngBuffers[i];
  const entry = Buffer.alloc(16);
  entry.writeUInt8(size, 0); // width
  entry.writeUInt8(size, 1); // height
  entry.writeUInt8(0, 2);    // color count (0 = 256 or more)
  entry.writeUInt8(0, 3);    // reserved
  entry.writeUInt16LE(1, 4); // color planes
  entry.writeUInt16LE(32, 6);// bits per pixel
  entry.writeUInt32LE(buf.length, 8); // image size in bytes
  entry.writeUInt32LE(offset, 12);    // file offset
  entries.push(entry);
  offset += buf.length;
}

const icoBuffer = Buffer.concat([header, ...entries, ...icoPngBuffers]);
await fs.writeFile(path.join(publicDir, 'favicon.ico'), icoBuffer);
console.log('✓ Generated public/favicon.ico (16x16, 32x32, 48x48)');

// 5. Write site.webmanifest
const manifest = {
  name: 'Andhra Hotel and Restaurant Furniture',
  short_name: 'Andhra Furniture',
  icons: [
    {
      src: '/web-app-manifest-192x192.png',
      sizes: '192x192',
      type: 'image/png',
      purpose: 'maskable any',
    },
    {
      src: '/web-app-manifest-512x512.png',
      sizes: '512x512',
      type: 'image/png',
      purpose: 'maskable any',
    },
  ],
  theme_color: '#214d39',
  background_color: '#fafbf8',
  display: 'standalone',
};

await fs.writeFile(path.join(publicDir, 'site.webmanifest'), JSON.stringify(manifest, null, 2), 'utf-8');
console.log('✓ Wrote public/site.webmanifest');
