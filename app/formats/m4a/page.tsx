import type { Metadata } from "next";
import Link from "next/link";

const siteUrl =
  process.env.NEXT_PUBLIC_SITE_URL?.replace(/\/$/, "") ||
  "https://converto.tools";

export const metadata: Metadata = {
  title: "M4A File Format",
  description:
    "Learn about the M4A audio format and how to convert M4A files to MP3, WAV, and other formats using Converto.",
  alternates: {
    canonical: `${siteUrl}/formats/m4a`,
  },
};

export default function M4AFormatPage() {
  return (
    <main className="min-h-screen bg-[#151233] text-white">
      <div className="mx-auto max-w-4xl px-4 py-14">

        <h1 className="text-4xl font-bold">M4A File Format</h1>

        <p className="mt-4 text-white/70">
          M4A is an audio format commonly used by Apple devices and software.
          It usually contains AAC encoded audio inside an MPEG-4 container.
        </p>

        <h2 className="mt-10 text-2xl font-semibold">Common M4A conversions</h2>

        <div className="mt-6 flex flex-wrap gap-3">
          <Link href="/convert/m4a-to-mp3" className="rounded-full bg-white px-4 py-2 text-black">
            M4A → MP3
          </Link>

          <Link href="/convert/m4a-to-wav" className="rounded-full bg-white px-4 py-2 text-black">
            M4A → WAV
          </Link>
        </div>

      </div>
    </main>
  );
}