import type { Metadata } from "next";
import Link from "next/link";

const siteUrl =
  process.env.NEXT_PUBLIC_SITE_URL?.replace(/\/$/, "") ||
  "https://converto.tools";

export const metadata: Metadata = {
  title: "MP4 File Format",
  description:
    "Learn about the MP4 file format, how it works, and how to convert MP4 to other formats like MP3, WAV, and GIF using Converto.",
  alternates: {
    canonical: `${siteUrl}/formats/mp4`,
  },
};

export default function MP4FormatPage() {
  return (
    <main className="min-h-screen bg-[#151233] text-white">
      <div className="mx-auto max-w-4xl px-4 py-14">

        <h1 className="text-4xl font-bold">MP4 File Format</h1>

        <p className="mt-4 text-white/70">
          MP4 (MPEG-4 Part 14) is one of the most widely used video container formats.
          It supports video, audio, subtitles, and metadata in a single file and is
          commonly used for streaming, social media, and mobile playback.
        </p>

        <h2 className="mt-10 text-2xl font-semibold">Why MP4 is popular</h2>

        <ul className="mt-4 list-disc space-y-2 pl-5 text-white/70">
          <li>Works on almost every device and browser</li>
          <li>Good balance between quality and file size</li>
          <li>Supports modern codecs like H.264 and AAC</li>
        </ul>

        <h2 className="mt-10 text-2xl font-semibold">Popular MP4 conversions</h2>

        <div className="mt-6 flex flex-wrap gap-3">
          <Link href="/convert/mp4-to-mp3" className="rounded-full bg-white px-4 py-2 text-black">
            MP4 → MP3
          </Link>

          <Link href="/convert/mp4-to-wav" className="rounded-full bg-white px-4 py-2 text-black">
            MP4 → WAV
          </Link>

          <Link href="/convert/mp4-to-gif" className="rounded-full bg-white px-4 py-2 text-black">
            MP4 → GIF
          </Link>
        </div>

      </div>
    </main>
  );
}