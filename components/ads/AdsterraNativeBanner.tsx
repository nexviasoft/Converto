"use client";

import { useEffect, useRef } from "react";
import { useAdEligibility } from "@/components/ads/AdEligibilityProvider";
import {
  ADSTERRA_NATIVE_CONTAINER_ID,
  ADSTERRA_NATIVE_ENABLED,
  ADSTERRA_NATIVE_SCRIPT_SRC,
} from "@/lib/adsterraConfig";

export default function AdsterraNativeBanner({
  className = "",
}: {
  className?: string;
}) {
  const { adsAllowed } = useAdEligibility();
  const mountRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!adsAllowed || !ADSTERRA_NATIVE_ENABLED || !mountRef.current) return;

    const mount = mountRef.current;
    mount.replaceChildren();

    const script = document.createElement("script");
    script.async = true;
    script.setAttribute("data-cfasync", "false");
    script.src = ADSTERRA_NATIVE_SCRIPT_SRC;

    const container = document.createElement("div");
    container.id = ADSTERRA_NATIVE_CONTAINER_ID;

    mount.append(script, container);

    return () => {
      mount.replaceChildren();
    };
  }, [adsAllowed]);

  if (!adsAllowed || !ADSTERRA_NATIVE_ENABLED) return null;

  return (
    <aside
      aria-label="Advertisement"
      className={`mx-auto w-full overflow-hidden rounded-[24px] border border-white/10 bg-white/[0.035] p-4 shadow-[0_18px_55px_rgba(0,0,0,0.18)] ${className}`}
    >
      <div className="mb-3 text-center text-[10px] font-semibold uppercase tracking-[0.18em] text-white/38">
        Advertisement
      </div>

      <div
        ref={mountRef}
        className="min-h-[170px] w-full overflow-hidden sm:min-h-[200px]"
      />
    </aside>
  );
}
