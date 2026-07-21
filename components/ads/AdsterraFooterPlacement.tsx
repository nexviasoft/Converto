"use client";

import { usePathname } from "next/navigation";
import AdsterraResponsiveBanner from "@/components/ads/AdsterraResponsiveBanner";
import { ADSTERRA_ALL_ADS_ENABLED } from "@/lib/adsterraConfig";
import { useAdEligibility } from "@/components/ads/AdEligibilityProvider";

const EXCLUDED_EXACT_PATHS = new Set([
  "/privacy",
  "/cookies",
  "/terms",
  "/sign-in",
]);

function isEligiblePath(pathname: string) {
  if (!pathname || EXCLUDED_EXACT_PATHS.has(pathname)) return false;
  if (pathname.startsWith("/api/")) return false;
  return true;
}

export default function AdsterraFooterPlacement() {
  const pathname = usePathname();
  const { adsAllowed } = useAdEligibility();

  if (!adsAllowed || !ADSTERRA_ALL_ADS_ENABLED || !isEligiblePath(pathname)) return null;

  return (
    <section
      aria-label="Sponsored content"
      className="relative z-10 border-t border-white/10 bg-[#110d2b]/92 px-4 py-7 sm:px-6"
    >
      <div className="mx-auto max-w-6xl">
        <AdsterraResponsiveBanner />
      </div>
    </section>
  );
}
