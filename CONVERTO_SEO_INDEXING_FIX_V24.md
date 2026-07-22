# Converto SEO & Indexing Fix V24

Date: 2026-07-22

## Search Console drilldown reviewed

The uploaded reports contained these groups:

- 31 redirect errors, mostly old apex-domain URLs such as `https://converto.tools/...`
- 41 crawled but not currently indexed URLs
- 5 not-found URLs
- 4 redirected URLs
- 1 duplicate where Google selected a different canonical URL

The 5 not-found examples (`/en1`, `/bg2`, `/id1`, `/id2`, and an old `/listing?...` URL) are not real product pages. They should remain 404 instead of being redirected to the homepage.

Many of the crawled-but-not-indexed conversion URLs are old programmatic routes with weak or nonsensical intent. They remain outside the sitemap and carry `noindex` unless they have hand-written route content.

## Code changes

### One canonical origin

- Added `lib/siteUrl.ts`
- Metadata, structured data, robots and sitemap now use only:
  - `https://www.converto.tools`
- Removed the risk of a Vercel environment variable publishing apex URLs into metadata or the sitemap
- Strengthened production redirects so HTTP and apex requests go to HTTPS + `www` in one permanent 308 response
- Middleware now also covers public files such as `ads.txt`, `robots.txt`, `sitemap.xml` and favicons

### Canonical and title cleanup

- Removed the homepage canonical from the root layout so it cannot be inherited by child routes
- Added a self-referencing canonical to `/converter`
- Removed page-level `| Converto` suffixes where the root metadata template already adds the brand
- This prevents titles such as `Convert Files Online Free | Converto | Converto`
- Kept the homepage canonical on the homepage itself

### New indexable SEO pages

Added hand-written content and sitemap/index eligibility for:

- `/convert/png-to-ico`
- `/convert/tiff-to-jpg`

Each page now includes:

- A route-specific title and intro
- Input/output format explanations
- Best-use and avoid-use guidance
- Step-by-step conversion instructions
- Quality and file-size notes
- Practical tips
- Related conversion links
- Six route-specific FAQ entries

Both routes were added to internal popular-conversion links on the homepage, converter workspace and formats hub.

### Conversion measurement

Added Microsoft Clarity events for the standard converter flow:

- `file_selected`
- `conversion_file_rejected`
- `conversion_started`
- `conversion_success`
- `conversion_failed`
- `download_clicked`

Only non-personal context is attached as Clarity tags: route, input format, output format, file-size value and friendly error reason. Filenames and file contents are not sent.

## Deployment checklist

1. Deploy this version to production.
2. Confirm these URLs return 200 and self-canonicalize:
   - `/`
   - `/converter`
   - `/convert/png-to-ico`
   - `/convert/tiff-to-jpg`
   - `/convert/png-to-jpg`
   - `/convert/mov-to-mp4`
3. Confirm an apex URL such as `https://converto.tools/convert/png-to-jpg` redirects once to the matching `https://www.converto.tools/...` URL.
4. Open `https://www.converto.tools/sitemap.xml` and confirm all listed URLs use `www`.
5. Submit the sitemap once in Search Console. Do not repeatedly remove and resubmit it.
6. Use URL Inspection and request indexing for the homepage, converter hub, PNG-to-ICO, TIFF-to-JPG and the strongest existing conversion pages.
7. Start validation for the redirect-error and duplicate-canonical groups after production deployment.
8. Do not request indexing for obsolete/noindex programmatic conversion routes.

## Verification performed in this package

- TypeScript/TSX syntax transpilation passed for all 92 source files.
- All 17 indexable converter slugs have matching hand-written content.
- No production source file contains the apex canonical origin `https://converto.tools`.
- No production source file relies on `NEXT_PUBLIC_SITE_URL` for SEO URLs.

A full `next build` was attempted, but dependency installation could not be completed in the sandbox because the package registry returned HTTP 503. Run `npm ci && npm run build` in the normal development or Vercel environment before production deployment.
