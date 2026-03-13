import type { Metadata } from "next";
import Link from "next/link";

const siteUrl =
  process.env.NEXT_PUBLIC_SITE_URL?.replace(/\/$/, "") ||
  "https://converto.tools";

export const metadata: Metadata = {
  title: "About Converto",
  description:
    "Learn more about Converto, a simple online file converter for audio, video, and image formats.",
  alternates: {
    canonical: `${siteUrl}/about`,
  },
  openGraph: {
    title: "About Converto",
    description:
      "Learn more about Converto, a simple online file converter for audio, video, and image formats.",
    url: `${siteUrl}/about`,
    siteName: "Converto",
    type: "website",
  },
  twitter: {
    card: "summary",
    title: "About Converto",
    description:
      "Learn more about Converto, a simple online file converter for audio, video, and image formats.",
  },
};

export default function AboutPage() {
  return (
    <main className="min-h-screen bg-[#151233] px-4 py-16 text-white">
      <div className="mx-auto max-w-4xl">
        <Link
          href="/"
          className="inline-flex text-sm text-white/70 transition hover:text-white"
        >
          ← Back to home
        </Link>

        <div className="mt-6 rounded-[28px] bg-white/10 p-8 ring-1 ring-white/10 shadow-[0_18px_55px_rgba(0,0,0,0.25)]">
          <div className="text-[11px] font-semibold uppercase tracking-[0.18em] text-white/45">
            About
          </div>

          <h1 className="mt-3 text-4xl font-semibold tracking-tight text-white">
            About Converto
          </h1>

          <p className="mt-4 max-w-3xl text-sm leading-7 text-white/70">
            Converto is a simple online file converter built for fast everyday
            use. It helps users convert common audio, video, and image formats
            through a clean browser-based workflow without unnecessary steps.
          </p>

          <div className="mt-8 space-y-6">
            <section className="rounded-3xl bg-white/6 p-6 ring-1 ring-white/10">
              <h2 className="text-xl font-semibold text-white">What Converto does</h2>
              <p className="mt-3 text-sm leading-7 text-white/70">
                Converto is designed for practical format conversion tasks such
                as extracting audio from video, changing playback formats,
                improving compatibility across devices, and handling lightweight
                media conversion workflows directly online.
              </p>
            </section>

            <section className="rounded-3xl bg-white/6 p-6 ring-1 ring-white/10">
              <h2 className="text-xl font-semibold text-white">Our goal</h2>
              <p className="mt-3 text-sm leading-7 text-white/70">
                The goal of Converto is to make file conversion easy to
                understand and easy to use. We focus on a straightforward
                interface, common format support, and a workflow that feels fast
                and accessible for regular users.
              </p>
            </section>

            <section className="rounded-3xl bg-white/6 p-6 ring-1 ring-white/10">
              <h2 className="text-xl font-semibold text-white">Privacy and simplicity</h2>
              <p className="mt-3 text-sm leading-7 text-white/70">
                We aim to keep the service simple and transparent. Related
                information about data handling, terms, and support can be found
                on our Privacy Policy and Terms pages.
              </p>
            </section>
          </div>

          <div className="mt-8 flex flex-wrap gap-3">
            <Link
              href="/converter"
              className="inline-flex rounded-full bg-white px-5 py-2.5 text-sm font-semibold text-black transition hover:bg-white/90"
            >
              Open converter
            </Link>

            <Link
              href="/privacy"
              className="inline-flex rounded-full bg-white/8 px-5 py-2.5 text-sm font-medium text-white/85 ring-1 ring-white/10 transition hover:bg-white/12 hover:text-white"
            >
              Privacy Policy
            </Link>

            <Link
              href="/terms"
              className="inline-flex rounded-full bg-white/8 px-5 py-2.5 text-sm font-medium text-white/85 ring-1 ring-white/10 transition hover:bg-white/12 hover:text-white"
            >
              Terms
            </Link>

            <Link
              href="/contact"
              className="inline-flex rounded-full bg-white/8 px-5 py-2.5 text-sm font-medium text-white/85 ring-1 ring-white/10 transition hover:bg-white/12 hover:text-white"
            >
              Contact
            </Link>
          </div>
        </div>
      </div>
    </main>
  );
}