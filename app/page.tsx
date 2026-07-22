import { SITE_URL } from "@/lib/siteUrl";
import type { Metadata } from "next";
import LandingPageClient from "@/components/landing/LandingPageClient";


export const metadata: Metadata = {
  description:
    "Convert audio, video, and image files online for free with Converto. Fast browser-based file converter for MP3, WAV, MP4, WEBM, GIF, and more.",
  alternates: {
    canonical: `${SITE_URL}/`,
  },
  openGraph: {
    title: "Converto — Free Online File Converter",
    description:
      "Convert audio, video, and image files online for free with Converto. Fast browser-based file converter for MP3, WAV, MP4, WEBM, GIF, and more.",
    url: `${SITE_URL}/`,
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