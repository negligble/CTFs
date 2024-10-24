import { defineConfig } from 'vite';
import path from 'path';
import { NodeGlobalsPolyfillPlugin } from '@esbuild-plugins/node-globals-polyfill';
import { NodeModulesPolyfillPlugin } from '@esbuild-plugins/node-modules-polyfill';

export default defineConfig({
  root: path.resolve(__dirname),
  base: '/static/dist',
  publicDir: false,
  build: {
    outDir: '/app/backend/static/dist',
    emptyOutDir: true,
    manifest: true,
    cssCodeSplit: true,
    rollupOptions: {
      input: path.resolve(__dirname, 'src/main.js')
    },
    minify: 'terser',
    terserOptions: {
      compress: {
        drop_console: true,
        drop_debugger: true,
        ecma: 2020,
        module: true,
        toplevel: true,
      },
      format: {
        comments: false,
      }
    },
  },
  resolve: {
    alias: {
      '@': path.resolve(__dirname, 'src'),
    },
    fallback: {
      buffer: 'buffer',
      fs: false,
      path: 'path-browserify',
      process: 'process/browser',
    },
  },
  optimizeDeps: {
    esbuildOptions: {
      define: {
        global: 'globalThis',
      },
      plugins: [
        NodeGlobalsPolyfillPlugin({
          process: true,
          buffer: true,
        }),
        NodeModulesPolyfillPlugin(),
      ],
    },
  },
});