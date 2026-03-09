import type { Metadata } from "next";
import Link from "next/link";

const siteUrl =
  process.env.NEXT_PUBLIC_SITE_URL?.replace(/\/$/, "") ||
  "https://converto.tools";

export const metadata: Metadata = {
  title: "AAC File Format",
  description:
    "Learn about the AAC audio format and how to convert AAC files to MP3, WAV, and other formats with Converto.",
  alternates: {
    canonical: `${siteUrl}/formats/aac`,
  },
};

export default function AACFormatPage() {
  return (
    <main className="min-h-screen bg-[#151233] text-white">
      <div className="mx-auto max-w-4xl px-4 py-14">

        <h1 className="text-4xl font-bold">AAC File Format</h1>

        <p className="mt-4 text-white/70">
          AAC (Advanced Audio Coding) is a modern lossy audio format designed
          to provide better sound quality than MP3 at similar bitrates.
        </p>

        <h2 className="mt-10 text-2xl font-semibold">Common AAC conversions</h2>

        <div className="mt-6 flex flex-wrap gap-3">
          <Link href="/convert/aac-to-mp3" className="rounded-full bg-white px-4 py-2 text-black">
            AAC → MP3
          </Link>

          <Link href="/convert/aac-to-wav" className="rounded-full bg-white px-4 py-2 text-black">
            AAC → WAV
          </Link>
        </div>

      </div>
    </main>
  );
}