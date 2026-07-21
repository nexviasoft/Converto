# Adsterra integration notes

Integrated four Adsterra ad units:

- Desktop 728x90: `2509fb3ccdb765e1e445a723925e0934`
- Mobile 320x50: `5c70ca7ef822fbea8712b1c5fd406f5e`
- Responsive 300x250: `7e80ecd08cb20bbae47352951b96dfc6`
- Native banner: `fd6601ae4f261958321eb11878687973`

## Placements

- Format detail pages: 728x90/320x50 below the hero; 300x250 before Common conversions.
- Editorial guide pages: 728x90/320x50 after Key takeaways; Native banner after the second guide section.
- The 300x250 unit was removed from editorial guide pages to avoid stacking it with the Native banner.

## Responsive behavior

- 728x90 loads only at 820px and wider.
- 320x50 loads only from 352px through 819px.
- Screens narrower than 352px do not load either horizontal banner.
- The Native banner uses the network's responsive 4:1 layout.
- Horizontal and 300x250 units run inside isolated iframes.
- The Native banner is mounted once in the page body using its required script and container ID.

## Environment overrides

- Desktop key: `NEXT_PUBLIC_ADSTERRA_BANNER_728_KEY`
- Mobile key: `NEXT_PUBLIC_ADSTERRA_BANNER_320_KEY`
- 300x250 key: `NEXT_PUBLIC_ADSTERRA_BANNER_300_KEY`
- Native script: `NEXT_PUBLIC_ADSTERRA_NATIVE_SCRIPT_SRC`
- Native container ID: `NEXT_PUBLIC_ADSTERRA_NATIVE_CONTAINER_ID`

## Validation

Run `npm install` and `npm run build` before deployment.
