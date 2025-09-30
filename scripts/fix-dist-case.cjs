const fs = require('fs');
const path = require('path');

const dist = path.resolve(__dirname, '..', 'dist');
const assetsDir = path.join(dist, 'assets');

function walk(dir) {
  const results = [];
  if (!fs.existsSync(dir)) return results;
  for (const name of fs.readdirSync(dir)) {
    const full = path.join(dir, name);
    const stat = fs.statSync(full);
    if (stat.isDirectory()) {
      results.push(...walk(full));
    } else if (stat.isFile()) {
      results.push(full);
    }
  }
  return results;
}

function ensureParent(dir) {
  const p = path.dirname(dir);
  if (!fs.existsSync(p)) fs.mkdirSync(p, { recursive: true });
}

try {
  const files = walk(assetsDir);
  for (const file of files) {
    const rel = path.relative(dist, file).split(path.sep).join('/');
    const lowerRel = rel.toLowerCase();
    if (rel !== lowerRel) {
      const src = path.join(dist, rel);
      const dest = path.join(dist, lowerRel);
      if (fs.existsSync(dest)) {
        console.warn('Skipping rename due to existing target:', dest);
        continue;
      }
      ensureParent(dest);
      fs.renameSync(src, dest);
      console.log('Renamed:', rel, '->', lowerRel);
    }
  }

  // Update index.html references
  const indexPath = path.join(dist, 'index.html');
  if (fs.existsSync(indexPath)) {
    let html = fs.readFileSync(indexPath, 'utf8');
    html = html.replace(/\/assets\/[^")'\s>]+/g, (m) => m.toLowerCase());
    fs.writeFileSync(indexPath, html, 'utf8');
    console.log('Updated index.html asset references to lowercase.');
  }

  console.log('fix-dist-case: done.');
} catch (err) {
  console.error('fix-dist-case: error', err);
  process.exit(1);
}

