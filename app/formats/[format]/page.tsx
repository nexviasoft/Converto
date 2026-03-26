import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { formatData, allFormats } from "@/lib/formatData";

type PageProps = {
  params: Promise<{
    format: string;
  }>;
};

const siteUrl =
  process.env.NEXT_PUBLIC_SITE_URL?.replace(/\/$/, "") ||
  "https://www.converto.tools";

export function generateStaticParams() {
  return allFormats.map((item) => ({
    format: item.slug,
  }));
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const resolvedParams = await params;
  const data = formatData[resolvedParams.format];

  if (!data) {
    return {
      title: "Format not found | Converto",
      description: "The requested format page does not exist.",
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
      canonical: `${siteUrl}/formats/${data.slug}`,
    },
    openGraph: {
      title: `${data.metaTitle} | Converto`,
      description: data.metaDescription,
      url: `${siteUrl}/formats/${data.slug}`,
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

function categoryText(category: string) {
  if (category === "audio") return "Audio format";
  if (category === "video") return "Video format";
  return "Image format";
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

export default async function FormatDetailPage({ params }: PageProps) {
  const resolvedParams = await params;
  const data = formatData[resolvedParams.format];

  if (!data) notFound();

  const faqSchema =
    data.faq && data.faq.length > 0
      ? {
          "@context": "https://schema.org",
          "@type": "FAQPage",
          mainEntity: data.faq.map((item) => ({
            "@type": "Question",
            name: item.question,
            acceptedAnswer: {
              "@type": "Answer",
              text: item.answer,
            },
          })),
        }
      : null;

  const compareSchema = data.formatComparison
    ? {
        "@context": "https://schema.org",
        "@type": "Article",
        headline: `${data.label} format guide`,
        description: data.metaDescription,
      }
    : null;

  return (
    <main className="min-h-screen bg-[#151233] text-white">
      {faqSchema ? (
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(faqSchema) }}
        />
      ) : null}

      {compareSchema ? (
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(compareSchema) }}
        />
      ) : null}

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
                    {categoryText(data.category)}
                  </div>

                  <h1 className="mt-3 text-4xl font-bold tracking-tight sm:text-5xl">
                    {data.title}
                  </h1>

                  <p className="mt-4 max-w-3xl text-sm leading-7 text-white/70 sm:text-base">
                    {data.intro}
                  </p>

                  <div className="mt-6 flex flex-wrap gap-3">
                    <span className="rounded-full bg-white/8 px-4 py-2 text-sm text-white/80 ring-1 ring-white/10">
                      Practical format guide
                    </span>
                    <span className="rounded-full bg-white/8 px-4 py-2 text-sm text-white/80 ring-1 ring-white/10">
                      Common conversions
                    </span>
                    <span className="rounded-full bg-white/8 px-4 py-2 text-sm text-white/80 ring-1 ring-white/10">
                      Comparison-ready
                    </span>
                  </div>

                  <div className="mt-8 flex flex-wrap gap-3">
                    <Link
                      href="/formats"
                      className="inline-flex rounded-full bg-white px-5 py-2.5 text-sm font-semibold text-black transition hover:bg-white/90"
                    >
                      Back to formats
                    </Link>

                    <Link
                      href="/converter"
                      className="inline-flex rounded-full bg-white/8 px-5 py-2.5 text-sm font-medium text-white/85 ring-1 ring-white/10 transition hover:bg-white/12 hover:text-white"
                    >
                      Open Converter
                    </Link>

                    {data.commonConversions[0] ? (
                      <Link
                        href={data.commonConversions[0].href}
                        className="inline-flex rounded-full bg-white/8 px-5 py-2.5 text-sm font-medium text-white/85 ring-1 ring-white/10 transition hover:bg-white/12 hover:text-white"
                      >
                        Try {data.commonConversions[0].label}
                      </Link>
                    ) : null}
                  </div>
                </div>
              </div>

              <section className="mt-10 grid gap-6 lg:grid-cols-2">
                <div className="rounded-[30px] bg-white/10 p-6 ring-1 ring-white/10 shadow-[0_18px_55px_rgba(0,0,0,0.25)]">
                  <h2 className="text-2xl font-semibold tracking-tight">
                    Why people use {data.label}
                  </h2>

                  <ul className="mt-5 space-y-3">
                    {data.whyUse.map((item) => (
                      <li
                        key={item}
                        className="rounded-[22px] bg-white/8 px-4 py-3 text-sm leading-6 text-white/70 ring-1 ring-white/10"
                      >
                        {item}
                      </li>
                    ))}
                  </ul>
                </div>

                <div className="rounded-[30px] bg-white/10 p-6 ring-1 ring-white/10 shadow-[0_18px_55px_rgba(0,0,0,0.25)]">
                  <h2 className="text-2xl font-semibold tracking-tight">
                    Best use cases for {data.label}
                  </h2>

                  <ul className="mt-5 space-y-3">
                    {data.bestFor.map((item) => (
                      <li
                        key={item}
                        className="rounded-[22px] bg-white/8 px-4 py-3 text-sm leading-6 text-white/70 ring-1 ring-white/10"
                      >
                        {item}
                      </li>
                    ))}
                  </ul>
                </div>
              </section>

              {data.deepGuideIntro ? (
                <section className="mt-10 rounded-[30px] bg-white/10 p-6 ring-1 ring-white/10 shadow-[0_18px_55px_rgba(0,0,0,0.25)]">
                  <div className="text-[11px] font-semibold uppercase tracking-[0.18em] text-white/45">
                    In-depth guide
                  </div>

                  <h2 className="mt-3 text-2xl font-semibold tracking-tight">
                    Understanding {data.label} in practical workflows
                  </h2>

                  <p className="mt-4 max-w-4xl text-sm leading-7 text-white/70 sm:text-base">
                    {data.deepGuideIntro}
                  </p>

                  {data.technicalPoints?.length ? (
                    <div className="mt-6 grid gap-3">
                      {data.technicalPoints.map((item) => (
                        <div
                          key={item}
                          className="rounded-[22px] bg-white/8 px-4 py-3 text-sm leading-6 text-white/70 ring-1 ring-white/10"
                        >
                          {item}
                        </div>
                      ))}
                    </div>
                  ) : null}
                </section>
              ) : null}

              {data.bestConversionSettings?.length ? (
                <section className="mt-10 rounded-[30px] bg-white/10 p-6 ring-1 ring-white/10 shadow-[0_18px_55px_rgba(0,0,0,0.25)]">
                  <div className="text-[11px] font-semibold uppercase tracking-[0.18em] text-white/45">
                    Practical settings
                  </div>

                  <h2 className="mt-3 text-2xl font-semibold tracking-tight">
                    Best conversion settings for {data.label}
                  </h2>

                  <p className="mt-3 max-w-3xl text-sm leading-6 text-white/65">
                    These are practical starting points for users who want a better
                    balance of compatibility, file size, quality, and workflow
                    convenience when converting {data.label}-related files.
                  </p>

                  <div className="mt-6 grid gap-4 md:grid-cols-2">
                    {data.bestConversionSettings.map((item) => (
                      <div
                        key={item.label}
                        className="rounded-[22px] bg-white/8 p-4 ring-1 ring-white/10"
                      >
                        <div className="text-base font-semibold text-white">
                          {item.label}
                        </div>
                        <div className="mt-2 text-sm leading-6 text-white/70">
                          {item.value}
                        </div>
                      </div>
                    ))}
                  </div>
                </section>
              ) : null}

              {data.formatComparison ? (
                <section className="mt-10 rounded-[30px] bg-white/10 p-6 ring-1 ring-white/10 shadow-[0_18px_55px_rgba(0,0,0,0.25)]">
                  <div className="text-[11px] font-semibold uppercase tracking-[0.18em] text-white/45">
                    Comparison
                  </div>

                  <h2 className="mt-3 text-2xl font-semibold tracking-tight">
                    {data.formatComparison.title}
                  </h2>

                  <div className="mt-6 grid gap-3">
                    {data.formatComparison.points.map((point) => (
                      <div
                        key={point}
                        className="rounded-[22px] bg-white/8 px-4 py-3 text-sm leading-6 text-white/70 ring-1 ring-white/10"
                      >
                        {point}
                      </div>
                    ))}
                  </div>
                </section>
              ) : null}

              <section className="mt-10 rounded-[30px] bg-white/10 p-6 ring-1 ring-white/10 shadow-[0_18px_55px_rgba(0,0,0,0.25)]">
                <div className="text-[11px] font-semibold uppercase tracking-[0.18em] text-white/45">
                  Common conversions
                </div>

                <h2 className="mt-3 text-2xl font-semibold tracking-tight">
                  Popular {data.label} conversion paths
                </h2>

                <p className="mt-3 max-w-3xl text-sm leading-6 text-white/65">
                  These are some of the most practical conversion routes people use
                  when working with {data.label} files in everyday compatibility,
                  editing, playback, sharing, extraction, and optimization workflows.
                </p>

                <div className="mt-6 flex flex-wrap gap-3">
                  {data.commonConversions.map((item) => (
                    <Link
                      key={item.href}
                      href={item.href}
                      className="rounded-full bg-white px-4 py-2 text-sm font-semibold text-black transition hover:bg-white/90"
                    >
                      {item.label}
                    </Link>
                  ))}
                </div>
              </section>

              <section className="mt-10 rounded-[30px] bg-white/10 p-6 ring-1 ring-white/10 shadow-[0_18px_55px_rgba(0,0,0,0.25)]">
                <div className="text-[11px] font-semibold uppercase tracking-[0.18em] text-white/45">
                  Related formats
                </div>

                <h2 className="mt-3 text-2xl font-semibold tracking-tight">
                  Explore similar formats
                </h2>

                <p className="mt-3 max-w-3xl text-sm leading-6 text-white/65">
                  If you are comparing workflows, compression behavior, compatibility,
                  playback support, or output quality, these related formats are worth
                  checking before you convert.
                </p>

                <div className="mt-6 flex flex-wrap gap-3">
                  {data.relatedFormats.map((item) => (
                    <Link
                      key={item.href}
                      href={item.href}
                      className="rounded-full bg-white/8 px-4 py-2 text-sm font-medium text-white/85 ring-1 ring-white/10 transition hover:bg-white/12 hover:text-white"
                    >
                      {item.label}
                    </Link>
                  ))}
                </div>
              </section>

              {data.faq?.length ? (
                <section className="mt-10 rounded-[30px] bg-white/10 p-6 ring-1 ring-white/10 shadow-[0_18px_55px_rgba(0,0,0,0.25)]">
                  <div className="text-[11px] font-semibold uppercase tracking-[0.18em] text-white/45">
                    FAQ
                  </div>

                  <h2 className="mt-3 text-2xl font-semibold tracking-tight">
                    Common questions about {data.label}
                  </h2>

                  <div className="mt-6 space-y-4">
                    {data.faq.map((item) => (
                      <div
                        key={item.question}
                        className="rounded-[22px] bg-white/8 p-4 ring-1 ring-white/10"
                      >
                        <h3 className="text-base font-semibold text-white">
                          {item.question}
                        </h3>
                        <p className="mt-2 text-sm leading-6 text-white/70">
                          {item.answer}
                        </p>
                      </div>
                    ))}
                  </div>
                </section>
              ) : null}

              <section className="mt-10 grid gap-6 lg:grid-cols-2">
                <div className="rounded-[30px] bg-white/10 p-6 ring-1 ring-white/10 shadow-[0_18px_55px_rgba(0,0,0,0.25)]">
                  <h2 className="text-2xl font-semibold tracking-tight">
                    Start from the converter
                  </h2>
                  <p className="mt-3 text-sm leading-6 text-white/65">
                    If you already know your target format, you can jump directly
                    into the converter and start with a {data.label}-related workflow
                    right away.
                  </p>

                  <div className="mt-6 flex flex-wrap gap-3">
                    <Link
                      href="/converter"
                      className="inline-flex rounded-full bg-white px-5 py-2.5 text-sm font-semibold text-black transition hover:bg-white/90"
                    >
                      Open Converter
                    </Link>

                    {data.commonConversions[0] ? (
                      <Link
                        href={data.commonConversions[0].href}
                        className="inline-flex rounded-full bg-white/8 px-5 py-2.5 text-sm font-medium text-white/85 ring-1 ring-white/10 transition hover:bg-white/12 hover:text-white"
                      >
                        {data.commonConversions[0].label}
                      </Link>
                    ) : null}
                  </div>
                </div>

                <div className="rounded-[30px] bg-white/10 p-6 ring-1 ring-white/10 shadow-[0_18px_55px_rgba(0,0,0,0.25)]">
                  <h2 className="text-2xl font-semibold tracking-tight">
                    Browse more format guides
                  </h2>
                  <p className="mt-3 text-sm leading-6 text-white/65">
                    Converto includes guides for audio, video, and image workflows.
                    These pages help users understand where each format fits before
                    converting and which route makes the most sense.
                  </p>

                  <div className="mt-6 flex flex-wrap gap-3">
                    <Link
                      href="/formats"
                      className="inline-flex rounded-full bg-white px-5 py-2.5 text-sm font-semibold text-black transition hover:bg-white/90"
                    >
                      Open formats hub
                    </Link>

                    <Link
                      href="/compare"
                      className="inline-flex rounded-full bg-white/8 px-5 py-2.5 text-sm font-medium text-white/85 ring-1 ring-white/10 transition hover:bg-white/12 hover:text-white"
                    >
                      Compare formats
                    </Link>
                  </div>
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