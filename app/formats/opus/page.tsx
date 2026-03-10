import type { Metadata } from "next";
import Link from "next/link";

const siteUrl =
  process.env.NEXT_PUBLIC_SITE_URL?.replace(/\/$/, "") ||
  "https://converto.tools";

export const metadata: Metadata = {
  title: "OPUS File Format",
  description:
    "Learn about the OPUS audio codec and how to convert OPUS files to MP3, WAV, and other formats with Converto.",
  alternates: {
    canonical: `${siteUrl}/formats/opus`,
  },
};

export default function OPUSFormatPage() {
  return (
    <main className="min-h-screen bg-[#151233] text-white">
      <div className="mx-auto max-w-4xl px-4 py-14">

        <h1 className="text-4xl font-bold">OPUS File Format</h1>

        <p className="mt-4 text-white/70">
          OPUS is a modern audio codec optimized for streaming, voice calls,
          and low-latency communication.
        </p>

        <h2 className="mt-10 text-2xl font-semibold">Common OPUS conversions</h2>

        <div className="mt-6 flex flex-wrap gap-3">
          <Link href="/convert/opus-to-mp3" className="rounded-full bg-white px-4 py-2 text-black">
            OPUS → MP3
          </Link>

          <Link href="/convert/opus-to-wav" className="rounded-full bg-white px-4 py-2 text-black">
            OPUS → WAV
          </Link>
        </div>

      </div>
    </main>
  );
}