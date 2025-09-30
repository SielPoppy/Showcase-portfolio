/// <reference types="vite/client" />

import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react-swc';
import * as path from 'path';

// Plugin to lowercase emitted file names (run during bundle generation)
function lowercaseOutputPlugin() {
    return {
        name: 'lowercase-output',
        generateBundle(_, bundle) {
            const renames = [];
            for (const originalName of Object.keys(bundle)) {
                const lowerName = originalName.toLowerCase();
                if (originalName === lowerName) continue;
                const chunk = bundle[originalName];
                // record rename mapping for later replacement in HTML
                renames.push({ originalName, lowerName });
                chunk.fileName = lowerName;
                // set new key and delete old one
                bundle[lowerName] = chunk;
                delete bundle[originalName];
            }

            if (renames.length > 0) {
                // update any index.html asset content to reference the lowercased filenames
                for (const [key, asset] of Object.entries(bundle)) {
                    if (asset && asset.type === 'asset' && asset.fileName && asset.fileName.toLowerCase().endsWith('index.html')) {
                        let src = String(asset.source);
                        for (const { originalName, lowerName } of renames) {
                            // replace exact occurrences of the original filename with the lowercased one
                            // also handle URL-escaped variants and simple cases
                            const escaped = originalName.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
                            const re = new RegExp(escaped, 'g');
                            src = src.replace(re, lowerName);
                        }
                        asset.source = src;
                    }
                }
            }
        }
    };
}

// https://vitejs.dev/config/
export default defineConfig({
    plugins: [react(), lowercaseOutputPlugin()],
    resolve: {
        extensions: ['.js', '.jsx', '.ts', '.tsx', '.json'],
        alias: {
            'vaul@1.1.2': 'vaul',
            'sonner@2.0.3': 'sonner',
            'recharts@2.15.2': 'recharts',
            'react-resizable-panels@2.1.7': 'react-resizable-panels',
            'react-hook-form@7.55.0': 'react-hook-form',
            'react-day-picker@8.10.1': 'react-day-picker',
            'next-themes@0.4.6': 'next-themes',
            'lucide-react@0.487.0': 'lucide-react',
            'input-otp@1.4.2': 'input-otp',
            'embla-carousel-react@8.6.0': 'embla-carousel-react',
            'cmdk@1.1.1': 'cmdk',
            'class-variance-authority@0.7.1': 'class-variance-authority',
            '@radix-ui/react-tooltip@1.1.8': '@radix-ui/react-tooltip',
            '@radix-ui/react-toggle@1.1.2': '@radix-ui/react-toggle',
            '@radix-ui/react-toggle-group@1.1.2': '@radix-ui/react-toggle-group',
            '@radix-ui/react-tabs@1.1.3': '@radix-ui/react-tabs',
            '@radix-ui/react-switch@1.1.3': '@radix-ui/react-switch',
            '@radix-ui/react-slot@1.1.2': '@radix-ui/react-slot',
            '@radix-ui/react-slider@1.2.3': '@radix-ui/react-slider',
            '@radix-ui/react-separator@1.1.2': '@radix-ui/react-separator',
            '@radix-ui/react-select@2.1.6': '@radix-ui/react-select',
            '@radix-ui/react-scroll-area@1.2.3': '@radix-ui/react-scroll-area',
            '@radix-ui/react-radio-group@1.2.3': '@radix-ui/react-radio-group',
            '@radix-ui/react-progress@1.1.2': '@radix-ui/react-progress',
            '@radix-ui/react-popover@1.1.6': '@radix-ui/react-popover',
            '@radix-ui/react-navigation-menu@1.2.5': '@radix-ui/react-navigation-menu',
            '@radix-ui/react-menubar@1.1.6': '@radix-ui/react-menubar',
            '@radix-ui/react-label@2.1.2': '@radix-ui/react-label',
            '@radix-ui/react-hover-card@1.1.6': '@radix-ui/react-hover-card',
            '@radix-ui/react-dropdown-menu@2.1.6': '@radix-ui/react-dropdown-menu',
            '@radix-ui/react-dialog@1.1.6': '@radix-ui/react-dialog',
            '@radix-ui/react-context-menu@2.2.6': '@radix-ui/react-context-menu',
            '@radix-ui/react-collapsible@1.1.3': '@radix-ui/react-collapsible',
            '@radix-ui/react-checkbox@1.1.4': '@radix-ui/react-checkbox',
            '@radix-ui/react-avatar@1.1.3': '@radix-ui/react-avatar',
            '@radix-ui/react-aspect-ratio@1.1.2': '@radix-ui/react-aspect-ratio',
            '@radix-ui/react-alert-dialog@1.1.6': '@radix-ui/react-alert-dialog',
            '@radix-ui/react-accordion@1.2.3': '@radix-ui/react-accordion',
            '@': path.resolve(__dirname, './src'),
        },
    },
    build: {
        // Set a higher timeout for the build process
        chunkSizeWarningLimit: 1000, // in KB
        reportCompressedSize: false,
        target: 'esnext',
        outDir: 'dist',
        rollupOptions: {
            output: {
                // keep templates but plugin will lowercase final names
                assetFileNames: `assets/[ext]/[name]-[hash][extname]`,
                chunkFileNames: `assets/js/[name]-[hash].js`,
                entryFileNames: `assets/js/[name]-[hash].js`,
            },
        },
    },
    server: {
        // Ensure the server is accessible on the network
        host: '0.0.0.0',
        port: process.env.PORT ? parseInt(process.env.PORT, 10) : 3000,
        open: true,
    },
});
