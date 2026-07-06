import type { Metadata } from "next";
import Link from "next/link";
import SimpleTopBar from "@/components/layout/SimpleTopBar";
import Footer from "@/components/landing/Footer";

const siteUrl =
  process.env.NEXT_PUBLIC_SITE_URL?.replace(/\/$/, "") ||
  "https://www.converto.tools";

export const metadata: Metadata = {
  title: "Cookie Notice",
  description:
    "Learn how Converto may use cookies, analytics, advertising identifiers, and local browser storage.",
  alternates: { canonical: `${siteUrl}/cookies` },
};

export default function CookiesPage() {
  return (
    <>
      <SimpleTopBar shellMax="max-w-[1320px]" />
      <main className="min-h-screen bg-[#151233] text-white">
      <div className="mx-auto max-w-3xl px-4 py-14">
        <Link href="/" className="text-sm text-white/70 transition hover:text-white">
          ← Back to home
        </Link>

        <h1 className="mt-4 text-3xl font-semibold">Cookie Notice</h1>
        <p className="mt-2 text-sm leading-6 text-white/70">
          Converto may use cookies, local browser storage, and similar technologies to run the service, remember basic preferences, measure performance, and support advertising.
        </p>

        <div className="mt-8 space-y-6">
          {[
            {
              title: "Essential storage",
              body: "Used for basic product behavior such as remembering temporary UI states, quota counters, and safe conversion flow preferences.",
            },
            {
              title: "Analytics and diagnostics",
              body: "Used to understand product performance, errors, page usage, and conversion route popularity so the service can be improved.",
            },
            {
              title: "Advertising",
              body: "If ads are enabled, advertising partners may use cookies or identifiers to serve, personalize, limit, and measure ads. In regions that require consent, a consent management setup should be enabled before personalized advertising is served.",
            },
            {
              title: "Managing cookies",
              body: "You can control cookies through your browser settings. Blocking some technologies may affect analytics, ads, or parts of the conversion experience.",
            },
          ].map((section) => (
            <section key={section.title} className="rounded-3xl bg-white/10 p-6 ring-1 ring-white/10">
              <h2 className="text-lg font-semibold">{section.title}</h2>
              <p className="mt-3 text-sm leading-6 text-white/70">{section.body}</p>
            </section>
          ))}

          <p className="text-xs text-white/50">Last updated: July 2026</p>
        </div>
      </div>
      </main>
      <Footer />
    </>
  );
}
