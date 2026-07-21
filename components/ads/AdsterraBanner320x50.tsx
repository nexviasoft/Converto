"use client";

import { useEffect, useRef, useState } from "react";
import { ADSTERRA_BANNER_320_ENABLED } from "@/lib/adsterraConfig";

const MOBILE_QUERY = "(min-width: 320px) and (max-width: 819px)";
const SLOT_NAME = "320x50";
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
  }, [isMobile]);

  if (!ADSTERRA_BANNER_320_ENABLED || !isMobile || timedOut) return null;

  return (
    <aside
      aria-label="Advertisement"
      className={`mx-auto w-[344px] max-w-full overflow-hidden rounded-[20px] border border-white/10 bg-white/[0.035] p-3 shadow-[0_16px_45px_rgba(0,0,0,0.16)] ${className}`}
    >
      <div className="mb-2 text-center text-[10px] font-semibold uppercase tracking-[0.18em] text-white/38">
        Advertisement
      </div>

      <div className="relative mx-auto h-[50px] w-[320px] max-w-full overflow-hidden rounded-lg bg-black/10">
        {!hasCreative ? (
          <div
            aria-hidden="true"
            className="pointer-events-none absolute inset-0 animate-pulse bg-white/[0.025]"
          />
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
          className="relative block h-[50px] w-[320px] border-0"
        />
      </div>
    </aside>
  );
}
