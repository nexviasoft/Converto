import type { Metadata } from "next";
import Script from "next/script";
import { Analytics } from "@vercel/analytics/react";
import { SpeedInsights } from "@vercel/speed-insights/next";
import AdSenseScript from "@/components/ads/AdsenseScript";
import "./globals.css";

const siteUrl =
  process.env.NEXT_PUBLIC_SITE_URL?.replace(/\/$/, "") ||
  "https://www.converto.tools";

const ADSENSE_CLIENT =
  process.env.NEXT_PUBLIC_ADSENSE_CLIENT || "ca-pub-4933934041035226";

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
    "Convert audio, video, image, and PDF files online with Converto. Fast browser-based file converter for MP3, WAV, MP4, WEBM, PNG, WEBP, PDF tools, and more.",
  keywords: [
    "file converter",
    "online converter",
    "audio converter",
    "video converter",
    "image converter",
    "PDF tools",
    "MP4 to MP3",
    "PNG to WEBP",
  ],
  applicationName: "Converto",
  authors: [{ name: "NexviaSoft" }],
  creator: "NexviaSoft",
  publisher: "NexviaSoft",
  alternates: {
    canonical: siteUrl,
  },
  openGraph: {
    title: "Converto — Free Online File Converter",
    description:
      "Convert audio, video, image, and PDF files online with Converto. Fast browser-based file converter for MP3, WAV, MP4, WEBM, PNG, WEBP, PDF tools, and more.",
    url: siteUrl,
    siteName: "Converto",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Converto — Free Online File Converter",
    description:
      "Convert audio, video, image, and PDF files online with Converto. Fast browser-based file converter for MP3, WAV, MP4, WEBM, PNG, WEBP, PDF tools, and more.",
  },
  icons: {
    icon: [
      { url: "/favicon.ico" },
      { url: "/brand/appicon.svg", type: "image/svg+xml" },
    ],
    apple: [{ url: "/brand/appicon.svg" }],
  },
  manifest: "/site.webmanifest",
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-snippet": -1,
      "max-image-preview": "large",
      "max-video-preview": -1,
    },
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
        </head>
      <body>
        <AdSenseScript />
        {children}

        <Script id="microsoft-clarity" strategy="afterInteractive">
            {`
              (function(c,l,a,r,i,t,y){
                c[a]=c[a]||function(){(c[a].q=c[a].q||[]).push(arguments)};
                t=l.createElement(r);t.async=1;t.src="https://www.clarity.ms/tag/"+i;
                y=l.getElementsByTagName(r)[0];y.parentNode.insertBefore(t,y);
              })(window, document, "clarity", "script", "w3d1a88xib");
            `}
        </Script>

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