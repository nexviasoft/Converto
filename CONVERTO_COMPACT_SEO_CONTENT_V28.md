# Converto V28 — Compact SEO Content

Base: Converto V27 First SEO Growth Package / V26 Anti-Adblock Native integration.

## UI change

- Removed the large route-specific SEO content stack from conversion pages.
- Kept the existing compact “About this converter” card.
- Detailed route content now lives inside a native collapsed `details` panel opened with “Read more”.
- Added a second collapsed “Common questions” area for route-specific FAQ content.
- The default page remains focused on the converter and nearby conversion routes.

## SEO/content behavior

- Route-specific text remains accessible to users rather than being invisibly hidden.
- Content is present in the rendered markup inside semantic `details` elements.
- Page-specific title, H1, description, FAQ schema, internal links, sitemap changes, and V27 keyword targeting are preserved.
- MP4 to MP3, PNG to JPG, WEBP to PNG, PNG to ICO, and JPG to PNG keep their custom content.

## Preserved systems

- V26 anti-adblock/native ad integration.
- Format locking during conversion.
- Stale-result clearing after target changes.
- Clarity conversion events.
- Canonical, redirect, sitemap, ICO, and TIFF fixes.

## Checks

- 92 TypeScript/TSX files passed syntax transpilation checks.
- ZIP integrity checked after packaging.
