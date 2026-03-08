"use client";

import React, { useEffect, useRef } from "react";
import { cx } from "@/components/ui";
import { ADSENSE_CLIENT, ADSENSE_ENABLED } from "./AdsenseScript";

export const AD_SLOTS = {
  LEFT_RAIL: "3456789012",
  RIGHT_RAIL: "4567890123",
  IN_CONTENT: "2345678901",
} as const;

export default function AdUnit({
  slot,
  className = "",
  style,
  density = "compact",
}: {
  slot: string;
  className?: string;
  style?: React.CSSProperties;
  density?: "compact" | "normal";
}) {
  const pushedRef = useRef(false);
  const triesRef = useRef(0);
  const rafRef = useRef<number | null>(null);
  const tRef = useRef<number | null>(null);
  const insRef = useRef<HTMLModElement | null>(null);

  const instanceIdRef = useRef<string>(Math.random().toString(36).slice(2));
  const instanceId = instanceIdRef.current;

  useEffect(() => {
    pushedRef.current = false;
    triesRef.current = 0;
    if (insRef.current) {
      try {
        insRef.current.innerHTML = "";
      } catch {}
    }
  }, [slot]);

  const canPush = () => {
    if (!ADSENSE_ENABLED) return false;
    if (typeof window === "undefined") return false;

    const ins = insRef.current as any;
    if (!ins) return false;
    if (!ins.isConnected) return false;

    const w = (ins as HTMLElement).offsetWidth;
    const h = (ins as HTMLElement).offsetHeight;
    if (w <= 0 || h <= 0) return false;

    // @ts-ignore
    const ads = (window as any).adsbygoogle;
    if (!ads || typeof ads.push !== "function") return false;

    return true;
  };

  const pushNow = () => {
    if (!canPush()) return false;
    try {
      // @ts-ignore
      (window as any).adsbygoogle.push({});
      pushedRef.current = true;
      return true;
    } catch {
      return false;
    }
  };

  useEffect(() => {
    if (!ADSENSE_ENABLED) return;

    const schedule = (delayMs: number) => {
      if (tRef.current) window.clearTimeout(tRef.current);

      tRef.current = window.setTimeout(() => {
        if (rafRef.current) cancelAnimationFrame(rafRef.current);

        rafRef.current = requestAnimationFrame(() => {
          const ok = pushNow();

          if (!ok && triesRef.current < 5) {
            triesRef.current += 1;
            const backoff = [80, 200, 400, 700, 1100, 1600][triesRef.current] ?? 900;
            schedule(backoff);
          }
        });
      }, delayMs);
    };

    schedule(80);

    return () => {
      if (tRef.current) window.clearTimeout(tRef.current);
      if (rafRef.current) cancelAnimationFrame(rafRef.current);
      tRef.current = null;
      rafRef.current = null;
    };
  }, [slot]);

  if (!ADSENSE_ENABLED) return null;

  const compact = density === "compact";

  return (
    <div
      key={`${slot}-${instanceId}`}
      className={cx(
        "relative overflow-hidden rounded-3xl bg-white/10 ring-1 ring-white/10 shadow-[0_20px_60px_rgba(0,0,0,0.28)]",
        className
      )}
    >
      <div className="pointer-events-none absolute inset-0 bg-gradient-to-r from-violet-500/12 via-fuchsia-500/8 to-sky-500/12 opacity-60" />

      <div className={cx("relative", compact ? "p-3" : "p-4")}>
        <div className={cx("flex items-center justify-between", compact ? "mb-2" : "mb-3")}>
          <span
            className={cx(
              "font-semibold tracking-widest text-white/55",
              compact ? "text-[10px]" : "text-[11px]"
            )}
          >
            SPONSORED
          </span>

          <span
            className={cx(
              compact ? "text-[10px] text-white/40" : "text-[11px] text-white/45"
            )}
          >
            Ads keep Converto free
          </span>
        </div>

        <div className={cx("rounded-2xl bg-black/20 ring-1 ring-white/10", compact ? "p-2" : "p-3")}>
          <ins
            ref={insRef}
            className="adsbygoogle block"
            style={{
              display: "block",
              width: "100%",
              minHeight: compact ? 120 : 160,
              ...(style || {}),
            }}
            data-ad-client={ADSENSE_CLIENT}
            data-ad-slot={slot}
            data-ad-format="auto"
            data-full-width-responsive="true"
          />
        </div>
      </div>
    </div>
  );
}