# Adsterra site-wide placement v8

## Master switch

Open `lib/adsterraConfig.ts` and change this single line:

```ts
export const ADSTERRA_ALL_ADS_ENABLED = true;
```

Set it to `false` to disable every Adsterra unit across the entire site.

## Site-wide placement

A responsive footer banner is now shown on nearly every public page that uses the shared Footer component:

- Desktop: 728x90
- Mobile: 320x50

Excluded pages:

- `/privacy`
- `/cookies`
- `/terms`
- `/sign-in`

Existing in-content placements on format and guide pages remain unchanged.
