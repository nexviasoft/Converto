import { SITE_URL } from "@/lib/siteUrl";
import type { Metadata } from "next";
import Link from "next/link";
import SimpleTopBar from "@/components/layout/SimpleTopBar";
import Footer from "@/components/landing/Footer";


export const metadata: Metadata = {
  title: "Privacy Policy",
  description:
    "Learn how Converto handles files, temporary processing, analytics, cookies, advertising, and support messages.",
  alternates: { canonical: `${SITE_URL}/privacy` },
};

const sections = [
  {
    title: "Files & processing",
    body: [
      "Converto is designed for temporary file conversion, not long-term file storage.",
      "Browser-based conversions are handled locally where possible. Server-assisted conversions may temporarily upload files only for the purpose of completing the requested conversion.",
      "Do not upload sensitive files if you are not comfortable processing them through an online tool.",
    ],
  },
  {
    title: "Temporary storage",
    body: [
      "Files used for server-side conversion are intended to be short-lived and removed after processing or after a limited retention window.",
      "Converto does not position itself as a cloud drive, archive, or backup service. Keep your own backups before converting important files.",
    ],
  },
  {
    title: "Analytics and product diagnostics",
    body: [
      "We may collect limited technical information such as browser type, device type, page usage, error states, performance data, and approximate usage patterns.",
      "This data helps keep the service stable, understand which conversion routes are useful, and improve the product experience.",
    ],
  },
  {
    title: "Cookies and advertising",
    body: [
      "Converto may use cookies or similar technologies for analytics, basic preferences, security, and advertising support.",
      "If ads are enabled, third-party advertising partners such as Google may use cookies or identifiers to show and measure ads. Users can manage ad personalization through their browser and Google ad settings.",
      "For regions that require consent, a proper consent management setup should be enabled before serving personalized advertising.",
    ],
  },
  {
    title: "Accounts, payments, and Pro features",
    body: [
      "If account, waitlist, or payment features are enabled, Converto may process the information needed to provide those features, such as email address, account identifiers, plan status, and billing provider responses.",
      "Payment card details should be handled by the payment provider, not stored directly by Converto.",
    ],
  },
  {
    title: "Contact and support",
    body: [
      "If you contact support, we may use your email address and message content to reply and troubleshoot the issue you reported.",
      "Support email: support@converto.tools",
    ],
  },
];

export default function PrivacyPage() {
  return (
    <>
      <SimpleTopBar shellMax="max-w-[1320px]" />
      <main className="min-h-screen bg-[#151233] text-white">
      <div className="pointer-events-none fixed inset-0 -z-10">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,rgba(168,85,247,0.22),transparent_60%),radial-gradient(ellipse_at_bottom,rgba(59,130,246,0.18),transparent_55%),radial-gradient(ellipse_at_center,rgba(255,255,255,0.08),transparent_45%)]" />
        <div className="absolute inset-0 opacity-20 [background:linear-gradient(to_right,rgba(255,255,255,0.045)_1px,transparent_1px),linear-gradient(to_bottom,rgba(255,255,255,0.045)_1px,transparent_1px)] [background-size:72px_72px]" />
      </div>

      <div className="mx-auto max-w-3xl px-4 py-14">
        <Link href="/" className="text-sm text-white/70 transition hover:text-white">
          ← Back to home
        </Link>

        <h1 className="mt-4 text-3xl font-semibold">Privacy Policy</h1>
        <p className="mt-2 text-sm leading-6 text-white/70">
          We keep data collection focused on running the converter, improving reliability, and supporting the free service.
        </p>

        <div className="mt-8 space-y-6">
          {sections.map((section) => (
            <section key={section.title} className="rounded-3xl bg-white/10 p-6 ring-1 ring-white/10">
              <h2 className="text-lg font-semibold">{section.title}</h2>
              <div className="mt-3 space-y-3 text-sm leading-6 text-white/70">
                {section.body.map((item) => (
                  <p key={item}>{item}</p>
                ))}
              </div>
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
