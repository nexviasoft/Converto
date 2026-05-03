"use client";

const MAINTENANCE_MODE = false;

import SimpleTopBar from "@/components/layout/SimpleTopBar";
import React, { useEffect, useMemo, useRef, useState } from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import AdSenseScript from "@/components/ads/AdsenseScript";
import { getViewerEntitlement } from "@/lib/entitlements";
import type { UserEntitlement } from "@/types/billing";
import { useUser } from "@clerk/nextjs";
import { PDFDocument } from "pdf-lib";

type TargetFmt =
  | "MP3"
  | "WAV"
  | "M4A"
  | "AAC"
  | "OGG"
  | "OPUS"
  | "FLAC"
  | "AIFF"
  | "WMA"
  | "AMR"
  | "MP4"
  | "WEBM"
  | "MOV"
  | "MKV"
  | "AVI"
  | "WMV"
  | "FLV"
  | "M4V"
  | "MPG"
  | "MPEG"
  | "3GP"
  | "GIF"
  | "PNG"
  | "JPG"
  | "WEBP"
  | "BMP"
  | "TIFF"
  | "ICO"
  | "AVIF";

type SeoPageMode = "convert" | "batch" | "pdf";
type PdfSeoTool = "to_pdf" | "split_pdf" | "pdf_to_image";

type ConverterPageContentProps = {
  slug?: string;
  seoTitle?: string;
  seoDescription?: string;
  suggestedInput?: TargetFmt | null;
  suggestedOutput?: TargetFmt | null;
  rawInputLabel?: string;
  rawOutputLabel?: string;
  seoMode?: SeoPageMode;
  pdfTool?: PdfSeoTool;
};

type ConvertStatus =
  | "idle"
  | "ready"
  | "loading"
  | "processing"
  | "done"
  | "error";
type BatchStatus = "idle" | "processing" | "done" | "error";
type PdfBuildStatus = "idle" | "processing" | "done" | "error";
type ToPdfMode = "images_to_pdf" | "merge_pdfs" | "merge_mixed";

const cx = (...c: Array<string | false | null | undefined>) =>
  c.filter(Boolean).join(" ");

function bytesToBinaryString(bytes: Uint8Array) {
  let result = "";
  const chunkSize = 0x8000;

  for (let i = 0; i < bytes.length; i += chunkSize) {
    result += String.fromCharCode(...bytes.subarray(i, i + chunkSize));
  }

  return result;
}

function latin1StringToUint8Array(value: string) {
  const out = new Uint8Array(value.length);

  for (let i = 0; i < value.length; i += 1) {
    out[i] = value.charCodeAt(i) & 0xff;
  }

  return out;
}

function buildPdfBlobFromImages(
  images: Array<{ jpgBytes: Uint8Array; width: number; height: number }>,
) {
  const objects: string[] = [""];
  const pageRefs: string[] = [];

  images.forEach((image, index) => {
    const pageObj = 3 + index * 3;
    const contentObj = pageObj + 1;
    const imageObj = pageObj + 2;

    const isLandscape = image.width > image.height;
    const pageWidth = isLandscape ? 841.89 : 595.28;
    const pageHeight = isLandscape ? 595.28 : 841.89;
    const margin = 24;

    const scale = Math.min(
      (pageWidth - margin * 2) / image.width,
      (pageHeight - margin * 2) / image.height,
    );

    const drawWidth = image.width * scale;
    const drawHeight = image.height * scale;
    const x = (pageWidth - drawWidth) / 2;
    const y = (pageHeight - drawHeight) / 2;
    const imageName = `Im${index + 1}`;

    const contentStream = `q
${drawWidth.toFixed(2)} 0 0 ${drawHeight.toFixed(2)} ${x.toFixed(2)} ${y.toFixed(2)} cm
/${imageName} Do
Q`;

    objects[pageObj] =
      `<< /Type /Page /Parent 2 0 R /MediaBox [0 0 ${pageWidth.toFixed(2)} ${pageHeight.toFixed(2)}] /Resources << /ProcSet [/PDF /ImageC] /XObject << /${imageName} ${imageObj} 0 R >> >> /Contents ${contentObj} 0 R >>`;
    objects[contentObj] =
      `<< /Length ${contentStream.length} >>\nstream\n${contentStream}\nendstream`;
    objects[imageObj] =
      `<< /Type /XObject /Subtype /Image /Width ${image.width} /Height ${image.height} /ColorSpace /DeviceRGB /BitsPerComponent 8 /Filter /DCTDecode /Length ${image.jpgBytes.length} >>\nstream\n${bytesToBinaryString(image.jpgBytes)}\nendstream`;

    pageRefs.push(`${pageObj} 0 R`);
  });

  objects[1] = "<< /Type /Catalog /Pages 2 0 R >>";
  objects[2] = `<< /Type /Pages /Kids [${pageRefs.join(" ")}] /Count ${pageRefs.length} >>`;

  let pdf = "%PDF-1.4\n%ÿÿÿÿ\n";
  const offsets: number[] = [0];

  for (let i = 1; i < objects.length; i += 1) {
    offsets[i] = pdf.length;
    pdf += `${i} 0 obj\n${objects[i]}\nendobj\n`;
  }

  const xrefOffset = pdf.length;
  pdf += `xref\n0 ${objects.length}\n`;
  pdf += "0000000000 65535 f \n";

  for (let i = 1; i < objects.length; i += 1) {
    pdf += `${String(offsets[i]).padStart(10, "0")} 00000 n \n`;
  }

  pdf += `trailer\n<< /Size ${objects.length} /Root 1 0 R >>\nstartxref\n${xrefOffset}\n%%EOF`;

  return new Blob([latin1StringToUint8Array(pdf)], { type: "application/pdf" });
}

/** Ad slots */
const AD_SLOTS = {
  LEFT_RAIL: "3456789012",
  RIGHT_RAIL: "4567890123",
} as const;

const ADS_ENABLED = true;

// ── Free batch quota helpers ──────────────────────────────────────────────────
const FREE_BATCH_DAILY_LIMIT = 5;
const FREE_TO_PDF_LIMIT = 5;
const PRO_TO_PDF_LIMIT = 25;
const BATCH_QUOTA_KEY = "converto_batch_quota";

type BatchQuota = {
  date: string; // "YYYY-MM-DD"
  used: number;
};

function getTodayStr() {
  return new Date().toISOString().slice(0, 10);
}

function getBatchQuota(): BatchQuota {
  try {
    const raw = localStorage.getItem(BATCH_QUOTA_KEY);
    if (!raw) return { date: getTodayStr(), used: 0 };
    const parsed: BatchQuota = JSON.parse(raw);
    if (parsed.date !== getTodayStr()) return { date: getTodayStr(), used: 0 };
    return parsed;
  } catch {
    return { date: getTodayStr(), used: 0 };
  }
}

function incrementBatchQuota(count: number) {
  const q = getBatchQuota();
  const next: BatchQuota = { date: getTodayStr(), used: q.used + count };
  try {
    localStorage.setItem(BATCH_QUOTA_KEY, JSON.stringify(next));
  } catch {}
  return next;
}

function getMidnightCountdown(): string {
  const now = new Date();
  const midnight = new Date();
  midnight.setHours(24, 0, 0, 0);
  const diffMs = midnight.getTime() - now.getTime();
  const h = Math.floor(diffMs / 3600000);
  const m = Math.floor((diffMs % 3600000) / 60000);
  const s = Math.floor((diffMs % 60000) / 1000);
  return `${String(h).padStart(2, "0")}:${String(m).padStart(2, "0")}:${String(s).padStart(2, "0")}`;
}
// ─────────────────────────────────────────────────────────────────────────────

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
        className,
      )}
    >
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_at_top,rgba(168,85,247,0.14),transparent_55%),radial-gradient(ellipse_at_bottom,rgba(59,130,246,0.10),transparent_55%)]" />
      <div className="relative p-4">
        <div className="mb-3 flex items-center justify-between">
          <div className="text-[11px] font-semibold tracking-wide text-white/55">
            {title}
          </div>
          <div className="text-[11px] text-white/35">
            Ads keep Converto free
          </div>
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

const AUDIO_TARGETS: TargetFmt[] = [
  "MP3",
  "WAV",
  "M4A",
  "AAC",
  "OGG",
  "OPUS",
  "FLAC",
  "AIFF",
  "WMA",
  "AMR",
];

const VIDEO_TARGETS: TargetFmt[] = [
  "MP4",
  "WEBM",
  "MOV",
  "MKV",
  "AVI",
  "WMV",
  "FLV",
  "M4V",
  "MPG",
  "MPEG",
  "3GP",
];

const IMAGE_TARGETS: TargetFmt[] = [
  "GIF",
  "PNG",
  "JPG",
  "WEBP",
  "BMP",
  "TIFF",
  "ICO",
  "AVIF",
];

const PDF_TO_IMAGE_TARGETS = ["PNG", "JPG", "WEBP"] as const;
type PdfToImageTarget = (typeof PDF_TO_IMAGE_TARGETS)[number];

const ALL_TARGET_OPTIONS: TargetFmt[] = [
  ...AUDIO_TARGETS,
  ...VIDEO_TARGETS,
  ...IMAGE_TARGETS,
];

const VIDEO_RESOLUTION_OPTIONS = [
  "Source",
  "144p",
  "240p",
  "360p",
  "480p",
  "720p",
  "1080p",
  "1440p",
  "4K",
] as const;
const VIDEO_QUALITY_OPTIONS = ["small", "balanced", "high"] as const;
const AUDIO_CHANNEL_OPTIONS = ["1", "2"] as const;
const ICO_SIZE_OPTIONS = ["16", "32", "48", "64", "128", "256"] as const;
const ICO_BIT_DEPTH_OPTIONS = ["8", "24", "32"] as const;

const homepagePopularConversions: Array<{ href: string; label: string }> = [
  { href: "/convert/mp4-to-mp3", label: "MP4 to MP3" },
  { href: "/convert/webm-to-mp3", label: "WEBM to MP3" },
  { href: "/convert/flac-to-mp3", label: "FLAC to MP3" },
  { href: "/convert/mp4-to-wav", label: "MP4 to WAV" },
  { href: "/convert/mov-to-mp4", label: "MOV to MP4" },
  { href: "/convert/mp4-to-gif", label: "MP4 to GIF" },
  { href: "/convert/png-to-jpg", label: "PNG to JPG" },
  { href: "/convert/webp-to-png", label: "WEBP to PNG" },
  { href: "/convert/mkv-to-mp4", label: "MKV to MP4" },
  { href: "/convert/avi-to-mp4", label: "AVI to MP4" },
];

type RouteFamily =
  | "audio_to_audio"
  | "video_to_audio"
  | "video_to_video"
  | "video_to_image"
  | "image_to_image"
  | "general";

type DiscoveryCard = {
  href: string;
  label: string;
  badge: string;
};

function getRouteFamily(
  input?: string | null,
  output?: string | null,
): RouteFamily {
  const from = normalizeFmtLabel(input);
  const to = normalizeFmtLabel(output);

  if (isAudioFmt(from) && isAudioFmt(to)) return "audio_to_audio";
  if (isVideoFmt(from) && isAudioFmt(to)) return "video_to_audio";
  if (isVideoFmt(from) && isVideoFmt(to)) return "video_to_video";
  if (isVideoFmt(from) && isImageFmt(to)) return "video_to_image";
  if (isImageFmt(from) && isImageFmt(to)) return "image_to_image";
  return "general";
}

function getFamilyHeroMeta(input?: string | null, output?: string | null) {
  const family = getRouteFamily(input, output);

  if (family === "video_to_audio") {
    return {
      eyebrow: "Extract audio",
      title: "Turn video into a lighter listening format",
      description:
        "Good for music clips, voice tracks, lectures, podcasts, and smaller audio-only copies.",
    };
  }

  if (family === "video_to_video") {
    return {
      eyebrow: "Playback-ready",
      title: "Make video files easier to play and share",
      description:
        "Useful when you want smoother browser support, easier uploads, or a more practical delivery format.",
    };
  }

  if (family === "video_to_image") {
    return {
      eyebrow: "Visual export",
      title: "Create thumbnails, stills, and lightweight previews",
      description:
        "Helpful for quick visual assets, poster frames, previews, and simple web-friendly exports.",
    };
  }

  if (family === "image_to_image") {
    return {
      eyebrow: "Image optimization",
      title: "Switch image formats for size, sharing, or compatibility",
      description:
        "Useful when a site, app, or workflow prefers a different image format for upload or display.",
    };
  }

  if (family === "audio_to_audio") {
    return {
      eyebrow: "Audio format switch",
      title: "Pick the format that fits playback or editing best",
      description:
        "Helpful for smaller listening copies, compatibility across devices, or cleaner handoff into other apps.",
    };
  }

  return {
    eyebrow: "Flexible conversion",
    title: "Convert files without leaving the page",
    description:
      "Upload a file, try another target, and keep moving through nearby formats when your workflow changes.",
  };
}

function buildPopularRouteDiscovery(
  input?: string | null,
  output?: string | null,
): DiscoveryCard[] {
  const from = normalizeFmtLabel(input);
  const to = normalizeFmtLabel(output);
  const family = getRouteFamily(from, to);

  const make = (
    a?: string | null,
    b?: string | null,
    badge = "Suggested",
  ): DiscoveryCard | null => {
    const slug = buildRouteSlug(a, b);
    if (!slug || !a || !b) return null;
    return {
      href: `/convert/${slug}`,
      label: `${normalizeFmtLabel(a)} to ${normalizeFmtLabel(b)}`,
      badge,
    };
  };

  let picks: Array<DiscoveryCard | null> = [];

  if (family === "video_to_audio") {
    picks = [
      make(from, "WAV", "Same source"),
      make(from, "AAC", "Same source"),
      make(from, "FLAC", "Same source"),
      make("WEBM", to ?? "MP3", "Same goal"),
      make("MOV", to ?? "MP3", "Same goal"),
      make("M4A", "MP3", "Popular next"),
    ];
  } else if (family === "video_to_video") {
    picks = [
      make(from, "MP4", "Same source"),
      make(from, "WEBM", "Same source"),
      make(from, "MOV", "Same source"),
      make("MKV", "MP4", "Same goal"),
      make("AVI", "MP4", "Same goal"),
      make("MOV", "MP4", "Popular next"),
    ];
  } else if (family === "video_to_image") {
    picks = [
      make(from, "GIF", "Same source"),
      make(from, "PNG", "Same source"),
      make(from, "JPG", "Same source"),
      make("MP4", "GIF", "Same goal"),
      make("WEBM", "GIF", "Same goal"),
      make("PNG", "JPG", "Popular next"),
    ];
  } else if (family === "image_to_image") {
    picks = [
      make(from, "JPG", "Same source"),
      make(from, "WEBP", "Same source"),
      make(from, "PNG", "Same source"),
      make("WEBP", "PNG", "Same goal"),
      make("PNG", "JPG", "Same goal"),
      make("AVIF", "JPG", "Popular next"),
    ];
  } else if (family === "audio_to_audio") {
    picks = [
      make(from, "MP3", "Same source"),
      make(from, "WAV", "Same source"),
      make(from, "FLAC", "Same source"),
      make("M4A", "MP3", "Same goal"),
      make("FLAC", "MP3", "Same goal"),
      make("MP3", "WAV", "Popular next"),
    ];
  } else {
    picks = homepagePopularConversions.map((item) => ({
      ...item,
      badge: "Popular",
    }));
  }

  const exactHref =
    from && to ? `/convert/${formatToSlug(from)}-to-${formatToSlug(to)}` : null;
  const seen = new Set<string>();

  return picks
    .filter((item): item is DiscoveryCard => !!item)
    .filter((item) => {
      if (item.href === exactHref) return false;
      if (seen.has(item.href)) return false;
      seen.add(item.href);
      return true;
    })
    .slice(0, 6);
}

function buildSuccessSuggestions(
  input?: string | null,
  output?: string | null,
): DiscoveryCard[] {
  const from = normalizeFmtLabel(input);
  const to = normalizeFmtLabel(output);
  if (!from || !to) return [];

  return buildPopularRouteDiscovery(from, to).slice(0, 4);
}

function normalizeFmtLabel(value?: string | null): string | null {
  if (!value) return null;
  return value.toString().trim().toUpperCase();
}

function toTargetFmt(value?: string | null): TargetFmt | null {
  const v = normalizeFmtLabel(value);
  if (!v) return null;
  return ALL_TARGET_OPTIONS.includes(v as TargetFmt) ? (v as TargetFmt) : null;
}

function isAudioFmt(fmt: string | null | undefined) {
  return (
    fmt === "MP3" ||
    fmt === "WAV" ||
    fmt === "M4A" ||
    fmt === "AAC" ||
    fmt === "OGG" ||
    fmt === "OPUS" ||
    fmt === "FLAC" ||
    fmt === "AIFF" ||
    fmt === "WMA" ||
    fmt === "AMR"
  );
}

function isVideoFmt(fmt: string | null | undefined) {
  return (
    fmt === "MP4" ||
    fmt === "WEBM" ||
    fmt === "MOV" ||
    fmt === "MKV" ||
    fmt === "AVI" ||
    fmt === "WMV" ||
    fmt === "FLV" ||
    fmt === "M4V" ||
    fmt === "MPG" ||
    fmt === "MPEG" ||
    fmt === "3GP"
  );
}

function isImageFmt(fmt: string | null | undefined) {
  return (
    fmt === "GIF" ||
    fmt === "PNG" ||
    fmt === "JPG" ||
    fmt === "WEBP" ||
    fmt === "BMP" ||
    fmt === "TIFF" ||
    fmt === "ICO" ||
    fmt === "AVIF"
  );
}

function isPdfImageInputFmt(fmt: string | null | undefined) {
  return (
    fmt === "PNG" ||
    fmt === "JPG" ||
    fmt === "WEBP" ||
    fmt === "BMP" ||
    fmt === "AVIF"
  );
}

function isPdfBuildImageInputFmt(fmt: string | null | undefined) {
  return fmt === "PNG" || fmt === "JPG";
}

function getAvailableTargets(inputFmt?: string | null): TargetFmt[] {
  const fmt = normalizeFmtLabel(inputFmt);

  if (isAudioFmt(fmt)) return AUDIO_TARGETS;
  if (isVideoFmt(fmt))
    return [...AUDIO_TARGETS, ...VIDEO_TARGETS, ...IMAGE_TARGETS];
  if (isImageFmt(fmt)) return IMAGE_TARGETS;

  return ALL_TARGET_OPTIONS;
}

function formatToSlug(value?: string | null) {
  if (!value) return "";
  const normalized = value.toLowerCase();
  if (normalized === "jpeg") return "jpg";
  return normalized;
}
function buildRouteSlug(input?: string | null, output?: string | null) {
  const from = normalizeFmtLabel(input);
  const to = normalizeFmtLabel(output);

  if (!from || !to) return null;
  return `${formatToSlug(from)}-to-${formatToSlug(to)}`;
}

function buildPdfToolPath(
  tool: PdfSeoTool = "to_pdf",
  imageTarget: PdfToImageTarget = "PNG",
) {
  if (tool === "split_pdf") return "/convert/pdf/split";
  if (tool === "pdf_to_image") {
    return `/convert/pdf/to-${String(imageTarget).toLowerCase()}`;
  }
  return "/convert/pdf";
}

function getPdfOutputLabel(
  tool: PdfSeoTool = "to_pdf",
  imageTarget: PdfToImageTarget = "PNG",
) {
  if (tool === "split_pdf") return "PDF";
  if (tool === "pdf_to_image") return imageTarget;
  return "PDF";
}

type RelatedConversionItem = {
  href: string;
  label: string;
  reason: string;
  badge: string;
};

function getFormatIntentLabel(fmt: string) {
  if (isAudioFmt(fmt)) return "Audio";
  if (isVideoFmt(fmt)) return "Video";
  if (isImageFmt(fmt)) return "Image";
  return "Format";
}

function getConversionReason(from: string, to: string) {
  if (isVideoFmt(from) && isAudioFmt(to)) return "Extract audio";
  if (isVideoFmt(from) && isVideoFmt(to)) return "Better playback";
  if (isVideoFmt(from) && isImageFmt(to)) return "Create visuals";
  if (isAudioFmt(from) && isAudioFmt(to)) return "Switch audio format";
  if (isImageFmt(from) && isImageFmt(to)) return "Optimize image";
  return "Try another path";
}

function buildRelatedConversions(
  input?: string | null,
  output?: string | null,
): RelatedConversionItem[] {
  const from = normalizeFmtLabel(input);
  const to = normalizeFmtLabel(output);

  if (!from || !to) return [];

  let pool: TargetFmt[] = [];

  if (isAudioFmt(from)) {
    pool = [...AUDIO_TARGETS];
  } else if (isVideoFmt(from)) {
    pool = [...AUDIO_TARGETS, ...VIDEO_TARGETS, ...IMAGE_TARGETS];
  } else if (isImageFmt(from)) {
    pool = [...IMAGE_TARGETS];
  } else {
    pool = [...ALL_TARGET_OPTIONS];
  }

  const prioritizedPool = pool.sort((a, b) => {
    const aScore =
      Number(isAudioFmt(a) && isVideoFmt(from)) * 3 +
      Number(a === "MP3") * 2 +
      Number(a === "MP4") * 2;
    const bScore =
      Number(isAudioFmt(b) && isVideoFmt(from)) * 3 +
      Number(b === "MP3") * 2 +
      Number(b === "MP4") * 2;
    return bScore - aScore;
  });

  const sameInputRoutes = prioritizedPool
    .filter((fmt) => fmt !== from && fmt !== to)
    .slice(0, 5)
    .map((fmt) => ({
      href: `/convert/${formatToSlug(from)}-to-${formatToSlug(fmt)}`,
      label: `${from} to ${fmt}`,
      reason: getConversionReason(from, fmt),
      badge: getFormatIntentLabel(fmt),
    }));

  const supportingRoutes = homepagePopularConversions
    .filter(
      (item) =>
        item.href !== `/convert/${formatToSlug(from)}-to-${formatToSlug(to)}`,
    )
    .slice(0, 3)
    .map((item) => ({
      ...item,
      reason: "Popular with visitors",
      badge: "Popular",
    }));

  const seen = new Set<string>();
  return [...sameInputRoutes, ...supportingRoutes]
    .filter((item) => {
      if (seen.has(item.href)) return false;
      seen.add(item.href);
      return true;
    })
    .slice(0, 8);
}

function buildSeoContent(input?: string | null, output?: string | null) {
  const from = normalizeFmtLabel(input) ?? "FILE";
  const to = normalizeFmtLabel(output) ?? "FILE";

  const inputIsAudio = isAudioFmt(from);
  const inputIsVideo = isVideoFmt(from);
  const inputIsImage = isImageFmt(from);
  const outputIsImage = isImageFmt(to);

  let intro = `Convert ${from} to ${to} online with Converto. Upload your file, keep the suggested output format, or switch to another format if your workflow changes.`;
  let whyText = `Converting ${from} to ${to} can help with playback compatibility, sharing, compression, editing workflows, or extracting audio from video files.`;
  let useText = `Use this converter when you need a quick way to change ${from} into ${to} for easier playback, sharing, editing, or file compatibility.`;

  if (inputIsAudio && isAudioFmt(to)) {
    intro = `Convert ${from} to ${to} online with a simple workflow. This is useful when you need better compatibility, different compression, or a format that works better across devices and apps.`;
    whyText = `${from} to ${to} conversion is often used for playback support, reducing file size, improving compatibility, or preparing files for editing and sharing.`;
  } else if (inputIsVideo && isAudioFmt(to)) {
    intro = `Convert ${from} to ${to} online to extract audio from video files. This is useful for music clips, voice tracks, podcasts, lectures, and simple audio-only exports.`;
    whyText = `${from} to ${to} conversion is commonly used to extract audio from video, keep only the soundtrack, or create smaller files for listening and sharing.`;
  } else if (inputIsVideo && isVideoFmt(to)) {
    intro = `Convert ${from} to ${to} online for better compatibility, easier sharing, and cleaner playback across browsers, devices, and editing tools.`;
    whyText = `${from} to ${to} conversion is useful when a file needs to be more widely supported, easier to upload, or better suited for editing and playback.`;
  } else if (inputIsVideo && isImageFmt(to)) {
    intro = `Convert ${from} to ${to} online to create image-based output from video content. This can help with previews, thumbnails, lightweight sharing, or visual exports for web workflows.`;
    whyText = `${from} to ${to} conversion can help when you want a visual snapshot, lighter sharing format, or a still-image output for websites, apps, and quick previews.`;
  } else if (inputIsImage && isImageFmt(to)) {
    intro = `Convert ${from} to ${to} online for better compatibility, compression, editing, and sharing. This is useful when different apps, devices, or websites prefer a different image format.`;
    whyText = `${from} to ${to} conversion is commonly used to reduce file size, improve transparency support, preserve compatibility, or prepare images for upload and editing.`;
  } else if (outputIsImage) {
    whyText = `${from} to ${to} conversion is useful for visual sharing, simpler compatibility, and preparing files for web, apps, or quick previews.`;
  }

  const benefits = [
    `Keep ${from} files usable across more apps and devices by exporting to ${to}.`,
    `Reduce friction when sharing, uploading, or opening files in common tools.`,
    `Switch format without forcing visitors to leave the current page or workflow.`,
  ];

  const bestFor = [
    `Quick ${from} to ${to} conversions for everyday use.`,
    `Testing which target format feels most practical for your next step.`,
    `Exploring adjacent formats when the first output choice is not ideal.`,
  ];

  const watchouts = [
    `A new ${to} file can improve compatibility, but it cannot restore missing source quality.`,
    `If the original ${from} file matters for editing or archiving, keep a copy.`,
    `Try another nearby format if ${to} is larger, less compatible, or not what you expected.`,
  ];

  return {
    heading: `${from} to ${to} converter`,
    intro,
    steps: [
      `Upload your ${from} file.`,
      `Use ${to} as the suggested output format or choose a different target.`,
      `Start the conversion and wait for processing to complete.`,
      `Download the converted file when it is ready.`,
    ],
    whyText,
    useText,
    benefits,
    bestFor,
    watchouts,
    browserText:
      "Converto currently uses a hybrid conversion flow: canvas for supported browser-safe image conversions and server-assisted processing for other formats.",
  };
}

function buildBatchSeoContent(input?: string | null, output?: string | null) {
  const from = normalizeFmtLabel(input) ?? "FILE";
  const to = normalizeFmtLabel(output) ?? "FILE";

  return {
    heading: `Batch ${from} to ${to} converter`,
    intro: `Convert multiple ${from} files to ${to} in one batch with Converto. Upload several files, keep the same output target, and download the results together as a ZIP archive.`,
    steps: [
      `Upload multiple ${from} files.`,
      `Keep ${to} as the shared output target.`,
      `Start the batch conversion workflow.`,
      `Download the ZIP archive with your converted ${to} files.`,
    ],
    whyText: `Batch ${from} to ${to} conversion is useful when you need one consistent output format across many files without repeating the same action one by one.`,
    useText: `Use this batch route when folders, repeated exports, or multi-file cleanup would be faster with one shared ${to} output.`,
    benefits: [
      `Convert many ${from} files into ${to} in one run.`,
      `Keep output format choices consistent across a larger group of files.`,
      `Save time when the same conversion has to be repeated across a folder or project batch.`,
    ],
    bestFor: [
      `Bulk ${from} to ${to} processing.`,
      `Repeated exports with one shared output format.`,
      `Teams or workflows that need ZIP delivery after conversion.`,
    ],
    watchouts: [
      `Batch conversion applies one target choice to all uploaded files in that run.`,
      `Keep the originals if you may need another output format later.`,
      `Very mixed source files may still need separate follow-up checks after export.`,
    ],
    browserText:
      "Converto batch conversion groups multiple files into one shared workflow and returns results as a ZIP archive.",
  };
}

function buildPdfSeoContent(
  tool: PdfSeoTool = "to_pdf",
  imageTarget: PdfToImageTarget = "PNG",
) {
  if (tool === "split_pdf") {
    return {
      heading: "Split PDF online",
      intro:
        "Split PDF files online with Converto. Select the pages you want to keep, extract them into a smaller document, and download the result in a fast browser-to-server workflow.",
      steps: [
        "Upload your PDF file.",
        "Choose the page range you want to keep.",
        "Start the split workflow.",
        "Download the extracted PDF file.",
      ],
      whyText:
        "Split PDF is useful when only part of a document matters and you want to send, store, or reuse a smaller file.",
      useText:
        "Use Split PDF for page extraction, partial sharing, study packets, trimmed handouts, or lighter document workflows.",
      benefits: [
        "Extract only the pages you actually need.",
        "Create smaller, easier-to-share PDF files.",
        "Keep PDF-specific work inside one focused tools page.",
      ],
      bestFor: [
        "Page extraction and shorter document handoff.",
        "Sharing only the relevant pages from a longer PDF.",
        "Removing unnecessary pages before sending or storing a file.",
      ],
      watchouts: [
        "Choose the page range carefully before export.",
        "The output PDF keeps only the selected pages.",
        "Keep the original document if you may need the full file later.",
      ],
      browserText:
        "Converto Split PDF keeps PDF-specific page extraction in the same tools hub without switching to a generic converter route.",
    };
  }

  if (tool === "pdf_to_image") {
    return {
      heading: "PDF to image converter",
      intro:
        "Convert PDF pages to PNG, JPG, or WEBP online with Converto. Export page previews, visual slides, or shareable page images without leaving the PDF tools workflow.",
      steps: [
        "Upload your PDF file.",
        "Choose PNG, JPG, or WEBP as the export format.",
        "Start the page export workflow.",
        "Download one image or a ZIP of page images.",
      ],
      whyText:
        "PDF to image export is useful for previews, design review, visual sharing, and workflows that need document pages as regular image files.",
      useText:
        "Use PDF to image when a page needs to become a PNG, JPG, or WEBP preview for web, chat, slides, or lightweight visual sharing.",
      benefits: [
        "Turn document pages into regular image files.",
        "Prepare PDF content for previews, sharing, and visual workflows.",
        "Export one page or many pages without leaving the PDF tools area.",
      ],
      bestFor: [
        "Page previews and thumbnail-like exports.",
        "Sharing document visuals where PDF is not ideal.",
        "Turning selected pages into web-friendly images.",
      ],
      watchouts: [
        "Image export changes the output from document format to visual format.",
        "Multi-page exports may be delivered as a ZIP archive.",
        "Keep the original PDF if searchable text or document structure still matters.",
      ],
      browserText:
        "Converto PDF to image keeps page export focused on PNG, JPG, and WEBP targets inside the PDF tools hub.",
    };
  }

  return {
    heading: "PDF tools",
    intro:
      "Create PDFs from images, split PDFs by page range, and export PDF pages as PNG, JPG, or WEBP from one focused tools page in Converto.",
    steps: [
      "Choose the PDF tool you want to use.",
      "Upload your PDF or image files.",
      "Set the output action for that tool.",
      "Download the finished PDF or exported page files.",
    ],
    whyText:
      "PDF tasks behave differently from format-to-format conversion, so keeping them in a dedicated tools flow makes the workflow easier to understand.",
    useText:
      "Use PDF tools for image-to-PDF creation, page extraction, and PDF-to-image export without mixing those actions into standard converter routes.",
    benefits: [
      "Keep PDF-specific actions in one place.",
      "Switch between To PDF, Split PDF, and PDF to Image quickly.",
      "Use a page that matches PDF intent instead of a generic converter route.",
    ],
    bestFor: [
      "Image-to-PDF creation.",
      "PDF page extraction.",
      "Exporting PDF pages as shareable images.",
    ],
    watchouts: [
      "Different PDF tools produce different outputs: PDF files or images.",
      "Large documents may create multiple output files or ZIP downloads.",
      "Keep the original document when you still need the untouched source version.",
    ],
    browserText:
      "Converto PDF tools group creation, splitting, and page export into one dedicated workflow.",
  };
}

function buildWebPageSchema({
  siteUrl,
  title,
  description,
  input,
  output,
  mode = "convert",
  pdfTool = "to_pdf",
}: {
  siteUrl: string;
  title: string;
  description: string;
  input?: string | null;
  output?: string | null;
  mode?: SeoPageMode;
  pdfTool?: PdfSeoTool;
}) {
  const from = normalizeFmtLabel(input) ?? "FILE";
  const to = normalizeFmtLabel(output) ?? "FILE";

  const slug =
    mode === "batch"
      ? from && to
        ? `/convert/batch/${formatToSlug(from)}-to-${formatToSlug(to)}`
        : "/convert/batch"
      : mode === "pdf"
        ? buildPdfToolPath(
            pdfTool,
            to === "FILE" ? "PNG" : (to as PdfToImageTarget),
          )
        : from && to
          ? `/convert/${formatToSlug(from)}-to-${formatToSlug(to)}`
          : "/converter";

  const aboutName =
    mode === "batch"
      ? `${from} to ${to} batch conversion`
      : mode === "pdf"
        ? pdfTool === "split_pdf"
          ? "Split PDF"
          : pdfTool === "pdf_to_image"
            ? "PDF to image export"
            : "PDF tools"
        : `${from} to ${to} conversion`;

  return {
    "@context": "https://schema.org",
    "@type": "WebPage",
    name: title,
    description,
    url: `${siteUrl}${slug}`,
    isPartOf: {
      "@type": "WebSite",
      name: "Converto",
      url: siteUrl,
    },
    about: {
      "@type": "Thing",
      name: aboutName,
    },
    publisher: {
      "@type": "Organization",
      name: "NexviaSoft",
      url: siteUrl,
    },
  };
}

function SeoInfoSection({
  input,
  output,
  mode = "convert",
  pdfTool = "to_pdf",
  pdfImageTarget = "PNG",
}: {
  input?: string | null;
  output?: string | null;
  mode?: SeoPageMode;
  pdfTool?: PdfSeoTool;
  pdfImageTarget?: PdfToImageTarget;
}) {
  const seo =
    mode === "batch"
      ? buildBatchSeoContent(input, output)
      : mode === "pdf"
        ? buildPdfSeoContent(pdfTool, pdfImageTarget)
        : buildSeoContent(input, output);
  const normalizedInput = normalizeFmtLabel(input) ?? "FILE";
  const normalizedOutput = normalizeFmtLabel(output) ?? "FILE";
  const family = getRouteFamily(input, output);
  const [isExpanded, setIsExpanded] = useState(false);

  const quickFit =
    mode === "pdf"
      ? pdfTool === "split_pdf"
        ? "Best for page extraction, smaller PDF handoff, and trimmed document sharing."
        : pdfTool === "pdf_to_image"
          ? "Best for page previews, visual exports, and lightweight image delivery."
          : "Best for PDF creation, splitting, and page export from one tools hub."
      : mode === "batch"
        ? "Best for repeated exports, folders, and multi-file cleanup with one shared target."
        : family === "video_to_audio"
          ? "Best for extracted audio, lighter listening copies, and simple sharing."
          : family === "video_to_video"
            ? "Best for smoother playback, easier uploads, and broader device support."
            : family === "video_to_image"
              ? "Best for thumbnails, previews, and lightweight visual exports."
              : family === "image_to_image"
                ? "Best for web optimization, upload compatibility, and cleaner image workflows."
                : family === "audio_to_audio"
                  ? "Best for playback flexibility, smaller files, and format compatibility."
                  : "Best for quick everyday conversions with flexible format switching.";

  const hook =
    mode === "pdf"
      ? pdfTool === "split_pdf"
        ? "Split documents by page range without turning PDF work into a generic converter flow."
        : pdfTool === "pdf_to_image"
          ? "Export document pages as visual assets without leaving the PDF tools workflow."
          : "Handle creation, splitting, and page export from one dedicated PDF tools page."
      : mode === "batch"
        ? `Convert multiple ${normalizedInput} files to ${normalizedOutput} in one shared workflow.`
        : family === "video_to_audio"
          ? `Pull audio out of ${normalizedInput} fast and keep the workflow lightweight.`
          : family === "video_to_video"
            ? `Make ${normalizedInput} easier to play, share, and move across devices.`
            : family === "video_to_image"
              ? `Turn ${normalizedInput} into visual assets without slowing the workflow down.`
              : family === "image_to_image"
                ? `Switch ${normalizedInput} into a more practical image format in seconds.`
                : family === "audio_to_audio"
                  ? `Change ${normalizedInput} into a format that fits playback or editing better.`
                  : `Convert ${normalizedInput} to ${normalizedOutput} in seconds with less friction.`;

  return (
    <section className="mx-auto mt-6 max-w-[1100px]">
      <div className="rounded-[26px] bg-white/10 p-5 ring-1 ring-white/10 shadow-[0_18px_55px_rgba(0,0,0,0.25)]">
        <div className="flex flex-col gap-3 md:flex-row md:items-start md:justify-between">
          <div>
            <div className="text-[11px] font-semibold uppercase tracking-[0.18em] text-white/45">
              {mode === "pdf"
                ? "About PDF tools"
                : mode === "batch"
                  ? "About batch conversion"
                  : "About this converter"}
            </div>
            <h2 className="mt-3 text-lg font-semibold tracking-tight text-white">
              {seo.heading}
            </h2>
            <p className="mt-2 max-w-[72ch] text-sm font-medium leading-6 text-white/82">
              {hook}
            </p>
            <p className="mt-2 max-w-[72ch] text-sm leading-6 text-white/60">
              {seo.intro}
            </p>
          </div>

          <button
            type="button"
            onClick={() => setIsExpanded((prev) => !prev)}
            className="inline-flex h-10 items-center justify-center rounded-full border border-white/10 bg-white/5 px-4 text-sm font-semibold text-white/75 transition hover:bg-white/10 hover:text-white"
          >
            {isExpanded ? "Hide details" : "Read more"}
          </button>
        </div>

        <div className="mt-4 flex flex-wrap items-center gap-2">
          <span className="inline-flex rounded-full border border-white/10 bg-white/6 px-3 py-1 text-[11px] font-semibold text-white/65">
            {mode === "pdf"
              ? "PDF tool"
              : getFormatIntentLabel(normalizedInput)}{" "}
            {mode === "pdf" ? "mode" : "input"}
          </span>
          <span className="inline-flex rounded-full border border-white/10 bg-white/6 px-3 py-1 text-[11px] font-semibold text-white/65">
            {mode === "pdf"
              ? pdfTool === "split_pdf"
                ? "PDF output"
                : pdfTool === "pdf_to_image"
                  ? "Image output"
                  : "Document workflow"
              : `${getFormatIntentLabel(normalizedOutput)} output`}
          </span>
          <span className="inline-flex rounded-full border border-emerald-400/20 bg-emerald-500/10 px-3 py-1 text-[11px] font-semibold text-emerald-200">
            {mode === "pdf"
              ? "Focused tools hub"
              : mode === "batch"
                ? "Shared batch route"
                : "Flexible route"}
          </span>
          <span className="inline-flex rounded-full border border-sky-400/20 bg-sky-500/10 px-3 py-1 text-[11px] font-semibold text-sky-200">
            {quickFit}
          </span>
        </div>

        {isExpanded ? (
          <>
            <div className="mt-6 grid gap-4 md:grid-cols-3">
              <div className="rounded-2xl bg-white/5 p-4 ring-1 ring-white/10">
                <h3 className="text-sm font-semibold text-white">
                  {mode === "pdf"
                    ? "Why use this PDF tool?"
                    : mode === "batch"
                      ? `Why batch ${normalizedInput} to ${normalizedOutput}?`
                      : `Why convert ${normalizedInput} to ${normalizedOutput}?`}
                </h3>
                <p className="mt-2 text-sm leading-6 text-white/60">
                  {seo.whyText}
                </p>
              </div>

              <div className="rounded-2xl bg-white/5 p-4 ring-1 ring-white/10">
                <h3 className="text-sm font-semibold text-white">
                  {mode === "pdf"
                    ? "When to use this tool"
                    : mode === "batch"
                      ? "When to use batch conversion"
                      : "When to use this converter"}
                </h3>
                <p className="mt-2 text-sm leading-6 text-white/60">
                  {seo.useText}
                </p>
              </div>

              <div className="rounded-2xl bg-white/5 p-4 ring-1 ring-white/10">
                <h3 className="text-sm font-semibold text-white">
                  {mode === "pdf"
                    ? "Current PDF workflow"
                    : mode === "batch"
                      ? "Current batch workflow"
                      : "Current workflow"}
                </h3>
                <p className="mt-2 text-sm leading-6 text-white/60">
                  {seo.browserText}
                </p>
              </div>
            </div>

            <div className="mt-6 grid gap-4 lg:grid-cols-3">
              <div className="rounded-2xl bg-white/5 p-4 ring-1 ring-white/10">
                <h3 className="text-sm font-semibold text-white">
                  Why this route works well
                </h3>
                <ul className="mt-3 space-y-2 text-sm leading-6 text-white/60">
                  {seo.benefits.map((item) => (
                    <li key={item} className="flex gap-2">
                      <span className="mt-2 h-1.5 w-1.5 shrink-0 rounded-full bg-white/35" />
                      <span>{item}</span>
                    </li>
                  ))}
                </ul>
              </div>

              <div className="rounded-2xl bg-white/5 p-4 ring-1 ring-white/10">
                <h3 className="text-sm font-semibold text-white">Best for</h3>
                <ul className="mt-3 space-y-2 text-sm leading-6 text-white/60">
                  {seo.bestFor.map((item) => (
                    <li key={item} className="flex gap-2">
                      <span className="mt-2 h-1.5 w-1.5 shrink-0 rounded-full bg-white/35" />
                      <span>{item}</span>
                    </li>
                  ))}
                </ul>
              </div>

              <div className="rounded-2xl bg-white/5 p-4 ring-1 ring-white/10">
                <h3 className="text-sm font-semibold text-white">
                  Things to keep in mind
                </h3>
                <ul className="mt-3 space-y-2 text-sm leading-6 text-white/60">
                  {seo.watchouts.map((item) => (
                    <li key={item} className="flex gap-2">
                      <span className="mt-2 h-1.5 w-1.5 shrink-0 rounded-full bg-white/35" />
                      <span>{item}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>

            <div className="mt-6">
              <h3 className="text-sm font-semibold uppercase tracking-[0.18em] text-white/45">
                How it works
              </h3>

              <ol className="mt-4 space-y-3">
                {seo.steps.map((step, index) => (
                  <li
                    key={step}
                    className="flex gap-3 rounded-2xl bg-white/5 px-4 py-3 ring-1 ring-white/10"
                  >
                    <span className="inline-flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-white/10 text-xs font-semibold text-white ring-1 ring-white/10">
                      {index + 1}
                    </span>
                    <span className="text-sm leading-6 text-white/65">
                      {step}
                    </span>
                  </li>
                ))}
              </ol>
            </div>
          </>
        ) : null}
      </div>
    </section>
  );
}

function buildBatchRouteDiscovery(
  input?: string | null,
  output?: string | null,
): DiscoveryCard[] {
  const from = normalizeFmtLabel(input);
  const to = normalizeFmtLabel(output);
  const make = (
    a?: string | null,
    b?: string | null,
    badge = "Batch",
  ): DiscoveryCard | null => {
    const slug = buildRouteSlug(a, b);
    if (!slug || !a || !b) return null;
    return {
      href: `/convert/batch/${slug}`,
      label: `${normalizeFmtLabel(a)} to ${normalizeFmtLabel(b)}`,
      badge,
    };
  };

  const picks = [
    make(from, to, "Current route"),
    make(from, "MP3", "Same source"),
    make(from, "WAV", "Same source"),
    make(from, "MP4", "Same source"),
    make(from, "PNG", "Same source"),
    make(from, "WEBP", "Same source"),
  ];

  const seen = new Set<string>();
  return picks
    .filter((item): item is DiscoveryCard => !!item)
    .filter((item) => {
      if (seen.has(item.href)) return false;
      seen.add(item.href);
      return true;
    })
    .slice(0, 6);
}

function buildPdfRouteDiscovery(
  tool: PdfSeoTool = "to_pdf",
  imageTarget: PdfToImageTarget = "PNG",
): DiscoveryCard[] {
  const cards: DiscoveryCard[] = [
    {
      href: "/convert/pdf",
      label: "PDF tools hub",
      badge: tool === "to_pdf" ? "Overview" : "Hub",
    },
    {
      href: "/convert/pdf/split",
      label: "Split PDF",
      badge: tool === "split_pdf" ? "Active" : "PDF tool",
    },
    {
      href: "/convert/pdf/to-png",
      label: "PDF to PNG",
      badge:
        tool === "pdf_to_image" && imageTarget === "PNG"
          ? "Active"
          : "Page export",
    },
    {
      href: "/convert/pdf/to-jpg",
      label: "PDF to JPG",
      badge:
        tool === "pdf_to_image" && imageTarget === "JPG"
          ? "Active"
          : "Page export",
    },
    {
      href: "/convert/pdf/to-webp",
      label: "PDF to WEBP",
      badge:
        tool === "pdf_to_image" && imageTarget === "WEBP"
          ? "Active"
          : "Page export",
    },
    { href: "/formats", label: "Browse format directory", badge: "Directory" },
  ];

  return cards;
}

function PopularEntrySection({
  input,
  output,
  mode = "convert",
  pdfTool = "to_pdf",
  pdfImageTarget = "PNG",
  onPdfRouteSelect,
}: {
  input?: string | null;
  output?: string | null;
  mode?: SeoPageMode;
  pdfTool?: PdfSeoTool;
  pdfImageTarget?: PdfToImageTarget;
  onPdfRouteSelect?: (href: string) => void;
}) {
  const items =
    mode === "batch"
      ? buildBatchRouteDiscovery(input, output)
      : mode === "pdf"
        ? buildPdfRouteDiscovery(pdfTool, pdfImageTarget)
        : buildPopularRouteDiscovery(input, output);
  const family = getRouteFamily(input, output);

  const heading =
    mode === "pdf"
      ? "Keep exploring PDF tools"
      : mode === "batch"
        ? "Try these next batch routes"
        : family === "video_to_audio"
          ? "Continue with nearby audio conversions"
          : family === "video_to_video"
            ? "Try these next video routes"
            : family === "video_to_image"
              ? "Keep going with visual export routes"
              : family === "image_to_image"
                ? "Try these next image conversions"
                : family === "audio_to_audio"
                  ? "Keep exploring nearby audio paths"
                  : "Try these next conversions";

  const copy =
    mode === "pdf"
      ? "Switch between PDF creation, splitting, and page export routes without falling back to generic format-copy blocks."
      : mode === "batch"
        ? "These suggestions keep batch intent intact so visitors can explore other multi-file targets instead of dropping back into single-file routes."
        : family === "general"
          ? "Jump into the routes people use most, compare nearby outputs, and keep the conversion flow moving without starting over."
          : "These suggestions follow the current route so visitors can test adjacent outputs, compare similar formats, and keep exploring without bouncing away.";

  const formatBadge = (badge: string) => {
    if (badge === "Popular") return "Used often";
    if (badge === "Popular next") return "Popular next";
    if (badge === "Same source") return "Same source";
    if (badge === "Same goal") return "Same goal";
    if (badge === "PDF tool") return "PDF tool";
    if (badge === "Page export") return "Page export";
    if (badge === "Batch") return "Batch";
    if (badge === "Current route") return "Current route";
    if (badge === "Overview") return "Overview";
    if (badge === "Active") return "Active";
    return badge;
  };

  if (!items.length) return null;

  return (
    <section className="mx-auto mt-6 max-w-[1100px]">
      <div className="rounded-[28px] bg-white/10 p-6 ring-1 ring-white/10 shadow-[0_18px_55px_rgba(0,0,0,0.25)]">
        <div className="flex flex-col gap-3 md:flex-row md:items-end md:justify-between">
          <div>
            <div className="text-[11px] font-semibold uppercase tracking-[0.18em] text-white/45">
              Route discovery
            </div>
            <h3 className="mt-3 text-lg font-semibold text-white">{heading}</h3>
            <p className="mt-2 max-w-[70ch] text-sm leading-6 text-white/60">
              {copy}
            </p>
          </div>

          <div className="inline-flex items-center rounded-full border border-white/10 bg-white/5 px-3 py-1.5 text-[11px] font-semibold text-white/58">
            Explore before you leave
          </div>
        </div>

        <div className="mt-5 grid gap-3 sm:grid-cols-2 xl:grid-cols-3">
          {items.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              onClick={(event) => {
                if (mode === "pdf" && onPdfRouteSelect) {
                  event.preventDefault();
                  onPdfRouteSelect(item.href);
                }
              }}
              className="group rounded-[22px] bg-white/5 p-4 ring-1 ring-white/10 transition hover:-translate-y-0.5 hover:bg-white/[0.08] hover:ring-white/20"
            >
              <div className="flex items-start justify-between gap-3">
                <span className="inline-flex rounded-full border border-white/10 bg-white/8 px-2.5 py-1 text-[10px] font-semibold uppercase tracking-[0.14em] text-white/55">
                  {formatBadge(item.badge)}
                </span>
                <span className="text-white/30 transition group-hover:text-white/55">
                  ↗
                </span>
              </div>

              <div className="mt-4 text-base font-semibold text-white">
                {item.label}
              </div>
              <p className="mt-2 text-sm leading-6 text-white/52">
                {mode === "pdf"
                  ? "Jump to another PDF-specific workflow without leaving the tools hub."
                  : mode === "batch"
                    ? "Open another multi-file route without dropping back to single conversion."
                    : "Test another nearby output without resetting the page flow."}
              </p>
            </Link>
          ))}

          {mode !== "pdf" ? (
            <Link
              href="/formats"
              className="group rounded-[22px] bg-white/5 p-4 text-white ring-1 ring-white/10 shadow-[0_14px_35px_rgba(0,0,0,0.25)] transition hover:-translate-y-0.5 hover:bg-white/10 hover:shadow-[0_18px_45px_rgba(0,0,0,0.35)] hover:ring-white/20"
            >
              <div className="flex items-start justify-between gap-3">
                <div className="text-[10px] font-semibold uppercase tracking-[0.14em] text-white/45">
                  DIRECTORY
                </div>
                <span className="text-white/30 transition group-hover:translate-x-0.5 group-hover:-translate-y-0.5 group-hover:text-white/70">
                  ↗
                </span>
              </div>

              <div className="mt-4 text-base font-semibold">
                Browse format directory
              </div>

              <p className="mt-2 text-sm leading-6 text-white/60">
                Explore format guides, format families, and nearby conversion
                paths.
              </p>
            </Link>
          ) : null}
        </div>
      </div>
    </section>
  );
}

function PostConvertSuggestionRail({
  open,
  input,
  output,
  onClose,
  onReset,
  downloadHref,
  downloadName,
}: {
  open: boolean;
  input?: string | null;
  output?: string | null;
  onClose: () => void;
  onReset: () => void;
  downloadHref?: string | null;
  downloadName?: string | null;
}) {
  const items = buildSuccessSuggestions(input, output);
  const family = getRouteFamily(input, output);

  if (!open || !items.length) return null;

  const title =
    family === "video_to_audio"
      ? "Your file is ready — also try other audio outputs"
      : family === "image_to_image"
        ? "Your file is ready — try another image format"
        : family === "video_to_video"
          ? "Your file is ready — compare nearby playback formats"
          : "Your file is ready — also try other formats";

  return (
    <div className="fixed inset-x-0 bottom-4 z-[90] px-4">
      <div className="mx-auto max-w-[1100px] rounded-[24px] border border-white/10 bg-[#0f1830]/95 p-4 shadow-[0_30px_90px_rgba(0,0,0,0.45)] backdrop-blur-xl ring-1 ring-white/10">
        <div className="flex flex-col gap-4 lg:flex-row lg:items-start lg:justify-between">
          <div className="min-w-0 flex-1">
            <div className="flex items-center gap-2">
              <span className="inline-flex rounded-full border border-emerald-400/25 bg-emerald-500/10 px-2.5 py-1 text-[10px] font-semibold uppercase tracking-[0.14em] text-emerald-200">
                Success
              </span>
              <span className="text-[11px] text-white/40">
                Lower bounce · keep exploring
              </span>
            </div>

            <h3 className="mt-3 text-base font-semibold text-white">{title}</h3>
            <p className="mt-2 max-w-[70ch] text-sm leading-6 text-white/60">
              Keep the same source format and test another target before leaving
              the page.
            </p>

            <div className="mt-4 grid gap-3 sm:grid-cols-2 xl:grid-cols-4">
              {items.map((item) => (
                <Link
                  key={item.href}
                  href={item.href}
                  className="rounded-[18px] bg-white/5 p-3 ring-1 ring-white/10 transition hover:bg-white/[0.08]"
                >
                  <div className="text-[10px] font-semibold uppercase tracking-[0.14em] text-white/45">
                    {item.badge}
                  </div>
                  <div className="mt-2 text-sm font-semibold text-white">
                    {item.label}
                  </div>
                </Link>
              ))}
            </div>
          </div>

          <div className="flex shrink-0 flex-wrap items-center gap-2 lg:w-[220px] lg:justify-end">
            {downloadHref ? (
              <a
                href={downloadHref}
                download={downloadName ?? undefined}
                className="inline-flex h-10 items-center justify-center rounded-full bg-white px-4 text-sm font-semibold text-black transition hover:bg-white/90"
              >
                Download again
              </a>
            ) : null}
            <button
              type="button"
              onClick={onReset}
              className="inline-flex h-10 items-center justify-center rounded-full border border-white/10 bg-white/5 px-4 text-sm font-semibold text-white/75 transition hover:bg-white/10 hover:text-white"
            >
              Convert another file
            </button>
            <button
              type="button"
              onClick={onClose}
              className="inline-flex h-10 items-center justify-center rounded-full border border-white/10 bg-transparent px-4 text-sm font-semibold text-white/55 transition hover:bg-white/10 hover:text-white"
            >
              Dismiss
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}


function PdfWorkflowProgressBar({
  status,
  progress,
  title,
  subtitle,
  idleLabel,
  processingLabel,
  doneLabel,
  errorLabel,
}: {
  status: PdfBuildStatus;
  progress: number;
  title: string;
  subtitle: string;
  idleLabel: string;
  processingLabel: string;
  doneLabel: string;
  errorLabel: string;
}) {
  const safeProgress = Math.max(0, Math.min(100, Math.round(progress || 0)));
  const visibleProgress =
    status === "done" ? 100 : status === "idle" ? 0 : safeProgress;

  const label =
    status === "processing"
      ? processingLabel
      : status === "done"
        ? doneLabel
        : status === "error"
          ? errorLabel
          : idleLabel;

  return (
    <div className="mt-5 overflow-hidden rounded-[24px] border border-white/10 bg-white/[0.045] p-4 shadow-[0_18px_45px_rgba(0,0,0,0.18)] ring-1 ring-white/10">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <div className="text-sm font-semibold text-white">{title}</div>
          <div className="mt-1 text-xs leading-5 text-white/50">{subtitle}</div>
        </div>

        <div
          className={cx(
            "inline-flex w-fit items-center gap-2 rounded-full px-3 py-1.5 text-xs font-semibold ring-1",
            status === "done"
              ? "bg-emerald-400/15 text-emerald-200 ring-emerald-300/20"
              : status === "processing"
                ? "bg-cyan-500/10 text-cyan-100 ring-cyan-300/20"
                : status === "error"
                  ? "bg-rose-400/15 text-rose-200 ring-rose-300/20"
                  : "bg-white/8 text-white/65 ring-white/10",
          )}
        >
          <span
            className={cx(
              "h-2 w-2 rounded-full",
              status === "done"
                ? "bg-emerald-300"
                : status === "processing"
                  ? "animate-pulse bg-cyan-200"
                  : status === "error"
                    ? "bg-rose-300"
                    : "bg-white/35",
            )}
          />
          {label}
        </div>
      </div>

      <div className="mt-4 h-2 overflow-hidden rounded-full bg-black/25 ring-1 ring-white/10">
        <div
          className={cx(
            "h-full rounded-full transition-all duration-500",
            status === "error"
              ? "bg-rose-300/80"
              : status === "done"
                ? "bg-emerald-300/90"
                : "bg-white/85",
          )}
          style={{ width: `${visibleProgress}%` }}
        />
      </div>

      <div className="mt-3 grid gap-2 sm:grid-cols-4">
        <div className="rounded-2xl bg-black/20 px-4 py-3 text-xs font-semibold text-white/60 ring-1 ring-white/10">
          Upload files
        </div>
        <div className="rounded-2xl bg-black/20 px-4 py-3 text-xs font-semibold text-white/60 ring-1 ring-white/10">
          Prepare request
        </div>
        <div className="rounded-2xl bg-black/20 px-4 py-3 text-xs font-semibold text-white/60 ring-1 ring-white/10">
          Backend processing
        </div>
        <div className="rounded-2xl bg-black/20 px-4 py-3 text-xs font-semibold text-white/60 ring-1 ring-white/10">
          Download result
        </div>
      </div>
    </div>
  );
}

function ProFeatureLock({
  title,
  enabled,
  children,
  onUpgrade,
}: {
  title: string;
  enabled: boolean;
  children: React.ReactNode;
  onUpgrade: () => void;
}) {
  return (
    <div className="rounded-2xl border border-white/10 bg-white/[0.04] p-4">
      <div className="mb-3 flex items-center justify-between gap-3">
        <div className="flex items-center gap-2">
          <h3 className="text-sm font-semibold text-white">{title}</h3>

          {!enabled && (
            <>
              <span className="inline-flex h-5 items-center rounded-full border border-fuchsia-400/25 bg-fuchsia-500/10 px-2 text-[10px] font-semibold uppercase tracking-[0.14em] text-fuchsia-200">
                Pro
              </span>
              <span className="text-sm text-white/45">🔒</span>
            </>
          )}
        </div>

        {!enabled && (
          <button
            type="button"
            onClick={onUpgrade}
            className="inline-flex h-8 items-center rounded-full border border-white/10 bg-white/5 px-3 text-xs font-semibold text-white/75 transition hover:bg-white/10 hover:text-white"
          >
            Unlock
          </button>
        )}
      </div>

      <div
        className={[
          "transition",
          enabled
            ? ""
            : "pointer-events-none select-none opacity-50 grayscale-[0.15]",
        ].join(" ")}
      >
        {children}
      </div>
    </div>
  );
}

function UpgradePrompt({
  open,
  onClose,
}: {
  open: boolean;
  onClose: () => void;
}) {
  if (!open) return null;

  return (
    <div className="fixed inset-0 z-[120] flex items-center justify-center bg-black/65 px-4">
      <div className="w-full max-w-3xl overflow-hidden rounded-[28px] border border-white/10 bg-[#0b1220] shadow-[0_30px_90px_rgba(0,0,0,0.45)]">
        <div className="border-b border-white/10 bg-[radial-gradient(circle_at_top_left,rgba(34,197,94,0.16),transparent_32%),radial-gradient(circle_at_top_right,rgba(217,70,239,0.18),transparent_34%),linear-gradient(180deg,rgba(255,255,255,0.04),rgba(255,255,255,0.01))] p-6">
          <div className="flex items-start justify-between gap-4">
            <div>
              <div className="inline-flex rounded-full border border-fuchsia-400/30 bg-fuchsia-500/15 px-3 py-1 text-[10px] font-semibold uppercase tracking-[0.18em] text-fuchsia-200">
                Converto Pro
              </div>

              <h3 className="mt-3 text-2xl font-semibold tracking-tight text-white">
                Pick the faster plan for heavier workflows
              </h3>

              <p className="mt-3 max-w-[58ch] text-sm leading-6 text-white/62">
                Free is enough for quick one-off jobs. Pro is built for bigger
                uploads, more files, advanced export controls, and smoother
                repeated use.
              </p>
            </div>

            <button
              type="button"
              onClick={onClose}
              className="rounded-full border border-white/10 bg-white/5 px-3 py-2 text-sm text-white/70 transition hover:bg-white/10 hover:text-white"
            >
              ✕
            </button>
          </div>
        </div>

        <div className="grid gap-4 p-6 md:grid-cols-2">
          <div className="rounded-[24px] border border-white/10 bg-white/[0.04] p-5">
            <div className="flex items-center justify-between gap-3">
              <div>
                <div className="text-xs font-semibold uppercase tracking-[0.18em] text-white/40">
                  Plan
                </div>
                <div className="mt-2 text-xl font-semibold text-white">
                  Free
                </div>
              </div>

              <span className="inline-flex rounded-full border border-white/10 bg-white/5 px-3 py-1 text-[11px] font-semibold text-white/70">
                Start here
              </span>
            </div>

            <ul className="mt-5 space-y-3 text-sm text-white/68">
              <li>• Up to 50MB standard uploads</li>
              <li>• 5 files per PDF build flow</li>
              <li>• Core conversion and PDF tools</li>
              <li>• Best for occasional use</li>
            </ul>
          </div>

          <div className="rounded-[24px] border border-fuchsia-400/20 bg-fuchsia-500/[0.08] p-5 ring-1 ring-fuchsia-400/15">
            <div className="flex items-center justify-between gap-3">
              <div>
                <div className="text-xs font-semibold uppercase tracking-[0.18em] text-fuchsia-200/70">
                  Plan
                </div>
                <div className="mt-2 text-xl font-semibold text-white">Pro</div>
              </div>

              <span className="inline-flex rounded-full border border-fuchsia-400/30 bg-fuchsia-500/15 px-3 py-1 text-[11px] font-semibold text-fuchsia-100">
                Power users
              </span>
            </div>

            <ul className="mt-5 space-y-3 text-sm text-white/75">
              <li>• Up to 1000MB higher upload limits</li>
              <li>• 25 files per PDF build flow</li>
              <li>• Trim, bitrate, sample-rate, image and icon controls</li>
              <li>• Better fit for repeated production-style use</li>
            </ul>
          </div>
        </div>

        <div className="flex flex-wrap items-center justify-between gap-3 border-t border-white/10 px-6 py-5">
          <div className="text-sm text-white/48">
            You can keep using Free now and upgrade only when you need heavier
            limits.
          </div>

          <div className="flex flex-wrap gap-3">
            <Link
              href="/#pricing"
              className="inline-flex h-11 items-center justify-center rounded-full bg-white px-5 text-sm font-semibold text-black transition hover:bg-white/90"
            >
              View Pro plans
            </Link>

            <button
              type="button"
              onClick={onClose}
              className="inline-flex h-11 items-center justify-center rounded-full border border-white/10 bg-white/5 px-5 text-sm font-semibold text-white/75 transition hover:bg-white/10 hover:text-white"
            >
              Maybe later
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

// ── Free Batch Limit Exhausted Banner ─────────────────────────────────────────
function BatchQuotaExhaustedBanner({
  countdown,
  onUpgrade,
}: {
  countdown: string;
  onUpgrade: () => void;
}) {
  return (
    <div className="mt-6 overflow-hidden rounded-[22px] border border-amber-400/20 bg-amber-500/8 ring-1 ring-amber-400/15">
      <div className="p-5">
        <div className="flex items-start gap-4">
          <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-amber-400/15 text-lg">
            ⏳
          </div>

          <div className="flex-1 min-w-0">
            <div className="text-sm font-semibold text-amber-100">
              Daily batch limit reached
            </div>
            <p className="mt-1 text-xs leading-5 text-amber-200/70">
              Free users can batch convert up to {FREE_BATCH_DAILY_LIMIT} files
              per day. Your quota resets at midnight.
            </p>

            {/* Countdown */}
            <div className="mt-4 flex items-center gap-3">
              <div className="rounded-xl border border-white/10 bg-black/30 px-4 py-3 text-center">
                <div className="text-[10px] font-semibold uppercase tracking-[0.18em] text-white/40 mb-1">
                  Resets in
                </div>
                <div className="font-mono text-xl font-bold tracking-widest text-white tabular-nums">
                  {countdown}
                </div>
              </div>

              <div className="text-xs text-white/40 leading-5">
                Or upgrade to Pro for
                <br />
                unlimited batch conversions.
              </div>
            </div>
          </div>
        </div>

        <div className="mt-4 flex items-center gap-3">
          <button
            type="button"
            onClick={onUpgrade}
            className="inline-flex h-9 items-center gap-1.5 rounded-full bg-white px-4 text-xs font-semibold text-black transition hover:bg-white/90"
          >
            <span className="inline-flex h-4 items-center rounded-full border border-fuchsia-400/50 bg-fuchsia-500/20 px-1.5 text-[9px] font-bold uppercase tracking-wide text-fuchsia-200">
              Pro
            </span>
            Upgrade for unlimited
          </button>

          <span className="text-[11px] text-white/35">
            Free quota resets daily at 00:00
          </span>
        </div>
      </div>
    </div>
  );
}

// ── Free Batch Quota Badge ────────────────────────────────────────────────────
function BatchQuotaBadge({
  used,
  limit,
  isPro,
}: {
  used: number;
  limit: number;
  isPro: boolean;
}) {
  if (isPro) {
    return (
      <span className="inline-flex items-center gap-1.5 rounded-full border border-fuchsia-400/25 bg-fuchsia-500/10 px-3 py-1 text-[11px] font-semibold text-fuchsia-200">
        <span className="h-1.5 w-1.5 rounded-full bg-fuchsia-300" />
        Unlimited batch
      </span>
    );
  }

  const remaining = Math.max(0, limit - used);
  const isLow = remaining <= 2 && remaining > 0;
  const isDepleted = remaining === 0;

  return (
    <span
      className={cx(
        "inline-flex items-center gap-1.5 rounded-full px-3 py-1 text-[11px] font-semibold ring-1",
        isDepleted
          ? "border-rose-400/25 bg-rose-500/10 text-rose-200 ring-rose-400/20"
          : isLow
            ? "border-amber-400/25 bg-amber-500/10 text-amber-200 ring-amber-400/20"
            : "border-white/10 bg-white/8 text-white/70 ring-white/10",
      )}
    >
      <span
        className={cx(
          "h-1.5 w-1.5 rounded-full",
          isDepleted ? "bg-rose-300" : isLow ? "bg-amber-300" : "bg-white/40",
        )}
      />
      {isDepleted
        ? "Limit reached"
        : `${remaining} of ${limit} free files left today`}
    </span>
  );
}

function parseResponseDownloadName(response: Response, fallbackName: string) {
  const contentDisposition = response.headers.get("content-disposition") || "";
  const fileNameMatch = contentDisposition.match(
    /filename\*?=(?:UTF-8''|")?([^";]+)/i,
  );

  if (fileNameMatch?.[1]) {
    return decodeURIComponent(fileNameMatch[1].replace(/"/g, "").trim());
  }

  return fallbackName;
}

export default function ConverterPageContent({
  slug,
  seoTitle,
  seoDescription,
  suggestedInput = null,
  suggestedOutput = null,
  rawInputLabel,
  rawOutputLabel,
  seoMode = "convert",
  pdfTool = "to_pdf",
}: ConverterPageContentProps) {
  const router = useRouter();
  const pathname = usePathname();
  const { user } = useUser();

  const SHELL_MAX = "max-w-[1700px]";
  const CENTER_MAX = "max-w-[1100px]";
  const GRID =
    "xl:grid-cols-[260px_minmax(0,1fr)_260px] 2xl:grid-cols-[280px_minmax(0,1fr)_280px]";

  const initialSuggestedInput = toTargetFmt(
    suggestedInput ?? rawInputLabel ?? null,
  );
  const initialSuggestedOutput =
    toTargetFmt(suggestedOutput ?? rawOutputLabel ?? null) ?? "MP3";

  const initialRouteSlug =
    slug ??
    buildRouteSlug(initialSuggestedInput, initialSuggestedOutput) ??
    "mp4-to-mp3";

  const [currentSlug, setCurrentSlug] = useState<string>(initialRouteSlug);

  const [file, setFile] = useState<File | null>(null);
  const [dragOver, setDragOver] = useState(false);
  const [status, setStatus] = useState<ConvertStatus>("idle");
  const [target, setTarget] = useState<TargetFmt>(initialSuggestedOutput);
  const [targetOpen, setTargetOpen] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [resultUrl, setResultUrl] = useState<string | null>(null);
  const [fromFmt, setFromFmt] = useState<TargetFmt | null>(null);

  const [actualProgress, setActualProgress] = useState(0);
  const [displayProgress, setDisplayProgress] = useState(0);
  const [progressLabel, setProgressLabel] = useState("Preparing file...");

  const [routeInput, setRouteInput] = useState<TargetFmt | null>(
    initialSuggestedInput,
  );
  const [routeOutput, setRouteOutput] = useState<TargetFmt>(
    initialSuggestedOutput,
  );
  const [entitlement, setEntitlement] = useState<UserEntitlement | null>(null);
  const fallbackManualPro = user?.id === "user_3Bfa3QpE3MCJzYTIIvMkFJlFmwo";
  const entitlementTier = String(
    (entitlement as any)?.tier || (entitlement as any)?.plan?.tier || "",
  ).toLowerCase();
  const isPro =
    fallbackManualPro ||
    Boolean((entitlement as any)?.isPro) ||
    entitlementTier === "pro";
  const [trimEnabled, setTrimEnabled] = useState(false);
  const [mediaDuration, setMediaDuration] = useState(0);
  const [trimStart, setTrimStart] = useState(0);
  const [trimEnd, setTrimEnd] = useState(0);
  const [audioBitrate, setAudioBitrate] = useState("192k");
  const [audioSampleRate, setAudioSampleRate] = useState("44100");
  const [audioChannels, setAudioChannels] = useState("2");
  const [videoResolution, setVideoResolution] = useState("Source");
  const [videoQuality, setVideoQuality] = useState("balanced");
  const [videoFps, setVideoFps] = useState("30");
  const [videoCodec, setVideoCodec] = useState("h264");
  const [muteAudio, setMuteAudio] = useState(false);
  const [iconSize, setIconSize] = useState("64");
  const [iconBitDepth, setIconBitDepth] = useState("32");
  const [imageWidth, setImageWidth] = useState("");
  const [imageHeight, setImageHeight] = useState("");
  const [imageQuality, setImageQuality] = useState(92);
  const [showUpgradePanel, setShowUpgradePanel] = useState(false);
  const [showPostConvertRail, setShowPostConvertRail] = useState(false);
  const [modeVisualState, setModeVisualState] = useState<"enter" | "idle">(
    "idle",
  );

  // ── Batch state ──────────────────────────────────────────────────────────
  const [batchMode, setBatchMode] = useState(seoMode === "batch");
  const [pdfMode, setPdfMode] = useState(seoMode === "pdf");
  const [pdfToolTab, setPdfToolTab] = useState<PdfSeoTool>(pdfTool);
  const [batchFiles, setBatchFiles] = useState<File[]>([]);
  const [batchDragOver, setBatchDragOver] = useState(false);
  const [batchStatus, setBatchStatus] = useState<BatchStatus>("idle");
  const [batchProgress, setBatchProgress] = useState(0);
  const [batchResultUrl, setBatchResultUrl] = useState<string | null>(null);
  const [batchResultName, setBatchResultName] =
    useState<string>("converto_batch.zip");
  const [batchError, setBatchError] = useState<string | null>(null);

  // ── To PDF state ─────────────────────────────────────────────────────────
  const [pdfFiles, setPdfFiles] = useState<File[]>([]);
  const [toPdfMode, setToPdfMode] = useState<ToPdfMode>("images_to_pdf");
  const [pdfDragOver, setPdfDragOver] = useState(false);
  const [pdfOrderDragIndex, setPdfOrderDragIndex] = useState<number | null>(null);
  useEffect(() => {
    setBatchMode(seoMode === "batch");
    setPdfMode(seoMode === "pdf");
  }, [seoMode]);

  useEffect(() => {
    if (seoMode === "pdf") {
      setPdfToolTab(pdfTool);
    }
  }, [seoMode, pdfTool]);

  const [pdfStatus, setPdfStatus] = useState<PdfBuildStatus>("idle");
  const [pdfProgress, setPdfProgress] = useState(0);
  const [pdfResultUrl, setPdfResultUrl] = useState<string | null>(null);
  const [pdfResultName, setPdfResultName] = useState<string>(
    "converto_images_to_pdf.pdf",
  );
  const [pdfError, setPdfError] = useState<string | null>(null);
  const [splitPdfFile, setSplitPdfFile] = useState<File | null>(null);
  const [splitPdfRange, setSplitPdfRange] = useState("");
  const [splitPdfStatus, setSplitPdfStatus] = useState<PdfBuildStatus>("idle");
  const [splitPdfProgress, setSplitPdfProgress] = useState(0);
  const [splitPdfResultUrl, setSplitPdfResultUrl] = useState<string | null>(
    null,
  );
  const [splitPdfResultName, setSplitPdfResultName] =
    useState<string>("split.pdf");
  const [splitPdfError, setSplitPdfError] = useState<string | null>(null);
  const [pdfToImageFile, setPdfToImageFile] = useState<File | null>(null);
  const [pdfToImageTarget, setPdfToImageTarget] =
    useState<PdfToImageTarget>("PNG");
  const [pdfToImageStatus, setPdfToImageStatus] =
    useState<PdfBuildStatus>("idle");
  const [pdfToImageProgress, setPdfToImageProgress] = useState(0);
  const [pdfToImageResultUrl, setPdfToImageResultUrl] = useState<string | null>(
    null,
  );
  const [pdfToImageResultName, setPdfToImageResultName] = useState<string>(
    "converto_pdf_images.zip",
  );
  const [pdfToImageError, setPdfToImageError] = useState<string | null>(null);
  const [splitPdfPreviewUrl, setSplitPdfPreviewUrl] = useState<string | null>(
    null,
  );
  const [splitPdfPageCount, setSplitPdfPageCount] = useState(0);
  const [splitPdfStartPage, setSplitPdfStartPage] = useState(1);
  const [splitPdfEndPage, setSplitPdfEndPage] = useState(1);
  const [pdfToImagePreviewUrl, setPdfToImagePreviewUrl] = useState<
    string | null
  >(null);
  const [pdfToImagePageCount, setPdfToImagePageCount] = useState(0);

  useEffect(() => {
    if (seoMode !== "pdf") return;

    if (pdfTool === "split_pdf") {
      setPdfToolTab("split_pdf");
      return;
    }

    if (pdfTool === "to_pdf") {
      setPdfToolTab("to_pdf");
      return;
    }

    setPdfToolTab("pdf_to_image");

    if (pathname.includes("/convert/pdf/to-jpg")) {
      setPdfToImageTarget("JPG");
      return;
    }

    if (pathname.includes("/convert/pdf/to-webp")) {
      setPdfToImageTarget("WEBP");
      return;
    }

    setPdfToImageTarget("PNG");
  }, [seoMode, pdfTool, pathname]);

  useEffect(() => {
    setModeVisualState("enter");

    if (typeof window === "undefined") {
      setModeVisualState("idle");
      return;
    }

    const frame = window.requestAnimationFrame(() => {
      setModeVisualState("idle");
    });

    return () => window.cancelAnimationFrame(frame);
  }, [batchMode, pdfMode, pdfToolTab]);

  // ── Free batch quota state ────────────────────────────────────────────────
  const [batchQuotaUsed, setBatchQuotaUsed] = useState(0);
  const [midnightCountdown, setMidnightCountdown] = useState("--:--:--");
  // ─────────────────────────────────────────────────────────────────────────

  const MAX_FREE_MB = isPro ? 1000 : 50;
  const MAX_BYTES = MAX_FREE_MB * 1024 * 1024;

  const targetWrapRef = useRef<HTMLDivElement | null>(null);
  const targetListRef = useRef<HTMLDivElement | null>(null);

  // ── Derived batch quota values ────────────────────────────────────────────
  const batchQuotaRemaining = Math.max(
    0,
    FREE_BATCH_DAILY_LIMIT - batchQuotaUsed,
  );
  const batchQuotaExhausted = !isPro && batchQuotaRemaining === 0;
  const batchTotalBytes = batchFiles.reduce((total, item) => total + item.size, 0);
  const batchTotalMb = batchTotalBytes / (1024 * 1024);
  const batchLimitUsedPercent = Math.min(100, (batchTotalMb / MAX_FREE_MB) * 100);
  const batchOverFileSizeLimit = batchFiles.some((item) => item.size > MAX_BYTES);
  const pdfFileLimit = FREE_TO_PDF_LIMIT;
  // ─────────────────────────────────────────────────────────────────────────

  const resolvedInputLabel = normalizeFmtLabel(
    fromFmt ??
      routeInput ??
      toTargetFmt(rawInputLabel ?? suggestedInput ?? null) ??
      null,
  );

  const resolvedOutputLabel = normalizeFmtLabel(
    target ??
      routeOutput ??
      toTargetFmt(rawOutputLabel ?? suggestedOutput ?? null) ??
      "MP3",
  );

  const canUseTrim = isPro || (entitlement?.trimEnabled ?? false);
  const canUseBitrate = isPro || (entitlement?.audioBitrateControl ?? false);
  const canUseSampleRate =
    isPro || (entitlement?.audioSampleRateControl ?? false);
  const canUseAudioChannels = isPro;
  const canUseVideoResolution = isPro;
  const canUseVideoQuality = isPro;
  const canUseVideoFps = isPro;
  const canUseMuteAudio = isPro;
  const canUseIconControls = isPro;
  const canUseImageResize = isPro;
  const canUseImageQuality = isPro;
  const currentInputIsImage = isImageFmt(resolvedInputLabel);
  const currentInputIsAudio = isAudioFmt(resolvedInputLabel);
  const currentInputIsVideo = isVideoFmt(resolvedInputLabel);
  const outputIsAudio = isAudioFmt(resolvedOutputLabel);
  const outputIsVideo = isVideoFmt(resolvedOutputLabel);
  const outputIsGif = resolvedOutputLabel === "GIF";
  const outputIsIcon = resolvedOutputLabel === "ICO";
  const showTrimControls = currentInputIsAudio || currentInputIsVideo;
  const showBitrateControls =
    currentInputIsAudio || (currentInputIsVideo && outputIsAudio);
  const showSampleRateControls =
    currentInputIsAudio || (currentInputIsVideo && outputIsAudio);
  const showAudioChannelControls = currentInputIsAudio || currentInputIsVideo;
  const showVideoResolutionControls =
    currentInputIsVideo && (outputIsVideo || outputIsGif);
  const showVideoQualityControls =
    currentInputIsVideo && (outputIsVideo || outputIsGif);
  const showVideoFpsControls = currentInputIsVideo && outputIsVideo;
  const showMuteAudioControls = currentInputIsVideo && outputIsVideo;
  const showIconControls = outputIsIcon;
  const showImageResizeControls =
    currentInputIsImage && isImageFmt(resolvedOutputLabel);
  const showImageQualityControls =
    currentInputIsImage &&
    ["JPG", "WEBP", "AVIF"].includes(resolvedOutputLabel ?? "");

  // ── Load batch quota from localStorage on mount ───────────────────────────
  useEffect(() => {
    const q = getBatchQuota();
    setBatchQuotaUsed(q.used);
  }, []);

  // ── Midnight countdown ticker ─────────────────────────────────────────────
  useEffect(() => {
    if (!batchQuotaExhausted) return;

    setMidnightCountdown(getMidnightCountdown());

    const timer = setInterval(() => {
      setMidnightCountdown(getMidnightCountdown());

      // Auto-refresh quota if we've passed midnight
      const q = getBatchQuota();
      setBatchQuotaUsed(q.used);
    }, 1000);

    return () => clearInterval(timer);
  }, [batchQuotaExhausted]);

  useEffect(() => {
    let mounted = true;

    (async () => {
      try {
        const result = await getViewerEntitlement();
        if (!mounted) return;
        setEntitlement(result);
      } catch {
        if (!mounted) return;
        setEntitlement(null);
      }
    })();

    return () => {
      mounted = false;
    };
  }, []);

  useEffect(() => {
    if (slug) {
      setCurrentSlug(slug);
      return;
    }

    const fallbackSlug =
      buildRouteSlug(
        toTargetFmt(suggestedInput ?? rawInputLabel ?? null),
        toTargetFmt(suggestedOutput ?? rawOutputLabel ?? null) ?? "MP3",
      ) ?? "mp4-to-mp3";

    setCurrentSlug(fallbackSlug);
  }, [slug, suggestedInput, suggestedOutput, rawInputLabel, rawOutputLabel]);

  useEffect(() => {
    if (!splitPdfFile) {
      setSplitPdfPreviewUrl((prev) => {
        if (prev) URL.revokeObjectURL(prev);
        return null;
      });
      return;
    }

    const url = URL.createObjectURL(splitPdfFile);
    setSplitPdfPreviewUrl((prev) => {
      if (prev) URL.revokeObjectURL(prev);
      return url;
    });

    return () => URL.revokeObjectURL(url);
  }, [splitPdfFile]);

  useEffect(() => {
    let cancelled = false;

    if (!splitPdfFile) {
      setSplitPdfPageCount(0);
      setSplitPdfStartPage(1);
      setSplitPdfEndPage(1);
      return;
    }

    (async () => {
      try {
        const bytes = await splitPdfFile.arrayBuffer();
        const doc = await PDFDocument.load(bytes);
        if (cancelled) return;
        const count = Math.max(1, doc.getPageCount());
        setSplitPdfPageCount(count);
        setSplitPdfStartPage(1);
        setSplitPdfEndPage(count);
        setSplitPdfError(null);
      } catch {
        if (cancelled) return;
        setSplitPdfPageCount(0);
        setSplitPdfStartPage(1);
        setSplitPdfEndPage(1);
        setSplitPdfError("Could not read PDF pages for preview.");
      }
    })();

    return () => {
      cancelled = true;
    };
  }, [splitPdfFile]);

  useEffect(() => {
    if (!splitPdfPageCount) {
      setSplitPdfRange("");
      return;
    }

    const safeStart = Math.min(splitPdfStartPage, splitPdfEndPage);
    const safeEnd = Math.max(splitPdfStartPage, splitPdfEndPage);
    setSplitPdfRange(
      safeStart === safeEnd ? `${safeStart}` : `${safeStart}-${safeEnd}`,
    );
  }, [splitPdfStartPage, splitPdfEndPage, splitPdfPageCount]);

  useEffect(() => {
    if (!pdfToImageFile) {
      setPdfToImagePreviewUrl((prev) => {
        if (prev) URL.revokeObjectURL(prev);
        return null;
      });
      return;
    }

    const url = URL.createObjectURL(pdfToImageFile);
    setPdfToImagePreviewUrl((prev) => {
      if (prev) URL.revokeObjectURL(prev);
      return url;
    });

    return () => URL.revokeObjectURL(url);
  }, [pdfToImageFile]);

  useEffect(() => {
    let cancelled = false;

    if (!pdfToImageFile) {
      setPdfToImagePageCount(0);
      return;
    }

    (async () => {
      try {
        const bytes = await pdfToImageFile.arrayBuffer();
        const doc = await PDFDocument.load(bytes);
        if (cancelled) return;
        setPdfToImagePageCount(Math.max(1, doc.getPageCount()));
        setPdfToImageError(null);
      } catch {
        if (cancelled) return;
        setPdfToImagePageCount(0);
        setPdfToImageError("Could not read PDF pages for preview.");
      }
    })();

    return () => {
      cancelled = true;
    };
  }, [pdfToImageFile]);

  function formatTime(value: number) {
    if (!Number.isFinite(value) || value < 0) return "00:00";

    const totalSeconds = Math.floor(value);
    const hours = Math.floor(totalSeconds / 3600);
    const minutes = Math.floor((totalSeconds % 3600) / 60);
    const seconds = totalSeconds % 60;

    if (hours > 0) {
      return `${String(hours).padStart(2, "0")}:${String(minutes).padStart(2, "0")}:${String(seconds).padStart(2, "0")}`;
    }

    return `${String(minutes).padStart(2, "0")}:${String(seconds).padStart(2, "0")}`;
  }

  function clamp(value: number, min: number, max: number) {
    return Math.min(Math.max(value, min), max);
  }

  const readMediaDuration = (inputFile: File) =>
    new Promise<number>((resolve) => {
      const objectUrl = URL.createObjectURL(inputFile);
      const media = document.createElement(
        inputFile.type.startsWith("audio/") ? "audio" : "video",
      );

      media.preload = "metadata";
      media.src = objectUrl;

      const cleanup = () => {
        URL.revokeObjectURL(objectUrl);
      };

      media.onloadedmetadata = () => {
        const duration = Number.isFinite(media.duration) ? media.duration : 0;
        cleanup();
        resolve(duration > 0 ? duration : 0);
      };

      media.onerror = () => {
        cleanup();
        resolve(0);
      };
    });

  useEffect(() => {
    const onDown = (e: MouseEvent) => {
      const el = targetWrapRef.current;
      if (!el) return;
      if (!el.contains(e.target as Node)) setTargetOpen(false);
    };

    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") setTargetOpen(false);
    };

    window.addEventListener("mousedown", onDown);
    window.addEventListener("keydown", onKey);

    return () => {
      window.removeEventListener("mousedown", onDown);
      window.removeEventListener("keydown", onKey);
    };
  }, []);

  useEffect(() => {
    if (status !== "processing") return;

    if (actualProgress < 12) setProgressLabel("Preparing file...");
    else if (actualProgress < 28) setProgressLabel("Uploading file...");
    else if (actualProgress < 90) setProgressLabel("Converting...");
    else if (actualProgress < 99) setProgressLabel("Preparing download...");
    else setProgressLabel("Done...");
  }, [actualProgress, status]);

  useEffect(() => {
    if (status !== "processing") return;

    const timer = setInterval(() => {
      setDisplayProgress((prev) => {
        if (prev >= actualProgress) return prev;
        const diff = actualProgress - prev;

        if (prev < 60)
          return Math.min(
            actualProgress,
            prev + Math.max(2, Math.ceil(diff * 0.35)),
          );
        if (prev < 85)
          return Math.min(
            actualProgress,
            prev + Math.max(1, Math.ceil(diff * 0.22)),
          );
        if (prev < 95) return Math.min(actualProgress, prev + 1);

        return Math.min(actualProgress, prev + 1);
      });
    }, 120);

    return () => clearInterval(timer);
  }, [actualProgress, status]);

  const softSyncRoute = (
    nextInput: TargetFmt | null,
    nextOutput: TargetFmt | null,
  ) => {
    if (!nextOutput) return;

    setRouteInput(nextInput);
    setRouteOutput(nextOutput);

    const nextSlug =
      buildRouteSlug(nextInput, nextOutput) ??
      buildRouteSlug(initialSuggestedInput, nextOutput) ??
      currentSlug;

    setCurrentSlug(nextSlug);

    const nextPath = pdfMode
      ? buildPdfToolPath(pdfToolTab, pdfToImageTarget)
      : batchMode
        ? `/convert/batch/${nextSlug}`
        : `/convert/${nextSlug}`;

    if (
      typeof window !== "undefined" &&
      window.location.pathname !== nextPath
    ) {
      window.history.replaceState(window.history.state, "", nextPath);
    }
  };

  const detectFmt = (name: string): TargetFmt | null => {
    const n = name.toLowerCase();

    if (n.endsWith(".mp3")) return "MP3";
    if (n.endsWith(".wav")) return "WAV";
    if (n.endsWith(".m4a")) return "M4A";
    if (n.endsWith(".aac")) return "AAC";
    if (n.endsWith(".ogg")) return "OGG";
    if (n.endsWith(".opus")) return "OPUS";
    if (n.endsWith(".flac")) return "FLAC";
    if (n.endsWith(".aiff") || n.endsWith(".aif")) return "AIFF";
    if (n.endsWith(".wma")) return "WMA";
    if (n.endsWith(".amr")) return "AMR";

    if (n.endsWith(".mp4")) return "MP4";
    if (n.endsWith(".webm")) return "WEBM";
    if (n.endsWith(".mov")) return "MOV";
    if (n.endsWith(".mkv")) return "MKV";
    if (n.endsWith(".avi")) return "AVI";
    if (n.endsWith(".wmv")) return "WMV";
    if (n.endsWith(".flv")) return "FLV";
    if (n.endsWith(".m4v")) return "M4V";
    if (n.endsWith(".mpg")) return "MPG";
    if (n.endsWith(".mpeg")) return "MPEG";
    if (n.endsWith(".3gp")) return "3GP";

    if (n.endsWith(".gif")) return "GIF";
    if (n.endsWith(".png")) return "PNG";
    if (n.endsWith(".jpg") || n.endsWith(".jpeg")) return "JPG";
    if (n.endsWith(".webp")) return "WEBP";
    if (n.endsWith(".bmp")) return "BMP";
    if (n.endsWith(".tiff") || n.endsWith(".tif")) return "TIFF";
    if (n.endsWith(".ico")) return "ICO";
    if (n.endsWith(".avif")) return "AVIF";

    return null;
  };

  const getAcceptForInput = () => {
    return ".mp3,.wav,.m4a,.aac,.ogg,.opus,.flac,.aiff,.aif,.wma,.amr,.mp4,.webm,.mov,.mkv,.avi,.wmv,.flv,.m4v,.mpg,.mpeg,.3gp,.gif,.png,.jpg,.jpeg,.webp,.bmp,.tiff,.tif,.ico,.avif,video/*,audio/*,image/gif,image/png,image/jpeg,image/webp,image/bmp,image/avif";
  };

  const validateFile = (f: File) => {
    if (f.size > MAX_BYTES) return `File is too large. Max ${MAX_FREE_MB}MB.`;

    const name = f.name.toLowerCase();
    const okExt = [
      ".mp3",
      ".wav",
      ".m4a",
      ".aac",
      ".ogg",
      ".opus",
      ".flac",
      ".aiff",
      ".aif",
      ".wma",
      ".amr",
      ".mp4",
      ".webm",
      ".mov",
      ".mkv",
      ".avi",
      ".wmv",
      ".flv",
      ".m4v",
      ".mpg",
      ".mpeg",
      ".3gp",
      ".gif",
      ".png",
      ".jpg",
      ".jpeg",
      ".webp",
      ".bmp",
      ".tiff",
      ".tif",
      ".ico",
      ".avif",
    ].some((x) => name.endsWith(x));

    if (!okExt) return "Unsupported format selected.";

    return null;
  };

  const revokeUrl = (url: string | null) => {
    if (url) URL.revokeObjectURL(url);
  };

  const revokePreview = () => {
    setPreviewUrl((prev) => {
      revokeUrl(prev);
      return null;
    });
  };

  const revokeResult = () => {
    setResultUrl((prev) => {
      revokeUrl(prev);
      return null;
    });
  };

  const resetConverter = () => {
    revokeResult();
    revokePreview();
    setFile(null);
    setFromFmt(null);
    setStatus("idle");
    setErrorMsg(null);
    setTarget(initialSuggestedOutput);
    setRouteInput(initialSuggestedInput);
    setRouteOutput(initialSuggestedOutput);
    setActualProgress(0);
    setDisplayProgress(0);
    setProgressLabel("Preparing file...");
    setTargetOpen(false);
    setShowPostConvertRail(false);
    setAudioSampleRate("44100");
    setAudioChannels("2");
    setVideoResolution("Source");
    setVideoQuality("balanced");
    setVideoFps("30");
    setMuteAudio(false);
    setIconSize("64");
    setIconBitDepth("32");
    setImageWidth("");
    setImageHeight("");
    setTrimEnabled(false);
    setMediaDuration(0);
    setTrimStart(0);
    setTrimEnd(0);

    if (typeof window !== "undefined") {
      const resetSlug =
        buildRouteSlug(initialSuggestedInput, initialSuggestedOutput) ??
        "mp4-to-mp3";

      setCurrentSlug(resetSlug);

      const resetPath = `/convert/${resetSlug}`;
      if (window.location.pathname !== resetPath) {
        window.history.replaceState(window.history.state, "", resetPath);
      }
    }
  };

  const buildOutputName = (original: string, ext: string) => {
    const base = original.replace(/\.[^/.]+$/, "");
    return `${base}_converto.${ext}`;
  };

  const outputExtMap: Record<TargetFmt, string> = {
    MP3: "mp3",
    WAV: "wav",
    M4A: "m4a",
    AAC: "aac",
    OGG: "ogg",
    OPUS: "opus",
    FLAC: "flac",
    AIFF: "aiff",
    WMA: "wma",
    AMR: "amr",
    MP4: "mp4",
    WEBM: "webm",
    MOV: "mov",
    MKV: "mkv",
    AVI: "avi",
    WMV: "wmv",
    FLV: "flv",
    M4V: "m4v",
    MPG: "mpg",
    MPEG: "mpeg",
    "3GP": "3gp",
    GIF: "gif",
    PNG: "png",
    JPG: "jpg",
    WEBP: "webp",
    BMP: "bmp",
    TIFF: "tiff",
    ICO: "ico",
    AVIF: "avif",
  };

  const canvasMimeMap: Partial<Record<TargetFmt, string>> = {
    PNG: "image/png",
    JPG: "image/jpeg",
    WEBP: "image/webp",
  };

  const canConvertViaCanvas = (
    inputFmt: TargetFmt | null,
    outputFmt: TargetFmt,
  ) => {
    const hasResize = !!imageWidth || !!imageHeight;
    const needsAdvancedImageProcessing = hasResize || outputFmt === "AVIF";

    return (
      !!inputFmt &&
      inputFmt !== "GIF" &&
      ["PNG", "JPG", "WEBP", "BMP", "AVIF"].includes(inputFmt) &&
      ["PNG", "JPG", "WEBP"].includes(outputFmt) &&
      !needsAdvancedImageProcessing
    );
  };

  const loadImageElement = (src: string) =>
    new Promise<HTMLImageElement>((resolve, reject) => {
      const img = new Image();
      img.onload = () => resolve(img);
      img.onerror = () =>
        reject(new Error("Image preview could not be loaded."));
      img.src = src;
    });

  const canvasToBlob = (
    canvas: HTMLCanvasElement,
    type: string,
    quality?: number,
  ) =>
    new Promise<Blob>((resolve, reject) => {
      canvas.toBlob(
        (blob) => {
          if (!blob) {
            reject(new Error("Image conversion failed."));
            return;
          }
          resolve(blob);
        },
        type,
        quality,
      );
    });

  const convertImageViaCanvas = async (
    inputFile: File,
    targetFormat: TargetFmt,
  ) => {
    const objectUrl = URL.createObjectURL(inputFile);

    try {
      const img = await loadImageElement(objectUrl);
      const canvas = document.createElement("canvas");
      canvas.width = img.naturalWidth || img.width;
      canvas.height = img.naturalHeight || img.height;

      const ctx = canvas.getContext("2d");
      if (!ctx) throw new Error("Canvas context could not be created.");

      if (targetFormat === "JPG") {
        ctx.fillStyle = "#ffffff";
        ctx.fillRect(0, 0, canvas.width, canvas.height);
      }

      ctx.drawImage(img, 0, 0);

      const mimeType = canvasMimeMap[targetFormat];
      if (!mimeType) throw new Error("Unsupported image output format.");

      const quality =
        targetFormat === "JPG" || targetFormat === "WEBP"
          ? imageQuality / 100
          : undefined;
      const blob = await canvasToBlob(canvas, mimeType, quality);
      return URL.createObjectURL(blob);
    } finally {
      URL.revokeObjectURL(objectUrl);
    }
  };

  const fileToPdfPageImage = async (inputFile: File) => {
    const objectUrl = URL.createObjectURL(inputFile);

    try {
      const img = await loadImageElement(objectUrl);
      const canvas = document.createElement("canvas");
      canvas.width = img.naturalWidth || img.width;
      canvas.height = img.naturalHeight || img.height;

      const ctx = canvas.getContext("2d");
      if (!ctx) throw new Error("Canvas context could not be created.");

      ctx.fillStyle = "#ffffff";
      ctx.fillRect(0, 0, canvas.width, canvas.height);
      ctx.drawImage(img, 0, 0);

      const blob = await canvasToBlob(canvas, "image/jpeg", 0.92);
      const buffer = await blob.arrayBuffer();

      return {
        width: canvas.width,
        height: canvas.height,
        jpgBytes: new Uint8Array(buffer),
      };
    } finally {
      URL.revokeObjectURL(objectUrl);
    }
  };

  const createPdfFromImages = async (files: File[]) => {
    const pages = await Promise.all(
      files.map((item) => fileToPdfPageImage(item)),
    );
    return buildPdfBlobFromImages(pages);
  };

  const API_URL =
    process.env.NEXT_PUBLIC_CONVERTO_API_URL?.replace(/\/$/, "") || "";

  const requestTier = isPro ? "pro" : "free";
  const requestHeaders = {
    "x-user-id": user?.id ?? "",
    "x-user-tier": requestTier,
    "x-user-pro": String(isPro),
  };

  const convertViaServer = async (inputFile: File, targetFormat: TargetFmt) => {
    if (!API_URL) throw new Error("Server conversion is not configured.");

    const controller = new AbortController();
    const timeout = setTimeout(() => controller.abort(), 1000 * 60 * 8);

    try {
      const formData = new FormData();
      const normalizedVideoResolution =
        videoResolution === "Source"
          ? ""
          : videoResolution === "4K"
            ? "2160p"
            : videoResolution;
      const normalizedTarget = targetFormat.toLowerCase();

      formData.append("file", inputFile);
      formData.append("target", normalizedTarget);

      formData.append("trimEnabled", String(trimEnabled));

      if (trimEnabled) {
        formData.append("trimStart", trimStart.toFixed(2));
        formData.append("trimEnd", trimEnd.toFixed(2));
      }

      formData.append("audioBitrate", audioBitrate || "");
      formData.append("audioSampleRate", audioSampleRate || "");
      formData.append("audioChannels", audioChannels || "");

      formData.append("videoResolution", normalizedVideoResolution || "");
      formData.append("videoQuality", videoQuality || "");
      formData.append("videoFps", videoFps || "");
      formData.append("videoCodec", videoCodec || "");

      formData.append("muteAudio", String(Boolean(muteAudio)));

      if (targetFormat.toLowerCase() === "ico") {
        formData.append("iconSize", iconSize || "");
        formData.append("iconBitDepth", iconBitDepth || "");
      }

      formData.append("imageWidth", imageWidth || "");
      formData.append("imageHeight", imageHeight || "");
      if (["jpg", "webp", "avif"].includes(targetFormat.toLowerCase())) {
        formData.append("imageQuality", String(imageQuality ?? ""));
      }

      const res = await fetch(`${API_URL}/convert`, {
        method: "POST",
        body: formData,
        signal: controller.signal,
        headers: requestHeaders,
      });

      if (!res.ok) {
        let message = "Server conversion failed.";

        try {
          const data = await res.json();
          if (data?.error) {
            message = data.error;
          }
        } catch {}

        throw new Error(message);
      }

      const blob = await res.blob();

      if (!blob || blob.size === 0) {
        throw new Error("Converted file is empty.");
      }

      return URL.createObjectURL(blob);
    } catch (error: any) {
      if (error?.name === "AbortError") {
        throw new Error("Conversion timed out. Please try a smaller file.");
      }

      throw error;
    } finally {
      clearTimeout(timeout);
    }
  };

  const pickFile = async (f: File) => {
    const err = validateFile(f);

    if (err) {
      setErrorMsg(err);
      setStatus("error");
      setFile(null);
      setFromFmt(null);
      revokePreview();
      revokeResult();
      return;
    }

    const detected = detectFmt(f.name);
    const availableForDetected = getAvailableTargets(detected);
    const desiredTarget = routeOutput ?? target ?? "MP3";
    const nextTarget = availableForDetected.includes(desiredTarget)
      ? desiredTarget
      : availableForDetected[0];

    setFromFmt(detected);
    setFile(f);
    setErrorMsg(null);
    setStatus("ready");

    revokePreview();
    setPreviewUrl(URL.createObjectURL(f));
    revokeResult();

    setTarget(nextTarget);

    const isMedia = detected && (isAudioFmt(detected) || isVideoFmt(detected));

    if (isMedia) {
      const duration = await readMediaDuration(f);
      setMediaDuration(duration);
      setTrimEnabled(false);
      setTrimStart(0);
      setTrimEnd(duration > 0 ? duration : 0);
    } else {
      setMediaDuration(0);
      setTrimEnabled(false);
      setTrimStart(0);
      setTrimEnd(0);
    }

    setActualProgress(0);
    setDisplayProgress(0);
    setProgressLabel("Preparing file...");

    softSyncRoute(detected, nextTarget);
  };

  const startConvert = async () => {
    if (!file) return;

    if (trimEnabled) {
      if (!mediaDuration || mediaDuration <= 0) {
        setErrorMsg(
          "Trim is not available because media duration could not be detected.",
        );
        setStatus("error");
        return;
      }

      if (trimEnd <= trimStart) {
        setErrorMsg("Trim end must be greater than trim start.");
        setStatus("error");
        return;
      }

      if (trimEnd - trimStart < 0.25) {
        setErrorMsg("Selected trim range is too short.");
        setStatus("error");
        return;
      }
    }

    let fakeTimer: ReturnType<typeof setInterval> | null = null;

    try {
      setErrorMsg(null);
      setStatus("processing");
      setActualProgress(6);
      setDisplayProgress(3);
      setProgressLabel("Preparing file...");
      setTargetOpen(false);

      fakeTimer = setInterval(() => {
        setActualProgress((prev) => {
          if (prev >= 90) return prev;
          if (prev < 15) return prev + 7;
          if (prev < 30) return prev + 5;
          if (prev < 55) return prev + 3;
          if (prev < 75) return prev + 2;
          return prev + 1;
        });
      }, 300);

      let convertedUrl: string;

      if (canConvertViaCanvas(fromFmt, target))
        convertedUrl = await convertImageViaCanvas(file, target);
      else convertedUrl = await convertViaServer(file, target);

      if (fakeTimer) clearInterval(fakeTimer);

      setActualProgress(97);
      setProgressLabel("Preparing download...");

      revokeResult();
      setResultUrl(convertedUrl);

      setActualProgress(100);
      setDisplayProgress(100);
      setProgressLabel("Done...");
      setStatus("done");
    } catch (err: any) {
      if (fakeTimer) clearInterval(fakeTimer);
      setErrorMsg(err?.message ?? "Server conversion failed.");
      setStatus("error");
      setActualProgress(0);
      setDisplayProgress(0);
      setProgressLabel("Preparing file...");
    }
  };

  const validatePdfFile = (f: File) => {
    if (f.size > MAX_BYTES) return `File is too large. Max ${MAX_FREE_MB}MB.`;

    const detected = detectFmt(f.name);
    const isPdf =
      f.type === "application/pdf" || f.name.toLowerCase().endsWith(".pdf");

    if (toPdfMode === "images_to_pdf") {
      if (!isPdfBuildImageInputFmt(detected)) {
        return "Images to PDF currently supports PNG and JPG/JPEG files during beta.";
      }
      return null;
    }

    if (toPdfMode === "merge_pdfs") {
      if (!isPdf) return "Merge PDFs mode only accepts PDF files.";
      return null;
    }

    if (!isPdf && !isPdfBuildImageInputFmt(detected)) {
      return "Mixed merge currently supports PDF, PNG, and JPG/JPEG files during beta.";
    }

    return null;
  };

  const addPdfFiles = (incoming: File[]) => {
    const valid: File[] = [];

    for (const item of incoming) {
      const err = validatePdfFile(item);
      if (err) {
        setPdfError(err);
        setPdfStatus("error");
        return;
      }
      valid.push(item);
    }

    setPdfFiles((prev) => {
      const existing = new Set(prev.map((item) => `${item.name}-${item.size}`));
      const fresh = valid.filter(
        (item) => !existing.has(`${item.name}-${item.size}`),
      );
      return [...prev, ...fresh].slice(0, pdfFileLimit);
    });

    setPdfError(null);
    setPdfStatus("idle");
    setPdfProgress(0);
    revokeUrl(pdfResultUrl);
    setPdfResultUrl(null);
  };

  const removePdfFile = (index: number) => {
    setPdfFiles((prev) => prev.filter((_, itemIndex) => itemIndex !== index));
    setPdfStatus("idle");
    setPdfProgress(0);
    setPdfError(null);
    revokeUrl(pdfResultUrl);
    setPdfResultUrl(null);
  };

  const movePdfFile = (index: number, direction: "up" | "down") => {
    setPdfFiles((prev) => {
      const next = [...prev];
      const targetIndex = direction === "up" ? index - 1 : index + 1;

      if (targetIndex < 0 || targetIndex >= next.length) return prev;

      [next[index], next[targetIndex]] = [next[targetIndex], next[index]];
      return next;
    });

    setPdfStatus("idle");
    setPdfProgress(0);
    setPdfError(null);
    revokeUrl(pdfResultUrl);
    setPdfResultUrl(null);
  };


  const reorderPdfFiles = (fromIndex: number, toIndex: number) => {
    if (fromIndex === toIndex) return;

    setPdfFiles((prev) => {
      if (
        fromIndex < 0 ||
        toIndex < 0 ||
        fromIndex >= prev.length ||
        toIndex >= prev.length
      ) {
        return prev;
      }

      const next = [...prev];
      const [moved] = next.splice(fromIndex, 1);
      next.splice(toIndex, 0, moved);
      return next;
    });

    setPdfStatus("idle");
    setPdfProgress(0);
    setPdfError(null);
    revokeUrl(pdfResultUrl);
    setPdfResultUrl(null);
  };

  const handlePdfOrderDrop = (targetIndex: number) => {
    if (pdfOrderDragIndex === null) return;
    reorderPdfFiles(pdfOrderDragIndex, targetIndex);
    setPdfOrderDragIndex(null);
  };

  const resetPdfBuilder = () => {
    revokeUrl(pdfResultUrl);
    setPdfFiles([]);
    setPdfDragOver(false);
    setPdfStatus("idle");
    setPdfProgress(0);
    setPdfResultUrl(null);
    setPdfResultName("converto_images_to_pdf.pdf");
    setPdfError(null);
  };

  const startPdfBuild = async () => {
    if (!pdfFiles.length) return;

    let fakeTimer: ReturnType<typeof setInterval> | null = null;

    try {
      setPdfStatus("processing");
      setPdfProgress(6);
      setPdfError(null);
      revokeUrl(pdfResultUrl);
      setPdfResultUrl(null);

      fakeTimer = setInterval(() => {
        setPdfProgress((prev) => {
          if (prev >= 92) return prev;
          if (prev < 20) return prev + 6;
          if (prev < 55) return prev + 4;
          if (prev < 80) return prev + 2;
          return prev + 1;
        });
      }, 220);

      const stamp = new Date().toISOString().slice(0, 10);
      let resultBlob: Blob | null = null;
      let outputName =
        pdfFiles.length === 1
          ? buildOutputName(pdfFiles[0].name, "pdf")
          : `converto_images_to_pdf_${stamp}.pdf`;

      if (toPdfMode === "images_to_pdf" && !API_URL) {
        resultBlob = await createPdfFromImages(pdfFiles);
      } else {
        if (!API_URL) {
          throw new Error("Server conversion is not configured.");
        }

        const controller = new AbortController();
        const timeout = setTimeout(() => controller.abort(), 1000 * 60 * 8);

        try {
          const formData = new FormData();
          for (const item of pdfFiles) {
            formData.append("files", item);
          }

          const endpoint =
            toPdfMode === "images_to_pdf"
              ? "/pdf/from-images"
              : toPdfMode === "merge_pdfs"
                ? "/pdf/merge"
                : "/pdf/merge-mixed";

          const response = await fetch(`${API_URL}${endpoint}`, {
            method: "POST",
            body: formData,
            headers: requestHeaders,
            signal: controller.signal,
          });

          if (!response.ok) {
            let message = "PDF build failed.";
            try {
              const data = await response.json();
              if (data?.error) message = data.error;
            } catch {}
            throw new Error(message);
          }

          resultBlob = await response.blob();
          outputName = parseResponseDownloadName(response, outputName);
        } finally {
          clearTimeout(timeout);
        }
      }

      if (fakeTimer) clearInterval(fakeTimer);

      if (!resultBlob) {
        throw new Error("PDF build returned no file.");
      }

      setPdfResultName(outputName);
      setPdfResultUrl(URL.createObjectURL(resultBlob));
      setPdfProgress(100);
      setPdfStatus("done");
    } catch (error: any) {
      if (fakeTimer) clearInterval(fakeTimer);
      setPdfProgress(0);
      setPdfStatus("error");
      setPdfError(error?.message ?? "PDF creation failed.");
    }
  };

  const validateSplitPdfFile = (f: File) => {
    if (f.size > MAX_BYTES) return `File is too large. Max ${MAX_FREE_MB}MB.`;

    const isPdf =
      f.type === "application/pdf" || f.name.toLowerCase().endsWith(".pdf");

    if (!isPdf) return "Split PDF only supports PDF files.";

    return null;
  };

  const resetSplitPdf = () => {
    revokeUrl(splitPdfResultUrl);
    setSplitPdfFile(null);
    setSplitPdfRange("");
    setSplitPdfStatus("idle");
    setSplitPdfProgress(0);
    setSplitPdfResultUrl(null);
    setSplitPdfResultName("split.pdf");
    setSplitPdfError(null);
    setSplitPdfPageCount(0);
    setSplitPdfStartPage(1);
    setSplitPdfEndPage(1);
  };

  const startSplitPdf = async () => {
    if (!splitPdfFile) {
      setSplitPdfError("Please choose a PDF file.");
      setSplitPdfStatus("error");
      return;
    }

    if (!splitPdfRange.trim()) {
      setSplitPdfError("Please enter a page range. Example: 1-3 or 1,3,5-7");
      setSplitPdfStatus("error");
      return;
    }

    if (!API_URL) {
      setSplitPdfError("Server conversion is not configured.");
      setSplitPdfStatus("error");
      return;
    }

    let fakeTimer: ReturnType<typeof setInterval> | null = null;

    try {
      setSplitPdfError(null);
      setSplitPdfStatus("processing");
      setSplitPdfProgress(6);

      revokeUrl(splitPdfResultUrl);
      setSplitPdfResultUrl(null);

      fakeTimer = setInterval(() => {
        setSplitPdfProgress((prev) => {
          if (prev >= 90) return prev;
          if (prev < 20) return prev + 6;
          if (prev < 55) return prev + 4;
          if (prev < 80) return prev + 2;
          return prev + 1;
        });
      }, 220);

      const formData = new FormData();
      formData.append("file", splitPdfFile);
      formData.append("range", splitPdfRange.trim());

      const response = await fetch(`${API_URL}/pdf/split`, {
        method: "POST",
        body: formData,
        headers: requestHeaders,
      });

      if (!response.ok) {
        let message = "Split PDF failed.";
        try {
          const data = await response.json();
          if (data?.error) message = data.error;
        } catch {}
        throw new Error(message);
      }

      const blob = await response.blob();
      const resultUrl = URL.createObjectURL(blob);

      if (fakeTimer) clearInterval(fakeTimer);

      const baseName = splitPdfFile.name.replace(/\.pdf$/i, "");
      const outputName = `${baseName}-split.pdf`;

      setSplitPdfResultUrl(resultUrl);
      setSplitPdfResultName(outputName);
      setSplitPdfProgress(100);
      setSplitPdfStatus("done");
    } catch (err: any) {
      if (fakeTimer) clearInterval(fakeTimer);
      setSplitPdfError(err?.message ?? "Split PDF failed.");
      setSplitPdfStatus("error");
      setSplitPdfProgress(0);
    }
  };

  const validatePdfToImageFile = (f: File) => {
    if (f.size > MAX_BYTES) return `File is too large. Max ${MAX_FREE_MB}MB.`;

    const isPdf =
      f.type === "application/pdf" || f.name.toLowerCase().endsWith(".pdf");

    if (!isPdf) return "PDF to Image only supports PDF files.";

    return null;
  };

  const resetPdfToImage = () => {
    revokeUrl(pdfToImageResultUrl);
    setPdfToImageFile(null);
    setPdfToImageTarget("PNG");
    setPdfToImageStatus("idle");
    setPdfToImageProgress(0);
    setPdfToImageResultUrl(null);
    setPdfToImageResultName("converto_pdf_images.zip");
    setPdfToImageError(null);
  };

  const startPdfToImage = async () => {
    if (!pdfToImageFile) {
      setPdfToImageError("Please choose a PDF file.");
      setPdfToImageStatus("error");
      return;
    }

    if (!API_URL) {
      setPdfToImageError("Server conversion is not configured.");
      setPdfToImageStatus("error");
      return;
    }

    let fakeTimer: ReturnType<typeof setInterval> | null = null;

    try {
      setPdfToImageError(null);
      setPdfToImageStatus("processing");
      setPdfToImageProgress(6);

      revokeUrl(pdfToImageResultUrl);
      setPdfToImageResultUrl(null);

      fakeTimer = setInterval(() => {
        setPdfToImageProgress((prev) => {
          if (prev >= 90) return prev;
          if (prev < 20) return prev + 6;
          if (prev < 55) return prev + 4;
          if (prev < 80) return prev + 2;
          return prev + 1;
        });
      }, 220);

      const formData = new FormData();
      formData.append("file", pdfToImageFile);
      formData.append("target", pdfToImageTarget.toLowerCase());

      const response = await fetch(`${API_URL}/pdf/to-images`, {
        method: "POST",
        body: formData,
        headers: requestHeaders,
      });

      if (!response.ok) {
        let message = "PDF to Image failed.";
        try {
          const data = await response.json();
          if (data?.error) message = data.error;
        } catch {}
        throw new Error(message);
      }

      const blob = await response.blob();
      const resultUrl = URL.createObjectURL(blob);

      if (fakeTimer) clearInterval(fakeTimer);

      const contentDisposition =
        response.headers.get("content-disposition") || "";
      const contentType = response.headers.get("content-type") || "";
      const fileNameMatch = contentDisposition.match(
        /filename\*?=(?:UTF-8''|")?([^";]+)/i,
      );
      const baseName = pdfToImageFile.name.replace(/\.pdf$/i, "");
      const safeTarget = pdfToImageTarget.toLowerCase();
      let outputName = `${baseName}-${safeTarget}-pages.zip`;

      if (fileNameMatch?.[1]) {
        outputName = decodeURIComponent(
          fileNameMatch[1].replace(/"/g, "").trim(),
        );
      } else if (contentType.startsWith("image/")) {
        outputName = `${baseName}-page-1.${safeTarget}`;
      }

      setPdfToImageResultUrl(resultUrl);
      setPdfToImageResultName(outputName);
      setPdfToImageProgress(100);
      setPdfToImageStatus("done");
    } catch (err: any) {
      if (fakeTimer) clearInterval(fakeTimer);
      setPdfToImageError(err?.message ?? "PDF to Image failed.");
      setPdfToImageStatus("error");
      setPdfToImageProgress(0);
    }
  };

  // ── Batch helpers ─────────────────────────────────────────────────────────

  const addBatchFiles = (incoming: File[]) => {
    setBatchFiles((prev) => {
      const existingNames = new Set(prev.map((f) => f.name));
      const fresh = incoming.filter((f) => !existingNames.has(f.name));
      return [...prev, ...fresh].slice(0, 25);
    });
    setBatchStatus("idle");
    setBatchError(null);
    setBatchResultUrl(null);
  };

  const removeBatchFile = (index: number) => {
    setBatchFiles((prev) => prev.filter((_, i) => i !== index));
  };

  const resetBatch = () => {
    revokeUrl(batchResultUrl);
    setBatchFiles([]);
    setBatchStatus("idle");
    setBatchProgress(0);
    setBatchResultUrl(null);
    setBatchResultName("converto_batch.zip");
    setBatchError(null);
  };

  const startBatchConvert = async () => {
    if (!batchFiles.length) return;

    // ── Free quota check ──────────────────────────────────────────────────
    if (!isPro) {
      const currentQuota = getBatchQuota();
      const wouldUse = currentQuota.used + batchFiles.length;

      if (wouldUse > FREE_BATCH_DAILY_LIMIT) {
        const remaining = Math.max(
          0,
          FREE_BATCH_DAILY_LIMIT - currentQuota.used,
        );
        if (remaining === 0) {
          // Already exhausted — banner will show
          setBatchQuotaUsed(currentQuota.used);
          return;
        }
        // Would exceed: block and let banner show
        setBatchQuotaUsed(FREE_BATCH_DAILY_LIMIT);
        setBatchError(
          `You can only convert ${remaining} more file${remaining !== 1 ? "s" : ""} today on the free plan. Remove some files or upgrade to Pro.`,
        );
        return;
      }
    }
    // ─────────────────────────────────────────────────────────────────────

    if (!API_URL) {
      setBatchError("Server conversion is not configured.");
      setBatchStatus("error");
      return;
    }

    setBatchStatus("processing");
    setBatchProgress(5);
    setBatchError(null);
    revokeUrl(batchResultUrl);
    setBatchResultUrl(null);

    // Fake progress ticker
    const fakeTimer = setInterval(() => {
      setBatchProgress((prev) => {
        if (prev >= 88) return prev;
        if (prev < 20) return prev + 6;
        if (prev < 50) return prev + 4;
        if (prev < 75) return prev + 2;
        return prev + 1;
      });
    }, 400);

    try {
      const controller = new AbortController();
      const timeout = setTimeout(() => controller.abort(), 1000 * 60 * 15);

      const formData = new FormData();
      batchFiles.forEach((f) => formData.append("files", f));
      formData.append("target", target.toLowerCase());

      // Pass through the same audio/video/image options
      const normalizedVideoResolution =
        videoResolution === "Source"
          ? ""
          : videoResolution === "4K"
            ? "2160p"
            : videoResolution;

      formData.append("trimEnabled", String(trimEnabled));
      if (trimEnabled) {
        formData.append("trimStart", trimStart.toFixed(2));
        formData.append("trimEnd", trimEnd.toFixed(2));
      }

      formData.append("audioBitrate", audioBitrate || "");
      formData.append("audioSampleRate", audioSampleRate || "");
      formData.append("audioChannels", audioChannels || "");
      formData.append("videoResolution", normalizedVideoResolution || "");
      formData.append("videoQuality", videoQuality || "");
      formData.append("videoFps", videoFps || "");
      formData.append("videoCodec", videoCodec || "");
      formData.append("muteAudio", String(Boolean(muteAudio)));
      formData.append("imageWidth", imageWidth || "");
      formData.append("imageHeight", imageHeight || "");
      if (["jpg", "webp", "avif"].includes(target.toLowerCase())) {
        formData.append("imageQuality", String(imageQuality ?? ""));
      }

      const res = await fetch(`${API_URL}/convert/batch`, {
        method: "POST",
        body: formData,
        signal: controller.signal,
        headers: requestHeaders,
      });

      clearTimeout(timeout);
      clearInterval(fakeTimer);

      if (!res.ok) {
        let message = "Batch conversion failed.";
        try {
          const data = await res.json();
          if (data?.error) message = data.error;
        } catch {}
        throw new Error(message);
      }

      const blob = await res.blob();
      if (!blob || blob.size === 0) throw new Error("Batch output is empty.");

      // ── Increment quota after successful conversion ──────────────────────
      if (!isPro) {
        const updatedQuota = incrementBatchQuota(batchFiles.length);
        setBatchQuotaUsed(updatedQuota.used);
      }
      // ─────────────────────────────────────────────────────────────────────

      const stamp = new Date().toISOString().slice(0, 10);
      const zipName = `converto_batch_${target.toLowerCase()}_${stamp}.zip`;

      setBatchResultUrl(URL.createObjectURL(blob));
      setBatchResultName(zipName);
      setBatchProgress(100);
      setBatchStatus("done");
    } catch (err: any) {
      clearInterval(fakeTimer);
      setBatchError(
        err?.name === "AbortError"
          ? "Batch conversion timed out. Try fewer or smaller files."
          : (err?.message ?? "Batch conversion failed."),
      );
      setBatchStatus("error");
      setBatchProgress(0);
    }
  };

  // ─────────────────────────────────────────────────────────────────────────

  useEffect(() => {
    return () => {
      revokeUrl(resultUrl);
      revokeUrl(previewUrl);
      revokeUrl(batchResultUrl);
      revokeUrl(pdfResultUrl);
      revokeUrl(splitPdfResultUrl);
      revokeUrl(pdfToImageResultUrl);
    };
  }, [
    resultUrl,
    previewUrl,
    batchResultUrl,
    pdfResultUrl,
    splitPdfResultUrl,
    pdfToImageResultUrl,
  ]);

  const activeInputForTargets =
    fromFmt ?? routeInput ?? suggestedInput ?? rawInputLabel;
  const availableTargets = useMemo(
    () => getAvailableTargets(activeInputForTargets),
    [activeInputForTargets],
  );

  useEffect(() => {
    if (!availableTargets.includes(target)) {
      const fallback =
        routeOutput && availableTargets.includes(routeOutput)
          ? routeOutput
          : availableTargets[0];

      setTarget(fallback);

      const nextInputForSoftRoute = fromFmt ?? routeInput ?? null;
      if (nextInputForSoftRoute) softSyncRoute(nextInputForSoftRoute, fallback);
      else setRouteOutput(fallback);
    }
  }, [availableTargets, target]); // eslint-disable-line react-hooks/exhaustive-deps

  useEffect(() => {
    if (!showTrimControls) {
      setTrimEnabled(false);
      setTrimStart(0);
      setTrimEnd(0);
      setMediaDuration(0);
    }
  }, [showTrimControls]);

  const sameFormatSelected = !!fromFmt && fromFmt === target;
  const formatFlowText = fromFmt
    ? `${fromFmt} → ${target}`
    : `${routeInput ?? "INPUT"} → ${target}`;

  const effectiveSeoMode: SeoPageMode = pdfMode
    ? "pdf"
    : batchMode
      ? "batch"
      : "convert";

  const effectivePdfToolTab: PdfSeoTool = pdfMode ? pdfToolTab : pdfTool;

  const activePdfInputLabel =
    effectiveSeoMode === "pdf"
      ? effectivePdfToolTab === "to_pdf"
        ? "IMAGE"
        : "PDF"
      : null;

  const activePdfOutputLabel =
    effectiveSeoMode === "pdf"
      ? getPdfOutputLabel(effectivePdfToolTab, pdfToImageTarget)
      : null;

  const activeBatchInputLabel = useMemo(() => {
    if (!batchFiles.length) return null;

    const detectedFormats = batchFiles
      .map((item) => detectFmt(item.name))
      .filter((item): item is TargetFmt => Boolean(item));

    if (!detectedFormats.length) return null;

    const uniqueFormats = Array.from(new Set(detectedFormats));
    return uniqueFormats.length === 1 ? uniqueFormats[0] : "MIXED";
  }, [batchFiles]);

  const navigateIfNeeded = (nextPath: string) => {
    if (!nextPath) return;

    if (typeof window !== "undefined") {
      const currentPath = window.location.pathname;
      if (currentPath === nextPath) return;

      if (nextPath.startsWith("/convert/")) {
        window.history.replaceState(window.history.state, "", nextPath);
        return;
      }
    }

    if (pathname === nextPath) return;
    router.replace(nextPath, { scroll: false });
  };

  const handlePdfDiscoverySelect = (href: string) => {
    if (!href.startsWith("/convert/pdf")) {
      navigateIfNeeded(href);
      return;
    }

    if (href === "/convert/pdf") {
      setPdfToolTab("to_pdf");
      navigateIfNeeded(href);
      return;
    }

    if (href === "/convert/pdf/split") {
      setPdfToolTab("split_pdf");
      navigateIfNeeded(href);
      return;
    }

    if (href.endsWith("/to-jpg")) {
      setPdfToolTab("pdf_to_image");
      setPdfToImageTarget("JPG");
      navigateIfNeeded(href);
      return;
    }

    if (href.endsWith("/to-webp")) {
      setPdfToolTab("pdf_to_image");
      setPdfToImageTarget("WEBP");
      navigateIfNeeded(href);
      return;
    }

    if (href.endsWith("/to-png")) {
      setPdfToolTab("pdf_to_image");
      setPdfToImageTarget("PNG");
      navigateIfNeeded(href);
      return;
    }

    navigateIfNeeded(href);
  };

  const activeInputLabel = useMemo(
    () =>
      effectiveSeoMode === "pdf"
        ? activePdfInputLabel
        : effectiveSeoMode === "batch" && activeBatchInputLabel
          ? activeBatchInputLabel
          : normalizeFmtLabel(
              fromFmt ?? routeInput ?? suggestedInput ?? rawInputLabel ?? "file",
            ),
    [
      effectiveSeoMode,
      activePdfInputLabel,
      activeBatchInputLabel,
      fromFmt,
      routeInput,
      suggestedInput,
      rawInputLabel,
    ],
  );

  const activeOutputLabel = useMemo(
    () =>
      effectiveSeoMode === "pdf"
        ? activePdfOutputLabel
        : normalizeFmtLabel(
            target ??
              routeOutput ??
              suggestedOutput ??
              rawOutputLabel ??
              "file",
          ),
    [
      effectiveSeoMode,
      activePdfOutputLabel,
      target,
      routeOutput,
      suggestedOutput,
      rawOutputLabel,
    ],
  );

  const showRouteDetails =
    effectiveSeoMode === "pdf"
      ? true
      : effectiveSeoMode === "batch"
        ? batchFiles.length > 0
        : Boolean(file);

  const successDownloadName = useMemo(
    () =>
      file && resultUrl
        ? buildOutputName(file.name, outputExtMap[target])
        : null,
    [file, resultUrl, target],
  );

  const siteUrl =
    process.env.NEXT_PUBLIC_SITE_URL?.replace(/\/$/, "") ||
    "https://converto.tools";

  const schemaTitle =
    seoTitle ||
    (effectiveSeoMode === "batch"
      ? `${activeInputLabel ?? "FILE"} to ${activeOutputLabel ?? "FILE"} Batch Converter`
      : effectiveSeoMode === "pdf"
        ? effectivePdfToolTab === "split_pdf"
          ? "Split PDF Online"
          : effectivePdfToolTab === "pdf_to_image"
            ? `PDF to ${activeOutputLabel ?? "PNG"} Converter`
            : "PDF Tools"
        : `${activeInputLabel ?? "FILE"} to ${activeOutputLabel ?? "FILE"} Converter`);

  const schemaDescription =
    seoDescription ||
    (effectiveSeoMode === "batch"
      ? `Convert multiple ${activeInputLabel ?? "FILE"} files to ${activeOutputLabel ?? "FILE"} online with Converto and download the results in a ZIP archive.`
      : effectiveSeoMode === "pdf"
        ? effectivePdfToolTab === "split_pdf"
          ? "Split PDF files online by page range with Converto."
          : effectivePdfToolTab === "pdf_to_image"
            ? `Convert PDF pages to ${activeOutputLabel ?? "PNG"} online with Converto.`
            : "Create PDFs from images, split PDFs, and export PDF pages as images with Converto."
        : `Convert ${activeInputLabel ?? "FILE"} to ${activeOutputLabel ?? "FILE"} online with Converto. Upload your file, choose your target format, and download the converted result in a simple workflow.`);

  const effectiveFaqItems = useMemo(
    () =>
      effectiveSeoMode === "pdf"
        ? [
            {
              q:
                effectivePdfToolTab === "split_pdf"
                  ? "How do I split a PDF online?"
                  : effectivePdfToolTab === "pdf_to_image"
                    ? `How do I convert PDF pages to ${activeOutputLabel ?? "PNG"}?`
                    : "What can I do in Converto PDF tools?",
              a:
                effectivePdfToolTab === "split_pdf"
                  ? "Upload your PDF, choose the page range you want to keep, start the split action, and download the extracted PDF file."
                  : effectivePdfToolTab === "pdf_to_image"
                    ? `Upload your PDF, choose ${activeOutputLabel ?? "PNG"}, start the export, and download the resulting page image or ZIP archive.`
                    : "Converto PDF tools let you create PDFs from images, split PDFs, and export PDF pages as PNG, JPG, or WEBP from one page.",
            },
            {
              q: "Are Converto PDF tools free to use?",
              a: "Converto currently offers free everyday PDF workflows with practical limits for quick browser-based use.",
            },
          ]
        : effectiveSeoMode === "batch"
          ? [
              {
                q: `How do I batch convert ${activeInputLabel ?? "FILE"} to ${activeOutputLabel ?? "FILE"}?`,
                a: `Upload multiple ${activeInputLabel ?? "FILE"} files, keep ${activeOutputLabel ?? "FILE"} as the shared output format, start the batch conversion, and download the ZIP archive when it is ready.`,
              },
              {
                q: "What is batch conversion used for?",
                a: "Batch conversion is useful when many files need the same output format and repeating the same action one by one would waste time.",
              },
            ]
          : [
              {
                q: `How do I convert ${activeInputLabel ?? "FILE"} to ${activeOutputLabel ?? "FILE"}?`,
                a: `Upload your ${activeInputLabel ?? "FILE"} file, choose ${activeOutputLabel ?? "FILE"} as the output format, start the conversion, and download the result when it is ready.`,
              },
              {
                q: `Is ${activeInputLabel ?? "FILE"} to ${activeOutputLabel ?? "FILE"} conversion free?`,
                a: `Yes. Converto currently offers free everyday conversion with a 50MB file limit for the demo workflow.`,
              },
            ],
    [
      activeInputLabel,
      activeOutputLabel,
      effectiveSeoMode,
      effectivePdfToolTab,
    ],
  );

  const faqSchema = useMemo(
    () => ({
      "@context": "https://schema.org",
      "@type": "FAQPage",
      mainEntity: effectiveFaqItems.map((item) => ({
        "@type": "Question",
        name: item.q,
        acceptedAnswer: {
          "@type": "Answer",
          text: item.a,
        },
      })),
    }),
    [effectiveFaqItems],
  );

  const webPageSchema = useMemo(
    () =>
      buildWebPageSchema({
        siteUrl,
        title: schemaTitle,
        description: schemaDescription,
        input: activeInputLabel,
        output: activeOutputLabel,
        mode: effectiveSeoMode,
        pdfTool: effectivePdfToolTab,
      }),
    [
      siteUrl,
      schemaTitle,
      schemaDescription,
      activeInputLabel,
      activeOutputLabel,
      effectiveSeoMode,
      effectivePdfToolTab,
    ],
  );

  useEffect(() => {
    if (status === "done" && resultUrl && file) {
      setShowPostConvertRail(true);
      return;
    }

    if (status !== "done") {
      setShowPostConvertRail(false);
    }
  }, [status, resultUrl, file]);

  if (MAINTENANCE_MODE) {
    return (
      <div className="min-h-screen bg-[#151233] text-white selection:bg-white/20">
        <AdSenseScript />
        <div className="flex min-h-screen items-center justify-center">
          Maintenance
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#151233] text-white selection:bg-white/20">
      <AdSenseScript />

      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(webPageSchema) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(faqSchema) }}
      />

      <div className="pointer-events-none fixed inset-0 -z-10">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,rgba(168,85,247,0.23),transparent_56%),radial-gradient(ellipse_at_bottom,rgba(59,130,246,0.18),transparent_52%),radial-gradient(ellipse_at_center,rgba(255,255,255,0.06),transparent_45%)]" />
        <div className="absolute inset-0 opacity-20 [background:linear-gradient(to_right,rgba(255,255,255,0.04)_1px,transparent_1px),linear-gradient(to_bottom,rgba(255,255,255,0.04)_1px,transparent_1px)] [background-size:84px_84px]" />
      </div>

      <SimpleTopBar shellMax={SHELL_MAX} />

      <main className={cx("mx-auto px-4 py-8 sm:px-5 lg:px-6", SHELL_MAX)}>
        <section className="mx-auto mb-8 max-w-[1100px] text-center">
          <div className="inline-flex items-center gap-2 rounded-full bg-white/8 px-3 py-1 text-[11px] text-white/70 ring-1 ring-white/10">
            <span className="h-1.5 w-1.5 rounded-full bg-emerald-300" />
            Hybrid conversion flow
          </div>

          <h1 className="mt-5 text-3xl font-semibold tracking-tight sm:text-4xl">
            {seoTitle || "Convert files online."}
          </h1>

          <p className="mx-auto mt-3 max-w-[720px] text-sm leading-6 text-white/65 sm:text-[15px]">
            {seoDescription ||
              "Fast, clean, and stable online conversion for quick everyday file tasks."}
          </p>

          <div className="mt-5 flex flex-wrap items-center justify-center gap-2">
            <span className="rounded-full bg-white/8 px-3 py-2 text-[11px] text-white/72 ring-1 ring-white/10">
              Free: 50MB
            </span>
            <span className="rounded-full bg-white/8 px-3 py-2 text-[11px] text-white/72 ring-1 ring-white/10">
              Canvas + server flow
            </span>
            <span className="rounded-full bg-white/8 px-3 py-2 text-[11px] text-white/72 ring-1 ring-white/10">
              Quick conversions
            </span>
          </div>
        </section>

        <div className={cx("grid items-start gap-6 xl:gap-8", GRID)}>
          <aside className="hidden xl:block">
            <AdUnit slot={AD_SLOTS.LEFT_RAIL} sticky className="w-full" />
          </aside>

          <section className="min-w-0">
            <div className={cx("mx-auto w-full", CENTER_MAX)}>
              <section className="mx-auto max-w-[1100px]">
                <div className="relative rounded-[30px] bg-white/10 ring-1 ring-white/10 shadow-[0_35px_95px_rgba(0,0,0,0.42)]">
                  <div className="pointer-events-none absolute inset-0 rounded-[30px] bg-gradient-to-br from-violet-500/16 via-fuchsia-500/8 to-sky-500/16" />

                  <div className="relative p-5 sm:p-6 md:p-7">
                    {/* ── Single / Batch / PDF Tools mode toggle ── */}
                    <div className="mb-6 inline-flex flex-wrap items-center gap-1 rounded-[22px] border border-white/10 bg-[linear-gradient(135deg,rgba(255,255,255,0.12),rgba(255,255,255,0.04))] p-1.5 shadow-[0_18px_50px_rgba(0,0,0,0.28)] backdrop-blur-xl ring-1 ring-white/10">
                      <button
                        type="button"
                        onClick={() => {
                          setBatchMode(false);
                          setPdfMode(false);
                          setPdfToolTab("to_pdf");
                          navigateIfNeeded(`/convert/${currentSlug}`);
                        }}
                        className={cx(
                          "inline-flex h-10 items-center gap-2 rounded-2xl px-4 text-xs font-semibold transition-all duration-200",
                          !batchMode && !pdfMode
                            ? "bg-[linear-gradient(135deg,rgba(255,255,255,0.98),rgba(226,232,240,0.92))] text-black shadow-[0_14px_30px_rgba(255,255,255,0.18)]"
                            : "text-white/68 hover:bg-white/8 hover:text-white",
                        )}
                      >
                        <svg
                          width="13"
                          height="13"
                          viewBox="0 0 24 24"
                          fill="none"
                        >
                          <rect
                            x="3"
                            y="3"
                            width="18"
                            height="18"
                            rx="3"
                            stroke="currentColor"
                            strokeWidth="2"
                          />
                        </svg>
                        Single
                      </button>
                      <button
                        type="button"
                        onClick={() => {
                          setBatchMode(true);
                          setPdfMode(false);
                          setPdfToolTab("to_pdf");
                          setTargetOpen(false);
                          navigateIfNeeded(`/convert/batch/${currentSlug}`);
                        }}
                        className={cx(
                          "inline-flex h-10 items-center gap-2 rounded-2xl px-4 text-xs font-semibold transition-all duration-200",
                          batchMode
                            ? "bg-[linear-gradient(135deg,rgba(255,255,255,0.98),rgba(226,232,240,0.92))] text-black shadow-[0_14px_30px_rgba(255,255,255,0.18)]"
                            : "text-white/68 hover:bg-white/8 hover:text-white",
                        )}
                      >
                        <svg
                          width="13"
                          height="13"
                          viewBox="0 0 24 24"
                          fill="none"
                        >
                          <rect
                            x="2"
                            y="7"
                            width="14"
                            height="14"
                            rx="2"
                            stroke="currentColor"
                            strokeWidth="2"
                          />
                          <path
                            d="M8 7V5a2 2 0 012-2h9a2 2 0 012 2v9a2 2 0 01-2 2h-2"
                            stroke="currentColor"
                            strokeWidth="2"
                            strokeLinecap="round"
                          />
                        </svg>
                        Batch
                        <span className="inline-flex h-4 items-center rounded-full border border-cyan-400/25 bg-[linear-gradient(135deg,rgba(34,211,238,0.2),rgba(168,85,247,0.2))] px-1.5 text-[9px] font-bold uppercase tracking-wide text-cyan-100 shadow-[0_0_16px_rgba(34,211,238,0.18)]">
                          New
                        </span>
                      </button>
                      <button
                        type="button"
                        onClick={() => {
                          setBatchMode(false);
                          setPdfMode(true);
                          setPdfToolTab("to_pdf");
                          setTargetOpen(false);
                          navigateIfNeeded(
                            buildPdfToolPath("to_pdf", pdfToImageTarget),
                          );
                        }}
                        className={cx(
                          "inline-flex h-10 items-center gap-2 rounded-2xl px-4 text-xs font-semibold transition-all duration-200",
                          pdfMode
                            ? "bg-[linear-gradient(135deg,rgba(255,255,255,0.98),rgba(226,232,240,0.92))] text-black shadow-[0_14px_30px_rgba(255,255,255,0.18)]"
                            : "text-white/68 hover:bg-white/8 hover:text-white",
                        )}
                      >
                        <svg
                          width="13"
                          height="13"
                          viewBox="0 0 24 24"
                          fill="none"
                        >
                          <path
                            d="M7 3h7l5 5v13H7a2 2 0 01-2-2V5a2 2 0 012-2z"
                            stroke="currentColor"
                            strokeWidth="2"
                            strokeLinejoin="round"
                          />
                          <path
                            d="M14 3v5h5"
                            stroke="currentColor"
                            strokeWidth="2"
                            strokeLinejoin="round"
                          />
                        </svg>
                        PDF Tools
                        <span className="inline-flex h-4 items-center rounded-full border border-cyan-400/25 bg-[linear-gradient(135deg,rgba(34,211,238,0.2),rgba(168,85,247,0.2))] px-1.5 text-[9px] font-bold uppercase tracking-wide text-cyan-100 shadow-[0_0_16px_rgba(34,211,238,0.18)]">
                          New
                        </span>
                        <span className="inline-flex h-4 items-center rounded-full border border-emerald-400/25 bg-emerald-500/12 px-1.5 text-[9px] font-bold uppercase tracking-wide text-emerald-100 shadow-[0_0_16px_rgba(52,211,153,0.14)]">
                          Beta
                        </span>
                      </button>
                    </div>

                    <div className="relative overflow-hidden rounded-[28px] border border-white/10 bg-[radial-gradient(circle_at_top_left,rgba(168,85,247,0.16),transparent_34%),radial-gradient(circle_at_bottom_right,rgba(56,189,248,0.14),transparent_38%),linear-gradient(135deg,rgba(255,255,255,0.08),rgba(255,255,255,0.03))] p-4 shadow-[0_24px_70px_rgba(0,0,0,0.28)] ring-1 ring-white/10 sm:p-5 md:p-6">
                      <div className="pointer-events-none absolute inset-0 bg-[linear-gradient(135deg,rgba(255,255,255,0.06),transparent_45%,rgba(255,255,255,0.03))]" />
                      <div
                        className={cx(
                          "relative transition-all duration-300 ease-out",
                          modeVisualState === "enter"
                            ? "translate-y-2 scale-[0.985] opacity-0"
                            : "translate-y-0 scale-100 opacity-100",
                        )}
                      >
                        {/* ════════════════════════════════════════════════════
                        BATCH MODE UI
                    ════════════════════════════════════════════════════ */}
                        {batchMode ? (
                          <div>
                            <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
                              <div>
                                <div className="text-[11px] font-semibold uppercase tracking-[0.18em] text-white/45">
                                  Batch Converter
                                </div>
                                <h2 className="mt-2 text-xl font-semibold tracking-tight sm:text-2xl">
                                  Convert multiple files
                                </h2>
                                <p className="mt-1 text-sm text-white/60">
                                  Upload up to{" "}
                                  <span className="font-semibold text-white">
                                    {isPro ? "25" : FREE_BATCH_DAILY_LIMIT}
                                  </span>{" "}
                                  files and convert them all to{" "}
                                  <span className="font-semibold text-white">
                                    {target}
                                  </span>{" "}
                                  at once. Results are delivered as a ZIP
                                  archive.
                                </p>

                                {/* Quota badge */}
                                <div className="mt-3">
                                  <BatchQuotaBadge
                                    used={batchQuotaUsed}
                                    limit={FREE_BATCH_DAILY_LIMIT}
                                    isPro={isPro}
                                  />
                                </div>
                              </div>

                              {/* Target format selector (shared with single mode) */}
                              <div
                                ref={targetWrapRef}
                                className="relative self-start"
                              >
                                <button
                                  type="button"
                                  onClick={() => setTargetOpen((v) => !v)}
                                  className="inline-flex h-11 items-center gap-2 rounded-2xl bg-white/10 px-4 text-sm font-semibold text-white ring-1 ring-white/10 transition hover:bg-white/15"
                                  aria-haspopup="listbox"
                                  aria-expanded={targetOpen}
                                >
                                  <span className="text-xs font-medium text-white/60">
                                    Convert to
                                  </span>
                                  <span>{target}</span>
                                  <svg
                                    width="16"
                                    height="16"
                                    viewBox="0 0 24 24"
                                    fill="none"
                                    className={cx(
                                      "transition",
                                      targetOpen ? "rotate-180" : "",
                                    )}
                                  >
                                    <path
                                      d="M6 9l6 6 6-6"
                                      stroke="currentColor"
                                      strokeWidth="2"
                                      strokeLinecap="round"
                                      strokeLinejoin="round"
                                    />
                                  </svg>
                                </button>

                                {targetOpen ? (
                                  <div
                                    role="listbox"
                                    className="absolute right-0 z-30 mt-2 w-52 overflow-hidden rounded-2xl bg-[#0D0B18]/95 backdrop-blur ring-1 ring-white/15 shadow-[0_20px_60px_rgba(0,0,0,0.55)]"
                                  >
                                    <div
                                      ref={targetListRef}
                                      className="max-h-64 overflow-auto"
                                    >
                                      {ALL_TARGET_OPTIONS.map((fmt) => (
                                        <button
                                          key={fmt}
                                          type="button"
                                          onClick={() => {
                                            setTarget(fmt);
                                            setTargetOpen(false);
                                          }}
                                          className={cx(
                                            "flex w-full items-center justify-between px-4 py-3 text-sm transition",
                                            fmt === target
                                              ? "bg-white/10 text-white"
                                              : "text-white/80 hover:bg-white/10",
                                          )}
                                        >
                                          <span className="font-semibold">
                                            {fmt}
                                          </span>
                                          {fmt === target ? (
                                            <svg
                                              width="16"
                                              height="16"
                                              viewBox="0 0 24 24"
                                              fill="none"
                                            >
                                              <path
                                                d="M20 6L9 17l-5-5"
                                                stroke="currentColor"
                                                strokeWidth="2"
                                                strokeLinecap="round"
                                                strokeLinejoin="round"
                                              />
                                            </svg>
                                          ) : (
                                            <span className="w-4" />
                                          )}
                                        </button>
                                      ))}
                                    </div>
                                  </div>
                                ) : null}
                              </div>
                            </div>

                            <div className="my-6 h-px w-full bg-gradient-to-r from-transparent via-white/15 to-transparent" />

                            {/* ── Quota exhausted banner ── */}
                            {batchQuotaExhausted ? (
                              <BatchQuotaExhaustedBanner
                                countdown={midnightCountdown}
                                onUpgrade={() => setShowUpgradePanel(true)}
                              />
                            ) : (
                              <>
                                {/* Drop zone */}
                                <div
                                  className={cx(
                                    "relative flex min-h-[260px] flex-col items-center justify-center rounded-[26px] border border-dashed p-10 text-center transition",
                                    batchDragOver
                                      ? "border-white/45 bg-white/6"
                                      : "border-white/20 bg-black/20 hover:bg-white/6",
                                  )}
                                  onDragEnter={(e) => {
                                    e.preventDefault();
                                    e.stopPropagation();
                                    setBatchDragOver(true);
                                  }}
                                  onDragOver={(e) => {
                                    e.preventDefault();
                                    e.stopPropagation();
                                    setBatchDragOver(true);
                                  }}
                                  onDragLeave={(e) => {
                                    e.preventDefault();
                                    e.stopPropagation();
                                    setBatchDragOver(false);
                                  }}
                                  onDrop={(e) => {
                                    e.preventDefault();
                                    e.stopPropagation();
                                    setBatchDragOver(false);
                                    const dropped = Array.from(
                                      e.dataTransfer.files,
                                    );
                                    if (dropped.length) addBatchFiles(dropped);
                                  }}
                                >
                                  <input
                                    id="batchFileInput"
                                    type="file"
                                    multiple
                                    className="hidden"
                                    accept={getAcceptForInput()}
                                    onChange={(e) => {
                                      const picked = Array.from(
                                        e.target.files ?? [],
                                      );
                                      if (picked.length) addBatchFiles(picked);
                                      e.target.value = "";
                                    }}
                                  />

                                  <div className="mx-auto grid h-[72px] w-[72px] place-items-center rounded-[24px] bg-white/10 ring-1 ring-white/10">
                                    <svg
                                      width="30"
                                      height="30"
                                      viewBox="0 0 24 24"
                                      fill="none"
                                    >
                                      <path
                                        d="M12 16V4"
                                        stroke="currentColor"
                                        strokeWidth="2"
                                        strokeLinecap="round"
                                      />
                                      <path
                                        d="M7 9L12 4L17 9"
                                        stroke="currentColor"
                                        strokeWidth="2"
                                        strokeLinecap="round"
                                      />
                                      <path
                                        d="M4 20H20"
                                        stroke="currentColor"
                                        strokeWidth="2"
                                        strokeLinecap="round"
                                      />
                                    </svg>
                                  </div>

                                  <p className="mt-5 text-lg font-semibold">
                                    {batchFiles.length
                                      ? `${batchFiles.length} file${batchFiles.length > 1 ? "s" : ""} selected`
                                      : "Drop files here"}
                                  </p>
                                  <p className="mt-2 text-sm text-white/60">
                                    {isPro
                                      ? "Up to 25 files • Unlimited daily conversions"
                                      : `Up to ${FREE_BATCH_DAILY_LIMIT} files per day free • ${batchQuotaRemaining} remaining today`}
                                  </p>

                                  <div className="mt-6 flex items-center justify-center gap-3">
                                    <button
                                      type="button"
                                      onClick={() =>
                                        document
                                          .getElementById("batchFileInput")
                                          ?.click()
                                      }
                                      className="h-11 rounded-2xl bg-white/10 px-5 text-sm font-semibold text-white ring-1 ring-white/10 transition hover:bg-white/15"
                                    >
                                      {batchFiles.length
                                        ? "Add more files"
                                        : "Choose files"}
                                    </button>
                                  </div>
                                </div>

                                {/* File list */}
                                {batchFiles.length > 0 && (
                                  <div className="mt-5 space-y-2">
                                    {batchFiles.map((f, i) => (
                                      <div
                                        key={`${f.name}-${i}`}
                                        className="flex items-center justify-between gap-3 rounded-2xl bg-white/5 px-4 py-3 ring-1 ring-white/10"
                                      >
                                        <div className="flex min-w-0 items-center gap-3">
                                          <span className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-white/10 text-[10px] font-bold text-white/70">
                                            {i + 1}
                                          </span>
                                          <span className="truncate text-sm text-white/80">
                                            {f.name}
                                          </span>
                                          <span className="shrink-0 text-xs text-white/40">
                                            {(f.size / (1024 * 1024)).toFixed(
                                              1,
                                            )}
                                            MB
                                          </span>
                                        </div>
                                        <button
                                          type="button"
                                          onClick={() => removeBatchFile(i)}
                                          disabled={
                                            batchStatus === "processing"
                                          }
                                          className="shrink-0 rounded-full p-1 text-white/40 transition hover:bg-white/10 hover:text-white disabled:opacity-40"
                                          aria-label="Remove file"
                                        >
                                          <svg
                                            width="14"
                                            height="14"
                                            viewBox="0 0 24 24"
                                            fill="none"
                                          >
                                            <path
                                              d="M18 6L6 18M6 6l12 12"
                                              stroke="currentColor"
                                              strokeWidth="2"
                                              strokeLinecap="round"
                                            />
                                          </svg>
                                        </button>
                                      </div>
                                    ))}

                                    {/* Warn if selection exceeds remaining quota */}
                                    {!isPro &&
                                      batchFiles.length >
                                        batchQuotaRemaining && (
                                        <div className="flex items-start gap-3 rounded-2xl border border-amber-400/20 bg-amber-500/8 px-4 py-3 text-xs text-amber-200/80">
                                          <span className="mt-0.5 shrink-0 text-amber-300">
                                            ⚠️
                                          </span>
                                          <span>
                                            You have selected{" "}
                                            {batchFiles.length} files but only{" "}
                                            <strong>
                                              {batchQuotaRemaining}
                                            </strong>{" "}
                                            free conversion
                                            {batchQuotaRemaining !== 1
                                              ? "s"
                                              : ""}{" "}
                                            remaining today. Remove{" "}
                                            {batchFiles.length -
                                              batchQuotaRemaining}{" "}
                                            file
                                            {batchFiles.length -
                                              batchQuotaRemaining !==
                                            1
                                              ? "s"
                                              : ""}{" "}
                                            or{" "}
                                            <button
                                              type="button"
                                              onClick={() =>
                                                setShowUpgradePanel(true)
                                              }
                                              className="underline underline-offset-2 hover:text-amber-100"
                                            >
                                              upgrade to Pro
                                            </button>
                                            .
                                          </span>
                                        </div>
                                      )}
                                  </div>
                                )}

                                {/* Progress bar */}
                                {batchStatus === "processing" && (
                                  <div className="mt-5">
                                    <div className="mb-2 flex items-center justify-between text-xs text-white/55">
                                      <span>
                                        Converting {batchFiles.length} file
                                        {batchFiles.length > 1 ? "s" : ""}…
                                      </span>
                                      <span>{batchProgress}%</span>
                                    </div>
                                    <div className="h-2 overflow-hidden rounded-full bg-white/10 ring-1 ring-white/10">
                                      <div
                                        className={cx(
                                          "h-full bg-white/40 transition-[width] duration-200",
                                          batchProgress >= 88
                                            ? "animate-pulse"
                                            : "",
                                        )}
                                        style={{ width: `${batchProgress}%` }}
                                      />
                                    </div>
                                    <p className="mt-2 text-[11px] text-white/45">
                                      Please keep this tab open until all files
                                      are converted.
                                    </p>
                                  </div>
                                )}

                                {/* Done state */}
                                {batchStatus === "done" && batchResultUrl && (
                                  <div className="mt-6 flex flex-col items-center gap-3">
                                    <a
                                      href={batchResultUrl}
                                      download={batchResultName}
                                      className="inline-flex h-11 items-center gap-2 justify-center rounded-2xl bg-white px-6 text-sm font-semibold text-black transition hover:bg-white/90"
                                    >
                                      <svg
                                        width="16"
                                        height="16"
                                        viewBox="0 0 24 24"
                                        fill="none"
                                      >
                                        <path
                                          d="M12 4v12M6 14l6 6 6-6"
                                          stroke="currentColor"
                                          strokeWidth="2"
                                          strokeLinecap="round"
                                          strokeLinejoin="round"
                                        />
                                      </svg>
                                      Download ZIP
                                    </a>
                                    <div className="text-xs text-white/50">
                                      {batchResultName}
                                    </div>
                                  </div>
                                )}

                                {/* Error state */}
                                {batchStatus === "error" && batchError && (
                                  <p className="mt-4 text-sm text-rose-200">
                                    {batchError}
                                  </p>
                                )}

                                {/* Action buttons */}
                                {batchFiles.length > 0 && (
                                  <div className="mt-6 flex items-center justify-end gap-3">
                                    <button
                                      type="button"
                                      onClick={resetBatch}
                                      className="inline-flex h-11 items-center justify-center rounded-2xl border border-white/10 bg-white/5 px-5 text-sm font-semibold text-white/60 transition hover:bg-white/10 hover:text-white"
                                    >
                                      Reset
                                    </button>
                                    <button
                                      type="button"
                                      onClick={startBatchConvert}
                                      disabled={
                                        batchStatus === "processing" ||
                                        !batchFiles.length ||
                                        batchOverFileSizeLimit ||
                                        (!isPro &&
                                          batchFiles.length >
                                            batchQuotaRemaining)
                                      }
                                      className="inline-flex h-11 items-center justify-center rounded-2xl bg-white px-6 text-sm font-semibold text-black transition hover:bg-white/90 disabled:cursor-not-allowed disabled:opacity-60"
                                    >
                                      {batchStatus === "processing"
                                        ? "Converting…"
                                        : `Convert ${batchFiles.length} file${batchFiles.length > 1 ? "s" : ""}`}
                                    </button>
                                  </div>
                                )}

                                <div className="relative mt-7 rounded-[22px] bg-black/25 p-4 ring-1 ring-white/10">
                                  <div className="flex items-center justify-between text-xs text-white/60">
                                    <span>Batch free limit</span>
                                    <span>
                                      {batchFiles.length
                                        ? `${batchTotalMb.toFixed(1)}MB / ${MAX_FREE_MB}MB`
                                        : `0MB / ${MAX_FREE_MB}MB`}
                                    </span>
                                  </div>

                                  <div className="mt-2 h-2 overflow-hidden rounded-full bg-white/10 ring-1 ring-white/10">
                                    <div
                                      className={cx(
                                        "h-full transition-[width] duration-300",
                                        batchOverFileSizeLimit
                                          ? "bg-rose-400"
                                          : "bg-white/40",
                                      )}
                                      style={{ width: `${batchLimitUsedPercent}%` }}
                                    />
                                  </div>

                                  <div className="mt-4 grid gap-3 text-xs text-white/60 sm:grid-cols-2">
                                    <div className="rounded-2xl bg-white/[0.06] px-4 py-3 ring-1 ring-white/10">
                                      Server-assisted batch conversion for ZIP delivery.
                                    </div>
                                    <div className="rounded-2xl bg-white/[0.06] px-4 py-3 ring-1 ring-white/10">
                                      50MB max per file on the free plan.
                                    </div>
                                    <div className="rounded-2xl bg-white/[0.06] px-4 py-3 ring-1 ring-white/10">
                                      Up to {FREE_BATCH_DAILY_LIMIT} files per day during beta.
                                    </div>
                                    <div className="rounded-2xl bg-white/[0.06] px-4 py-3 ring-1 ring-white/10">
                                      Best for quick multi-file conversions.
                                    </div>
                                  </div>
                                </div>
                              </>
                            )}
                          </div>
                        ) : pdfMode ? (
                          <div>
                            <div className="flex flex-col gap-4">
                              <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
                                <div>
                                  <div className="flex flex-wrap items-center gap-2">
                                    <div className="text-[11px] font-semibold uppercase tracking-[0.18em] text-white/45">
                                      PDF Tools
                                    </div>
                                    <span className="inline-flex items-center rounded-full border border-cyan-400/25 bg-cyan-500/10 px-2.5 py-1 text-[10px] font-semibold uppercase tracking-[0.14em] text-cyan-200">
                                      Beta
                                    </span>
                                  </div>
                                  <h2 className="mt-2 text-xl font-semibold tracking-tight sm:text-2xl">
                                    Convert, combine, split, and export PDF
                                    pages
                                  </h2>
                                  <p className="mt-1 max-w-[70ch] text-sm text-white/60">
                                    Keep all PDF-related actions in one place.
                                    PDF Tools are free during beta. Use To PDF
                                    for PNG/JPG image-to-PDF creation, Split PDF
                                    for page extraction, or PDF to Image to
                                    export pages as PNG, JPG, or WEBP.
                                  </p>
                                </div>

                                <span className="inline-flex items-center gap-2 self-start rounded-full bg-white/8 px-3 py-1.5 text-xs font-semibold text-white/70 ring-1 ring-white/10">
                                  <span className="h-2 w-2 rounded-full bg-cyan-300" />
                                  Free beta
                                </span>
                              </div>

                              <div className="flex w-fit items-center gap-1 rounded-2xl bg-black/25 p-1 ring-1 ring-white/10">
                                <button
                                  type="button"
                                  onClick={() => {
                                    setPdfToolTab("to_pdf");
                                    navigateIfNeeded(
                                      buildPdfToolPath(
                                        "to_pdf",
                                        pdfToImageTarget,
                                      ),
                                    );
                                  }}
                                  className={cx(
                                    "inline-flex h-10 items-center gap-2 rounded-2xl px-4 text-xs font-semibold transition-all duration-200",
                                    pdfToolTab === "to_pdf"
                                      ? "bg-[linear-gradient(135deg,rgba(255,255,255,0.98),rgba(226,232,240,0.92))] text-black shadow-[0_12px_28px_rgba(255,255,255,0.16)]"
                                      : "text-white/68 hover:bg-white/8 hover:text-white",
                                  )}
                                >
                                  <svg
                                    width="13"
                                    height="13"
                                    viewBox="0 0 24 24"
                                    fill="none"
                                  >
                                    <path
                                      d="M7 3h7l5 5v13H7a2 2 0 01-2-2V5a2 2 0 012-2z"
                                      stroke="currentColor"
                                      strokeWidth="2"
                                      strokeLinejoin="round"
                                    />
                                    <path
                                      d="M14 3v5h5"
                                      stroke="currentColor"
                                      strokeWidth="2"
                                      strokeLinejoin="round"
                                    />
                                  </svg>
                                  To PDF
                                </button>

                                <button
                                  type="button"
                                  onClick={() => {
                                    setPdfToolTab("split_pdf");
                                    navigateIfNeeded(
                                      buildPdfToolPath(
                                        "split_pdf",
                                        pdfToImageTarget,
                                      ),
                                    );
                                  }}
                                  className={cx(
                                    "inline-flex h-10 items-center gap-2 rounded-2xl px-4 text-xs font-semibold transition-all duration-200",
                                    pdfToolTab === "split_pdf"
                                      ? "bg-[linear-gradient(135deg,rgba(255,255,255,0.98),rgba(226,232,240,0.92))] text-black shadow-[0_12px_28px_rgba(255,255,255,0.16)]"
                                      : "text-white/68 hover:bg-white/8 hover:text-white",
                                  )}
                                >
                                  <svg
                                    width="13"
                                    height="13"
                                    viewBox="0 0 24 24"
                                    fill="none"
                                  >
                                    <path
                                      d="M8 4v16"
                                      stroke="currentColor"
                                      strokeWidth="2"
                                      strokeLinecap="round"
                                    />
                                    <path
                                      d="M16 4v16"
                                      stroke="currentColor"
                                      strokeWidth="2"
                                      strokeLinecap="round"
                                    />
                                    <path
                                      d="M4 8h16"
                                      stroke="currentColor"
                                      strokeWidth="2"
                                      strokeLinecap="round"
                                    />
                                    <path
                                      d="M4 16h16"
                                      stroke="currentColor"
                                      strokeWidth="2"
                                      strokeLinecap="round"
                                    />
                                  </svg>
                                  Split PDF
                                </button>

                                <button
                                  type="button"
                                  onClick={() => {
                                    setPdfToolTab("pdf_to_image");
                                    navigateIfNeeded(
                                      buildPdfToolPath(
                                        "pdf_to_image",
                                        pdfToImageTarget,
                                      ),
                                    );
                                  }}
                                  className={cx(
                                    "inline-flex h-10 items-center gap-2 rounded-2xl px-4 text-xs font-semibold transition-all duration-200",
                                    pdfToolTab === "pdf_to_image"
                                      ? "bg-[linear-gradient(135deg,rgba(255,255,255,0.98),rgba(226,232,240,0.92))] text-black shadow-[0_12px_28px_rgba(255,255,255,0.16)]"
                                      : "text-white/68 hover:bg-white/8 hover:text-white",
                                  )}
                                >
                                  <svg
                                    width="13"
                                    height="13"
                                    viewBox="0 0 24 24"
                                    fill="none"
                                  >
                                    <rect
                                      x="4"
                                      y="5"
                                      width="16"
                                      height="14"
                                      rx="2"
                                      stroke="currentColor"
                                      strokeWidth="2"
                                    />
                                    <circle
                                      cx="9"
                                      cy="10"
                                      r="1.5"
                                      fill="currentColor"
                                    />
                                    <path
                                      d="M7 16l3.2-3.2a1 1 0 011.4 0L14 15l1.7-1.7a1 1 0 011.4 0L18 14.2"
                                      stroke="currentColor"
                                      strokeWidth="2"
                                      strokeLinecap="round"
                                      strokeLinejoin="round"
                                    />
                                  </svg>
                                  PDF to Image
                                </button>
                              </div>
                            </div>

                            <div className="my-6 h-px w-full bg-gradient-to-r from-transparent via-white/15 to-transparent" />

                            {pdfToolTab === "to_pdf" ? (
                              <div className="relative overflow-hidden rounded-[28px] border border-white/10 bg-[radial-gradient(circle_at_top_left,rgba(255,255,255,0.08),transparent_28%),radial-gradient(circle_at_bottom_right,rgba(56,189,248,0.14),transparent_36%),linear-gradient(135deg,rgba(255,255,255,0.08),rgba(255,255,255,0.03))] p-6 shadow-[0_18px_50px_rgba(0,0,0,0.24)]">
                                <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_top_left,rgba(168,85,247,0.14),transparent_34%),radial-gradient(circle_at_bottom_right,rgba(96,165,250,0.14),transparent_40%)]" />

                                <div className="relative">
                                  <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
                                    <div>
                                      <div className="text-[11px] font-semibold uppercase tracking-[0.18em] text-white/45">
                                        To PDF
                                      </div>
                                      <h2 className="mt-2 text-xl font-semibold tracking-tight sm:text-2xl">
                                        Build one PDF from images, PDFs, or both
                                      </h2>
                                      <p className="mt-1 max-w-[72ch] text-sm text-white/60">
                                        Keep the lighter PDF tools layout and
                                        choose how the final PDF should be
                                        built. During beta, image-to-PDF accepts
                                        PNG and JPG/JPEG files. PDF merge and
                                        mixed merge are connected to the
                                        backend.
                                      </p>

                                      <div className="mt-3 flex flex-wrap items-center gap-2">
                                        <span className="inline-flex items-center rounded-full bg-white/8 px-3 py-1.5 text-xs font-semibold text-white/75 ring-1 ring-white/10">
                                          PNG/JPG · PDFs · Mixed
                                        </span>
                                        <span className="inline-flex items-center rounded-full bg-white/8 px-3 py-1.5 text-xs font-semibold text-white/75 ring-1 ring-white/10">
                                          Max files: {pdfFileLimit}
                                        </span>
                                        <span className="inline-flex items-center rounded-full border border-cyan-400/20 bg-cyan-500/10 px-3 py-1.5 text-xs font-semibold text-cyan-200">
                                          Beta · free for now
                                        </span>
                                      </div>
                                    </div>

                                    <span
                                      className={cx(
                                        "inline-flex items-center gap-2 self-start rounded-full px-3 py-1.5 text-xs font-semibold ring-1",
                                        pdfStatus === "done"
                                          ? "bg-emerald-400/15 text-emerald-200 ring-emerald-300/20"
                                          : pdfStatus === "processing"
                                            ? "bg-white/10 text-white/80 ring-white/10"
                                            : pdfStatus === "error"
                                              ? "bg-rose-400/15 text-rose-200 ring-rose-300/20"
                                              : "bg-white/8 text-white/70 ring-white/10",
                                      )}
                                    >
                                      <span
                                        className={cx(
                                          "h-2 w-2 rounded-full",
                                          pdfStatus === "done"
                                            ? "bg-emerald-300"
                                            : pdfStatus === "processing"
                                              ? "bg-white/70"
                                              : pdfStatus === "error"
                                                ? "bg-rose-300"
                                                : "bg-white/40",
                                        )}
                                      />
                                      {pdfStatus === "processing"
                                        ? `Building PDF • ${pdfProgress}%`
                                        : pdfStatus === "done"
                                          ? "PDF ready"
                                          : pdfStatus === "error"
                                            ? "Needs attention"
                                            : pdfFiles.length
                                              ? `${pdfFiles.length} file${pdfFiles.length !== 1 ? "s" : ""} selected`
                                              : "Idle"}
                                    </span>
                                  </div>

                                  <div className="mt-6">
                                    <div className="space-y-4">
                                      <div className="rounded-[24px] bg-white/[0.04] p-4 ring-1 ring-white/10">
                                        <div className="flex flex-wrap items-center justify-between gap-3">
                                          <label className="block text-sm font-semibold text-white">
                                            Build mode
                                          </label>
                                          <div className="inline-flex items-center gap-2 rounded-full border border-cyan-400/20 bg-cyan-500/10 px-3 py-1 text-xs font-semibold text-cyan-200">
                                            {toPdfMode === "images_to_pdf"
                                              ? "Images to PDF"
                                              : toPdfMode === "merge_pdfs"
                                                ? "Merge PDFs"
                                                : "Mix PDFs + images"}
                                          </div>
                                        </div>

                                        <div className="mt-4 grid gap-3 sm:grid-cols-3">
                                          {[
                                            {
                                              value: "images_to_pdf",
                                              title: "Images to PDF",
                                              desc: "PNG and JPG/JPEG during beta",
                                            },
                                            {
                                              value: "merge_pdfs",
                                              title: "Merge PDFs",
                                              desc: "Join many PDFs into one",
                                            },
                                            {
                                              value: "merge_mixed",
                                              title: "PDF + Images",
                                              desc: "Combine PDFs and images",
                                            },
                                          ].map((option) => (
                                            <button
                                              key={option.value}
                                              type="button"
                                              onClick={() => {
                                                setToPdfMode(
                                                  option.value as ToPdfMode,
                                                );
                                                resetPdfBuilder();
                                              }}
                                              className={cx(
                                                "rounded-2xl p-4 text-left transition ring-1",
                                                toPdfMode === option.value
                                                  ? "bg-white text-black ring-white shadow-[0_10px_25px_rgba(255,255,255,0.12)]"
                                                  : "bg-black/20 text-white/75 ring-white/10 hover:bg-white/10 hover:text-white",
                                              )}
                                            >
                                              <div className="text-xs font-semibold uppercase tracking-[0.18em] opacity-60">
                                                Mode
                                              </div>
                                              <div className="mt-2 text-base font-semibold">
                                                {option.title}
                                              </div>
                                              <div
                                                className={cx(
                                                  "mt-1 text-xs",
                                                  toPdfMode === option.value
                                                    ? "text-black/65"
                                                    : "text-white/45",
                                                )}
                                              >
                                                {option.desc}
                                              </div>
                                            </button>
                                          ))}
                                        </div>
                                      </div>

                                      <div
                                        className={cx(
                                          "overflow-hidden rounded-[24px] border border-dashed p-4",
                                          pdfDragOver
                                            ? "border-white/35 bg-white/[0.07]"
                                            : "border-white/15 bg-white/[0.03]",
                                        )}
                                        onDragEnter={(e) => {
                                          e.preventDefault();
                                          e.stopPropagation();
                                          setPdfDragOver(true);
                                        }}
                                        onDragOver={(e) => {
                                          e.preventDefault();
                                          e.stopPropagation();
                                          setPdfDragOver(true);
                                        }}
                                        onDragLeave={(e) => {
                                          e.preventDefault();
                                          e.stopPropagation();
                                          setPdfDragOver(false);
                                        }}
                                        onDrop={(e) => {
                                          e.preventDefault();
                                          e.stopPropagation();
                                          setPdfDragOver(false);
                                          addPdfFiles(
                                            Array.from(
                                              e.dataTransfer.files || [],
                                            ),
                                          );
                                        }}
                                      >
                                        <input
                                          id="pdfInput"
                                          type="file"
                                          multiple
                                          className="hidden"
                                          accept={
                                            toPdfMode === "images_to_pdf"
                                              ? ".png,.jpg,.jpeg,image/png,image/jpeg"
                                              : toPdfMode === "merge_pdfs"
                                                ? ".pdf,application/pdf"
                                                : ".pdf,.png,.jpg,.jpeg,application/pdf,image/png,image/jpeg"
                                          }
                                          onChange={(e) => {
                                            addPdfFiles(
                                              Array.from(e.target.files || []),
                                            );
                                            e.currentTarget.value = "";
                                          }}
                                        />

                                        <div className="py-6">
                                          <div className="mx-auto grid h-[64px] w-[64px] place-items-center rounded-[20px] bg-white/10 ring-1 ring-white/10">
                                            <svg
                                              width="28"
                                              height="28"
                                              viewBox="0 0 24 24"
                                              fill="none"
                                            >
                                              <path
                                                d="M12 16V4"
                                                stroke="currentColor"
                                                strokeWidth="2"
                                                strokeLinecap="round"
                                              />
                                              <path
                                                d="M7 9L12 4L17 9"
                                                stroke="currentColor"
                                                strokeWidth="2"
                                                strokeLinecap="round"
                                              />
                                              <path
                                                d="M4 20H20"
                                                stroke="currentColor"
                                                strokeWidth="2"
                                                strokeLinecap="round"
                                              />
                                            </svg>
                                          </div>

                                          <div className="mt-4 text-center">
                                            <p className="text-lg font-semibold text-white">
                                              {pdfFiles.length
                                                ? `${pdfFiles.length} file${pdfFiles.length !== 1 ? "s" : ""} ready`
                                                : toPdfMode === "images_to_pdf"
                                                  ? "Drop images here"
                                                  : toPdfMode === "merge_pdfs"
                                                    ? "Drop PDF files here"
                                                    : "Drop PDFs or images here"}
                                            </p>
                                            <p className="mt-2 text-sm text-white/55">
                                              {toPdfMode === "images_to_pdf"
                                                ? "Create one PDF from PNG or JPG/JPEG images."
                                                : toPdfMode === "merge_pdfs"
                                                  ? "Merge multiple PDF files into one."
                                                  : "Merge PDFs with PNG or JPG/JPEG images."}
                                            </p>
                                          </div>

                                          <div className="mt-5 flex flex-col items-center justify-center gap-3 sm:flex-row sm:flex-wrap">
                                            <button
                                              type="button"
                                              onClick={() =>
                                                document
                                                  .getElementById("pdfInput")
                                                  ?.click()
                                              }
                                              className="inline-flex h-11 items-center justify-center rounded-full bg-white px-5 text-sm font-semibold text-black transition hover:bg-white/90"
                                            >
                                              {toPdfMode === "images_to_pdf"
                                                ? "Choose images"
                                                : toPdfMode === "merge_pdfs"
                                                  ? "Choose PDFs"
                                                  : "Choose files"}
                                            </button>

                                            <button
                                              type="button"
                                              onClick={startPdfBuild}
                                              disabled={
                                                !pdfFiles.length ||
                                                pdfStatus === "processing"
                                              }
                                              className={cx(
                                                "inline-flex h-11 items-center justify-center rounded-full px-5 text-sm font-semibold transition",
                                                !pdfFiles.length ||
                                                  pdfStatus === "processing"
                                                  ? "cursor-not-allowed bg-white/15 text-white/45 ring-1 ring-white/10"
                                                  : "bg-white/90 text-black hover:bg-white",
                                              )}
                                            >
                                              {pdfStatus === "processing"
                                                ? "Building PDF..."
                                                : toPdfMode === "images_to_pdf"
                                                  ? "Create PDF"
                                                  : toPdfMode === "merge_pdfs"
                                                    ? "Merge PDFs"
                                                    : "Merge files"}
                                            </button>

                                            <button
                                              type="button"
                                              onClick={resetPdfBuilder}
                                              className="inline-flex h-11 items-center justify-center rounded-full border border-white/10 bg-white/5 px-5 text-sm font-semibold text-white/75 transition hover:bg-white/10 hover:text-white"
                                            >
                                              Clear
                                            </button>
                                          </div>
                                        </div>
                                      </div>

                                      {pdfError ? (
                                        <div className="rounded-2xl border border-rose-400/20 bg-rose-500/10 p-4 text-sm text-rose-200">
                                          {pdfError}
                                        </div>
                                      ) : null}
                                    </div>

                                  {pdfFiles.length ? (
                                    <div className="mt-5 overflow-hidden rounded-[26px] border border-white/10 bg-[linear-gradient(135deg,rgba(255,255,255,0.065),rgba(255,255,255,0.025))] p-5 ring-1 ring-white/10">
                                      <div className="flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
                                        <div>
                                          <div className="inline-flex rounded-full border border-white/10 bg-white/8 px-3 py-1 text-[10px] font-semibold uppercase tracking-[0.16em] text-white/55">
                                            File order
                                          </div>
                                          <h3 className="mt-3 text-lg font-semibold text-white">
                                            Arrange the final PDF order
                                          </h3>
                                          <p className="mt-1 text-sm leading-6 text-white/55">
                                            The final PDF follows this list from top to bottom. Move files before creating the output.
                                          </p>
                                        </div>

                                        <div className="inline-flex items-center rounded-full border border-cyan-400/20 bg-cyan-500/10 px-3 py-1.5 text-xs font-semibold text-cyan-100">
                                          {pdfFiles.length} / {pdfFileLimit} files
                                        </div>
                                      </div>

                                      <div className="mt-4 space-y-3">
                                        {pdfFiles.map((pdfFile, index) => (
                                          <div
                                            key={`${pdfFile.name}-${pdfFile.size}-${index}`}
                                            draggable={pdfStatus !== "processing"}
                                            onDragStart={() => setPdfOrderDragIndex(index)}
                                            onDragOver={(event) => event.preventDefault()}
                                            onDrop={(event) => {
                                              event.preventDefault();
                                              handlePdfOrderDrop(index);
                                            }}
                                            onDragEnd={() => setPdfOrderDragIndex(null)}
                                            className={cx(
                                              "group cursor-grab rounded-[22px] bg-black/24 p-4 ring-1 ring-white/10 transition hover:bg-black/30 hover:ring-white/15 active:cursor-grabbing",
                                              pdfOrderDragIndex === index
                                                ? "scale-[0.99] opacity-70 ring-cyan-300/30"
                                                : "",
                                            )}
                                          >
                                            <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                                              <div className="flex min-w-0 items-center gap-3">
                                                <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl bg-white/10 text-sm font-bold text-white ring-1 ring-white/10">
                                                  {index + 1}
                                                </div>

                                                <div className="min-w-0">
                                                  <div className="truncate text-sm font-semibold text-white">
                                                    {pdfFile.name}
                                                  </div>
                                                  <div className="mt-1 text-xs text-white/45">
                                                    {(pdfFile.size / (1024 * 1024)).toFixed(1)} MB · drag to reorder
                                                  </div>
                                                </div>
                                              </div>

                                              <div className="flex flex-wrap items-center gap-2 sm:justify-end">
                                                <button
                                                  type="button"
                                                  onClick={() => movePdfFile(index, "up")}
                                                  disabled={index === 0}
                                                  className={cx(
                                                    "inline-flex h-8 items-center justify-center rounded-full border px-3 text-xs font-semibold transition",
                                                    index === 0
                                                      ? "cursor-not-allowed border-white/10 bg-white/[0.04] text-white/30"
                                                      : "border-white/10 bg-white/5 text-white/75 hover:bg-white/10 hover:text-white",
                                                  )}
                                                >
                                                  Up
                                                </button>
                                                <button
                                                  type="button"
                                                  onClick={() => movePdfFile(index, "down")}
                                                  disabled={index === pdfFiles.length - 1}
                                                  className={cx(
                                                    "inline-flex h-8 items-center justify-center rounded-full border px-3 text-xs font-semibold transition",
                                                    index === pdfFiles.length - 1
                                                      ? "cursor-not-allowed border-white/10 bg-white/[0.04] text-white/30"
                                                      : "border-white/10 bg-white/5 text-white/75 hover:bg-white/10 hover:text-white",
                                                  )}
                                                >
                                                  Down
                                                </button>
                                                <button
                                                  type="button"
                                                  onClick={() => removePdfFile(index)}
                                                  className="inline-flex h-8 items-center justify-center rounded-full border border-rose-400/20 bg-rose-500/10 px-3 text-xs font-semibold text-rose-100 transition hover:bg-rose-500/15"
                                                >
                                                  Remove
                                                </button>
                                              </div>
                                            </div>
                                          </div>
                                        ))}
                                      </div>
                                    </div>
                                  ) : null}


                                  <PdfWorkflowProgressBar
                                    status={pdfStatus}
                                    progress={pdfProgress}
                                    title="PDF build progress"
                                    subtitle="A clearer build bar for image-to-PDF, PDF merge, and mixed PDF jobs."
                                    idleLabel={pdfFiles.length ? "Ready to build" : "Waiting for files"}
                                    processingLabel={`Building PDF • ${pdfProgress}%`}
                                    doneLabel="PDF ready"
                                    errorLabel="Needs attention"
                                  />

                                </div>
                              </div>
                            </div>
                            ) : pdfToolTab === "pdf_to_image" ? (
                              <div className="relative overflow-hidden rounded-[28px] border border-white/10 bg-[linear-gradient(135deg,rgba(255,255,255,0.05),rgba(255,255,255,0.02))] p-6 shadow-[0_18px_50px_rgba(0,0,0,0.24)]">
                                <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_top_right,rgba(56,189,248,0.12),transparent_28%),radial-gradient(circle_at_bottom_left,rgba(168,85,247,0.14),transparent_34%)]" />
                                <div className="relative">
                                  <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
                                    <div>
                                      <div className="text-[11px] font-semibold uppercase tracking-[0.18em] text-white/45">
                                        PDF to Image
                                      </div>
                                      <h2 className="mt-2 text-xl font-semibold tracking-tight sm:text-2xl">
                                        Export PDF pages as images
                                      </h2>
                                      <p className="mt-2 max-w-[70ch] text-sm text-white/60">
                                        Upload one PDF and export its pages as{" "}
                                        {pdfToImageTarget}. Keep the preview in
                                        the same area, then download a single
                                        image or ZIP depending on the document.
                                      </p>

                                      <div className="mt-3 flex flex-wrap items-center gap-2">
                                        <span className="inline-flex items-center rounded-full bg-white/8 px-3 py-1.5 text-xs font-semibold text-white/75 ring-1 ring-white/10">
                                          Targets: PNG · JPG · WEBP
                                        </span>
                                        <span className="inline-flex items-center rounded-full bg-white/8 px-3 py-1.5 text-xs font-semibold text-white/75 ring-1 ring-white/10">
                                          Backend export
                                        </span>
                                      </div>
                                    </div>

                                    <span
                                      className={cx(
                                        "inline-flex items-center gap-2 self-start rounded-full px-3 py-1.5 text-xs font-semibold ring-1",
                                        pdfToImageStatus === "done"
                                          ? "bg-emerald-400/15 text-emerald-200 ring-emerald-300/20"
                                          : pdfToImageStatus === "processing"
                                            ? "bg-white/10 text-white/80 ring-white/10"
                                            : pdfToImageStatus === "error"
                                              ? "bg-rose-400/15 text-rose-200 ring-rose-300/20"
                                              : "bg-white/8 text-white/70 ring-white/10",
                                      )}
                                    >
                                      {pdfToImageStatus === "processing"
                                        ? `Exporting • ${pdfToImageProgress}%`
                                        : pdfToImageStatus === "done"
                                          ? "Done"
                                          : pdfToImageStatus === "error"
                                            ? "Error"
                                            : pdfToImageFile
                                              ? "PDF selected"
                                              : "Idle"}
                                    </span>
                                  </div>

                                  <div className="mt-6">
                                    <div className="space-y-4">
                                      <div
                                        onDragEnter={(e) => {
                                          e.preventDefault();
                                          e.stopPropagation();
                                        }}
                                        onDragOver={(e) => {
                                          e.preventDefault();
                                          e.stopPropagation();
                                        }}
                                        onDrop={(e) => {
                                          e.preventDefault();
                                          e.stopPropagation();

                                          const dropped = Array.from(
                                            e.dataTransfer.files || [],
                                          );
                                          const first = dropped[0] ?? null;
                                          if (!first) return;

                                          const err =
                                            validatePdfToImageFile(first);
                                          if (err) {
                                            setPdfToImageError(err);
                                            setPdfToImageStatus("error");
                                            return;
                                          }

                                          revokeUrl(pdfToImageResultUrl);
                                          setPdfToImageFile(first);
                                          setPdfToImageError(null);
                                          setPdfToImageStatus("idle");
                                          setPdfToImageProgress(0);
                                          setPdfToImageResultUrl(null);
                                        }}
                                        className="overflow-hidden rounded-[24px] border border-dashed border-white/15 bg-white/[0.03] p-4"
                                      >
                                        {pdfToImageFile ? (
                                          <div>
                                            <div className="flex items-start justify-between gap-3">
                                              <div>
                                                <div className="text-sm font-semibold text-white">
                                                  {pdfToImageFile.name}
                                                </div>
                                                <div className="mt-1 text-xs text-white/45">
                                                  {pdfToImagePageCount
                                                    ? `${pdfToImagePageCount} page${pdfToImagePageCount > 1 ? "s" : ""} • ${(pdfToImageFile.size / (1024 * 1024)).toFixed(2)} MB`
                                                    : `${(pdfToImageFile.size / (1024 * 1024)).toFixed(2)} MB`}
                                                </div>
                                              </div>

                                              <label className="inline-flex cursor-pointer items-center justify-center rounded-full border border-white/10 bg-white/8 px-4 py-2 text-xs font-semibold text-white transition hover:bg-white/12">
                                                Replace
                                                <input
                                                  type="file"
                                                  accept=".pdf,application/pdf"
                                                  className="hidden"
                                                  onChange={(e) => {
                                                    const selected =
                                                      e.target.files?.[0] ??
                                                      null;
                                                    if (!selected) return;

                                                    const err =
                                                      validatePdfToImageFile(
                                                        selected,
                                                      );
                                                    if (err) {
                                                      setPdfToImageError(err);
                                                      setPdfToImageStatus(
                                                        "error",
                                                      );
                                                      return;
                                                    }

                                                    revokeUrl(
                                                      pdfToImageResultUrl,
                                                    );
                                                    setPdfToImageFile(selected);
                                                    setPdfToImageError(null);
                                                    setPdfToImageStatus("idle");
                                                    setPdfToImageProgress(0);
                                                    setPdfToImageResultUrl(
                                                      null,
                                                    );
                                                  }}
                                                />
                                              </label>
                                            </div>

                                            <div className="mt-4 overflow-hidden rounded-[20px] border border-white/10 bg-black/25">
                                              {pdfToImagePreviewUrl ? (
                                                <iframe
                                                  src={pdfToImagePreviewUrl}
                                                  title="PDF to image preview"
                                                  className="h-[320px] w-full"
                                                />
                                              ) : null}
                                            </div>
                                          </div>
                                        ) : (
                                          <div className="py-6">
                                            <div className="mx-auto grid h-[64px] w-[64px] place-items-center rounded-[20px] bg-white/10 ring-1 ring-white/10">
                                              <svg
                                                width="28"
                                                height="28"
                                                viewBox="0 0 24 24"
                                                fill="none"
                                              >
                                                <path
                                                  d="M7 3h7l5 5v13H7a2 2 0 01-2-2V5a2 2 0 012-2z"
                                                  stroke="currentColor"
                                                  strokeWidth="2"
                                                  strokeLinejoin="round"
                                                />
                                                <path
                                                  d="M14 3v5h5"
                                                  stroke="currentColor"
                                                  strokeWidth="2"
                                                  strokeLinejoin="round"
                                                />
                                                <path
                                                  d="M8 15l2.8-2.8a1 1 0 011.4 0L15 15l1.4-1.4a1 1 0 011.4 0L19 14.8"
                                                  stroke="currentColor"
                                                  strokeWidth="2"
                                                  strokeLinecap="round"
                                                  strokeLinejoin="round"
                                                />
                                                <circle
                                                  cx="9.5"
                                                  cy="9.5"
                                                  r="1.2"
                                                  fill="currentColor"
                                                />
                                              </svg>
                                            </div>

                                            <div className="mt-4 text-center">
                                              <p className="text-base font-semibold text-white">
                                                Drop one PDF here
                                              </p>
                                              <p className="mt-2 text-sm text-white/55">
                                                Preview stays in this same panel
                                                after upload
                                              </p>
                                            </div>

                                            <div className="mt-5 flex justify-center">
                                              <label className="inline-flex cursor-pointer items-center justify-center rounded-full bg-white px-5 py-2.5 text-sm font-semibold text-black transition hover:bg-white/90">
                                                Choose PDF
                                                <input
                                                  type="file"
                                                  accept=".pdf,application/pdf"
                                                  className="hidden"
                                                  onChange={(e) => {
                                                    const selected =
                                                      e.target.files?.[0] ??
                                                      null;
                                                    if (!selected) return;

                                                    const err =
                                                      validatePdfToImageFile(
                                                        selected,
                                                      );
                                                    if (err) {
                                                      setPdfToImageError(err);
                                                      setPdfToImageStatus(
                                                        "error",
                                                      );
                                                      return;
                                                    }

                                                    revokeUrl(
                                                      pdfToImageResultUrl,
                                                    );
                                                    setPdfToImageFile(selected);
                                                    setPdfToImageError(null);
                                                    setPdfToImageStatus("idle");
                                                    setPdfToImageProgress(0);
                                                    setPdfToImageResultUrl(
                                                      null,
                                                    );
                                                  }}
                                                />
                                              </label>
                                            </div>
                                          </div>
                                        )}
                                      </div>

                                      <div className="rounded-[24px] bg-white/[0.04] p-4 ring-1 ring-white/10">
                                        <div className="flex flex-wrap items-center justify-between gap-3">
                                          <label className="block text-sm font-semibold text-white">
                                            Output format
                                          </label>
                                          <div className="inline-flex items-center gap-2 rounded-full border border-cyan-400/20 bg-cyan-500/10 px-3 py-1 text-xs font-semibold text-cyan-200">
                                            {pdfToImageTarget} export
                                          </div>
                                        </div>

                                        <div className="mt-4 grid gap-3 sm:grid-cols-3">
                                          {PDF_TO_IMAGE_TARGETS.map((fmt) => (
                                            <button
                                              key={fmt}
                                              type="button"
                                              onClick={() => {
                                                setPdfToImageTarget(fmt);
                                                if (pdfMode) {
                                                  navigateIfNeeded(
                                                    buildPdfToolPath(
                                                      "pdf_to_image",
                                                      fmt,
                                                    ),
                                                  );
                                                }
                                              }}
                                              className={cx(
                                                "rounded-2xl p-4 text-left transition ring-1",
                                                pdfToImageTarget === fmt
                                                  ? "bg-white text-black ring-white shadow-[0_10px_25px_rgba(255,255,255,0.12)]"
                                                  : "bg-black/20 text-white/75 ring-white/10 hover:bg-white/10 hover:text-white",
                                              )}
                                            >
                                              <div className="text-xs font-semibold uppercase tracking-[0.18em] opacity-60">
                                                Format
                                              </div>
                                              <div className="mt-2 text-base font-semibold">
                                                {fmt}
                                              </div>
                                              <div
                                                className={cx(
                                                  "mt-1 text-xs",
                                                  pdfToImageTarget === fmt
                                                    ? "text-black/65"
                                                    : "text-white/45",
                                                )}
                                              >
                                                {fmt === "PNG"
                                                  ? "Sharper page previews"
                                                  : fmt === "JPG"
                                                    ? "Lighter image delivery"
                                                    : "Modern web-friendly export"}
                                              </div>
                                            </button>
                                          ))}
                                        </div>
                                      </div>

                                      {pdfToImageError ? (
                                        <div className="rounded-2xl border border-rose-400/20 bg-rose-500/10 p-4 text-sm text-rose-200">
                                          {pdfToImageError}
                                        </div>
                                      ) : null}
                                    </div>

                                    <div className="rounded-[24px] bg-white/[0.04] p-4 ring-1 ring-white/10">
                                      {pdfToImageResultUrl ? (
                                        <div className="flex flex-wrap items-center justify-center gap-3">
                                          <a
                                            href={pdfToImageResultUrl}
                                            download={pdfToImageResultName}
                                            className="inline-flex h-11 items-center justify-center rounded-full bg-white px-5 text-sm font-semibold text-black transition hover:bg-white/90"
                                          >
                                            Download result
                                          </a>
                                          <button
                                            type="button"
                                            onClick={resetPdfToImage}
                                            className="inline-flex h-11 items-center justify-center rounded-full border border-white/10 bg-white/5 px-5 text-sm font-semibold text-white/75 transition hover:bg-white/10 hover:text-white"
                                          >
                                            Clear
                                          </button>
                                        </div>
                                      ) : (
                                        <div className="flex flex-wrap items-center justify-center gap-3">
                                          <button
                                            type="button"
                                            onClick={startPdfToImage}
                                            disabled={!pdfToImageFile || pdfToImageStatus === "processing"}
                                            className="inline-flex h-11 items-center justify-center rounded-full bg-white px-5 text-sm font-semibold text-black transition hover:bg-white/90 disabled:cursor-not-allowed disabled:opacity-50"
                                          >
                                            {pdfToImageStatus === "processing" ? "Exporting..." : "Convert PDF"}
                                          </button>
                                          <button
                                            type="button"
                                            onClick={resetPdfToImage}
                                            className="inline-flex h-11 items-center justify-center rounded-full border border-white/10 bg-white/5 px-5 text-sm font-semibold text-white/75 transition hover:bg-white/10 hover:text-white"
                                          >
                                            Clear
                                          </button>
                                        </div>
                                      )}
                                    </div>
                                  <PdfWorkflowProgressBar
                                    status={pdfToImageStatus}
                                    progress={pdfToImageProgress}
                                    title="PDF to image progress"
                                    subtitle="Shows upload, page rendering, backend processing, and final download preparation."
                                    idleLabel={pdfToImageFile ? "Ready to export" : "Waiting for PDF"}
                                    processingLabel={`Exporting pages • ${pdfToImageProgress}%`}
                                    doneLabel="Image export ready"
                                    errorLabel="Export needs attention"
                                  />

                                </div>
                              </div>
                            </div>
                            ) : (
                              <div className="relative overflow-hidden rounded-[28px] border border-white/10 bg-[radial-gradient(circle_at_top_left,rgba(255,255,255,0.08),transparent_28%),radial-gradient(circle_at_bottom_right,rgba(56,189,248,0.14),transparent_38%),linear-gradient(135deg,rgba(255,255,255,0.08),rgba(255,255,255,0.03))] p-6 shadow-[0_18px_50px_rgba(0,0,0,0.24)]">
                                <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_top_left,rgba(168,85,247,0.14),transparent_34%),radial-gradient(circle_at_bottom_right,rgba(96,165,250,0.14),transparent_40%)]" />

                                <div className="relative">
                                  <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
                                    <div>
                                      <div className="text-[11px] font-semibold uppercase tracking-[0.18em] text-white/45">
                                        Split PDF
                                      </div>
                                      <h2 className="mt-2 text-xl font-semibold tracking-tight sm:text-2xl">
                                        Extract selected pages
                                      </h2>
                                      <p className="mt-1 max-w-[72ch] text-sm text-white/60">
                                        Upload a PDF and enter page ranges like
                                        1-3 or 1,3,5-7. The split work runs on
                                        the backend.
                                      </p>
                                    </div>

                                    <span
                                      className={cx(
                                        "inline-flex items-center gap-2 self-start rounded-full px-3 py-1.5 text-xs font-semibold ring-1",
                                        splitPdfStatus === "done"
                                          ? "bg-emerald-400/15 text-emerald-200 ring-emerald-300/20"
                                          : splitPdfStatus === "processing"
                                            ? "bg-white/10 text-white/80 ring-white/10"
                                            : splitPdfStatus === "error"
                                              ? "bg-rose-400/15 text-rose-200 ring-rose-300/20"
                                              : "bg-white/8 text-white/70 ring-white/10",
                                      )}
                                    >
                                      {splitPdfStatus === "processing"
                                        ? `Splitting • ${splitPdfProgress}%`
                                        : splitPdfStatus === "done"
                                          ? "Done"
                                          : splitPdfStatus === "error"
                                            ? "Error"
                                            : splitPdfFile
                                              ? "PDF selected"
                                              : "Idle"}
                                    </span>
                                  </div>

                                  <div className="mt-6">
                                    <div className="space-y-4">
                                      <div
                                        onDragEnter={(e) => {
                                          e.preventDefault();
                                          e.stopPropagation();
                                        }}
                                        onDragOver={(e) => {
                                          e.preventDefault();
                                          e.stopPropagation();
                                        }}
                                        onDrop={(e) => {
                                          e.preventDefault();
                                          e.stopPropagation();

                                          const dropped = Array.from(
                                            e.dataTransfer.files || [],
                                          );
                                          const first = dropped[0] ?? null;
                                          if (!first) return;

                                          const err =
                                            validateSplitPdfFile(first);
                                          if (err) {
                                            setSplitPdfError(err);
                                            setSplitPdfStatus("error");
                                            return;
                                          }

                                          revokeUrl(splitPdfResultUrl);
                                          setSplitPdfFile(first);
                                          setSplitPdfError(null);
                                          setSplitPdfStatus("idle");
                                          setSplitPdfProgress(0);
                                          setSplitPdfResultUrl(null);
                                        }}
                                        className="overflow-hidden rounded-[24px] border border-dashed border-white/15 bg-white/[0.03] p-4"
                                      >
                                        {splitPdfFile ? (
                                          <div>
                                            <div className="flex items-start justify-between gap-3">
                                              <div>
                                                <div className="text-sm font-semibold text-white">
                                                  {splitPdfFile.name}
                                                </div>
                                                <div className="mt-1 text-xs text-white/45">
                                                  {splitPdfPageCount
                                                    ? `${splitPdfPageCount} page${splitPdfPageCount > 1 ? "s" : ""} • ${(splitPdfFile.size / (1024 * 1024)).toFixed(2)} MB`
                                                    : `${(splitPdfFile.size / (1024 * 1024)).toFixed(2)} MB`}
                                                </div>
                                              </div>

                                              <label className="inline-flex cursor-pointer items-center justify-center rounded-full border border-white/10 bg-white/8 px-4 py-2 text-xs font-semibold text-white transition hover:bg-white/12">
                                                Replace
                                                <input
                                                  type="file"
                                                  accept=".pdf,application/pdf"
                                                  className="hidden"
                                                  onChange={(e) => {
                                                    const selected =
                                                      e.target.files?.[0] ??
                                                      null;
                                                    if (!selected) return;

                                                    const err =
                                                      validateSplitPdfFile(
                                                        selected,
                                                      );
                                                    if (err) {
                                                      setSplitPdfError(err);
                                                      setSplitPdfStatus(
                                                        "error",
                                                      );
                                                      return;
                                                    }

                                                    revokeUrl(
                                                      splitPdfResultUrl,
                                                    );
                                                    setSplitPdfFile(selected);
                                                    setSplitPdfError(null);
                                                    setSplitPdfStatus("idle");
                                                    setSplitPdfProgress(0);
                                                    setSplitPdfResultUrl(null);
                                                  }}
                                                />
                                              </label>
                                            </div>

                                            <div className="mt-4 overflow-hidden rounded-[20px] border border-white/10 bg-black/25">
                                              {splitPdfPreviewUrl ? (
                                                <iframe
                                                  src={splitPdfPreviewUrl}
                                                  title="Split PDF preview"
                                                  className="h-[320px] w-full"
                                                />
                                              ) : null}
                                            </div>
                                          </div>
                                        ) : (
                                          <div className="py-6">
                                            <div className="mx-auto grid h-[64px] w-[64px] place-items-center rounded-[20px] bg-white/10 ring-1 ring-white/10">
                                              <svg
                                                width="28"
                                                height="28"
                                                viewBox="0 0 24 24"
                                                fill="none"
                                              >
                                                <path
                                                  d="M7 3h7l5 5v13H7a2 2 0 01-2-2V5a2 2 0 012-2z"
                                                  stroke="currentColor"
                                                  strokeWidth="2"
                                                  strokeLinejoin="round"
                                                />
                                                <path
                                                  d="M14 3v5h5"
                                                  stroke="currentColor"
                                                  strokeWidth="2"
                                                  strokeLinejoin="round"
                                                />
                                                <path
                                                  d="M8 12h8"
                                                  stroke="currentColor"
                                                  strokeWidth="2"
                                                  strokeLinecap="round"
                                                />
                                              </svg>
                                            </div>

                                            <div className="mt-4 text-center">
                                              <p className="text-base font-semibold text-white">
                                                Drop one PDF here
                                              </p>
                                              <p className="mt-2 text-sm text-white/55">
                                                or choose a file manually
                                              </p>
                                            </div>

                                            <div className="mt-5 flex justify-center">
                                              <label className="inline-flex cursor-pointer items-center justify-center rounded-full bg-white px-5 py-2.5 text-sm font-semibold text-black transition hover:bg-white/90">
                                                Choose PDF
                                                <input
                                                  type="file"
                                                  accept=".pdf,application/pdf"
                                                  className="hidden"
                                                  onChange={(e) => {
                                                    const selected =
                                                      e.target.files?.[0] ??
                                                      null;
                                                    if (!selected) return;

                                                    const err =
                                                      validateSplitPdfFile(
                                                        selected,
                                                      );
                                                    if (err) {
                                                      setSplitPdfError(err);
                                                      setSplitPdfStatus(
                                                        "error",
                                                      );
                                                      return;
                                                    }

                                                    revokeUrl(
                                                      splitPdfResultUrl,
                                                    );
                                                    setSplitPdfFile(selected);
                                                    setSplitPdfError(null);
                                                    setSplitPdfStatus("idle");
                                                    setSplitPdfProgress(0);
                                                    setSplitPdfResultUrl(null);
                                                  }}
                                                />
                                              </label>
                                            </div>
                                          </div>
                                        )}
                                      </div>

                                      <div className="rounded-[24px] bg-white/[0.04] p-4 ring-1 ring-white/10">
                                        <div className="flex flex-wrap items-center justify-between gap-3">
                                          <label className="block text-sm font-semibold text-white">
                                            Page range
                                          </label>
                                          <div className="inline-flex items-center gap-2 rounded-full border border-cyan-400/20 bg-cyan-500/10 px-3 py-1 text-xs font-semibold text-cyan-200">
                                            {splitPdfRange || "Select pages"}
                                          </div>
                                        </div>

                                        {splitPdfPageCount > 0 ? (
                                          <div className="mt-4 space-y-4">
                                            <div className="grid gap-3 sm:grid-cols-2">
                                              <div className="rounded-2xl bg-black/25 p-4 ring-1 ring-white/10">
                                                <div className="flex items-center justify-between gap-3">
                                                  <span className="text-xs uppercase tracking-[0.18em] text-white/40">
                                                    From
                                                  </span>
                                                  <span className="text-sm font-semibold text-white">
                                                    Page{" "}
                                                    {Math.min(
                                                      splitPdfStartPage,
                                                      splitPdfEndPage,
                                                    )}
                                                  </span>
                                                </div>
                                                <input
                                                  type="range"
                                                  min={1}
                                                  max={splitPdfPageCount}
                                                  value={splitPdfStartPage}
                                                  onChange={(e) => {
                                                    const next = Number(
                                                      e.target.value,
                                                    );
                                                    setSplitPdfStartPage(next);
                                                    if (next > splitPdfEndPage)
                                                      setSplitPdfEndPage(next);
                                                  }}
                                                  className="mt-4 w-full accent-white"
                                                />
                                              </div>

                                              <div className="rounded-2xl bg-black/25 p-4 ring-1 ring-white/10">
                                                <div className="flex items-center justify-between gap-3">
                                                  <span className="text-xs uppercase tracking-[0.18em] text-white/40">
                                                    To
                                                  </span>
                                                  <span className="text-sm font-semibold text-white">
                                                    Page{" "}
                                                    {Math.max(
                                                      splitPdfStartPage,
                                                      splitPdfEndPage,
                                                    )}
                                                  </span>
                                                </div>
                                                <input
                                                  type="range"
                                                  min={1}
                                                  max={splitPdfPageCount}
                                                  value={splitPdfEndPage}
                                                  onChange={(e) => {
                                                    const next = Number(
                                                      e.target.value,
                                                    );
                                                    setSplitPdfEndPage(next);
                                                    if (
                                                      next < splitPdfStartPage
                                                    )
                                                      setSplitPdfStartPage(
                                                        next,
                                                      );
                                                  }}
                                                  className="mt-4 w-full accent-white"
                                                />
                                              </div>
                                            </div>

                                            <div className="rounded-2xl bg-black/25 p-4 ring-1 ring-white/10">
                                              <div className="text-xs uppercase tracking-[0.18em] text-white/40">
                                                Range string
                                              </div>
                                              <div className="mt-3 flex flex-col gap-3 sm:flex-row">
                                                <input
                                                  type="text"
                                                  value={splitPdfRange}
                                                  onChange={(e) =>
                                                    setSplitPdfRange(
                                                      e.target.value,
                                                    )
                                                  }
                                                  placeholder="Example: 1-3 or 1,3,5-7"
                                                  className="h-11 flex-1 rounded-2xl border border-white/10 bg-black/25 px-4 text-sm text-white outline-none placeholder:text-white/35 focus:border-white/20"
                                                />
                                                <button
                                                  type="button"
                                                  onClick={() =>
                                                    setSplitPdfRange(
                                                      `${Math.min(splitPdfStartPage, splitPdfEndPage)}-${Math.max(splitPdfStartPage, splitPdfEndPage)}`,
                                                    )
                                                  }
                                                  className="inline-flex h-11 items-center justify-center rounded-full border border-cyan-400/25 bg-cyan-500/10 px-4 text-sm font-semibold text-cyan-100 transition hover:bg-cyan-500/15"
                                                >
                                                  Use slider range
                                                </button>
                                              </div>
                                            </div>
                                          </div>
                                        ) : (
                                          <div className="mt-4 rounded-2xl bg-black/25 p-4 ring-1 ring-white/10">
                                            <div className="text-sm text-white/65">
                                              Upload a PDF first to enable the
                                              visual page selector.
                                            </div>
                                          </div>
                                        )}
                                      </div>

                                      {splitPdfError ? (
                                        <div className="rounded-2xl border border-rose-400/20 bg-rose-500/10 p-4 text-sm text-rose-200">
                                          {splitPdfError}
                                        </div>
                                      ) : null}
                                    </div>

                                    <div className="rounded-[24px] bg-white/[0.04] p-4 ring-1 ring-white/10">
                                      {splitPdfResultUrl ? (
                                        <div className="flex flex-wrap items-center justify-center gap-3">
                                          <a
                                            href={splitPdfResultUrl}
                                            download={splitPdfResultName}
                                            className="inline-flex h-11 items-center justify-center rounded-full bg-white px-5 text-sm font-semibold text-black transition hover:bg-white/90"
                                          >
                                            Download PDF
                                          </a>
                                          <button
                                            type="button"
                                            onClick={resetSplitPdf}
                                            className="inline-flex h-11 items-center justify-center rounded-full border border-white/10 bg-white/5 px-5 text-sm font-semibold text-white/75 transition hover:bg-white/10 hover:text-white"
                                          >
                                            Clear
                                          </button>
                                        </div>
                                      ) : (
                                        <div className="flex flex-wrap items-center justify-center gap-3">
                                          <button
                                            type="button"
                                            onClick={startSplitPdf}
                                            disabled={!splitPdfFile || splitPdfStatus === "processing"}
                                            className="inline-flex h-11 items-center justify-center rounded-full bg-white px-5 text-sm font-semibold text-black transition hover:bg-white/90 disabled:cursor-not-allowed disabled:opacity-50"
                                          >
                                            {splitPdfStatus === "processing" ? "Splitting..." : "Split PDF"}
                                          </button>
                                          <button
                                            type="button"
                                            onClick={resetSplitPdf}
                                            className="inline-flex h-11 items-center justify-center rounded-full border border-white/10 bg-white/5 px-5 text-sm font-semibold text-white/75 transition hover:bg-white/10 hover:text-white"
                                          >
                                            Clear
                                          </button>
                                        </div>
                                      )}
                                    </div>
                                  <PdfWorkflowProgressBar
                                    status={splitPdfStatus}
                                    progress={splitPdfProgress}
                                    title="Split PDF progress"
                                    subtitle="A visible status bar for page selection, backend split work, and download preparation."
                                    idleLabel={splitPdfFile ? "Ready to split" : "Waiting for PDF"}
                                    processingLabel={`Splitting PDF • ${splitPdfProgress}%`}
                                    doneLabel="Split PDF ready"
                                    errorLabel="Split needs attention"
                                  />

                                </div>
                              </div>
                            </div>
                            )}
                          </div>
                        ) : (
                          <>
                            {/* SINGLE MODE UI */}
                            <div>
                              <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
                                <div>
                                  <div className="text-[11px] font-semibold uppercase tracking-[0.18em] text-white/45">
                                    Converter
                                  </div>
                                  <h2 className="mt-2 text-xl font-semibold tracking-tight sm:text-2xl">
                                    Upload & convert
                                  </h2>
                                  <p className="mt-1 text-sm text-white/60">
                                    Choose a file, select a format, and send it
                                    for conversion.
                                  </p>

                                  <div className="mt-3 flex flex-wrap items-center gap-2">
                                    <span className="inline-flex items-center rounded-full bg-white/10 px-3 py-1.5 text-xs font-semibold text-white ring-1 ring-white/10">
                                      {formatFlowText}
                                    </span>

                                    {fromFmt ? (
                                      <span className="inline-flex items-center rounded-full bg-emerald-400/15 px-3 py-1.5 text-xs font-semibold text-emerald-200 ring-1 ring-emerald-300/20">
                                        Detected input: {fromFmt}
                                      </span>
                                    ) : routeInput || suggestedInput ? (
                                      <span className="inline-flex items-center rounded-full bg-white/8 px-3 py-1.5 text-xs font-semibold text-white/75 ring-1 ring-white/10">
                                        Suggested route:{" "}
                                        {routeInput ??
                                          suggestedInput ??
                                          "INPUT"}{" "}
                                        → {routeOutput}
                                      </span>
                                    ) : null}
                                  </div>
                                </div>

                                <span
                                  className={cx(
                                    "inline-flex items-center gap-2 self-start rounded-full px-3 py-1.5 text-xs font-semibold ring-1",
                                    status === "ready" || status === "done"
                                      ? "bg-emerald-400/15 text-emerald-200 ring-emerald-300/20"
                                      : status === "loading" ||
                                          status === "processing"
                                        ? "bg-white/10 text-white/80 ring-white/10"
                                        : "bg-white/8 text-white/70 ring-white/10",
                                  )}
                                >
                                  <span
                                    className={cx(
                                      "h-2 w-2 rounded-full",
                                      status === "ready" || status === "done"
                                        ? "bg-emerald-300"
                                        : status === "loading" ||
                                            status === "processing"
                                          ? "bg-white/70"
                                          : "bg-white/40",
                                    )}
                                  />
                                  {status === "processing"
                                    ? `${progressLabel} • ${displayProgress}%`
                                    : status === "done"
                                      ? "Done"
                                      : status === "ready"
                                        ? "File ready"
                                        : "Waiting for file"}
                                </span>
                              </div>

                              <div className="my-6 h-px w-full bg-gradient-to-r from-transparent via-white/15 to-transparent" />

                              <div
                                className={cx(
                                  "relative rounded-[26px] border border-dashed p-7 text-center transition sm:p-9",
                                  dragOver
                                    ? "border-white/45 bg-white/6"
                                    : "border-white/20 bg-black/20 hover:bg-white/6",
                                )}
                                onDragEnter={(e) => {
                                  e.preventDefault();
                                  e.stopPropagation();
                                  setDragOver(true);
                                }}
                                onDragOver={(e) => {
                                  e.preventDefault();
                                  e.stopPropagation();
                                  setDragOver(true);
                                }}
                                onDragLeave={(e) => {
                                  e.preventDefault();
                                  e.stopPropagation();
                                  setDragOver(false);
                                }}
                                onDrop={(e) => {
                                  e.preventDefault();
                                  e.stopPropagation();
                                  setDragOver(false);
                                  const f = e.dataTransfer.files?.[0];
                                  if (f) pickFile(f);
                                }}
                              >
                                <input
                                  id="fileInput"
                                  type="file"
                                  className="hidden"
                                  accept={getAcceptForInput()}
                                  onChange={(e) => {
                                    const f = e.target.files?.[0];
                                    if (f) pickFile(f);
                                  }}
                                />

                                <div className="mx-auto grid h-[72px] w-[72px] place-items-center rounded-[24px] bg-white/10 ring-1 ring-white/10">
                                  <svg
                                    width="30"
                                    height="30"
                                    viewBox="0 0 24 24"
                                    fill="none"
                                  >
                                    <path
                                      d="M12 16V4"
                                      stroke="currentColor"
                                      strokeWidth="2"
                                      strokeLinecap="round"
                                    />
                                    <path
                                      d="M7 9L12 4L17 9"
                                      stroke="currentColor"
                                      strokeWidth="2"
                                      strokeLinecap="round"
                                    />
                                    <path
                                      d="M4 20H20"
                                      stroke="currentColor"
                                      strokeWidth="2"
                                      strokeLinecap="round"
                                    />
                                  </svg>
                                </div>

                                <p className="mt-5 text-lg font-semibold">
                                  <span className="mx-auto block max-w-[56ch] truncate">
                                    {file ? file.name : "Drop a file here"}
                                  </span>
                                </p>

                                <p className="mt-2 text-sm text-white/60">
                                  {file
                                    ? `${(file.size / (1024 * 1024)).toFixed(1)}MB selected`
                                    : "Supported: MP3 • WAV • M4A • AAC • OGG • OPUS • FLAC • AIFF • WMA • AMR • MP4 • WEBM • MOV • MKV • AVI • WMV • FLV • M4V • MPG • MPEG • 3GP • GIF • PNG • JPG • WEBP • BMP • TIFF • ICO • AVIF"}
                                </p>

                                {file && previewUrl ? (
                                  <div className="mt-6 overflow-hidden rounded-[22px] bg-black/30 p-3 ring-1 ring-white/10">
                                    {isAudioFmt(fromFmt) ? (
                                      <div className="space-y-3">
                                        <div className="flex items-center justify-center rounded-[18px] bg-white/5 px-4 py-6 text-sm text-white/70">
                                          Audio preview
                                        </div>
                                        <audio
                                          controls
                                          src={previewUrl}
                                          className="w-full"
                                        />
                                      </div>
                                    ) : isImageFmt(fromFmt) ? (
                                      <div className="flex justify-center">
                                        <img
                                          src={previewUrl}
                                          alt={`${fromFmt ?? "Image"} preview`}
                                          className="max-h-[320px] rounded-[18px] object-contain ring-1 ring-white/10"
                                        />
                                      </div>
                                    ) : (
                                      <video
                                        controls
                                        src={previewUrl}
                                        className="mx-auto max-h-[320px] w-full rounded-[18px] bg-black object-contain ring-1 ring-white/10"
                                      />
                                    )}
                                  </div>
                                ) : null}

                                <p className="mt-6 text-xs leading-6 text-white/55">
                                  {fromFmt ? (
                                    <>
                                      You are converting{" "}
                                      <span className="font-semibold text-white/75">
                                        {fromFmt}
                                      </span>{" "}
                                      files to{" "}
                                      <span className="font-semibold text-white/75">
                                        {target}
                                      </span>
                                      . The page keeps your workflow aligned
                                      with the selected format route while you
                                      continue converting.
                                    </>
                                  ) : (
                                    <>
                                      This page starts with a suggested route of{" "}
                                      <span className="font-semibold text-white/75">
                                        {routeInput ?? "input"}
                                      </span>{" "}
                                      to{" "}
                                      <span className="font-semibold text-white/75">
                                        {routeOutput}
                                      </span>
                                      , and you can still switch to another
                                      supported output format at any time.
                                    </>
                                  )}
                                </p>

                                <div className="mt-6 flex flex-col items-center justify-center gap-3 sm:flex-row sm:flex-wrap">
                                  <button
                                    type="button"
                                    onClick={() =>
                                      document
                                        .getElementById("fileInput")
                                        ?.click()
                                    }
                                    className="h-11 rounded-2xl bg-white/10 px-5 text-sm font-semibold text-white ring-1 ring-white/10 transition hover:bg-white/15"
                                  >
                                    Choose file
                                  </button>

                                  <div ref={targetWrapRef} className="relative">
                                    <button
                                      type="button"
                                      onClick={() => setTargetOpen((v) => !v)}
                                      className="inline-flex h-11 items-center gap-2 rounded-2xl bg-white/10 px-4 text-sm font-semibold text-white ring-1 ring-white/10 transition hover:bg-white/15"
                                      aria-haspopup="listbox"
                                      aria-expanded={targetOpen}
                                    >
                                      <span className="text-xs font-medium text-white/60">
                                        Convert to
                                      </span>
                                      <span>{target}</span>
                                      <svg
                                        width="16"
                                        height="16"
                                        viewBox="0 0 24 24"
                                        fill="none"
                                        className={cx(
                                          "transition",
                                          targetOpen ? "rotate-180" : "",
                                        )}
                                      >
                                        <path
                                          d="M6 9l6 6 6-6"
                                          stroke="currentColor"
                                          strokeWidth="2"
                                          strokeLinecap="round"
                                          strokeLinejoin="round"
                                        />
                                      </svg>
                                    </button>

                                    {targetOpen ? (
                                      <div
                                        role="listbox"
                                        className="absolute left-1/2 z-30 mt-2 w-52 -translate-x-1/2 overflow-hidden rounded-2xl bg-[#0D0B18]/95 backdrop-blur ring-1 ring-white/15 shadow-[0_20px_60px_rgba(0,0,0,0.55)]"
                                      >
                                        <div
                                          ref={targetListRef}
                                          className="max-h-64 overflow-auto"
                                        >
                                          {availableTargets.map((fmt) => (
                                            <button
                                              key={fmt}
                                              type="button"
                                              onClick={() => {
                                                setTarget(fmt);
                                                setTargetOpen(false);

                                                const nextInputForSoftRoute =
                                                  fromFmt ?? routeInput ?? null;
                                                if (nextInputForSoftRoute) {
                                                  softSyncRoute(
                                                    nextInputForSoftRoute,
                                                    fmt,
                                                  );
                                                } else {
                                                  setRouteOutput(fmt);
                                                }
                                              }}
                                              className={cx(
                                                "flex w-full items-center justify-between px-4 py-3 text-sm transition",
                                                fmt === target
                                                  ? "bg-white/10 text-white"
                                                  : "text-white/80 hover:bg-white/10",
                                              )}
                                            >
                                              <span className="font-semibold">
                                                {fmt}
                                              </span>
                                              {fmt === target ? (
                                                <svg
                                                  width="16"
                                                  height="16"
                                                  viewBox="0 0 24 24"
                                                  fill="none"
                                                >
                                                  <path
                                                    d="M20 6L9 17l-5-5"
                                                    stroke="currentColor"
                                                    strokeWidth="2"
                                                    strokeLinecap="round"
                                                    strokeLinejoin="round"
                                                  />
                                                </svg>
                                              ) : (
                                                <span className="w-4" />
                                              )}
                                            </button>
                                          ))}
                                        </div>

                                        <button
                                          type="button"
                                          onClick={() =>
                                            targetListRef.current?.scrollBy({
                                              top: 140,
                                              behavior: "smooth",
                                            })
                                          }
                                          className="flex w-full items-center justify-center gap-2 border-t border-white/10 bg-white/5 py-2 text-xs font-semibold text-white/70 transition hover:bg-white/10"
                                          aria-label="Scroll options"
                                        >
                                          <span>Scroll</span>
                                          <svg
                                            width="14"
                                            height="14"
                                            viewBox="0 0 24 24"
                                            fill="none"
                                          >
                                            <path
                                              d="M6 9l6 6 6-6"
                                              stroke="currentColor"
                                              strokeWidth="2"
                                              strokeLinecap="round"
                                              strokeLinejoin="round"
                                            />
                                          </svg>
                                        </button>
                                      </div>
                                    ) : null}
                                  </div>

                                  <div className="w-full max-w-3xl">
                                    <div className="mt-6 space-y-3">
                                      {showTrimControls && (
                                        <ProFeatureLock
                                          title="Trim"
                                          enabled={canUseTrim}
                                          onUpgrade={() =>
                                            setShowUpgradePanel(true)
                                          }
                                        >
                                          <div className="space-y-4">
                                            <button
                                              type="button"
                                              onClick={() => {
                                                if (!canUseTrim) {
                                                  setShowUpgradePanel(true);
                                                  return;
                                                }

                                                const next = !trimEnabled;
                                                setTrimEnabled(next);

                                                if (next && mediaDuration > 0) {
                                                  setTrimStart(0);
                                                  setTrimEnd(mediaDuration);
                                                }
                                              }}
                                              className={cx(
                                                "flex w-full items-center justify-between rounded-2xl border px-4 py-3 text-left transition",
                                                trimEnabled
                                                  ? "border-fuchsia-400/40 bg-fuchsia-500/10"
                                                  : "border-white/10 bg-white/[0.03]",
                                              )}
                                            >
                                              <div>
                                                <div className="text-sm font-semibold text-white">
                                                  Enable trim
                                                </div>
                                                <div className="mt-1 text-xs text-white/55">
                                                  Cut the beginning and end
                                                  before conversion.
                                                </div>
                                              </div>

                                              <div
                                                className={cx(
                                                  "relative h-6 w-11 rounded-full transition",
                                                  trimEnabled
                                                    ? "bg-fuchsia-500"
                                                    : "bg-white/15",
                                                )}
                                              >
                                                <span
                                                  className={cx(
                                                    "absolute top-1 h-4 w-4 rounded-full bg-white transition",
                                                    trimEnabled
                                                      ? "left-6"
                                                      : "left-1",
                                                  )}
                                                />
                                              </div>
                                            </button>

                                            {trimEnabled && (
                                              <div className="rounded-2xl border border-white/10 bg-white/[0.03] p-4">
                                                {mediaDuration > 0 ? (
                                                  <>
                                                    <div className="mb-3 flex items-center justify-between gap-3">
                                                      <div>
                                                        <div className="text-sm font-semibold text-white">
                                                          Trim range
                                                        </div>
                                                        <div className="mt-1 text-xs text-white/55">
                                                          Selected:{" "}
                                                          {formatTime(
                                                            trimStart,
                                                          )}{" "}
                                                          —{" "}
                                                          {formatTime(trimEnd)}
                                                        </div>
                                                      </div>

                                                      <button
                                                        type="button"
                                                        onClick={() => {
                                                          setTrimStart(0);
                                                          setTrimEnd(
                                                            mediaDuration,
                                                          );
                                                        }}
                                                        className="inline-flex h-9 items-center rounded-full border border-white/10 bg-white/5 px-4 text-xs font-semibold text-white/75 transition hover:bg-white/10 hover:text-white"
                                                      >
                                                        Reset
                                                      </button>
                                                    </div>

                                                    <div className="relative mt-5 h-10">
                                                      <div className="absolute left-0 right-0 top-1/2 h-2 -translate-y-1/2 rounded-full bg-white/10" />

                                                      <div
                                                        className="absolute top-1/2 h-2 -translate-y-1/2 rounded-full bg-fuchsia-500"
                                                        style={{
                                                          left: `${(trimStart / mediaDuration) * 100}%`,
                                                          width: `${((trimEnd - trimStart) / mediaDuration) * 100}%`,
                                                        }}
                                                      />

                                                      <input
                                                        type="range"
                                                        min={0}
                                                        max={mediaDuration}
                                                        step={0.1}
                                                        value={trimStart}
                                                        onChange={(e) => {
                                                          const next = clamp(
                                                            Number(
                                                              e.target.value,
                                                            ),
                                                            0,
                                                            trimEnd - 0.1,
                                                          );
                                                          setTrimStart(next);
                                                        }}
                                                        className="pointer-events-none absolute left-0 top-1/2 h-2 w-full -translate-y-1/2 appearance-none bg-transparent [&::-webkit-slider-thumb]:pointer-events-auto [&::-webkit-slider-thumb]:h-4 [&::-webkit-slider-thumb]:w-4 [&::-webkit-slider-thumb]:appearance-none [&::-webkit-slider-thumb]:rounded-full [&::-webkit-slider-thumb]:border [&::-webkit-slider-thumb]:border-white/20 [&::-webkit-slider-thumb]:bg-white"
                                                      />

                                                      <input
                                                        type="range"
                                                        min={0}
                                                        max={mediaDuration}
                                                        step={0.1}
                                                        value={trimEnd}
                                                        onChange={(e) => {
                                                          const next = clamp(
                                                            Number(
                                                              e.target.value,
                                                            ),
                                                            trimStart + 0.1,
                                                            mediaDuration,
                                                          );
                                                          setTrimEnd(next);
                                                        }}
                                                        className="pointer-events-none absolute left-0 top-1/2 h-2 w-full -translate-y-1/2 appearance-none bg-transparent [&::-webkit-slider-thumb]:pointer-events-auto [&::-webkit-slider-thumb]:h-4 [&::-webkit-slider-thumb]:w-4 [&::-webkit-slider-thumb]:appearance-none [&::-webkit-slider-thumb]:rounded-full [&::-webkit-slider-thumb]:border [&::-webkit-slider-thumb]:border-fuchsia-300/30 [&::-webkit-slider-thumb]:bg-fuchsia-300"
                                                      />
                                                    </div>

                                                    <div className="mt-4 grid gap-3 sm:grid-cols-3">
                                                      <div className="rounded-2xl border border-white/10 bg-black/20 p-3">
                                                        <div className="text-[11px] uppercase tracking-[0.16em] text-white/45">
                                                          Start
                                                        </div>
                                                        <div className="mt-1 text-sm font-semibold text-white">
                                                          {formatTime(
                                                            trimStart,
                                                          )}
                                                        </div>
                                                      </div>

                                                      <div className="rounded-2xl border border-white/10 bg-black/20 p-3">
                                                        <div className="text-[11px] uppercase tracking-[0.16em] text-white/45">
                                                          End
                                                        </div>
                                                        <div className="mt-1 text-sm font-semibold text-white">
                                                          {formatTime(trimEnd)}
                                                        </div>
                                                      </div>

                                                      <div className="rounded-2xl border border-white/10 bg-black/20 p-3">
                                                        <div className="text-[11px] uppercase tracking-[0.16em] text-white/45">
                                                          Length
                                                        </div>
                                                        <div className="mt-1 text-sm font-semibold text-white">
                                                          {formatTime(
                                                            trimEnd - trimStart,
                                                          )}
                                                        </div>
                                                      </div>
                                                    </div>
                                                  </>
                                                ) : (
                                                  <div className="rounded-2xl border border-amber-400/20 bg-amber-500/10 p-4 text-sm text-amber-100">
                                                    Media duration could not be
                                                    detected for this file, so
                                                    trim is unavailable.
                                                  </div>
                                                )}
                                              </div>
                                            )}
                                          </div>
                                        </ProFeatureLock>
                                      )}

                                      {showBitrateControls ? (
                                        <ProFeatureLock
                                          title="Audio bitrate"
                                          enabled={canUseBitrate}
                                          onUpgrade={() =>
                                            setShowUpgradePanel(true)
                                          }
                                        >
                                          <div className="grid grid-cols-2 gap-3 md:grid-cols-5">
                                            {[
                                              "64k",
                                              "128k",
                                              "192k",
                                              "256k",
                                              "320k",
                                            ].map((option) => {
                                              const active =
                                                audioBitrate === option;

                                              return (
                                                <button
                                                  key={option}
                                                  type="button"
                                                  disabled={!canUseBitrate}
                                                  onClick={() => {
                                                    if (!canUseBitrate) {
                                                      setShowUpgradePanel(true);
                                                      return;
                                                    }
                                                    setAudioBitrate(option);
                                                  }}
                                                  className={[
                                                    "min-h-[72px] rounded-2xl border px-4 py-3 text-left transition",
                                                    active
                                                      ? "border-fuchsia-400/40 bg-fuchsia-500/15 text-white"
                                                      : "border-white/10 bg-white/5 text-white/70 hover:bg-white/10 hover:text-white",
                                                    !canUseBitrate
                                                      ? "cursor-not-allowed"
                                                      : "",
                                                  ].join(" ")}
                                                >
                                                  <div className="flex items-center justify-between gap-2">
                                                    <span className="text-sm font-semibold">
                                                      {option}
                                                    </span>
                                                    {!canUseBitrate && (
                                                      <span className="text-xs text-white/40">
                                                        🔒
                                                      </span>
                                                    )}
                                                  </div>

                                                  <div className="mt-1 text-[11px] leading-5 text-white/45">
                                                    {option === "64k" &&
                                                      "Smallest size"}
                                                    {option === "128k" &&
                                                      "Balanced"}
                                                    {option === "192k" &&
                                                      "High quality"}
                                                    {option === "256k" &&
                                                      "Very high"}
                                                    {option === "320k" &&
                                                      "Maximum"}
                                                  </div>
                                                </button>
                                              );
                                            })}
                                          </div>
                                        </ProFeatureLock>
                                      ) : null}

                                      {showSampleRateControls && (
                                        <ProFeatureLock
                                          title="Audio sample rate"
                                          enabled={canUseSampleRate}
                                          onUpgrade={() =>
                                            setShowUpgradePanel(true)
                                          }
                                        >
                                          <div className="grid grid-cols-2 gap-3 md:grid-cols-4">
                                            {[
                                              "22050",
                                              "32000",
                                              "44100",
                                              "48000",
                                            ].map((option) => {
                                              const active =
                                                audioSampleRate === option;

                                              return (
                                                <button
                                                  key={option}
                                                  type="button"
                                                  disabled={!canUseSampleRate}
                                                  onClick={() => {
                                                    if (!canUseSampleRate) {
                                                      setShowUpgradePanel(true);
                                                      return;
                                                    }
                                                    setAudioSampleRate(option);
                                                  }}
                                                  className={[
                                                    "min-h-[72px] rounded-2xl border px-4 py-3 text-left transition",
                                                    active
                                                      ? "border-fuchsia-400/40 bg-fuchsia-500/15 text-white"
                                                      : "border-white/10 bg-white/5 text-white/70 hover:bg-white/10 hover:text-white",
                                                    !canUseSampleRate
                                                      ? "cursor-not-allowed"
                                                      : "",
                                                  ].join(" ")}
                                                >
                                                  <div className="flex items-center justify-between gap-2">
                                                    <span className="text-sm font-semibold">
                                                      {option} Hz
                                                    </span>
                                                    {!canUseSampleRate && (
                                                      <span className="text-xs text-white/40">
                                                        🔒
                                                      </span>
                                                    )}
                                                  </div>

                                                  <div className="mt-1 text-[11px] leading-5 text-white/45">
                                                    {option === "22050" &&
                                                      "Small size"}
                                                    {option === "32000" &&
                                                      "Lower bandwidth"}
                                                    {option === "44100" &&
                                                      "CD standard"}
                                                    {option === "48000" &&
                                                      "Video standard"}
                                                  </div>
                                                </button>
                                              );
                                            })}
                                          </div>
                                        </ProFeatureLock>
                                      )}

                                      {showAudioChannelControls && (
                                        <ProFeatureLock
                                          title="Audio channels"
                                          enabled={canUseAudioChannels}
                                          onUpgrade={() =>
                                            setShowUpgradePanel(true)
                                          }
                                        >
                                          <div className="grid grid-cols-2 gap-3">
                                            {AUDIO_CHANNEL_OPTIONS.map(
                                              (option) => {
                                                const active =
                                                  audioChannels === option;

                                                return (
                                                  <button
                                                    key={option}
                                                    type="button"
                                                    disabled={
                                                      !canUseAudioChannels
                                                    }
                                                    onClick={() => {
                                                      if (
                                                        !canUseAudioChannels
                                                      ) {
                                                        setShowUpgradePanel(
                                                          true,
                                                        );
                                                        return;
                                                      }
                                                      setAudioChannels(option);
                                                    }}
                                                    className={[
                                                      "min-h-[72px] rounded-2xl border px-4 py-3 text-left transition",
                                                      active
                                                        ? "border-fuchsia-400/40 bg-fuchsia-500/15 text-white"
                                                        : "border-white/10 bg-white/5 text-white/70 hover:bg-white/10 hover:text-white",
                                                      !canUseAudioChannels
                                                        ? "cursor-not-allowed"
                                                        : "",
                                                    ].join(" ")}
                                                  >
                                                    <div className="flex items-center justify-between gap-2">
                                                      <span className="text-sm font-semibold">
                                                        {option === "1"
                                                          ? "Mono"
                                                          : "Stereo"}
                                                      </span>
                                                      {!canUseAudioChannels && (
                                                        <span className="text-xs text-white/40">
                                                          🔒
                                                        </span>
                                                      )}
                                                    </div>

                                                    <div className="mt-1 text-[11px] leading-5 text-white/45">
                                                      {option === "1"
                                                        ? "Smaller file"
                                                        : "Full left/right channels"}
                                                    </div>
                                                  </button>
                                                );
                                              },
                                            )}
                                          </div>
                                        </ProFeatureLock>
                                      )}

                                      {showVideoResolutionControls && (
                                        <ProFeatureLock
                                          title="Video resolution"
                                          enabled={canUseVideoResolution}
                                          onUpgrade={() =>
                                            setShowUpgradePanel(true)
                                          }
                                        >
                                          <div className="grid grid-cols-2 gap-3 md:grid-cols-3 xl:grid-cols-4">
                                            {VIDEO_RESOLUTION_OPTIONS.map(
                                              (option) => {
                                                const active =
                                                  videoResolution === option;

                                                return (
                                                  <button
                                                    key={option}
                                                    type="button"
                                                    disabled={
                                                      !canUseVideoResolution
                                                    }
                                                    onClick={() => {
                                                      if (
                                                        !canUseVideoResolution
                                                      ) {
                                                        setShowUpgradePanel(
                                                          true,
                                                        );
                                                        return;
                                                      }
                                                      setVideoResolution(
                                                        option,
                                                      );
                                                    }}
                                                    className={[
                                                      "min-h-[72px] rounded-2xl border px-4 py-3 text-left transition",
                                                      active
                                                        ? "border-fuchsia-400/40 bg-fuchsia-500/15 text-white"
                                                        : "border-white/10 bg-white/5 text-white/70 hover:bg-white/10 hover:text-white",
                                                      !canUseVideoResolution
                                                        ? "cursor-not-allowed"
                                                        : "",
                                                    ].join(" ")}
                                                  >
                                                    <div className="flex items-center justify-between gap-2">
                                                      <span className="text-sm font-semibold">
                                                        {option}
                                                      </span>
                                                      {!canUseVideoResolution && (
                                                        <span className="text-xs text-white/40">
                                                          🔒
                                                        </span>
                                                      )}
                                                    </div>

                                                    <div className="mt-1 text-[11px] leading-5 text-white/45">
                                                      {option === "Source"
                                                        ? "Keep current size"
                                                        : "Resize output"}
                                                    </div>
                                                  </button>
                                                );
                                              },
                                            )}
                                          </div>
                                        </ProFeatureLock>
                                      )}

                                      {showVideoQualityControls && (
                                        <ProFeatureLock
                                          title="Video quality"
                                          enabled={canUseVideoQuality}
                                          onUpgrade={() =>
                                            setShowUpgradePanel(true)
                                          }
                                        >
                                          <div className="grid grid-cols-1 gap-3 md:grid-cols-3">
                                            {VIDEO_QUALITY_OPTIONS.map(
                                              (option) => {
                                                const active =
                                                  videoQuality === option;

                                                return (
                                                  <button
                                                    key={option}
                                                    type="button"
                                                    disabled={
                                                      !canUseVideoQuality
                                                    }
                                                    onClick={() => {
                                                      if (!canUseVideoQuality) {
                                                        setShowUpgradePanel(
                                                          true,
                                                        );
                                                        return;
                                                      }
                                                      setVideoQuality(option);
                                                    }}
                                                    className={[
                                                      "min-h-[72px] rounded-2xl border px-4 py-3 text-left transition",
                                                      active
                                                        ? "border-fuchsia-400/40 bg-fuchsia-500/15 text-white"
                                                        : "border-white/10 bg-white/5 text-white/70 hover:bg-white/10 hover:text-white",
                                                      !canUseVideoQuality
                                                        ? "cursor-not-allowed"
                                                        : "",
                                                    ].join(" ")}
                                                  >
                                                    <div className="flex items-center justify-between gap-2">
                                                      <span className="text-sm font-semibold capitalize">
                                                        {option}
                                                      </span>
                                                      {!canUseVideoQuality && (
                                                        <span className="text-xs text-white/40">
                                                          🔒
                                                        </span>
                                                      )}
                                                    </div>

                                                    <div className="mt-1 text-[11px] leading-5 text-white/45">
                                                      {option === "small" &&
                                                        "Smallest file size"}
                                                      {option === "balanced" &&
                                                        "Good size and quality"}
                                                      {option === "high" &&
                                                        "Best visual quality"}
                                                    </div>
                                                  </button>
                                                );
                                              },
                                            )}
                                          </div>
                                        </ProFeatureLock>
                                      )}

                                      {showVideoFpsControls && (
                                        <ProFeatureLock
                                          title="Video FPS"
                                          enabled={canUseVideoFps}
                                          onUpgrade={() =>
                                            setShowUpgradePanel(true)
                                          }
                                        >
                                          <div className="grid grid-cols-3 gap-3">
                                            {["24", "30", "60"].map(
                                              (option) => {
                                                const active =
                                                  videoFps === option;

                                                return (
                                                  <button
                                                    key={option}
                                                    type="button"
                                                    disabled={!canUseVideoFps}
                                                    onClick={() => {
                                                      if (!canUseVideoFps) {
                                                        setShowUpgradePanel(
                                                          true,
                                                        );
                                                        return;
                                                      }
                                                      setVideoFps(option);
                                                    }}
                                                    className={[
                                                      "min-h-[72px] rounded-2xl border px-4 py-3 text-left transition",
                                                      active
                                                        ? "border-fuchsia-400/40 bg-fuchsia-500/15 text-white"
                                                        : "border-white/10 bg-white/5 text-white/70 hover:bg-white/10 hover:text-white",
                                                      !canUseVideoFps
                                                        ? "cursor-not-allowed"
                                                        : "",
                                                    ].join(" ")}
                                                  >
                                                    <div className="flex items-center justify-between gap-2">
                                                      <span className="text-sm font-semibold">
                                                        {option} FPS
                                                      </span>
                                                      {!canUseVideoFps && (
                                                        <span className="text-xs text-white/40">
                                                          🔒
                                                        </span>
                                                      )}
                                                    </div>

                                                    <div className="mt-1 text-[11px] leading-5 text-white/45">
                                                      {option === "24" &&
                                                        "Cinematic"}
                                                      {option === "30" &&
                                                        "Balanced"}
                                                      {option === "60" &&
                                                        "Very smooth"}
                                                    </div>
                                                  </button>
                                                );
                                              },
                                            )}
                                          </div>
                                        </ProFeatureLock>
                                      )}

                                      {showMuteAudioControls && (
                                        <ProFeatureLock
                                          title="Audio in video"
                                          enabled={canUseMuteAudio}
                                          onUpgrade={() =>
                                            setShowUpgradePanel(true)
                                          }
                                        >
                                          <button
                                            type="button"
                                            disabled={!canUseMuteAudio}
                                            onClick={() => {
                                              if (!canUseMuteAudio) {
                                                setShowUpgradePanel(true);
                                                return;
                                              }
                                              setMuteAudio((prev) => !prev);
                                            }}
                                            className={[
                                              "flex min-h-[72px] w-full items-center justify-between rounded-2xl border px-4 py-3 text-left transition",
                                              muteAudio
                                                ? "border-fuchsia-400/40 bg-fuchsia-500/15 text-white"
                                                : "border-white/10 bg-white/5 text-white/70 hover:bg-white/10 hover:text-white",
                                              !canUseMuteAudio
                                                ? "cursor-not-allowed"
                                                : "",
                                            ].join(" ")}
                                          >
                                            <div>
                                              <div className="text-sm font-semibold">
                                                {muteAudio
                                                  ? "Muted export"
                                                  : "Keep audio track"}
                                              </div>
                                              <div className="mt-1 text-[11px] leading-5 text-white/45">
                                                Remove the audio stream when you
                                                only need video.
                                              </div>
                                            </div>
                                            {!canUseMuteAudio && (
                                              <span className="text-xs text-white/40">
                                                🔒
                                              </span>
                                            )}
                                          </button>
                                        </ProFeatureLock>
                                      )}

                                      {showIconControls && (
                                        <ProFeatureLock
                                          title="Icon export"
                                          enabled={canUseIconControls}
                                          onUpgrade={() =>
                                            setShowUpgradePanel(true)
                                          }
                                        >
                                          <div className="space-y-3">
                                            <div>
                                              <span className="mb-2 block text-[11px] font-semibold uppercase tracking-[0.16em] text-white/42">
                                                Icon size
                                              </span>
                                              <div className="grid grid-cols-2 gap-3 md:grid-cols-3">
                                                {ICO_SIZE_OPTIONS.map(
                                                  (option) => {
                                                    const active =
                                                      iconSize === option;

                                                    return (
                                                      <button
                                                        key={option}
                                                        type="button"
                                                        disabled={
                                                          !canUseIconControls
                                                        }
                                                        onClick={() => {
                                                          if (
                                                            !canUseIconControls
                                                          ) {
                                                            setShowUpgradePanel(
                                                              true,
                                                            );
                                                            return;
                                                          }
                                                          setIconSize(option);
                                                        }}
                                                        className={[
                                                          "min-h-[72px] rounded-2xl border px-4 py-3 text-left transition",
                                                          active
                                                            ? "border-fuchsia-400/40 bg-fuchsia-500/15 text-white"
                                                            : "border-white/10 bg-white/5 text-white/70 hover:bg-white/10 hover:text-white",
                                                          !canUseIconControls
                                                            ? "cursor-not-allowed"
                                                            : "",
                                                        ].join(" ")}
                                                      >
                                                        <div className="flex items-center justify-between gap-2">
                                                          <span className="text-sm font-semibold">
                                                            {option} px
                                                          </span>
                                                          {!canUseIconControls && (
                                                            <span className="text-xs text-white/40">
                                                              🔒
                                                            </span>
                                                          )}
                                                        </div>
                                                        <div className="mt-1 text-[11px] leading-5 text-white/45">
                                                          Single embedded icon
                                                          size
                                                        </div>
                                                      </button>
                                                    );
                                                  },
                                                )}
                                              </div>
                                            </div>

                                            <div>
                                              <span className="mb-2 block text-[11px] font-semibold uppercase tracking-[0.16em] text-white/42">
                                                Bit depth
                                              </span>
                                              <div className="grid grid-cols-3 gap-3">
                                                {ICO_BIT_DEPTH_OPTIONS.map(
                                                  (option) => {
                                                    const active =
                                                      iconBitDepth === option;

                                                    return (
                                                      <button
                                                        key={option}
                                                        type="button"
                                                        disabled={
                                                          !canUseIconControls
                                                        }
                                                        onClick={() => {
                                                          if (
                                                            !canUseIconControls
                                                          ) {
                                                            setShowUpgradePanel(
                                                              true,
                                                            );
                                                            return;
                                                          }
                                                          setIconBitDepth(
                                                            option,
                                                          );
                                                        }}
                                                        className={[
                                                          "min-h-[72px] rounded-2xl border px-4 py-3 text-left transition",
                                                          active
                                                            ? "border-fuchsia-400/40 bg-fuchsia-500/15 text-white"
                                                            : "border-white/10 bg-white/5 text-white/70 hover:bg-white/10 hover:text-white",
                                                          !canUseIconControls
                                                            ? "cursor-not-allowed"
                                                            : "",
                                                        ].join(" ")}
                                                      >
                                                        <div className="flex items-center justify-between gap-2">
                                                          <span className="text-sm font-semibold">
                                                            {option}-bit
                                                          </span>
                                                          {!canUseIconControls && (
                                                            <span className="text-xs text-white/40">
                                                              🔒
                                                            </span>
                                                          )}
                                                        </div>
                                                        <div className="mt-1 text-[11px] leading-5 text-white/45">
                                                          {option === "8" &&
                                                            "Palette based"}
                                                          {option === "24" &&
                                                            "Full color"}
                                                          {option === "32" &&
                                                            "Alpha transparency"}
                                                        </div>
                                                      </button>
                                                    );
                                                  },
                                                )}
                                              </div>
                                            </div>
                                          </div>
                                        </ProFeatureLock>
                                      )}

                                      {showImageResizeControls && (
                                        <ProFeatureLock
                                          title="Image resize"
                                          enabled={canUseImageResize}
                                          onUpgrade={() =>
                                            setShowUpgradePanel(true)
                                          }
                                        >
                                          <div className="grid gap-3 md:grid-cols-2">
                                            <label className="block">
                                              <span className="mb-2 block text-[11px] font-semibold uppercase tracking-[0.16em] text-white/42">
                                                Width
                                              </span>
                                              <input
                                                type="number"
                                                min={16}
                                                max={8000}
                                                value={imageWidth}
                                                onChange={(e) => {
                                                  if (!canUseImageResize)
                                                    return;
                                                  setImageWidth(e.target.value);
                                                }}
                                                placeholder="e.g. 1920"
                                                disabled={!canUseImageResize}
                                                onClick={() => {
                                                  if (!canUseImageResize)
                                                    setShowUpgradePanel(true);
                                                }}
                                                className="h-12 w-full rounded-2xl border border-white/10 bg-white/5 px-4 text-sm text-white outline-none transition placeholder:text-white/25 focus:border-fuchsia-400/40 focus:bg-white/[0.07] disabled:cursor-not-allowed"
                                              />
                                            </label>

                                            <label className="block">
                                              <span className="mb-2 block text-[11px] font-semibold uppercase tracking-[0.16em] text-white/42">
                                                Height
                                              </span>
                                              <input
                                                type="number"
                                                min={16}
                                                max={8000}
                                                value={imageHeight}
                                                onChange={(e) => {
                                                  if (!canUseImageResize)
                                                    return;
                                                  setImageHeight(
                                                    e.target.value,
                                                  );
                                                }}
                                                placeholder="e.g. 1080"
                                                disabled={!canUseImageResize}
                                                onClick={() => {
                                                  if (!canUseImageResize)
                                                    setShowUpgradePanel(true);
                                                }}
                                                className="h-12 w-full rounded-2xl border border-white/10 bg-white/5 px-4 text-sm text-white outline-none transition placeholder:text-white/25 focus:border-fuchsia-400/40 focus:bg-white/[0.07] disabled:cursor-not-allowed"
                                              />
                                            </label>
                                          </div>
                                        </ProFeatureLock>
                                      )}

                                      {showImageQualityControls && (
                                        <ProFeatureLock
                                          title="Image quality"
                                          enabled={canUseImageQuality}
                                          onUpgrade={() =>
                                            setShowUpgradePanel(true)
                                          }
                                        >
                                          <div className="rounded-2xl border border-white/10 bg-white/5 p-4">
                                            <div className="mb-3 flex items-center justify-between gap-4">
                                              <span className="text-sm font-medium text-white/75">
                                                Export quality
                                              </span>
                                              <span className="text-sm font-semibold text-white">
                                                {imageQuality}%
                                              </span>
                                            </div>

                                            <input
                                              type="range"
                                              min={40}
                                              max={100}
                                              step={1}
                                              value={imageQuality}
                                              disabled={!canUseImageQuality}
                                              onClick={() => {
                                                if (!canUseImageQuality)
                                                  setShowUpgradePanel(true);
                                              }}
                                              onChange={(e) => {
                                                if (!canUseImageQuality) return;
                                                setImageQuality(
                                                  Number(e.target.value),
                                                );
                                              }}
                                              className="w-full cursor-pointer disabled:cursor-not-allowed"
                                            />
                                          </div>
                                        </ProFeatureLock>
                                      )}
                                    </div>
                                  </div>
                                </div>

                                {file ? (
                                  <div className="mt-6 flex items-center justify-end gap-3">
                                    <button
                                      type="button"
                                      onClick={resetConverter}
                                      className="inline-flex h-11 items-center justify-center rounded-2xl border border-white/10 bg-white/5 px-5 text-sm font-semibold text-white/60 transition hover:bg-white/10 hover:text-white"
                                    >
                                      Reset
                                    </button>

                                    <button
                                      type="button"
                                      onClick={startConvert}
                                      disabled={
                                        !file ||
                                        status === "processing" ||
                                        status === "loading"
                                      }
                                      className="inline-flex h-11 items-center justify-center rounded-2xl bg-white px-6 text-sm font-semibold text-black transition hover:bg-white/90 disabled:cursor-not-allowed disabled:opacity-60"
                                    >
                                      {status === "processing" ||
                                      status === "loading"
                                        ? "Converting..."
                                        : "Convert"}
                                    </button>
                                  </div>
                                ) : null}
                              </div>

                              {status === "processing" ? (
                                <div className="mt-5">
                                  <div className="mb-2 flex items-center justify-between text-xs text-white/55">
                                    <span>{progressLabel}</span>
                                    <span>{displayProgress}%</span>
                                  </div>

                                  <div className="h-2 overflow-hidden rounded-full bg-white/10 ring-1 ring-white/10">
                                    <div
                                      className={cx(
                                        "h-full bg-white/40 transition-[width] duration-200",
                                        displayProgress >= 90
                                          ? "animate-pulse"
                                          : "",
                                      )}
                                      style={{ width: `${displayProgress}%` }}
                                    />
                                  </div>

                                  <p className="mt-2 text-[11px] text-white/45">
                                    Please keep this tab open until the
                                    converted file is ready.
                                  </p>
                                </div>
                              ) : null}

                              {status === "done" && resultUrl && file ? (
                                <div className="mt-6 flex flex-col items-center gap-3">
                                  <a
                                    href={resultUrl}
                                    download={buildOutputName(
                                      file.name,
                                      outputExtMap[target],
                                    )}
                                    className="inline-flex h-11 items-center justify-center rounded-2xl bg-white px-6 text-sm font-semibold text-black transition hover:bg-white/90"
                                  >
                                    Download result
                                  </a>

                                  <div className="text-xs text-white/50">
                                    {buildOutputName(
                                      file.name,
                                      outputExtMap[target],
                                    )}
                                  </div>
                                </div>
                              ) : null}

                              {status === "error" && errorMsg ? (
                                <p className="mt-4 text-sm text-rose-200">
                                  {errorMsg}
                                </p>
                              ) : null}
                            </div>

                            <div className="relative mt-7 rounded-[22px] bg-black/25 p-4 ring-1 ring-white/10">
                              <div className="flex items-center justify-between text-xs text-white/60">
                                <span>Free limit</span>
                                <span>
                                  {file
                                    ? `${(file.size / (1024 * 1024)).toFixed(1)}MB / ${MAX_FREE_MB}MB`
                                    : `0MB / ${MAX_FREE_MB}MB`}
                                </span>
                              </div>

                              <div className="mt-2 h-2 overflow-hidden rounded-full bg-white/10 ring-1 ring-white/10">
                                <div
                                  className={cx(
                                    "h-full transition-[width] duration-300",
                                    file && file.size > MAX_BYTES
                                      ? "bg-rose-400"
                                      : "bg-white/40",
                                  )}
                                  style={{
                                    width: file
                                      ? `${Math.min(100, (file.size / (1024 * 1024) / MAX_FREE_MB) * 100)}%`
                                      : "0%",
                                  }}
                                />
                              </div>

                              <div className="mt-4 grid gap-3 text-xs text-white/60 sm:grid-cols-2">
                                <div className="rounded-2xl bg-white/[0.06] px-4 py-3 ring-1 ring-white/10">
                                  Hybrid conversion flow for better reliability.
                                </div>
                                <div className="rounded-2xl bg-white/[0.06] px-4 py-3 ring-1 ring-white/10">
                                  50MB free limit for the demo.
                                </div>
                                <div className="rounded-2xl bg-white/[0.06] px-4 py-3 ring-1 ring-white/10">
                                  Audio, video, GIF, and image targets
                                  supported.
                                </div>
                                <div className="rounded-2xl bg-white/[0.06] px-4 py-3 ring-1 ring-white/10">
                                  Good for quick everyday conversions.
                                </div>
                              </div>
                            </div>
                          </>
                        )}
                        {/* end single/batch conditional */}
                      </div>
                    </div>
                  </div>
                </div>
              </section>

              {showRouteDetails ? (
                <>
                  <PopularEntrySection
                    input={activeInputLabel}
                    output={activeOutputLabel}
                    mode={effectiveSeoMode}
                    pdfTool={effectivePdfToolTab}
                    pdfImageTarget={pdfToImageTarget}
                    onPdfRouteSelect={handlePdfDiscoverySelect}
                  />

                  <div className="mx-auto mt-4 max-w-[1100px] px-1 text-center text-xs font-medium tracking-[0.08em] text-white/38">
                    Not sure which format fits best? The notes below make the route
                    easier to judge before you convert again.
                  </div>

                  <SeoInfoSection
                    input={activeInputLabel}
                    output={activeOutputLabel}
                    mode={effectiveSeoMode}
                    pdfTool={effectivePdfToolTab}
                    pdfImageTarget={pdfToImageTarget}
                  />
                </>
              ) : null}
            </div>
          </section>

          <aside className="hidden xl:block">
            <AdUnit slot={AD_SLOTS.RIGHT_RAIL} sticky className="w-full" />
          </aside>
        </div>
      </main>

      <PostConvertSuggestionRail
        open={showPostConvertRail}
        input={activeInputLabel}
        output={activeOutputLabel}
        onClose={() => setShowPostConvertRail(false)}
        onReset={resetConverter}
        downloadHref={resultUrl}
        downloadName={successDownloadName}
      />

      <footer className="border-t border-white/10">
        <div
          className={cx(
            "mx-auto flex flex-col gap-4 px-4 py-10 sm:flex-row sm:items-center sm:justify-between sm:px-5 xl:px-6",
            SHELL_MAX,
          )}
        >
          <div className="text-sm text-white/70">
            <span className="font-semibold text-white">Converto</span>{" "}
            <span className="text-white/50">•</span> by NexviaSoft
          </div>

          <div className="flex flex-wrap gap-3 text-sm text-white/60">
            <Link className="transition hover:text-white" href="/">
              Home
            </Link>
            <Link className="transition hover:text-white" href="/formats">
              Formats
            </Link>
            <Link className="transition hover:text-white" href="/privacy">
              Privacy
            </Link>
            <Link className="transition hover:text-white" href="/terms">
              Terms
            </Link>
            <a
              className="transition hover:text-white"
              href="mailto:support@converto.tools"
            >
              Support
            </a>
          </div>

          <div className="text-xs text-white/40">© 2026 NexviaSoft</div>
        </div>
      </footer>

      <UpgradePrompt
        open={showUpgradePanel}
        onClose={() => setShowUpgradePanel(false)}
      />
    </div>
  );
}
