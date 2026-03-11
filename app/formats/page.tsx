import type { Metadata } from "next";
import FormatsPageClient from "@/components/formats/FormatsPageClient";

const siteUrl =
  process.env.NEXT_PUBLIC_SITE_URL?.replace(/\/$/, "") ||
  "https://converto.tools";

export const metadata: Metadata = {
  title: "Supported File Formats",
  description:
    "Explore the audio, video, and image formats supported by Converto. Convert MP3, WAV, AAC, FLAC, MP4, WEBM, MOV, GIF, PNG, JPG, WEBP, and more online.",
  alternates: {
    canonical: `${siteUrl}/formats`,
  },
  openGraph: {
    title: "Supported File Formats | Converto",
    description:
      "Explore the audio, video, and image formats supported by Converto.",
    url: `${siteUrl}/formats`,
    siteName: "Converto",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Supported File Formats | Converto",
    description:
      "Explore the audio, video, and image formats supported by Converto.",
  },
};

export default function FormatsPage() {
  return <FormatsPageClient />;
}