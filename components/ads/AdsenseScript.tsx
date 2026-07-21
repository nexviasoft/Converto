"use client";

import Script from "next/script";
import { usePathname } from "next/navigation";
import { isAdsensePathEligible } from "@/lib/adsEligibility";
import { useAdEligibility } from "@/components/ads/AdEligibilityProvider";
import {
  AD_SLOTS,
  ADSENSE_CLIENT,
  ADSENSE_ENABLED,
  hasRailAdSlots,
  isAdSlotReady,
} from "@/lib/adsConfig";

export {
  AD_SLOTS,
  ADSENSE_CLIENT,
  ADSENSE_ENABLED,
  hasRailAdSlots,
  isAdSlotReady,
};

export default function AdsenseScript() {
  const pathname = usePathname();
  const { adsAllowed } = useAdEligibility();

  if (!adsAllowed || !ADSENSE_ENABLED || !isAdsensePathEligible(pathname)) return null;

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
