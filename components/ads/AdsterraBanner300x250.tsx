"use client";

import { useEffect, useRef, useState } from "react";
import { ADSTERRA_BANNER_300_ENABLED } from "@/lib/adsterraConfig";

export default function AdsterraBanner300x250({
  className = "",
}: {
  className?: string;
}) {
  const [hasCreative, setHasCreative] = useState(false);
  const [timedOut, setTimedOut] = useState(false);
  const frameRef = useRef<HTMLIFrameElement>(null);

  useEffect(() => {
    const startedAt = Date.now();
    const timer = window.setInterval(() => {
      try {
        const doc = frameRef.current?.contentDocument;
        const creative = doc?.body.querySelector(
          "iframe, img, a, object, embed, [id^='atContainer'], [class*='banner']"
        );
        if (creative) {
          setHasCreative(true);
          window.clearInterval(timer);
          return;
        }
      } catch {}

      if (Date.now() - startedAt > 9000) {
        setTimedOut(true);
        window.clearInterval(timer);
      }
    }, 350);

    return () => window.clearInterval(timer);
  }, []);

  if (!ADSTERRA_BANNER_300_ENABLED || timedOut) return null;

  return (
    <aside
      aria-label="Advertisement"
      className={`${
        hasCreative
          ? "mx-auto w-[324px] max-w-full overflow-hidden rounded-[22px] border border-white/10 bg-white/[0.035] p-3 shadow-[0_18px_55px_rgba(0,0,0,0.18)]"
          : "fixed -left-[10000px] top-0 h-[250px] w-[300px] overflow-hidden"
      } ${className}`}
    >
      {hasCreative ? (
        <div className="mb-2 text-center text-[10px] font-semibold uppercase tracking-[0.18em] text-white/38">
          Advertisement
        </div>
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
        className="mx-auto block h-[250px] w-[300px] border-0"
      />
    </aside>
  );
}
