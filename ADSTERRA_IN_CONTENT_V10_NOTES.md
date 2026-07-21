# Adsterra in-content placement update (v10)

- Built from the Turkey geo-block v9 package supplied by the user.
- The reliable Native Banner is now the primary Adsterra unit.
- Non-filling 728x90, 320x50 and 300x250 units are disabled with `ADSTERRA_STANDARD_BANNERS_ENABLED = false`.
- Footer-only advertising was removed.
- One Native Banner is placed naturally between content sections on Home, Converter/route pages, Formats, format details, Compare, comparison details, Guides, guide details, About, Contact and Pro.
- Privacy, Cookies, Terms and Sign-in remain ad-free.
- `ADSTERRA_ALL_ADS_ENABLED = false` still disables all Adsterra ads globally.
- Turkey remains blocked via `ADSTERRA_BLOCKED_COUNTRIES = ["TR"]`.
