"use client";

import { useEffect, useRef, useState } from "react";
import { ADSTERRA_BANNER_300_ENABLED } from "@/lib/adsterraConfig";
import { useAdEligibility } from "@/components/ads/AdEligibilityProvider";

const SLOT_NAME = "300x250";
const TIMEOUT_MS = 12000;

function frameHasCreative(frame: HTMLIFrameElement | null) {
  try {
    const doc = frame?.contentDocument;
    if (!doc?.body) return false;

    return Array.from(doc.body.children).some((element) => {
      const tag = element.tagName.toLowerCase();
      if (["script", "style", "link"].includes(tag)) return false;
      if (element.querySelector("iframe, img, a, object, embed, video")) return true;

      const rect = element.getBoundingClientRect();
      return rect.width > 2 && rect.height > 2;
    });
  } catch {
    return false;
  }
}

export default function AdsterraBanner300x250({
  className = "",
}: {
  className?: string;
}) {
  const { adsAllowed } = useAdEligibility();
  const [hasCreative, setHasCreative] = useState(false);
  const [timedOut, setTimedOut] = useState(false);
  const frameRef = useRef<HTMLIFrameElement>(null);

  useEffect(() => {
    if (!adsAllowed) return;

    const onMessage = (event: MessageEvent) => {
      if (event.source !== frameRef.current?.contentWindow) return;
      if (event.data?.type !== "converto-adsterra-ready") return;
      if (event.data?.slot !== SLOT_NAME) return;
      setHasCreative(true);
    };

    window.addEventListener("message", onMessage);

    const startedAt = Date.now();
    const timer = window.setInterval(() => {
      if (frameHasCreative(frameRef.current)) {
        setHasCreative(true);
        window.clearInterval(timer);
        return;
      }

      if (Date.now() - startedAt >= TIMEOUT_MS) {
        setTimedOut(true);
        window.clearInterval(timer);
      }
    }, 400);

    return () => {
      window.removeEventListener("message", onMessage);
      window.clearInterval(timer);
    };
  }, [adsAllowed]);

  if (!adsAllowed || !ADSTERRA_BANNER_300_ENABLED || timedOut) return null;

  return (
    <aside
      aria-label="Advertisement"
      className={`mx-auto w-[324px] max-w-full overflow-hidden rounded-[22px] border border-white/10 bg-white/[0.035] p-3 shadow-[0_18px_55px_rgba(0,0,0,0.18)] ${className}`}
    >
      <div className="mb-2 text-center text-[10px] font-semibold uppercase tracking-[0.18em] text-white/38">
        Advertisement
      </div>

      <div className="relative mx-auto h-[250px] w-[300px] max-w-full overflow-hidden rounded-xl bg-black/10">
        {!hasCreative ? (
          <div
            aria-hidden="true"
            className="pointer-events-none absolute inset-0 animate-pulse bg-white/[0.025]"
          />
        ) : null}

        <iframe
          ref={frameRef}
          title="Sponsored advertisement"
          src="/adsterra/banner-300x250.html"
          width={300}
          height={250}
          loading="eager"
          scrolling="no"
          referrerPolicy="strict-origin-when-cross-origin"
          sandbox="allow-scripts allow-same-origin allow-popups allow-popups-to-escape-sandbox allow-top-navigation-by-user-activation"
          className="relative mx-auto block h-[250px] w-[300px] border-0"
        />
      </div>
    </aside>
  );
}
