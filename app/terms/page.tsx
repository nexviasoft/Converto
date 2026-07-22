import { SITE_URL } from "@/lib/siteUrl";
import type { Metadata } from "next";
import Link from "next/link";
import SimpleTopBar from "@/components/layout/SimpleTopBar";
import Footer from "@/components/landing/Footer";


export const metadata: Metadata = {
  title: "Terms of Service",
  description:
    "Read the Converto terms covering acceptable use, user responsibility, file rights, service limits, and disclaimers.",
  alternates: { canonical: `${SITE_URL}/terms` },
};

const sections = [
  {
    title: "Acceptable use",
    items: [
      "Do not upload illegal, harmful, abusive, or infringing content.",
      "Do not upload files you do not have the right to process.",
      "Do not attempt to overload, scrape, reverse engineer, attack, or disrupt the service.",
      "Do not use Converto to create or distribute malware, spam, or deceptive content.",
    ],
  },
  {
    title: "User responsibility",
    items: [
      "You are responsible for the files you upload and the outputs you download.",
      "You must make sure you have the necessary rights and permissions to convert each file.",
      "Keep backups of important files before converting them.",
    ],
  },
  {
    title: "Service limits",
    items: [
      "Free usage may include limits such as file size, conversion count, queue priority, rate limits, and supported formats.",
      "Converto may change limits, disable routes, or pause features to protect stability and prevent abuse.",
      "Optional paid features may be added, changed, or limited before their public release.",
    ],
  },
  {
    title: "Advertising and third-party services",
    items: [
      "The free service may be supported by advertising.",
      "Converto may use third-party services for analytics, authentication, payments, hosting, conversion infrastructure, or advertising.",
      "Third-party services may have their own terms and privacy practices.",
    ],
  },
  {
    title: "Disclaimer",
    items: [
      "Conversions are provided as is, without a guarantee that every file, codec, layout, or output will work perfectly.",
      "Output quality, metadata, timing, transparency, fonts, and compatibility may vary by source file and target format.",
      "Converto is not responsible for data loss, corrupted source files, unsupported codecs, or user misuse.",
    ],
  },
  {
    title: "Contact",
    items: ["Support email: support@converto.tools"],
  },
];

export default function TermsPage() {
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

        <h1 className="mt-4 text-3xl font-semibold">Terms of Service</h1>
        <p className="mt-2 text-sm leading-6 text-white/70">
          By using Converto, you agree to use the service responsibly and only process files you have the right to convert.
        </p>

        <div className="mt-8 space-y-6">
          {sections.map((section) => (
            <section key={section.title} className="rounded-3xl bg-white/10 p-6 ring-1 ring-white/10">
              <h2 className="text-lg font-semibold">{section.title}</h2>
              <ul className="mt-3 list-disc space-y-2 pl-5 text-sm leading-6 text-white/70">
                {section.items.map((item) => (
                  <li key={item}>{item}</li>
                ))}
              </ul>
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
