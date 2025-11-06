#!/usr/bin/env node
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

// derive __dirname in ESM
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Configuration
const IMAGES_ROOT = path.resolve(__dirname, '..', 'public', 'images', 'personal', 'hobbies');
const OUT_DIR = path.resolve(__dirname, '..', 'public', 'data');
const OUT_FILE = path.join(OUT_DIR, 'hobbyImagesManifest.json');

function titleFromFilename(filename) {
  try {
    const name = filename.replace(/\.[a-z0-9]+$/i, '');
    // Replace dashes/underscores with spaces, collapse multiple separators
    const cleaned = name.replace(/[-_]+/g, ' ').trim();
    // Uppercase first letter of each word
    return cleaned.replace(/\b\w/g, (m) => m.toUpperCase());
  } catch (err) {
    return filename;
  }
}

function isImageFile(name) {
  return /\.(webp|png|jpe?g|gif|svg)$/i.test(name);
}

function scan() {
  const manifest = {};

  if (!fs.existsSync(IMAGES_ROOT)) {
    console.error('Images root not found:', IMAGES_ROOT);
    return manifest;
  }

  const hobbyDirs = fs.readdirSync(IMAGES_ROOT, { withFileTypes: true }).filter((d) => d.isDirectory()).map((d) => d.name);

  hobbyDirs.forEach((dir) => {
    const dirPath = path.join(IMAGES_ROOT, dir);
    const files = fs.readdirSync(dirPath, { withFileTypes: true }).filter((f) => f.isFile() && isImageFile(f.name)).map((f) => f.name);
    if (files.length === 0) return;
    // keep listing order but map to manifest entry
    manifest[dir] = files.map((file) => ({
      url: `/images/personal/hobbies/${dir}/${file}`,
      title: titleFromFilename(file),
    }));
  });

  return manifest;
}

function ensureOutDir() {
  if (!fs.existsSync(OUT_DIR)) fs.mkdirSync(OUT_DIR, { recursive: true });
}

function write(manifest) {
  ensureOutDir();
  const sorted = Object.keys(manifest).sort().reduce((acc, key) => {
    acc[key] = manifest[key];
    return acc;
  }, {});
  fs.writeFileSync(OUT_FILE, JSON.stringify(sorted, null, 2) + '\n', 'utf-8');
  console.log('[generate-hobby-manifest] Wrote', OUT_FILE);
}

function main() {
  try {
    const manifest = scan();
    write(manifest);
  } catch (err) {
    console.error('Failed to generate hobby images manifest:', err);
    process.exitCode = 1;
  }
}

if (process.argv[1] && process.argv[1].endsWith('generate-hobby-manifest.js')) {
  main();
}
