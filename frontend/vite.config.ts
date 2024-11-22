import path from 'path';
import { defineConfig } from 'vite';
import viteReact from '@vitejs/plugin-react';
import { TanStackRouterVite } from '@tanstack/router-plugin/vite';
// import legacy from '@vitejs/plugin-legacy';
//     "@vitejs/plugin-legacy": "^5.4.3",

// https://vite.dev/config/
export default defineConfig({
  plugins: [
    // legacy(),
    TanStackRouterVite({
      routesDirectory: path.resolve(__dirname, 'src/app/routes'),
      generatedRouteTree: path.resolve(__dirname, 'src/app/lib/route-tree.gen.ts'),
    }),
    viteReact(),
  ],
  resolve: {
    alias: {
      '@': path.resolve(__dirname, 'src/'),
    },
    extensions: ['.ts', '.tsx', '.json'],
  },
  optimizeDeps: {
    exclude: ['xtend', 'ms'],
  },
});
