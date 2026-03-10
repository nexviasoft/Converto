import type { Metadata } from "next";
import Link from "next/link";

const siteUrl =
  process.env.NEXT_PUBLIC_SITE_URL?.replace(/\/$/, "") ||
  "https://converto.tools";

export const metadata: Metadata = {
  title: "GIF File Format",
  description:
    "Learn about the GIF format and how to convert GIF files to MP4 and other formats using Converto.",
  alternates: {
    canonical: `${siteUrl}/formats/gif`,
  },
};

export default function GIFFormatPage() {
  return (
    <main className="min-h-screen bg-[#151233] text-white">
      <div className="mx-auto max-w-4xl px-4 py-14">

        <h1 className="text-4xl font-bold">GIF File Format</h1>

        <p className="mt-4 text-white/70">
          GIF (Graphics Interchange Format) is a lightweight animated image
          format commonly used for short looping animations on the web.
        </p>

        <h2 className="mt-10 text-2xl font-semibold">
          Common GIF conversions
        </h2>

        <div className="mt-6 flex flex-wrap gap-3">
          <Link
            href="/convert/gif-to-mp4"
            className="rounded-full bg-white px-4 py-2 text-black"
          >
            GIF → MP4
          </Link>

          <Link
            href="/convert/mp4-to-gif"
            className="rounded-full bg-white px-4 py-2 text-black"
          >
            MP4 → GIF
          </Link>
        </div>

      </div>
    </main>
  );
}