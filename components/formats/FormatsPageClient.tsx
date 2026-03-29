"use client";

import SimpleTopBar from "@/components/layout/SimpleTopBar";
import React, { useMemo } from "react";
import Link from "next/link";
import {
  audioFormats,
  videoFormats,
  imageFormats,
  allFormats,
} from "@/lib/formatData";

const cx = (...c: Array<string | false | null | undefined>) =>
  c.filter(Boolean).join(" ");

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

function SectionLabel({ children }: { children: React.ReactNode }) {
  return (
    <div className="text-[11px] font-semibold uppercase tracking-[0.22em] text-white/45">
      {children}
    </div>
  );
}

function GlassCard({
  children,
  className = "",
}: {
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <div
      className={cx(
        "rounded-[28px] border border-white/10 bg-white/[0.06] shadow-[0_24px_80px_rgba(0,0,0,0.24)] backdrop-blur-sm",
        className
      )}
    >
      {children}
    </div>
  );
}

function Pill({ children }: { children: React.ReactNode }) {
  return (
    <span className="rounded-full border border-white/10 bg-white/8 px-4 py-2 text-sm text-white/80">
      {children}
    </span>
  );
}

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
    <GlassCard className="p-6">
      <h2 className="text-2xl font-semibold tracking-tight text-white">{title}</h2>
      <p className="mt-3 text-sm leading-6 text-white/65">{desc}</p>

      <div className="mt-5 flex flex-wrap gap-3">
        {formats.map((format) => (
          <Link
            key={format.slug}
            href={`/formats/${format.slug}`}
            className="rounded-full border border-white/10 bg-white/8 px-4 py-2 text-sm font-medium text-white/85 transition hover:bg-white/12 hover:text-white"
          >
            {format.label}
          </Link>
        ))}
      </div>
    </GlassCard>
  );
}

function ExplorerFeature({
  title,
  desc,
}: {
  title: string;
  desc: string;
}) {
  return (
    <div className="rounded-[22px] border border-white/10 bg-white/[0.05] p-4">
      <div className="text-base font-semibold text-white">{title}</div>
      <p className="mt-2 text-sm leading-6 text-white/65">{desc}</p>
    </div>
  );
}

function LinkGridCard({
  href,
  title,
  desc,
}: {
  href: string;
  title: string;
  desc: string;
}) {
  return (
    <Link
      href={href}
      className="group rounded-[22px] border border-white/10 bg-white/[0.05] p-5 transition duration-300 hover:-translate-y-1 hover:bg-white/[0.08]"
    >
      <div className="text-base font-semibold text-white">{title}</div>
      <p className="mt-2 text-sm leading-6 text-white/65">{desc}</p>
    </Link>
  );
}

function AdTrailer() {
  return (
    <div className="sticky top-[104px]">
      <div className="relative overflow-hidden rounded-[30px] border border-white/10 bg-white/[0.06] p-4 shadow-[0_24px_80px_rgba(0,0,0,0.24)] backdrop-blur-sm">
        <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_top,rgba(168,85,247,0.14),transparent_35%),radial-gradient(circle_at_bottom,rgba(59,130,246,0.12),transparent_40%)]" />

        <div className="relative">
          <div className="mb-4 flex items-center justify-between gap-3">
            <div className="text-[12px] font-semibold text-white/70">
              Sponsored
            </div>
            <div className="text-[12px] text-white/40">
              Ads keep Converto free
            </div>
          </div>

          <div className="rounded-[24px] border border-white/10 bg-black/10 p-4">
            <div className="mb-4 space-y-2">
              <div className="h-3 w-24 rounded-full bg-white/10" />
              <div className="h-3 w-16 rounded-full bg-white/6" />
            </div>

            <div className="h-[620px] rounded-[22px] border border-white/10 bg-[radial-gradient(circle_at_center,rgba(99,102,241,0.10),transparent_45%),linear-gradient(180deg,rgba(255,255,255,0.02),rgba(255,255,255,0.01))]" />
          </div>
        </div>
      </div>
    </div>
  );
}

export default function FormatsPageClient() {
  const PAGE_MAX = "max-w-[1700px]";

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
    <>
      <SimpleTopBar shellMax={PAGE_MAX} />

      <main className="min-h-screen bg-[#151233] pt-4 text-white selection:bg-white/20">
        <div className="pointer-events-none fixed inset-0 -z-10">
          <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,rgba(168,85,247,0.22),transparent_55%),radial-gradient(ellipse_at_bottom,rgba(59,130,246,0.18),transparent_50%),radial-gradient(ellipse_at_center,rgba(255,255,255,0.06),transparent_45%)]" />
          <div className="absolute inset-0 opacity-20 [background:linear-gradient(to_right,rgba(255,255,255,0.035)_1px,transparent_1px),linear-gradient(to_bottom,rgba(255,255,255,0.035)_1px,transparent_1px)] [background-size:72px_72px]" />
        </div>

        <div className={cx("mx-auto px-4 py-10 sm:px-6 lg:px-8 lg:py-14", PAGE_MAX)}>
          <div className="grid items-start gap-6 xl:grid-cols-[280px_minmax(0,1fr)_280px] 2xl:grid-cols-[300px_minmax(0,1fr)_300px]">
            <aside className="hidden xl:block">
              <AdTrailer />
            </aside>

            <div className="min-w-0">
              <section className="relative overflow-hidden rounded-[34px] border border-white/10 bg-white/[0.07] px-6 py-8 shadow-[0_30px_100px_rgba(0,0,0,0.25)] sm:px-8 sm:py-10 lg:px-10 lg:py-12">
                <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_top_right,rgba(168,85,247,0.18),transparent_24%),radial-gradient(circle_at_bottom_left,rgba(59,130,246,0.14),transparent_30%)]" />

                <div className="relative grid gap-8 lg:grid-cols-[minmax(0,1.25fr)_minmax(320px,0.75fr)] lg:items-stretch">
                  <div>
                    <SectionLabel>Browse faster</SectionLabel>

                    <h1 className="mt-4 max-w-3xl text-4xl font-bold tracking-tight text-white sm:text-5xl lg:text-6xl">
                      Interactive format explorer
                    </h1>

                    <p className="mt-5 max-w-2xl text-sm leading-7 text-white/70 sm:text-base">
                      Explore Converto’s supported audio, video, and image formats in a
                      cleaner, more practical hub. Learn what each format is best for,
                      compare related options, and jump directly into the conversion
                      routes people use most.
                    </p>

                    <div className="mt-6 flex flex-wrap gap-3">
                      <Pill>Audio, video, and images</Pill>
                      <Pill>Guides + comparisons</Pill>
                      <Pill>Conversion-first workflows</Pill>
                    </div>

                    <div className="mt-8 flex flex-wrap gap-3">
                      <Link
                        href="/converter"
                        className="inline-flex rounded-full bg-white px-5 py-3 text-sm font-semibold text-black transition hover:bg-white/90"
                      >
                        Open Converter
                      </Link>

                      <Link
                        href="/compare"
                        className="inline-flex rounded-full border border-white/10 bg-white/8 px-5 py-3 text-sm font-medium text-white/85 transition hover:bg-white/12 hover:text-white"
                      >
                        Browse comparisons
                      </Link>
                    </div>
                  </div>

                  <GlassCard className="relative overflow-hidden p-5 sm:p-6">
                    <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_top,rgba(255,255,255,0.08),transparent_35%),radial-gradient(circle_at_bottom,rgba(99,102,241,0.16),transparent_40%)]" />
                    <div className="relative">
                      <SectionLabel>Format library</SectionLabel>

                      <div className="mt-4 grid gap-4">
                        <ExplorerFeature
                          title="Start with popular formats"
                          desc="MP3, MP4, PNG, WEBM, FLAC, and WEBP cover many of the most common listening, playback, image, and sharing workflows."
                        />
                        <ExplorerFeature
                          title="Compare before you convert"
                          desc="Use compare pages to understand compatibility, editing flexibility, streaming behavior, transparency support, and file size trade-offs."
                        />
                        <ExplorerFeature
                          title="Move faster from intent to action"
                          desc="Instead of browsing random extensions, jump from a format question directly into a practical conversion path that fits your use case."
                        />
                      </div>
                    </div>
                  </GlassCard>
                </div>
              </section>

              <section className="mt-10">
                <GlassCard className="p-6 sm:p-7">
                  <SectionLabel>Featured formats</SectionLabel>

                  <h2 className="mt-3 text-2xl font-semibold tracking-tight text-white sm:text-3xl">
                    Start with the formats people use the most
                  </h2>

                  <p className="mt-3 max-w-3xl text-sm leading-6 text-white/65">
                    These formats cover the most common everyday use cases, from audio
                    extraction and portable listening to browser playback, image
                    optimization, and broad compatibility across devices.
                  </p>

                  <div className="mt-6 grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
                    {featuredFormats.map((item) => (
                      <Link
                        key={item.href}
                        href={item.href}
                        className="group rounded-[22px] border border-white/10 bg-white/[0.05] p-5 transition duration-300 hover:-translate-y-1 hover:bg-white/[0.08]"
                      >
                        <div className="text-lg font-semibold text-white">{item.label}</div>
                        <p className="mt-2 text-sm leading-6 text-white/65">{item.note}</p>
                      </Link>
                    ))}
                  </div>
                </GlassCard>
              </section>

              <section className="mt-10 grid gap-6 xl:grid-cols-3">
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

              <section className="mt-10">
                <GlassCard className="p-6 sm:p-7">
                  <SectionLabel>Why this hub matters</SectionLabel>

                  <h2 className="mt-3 max-w-4xl text-2xl font-semibold tracking-tight text-white sm:text-3xl">
                    Choosing the right format saves time, space, and compatibility headaches
                  </h2>

                  <div className="mt-6 grid gap-4 md:grid-cols-2 xl:grid-cols-4">
                    <ExplorerFeature
                      title="Better compatibility"
                      desc="Some formats work better in browsers, some are better for editing, and others are simply easier to share."
                    />
                    <ExplorerFeature
                      title="Smaller or more flexible files"
                      desc="A good converter is not only about changing extensions. It is also about portability, storage, and workflow fit."
                    />
                    <ExplorerFeature
                      title="Clearer conversion decisions"
                      desc="Users often need the right output for one task, like extracting audio, uploading to a site, or opening an older file."
                    />
                    <ExplorerFeature
                      title="Less guesswork"
                      desc="These pages focus on practical use cases so users can move from confusion to action much faster."
                    />
                  </div>
                </GlassCard>
              </section>

              <section className="mt-10">
                <GlassCard className="p-6 sm:p-7">
                  <SectionLabel>Format guides</SectionLabel>

                  <h2 className="mt-3 text-2xl font-semibold tracking-tight text-white sm:text-3xl">
                    Explore detailed guides for all supported formats
                  </h2>

                  <p className="mt-3 max-w-3xl text-sm leading-6 text-white/65">
                    Each guide explains what the format is, where it fits best, what it is
                    commonly compared with, and which conversion paths are the most useful
                    for real-world compatibility, playback, editing, or optimization.
                  </p>

                  <div className="mt-6 grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
                    {formatGuides.map((item) => (
                      <LinkGridCard
                        key={item.href}
                        href={item.href}
                        title={item.label}
                        desc={item.desc}
                      />
                    ))}
                  </div>
                </GlassCard>
              </section>

              <section className="mt-10">
                <GlassCard className="p-6 sm:p-7">
                  <SectionLabel>Format comparisons</SectionLabel>

                  <h2 className="mt-3 text-2xl font-semibold tracking-tight text-white sm:text-3xl">
                    Compare similar formats before you convert
                  </h2>

                  <p className="mt-3 max-w-3xl text-sm leading-6 text-white/65">
                    Some formats seem similar until you look at playback support, editing
                    flexibility, streaming use, transparency, or file size behavior. These
                    compare pages help users choose the better fit before converting.
                  </p>

                  <div className="mt-6 grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
                    {compareGuides.map((item) => (
                      <LinkGridCard
                        key={item.href}
                        href={item.href}
                        title={item.label}
                        desc={item.desc}
                      />
                    ))}
                  </div>

                  <div className="mt-6">
                    <Link
                      href="/compare"
                      className="inline-flex rounded-full bg-white px-5 py-3 text-sm font-semibold text-black transition hover:bg-white/90"
                    >
                      Open compare hub
                    </Link>
                  </div>
                </GlassCard>
              </section>

              <section className="mt-10">
                <GlassCard className="p-6 sm:p-7">
                  <SectionLabel>Popular conversions</SectionLabel>

                  <h2 className="mt-3 text-2xl font-semibold tracking-tight text-white sm:text-3xl">
                    Common format changes people make every day
                  </h2>

                  <p className="mt-3 max-w-3xl text-sm leading-6 text-white/65">
                    These routes cover some of the most common reasons people convert
                    files: extracting audio, reducing size, improving compatibility,
                    creating web-friendly assets, or making older files easier to open.
                  </p>

                  <div className="mt-6 grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
                    {popularConversions.map((item) => (
                      <LinkGridCard
                        key={item.href}
                        href={item.href}
                        title={item.label}
                        desc={item.desc}
                      />
                    ))}
                  </div>
                </GlassCard>
              </section>

              <section className="mt-10 grid gap-6 xl:grid-cols-[1.15fr_0.85fr]">
                <GlassCard className="p-6 sm:p-7">
                  <h2 className="text-2xl font-semibold tracking-tight text-white sm:text-3xl">
                    Practical format questions users usually have
                  </h2>

                  <div className="mt-5 space-y-4">
                    <ExplorerFeature
                      title="Which format is the safest all-around choice?"
                      desc="For video, MP4 is usually the safest broad-compatibility option. For audio, MP3 remains the most universal. For web-focused images, JPG, PNG, WEBP, and AVIF each serve different needs."
                    />
                    <ExplorerFeature
                      title="When should I convert instead of keeping the original file?"
                      desc="Convert when you need better compatibility, smaller file sizes, audio extraction, easier sharing, or a format that fits a specific browser, app, or editing workflow."
                    />
                    <ExplorerFeature
                      title="Does conversion improve quality?"
                      desc="Not by itself. Conversion can improve compatibility and sometimes workflow efficiency, but it cannot recreate detail that was not in the original file."
                    />
                  </div>
                </GlassCard>

                <GlassCard className="p-6 sm:p-7">
                  <h2 className="text-2xl font-semibold tracking-tight text-white sm:text-3xl">
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
                      className="inline-flex rounded-full bg-white px-5 py-3 text-sm font-semibold text-black transition hover:bg-white/90"
                    >
                      Go to Converter
                    </Link>

                    <Link
                      href="/compare"
                      className="inline-flex rounded-full border border-white/10 bg-white/8 px-5 py-3 text-sm font-medium text-white/85 transition hover:bg-white/12 hover:text-white"
                    >
                      Compare formats
                    </Link>

                    <Link
                      href="/convert/mp4-to-mp3"
                      className="inline-flex rounded-full border border-white/10 bg-white/8 px-5 py-3 text-sm font-medium text-white/85 transition hover:bg-white/12 hover:text-white"
                    >
                      Try MP4 to MP3
                    </Link>
                  </div>
                </GlassCard>
              </section>
            </div>

            <aside className="hidden xl:block">
              <AdTrailer />
            </aside>
          </div>
        </div>
      </main>
    </>
  );
}