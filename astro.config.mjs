import { defineConfig } from 'astro/config';

export default defineConfig({
  output: 'static',
  outDir: process.env.BUILD_DIR || './dist',
  trailingSlash: 'always',
  site: process.env.SITE_URL || 'http://localhost:4321',
  base: process.env.BASE_PATH || '/',
  i18n: { defaultLocale: 'en', locales: ['en', 'zh'], routing: { prefixDefaultLocale: true } },
  markdown: { syntaxHighlight: false },
  security: {
    csp: {
      directives: [
        "default-src 'self'",
        "base-uri 'none'",
        "object-src 'none'",
        "frame-src 'none'",
        "form-action 'none'",
        "connect-src 'self'",
        "img-src 'self' data:",
        "font-src 'self' data:"
      ],
      // GSAP and the theme set style attributes at runtime. Script execution
      // still requires same-origin files or Astro's build-generated hashes.
      styleDirective: {
        resources: [
          { resource: "'self'", kind: 'element' },
          { resource: "'unsafe-inline'", kind: 'attribute' }
        ]
      }
    }
  },
  vite: { build: { assetsInlineLimit: 2048 } }
});
