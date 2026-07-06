# Converto vNext visual/product refresh

## Main updates
- Rebuilt the lower homepage resource area with premium cards for Format Guides, Compare Formats, Popular Conversion Pairs, and About Converto.
- Added new 3D purple visual assets under `public/images/vnext/`.
- Reworked the Pro `What Pro adds` section with richer cards, feature icons, stats, and new workflow visuals.
- Improved the MP4 format detail hero visual with a richer format-card illustration.
- Repositioned and enlarged the in-depth guide visual so it sits centered on the right and does not sit under the text.
- Added quick facts cards to format detail pages.
- Kept compact layout density without `zoom`, so buttons and dropdowns remain stable.
- Strengthened the footer into grouped Product / Resources / Legal sections.

## Verification
- `npx tsc --noEmit` passes.
- `npm run build` compiles successfully and starts static page generation. The local container timed out during the very large static generation phase because the project produces many conversion pages, not because of a TypeScript compile error.

## Notes
- `node_modules`, `.next`, `.vercel`, `bin`, `obj`, `.vs`, and other generated folders are intentionally not included.
- After extracting, run `npm install` before `npm run dev` or `npm run build`.
