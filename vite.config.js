import { defineConfig } from 'vite';

export default defineConfig({
  base: './',
  plugins: [
    {
      name: 'classic-script',
      transformIndexHtml(html) {
        // itch.io's sandboxed iframe doesn't support ES module scripts;
        // strip type="module" and crossorigin so the IIFE loads as a classic script
        return html.replace(/<script type="module" crossorigin/g, '<script');
      },
    },
  ],
  build: {
    rollupOptions: {
      output: {
        format: 'iife',
        name: 'CaptainsWheel',
      },
    },
  },
});
