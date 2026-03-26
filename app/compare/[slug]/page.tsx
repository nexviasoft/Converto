import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { allCompareItems, compareData } from "@/lib/compareData";

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

function AdRailShell() {
  return (
    <div className="sticky top-[92px] overflow-hidden rounded-[28px] bg-white/8 ring-1 ring-white/10 shadow-[0_24px_70px_rgba(0,0,0,0.34)]">
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_at_top,rgba(168,85,247,0.14),transparent_55%),radial-gradient(ellipse_at_bottom,rgba(59,130,246,0.10),transparent_55%)]" />
      <div className="relative p-4">
        <div className="mb-3 flex items-center justify-between">
          <div className="text-[11px] font-semibold tracking-wide text-white/60">
            Sponsored
          </div>
          <div className="text-[11px] text-white/35">Ads keep Converto free</div>
        </div>

        <div className="rounded-[22px] bg-black/20 p-4 ring-1 ring-white/10">
          <div className="mb-4 space-y-2">
            <div className="h-2.5 w-24 rounded-full bg-white/10" />
            <div className="h-2.5 w-14 rounded-full bg-white/5" />
          </div>
          <div className="min-h-[560px] rounded-[18px] border border-dashed border-white/10 bg-white/[0.03]" />
        </div>
      </div>
    </div>
  );
}

export default async function CompareDetailPage({ params }: PageProps) {
  const resolvedParams = await params;
  const data = compareData[resolvedParams.slug];

  if (!data) notFound();

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

  return (
    <main className="min-h-screen bg-[#151233] text-white">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(faqSchema) }}
      />

      <div className="pointer-events-none fixed inset-0 -z-10">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,rgba(168,85,247,0.22),transparent_60%),radial-gradient(ellipse_at_bottom,rgba(59,130,246,0.18),transparent_55%),radial-gradient(ellipse_at_center,rgba(255,255,255,0.08),transparent_45%)]" />
        <div className="absolute inset-0 opacity-20 [background:linear-gradient(to_right,rgba(255,255,255,0.045)_1px,transparent_1px),linear-gradient(to_bottom,rgba(255,255,255,0.045)_1px,transparent_1px)] [background-size:72px_72px]" />
      </div>

      <div className="mx-auto max-w-[1750px] px-4 py-14 sm:px-6 lg:px-8">
        <div className="grid items-start gap-6 xl:grid-cols-[270px_minmax(0,1fr)_270px] 2xl:grid-cols-[300px_minmax(0,1fr)_300px] xl:gap-8">
          <aside className="hidden xl:block">
            <AdRailShell />
          </aside>

          <section className="min-w-0">
            <div className="mx-auto w-full max-w-[1120px]">
              <div className="relative overflow-hidden rounded-[34px] bg-white/10 p-8 ring-1 ring-white/10 shadow-[0_24px_70px_rgba(0,0,0,0.28)] sm:p-10">
                <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_top_right,rgba(168,85,247,0.18),transparent_28%),radial-gradient(circle_at_bottom_left,rgba(59,130,246,0.15),transparent_32%)]" />

                <div className="relative">
                  <div className="text-[11px] font-semibold uppercase tracking-[0.18em] text-white/45">
                    Compare formats
                  </div>

                  <h1 className="mt-3 text-4xl font-bold tracking-tight sm:text-5xl">
                    {data.title}
                  </h1>

                  <p className="mt-4 max-w-3xl text-sm leading-7 text-white/70 sm:text-base">
                    {data.intro}
                  </p>

                  <div className="mt-6 flex flex-wrap gap-3">
                    <span className="rounded-full bg-white/8 px-4 py-2 text-sm text-white/80 ring-1 ring-white/10">
                      Practical decision guide
                    </span>
                    <span className="rounded-full bg-white/8 px-4 py-2 text-sm text-white/80 ring-1 ring-white/10">
                      Workflow-first comparison
                    </span>
                    <span className="rounded-full bg-white/8 px-4 py-2 text-sm text-white/80 ring-1 ring-white/10">
                      Direct conversion links
                    </span>
                  </div>

                  <div className="mt-8 flex flex-wrap gap-3">
                    {data.conversionLinks.map((item) => (
                      <Link
                        key={item.href}
                        href={item.href}
                        className="inline-flex rounded-full bg-white px-5 py-2.5 text-sm font-semibold text-black transition hover:bg-white/90"
                      >
                        {item.label}
                      </Link>
                    ))}

                    <Link
                      href="/compare"
                      className="inline-flex rounded-full bg-white/8 px-5 py-2.5 text-sm font-medium text-white/85 ring-1 ring-white/10 transition hover:bg-white/12 hover:text-white"
                    >
                      Back to compare hub
                    </Link>
                  </div>
                </div>
              </div>

              <section className="mt-10 grid gap-6 md:grid-cols-2">
                <div className="rounded-[30px] bg-white/10 p-6 ring-1 ring-white/10 shadow-[0_18px_55px_rgba(0,0,0,0.25)]">
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
                        className="rounded-[20px] bg-white/8 px-4 py-3 text-sm leading-6 text-white/70 ring-1 ring-white/10"
                      >
                        {item}
                      </li>
                    ))}
                  </ul>
                </div>

                <div className="rounded-[30px] bg-white/10 p-6 ring-1 ring-white/10 shadow-[0_18px_55px_rgba(0,0,0,0.25)]">
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
                        className="rounded-[20px] bg-white/8 px-4 py-3 text-sm leading-6 text-white/70 ring-1 ring-white/10"
                      >
                        {item}
                      </li>
                    ))}
                  </ul>
                </div>
              </section>

              <section className="mt-10 grid gap-6 lg:grid-cols-[1.4fr_0.8fr]">
                <div className="rounded-[30px] bg-white/10 p-6 ring-1 ring-white/10 shadow-[0_18px_55px_rgba(0,0,0,0.25)]">
                  <h2 className="text-2xl font-semibold tracking-tight">
                    {data.left} vs {data.right}: key differences
                  </h2>

                  <div className="mt-6 overflow-hidden rounded-[22px] border border-white/10">
                    <div className="grid grid-cols-3 bg-white/10 text-sm font-semibold">
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
                  <div className="rounded-[30px] bg-white/10 p-6 ring-1 ring-white/10 shadow-[0_18px_55px_rgba(0,0,0,0.25)]">
                    <div className="text-[11px] font-semibold uppercase tracking-[0.18em] text-white/45">
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

                  <div className="rounded-[30px] bg-white/10 p-6 ring-1 ring-white/10 shadow-[0_18px_55px_rgba(0,0,0,0.25)]">
                    <div className="text-[11px] font-semibold uppercase tracking-[0.18em] text-white/45">
                      Fast path
                    </div>
                    <h2 className="mt-3 text-2xl font-semibold tracking-tight">
                      Go straight to conversion
                    </h2>

                    <div className="mt-5 flex flex-wrap gap-3">
                      {data.conversionLinks.map((item) => (
                        <Link
                          key={item.href}
                          href={item.href}
                          className="rounded-full bg-white px-5 py-2 text-sm font-semibold text-black transition hover:bg-white/90"
                        >
                          {item.label}
                        </Link>
                      ))}
                    </div>
                  </div>
                </div>
              </section>

              <section className="mt-10 grid gap-6 md:grid-cols-2">
                <div className="rounded-[30px] bg-white/10 p-6 ring-1 ring-white/10 shadow-[0_18px_55px_rgba(0,0,0,0.25)]">
                  <h2 className="text-xl font-semibold tracking-tight">
                    When to use {data.left}
                  </h2>
                  <p className="mt-3 text-sm leading-7 text-white/70">
                    {data.whenToUseLeft}
                  </p>
                </div>

                <div className="rounded-[30px] bg-white/10 p-6 ring-1 ring-white/10 shadow-[0_18px_55px_rgba(0,0,0,0.25)]">
                  <h2 className="text-xl font-semibold tracking-tight">
                    When to use {data.right}
                  </h2>
                  <p className="mt-3 text-sm leading-7 text-white/70">
                    {data.whenToUseRight}
                  </p>
                </div>
              </section>

              <section className="mt-10 rounded-[30px] bg-white/10 p-6 ring-1 ring-white/10 shadow-[0_18px_55px_rgba(0,0,0,0.25)]">
                <div className="text-[11px] font-semibold uppercase tracking-[0.18em] text-white/45">
                  Decision help
                </div>

                <h2 className="mt-3 text-2xl font-semibold tracking-tight">
                  How to choose between {data.left} and {data.right}
                </h2>

                <div className="mt-6 grid gap-4 md:grid-cols-3">
                  <div className="rounded-[22px] bg-white/8 p-4 ring-1 ring-white/10">
                    <div className="text-base font-semibold text-white">
                      Pick based on destination
                    </div>
                    <p className="mt-2 text-sm leading-6 text-white/65">
                      The best format is often the one that fits where your file is
                      going next: a browser, a phone, an editor, a web page, or a backup.
                    </p>
                  </div>

                  <div className="rounded-[22px] bg-white/8 p-4 ring-1 ring-white/10">
                    <div className="text-base font-semibold text-white">
                      Think about trade-offs
                    </div>
                    <p className="mt-2 text-sm leading-6 text-white/65">
                      Most comparisons come down to size versus quality, editing
                      flexibility versus portability, or modern efficiency versus broader compatibility.
                    </p>
                  </div>

                  <div className="rounded-[22px] bg-white/8 p-4 ring-1 ring-white/10">
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

              <section className="mt-10 rounded-[30px] bg-white/10 p-6 ring-1 ring-white/10 shadow-[0_18px_55px_rgba(0,0,0,0.25)]">
                <h2 className="text-2xl font-semibold tracking-tight">
                  Convert between {data.left} and {data.right}
                </h2>

                <p className="mt-3 text-sm leading-6 text-white/70">
                  Once you know which format suits your workflow better, you can
                  convert in either direction or open the related format guides for
                  more context before deciding.
                </p>

                <div className="mt-6 flex flex-wrap gap-3">
                  {data.conversionLinks.map((item) => (
                    <Link
                      key={item.href}
                      href={item.href}
                      className="rounded-full bg-white px-5 py-2 text-sm font-semibold text-black transition hover:bg-white/90"
                    >
                      {item.label}
                    </Link>
                  ))}

                  {data.relatedFormatLinks.map((item) => (
                    <Link
                      key={item.href}
                      href={item.href}
                      className="rounded-full bg-white/10 px-5 py-2 text-sm font-medium text-white/85 ring-1 ring-white/10 transition hover:bg-white/12 hover:text-white"
                    >
                      {item.label}
                    </Link>
                  ))}
                </div>
              </section>
            </div>
          </section>

          <aside className="hidden xl:block">
            <AdRailShell />
          </aside>
        </div>
      </div>
    </main>
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
    <div className="grid grid-cols-3 border-t border-white/10 text-sm">
      <div className="p-4 text-white/85">{feature}</div>
      <div className="p-4 text-white/70">{leftValue}</div>
      <div className="p-4 text-white/70">{rightValue}</div>
    </div>
  );
}