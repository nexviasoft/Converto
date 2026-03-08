"use client";

import React, { useEffect, useMemo, useRef, useState } from "react";
import AdUnit, { AD_SLOTS } from "@/components/ads/AdUnit";

const cx = (...c: Array<string | false | null | undefined>) => c.filter(Boolean).join(" ");

export default function ConverterSection() {
  // ✅ Converter (REAL)
  type ConvertStatus = "idle" | "ready" | "loading" | "processing" | "done" | "error";
  type TargetFmt = "MP3" | "WAV" | "M4A" | "OGG" | "MP4" | "WEBM" | "GIF";
  type Preset = "SMALL" | "BALANCED" | "HIGH";
  type Stage = "idle" | "loading_engine" | "analyzing" | "converting" | "packaging";

  const [preset, setPreset] = useState<Preset>("BALANCED");
  const [stage, setStage] = useState<Stage>("idle");

  const [file, setFile] = useState<File | null>(null);
  const [dragOver, setDragOver] = useState(false);
  const [status, setStatus] = useState<ConvertStatus>("idle");
  const [progress, setProgress] = useState(0);
  const [target, setTarget] = useState<TargetFmt>("MP3");
  const [resultUrl, setResultUrl] = useState<string | null>(null);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  const [fromFmt, setFromFmt] = useState<TargetFmt | null>(null);

  const [targetOpen, setTargetOpen] = useState(false);
  const targetWrapRef = useRef<HTMLDivElement | null>(null);
  const targetListRef = useRef<HTMLDivElement | null>(null);

  const ffmpegRef = useRef<any>(null);
  const [ffmpegReady, setFfmpegReady] = useState(false);
  const ffmpegLoadingRef = useRef<Promise<void> | null>(null);

  const MAX_FREE_MB = 50;
  const MAX_BYTES = MAX_FREE_MB * 1024 * 1024;

  const BASE_PATH = (process.env.NEXT_PUBLIC_BASE_PATH || "").replace(/\/$/, "");
  const asset = (p: string) => `${BASE_PATH}${p}`;

  useEffect(() => {
    return () => {
      if (resultUrl) URL.revokeObjectURL(resultUrl);
    };
  }, [resultUrl]);

  const detectFmt = (name: string): TargetFmt | null => {
    const n = name.toLowerCase();

    if (n.endsWith(".mp3")) return "MP3";
    if (n.endsWith(".wav")) return "WAV";
    if (n.endsWith(".m4a") || n.endsWith(".aac")) return "M4A";
    if (n.endsWith(".ogg")) return "OGG";
    if (n.endsWith(".webm")) return "WEBM";
    if (n.endsWith(".gif")) return "GIF";

    if (
      n.endsWith(".mp4") ||
      n.endsWith(".mov") ||
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

    // Audio diğerleri (flac/wma/aiff/amr vs) => mp3’e map
    if (n.endsWith(".flac") || n.endsWith(".wma") || n.endsWith(".aiff") || n.endsWith(".aif") || n.endsWith(".amr"))
      return "MP3";

    return null;
  };

  const isAudioFmt = (fmt: TargetFmt | null) => fmt === "MP3" || fmt === "WAV" || fmt === "M4A" || fmt === "OGG";

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
      ".flac",
      ".wma",
      ".aiff",
      ".aif",
      ".amr",
      ".gif",
    ].some((x) => name.endsWith(x));

    if (!okExt)
      return "Unsupported format. Use MP4, MOV, MKV, WEBM, AVI, WMV, FLV, MPG/MPEG, M4V, 3GP, TS/MTS/M2TS, MP3, WAV, M4A/AAC, OGG, FLAC, WMA, AIFF, AMR, GIF.";

    return null;
  };

  const pickFile = (f: File) => {
    const err = validateFile(f);
    if (err) {
      setErrorMsg(err);
      setStatus("error");
      setFile(null);
      setFromFmt(null);
      if (resultUrl) URL.revokeObjectURL(resultUrl);
      setResultUrl(null);
      return;
    }

    const detected = detectFmt(f.name);
    setFromFmt(detected);

    setErrorMsg(null);
    setFile(f);
    setStatus("ready");
    setProgress(0);
    if (resultUrl) URL.revokeObjectURL(resultUrl);
    setResultUrl(null);

    if (detected && target === detected) {
      const preferredOrder: TargetFmt[] = ["MP3", "M4A", "WAV", "OGG", "MP4", "WEBM", "GIF"];
      const next = preferredOrder.find((x) => x !== detected) || "MP3";
      setTarget(next);
    }
  };

  const resetConverter = () => {
    if (resultUrl) URL.revokeObjectURL(resultUrl);
    setFile(null);
    setFromFmt(null);
    setResultUrl(null);
    setStatus("idle");
    setProgress(0);
    setErrorMsg(null);
    setTargetOpen(false);
    setStage("idle");
  };

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
        const { toBlobURL } = await import("@ffmpeg/util"); // kalsın, lazım olabiliyor

        if (!ffmpegRef.current) {
          ffmpegRef.current = new FFmpeg();
          ffmpegRef.current.on("progress", ({ progress }: { progress: number }) => {
            const p = Math.max(0, Math.min(1, progress || 0));
            setProgress(Math.round(p * 100));
          });
        }

        const ffmpeg = ffmpegRef.current;

        const must = ["/ffmpeg/ffmpeg-core.js", "/ffmpeg/ffmpeg-core.wasm", "/ffmpeg/ffmpeg-core.worker.js"];
        for (const u of must) {
          const r = await fetch(asset(u), { method: "GET" });
          if (!r.ok) throw new Error(`Missing FFmpeg asset: ${u} (${r.status})`);
        }

        const v = "1";
        await ffmpeg.load({
          coreURL: asset(`/ffmpeg/ffmpeg-core.js?v=${v}`),
          wasmURL: asset(`/ffmpeg/ffmpeg-core.wasm?v=${v}`),
          workerURL: asset(`/ffmpeg/ffmpeg-core.worker.js?v=${v}`),
        });

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
      } finally {
        ffmpegLoadingRef.current = null;
      }
    })();

    return ffmpegLoadingRef.current;
  };

  const convertingRef = useRef(false);

  const startConvert = async () => {
    if (convertingRef.current) return;
    convertingRef.current = true;

    if (!file) {
      convertingRef.current = false;
      return;
    }

    const BIG_FILE_BYTES = 30 * 1024 * 1024;

    const tryExec = async (args: string[]) => {
      const ffmpeg = ffmpegRef.current;
      if (!ffmpeg) throw new Error("FFmpeg not initialized.");
      await ffmpeg.exec(args);
    };

    const tryMany = async (variants: string[][]) => {
      let lastErr: any = null;
      for (const v of variants) {
        try {
          await tryExec(v);
          return;
        } catch (e) {
          lastErr = e;
        }
      }
      throw lastErr ?? new Error("All ffmpeg variants failed.");
    };

    const videoPresetArgs = () => {
      if (preset === "SMALL") return { crf: "32", preset: "veryfast", ab: "96k" };
      if (preset === "HIGH") return { crf: "22", preset: "fast", ab: "160k" };
      return { crf: "28", preset: "veryfast", ab: "128k" };
    };

    const audioPresetArgs = () => {
      if (preset === "SMALL") return { q: "5", ab: "96k" };
      if (preset === "HIGH") return { q: "2", ab: "192k" };
      return { q: "3", ab: "128k" };
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

      const inExt = (file.name.split(".").pop() || "mp4").toLowerCase();
      const inName = `input_${Date.now()}.${inExt}`;

      const outExtMap: Record<TargetFmt, string> = {
        MP3: "mp3",
        WAV: "wav",
        M4A: "m4a",
        OGG: "ogg",
        MP4: "mp4",
        WEBM: "webm",
        GIF: "gif",
      };
      const outName = `output_${Date.now()}.${outExtMap[target]}`;

      const data = new Uint8Array(await file.arrayBuffer());
      await ffmpeg.writeFile(inName, data);

      if (target === "MP3") {
        const a = audioPresetArgs();
        await tryMany([
          ["-i", inName, "-vn", "-c:a", "libmp3lame", "-q:a", a.q, outName],
          ["-i", inName, "-vn", "-q:a", a.q, outName],
          ["-i", inName, "-vn", outName],
        ]);
      } else if (target === "WAV") {
        await tryMany([
          ["-i", inName, "-vn", "-c:a", "pcm_s16le", "-ar", "44100", "-ac", "2", outName],
          ["-i", inName, "-vn", outName],
        ]);
      } else if (target === "M4A") {
        const a = audioPresetArgs();
        await tryMany([
          ["-i", inName, "-vn", "-c:a", "aac", "-b:a", a.ab, outName],
          ["-i", inName, "-vn", "-b:a", a.ab, outName],
          ["-i", inName, "-vn", outName],
        ]);
      } else if (target === "OGG") {
        const a = audioPresetArgs();
        await tryMany([
          ["-i", inName, "-vn", "-c:a", "libvorbis", "-q:a", preset === "HIGH" ? "6" : preset === "SMALL" ? "4" : "5", outName],
          ["-i", inName, "-vn", "-c:a", "libopus", "-b:a", a.ab, outName],
          ["-i", inName, "-vn", outName],
        ]);
      } else if (target === "WEBM") {
        const v = videoPresetArgs();

        if (fromFmt === "WEBM") {
          try {
            await tryExec(["-i", inName, "-c", "copy", outName]);
          } catch {}
        }

        if (isAudioFmt(fromFmt)) {
          await tryMany([
            ["-i", inName, "-vn", "-c:a", "libopus", "-b:a", v.ab, outName],
            ["-i", inName, "-vn", "-c:a", "libvorbis", "-q:a", preset === "HIGH" ? "6" : preset === "SMALL" ? "4" : "5", outName],
            ["-i", inName, "-vn", outName],
          ]);
        } else {
          await tryMany([
            ["-i", inName, "-c:v", "libvpx", "-crf", v.crf, "-b:v", "0", "-an", outName],
            ["-i", inName, "-c:v", "libvpx-vp9", "-crf", String(Number(v.crf) + 2), "-b:v", "0", "-an", outName],
            ["-i", inName, "-c:v", "libvpx", "-crf", v.crf, "-b:v", "0", "-c:a", "libopus", "-b:a", v.ab, outName],
            ["-i", inName, "-c:v", "libvpx-vp9", "-crf", String(Number(v.crf) + 2), "-b:v", "0", "-c:a", "libopus", "-b:a", v.ab, outName],
          ]);
        }
      } else if (target === "GIF") {
        if (isAudioFmt(fromFmt)) throw new Error("GIF output requires a video/image input (audio-only file selected).");

        const palName = `pal_${Date.now()}.png`;
        await tryMany([["-i", inName, "-vf", "fps=12,scale=480:-1:flags=lanczos,palettegen", palName]]);

        await tryMany([
          ["-i", inName, "-i", palName, "-lavfi", "fps=12,scale=480:-1:flags=lanczos[x];[x][1:v]paletteuse", "-loop", "0", outName],
          ["-i", inName, "-vf", "fps=12,scale=480:-1:flags=lanczos", "-loop", "0", outName],
        ]);

        try {
          await ffmpeg.deleteFile(palName);
        } catch {}
      } else if (target === "MP4") {
        const v = videoPresetArgs();

        if (isAudioFmt(fromFmt)) {
          await tryMany([
            ["-i", inName, "-vn", "-c:a", "aac", "-b:a", v.ab, "-movflags", "+faststart", outName],
            ["-i", inName, "-vn", "-b:a", v.ab, "-movflags", "+faststart", outName],
            ["-i", inName, "-vn", "-movflags", "+faststart", outName],
          ]);
        } else {
          if (fromFmt === "MP4") {
            try {
              await tryExec(["-i", inName, "-c", "copy", "-movflags", "+faststart", outName]);
            } catch {
              await tryMany([
                ["-i", inName, "-c:v", "libx264", "-preset", v.preset, "-crf", v.crf, "-c:a", "aac", "-b:a", v.ab, "-movflags", "+faststart", outName],
                ["-i", inName, "-movflags", "+faststart", outName],
              ]);
            }
          } else {
            await tryMany([
              ["-i", inName, "-c:v", "libx264", "-preset", v.preset, "-crf", v.crf, "-c:a", "aac", "-b:a", v.ab, "-movflags", "+faststart", outName],
              ["-i", inName, "-movflags", "+faststart", outName],
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
        OGG: "audio/ogg",
        MP4: "video/mp4",
        WEBM: "video/webm",
        GIF: "image/gif",
      };

      const blob = new Blob([outData], { type: mimeMap[target] });
      if (resultUrl) URL.revokeObjectURL(resultUrl);
      const url = URL.createObjectURL(blob);

      setResultUrl(url);
      setStatus("done");
      setProgress(100);
      setStage("idle");
    } catch (err: any) {
      const msg = friendlyError(err);
      setErrorMsg(msg);
      setStatus("error");
      setStage("idle");
    } finally {
      convertingRef.current = false;

      if (file.size >= BIG_FILE_BYTES) {
        try {
          await ffmpegRef.current?.terminate?.();
        } catch {}
        ffmpegRef.current = null;
        setFfmpegReady(false);
      }
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

  const orderedTargets = useMemo(() => {
    const preferred: TargetFmt[] = ["MP3", "M4A", "WAV", "OGG", "MP4", "WEBM", "GIF"];
    return preferred.filter((x) => x !== fromFmt);
  }, [fromFmt]);

  return (
    <div className="min-h-screen bg-[#151233] text-white">
      <div className="pointer-events-none fixed inset-0 -z-10">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,rgba(168,85,247,0.22),transparent_60%),radial-gradient(ellipse_at_bottom,rgba(59,130,246,0.18),transparent_55%),radial-gradient(ellipse_at_center,rgba(255,255,255,0.08),transparent_45%)]" />
        <div className="absolute inset-0 opacity-20 [background:linear-gradient(to_right,rgba(255,255,255,0.045)_1px,transparent_1px),linear-gradient(to_bottom,rgba(255,255,255,0.045)_1px,transparent_1px)] [background-size:72px_72px]" />
      </div>

      <section className="mx-auto max-w-4xl px-4 py-14">
        <div className="text-center">
          <p className="text-xs font-semibold tracking-widest text-white/60">ONLINE CONVERTER</p>
          <h1 className="mt-2 text-2xl font-semibold sm:text-3xl">Convert files online</h1>
          <p className="mt-3 text-sm text-white/70">Browser demo (FFmpeg WASM) • Free: {MAX_FREE_MB}MB</p>
        </div>

        <div className="relative mt-10 overflow-visible rounded-3xl bg-white/10 p-6 ring-1 ring-white/10 shadow-[0_30px_80px_rgba(0,0,0,0.35)]">
          <div className="pointer-events-none absolute inset-0 bg-gradient-to-r from-violet-500/12 via-fuchsia-500/8 to-sky-500/12 opacity-60" />

          <div className="relative flex items-center justify-between">
            <div className="text-sm font-semibold">Upload & Convert</div>

            <span className="rounded-full bg-emerald-400/15 px-3 py-1 text-xs text-emerald-200 ring-1 ring-emerald-300/20">
              {ffmpegReady ? "Engine ready" : "Loads on demand"}
            </span>
          </div>

          <div
            className={cx(
              "relative mt-6 rounded-2xl border border-dashed p-10 text-center transition",
              dragOver ? "border-white/40 bg-white/5" : "border-white/20 bg-black/20 hover:bg-white/5"
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
              accept=".mp4,.mov,.mkv,.webm,.avi,.wmv,.flv,.mpg,.mpeg,.m4v,.3gp,.ts,.mts,.m2ts,.mp3,.wav,.m4a,.aac,.ogg,.flac,.wma,.aiff,.aif,.amr,.gif,video/*,audio/*,image/gif"
              onChange={(e) => {
                const f = e.target.files?.[0];
                if (f) pickFile(f);
              }}
            />

            <p className="text-base font-semibold">
              <span className="mx-auto block max-w-[46ch] truncate">{file ? file.name : "Drop a file here"}</span>
            </p>

            <p className="mt-2 text-sm text-white/60">
              {file ? `${(file.size / (1024 * 1024)).toFixed(1)}MB • Output: ${target}` : "Supported: video/audio/gif"}
            </p>

            <div className="mt-5 flex flex-col items-center gap-3 sm:flex-row sm:justify-center">
              <button
                type="button"
                onClick={() => document.getElementById("fileInput")?.click()}
                className="h-11 rounded-2xl bg-white/10 px-4 text-sm font-semibold text-white ring-1 ring-white/10 hover:bg-white/15 transition"
              >
                Choose file
              </button>

              <div ref={targetWrapRef} className="relative">
                <button
                  type="button"
                  onClick={() => setTargetOpen((v) => !v)}
                  className="inline-flex h-11 items-center gap-2 rounded-2xl bg-white/10 px-3 text-sm font-semibold text-white ring-1 ring-white/10 hover:bg-white/15 transition"
                  aria-haspopup="listbox"
                  aria-expanded={targetOpen}
                >
                  <span className="text-xs font-medium text-white/60">Convert to</span>
                  <span className="ml-1">{target}</span>
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" className={cx("ml-1 transition", targetOpen ? "rotate-180" : "")}>
                    <path d="M6 9l6 6 6-6" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                  </svg>
                </button>

                {targetOpen ? (
                  <div
                    role="listbox"
                    className="absolute left-1/2 z-20 mt-2 w-44 -translate-x-1/2 overflow-hidden rounded-2xl bg-[#0D0B18]/95 backdrop-blur ring-1 ring-white/15 shadow-[0_20px_60px_rgba(0,0,0,0.55)]"
                  >
                    <div ref={targetListRef} className="max-h-56 overflow-auto">
                      {orderedTargets.map((v) => (
                        <button
                          key={v}
                          type="button"
                          onClick={() => {
                            setTarget(v);
                            setTargetOpen(false);
                          }}
                          className={cx(
                            "flex w-full items-center justify-between px-4 py-3 text-sm transition",
                            v === target ? "bg-white/10 text-white" : "text-white/80 hover:bg-white/10"
                          )}
                        >
                          <span className="font-semibold">{v}</span>
                        </button>
                      ))}
                    </div>
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
                    "h-11 rounded-2xl px-4 text-sm font-semibold transition",
                    status === "processing" || status === "loading"
                      ? "bg-white/15 text-white/70 ring-1 ring-white/10 cursor-not-allowed"
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
                  onClick={resetConverter}
                  className="h-11 rounded-2xl bg-white/10 px-4 text-sm font-semibold text-white ring-1 ring-white/10 hover:bg-white/15 transition"
                >
                  Reset
                </button>
              ) : null}
            </div>

            {status === "loading" || status === "processing" ? (
              <div className="mt-5 h-2 overflow-hidden rounded-full bg-white/10 ring-1 ring-white/10">
                <div className="h-full bg-white/40" style={{ width: `${progress}%` }} />
              </div>
            ) : null}

            {status === "done" && resultUrl ? (
              <div className="mt-6 flex flex-col items-center gap-3">
                <a
                  href={resultUrl}
                  download={`converto-output.${({ MP3: "mp3", WAV: "wav", M4A: "m4a", OGG: "ogg", MP4: "mp4", WEBM: "webm", GIF: "gif" } as const)[target]}`}
                  className="inline-flex h-11 items-center justify-center rounded-2xl bg-white px-5 text-sm font-semibold text-black hover:bg-white/90 transition"
                >
                  Download result
                </a>
              </div>
            ) : null}

            {status === "error" && errorMsg ? <p className="mt-4 text-sm text-rose-200">{errorMsg}</p> : null}
          </div>

          {/* ✅ sayfa içi reklam */}
          <AdUnit slot={AD_SLOTS.IN_CONTENT} className="mt-6" />
        </div>
      </section>
    </div>
  );
}