// Simple static server for production build
const express = require('express');
const path = require('path');
const fs = require('fs');

const app = express();
const port = process.env.PORT; // Use port assigned by the environment
const distPath = path.resolve(__dirname, 'dist');

// Helper: resolve a requested path to an actual file on disk case-insensitively
function resolveCaseInsensitive(urlPath) {
    // Normalize and strip query
    const clean = urlPath.split('?')[0].split('#')[0];
    // Prevent path traversal
    const rel = clean.replace(/^\//, '');

    const parts = rel === '' ? [] : rel.split('/');
    let current = distPath;

    for (const part of parts) {
        if (!fs.existsSync(current) || !fs.statSync(current).isDirectory()) return null;
        const entries = fs.readdirSync(current);
        // Find entry that matches part case-insensitively
        const match = entries.find(e => e.toLowerCase() === part.toLowerCase());
        if (!match) return null;
        current = path.join(current, match);
    }

    // If target is a directory, try to serve index.html inside it
    try {
        const stat = fs.statSync(current);
        if (stat.isDirectory()) {
            const indexFile = path.join(current, 'index.html');
            if (fs.existsSync(indexFile)) return indexFile;
            return null;
        }
        if (stat.isFile()) return current;
    } catch (err) {
        return null;
    }
    return null;
}

// Log every request for debugging
app.use((req, res, next) => {
    console.log('Request:', req.url);
    next();
});

// Middleware: try to resolve files case-insensitively before falling back to express.static
app.use((req, res, next) => {
    try {
        // Fast path: if file exists exactly, let static handler serve it
        const exactPath = path.join(distPath, decodeURIComponent(req.path));
        if (fs.existsSync(exactPath) && fs.statSync(exactPath).isFile()) return next();

        // Try to resolve case-insensitively
        const resolved = resolveCaseInsensitive(req.path);
        if (resolved) {
            return res.sendFile(resolved);
        }
    } catch (err) {
        console.error('Case-insensitive lookup error:', err && err.message);
    }
    next();
});

// Serve static files
app.use(express.static(distPath));

// SPA fallback
app.get('*', (req, res) => {
    res.sendFile(path.join(distPath, 'index.html'));
});

if (port) {
    app.listen(port, () => {
        console.log(`Server listening on port ${port}`);
        console.log(`Serving files from: ${distPath}`);
    });
} else {
    console.error('Error: PORT environment variable not set. Server not started.');
    process.exit(1);
}
