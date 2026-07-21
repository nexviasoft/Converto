"use client";

import { useEffect, useRef, useState } from "react";
import { useAdEligibility } from "@/components/ads/AdEligibilityProvider";
import {
  ADSTERRA_NATIVE_CONTAINER_ID,
  ADSTERRA_NATIVE_ENABLED,
  ADSTERRA_NATIVE_SCRIPT_SRC,
} from "@/lib/adsterraConfig";

type LoadState = "loading" | "ready" | "failed";

const AD_LOAD_TIMEOUT_MS = 12_000;

function containsRenderedAd(container: HTMLElement) {
  if (container.querySelector("a[href], iframe, img[src], video, canvas")) {
    return true;
  }

  const meaningfulText = container.textContent?.replace(/\s+/g, " ").trim() ?? "";
  return container.childElementCount > 1 && meaningfulText.length > 20;
}

export default function AdsterraNativeBanner({
  className = "",
}: {
  className?: string;
}) {
  const { adsAllowed } = useAdEligibility();
  const mountRef = useRef<HTMLDivElement>(null);
  const [loadState, setLoadState] = useState<LoadState>("loading");

  useEffect(() => {
    if (!adsAllowed || !ADSTERRA_NATIVE_ENABLED || !mountRef.current) return;

    const mount = mountRef.current;
    mount.replaceChildren();
    setLoadState("loading");

    const container = document.createElement("div");
    container.id = ADSTERRA_NATIVE_CONTAINER_ID;

    const script = document.createElement("script");
    script.async = true;
    script.setAttribute("data-cfasync", "false");
    script.src = ADSTERRA_NATIVE_SCRIPT_SRC;

    let finished = false;

    const markReady = () => {
      if (finished || !containsRenderedAd(container)) return;
      finished = true;
      setLoadState("ready");
    };

    const markFailed = () => {
      if (finished) return;
      finished = true;
      setLoadState("failed");
    };

    const observer = new MutationObserver(markReady);
    observer.observe(container, {
      childList: true,
      subtree: true,
      attributes: true,
      characterData: true,
    });

    script.addEventListener("error", markFailed, { once: true });
    script.addEventListener("load", markReady, { once: true });

    // Keep the vendor's expected order while ensuring both nodes are mounted
    // during the same DOM operation.
    mount.append(script, container);

    const timeout = window.setTimeout(() => {
      markReady();
      if (!finished) markFailed();
    }, AD_LOAD_TIMEOUT_MS);

    return () => {
      finished = true;
      window.clearTimeout(timeout);
      observer.disconnect();
      script.removeEventListener("error", markFailed);
      script.removeEventListener("load", markReady);
      mount.replaceChildren();
    };
  }, [adsAllowed]);

  if (!adsAllowed || !ADSTERRA_NATIVE_ENABLED || loadState === "failed") {
    return null;
  }

  const isReady = loadState === "ready";

  return (
    <div className={isReady ? "" : "relative h-0"}>
      <aside
        aria-label="Advertisement"
        aria-hidden={!isReady}
        className={
          isReady
            ? `mx-auto w-full overflow-hidden rounded-[24px] border border-white/10 bg-white/[0.035] p-4 shadow-[0_18px_55px_rgba(0,0,0,0.18)] ${className}`
            : "pointer-events-none absolute inset-x-0 top-0 -z-10 mx-auto w-full overflow-hidden opacity-0"
        }
      >
        <div className="mb-3 text-center text-[10px] font-semibold uppercase tracking-[0.18em] text-white/38">
          Advertisement
        </div>

        <div
          ref={mountRef}
          className="min-h-[170px] w-full overflow-hidden sm:min-h-[200px]"
        />
      </aside>
    </div>
  );
}
