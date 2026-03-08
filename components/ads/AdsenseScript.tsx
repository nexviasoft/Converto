"use client";

import Script from "next/script";

const ADSENSE_CLIENT = process.env.NEXT_PUBLIC_ADSENSE_CLIENT || "";
const ADSENSE_ENABLED = ADSENSE_CLIENT.startsWith("ca-pub-");

export default function AdSenseScript() {
  if (!ADSENSE_ENABLED) return null;

  return (
    <Script
      id="adsense"
      strategy="afterInteractive"
      async
      src={`https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=${ADSENSE_CLIENT}`}
      crossOrigin="anonymous"
      onLoad={() => {
        try {
          // @ts-ignore
          window.adsbygoogle = window.adsbygoogle || [];
        } catch {}
      }}
    />
  );
}

export { ADSENSE_CLIENT, ADSENSE_ENABLED };