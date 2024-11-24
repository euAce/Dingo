import path from 'node:path';
import { defineConfig } from 'vite';
import viteReact from '@vitejs/plugin-react';
import { TanStackRouterVite } from '@tanstack/router-plugin/vite';

// https://vite.dev/config/
export default defineConfig({
  plugins: [
    TanStackRouterVite({
      routesDirectory: path.resolve(__dirname, 'src/app/routes'),
      generatedRouteTree: path.resolve(__dirname, 'src/app/lib/route-tree.gen.ts'),
    }),
    viteReact(),
  ],
  resolve: {
    alias: {
      '@': path.resolve(__dirname, 'src/'),
      'use-sync-external-store/shim': path.resolve(__dirname, './node_modules/use-sync-external-store'),
    },
    extensions: ['.ts', '.tsx', '.json'],
  },
  optimizeDeps: {
    exclude: ['xtend', 'ms'],
    include: ['use-sync-external-store'],
  },
  build: {
    commonjsOptions: {
      ignore: ['ms'],
      transformMixedEsModules: true,
    },
  },
  server: {
    host: '127.0.0.1',
  },
});
