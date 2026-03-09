import type { Metadata } from "next";
import Link from "next/link";

const siteUrl =
  process.env.NEXT_PUBLIC_SITE_URL?.replace(/\/$/, "") ||
  "https://converto.tools";

export const metadata: Metadata = {
  title: "MP3 vs WAV",
  description:
    "Compare MP3 vs WAV for file size, audio quality, compatibility, and common use cases. Learn when to use each format and convert between them with Converto.",
  alternates: {
    canonical: `${siteUrl}/compare/mp3-vs-wav`,
  },
  openGraph: {
    title: "MP3 vs WAV | Converto",
    description:
      "Compare MP3 vs WAV for quality, size, and compatibility.",
    url: `${siteUrl}/compare/mp3-vs-wav`,
    siteName: "Converto",
    type: "article",
  },
  twitter: {
    card: "summary_large_image",
    title: "MP3 vs WAV | Converto",
    description:
      "Compare MP3 vs WAV for quality, size, and compatibility.",
  },
};

export default function MP3VsWAVPage() {
  return (
    <main className="min-h-screen bg-[#151233] text-white">
      <div className="pointer-events-none fixed inset-0 -z-10">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,rgba(168,85,247,0.22),transparent_60%),radial-gradient(ellipse_at_bottom,rgba(59,130,246,0.18),transparent_55%),radial-gradient(ellipse_at_center,rgba(255,255,255,0.08),transparent_45%)]" />
        <div className="absolute inset-0 opacity-20 [background:linear-gradient(to_right,rgba(255,255,255,0.045)_1px,transparent_1px),linear-gradient(to_bottom,rgba(255,255,255,0.045)_1px,transparent_1px)] [background-size:72px_72px]" />
      </div>

      <div className="mx-auto max-w-5xl px-4 py-14 sm:px-6 lg:px-8">
        <div className="rounded-[30px] bg-white/10 p-8 ring-1 ring-white/10 shadow-[0_18px_55px_rgba(0,0,0,0.25)]">
          <div className="text-[11px] font-semibold uppercase tracking-[0.18em] text-white/45">
            Format Comparison
          </div>

          <h1 className="mt-3 text-4xl font-bold tracking-tight sm:text-5xl">
            MP3 vs WAV
          </h1>

          <p className="mt-4 max-w-3xl text-sm leading-7 text-white/70 sm:text-base">
            MP3 and WAV are two of the most recognized audio formats, but they
            serve different purposes. MP3 is built for portability and smaller
            file size, while WAV is built for uncompressed quality and editing
            workflows. Choosing the right one depends on whether you care more
            about convenience or raw audio fidelity.
          </p>

          <div className="mt-8 flex flex-wrap gap-3">
            <Link
              href="/convert/mp3-to-wav"
              className="inline-flex rounded-full bg-white px-5 py-2.5 text-sm font-semibold text-black transition hover:bg-white/90"
            >
              Convert MP3 to WAV
            </Link>

            <Link
              href="/convert/wav-to-mp3"
              className="inline-flex rounded-full bg-white/8 px-5 py-2.5 text-sm font-medium text-white/85 ring-1 ring-white/10 transition hover:bg-white/12 hover:text-white"
            >
              Convert WAV to MP3
            </Link>
          </div>
        </div>

        <section className="mt-10 grid gap-6 md:grid-cols-2">
          <div className="rounded-[28px] bg-white/10 p-6 ring-1 ring-white/10 shadow-[0_18px_55px_rgba(0,0,0,0.25)]">
            <h2 className="text-2xl font-semibold tracking-tight">What is MP3?</h2>
            <p className="mt-3 text-sm leading-6 text-white/65">
              MP3 is a compressed, lossy audio format designed to keep file sizes
              low while preserving enough quality for everyday listening. It is
              widely used for music libraries, downloads, streaming, and sharing.
            </p>
            <ul className="mt-5 space-y-2 text-sm text-white/70">
              <li>• Small file size</li>
              <li>• Very high compatibility</li>
              <li>• Great for portable use</li>
            </ul>
          </div>

          <div className="rounded-[28px] bg-white/10 p-6 ring-1 ring-white/10 shadow-[0_18px_55px_rgba(0,0,0,0.25)]">
            <h2 className="text-2xl font-semibold tracking-tight">What is WAV?</h2>
            <p className="mt-3 text-sm leading-6 text-white/65">
              WAV is an uncompressed audio format that preserves original sound
              data without lossy reduction. Because of that, WAV files are larger,
              but they are useful in recording, editing, mixing, and archiving.
            </p>
            <ul className="mt-5 space-y-2 text-sm text-white/70">
              <li>• Lossless quality</li>
              <li>• Large file size</li>
              <li>• Great for editing workflows</li>
            </ul>
          </div>
        </section>

        <section className="mt-10 rounded-[28px] bg-white/10 p-6 ring-1 ring-white/10 shadow-[0_18px_55px_rgba(0,0,0,0.25)]">
          <h2 className="text-2xl font-semibold tracking-tight">
            MP3 vs WAV: key differences
          </h2>

          <div className="mt-6 overflow-hidden rounded-2xl ring-1 ring-white/10">
            <div className="grid grid-cols-3 bg-white/8 text-sm font-semibold text-white">
              <div className="p-4">Feature</div>
              <div className="p-4">MP3</div>
              <div className="p-4">WAV</div>
            </div>

            <div className="grid grid-cols-3 border-t border-white/10 text-sm text-white/75">
              <div className="p-4">Compression</div>
              <div className="p-4">Lossy</div>
              <div className="p-4">Uncompressed</div>
            </div>

            <div className="grid grid-cols-3 border-t border-white/10 text-sm text-white/75">
              <div className="p-4">File size</div>
              <div className="p-4">Smaller</div>
              <div className="p-4">Larger</div>
            </div>

            <div className="grid grid-cols-3 border-t border-white/10 text-sm text-white/75">
              <div className="p-4">Quality</div>
              <div className="p-4">Good for casual use</div>
              <div className="p-4">Higher fidelity</div>
            </div>

            <div className="grid grid-cols-3 border-t border-white/10 text-sm text-white/75">
              <div className="p-4">Best for</div>
              <div className="p-4">Listening, sharing, storage</div>
              <div className="p-4">Editing, mastering, archiving</div>
            </div>

            <div className="grid grid-cols-3 border-t border-white/10 text-sm text-white/75">
              <div className="p-4">Compatibility</div>
              <div className="p-4">Excellent</div>
              <div className="p-4">Good, but heavier</div>
            </div>
          </div>
        </section>

        <section className="mt-10 grid gap-6 lg:grid-cols-2">
          <div className="rounded-[28px] bg-white/10 p-6 ring-1 ring-white/10 shadow-[0_18px_55px_rgba(0,0,0,0.25)]">
            <h2 className="text-2xl font-semibold tracking-tight">
              When should you use MP3?
            </h2>
            <p className="mt-3 text-sm leading-6 text-white/65">
              MP3 is the better choice when you need compact files for music
              playback, easy sharing, general compatibility, or daily use on
              phones, laptops, and streaming apps.
            </p>
            <p className="mt-4 text-sm leading-6 text-white/65">
              If storage space matters more than perfect audio preservation,
              MP3 usually makes the most sense.
            </p>
          </div>

          <div className="rounded-[28px] bg-white/10 p-6 ring-1 ring-white/10 shadow-[0_18px_55px_rgba(0,0,0,0.25)]">
            <h2 className="text-2xl font-semibold tracking-tight">
              When should you use WAV?
            </h2>
            <p className="mt-3 text-sm leading-6 text-white/65">
              WAV is a better choice when you want raw quality for editing,
              mixing, production, or long-term archival work. It is commonly used
              in studio workflows because the audio is not reduced by lossy compression.
            </p>
            <p className="mt-4 text-sm leading-6 text-white/65">
              If quality and editability matter more than file size, WAV is the
              stronger option.
            </p>
          </div>
        </section>

        <section className="mt-10 rounded-[28px] bg-white/10 p-6 ring-1 ring-white/10 shadow-[0_18px_55px_rgba(0,0,0,0.25)]">
          <div className="text-[11px] font-semibold uppercase tracking-[0.18em] text-white/45">
            Conversion paths
          </div>

          <h2 className="mt-3 text-2xl font-semibold tracking-tight">
            Convert between MP3 and WAV
          </h2>

          <p className="mt-3 max-w-3xl text-sm leading-6 text-white/65">
            If you need smaller portable files, convert WAV to MP3. If you need
            an edit-friendly output format, convert MP3 to WAV.
          </p>

          <div className="mt-6 flex flex-wrap gap-3">
            <Link
              href="/convert/mp3-to-wav"
              className="inline-flex rounded-full bg-white px-5 py-2.5 text-sm font-semibold text-black transition hover:bg-white/90"
            >
              MP3 to WAV
            </Link>

            <Link
              href="/convert/wav-to-mp3"
              className="inline-flex rounded-full bg-white/8 px-5 py-2.5 text-sm font-medium text-white/85 ring-1 ring-white/10 transition hover:bg-white/12 hover:text-white"
            >
              WAV to MP3
            </Link>

            <Link
              href="/formats/mp3"
              className="inline-flex rounded-full bg-white/8 px-5 py-2.5 text-sm font-medium text-white/85 ring-1 ring-white/10 transition hover:bg-white/12 hover:text-white"
            >
              MP3 format guide
            </Link>

            <Link
              href="/formats/wav"
              className="inline-flex rounded-full bg-white/8 px-5 py-2.5 text-sm font-medium text-white/85 ring-1 ring-white/10 transition hover:bg-white/12 hover:text-white"
            >
              WAV format guide
            </Link>
          </div>
        </section>
      </div>
    </main>
  );
}