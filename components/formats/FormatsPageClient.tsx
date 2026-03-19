"use client";

import React, { useEffect, useMemo, useRef } from "react";
import Link from "next/link";
import AdSenseScript from "@/components/ads/AdsenseScript";
import {
  audioFormats,
  videoFormats,
  imageFormats,
  allFormats,
} from "@/lib/formatData";

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

const compareGuides = [
  {
    href: "/compare/mp3-vs-wav",
    label: "MP3 vs WAV",
    desc: "Compare portability and small file sizes with editing-friendly uncompressed audio.",
  },
  {
    href: "/compare/flac-vs-mp3",
    label: "FLAC vs MP3",
    desc: "Understand the trade-off between lossless quality and smaller everyday listening files.",
  },
  {
    href: "/compare/mp4-vs-webm",
    label: "MP4 vs WEBM",
    desc: "Compare universal playback with browser-oriented web delivery.",
  },
  {
    href: "/compare/mp4-vs-mov",
    label: "MP4 vs MOV",
    desc: "See how a sharing-first format compares with editing-oriented Apple workflows.",
  },
  {
    href: "/compare/aac-vs-mp3",
    label: "AAC vs MP3",
    desc: "Compare two common compressed audio formats for size, compatibility, and playback use.",
  },
  {
    href: "/compare/png-vs-jpg",
    label: "PNG vs JPG",
    desc: "Compare transparency-friendly graphics with lightweight photo-friendly image delivery.",
  },
];

const popularConversions = [
  {
    href: "/convert/mp4-to-mp3",
    label: "MP4 to MP3",
    desc: "Extract audio from video for music, lectures, interviews, and spoken content.",
  },
  {
    href: "/convert/mp3-to-wav",
    label: "MP3 to WAV",
    desc: "Convert compact listening files into editing-friendly WAV output.",
  },
  {
    href: "/convert/flac-to-mp3",
    label: "FLAC to MP3",
    desc: "Make lossless music easier to store, share, and play across more devices.",
  },
  {
    href: "/convert/webm-to-mp3",
    label: "WEBM to MP3",
    desc: "Extract audio from web-focused video files.",
  },
  {
    href: "/convert/mov-to-mp4",
    label: "MOV to MP4",
    desc: "Improve compatibility for browser playback, sharing, and general uploads.",
  },
  {
    href: "/convert/mp4-to-gif",
    label: "MP4 to GIF",
    desc: "Create short looping clips for web use, social posts, and reactions.",
  },
  {
    href: "/convert/png-to-jpg",
    label: "PNG to JPG",
    desc: "Turn crisp graphics into lighter image files for sharing and uploads.",
  },
  {
    href: "/convert/webp-to-png",
    label: "WEBP to PNG",
    desc: "Convert web-optimized images into a more editing-friendly format.",
  },
];

function FormatGroup({
  title,
  desc,
  formats,
}: {
  title: string;
  desc: string;
  formats: typeof allFormats;
}) {
  return (
    <div className="rounded-[28px] bg-white/10 p-6 ring-1 ring-white/10 shadow-[0_18px_55px_rgba(0,0,0,0.25)]">
      <h2 className="text-2xl font-semibold tracking-tight">{title}</h2>
      <p className="mt-3 text-sm leading-6 text-white/65">{desc}</p>

      <div className="mt-5 flex flex-wrap gap-3">
        {formats.map((format) => (
          <Link
            key={format.slug}
            href={`/formats/${format.slug}`}
            className="rounded-full bg-white/8 px-4 py-2 text-sm font-medium text-white/85 ring-1 ring-white/10 transition hover:bg-white/12 hover:text-white"
          >
            {format.label}
          </Link>
        ))}
      </div>
    </div>
  );
}

export default function FormatsPageClient() {
  const SHELL_MAX = "max-w-[1750px]";
  const CENTER_MAX = "max-w-[1120px]";
  const GRID =
    "xl:grid-cols-[270px_minmax(0,1fr)_270px] 2xl:grid-cols-[300px_minmax(0,1fr)_300px]";

  const formatGuides = useMemo(
    () =>
      allFormats.map((item) => ({
        href: `/formats/${item.slug}`,
        label: `${item.label} format guide`,
        desc: item.metaDescription,
      })),
    []
  );

  const featuredFormats = [
    { href: "/formats/mp4", label: "MP4", note: "General-purpose video" },
    { href: "/formats/mp3", label: "MP3", note: "Universal audio" },
    { href: "/formats/png", label: "PNG", note: "Transparency-friendly image" },
    { href: "/formats/webm", label: "WEBM", note: "Web-focused video" },
    { href: "/formats/flac", label: "FLAC", note: "Lossless audio" },
    { href: "/formats/webp", label: "WEBP", note: "Modern web image" },
  ];

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
              <div className="relative overflow-hidden rounded-[34px] bg-white/10 p-8 ring-1 ring-white/10 shadow-[0_24px_70px_rgba(0,0,0,0.28)] sm:p-10">
                <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_top_right,rgba(168,85,247,0.18),transparent_28%),radial-gradient(circle_at_bottom_left,rgba(59,130,246,0.15),transparent_32%)]" />

                <div className="relative">
                  <div className="text-[11px] font-semibold uppercase tracking-[0.18em] text-white/45">
                    Format Library
                  </div>

                  <h1 className="mt-3 text-4xl font-bold tracking-tight sm:text-5xl">
                    Supported file formats
                  </h1>

                  <p className="mt-4 max-w-3xl text-sm leading-7 text-white/70 sm:text-base">
                    Converto supports a growing library of audio, video, and image
                    formats for practical everyday conversions. Use this hub to
                    understand what each format is best for, compare similar formats,
                    and jump straight into the most common conversion routes.
                  </p>

                  <div className="mt-6 flex flex-wrap gap-3">
                    <span className="rounded-full bg-white/8 px-4 py-2 text-sm text-white/80 ring-1 ring-white/10">
                      Audio, video, and images
                    </span>
                    <span className="rounded-full bg-white/8 px-4 py-2 text-sm text-white/80 ring-1 ring-white/10">
                      Guides + comparisons
                    </span>
                    <span className="rounded-full bg-white/8 px-4 py-2 text-sm text-white/80 ring-1 ring-white/10">
                      Conversion-first workflows
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
                      href="/compare"
                      className="inline-flex rounded-full bg-white/8 px-5 py-2.5 text-sm font-medium text-white/85 ring-1 ring-white/10 transition hover:bg-white/12 hover:text-white"
                    >
                      Browse comparisons
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
                  Featured formats
                </div>

                <h2 className="mt-3 text-2xl font-semibold tracking-tight">
                  Start with the formats people use the most
                </h2>

                <p className="mt-3 max-w-3xl text-sm leading-6 text-white/65">
                  These formats cover the most common everyday use cases, from audio
                  extraction and portable listening to browser playback, image
                  optimization, and broad compatibility across devices.
                </p>

                <div className="mt-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
                  {featuredFormats.map((item) => (
                    <Link
                      key={item.href}
                      href={item.href}
                      className="group rounded-[22px] bg-white/8 p-4 ring-1 ring-white/10 transition hover:bg-white/12"
                    >
                      <div className="text-base font-semibold text-white">
                        {item.label}
                      </div>
                      <p className="mt-2 text-sm leading-6 text-white/65">
                        {item.note}
                      </p>
                    </Link>
                  ))}
                </div>
              </section>

              <section className="mt-10 grid gap-6 lg:grid-cols-3">
                <FormatGroup
                  title="Audio formats"
                  desc="Audio conversion helps with listening compatibility, extracting sound from video, managing file size, and preparing files for playback across apps, phones, browsers, and music libraries."
                  formats={audioFormats}
                />

                <FormatGroup
                  title="Video formats"
                  desc="Video conversion is useful for playback compatibility, modernizing older files, reducing sharing friction, preparing uploads, and choosing the right balance between quality and file size."
                  formats={videoFormats}
                />

                <FormatGroup
                  title="Image formats"
                  desc="Image conversion helps with compression, transparency, editing flexibility, web optimization, and moving between graphics-first and delivery-first formats."
                  formats={imageFormats}
                />
              </section>

              <section className="mt-10 rounded-[30px] bg-white/10 p-6 ring-1 ring-white/10 shadow-[0_18px_55px_rgba(0,0,0,0.25)]">
                <div className="text-[11px] font-semibold uppercase tracking-[0.18em] text-white/45">
                  Why this hub matters
                </div>

                <h2 className="mt-3 text-2xl font-semibold tracking-tight">
                  Choosing the right format saves time, space, and compatibility headaches
                </h2>

                <div className="mt-6 grid gap-4 md:grid-cols-2">
                  <div className="rounded-[22px] bg-white/8 p-4 ring-1 ring-white/10">
                    <div className="text-base font-semibold text-white">
                      Better compatibility
                    </div>
                    <p className="mt-2 text-sm leading-6 text-white/65">
                      Some formats work better in browsers, some are better for editing,
                      and others are simply easier to share. Knowing the difference
                      helps users choose the right output faster.
                    </p>
                  </div>

                  <div className="rounded-[22px] bg-white/8 p-4 ring-1 ring-white/10">
                    <div className="text-base font-semibold text-white">
                      Smaller or more flexible files
                    </div>
                    <p className="mt-2 text-sm leading-6 text-white/65">
                      A good converter is not only about changing extensions. It is
                      about improving portability, reducing file size, or preparing a
                      file for a specific workflow.
                    </p>
                  </div>

                  <div className="rounded-[22px] bg-white/8 p-4 ring-1 ring-white/10">
                    <div className="text-base font-semibold text-white">
                      Clearer conversion decisions
                    </div>
                    <p className="mt-2 text-sm leading-6 text-white/65">
                      Users often do not need every format. They need the right format
                      for one specific task, like extracting audio, uploading to a site,
                      or opening an older file on a modern device.
                    </p>
                  </div>

                  <div className="rounded-[22px] bg-white/8 p-4 ring-1 ring-white/10">
                    <div className="text-base font-semibold text-white">
                      Less guesswork
                    </div>
                    <p className="mt-2 text-sm leading-6 text-white/65">
                      These pages are designed to explain practical use cases, not just
                      definitions, so users can move from confusion to action quickly.
                    </p>
                  </div>
                </div>
              </section>

              <section className="mt-10 rounded-[30px] bg-white/10 p-6 ring-1 ring-white/10 shadow-[0_18px_55px_rgba(0,0,0,0.25)]">
                <div className="text-[11px] font-semibold uppercase tracking-[0.18em] text-white/45">
                  Format guides
                </div>

                <h2 className="mt-3 text-2xl font-semibold tracking-tight">
                  Explore detailed guides for all supported formats
                </h2>

                <p className="mt-3 max-w-3xl text-sm leading-6 text-white/65">
                  Each guide explains what the format is, where it fits best, what it is
                  commonly compared with, and which conversion paths are the most useful
                  for real-world compatibility, playback, editing, or optimization.
                </p>

                <div className="mt-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
                  {formatGuides.map((item) => (
                    <Link
                      key={item.href}
                      href={item.href}
                      className="group rounded-[22px] bg-white/8 p-4 ring-1 ring-white/10 transition hover:bg-white/12"
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

              <section className="mt-10 rounded-[30px] bg-white/10 p-6 ring-1 ring-white/10 shadow-[0_18px_55px_rgba(0,0,0,0.25)]">
                <div className="text-[11px] font-semibold uppercase tracking-[0.18em] text-white/45">
                  Format comparisons
                </div>

                <h2 className="mt-3 text-2xl font-semibold tracking-tight">
                  Compare similar formats before you convert
                </h2>

                <p className="mt-3 max-w-3xl text-sm leading-6 text-white/65">
                  Some formats seem similar until you look at playback support, editing
                  flexibility, streaming use, transparency, or file size behavior. These
                  compare pages help users choose the better fit before converting.
                </p>

                <div className="mt-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
                  {compareGuides.map((item) => (
                    <Link
                      key={item.href}
                      href={item.href}
                      className="group rounded-[22px] bg-white/8 p-4 ring-1 ring-white/10 transition hover:bg-white/12"
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

                <div className="mt-6">
                  <Link
                    href="/compare"
                    className="inline-flex rounded-full bg-white px-5 py-2.5 text-sm font-semibold text-black transition hover:bg-white/90"
                  >
                    Open compare hub
                  </Link>
                </div>
              </section>

              <section className="mt-10 rounded-[30px] bg-white/10 p-6 ring-1 ring-white/10 shadow-[0_18px_55px_rgba(0,0,0,0.25)]">
                <div className="text-[11px] font-semibold uppercase tracking-[0.18em] text-white/45">
                  Popular conversions
                </div>

                <h2 className="mt-3 text-2xl font-semibold tracking-tight">
                  Common format changes people make every day
                </h2>

                <p className="mt-3 max-w-3xl text-sm leading-6 text-white/65">
                  These routes cover some of the most common reasons people convert
                  files: extracting audio, reducing size, improving compatibility,
                  creating web-friendly assets, or making older files easier to open.
                </p>

                <div className="mt-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
                  {popularConversions.map((item) => (
                    <Link
                      key={item.href}
                      href={item.href}
                      className="group rounded-[22px] bg-white/8 p-4 ring-1 ring-white/10 transition hover:bg-white/12"
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
                <div className="rounded-[30px] bg-white/10 p-6 ring-1 ring-white/10 shadow-[0_18px_55px_rgba(0,0,0,0.25)]">
                  <h2 className="text-2xl font-semibold tracking-tight">
                    Practical format questions users usually have
                  </h2>

                  <div className="mt-5 space-y-4">
                    <div className="rounded-[22px] bg-white/8 p-4 ring-1 ring-white/10">
                      <h3 className="text-base font-semibold text-white">
                        Which format is the safest all-around choice?
                      </h3>
                      <p className="mt-2 text-sm leading-6 text-white/65">
                        For video, MP4 is usually the safest broad-compatibility option.
                        For audio, MP3 remains the most universal. For web-focused images,
                        JPG, PNG, WEBP, and AVIF each serve different needs.
                      </p>
                    </div>

                    <div className="rounded-[22px] bg-white/8 p-4 ring-1 ring-white/10">
                      <h3 className="text-base font-semibold text-white">
                        When should I convert instead of keeping the original file?
                      </h3>
                      <p className="mt-2 text-sm leading-6 text-white/65">
                        Convert when you need better compatibility, smaller file sizes,
                        audio extraction, easier sharing, or a format that fits a
                        specific browser, app, or editing workflow.
                      </p>
                    </div>

                    <div className="rounded-[22px] bg-white/8 p-4 ring-1 ring-white/10">
                      <h3 className="text-base font-semibold text-white">
                        Does conversion improve quality?
                      </h3>
                      <p className="mt-2 text-sm leading-6 text-white/65">
                        Not by itself. Conversion can improve compatibility and sometimes
                        workflow efficiency, but it cannot recreate detail that was not in
                        the original file.
                      </p>
                    </div>
                  </div>
                </div>

                <div className="rounded-[30px] bg-white/10 p-6 ring-1 ring-white/10 shadow-[0_18px_55px_rgba(0,0,0,0.25)]">
                  <h2 className="text-2xl font-semibold tracking-tight">
                    Start converting
                  </h2>
                  <p className="mt-3 text-sm leading-6 text-white/65">
                    You can jump directly into the converter, start from a format guide,
                    or compare two formats first if you want a clearer sense of which
                    output makes the most sense for your use case.
                  </p>

                  <div className="mt-6 flex flex-wrap gap-3">
                    <Link
                      href="/converter"
                      className="inline-flex rounded-full bg-white px-5 py-2.5 text-sm font-semibold text-black transition hover:bg-white/90"
                    >
                      Go to Converter
                    </Link>

                    <Link
                      href="/compare"
                      className="inline-flex rounded-full bg-white/8 px-5 py-2.5 text-sm font-medium text-white/85 ring-1 ring-white/10 transition hover:bg-white/12 hover:text-white"
                    >
                      Compare formats
                    </Link>

                    <Link
                      href="/convert/mp4-to-mp3"
                      className="inline-flex rounded-full bg-white/8 px-5 py-2.5 text-sm font-medium text-white/85 ring-1 ring-white/10 transition hover:bg-white/12 hover:text-white"
                    >
                      Try MP4 to MP3
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