# Adsterra test mode v11

- Turkey ads are temporarily enabled with `ADSTERRA_TURKEY_TEST_MODE = true` in `lib/adsterraConfig.ts`.
- After testing, set `ADSTERRA_TURKEY_TEST_MODE = false` to block Turkey again.
- Native ad containers stay visually collapsed while loading.
- A failed script request (including HTTP 403) removes the whole placement immediately.
- If no real ad content appears within 12 seconds, the whole placement is removed.
