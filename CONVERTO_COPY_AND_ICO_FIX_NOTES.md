# Converter copy and ICO fix

- Removed internal analytics-style wording such as “Lower bounce” from the post-conversion panel.
- Rewrote the success panel and related-conversion labels with normal user-facing language.
- Replaced internal terms such as “route”, “visitors”, and “SEO-friendly” in visible converter copy where they were not useful to users.
- Changed the default ICO export size from 64px to the standard 32px size for free conversions.
- Free ICO requests now explicitly use 32px / 32-bit settings, including batch requests.
- Added a friendly error-message layer so raw backend, codec, server, and Pro upsell messages are not shown directly to users.
- TypeScript validation completed successfully with `npx tsc --noEmit`.
