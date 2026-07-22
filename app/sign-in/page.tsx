import { SITE_URL } from "@/lib/siteUrl";
import type { Metadata } from "next";
import Link from "next/link";
import SimpleTopBar from "@/components/layout/SimpleTopBar";
import Footer from "@/components/landing/Footer";
import { redirect } from "next/navigation";
import { SIGN_IN_PUBLIC } from "@/lib/siteReadiness";


export const metadata: Metadata = {
  title: "Sign in",
  description:
    "Sign in to Converto. Account access is being prepared and free conversions do not require an account.",
  alternates: {
    canonical: `${SITE_URL}/sign-in`,
  },
  robots: {
    index: false,
    follow: true,
    googleBot: {
      index: false,
      follow: true,
    },
  },
};

export default function SignInPage() {
  if (!SIGN_IN_PUBLIC) redirect("/converter");

  return (
    <>
      <SimpleTopBar shellMax="max-w-[1320px]" />
      <main className="min-h-screen bg-[#151233] px-4 py-16 text-white">
      <div className="mx-auto max-w-4xl">
        <Link
          href="/"
          className="inline-flex text-sm text-white/70 transition hover:text-white"
        >
          ← Back to home
        </Link>

        <div className="mt-6 overflow-hidden rounded-[28px] bg-white/10 ring-1 ring-white/10 shadow-[0_18px_55px_rgba(0,0,0,0.25)]">
          <div className="grid gap-0 md:grid-cols-[1.05fr_0.95fr]">
            <section className="p-8 sm:p-10">
              <div className="text-[11px] font-semibold uppercase tracking-[0.18em] text-white/45">
                Account access
              </div>

              <h1 className="mt-3 text-4xl font-semibold tracking-tight text-white">
                Sign in is coming soon
              </h1>

              <p className="mt-4 max-w-2xl text-sm leading-7 text-white/70">
                Converto does not require an account for free everyday file
                conversions. Account access is being prepared for future Pro
                features such as higher limits, saved preferences, and advanced
                workflows.
              </p>

              <div className="mt-8 grid gap-3 sm:grid-cols-2">
                <div className="rounded-3xl bg-white/6 p-5 ring-1 ring-white/10">
                  <h2 className="text-base font-semibold text-white">
                    No sign-in needed
                  </h2>
                  <p className="mt-2 text-sm leading-6 text-white/65">
                    Open the converter and start with the free tools right away.
                  </p>
                </div>

                <div className="rounded-3xl bg-white/6 p-5 ring-1 ring-white/10">
                  <h2 className="text-base font-semibold text-white">
                    Pro accounts later
                  </h2>
                  <p className="mt-2 text-sm leading-6 text-white/65">
                    Paid account features will be enabled after the billing and
                    authentication flow is fully ready.
                  </p>
                </div>
              </div>

              <div className="mt-8 flex flex-wrap gap-3">
                <Link
                  href="/converter"
                  className="inline-flex rounded-full bg-white px-5 py-2.5 text-sm font-semibold text-black transition hover:bg-white/90"
                >
                  Open converter
                </Link>

                <Link
                  href="/pro"
                  className="inline-flex rounded-full bg-white/8 px-5 py-2.5 text-sm font-medium text-white/85 ring-1 ring-white/10 transition hover:bg-white/12 hover:text-white"
                >
                  View Pro plans
                </Link>
              </div>
            </section>

            <aside className="border-t border-white/10 bg-black/16 p-8 sm:p-10 md:border-l md:border-t-0">
              <div className="rounded-3xl bg-[#070614]/60 p-6 ring-1 ring-white/10">
                <div className="flex items-center gap-3">
                  <img
                    src="/brand/converto-logo.svg"
                    alt="Converto logo"
                    className="h-10 w-10 object-contain"
                  />
                  <div>
                    <div className="text-sm font-semibold text-white">
                      Converto
                    </div>
                    <div className="text-xs text-white/55">by NexviaSoft</div>
                  </div>
                </div>

                <div className="mt-6 space-y-3 text-sm leading-6 text-white/70">
                  <p>
                    Free conversions stay available without login while account
                    features are in development.
                  </p>
                  <p>
                    For questions, support, or business inquiries, contact the
                    Converto team.
                  </p>
                </div>

                <div className="mt-6 flex flex-wrap gap-2">
                  <Link
                    href="/contact"
                    className="rounded-full bg-white/8 px-4 py-2 text-sm font-medium text-white/85 ring-1 ring-white/10 transition hover:bg-white/12 hover:text-white"
                  >
                    Contact
                  </Link>
                  <Link
                    href="/privacy"
                    className="rounded-full bg-white/8 px-4 py-2 text-sm font-medium text-white/85 ring-1 ring-white/10 transition hover:bg-white/12 hover:text-white"
                  >
                    Privacy
                  </Link>
                </div>
              </div>
            </aside>
          </div>
        </div>
      </div>
      </main>
      <Footer />
    </>
  );
}
