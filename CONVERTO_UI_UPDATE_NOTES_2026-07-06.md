# Converto UI update — 2026-07-06

This package keeps all existing features and AdSense/indexing safeguards intact.

## Visual and interaction changes

- Raised the home resource tooltip question icons by 2px for cleaner alignment.
- Converted the format preview card actions into real links.
  - `Guide` scrolls to the format summary section.
  - `Convert` opens the format's primary conversion route, falling back to `/converter` when needed.
- Added compact, meaning-specific icons to the Type, Best for, Popular route, and Recommended summary cards.
- Lightened the home page background with the same violet/blue depth used on format and compare pages.
- Lightened the converter page background and matched its ambient gradients to the other content pages.
- Updated the fallback converter shell to use the same background system.

## Validation

- Next.js production build completed successfully.
- 102 static pages generated.
- HTTP 200 verified for `/`, `/converter`, `/formats/flac`, `/convert/flac-to-mp3`, `/formats`, and `/compare`.
- No feature, route, Pro/payment/authentication, PDF, batch, Android, or waitlist code was removed.

## Format snapshot + converter mode polish

- Redesigned the four format-detail summary cards into a richer "Format snapshot" section with clearer hierarchy, distinct accents, compact icons, and improved responsive spacing.
- Removed the visible `NEW` badge from Batch mode without changing or disabling Batch conversion.
- Added accessible tab semantics (`tablist`, `tab`, `aria-selected`) to the Single / Batch / PDF Tools selector.
- Added a visible breadcrumb trail to format detail pages.
- Added `BreadcrumbList` structured data and strengthened the existing Article publisher/author fields on format detail pages.
- Preserved all converter, Batch, PDF, Pro, account, billing, Android, and waitlist code and feature flags.
- Production build completed with 102 generated pages.
- Sitemap QA: 94/94 submitted URLs returned HTTP 200, contained a title and H1, remained indexable, and exposed no visible beta/coming-soon/waitlist copy.
