import type { Metadata } from "next";
import Link from "next/link";

const siteUrl =
  process.env.NEXT_PUBLIC_SITE_URL?.replace(/\/$/, "") ||
  "https://converto.tools";

export const metadata: Metadata = {
  title: "MOV File Format",
  description:
    "Learn about the MOV video format and how to convert MOV files to MP4, GIF, and other formats with Converto.",
  alternates: {
    canonical: `${siteUrl}/formats/mov`,
  },
};

export default function MOVFormatPage() {
  return (
    <main className="min-h-screen bg-[#151233] text-white">
      <div className="mx-auto max-w-4xl px-4 py-14">

        <h1 className="text-4xl font-bold">MOV File Format</h1>

        <p className="mt-4 text-white/70">
          MOV is a video container format developed by Apple and commonly used
          by QuickTime. It supports high-quality video and audio tracks and is
          widely used in professional editing workflows.
        </p>

        <h2 className="mt-10 text-2xl font-semibold">
          Common MOV conversions
        </h2>

        <div className="mt-6 flex flex-wrap gap-3">
          <Link
            href="/convert/mov-to-mp4"
            className="rounded-full bg-white px-4 py-2 text-black"
          >
            MOV → MP4
          </Link>

          <Link
            href="/convert/mov-to-gif"
            className="rounded-full bg-white px-4 py-2 text-black"
          >
            MOV → GIF
          </Link>
        </div>

      </div>
    </main>
  );
}