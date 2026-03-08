"use client";

import React, { useEffect, useMemo, useRef, useState } from "react";
import Link from "next/link";
import AdSenseScript from "@/components/ads/AdsenseScript";
import Toast from "@/components/landing/Toast";
import Image from "next/image";

const cx = (...c: Array<string | false | null | undefined>) => c.filter(Boolean).join(" ");

/** Ad slots */
const AD_SLOTS = {
  LEFT_RAIL: "3456789012",
  RIGHT_RAIL: "4567890123",
} as const;

const ADS_ENABLED = true;

/* ------------------------------- Ad Unit ------------------------------- */
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

/* ------------------------------ Tiny UI bits ----------------------------- */
const Chip = ({
  children,
  active = false,
  onClick,
}: {
  children: React.ReactNode;
  active?: boolean;
  onClick?: () => void;
}) => (
  <button
    type="button"
    onClick={onClick}
    className={cx(
      "inline-flex items-center gap-2 rounded-full px-3.5 py-2 text-[11px] font-medium ring-1 transition duration-200",
      active
        ? "bg-white text-black ring-white/25 shadow-[0_8px_24px_rgba(255,255,255,0.12)]"
        : "bg-white/[0.08] text-white/72 ring-white/10 hover:bg-white/[0.12] hover:text-white"
    )}
  >
    {children}
  </button>
);

const GlowDivider = () => (
  <div className="my-6 h-px w-full bg-gradient-to-r from-transparent via-white/15 to-transparent" />
);

export default function ConverterPage() {
  const [toastOpen, setToastOpen] = useState(false);
  const [toastTitle, setToastTitle] = useState("Done!");
  const [toastDesc, setToastDesc] = useState<string | undefined>(undefined);

  const showToast = (t: string, d?: string) => {
    setToastTitle(t);
    setToastDesc(d);
    setToastOpen(true);
  };

  type ConvertStatus = "idle" | "ready" | "loading" | "processing" | "done" | "error";
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
  type Preset = "SMALL" | "BALANCED" | "HIGH";
  type Stage = "idle" | "loading_engine" | "analyzing" | "converting" | "packaging";
  type AudioBitrate = "AUTO" | "64k" | "128k" | "192k" | "320k";

  const [preset, setPreset] = useState<Preset>("BALANCED");
  const [stage, setStage] = useState<Stage>("idle");
  const [audioBitrate, setAudioBitrate] = useState<AudioBitrate>("AUTO");

  const [file, setFile] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [dragOver, setDragOver] = useState(false);
  const [status, setStatus] = useState<ConvertStatus>("idle");
  const [progress, setProgress] = useState(0);
  const [target, setTarget] = useState<TargetFmt>("MP3");
  const [resultUrl, setResultUrl] = useState<string | null>(null);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [muteVideo, setMuteVideo] = useState(false);

  const [trimEnabled, setTrimEnabled] = useState(false);
  const [trimStart, setTrimStart] = useState("00:00");
  const [trimEnd, setTrimEnd] = useState("00:05");

  const [fromFmt, setFromFmt] = useState<TargetFmt | null>(null);

  const [targetOpen, setTargetOpen] = useState(false);
  const targetWrapRef = useRef<HTMLDivElement | null>(null);
  const targetListRef = useRef<HTMLDivElement | null>(null);

  const ffmpegRef = useRef<any>(null);
  const [ffmpegReady, setFfmpegReady] = useState(false);
  const ffmpegLoadingRef = useRef<Promise<void> | null>(null);

  const MAX_FREE_MB = 50;
  const MAX_BYTES = MAX_FREE_MB * 1024 * 1024;

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
    )
      return "MP4";
    return null;
  };

  const isAudioFmt = (fmt: TargetFmt | null) =>
    fmt === "MP3" ||
    fmt === "WAV" ||
    fmt === "M4A" ||
    fmt === "AAC" ||
    fmt === "OGG" ||
    fmt === "OPUS" ||
    fmt === "FLAC";

  const isVideoLike = (fmt: TargetFmt | null) =>
    fmt === "MP4" || fmt === "WEBM" || fmt === "MOV" || fmt === "GIF";

  const isCompressedAudioTarget = (fmt: TargetFmt | null) =>
    fmt === "MP3" || fmt === "M4A" || fmt === "AAC" || fmt === "OGG" || fmt === "OPUS";

  const isValidTimeString = (v: string) => /^(\d{1,2}:)?[0-5]?\d:[0-5]\d$/.test(v.trim());

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
      return "Unsupported format. Use MP4/MOV/MKV/WEBM/AVI/WMV/FLV/MPG/MPEG/M4V/3GP/TS/MTS/M2TS or MP3/WAV/M4A/AAC/OGG/OPUS/FLAC/GIF.";
    }

    return null;
  };

  const buildOutputName = (original: string, ext: string) => {
    const base = original.replace(/\.[^/.]+$/, "");
    return `${base}_converto.${ext}`;
  };

  const revokePreview = () => {
    setPreviewUrl((prev) => {
      if (prev) URL.revokeObjectURL(prev);
      return null;
    });
  };

  const buildTrimArgs = () => {
    if (!trimEnabled) return [] as string[];
    if (!trimStart.trim() || !trimEnd.trim()) return [] as string[];
    if (!isValidTimeString(trimStart) || !isValidTimeString(trimEnd)) return [] as string[];
    return ["-ss", trimStart.trim(), "-to", trimEnd.trim()];
  };

  const resolveAudioBitrate = (fallback: string) => {
    return audioBitrate === "AUTO" ? fallback : audioBitrate;
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
      showToast("File rejected", err);
      return;
    }

    const detected = detectFmt(f.name);

    setFromFmt(detected);
    setErrorMsg(null);
    setFile(f);
    setStatus("ready");
    setProgress(0);
    setMuteVideo(false);
    setTrimEnabled(false);
    setTrimStart("00:00");
    setTrimEnd(detected === "GIF" ? "00:03" : "00:05");
    setAudioBitrate("AUTO");

    revokePreview();
    setPreviewUrl(URL.createObjectURL(f));

    if (resultUrl) URL.revokeObjectURL(resultUrl);
    setResultUrl(null);

    const smartDefault = (() => {
      if (!detected) return "MP3" as TargetFmt;
      if (isAudioFmt(detected)) return "MP3" as TargetFmt;
      if (detected === "GIF") return "MP4" as TargetFmt;
      return "MP3" as TargetFmt;
    })();

    setTarget(smartDefault);

    showToast("File selected", `${f.name} • ${(f.size / (1024 * 1024)).toFixed(1)}MB`);
  };

  const resetConverter = () => {
    if (resultUrl) URL.revokeObjectURL(resultUrl);
    revokePreview();
    setFile(null);
    setFromFmt(null);
    setResultUrl(null);
    setStatus("idle");
    setProgress(0);
    setErrorMsg(null);
    setTargetOpen(false);
    setStage("idle");
    setMuteVideo(false);
    setTrimEnabled(false);
    setTrimStart("00:00");
    setTrimEnd("00:05");
    setAudioBitrate("AUTO");
  };

  useEffect(() => {
    return () => {
      if (resultUrl) URL.revokeObjectURL(resultUrl);
      if (previewUrl) URL.revokeObjectURL(previewUrl);
    };
  }, [resultUrl, previewUrl]);

  const ensureFfmpeg = async () => {
    if (ffmpegReady && ffmpegRef.current) return;
    if (ffmpegLoadingRef.current) return ffmpegLoadingRef.current;

    ffmpegLoadingRef.current = (async () => {
      try {
        setStatus("loading");
        setProgress(0);
        setErrorMsg(null);
        setStage("loading_engine");

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
        setStage("idle");
      } catch (err: any) {
        const msg = err?.message ?? "Engine load failed.";
        console.error("FFmpeg load failed:", err);
        setErrorMsg(msg);
        setStatus("error");
        setFfmpegReady(false);
        setStage("idle");
        showToast("Error", msg);
      } finally {
        ffmpegLoadingRef.current = null;
      }
    })();

    return ffmpegLoadingRef.current;
  };

  const availableTargets = useMemo(() => {
    if (!fromFmt) return ["MP3", "AAC", "M4A", "WAV", "OGG", "OPUS", "FLAC", "MP4", "WEBM", "MOV", "GIF"] as TargetFmt[];

    if (isAudioFmt(fromFmt)) {
      return ["MP3", "AAC", "M4A", "WAV", "OGG", "OPUS", "FLAC", "MP4"] as TargetFmt[];
    }

    if (fromFmt === "GIF") {
      return ["GIF", "MP4", "WEBM", "MOV", "MP3"] as TargetFmt[];
    }

    return ["MP3", "AAC", "M4A", "WAV", "OGG", "OPUS", "FLAC", "MP4", "WEBM", "MOV", "GIF"] as TargetFmt[];
  }, [fromFmt]);

  const suggestedTargets = useMemo(() => {
    if (!fromFmt) return ["MP3", "MP4", "GIF"] as TargetFmt[];
    if (isAudioFmt(fromFmt)) return ["MP3", "AAC", "OPUS", "FLAC"] as TargetFmt[];
    if (fromFmt === "GIF") return ["MP4", "WEBM", "GIF"] as TargetFmt[];
    return ["MP3", "MP4", "MOV", "GIF"] as TargetFmt[];
  }, [fromFmt]);

  const startConvert = async () => {
    if (!file) return;

    if (trimEnabled) {
      if (!isValidTimeString(trimStart) || !isValidTimeString(trimEnd)) {
        const msg = "Trim time format is invalid. Use mm:ss or hh:mm:ss.";
        setErrorMsg(msg);
        setStatus("error");
        showToast("Error", msg);
        return;
      }
    }

    const tryExec = async (args: string[]) => {
      const ffmpeg = ffmpegRef.current;
      await ffmpeg.exec(args);
    };

    const tryMany = async (variants: string[][]) => {
      let lastErr: any = null;
      for (const v of variants) {
        try {
          await tryExec(v);
          return true;
        } catch (e) {
          lastErr = e;
        }
      }
      throw lastErr ?? new Error("All ffmpeg variants failed.");
    };

    const videoPresetArgs = () => {
      if (preset === "SMALL") return { crf: "32", encodePreset: "veryfast", ab: "96k" };
      if (preset === "HIGH") return { crf: "22", encodePreset: "fast", ab: "160k" };
      return { crf: "28", encodePreset: "veryfast", ab: "128k" };
    };

    const audioPresetArgs = () => {
      if (preset === "SMALL") return { q: "5", ab: "96k" };
      if (preset === "HIGH") return { q: "2", ab: "192k" };
      return { q: "3", ab: "128k" };
    };

    const gifPresetArgs = () => {
      if (preset === "SMALL") return { fps: 8, width: 320 };
      if (preset === "HIGH") return { fps: 15, width: 640 };
      return { fps: 12, width: 480 };
    };

    const friendlyError = (raw: any) => {
      const msg = String(raw?.message ?? raw ?? "").toLowerCase();
      if (msg.includes("unknown encoder") || msg.includes("encoder") || msg.includes("not found")) {
        return "This format isn’t available in the browser demo build. Try MP4/MP3 or use the server beta.";
      }
      if (msg.includes("memory") || msg.includes("out of bounds") || msg.includes("abort")) {
        return "This file is too heavy for in-browser conversion. Try a smaller file or use the server beta.";
      }
      if (msg.includes("invalid data") || msg.includes("could not find codec parameters") || msg.includes("moov atom not found")) {
        return "File looks corrupted or incomplete. Try re-downloading the original file.";
      }
      if (msg.includes("gif output requires")) {
        return "GIF needs a video input. You selected an audio-only file.";
      }
      return raw?.message ?? "Conversion failed. Please try again.";
    };

    try {
      setTargetOpen(false);
      setErrorMsg(null);

      setStage("analyzing");
      await ensureFfmpeg();

      const ffmpeg = ffmpegRef.current;
      if (!ffmpeg) throw new Error("FFmpeg not initialized.");

      setStatus("processing");
      setProgress(0);
      setStage("converting");

      const trimArgs = buildTrimArgs();

      const inExt = (file.name.split(".").pop() || "mp4").toLowerCase();
      const inName = `input_${Date.now()}.${inExt}`;

      const outExtMap: Record<TargetFmt, string> = {
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

      const outName = `output_${Date.now()}.${outExtMap[target]}`;
      const data = new Uint8Array(await file.arrayBuffer());
      await ffmpeg.writeFile(inName, data);

      if (target === "MP3") {
        const a = audioPresetArgs();
        const bitrate = resolveAudioBitrate(a.ab);
        await tryMany([
          [...trimArgs, "-i", inName, "-map_metadata", "-1", "-vn", "-c:a", "libmp3lame", ...(audioBitrate === "AUTO" ? ["-q:a", a.q] : ["-b:a", bitrate]), outName],
          [...trimArgs, "-i", inName, "-map_metadata", "-1", "-vn", ...(audioBitrate === "AUTO" ? ["-q:a", a.q] : ["-b:a", bitrate]), outName],
          [...trimArgs, "-i", inName, "-map_metadata", "-1", "-vn", outName],
        ]);
      } else if (target === "WAV") {
        await tryMany([
          [...trimArgs, "-i", inName, "-map_metadata", "-1", "-vn", "-c:a", "pcm_s16le", "-ar", "44100", "-ac", "2", outName],
          [...trimArgs, "-i", inName, "-map_metadata", "-1", "-vn", outName],
        ]);
      } else if (target === "M4A") {
        const a = audioPresetArgs();
        const bitrate = resolveAudioBitrate(a.ab);
        await tryMany([
          [...trimArgs, "-i", inName, "-map_metadata", "-1", "-vn", "-c:a", "aac", "-b:a", bitrate, outName],
          [...trimArgs, "-i", inName, "-map_metadata", "-1", "-vn", "-b:a", bitrate, outName],
          [...trimArgs, "-i", inName, "-map_metadata", "-1", "-vn", outName],
        ]);
      } else if (target === "AAC") {
        const a = audioPresetArgs();
        const bitrate = resolveAudioBitrate(a.ab);
        await tryMany([
          [...trimArgs, "-i", inName, "-map_metadata", "-1", "-vn", "-c:a", "aac", "-b:a", bitrate, outName],
          [...trimArgs, "-i", inName, "-map_metadata", "-1", "-vn", "-b:a", bitrate, outName],
          [...trimArgs, "-i", inName, "-map_metadata", "-1", "-vn", outName],
        ]);
      } else if (target === "OGG") {
        const a = audioPresetArgs();
        const bitrate = resolveAudioBitrate(a.ab);
        await tryMany([
          [...trimArgs, "-i", inName, "-map_metadata", "-1", "-vn", "-c:a", "libopus", "-b:a", bitrate, outName],
          [...trimArgs, "-i", inName, "-map_metadata", "-1", "-vn", "-c:a", "libvorbis", "-q:a", preset === "HIGH" ? "6" : preset === "SMALL" ? "4" : "5", outName],
          [...trimArgs, "-i", inName, "-map_metadata", "-1", "-vn", outName],
        ]);
      } else if (target === "OPUS") {
        const a = audioPresetArgs();
        const bitrate = resolveAudioBitrate(a.ab);
        await tryMany([
          [...trimArgs, "-i", inName, "-map_metadata", "-1", "-vn", "-c:a", "libopus", "-b:a", bitrate, outName],
          [...trimArgs, "-i", inName, "-map_metadata", "-1", "-vn", "-b:a", bitrate, outName],
          [...trimArgs, "-i", inName, "-map_metadata", "-1", "-vn", outName],
        ]);
      } else if (target === "FLAC") {
        await tryMany([
          [...trimArgs, "-i", inName, "-map_metadata", "-1", "-vn", "-c:a", "flac", outName],
          [...trimArgs, "-i", inName, "-map_metadata", "-1", "-vn", outName],
        ]);
      } else if (target === "WEBM") {
        const v = videoPresetArgs();

        let copied = false;
        if (fromFmt === "WEBM" && !muteVideo && trimArgs.length === 0) {
          try {
            await tryExec(["-i", inName, "-c", "copy", outName]);
            copied = true;
          } catch {}
        }

        if (!copied) {
          if (isAudioFmt(fromFmt)) {
            const bitrate = resolveAudioBitrate(v.ab);
            await tryMany([
              [...trimArgs, "-i", inName, "-map_metadata", "-1", "-vn", "-c:a", "libopus", "-b:a", bitrate, outName],
              [...trimArgs, "-i", inName, "-map_metadata", "-1", "-vn", "-c:a", "libvorbis", "-q:a", preset === "HIGH" ? "6" : preset === "SMALL" ? "4" : "5", outName],
              [...trimArgs, "-i", inName, "-map_metadata", "-1", "-vn", outName],
            ]);
          } else {
            await tryMany([
              [...trimArgs, "-i", inName, "-map_metadata", "-1", "-c:v", "libvpx", "-crf", v.crf, "-b:v", "0", ...(muteVideo ? ["-an"] : ["-c:a", "libopus", "-b:a", v.ab]), outName],
              [...trimArgs, "-i", inName, "-map_metadata", "-1", "-c:v", "libvpx-vp9", "-crf", String(Number(v.crf) + 2), "-b:v", "0", ...(muteVideo ? ["-an"] : ["-c:a", "libopus", "-b:a", v.ab]), outName],
            ]);
          }
        }
      } else if (target === "GIF") {
        if (isAudioFmt(fromFmt)) throw new Error("GIF output requires a video/image input (audio-only file selected).");

        const g = gifPresetArgs();
        const vf = `fps=${g.fps},scale=${g.width}:-1:flags=lanczos`;
        const palName = `pal_${Date.now()}.png`;

        await tryMany([[...trimArgs, "-i", inName, "-vf", `${vf},palettegen`, palName]]);
        await tryMany([
          [...trimArgs, "-i", inName, "-i", palName, "-lavfi", `${vf}[x];[x][1:v]paletteuse`, "-loop", "0", outName],
          [...trimArgs, "-i", inName, "-vf", vf, "-loop", "0", outName],
        ]);

        try {
          await ffmpeg.deleteFile(palName);
        } catch {}
      } else if (target === "MP4") {
        const v = videoPresetArgs();

        if (isAudioFmt(fromFmt)) {
          const bitrate = resolveAudioBitrate(v.ab);
          await tryMany([
            [...trimArgs, "-i", inName, "-map_metadata", "-1", "-vn", "-c:a", "aac", "-b:a", bitrate, "-movflags", "+faststart", outName],
            [...trimArgs, "-i", inName, "-map_metadata", "-1", "-vn", "-b:a", bitrate, "-movflags", "+faststart", outName],
            [...trimArgs, "-i", inName, "-map_metadata", "-1", "-vn", "-movflags", "+faststart", outName],
          ]);
        } else {
          let copied = false;

          if (fromFmt === "MP4" && !muteVideo && trimArgs.length === 0) {
            try {
              await tryExec(["-i", inName, "-c", "copy", "-movflags", "+faststart", outName]);
              copied = true;
            } catch {}
          }

          if (!copied) {
            await tryMany([
              [
                ...trimArgs,
                "-i",
                inName,
                "-map_metadata",
                "-1",
                "-c:v",
                "libx264",
                "-preset",
                v.encodePreset,
                "-crf",
                v.crf,
                ...(muteVideo ? ["-an"] : ["-c:a", "aac", "-b:a", v.ab]),
                "-movflags",
                "+faststart",
                outName,
              ],
              [...trimArgs, "-i", inName, "-movflags", "+faststart", outName],
            ]);
          }
        }
      } else if (target === "MOV") {
        const v = videoPresetArgs();

        if (isAudioFmt(fromFmt)) {
          const bitrate = resolveAudioBitrate(v.ab);
          await tryMany([
            [...trimArgs, "-i", inName, "-map_metadata", "-1", "-vn", "-c:a", "aac", "-b:a", bitrate, outName],
            [...trimArgs, "-i", inName, "-map_metadata", "-1", "-vn", "-b:a", bitrate, outName],
            [...trimArgs, "-i", inName, "-map_metadata", "-1", "-vn", outName],
          ]);
        } else {
          let copied = false;

          if (fromFmt === "MOV" && !muteVideo && trimArgs.length === 0) {
            try {
              await tryExec(["-i", inName, "-c", "copy", outName]);
              copied = true;
            } catch {}
          }

          if (!copied) {
            await tryMany([
              [
                ...trimArgs,
                "-i",
                inName,
                "-map_metadata",
                "-1",
                "-c:v",
                "libx264",
                "-preset",
                v.encodePreset,
                "-crf",
                v.crf,
                ...(muteVideo ? ["-an"] : ["-c:a", "aac", "-b:a", v.ab]),
                outName,
              ],
              [...trimArgs, "-i", inName, outName],
            ]);
          }
        }
      }

      setStage("packaging");
      const outData = await ffmpeg.readFile(outName);

      try {
        await ffmpeg.deleteFile(inName);
        await ffmpeg.deleteFile(outName);
      } catch {}

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

      const blob = new Blob([outData], { type: mimeMap[target] });
      if (resultUrl) URL.revokeObjectURL(resultUrl);
      const url = URL.createObjectURL(blob);

      setResultUrl(url);
      setStatus("done");
      setProgress(100);
      setStage("idle");
      showToast("Converted", `${target} is ready to download.`);
    } catch (err: any) {
      const msg = friendlyError(err);
      setErrorMsg(msg);
      setStatus("error");
      setStage("idle");
      showToast("Error", msg);
    }
  };

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

  const SHELL_MAX = "max-w-[1700px]";
  const CENTER_MAX = "max-w-[860px]";
  const GRID = "xl:grid-cols-[260px_minmax(0,1fr)_260px] 2xl:grid-cols-[280px_minmax(0,1fr)_280px]";

  const bitrateMeta =
    isCompressedAudioTarget(target) || (isAudioFmt(fromFmt) && target === "MP4")
      ? ` • bitrate ${audioBitrate === "AUTO" ? "auto" : audioBitrate}`
      : "";

  const selectedMeta = file
    ? `${(file.size / (1024 * 1024)).toFixed(1)}MB • ${fromFmt ?? "Unknown"} → ${target}${muteVideo && isVideoLike(fromFmt) && target !== "GIF" ? " • muted" : ""}${trimEnabled ? ` • trim ${trimStart}-${trimEnd}` : ""}${bitrateMeta}`
    : "Supported: MP4 • MOV • MKV • WEBM • AVI • MP3 • WAV • M4A • AAC • OGG • OPUS • FLAC • GIF";

  return (
    <div className="min-h-screen bg-[#0B0A16] text-white selection:bg-white/20">
      <AdSenseScript />

      <div className="pointer-events-none fixed inset-0 -z-10">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,rgba(168,85,247,0.23),transparent_56%),radial-gradient(ellipse_at_bottom,rgba(59,130,246,0.18),transparent_52%),radial-gradient(ellipse_at_center,rgba(255,255,255,0.06),transparent_45%)]" />
        <div className="absolute inset-0 opacity-20 [background:linear-gradient(to_right,rgba(255,255,255,0.04)_1px,transparent_1px),linear-gradient(to_bottom,rgba(255,255,255,0.04)_1px,transparent_1px)] [background-size:84px_84px]" />
        <div className="absolute inset-0 opacity-[0.06] [background-image:url('data:image/svg+xml,%3Csvg xmlns=%22http://www.w3.org/2000/svg%22 width=%22120%22 height=%22120%22%3E%3Cfilter id=%22n%22%3E%3CfeTurbulence type=%22fractalNoise%22 baseFrequency=%220.9%22 numOctaves=%222%22 stitchTiles=%22stitch%22/%3E%3C/filter%3E%3Crect width=%22120%22 height=%22120%22 filter=%22url(%23n)%22 opacity=%220.35%22/%3E%3C/svg%3E')]" />
      </div>

      <header className="sticky top-0 z-40 border-b border-white/10 bg-[#05040F]/80 backdrop-blur">
        <div className={cx("mx-auto flex items-center justify-between px-4 py-3 sm:px-5 xl:px-6", SHELL_MAX)}>
          <Link href="/" className="group inline-flex items-center gap-3">
            <Image
              src="/logo.ico"
              alt="Converto logo"
              width={40}
              height={40}
              className="h-10 w-10 object-contain"
            />

            <span className="leading-tight">
              <span className="block text-[15px] font-semibold tracking-tight text-white">Converto</span>
              <span className="block -mt-0.5 text-[11px] text-white/50">by NexviaSoft</span>
            </span>
          </Link>

          <div className="hidden items-center gap-2 text-sm font-semibold text-white/80 sm:flex">
            <span className="rounded-full bg-white/8 px-3 py-1 ring-1 ring-white/10">Online Converter</span>
          </div>

          <div className="flex items-center gap-3">
            <Link href="/terms" className="hidden text-sm text-white/70 transition hover:text-white sm:inline-flex">
              Terms
            </Link>
            <Link href="/privacy" className="text-sm text-white/70 transition hover:text-white">
              Privacy
            </Link>
          </div>
        </div>
      </header>

      <main className={cx("mx-auto px-4 py-8 sm:px-5 lg:px-6", SHELL_MAX)}>
        <section className="mx-auto mb-8 text-center">
          <div className="inline-flex items-center gap-2 rounded-full bg-white/8 px-3 py-1 text-[11px] text-white/70 ring-1 ring-white/10">
            <span className="h-1.5 w-1.5 rounded-full bg-emerald-300" />
            Browser demo • runs locally
          </div>

          <h1 className="mt-5 text-3xl font-semibold tracking-tight sm:text-4xl">Convert files online.</h1>
          <p className="mx-auto mt-3 max-w-[720px] text-sm leading-6 text-white/65 sm:text-[15px]">
            Fast, clean, and premium-feeling conversion right in the browser. Great for quick tasks. Heavy files may still need the upcoming server beta.
          </p>

          <div className="mt-5 flex flex-wrap items-center justify-center gap-2">
            <Chip>Free: {MAX_FREE_MB}MB</Chip>
            <Chip>AAC + OPUS + MOV added</Chip>
            <Chip>Audio bitrate added</Chip>
            <Chip>{ffmpegReady ? "Engine ready" : "Engine loads on demand"}</Chip>
          </div>
        </section>

        <div className={cx("grid items-start gap-6 xl:gap-8", GRID)}>
          <aside className="hidden xl:block">
            <AdUnit slot={AD_SLOTS.LEFT_RAIL} sticky className="w-full" />
          </aside>

          <section className="min-w-0">
            <div className={cx("mx-auto w-full", CENTER_MAX)}>
              <div className="relative overflow-hidden rounded-[30px] bg-white/8 ring-1 ring-white/10 shadow-[0_35px_95px_rgba(0,0,0,0.45)]">
                <div className="pointer-events-none absolute inset-0 bg-gradient-to-br from-violet-500/16 via-fuchsia-500/8 to-sky-500/16" />
                <div className="relative p-5 sm:p-6 md:p-7">
                  <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
                    <div>
                      <div className="text-[11px] font-semibold uppercase tracking-[0.18em] text-white/45">Converter</div>
                      <h2 className="mt-2 text-xl font-semibold tracking-tight sm:text-2xl">Upload & convert</h2>
                      <p className="mt-1 text-sm text-white/60">Choose a file, select a format, and download the result.</p>
                    </div>

                    <span
                      className={cx(
                        "inline-flex items-center gap-2 self-start rounded-full px-3 py-1.5 text-xs font-semibold ring-1",
                        status === "processing" || status === "loading"
                          ? "bg-white/10 text-white/80 ring-white/10"
                          : ffmpegReady
                          ? "bg-emerald-400/15 text-emerald-200 ring-emerald-300/20"
                          : "bg-white/8 text-white/70 ring-white/10"
                      )}
                    >
                      <span className={cx("h-2 w-2 rounded-full", ffmpegReady ? "bg-emerald-300" : "bg-white/40")} />
                      {status === "loading"
                        ? "Loading engine"
                        : status === "processing"
                        ? `Working • ${progress}%`
                        : ffmpegReady
                        ? "Ready"
                        : "On demand"}
                    </span>
                  </div>

                  <GlowDivider />

                  <div
                    className={cx(
                      "relative rounded-[26px] border border-dashed p-7 text-center transition sm:p-9",
                      dragOver ? "border-white/45 bg-white/6" : "border-white/20 bg-black/20 hover:bg-white/6"
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
                      accept=".mp4,.mov,.mkv,.webm,.avi,.wmv,.flv,.mpg,.mpeg,.m4v,.3gp,.ts,.mts,.m2ts,.mp3,.wav,.m4a,.aac,.ogg,.opus,.flac,.gif,video/*,audio/*,image/gif"
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
                      <span className="mx-auto block max-w-[56ch] truncate">{file ? file.name : "Drop a file here"}</span>
                    </p>

                    <p className="mt-2 text-sm text-white/60">{selectedMeta}</p>

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

                    {file ? (
                      <div className="mt-6">
                        <div className="mb-2 text-[11px] font-semibold uppercase tracking-[0.18em] text-white/45">Suggested formats</div>
                        <div className="flex flex-wrap items-center justify-center gap-2">
                          {suggestedTargets
                            .filter((x) => availableTargets.includes(x))
                            .map((fmt) => (
                              <Chip
                                key={fmt}
                                active={target === fmt}
                                onClick={() => {
                                  setTarget(fmt);
                                  showToast("Output updated", `Target: ${fmt}`);
                                }}
                              >
                                {fmt}
                              </Chip>
                            ))}
                        </div>
                      </div>
                    ) : null}

                    {file && !isAudioFmt(fromFmt) ? (
                      <div className="mt-6">
                        <div className="mb-2 text-[11px] font-semibold uppercase tracking-[0.18em] text-white/45">Quick actions</div>
                        <div className="flex flex-wrap items-center justify-center gap-2">
                          <Chip
                            active={target === "MP3" && !muteVideo}
                            onClick={() => {
                              setTarget("MP3");
                              setMuteVideo(false);
                              showToast("Quick action", "Extract audio → MP3");
                            }}
                          >
                            Extract audio
                          </Chip>

                          <Chip
                            active={target === "GIF"}
                            onClick={() => {
                              setTarget("GIF");
                              setPreset("BALANCED");
                              setMuteVideo(false);
                              setTrimEnabled(true);
                              setTrimStart("00:00");
                              setTrimEnd("00:03");
                              showToast("Quick action", "Convert to GIF");
                            }}
                          >
                            Make GIF
                          </Chip>

                          <Chip
                            active={target === "MP4" && preset === "SMALL" && !muteVideo}
                            onClick={() => {
                              setTarget("MP4");
                              setPreset("SMALL");
                              setMuteVideo(false);
                              showToast("Quick action", "Compress video → MP4 Small");
                            }}
                          >
                            Compress video
                          </Chip>

                          {fromFmt !== "GIF" ? (
                            <Chip
                              active={muteVideo}
                              onClick={() => {
                                setTarget("MP4");
                                setMuteVideo((v) => !v);
                                showToast("Quick action", !muteVideo ? "Muted video enabled" : "Muted video disabled");
                              }}
                            >
                              Mute video
                            </Chip>
                          ) : null}
                        </div>
                      </div>
                    ) : null}

                    {file && !isAudioFmt(fromFmt) ? (
                      <div className="mt-6 rounded-[22px] bg-black/25 p-4 ring-1 ring-white/10">
                        <div className="mb-3 flex items-center justify-between gap-3">
                          <div className="text-[11px] font-semibold uppercase tracking-[0.18em] text-white/45">Trim</div>

                          <button
                            type="button"
                            onClick={() => setTrimEnabled((v) => !v)}
                            className={cx(
                              "rounded-full px-3 py-1 text-xs font-semibold ring-1 transition",
                              trimEnabled
                                ? "bg-white text-black ring-white/20"
                                : "bg-white/10 text-white/75 ring-white/10 hover:bg-white/15"
                            )}
                          >
                            {trimEnabled ? "Trim enabled" : "Enable trim"}
                          </button>
                        </div>

                        <div className="grid gap-3 sm:grid-cols-2">
                          <label className="block text-left">
                            <div className="mb-2 text-xs text-white/60">Start</div>
                            <input
                              value={trimStart}
                              onChange={(e) => setTrimStart(e.target.value)}
                              placeholder="00:00"
                              className="h-11 w-full rounded-2xl bg-white/10 px-4 text-sm text-white outline-none ring-1 ring-white/10 placeholder:text-white/30"
                            />
                          </label>

                          <label className="block text-left">
                            <div className="mb-2 text-xs text-white/60">End</div>
                            <input
                              value={trimEnd}
                              onChange={(e) => setTrimEnd(e.target.value)}
                              placeholder="00:05"
                              className="h-11 w-full rounded-2xl bg-white/10 px-4 text-sm text-white outline-none ring-1 ring-white/10 placeholder:text-white/30"
                            />
                          </label>
                        </div>

                        <p className="mt-3 text-left text-xs text-white/55">
                          Format: <span className="font-semibold text-white/70">mm:ss</span> or <span className="font-semibold text-white/70">hh:mm:ss</span>. Example: 00:03 → 00:08
                        </p>
                      </div>
                    ) : null}

                    {file && isCompressedAudioTarget(target) ? (
                      <div className="mt-6">
                        <div className="mb-2 text-[11px] font-semibold uppercase tracking-[0.18em] text-white/45">Audio bitrate</div>
                        <div className="flex flex-wrap items-center justify-center gap-2">
                          {(["AUTO", "64k", "128k", "192k", "320k"] as const).map((b) => (
                            <Chip
                              key={b}
                              active={audioBitrate === b}
                              onClick={() => {
                                setAudioBitrate(b);
                                showToast("Bitrate updated", b === "AUTO" ? "Automatic bitrate selected" : `Bitrate: ${b}`);
                              }}
                            >
                              {b === "AUTO" ? "Auto" : b}
                            </Chip>
                          ))}
                        </div>
                      </div>
                    ) : null}

                    {file ? (
                      <div className="mt-6">
                        <div className="mb-2 text-[11px] font-semibold uppercase tracking-[0.18em] text-white/45">Quality preset</div>
                        <div className="flex flex-wrap items-center justify-center gap-2 text-xs">
                          {([
                            { k: "SMALL", label: "Small file", desc: "Faster sharing" },
                            { k: "BALANCED", label: "Balanced", desc: "Recommended" },
                            { k: "HIGH", label: "Best quality", desc: "Bigger output" },
                          ] as const).map((p) => (
                            <button
                              key={p.k}
                              type="button"
                              onClick={() => {
                                setPreset(p.k);
                                showToast("Preset updated", `${p.label} • ${p.desc}`);
                              }}
                              className={cx(
                                "h-10 rounded-2xl px-4 font-semibold ring-1 transition",
                                preset === p.k
                                  ? "bg-white text-black ring-white/20"
                                  : "bg-white/10 text-white/80 ring-white/10 hover:bg-white/15"
                              )}
                            >
                              {p.label}
                              <span className="ml-2 text-[10px] font-semibold opacity-70">{p.desc}</span>
                            </button>
                          ))}
                        </div>
                      </div>
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
                          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" className={cx("transition", targetOpen ? "rotate-180" : "")}>
                            <path d="M6 9l6 6 6-6" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                          </svg>
                        </button>

                        {targetOpen ? (
                          <div
                            role="listbox"
                            className="absolute left-1/2 z-20 mt-2 w-52 -translate-x-1/2 overflow-hidden rounded-2xl bg-[#0D0B18]/95 backdrop-blur ring-1 ring-white/15 shadow-[0_20px_60px_rgba(0,0,0,0.55)]"
                          >
                            <div ref={targetListRef} className="max-h-64 overflow-auto">
                              {availableTargets.map((v) => (
                                <button
                                  key={v}
                                  type="button"
                                  onClick={() => {
                                    setTarget(v);
                                    setTargetOpen(false);
                                    showToast("Output updated", `Target: ${v}`);
                                  }}
                                  className={cx(
                                    "flex w-full items-center justify-between px-4 py-3 text-sm transition",
                                    v === target ? "bg-white/10 text-white" : "text-white/80 hover:bg-white/10"
                                  )}
                                >
                                  <span className="font-semibold">{v}</span>
                                  {v === target ? (
                                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none">
                                      <path d="M20 6L9 17l-5-5" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
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
                                <path d="M6 9l6 6 6-6" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                              </svg>
                            </button>
                          </div>
                        ) : null}
                      </div>

                      {file ? (
                        <button
                          type="button"
                          onClick={() => {
                            if (status === "processing" || status === "loading") return;
                            startConvert();
                          }}
                          className={cx(
                            "h-11 rounded-2xl px-6 text-sm font-semibold transition",
                            status === "processing" || status === "loading"
                              ? "cursor-not-allowed bg-white/15 text-white/70 ring-1 ring-white/10"
                              : "bg-white text-black hover:bg-white/90"
                          )}
                        >
                          {status === "loading"
                            ? "Loading engine…"
                            : status === "processing"
                            ? stage === "analyzing"
                              ? "Analyzing…"
                              : stage === "packaging"
                              ? "Packaging…"
                              : `Converting… ${progress}%`
                            : "Convert"}
                        </button>
                      ) : null}

                      {file ? (
                        <button
                          type="button"
                          onClick={() => {
                            resetConverter();
                            showToast("Reset", "Ready for another file.");
                          }}
                          className="h-11 rounded-2xl bg-white/10 px-4 text-sm font-semibold text-white ring-1 ring-white/10 transition hover:bg-white/15"
                        >
                          Reset
                        </button>
                      ) : null}
                    </div>

                    {status === "loading" || status === "processing" ? (
                      <div className="mt-5 h-2 overflow-hidden rounded-full bg-white/10 ring-1 ring-white/10">
                        <div className="h-full bg-white/40 transition-[width] duration-200" style={{ width: `${progress}%` }} />
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
                        <div className="text-xs text-white/50">{buildOutputName(file.name, outputExtMap[target])}</div>
                        <button
                          type="button"
                          onClick={() => {
                            resetConverter();
                            showToast("Ready", "Pick another file.");
                          }}
                          className="text-xs text-white/60 transition hover:text-white"
                        >
                          Convert another file
                        </button>
                      </div>
                    ) : null}

                    {status === "error" && errorMsg ? <p className="mt-4 text-sm text-rose-200">{errorMsg}</p> : null}

                    <div className="relative mt-7 rounded-[22px] bg-black/25 p-4 ring-1 ring-white/10">
                      <div className="flex items-center justify-between text-xs text-white/60">
                        <span>Free limit</span>
                        <span>{file ? `${(file.size / (1024 * 1024)).toFixed(1)}MB / ${MAX_FREE_MB}MB` : `0MB / ${MAX_FREE_MB}MB`}</span>
                      </div>

                      <div className="mt-2 h-2 overflow-hidden rounded-full bg-white/10 ring-1 ring-white/10">
                        <div
                          className={cx("h-full transition-[width] duration-300", file && file.size > MAX_BYTES ? "bg-rose-400" : "bg-white/40")}
                          style={{
                            width: file ? `${Math.min(100, ((file.size / (1024 * 1024)) / MAX_FREE_MB) * 100)}%` : "0%",
                          }}
                        />
                      </div>

                      <div className="mt-4 grid gap-3 text-xs text-white/60 sm:grid-cols-2">
                        <div className="rounded-2xl bg-white/[0.06] px-4 py-3 ring-1 ring-white/10 transition hover:bg-white/[0.08]">
                          GIF preset now changes both FPS and scale.
                        </div>
                        <div className="rounded-2xl bg-white/[0.06] px-4 py-3 ring-1 ring-white/10 transition hover:bg-white/[0.08]">
                          Same-format conversions can still be useful for compression.
                        </div>
                        <div className="rounded-2xl bg-white/[0.06] px-4 py-3 ring-1 ring-white/10 transition hover:bg-white/[0.08]">
                          Audio metadata is stripped for cleaner output where possible.
                        </div>
                        <div className="rounded-2xl bg-white/[0.06] px-4 py-3 ring-1 ring-white/10 transition hover:bg-white/[0.08]">
                          Heavy files may fail in-browser and work better with server beta later.
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </section>

          <aside className="hidden xl:block">
            <AdUnit slot={AD_SLOTS.RIGHT_RAIL} sticky className="w-full" />
          </aside>
        </div>

        <section className="mx-auto mt-10 max-w-[1100px]">
          <div className="grid gap-4 md:grid-cols-3">
            <div className="rounded-[24px] bg-white/8 p-5 ring-1 ring-white/10 shadow-[0_18px_55px_rgba(0,0,0,0.25)]">
              <div className="text-[11px] font-semibold uppercase tracking-[0.18em] text-white/45">
                Fast workflow
              </div>
              <h3 className="mt-3 text-base font-semibold text-white">Convert in a few clicks</h3>
              <p className="mt-2 text-sm leading-6 text-white/60">
                Upload your file, choose the target format, adjust bitrate or trim if needed, and download the result.
              </p>
            </div>

            <div className="rounded-[24px] bg-white/8 p-5 ring-1 ring-white/10 shadow-[0_18px_55px_rgba(0,0,0,0.25)]">
              <div className="text-[11px] font-semibold uppercase tracking-[0.18em] text-white/45">
                Popular formats
              </div>
              <h3 className="mt-3 text-base font-semibold text-white">Audio and video essentials</h3>
              <p className="mt-2 text-sm leading-6 text-white/60">
                Convert between MP3, AAC, M4A, OPUS, FLAC, MP4, WEBM, MOV, and GIF with simple quality controls.
              </p>
            </div>

            <div className="rounded-[24px] bg-white/8 p-5 ring-1 ring-white/10 shadow-[0_18px_55px_rgba(0,0,0,0.25)]">
              <div className="text-[11px] font-semibold uppercase tracking-[0.18em] text-white/45">
                Browser demo
              </div>
              <h3 className="mt-3 text-base font-semibold text-white">Great for quick tasks</h3>
              <p className="mt-2 text-sm leading-6 text-white/60">
                Smaller files work best in-browser. Larger or heavier files may be better suited for the upcoming server beta.
              </p>
            </div>
          </div>

          <div className="mt-4 rounded-[28px] bg-white/8 p-6 ring-1 ring-white/10 shadow-[0_18px_55px_rgba(0,0,0,0.25)]">
            <div className="grid gap-6 md:grid-cols-[1.2fr_0.8fr] md:items-center">
              <div>
                <div className="text-[11px] font-semibold uppercase tracking-[0.18em] text-white/45">
                  Why use Converto
                </div>
                <h3 className="mt-3 text-xl font-semibold tracking-tight text-white">
                  Clean, simple, and built for everyday conversion
                </h3>
                <p className="mt-3 max-w-[60ch] text-sm leading-6 text-white/60">
                  Converto focuses on the formats people actually use. Quick actions, trim support, audio bitrate selection,
                  and lightweight browser conversion make it easy to get results without a complicated workflow.
                </p>
              </div>

              <div className="grid gap-3 sm:grid-cols-2 md:grid-cols-1">
                <div className="rounded-2xl bg-white/5 px-4 py-3 ring-1 ring-white/10 text-sm text-white/70">
                  Quick actions for common use cases
                </div>
                <div className="rounded-2xl bg-white/5 px-4 py-3 ring-1 ring-white/10 text-sm text-white/70">
                  Trim and bitrate controls
                </div>
                <div className="rounded-2xl bg-white/5 px-4 py-3 ring-1 ring-white/10 text-sm text-white/70">
                  Popular formats only, less clutter
                </div>
              </div>
            </div>
          </div>
        </section>
      </main>

      <footer className="border-t border-white/10">
        <div className={cx("mx-auto flex flex-col gap-4 px-4 py-10 sm:flex-row sm:items-center sm:justify-between sm:px-5 xl:px-6", SHELL_MAX)}>
          <div className="text-sm text-white/70">
            <span className="font-semibold text-white">Converto</span> <span className="text-white/50">•</span> by NexviaSoft
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

          <div className="text-xs text-white/40">© {new Date().getFullYear()} NexviaSoft</div>
        </div>
      </footer>

      <Toast open={toastOpen} title={toastTitle} desc={toastDesc} onClose={() => setToastOpen(false)} />
    </div>
  );
}