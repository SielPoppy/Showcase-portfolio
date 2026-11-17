import { createHash, randomUUID } from 'node:crypto';
import { mkdir, readFile, rename, writeFile } from 'node:fs/promises';
import path from 'node:path';
import type { IncomingMessage, ServerResponse } from 'node:http';
import type { Plugin } from 'vite';
import { ContentError, validatePortfolio } from '../src/data/validatePortfolio.ts';

const revision = (value: string) => createHash('sha256').update(value).digest('hex');
const response = (res: ServerResponse, status: number, value: unknown) => {
  res.writeHead(status, { 'Content-Type': 'application/json', 'Cache-Control': 'no-store', 'X-Content-Type-Options': 'nosniff' });
  res.end(JSON.stringify(value));
};

async function body(req: IncomingMessage, limit: number): Promise<Buffer> {
  const chunks: Buffer[] = [];
  let size = 0;
  for await (const chunk of req) {
    size += chunk.length;
    if (size > limit) throw new ContentError(`Upload exceeds the ${Math.round(limit / 1024 / 1024)} MB limit.`);
    chunks.push(Buffer.from(chunk));
  }
  return Buffer.concat(chunks);
}

function imageExtension(bytes: Buffer, mime: string | undefined) {
  if (mime === 'image/png' && bytes.subarray(0, 8).equals(Buffer.from('89504e470d0a1a0a', 'hex'))) return 'png';
  if (mime === 'image/jpeg' && bytes[0] === 255 && bytes[1] === 216 && bytes[2] === 255) return 'jpg';
  if (mime === 'image/webp' && bytes.toString('ascii', 0, 4) === 'RIFF' && bytes.toString('ascii', 8, 12) === 'WEBP') return 'webp';
  throw new ContentError('Choose a PNG, JPEG, or WebP image.');
}

export function portfolioEditor(): Plugin {
  // Serialize writes so a second tab cannot overwrite a newer revision.
  let writing = false;
  return {
    name: 'local-portfolio-editor',
    apply: 'serve',
    configureServer(server) {
      const contentPath = path.join(server.config.root, 'src/data/portfolio.json');
      server.middlewares.use(async (req, res, next) => {
        const url = new URL(req.url ?? '/', 'http://localhost');
        if (!url.pathname.startsWith('/__editor/')) return next();
        const local = ['127.0.0.1', '::1', '::ffff:127.0.0.1'].includes(req.socket.remoteAddress ?? '');
        const expectedHost = `127.0.0.1:${req.socket.localPort}`;
        const host = req.headers.host;
        const validHost = host === expectedHost || host === `localhost:${req.socket.localPort}`;
        if (!local || !validHost || req.headers['x-portfolio-editor'] !== '1' || (req.headers.origin && req.headers.origin !== `http://${host}`)) {
          return response(res, 403, { error: 'The editor is available only from this computer and its own browser page.' });
        }
        try {
          if (url.pathname === '/__editor/content' && req.method === 'GET') {
            const raw = await readFile(contentPath, 'utf8');
            return response(res, 200, { content: JSON.parse(raw), revision: revision(raw) });
          }
          if (url.pathname === '/__editor/content' && req.method === 'PUT') {
            if (req.headers['content-type'] !== 'application/json') throw new ContentError('Send portfolio content as JSON.');
            const value: unknown = JSON.parse((await body(req, 2 * 1024 * 1024)).toString());
            validatePortfolio(value);
            if (writing) return response(res, 409, { error: 'Another save is in progress. Try again.' });
            writing = true;
            try {
              const current = await readFile(contentPath, 'utf8');
              if (req.headers['if-match'] !== revision(current)) return response(res, 409, { error: 'This portfolio changed in another tab or on disk. Export your draft, then reload before saving.' });
              const saved = JSON.stringify(value, null, 2) + '\n';
              await writeFile(contentPath + '.backup', current);
              await writeFile(contentPath + '.tmp', saved);
              await rename(contentPath + '.tmp', contentPath);
              return response(res, 200, { revision: revision(saved) });
            } finally { writing = false; }
          }
          if (url.pathname === '/__editor/images' && req.method === 'POST') {
            const bytes = await body(req, 10 * 1024 * 1024);
            const extension = imageExtension(bytes, req.headers['content-type']);
            const name = `${randomUUID()}.${extension}`;
            const directory = path.join(server.config.root, 'public/images/uploads');
            await mkdir(directory, { recursive: true });
            await writeFile(path.join(directory, name), bytes, { flag: 'wx' });
            return response(res, 201, { src: `/images/uploads/${name}` });
          }
          response(res, 404, { error: 'Editor endpoint not found.' });
        } catch (error) {
          const expected = error instanceof ContentError || error instanceof SyntaxError;
          response(res, expected ? 400 : 500, { error: expected ? (error as Error).message : 'Could not read or save the portfolio. Check that the project folder is writable.' });
        }
      });
    },
  };
}
