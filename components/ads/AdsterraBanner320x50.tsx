"use client";

import { useEffect, useMemo, useState } from "react";
import {
  ADSTERRA_BANNER_320_ENABLED,
  ADSTERRA_BANNER_320_KEY,
} from "@/lib/adsterraConfig";

const MOBILE_QUERY = "(min-width: 352px) and (max-width: 819px)";

export default function AdsterraBanner320x50({
  className = "",
}: {
  className?: string;
}) {
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const media = window.matchMedia(MOBILE_QUERY);
    const sync = () => setIsMobile(media.matches);

    sync();
    media.addEventListener?.("change", sync);

    return () => media.removeEventListener?.("change", sync);
  }, []);

  const srcDoc = useMemo(() => {
    const key = ADSTERRA_BANNER_320_KEY.replace(/[^a-f0-9]/gi, "");

    return `<!doctype html>
<html lang="en">
  <head>
    <meta charset="utf-8" />
    <meta name="viewport" content="width=320, initial-scale=1" />
    <style>
      html, body {
        width: 320px;
        height: 50px;
        margin: 0;
        padding: 0;
        overflow: hidden;
        background: transparent;
      }
    </style>
  </head>
  <body>
    <script>
      window.atOptions = {
        key: "${key}",
        format: "iframe",
        height: 50,
        width: 320,
        params: {}
      };
    <\/script>
    <script src="https://www.highperformanceformat.com/${key}/invoke.js"><\/script>
  </body>
</html>`;
  }, []);

  if (!ADSTERRA_BANNER_320_ENABLED || !isMobile) return null;

  return (
    <aside
      aria-label="Advertisement"
      className={`mx-auto w-[320px] max-w-full overflow-hidden ${className}`}
    >
      <div className="mb-2 text-center text-[10px] font-semibold uppercase tracking-[0.18em] text-white/38">
        Advertisement
      </div>

      <iframe
        title="Sponsored mobile advertisement"
        srcDoc={srcDoc}
        width={320}
        height={50}
        loading="lazy"
        scrolling="no"
        referrerPolicy="strict-origin-when-cross-origin"
        sandbox="allow-scripts allow-same-origin allow-popups allow-popups-to-escape-sandbox allow-top-navigation-by-user-activation"
        className="block h-[50px] w-[320px] border-0"
      />
    </aside>
  );
}
