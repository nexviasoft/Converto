import type { Metadata } from "next";
import Link from "next/link";
import FormatsPageClient from "@/components/formats/FormatsPageClient";
import { allFormats } from "@/lib/formatData";

const siteUrl =
  process.env.NEXT_PUBLIC_SITE_URL?.replace(/\/$/, "") ||
  "https://converto.tools";

export const metadata: Metadata = {
  title: "Supported File Formats | Converto",
  description:
    "Explore Converto’s supported audio, video, and image formats. Learn what each format is best for, compare similar formats, and jump into common conversion paths.",
  alternates: {
    canonical: `${siteUrl}/formats`,
  },
  openGraph: {
    title: "Supported File Formats | Converto",
    description:
      "Explore Converto’s supported audio, video, and image formats.",
    url: `${siteUrl}/formats`,
    siteName: "Converto",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Supported File Formats | Converto",
    description:
      "Explore Converto’s supported audio, video, and image formats.",
  },
};

function groupTitle(category: string) {
  if (category === "audio") return "Audio formats";
  if (category === "video") return "Video formats";
  return "Image formats";
}

export default function FormatsPage() {
  const audioFormats = allFormats.filter((item) => item.category === "audio");
  const videoFormats = allFormats.filter((item) => item.category === "video");
  const imageFormats = allFormats.filter((item) => item.category === "image");

  const grouped = [
    { key: "audio", title: groupTitle("audio"), items: audioFormats },
    { key: "video", title: groupTitle("video"), items: videoFormats },
    { key: "image", title: groupTitle("image"), items: imageFormats },
  ];

  const collectionSchema = {
    "@context": "https://schema.org",
    "@type": "CollectionPage",
    name: "Supported File Formats | Converto",
    description:
      "Explore Converto’s supported audio, video, and image formats.",
    url: `${siteUrl}/formats`,
    mainEntity: allFormats.map((item) => ({
      "@type": "Thing",
      name: item.label,
      url: `${siteUrl}/formats/${item.slug}`,
    })),
  };

  return (
    <main className="min-h-screen bg-[#151233] text-white">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(collectionSchema) }}
      />

      <div className="pointer-events-none fixed inset-0 -z-10">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,rgba(168,85,247,0.22),transparent_60%),radial-gradient(ellipse_at_bottom,rgba(59,130,246,0.18),transparent_55%),radial-gradient(ellipse_at_center,rgba(255,255,255,0.08),transparent_45%)]" />
        <div className="absolute inset-0 opacity-20 [background:linear-gradient(to_right,rgba(255,255,255,0.045)_1px,transparent_1px),linear-gradient(to_bottom,rgba(255,255,255,0.045)_1px,transparent_1px)] [background-size:72px_72px]" />
      </div>

      <section className="mx-auto max-w-[1200px] px-4 py-14 sm:px-6 lg:px-8">
        <div className="rounded-[32px] bg-white/10 p-8 ring-1 ring-white/10 shadow-[0_24px_70px_rgba(0,0,0,0.28)] sm:p-10">
          <div className="text-[11px] font-semibold uppercase tracking-[0.18em] text-white/45">
            Format directory
          </div>

          <h1 className="mt-3 text-4xl font-bold tracking-tight sm:text-5xl">
            Supported file formats
          </h1>

          <p className="mt-4 max-w-3xl text-sm leading-7 text-white/70 sm:text-[15px]">
            Browse Converto’s supported audio, video, and image formats. Use
            these pages to understand what each format is best for, compare
            related formats, and jump into practical conversion routes.
          </p>
        </div>

        <div className="mt-10 space-y-8">
          {grouped.map((group) => (
            <section key={group.key}>
              <div className="mb-4 text-[11px] font-semibold uppercase tracking-[0.18em] text-white/45">
                {group.title}
              </div>

              <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
                {group.items.map((item) => (
                  <article
                    key={item.slug}
                    className="rounded-[24px] bg-white/10 p-5 ring-1 ring-white/10 shadow-[0_18px_55px_rgba(0,0,0,0.22)]"
                  >
                    <h2 className="text-lg font-semibold text-white">
                      <Link
                        href={`/formats/${item.slug}`}
                        className="transition hover:text-white/85"
                      >
                        {item.label}
                      </Link>
                    </h2>

                    <p className="mt-3 text-sm leading-6 text-white/65">
                      {item.intro}
                    </p>

                    <div className="mt-4 flex flex-wrap gap-2">
                      {item.commonConversions.slice(0, 3).map((conv) => (
                        <Link
                          key={conv.href}
                          href={conv.href}
                          className="rounded-full bg-white/8 px-3 py-1.5 text-xs font-medium text-white/80 ring-1 ring-white/10 transition hover:bg-white/12 hover:text-white"
                        >
                          {conv.label}
                        </Link>
                      ))}
                    </div>
                  </article>
                ))}
              </div>
            </section>
          ))}
        </div>

        <section className="mt-12 rounded-[28px] bg-white/10 p-6 ring-1 ring-white/10 shadow-[0_18px_55px_rgba(0,0,0,0.22)]">
          <div className="text-[11px] font-semibold uppercase tracking-[0.18em] text-white/45">
            Browse faster
          </div>

          <h2 className="mt-3 text-2xl font-semibold text-white">
            Interactive format explorer
          </h2>

          <p className="mt-2 max-w-3xl text-sm leading-6 text-white/65">
            The interactive format browser stays below as an enhancement, but
            the main format directory content above is now fully server-rendered
            for stronger crawlability and better index signals.
          </p>

          <div className="mt-6">
            <FormatsPageClient />
          </div>
        </section>
      </section>
    </main>
  );
}