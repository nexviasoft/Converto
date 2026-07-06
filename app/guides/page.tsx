import type { Metadata } from "next";
import Link from "next/link";
import SimpleTopBar from "@/components/layout/SimpleTopBar";
import Footer from "@/components/landing/Footer";
import { allEditorialGuides } from "@/lib/editorialGuides";

const siteUrl = process.env.NEXT_PUBLIC_SITE_URL?.replace(/\/$/, "") || "https://www.converto.tools";

export const metadata: Metadata = {
  title: "File Conversion Guides",
  description: "Practical guides to file privacy, audio settings, image compression, and choosing better conversion outputs.",
  alternates: { canonical: `${siteUrl}/guides` },
  openGraph: {
    title: "File Conversion Guides | Converto",
    description: "Practical guides to file privacy, audio settings, image compression, and choosing better conversion outputs.",
    url: `${siteUrl}/guides`,
    siteName: "Converto",
    type: "website",
  },
};

export default function GuidesPage() {
  return (
    <>
      <SimpleTopBar shellMax="max-w-[1320px]" />
      <main className="min-h-screen bg-[#151233] bg-[radial-gradient(circle_at_12%_0%,rgba(139,92,246,0.20),transparent_34%),radial-gradient(circle_at_90%_20%,rgba(59,130,246,0.14),transparent_34%)] px-4 py-14 text-white sm:px-6 lg:px-8">
        <div className="mx-auto max-w-6xl">
          <div className="max-w-3xl">
            <div className="text-[11px] font-semibold uppercase tracking-[0.22em] text-violet-200/70">Converto resources</div>
            <h1 className="mt-4 text-4xl font-semibold tracking-tight sm:text-5xl">Practical file conversion guides</h1>
            <p className="mt-5 text-base leading-8 text-white/66">Understand file handling, choose sensible audio settings, and pick image formats based on real workflow needs—not just the largest quality number or newest extension.</p>
          </div>

          <div className="mt-10 grid gap-5 lg:grid-cols-3">
            {allEditorialGuides.map((guide, index) => (
              <article key={guide.slug} className="group relative overflow-hidden rounded-[30px] border border-violet-300/16 bg-[#201b46]/72 p-6 shadow-[0_24px_80px_rgba(8,6,28,0.34)] transition duration-300 hover:-translate-y-1 hover:border-violet-200/28 hover:bg-[#261f52]/78">
                <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_90%_4%,rgba(168,85,247,0.20),transparent_32%)]" />
                <div className="relative">
                  <div className="flex items-center justify-between gap-3">
                    <span className="rounded-full border border-white/10 bg-white/[0.06] px-3 py-1 text-[10px] font-semibold uppercase tracking-[0.16em] text-white/54">Guide 0{index + 1}</span>
                    <span className="text-xs text-white/40">{guide.readingTime}</span>
                  </div>
                  <h2 className="mt-5 text-2xl font-semibold tracking-tight text-white">{guide.shortTitle}</h2>
                  <p className="mt-4 text-sm leading-7 text-white/62">{guide.summary}</p>
                  <ul className="mt-5 grid gap-2 text-xs leading-5 text-white/58">
                    {guide.highlights.slice(0, 2).map((item) => (
                      <li key={item} className="flex gap-2"><span className="mt-2 h-1.5 w-1.5 shrink-0 rounded-full bg-violet-300" /><span>{item}</span></li>
                    ))}
                  </ul>
                  <Link href={`/guides/${guide.slug}`} className="mt-6 inline-flex items-center gap-2 rounded-full bg-white px-4 py-2.5 text-sm font-semibold text-black transition hover:bg-white/90">
                    Read guide <span aria-hidden="true">→</span>
                  </Link>
                </div>
              </article>
            ))}
          </div>

          <section className="mt-8 rounded-[30px] border border-white/10 bg-white/[0.06] p-6 sm:p-8">
            <h2 className="text-2xl font-semibold tracking-tight">Use the guides with the tools</h2>
            <p className="mt-3 max-w-3xl text-sm leading-7 text-white/64">The guides explain decisions that happen before and after conversion. When you know the target format and settings, open the converter or browse format-specific pages for route details.</p>
            <div className="mt-5 flex flex-wrap gap-3">
              <Link href="/converter" className="rounded-full bg-white px-5 py-2.5 text-sm font-semibold text-black">Open converter</Link>
              <Link href="/formats" className="rounded-full border border-white/10 bg-white/[0.06] px-5 py-2.5 text-sm font-semibold text-white/78 transition hover:bg-white/[0.10] hover:text-white">Browse format guides</Link>
              <Link href="/compare" className="rounded-full border border-white/10 bg-white/[0.06] px-5 py-2.5 text-sm font-semibold text-white/78 transition hover:bg-white/[0.10] hover:text-white">Compare formats</Link>
            </div>
          </section>
        </div>
      </main>
      <Footer />
    </>
  );
}
