import { defineConfig } from 'vitest/config';
import react from '@vitejs/plugin-react';

const publicSiteUrl = () => ({
  name: 'public-site-url',
  transform(code: string, id: string) {
    if (id.indexOf('/src/App.tsx') < 0 && id.indexOf('\\src\\App.tsx') < 0) return null;
    return code.split('http://localhost:5173/').join('${window.location.origin}/');
  },
});

export default defineConfig({
  base: './',
  plugins: [publicSiteUrl(), react()],
  build: { outDir: 'dist', emptyOutDir: true },
  test: { environment: 'node' },
});
