"use client";

import React, { useEffect, useMemo, useRef, useState } from "react";
import Link from "next/link";

type TargetFmt =
  | "MP3"
  | "WAV"
  | "M4A"
  | "AAC"
  | "OGG"
  | "OPUS"
  | "FLAC"
  | "MP4"
  | "WEBM"
  | "MOV"
  | "GIF";

type ConverterPageContentProps = {
  seoTitle?: string;
  seoDescription?: string;
  suggestedInput?: TargetFmt | null;
  suggestedOutput?: TargetFmt | null;
  rawInputLabel?: string;
  rawOutputLabel?: string;
};

type ConvertStatus = "idle" | "ready" | "loading" | "processing" | "done" | "error";

const cx = (...c: Array<string | false | null | undefined>) =>
  c.filter(Boolean).join(" ");

const ALL_TARGET_OPTIONS: TargetFmt[] = [
  "MP3",
  "WAV",
  "M4A",
  "AAC",
  "OGG",
  "OPUS",
  "FLAC",
  "MP4",
  "WEBM",
  "MOV",
  "GIF",
];

function normalizeFmtLabel(value?: string | null): string | null {
  if (!value) return null;
  return value.toString().trim().toUpperCase();
}

function isAudioFmt(fmt: string | null | undefined) {
  return (
    fmt === "MP3" ||
    fmt === "WAV" ||
    fmt === "M4A" ||
    fmt === "AAC" ||
    fmt === "OGG" ||
    fmt === "OPUS" ||
    fmt === "FLAC"
  );
}

function isVideoFmt(fmt: string | null | undefined) {
  return fmt === "MP4" || fmt === "WEBM" || fmt === "MOV";
}

function isImageFmt(fmt: string | null | undefined) {
  return fmt === "GIF";
}

function getAvailableTargets(inputFmt?: string | null): TargetFmt[] {
  const fmt = normalizeFmtLabel(inputFmt);

  if (isAudioFmt(fmt)) {
    return ["MP3", "WAV", "M4A", "AAC", "OGG", "OPUS", "FLAC"];
  }

  if (isVideoFmt(fmt)) {
    return ["MP3", "WAV", "M4A", "AAC", "OGG", "OPUS", "FLAC", "MP4", "WEBM", "MOV", "GIF"];
  }

  if (isImageFmt(fmt)) {
    return ["MP4", "WEBM", "MOV"];
  }

  return ALL_TARGET_OPTIONS;
}

function formatToSlug(value?: string | null) {
  return value ? value.toLowerCase() : "";
}

function buildRelatedConversions(input?: string | null, output?: string | null) {
  const from = normalizeFmtLabel(input);
  const to = normalizeFmtLabel(output);

  if (!from || !to) return [];

  let pool: string[] = [];

  if (isAudioFmt(from)) {
    pool = ["MP3", "WAV", "M4A", "AAC", "OGG", "OPUS", "FLAC"];
  } else if (isVideoFmt(from)) {
    pool = ["MP3", "WAV", "M4A", "AAC", "OGG", "OPUS", "FLAC", "MP4", "WEBM", "MOV", "GIF"];
  } else if (isImageFmt(from)) {
    pool = ["MP4", "WEBM", "MOV"];
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

  let intro = `Convert ${from} to ${to} directly in your browser with Converto. Upload your file, keep the suggested output format, or switch to another format if your workflow changes.`;

  let whyText = `Converting ${from} to ${to} can help with playback compatibility, sharing, compression, editing workflows, or extracting audio from video files.`;

  let useText = `This page is optimized around ${from} to ${to}, but it does not lock your workflow. You can still upload another supported file type and switch the output format inside the converter.`;

  if (inputIsAudio && isAudioFmt(to)) {
    intro = `Convert ${from} to ${to} online with a simple browser-based workflow. This is useful when you need better compatibility, different compression, or a format that works better across devices and apps.`;
    whyText = `${from} to ${to} conversion is often used for playback support, reducing file size, improving compatibility, or preparing files for editing and sharing.`;
  } else if (inputIsVideo && isAudioFmt(to)) {
    intro = `Convert ${from} to ${to} online to extract audio from video files in your browser. This is useful for music clips, voice tracks, podcasts, lectures, and simple audio-only exports.`;
    whyText = `${from} to ${to} conversion is commonly used to extract audio from video, keep only the soundtrack, or create smaller files for listening and sharing.`;
  } else if (inputIsVideo && isVideoFmt(to)) {
    intro = `Convert ${from} to ${to} online for better compatibility, easier sharing, and cleaner playback across browsers, devices, and editing tools.`;
    whyText = `${from} to ${to} conversion is useful when a file needs to be more widely supported, easier to upload, or better suited for editing and playback.`;
  } else if (inputIsImage && isVideoFmt(to)) {
    intro = `Convert ${from} to ${to} online to turn animated image content into a more flexible video format. This can help with sharing, editing, and playback on more platforms.`;
    whyText = `${from} to ${to} conversion can help when you want better control over playback, easier uploads, or broader compatibility than an animated image format provides.`;
  } else if (outputIsImage) {
    whyText = `${from} to ${to} conversion is useful for lightweight motion previews, simple animations, and quick visual sharing.`;
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
    browserText: `Smaller files are best for browser-based conversion. Larger files may be better suited to a future server mode.`,
  };
}

function buildFaqSchema(input?: string | null, output?: string | null) {
  const from = normalizeFmtLabel(input) ?? "FILE";
  const to = normalizeFmtLabel(output) ?? "FILE";

  return {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: [
      {
        "@type": "Question",
        name: `How do I convert ${from} to ${to}?`,
        acceptedAnswer: {
          "@type": "Answer",
          text: `Upload your ${from} file, keep ${to} as the suggested output format or choose another supported target, then start the conversion and download the result when it is ready.`,
        },
      },
      {
        "@type": "Question",
        name: `Can I upload a different file type on the ${from} to ${to} page?`,
        acceptedAnswer: {
          "@type": "Answer",
          text: `Yes. This page suggests ${from} to ${to} conversion, but the converter is not locked to that exact path. If you upload a different supported file type, the route and suggested flow can adapt.`,
        },
      },
      {
        "@type": "Question",
        name: `Is ${from} to ${to} conversion free?`,
        acceptedAnswer: {
          "@type": "Answer",
          text: `Yes. The browser demo is available for free with a 50MB file limit for quick conversions.`,
        },
      },
      {
        "@type": "Question",
        name: `Does ${from} to ${to} conversion happen in the browser?`,
        acceptedAnswer: {
          "@type": "Answer",
          text: `Yes. This demo is designed for browser-based conversion, which works best for smaller files and quick tasks.`,
        },
      },
    ],
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
            <h3 className="text-sm font-semibold text-white">When to use this page</h3>
            <p className="mt-2 text-sm leading-6 text-white/60">{seo.useText}</p>
          </div>

          <div className="rounded-2xl bg-white/5 p-4 ring-1 ring-white/10">
            <h3 className="text-sm font-semibold text-white">Browser-based workflow</h3>
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
          These pages are related to your current conversion route and can help users
          discover other common format combinations.
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

export default function ConverterPageContent({
  seoTitle,
  seoDescription,
  suggestedInput = null,
  suggestedOutput = null,
  rawInputLabel,
  rawOutputLabel,
}: ConverterPageContentProps) {
  const SHELL_MAX = "max-w-[1700px]";

  const [file, setFile] = useState<File | null>(null);
  const [dragOver, setDragOver] = useState(false);
  const [status, setStatus] = useState<ConvertStatus>("idle");
  const [target, setTarget] = useState<TargetFmt>(suggestedOutput ?? "MP3");
  const [targetOpen, setTargetOpen] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [resultUrl, setResultUrl] = useState<string | null>(null);
  const [fromFmt, setFromFmt] = useState<TargetFmt | null>(null);
  const [progress, setProgress] = useState(0);
  const [ffmpegReady, setFfmpegReady] = useState(false);

  const MAX_FREE_MB = 50;
  const MAX_BYTES = MAX_FREE_MB * 1024 * 1024;

  const ffmpegRef = useRef<any>(null);
  const ffmpegLoadingRef = useRef<Promise<void> | null>(null);
  const targetWrapRef = useRef<HTMLDivElement | null>(null);
  const targetListRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    setTarget(suggestedOutput ?? "MP3");
  }, [suggestedOutput]);

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

  const detectFmt = (name: string): TargetFmt | null => {
    const n = name.toLowerCase();

    if (n.endsWith(".mp3")) return "MP3";
    if (n.endsWith(".wav")) return "WAV";
    if (n.endsWith(".m4a")) return "M4A";
    if (n.endsWith(".aac")) return "AAC";
    if (n.endsWith(".ogg")) return "OGG";
    if (n.endsWith(".opus")) return "OPUS";
    if (n.endsWith(".flac")) return "FLAC";
    if (n.endsWith(".webm")) return "WEBM";
    if (n.endsWith(".mov")) return "MOV";
    if (n.endsWith(".gif")) return "GIF";

    if (
      n.endsWith(".mp4") ||
      n.endsWith(".mkv") ||
      n.endsWith(".avi") ||
      n.endsWith(".wmv") ||
      n.endsWith(".flv") ||
      n.endsWith(".mpg") ||
      n.endsWith(".mpeg") ||
      n.endsWith(".m4v") ||
      n.endsWith(".3gp") ||
      n.endsWith(".ts") ||
      n.endsWith(".mts") ||
      n.endsWith(".m2ts")
    ) {
      return "MP4";
    }

    return null;
  };

  const fmtToSlug = (fmt: TargetFmt) => fmt.toLowerCase();

  const syncSeoRoute = (nextInput: TargetFmt | null, nextOutput: TargetFmt | null) => {
    if (!nextInput || !nextOutput) return;

    const nextPath = `/convert/${fmtToSlug(nextInput)}-to-${fmtToSlug(nextOutput)}`;

    if (typeof window !== "undefined" && window.location.pathname !== nextPath) {
      window.history.replaceState(null, "", nextPath);
    }
  };

  const getAcceptForInput = () => {
    return ".mp4,.mov,.mkv,.webm,.avi,.wmv,.flv,.mpg,.mpeg,.m4v,.3gp,.ts,.mts,.m2ts,.mp3,.wav,.m4a,.aac,.ogg,.opus,.flac,.gif,video/*,audio/*,image/gif";
  };

  const validateFile = (f: File) => {
    if (f.size > MAX_BYTES) return `File is too large. Max ${MAX_FREE_MB}MB.`;

    const name = f.name.toLowerCase();
    const okExt = [
      ".mp4",
      ".mov",
      ".mkv",
      ".webm",
      ".avi",
      ".wmv",
      ".flv",
      ".mpg",
      ".mpeg",
      ".m4v",
      ".3gp",
      ".ts",
      ".mts",
      ".m2ts",
      ".mp3",
      ".wav",
      ".m4a",
      ".aac",
      ".ogg",
      ".opus",
      ".flac",
      ".gif",
    ].some((x) => name.endsWith(x));

    if (!okExt) {
      return "Unsupported format selected.";
    }

    return null;
  };

  const revokePreview = () => {
    setPreviewUrl((prev) => {
      if (prev) URL.revokeObjectURL(prev);
      return null;
    });
  };

  const resetConverter = () => {
    if (resultUrl) URL.revokeObjectURL(resultUrl);
    revokePreview();
    setFile(null);
    setFromFmt(null);
    setResultUrl(null);
    setStatus("idle");
    setErrorMsg(null);
    setTarget(suggestedOutput ?? "MP3");
    setProgress(0);
    setTargetOpen(false);
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
    MP4: "mp4",
    WEBM: "webm",
    MOV: "mov",
    GIF: "gif",
  };

  const mimeMap: Record<TargetFmt, string> = {
    MP3: "audio/mpeg",
    WAV: "audio/wav",
    M4A: "audio/mp4",
    AAC: "audio/aac",
    OGG: "audio/ogg",
    OPUS: "audio/ogg",
    FLAC: "audio/flac",
    MP4: "video/mp4",
    WEBM: "video/webm",
    MOV: "video/quicktime",
    GIF: "image/gif",
  };

  const ensureFfmpeg = async () => {
    if (ffmpegReady && ffmpegRef.current) return;
    if (ffmpegLoadingRef.current) return ffmpegLoadingRef.current;

    ffmpegLoadingRef.current = (async () => {
      try {
        setStatus("loading");
        setProgress(0);
        setErrorMsg(null);

        const { FFmpeg } = await import("@ffmpeg/ffmpeg");
        const { toBlobURL } = await import("@ffmpeg/util");

        if (!ffmpegRef.current) ffmpegRef.current = new FFmpeg();
        const ffmpeg = ffmpegRef.current;

        ffmpeg.on("progress", ({ progress }: { progress: number }) => {
          const p = Math.max(0, Math.min(1, progress || 0));
          setProgress(Math.round(p * 100));
        });

        const baseURL = "https://cdn.jsdelivr.net/npm/@ffmpeg/core@0.12.6/dist/umd";
        const coreURL = await toBlobURL(`${baseURL}/ffmpeg-core.js`, "text/javascript");
        const wasmURL = await toBlobURL(`${baseURL}/ffmpeg-core.wasm`, "application/wasm");
        const workerURL = await toBlobURL(`${baseURL}/ffmpeg-core.worker.js`, "text/javascript");

        await ffmpeg.load({ coreURL, wasmURL, workerURL });

        setFfmpegReady(true);
        setStatus(file ? "ready" : "idle");
        setProgress(0);
      } catch (err: any) {
        const msg = err?.message ?? "Engine load failed.";
        setErrorMsg(msg);
        setStatus("error");
        setFfmpegReady(false);
      } finally {
        ffmpegLoadingRef.current = null;
      }
    })();

    return ffmpegLoadingRef.current;
  };

  const pickFile = (f: File) => {
    const err = validateFile(f);

    if (err) {
      setErrorMsg(err);
      setStatus("error");
      setFile(null);
      setFromFmt(null);
      revokePreview();
      if (resultUrl) URL.revokeObjectURL(resultUrl);
      setResultUrl(null);
      return;
    }

    const detected = detectFmt(f.name);

    setFromFmt(detected);
    setFile(f);
    setErrorMsg(null);
    setStatus("ready");

    revokePreview();
    setPreviewUrl(URL.createObjectURL(f));

    if (resultUrl) URL.revokeObjectURL(resultUrl);
    setResultUrl(null);

    const smartDefault = (() => {
      if (suggestedOutput) return suggestedOutput;
      if (!detected) return "MP3" as TargetFmt;
      if (isAudioFmt(detected)) return "MP3" as TargetFmt;
      if (detected === "GIF") return "MP4" as TargetFmt;
      return "MP3" as TargetFmt;
    })();

    const nextTarget = suggestedOutput ?? smartDefault;
    setTarget(nextTarget);

    if (detected) {
      syncSeoRoute(detected, nextTarget);
    }
  };

  const startConvert = async () => {
    if (!file) return;

    try {
      setErrorMsg(null);

      await ensureFfmpeg();

      const ffmpeg = ffmpegRef.current;
      if (!ffmpeg) throw new Error("FFmpeg not initialized.");

      setStatus("processing");
      setProgress(0);
      setTargetOpen(false);

      const inExt = (file.name.split(".").pop() || "mp4").toLowerCase();
      const inName = `input_${Date.now()}.${inExt}`;
      const outName = `output_${Date.now()}.${outputExtMap[target]}`;

      const data = new Uint8Array(await file.arrayBuffer());
      await ffmpeg.writeFile(inName, data);

      if (target === "MP3") {
        await ffmpeg.exec(["-i", inName, "-vn", "-c:a", "libmp3lame", "-q:a", "3", outName]);
      } else if (target === "WAV") {
        await ffmpeg.exec(["-i", inName, "-vn", "-c:a", "pcm_s16le", outName]);
      } else if (target === "M4A" || target === "AAC") {
        await ffmpeg.exec(["-i", inName, "-vn", "-c:a", "aac", "-b:a", "128k", outName]);
      } else if (target === "OGG" || target === "OPUS") {
        await ffmpeg.exec(["-i", inName, "-vn", "-c:a", "libopus", "-b:a", "128k", outName]);
      } else if (target === "FLAC") {
        await ffmpeg.exec(["-i", inName, "-vn", "-c:a", "flac", outName]);
      } else if (target === "MP4") {
        if (isAudioFmt(fromFmt)) {
          await ffmpeg.exec(["-i", inName, "-vn", "-c:a", "aac", "-b:a", "128k", outName]);
        } else {
          await ffmpeg.exec([
            "-i",
            inName,
            "-c:v",
            "libx264",
            "-preset",
            "veryfast",
            "-crf",
            "28",
            "-c:a",
            "aac",
            "-b:a",
            "128k",
            "-movflags",
            "+faststart",
            outName,
          ]);
        }
      } else if (target === "WEBM") {
        if (isAudioFmt(fromFmt)) {
          await ffmpeg.exec(["-i", inName, "-vn", "-c:a", "libopus", "-b:a", "128k", outName]);
        } else {
          await ffmpeg.exec([
            "-i",
            inName,
            "-c:v",
            "libvpx",
            "-crf",
            "30",
            "-b:v",
            "0",
            "-c:a",
            "libopus",
            "-b:a",
            "128k",
            outName,
          ]);
        }
      } else if (target === "MOV") {
        if (isAudioFmt(fromFmt)) {
          await ffmpeg.exec(["-i", inName, "-vn", "-c:a", "aac", "-b:a", "128k", outName]);
        } else {
          await ffmpeg.exec([
            "-i",
            inName,
            "-c:v",
            "libx264",
            "-preset",
            "veryfast",
            "-crf",
            "28",
            "-c:a",
            "aac",
            "-b:a",
            "128k",
            outName,
          ]);
        }
      } else if (target === "GIF") {
        await ffmpeg.exec([
          "-i",
          inName,
          "-vf",
          "fps=10,scale=480:-1:flags=lanczos",
          "-loop",
          "0",
          outName,
        ]);
      }

      const outData = await ffmpeg.readFile(outName);

      try {
        await ffmpeg.deleteFile(inName);
        await ffmpeg.deleteFile(outName);
      } catch {}

      const blob = new Blob([outData], { type: mimeMap[target] });

      if (resultUrl) URL.revokeObjectURL(resultUrl);
      const url = URL.createObjectURL(blob);

      setResultUrl(url);
      setStatus("done");
      setProgress(100);
    } catch (err: any) {
      const msg =
        err?.message ??
        "Conversion failed. This format may not be available in the browser demo.";
      setErrorMsg(msg);
      setStatus("error");
    }
  };

  useEffect(() => {
    return () => {
      if (resultUrl) URL.revokeObjectURL(resultUrl);
      if (previewUrl) URL.revokeObjectURL(previewUrl);
    };
  }, [resultUrl, previewUrl]);

  const sameFormatSelected = !!fromFmt && fromFmt === target;
  const formatFlowText = fromFmt ? `${fromFmt} → ${target}` : null;

  const activeInputLabel = useMemo(
    () => normalizeFmtLabel(fromFmt ?? suggestedInput ?? rawInputLabel ?? "file"),
    [fromFmt, suggestedInput, rawInputLabel]
  );

  const activeOutputLabel = useMemo(
    () => normalizeFmtLabel(target ?? suggestedOutput ?? rawOutputLabel ?? "file"),
    [target, suggestedOutput, rawOutputLabel]
  );

  const availableTargets = useMemo(() => {
    return getAvailableTargets(fromFmt ?? suggestedInput ?? rawInputLabel);
  }, [fromFmt, suggestedInput, rawInputLabel]);

  const siteUrl =
    typeof window !== "undefined"
      ? window.location.origin
      : process.env.NEXT_PUBLIC_SITE_URL || "https://converto.tools";

  const schemaTitle =
    seoTitle || `${activeInputLabel ?? "FILE"} to ${activeOutputLabel ?? "FILE"} Converter`;

  const schemaDescription =
    seoDescription ||
    `Convert ${activeInputLabel ?? "FILE"} to ${activeOutputLabel ?? "FILE"} online with Converto. Upload your file, choose your target format, and download the converted result in a simple browser-based workflow.`;

  const faqSchema = useMemo(
    () => buildFaqSchema(activeInputLabel, activeOutputLabel),
    [activeInputLabel, activeOutputLabel]
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

  return (
    <div className="min-h-screen bg-[#151233] text-white selection:bg-white/20">
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
        <div
          className={cx(
            "mx-auto flex items-center justify-between px-4 py-3 sm:px-5 xl:px-6",
            SHELL_MAX
          )}
        >
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
            Browser demo • runs locally
          </div>

          <h1 className="mt-5 text-3xl font-semibold tracking-tight sm:text-4xl">
            {seoTitle || "Convert files online."}
          </h1>

          <p className="mx-auto mt-3 max-w-[720px] text-sm leading-6 text-white/65 sm:text-[15px]">
            {seoDescription ||
              "Fast, clean, and premium-feeling conversion right in the browser. Great for quick tasks."}
          </p>

          <div className="mt-5 flex flex-wrap items-center justify-center gap-2">
            <span className="rounded-full bg-white/8 px-3 py-2 text-[11px] text-white/72 ring-1 ring-white/10">
              Free: 50MB
            </span>
            <span className="rounded-full bg-white/8 px-3 py-2 text-[11px] text-white/72 ring-1 ring-white/10">
              Browser based
            </span>
            <span className="rounded-full bg-white/8 px-3 py-2 text-[11px] text-white/72 ring-1 ring-white/10">
              Quick conversions
            </span>
          </div>
        </section>

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
                    Choose a file, select a format, and prepare the conversion.
                  </p>

                  {formatFlowText ? (
                    <div className="mt-3 flex flex-wrap items-center gap-2">
                      <span className="inline-flex items-center rounded-full bg-white/10 px-3 py-1.5 text-xs font-semibold text-white ring-1 ring-white/10">
                        {formatFlowText}
                      </span>

                      <span className="inline-flex items-center rounded-full bg-emerald-400/15 px-3 py-1.5 text-xs font-semibold text-emerald-200 ring-1 ring-emerald-300/20">
                        Detected input: {fromFmt}
                      </span>
                    </div>
                  ) : suggestedInput || suggestedOutput ? (
                    <div className="mt-3 flex flex-wrap items-center gap-2">
                      <span className="inline-flex items-center rounded-full bg-white/8 px-3 py-1.5 text-xs font-semibold text-white/75 ring-1 ring-white/10">
                        Suggested: {(suggestedInput ?? "INPUT")} → {target}
                      </span>
                    </div>
                  ) : null}
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
                  {status === "loading"
                    ? "Loading engine"
                    : status === "processing"
                      ? `Converting • ${progress}%`
                      : status === "done"
                        ? "Done"
                        : status === "ready"
                          ? "File ready"
                          : ffmpegReady
                            ? "Engine ready"
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
                    : "Supported: MP4 • MOV • MKV • WEBM • AVI • MP3 • WAV • M4A • AAC • OGG • OPUS • FLAC • GIF"}
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
                    ) : fromFmt === "GIF" ? (
                      <div className="flex justify-center">
                        <img
                          src={previewUrl}
                          alt="GIF preview"
                          className="max-h-[260px] rounded-[18px] object-contain ring-1 ring-white/10"
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

                {(suggestedOutput || fromFmt || target) ? (
                  <p className="mt-6 text-xs leading-6 text-white/55">
                    {fromFmt ? (
                      <>
                        You are converting{" "}
                        <span className="font-semibold text-white/75">{fromFmt}</span> files to{" "}
                        <span className="font-semibold text-white/75">{target}</span>. The route
                        updates automatically when the detected input or selected output changes.
                      </>
                    ) : (
                      <>
                        This page suggests converting{" "}
                        <span className="font-semibold text-white/75">{suggestedInput ?? "input"}</span>{" "}
                        files to{" "}
                        <span className="font-semibold text-white/75">{suggestedOutput ?? target}</span>.
                        You can still upload a different supported file type, and the route will
                        adapt automatically.
                      </>
                    )}
                  </p>
                ) : null}

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

                                const nextInputForRoute = fromFmt ?? suggestedInput;
                                if (nextInputForRoute) {
                                  syncSeoRoute(nextInputForRoute, fmt);
                                }
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
                          onClick={() =>
                            targetListRef.current?.scrollBy({ top: 140, behavior: "smooth" })
                          }
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
                        disabled={sameFormatSelected || status === "loading" || status === "processing"}
                        onClick={() => {
                          if (
                            sameFormatSelected ||
                            status === "loading" ||
                            status === "processing"
                          ) {
                            return;
                          }
                          startConvert();
                        }}
                        className={cx(
                          "h-11 rounded-2xl px-6 text-sm font-semibold transition",
                          sameFormatSelected || status === "loading" || status === "processing"
                            ? "cursor-not-allowed bg-white/15 text-white/70 ring-1 ring-white/10"
                            : "bg-white text-black hover:bg-white/90"
                        )}
                      >
                        {status === "loading"
                          ? "Loading engine…"
                          : status === "processing"
                            ? `Converting… ${progress}%`
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

                {status === "loading" || status === "processing" ? (
                  <div className="mt-5 h-2 overflow-hidden rounded-full bg-white/10 ring-1 ring-white/10">
                    <div
                      className="h-full bg-white/40 transition-[width] duration-200"
                      style={{ width: `${progress}%` }}
                    />
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
                    Browser-based conversion for quick tasks.
                  </div>
                  <div className="rounded-2xl bg-white/[0.06] px-4 py-3 ring-1 ring-white/10">
                    50MB free limit for the demo.
                  </div>
                  <div className="rounded-2xl bg-white/[0.06] px-4 py-3 ring-1 ring-white/10">
                    Multiple popular output formats supported.
                  </div>
                  <div className="rounded-2xl bg-white/[0.06] px-4 py-3 ring-1 ring-white/10">
                    Heavier files can be handled later with server beta.
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
                Audio and video essentials
              </h3>
              <p className="mt-2 text-sm leading-6 text-white/60">
                MP3, AAC, M4A, OPUS, FLAC, MP4, WEBM, MOV, and GIF.
              </p>
            </div>

            <div className="rounded-[24px] bg-white/10 p-5 ring-1 ring-white/10 shadow-[0_18px_55px_rgba(0,0,0,0.25)]">
              <div className="text-[11px] font-semibold uppercase tracking-[0.18em] text-white/45">
                Browser demo
              </div>
              <h3 className="mt-3 text-base font-semibold text-white">
                Great for quick tasks
              </h3>
              <p className="mt-2 text-sm leading-6 text-white/60">
                Smaller files work best in-browser. Larger files can come later with server beta.
              </p>
            </div>
          </div>
        </section>

        <SeoInfoSection input={activeInputLabel} output={activeOutputLabel} />

        <RelatedConversionsSection input={activeInputLabel} output={activeOutputLabel} />
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