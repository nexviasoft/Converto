# Converto

Converto is a Next.js file conversion site for audio, video, image, and PDF workflows.

## Local development

```bash
npm install
npm run dev
```

Open `http://localhost:3000`.

## Production domain

Set the public site URL in Vercel:

```bash
NEXT_PUBLIC_SITE_URL=https://www.converto.tools
```

## AdSense setup

The project is prepared for AdSense, but ad slot IDs should be added only after real ad units are created in AdSense.

Recommended Vercel environment variables:

```bash
NEXT_PUBLIC_ADSENSE_CLIENT=ca-pub-4933934041035226
NEXT_PUBLIC_ADSENSE_SLOT_LEFT_RAIL=your_left_rail_slot_id
NEXT_PUBLIC_ADSENSE_SLOT_RIGHT_RAIL=your_right_rail_slot_id
NEXT_PUBLIC_ADSENSE_SLOT_IN_CONTENT=your_in_content_slot_id
```

If slot IDs are empty, the app will not render fake ad units in production. This prevents placeholder ad code from using invalid sample slot IDs.

## Ads.txt

`public/ads.txt` is already included. Update it if the AdSense publisher ID changes.

## Legal pages

The project includes:

- `/privacy`
- `/terms`
- `/cookies`
- `/contact`

For regions that require consent management before personalized ads, connect a proper CMP/consent solution before serving ads.

## SEO routes

The sitemap includes the home page, converter pages, PDF tools, format guides, comparison pages, and legal/contact pages.
