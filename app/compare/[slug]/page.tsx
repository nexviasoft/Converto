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
  "https://converto.tools";

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
    title: data.metaTitle,
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

export default async function CompareDetailPage({ params }: PageProps) {
  const resolvedParams = await params;
  const data = compareData[resolvedParams.slug];

  if (!data) notFound();

  return (
    <main className="min-h-screen bg-[#151233] text-white">
      <div className="pointer-events-none fixed inset-0 -z-10">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,rgba(168,85,247,0.22),transparent_60%),radial-gradient(ellipse_at_bottom,rgba(59,130,246,0.18),transparent_55%),radial-gradient(ellipse_at_center,rgba(255,255,255,0.08),transparent_45%)]" />
        <div className="absolute inset-0 opacity-20 [background:linear-gradient(to_right,rgba(255,255,255,0.045)_1px,transparent_1px),linear-gradient(to_bottom,rgba(255,255,255,0.045)_1px,transparent_1px)] [background-size:72px_72px]" />
      </div>

      <div className="mx-auto max-w-5xl px-4 py-14 sm:px-6 lg:px-8">
        <div className="rounded-[30px] bg-white/10 p-8 ring-1 ring-white/10 shadow-[0_18px_55px_rgba(0,0,0,0.25)]">
          <div className="text-[11px] font-semibold uppercase tracking-[0.18em] text-white/45">
            Compare formats
          </div>

          <h1 className="mt-3 text-4xl font-bold tracking-tight sm:text-5xl">
            {data.title}
          </h1>

          <p className="mt-4 max-w-3xl text-sm leading-7 text-white/70 sm:text-base">
            {data.intro}
          </p>

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
          </div>
        </div>

        <section className="mt-10 grid gap-6 md:grid-cols-2">
          <div className="rounded-[28px] bg-white/10 p-6 ring-1 ring-white/10 shadow-[0_18px_55px_rgba(0,0,0,0.25)]">
            <h2 className="text-2xl font-semibold">{data.leftSummaryTitle}</h2>
            <p className="mt-3 text-white/70">{data.leftSummary}</p>

            <ul className="mt-4 space-y-2 text-sm text-white/70">
              {data.leftBullets.map((item) => (
                <li key={item}>• {item}</li>
              ))}
            </ul>
          </div>

          <div className="rounded-[28px] bg-white/10 p-6 ring-1 ring-white/10 shadow-[0_18px_55px_rgba(0,0,0,0.25)]">
            <h2 className="text-2xl font-semibold">{data.rightSummaryTitle}</h2>
            <p className="mt-3 text-white/70">{data.rightSummary}</p>

            <ul className="mt-4 space-y-2 text-sm text-white/70">
              {data.rightBullets.map((item) => (
                <li key={item}>• {item}</li>
              ))}
            </ul>
          </div>
        </section>

        <section className="mt-10">
          <h2 className="text-2xl font-semibold">
            {data.left} vs {data.right}: Key Differences
          </h2>

          <div className="mt-6 grid grid-cols-3 overflow-hidden rounded-xl border border-white/10 text-sm">
            <div className="bg-white/10 p-4 font-semibold">Feature</div>
            <div className="bg-white/10 p-4 font-semibold">{data.left}</div>
            <div className="bg-white/10 p-4 font-semibold">{data.right}</div>

            {data.rows.map((row) => (
              <FragmentRow
                key={row.feature}
                feature={row.feature}
                leftValue={row.leftValue}
                rightValue={row.rightValue}
              />
            ))}
          </div>
        </section>

        <section className="mt-10 grid gap-6 md:grid-cols-2">
          <div className="rounded-[28px] bg-white/10 p-6 ring-1 ring-white/10 shadow-[0_18px_55px_rgba(0,0,0,0.25)]">
            <h2 className="text-xl font-semibold">When to use {data.left}</h2>
            <p className="mt-3 text-white/70">{data.whenToUseLeft}</p>
          </div>

          <div className="rounded-[28px] bg-white/10 p-6 ring-1 ring-white/10 shadow-[0_18px_55px_rgba(0,0,0,0.25)]">
            <h2 className="text-xl font-semibold">When to use {data.right}</h2>
            <p className="mt-3 text-white/70">{data.whenToUseRight}</p>
          </div>
        </section>

        <section className="mt-10 rounded-[28px] bg-white/10 p-6 ring-1 ring-white/10 shadow-[0_18px_55px_rgba(0,0,0,0.25)]">
          <h2 className="text-2xl font-semibold">
            Convert between {data.left} and {data.right}
          </h2>

          <p className="mt-3 text-white/70">
            Once you know which format suits your workflow better, you can convert in either
            direction or open the related format guides for more context.
          </p>

          <div className="mt-6 flex flex-wrap gap-3">
            {data.conversionLinks.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                className="rounded-full bg-white px-5 py-2 text-black"
              >
                {item.label}
              </Link>
            ))}

            {data.relatedFormatLinks.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                className="rounded-full bg-white/10 px-5 py-2"
              >
                {item.label}
              </Link>
            ))}
          </div>
        </section>
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
    <>
      <div className="p-4">{feature}</div>
      <div className="p-4">{leftValue}</div>
      <div className="p-4">{rightValue}</div>
    </>
  );
}