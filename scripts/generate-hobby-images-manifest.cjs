// This script generates a manifest of all images in public/images/personal/hobbies for SSR and client use
// Run with: node scripts/generate-hobby-images-manifest.cjs

const fs = require('fs');
const path = require('path');

const HOBBIES_DIR = path.join(__dirname, '../public/images/personal/hobbies');
const OUTPUT = path.join(__dirname, '../src/data/hobbyImagesManifest.json');

function walk(dir) {
  let results = [];
  const list = fs.readdirSync(dir);
  list.forEach((file) => {
    const filePath = path.join(dir, file);
    const stat = fs.statSync(filePath);
    if (stat && stat.isDirectory()) {
      results = results.concat(walk(filePath));
    } else if (/(png|jpe?g|webp|svg)$/i.test(file)) {
      results.push(filePath);
    }
  });
  return results;
}

function toUrl(filePath) {
  // Convert absolute path to /images/personal/hobbies/... URL
  const rel = path.relative(path.join(__dirname, '../public'), filePath).replace(/\\/g, '/');
  return '/' + rel;
}

const allImages = walk(HOBBIES_DIR).map(toUrl);

// Group by hobby slug (folder name under hobbies)
const manifest = {};
allImages.forEach((url) => {
  const parts = url.split('/');
  const hobbyIdx = parts.findIndex((p) => p === 'hobbies');
  const hobbySlug = hobbyIdx !== -1 ? parts[hobbyIdx + 1] : undefined;
  if (!hobbySlug) return;
  (manifest[hobbySlug] ||= []).push({ url, title: parts[parts.length - 1].replace(/\.[a-zA-Z0-9]+$/, '').replace(/[-_]+/g, ' ').replace(/\b\w/g, (m) => m.toUpperCase()) });
});

fs.writeFileSync(OUTPUT, JSON.stringify(manifest, null, 2));
console.log('Hobby images manifest generated:', OUTPUT);