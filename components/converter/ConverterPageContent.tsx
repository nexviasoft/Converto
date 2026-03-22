"use client";

const MAINTENANCE_MODE = false;

import React, { useEffect, useMemo, useRef, useState } from "react";
import Link from "next/link";
import AdSenseScript from "@/components/ads/AdsenseScript";
import FormatOverviewSection from "@/components/converter/sections/FormatOverviewSection";
import UseCasesSection from "@/components/converter/sections/UseCasesSection";
import QualityNotesSection from "@/components/converter/sections/QualityNotesSection";
import RouteSpecificFaqSection from "@/components/converter/sections/RouteSpecificFaqSection";
import { getConverterContent } from "@/lib/converterContent";

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

type ConverterPageContentProps = {
  slug?: string;
  seoTitle?: string;
  seoDescription?: string;
  suggestedInput?: TargetFmt | null;
  suggestedOutput?: TargetFmt | null;
  rawInputLabel?: string;
  rawOutputLabel?: string;
};

type ConvertStatus = "idle" | "ready" | "loading" | "processing" | "done" | "error";

type ConverterFaqItem = {
  q: string;
  a: string;
};

type ConverterPageContentEntry = {
  intro: string;
  whatIsInput: string;
  whatIsOutput: string;
  whyConvert: string;
  useCases: string[];
  qualityNotes: string;
  tips: string[];
  faq: ConverterFaqItem[];
};

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

const ALL_TARGET_OPTIONS: TargetFmt[] = [
  ...AUDIO_TARGETS,
  ...VIDEO_TARGETS,
  ...IMAGE_TARGETS,
];

const homepagePopularConversions = [
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

function getAvailableTargets(inputFmt?: string | null): TargetFmt[] {
  const fmt = normalizeFmtLabel(inputFmt);

  if (isAudioFmt(fmt)) return AUDIO_TARGETS;
  if (isVideoFmt(fmt)) return [...AUDIO_TARGETS, ...VIDEO_TARGETS, ...IMAGE_TARGETS];
  if (isImageFmt(fmt)) return IMAGE_TARGETS;

  return ALL_TARGET_OPTIONS;
}

function formatToSlug(value?: string | null) {
  if (!value) return "";
  const normalized = value.toLowerCase();
  if (normalized === "jpeg") return "jpg";
  return normalized;
}

function buildRelatedConversions(input?: string | null, output?: string | null) {
  const from = normalizeFmtLabel(input);
  const to = normalizeFmtLabel(output);

  if (!from || !to) return [];

  let pool: string[] = [];

  if (isAudioFmt(from)) {
    pool = [...AUDIO_TARGETS];
  } else if (isVideoFmt(from)) {
    pool = [...AUDIO_TARGETS, ...VIDEO_TARGETS, ...IMAGE_TARGETS];
  } else if (isImageFmt(from)) {
    pool = [...IMAGE_TARGETS];
  } else {
    pool = ALL_TARGET_OPTIONS.map((fmt) => fmt);
  }

  return pool
    .filter((fmt) => fmt !== from && fmt !== to)
    .slice(0, 6)
    .map((fmt) => ({
      href: `/convert/${formatToSlug(from)}-to-${formatToSlug(fmt)}`,
      label: `${from} to ${fmt}`,
    }));
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
    browserText:
      "Converto currently uses a hybrid conversion flow: canvas for supported browser-safe image conversions and server-assisted processing for other formats.",
  };
}

function buildWebPageSchema({
  siteUrl,
  title,
  description,
  input,
  output,
}: {
  siteUrl: string;
  title: string;
  description: string;
  input?: string | null;
  output?: string | null;
}) {
  const from = normalizeFmtLabel(input) ?? "FILE";
  const to = normalizeFmtLabel(output) ?? "FILE";
  const slug =
    from && to
      ? `/convert/${formatToSlug(from)}-to-${formatToSlug(to)}`
      : "/converter";

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
      name: `${from} to ${to} conversion`,
    },
    publisher: {
      "@type": "Organization",
      name: "NexviaSoft",
      url: siteUrl,
    },
  };
}

function buildFallbackContent(input?: string | null, output?: string | null): ConverterPageContentEntry {
  const from = normalizeFmtLabel(input) ?? "FILE";
  const to = normalizeFmtLabel(output) ?? "FILE";

  const inputIsAudio = isAudioFmt(from);
  const inputIsVideo = isVideoFmt(from);
  const inputIsImage = isImageFmt(from);

  let whatIsInput = `${from} is a digital file format commonly used in everyday workflows. It can appear in downloads, exports, recorded media, design assets, or shared files depending on the type of content it holds.`;
  let whatIsOutput = `${to} is a widely recognized target format used when users need better compatibility, easier sharing, or a different balance between quality and file size.`;
  let whyConvert = `People convert ${from} to ${to} when they need a file that is easier to open, share, upload, store, or use across different devices and apps.`;
  let qualityNotes = `The final quality of a ${from} to ${to} conversion depends mostly on the original source file and the settings used during conversion. A new file format can improve compatibility and convenience, but it cannot recreate detail that was never present in the original file.`;
  let useCases = [
    `Prepare ${from} files for devices or apps that work better with ${to}.`,
    `Create a more shareable version of a ${from} file for daily use.`,
    `Improve compatibility for upload, playback, storage, or transfer workflows.`,
    `Keep a second copy in ${to} when the original ${from} file is less convenient.`,
    `Use a format that better matches your current workflow or destination platform.`,
  ];
  let tips = [
    `Keep the original ${from} file if you may need it again later.`,
    `${to} may be more practical for everyday use, but source quality still matters.`,
    `Test the converted ${to} file in the app or device you plan to use.`,
    `If editing is important, keep the highest-quality source version available.`,
    `For repeated workflows, use the format that best matches compatibility and storage needs.`,
  ];
  let faq: ConverterFaqItem[] = [
    {
      q: `Why convert ${from} to ${to}?`,
      a: `The most common reason is compatibility. A ${to} file may be easier to use for playback, editing, uploading, sharing, or storage than the original ${from} file.`,
    },
    {
      q: `Will converting ${from} to ${to} improve quality?`,
      a: `Not automatically. Conversion can change the format and make the file more usable, but it does not recreate detail that was missing in the original source.`,
    },
    {
      q: `Should I keep the original ${from} file after converting?`,
      a: `Yes. It is usually smart to keep the source file in case you need the original quality, structure, or workflow later.`,
    },
    {
      q: `Is ${to} better than ${from}?`,
      a: `Not in every situation. The better choice depends on whether you care more about compatibility, size, editing flexibility, transparency, playback support, or archival quality.`,
    },
    {
      q: `Can I use ${from} to ${to} conversion for everyday workflows?`,
      a: `Yes. This type of conversion is commonly used for regular file tasks such as sharing, playback, uploading, storage, and format compatibility.`,
    },
  ];

  if (inputIsVideo && isAudioFmt(to)) {
    whatIsInput = `${from} is a video format that can contain both video and audio streams. It is often used for recordings, downloads, screen captures, and shared media.`;
    whatIsOutput = `${to} is an audio format commonly used when only the sound from a file is needed. It is practical for listening, sharing, portable playback, and smaller audio-only workflows.`;
    whyConvert = `People usually convert ${from} to ${to} to extract the audio from a video file. This is useful for lectures, interviews, music clips, podcasts, and voice-heavy recordings where the video is no longer needed.`;
    qualityNotes = `When converting ${from} to ${to}, the output quality depends on the audio that already exists inside the original video file. Converting to an audio-only format can make the result smaller and easier to use, but it cannot improve poor source sound.`;
    useCases = [
      `Extract audio from ${from} video for listening on phones, laptops, or in the car.`,
      `Keep the soundtrack or spoken content without storing the full video.`,
      `Turn recorded talks, interviews, or lessons into an audio-only copy.`,
      `Create a smaller file when visuals are no longer needed.`,
      `Use the audio separately in playlists, notes, or review workflows.`,
    ];
    tips = [
      `Keep the original ${from} file if you may need the video again later.`,
      `If you plan to edit the sound heavily, another output may be better than a compressed listening format.`,
      `The extracted ${to} file will only be as strong as the source audio track.`,
      `Audio-only exports are often easier to store and share than full videos.`,
      `Choose the target format based on whether you care more about portability or editing quality.`,
    ];
  } else if (inputIsVideo && isVideoFmt(to)) {
    whatIsInput = `${from} is a video format used in recording, playback, editing, download, and archive workflows.`;
    whatIsOutput = `${to} is a video format often chosen for broader compatibility, easier sharing, and smoother playback across common devices and apps.`;
    whyConvert = `People convert ${from} to ${to} when they want a video that is easier to upload, send, store, or play across modern devices and platforms.`;
    qualityNotes = `With video-to-video conversion, quality depends on the source material and conversion settings such as codec, bitrate, and resolution. A new format can improve usability and compatibility, but aggressive compression may reduce visible quality.`;
    useCases = [
      `Prepare ${from} files for more reliable playback on phones, tablets, browsers, or TVs.`,
      `Make a video easier to upload or share with others.`,
      `Create a more practical delivery version from a source file.`,
      `Standardize mixed video files into a more common format.`,
      `Reduce compatibility issues across apps and operating systems.`,
    ];
    tips = [
      `Keep the original ${from} source if it came from a camera or editing workflow.`,
      `Use ${to} when it better matches the platform where the video will be played.`,
      `Conversion can improve compatibility without improving weak source footage.`,
      `Check whether subtitles, tracks, or metadata matter before replacing the original.`,
      `For everyday delivery, widely supported video formats are usually the safer choice.`,
    ];
  } else if (inputIsImage && isImageFmt(to)) {
    whatIsInput = `${from} is an image format used for photos, graphics, screenshots, design assets, or web visuals depending on the file type.`;
    whatIsOutput = `${to} is an image format chosen when users need a different balance of file size, transparency support, compatibility, or editing convenience.`;
    whyConvert = `People convert ${from} to ${to} when they want lighter files, broader compatibility, better support for a specific upload requirement, or a format that fits their editing and publishing workflow more comfortably.`;
    qualityNotes = `For image conversion, the main tradeoffs usually involve size, compression style, and transparency support. Some formats are stronger for photos, others for graphics, and others for modern web delivery.`;
    useCases = [
      `Prepare images for websites, forms, or apps that prefer ${to}.`,
      `Create smaller image files for sharing or uploading.`,
      `Switch to a format that better supports your design or editing workflow.`,
      `Keep a second version optimized for web, storage, or presentation use.`,
      `Make image files easier to reuse across different software tools.`,
    ];
    tips = [
      `Keep the original ${from} image if you may need it for editing later.`,
      `Check whether transparency matters before converting into a format that may not support it.`,
      `Photo formats and graphic formats behave differently, so pick the target with purpose.`,
      `A new image format can improve convenience without improving source detail.`,
      `Use the lightest suitable format for publishing and the strongest source format for editing.`,
    ];
  } else if (inputIsAudio && isAudioFmt(to)) {
    whatIsInput = `${from} is an audio format used for music, speech, recordings, listening copies, or editing sources depending on the workflow.`;
    whatIsOutput = `${to} is an audio format commonly chosen for portability, compatibility, editing, storage efficiency, or playback support.`;
    whyConvert = `People convert ${from} to ${to} when they need audio in a format that better suits their device, software, storage limit, or listening setup.`;
    qualityNotes = `For audio conversion, quality depends on the source file and the way the target format handles compression. Some formats prioritize convenience and smaller size, while others are stronger for editing or preservation.`;
    useCases = [
      `Prepare audio for phones, tablets, laptops, or car playback.`,
      `Create smaller files for easier storage and sharing.`,
      `Use a more compatible format across players and apps.`,
      `Build a listening copy from a larger or less practical source format.`,
      `Adapt audio files for everyday playback or archive workflows.`,
    ];
    tips = [
      `Keep the source ${from} file if it is your best-quality original.`,
      `Choose ${to} based on whether you care more about size, compatibility, or editing flexibility.`,
      `Compressed formats are often convenient, but they do not restore lost detail.`,
      `Use a widely supported target when playback reliability matters most.`,
      `For production work, keep a higher-quality source version as well.`,
    ];
  }

  faq = [
    ...faq,
    {
      q: `Is ${from} to ${to} conversion useful for compatibility?`,
      a: `Yes. One of the main reasons people convert between formats is to make files easier to open, play, upload, edit, or share across different tools and devices.`,
    },
  ];

  return {
    intro: `${from} to ${to} conversion is a practical workflow when you need to change file format for compatibility, sharing, optimization, or easier day-to-day use. Depending on the file type, converting ${from} to ${to} can help with playback, editing, uploading, storage, or portability.`,
    whatIsInput,
    whatIsOutput,
    whyConvert,
    useCases,
    qualityNotes,
    tips,
    faq,
  };
}

function SeoInfoSection({
  input,
  output,
}: {
  input?: string | null;
  output?: string | null;
}) {
  const seo = buildSeoContent(input, output);

  return (
    <section className="mx-auto mt-10 max-w-[1100px]">
      <div className="rounded-[28px] bg-white/10 p-6 ring-1 ring-white/10 shadow-[0_18px_55px_rgba(0,0,0,0.25)]">
        <div className="text-[11px] font-semibold uppercase tracking-[0.18em] text-white/45">
          About this converter
        </div>

        <h2 className="mt-3 text-xl font-semibold tracking-tight text-white">
          {seo.heading}
        </h2>

        <p className="mt-3 max-w-[72ch] text-sm leading-6 text-white/60">
          {seo.intro}
        </p>

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
                <span className="text-sm leading-6 text-white/65">{step}</span>
              </li>
            ))}
          </ol>
        </div>

        <div className="mt-6 grid gap-4 md:grid-cols-3">
          <div className="rounded-2xl bg-white/5 p-4 ring-1 ring-white/10">
            <h3 className="text-sm font-semibold text-white">
              Why convert {normalizeFmtLabel(input) ?? "FILE"} to {normalizeFmtLabel(output) ?? "FILE"}?
            </h3>
            <p className="mt-2 text-sm leading-6 text-white/60">{seo.whyText}</p>
          </div>

          <div className="rounded-2xl bg-white/5 p-4 ring-1 ring-white/10">
            <h3 className="text-sm font-semibold text-white">When to use this converter</h3>
            <p className="mt-2 text-sm leading-6 text-white/60">{seo.useText}</p>
          </div>

          <div className="rounded-2xl bg-white/5 p-4 ring-1 ring-white/10">
            <h3 className="text-sm font-semibold text-white">Current workflow</h3>
            <p className="mt-2 text-sm leading-6 text-white/60">{seo.browserText}</p>
          </div>
        </div>
      </div>
    </section>
  );
}

function RelatedConversionsSection({
  input,
  output,
}: {
  input?: string | null;
  output?: string | null;
}) {
  const normalizedInput = normalizeFmtLabel(input);

  if (!normalizedInput || normalizedInput === "FILE") return null;

  const items = buildRelatedConversions(input, output);

  if (!items.length) return null;

  return (
    <section className="mx-auto mt-6 max-w-[1100px]">
      <div className="rounded-[28px] bg-white/10 p-6 ring-1 ring-white/10 shadow-[0_18px_55px_rgba(0,0,0,0.25)]">
        <div className="text-[11px] font-semibold uppercase tracking-[0.18em] text-white/45">
          Related conversions
        </div>

        <h3 className="mt-3 text-lg font-semibold text-white">
          Explore similar format paths
        </h3>

        <p className="mt-2 max-w-[70ch] text-sm leading-6 text-white/60">
          Browse similar conversions that are commonly used for audio, video, and image workflows.
        </p>

        <div className="mt-5 flex flex-wrap gap-3">
          {items.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className="inline-flex rounded-full bg-white/8 px-4 py-2 text-sm font-medium text-white/80 ring-1 ring-white/10 transition hover:bg-white/12 hover:text-white"
            >
              {item.label}
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}

function PopularEntrySection() {
  return (
    <section className="mx-auto mt-6 max-w-[1100px]">
      <div className="rounded-[28px] bg-white/10 p-6 ring-1 ring-white/10 shadow-[0_18px_55px_rgba(0,0,0,0.25)]">
        <div className="text-[11px] font-semibold uppercase tracking-[0.18em] text-white/45">
          Popular conversions
        </div>

        <h3 className="mt-3 text-lg font-semibold text-white">
          Start with common file conversion routes
        </h3>

        <p className="mt-2 max-w-[70ch] text-sm leading-6 text-white/60">
          These are some of the most common file conversion routes people use for audio, video, and images. Browse them to quickly jump into other useful format changes.
        </p>

        <div className="mt-5 flex flex-wrap gap-3">
          {homepagePopularConversions.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className="inline-flex rounded-full bg-white/8 px-4 py-2 text-sm font-medium text-white/80 ring-1 ring-white/10 transition hover:bg-white/12 hover:text-white"
            >
              {item.label}
            </Link>
          ))}

          <Link
            href="/formats"
            className="inline-flex rounded-full bg-white px-4 py-2 text-sm font-semibold text-black transition hover:bg-white/90"
          >
            Browse format directory
          </Link>
        </div>
      </div>
    </section>
  );
}

export default function ConverterPageContent({
  slug,
  seoTitle,
  seoDescription,
  suggestedInput = null,
  suggestedOutput = null,
  rawInputLabel,
  rawOutputLabel,
}: ConverterPageContentProps) {
  const SHELL_MAX = "max-w-[1700px]";
  const CENTER_MAX = "max-w-[1100px]";
  const GRID = "xl:grid-cols-[260px_minmax(0,1fr)_260px] 2xl:grid-cols-[280px_minmax(0,1fr)_280px]";

  const initialSuggestedInput = toTargetFmt(suggestedInput ?? rawInputLabel ?? null);
  const initialSuggestedOutput = toTargetFmt(suggestedOutput ?? rawOutputLabel ?? null) ?? "MP3";

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

  const [routeInput, setRouteInput] = useState<TargetFmt | null>(initialSuggestedInput);
  const [routeOutput, setRouteOutput] = useState<TargetFmt>(initialSuggestedOutput);

  const MAX_FREE_MB = 50;
  const MAX_BYTES = MAX_FREE_MB * 1024 * 1024;

  const targetWrapRef = useRef<HTMLDivElement | null>(null);
  const targetListRef = useRef<HTMLDivElement | null>(null);

  const mapContent = slug ? getConverterContent(slug) : null;

  const resolvedInputLabel = normalizeFmtLabel(rawInputLabel ?? suggestedInput ?? null);
  const resolvedOutputLabel = normalizeFmtLabel(rawOutputLabel ?? suggestedOutput ?? null);
  const customContent = useMemo<ConverterPageContentEntry | null>(() => {
    if (!slug) return null;
    return mapContent ?? buildFallbackContent(resolvedInputLabel, resolvedOutputLabel);
  }, [slug, mapContent, resolvedInputLabel, resolvedOutputLabel]);

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

        if (prev < 60) return Math.min(actualProgress, prev + Math.max(2, Math.ceil(diff * 0.35)));
        if (prev < 85) return Math.min(actualProgress, prev + Math.max(1, Math.ceil(diff * 0.22)));
        if (prev < 95) return Math.min(actualProgress, prev + 1);

        return Math.min(actualProgress, prev + 1);
      });
    }, 120);

    return () => clearInterval(timer);
  }, [actualProgress, status]);

  const softSyncRoute = (nextInput: TargetFmt | null, nextOutput: TargetFmt | null) => {
    if (!nextOutput) return;

    setRouteInput(nextInput);
    setRouteOutput(nextOutput);

    if (!nextInput) return;

    const nextPath = `/convert/${formatToSlug(nextInput)}-to-${formatToSlug(nextOutput)}`;

    if (typeof window !== "undefined" && window.location.pathname !== nextPath) {
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

    if (typeof window !== "undefined" && initialSuggestedInput) {
      const resetPath = `/convert/${formatToSlug(initialSuggestedInput)}-to-${formatToSlug(initialSuggestedOutput)}`;
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

  const canConvertViaCanvas = (inputFmt: TargetFmt | null, outputFmt: TargetFmt) => {
    return (
      !!inputFmt &&
      inputFmt !== "GIF" &&
      ["PNG", "JPG", "WEBP", "BMP", "AVIF"].includes(inputFmt) &&
      ["PNG", "JPG", "WEBP"].includes(outputFmt)
    );
  };

  const loadImageElement = (src: string) =>
    new Promise<HTMLImageElement>((resolve, reject) => {
      const img = new Image();
      img.onload = () => resolve(img);
      img.onerror = () => reject(new Error("Image preview could not be loaded."));
      img.src = src;
    });

  const canvasToBlob = (canvas: HTMLCanvasElement, type: string, quality?: number) =>
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
        quality
      );
    });

  const convertImageViaCanvas = async (inputFile: File, targetFormat: TargetFmt) => {
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

      const quality = targetFormat === "JPG" || targetFormat === "WEBP" ? 0.92 : undefined;
      const blob = await canvasToBlob(canvas, mimeType, quality);
      return URL.createObjectURL(blob);
    } finally {
      URL.revokeObjectURL(objectUrl);
    }
  };

  const API_URL = process.env.NEXT_PUBLIC_CONVERTO_API_URL?.replace(/\/$/, "") || "";

  const convertViaServer = async (inputFile: File, targetFormat: TargetFmt) => {
    if (!API_URL) throw new Error("Server conversion is not configured.");

    const controller = new AbortController();
    const timeout = setTimeout(() => controller.abort(), 1000 * 60 * 8);

    try {
      const formData = new FormData();
      formData.append("file", inputFile);
      formData.append("target", targetFormat);

      const res = await fetch(`${API_URL}/convert`, {
        method: "POST",
        body: formData,
        signal: controller.signal,
      });

      if (!res.ok) {
        let message = "Server conversion failed.";
        try {
          const data = await res.json();
          if (data?.error) message = data.error;
        } catch {}
        throw new Error(message);
      }

      const blob = await res.blob();
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

  const pickFile = (f: File) => {
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
    setActualProgress(0);
    setDisplayProgress(0);
    setProgressLabel("Preparing file...");

    softSyncRoute(detected, nextTarget);
  };

  const startConvert = async () => {
    if (!file) return;

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

      if (canConvertViaCanvas(fromFmt, target)) convertedUrl = await convertImageViaCanvas(file, target);
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

  useEffect(() => {
    return () => {
      revokeUrl(resultUrl);
      revokeUrl(previewUrl);
    };
  }, [resultUrl, previewUrl]);

  const activeInputForTargets = fromFmt ?? routeInput ?? suggestedInput ?? rawInputLabel;
  const availableTargets = useMemo(() => getAvailableTargets(activeInputForTargets), [activeInputForTargets]);

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

  const sameFormatSelected = !!fromFmt && fromFmt === target;
  const formatFlowText = fromFmt ? `${fromFmt} → ${target}` : `${routeInput ?? "INPUT"} → ${target}`;

  const activeInputLabel = useMemo(
    () => normalizeFmtLabel(fromFmt ?? routeInput ?? suggestedInput ?? rawInputLabel ?? "file"),
    [fromFmt, routeInput, suggestedInput, rawInputLabel]
  );

  const activeOutputLabel = useMemo(
    () => normalizeFmtLabel(target ?? routeOutput ?? suggestedOutput ?? rawOutputLabel ?? "file"),
    [target, routeOutput, suggestedOutput, rawOutputLabel]
  );

  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL?.replace(/\/$/, "") || "https://converto.tools";

  const schemaTitle =
    seoTitle || `${activeInputLabel ?? "FILE"} to ${activeOutputLabel ?? "FILE"} Converter`;

  const schemaDescription =
    seoDescription ||
    `Convert ${activeInputLabel ?? "FILE"} to ${activeOutputLabel ?? "FILE"} online with Converto. Upload your file, choose your target format, and download the converted result in a simple workflow.`;

  const effectiveFaqItems = useMemo(() => {
    if (customContent?.faq?.length) return customContent.faq;

    return [
      {
        q: `How do I convert ${activeInputLabel ?? "FILE"} to ${activeOutputLabel ?? "FILE"}?`,
        a: `Upload your ${activeInputLabel ?? "FILE"} file, choose ${activeOutputLabel ?? "FILE"} as the output format, start the conversion, and download the result when it is ready.`,
      },
      {
        q: `Is ${activeInputLabel ?? "FILE"} to ${activeOutputLabel ?? "FILE"} conversion free?`,
        a: `Yes. Converto currently offers free everyday conversion with a 50MB file limit for the demo workflow.`,
      },
    ];
  }, [customContent, activeInputLabel, activeOutputLabel]);

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
    [effectiveFaqItems]
  );

  const webPageSchema = useMemo(
    () =>
      buildWebPageSchema({
        siteUrl,
        title: schemaTitle,
        description: schemaDescription,
        input: activeInputLabel,
        output: activeOutputLabel,
      }),
    [siteUrl, schemaTitle, schemaDescription, activeInputLabel, activeOutputLabel]
  );

  if (MAINTENANCE_MODE) {
    return (
      <div className="min-h-screen bg-[#151233] text-white selection:bg-white/20">
        <AdSenseScript />
        <div className="flex min-h-screen items-center justify-center">Maintenance</div>
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

      <header className="sticky top-0 z-40 border-b border-white/10 bg-[#05040F]/80 backdrop-blur">
        <div className={cx("mx-auto flex items-center justify-between px-4 py-3 sm:px-5 xl:px-6", SHELL_MAX)}>
          <Link href="/" className="group inline-flex items-center gap-3">
            <img
              src="/brand/converto-logo.svg"
              alt="Converto logo"
              className="h-10 w-10 object-contain drop-shadow-[0_8px_24px_rgba(0,0,0,0.35)]"
            />

            <span className="leading-tight">
              <span className="block text-[15px] font-semibold tracking-tight text-white">
                Converto
              </span>
              <span className="block -mt-0.5 text-[11px] text-white/50">
                by NexviaSoft
              </span>
            </span>
          </Link>

          <div className="flex items-center gap-4">
            <Link href="/formats" className="text-sm text-white/70 transition hover:text-white">
              Formats
            </Link>
            <Link href="/terms" className="text-sm text-white/70 transition hover:text-white">
              Terms
            </Link>
            <Link href="/privacy" className="text-sm text-white/70 transition hover:text-white">
              Privacy
            </Link>
          </div>
        </div>
      </header>

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
                    <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
                      <div>
                        <div className="text-[11px] font-semibold uppercase tracking-[0.18em] text-white/45">
                          Converter
                        </div>
                        <h2 className="mt-2 text-xl font-semibold tracking-tight sm:text-2xl">
                          Upload & convert
                        </h2>
                        <p className="mt-1 text-sm text-white/60">
                          Choose a file, select a format, and send it for conversion.
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
                              Suggested route: {(routeInput ?? suggestedInput ?? "INPUT")} → {routeOutput}
                            </span>
                          ) : null}
                        </div>
                      </div>

                      <span
                        className={cx(
                          "inline-flex items-center gap-2 self-start rounded-full px-3 py-1.5 text-xs font-semibold ring-1",
                          status === "ready" || status === "done"
                            ? "bg-emerald-400/15 text-emerald-200 ring-emerald-300/20"
                            : status === "loading" || status === "processing"
                            ? "bg-white/10 text-white/80 ring-white/10"
                            : "bg-white/8 text-white/70 ring-white/10"
                        )}
                      >
                        <span
                          className={cx(
                            "h-2 w-2 rounded-full",
                            status === "ready" || status === "done"
                              ? "bg-emerald-300"
                              : status === "loading" || status === "processing"
                              ? "bg-white/70"
                              : "bg-white/40"
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
                          : "border-white/20 bg-black/20 hover:bg-white/6"
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
                        <svg width="30" height="30" viewBox="0 0 24 24" fill="none">
                          <path d="M12 16V4" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
                          <path d="M7 9L12 4L17 9" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
                          <path d="M4 20H20" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
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
                              <audio controls src={previewUrl} className="w-full" />
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
                            <span className="font-semibold text-white/75">{fromFmt}</span> files to{" "}
                            <span className="font-semibold text-white/75">{target}</span>. The page keeps your workflow aligned with the selected format route while you continue converting.
                          </>
                        ) : (
                          <>
                            This page starts with a suggested route of{" "}
                            <span className="font-semibold text-white/75">{routeInput ?? "input"}</span>{" "}
                            to{" "}
                            <span className="font-semibold text-white/75">{routeOutput}</span>, and you can still switch to another supported output format at any time.
                          </>
                        )}
                      </p>

                      <div className="mt-6 flex flex-col items-center justify-center gap-3 sm:flex-row sm:flex-wrap">
                        <button
                          type="button"
                          onClick={() => document.getElementById("fileInput")?.click()}
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
                            <span className="text-xs font-medium text-white/60">Convert to</span>
                            <span>{target}</span>
                            <svg
                              width="16"
                              height="16"
                              viewBox="0 0 24 24"
                              fill="none"
                              className={cx("transition", targetOpen ? "rotate-180" : "")}
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
                              <div ref={targetListRef} className="max-h-64 overflow-auto">
                                {availableTargets.map((fmt) => (
                                  <button
                                    key={fmt}
                                    type="button"
                                    onClick={() => {
                                      setTarget(fmt);
                                      setTargetOpen(false);

                                      const nextInputForSoftRoute = fromFmt ?? routeInput ?? null;
                                      if (nextInputForSoftRoute) softSyncRoute(nextInputForSoftRoute, fmt);
                                      else setRouteOutput(fmt);
                                    }}
                                    className={cx(
                                      "flex w-full items-center justify-between px-4 py-3 text-sm transition",
                                      fmt === target
                                        ? "bg-white/10 text-white"
                                        : "text-white/80 hover:bg-white/10"
                                    )}
                                  >
                                    <span className="font-semibold">{fmt}</span>
                                    {fmt === target ? (
                                      <svg width="16" height="16" viewBox="0 0 24 24" fill="none">
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
                                onClick={() => targetListRef.current?.scrollBy({ top: 140, behavior: "smooth" })}
                                className="flex w-full items-center justify-center gap-2 border-t border-white/10 bg-white/5 py-2 text-xs font-semibold text-white/70 transition hover:bg-white/10"
                                aria-label="Scroll options"
                              >
                                <span>Scroll</span>
                                <svg width="14" height="14" viewBox="0 0 24 24" fill="none">
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

                        {file ? (
                          <div className="flex flex-col items-center gap-2">
                            <button
                              type="button"
                              disabled={sameFormatSelected || status === "processing"}
                              onClick={() => {
                                if (sameFormatSelected || status === "processing") return;
                                startConvert();
                              }}
                              className={cx(
                                "h-11 rounded-2xl px-6 text-sm font-semibold transition",
                                sameFormatSelected || status === "processing"
                                  ? "cursor-not-allowed bg-white/15 text-white/70 ring-1 ring-white/10"
                                  : "bg-white text-black hover:bg-white/90"
                              )}
                            >
                              {status === "processing"
                                ? `${progressLabel} ${displayProgress}%`
                                : sameFormatSelected
                                ? "Same format selected"
                                : "Convert"}
                            </button>

                            {sameFormatSelected ? (
                              <p className="text-xs text-amber-200/90">
                                Choose a different output format to start conversion.
                              </p>
                            ) : null}
                          </div>
                        ) : null}

                        {file ? (
                          <button
                            type="button"
                            onClick={resetConverter}
                            className="h-11 rounded-2xl bg-white/10 px-4 text-sm font-semibold text-white ring-1 ring-white/10 transition hover:bg-white/15"
                          >
                            Reset
                          </button>
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
                                displayProgress >= 90 ? "animate-pulse" : ""
                              )}
                              style={{ width: `${displayProgress}%` }}
                            />
                          </div>

                          <p className="mt-2 text-[11px] text-white/45">
                            Please keep this tab open until the converted file is ready.
                          </p>
                        </div>
                      ) : null}

                      {status === "done" && resultUrl && file ? (
                        <div className="mt-6 flex flex-col items-center gap-3">
                          <a
                            href={resultUrl}
                            download={buildOutputName(file.name, outputExtMap[target])}
                            className="inline-flex h-11 items-center justify-center rounded-2xl bg-white px-6 text-sm font-semibold text-black transition hover:bg-white/90"
                          >
                            Download result
                          </a>

                          <div className="text-xs text-white/50">
                            {buildOutputName(file.name, outputExtMap[target])}
                          </div>
                        </div>
                      ) : null}

                      {status === "error" && errorMsg ? (
                        <p className="mt-4 text-sm text-rose-200">{errorMsg}</p>
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
                            file && file.size > MAX_BYTES ? "bg-rose-400" : "bg-white/40"
                          )}
                          style={{
                            width: file
                              ? `${Math.min(100, ((file.size / (1024 * 1024)) / MAX_FREE_MB) * 100)}%`
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
                          Audio, video, GIF, and image targets supported.
                        </div>
                        <div className="rounded-2xl bg-white/[0.06] px-4 py-3 ring-1 ring-white/10">
                          Good for quick everyday conversions.
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </section>

              <section className="mx-auto mt-10 max-w-[1100px]">
                <div className="grid gap-4 md:grid-cols-3">
                  <div className="rounded-[24px] bg-white/10 p-5 ring-1 ring-white/10 shadow-[0_18px_55px_rgba(0,0,0,0.25)]">
                    <div className="text-[11px] font-semibold uppercase tracking-[0.18em] text-white/45">
                      Fast workflow
                    </div>
                    <h3 className="mt-3 text-base font-semibold text-white">
                      Convert in a few clicks
                    </h3>
                    <p className="mt-2 text-sm leading-6 text-white/60">
                      Upload your file, choose the target format, and download the result.
                    </p>
                  </div>

                  <div className="rounded-[24px] bg-white/10 p-5 ring-1 ring-white/10 shadow-[0_18px_55px_rgba(0,0,0,0.25)]">
                    <div className="text-[11px] font-semibold uppercase tracking-[0.18em] text-white/45">
                      Popular formats
                    </div>
                    <h3 className="mt-3 text-base font-semibold text-white">
                      Audio, video, and image essentials
                    </h3>
                    <p className="mt-2 text-sm leading-6 text-white/60">
                      MP3, WAV, AAC, FLAC, AIFF, WMA, AMR, MP4, WEBM, MOV, MKV, AVI, WMV, PNG, JPG, WEBP, BMP, TIFF, ICO, and AVIF.
                    </p>
                  </div>

                  <div className="rounded-[24px] bg-white/10 p-5 ring-1 ring-white/10 shadow-[0_18px_55px_rgba(0,0,0,0.25)]">
                    <div className="text-[11px] font-semibold uppercase tracking-[0.18em] text-white/45">
                      Stable mode
                    </div>
                    <h3 className="mt-3 text-base font-semibold text-white">
                      Better conversion reliability
                    </h3>
                    <p className="mt-2 text-sm leading-6 text-white/60">
                      Images can use canvas in-browser when supported, while other conversions use a server-assisted path.
                    </p>
                  </div>
                </div>
              </section>

              <SeoInfoSection input={activeInputLabel} output={activeOutputLabel} />

              {customContent ? (
                <>
                  <FormatOverviewSection
                    inputLabel={activeInputLabel ?? "FILE"}
                    outputLabel={activeOutputLabel ?? "FILE"}
                    whatIsInput={customContent.whatIsInput}
                    whatIsOutput={customContent.whatIsOutput}
                  />

                  <UseCasesSection
                    inputLabel={activeInputLabel ?? "FILE"}
                    outputLabel={activeOutputLabel ?? "FILE"}
                    whyConvert={customContent.whyConvert}
                    useCases={customContent.useCases}
                  />

                  <QualityNotesSection
                    inputLabel={activeInputLabel ?? "FILE"}
                    outputLabel={activeOutputLabel ?? "FILE"}
                    qualityNotes={customContent.qualityNotes}
                    tips={customContent.tips}
                  />

                  <RouteSpecificFaqSection
                    inputLabel={activeInputLabel ?? "FILE"}
                    outputLabel={activeOutputLabel ?? "FILE"}
                    faq={customContent.faq}
                  />
                </>
              ) : null}

              <PopularEntrySection />
              <RelatedConversionsSection input={activeInputLabel} output={activeOutputLabel} />
            </div>
          </section>

          <aside className="hidden xl:block">
            <AdUnit slot={AD_SLOTS.RIGHT_RAIL} sticky className="w-full" />
          </aside>
        </div>
      </main>

      <footer className="border-t border-white/10">
        <div
          className={cx(
            "mx-auto flex flex-col gap-4 px-4 py-10 sm:flex-row sm:items-center sm:justify-between sm:px-5 xl:px-6",
            SHELL_MAX
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
            <a className="transition hover:text-white" href="mailto:support@converto.tools">
              Support
            </a>
          </div>

          <div className="text-xs text-white/40">© 2026 NexviaSoft</div>
        </div>
      </footer>
    </div>
  );
}