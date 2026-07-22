import { SITE_URL } from "@/lib/siteUrl";
import type { Metadata } from "next";
import ConverterPageContent from "@/components/converter/ConverterPageContent";

export const metadata: Metadata = {
  title: "Convert Files Online Free",
  description:
    "Free online file converter for audio, video, image, and everyday format changes without signup.",
  alternates: { canonical: `${SITE_URL}/converter` },
  openGraph: {
    title: "Convert Files Online Free | Converto",
    description: "Convert audio, video, and image files online without signup.",
    url: `${SITE_URL}/converter`,
    siteName: "Converto",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Convert Files Online Free | Converto",
    description: "Convert audio, video, and image files online without signup.",
  },
};

export default function ConverterPage() {
  return (
    <ConverterPageContent
      seoTitle="Convert files online"
      seoDescription="Free online file converter for audio, video, and everyday format changes."
    />
  );
}