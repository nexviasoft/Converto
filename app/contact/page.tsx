import type { Metadata } from "next";
import Link from "next/link";

const siteUrl =
  process.env.NEXT_PUBLIC_SITE_URL?.replace(/\/$/, "") ||
  "https://converto.tools";

export const metadata: Metadata = {
  title: "Contact Converto",
  description:
    "Get in touch with Converto for support, feedback, or general questions.",
  alternates: {
    canonical: `${siteUrl}/contact`,
  },
  openGraph: {
    title: "Contact Converto",
    description:
      "Get in touch with Converto for support, feedback, or general questions.",
    url: `${siteUrl}/contact`,
    siteName: "Converto",
    type: "website",
  },
  twitter: {
    card: "summary",
    title: "Contact Converto",
    description:
      "Get in touch with Converto for support, feedback, or general questions.",
  },
};

export default function ContactPage() {
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
            Contact
          </div>

          <h1 className="mt-3 text-4xl font-semibold tracking-tight text-white">
            Contact Converto
          </h1>

          <p className="mt-4 max-w-3xl text-sm leading-7 text-white/70">
            For support, questions, feedback, or business-related inquiries,
            please contact us by email.
          </p>

          <div className="mt-8 space-y-6">
            <section className="rounded-3xl bg-white/6 p-6 ring-1 ring-white/10">
              <h2 className="text-xl font-semibold text-white">Support email</h2>
              <p className="mt-3 text-sm leading-7 text-white/70">
                Email:{" "}
                <a
                  href="mailto:support@converto.tools"
                  className="font-medium text-white underline underline-offset-4"
                >
                  support@converto.tools
                </a>
              </p>
            </section>

            <section className="rounded-3xl bg-white/6 p-6 ring-1 ring-white/10">
              <h2 className="text-xl font-semibold text-white">What you can contact us about</h2>
              <p className="mt-3 text-sm leading-7 text-white/70">
                You can reach us for general support, bug reports, conversion
                issues, feedback, or other questions related to Converto.
              </p>
            </section>

            <section className="rounded-3xl bg-white/6 p-6 ring-1 ring-white/10">
              <h2 className="text-xl font-semibold text-white">Response time</h2>
              <p className="mt-3 text-sm leading-7 text-white/70">
                We aim to respond as soon as reasonably possible.
              </p>
            </section>
          </div>

          <div className="mt-8 flex flex-wrap gap-3">
            <Link
              href="/"
              className="inline-flex rounded-full bg-white px-5 py-2.5 text-sm font-semibold text-black transition hover:bg-white/90"
            >
              Back to home
            </Link>

            <Link
              href="/about"
              className="inline-flex rounded-full bg-white/8 px-5 py-2.5 text-sm font-medium text-white/85 ring-1 ring-white/10 transition hover:bg-white/12 hover:text-white"
            >
              About
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
          </div>
        </div>
      </div>
    </main>
  );
}