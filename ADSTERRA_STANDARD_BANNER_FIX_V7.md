# Adsterra standard banner visibility fix (v7)

- Standard banners are no longer moved far outside the viewport while waiting for a creative.
- Each slot stays in its real page position so the ad network can evaluate and fill it normally.
- A lightweight loading surface is shown briefly, then an unfilled slot collapses after 12 seconds.
- Static banner pages now notify their React parent when an actual creative is inserted.
- Existing responsive rules remain unchanged: 728x90 on desktop, 320x50 on mobile, and 300x250 in the format content area.
