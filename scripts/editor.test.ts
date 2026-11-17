import { test } from 'node:test';
import assert from 'node:assert/strict';
import { mkdtemp, mkdir, readFile, rm, writeFile } from 'node:fs/promises';
import os from 'node:os';
import path from 'node:path';
import { createServer } from 'vite';
import { portfolioEditor } from './portfolio-editor.ts';
import { validatePortfolio } from '../src/data/validatePortfolio.ts';

const source = JSON.parse(await readFile(new URL('../src/data/portfolio.json', import.meta.url), 'utf8'));

test('rejects dangerous links, invalid references, and duplicate skill names', () => {
  validatePortfolio(source);
  const invalid = structuredClone(source);
  invalid.projects[0].url = 'javascript:alert(1)';
  assert.throws(() => validatePortfolio(invalid), /HTTPS/);
  const duplicate = structuredClone(source);
  duplicate.projects[0].skills.push(duplicate.projects[0].skills[0]);
  assert.throws(() => validatePortfolio(duplicate), /duplicate skills/);
  assert.throws(() => validatePortfolio({ ...source, featuredProjectIds: ['missing'] }), /existing projects/);
  assert.throws(() => validatePortfolio({ ...source, personalInfo: { ...source.personalInfo, secondaryEmail: 'example@example.com' } }), /unsupported fields/);
});

test('local editor protects writes, saves a backup, detects conflicts, and uploads images', async () => {
  const root = await mkdtemp(path.join(os.tmpdir(), 'portfolio-editor-test-'));
  await mkdir(path.join(root, 'src/data'), { recursive: true });
  const contentPath = path.join(root, 'src/data/portfolio.json');
  await writeFile(contentPath, JSON.stringify(source));
  const server = await createServer({ root, configFile: false, plugins: [portfolioEditor()], server: { host: '127.0.0.1', port: 0 } });
  try {
    await server.listen();
    const address = server.httpServer!.address();
    assert.ok(address && typeof address !== 'string');
    const base = `http://127.0.0.1:${address.port}`;
    const headers = { 'X-Portfolio-Editor': '1', Origin: base };
    const request = (url: string, init: RequestInit = {}) => fetch(base + '/__editor/' + url, { ...init, headers: { ...headers, ...init.headers } });
    assert.equal((await fetch(base + '/__editor/content')).status, 403);
    assert.equal((await request('content', { headers: { Origin: 'https://untrusted.example' } })).status, 403);
    const initial = await (await request('content')).json();
    const changed = structuredClone(source);
    changed.projects[0].description = 'Updated by the editor integration test.';
    const saved = await request('content', { method: 'PUT', headers: { 'Content-Type': 'application/json', 'If-Match': initial.revision }, body: JSON.stringify(changed) });
    assert.equal(saved.status, 200);
    const result = await saved.json();
    assert.notEqual(result.revision, initial.revision);
    assert.equal(JSON.parse(await readFile(contentPath, 'utf8')).projects[0].description, changed.projects[0].description);
    assert.deepEqual(JSON.parse(await readFile(contentPath + '.backup', 'utf8')), source);
    const conflict = await request('content', { method: 'PUT', headers: { 'Content-Type': 'application/json', 'If-Match': initial.revision }, body: JSON.stringify(source) });
    assert.equal(conflict.status, 409);
    const invalid = await request('content', { method: 'PUT', headers: { 'Content-Type': 'application/json', 'If-Match': result.revision }, body: '{"projects":[]}' });
    assert.equal(invalid.status, 400);
    assert.equal(JSON.parse(await readFile(contentPath, 'utf8')).projects[0].description, changed.projects[0].description);
    assert.equal((await request('images', { method: 'POST', headers: { 'Content-Type': 'image/png' }, body: 'not an image' })).status, 400);
    const png = Buffer.from('iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAQAAAC1HAwCAAAAC0lEQVR42mP8/x8AAwMCAO+aP1sAAAAASUVORK5CYII=', 'base64');
    const uploaded = await request('images', { method: 'POST', headers: { 'Content-Type': 'image/png' }, body: png });
    assert.equal(uploaded.status, 201);
    const image = await uploaded.json();
    assert.match(image.src, /^\/images\/uploads\/[a-f0-9-]+\.png$/);
    assert.deepEqual(await readFile(path.join(root, 'public', image.src)), png);
  } finally {
    await server.close();
    assert.ok(path.resolve(root).startsWith(path.resolve(os.tmpdir()) + path.sep + 'portfolio-editor-test-'));
    await rm(root, { recursive: true, force: true });
  }
});
