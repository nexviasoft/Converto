import type { Metadata } from "next";
import Link from "next/link";

const siteUrl =
  process.env.NEXT_PUBLIC_SITE_URL?.replace(/\/$/, "") ||
  "https://converto.tools";

export const metadata: Metadata = {
  title: "MP4 vs MOV",
  description:
    "Compare MP4 vs MOV for compatibility, quality, file size, and editing workflows. Learn when to use each format and convert between them with Converto.",
  alternates: {
    canonical: `${siteUrl}/compare/mp4-vs-mov`,
  },
  openGraph: {
    title: "MP4 vs MOV | Converto",
    description:
      "Compare MP4 vs MOV for compatibility, editing, and playback.",
    url: `${siteUrl}/compare/mp4-vs-mov`,
    siteName: "Converto",
    type: "article",
  },
  twitter: {
    card: "summary_large_image",
    title: "MP4 vs MOV | Converto",
    description:
      "Compare MP4 vs MOV for compatibility, editing, and playback.",
  },
};

export default function MP4VsMOVPage() {
  return (
    <main className="min-h-screen bg-[#151233] text-white">
      <div className="mx-auto max-w-5xl px-4 py-14">
        <h1 className="text-4xl font-bold">MP4 vs MOV</h1>

        <p className="mt-4 text-white/70">
          MP4 and MOV are both popular video container formats, but they are
          often used in slightly different workflows. MP4 is the more universal
          option for sharing and playback, while MOV is closely associated with
          Apple and professional editing environments.
        </p>

        <div className="mt-8 flex flex-wrap gap-3">
          <Link
            href="/convert/mp4-to-mov"
            className="rounded-full bg-white px-5 py-2.5 text-black"
          >
            Convert MP4 to MOV
          </Link>

          <Link
            href="/convert/mov-to-mp4"
            className="rounded-full bg-white/10 px-5 py-2.5"
          >
            Convert MOV to MP4
          </Link>
        </div>

        <section className="mt-10 grid gap-6 md:grid-cols-2">
          <div className="rounded-xl bg-white/10 p-6">
            <h2 className="text-2xl font-semibold">What is MP4?</h2>
            <p className="mt-3 text-white/70">
              MP4 is one of the most widely supported video formats. It works
              well on phones, laptops, browsers, social platforms, and media
              players, which makes it the default choice for many people.
            </p>

            <ul className="mt-4 space-y-2 text-sm text-white/70">
              <li>• Excellent cross-platform compatibility</li>
              <li>• Great for sharing and playback</li>
              <li>• Common web and device format</li>
            </ul>
          </div>

          <div className="rounded-xl bg-white/10 p-6">
            <h2 className="text-2xl font-semibold">What is MOV?</h2>
            <p className="mt-3 text-white/70">
              MOV is a multimedia container format developed by Apple for
              QuickTime. It is often used in editing workflows and Apple-based
              environments where preserving quality and compatibility with
              certain tools matters.
            </p>

            <ul className="mt-4 space-y-2 text-sm text-white/70">
              <li>• Strong Apple ecosystem support</li>
              <li>• Common in editing workflows</li>
              <li>• Can be larger depending on content and settings</li>
            </ul>
          </div>
        </section>

        <section className="mt-10">
          <h2 className="text-2xl font-semibold">MP4 vs MOV: Key Differences</h2>

          <div className="mt-6 grid grid-cols-3 overflow-hidden rounded-xl border border-white/10 text-sm">
            <div className="bg-white/10 p-4 font-semibold">Feature</div>
            <div className="bg-white/10 p-4 font-semibold">MP4</div>
            <div className="bg-white/10 p-4 font-semibold">MOV</div>

            <div className="p-4">Compatibility</div>
            <div className="p-4">Very high</div>
            <div className="p-4">High, especially on Apple</div>

            <div className="p-4">Best use</div>
            <div className="p-4">Sharing, playback, uploads</div>
            <div className="p-4">Editing, Apple workflows</div>

            <div className="p-4">Portability</div>
            <div className="p-4">Usually better</div>
            <div className="p-4">Sometimes heavier</div>

            <div className="p-4">Editing friendliness</div>
            <div className="p-4">Good</div>
            <div className="p-4">Often stronger in pro workflows</div>

            <div className="p-4">General audience use</div>
            <div className="p-4">Very common</div>
            <div className="p-4">More niche but important</div>
          </div>
        </section>

        <section className="mt-10 grid gap-6 md:grid-cols-2">
          <div className="rounded-xl bg-white/10 p-6">
            <h2 className="text-xl font-semibold">When to use MP4</h2>
            <p className="mt-3 text-white/70">
              Use MP4 when you want easy sharing, wide compatibility, smaller
              friction across devices, and a format that works almost
              everywhere.
            </p>
          </div>

          <div className="rounded-xl bg-white/10 p-6">
            <h2 className="text-xl font-semibold">When to use MOV</h2>
            <p className="mt-3 text-white/70">
              Use MOV when you work with Apple devices, QuickTime-based tools,
              or editing pipelines where MOV is the more natural fit.
            </p>
          </div>
        </section>

        <section className="mt-10 rounded-xl bg-white/10 p-6">
          <h2 className="text-2xl font-semibold">Convert between MP4 and MOV</h2>

          <p className="mt-3 text-white/70">
            Convert MOV to MP4 when you need broader compatibility. Convert MP4
            to MOV when you want an Apple-friendly or workflow-specific output.
          </p>

          <div className="mt-6 flex flex-wrap gap-3">
            <Link
              href="/convert/mov-to-mp4"
              className="rounded-full bg-white px-5 py-2 text-black"
            >
              MOV to MP4
            </Link>

            <Link
              href="/convert/mp4-to-mov"
              className="rounded-full bg-white/10 px-5 py-2"
            >
              MP4 to MOV
            </Link>

            <Link
              href="/formats/mp4"
              className="rounded-full bg-white/10 px-5 py-2"
            >
              MP4 format guide
            </Link>

            <Link
              href="/formats/mov"
              className="rounded-full bg-white/10 px-5 py-2"
            >
              MOV format guide
            </Link>
          </div>
        </section>
      </div>
    </main>
  );
}