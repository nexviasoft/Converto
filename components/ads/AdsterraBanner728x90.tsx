"use client";

import { useEffect, useMemo, useState } from "react";
import {
  ADSTERRA_BANNER_728_ENABLED,
  ADSTERRA_BANNER_728_KEY,
} from "@/lib/adsterraConfig";

const DESKTOP_QUERY = "(min-width: 820px)";

export default function AdsterraBanner728x90({
  className = "",
}: {
  className?: string;
}) {
  const [isDesktop, setIsDesktop] = useState(false);

  useEffect(() => {
    const media = window.matchMedia(DESKTOP_QUERY);
    const sync = () => setIsDesktop(media.matches);

    sync();
    media.addEventListener?.("change", sync);

    return () => media.removeEventListener?.("change", sync);
  }, []);

  const srcDoc = useMemo(() => {
    const key = ADSTERRA_BANNER_728_KEY.replace(/[^a-f0-9]/gi, "");

    return `<!doctype html>
<html lang="en">
  <head>
    <meta charset="utf-8" />
    <meta name="viewport" content="width=728, initial-scale=1" />
    <style>
      html, body {
        width: 728px;
        height: 90px;
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
        height: 90,
        width: 728,
        params: {}
      };
    <\/script>
    <script src="https://www.highperformanceformat.com/${key}/invoke.js"><\/script>
  </body>
</html>`;
  }, []);

  if (!ADSTERRA_BANNER_728_ENABLED || !isDesktop) return null;

  return (
    <aside
      aria-label="Advertisement"
      className={`mx-auto w-full max-w-[776px] overflow-hidden rounded-[22px] border border-white/10 bg-white/[0.035] p-3 shadow-[0_18px_55px_rgba(0,0,0,0.18)] ${className}`}
    >
      <div className="mb-2 text-center text-[10px] font-semibold uppercase tracking-[0.18em] text-white/38">
        Advertisement
      </div>

      <div className="mx-auto h-[90px] w-[728px] max-w-full overflow-hidden rounded-xl bg-black/10">
        <iframe
          title="Sponsored advertisement"
          srcDoc={srcDoc}
          width={728}
          height={90}
          loading="lazy"
          scrolling="no"
          referrerPolicy="strict-origin-when-cross-origin"
          sandbox="allow-scripts allow-same-origin allow-popups allow-popups-to-escape-sandbox allow-top-navigation-by-user-activation"
          className="block h-[90px] w-[728px] border-0"
        />
      </div>
    </aside>
  );
}
