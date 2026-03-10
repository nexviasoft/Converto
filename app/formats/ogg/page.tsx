import type { Metadata } from "next";
import Link from "next/link";

const siteUrl =
  process.env.NEXT_PUBLIC_SITE_URL?.replace(/\/$/, "") ||
  "https://converto.tools";

export const metadata: Metadata = {
  title: "OGG File Format",
  description:
    "Learn about the OGG audio format and how to convert OGG files to MP3, WAV, and other formats using Converto.",
  alternates: {
    canonical: `${siteUrl}/formats/ogg`,
  },
};

export default function OGGFormatPage() {
  return (
    <main className="min-h-screen bg-[#151233] text-white">
      <div className="mx-auto max-w-4xl px-4 py-14">

        <h1 className="text-4xl font-bold">OGG File Format</h1>

        <p className="mt-4 text-white/70">
          OGG is an open multimedia container format often used with the
          Vorbis audio codec. It is commonly used for streaming and games.
        </p>

        <h2 className="mt-10 text-2xl font-semibold">Common OGG conversions</h2>

        <div className="mt-6 flex flex-wrap gap-3">
          <Link href="/convert/ogg-to-mp3" className="rounded-full bg-white px-4 py-2 text-black">
            OGG → MP3
          </Link>

          <Link href="/convert/ogg-to-wav" className="rounded-full bg-white px-4 py-2 text-black">
            OGG → WAV
          </Link>
        </div>

      </div>
    </main>
  );
}