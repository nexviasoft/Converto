import type { Metadata } from "next";
import Link from "next/link";

const siteUrl =
  process.env.NEXT_PUBLIC_SITE_URL?.replace(/\/$/, "") ||
  "https://converto.tools";

export const metadata: Metadata = {
  title: "MP3 File Format",
  description:
    "Learn about the MP3 audio format, how it works, and how to convert MP3 files to WAV, AAC, FLAC, and other formats with Converto.",
  alternates: {
    canonical: `${siteUrl}/formats/mp3`,
  },
};

export default function MP3FormatPage() {
  return (
    <main className="min-h-screen bg-[#151233] text-white">
      <div className="mx-auto max-w-4xl px-4 py-14">

        <h1 className="text-4xl font-bold">MP3 File Format</h1>

        <p className="mt-4 text-white/70">
          MP3 is one of the most widely used digital audio formats. It uses lossy
          compression to reduce file size while maintaining acceptable audio quality,
          making it ideal for music playback, streaming, and portable devices.
        </p>

        <h2 className="mt-10 text-2xl font-semibold">Why MP3 is popular</h2>

        <ul className="mt-4 list-disc space-y-2 pl-5 text-white/70">
          <li>Small file size compared to lossless audio formats</li>
          <li>Supported on almost every device and player</li>
          <li>Great for music libraries and streaming</li>
        </ul>

        <h2 className="mt-10 text-2xl font-semibold">Common MP3 conversions</h2>

        <div className="mt-6 flex flex-wrap gap-3">
          <Link
            href="/convert/mp3-to-wav"
            className="rounded-full bg-white px-4 py-2 text-black"
          >
            MP3 → WAV
          </Link>

          <Link
            href="/convert/mp3-to-flac"
            className="rounded-full bg-white px-4 py-2 text-black"
          >
            MP3 → FLAC
          </Link>

          <Link
            href="/convert/mp3-to-aac"
            className="rounded-full bg-white px-4 py-2 text-black"
          >
            MP3 → AAC
          </Link>
        </div>

      </div>
    </main>
  );
}