"use client";

import SimpleTopBar from "@/components/layout/SimpleTopBar";
import Footer from "@/components/landing/Footer";
import React, { useMemo, useState } from "react";
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
    leftSlug: "mp3",
    rightSlug: "wav",
    kind: "audio" as const,
  },
  {
    href: "/compare/flac-vs-mp3",
    label: "FLAC vs MP3",
    desc: "Understand the trade-off between lossless quality and smaller everyday listening files.",
    leftSlug: "flac",
    rightSlug: "mp3",
    kind: "audio" as const,
  },
  {
    href: "/compare/mp4-vs-webm",
    label: "MP4 vs WEBM",
    desc: "Compare universal playback with browser-oriented web delivery.",
    leftSlug: "mp4",
    rightSlug: "webm",
    kind: "video" as const,
  },
  {
    href: "/compare/mp4-vs-mov",
    label: "MP4 vs MOV",
    desc: "See how a sharing-first format compares with editing-oriented Apple workflows.",
    leftSlug: "mp4",
    rightSlug: "mov",
    kind: "video" as const,
  },
  {
    href: "/compare/aac-vs-mp3",
    label: "AAC vs MP3",
    desc: "Compare two common compressed audio formats for size, compatibility, and playback use.",
    leftSlug: "aac",
    rightSlug: "mp3",
    kind: "audio" as const,
  },
  {
    href: "/compare/png-vs-jpg",
    label: "PNG vs JPG",
    desc: "Compare transparency-friendly graphics with lightweight photo-friendly image delivery.",
    leftSlug: "png",
    rightSlug: "jpg",
    kind: "image" as const,
  },
];

const practicalQuestionItems = [
  {
    id: "safe-choice",
    icon: "shield" as const,
    title: "Which format is the safest all-around choice?",
    desc: "For video, MP4 is usually the safest broad-compatibility option. For audio, MP3 remains the most universal. For web-focused images, JPG, PNG, WEBP, and AVIF each serve different needs.",
    extraTitle: "Quick default picks",
    extraPoints: [
      "Use MP4 when you want the widest playback compatibility.",
      "Use MP3 when you want a portable, easy-to-share audio file.",
      "Use PNG for transparency, JPG for photos, and WEBP for lighter web delivery.",
    ],
  },
  {
    id: "convert-or-keep",
    icon: "switch" as const,
    title: "When should I convert instead of keeping the original file?",
    desc: "Convert when you need better compatibility, smaller file sizes, audio extraction, easier sharing, or a format that fits a specific browser, app, or editing workflow.",
    extraTitle: "Good reasons to convert",
    extraPoints: [
      "Your current file does not open smoothly on the target device or app.",
      "You need a smaller file for upload, email, or faster web delivery.",
      "You want a workflow-friendly format for editing, transparency, or extraction.",
    ],
  },
  {
    id: "quality",
    icon: "spark" as const,
    title: "Does conversion improve quality?",
    desc: "Not by itself. Conversion can improve compatibility and sometimes workflow efficiency, but it cannot recreate detail that was not in the original file.",
    extraTitle: "Quality rule of thumb",
    extraPoints: [
      "Conversion can preserve quality when you choose a suitable format and settings.",
      "Repeated lossy conversions usually reduce quality over time.",
      "If quality matters most, keep the original and export only when needed.",
    ],
  },
];

const quickFilters = ["Most used", "Audio", "Video", "Image"] as const;
type QuickFilter = (typeof quickFilters)[number];

const mostUsedFormats = [
  {
    href: "/formats/mp4",
    label: "MP4",
    category: "Video",
    note: "General-purpose video",
    bestFor: "Playback, uploads, sharing",
    kind: "video" as const,
  },
  {
    href: "/formats/mp3",
    label: "MP3",
    category: "Audio",
    note: "Universal audio",
    bestFor: "Listening, portability, compatibility",
    kind: "audio" as const,
  },
  {
    href: "/formats/png",
    label: "PNG",
    category: "Image",
    note: "Transparency-friendly image",
    bestFor: "Graphics, screenshots, transparency",
    kind: "image" as const,
  },
  {
    href: "/formats/webm",
    label: "WEBM",
    category: "Video",
    note: "Web-focused video",
    bestFor: "Browser playback, modern web use",
    kind: "video" as const,
  },
  {
    href: "/formats/flac",
    label: "FLAC",
    category: "Audio",
    note: "Lossless audio",
    bestFor: "Music archives, quality-first audio",
    kind: "audio" as const,
  },
  {
    href: "/formats/webp",
    label: "WEBP",
    category: "Image",
    note: "Modern web image",
    bestFor: "Small web images, fast pages",
    kind: "image" as const,
  },
];

function buildCategoryFeaturedFormats(
  formats: typeof allFormats,
  kind: "audio" | "video" | "image",
  category: "Audio" | "Video" | "Image",
) {
  return formats.map((format) => ({
    href: `/formats/${format.slug}`,
    label: format.label,
    category,
    note:
      kind === "audio"
        ? "Audio format"
        : kind === "video"
          ? "Video format"
          : "Image format",
    bestFor:
      kind === "audio"
        ? "Playback, extraction, portability"
        : kind === "video"
          ? "Playback, uploads, sharing"
          : "Compression, transparency, web use",
    kind,
  }));
}

const featuredFormatsByFilter: Record<QuickFilter, typeof mostUsedFormats> = {
  "Most used": mostUsedFormats,
  Audio: buildCategoryFeaturedFormats(audioFormats, "audio", "Audio"),
  Video: buildCategoryFeaturedFormats(videoFormats, "video", "Video"),
  Image: buildCategoryFeaturedFormats(imageFormats, "image", "Image"),
};

const featuredCopyByFilter: Record<
  QuickFilter,
  { title: string; desc: string }
> = {
  "Most used": {
    title: "Start with the formats people use the most",
    desc: "These formats cover the most common everyday use cases, from audio extraction and portable listening to browser playback, image optimization, and broad compatibility across devices.",
  },
  Audio: {
    title: "Browse audio formats for playback and extraction",
    desc: "Audio formats help users listen across devices, extract sound from video, reduce file size, and prepare files for music libraries, browsers, and mobile apps.",
  },
  Video: {
    title: "Browse video formats for playback and uploads",
    desc: "Video formats cover browser compatibility, sharing, uploads, older files, and the balance between quality, size, and playback support.",
  },
  Image: {
    title: "Browse image formats for web and design workflows",
    desc: "Image formats help with compression, transparency, screenshots, editing flexibility, web optimization, and graphics-first delivery.",
  },
};

const heroFormatChips = [
  "MP4",
  "MP3",
  "PNG",
  "WEBP",
  "FLAC",
  "WAV",
  "MOV",
  "JPG",
];

const pdfTools = [
  {
    href: "/convert/pdf?mode=images-to-pdf#pdf-converter",
    label: "Images to PDF",
    desc: "Turn image files into a simple document-ready PDF output.",
    icon: "image",
  },
  {
    href: "/convert/pdf?mode=merge-pdfs#pdf-converter",
    label: "Merge PDF",
    desc: "Combine documents and image-based pages into one cleaner PDF workflow.",
    icon: "merge",
  },
  {
    href: "/convert/pdf?mode=pdf-images#pdf-converter",
    label: "Mixed Merge",
    desc: "Combine PDFs together with JPG and PNG files.",
    icon: "layers",
  },
  {
    href: "/convert/pdf/split#pdf-converter",
    label: "Split PDF",
    desc: "Separate selected pages from a document without rebuilding the whole file.",
    icon: "split",
  },
  {
    href: "/convert/pdf/to-png#pdf-converter",
    label: "PDF to PNG",
    desc: "Create sharper page images for screenshots, previews, and handoff.",
    icon: "png",
  },
  {
    href: "/convert/pdf/to-jpg#pdf-converter",
    label: "PDF to JPG",
    desc: "Export pages as lightweight JPG previews for sharing, thumbnails, and uploads.",
    icon: "jpg",
  },
];

const extraPdfTools = [
  {
    href: "/convert/pdf/to-webp#pdf-converter",
    label: "PDF to WEBP",
    desc: "Export PDF pages as modern web-friendly WEBP images.",
    icon: "webp",
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
        "rounded-[28px] border border-violet-300/18 bg-[#272151]/66 shadow-[0_24px_80px_rgba(20,16,48,0.34)] transform-gpu transition duration-300 hover:border-violet-300/34 hover:shadow-[0_0_0_1px_rgba(139,92,246,0.18),0_28px_90px_rgba(75,60,160,0.30)]",
        className,
      )}
    >
      {children}
    </div>
  );
}

function Pill({ children }: { children: React.ReactNode }) {
  return (
    <span className="rounded-full border border-violet-200/14 bg-white/10 px-4 py-2 text-sm text-white/82 shadow-[inset_0_1px_0_rgba(255,255,255,0.08)] transition hover:border-violet-200/28 hover:bg-violet-400/14 hover:shadow-[0_0_22px_rgba(139,92,246,0.20)]">
      {children}
    </span>
  );
}

function FormatImageIcon({
  kind,
  className = "h-6 w-6",
}: {
  kind: "audio" | "video" | "image";
  className?: string;
}) {
  const src =
    kind === "audio"
      ? "/icons/formats/music-note.svg"
      : kind === "video"
        ? "/icons/formats/video.svg"
        : "/icons/formats/image.svg";

  const alt =
    kind === "audio"
      ? "Audio format icon"
      : kind === "video"
        ? "Video format icon"
        : "Image format icon";

  return (
    <img
      src={src}
      alt={alt}
      className={className}
      loading="eager"
      decoding="async"
    />
  );
}

function WaveIcon({ className = "" }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 64 40"
      fill="none"
      className={className}
      aria-hidden="true"
    >
      {[
        { x: 4, h: 12 },
        { x: 12, h: 24 },
        { x: 20, h: 16 },
        { x: 28, h: 30 },
        { x: 36, h: 18 },
        { x: 44, h: 34 },
        { x: 52, h: 14 },
      ].map((bar) => (
        <rect
          key={bar.x}
          x={bar.x}
          y={40 - bar.h}
          width="4"
          height={bar.h}
          rx="2"
          fill="currentColor"
        />
      ))}
    </svg>
  );
}

function FormatIconBadge({ kind }: { kind: "audio" | "video" | "image" }) {
  return (
    <div className="grid h-12 w-12 shrink-0 place-items-center rounded-2xl border border-white/70 bg-white shadow-[0_14px_34px_rgba(255,255,255,0.14)] transition duration-300 group-hover:scale-[1.06] group-hover:shadow-[0_0_34px_rgba(255,255,255,0.28)]">
      <FormatImageIcon
        kind={kind}
        className="h-6 w-6 object-contain brightness-0"
      />
    </div>
  );
}

function GroupVisual({ kind }: { kind: "audio" | "video" | "image" }) {
  return (
    <div className="rounded-[18px] border border-violet-200/14 bg-[#1f1b43]/72 px-3 py-3 text-white/62 shadow-[inset_0_1px_0_rgba(255,255,255,0.06)] transition duration-300 group-hover:border-violet-300/26 group-hover:bg-[#2d245e]/76 group-hover:text-white/78 group-hover:shadow-[0_0_28px_rgba(139,92,246,0.18)]">
      {kind === "audio" ? (
        <WaveIcon className="h-12 w-24" />
      ) : kind === "video" ? (
        <div className="grid h-12 w-24 place-items-center">
          <img
            src="/icons/formats/video-play.png"
            alt="Video format visual"
            className="h-10 w-10 object-contain opacity-85"
            loading="eager"
            decoding="async"
          />
        </div>
      ) : (
        <div className="grid h-12 w-24 place-items-center overflow-hidden">
          <img
            src="/icons/formats/image-brush.png"
            alt="Image format visual"
            className="h-10 w-24 object-contain opacity-90 mix-blend-screen"
            loading="eager"
            decoding="async"
          />
        </div>
      )}
    </div>
  );
}

function MiniStat({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-[20px] border border-violet-200/14 bg-[#1f1b43]/64 p-4 shadow-[inset_0_1px_0_rgba(255,255,255,0.06)] transition duration-300 hover:border-violet-300/26 hover:bg-[#2b2459]/72 hover:shadow-[0_0_26px_rgba(99,102,241,0.18)]">
      <div className="text-2xl font-semibold tracking-tight text-white">
        {value}
      </div>
      <div className="mt-1 text-xs leading-5 text-white/55">{label}</div>
    </div>
  );
}

function HeroFormatPanel() {
  return (
    <GlassCard className="relative overflow-hidden p-5 sm:p-6">
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_top,rgba(167,139,250,0.14),transparent_36%),radial-gradient(circle_at_bottom_right,rgba(59,130,246,0.22),transparent_44%)]" />
      <div className="pointer-events-none absolute -right-16 -top-16 h-44 w-44 rounded-full bg-violet-400/28 blur-3xl" />
      <div className="pointer-events-none absolute -bottom-20 -left-16 h-44 w-44 rounded-full bg-blue-400/20 blur-3xl" />

      <div className="relative">
        <div className="flex items-center justify-between gap-4">
          <SectionLabel>Format library</SectionLabel>
          <span className="rounded-full border border-violet-200/18 bg-white/10 px-3 py-1 text-[11px] font-semibold text-violet-100 shadow-[0_0_20px_rgba(139,92,246,0.16)]">
            Updated hub
          </span>
        </div>

        <div className="mt-5 grid grid-cols-3 gap-3">
          <MiniStat label="audio guides" value={String(audioFormats.length)} />
          <MiniStat label="video guides" value={String(videoFormats.length)} />
          <MiniStat label="image guides" value={String(imageFormats.length)} />
        </div>

        <div className="mt-5 rounded-[24px] border border-white/10 bg-white/[0.055] p-4">
          <div className="mb-3 flex items-center justify-between gap-3">
            <div className="text-sm font-semibold text-white">
              Popular formats
            </div>
            <div className="text-xs text-white/40">
              browse → compare → convert
            </div>
          </div>

          <div className="flex flex-wrap gap-2">
            {heroFormatChips.map((item) => (
              <Link
                key={item}
                href={`/formats/${item.toLowerCase()}`}
                className="rounded-full border border-violet-200/14 bg-white/9 px-3 py-1.5 text-xs font-semibold text-white/78 transition duration-300 hover:border-violet-200/34 hover:bg-violet-400/16 hover:text-white hover:shadow-[0_0_20px_rgba(139,92,246,0.22)]"
              >
                {item}
              </Link>
            ))}
          </div>
        </div>

        <div className="mt-4 grid gap-3 sm:grid-cols-2">
          <Link
            href="/compare"
            className="group rounded-[22px] border border-violet-200/14 bg-white/[0.065] p-4 transition duration-300 hover:-translate-y-0.5 hover:border-violet-200/30 hover:bg-violet-400/[0.10] hover:shadow-[0_0_30px_rgba(139,92,246,0.18)]"
          >
            <div className="text-sm font-semibold text-white">
              Compare choices
            </div>
            <p className="mt-1 text-xs leading-5 text-white/55">
              Understand size, quality, compatibility, and use cases before
              converting.
            </p>
          </Link>

          <Link
            href="/converter"
            className="group rounded-[22px] border border-violet-200/14 bg-white/[0.065] p-4 transition duration-300 hover:-translate-y-0.5 hover:border-violet-200/30 hover:bg-violet-400/[0.10] hover:shadow-[0_0_30px_rgba(139,92,246,0.18)]"
          >
            <div className="text-sm font-semibold text-white">
              Convert faster
            </div>
            <p className="mt-1 text-xs leading-5 text-white/55">
              Jump from a format guide directly into a practical conversion
              workflow.
            </p>
          </Link>
        </div>
      </div>
    </GlassCard>
  );
}

function CategoryBadge({ category }: { category: string }) {
  return (
    <span className="rounded-full border border-violet-200/14 bg-white/9 px-3 py-1 text-[11px] font-semibold uppercase tracking-[0.14em] text-white/58 shadow-[inset_0_1px_0_rgba(255,255,255,0.06)]">
      {category}
    </span>
  );
}

function FeaturedFormatCard({
  href,
  label,
  category,
  note,
  bestFor,
  kind,
}: {
  href: string;
  label: string;
  category: string;
  note: string;
  bestFor: string;
  kind: "audio" | "video" | "image";
}) {
  return (
    <Link
      href={href}
      className="group relative overflow-hidden rounded-[26px] border border-violet-200/14 bg-[#292351]/70 p-5 transition duration-300 hover:-translate-y-1 hover:border-violet-300/34 hover:bg-[#33296b]/78 hover:shadow-[0_0_0_1px_rgba(139,92,246,0.18),0_24px_72px_rgba(87,70,180,0.32)]"
    >
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_top_right,rgba(255,255,255,0.10),transparent_30%),radial-gradient(circle_at_bottom_left,rgba(99,102,241,0.12),transparent_35%)] opacity-80" />
      <div className="pointer-events-none absolute -right-8 -top-8 h-24 w-24 rounded-full bg-white/10 blur-2xl transition group-hover:bg-white/15" />

      <div className="relative flex items-start justify-between gap-4">
        <div>
          <CategoryBadge category={category} />
          <div className="mt-4 text-3xl font-black tracking-tight text-white">
            {label}
          </div>
        </div>

        <FormatIconBadge kind={kind} />
      </div>

      <div className="relative mt-4 text-base font-semibold text-white">
        {note}
      </div>
      <p className="relative mt-2 text-sm leading-6 text-white/62">
        Best for: {bestFor}.
      </p>

      <div className="relative mt-4 inline-flex text-sm font-semibold text-white/78 transition group-hover:text-white">
        Open guide →
      </div>
    </Link>
  );
}

function ExplorerFeature({ title, desc }: { title: string; desc: string }) {
  return (
    <div className="rounded-[22px] border border-violet-200/14 bg-[#292351]/62 p-4 transition duration-300 hover:-translate-y-0.5 hover:border-violet-300/30 hover:bg-[#33296b]/70 hover:shadow-[0_0_28px_rgba(139,92,246,0.18)]">
      <div className="text-base font-semibold text-white">{title}</div>
      <p className="relative mt-2 text-sm leading-6 text-white/65">{desc}</p>
    </div>
  );
}

type PracticalQuestionIconKind = "shield" | "switch" | "spark";

function PracticalQuestionIcon({
  kind,
  className = "h-8 w-8",
}: {
  kind: PracticalQuestionIconKind;
  className?: string;
}) {
  const shared = {
    fill: "none",
    stroke: "currentColor",
    strokeWidth: 1.9,
    strokeLinecap: "round" as const,
    strokeLinejoin: "round" as const,
  };

  if (kind === "shield") {
    return (
      <svg viewBox="0 0 24 24" className={className} aria-hidden="true">
        <path {...shared} d="M12 3.8 18.5 6v5.4c0 4.2-2.7 7.9-6.5 8.9-3.8-1-6.5-4.7-6.5-8.9V6L12 3.8Z" />
        <path {...shared} d="m8.8 12.4 2.1 2.1 4.3-4.7" />
      </svg>
    );
  }

  if (kind === "switch") {
    return (
      <svg viewBox="0 0 24 24" className={className} aria-hidden="true">
        <path {...shared} d="M17.5 7.8a6.5 6.5 0 0 0-10.1 1" />
        <path {...shared} d="m16.9 4.9 1 2.9-3 .6" />
        <path {...shared} d="M6.5 16.2a6.5 6.5 0 0 0 10.1-1" />
        <path {...shared} d="m7.1 19.1-1-2.9 3-.6" />
      </svg>
    );
  }

  return (
    <svg viewBox="0 0 24 24" className={className} aria-hidden="true">
      <path {...shared} d="m12 4.8 1.6 3.8 3.8 1.6-3.8 1.6-1.6 3.8-1.6-3.8-3.8-1.6 3.8-1.6L12 4.8Z" />
      <path {...shared} d="m17.5 13.8.8 1.9 1.9.8-1.9.8-.8 1.9-.8-1.9-1.9-.8 1.9-.8.8-1.9Z" />
    </svg>
  );
}

function PracticalChevron({ open }: { open: boolean }) {
  return (
    <svg
      viewBox="0 0 24 24"
      aria-hidden="true"
      className={cx(
        "h-7 w-7 text-violet-200/80 transition duration-300",
        open && "rotate-180 text-violet-100",
      )}
    >
      <path
        d="m6 9 6 6 6-6"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

function PracticalQuestionCard({
  title,
  desc,
  icon,
  extraTitle,
  extraPoints,
  open,
  onToggle,
}: {
  title: string;
  desc: string;
  icon: PracticalQuestionIconKind;
  extraTitle: string;
  extraPoints: string[];
  open: boolean;
  onToggle: () => void;
}) {
  return (
    <div className="rounded-[22px] border border-violet-200/14 bg-[#292351]/62 transition duration-300 hover:border-violet-300/30 hover:bg-[#33296b]/70 hover:shadow-[0_0_28px_rgba(139,92,246,0.18)]">
      <button
        type="button"
        onClick={onToggle}
        className="flex w-full items-start gap-4 p-4 text-left"
        aria-expanded={open}
      >
        <div className="grid h-14 w-14 shrink-0 place-items-center rounded-full border border-violet-300/26 bg-[radial-gradient(circle_at_top,rgba(167,139,250,0.26),transparent_70%),rgba(55,43,112,0.78)] text-violet-100 shadow-[inset_0_1px_0_rgba(255,255,255,0.08),0_0_20px_rgba(139,92,246,0.16)]">
          <PracticalQuestionIcon kind={icon} className="h-7 w-7" />
        </div>

        <div className="min-w-0 flex-1">
          <div className="flex items-start gap-4">
            <div className="min-w-0 flex-1">
              <div className="text-base font-semibold leading-tight text-white sm:text-[1.02rem]">
                {title}
              </div>
              <p className="mt-2 text-sm leading-6 text-white/65">
                {desc}
              </p>
            </div>
            <div className="pt-1">
              <PracticalChevron open={open} />
            </div>
          </div>

          {open ? (
            <div className="mt-3 border-t border-violet-200/12 pt-3">
              <div className="text-xs font-semibold uppercase tracking-[0.18em] text-violet-100/60">
                {extraTitle}
              </div>
              <ul className="mt-2 space-y-2 text-xs leading-5 text-white/64 sm:text-sm sm:leading-6">
                {extraPoints.map((point) => (
                  <li key={point} className="flex gap-2">
                    <span className="mt-[9px] h-1.5 w-1.5 shrink-0 rounded-full bg-violet-300/80 shadow-[0_0_10px_rgba(167,139,250,0.45)]" />
                    <span>{point}</span>
                  </li>
                ))}
              </ul>
            </div>
          ) : null}
        </div>
      </button>
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
      className="group relative overflow-hidden rounded-[22px] border border-violet-200/14 bg-[#292351]/62 p-5 transition duration-300 hover:-translate-y-1 hover:border-violet-300/30 hover:bg-[#33296b]/76 hover:shadow-[0_0_0_1px_rgba(139,92,246,0.16),0_22px_58px_rgba(67,56,160,0.24)]"
    >
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_top_right,rgba(139,92,246,0.16),transparent_30%)] opacity-0 transition duration-300 group-hover:opacity-100" />
      <div className="pointer-events-none absolute -right-10 -top-10 h-24 w-24 rounded-full bg-violet-400/0 blur-2xl transition duration-300 group-hover:bg-violet-400/18" />
      <div className="relative text-base font-semibold text-white">{title}</div>
      <p className="relative mt-2 text-sm leading-6 text-white/65">{desc}</p>
    </Link>
  );
}



type FormatVisual = {
  icon: string;
  watermark: string;
  tag: string;
};

const formatVisualBySlug: Record<string, FormatVisual> = {
  mp3: { icon: "music", watermark: "music", tag: "Popular" },
  wav: { icon: "wave", watermark: "audio-file", tag: "Lossless" },
  aac: { icon: "broadcast", watermark: "music-file", tag: "Efficient" },
  m4a: { icon: "music", watermark: "music-file", tag: "Apple" },
  flac: { icon: "wave", watermark: "wave", tag: "Lossless" },
  ogg: { icon: "hex", watermark: "open-circle", tag: "Open Source" },
  opus: { icon: "signal", watermark: "disc", tag: "Modern" },
  wma: { icon: "play-square", watermark: "media-file", tag: "Windows" },
  amr: { icon: "mic", watermark: "mic", tag: "Mobile" },
  aiff: { icon: "wave", watermark: "audio-file", tag: "Apple" },
  mp4: { icon: "film", watermark: "film", tag: "Popular" },
  webm: { icon: "browser-play", watermark: "screen-play", tag: "Web Optimized" },
  mov: { icon: "clapper", watermark: "play-card", tag: "Apple" },
  mkv: { icon: "film", watermark: "film-stack", tag: "Advanced" },
  avi: { icon: "play-square", watermark: "screen-play", tag: "Legacy" },
  gif: { icon: "spark-image", watermark: "image-frame", tag: "Animated" },
  png: { icon: "image-card", watermark: "image-frame", tag: "Transparent" },
  jpg: { icon: "image-card", watermark: "photo", tag: "Photo" },
  bmp: { icon: "pixels", watermark: "image-frame", tag: "Simple" },
  tiff: { icon: "layers", watermark: "layers", tag: "Design" },
  webp: { icon: "browser-play", watermark: "screen-play", tag: "Web" },
  ico: { icon: "app", watermark: "app", tag: "Icon" },
  avif: { icon: "spark", watermark: "diamond-frame", tag: "Modern" },
};

function formatCategoryLabel(category: "audio" | "video" | "image") {
  if (category === "audio") return "Audio";
  if (category === "video") return "Video";
  return "Image";
}

function getFormatVisual(item: (typeof allFormats)[number]): FormatVisual {
  return (
    formatVisualBySlug[item.slug] ?? {
      icon:
        item.category === "audio"
          ? "wave"
          : item.category === "video"
            ? "film"
            : "image-card",
      watermark:
        item.category === "audio"
          ? "audio-file"
          : item.category === "video"
            ? "screen-play"
            : "image-frame",
      tag:
        item.category === "audio"
          ? "Audio"
          : item.category === "video"
            ? "Video"
            : "Image",
    }
  );
}

function FormatSymbol({
  variant,
  className = "h-6 w-6",
}: {
  variant: string;
  className?: string;
}) {
  const shared = {
    fill: "none",
    stroke: "currentColor",
    strokeWidth: 2.4,
    strokeLinecap: "round" as const,
    strokeLinejoin: "round" as const,
  };

  const render = () => {
    switch (variant) {
      case "music":
        return <path {...shared} d="M24 14v22a4.5 4.5 0 1 1-4-4.47V18l18-4v16a4.5 4.5 0 1 1-4-4.47V10l-10 2.22Z" />;
      case "wave":
        return (
          <>
            <path {...shared} d="M10 28h2" />
            <path {...shared} d="M18 18v20" />
            <path {...shared} d="M26 10v28" />
            <path {...shared} d="M34 16v16" />
            <path {...shared} d="M42 12v24" />
            <path {...shared} d="M50 22v8" />
          </>
        );
      case "broadcast":
      case "signal":
        return (
          <>
            <circle cx="30" cy="24" r="3.4" fill="currentColor" />
            <path {...shared} d="M22 16a12 12 0 0 1 0 16" />
            <path {...shared} d="M38 16a12 12 0 0 0 0 16" />
            <path {...shared} d="M16 10a20 20 0 0 1 0 28" />
            <path {...shared} d="M44 10a20 20 0 0 0 0 28" />
          </>
        );
      case "hex":
        return <path {...shared} d="M22 10h16l8 14-8 14H22l-8-14 8-14Z" />;
      case "open-circle":
        return (
          <>
            <circle cx="30" cy="24" r="14" {...shared} />
            <circle cx="30" cy="24" r="4" fill="currentColor" />
          </>
        );
      case "play-square":
        return (
          <>
            <rect x="12" y="10" width="36" height="28" rx="7" {...shared} />
            <path d="M26 18.5 37 24l-11 5.5Z" fill="currentColor" />
          </>
        );
      case "mic":
        return (
          <>
            <rect x="22" y="8" width="16" height="23" rx="8" {...shared} />
            <path {...shared} d="M16 24a14 14 0 1 0 28 0" />
            <path {...shared} d="M30 38v8" />
            <path {...shared} d="M22 46h16" />
          </>
        );
      case "film":
        return (
          <>
            <rect x="12" y="10" width="36" height="28" rx="4" {...shared} />
            <path {...shared} d="M22 10v28" />
            <path {...shared} d="M38 10v28" />
            <path {...shared} d="M12 18h10" />
            <path {...shared} d="M38 18h10" />
            <path {...shared} d="M12 30h10" />
            <path {...shared} d="M38 30h10" />
          </>
        );
      case "browser-play":
      case "screen-play":
        return (
          <>
            <rect x="10" y="11" width="40" height="26" rx="5" {...shared} />
            <path {...shared} d="M10 18h40" />
            <path d="M27 23.5 36 28l-9 4.5Z" fill="currentColor" />
          </>
        );
      case "clapper":
        return (
          <>
            <path {...shared} d="M12 18h36v20H12z" />
            <path {...shared} d="M12 18 21 10h27v8Z" />
            <path {...shared} d="M22 10l6 8" />
            <path {...shared} d="M32 10l6 8" />
          </>
        );
      case "image-card":
      case "image-frame":
      case "photo":
        return (
          <>
            <rect x="10" y="10" width="40" height="28" rx="6" {...shared} />
            <circle cx="21" cy="18" r="3.2" fill="currentColor" />
            <path {...shared} d="M17 33l9-9 8 7 6-5 7 7" />
          </>
        );
      case "layers":
        return (
          <>
            <path {...shared} d="M30 10 48 20 30 30 12 20 30 10Z" />
            <path {...shared} d="M18 26l12 7 12-7" />
            <path {...shared} d="M18 33l12 7 12-7" />
          </>
        );
      case "pixels":
        return (
          <>
            <rect x="14" y="12" width="10" height="10" rx="2" {...shared} />
            <rect x="26" y="12" width="10" height="10" rx="2" {...shared} />
            <rect x="38" y="12" width="10" height="10" rx="2" {...shared} />
            <rect x="14" y="24" width="10" height="10" rx="2" {...shared} />
            <rect x="26" y="24" width="10" height="10" rx="2" {...shared} />
          </>
        );
      case "app":
        return (
          <>
            <rect x="14" y="10" width="32" height="32" rx="8" {...shared} />
            <path {...shared} d="M24 18h12v12H24z" />
            <path {...shared} d="M20 30h4" />
            <path {...shared} d="M36 30h4" />
          </>
        );
      case "spark":
        return (
          <>
            <path {...shared} d="M30 10l4.5 9.5L44 24l-9.5 4.5L30 38l-4.5-9.5L16 24l9.5-4.5L30 10Z" />
            <path {...shared} d="M46 10l1.8 3.8L52 16l-4.2 2.2L46 22l-1.8-3.8L40 16l4.2-2.2L46 10Z" />
          </>
        );
      case "spark-image":
        return (
          <>
            <rect x="10" y="10" width="40" height="28" rx="6" {...shared} />
            <path {...shared} d="M17 33l9-9 8 7 6-5 7 7" />
            <path {...shared} d="M20 14l1.8 3.5L25 19l-3.2 1.5L20 24l-1.8-3.5L15 19l3.2-1.5L20 14Z" />
          </>
        );
      case "diamond-frame":
        return (
          <>
            <path {...shared} d="M30 10l16 14-16 14L14 24 30 10Z" />
            <path {...shared} d="M18 24h24" />
          </>
        );
      case "music-file":
      case "audio-file":
      case "play-card":
      case "media-file":
        return (
          <>
            <path {...shared} d="M18 10h18l10 10v18a4 4 0 0 1-4 4H18a4 4 0 0 1-4-4V14a4 4 0 0 1 4-4Z" />
            <path {...shared} d="M36 10v10h10" />
            {variant === "audio-file" ? <path {...shared} d="M25 31h10" /> : null}
            {variant === "media-file" ? <path d="M26 25.5 35 30l-9 4.5Z" fill="currentColor" /> : null}
            {variant === "play-card" ? <path d="M26 25.5 35 30l-9 4.5Z" fill="currentColor" /> : null}
            {variant === "music-file" ? <path {...shared} d="M29 23v11a3 3 0 1 1-2.5-2.95V25l9-2v8a3 3 0 1 1-2.5-2.95v-5l-4 1Z" /> : null}
          </>
        );
      case "film-stack":
        return (
          <>
            <rect x="14" y="12" width="20" height="24" rx="3" {...shared} />
            <rect x="30" y="16" width="18" height="20" rx="3" {...shared} />
            <path {...shared} d="M20 12v24" />
            <path {...shared} d="M14 19h6" />
            <path {...shared} d="M14 28h6" />
          </>
        );
      case "disc":
        return (
          <>
            <circle cx="30" cy="24" r="14" {...shared} />
            <circle cx="30" cy="24" r="4" {...shared} />
          </>
        );
      default:
        return <path {...shared} d="M30 10l16 14-16 14L14 24 30 10Z" />;
    }
  };

  return (
    <svg viewBox="0 0 60 48" fill="none" className={className} aria-hidden="true">
      {render()}
    </svg>
  );
}

function formatGuideSummary(item: (typeof allFormats)[number]) {
  return item.metaDescription.replace(/\s+with Converto\.?$/i, " with Converto.");
}

function FormatGuideCard({ item }: { item: (typeof allFormats)[number] }) {
  const visual = getFormatVisual(item);
  const category = formatCategoryLabel(item.category);

  return (
    <Link
      href={`/formats/${item.slug}`}
      className="group relative overflow-hidden rounded-[24px] border border-violet-200/14 bg-[#221c49]/72 p-5 transition duration-300 hover:-translate-y-1 hover:border-violet-300/34 hover:bg-[#2c245d]/80 hover:shadow-[0_0_0_1px_rgba(139,92,246,0.18),0_24px_72px_rgba(67,56,160,0.30)]"
    >
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_top_right,rgba(139,92,246,0.16),transparent_28%),radial-gradient(circle_at_bottom_left,rgba(59,130,246,0.10),transparent_34%)] opacity-90" />
      <div className="pointer-events-none absolute right-3 top-1/2 hidden -translate-y-1/2 opacity-78 sm:block">
        <div className="absolute inset-0 scale-125 rounded-full bg-violet-400/12 blur-3xl" />
        <FormatSymbol
          variant={visual.watermark}
          className="relative h-32 w-32 text-violet-200/14 transition duration-300 group-hover:text-violet-100/20 xl:h-36 xl:w-36"
        />
      </div>

      <div className="relative pr-0 sm:pr-32 xl:pr-36">
        <div className="flex items-start gap-4">
          <div className="grid h-14 w-14 shrink-0 place-items-center rounded-2xl border border-violet-200/16 bg-gradient-to-br from-violet-300/18 to-blue-400/10 shadow-[inset_0_1px_0_rgba(255,255,255,0.12),0_0_24px_rgba(139,92,246,0.12)] transition duration-300 group-hover:scale-105 group-hover:border-violet-200/30 group-hover:from-violet-300/22 group-hover:to-blue-400/14 sm:h-16 sm:w-16">
            <FormatSymbol
              variant={visual.icon}
              className="h-10 w-10 text-white/92 sm:h-12 sm:w-12"
            />
          </div>

          <div className="min-w-0">
            <h3 className="text-[1.75rem] font-semibold leading-[1.08] tracking-tight text-white sm:text-[2rem]">
              {item.label} format guide
            </h3>
            <p className="mt-3 max-w-[26rem] text-sm leading-7 text-white/70">
              {formatGuideSummary(item)}
            </p>
          </div>
        </div>

        <div className="mt-4 flex flex-wrap gap-2.5">
          <span className="rounded-full border border-violet-200/14 bg-white/9 px-3 py-1 text-sm text-white/82 shadow-[inset_0_1px_0_rgba(255,255,255,0.06)]">
            {category}
          </span>
          <span className="rounded-full border border-violet-200/14 bg-white/9 px-3 py-1 text-sm text-white/82 shadow-[inset_0_1px_0_rgba(255,255,255,0.06)]">
            {visual.tag}
          </span>
        </div>
      </div>
    </Link>
  );
}

function CompareFormatChip({ slug }: { slug: string }) {
  const visual = formatVisualBySlug[slug] ?? { icon: "spark", tag: slug.toUpperCase() };

  return (
    <div className="flex min-w-[62px] flex-col items-center justify-center gap-2 rounded-[16px] border border-violet-200/14 bg-[linear-gradient(180deg,rgba(255,255,255,0.05),rgba(255,255,255,0.02))] px-3 py-3 shadow-[inset_0_1px_0_rgba(255,255,255,0.05)]">
      <div className="grid h-10 w-10 place-items-center rounded-xl border border-violet-200/16 bg-[radial-gradient(circle_at_top,rgba(167,139,250,0.20),transparent_70%),rgba(255,255,255,0.04)] text-white/90 shadow-[0_0_18px_rgba(139,92,246,0.10)]">
        <FormatSymbol variant={visual.icon} className="h-6 w-6" />
      </div>
      <div className="text-[11px] font-semibold uppercase tracking-[0.12em] text-white/76">
        {slug.toUpperCase()}
      </div>
    </div>
  );
}

function ComparisonKindBadge({ kind }: { kind: "audio" | "video" | "image" }) {
  return (
    <span className="rounded-full border border-violet-200/16 bg-violet-400/10 px-2.5 py-1 text-[10px] font-semibold uppercase tracking-[0.12em] text-violet-100/80 shadow-[inset_0_1px_0_rgba(255,255,255,0.04)]">
      {kind}
    </span>
  );
}

function CompareGuideCard({
  href,
  label,
  desc,
  leftSlug,
  rightSlug,
  kind,
}: {
  href: string;
  label: string;
  desc: string;
  leftSlug: string;
  rightSlug: string;
  kind: "audio" | "video" | "image";
}) {
  return (
    <Link
      href={href}
      className="group relative overflow-hidden rounded-[22px] border border-violet-200/14 bg-[linear-gradient(180deg,rgba(255,255,255,0.04),rgba(255,255,255,0.02))] p-4 transition duration-300 hover:-translate-y-0.5 hover:border-violet-300/30 hover:bg-[linear-gradient(180deg,rgba(97,79,220,0.16),rgba(255,255,255,0.04))] hover:shadow-[0_0_0_1px_rgba(139,92,246,0.16),0_22px_58px_rgba(67,56,160,0.24)]"
    >
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_top_right,rgba(139,92,246,0.14),transparent_28%),radial-gradient(circle_at_bottom_left,rgba(59,130,246,0.10),transparent_36%)] opacity-90" />
      <div className="relative flex items-start gap-4">
        <div className="hidden shrink-0 items-center gap-2 sm:flex">
          <CompareFormatChip slug={leftSlug} />
          <div className="grid h-8 w-8 place-items-center rounded-full border border-violet-200/14 bg-white/6 text-white/60">→</div>
          <CompareFormatChip slug={rightSlug} />
        </div>

        <div className="min-w-0 flex-1">
          <div className="flex items-start justify-between gap-3">
            <h3 className="text-lg font-bold leading-tight tracking-tight text-white">
              {label}
            </h3>
            <ComparisonKindBadge kind={kind} />
          </div>

          <p className="mt-2 max-w-[30rem] text-sm leading-6 text-white/68">
            {desc}
          </p>
        </div>
      </div>
    </Link>
  );
}

function HubFeatureIcon({
  kind,
  className = "h-6 w-6",
}: {
  kind: "compatibility" | "workflow" | "decision" | "guide";
  className?: string;
}) {
  const shared = {
    fill: "none",
    stroke: "currentColor",
    strokeWidth: 1.9,
    strokeLinecap: "round" as const,
    strokeLinejoin: "round" as const,
  };

  if (kind === "compatibility") {
    return (
      <svg viewBox="0 0 24 24" fill="none" className={className} aria-hidden="true">
        <path {...shared} d="M10.4 13.6 8.3 15.7a3 3 0 1 1-4.2-4.2l3.2-3.2a3 3 0 0 1 4.2 0" />
        <path {...shared} d="M13.6 10.4l2.1-2.1a3 3 0 1 1 4.2 4.2l-3.2 3.2a3 3 0 0 1-4.2 0" />
        <path {...shared} d="m8.8 12 6.4 0" />
      </svg>
    );
  }

  if (kind === "workflow") {
    return (
      <svg viewBox="0 0 24 24" fill="none" className={className} aria-hidden="true">
        <path {...shared} d="M7 3.8h6.7l4 4V19a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V5.8a2 2 0 0 1 2-2Z" />
        <path {...shared} d="M13.7 3.8v4h4" />
        <path {...shared} d="M12 10v7" />
        <path {...shared} d="m9.5 14.5 2.5 2.5 2.5-2.5" />
      </svg>
    );
  }

  if (kind === "decision") {
    return (
      <svg viewBox="0 0 24 24" fill="none" className={className} aria-hidden="true">
        <path {...shared} d="M12 20V8" />
        <path {...shared} d="m12 8-3-3" />
        <path {...shared} d="m12 8 3-3" />
        <path {...shared} d="M12 12c0 0-2 0-4 2.2C6.8 15.6 6 17.2 6 19" />
        <path {...shared} d="M12 12c0 0 2 0 4 2.2 1.2 1.4 2 3 2 4.8" />
      </svg>
    );
  }

  return (
    <svg viewBox="0 0 24 24" fill="none" className={className} aria-hidden="true">
      <circle cx="12" cy="12" r="7.5" {...shared} />
      <path {...shared} d="m12 9 1.8 3.2L17 12l-3.2 1.8L12 17l-1.8-3.2L7 12l3.2-1.8L12 9Z" />
    </svg>
  );
}

function HubQuestionCard({
  title,
  desc,
  kind,
}: {
  title: string;
  desc: string;
  kind: "compatibility" | "workflow" | "decision" | "guide";
}) {
  return (
    <div className="group relative min-h-[295px] overflow-hidden rounded-[24px] border border-violet-200/14 bg-[linear-gradient(180deg,rgba(255,255,255,0.045),rgba(255,255,255,0.02))] p-5 transition duration-300 hover:-translate-y-0.5 hover:border-violet-300/28 hover:bg-[linear-gradient(180deg,rgba(104,79,219,0.14),rgba(255,255,255,0.03))] hover:shadow-[0_0_0_1px_rgba(139,92,246,0.14),0_24px_68px_rgba(67,56,160,0.22)] sm:p-6">
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_top_right,rgba(139,92,246,0.14),transparent_30%)] opacity-90" />
      <div className="relative flex items-start gap-4">
        <div className="grid h-14 w-14 shrink-0 place-items-center rounded-2xl border border-violet-200/16 bg-[radial-gradient(circle_at_top,rgba(167,139,250,0.22),transparent_70%),rgba(255,255,255,0.05)] text-white/92 shadow-[inset_0_1px_0_rgba(255,255,255,0.08),0_0_22px_rgba(139,92,246,0.14)]">
          <HubFeatureIcon kind={kind} className="h-7 w-7" />
        </div>
        <div className="min-w-0">
          <h3 className="text-[1.65rem] font-semibold leading-[1.12] tracking-tight text-white sm:text-[1.85rem]">
            {title}
          </h3>
          <p className="mt-4 max-w-[22rem] text-[15px] leading-8 text-white/68">
            {desc}
          </p>
        </div>
      </div>

      <div className="pointer-events-none absolute inset-x-6 bottom-6 top-[58%] rounded-[22px] border border-violet-200/10 bg-[linear-gradient(180deg,rgba(255,255,255,0.018),rgba(255,255,255,0.005))]" />
      <div className="pointer-events-none absolute bottom-8 left-8 h-10 w-16 rounded-[10px] border border-violet-200/8 opacity-40" />
      <div className="pointer-events-none absolute bottom-10 left-10 grid gap-2 opacity-40">
        <div className="h-1.5 w-1.5 rounded-full bg-violet-200/50" />
        <div className="h-1.5 w-1.5 rounded-full bg-violet-200/50" />
        <div className="h-1.5 w-1.5 rounded-full bg-violet-200/50" />
      </div>
      <div className="pointer-events-none absolute bottom-6 right-8 text-violet-200/16 transition duration-300 group-hover:text-violet-200/22">
        <HubFeatureIcon kind={kind} className="h-36 w-36 sm:h-40 sm:w-40" />
      </div>
    </div>
  );
}

function NextStepOrbitVisual() {
  return (
    <div className="pointer-events-none absolute inset-0 hidden lg:block" aria-hidden="true">
      <div className="absolute inset-y-0 right-0 w-[58%] bg-[radial-gradient(circle_at_50%_68%,rgba(139,92,246,0.18),transparent_42%),radial-gradient(circle_at_88%_26%,rgba(96,165,250,0.10),transparent_18%)]" />
      <div className="absolute bottom-[20%] left-[3%] h-px w-[36%] bg-[linear-gradient(90deg,rgba(167,139,250,0.00),rgba(167,139,250,0.26),rgba(167,139,250,0.00))]" />
      <div className="absolute bottom-[18%] left-[0%] h-px w-[44%] bg-[linear-gradient(90deg,rgba(96,165,250,0.00),rgba(96,165,250,0.14),rgba(96,165,250,0.00))]" />
      <div className="absolute bottom-[14%] left-[1%] h-px w-[40%] bg-[linear-gradient(90deg,rgba(167,139,250,0.00),rgba(167,139,250,0.14),rgba(167,139,250,0.00))]" />
      <div className="absolute right-[17%] top-[48%] h-[210px] w-[210px] rounded-full border border-violet-200/14" />
      <div className="absolute right-[21%] top-[52%] h-[150px] w-[150px] rounded-full border border-violet-200/12" />
      <div className="absolute right-[25%] top-[56%] h-[90px] w-[90px] rounded-full border border-violet-200/10" />
      <div className="absolute right-[26.5%] top-[59%] grid h-[64px] w-[64px] place-items-center rounded-full border border-violet-200/18 bg-[radial-gradient(circle_at_top,rgba(167,139,250,0.22),transparent_70%),rgba(255,255,255,0.04)] text-violet-100 shadow-[0_0_26px_rgba(139,92,246,0.16)]">
        <svg viewBox="0 0 24 24" fill="none" className="h-8 w-8" aria-hidden="true">
          <path d="M7 12a5 5 0 0 1 8.5-3.5" stroke="currentColor" strokeWidth="1.9" strokeLinecap="round" strokeLinejoin="round" />
          <path d="m15.5 6.5.5 3.5-3.5-.5" stroke="currentColor" strokeWidth="1.9" strokeLinecap="round" strokeLinejoin="round" />
          <path d="M17 12a5 5 0 0 1-8.5 3.5" stroke="currentColor" strokeWidth="1.9" strokeLinecap="round" strokeLinejoin="round" />
          <path d="m8.5 17.5-.5-3.5 3.5.5" stroke="currentColor" strokeWidth="1.9" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
      </div>
      <div className="absolute left-[42%] bottom-[17%] rounded-[20px] border border-violet-200/12 bg-white/[0.03] px-6 py-7 text-[1.2rem] font-semibold text-violet-200/28">MOV</div>
      <div className="absolute left-[46%] bottom-[3%] rounded-[20px] border border-violet-200/12 bg-white/[0.03] px-6 py-7 text-[1.2rem] font-semibold text-violet-200/24">AVI</div>
      <div className="absolute right-[6%] top-[47%] rounded-[20px] border border-violet-200/12 bg-white/[0.03] px-6 py-7 text-[1.2rem] font-semibold text-violet-200/28">MP4</div>
      <div className="absolute right-[3%] bottom-[14%] rounded-[20px] border border-violet-200/12 bg-white/[0.03] px-6 py-7 text-[1.2rem] font-semibold text-violet-200/28">MP3</div>
      <div className="absolute right-[18%] bottom-[1%] rounded-[20px] border border-violet-200/12 bg-white/[0.03] px-6 py-7 text-[1.2rem] font-semibold text-violet-200/24">MKV</div>
      <div className="absolute left-[61%] top-[58%] text-violet-200/40">→</div>
      <div className="absolute left-[75%] top-[58%] text-violet-200/40">→</div>
      <div className="absolute left-[30%] bottom-[28%] h-1.5 w-1.5 rounded-full bg-violet-200/60 shadow-[0_0_12px_rgba(167,139,250,0.55)]" />
      <div className="absolute left-[56%] bottom-[30%] h-1.5 w-1.5 rounded-full bg-violet-200/60 shadow-[0_0_12px_rgba(167,139,250,0.55)]" />
      <div className="absolute left-[79%] bottom-[41%] h-1.5 w-1.5 rounded-full bg-violet-200/60 shadow-[0_0_12px_rgba(167,139,250,0.55)]" />
    </div>
  );
}

function FormatGroup({
  title,
  desc,
  formats,
  kind,
  helperText,
}: {
  title: string;
  desc: string;
  formats: typeof allFormats;
  kind: "audio" | "video" | "image";
  helperText: string;
}) {
  return (
    <GlassCard className="group relative overflow-hidden p-6">
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_top_right,rgba(255,255,255,0.05),transparent_28%),radial-gradient(circle_at_bottom_left,rgba(99,102,241,0.10),transparent_36%)]" />

      <div className="relative flex items-start justify-between gap-4">
        <div>
          <div className="inline-flex rounded-full border border-violet-200/14 bg-white/9 px-3 py-1 text-[11px] font-semibold uppercase tracking-[0.18em] text-white/60 shadow-[inset_0_1px_0_rgba(255,255,255,0.06)]">
            {kind}
          </div>

          <h2 className="mt-4 text-2xl font-semibold tracking-tight text-white">
            {title}
          </h2>
        </div>

        <GroupVisual kind={kind} />
      </div>

      <p className="relative mt-4 text-sm leading-7 text-white/65">{desc}</p>

      <div className="relative mt-5 rounded-full border border-violet-200/14 bg-[#1f1b43]/60 px-4 py-3 text-sm text-white/58 shadow-[inset_0_1px_0_rgba(255,255,255,0.06)]">
        {helperText} • {formats.length} guides
      </div>

      <div className="relative mt-5 flex flex-wrap gap-3">
        {formats.map((format) => (
          <Link
            key={format.slug}
            href={`/formats/${format.slug}`}
            className="rounded-full border border-violet-200/14 bg-white/9 px-4 py-2 text-sm font-medium text-white/85 transition duration-300 hover:border-violet-200/34 hover:bg-violet-400/16 hover:text-white hover:shadow-[0_0_20px_rgba(139,92,246,0.22)]"
          >
            {format.label}
          </Link>
        ))}
      </div>
    </GlassCard>
  );
}

type PdfIconKind =
  | "image"
  | "merge"
  | "layers"
  | "split"
  | "png"
  | "jpg"
  | "webp"
  | "doc"
  | "stack"
  | "eye";

function PdfIcon({
  kind,
  className = "h-6 w-6",
}: {
  kind: PdfIconKind;
  className?: string;
}) {
  const shared = {
    stroke: "currentColor",
    strokeWidth: 1.8,
    strokeLinecap: "round" as const,
    strokeLinejoin: "round" as const,
  };

  if (kind === "image") {
    return (
      <svg viewBox="0 0 24 24" fill="none" className={className} aria-hidden="true">
        <rect x="3.5" y="5" width="17" height="14" rx="3.2" {...shared} />
        <circle cx="9" cy="10" r="1.6" {...shared} />
        <path {...shared} d="M6.5 16l4-4 3 3 2.5-2.5L18.5 15" />
      </svg>
    );
  }

  if (kind === "merge") {
    return (
      <svg viewBox="0 0 24 24" fill="none" className={className} aria-hidden="true">
        <rect x="5" y="4.5" width="9.5" height="13" rx="2.4" {...shared} />
        <rect x="9.5" y="7.5" width="9.5" height="13" rx="2.4" {...shared} />
      </svg>
    );
  }

  if (kind === "layers") {
    return (
      <svg viewBox="0 0 24 24" fill="none" className={className} aria-hidden="true">
        <path {...shared} d="M12 4.8l7 3.8-7 3.8-7-3.8 7-3.8Z" />
        <path {...shared} d="M5 12.2l7 3.8 7-3.8" />
        <path {...shared} d="M5 15.8l7 3.8 7-3.8" />
      </svg>
    );
  }

  if (kind === "split") {
    return (
      <svg viewBox="0 0 24 24" fill="none" className={className} aria-hidden="true">
        <rect x="4" y="4.5" width="6.8" height="15" rx="2.2" {...shared} />
        <path {...shared} d="M13.2 4.5h6.8v15h-6.8" />
        <path {...shared} d="M14.5 8.5l-2.5 2.5 2.5 2.5" />
        <path {...shared} d="M9.5 15.5l2.5-2.5-2.5-2.5" />
      </svg>
    );
  }

  if (kind === "doc") {
    return (
      <svg viewBox="0 0 24 24" fill="none" className={className} aria-hidden="true">
        <path {...shared} d="M8 3.8h6.7l4 4V19a2 2 0 0 1-2 2H8A2 2 0 0 1 6 19V5.8a2 2 0 0 1 2-2Z" />
        <path {...shared} d="M14.7 3.8v4h4" />
        <path {...shared} d="M9 12h6" />
        <path {...shared} d="M9 15.5h6" />
      </svg>
    );
  }

  if (kind === "eye") {
    return (
      <svg viewBox="0 0 24 24" fill="none" className={className} aria-hidden="true">
        <path {...shared} d="M2.8 12s3.4-5.5 9.2-5.5 9.2 5.5 9.2 5.5-3.4 5.5-9.2 5.5S2.8 12 2.8 12Z" />
        <circle cx="12" cy="12" r="2.5" {...shared} />
      </svg>
    );
  }

  return (
    <svg viewBox="0 0 24 24" fill="none" className={className} aria-hidden="true">
      <path {...shared} d="M7.5 3.8h6.7l4 4V19a2 2 0 0 1-2 2H7.5a2 2 0 0 1-2-2V5.8a2 2 0 0 1 2-2Z" />
      <path {...shared} d="M14.2 3.8v4h4" />
      <path {...shared} d="M8.4 14.9h7.2" />
      <path {...shared} d="M8.4 17.8h7.2" />
      <path {...shared} d="M8.2 10.8h2.5" />
      <path {...shared} d="M13.3 10.8h2.5" />
    </svg>
  );
}

function PdfMetricCard({
  label,
  value,
  icon,
}: {
  label: string;
  value: string;
  icon: PdfIconKind;
}) {
  return (
    <div className="rounded-[24px] border border-violet-200/14 bg-[linear-gradient(180deg,rgba(255,255,255,0.06),rgba(255,255,255,0.025))] p-4 shadow-[inset_0_1px_0_rgba(255,255,255,0.05)] backdrop-blur-sm transition duration-300 hover:-translate-y-0.5 hover:border-violet-200/28 hover:shadow-[0_0_24px_rgba(139,92,246,0.18)]">
      <div className="flex items-start gap-4">
        <div className="grid h-16 w-16 shrink-0 place-items-center rounded-[20px] border border-violet-200/20 bg-[radial-gradient(circle_at_top,rgba(167,139,250,0.22),transparent_70%),rgba(255,255,255,0.04)] text-violet-100 shadow-[inset_0_1px_0_rgba(255,255,255,0.08),0_0_26px_rgba(139,92,246,0.16)]">
          <PdfIcon kind={icon} className="h-8 w-8" />
        </div>

        <div>
          <div className="text-[2.1rem] font-black leading-none tracking-tight text-white">
            {value}
          </div>
          <div className="mt-2 text-sm leading-6 text-white/62">{label}</div>
        </div>
      </div>
    </div>
  );
}

function PdfOrbitIllustration() {
  return (
    <div className="pointer-events-none absolute right-2 top-[208px] hidden h-[248px] w-[280px] lg:block xl:right-8 xl:top-[194px]">
      <div className="absolute inset-x-7 top-8 h-28 rounded-[28px] border border-violet-200/10 bg-white/[0.035] opacity-55 shadow-[inset_0_1px_0_rgba(255,255,255,0.04)]" />
      <div className="absolute right-8 top-0 h-32 w-28 rounded-[28px] border border-violet-200/10 bg-white/[0.035] opacity-40 shadow-[inset_0_1px_0_rgba(255,255,255,0.04)]" />
      <div className="absolute bottom-1 right-7 h-20 w-20 rounded-[22px] border border-violet-200/10 bg-white/[0.03] opacity-35" />

      <div className="absolute left-16 top-10 h-40 w-28 rounded-[26px] border border-violet-200/18 bg-[linear-gradient(180deg,rgba(159,122,234,0.30),rgba(76,56,160,0.42))] shadow-[0_18px_44px_rgba(82,55,180,0.26),inset_0_1px_0_rgba(255,255,255,0.12)]">
        <div className="absolute right-0 top-0 h-12 w-12 overflow-hidden rounded-bl-[18px] rounded-tr-[26px] border-l border-b border-violet-100/18 bg-white/14">
          <div className="absolute inset-0 -translate-x-1/2 -translate-y-1/2 rotate-45 bg-white/35" />
        </div>
        <div className="absolute bottom-10 left-0 right-0 flex items-center justify-center text-[2rem] font-black tracking-tight text-violet-100/92">
          PDF
        </div>
      </div>

      <div className="absolute left-2 top-[108px] h-7 w-7 rounded-full bg-violet-500/80 shadow-[0_0_20px_rgba(139,92,246,0.65)]" />
      <div className="absolute left-6 top-[112px] h-7 w-7 rotate-45 rounded-[8px] bg-violet-500/85 shadow-[0_0_24px_rgba(139,92,246,0.5)]" />
      <div className="absolute right-2 top-7 h-2 w-2 rounded-full bg-violet-200/80 shadow-[0_0_14px_rgba(167,139,250,0.55)]" />
      <div className="absolute right-20 top-0 h-1.5 w-1.5 rounded-full bg-blue-300/80 shadow-[0_0_12px_rgba(96,165,250,0.45)]" />

      <div className="absolute left-2 top-6 h-[182px] w-[272px] rounded-full border border-violet-300/34 [transform:rotate(-11deg)]" />
    </div>
  );
}

function PdfStackArtwork() {
  return (
    <div className="pointer-events-none relative hidden h-24 w-28 shrink-0 lg:block">
      <div className="absolute right-6 top-5 h-1.5 w-1.5 rounded-full bg-violet-200/85 shadow-[0_0_12px_rgba(167,139,250,0.55)]" />
      <div className="absolute right-20 top-10 h-1.5 w-1.5 rounded-full bg-violet-200/80 shadow-[0_0_12px_rgba(167,139,250,0.5)]" />
      <div className="absolute right-0 top-0 h-24 w-[72px] rounded-[18px] border border-violet-200/18 bg-[linear-gradient(180deg,rgba(255,255,255,0.92),rgba(240,236,255,0.88))] shadow-[0_16px_36px_rgba(111,76,194,0.22)]">
        <div className="absolute right-0 top-0 h-8 w-8 overflow-hidden rounded-bl-[14px] rounded-tr-[18px] border-l border-b border-[#d8cef8] bg-white/80">
          <div className="absolute inset-0 -translate-x-1/2 -translate-y-1/2 rotate-45 bg-[#ede8ff]" />
        </div>
        <div className="absolute bottom-7 left-0 right-0 text-center text-[2rem] font-black tracking-tight text-[#2e2472]">
          PDF
        </div>
      </div>
      <div className="absolute right-4 top-3 h-24 w-[72px] rounded-[18px] border border-violet-200/10 bg-violet-300/10" />
      <div className="absolute right-8 top-6 h-24 w-[72px] rounded-[18px] border border-violet-200/10 bg-violet-300/8" />
    </div>
  );
}

function PdfToolCard({
  href,
  label,
  desc,
  icon,
  badge = "Tool",
  wide = false,
}: {
  href: string;
  label: string;
  desc: string;
  icon: PdfIconKind;
  badge?: string;
  wide?: boolean;
}) {
  return (
    <Link
      href={href}
      className={cx(
        "group rounded-[24px] border border-violet-200/14 bg-[linear-gradient(180deg,rgba(255,255,255,0.045),rgba(255,255,255,0.02))] p-4 shadow-[inset_0_1px_0_rgba(255,255,255,0.05)] transition duration-300 hover:-translate-y-0.5 hover:border-violet-200/28 hover:bg-[linear-gradient(180deg,rgba(108,92,231,0.14),rgba(255,255,255,0.04))] hover:shadow-[0_0_34px_rgba(139,92,246,0.16)]",
        wide && "sm:col-span-2",
      )}
    >
      <div className="flex items-start gap-4">
        <div className="grid h-16 w-16 shrink-0 place-items-center rounded-[20px] border border-violet-200/20 bg-[radial-gradient(circle_at_top,rgba(167,139,250,0.22),transparent_70%),rgba(255,255,255,0.045)] text-violet-100 shadow-[inset_0_1px_0_rgba(255,255,255,0.08),0_0_24px_rgba(139,92,246,0.14)] transition duration-300 group-hover:scale-[1.03] group-hover:text-white">
          <PdfIcon kind={icon} className="h-8 w-8" />
        </div>

        <div className="min-w-0 flex-1">
          <div className="flex items-start justify-between gap-3">
            <div className="text-[1.2rem] font-bold leading-tight tracking-tight text-white">
              {label}
            </div>
            <span className="rounded-full border border-violet-200/16 bg-white/8 px-2.5 py-1 text-[11px] font-semibold text-white/58 shadow-[inset_0_1px_0_rgba(255,255,255,0.05)] transition group-hover:border-violet-200/26 group-hover:text-white/78">
              {badge}
            </span>
          </div>

          <p className="mt-2 text-[15px] leading-7 text-white/62">{desc}</p>
        </div>
      </div>
    </Link>
  );
}

function PdfToolkitSection() {
  return (
    <GlassCard className="relative overflow-hidden border-violet-300/22 bg-[linear-gradient(135deg,rgba(34,27,74,0.92),rgba(30,22,69,0.88))] p-3 sm:p-4 lg:p-5">
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_top_left,rgba(121,69,255,0.18),transparent_34%),radial-gradient(circle_at_bottom_right,rgba(59,130,246,0.14),transparent_30%),linear-gradient(180deg,rgba(255,255,255,0.04),transparent_20%,transparent_80%,rgba(139,92,246,0.06))]" />
      <div className="pointer-events-none absolute inset-0 rounded-[30px] border border-white/6" />

      <div className="relative grid gap-4 xl:grid-cols-[1.05fr_1.02fr]">
        <div className="relative overflow-hidden rounded-[30px] border border-violet-200/12 bg-[linear-gradient(180deg,rgba(255,255,255,0.03),rgba(255,255,255,0.015))] px-5 py-5 sm:px-6 sm:py-6 lg:min-h-[610px]">
          <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_bottom_right,rgba(139,92,246,0.20),transparent_24%),radial-gradient(circle_at_top_left,rgba(255,255,255,0.04),transparent_30%)]" />
          <PdfOrbitIllustration />

          <div className="relative max-w-[34rem]">
            <div className="flex items-center gap-3">
              <SectionLabel>PDF toolkit</SectionLabel>
              <div className="group relative">
                <button
                  type="button"
                  aria-label="About the PDF toolkit"
                  className="grid h-9 w-9 place-items-center rounded-full border border-violet-200/14 bg-white/5 text-sm font-bold text-violet-100 shadow-[0_0_22px_rgba(139,92,246,0.14)] transition duration-300 hover:border-violet-200/26 hover:bg-violet-400/12 hover:text-white"
                >
                  ?
                </button>
                <div className="pointer-events-none absolute left-1/2 top-[calc(100%+12px)] z-20 w-[280px] -translate-x-1/2 rounded-[18px] border border-violet-200/16 bg-[#251f4f]/96 p-3 text-left text-xs leading-6 text-white/72 opacity-0 shadow-[0_18px_44px_rgba(10,8,28,0.34)] backdrop-blur-md transition duration-200 group-hover:opacity-100 group-focus-within:opacity-100">
                  A focused document toolkit for merge, split, image export, and image-to-PDF flows — designed to sit beside the main format library without mixing too heavily with audio, video, and image conversions.
                </div>
              </div>
            </div>

            <h2 className="mt-6 max-w-[11ch] text-[2.7rem] font-black leading-[1.08] tracking-tight text-white sm:text-[3.25rem] lg:text-[4rem]">
              Add document tools beside your <span className="bg-gradient-to-r from-white via-violet-100 to-violet-300 bg-clip-text text-transparent">format library</span>
            </h2>

            <div className="mt-5 h-1 w-16 rounded-full bg-gradient-to-r from-violet-400 to-blue-400 shadow-[0_0_16px_rgba(139,92,246,0.35)]" />

            <p className="mt-8 max-w-[30rem] pr-6 text-[17px] leading-9 text-white/67 xl:pr-12">
              Give users a clear path for PDF work without mixing it too heavily
              with audio, video, and image formats. Split pages, merge
              documents, export page images, or build a PDF from images from the
              same conversion hub.
            </p>
          </div>

          <div className="relative mt-12 grid gap-4 md:grid-cols-3">
            <PdfMetricCard label="document tools" value="5" icon="doc" />
            <PdfMetricCard label="page workflows" value="PDF" icon="stack" />
            <PdfMetricCard label="preview-friendly" value="PNG" icon="eye" />
          </div>
        </div>

        <div className="relative overflow-hidden rounded-[30px] border border-violet-200/12 bg-[linear-gradient(180deg,rgba(255,255,255,0.04),rgba(255,255,255,0.02))] px-5 py-5 sm:px-6 sm:py-6 lg:min-h-[610px]">
          <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_top_right,rgba(139,92,246,0.14),transparent_28%),radial-gradient(circle_at_bottom,rgba(59,130,246,0.12),transparent_32%)]" />

          <div className="relative flex items-start justify-between gap-4">
            <div>
              <div className="inline-flex rounded-full border border-violet-200/18 bg-violet-400/10 px-4 py-2 text-[12px] font-semibold uppercase tracking-[0.24em] text-violet-100 shadow-[inset_0_1px_0_rgba(255,255,255,0.06),0_0_22px_rgba(139,92,246,0.12)]">
                files + pages
              </div>

              <h3 className="mt-5 text-[2rem] font-bold leading-tight tracking-tight text-white sm:text-[2.35rem]">
                Practical PDF actions
              </h3>
            </div>

            <div className="pt-0 sm:-mt-2 lg:-mt-3">
              <PdfStackArtwork />
            </div>
          </div>

          <div className="relative mt-6 grid gap-4 sm:grid-cols-2">
            {pdfTools.map((tool) => (
              <PdfToolCard
                key={tool.label}
                href={tool.href}
                label={tool.label}
                desc={tool.desc}
                icon={tool.icon as PdfIconKind}
              />
            ))}

            {extraPdfTools.map((tool) => (
              <PdfToolCard
                key={tool.label}
                href={tool.href}
                label={tool.label}
                desc={tool.desc}
                icon={tool.icon as PdfIconKind}
                badge="Extra"
                wide
              />
            ))}
          </div>

          <div className="relative mt-6 flex flex-wrap items-center gap-4">
            <Link
              href="/convert/pdf#pdf-converter"
              className="inline-flex items-center gap-4 rounded-full bg-gradient-to-r from-violet-500 via-fuchsia-500 to-blue-500 px-5 py-3.5 text-base font-semibold text-white shadow-[0_18px_42px_rgba(109,86,246,0.34)] transition duration-300 hover:-translate-y-0.5 hover:shadow-[0_0_38px_rgba(139,92,246,0.32)]"
            >
              Open PDF tools
              <span className="grid h-9 w-9 place-items-center rounded-full bg-white/14 text-xl shadow-[inset_0_1px_0_rgba(255,255,255,0.14)]">
                →
              </span>
            </Link>

            <Link
              href="/converter"
              className="inline-flex rounded-full border border-violet-200/16 bg-white/7 px-5 py-3.5 text-base font-medium text-white/82 shadow-[inset_0_1px_0_rgba(255,255,255,0.04)] transition duration-300 hover:-translate-y-0.5 hover:border-violet-200/30 hover:bg-violet-400/12 hover:text-white hover:shadow-[0_0_26px_rgba(139,92,246,0.18)]"
            >
              Back to converter
            </Link>
          </div>
        </div>
      </div>
    </GlassCard>
  );
}

export default function FormatsPageClient() {
  const PAGE_MAX = "max-w-[1320px]";
  const CENTER_MAX = "max-w-[1240px]";

  const [activeFeaturedFilter, setActiveFeaturedFilter] =
    useState<QuickFilter>("Most used");
  const [showAllFormatGuides, setShowAllFormatGuides] = useState(false);
  const [openPracticalQuestions, setOpenPracticalQuestions] = useState<string[]>([]);

  const activeFeaturedFormats = featuredFormatsByFilter[activeFeaturedFilter];
  const activeFeaturedCopy = featuredCopyByFilter[activeFeaturedFilter];

  const formatGuides = useMemo(
    () =>
      allFormats.map((item) => ({
        item,
        href: `/formats/${item.slug}`,
        label: `${item.label} format guide`,
        desc: item.metaDescription,
      })),
    [],
  );

  const visibleFormatGuides = showAllFormatGuides
    ? formatGuides
    : formatGuides.slice(0, 6);

  return (
    <>
      <SimpleTopBar shellMax={PAGE_MAX} />

      <main className="relative isolate min-h-screen overflow-x-hidden bg-[#181337] bg-[radial-gradient(ellipse_at_top_left,rgba(139,92,246,0.22),transparent_52%),radial-gradient(ellipse_at_bottom_right,rgba(59,130,246,0.22),transparent_48%)] pt-4 text-white selection:bg-violet-300/25">
        <div className="pointer-events-none fixed inset-0 z-0 overflow-hidden">
          <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top_left,rgba(139,92,246,0.22),transparent_52%),radial-gradient(ellipse_at_bottom_right,rgba(59,130,246,0.22),transparent_48%),radial-gradient(ellipse_at_center,rgba(255,255,255,0.05),transparent_46%)]" />
          <div className="absolute inset-0 opacity-[0.14] [background:linear-gradient(to_right,rgba(255,255,255,0.04)_1px,transparent_1px),linear-gradient(to_bottom,rgba(255,255,255,0.04)_1px,transparent_1px)] [background-size:72px_72px]" />
        </div>

        <div
          className={cx(
            "relative z-10 mx-auto px-4 py-10 sm:px-6 lg:px-8 lg:py-14",
            PAGE_MAX,
          )}
        >
          <div className="min-w-0">
            <div className={cx("mx-auto w-full", CENTER_MAX)}>
              <section className="relative overflow-hidden rounded-[34px] border border-violet-300/18 bg-[#282151]/68 px-6 py-8 shadow-[0_32px_110px_rgba(18,14,45,0.38)] sm:px-8 sm:py-10 lg:px-10 lg:py-12">
                <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_top_right,rgba(139,92,246,0.24),transparent_26%),radial-gradient(circle_at_bottom_left,rgba(59,130,246,0.20),transparent_34%),linear-gradient(135deg,rgba(255,255,255,0.06),transparent_45%)]" />

                <div className="relative grid gap-8 lg:grid-cols-[minmax(0,1.15fr)_minmax(340px,0.85fr)] lg:items-stretch">
                  <div>
                    <SectionLabel>Browse faster</SectionLabel>

                    <h1 className="mt-4 max-w-3xl text-4xl font-bold tracking-tight text-white sm:text-5xl lg:text-6xl">
                      Interactive format explorer
                    </h1>

                    <p className="mt-5 max-w-2xl text-sm leading-7 text-white/70 sm:text-base">
                      Explore Converto’s supported audio, video, and image
                      formats in a cleaner, more practical hub. Learn what each
                      format is best for, compare related options, and jump
                      directly into the conversion routes people use most.
                    </p>

                    <div className="mt-6 flex flex-wrap gap-3">
                      <Pill>Audio, video, and images</Pill>
                      <Pill>Guides + comparisons</Pill>
                      <Pill>Conversion-first workflows</Pill>
                    </div>

                    <div className="mt-8 flex flex-wrap gap-3">
                      <Link
                        href="/converter"
                        className="inline-flex rounded-full bg-gradient-to-r from-violet-500 to-blue-500 px-5 py-3 text-sm font-semibold text-white shadow-[0_14px_34px_rgba(99,102,241,0.28)] transition duration-300 hover:-translate-y-0.5 hover:shadow-[0_0_36px_rgba(139,92,246,0.42)]"
                      >
                        Open Converter
                      </Link>

                      <Link
                        href="/compare"
                        className="inline-flex rounded-full border border-violet-200/14 bg-white/9 px-5 py-3 text-sm font-medium text-white/85 transition duration-300 hover:-translate-y-0.5 hover:border-violet-200/34 hover:bg-violet-400/16 hover:text-white hover:shadow-[0_0_26px_rgba(139,92,246,0.24)]"
                      >
                        Browse comparisons
                      </Link>
                    </div>
                  </div>

                  <HeroFormatPanel />
                </div>
              </section>

              <section className="mt-10">
                <GlassCard className="p-6 sm:p-7">
                  <div className="flex flex-col gap-5 lg:flex-row lg:items-start lg:justify-between">
                    <div>
                      <SectionLabel>Featured formats</SectionLabel>

                      <h2 className="mt-3 text-2xl font-semibold tracking-tight text-white sm:text-3xl">
                        {activeFeaturedCopy.title}
                      </h2>

                      <p className="mt-3 max-w-3xl text-sm leading-6 text-white/65">
                        {activeFeaturedCopy.desc}
                      </p>
                    </div>

                    <div className="flex flex-wrap gap-2">
                      {quickFilters.map((item) => {
                        const isActive = activeFeaturedFilter === item;

                        return (
                          <button
                            key={item}
                            type="button"
                            onClick={() => setActiveFeaturedFilter(item)}
                            className={cx(
                              "rounded-full border px-3 py-1.5 text-xs font-semibold transition duration-300",
                              isActive
                                ? "border-violet-200/30 bg-gradient-to-r from-violet-500 to-blue-500 text-white shadow-[0_0_24px_rgba(139,92,246,0.28)]"
                                : "border-violet-200/12 bg-white/8 text-white/65 hover:border-violet-200/28 hover:bg-violet-400/12 hover:text-white",
                            )}
                          >
                            {item}
                          </button>
                        );
                      })}
                    </div>
                  </div>

                  <div className="mt-6 grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
                    {activeFeaturedFormats.map((item) => (
                      <FeaturedFormatCard key={item.href} {...item} />
                    ))}
                  </div>
                </GlassCard>
              </section>

              <section className="mt-10 grid gap-6 xl:grid-cols-3">
                <FormatGroup
                  title="Audio formats"
                  desc="Audio conversion helps with listening compatibility, extracting sound from video, managing file size, and preparing files for playback across apps, phones, browsers, and music libraries."
                  formats={audioFormats}
                  kind="audio"
                  helperText="Waveform-ready"
                />

                <FormatGroup
                  title="Video formats"
                  desc="Video conversion is useful for playback compatibility, modernizing older files, reducing sharing friction, preparing uploads, and choosing the right balance between quality and file size."
                  formats={videoFormats}
                  kind="video"
                  helperText="Playback-focused"
                />

                <FormatGroup
                  title="Image formats"
                  desc="Image conversion helps with compression, transparency, editing flexibility, web optimization, and moving between graphics-first and delivery-first formats."
                  formats={imageFormats}
                  kind="image"
                  helperText="Pixel-perfect"
                />
              </section>

              <section className="mt-10">
                <PdfToolkitSection />
              </section>

              <section className="mt-10">
                <GlassCard className="relative overflow-hidden p-6 sm:p-7">
                  <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_74%_18%,rgba(139,92,246,0.18),transparent_30%),radial-gradient(circle_at_16%_100%,rgba(59,130,246,0.08),transparent_30%)]" />
                  <div className="pointer-events-none absolute inset-0 hidden lg:block" aria-hidden="true">
                    <div className="absolute right-[3%] top-[-18%] h-[92%] w-[62%] rounded-full bg-[radial-gradient(circle_at_center,rgba(139,92,246,0.16),transparent_70%)] blur-3xl" />
                    <div
                      className="absolute right-[0.5%] top-[-16%] h-[68%] w-[62%] max-w-[1000px] select-none opacity-[0.34] mix-blend-screen [background-image:url('/images/vnext/format-hub-matters-watermark.png')] [background-position:right_top] [background-repeat:no-repeat] [background-size:100%_auto] [filter:saturate(1.08)_contrast(1.04)] [mask-image:linear-gradient(90deg,transparent_0%,rgba(0,0,0,0.80)_10%,rgba(0,0,0,1)_20%,rgba(0,0,0,1)_84%,rgba(0,0,0,0.58)_94%,transparent_100%),linear-gradient(180deg,rgba(0,0,0,0.98)_0%,rgba(0,0,0,0.95)_52%,rgba(0,0,0,0.62)_78%,transparent_100%)] [-webkit-mask-image:linear-gradient(90deg,transparent_0%,rgba(0,0,0,0.80)_10%,rgba(0,0,0,1)_20%,rgba(0,0,0,1)_84%,rgba(0,0,0,0.58)_94%,transparent_100%),linear-gradient(180deg,rgba(0,0,0,0.98)_0%,rgba(0,0,0,0.95)_52%,rgba(0,0,0,0.62)_78%,transparent_100%)] [mask-composite:intersect]"
                    />
                    <div className="absolute right-0 top-[-4%] h-[54%] w-[46%] bg-[linear-gradient(90deg,transparent_0%,rgba(35,30,89,0.02)_36%,rgba(35,30,89,0.12)_76%,rgba(35,30,89,0.22)_92%,rgba(35,30,89,0.34)_100%)]" />
                  </div>
                  <div className="relative">
                    <SectionLabel>Why this hub matters</SectionLabel>

                    <h2 className="mt-3 max-w-4xl text-2xl font-semibold tracking-tight text-white sm:text-3xl">
                      Choosing the right format saves time, space, and
                      compatibility headaches
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
                    Each guide explains what the format is, where it fits best,
                    what it is commonly compared with, and which conversion
                    paths are the most useful for real-world compatibility,
                    playback, editing, or optimization.
                  </p>

                  <div className="mt-6 grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
                    {visibleFormatGuides.map((guide) => (
                      <FormatGuideCard key={guide.href} item={guide.item} />
                    ))}
                  </div>

                  {formatGuides.length > 6 ? (
                    <div className="mt-6 flex justify-center">
                      <button
                        type="button"
                        onClick={() =>
                          setShowAllFormatGuides((prev) => !prev)
                        }
                        className="inline-flex items-center gap-3 rounded-full border border-violet-200/16 bg-white/[0.07] px-5 py-3 text-sm font-semibold text-white/80 shadow-[inset_0_1px_0_rgba(255,255,255,0.04)] transition duration-300 hover:-translate-y-0.5 hover:border-violet-200/30 hover:bg-violet-400/12 hover:text-white hover:shadow-[0_0_24px_rgba(139,92,246,0.18)]"
                      >
                        <span className="grid h-6 w-6 place-items-center rounded-full bg-white/10 text-base leading-none">
                          {showAllFormatGuides ? "−" : "+"}
                        </span>
                        {showAllFormatGuides ? "Show less" : "Show more guides"}
                      </button>
                    </div>
                  ) : null}
                </GlassCard>
              </section>

              <section className="mt-10">
                <GlassCard className="relative overflow-hidden p-6 sm:p-7">
                  <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_top_left,rgba(139,92,246,0.16),transparent_32%),radial-gradient(circle_at_bottom_right,rgba(96,165,250,0.10),transparent_30%),linear-gradient(180deg,rgba(255,255,255,0.02),transparent_22%,transparent_78%,rgba(139,92,246,0.05))]" />

                  <div className="relative">
                    <SectionLabel>Format comparisons</SectionLabel>

                    <h2 className="mt-3 text-2xl font-semibold tracking-tight text-white sm:text-3xl">
                      Compare similar formats before you convert
                    </h2>

                    <p className="mt-3 max-w-3xl text-sm leading-6 text-white/65">
                      Some formats seem similar until you look at playback
                      support, editing flexibility, streaming use, transparency,
                      or file size behavior. These compare pages help users choose
                      the better fit before converting.
                    </p>

                    <div className="mt-6 grid gap-4 xl:grid-cols-3">
                      {compareGuides.map((item) => (
                        <CompareGuideCard
                          key={item.href}
                          href={item.href}
                          label={item.label}
                          desc={item.desc}
                          leftSlug={item.leftSlug}
                          rightSlug={item.rightSlug}
                          kind={item.kind}
                        />
                      ))}
                    </div>

                    <div className="mt-6">
                      <Link
                        href="/compare"
                        className="inline-flex rounded-full bg-gradient-to-r from-violet-500 to-blue-500 px-5 py-3 text-sm font-semibold text-white shadow-[0_14px_34px_rgba(99,102,241,0.28)] transition duration-300 hover:-translate-y-0.5 hover:shadow-[0_0_36px_rgba(139,92,246,0.42)]"
                      >
                        Open compare hub
                      </Link>
                    </div>
                  </div>
                </GlassCard>
              </section>

              <section className="mt-10 grid gap-6 xl:grid-cols-[1.15fr_0.85fr]">
                <GlassCard className="relative min-h-[380px] overflow-hidden p-6 sm:p-7">
                  <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_top_right,rgba(255,255,255,0.08),transparent_28%),radial-gradient(circle_at_bottom_left,rgba(99,102,241,0.10),transparent_34%)] opacity-90" />
                  <div className="pointer-events-none absolute -right-10 -top-10 h-28 w-28 rounded-full bg-white/10 blur-2xl" />
                  <div className="pointer-events-none absolute inset-0 hidden lg:block" aria-hidden="true">
                    <div
                      className="absolute right-[1%] bottom-[-2%] h-[68%] w-[52%] max-w-[520px] select-none opacity-[0.28] mix-blend-screen [background-image:url('/images/vnext/format-hub-practical-questions-watermark.png')] [background-position:right_bottom] [background-repeat:no-repeat] [background-size:100%_auto] [filter:hue-rotate(-12deg)_saturate(0.58)_brightness(0.95)] [mask-image:linear-gradient(90deg,transparent_0%,rgba(0,0,0,0.72)_18%,rgba(0,0,0,0.95)_40%,rgba(0,0,0,0.95)_100%),linear-gradient(180deg,rgba(0,0,0,0.25)_0%,rgba(0,0,0,0.85)_24%,rgba(0,0,0,1)_48%,rgba(0,0,0,1)_100%)] [-webkit-mask-image:linear-gradient(90deg,transparent_0%,rgba(0,0,0,0.72)_18%,rgba(0,0,0,0.95)_40%,rgba(0,0,0,0.95)_100%),linear-gradient(180deg,rgba(0,0,0,0.25)_0%,rgba(0,0,0,0.85)_24%,rgba(0,0,0,1)_48%,rgba(0,0,0,1)_100%)] [mask-composite:intersect]"
                    />
                  </div>

                  <div className="relative">
                    <h2 className="text-2xl font-semibold tracking-tight text-white sm:text-3xl">
                      Practical format questions users usually have
                    </h2>

                    <div className="mt-5 space-y-4">
                      {practicalQuestionItems.map((item) => {
                        const isOpen = openPracticalQuestions.includes(item.id);

                        return (
                          <PracticalQuestionCard
                            key={item.id}
                            title={item.title}
                            desc={item.desc}
                            icon={item.icon}
                            extraTitle={item.extraTitle}
                            extraPoints={item.extraPoints}
                            open={isOpen}
                            onToggle={() =>
                              setOpenPracticalQuestions((prev) =>
                                prev.includes(item.id)
                                  ? prev.filter((id) => id !== item.id)
                                  : [...prev, item.id],
                              )
                            }
                          />
                        );
                      })}
                    </div>
                  </div>
                </GlassCard>

                <GlassCard className="relative min-h-[380px] overflow-hidden p-6 sm:p-7">
                  <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_top_right,rgba(255,255,255,0.08),transparent_28%),radial-gradient(circle_at_bottom_left,rgba(99,102,241,0.10),transparent_34%)] opacity-90" />
                  <div className="pointer-events-none absolute -right-10 -top-10 h-28 w-28 rounded-full bg-white/10 blur-2xl" />
                  <div className="pointer-events-none absolute inset-0 hidden lg:block" aria-hidden="true">
                    <div
                      className="absolute right-[2%] bottom-[2%] h-[62%] w-[76%] select-none opacity-[0.30] mix-blend-screen [background-image:url('/images/vnext/format-hub-next-step-watermark.png')] [background-position:center_bottom] [background-repeat:no-repeat] [background-size:cover] [filter:hue-rotate(-10deg)_saturate(0.62)_brightness(0.94)] [mask-image:linear-gradient(180deg,transparent_0%,rgba(0,0,0,0.18)_16%,rgba(0,0,0,0.88)_40%,rgba(0,0,0,1)_100%)] [-webkit-mask-image:linear-gradient(180deg,transparent_0%,rgba(0,0,0,0.18)_16%,rgba(0,0,0,0.88)_40%,rgba(0,0,0,1)_100%)]"
                    />
                  </div>

                  <div className="relative">
                    <SectionLabel>Next step</SectionLabel>

                    <h2 className="mt-3 text-2xl font-semibold tracking-tight text-white sm:text-3xl">
                      Not sure which format to choose?
                    </h2>

                    <p className="mt-3 max-w-[34rem] text-sm leading-6 text-white/65">
                      You can jump directly into the converter, start from a
                      format guide, or compare two formats first if you want a
                      clearer sense of which output makes the most sense for
                      your use case.
                    </p>

                    <div className="mt-6 flex flex-wrap gap-3">
                      <Link
                        href="/converter"
                        className="inline-flex rounded-full bg-gradient-to-r from-violet-500 to-blue-500 px-5 py-3 text-sm font-semibold text-white shadow-[0_14px_34px_rgba(99,102,241,0.28)] transition duration-300 hover:-translate-y-0.5 hover:shadow-[0_0_36px_rgba(139,92,246,0.42)]"
                      >
                        Go to Converter
                      </Link>

                      <Link
                        href="/compare"
                        className="inline-flex rounded-full border border-violet-200/14 bg-white/9 px-5 py-3 text-sm font-medium text-white/85 transition duration-300 hover:-translate-y-0.5 hover:border-violet-200/34 hover:bg-violet-400/16 hover:text-white hover:shadow-[0_0_26px_rgba(139,92,246,0.24)]"
                      >
                        Compare formats
                      </Link>

                      <Link
                        href="/convert/mp4-to-mp3"
                        className="inline-flex rounded-full border border-violet-200/14 bg-white/9 px-5 py-3 text-sm font-medium text-white/85 transition duration-300 hover:-translate-y-0.5 hover:border-violet-200/34 hover:bg-violet-400/16 hover:text-white hover:shadow-[0_0_26px_rgba(139,92,246,0.24)]"
                      >
                        Try MP4 to MP3
                      </Link>
                    </div>
                  </div>
                </GlassCard>
              </section>
            </div>
          </div>
        </div>
      </main>
      <Footer />
    </>
  );
}
