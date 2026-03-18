import type { Metadata } from "next";
import { Analytics } from "@vercel/analytics/react";
import { SpeedInsights } from "@vercel/speed-insights/next";
import "./globals.css";

const siteUrl =
  process.env.NEXT_PUBLIC_SITE_URL?.replace(/\/$/, "") ||
  "https://converto.tools";

const ADSENSE_CLIENT = "ca-pub-4933934041035226";

const webAppSchema = {
  "@context": "https://schema.org",
  "@type": "WebApplication",
  name: "Converto",
  url: siteUrl,
  applicationCategory: "MultimediaApplication",
  operatingSystem: "Web",
  browserRequirements: "Requires JavaScript and a modern browser.",
  description:
    "Free online file converter for audio, video, and image formats. Convert MP4 to MP3, MP3 to WAV, WEBM to MP3, MOV to MP4, and more with Converto.",
  creator: {
    "@type": "Organization",
    name: "NexviaSoft",
    url: siteUrl,
  },
  publisher: {
    "@type": "Organization",
    name: "NexviaSoft",
    url: siteUrl,
  },
};

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
  title: {
    default: "Converto — Free Online File Converter",
    template: "%s | Converto",
  },
  description:
    "Convert audio, video, and image files online for free with Converto. Fast browser-based file converter for MP3, WAV, MP4, WEBM, GIF, and more.",
  alternates: {
    canonical: siteUrl,
  },
  openGraph: {
    title: "Converto — Free Online File Converter",
    description:
      "Convert audio, video, and image files online for free with Converto. Fast browser-based file converter for MP3, WAV, MP4, WEBM, GIF, and more.",
    url: siteUrl,
    siteName: "Converto",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Converto — Free Online File Converter",
    description:
      "Convert audio, video, and image files online for free with Converto. Fast browser-based file converter for MP3, WAV, MP4, WEBM, GIF, and more.",
  },
  other: {
    "google-adsense-account": ADSENSE_CLIENT,
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <head>
        <meta name="google-adsense-account" content={ADSENSE_CLIENT} />
        <script
          async
          src={`https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=${ADSENSE_CLIENT}`}
          crossOrigin="anonymous"
        />
      </head>
      <body>
        {children}

        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify(webAppSchema),
          }}
        />

        <Analytics />
        <SpeedInsights />
      </body>
    </html>
  );
}