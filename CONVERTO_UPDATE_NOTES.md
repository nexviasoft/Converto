# Converto ad-readiness update notes

## What changed

- Removed the global `body { zoom: 0.8; }` rule and replaced it with normal responsive browser behavior.
- Replaced the large embedded base64 logo SVG with a lightweight vector logo.
- Added `public/site.webmanifest` and connected manifest/icon metadata.
- Centralized AdSense configuration in `lib/adsConfig.ts`.
- Removed fake hard-coded ad slot IDs. Ad units now render only when real slot IDs are configured.
- Added env-based ad slots:
  - `NEXT_PUBLIC_ADSENSE_SLOT_LEFT_RAIL`
  - `NEXT_PUBLIC_ADSENSE_SLOT_RIGHT_RAIL`
  - `NEXT_PUBLIC_ADSENSE_SLOT_IN_CONTENT`
- Added `/cookies` legal page and linked it from the footer.
- Expanded `/privacy` and `/terms` pages with clearer file handling, ads, analytics, temporary processing, and responsibility sections.
- Updated sitemap entries for `/about`, `/contact`, `/pro`, and `/cookies`.
- Updated homepage hero, feature cards, and FAQ copy so the product feels more live and trustworthy.
- Updated README with deployment and AdSense setup instructions.

## Important next steps before applying to AdSense

1. Add real AdSense slot IDs in Vercel after creating ad units.
2. Add a proper CMP/consent setup before serving personalized ads in regions that require consent.
3. Deploy to Vercel and test:
   - `/`
   - `/converter`
   - `/formats`
   - `/compare`
   - `/privacy`
   - `/terms`
   - `/cookies`
   - `/contact`
4. Run `npm install` then `npm run build` locally or on Vercel.
