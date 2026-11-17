/// <reference types="vite/client" />
/// <reference types="node" />

import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import * as path from 'node:path';
import { portfolioEditor } from './scripts/portfolio-editor.ts';


// https://vitejs.dev/config/
export default defineConfig(({ mode }) => ({
    base: '/',
    plugins: [react(), ...(mode === 'editor' ? [portfolioEditor()] : [])],
    resolve: {
        extensions: ['.js', '.jsx', '.ts', '.tsx', '.json'],
        alias: {
            '#': path.resolve(import.meta.dirname, './src'),
            '@': path.resolve(import.meta.dirname, './src'),
        },
    },
    build: {
        chunkSizeWarningLimit: 1000, // in KB
        reportCompressedSize: false,
        target: 'esnext',
        outDir: 'dist',
        rolldownOptions: {
            output: {
                assetFileNames: `assets/[ext]/[name]-[hash][extname]`,
                chunkFileNames: `assets/js/[name]-[hash].js`,
                entryFileNames: `assets/js/[name]-[hash].js`,
            },
        },
    },
    server: {
        host: mode === 'editor' ? '127.0.0.1' : '0.0.0.0',
        port: process.env.PORT ? parseInt(process.env.PORT, 10) : 3000,
        open: mode === 'editor' ? '/editor.html' : true,
    },
}));
