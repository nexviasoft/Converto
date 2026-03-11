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
  "https://converto.tools";

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
    title: data.metaTitle,
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

export default async function FormatDetailPage({ params }: PageProps) {
  const resolvedParams = await params;
  const data = formatData[resolvedParams.format];

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
            {categoryText(data.category)}
          </div>

          <h1 className="mt-3 text-4xl font-bold tracking-tight sm:text-5xl">
            {data.title}
          </h1>

          <p className="mt-4 max-w-3xl text-sm leading-7 text-white/70 sm:text-base">
            {data.intro}
          </p>

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

        <section className="mt-10 grid gap-6 lg:grid-cols-2">
          <div className="rounded-[28px] bg-white/10 p-6 ring-1 ring-white/10 shadow-[0_18px_55px_rgba(0,0,0,0.25)]">
            <h2 className="text-2xl font-semibold tracking-tight">
              Why people use {data.label}
            </h2>

            <ul className="mt-5 space-y-3">
              {data.whyUse.map((item) => (
                <li
                  key={item}
                  className="rounded-2xl bg-white/8 px-4 py-3 text-sm leading-6 text-white/70 ring-1 ring-white/10"
                >
                  {item}
                </li>
              ))}
            </ul>
          </div>

          <div className="rounded-[28px] bg-white/10 p-6 ring-1 ring-white/10 shadow-[0_18px_55px_rgba(0,0,0,0.25)]">
            <h2 className="text-2xl font-semibold tracking-tight">
              Best use cases for {data.label}
            </h2>

            <ul className="mt-5 space-y-3">
              {data.bestFor.map((item) => (
                <li
                  key={item}
                  className="rounded-2xl bg-white/8 px-4 py-3 text-sm leading-6 text-white/70 ring-1 ring-white/10"
                >
                  {item}
                </li>
              ))}
            </ul>
          </div>
        </section>

        <section className="mt-10 rounded-[28px] bg-white/10 p-6 ring-1 ring-white/10 shadow-[0_18px_55px_rgba(0,0,0,0.25)]">
          <div className="text-[11px] font-semibold uppercase tracking-[0.18em] text-white/45">
            Common conversions
          </div>

          <h2 className="mt-3 text-2xl font-semibold tracking-tight">
            Popular {data.label} conversion paths
          </h2>

          <p className="mt-3 max-w-3xl text-sm leading-6 text-white/65">
            These are some of the most practical conversion routes people use when
            working with {data.label} files in everyday compatibility, editing,
            sharing, playback, or optimization workflows.
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

        <section className="mt-10 rounded-[28px] bg-white/10 p-6 ring-1 ring-white/10 shadow-[0_18px_55px_rgba(0,0,0,0.25)]">
          <div className="text-[11px] font-semibold uppercase tracking-[0.18em] text-white/45">
            Related formats
          </div>

          <h2 className="mt-3 text-2xl font-semibold tracking-tight">
            Explore similar formats
          </h2>

          <p className="mt-3 max-w-3xl text-sm leading-6 text-white/65">
            If you are comparing workflows, compatibility, or output quality, these
            related formats are worth checking before you convert.
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

        <section className="mt-10 grid gap-6 lg:grid-cols-2">
          <div className="rounded-[28px] bg-white/10 p-6 ring-1 ring-white/10 shadow-[0_18px_55px_rgba(0,0,0,0.25)]">
            <h2 className="text-2xl font-semibold tracking-tight">
              Start from the converter
            </h2>
            <p className="mt-3 text-sm leading-6 text-white/65">
              If you already know your target format, you can jump directly into the
              converter and start with a {data.label}-related workflow right away.
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

          <div className="rounded-[28px] bg-white/10 p-6 ring-1 ring-white/10 shadow-[0_18px_55px_rgba(0,0,0,0.25)]">
            <h2 className="text-2xl font-semibold tracking-tight">
              Browse more format guides
            </h2>
            <p className="mt-3 text-sm leading-6 text-white/65">
              Converto includes format guides for audio, video, and image workflows.
              These pages help users understand where each format fits before converting.
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
    </main>
  );
}