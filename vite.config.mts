/// <reference types="vite/client" />
/// <reference types="node" />

import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react-swc';
import type {
    Plugin,
    OutputBundle,
    OutputAsset,
    OutputChunk,
    NormalizedOutputOptions,
} from 'rollup';
import * as path from 'path';

// Plugin to lowercase emitted file names (run during bundle generation)
function lowercaseOutputPlugin(): Plugin {
    return {
        name: 'lowercase-output',
        generateBundle(_: NormalizedOutputOptions, bundle: OutputBundle) {
            const renames: Array<{ originalName: string; lowerName: string }> = [];
            for (const originalName of Object.keys(bundle)) {
                const lowerName = originalName.toLowerCase();
                if (originalName === lowerName) continue;
                const item = bundle[originalName] as OutputAsset | OutputChunk | undefined;
                if (!item) continue;
                // record rename mapping for later replacement in HTML
                renames.push({ originalName, lowerName });
                // update file name on the chunk/asset
                item.fileName = lowerName;
                // set new key and delete old one
                bundle[lowerName] = item;
                delete bundle[originalName];
            }

            if (renames.length > 0) {
                // update any index.html asset content to reference the lowercased filenames
                for (const [, asset] of Object.entries(bundle)) {
                    if (
                        asset.type === 'asset' &&
                        asset.fileName.toLowerCase().endsWith('index.html')
                    ) {
                        let src = String((asset as OutputAsset).source ?? '');
                        for (const { originalName, lowerName } of renames) {
                            // replace exact occurrences of the original filename with the lowercased one
                            const escaped = originalName.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
                            const re = new RegExp(escaped, 'g');
                            src = src.replace(re, lowerName);
                        }
                        (asset as OutputAsset).source = src;
                    }
                }
            }
        }
    };
}

// https://vitejs.dev/config/
// Allow configuring the base path (useful when deploying under a subfolder like /about-me/)
// Set BASE env var at build time: BASE=/about-me/
export default defineConfig(({ mode }) => ({
    base: process.env.BASE ?? '/',
    plugins: [react(), lowercaseOutputPlugin()],
    resolve: {
        extensions: ['.js', '.jsx', '.ts', '.tsx', '.json'],
        alias: {
            '#': path.resolve(__dirname, './src'),
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
}));
