import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import { resolve } from 'path';

export default defineConfig({
  plugins: [react()],
  build: {
    rollupOptions: {
      input: {
        main: resolve(__dirname, 'index.html'),
        worker: resolve(__dirname, 'src/js/worker/index.ts')
      },
      output: {
        entryFileNames: (chunkInfo) => {
          return chunkInfo.name === 'worker' ? 'worker.js' : 'ui.js';
        }
      }
    },
    outDir: 'build/gen'
  },
  resolve: {
    alias: {
      '@': resolve(__dirname, 'src/js')
    },
    extensions: ['.ts', '.tsx', '.js', '.jsx', '.scss', '.css']
  },
  server: {
    port: 3000,
    open: true,
    host: true
  },
  optimizeDeps: {
    exclude: ['../vendor/babel-external-helpers'],
    entries: [
      'src/js/ui/index.tsx',
      'src/js/worker/index.ts'
    ]
  },
  worker: {
    format: 'es',
    plugins: () => []
  },
  css: {
    preprocessorOptions: {
      scss: {
        api: 'legacy',
        includePaths: ['src/css']
      }
    }
  },
  publicDir: 'public'
});
