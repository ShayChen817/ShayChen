# Website security and crawling

All HTML pages request `noindex`, `nofollow`, `noarchive`, `nosnippet` and
`noimageindex`. This intentionally opts the entire site out of search results.
`public/robots.txt` requests that all crawlers stay away. These are cooperative
directives: they cannot prevent a scraper from downloading public content.

The current GitHub Pages deployment is a project site at `/ShayChen/`.
Robots rules are read from the **origin root**,
`https://shaychen817.github.io/robots.txt`, not `/ShayChen/robots.txt`.
This repository cannot install a file at that origin root. The per-page robot
meta tags still apply. On a dedicated domain/root deployment, the bundled
robots file is served at the correct location automatically.

Astro generates a Content Security Policy with script hashes during the build.
Scripts, fonts, images and network requests are restricted to local resources
(images/fonts also allow data URLs). Inline style attributes remain enabled for
GSAP animations and theme variables. Email and phone numbers are omitted from
structured metadata, but remain public in the contact UI and downloadable CV.
The public GitHub repository also exposes source content and assets.

On Vercel, `vercel.json` additionally sets response headers to block framing,
disable MIME sniffing and unused browser capabilities, restrict referrers and
request no indexing of all resources, including the PDF. GitHub Pages does not
apply `vercel.json`, so those headers are not claimed for the Pages deployment.

## Enforcing bot protection

Request filtering needs an edge service; static HTML cannot enforce rate limits
or a human challenge. For a Vercel deployment, enable Bot Protection in the
project Firewall settings and configure a rate-limit rule for repeated document
and PDF requests. Start in logging mode, check normal visitors, then enforce
challenges/denials. These account-level settings are not enabled by this repo.
Do not rely on User-Agent matching or JavaScript obfuscation as access control.

If confidentiality is required, protect the deployment with authentication and
remove sensitive files from public hosting and the public repository. A public
CV cannot be made private with robots rules.

References: [Astro CSP configuration](https://docs.astro.build/en/reference/configuration-reference/#securitycsp),
[Vercel bot protection](https://vercel.com/docs/bot-management).

## Verification

Run `npm ci` and `npm run build`, then start `npx astro preview`.
In a second terminal run `node scripts/verify-security.mjs` (requires Microsoft
Edge for Playwright). Set `TEST_URL` when using a different port or base path.
The test checks both languages, redirect-page metadata, robots output, normal
animation loading and actual browser rejection of injected scripts/handlers.
Run `scripts/verify.mjs` for the broader desktop/mobile accessibility and
interaction checks; its default `TEST_URL` uses port 4322.
