"use client";

import SimpleTopBar from "@/components/layout/SimpleTopBar";
import React, { useEffect, useMemo, useRef } from "react";
import Link from "next/link";
import AdSenseScript from "@/components/ads/AdsenseScript";
import { allCompareItems } from "@/lib/compareData";

const cx = (...c: Array<string | false | null | undefined>) =>
  c.filter(Boolean).join(" ");

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
        "relative overflow-hidden rounded-[28px] bg-white/8 ring-1 ring-white/10 shadow-[0_24px_70px_rgba(0,0,0,0.34)]",
        sticky ? "sticky top-[92px]" : "",
        className
      )}
    >
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_at_top,rgba(168,85,247,0.14),transparent_55%),radial-gradient(ellipse_at_bottom,rgba(59,130,246,0.10),transparent_55%)]" />
      <div className="relative p-4">
        <div className="mb-3 flex items-center justify-between">
          <div className="text-[11px] font-semibold tracking-wide text-white/60">
            {title}
          </div>
          <div className="text-[11px] text-white/35">Ads keep Converto free</div>
        </div>

        <div className="rounded-[22px] bg-black/20 p-4 ring-1 ring-white/10">
          <div className="mb-4 space-y-2">
            <div className="h-2.5 w-24 rounded-full bg-white/10" />
            <div className="h-2.5 w-14 rounded-full bg-white/5" />
          </div>

          <ins
            className="adsbygoogle block"
            style={{
              display: "block",
              minHeight: 560,
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

const featuredComparisons = [
  "mp3-vs-wav",
  "flac-vs-mp3",
  "aac-vs-mp3",
  "mp4-vs-webm",
  "mp4-vs-mov",
  "png-vs-jpg",
  "jpg-vs-webp",
  "webp-vs-avif",
];

const categoryCopy = {
  audio:
    "Compare audio formats for listening quality, file size, compatibility, streaming, archiving, and editing workflows.",
  video:
    "Compare video formats for compatibility, browser playback, editing, sharing, and media library workflows.",
  image:
    "Compare image formats for transparency, compression, web performance, graphics quality, and everyday sharing.",
} as const;

export default function CompareHubPageClient() {
  const SHELL_MAX = "max-w-[1750px]";
  const CENTER_MAX = "max-w-[1120px]";
  const GRID =
    "xl:grid-cols-[270px_minmax(0,1fr)_270px] 2xl:grid-cols-[300px_minmax(0,1fr)_300px]";

  const featured = useMemo(
    () =>
      allCompareItems.filter((item) => featuredComparisons.includes(item.slug)),
    []
  );

  const audio = useMemo(
    () => allCompareItems.filter((item) => item.category === "audio"),
    []
  );
  const video = useMemo(
    () => allCompareItems.filter((item) => item.category === "video"),
    []
  );
  const image = useMemo(
    () => allCompareItems.filter((item) => item.category === "image"),
    []
  );

  return (
    <>
      <SimpleTopBar shellMax={SHELL_MAX} />

      <main className="min-h-screen bg-[#151233] pt-4 text-white selection:bg-white/20">
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
                <div className="relative overflow-hidden rounded-[34px] bg-white/10 p-8 ring-1 ring-white/10 shadow-[0_24px_70px_rgba(0,0,0,0.28)] sm:p-10">
                  <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_top_right,rgba(168,85,247,0.18),transparent_28%),radial-gradient(circle_at_bottom_left,rgba(59,130,246,0.15),transparent_32%)]" />

                  <div className="relative">
                    <div className="text-[11px] font-semibold uppercase tracking-[0.18em] text-white/45">
                      Compare Hub
                    </div>

                    <h1 className="mt-3 text-4xl font-bold tracking-tight sm:text-5xl">
                      Compare file formats before you convert
                    </h1>

                    <p className="mt-4 max-w-3xl text-sm leading-7 text-white/70 sm:text-base">
                      Converto comparison pages help users understand the practical
                      differences between popular audio, video, and image formats.
                      Instead of guessing, you can compare compatibility, quality,
                      file size, workflow fit, and conversion direction before you
                      choose an output format.
                    </p>

                    <div className="mt-6 flex flex-wrap gap-3">
                      <span className="rounded-full bg-white/8 px-4 py-2 text-sm text-white/80 ring-1 ring-white/10">
                        Audio, video, and image comparisons
                      </span>
                      <span className="rounded-full bg-white/8 px-4 py-2 text-sm text-white/80 ring-1 ring-white/10">
                        Workflow-first explanations
                      </span>
                      <span className="rounded-full bg-white/8 px-4 py-2 text-sm text-white/80 ring-1 ring-white/10">
                        Built for conversion decisions
                      </span>
                    </div>

                    <div className="mt-8 flex flex-wrap gap-3">
                      <Link
                        href="/converter"
                        className="inline-flex rounded-full bg-white px-5 py-2.5 text-sm font-semibold text-black transition hover:bg-white/90"
                      >
                        Open Converter
                      </Link>

                      <Link
                        href="/formats"
                        className="inline-flex rounded-full bg-white/8 px-5 py-2.5 text-sm font-medium text-white/85 ring-1 ring-white/10 transition hover:bg-white/12 hover:text-white"
                      >
                        Browse formats
                      </Link>

                      <Link
                        href="/"
                        className="inline-flex rounded-full bg-white/8 px-5 py-2.5 text-sm font-medium text-white/85 ring-1 ring-white/10 transition hover:bg-white/12 hover:text-white"
                      >
                        Back to Home
                      </Link>
                    </div>
                  </div>
                </div>

                <section className="mt-10 rounded-[30px] bg-white/10 p-6 ring-1 ring-white/10 shadow-[0_18px_55px_rgba(0,0,0,0.25)]">
                  <div className="text-[11px] font-semibold uppercase tracking-[0.18em] text-white/45">
                    Featured comparisons
                  </div>

                  <h2 className="mt-3 text-2xl font-semibold tracking-tight">
                    Start with the most useful format decisions
                  </h2>

                  <p className="mt-3 max-w-3xl text-sm leading-6 text-white/65">
                    These are some of the most practical comparisons for users who
                    want to choose between portability and quality, broad support and
                    web optimization, or general sharing and editing workflows.
                  </p>

                  <div className="mt-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
                    {featured.map((item) => (
                      <Link
                        key={item.slug}
                        href={`/compare/${item.slug}`}
                        className="group rounded-[22px] bg-white/8 p-4 ring-1 ring-white/10 transition hover:bg-white/12"
                      >
                        <div className="text-base font-semibold text-white">
                          {item.title}
                        </div>
                        <p className="mt-2 text-sm leading-6 text-white/65">
                          {item.metaDescription}
                        </p>
                      </Link>
                    ))}
                  </div>
                </section>

                <section className="mt-10 grid gap-6 lg:grid-cols-3">
                  {[
                    { title: "Audio comparisons", items: audio, key: "audio" as const },
                    { title: "Video comparisons", items: video, key: "video" as const },
                    { title: "Image comparisons", items: image, key: "image" as const },
                  ].map((group) => (
                    <div
                      key={group.title}
                      className="rounded-[30px] bg-white/10 p-6 ring-1 ring-white/10 shadow-[0_18px_55px_rgba(0,0,0,0.25)]"
                    >
                      <h2 className="text-2xl font-semibold tracking-tight">
                        {group.title}
                      </h2>
                      <p className="mt-3 text-sm leading-6 text-white/65">
                        {categoryCopy[group.key]}
                      </p>

                      <div className="mt-5 space-y-3">
                        {group.items.map((item) => (
                          <Link
                            key={item.slug}
                            href={`/compare/${item.slug}`}
                            className="block rounded-[18px] bg-white/8 px-4 py-3 text-sm text-white/85 ring-1 ring-white/10 transition hover:bg-white/12 hover:text-white"
                          >
                            {item.title}
                          </Link>
                        ))}
                      </div>
                    </div>
                  ))}
                </section>

                <section className="mt-10 rounded-[30px] bg-white/10 p-6 ring-1 ring-white/10 shadow-[0_18px_55px_rgba(0,0,0,0.25)]">
                  <div className="text-[11px] font-semibold uppercase tracking-[0.18em] text-white/45">
                    Why compare pages matter
                  </div>

                  <h2 className="mt-3 text-2xl font-semibold tracking-tight">
                    Good conversion starts with choosing the right target
                  </h2>

                  <div className="mt-6 grid gap-4 md:grid-cols-2">
                    <div className="rounded-[22px] bg-white/8 p-4 ring-1 ring-white/10">
                      <div className="text-base font-semibold text-white">
                        Better decisions before converting
                      </div>
                      <p className="mt-2 text-sm leading-6 text-white/65">
                        Many users do not need more features. They need confidence
                        about which output format actually fits their workflow.
                      </p>
                    </div>

                    <div className="rounded-[22px] bg-white/8 p-4 ring-1 ring-white/10">
                      <div className="text-base font-semibold text-white">
                        Less trial and error
                      </div>
                      <p className="mt-2 text-sm leading-6 text-white/65">
                        Comparison pages reduce guesswork by showing the practical
                        difference between quality, size, compatibility, and use case.
                      </p>
                    </div>

                    <div className="rounded-[22px] bg-white/8 p-4 ring-1 ring-white/10">
                      <div className="text-base font-semibold text-white">
                        Stronger content depth
                      </div>
                      <p className="mt-2 text-sm leading-6 text-white/65">
                        These pages make Converto feel less like a simple tool and
                        more like a useful format resource users can learn from.
                      </p>
                    </div>

                    <div className="rounded-[22px] bg-white/8 p-4 ring-1 ring-white/10">
                      <div className="text-base font-semibold text-white">
                        Easier next action
                      </div>
                      <p className="mt-2 text-sm leading-6 text-white/65">
                        After users compare two formats, they can move directly into
                        the exact conversion path that makes sense.
                      </p>
                    </div>
                  </div>
                </section>

                <section className="mt-10 grid gap-6 lg:grid-cols-2">
                  <div className="rounded-[30px] bg-white/10 p-6 ring-1 ring-white/10 shadow-[0_18px_55px_rgba(0,0,0,0.25)]">
                    <h2 className="text-2xl font-semibold tracking-tight">
                      Popular questions users usually have
                    </h2>

                    <div className="mt-5 space-y-4">
                      <div className="rounded-[22px] bg-white/8 p-4 ring-1 ring-white/10">
                        <h3 className="text-base font-semibold text-white">
                          Which format is better?
                        </h3>
                        <p className="mt-2 text-sm leading-6 text-white/65">
                          Usually neither is universally better. One format is often
                          better for one specific goal, such as editing, sharing,
                          streaming, archiving, or web delivery.
                        </p>
                      </div>

                      <div className="rounded-[22px] bg-white/8 p-4 ring-1 ring-white/10">
                        <h3 className="text-base font-semibold text-white">
                          Should I convert or keep the original?
                        </h3>
                        <p className="mt-2 text-sm leading-6 text-white/65">
                          Keep the original when it already fits your use case.
                          Convert when you need smaller files, broader compatibility,
                          or a format better suited to your destination workflow.
                        </p>
                      </div>

                      <div className="rounded-[22px] bg-white/8 p-4 ring-1 ring-white/10">
                        <h3 className="text-base font-semibold text-white">
                          Does converting improve quality?
                        </h3>
                        <p className="mt-2 text-sm leading-6 text-white/65">
                          Not really. Conversion can improve compatibility or reduce
                          size, but it usually does not recover detail that is not
                          present in the source.
                        </p>
                      </div>
                    </div>
                  </div>

                  <div className="rounded-[30px] bg-white/10 p-6 ring-1 ring-white/10 shadow-[0_18px_55px_rgba(0,0,0,0.25)]">
                    <h2 className="text-2xl font-semibold tracking-tight">
                      Start from a comparison or jump into converting
                    </h2>
                    <p className="mt-3 text-sm leading-6 text-white/65">
                      If you already know your target, open the converter directly.
                      If you are still deciding between two outputs, browse one of the
                      comparison pages above and then convert with more confidence.
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
                        Browse format guides
                      </Link>

                      <Link
                        href="/compare/mp3-vs-wav"
                        className="inline-flex rounded-full bg-white/8 px-5 py-2.5 text-sm font-medium text-white/85 ring-1 ring-white/10 transition hover:bg-white/12 hover:text-white"
                      >
                        Try MP3 vs WAV
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
    </>
  );
}