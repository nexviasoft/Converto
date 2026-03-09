import type { Metadata } from "next";
import Link from "next/link";

const siteUrl =
  process.env.NEXT_PUBLIC_SITE_URL?.replace(/\/$/, "") ||
  "https://converto.tools";

const audioFormats = ["MP3", "WAV", "AAC", "FLAC", "M4A", "OGG", "OPUS"];
const videoFormats = ["MP4", "WEBM", "MOV", "GIF"];

const popularConversions = [
  { href: "/convert/mp4-to-mp3", label: "MP4 to MP3", desc: "Extract audio from MP4 video files." },
  { href: "/convert/mp3-to-wav", label: "MP3 to WAV", desc: "Convert compressed audio into WAV format." },
  { href: "/convert/flac-to-mp3", label: "FLAC to MP3", desc: "Make lossless audio more portable and lightweight." },
  { href: "/convert/webm-to-mp3", label: "WEBM to MP3", desc: "Turn WEBM video audio into MP3." },
  { href: "/convert/mov-to-mp4", label: "MOV to MP4", desc: "Improve compatibility for sharing and playback." },
  { href: "/convert/mp4-to-gif", label: "MP4 to GIF", desc: "Create lightweight animated clips from video." },
];

export const metadata: Metadata = {
  title: "Supported File Formats",
  description:
    "Explore the audio, video, and image formats supported by Converto. Convert MP3, WAV, AAC, FLAC, MP4, WEBM, MOV, GIF, and more online.",
  alternates: {
    canonical: `${siteUrl}/formats`,
  },
  openGraph: {
    title: "Supported File Formats | Converto",
    description:
      "Explore the audio, video, and image formats supported by Converto.",
    url: `${siteUrl}/formats`,
    siteName: "Converto",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Supported File Formats | Converto",
    description:
      "Explore the audio, video, and image formats supported by Converto.",
  },
};

export default function FormatsPage() {
  return (
    <main className="min-h-screen bg-[#151233] text-white">
      <div className="pointer-events-none fixed inset-0 -z-10">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,rgba(168,85,247,0.22),transparent_60%),radial-gradient(ellipse_at_bottom,rgba(59,130,246,0.18),transparent_55%),radial-gradient(ellipse_at_center,rgba(255,255,255,0.08),transparent_45%)]" />
        <div className="absolute inset-0 opacity-20 [background:linear-gradient(to_right,rgba(255,255,255,0.045)_1px,transparent_1px),linear-gradient(to_bottom,rgba(255,255,255,0.045)_1px,transparent_1px)] [background-size:72px_72px]" />
      </div>

      <div className="mx-auto max-w-6xl px-4 py-14 sm:px-6 lg:px-8">
        <div className="rounded-[30px] bg-white/10 p-8 ring-1 ring-white/10 shadow-[0_18px_55px_rgba(0,0,0,0.25)]">
          <div className="text-[11px] font-semibold uppercase tracking-[0.18em] text-white/45">
            Format Library
          </div>

          <h1 className="mt-3 text-4xl font-bold tracking-tight sm:text-5xl">
            Supported file formats
          </h1>

          <p className="mt-4 max-w-3xl text-sm leading-7 text-white/70 sm:text-base">
            Converto supports a growing set of popular audio, video, and lightweight
            animated formats for fast browser-based conversion. This page gives you a
            quick overview of the main formats currently available and common conversion
            paths users start with.
          </p>

          <div className="mt-8 flex flex-wrap gap-3">
            <Link
              href="/converter"
              className="inline-flex rounded-full bg-white px-5 py-2.5 text-sm font-semibold text-black transition hover:bg-white/90"
            >
              Open Converter
            </Link>

            <Link
              href="/"
              className="inline-flex rounded-full bg-white/8 px-5 py-2.5 text-sm font-medium text-white/85 ring-1 ring-white/10 transition hover:bg-white/12 hover:text-white"
            >
              Back to Home
            </Link>
          </div>
        </div>

        <section className="mt-10 grid gap-6 md:grid-cols-2">
          <div className="rounded-[28px] bg-white/10 p-6 ring-1 ring-white/10 shadow-[0_18px_55px_rgba(0,0,0,0.25)]">
            <h2 className="text-2xl font-semibold tracking-tight">Audio formats</h2>
            <p className="mt-3 text-sm leading-6 text-white/65">
              Audio conversion is useful for playback compatibility, smaller file size,
              and extracting sound from video-based workflows. Converto is designed to
              support common everyday listening and sharing formats.
            </p>

            <ul className="mt-5 flex flex-wrap gap-3">
              {audioFormats.map((format) => (
                <li
                  key={format}
                  className="rounded-full bg-white/8 px-4 py-2 text-sm font-medium text-white/85 ring-1 ring-white/10"
                >
                  {format}
                </li>
              ))}
            </ul>
          </div>

          <div className="rounded-[28px] bg-white/10 p-6 ring-1 ring-white/10 shadow-[0_18px_55px_rgba(0,0,0,0.25)]">
            <h2 className="text-2xl font-semibold tracking-tight">Video and animation formats</h2>
            <p className="mt-3 text-sm leading-6 text-white/65">
              Video conversion helps improve device compatibility, reduce friction in
              sharing, and prepare files for different social, browser, and playback
              use cases. Lightweight animation support is especially useful for short clips.
            </p>

            <ul className="mt-5 flex flex-wrap gap-3">
              {videoFormats.map((format) => (
                <li
                  key={format}
                  className="rounded-full bg-white/8 px-4 py-2 text-sm font-medium text-white/85 ring-1 ring-white/10"
                >
                  {format}
                </li>
              ))}
            </ul>
          </div>
        </section>

        <section className="mt-10 rounded-[28px] bg-white/10 p-6 ring-1 ring-white/10 shadow-[0_18px_55px_rgba(0,0,0,0.25)]">
          <div className="text-[11px] font-semibold uppercase tracking-[0.18em] text-white/45">
            Popular conversions
          </div>

          <h2 className="mt-3 text-2xl font-semibold tracking-tight">
            Common format changes people make every day
          </h2>

          <p className="mt-3 max-w-3xl text-sm leading-6 text-white/65">
            These are some of the most useful conversion paths for compatibility,
            sharing, lightweight output, and extracting audio from video.
          </p>

          <div className="mt-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {popularConversions.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                className="group rounded-2xl bg-white/8 p-4 ring-1 ring-white/10 transition hover:bg-white/12"
              >
                <div className="text-base font-semibold text-white group-hover:text-white">
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
          <div className="rounded-[28px] bg-white/10 p-6 ring-1 ring-white/10 shadow-[0_18px_55px_rgba(0,0,0,0.25)]">
            <h2 className="text-2xl font-semibold tracking-tight">Why format support matters</h2>
            <p className="mt-3 text-sm leading-6 text-white/65">
              Different devices, browsers, apps, and sharing workflows work better with
              different file formats. A flexible converter helps you move between those
              formats without needing to install heavy desktop software for simple tasks.
            </p>
            <p className="mt-4 text-sm leading-6 text-white/65">
              In practice, users often convert files to improve compatibility, reduce size,
              extract audio, or prepare media for uploading, playback, editing, or archiving.
            </p>
          </div>

          <div className="rounded-[28px] bg-white/10 p-6 ring-1 ring-white/10 shadow-[0_18px_55px_rgba(0,0,0,0.25)]">
            <h2 className="text-2xl font-semibold tracking-tight">Start converting</h2>
            <p className="mt-3 text-sm leading-6 text-white/65">
              You can jump directly into the converter, or start from one of the popular
              paths above if you already know the output format you want.
            </p>

            <div className="mt-6 flex flex-wrap gap-3">
              <Link
                href="/converter"
                className="inline-flex rounded-full bg-white px-5 py-2.5 text-sm font-semibold text-black transition hover:bg-white/90"
              >
                Go to Converter
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
    </main>
  );
}