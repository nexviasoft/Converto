"use client";

import React, { useEffect, useMemo, useRef } from "react";
import Link from "next/link";
import AdSenseScript from "@/components/ads/AdsenseScript";
import { allCompareItems } from "@/lib/compareData";

const cx = (...c: Array<string | false | null | undefined>) =>
  c.filter(Boolean).join(" ");

/** Ad slots */
const AD_SLOTS = {
  LEFT_RAIL: "3456789012",
  RIGHT_RAIL: "4567890123",
} as const;

const ADS_ENABLED = true;

function AdUnit({
  slot,
  className = "",
  title = "Sponsored",
  sticky = false,
}: {
  slot: string;
  className?: string;
  title?: string;
  sticky?: boolean;
}) {
  const pushedRef = useRef(false);

  useEffect(() => {
    try {
      if (!ADS_ENABLED) return;
      if (pushedRef.current) return;
      // @ts-ignore
      (window.adsbygoogle = window.adsbygoogle || []).push({});
      pushedRef.current = true;
    } catch {}
  }, []);

  if (!ADS_ENABLED) return null;

  return (
    <div
      className={cx(
        "relative overflow-hidden rounded-[24px] bg-white/8 ring-1 ring-white/10 shadow-[0_22px_65px_rgba(0,0,0,0.34)]",
        sticky ? "sticky top-[92px]" : "",
        className
      )}
    >
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_at_top,rgba(168,85,247,0.14),transparent_55%),radial-gradient(ellipse_at_bottom,rgba(59,130,246,0.10),transparent_55%)]" />
      <div className="relative p-4">
        <div className="mb-3 flex items-center justify-between">
          <div className="text-[11px] font-semibold tracking-wide text-white/55">{title}</div>
          <div className="text-[11px] text-white/35">Ads keep Converto free</div>
        </div>

        <div className="rounded-2xl bg-black/25 p-3 ring-1 ring-white/10">
          <div className="mb-3 space-y-2">
            <div className="h-2.5 w-24 rounded-full bg-white/10" />
            <div className="h-2.5 w-16 rounded-full bg-white/5" />
          </div>

          <ins
            className="adsbygoogle block"
            style={{
              display: "block",
              minHeight: 320,
            }}
            data-ad-slot={slot}
            data-ad-format="auto"
            data-full-width-responsive="true"
          />
        </div>
      </div>
    </div>
  );
}

export default function CompareHubPageClient() {
  const SHELL_MAX = "max-w-[1700px]";
  const CENTER_MAX = "max-w-[1100px]";
  const GRID =
    "xl:grid-cols-[260px_minmax(0,1fr)_260px] 2xl:grid-cols-[280px_minmax(0,1fr)_280px]";

  const comparePages = useMemo(() => {
    return allCompareItems.map((item) => ({
      href: `/compare/${item.slug}`,
      label: item.title,
      desc: item.metaDescription,
      category: item.category,
    }));
  }, []);

  const audioPages = comparePages.filter((item) => item.category === "audio");
  const videoPages = comparePages.filter((item) => item.category === "video");
  const imagePages = comparePages.filter((item) => item.category === "image");

  return (
    <main className="min-h-screen bg-[#151233] text-white selection:bg-white/20">
      <AdSenseScript />

      <div className="pointer-events-none fixed inset-0 -z-10">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,rgba(168,85,247,0.22),transparent_60%),radial-gradient(ellipse_at_bottom,rgba(59,130,246,0.18),transparent_55%),radial-gradient(ellipse_at_center,rgba(255,255,255,0.08),transparent_45%)]" />
        <div className="absolute inset-0 opacity-20 [background:linear-gradient(to_right,rgba(255,255,255,0.045)_1px,transparent_1px),linear-gradient(to_bottom,rgba(255,255,255,0.045)_1px,transparent_1px)] [background-size:72px_72px]" />
      </div>

      <div className={cx("mx-auto px-4 py-14 sm:px-6 lg:px-8", SHELL_MAX)}>
        <div className={cx("grid items-start gap-6 xl:gap-8", GRID)}>
          <aside className="hidden xl:block">
            <AdUnit slot={AD_SLOTS.LEFT_RAIL} sticky className="w-full" />
          </aside>

          <section className="min-w-0">
            <div className={cx("mx-auto w-full", CENTER_MAX)}>
              <div className="rounded-[30px] bg-white/10 p-8 ring-1 ring-white/10 shadow-[0_18px_55px_rgba(0,0,0,0.25)]">
                <div className="text-[11px] font-semibold uppercase tracking-[0.18em] text-white/45">
                  Compare Formats
                </div>

                <h1 className="mt-3 text-4xl font-bold tracking-tight sm:text-5xl">
                  Audio, video, and image format comparisons
                </h1>

                <p className="mt-4 max-w-3xl text-sm leading-7 text-white/70 sm:text-base">
                  Before converting a file, it helps to understand what each format is
                  optimized for. These comparison pages explain differences in quality,
                  file size, compatibility, editing workflows, streaming behavior, and
                  everyday use.
                </p>

                <div className="mt-8 flex flex-wrap gap-3">
                  <Link
                    href="/formats"
                    className="inline-flex rounded-full bg-white px-5 py-2.5 text-sm font-semibold text-black transition hover:bg-white/90"
                  >
                    Browse format guides
                  </Link>

                  <Link
                    href="/converter"
                    className="inline-flex rounded-full bg-white/8 px-5 py-2.5 text-sm font-medium text-white/85 ring-1 ring-white/10 transition hover:bg-white/12 hover:text-white"
                  >
                    Open Converter
                  </Link>
                </div>
              </div>

              <section className="mt-10 grid gap-6 lg:grid-cols-3">
                <div className="rounded-[28px] bg-white/10 p-6 ring-1 ring-white/10 shadow-[0_18px_55px_rgba(0,0,0,0.25)]">
                  <h2 className="text-2xl font-semibold tracking-tight">Audio comparisons</h2>
                  <p className="mt-3 text-sm leading-6 text-white/65">
                    Compare lossy and lossless audio formats, portability, quality,
                    streaming fit, and compatibility before you convert.
                  </p>

                  <div className="mt-5 flex flex-wrap gap-3">
                    {audioPages.slice(0, 8).map((item) => (
                      <Link
                        key={item.href}
                        href={item.href}
                        className="rounded-full bg-white/8 px-4 py-2 text-sm font-medium text-white/85 ring-1 ring-white/10 transition hover:bg-white/12 hover:text-white"
                      >
                        {item.label}
                      </Link>
                    ))}
                  </div>
                </div>

                <div className="rounded-[28px] bg-white/10 p-6 ring-1 ring-white/10 shadow-[0_18px_55px_rgba(0,0,0,0.25)]">
                  <h2 className="text-2xl font-semibold tracking-tight">Video comparisons</h2>
                  <p className="mt-3 text-sm leading-6 text-white/65">
                    Compare playback compatibility, editing fit, web delivery, legacy
                    containers, and practical sharing use cases.
                  </p>

                  <div className="mt-5 flex flex-wrap gap-3">
                    {videoPages.slice(0, 8).map((item) => (
                      <Link
                        key={item.href}
                        href={item.href}
                        className="rounded-full bg-white/8 px-4 py-2 text-sm font-medium text-white/85 ring-1 ring-white/10 transition hover:bg-white/12 hover:text-white"
                      >
                        {item.label}
                      </Link>
                    ))}
                  </div>
                </div>

                <div className="rounded-[28px] bg-white/10 p-6 ring-1 ring-white/10 shadow-[0_18px_55px_rgba(0,0,0,0.25)]">
                  <h2 className="text-2xl font-semibold tracking-tight">Image comparisons</h2>
                  <p className="mt-3 text-sm leading-6 text-white/65">
                    Compare transparency, compression, graphics quality, modern web
                    delivery, and photo-friendly image workflows.
                  </p>

                  <div className="mt-5 flex flex-wrap gap-3">
                    {imagePages.slice(0, 8).map((item) => (
                      <Link
                        key={item.href}
                        href={item.href}
                        className="rounded-full bg-white/8 px-4 py-2 text-sm font-medium text-white/85 ring-1 ring-white/10 transition hover:bg-white/12 hover:text-white"
                      >
                        {item.label}
                      </Link>
                    ))}
                  </div>
                </div>
              </section>

              <section className="mt-10 rounded-[28px] bg-white/10 p-6 ring-1 ring-white/10 shadow-[0_18px_55px_rgba(0,0,0,0.25)]">
                <div className="text-[11px] font-semibold uppercase tracking-[0.18em] text-white/45">
                  Compare pages
                </div>

                <h2 className="mt-3 text-2xl font-semibold tracking-tight">
                  Explore the most useful format comparisons
                </h2>

                <p className="mt-3 max-w-3xl text-sm leading-6 text-white/65">
                  These comparisons help you choose the right format before converting.
                  They are especially useful when two file types seem similar but serve
                  very different purposes in playback, editing, storage, or web delivery.
                </p>

                <div className="mt-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
                  {comparePages.map((item) => (
                    <Link
                      key={item.href}
                      href={item.href}
                      className="group rounded-2xl bg-white/8 p-4 ring-1 ring-white/10 transition hover:bg-white/12"
                    >
                      <div className="text-base font-semibold text-white">
                        {item.label}
                      </div>
                      <p className="mt-2 text-sm leading-6 text-white/65">
                        {item.desc}
                      </p>
                    </Link>
                  ))}
                </div>
              </section>

              <section className="mt-10 grid gap-6 lg:grid-cols-2">
                <div className="rounded-[28px] bg-white/10 p-6 ring-1 ring-white/10 shadow-[0_18px_55px_rgba(0,0,0,0.25)]">
                  <h2 className="text-2xl font-semibold tracking-tight">
                    Why compare before converting?
                  </h2>
                  <p className="mt-3 text-sm leading-6 text-white/65">
                    Some formats are better for raw quality, some are better for smaller
                    size, and others are better for device compatibility or browser playback.
                    Comparing them first makes it easier to choose the right target format.
                  </p>
                  <p className="mt-4 text-sm leading-6 text-white/65">
                    This is especially useful when deciding between lossless and lossy
                    audio, Apple-oriented and cross-platform video, or web-focused and
                    editing-friendly file types.
                  </p>
                </div>

                <div className="rounded-[28px] bg-white/10 p-6 ring-1 ring-white/10 shadow-[0_18px_55px_rgba(0,0,0,0.25)]">
                  <h2 className="text-2xl font-semibold tracking-tight">
                    Move from comparison to conversion
                  </h2>
                  <p className="mt-3 text-sm leading-6 text-white/65">
                    Once you know which format suits your workflow, you can jump
                    directly into the converter or open a format guide for more context.
                  </p>

                  <div className="mt-6 flex flex-wrap gap-3">
                    <Link
                      href="/converter"
                      className="inline-flex rounded-full bg-white px-5 py-2.5 text-sm font-semibold text-black transition hover:bg-white/90"
                    >
                      Go to Converter
                    </Link>

                    <Link
                      href="/formats"
                      className="inline-flex rounded-full bg-white/8 px-5 py-2.5 text-sm font-medium text-white/85 ring-1 ring-white/10 transition hover:bg-white/12 hover:text-white"
                    >
                      Open formats hub
                    </Link>
                  </div>
                </div>
              </section>
            </div>
          </section>

          <aside className="hidden xl:block">
            <AdUnit slot={AD_SLOTS.RIGHT_RAIL} sticky className="w-full" />
          </aside>
        </div>
      </div>
    </main>
  );
}