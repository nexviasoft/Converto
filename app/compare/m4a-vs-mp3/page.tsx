import type { Metadata } from "next";
import Link from "next/link";

const siteUrl =
  process.env.NEXT_PUBLIC_SITE_URL?.replace(/\/$/, "") ||
  "https://converto.tools";

export const metadata: Metadata = {
  title: "M4A vs MP3",
  description:
    "Compare M4A vs MP3 for audio quality, file size, compatibility, and everyday use. Learn when to use each format and convert between them with Converto.",
  alternates: {
    canonical: `${siteUrl}/compare/m4a-vs-mp3`,
  },
  openGraph: {
    title: "M4A vs MP3 | Converto",
    description:
      "Compare M4A vs MP3 for quality, size, and compatibility.",
    url: `${siteUrl}/compare/m4a-vs-mp3`,
    siteName: "Converto",
    type: "article",
  },
  twitter: {
    card: "summary_large_image",
    title: "M4A vs MP3 | Converto",
    description:
      "Compare M4A vs MP3 for quality, size, and compatibility.",
  },
};

export default function M4AVsMP3Page() {
  return (
    <main className="min-h-screen bg-[#151233] text-white">
      <div className="mx-auto max-w-5xl px-4 py-14">
        <h1 className="text-4xl font-bold">M4A vs MP3</h1>

        <p className="mt-4 text-white/70">
          M4A and MP3 are both popular audio formats for everyday listening, but
          they are optimized a little differently. M4A is commonly associated
          with AAC-based compression and Apple-friendly workflows, while MP3 is
          the more universally recognized format across devices and platforms.
        </p>

        <div className="mt-8 flex flex-wrap gap-3">
          <Link
            href="/convert/m4a-to-mp3"
            className="rounded-full bg-white px-5 py-2.5 text-black"
          >
            Convert M4A to MP3
          </Link>

          <Link
            href="/convert/mp3-to-m4a"
            className="rounded-full bg-white/10 px-5 py-2.5"
          >
            Convert MP3 to M4A
          </Link>
        </div>

        <section className="mt-10 grid gap-6 md:grid-cols-2">
          <div className="rounded-xl bg-white/10 p-6">
            <h2 className="text-2xl font-semibold">What is M4A?</h2>
            <p className="mt-3 text-white/70">
              M4A is an audio container format often used with AAC encoding. It
              is common in Apple devices, iTunes-based ecosystems, and modern
              media workflows that prefer efficient compression and clean audio
              delivery.
            </p>

            <ul className="mt-4 space-y-2 text-sm text-white/70">
              <li>• Common in Apple ecosystems</li>
              <li>• Usually efficient compression</li>
              <li>• Good modern listening format</li>
            </ul>
          </div>

          <div className="rounded-xl bg-white/10 p-6">
            <h2 className="text-2xl font-semibold">What is MP3?</h2>
            <p className="mt-3 text-white/70">
              MP3 is one of the most universal audio formats ever created. It is
              compact, easy to share, and supported by almost every player,
              browser, phone, and media application.
            </p>

            <ul className="mt-4 space-y-2 text-sm text-white/70">
              <li>• Extremely compatible</li>
              <li>• Small file size</li>
              <li>• Great for sharing and playback</li>
            </ul>
          </div>
        </section>

        <section className="mt-10">
          <h2 className="text-2xl font-semibold">M4A vs MP3: Key Differences</h2>

          <div className="mt-6 grid grid-cols-3 overflow-hidden rounded-xl border border-white/10 text-sm">
            <div className="bg-white/10 p-4 font-semibold">Feature</div>
            <div className="bg-white/10 p-4 font-semibold">M4A</div>
            <div className="bg-white/10 p-4 font-semibold">MP3</div>

            <div className="p-4">Compression</div>
            <div className="p-4">Usually AAC-based</div>
            <div className="p-4">MP3 lossy compression</div>

            <div className="p-4">Quality at similar bitrate</div>
            <div className="p-4">Often better</div>
            <div className="p-4">Usually lower</div>

            <div className="p-4">Compatibility</div>
            <div className="p-4">High</div>
            <div className="p-4">Very high</div>

            <div className="p-4">Best use</div>
            <div className="p-4">Modern mobile / Apple workflows</div>
            <div className="p-4">Universal playback and sharing</div>

            <div className="p-4">Portability</div>
            <div className="p-4">Excellent</div>
            <div className="p-4">Excellent</div>
          </div>
        </section>

        <section className="mt-10 grid gap-6 md:grid-cols-2">
          <div className="rounded-xl bg-white/10 p-6">
            <h2 className="text-xl font-semibold">When to use M4A</h2>
            <p className="mt-3 text-white/70">
              Use M4A when you want an efficient modern audio format, especially
              if your workflow involves Apple devices, AAC-based delivery, or
              newer listening environments.
            </p>
          </div>

          <div className="rounded-xl bg-white/10 p-6">
            <h2 className="text-xl font-semibold">When to use MP3</h2>
            <p className="mt-3 text-white/70">
              Use MP3 when you want the safest universal option for playback,
              downloads, sharing, and compatibility across almost all hardware
              and software.
            </p>
          </div>
        </section>

        <section className="mt-10 rounded-xl bg-white/10 p-6">
          <h2 className="text-2xl font-semibold">Convert between M4A and MP3</h2>

          <p className="mt-3 text-white/70">
            Convert M4A to MP3 when you need broader playback support. Convert
            MP3 to M4A when you want a more modern compressed format for certain
            apps, devices, or workflows.
          </p>

          <div className="mt-6 flex flex-wrap gap-3">
            <Link
              href="/convert/m4a-to-mp3"
              className="rounded-full bg-white px-5 py-2 text-black"
            >
              M4A to MP3
            </Link>

            <Link
              href="/convert/mp3-to-m4a"
              className="rounded-full bg-white/10 px-5 py-2"
            >
              MP3 to M4A
            </Link>

            <Link
              href="/formats/m4a"
              className="rounded-full bg-white/10 px-5 py-2"
            >
              M4A format guide
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