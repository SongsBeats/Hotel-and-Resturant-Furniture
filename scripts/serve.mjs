import http from 'node:http';
import { createReadStream } from 'node:fs';
import { stat } from 'node:fs/promises';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { createGzip } from 'node:zlib';

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '../out');
const port = Number(process.env.PORT || 3000);
const types = { '.html': 'text/html; charset=utf-8', '.css': 'text/css; charset=utf-8', '.js': 'text/javascript; charset=utf-8', '.json': 'application/json', '.txt': 'text/plain; charset=utf-8', '.xml': 'application/xml', '.webp': 'image/webp', '.svg': 'image/svg+xml', '.woff2': 'font/woff2', '.ico': 'image/x-icon' };

const server = http.createServer(async (request, response) => {
  if (!['GET', 'HEAD'].includes(request.method || '')) {
    response.writeHead(405, { Allow: 'GET, HEAD' });
    response.end();
    return;
  }
  try {
    const url = new URL(request.url || '/', 'http://localhost');
    const pathname = decodeURIComponent(url.pathname);
    let target = path.resolve(root, `.${pathname}`);
    if (target !== root && !target.startsWith(root + path.sep)) {
      response.writeHead(403); response.end('Forbidden'); return;
    }
    let status = 200;
    try {
      if ((await stat(target)).isDirectory()) target = path.join(target, 'index.html');
      await stat(target);
    } catch {
      status = 404;
      target = path.join(root, '404.html');
    }
    const info = await stat(target);
    const compressible = ['.html', '.css', '.js', '.json', '.txt', '.xml', '.svg'].includes(path.extname(target));
    const gzip = compressible && /\bgzip\b/.test(request.headers['accept-encoding'] || '');
    response.writeHead(status, {
      'Content-Type': types[path.extname(target)] || 'application/octet-stream',
      ...(gzip ? { 'Content-Encoding': 'gzip', Vary: 'Accept-Encoding' } : { 'Content-Length': info.size }),
      'X-Content-Type-Options': 'nosniff',
      'Referrer-Policy': 'strict-origin-when-cross-origin',
      'Cache-Control': target.includes(`${path.sep}_next${path.sep}`) ? 'public, max-age=31536000, immutable' : 'no-cache',
    });
    if (request.method === 'HEAD') response.end();
    else if (gzip) createReadStream(target).pipe(createGzip()).pipe(response);
    else createReadStream(target).pipe(response);
  } catch {
    response.writeHead(500); response.end('Build the website with npm run build before starting it.');
  }
});
server.listen(port, '0.0.0.0', () => console.log(`Furniture website: http://localhost:${port}`));
