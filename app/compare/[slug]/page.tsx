import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { allCompareItems, compareData } from "@/lib/compareData";
import AdUnit from "@/components/ads/AdUnit";
import SimpleTopBar from "@/components/layout/SimpleTopBar";
import Footer from "@/components/landing/Footer";
import AdsterraNativeBanner from "@/components/ads/AdsterraNativeBanner";
import { AD_SLOTS, hasRailAdSlots } from "@/lib/adsConfig";
import { isSupportedConversionHref } from "@/lib/conversionRules";

type PageProps = {
  params: Promise<{
    slug: string;
  }>;
};

const siteUrl =
  process.env.NEXT_PUBLIC_SITE_URL?.replace(/\/$/, "") ||
  "https://www.converto.tools";

export function generateStaticParams() {
  return allCompareItems.map((item) => ({
    slug: item.slug,
  }));
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const resolvedParams = await params;
  const data = compareData[resolvedParams.slug];

  if (!data) {
    return {
      title: "Comparison not found | Converto",
      description: "The requested comparison page does not exist.",
      robots: {
        index: false,
        follow: false,
      },
    };
  }

  return {
    title: `${data.metaTitle} | Converto`,
    description: data.metaDescription,
    alternates: {
      canonical: `${siteUrl}/compare/${data.slug}`,
    },
    openGraph: {
      title: `${data.metaTitle} | Converto`,
      description: data.metaDescription,
      url: `${siteUrl}/compare/${data.slug}`,
      siteName: "Converto",
      type: "article",
    },
    twitter: {
      card: "summary_large_image",
      title: `${data.metaTitle} | Converto`,
      description: data.metaDescription,
    },
  };
}

function pickWinner(rows: { feature: string; leftValue: string; rightValue: string }[]) {
  const leftWins = rows.filter((row) => {
    const l = row.leftValue.toLowerCase();
    const r = row.rightValue.toLowerCase();
    return (
      l.includes("excellent") ||
      l.includes("very high") ||
      l.includes("often better") ||
      l.includes("smaller") ||
      l.includes("lossless")
    ) && !r.includes("excellent");
  }).length;

  const rightWins = rows.filter((row) => {
    const l = row.leftValue.toLowerCase();
    const r = row.rightValue.toLowerCase();
    return (
      r.includes("excellent") ||
      r.includes("very high") ||
      r.includes("often better") ||
      r.includes("smaller") ||
      r.includes("lossless")
    ) && !l.includes("excellent");
  }).length;

  if (leftWins === rightWins) return "It depends on your workflow.";
  return leftWins > rightWins ? "Left format has the edge overall." : "Right format has the edge overall.";
}

function practicalDecision(left: string, right: string) {
  return `Choose ${left} when its strengths match your workflow. Choose ${right} when portability, compatibility, editing fit, compression, or delivery needs point the other way.`;
}

function AdRailShell({ slot }: { slot: string }) {
  return <AdUnit slot={slot} sticky className="w-full" density="normal" />;
}

export default async function CompareDetailPage({ params }: PageProps) {
  const resolvedParams = await params;
  const data = compareData[resolvedParams.slug];

  if (!data) notFound();

  const supportedConversionLinks = data.conversionLinks.filter((item) =>
    isSupportedConversionHref(item.href),
  );

  const faqSchema = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: [
      {
        "@type": "Question",
        name: `What is the main difference between ${data.left} and ${data.right}?`,
        acceptedAnswer: {
          "@type": "Answer",
          text: data.intro,
        },
      },
      {
        "@type": "Question",
        name: `When should I use ${data.left}?`,
        acceptedAnswer: {
          "@type": "Answer",
          text: data.whenToUseLeft,
        },
      },
      {
        "@type": "Question",
        name: `When should I use ${data.right}?`,
        acceptedAnswer: {
          "@type": "Answer",
          text: data.whenToUseRight,
        },
      },
    ],
  };

  const overall = pickWinner(data.rows);
  const decisionText = practicalDecision(data.left, data.right);
  const railsReady = hasRailAdSlots();

  return (
    <>
      <SimpleTopBar shellMax="max-w-[1320px]" />
      <main className="relative isolate min-h-screen overflow-x-hidden bg-[#181337] bg-[radial-gradient(ellipse_at_top_left,rgba(139,92,246,0.22),transparent_52%),radial-gradient(ellipse_at_bottom_right,rgba(59,130,246,0.22),transparent_48%)] pt-4 text-white selection:bg-violet-300/25">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(faqSchema) }}
      />

      <div className="pointer-events-none fixed inset-0 z-0 overflow-hidden">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top_left,rgba(139,92,246,0.22),transparent_52%),radial-gradient(ellipse_at_bottom_right,rgba(59,130,246,0.22),transparent_48%),radial-gradient(ellipse_at_center,rgba(255,255,255,0.05),transparent_46%)]" />
        <div className="absolute inset-0 opacity-[0.14] [background:linear-gradient(to_right,rgba(255,255,255,0.04)_1px,transparent_1px),linear-gradient(to_bottom,rgba(255,255,255,0.04)_1px,transparent_1px)] [background-size:72px_72px]" />
      </div>

      <div className="relative z-10 mx-auto max-w-[1750px] px-4 py-10 sm:px-6 lg:px-8 lg:py-14">
        <div className={
          railsReady
            ? "grid items-start gap-6 xl:grid-cols-[270px_minmax(0,1fr)_270px] 2xl:grid-cols-[300px_minmax(0,1fr)_300px] xl:gap-8"
            : "grid items-start gap-6 xl:gap-8"
        }>
          {railsReady ? (
            <aside className="hidden xl:block">
              <AdRailShell slot={AD_SLOTS.LEFT_RAIL} />
            </aside>
          ) : null}

          <section className="min-w-0">
            <div className="mx-auto w-full max-w-[1120px]">
              <div className="relative overflow-hidden rounded-[34px] border border-violet-300/18 bg-[#282151]/72 p-8 shadow-[0_32px_110px_rgba(18,14,45,0.38)] sm:p-10">
                <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_top_right,rgba(139,92,246,0.28),transparent_26%),radial-gradient(circle_at_bottom_left,rgba(59,130,246,0.20),transparent_34%),linear-gradient(135deg,rgba(255,255,255,0.06),transparent_45%)]" />

                <div className="relative">
                  <div className="text-[11px] font-semibold uppercase tracking-[0.18em] text-violet-200/58">
                    Compare formats
                  </div>

                  <h1 className="mt-3 text-4xl font-bold tracking-tight sm:text-5xl">
                    {data.title}
                  </h1>

                  <p className="mt-4 max-w-3xl text-sm leading-7 text-white/70 sm:text-base">
                    {data.intro}
                  </p>

                  <div className="mt-6 flex flex-wrap gap-3">
                    <span className="rounded-full border border-violet-200/14 bg-violet-400/10 px-4 py-2 text-sm text-white/80">
                      Practical decision guide
                    </span>
                    <span className="rounded-full border border-violet-200/14 bg-violet-400/10 px-4 py-2 text-sm text-white/80">
                      Workflow-first comparison
                    </span>
                    <span className="rounded-full border border-violet-200/14 bg-violet-400/10 px-4 py-2 text-sm text-white/80">
                      Direct conversion links
                    </span>
                  </div>

                  <div className="mt-8 flex flex-wrap gap-3">
                    {supportedConversionLinks.map((item) => (
                      <Link
                        key={item.href}
                        href={item.href}
                        className="inline-flex rounded-full bg-gradient-to-r from-violet-500 to-blue-500 px-5 py-2.5 text-sm font-semibold text-white shadow-[0_14px_34px_rgba(99,102,241,0.24)] transition duration-300 hover:-translate-y-0.5 hover:shadow-[0_0_34px_rgba(139,92,246,0.38)]"
                      >
                        {item.label}
                      </Link>
                    ))}

                    <Link
                      href="/compare"
                      className="inline-flex rounded-full border border-violet-200/14 bg-white/[0.07] px-5 py-2.5 text-sm font-medium text-white/85 transition duration-300 hover:-translate-y-0.5 hover:border-violet-200/30 hover:bg-violet-400/14 hover:text-white"
                    >
                      Back to compare hub
                    </Link>
                  </div>
                </div>
              </div>

              <section className="mt-10 grid gap-6 md:grid-cols-2">
                <div className="rounded-[30px] border border-violet-200/14 bg-[#282151]/68 p-6 shadow-[0_24px_70px_rgba(18,14,45,0.28)]">
                  <h2 className="text-2xl font-semibold tracking-tight">
                    {data.leftSummaryTitle}
                  </h2>
                  <p className="mt-3 text-sm leading-7 text-white/70">
                    {data.leftSummary}
                  </p>

                  <ul className="mt-5 space-y-3">
                    {data.leftBullets.map((item) => (
                      <li
                        key={item}
                        className="rounded-[20px] border border-violet-200/12 bg-[#33296b]/55 px-4 py-3 text-sm leading-6 text-white/72 shadow-[inset_0_1px_0_rgba(255,255,255,0.04)]"
                      >
                        {item}
                      </li>
                    ))}
                  </ul>
                </div>

                <div className="rounded-[30px] border border-violet-200/14 bg-[#282151]/68 p-6 shadow-[0_24px_70px_rgba(18,14,45,0.28)]">
                  <h2 className="text-2xl font-semibold tracking-tight">
                    {data.rightSummaryTitle}
                  </h2>
                  <p className="mt-3 text-sm leading-7 text-white/70">
                    {data.rightSummary}
                  </p>

                  <ul className="mt-5 space-y-3">
                    {data.rightBullets.map((item) => (
                      <li
                        key={item}
                        className="rounded-[20px] border border-violet-200/12 bg-[#33296b]/55 px-4 py-3 text-sm leading-6 text-white/72 shadow-[inset_0_1px_0_rgba(255,255,255,0.04)]"
                      >
                        {item}
                      </li>
                    ))}
                  </ul>
                </div>
              </section>

              <AdsterraNativeBanner className="mt-10" />

              <section className="mt-10 grid gap-6 lg:grid-cols-[1.4fr_0.8fr]">
                <div className="rounded-[30px] border border-violet-200/14 bg-[#282151]/68 p-6 shadow-[0_24px_70px_rgba(18,14,45,0.28)]">
                  <h2 className="text-2xl font-semibold tracking-tight">
                    {data.left} vs {data.right}: key differences
                  </h2>

                  <div className="mt-6 overflow-hidden rounded-[22px] border border-violet-200/14 bg-[#211b45]/55">
                    <div className="grid grid-cols-3 bg-violet-400/12 text-sm font-semibold text-violet-50">
                      <div className="p-4">Feature</div>
                      <div className="p-4">{data.left}</div>
                      <div className="p-4">{data.right}</div>
                    </div>

                    {data.rows.map((row) => (
                      <FragmentRow
                        key={row.feature}
                        feature={row.feature}
                        leftValue={row.leftValue}
                        rightValue={row.rightValue}
                      />
                    ))}
                  </div>
                </div>

                <div className="space-y-6">
                  <div className="rounded-[30px] border border-violet-200/14 bg-[#282151]/68 p-6 shadow-[0_24px_70px_rgba(18,14,45,0.28)]">
                    <div className="text-[11px] font-semibold uppercase tracking-[0.18em] text-violet-200/58">
                      Quick verdict
                    </div>
                    <h2 className="mt-3 text-2xl font-semibold tracking-tight">
                      What matters most here
                    </h2>
                    <p className="mt-3 text-sm leading-6 text-white/70">
                      {overall}
                    </p>
                    <p className="mt-3 text-sm leading-6 text-white/65">
                      {decisionText}
                    </p>
                  </div>

                  <div className="rounded-[30px] border border-violet-200/14 bg-[#282151]/68 p-6 shadow-[0_24px_70px_rgba(18,14,45,0.28)]">
                    <div className="text-[11px] font-semibold uppercase tracking-[0.18em] text-violet-200/58">
                      Fast path
                    </div>
                    <h2 className="mt-3 text-2xl font-semibold tracking-tight">
                      Go straight to conversion
                    </h2>

                    <div className="mt-5 flex flex-wrap gap-3">
                      {supportedConversionLinks.map((item) => (
                        <Link
                          key={item.href}
                          href={item.href}
                          className="rounded-full bg-gradient-to-r from-violet-500 to-blue-500 px-5 py-2 text-sm font-semibold text-white shadow-[0_12px_30px_rgba(99,102,241,0.22)] transition duration-300 hover:-translate-y-0.5 hover:shadow-[0_0_30px_rgba(139,92,246,0.34)]"
                        >
                          {item.label}
                        </Link>
                      ))}
                    </div>
                  </div>
                </div>
              </section>

              <section className="mt-10 grid gap-6 md:grid-cols-2">
                <div className="rounded-[30px] border border-violet-200/14 bg-[#282151]/68 p-6 shadow-[0_24px_70px_rgba(18,14,45,0.28)]">
                  <h2 className="text-xl font-semibold tracking-tight">
                    When to use {data.left}
                  </h2>
                  <p className="mt-3 text-sm leading-7 text-white/70">
                    {data.whenToUseLeft}
                  </p>
                </div>

                <div className="rounded-[30px] border border-violet-200/14 bg-[#282151]/68 p-6 shadow-[0_24px_70px_rgba(18,14,45,0.28)]">
                  <h2 className="text-xl font-semibold tracking-tight">
                    When to use {data.right}
                  </h2>
                  <p className="mt-3 text-sm leading-7 text-white/70">
                    {data.whenToUseRight}
                  </p>
                </div>
              </section>

              <section className="mt-10 rounded-[30px] border border-violet-200/14 bg-[#282151]/68 p-6 shadow-[0_24px_70px_rgba(18,14,45,0.28)]">
                <div className="text-[11px] font-semibold uppercase tracking-[0.18em] text-violet-200/58">
                  Decision help
                </div>

                <h2 className="mt-3 text-2xl font-semibold tracking-tight">
                  How to choose between {data.left} and {data.right}
                </h2>

                <div className="mt-6 grid gap-4 md:grid-cols-3">
                  <div className="rounded-[22px] border border-violet-200/12 bg-[#33296b]/50 p-4 shadow-[inset_0_1px_0_rgba(255,255,255,0.04)]">
                    <div className="text-base font-semibold text-white">
                      Pick based on destination
                    </div>
                    <p className="mt-2 text-sm leading-6 text-white/65">
                      The best format is often the one that fits where your file is
                      going next: a browser, a phone, an editor, a web page, or a backup.
                    </p>
                  </div>

                  <div className="rounded-[22px] border border-violet-200/12 bg-[#33296b]/50 p-4 shadow-[inset_0_1px_0_rgba(255,255,255,0.04)]">
                    <div className="text-base font-semibold text-white">
                      Think about trade-offs
                    </div>
                    <p className="mt-2 text-sm leading-6 text-white/65">
                      Most comparisons come down to size versus quality, editing
                      flexibility versus portability, or modern efficiency versus broader compatibility.
                    </p>
                  </div>

                  <div className="rounded-[22px] border border-violet-200/12 bg-[#33296b]/50 p-4 shadow-[inset_0_1px_0_rgba(255,255,255,0.04)]">
                    <div className="text-base font-semibold text-white">
                      Convert only when needed
                    </div>
                    <p className="mt-2 text-sm leading-6 text-white/65">
                      If the original file already fits the workflow, keep it.
                      Convert when you need a better match for compatibility or delivery.
                    </p>
                  </div>
                </div>
              </section>

              <section className="mt-10 rounded-[30px] border border-violet-200/14 bg-[#282151]/68 p-6 shadow-[0_24px_70px_rgba(18,14,45,0.28)]">
                <h2 className="text-2xl font-semibold tracking-tight">
                  Convert between {data.left} and {data.right}
                </h2>

                <p className="mt-3 text-sm leading-6 text-white/70">
                  Once you know which format suits your workflow better, you can
                  convert in either direction or open the related format guides for
                  more context before deciding.
                </p>

                <div className="mt-6 flex flex-wrap gap-3">
                  {supportedConversionLinks.map((item) => (
                    <Link
                      key={item.href}
                      href={item.href}
                      className="rounded-full bg-gradient-to-r from-violet-500 to-blue-500 px-5 py-2 text-sm font-semibold text-white shadow-[0_12px_30px_rgba(99,102,241,0.22)] transition duration-300 hover:-translate-y-0.5 hover:shadow-[0_0_30px_rgba(139,92,246,0.34)]"
                    >
                      {item.label}
                    </Link>
                  ))}

                  {data.relatedFormatLinks.map((item) => (
                    <Link
                      key={item.href}
                      href={item.href}
                      className="rounded-full border border-violet-200/14 bg-white/[0.07] px-5 py-2 text-sm font-medium text-white/85 transition duration-300 hover:-translate-y-0.5 hover:border-violet-200/30 hover:bg-violet-400/14 hover:text-white"
                    >
                      {item.label}
                    </Link>
                  ))}
                </div>
              </section>
            </div>
          </section>

          {railsReady ? (
            <aside className="hidden xl:block">
              <AdRailShell slot={AD_SLOTS.RIGHT_RAIL} />
            </aside>
          ) : null}
        </div>
      </div>
      </main>
      <Footer />
    </>
  );
}

function FragmentRow({
  feature,
  leftValue,
  rightValue,
}: {
  feature: string;
  leftValue: string;
  rightValue: string;
}) {
  return (
    <div className="grid grid-cols-3 border-t border-violet-200/10 text-sm">
      <div className="p-4 text-white/85">{feature}</div>
      <div className="p-4 text-white/70">{leftValue}</div>
      <div className="p-4 text-white/70">{rightValue}</div>
    </div>
  );
}