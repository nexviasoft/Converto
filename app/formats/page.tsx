import type { Metadata } from "next";
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

export default function FormatsPage() {
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

      <FormatsPageClient />
    </main>
  );
}