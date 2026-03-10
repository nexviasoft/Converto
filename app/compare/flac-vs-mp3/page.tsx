import type { Metadata } from "next";
import Link from "next/link";

const siteUrl =
  process.env.NEXT_PUBLIC_SITE_URL?.replace(/\/$/, "") ||
  "https://converto.tools";

export const metadata: Metadata = {
  title: "FLAC vs MP3",
  description:
    "Compare FLAC vs MP3 for audio quality, compression, file size, and compatibility. Learn which format is better and convert between them with Converto.",
  alternates: {
    canonical: `${siteUrl}/compare/flac-vs-mp3`,
  },
  openGraph: {
    title: "FLAC vs MP3 | Converto",
    description:
      "Compare FLAC vs MP3 for quality, compression, and compatibility.",
    url: `${siteUrl}/compare/flac-vs-mp3`,
    siteName: "Converto",
    type: "article",
  },
  twitter: {
    card: "summary_large_image",
    title: "FLAC vs MP3 | Converto",
    description:
      "Compare FLAC vs MP3 for quality, compression, and compatibility.",
  },
};

export default function FLACVsMP3Page() {
  return (
    <main className="min-h-screen bg-[#151233] text-white">
      <div className="mx-auto max-w-5xl px-4 py-14">

        <h1 className="text-4xl font-bold">FLAC vs MP3</h1>

        <p className="mt-4 text-white/70">
          FLAC and MP3 are two widely used audio formats but they serve
          different purposes. FLAC focuses on lossless quality while MP3
          prioritizes small file sizes and compatibility.
        </p>

        <div className="mt-8 flex flex-wrap gap-3">
          <Link
            href="/convert/flac-to-mp3"
            className="rounded-full bg-white px-5 py-2.5 text-black"
          >
            Convert FLAC to MP3
          </Link>

          <Link
            href="/convert/mp3-to-flac"
            className="rounded-full bg-white/10 px-5 py-2.5"
          >
            Convert MP3 to FLAC
          </Link>
        </div>

        <section className="mt-10 grid gap-6 md:grid-cols-2">

          <div className="rounded-xl bg-white/10 p-6">
            <h2 className="text-2xl font-semibold">What is FLAC?</h2>
            <p className="mt-3 text-white/70">
              FLAC (Free Lossless Audio Codec) is a lossless audio format that
              preserves the full original sound data without compression loss.
              It is popular for archiving music collections and high fidelity
              playback.
            </p>

            <ul className="mt-4 space-y-2 text-white/70 text-sm">
              <li>• Lossless compression</li>
              <li>• High audio fidelity</li>
              <li>• Larger file size</li>
            </ul>
          </div>

          <div className="rounded-xl bg-white/10 p-6">
            <h2 className="text-2xl font-semibold">What is MP3?</h2>
            <p className="mt-3 text-white/70">
              MP3 is a lossy audio compression format designed to reduce file
              sizes while keeping acceptable listening quality for everyday
              playback.
            </p>

            <ul className="mt-4 space-y-2 text-white/70 text-sm">
              <li>• Lossy compression</li>
              <li>• Small file size</li>
              <li>• Extremely compatible</li>
            </ul>
          </div>

        </section>

        <section className="mt-10">

          <h2 className="text-2xl font-semibold">FLAC vs MP3: Key Differences</h2>

          <div className="mt-6 grid grid-cols-3 rounded-xl overflow-hidden border border-white/10 text-sm">

            <div className="bg-white/10 p-4 font-semibold">Feature</div>
            <div className="bg-white/10 p-4 font-semibold">FLAC</div>
            <div className="bg-white/10 p-4 font-semibold">MP3</div>

            <div className="p-4">Compression</div>
            <div className="p-4">Lossless</div>
            <div className="p-4">Lossy</div>

            <div className="p-4">File size</div>
            <div className="p-4">Large</div>
            <div className="p-4">Small</div>

            <div className="p-4">Audio quality</div>
            <div className="p-4">Very high</div>
            <div className="p-4">Good</div>

            <div className="p-4">Best use</div>
            <div className="p-4">Archiving, editing</div>
            <div className="p-4">Streaming, sharing</div>

          </div>

        </section>

        <section className="mt-10 grid gap-6 md:grid-cols-2">

          <div className="rounded-xl bg-white/10 p-6">
            <h2 className="text-xl font-semibold">When to use FLAC</h2>
            <p className="mt-3 text-white/70">
              Choose FLAC when you want the best possible audio quality and
              plan to store or edit the file without losing information.
            </p>
          </div>

          <div className="rounded-xl bg-white/10 p-6">
            <h2 className="text-xl font-semibold">When to use MP3</h2>
            <p className="mt-3 text-white/70">
              Choose MP3 when you need smaller files for portability,
              streaming, or sharing across many devices.
            </p>
          </div>

        </section>

        <section className="mt-10 bg-white/10 p-6 rounded-xl">

          <h2 className="text-2xl font-semibold">
            Convert between FLAC and MP3
          </h2>

          <p className="mt-3 text-white/70">
            If you need smaller files convert FLAC to MP3. If you need lossless
            quality convert MP3 to FLAC.
          </p>

          <div className="mt-6 flex gap-3 flex-wrap">

            <Link
              href="/convert/flac-to-mp3"
              className="rounded-full bg-white px-5 py-2 text-black"
            >
              FLAC to MP3
            </Link>

            <Link
              href="/convert/mp3-to-flac"
              className="rounded-full bg-white/10 px-5 py-2"
            >
              MP3 to FLAC
            </Link>

            <Link
              href="/formats/flac"
              className="rounded-full bg-white/10 px-5 py-2"
            >
              FLAC format guide
            </Link>

            <Link
              href="/formats/mp3"
              className="rounded-full bg-white/10 px-5 py-2"
            >
              MP3 format guide
            </Link>

          </div>

        </section>

      </div>
    </main>
  );
}