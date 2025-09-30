const { spawnSync } = require('child_process');
const fs = require('fs');
const path = require('path');

function findProjectRoot(start = process.cwd(), maxUp = 10) {
    let dir = start;
    for (let i = 0; i <= maxUp; i++) {
        const indexPath = path.join(dir, 'index.html');
        const pkgPath = path.join(dir, 'package.json');
        if (fs.existsSync(indexPath) && fs.existsSync(pkgPath)) return dir;
        const parent = path.dirname(dir);
        if (parent === dir) break;
        dir = parent;
    }
    return null;
}

// Prefer INIT_CWD (npm sets this to the original working dir)
const candidates = [];
if (process.env.INIT_CWD) candidates.push(path.resolve(process.env.INIT_CWD));
if (process.env.npm_config_prefix) candidates.push(path.resolve(process.env.npm_config_prefix));
candidates.push(process.cwd());

let projectRoot = null;
for (const c of candidates) {
    projectRoot = findProjectRoot(c, 12);
    if (projectRoot) {
        console.log('postinstall: found project root starting from', c);
        break;
    }
}

if (!projectRoot) {
    console.log('postinstall: project root with index.html not found in candidates, skipping vite build.');
    process.exit(0);
}

console.log('postinstall: building from project root at', projectRoot);

// Use npm exec instead of npx
const res = spawnSync('npm', ['exec', 'vite', 'build'], {
    stdio: 'inherit',
    cwd: projectRoot,
    shell: true, // shell:true helps on Windows
});

if (res.error) {
    console.error('postinstall: error running vite build:', res.error);
    process.exit(1);
}

process.exit(res.status || 0);
