"use client";

import { useEffect, useRef, useState } from "react";
import { ADSTERRA_BANNER_320_ENABLED } from "@/lib/adsterraConfig";

const MOBILE_QUERY = "(min-width: 320px) and (max-width: 819px)";

export default function AdsterraBanner320x50({
  className = "",
}: {
  className?: string;
}) {
  const [isMobile, setIsMobile] = useState(false);
  const [hasCreative, setHasCreative] = useState(false);
  const [timedOut, setTimedOut] = useState(false);
  const frameRef = useRef<HTMLIFrameElement>(null);

  useEffect(() => {
    const media = window.matchMedia(MOBILE_QUERY);
    const sync = () => setIsMobile(media.matches);
    sync();
    media.addEventListener?.("change", sync);
    return () => media.removeEventListener?.("change", sync);
  }, []);

  useEffect(() => {
    if (!isMobile) return;
    setHasCreative(false);
    setTimedOut(false);

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
  }, [isMobile]);

  if (!ADSTERRA_BANNER_320_ENABLED || !isMobile || timedOut) return null;

  return (
    <aside
      aria-label="Advertisement"
      className={`${
        hasCreative
          ? "mx-auto w-[320px] max-w-full overflow-hidden"
          : "fixed -left-[10000px] top-0 h-[50px] w-[320px] overflow-hidden"
      } ${className}`}
    >
      {hasCreative ? (
        <div className="mb-2 text-center text-[10px] font-semibold uppercase tracking-[0.18em] text-white/38">
          Advertisement
        </div>
      ) : null}

      <iframe
        ref={frameRef}
        title="Sponsored mobile advertisement"
        src="/adsterra/banner-320x50.html"
        width={320}
        height={50}
        loading="eager"
        scrolling="no"
        referrerPolicy="strict-origin-when-cross-origin"
        sandbox="allow-scripts allow-same-origin allow-popups allow-popups-to-escape-sandbox allow-top-navigation-by-user-activation"
        className="block h-[50px] w-[320px] border-0"
      />
    </aside>
  );
}
