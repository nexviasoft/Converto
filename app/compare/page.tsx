import type { Metadata } from "next";
import Link from "next/link";

const siteUrl =
  process.env.NEXT_PUBLIC_SITE_URL?.replace(/\/$/, "") ||
  "https://converto.tools";

const comparePages = [
  {
    href: "/compare/mp3-vs-wav",
    label: "MP3 vs WAV",
    desc: "Compare compressed portability and universal playback against uncompressed quality and editing-friendly audio.",
  },
  {
    href: "/compare/flac-vs-mp3",
    label: "FLAC vs MP3",
    desc: "See the difference between lossless audio preservation and smaller, easier-to-share music files.",
  },
  {
    href: "/compare/mp4-vs-webm",
    label: "MP4 vs WEBM",
    desc: "Understand the difference between universal video compatibility and web-focused playback efficiency.",
  },
  {
    href: "/compare/mp4-vs-mov",
    label: "MP4 vs MOV",
    desc: "Compare general sharing and playback against Apple-oriented and editing-heavy workflows.",
  },
  {
    href: "/compare/aac-vs-mp3",
    label: "AAC vs MP3",
    desc: "Compare two compact audio formats for streaming, compatibility, and everyday use.",
  },
  {
    href: "/compare/m4a-vs-mp3",
    label: "M4A vs MP3",
    desc: "See how Apple-friendly audio compares with the most universal listening format.",
  },
];

export const metadata: Metadata = {
  title: "Format Comparisons",
  description:
    "Compare popular audio and video formats like MP3 vs WAV, FLAC vs MP3, MP4 vs WEBM, and more with Converto.",
  alternates: {
    canonical: `${siteUrl}/compare`,
  },
  openGraph: {
    title: "Format Comparisons | Converto",
    description:
      "Compare popular audio and video formats and choose the right one before converting.",
    url: `${siteUrl}/compare`,
    siteName: "Converto",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Format Comparisons | Converto",
    description:
      "Compare popular audio and video formats and choose the right one before converting.",
  },
};

export default function CompareHubPage() {
  return (
    <main className="min-h-screen bg-[#151233] text-white">
      <div className="pointer-events-none fixed inset-0 -z-10">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,rgba(168,85,247,0.22),transparent_60%),radial-gradient(ellipse_at_bottom,rgba(59,130,246,0.18),transparent_55%),radial-gradient(ellipse_at_center,rgba(255,255,255,0.08),transparent_45%)]" />
        <div className="absolute inset-0 opacity-20 [background:linear-gradient(to_right,rgba(255,255,255,0.045)_1px,transparent_1px),linear-gradient(to_bottom,rgba(255,255,255,0.045)_1px,transparent_1px)] [background-size:72px_72px]" />
      </div>

      <div className="mx-auto max-w-6xl px-4 py-14 sm:px-6 lg:px-8">
        <div className="rounded-[30px] bg-white/10 p-8 ring-1 ring-white/10 shadow-[0_18px_55px_rgba(0,0,0,0.25)]">
          <div className="text-[11px] font-semibold uppercase tracking-[0.18em] text-white/45">
            Compare Formats
          </div>

          <h1 className="mt-3 text-4xl font-bold tracking-tight sm:text-5xl">
            Audio and video format comparisons
          </h1>

          <p className="mt-4 max-w-3xl text-sm leading-7 text-white/70 sm:text-base">
            Before converting a file, it helps to understand what each format is
            optimized for. These comparison pages explain differences in quality,
            file size, compatibility, editing workflows, streaming behavior, and
            everyday use.
          </p>

          <div className="mt-8 flex flex-wrap gap-3">
            <Link
              href="/formats"
              className="inline-flex rounded-full bg-white px-5 py-2.5 text-sm font-semibold text-black transition hover:bg-white/90"
            >
              Browse format guides
            </Link>

            <Link
              href="/converter"
              className="inline-flex rounded-full bg-white/8 px-5 py-2.5 text-sm font-medium text-white/85 ring-1 ring-white/10 transition hover:bg-white/12 hover:text-white"
            >
              Open Converter
            </Link>
          </div>
        </div>

        <section className="mt-10 rounded-[28px] bg-white/10 p-6 ring-1 ring-white/10 shadow-[0_18px_55px_rgba(0,0,0,0.25)]">
          <div className="text-[11px] font-semibold uppercase tracking-[0.18em] text-white/45">
            Compare pages
          </div>

          <h2 className="mt-3 text-2xl font-semibold tracking-tight">
            Explore the most useful format comparisons
          </h2>

          <p className="mt-3 max-w-3xl text-sm leading-6 text-white/65">
            These comparisons help you choose the right format before converting.
            They are especially useful when two file types seem similar but serve
            very different purposes in playback, editing, storage, or web delivery.
          </p>

          <div className="mt-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {comparePages.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                className="group rounded-2xl bg-white/8 p-4 ring-1 ring-white/10 transition hover:bg-white/12"
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
          <div className="rounded-[28px] bg-white/10 p-6 ring-1 ring-white/10 shadow-[0_18px_55px_rgba(0,0,0,0.25)]">
            <h2 className="text-2xl font-semibold tracking-tight">
              Why compare before converting?
            </h2>
            <p className="mt-3 text-sm leading-6 text-white/65">
              Some formats are better for raw quality, some are better for smaller
              size, and others are better for device compatibility or browser playback.
              Comparing them first makes it easier to choose the right target format.
            </p>
            <p className="mt-4 text-sm leading-6 text-white/65">
              This is especially useful when deciding between lossless and lossy
              audio, Apple-oriented and cross-platform video, or web-focused and
              editing-friendly file types.
            </p>
          </div>

          <div className="rounded-[28px] bg-white/10 p-6 ring-1 ring-white/10 shadow-[0_18px_55px_rgba(0,0,0,0.25)]">
            <h2 className="text-2xl font-semibold tracking-tight">
              Move from comparison to conversion
            </h2>
            <p className="mt-3 text-sm leading-6 text-white/65">
              Once you know which format suits your workflow, you can jump
              directly into the converter or open a format guide for more context.
            </p>

            <div className="mt-6 flex flex-wrap gap-3">
              <Link
                href="/converter"
                className="inline-flex rounded-full bg-white px-5 py-2.5 text-sm font-semibold text-black transition hover:bg-white/90"
              >
                Go to Converter
              </Link>

              <Link
                href="/formats"
                className="inline-flex rounded-full bg-white/8 px-5 py-2.5 text-sm font-medium text-white/85 ring-1 ring-white/10 transition hover:bg-white/12 hover:text-white"
              >
                Open formats hub
              </Link>
            </div>
          </div>
        </section>
      </div>
    </main>
  );
}