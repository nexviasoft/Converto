import type { Metadata } from "next";
import LandingPageClient from "@/components/landing/LandingPageClient";

const siteUrl =
  process.env.NEXT_PUBLIC_SITE_URL?.replace(/\/$/, "") ||
  "https://converto.tools";

export const metadata: Metadata = {
  title: "Converto — Free Online File Converter",
  description:
    "Convert audio, video, and image files online for free with Converto. Fast browser-based file converter for MP3, WAV, MP4, WEBM, GIF, and more.",
  alternates: {
    canonical: `${siteUrl}/`,
  },
  openGraph: {
    title: "Converto — Free Online File Converter",
    description:
      "Convert audio, video, and image files online for free with Converto. Fast browser-based file converter for MP3, WAV, MP4, WEBM, GIF, and more.",
    url: `${siteUrl}/`,
    siteName: "Converto",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Converto — Free Online File Converter",
    description:
      "Convert audio, video, and image files online for free with Converto. Fast browser-based file converter for MP3, WAV, MP4, WEBM, GIF, and more.",
  },
};

export default function Page() {
  return <LandingPageClient />;
}