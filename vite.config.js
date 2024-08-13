import react from '@vitejs/plugin-react';
import { resolve } from 'path';
import { defineConfig } from 'vite';
import commonjs from 'vite-plugin-commonjs';
import tailwindcss from 'tailwindcss';

const templates = resolve(__dirname, 'templates');

export default defineConfig({
  base: './',
  plugins: [react(), commonjs(), tailwindcss()],
  build: {
    minify: 'terser',
    terserOptions: {
      parse: {
        html5_comments: false,
      },
      format: {
        comments: false,
      },
    },
    outDir: resolve(__dirname, 'build'),
    emptyOutDir: false,
    rollupOptions: {
      input: {
        'wholesale-registration-form': resolve(templates, 'multi-step-form.html'),
      },
    },
  },
  esbuild: { legalComments: 'none' },
  css: {
    postcss: {
      plugins: [tailwindcss()],
    },
  },
  resolve: {
    alias: {
      '@': resolve(__dirname, 'src'),
    },
  },
});
