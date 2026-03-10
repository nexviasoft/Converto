import type { Metadata } from "next";
import Link from "next/link";

const siteUrl =
  process.env.NEXT_PUBLIC_SITE_URL?.replace(/\/$/, "") ||
  "https://converto.tools";

export const metadata: Metadata = {
  title: "MP4 vs WEBM",
  description:
    "Compare MP4 vs WEBM for compatibility, file size, quality, and web playback. Learn when to use each format and convert between them with Converto.",
  alternates: {
    canonical: `${siteUrl}/compare/mp4-vs-webm`,
  },
  openGraph: {
    title: "MP4 vs WEBM | Converto",
    description:
      "Compare MP4 vs WEBM for compatibility, quality, and web use.",
    url: `${siteUrl}/compare/mp4-vs-webm`,
    siteName: "Converto",
    type: "article",
  },
  twitter: {
    card: "summary_large_image",
    title: "MP4 vs WEBM | Converto",
    description:
      "Compare MP4 vs WEBM for compatibility, quality, and web use.",
  },
};

export default function MP4VsWEBMPage() {
  return (
    <main className="min-h-screen bg-[#151233] text-white">
      <div className="mx-auto max-w-5xl px-4 py-14">
        <h1 className="text-4xl font-bold">MP4 vs WEBM</h1>

        <p className="mt-4 text-white/70">
          MP4 and WEBM are both popular video formats, but they are optimized for
          different use cases. MP4 is the most universal choice for playback and
          sharing, while WEBM is more web-focused and often preferred for modern
          browser delivery.
        </p>

        <div className="mt-8 flex flex-wrap gap-3">
          <Link
            href="/convert/mp4-to-webm"
            className="rounded-full bg-white px-5 py-2.5 text-black"
          >
            Convert MP4 to WEBM
          </Link>

          <Link
            href="/convert/webm-to-mp4"
            className="rounded-full bg-white/10 px-5 py-2.5"
          >
            Convert WEBM to MP4
          </Link>
        </div>

        <section className="mt-10 grid gap-6 md:grid-cols-2">
          <div className="rounded-xl bg-white/10 p-6">
            <h2 className="text-2xl font-semibold">What is MP4?</h2>
            <p className="mt-3 text-white/70">
              MP4 is one of the most widely used video container formats in the
              world. It is highly compatible with phones, desktops, social media
              platforms, editing tools, and media players.
            </p>

            <ul className="mt-4 space-y-2 text-sm text-white/70">
              <li>• Excellent compatibility</li>
              <li>• Great for sharing and playback</li>
              <li>• Common choice for everyday video use</li>
            </ul>
          </div>

          <div className="rounded-xl bg-white/10 p-6">
            <h2 className="text-2xl font-semibold">What is WEBM?</h2>
            <p className="mt-3 text-white/70">
              WEBM is an open video format designed mainly for web delivery. It
              is commonly used in modern browsers and web applications where
              efficient streaming matters.
            </p>

            <ul className="mt-4 space-y-2 text-sm text-white/70">
              <li>• Optimized for the web</li>
              <li>• Open and royalty-free</li>
              <li>• Strong browser support</li>
            </ul>
          </div>
        </section>

        <section className="mt-10">
          <h2 className="text-2xl font-semibold">MP4 vs WEBM: Key Differences</h2>

          <div className="mt-6 grid grid-cols-3 overflow-hidden rounded-xl border border-white/10 text-sm">
            <div className="bg-white/10 p-4 font-semibold">Feature</div>
            <div className="bg-white/10 p-4 font-semibold">MP4</div>
            <div className="bg-white/10 p-4 font-semibold">WEBM</div>

            <div className="p-4">Compatibility</div>
            <div className="p-4">Very high</div>
            <div className="p-4">High in modern browsers</div>

            <div className="p-4">Best use</div>
            <div className="p-4">Sharing, playback, devices</div>
            <div className="p-4">Web delivery, browser video</div>

            <div className="p-4">Compression</div>
            <div className="p-4">Flexible, broadly supported</div>
            <div className="p-4">Web-oriented efficiency</div>

            <div className="p-4">Editing support</div>
            <div className="p-4">Usually better</div>
            <div className="p-4">More limited in some tools</div>

            <div className="p-4">General portability</div>
            <div className="p-4">Excellent</div>
            <div className="p-4">More web-focused</div>
          </div>
        </section>

        <section className="mt-10 grid gap-6 md:grid-cols-2">
          <div className="rounded-xl bg-white/10 p-6">
            <h2 className="text-xl font-semibold">When to use MP4</h2>
            <p className="mt-3 text-white/70">
              Use MP4 when you want the safest all-around option for playback,
              device compatibility, social uploads, sharing, and general media use.
            </p>
          </div>

          <div className="rounded-xl bg-white/10 p-6">
            <h2 className="text-xl font-semibold">When to use WEBM</h2>
            <p className="mt-3 text-white/70">
              Use WEBM when your priority is web delivery, browser-based playback,
              or lightweight streaming workflows in modern environments.
            </p>
          </div>
        </section>

        <section className="mt-10 rounded-xl bg-white/10 p-6">
          <h2 className="text-2xl font-semibold">Convert between MP4 and WEBM</h2>

          <p className="mt-3 text-white/70">
            Convert MP4 to WEBM when you want a more web-oriented output. Convert
            WEBM to MP4 when you need broader playback and device compatibility.
          </p>

          <div className="mt-6 flex flex-wrap gap-3">
            <Link
              href="/convert/mp4-to-webm"
              className="rounded-full bg-white px-5 py-2 text-black"
            >
              MP4 to WEBM
            </Link>

            <Link
              href="/convert/webm-to-mp4"
              className="rounded-full bg-white/10 px-5 py-2"
            >
              WEBM to MP4
            </Link>

            <Link
              href="/formats/mp4"
              className="rounded-full bg-white/10 px-5 py-2"
            >
              MP4 format guide
            </Link>

            <Link
              href="/formats/webm"
              className="rounded-full bg-white/10 px-5 py-2"
            >
              WEBM format guide
            </Link>
          </div>
        </section>
      </div>
    </main>
  );
}