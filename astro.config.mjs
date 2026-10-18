import { defineConfig } from 'astro/config';

export default defineConfig({
  output: 'static',
  outDir: process.env.BUILD_DIR || './dist',
  trailingSlash: 'always',
  site: process.env.SITE_URL || 'http://localhost:4321',
  base: process.env.BASE_PATH || '/',
  i18n: { defaultLocale: 'en', locales: ['en', 'zh'], routing: { prefixDefaultLocale: true } },
  vite: { build: { assetsInlineLimit: 2048 } }
});
