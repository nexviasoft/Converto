import type { Metadata } from "next";
import FormatsPageClient from "@/components/formats/FormatsPageClient";

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
  return <FormatsPageClient />;
}