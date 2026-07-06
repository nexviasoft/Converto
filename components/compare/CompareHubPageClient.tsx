"use client";

import SimpleTopBar from "@/components/layout/SimpleTopBar";
import Footer from "@/components/landing/Footer";
import React, { useEffect, useMemo, useRef, useState } from "react";
import Link from "next/link";
import { allCompareItems } from "@/lib/compareData";
import {
  AD_SLOTS,
  ADSENSE_CLIENT,
  ADSENSE_ENABLED,
  hasRailAdSlots,
  isAdSlotReady,
} from "@/components/ads/AdsenseScript";

const cx = (...c: Array<string | false | null | undefined>) =>
  c.filter(Boolean).join(" ");

function AdUnit({
  slot,
  className = "",
  title = "Advertisement",
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
      if (!ADSENSE_ENABLED || !isAdSlotReady(slot)) return;
      if (pushedRef.current) return;
      // @ts-ignore
      (window.adsbygoogle = window.adsbygoogle || []).push({});
      pushedRef.current = true;
    } catch {}
  }, [slot]);

  if (!ADSENSE_ENABLED || !isAdSlotReady(slot)) return null;

  return (
    <div
      className={cx(
        "relative overflow-hidden rounded-[28px] bg-white/8 ring-1 ring-white/10 shadow-[0_24px_70px_rgba(0,0,0,0.34)]",
        sticky ? "sticky top-[92px]" : "",
        className,
      )}
    >
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_at_top,rgba(168,85,247,0.14),transparent_55%),radial-gradient(ellipse_at_bottom,rgba(59,130,246,0.10),transparent_55%)]" />
      <div className="relative p-4">
        <div className="mb-3 flex items-center justify-between">
          <div className="text-[11px] font-semibold tracking-wide text-white/60">
            {title}
          </div>
        </div>

        <div className="rounded-[22px] bg-black/20 p-4 ring-1 ring-white/10">
          <div className="mb-4 space-y-2">
            <div className="h-2.5 w-24 rounded-full bg-white/10" />
            <div className="h-2.5 w-14 rounded-full bg-white/5" />
          </div>

          <ins
            className="adsbygoogle block"
            style={{ display: "block", minHeight: 560 }}
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

type HubFilter = "Featured" | "Audio" | "Video" | "Image";

const hubFilters: HubFilter[] = ["Featured", "Audio", "Video", "Image"];

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

const comparisonChips = [
  { label: "MP3 vs WAV", href: "/compare/mp3-vs-wav" },
  { label: "MP4 vs WEBM", href: "/compare/mp4-vs-webm" },
  { label: "PNG vs JPG", href: "/compare/png-vs-jpg" },
  { label: "FLAC vs MP3", href: "/compare/flac-vs-mp3" },
  { label: "WEBP vs AVIF", href: "/compare/webp-vs-avif" },
  { label: "AAC vs MP3", href: "/compare/aac-vs-mp3" },
];


const whyCompareTiles = [
  {
    title: "Less trial and error",
    desc: "See quality, size, and compatibility differences before converting.",
    iconSrc: "/images/vnext/compare-trial-error.png",
  },
  {
    title: "Better output choices",
    desc: "Pick the format that fits playback, editing, sharing, or web delivery.",
    iconSrc: "/images/vnext/compare-better-choice.png",
  },
  {
    title: "More useful content",
    desc: "Each comparison adds clear SEO-friendly guidance around the tool.",
    iconSrc: "/images/vnext/compare-useful-content.png",
  },
  {
    title: "Faster next action",
    desc: "Jump from a comparison page to the exact conversion path.",
    iconSrc: "/images/vnext/compare-faster-action.png",
  },
];

const popularCompareQuestions = [
  {
    id: "better",
    icon: "shield" as const,
    title: "Which format is better?",
    desc: "Usually neither is universally better. One format is better for a specific goal: editing, sharing, streaming, archiving, or web delivery.",
    extraTitle: "Choose based on your goal",
    extraPoints: [
      "For editing, choose the format that preserves quality and fits your workflow.",
      "For sharing, choose the format with the best balance of compatibility and file size.",
      "For web delivery, choose the format that gives the right mix of speed, support, and visual quality.",
    ],
  },
  {
    id: "convert-or-keep",
    icon: "switch" as const,
    title: "Should I convert or keep the original?",
    desc: "Keep the original when it already fits your use case. Convert when you need smaller files, broader compatibility, or a better workflow format.",
    extraTitle: "A simple rule of thumb",
    extraPoints: [
      "Keep the original as your quality-safe source file whenever possible.",
      "Convert when the target app, browser, or device works better with another format.",
      "Convert when you need a smaller upload, easier sharing, or a more practical delivery format.",
    ],
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
        "rounded-[30px] border border-violet-300/18 bg-[#272151]/66 shadow-[0_24px_80px_rgba(20,16,48,0.34)] transform-gpu transition duration-300 hover:border-violet-300/34 hover:shadow-[0_0_0_1px_rgba(139,92,246,0.18),0_28px_90px_rgba(75,60,160,0.30)]",
        className,
      )}
    >
      {children}
    </div>
  );
}

function Pill({ children }: { children: React.ReactNode }) {
  return (
    <span className="rounded-full border border-violet-200/14 bg-white/10 px-4 py-2 text-sm text-white/82 shadow-[inset_0_1px_0_rgba(255,255,255,0.08)] transition hover:border-violet-200/28 hover:bg-violet-400/14">
      {children}
    </span>
  );
}

function LinkPill({
  href,
  children,
  primary = false,
}: {
  href: string;
  children: React.ReactNode;
  primary?: boolean;
}) {
  return (
    <Link
      href={href}
      className={cx(
        "inline-flex rounded-full px-5 py-3 text-sm font-semibold transition duration-300 hover:-translate-y-0.5",
        primary
          ? "bg-gradient-to-r from-violet-500 to-blue-500 text-white shadow-[0_14px_34px_rgba(99,102,241,0.28)] hover:shadow-[0_0_36px_rgba(139,92,246,0.42)]"
          : "border border-violet-200/14 bg-white/9 text-white/85 hover:border-violet-200/34 hover:bg-violet-400/16 hover:text-white hover:shadow-[0_0_26px_rgba(139,92,246,0.24)]",
      )}
    >
      {children}
    </Link>
  );
}

function CategoryIcon({ category }: { category: "audio" | "video" | "image" }) {
  if (category === "audio") {
    return (
      <svg viewBox="0 0 24 24" className="h-6 w-6" fill="none" aria-hidden="true">
        <path d="M9 18.5a3 3 0 1 1-2-2.83V6.6c0-.72.5-1.34 1.2-1.5l8.3-1.84A1.5 1.5 0 0 1 18.32 4.7v10.8a3 3 0 1 1-2-2.83V7.06L9 8.68v9.82Z" fill="currentColor" />
      </svg>
    );
  }

  if (category === "image") {
    return (
      <svg viewBox="0 0 24 24" className="h-6 w-6" fill="none" aria-hidden="true">
        <path d="M5.75 4h12.5A2.75 2.75 0 0 1 21 6.75v10.5A2.75 2.75 0 0 1 18.25 20H5.75A2.75 2.75 0 0 1 3 17.25V6.75A2.75 2.75 0 0 1 5.75 4Zm0 2A.75.75 0 0 0 5 6.75v8.75l3.44-3.45a1.5 1.5 0 0 1 2.12 0l2.2 2.2.72-.72a1.5 1.5 0 0 1 2.12 0L19 16.93V6.75a.75.75 0 0 0-.75-.75H5.75Zm9.75 5a1.5 1.5 0 1 1 0-3 1.5 1.5 0 0 1 0 3Z" fill="currentColor" />
      </svg>
    );
  }

  return (
    <svg viewBox="0 0 24 24" className="h-6 w-6" fill="none" aria-hidden="true">
      <path d="M7.5 5.6v12.8c0 1.18 1.3 1.9 2.3 1.26l9.95-6.4a1.5 1.5 0 0 0 0-2.52L9.8 4.34C8.8 3.7 7.5 4.42 7.5 5.6ZM4 7.25a1.25 1.25 0 1 1 2.5 0v9.5a1.25 1.25 0 1 1-2.5 0v-9.5Z" fill="currentColor" />
    </svg>
  );
}

function ComparisonVisual() {
  return (
    <div className="pointer-events-none relative hidden min-h-[260px] lg:block">
      <div className="absolute right-0 top-2 h-56 w-56 rounded-full bg-violet-500/22 blur-3xl" />
      <div className="absolute right-28 top-24 h-44 w-44 rounded-full bg-blue-500/18 blur-3xl" />

      <div className="absolute right-6 top-4 w-[310px] rounded-[32px] border border-white/14 bg-white/[0.085] p-4 shadow-[0_30px_90px_rgba(0,0,0,0.30),inset_0_1px_0_rgba(255,255,255,0.08)] backdrop-blur">
        <div className="flex items-center justify-between">
          <span className="rounded-full border border-white/10 bg-white/10 px-3 py-1 text-[11px] font-semibold uppercase tracking-[0.16em] text-white/55">
            Compare
          </span>
          <span className="rounded-full bg-emerald-400/14 px-3 py-1 text-[11px] font-semibold text-emerald-200">
            decision-ready
          </span>
        </div>

        <div className="mt-5 grid grid-cols-[1fr_auto_1fr] items-center gap-3">
          <div className="rounded-[24px] border border-white/12 bg-[#221c49]/80 p-4 text-center shadow-[inset_0_1px_0_rgba(255,255,255,0.06)]">
            <div className="mx-auto grid h-12 w-12 place-items-center rounded-2xl bg-white text-black shadow-[0_14px_34px_rgba(255,255,255,0.15)]">
              <CategoryIcon category="audio" />
            </div>
            <div className="mt-3 text-2xl font-black tracking-tight">MP3</div>
            <div className="mt-1 text-[11px] uppercase tracking-[0.16em] text-white/40">Portable</div>
          </div>

          <div className="grid h-10 w-10 place-items-center rounded-full border border-white/12 bg-white/10 text-sm font-black text-white shadow-[0_0_24px_rgba(139,92,246,0.20)]">
            VS
          </div>

          <div className="rounded-[24px] border border-white/12 bg-[#221c49]/80 p-4 text-center shadow-[inset_0_1px_0_rgba(255,255,255,0.06)]">
            <div className="mx-auto grid h-12 w-12 place-items-center rounded-2xl bg-white text-black shadow-[0_14px_34px_rgba(255,255,255,0.15)]">
              <CategoryIcon category="video" />
            </div>
            <div className="mt-3 text-2xl font-black tracking-tight">WEB</div>
            <div className="mt-1 text-[11px] uppercase tracking-[0.16em] text-white/40">Modern</div>
          </div>
        </div>

        <div className="mt-5 space-y-2">
          <div className="flex items-center justify-between rounded-full border border-white/10 bg-white/[0.075] px-4 py-2 text-xs text-white/72">
            <span>Quality</span>
            <span className="text-white">Workflow-first</span>
          </div>
          <div className="flex items-center justify-between rounded-full border border-white/10 bg-white/[0.075] px-4 py-2 text-xs text-white/72">
            <span>File size</span>
            <span className="text-white">Clear trade-offs</span>
          </div>
        </div>
      </div>
    </div>
  );
}

function ComparisonCard({
  item,
  featured = false,
}: {
  item: (typeof allCompareItems)[number];
  featured?: boolean;
}) {
  return (
    <Link
      href={`/compare/${item.slug}`}
      className={cx(
        "group relative overflow-hidden rounded-[28px] border border-violet-300/14 bg-[#2b2556]/70 p-5 shadow-[inset_0_1px_0_rgba(255,255,255,0.06)] transition duration-300 hover:-translate-y-1 hover:border-violet-300/34 hover:bg-[#33296b]/80 hover:shadow-[0_22px_70px_rgba(91,70,190,0.24)]",
        featured ? "min-h-[210px]" : "",
      )}
    >
      <div className="pointer-events-none absolute -right-10 -top-10 h-28 w-28 rounded-full bg-violet-400/18 blur-2xl transition duration-300 group-hover:bg-violet-300/28" />
      <div className="relative flex items-start justify-between gap-4">
        <span className="rounded-full border border-white/10 bg-white/10 px-3 py-1 text-[11px] font-semibold uppercase tracking-[0.16em] text-white/48">
          {item.category}
        </span>
        <div className="grid h-12 w-12 shrink-0 place-items-center rounded-2xl bg-white text-black shadow-[0_14px_34px_rgba(255,255,255,0.14)]">
          <CategoryIcon category={item.category} />
        </div>
      </div>

      <div className="relative mt-5 flex items-center gap-2 text-2xl font-black tracking-tight text-white sm:text-3xl">
        <span>{item.left}</span>
        <span className="rounded-full border border-white/10 bg-white/10 px-3 py-1 text-xs font-bold uppercase tracking-[0.18em] text-white/48">
          vs
        </span>
        <span>{item.right}</span>
      </div>

      <p className="relative mt-3 line-clamp-3 text-sm leading-6 text-white/65">
        {item.intro}
      </p>

      <div className="relative mt-5 inline-flex text-sm font-semibold text-white/86 transition group-hover:text-white">
        Open comparison →
      </div>
    </Link>
  );
}

function QuickDecisionTile({
  title,
  desc,
  iconSrc,
  compactBox = false,
}: {
  title: string;
  desc: string;
  iconSrc?: string;
  compactBox?: boolean;
}) {
  return (
    <div className="rounded-[24px] border border-violet-200/14 bg-white/[0.075] p-5 shadow-[inset_0_1px_0_rgba(255,255,255,0.06)] transition duration-300 hover:border-violet-300/28 hover:bg-violet-400/12 hover:shadow-[0_0_24px_rgba(139,92,246,0.16)]">
      <div className="flex items-start gap-5">
        {iconSrc ? (
          <div className="grid h-[86px] w-[86px] shrink-0 place-items-center">
            <img src={iconSrc} alt="" className="h-[56px] w-[56px] object-contain" />
          </div>
        ) : null}
        <div className="min-w-0 flex-1">
          <div className="text-[1.05rem] font-semibold leading-tight text-white sm:text-[1.1rem]">{title}</div>
          <p className="mt-3 text-sm leading-7 text-white/66">{desc}</p>
        </div>
      </div>
    </div>
  );
}

type CompareQuestionIconKind = "shield" | "switch";

function CompareQuestionIcon({ kind, className = "h-7 w-7" }: { kind: CompareQuestionIconKind; className?: string }) {
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

  return (
    <svg viewBox="0 0 24 24" className={className} aria-hidden="true">
      <path {...shared} d="M17.5 7.8a6.5 6.5 0 0 0-10.1 1" />
      <path {...shared} d="m16.9 4.9 1 2.9-3 .6" />
      <path {...shared} d="M6.5 16.2a6.5 6.5 0 0 0 10.1-1" />
      <path {...shared} d="m7.1 19.1-1-2.9 3-.6" />
    </svg>
  );
}

function CompareChevron({ open }: { open: boolean }) {
  return (
    <svg
      viewBox="0 0 24 24"
      aria-hidden="true"
      className={cx(
        "h-6 w-6 shrink-0 text-violet-200/80 transition duration-300",
        open && "rotate-180 text-violet-100",
      )}
    >
      <path d="m6 9 6 6 6-6" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

function CompareQuestionCard({
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
  icon: CompareQuestionIconKind;
  extraTitle: string;
  extraPoints: string[];
  open: boolean;
  onToggle: () => void;
}) {
  return (
    <div className="rounded-[22px] border border-violet-200/14 bg-[#292351]/62 transition duration-300 hover:border-violet-300/30 hover:bg-[#33296b]/70 hover:shadow-[0_0_28px_rgba(139,92,246,0.18)]">
      <button type="button" onClick={onToggle} className="flex w-full items-start gap-4 p-4 text-left" aria-expanded={open}>
        <div className="grid h-14 w-14 shrink-0 place-items-center rounded-full border border-violet-300/26 bg-[radial-gradient(circle_at_top,rgba(167,139,250,0.26),transparent_70%),rgba(55,43,112,0.78)] text-violet-100 shadow-[inset_0_1px_0_rgba(255,255,255,0.08),0_0_20px_rgba(139,92,246,0.16)]">
          <CompareQuestionIcon kind={icon} className="h-7 w-7" />
        </div>
        <div className="min-w-0 flex-1">
          <div className="flex items-start gap-4">
            <div className="min-w-0 flex-1">
              <div className="text-base font-semibold leading-tight text-white sm:text-[1.02rem]">{title}</div>
              <p className="mt-2 text-sm leading-6 text-white/65">{desc}</p>
            </div>
            <div className="pt-1"><CompareChevron open={open} /></div>
          </div>
          {open ? (
            <div className="mt-3 border-t border-violet-200/12 pt-3">
              <div className="text-xs font-semibold uppercase tracking-[0.18em] text-violet-100/60">{extraTitle}</div>
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

function CompareCtaVisual() {
  return (
    <div className="pointer-events-none absolute -right-4 bottom-[-8%] hidden h-[82%] w-[48%] lg:block" aria-hidden="true">
      <div className="absolute inset-0 opacity-70 [mask-image:linear-gradient(90deg,transparent_0%,rgba(0,0,0,0.65)_18%,rgba(0,0,0,1)_45%,rgba(0,0,0,1)_100%)]">
        <div className="absolute right-[18%] top-[14%] h-28 w-28 rounded-full border border-violet-300/18" />
        <div className="absolute right-[10%] top-[6%] h-44 w-44 rounded-full border border-violet-300/10" />
        <div className="absolute right-[0%] top-[0%] h-64 w-64 rounded-full border border-violet-300/8" />
        
        {[
          ['PNG', 'right-[38%] top-[55%]'],
          ['JPG', 'right-[14%] top-[41%]'],
          ['WEBP', 'right-[6%] top-[68%]'],
        ].map(([label, pos]) => (
          <div key={label} className={cx('absolute grid h-16 w-14 place-items-center rounded-[14px] border border-violet-200/12 bg-white/[0.04] text-[12px] font-semibold text-white/34 shadow-[inset_0_1px_0_rgba(255,255,255,0.04)]', pos)}>
            {label}
          </div>
        ))}
        <div className="absolute left-[6%] top-[54%] h-px w-[46%] bg-[linear-gradient(90deg,rgba(167,139,250,0),rgba(167,139,250,0.36),rgba(167,139,250,0))]" />
        <div className="absolute left-[10%] top-[38%] h-px w-[38%] bg-[linear-gradient(90deg,rgba(167,139,250,0),rgba(167,139,250,0.28),rgba(167,139,250,0))]" />
        <div className="absolute left-[22%] top-[62%] grid h-6 w-6 place-items-center rounded-full text-violet-300/35">→</div>
        <div className="absolute left-[28%] top-[46%] grid h-6 w-6 place-items-center rounded-full text-violet-300/35">→</div>
      </div>
    </div>
  );
}

export default function CompareHubPageClient() {
  const SHELL_MAX = "max-w-[1750px]";
  const CENTER_MAX = "max-w-[1240px]";
  const railsReady = hasRailAdSlots();
  const GRID = railsReady
    ? "xl:grid-cols-[270px_minmax(0,1fr)_270px] 2xl:grid-cols-[300px_minmax(0,1fr)_300px]"
    : "";
  const [activeFilter, setActiveFilter] = useState<HubFilter>("Featured");
  const [openCompareQuestions, setOpenCompareQuestions] = useState<string[]>([]);

  const featured = useMemo(
    () =>
      featuredComparisons
        .map((slug) => allCompareItems.find((item) => item.slug === slug))
        .filter(Boolean) as typeof allCompareItems,
    [],
  );

  const audio = useMemo(
    () => allCompareItems.filter((item) => item.category === "audio"),
    [],
  );
  const video = useMemo(
    () => allCompareItems.filter((item) => item.category === "video"),
    [],
  );
  const image = useMemo(
    () => allCompareItems.filter((item) => item.category === "image"),
    [],
  );

  const filteredItems = useMemo(() => {
    if (activeFilter === "Audio") return audio;
    if (activeFilter === "Video") return video;
    if (activeFilter === "Image") return image;
    return featured;
  }, [activeFilter, audio, featured, image, video]);

  const featuredCopy =
    activeFilter === "Featured"
      ? {
          title: "Start with the decisions people make most",
          desc: "These comparisons cover common trade-offs: quality versus size, compatibility versus modern delivery, and sharing versus editing workflows.",
        }
      : activeFilter === "Audio"
        ? { title: "Audio comparisons", desc: categoryCopy.audio }
        : activeFilter === "Video"
          ? { title: "Video comparisons", desc: categoryCopy.video }
          : { title: "Image comparisons", desc: categoryCopy.image };

  return (
    <>
      <SimpleTopBar shellMax={SHELL_MAX} />

      <main className="relative isolate min-h-screen overflow-x-hidden bg-[#151233] pt-4 text-white selection:bg-white/20">
        <div className="pointer-events-none fixed inset-0 -z-10">
          <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,rgba(168,85,247,0.22),transparent_60%),radial-gradient(ellipse_at_bottom,rgba(59,130,246,0.18),transparent_55%),radial-gradient(ellipse_at_center,rgba(255,255,255,0.08),transparent_45%)]" />
          <div className="absolute inset-0 opacity-20 [background:linear-gradient(to_right,rgba(255,255,255,0.045)_1px,transparent_1px),linear-gradient(to_bottom,rgba(255,255,255,0.045)_1px,transparent_1px)] [background-size:72px_72px]" />
        </div>

        <div className={cx("mx-auto px-4 py-10 sm:px-6 lg:px-8 lg:py-14", SHELL_MAX)}>
          <div className={cx("grid items-start gap-6 xl:gap-8", GRID)}>
            {railsReady ? (
              <aside className="hidden xl:block">
                <AdUnit slot={AD_SLOTS.LEFT_RAIL} sticky className="w-full" />
              </aside>
            ) : null}

            <section className="min-w-0">
              <div className={cx("mx-auto w-full", CENTER_MAX)}>
                <section className="relative overflow-hidden rounded-[34px] border border-violet-300/18 bg-[#282151]/68 p-6 shadow-[0_32px_110px_rgba(18,14,45,0.38)] sm:p-8 lg:p-10">
                  <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_top_right,rgba(139,92,246,0.24),transparent_28%),radial-gradient(circle_at_bottom_left,rgba(59,130,246,0.20),transparent_34%),linear-gradient(135deg,rgba(255,255,255,0.06),transparent_45%)]" />
                  <div className="pointer-events-none absolute -right-20 -top-20 h-56 w-56 rounded-full bg-violet-400/22 blur-3xl" />
                  <div className="pointer-events-none absolute -bottom-24 -left-20 h-56 w-56 rounded-full bg-blue-400/16 blur-3xl" />

                  <div className="relative grid gap-8 lg:grid-cols-[minmax(0,1fr)_340px] lg:items-center">
                    <div className="min-w-0">
                      <SectionLabel>Compare hub</SectionLabel>

                      <h1 className="mt-4 max-w-4xl text-4xl font-bold tracking-tight text-white sm:text-5xl lg:text-6xl">
                        Compare file formats before you convert
                      </h1>

                      <p className="mt-5 max-w-3xl text-sm leading-7 text-white/72 sm:text-base">
                        Converto comparison pages help users understand practical
                        differences between popular audio, video, and image formats.
                        Compare compatibility, quality, file size, workflow fit, and
                        conversion direction before choosing an output.
                      </p>

                      <div className="mt-6 flex flex-wrap gap-3">
                        <Pill>Format decisions</Pill>
                        <Pill>Quality vs size</Pill>
                        <Pill>Conversion-ready</Pill>
                      </div>

                      <div className="mt-8 flex flex-wrap gap-3">
                        <LinkPill href="/converter" primary>
                          Open Converter
                        </LinkPill>
                        <LinkPill href="/formats">Browse formats</LinkPill>
                        <LinkPill href="/compare/mp3-vs-wav">Try MP3 vs WAV</LinkPill>
                      </div>
                    </div>

                    <ComparisonVisual />
                  </div>
                </section>

                <section className="mt-8 flex flex-wrap justify-center gap-3">
                  {comparisonChips.map((chip) => (
                    <Link
                      key={chip.label}
                      href={chip.href}
                      className="rounded-full border border-violet-200/14 bg-white/8 px-4 py-2 text-sm text-white/72 shadow-[inset_0_1px_0_rgba(255,255,255,0.06)] transition duration-300 hover:-translate-y-0.5 hover:border-violet-200/30 hover:bg-violet-400/14 hover:text-white hover:shadow-[0_0_22px_rgba(139,92,246,0.20)]"
                    >
                      {chip.label}
                    </Link>
                  ))}
                </section>

                <section className="mt-10">
                  <GlassCard className="p-6 sm:p-7 lg:p-8">
                    <div className="flex flex-col gap-5 md:flex-row md:items-end md:justify-between">
                      <div>
                        <SectionLabel>Featured comparisons</SectionLabel>
                        <h2 className="mt-3 text-2xl font-semibold tracking-tight text-white sm:text-3xl">
                          {featuredCopy.title}
                        </h2>
                        <p className="mt-3 max-w-3xl text-sm leading-6 text-white/66">
                          {featuredCopy.desc}
                        </p>
                      </div>

                      <div className="flex flex-wrap gap-2">
                        {hubFilters.map((filter) => (
                          <button
                            key={filter}
                            type="button"
                            onClick={() => setActiveFilter(filter)}
                            className={cx(
                              "rounded-full px-4 py-2 text-sm font-semibold transition duration-300",
                              activeFilter === filter
                                ? "bg-white text-black shadow-[0_14px_34px_rgba(255,255,255,0.14)]"
                                : "border border-violet-200/14 bg-white/8 text-white/72 hover:border-violet-200/30 hover:bg-violet-400/14 hover:text-white",
                            )}
                          >
                            {filter}
                          </button>
                        ))}
                      </div>
                    </div>

                    <div className="mt-7 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
                      {filteredItems.slice(0, activeFilter === "Featured" ? 8 : 12).map((item) => (
                        <ComparisonCard
                          key={item.slug}
                          item={item}
                          featured={activeFilter === "Featured"}
                        />
                      ))}
                    </div>
                  </GlassCard>
                </section>

                <section className="mt-10 grid gap-6 lg:grid-cols-3">
                  {[
                    { title: "Audio comparisons", items: audio, key: "audio" as const },
                    { title: "Video comparisons", items: video, key: "video" as const },
                    { title: "Image comparisons", items: image, key: "image" as const },
                  ].map((group) => (
                    <GlassCard key={group.title} className="p-6 sm:p-7">
                      <div className="flex items-start justify-between gap-4">
                        <div>
                          <SectionLabel>{group.key}</SectionLabel>
                          <h2 className="mt-3 text-2xl font-semibold tracking-tight text-white">
                            {group.title}
                          </h2>
                        </div>
                        <div className="grid h-12 w-12 shrink-0 place-items-center rounded-2xl bg-white text-black shadow-[0_14px_34px_rgba(255,255,255,0.14)]">
                          <CategoryIcon category={group.key} />
                        </div>
                      </div>

                      <p className="mt-4 text-sm leading-6 text-white/66">
                        {categoryCopy[group.key]}
                      </p>

                      <div className="mt-5 space-y-3">
                        {group.items.slice(0, 7).map((item) => (
                          <Link
                            key={item.slug}
                            href={`/compare/${item.slug}`}
                            className="group flex items-center justify-between gap-3 rounded-[18px] border border-violet-200/12 bg-white/[0.075] px-4 py-3 text-sm text-white/82 transition duration-300 hover:border-violet-300/28 hover:bg-violet-400/12 hover:text-white"
                          >
                            <span>{item.title}</span>
                            <span className="text-white/40 transition group-hover:translate-x-0.5 group-hover:text-white">
                              →
                            </span>
                          </Link>
                        ))}
                      </div>
                    </GlassCard>
                  ))}
                </section>

                <section className="mt-10">
                  <GlassCard className="relative overflow-hidden p-6 sm:p-7 lg:p-8">
                    <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_78%_20%,rgba(59,130,246,0.18),transparent_30%),radial-gradient(circle_at_92%_20%,rgba(139,92,246,0.22),transparent_26%),linear-gradient(135deg,rgba(255,255,255,0.035),transparent_48%)]" />
                    <div className="relative grid gap-6 md:grid-cols-2">
                      <div>
                        <SectionLabel>Why compare first</SectionLabel>
                        <h2 className="mt-3 text-2xl font-semibold tracking-tight text-white sm:text-3xl">
                          Good conversion starts with choosing the right target
                        </h2>
                        <p className="mt-3 max-w-3xl text-sm leading-6 text-white/66">
                          Comparison pages make Converto feel less like a one-screen
                          utility and more like a useful format resource. Users can
                          understand the trade-off before they upload a file.
                        </p>
                      </div>

                      <div className="grid gap-4 sm:grid-cols-2">
                        {whyCompareTiles.map((item) => (
                          <QuickDecisionTile
                            key={item.title}
                            title={item.title}
                            desc={item.desc}
                            iconSrc={item.iconSrc}
                            compactBox={item.title === "More useful content"}
                          />
                        ))}
                      </div>
                    </div>
                  </GlassCard>
                </section>

                <section className="mt-10 grid gap-6 lg:grid-cols-[1.15fr_0.85fr]">
                  <GlassCard className="relative overflow-hidden p-6 sm:p-7">
                    <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_top_right,rgba(255,255,255,0.08),transparent_28%),radial-gradient(circle_at_bottom_left,rgba(99,102,241,0.10),transparent_34%)] opacity-90" />
                    <div className="pointer-events-none absolute -right-10 -top-10 h-28 w-28 rounded-full bg-white/10 blur-2xl" />
                    <div className="relative">
                      <h2 className="text-2xl font-semibold tracking-tight text-white sm:text-3xl">
                        Popular questions users usually have
                      </h2>

                      <div className="mt-5 space-y-4">
                        {popularCompareQuestions.map((item) => {
                          const isOpen = openCompareQuestions.includes(item.id);
                          return (
                            <CompareQuestionCard
                              key={item.id}
                              title={item.title}
                              desc={item.desc}
                              icon={item.icon}
                              extraTitle={item.extraTitle}
                              extraPoints={item.extraPoints}
                              open={isOpen}
                              onToggle={() =>
                                setOpenCompareQuestions((prev) =>
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

                  <GlassCard className="relative overflow-hidden p-6 sm:p-7">
                    <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_top_right,rgba(255,255,255,0.08),transparent_28%),radial-gradient(circle_at_bottom_left,rgba(99,102,241,0.10),transparent_34%)] opacity-90" />
                    <div className="pointer-events-none absolute -right-10 -top-10 h-28 w-28 rounded-full bg-white/10 blur-2xl" />
                    <CompareCtaVisual />
                    <div className="relative">
                      <h2 className="text-2xl font-semibold tracking-tight text-white sm:text-[2.2rem] sm:leading-[1.15]">
                        Start from a comparison or jump into converting
                      </h2>
                      <p className="mt-3 max-w-[34rem] text-sm leading-7 text-white/66 sm:text-[15px]">
                        If you already know your target, open the converter directly.
                        If you are still deciding between two outputs, browse a
                        comparison first and convert with more confidence.
                      </p>

                      <div className="mt-6 flex flex-wrap gap-3">
                        <LinkPill href="/converter" primary>
                          Go to Converter
                        </LinkPill>
                        <LinkPill href="/formats">Browse format guides</LinkPill>
                        <LinkPill href="/compare/png-vs-jpg">Try PNG vs JPG</LinkPill>
                      </div>
                    </div>
                  </GlassCard>
                </section>
              </div>
            </section>

            {railsReady ? (
              <aside className="hidden xl:block">
                <AdUnit slot={AD_SLOTS.RIGHT_RAIL} sticky className="w-full" />
              </aside>
            ) : null}
          </div>
        </div>
      </main>
      <Footer />
    </>
  );
}
