import type { Metadata } from "next";
import Link from "next/link";

const siteUrl =
  process.env.NEXT_PUBLIC_SITE_URL?.replace(/\/$/, "") ||
  "https://converto.tools";

export const metadata: Metadata = {
  title: "WAV File Format",
  description:
    "Learn about the WAV audio format, how it works, and when to convert WAV to other formats like MP3, AAC, or FLAC using Converto.",
  alternates: {
    canonical: `${siteUrl}/formats/wav`,
  },
};

export default function WAVFormatPage() {
  return (
    <main className="min-h-screen bg-[#151233] text-white">
      <div className="mx-auto max-w-4xl px-4 py-14">

        <h1 className="text-4xl font-bold">WAV File Format</h1>

        <p className="mt-4 text-white/70">
          WAV (Waveform Audio File Format) is a lossless audio format developed by
          Microsoft and IBM. It stores raw, uncompressed audio data, making it ideal
          for professional audio production, editing, and archiving.
        </p>

        <h2 className="mt-10 text-2xl font-semibold">Why WAV is used</h2>

        <ul className="mt-4 list-disc space-y-2 pl-5 text-white/70">
          <li>Lossless audio quality</li>
          <li>Preferred format for audio editing and mastering</li>
          <li>No compression artifacts</li>
        </ul>

        <h2 className="mt-10 text-2xl font-semibold">Common WAV conversions</h2>

        <div className="mt-6 flex flex-wrap gap-3">
          <Link
            href="/convert/wav-to-mp3"
            className="rounded-full bg-white px-4 py-2 text-black"
          >
            WAV → MP3
          </Link>

          <Link
            href="/convert/wav-to-aac"
            className="rounded-full bg-white px-4 py-2 text-black"
          >
            WAV → AAC
          </Link>

          <Link
            href="/convert/wav-to-flac"
            className="rounded-full bg-white px-4 py-2 text-black"
          >
            WAV → FLAC
          </Link>
        </div>

      </div>
    </main>
  );
}