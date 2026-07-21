"use client";

import { useMemo } from "react";
import {
  ADSTERRA_BANNER_300_ENABLED,
  ADSTERRA_BANNER_300_KEY,
} from "@/lib/adsterraConfig";

export default function AdsterraBanner300x250({
  className = "",
}: {
  className?: string;
}) {
  const srcDoc = useMemo(() => {
    const key = ADSTERRA_BANNER_300_KEY.replace(/[^a-f0-9]/gi, "");

    return `<!doctype html>
<html lang="en">
  <head>
    <meta charset="utf-8" />
    <meta name="viewport" content="width=300, initial-scale=1" />
    <style>
      html, body {
        width: 300px;
        height: 250px;
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
        height: 250,
        width: 300,
        params: {}
      };
    <\/script>
    <script src="https://www.highperformanceformat.com/${key}/invoke.js"><\/script>
  </body>
</html>`;
  }, []);

  if (!ADSTERRA_BANNER_300_ENABLED) return null;

  return (
    <aside
      aria-label="Advertisement"
      className={`mx-auto w-[300px] max-w-full overflow-hidden rounded-[22px] border border-white/10 bg-white/[0.035] p-3 shadow-[0_18px_55px_rgba(0,0,0,0.18)] ${className}`}
    >
      <div className="mb-2 text-center text-[10px] font-semibold uppercase tracking-[0.18em] text-white/38">
        Advertisement
      </div>

      <iframe
        title="Sponsored advertisement"
        srcDoc={srcDoc}
        width={300}
        height={250}
        loading="lazy"
        scrolling="no"
        referrerPolicy="strict-origin-when-cross-origin"
        sandbox="allow-scripts allow-same-origin allow-popups allow-popups-to-escape-sandbox allow-top-navigation-by-user-activation"
        className="block h-[250px] w-[300px] border-0"
      />
    </aside>
  );
}
