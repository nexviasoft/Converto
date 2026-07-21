# Ad geo-block v9

Ad requests are now disabled for visitors detected in Turkey (`TR`).

## Controls

Open `lib/adsterraConfig.ts`:

```ts
// Master switch for every Adsterra placement.
export const ADSTERRA_ALL_ADS_ENABLED = true;

// Remove `TR` from this list to allow ads in Turkey again.
export const ADSTERRA_BLOCKED_COUNTRIES: readonly string[] = ["TR"];
```

Country detection is performed by `/api/ad-eligibility` using Vercel's request country header. Ads fail closed: when country detection is unavailable, ad scripts and iframes are not loaded.

The middleware also returns an empty response for `/adsterra/*` iframe pages when the request country is blocked.

Turkey visitors continue to use the whole Converto website normally; only advertising is suppressed.
