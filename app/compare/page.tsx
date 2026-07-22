import { SITE_URL } from "@/lib/siteUrl";
import type { Metadata } from "next";
import CompareHubPageClient from "@/components/compare/CompareHubPageClient";


export const metadata: Metadata = {
  title: "Format Comparisons",
  description:
    "Compare popular audio, video, and image formats like MP3 vs WAV, FLAC vs MP3, MP4 vs WEBM, PNG vs JPG, and more with Converto.",
  alternates: {
    canonical: `${SITE_URL}/compare`,
  },
  openGraph: {
    title: "Format Comparisons",
    description:
      "Compare popular audio, video, and image formats and choose the right one before converting.",
    url: `${SITE_URL}/compare`,
    siteName: "Converto",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Format Comparisons",
    description:
      "Compare popular audio, video, and image formats and choose the right one before converting.",
  },
};

export default function CompareHubPage() {
  return <CompareHubPageClient />;
}