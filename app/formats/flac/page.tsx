import type { Metadata } from "next";
import Link from "next/link";

const siteUrl =
  process.env.NEXT_PUBLIC_SITE_URL?.replace(/\/$/, "") ||
  "https://converto.tools";

export const metadata: Metadata = {
  title: "WEBM File Format",
  description:
    "Learn about the WEBM video format, how it works, and how to convert WEBM files to MP3, MP4, and other formats using Converto.",
  alternates: {
    canonical: `${siteUrl}/formats/webm`,
  },
};

export default function WEBMFormatPage() {
  return (
    <main className="min-h-screen bg-[#151233] text-white">
      <div className="mx-auto max-w-4xl px-4 py-14">

        <h1 className="text-4xl font-bold">WEBM File Format</h1>

        <p className="mt-4 text-white/70">
          WEBM is an open video format designed for the web. It is commonly used for
          HTML5 video playback and online streaming because it offers efficient
          compression while maintaining good video quality.
        </p>

        <h2 className="mt-10 text-2xl font-semibold">Why WEBM is popular</h2>

        <ul className="mt-4 list-disc space-y-2 pl-5 text-white/70">
          <li>Optimized for web streaming</li>
          <li>Open-source and royalty-free</li>
          <li>Supported by most modern browsers</li>
        </ul>

        <h2 className="mt-10 text-2xl font-semibold">Common WEBM conversions</h2>

        <div className="mt-6 flex flex-wrap gap-3">
          <Link
            href="/convert/webm-to-mp3"
            className="rounded-full bg-white px-4 py-2 text-black"
          >
            WEBM → MP3
          </Link>

          <Link
            href="/convert/webm-to-mp4"
            className="rounded-full bg-white px-4 py-2 text-black"
          >
            WEBM → MP4
          </Link>

          <Link
            href="/convert/webm-to-wav"
            className="rounded-full bg-white px-4 py-2 text-black"
          >
            WEBM → WAV
          </Link>
        </div>

      </div>
    </main>
  );
}