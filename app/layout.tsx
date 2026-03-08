import type { Metadata } from "next";
import "./globals.css";

const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || "https://converto.tools";

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
  title: {
    default: "Converto — Free Online File Converter",
    template: "%s | Converto",
  },
  description:
    "Convert audio, video, and image files online for free with Converto. Fast browser-based file converter for MP3, WAV, AAC, FLAC, MP4, WEBM, MOV, GIF and more.",
  applicationName: "Converto",
  keywords: [
    "file converter",
    "online converter",
    "mp4 to mp3",
    "audio converter",
    "video converter",
    "free file converter",
    "browser converter",
    "converto",
  ],
  authors: [{ name: "NexviaSoft" }],
  creator: "NexviaSoft",
  publisher: "NexviaSoft",
  category: "Technology",
  alternates: {
    canonical: "/",
  },
  openGraph: {
    type: "website",
    url: siteUrl,
    title: "Converto — Free Online File Converter",
    description:
      "Convert audio, video, and image files online for free with Converto. Fast browser-based conversion for common formats.",
    siteName: "Converto",
    images: [
      {
        url: "/og.png",
        width: 1200,
        height: 630,
        alt: "Converto",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Converto — Free Online File Converter",
    description:
      "Free online converter for audio, video, and image files. Fast browser-based workflow.",
    images: ["/og.png"],
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-image-preview": "large",
      "max-snippet": -1,
      "max-video-preview": -1,
    },
  },
  icons: {
    icon: "/favicon.ico",
    apple: "/apple-touch-icon.png",
  },
};

const organizationSchema = {
  "@context": "https://schema.org",
  "@type": "Organization",
  name: "NexviaSoft",
  url: siteUrl,
  logo: `${siteUrl}/brand/converto-logo.svg`,
};

const webSiteSchema = {
  "@context": "https://schema.org",
  "@type": "WebSite",
  name: "Converto",
  url: siteUrl,
  publisher: {
    "@type": "Organization",
    name: "NexviaSoft",
  },
};

const softwareSchema = {
  "@context": "https://schema.org",
  "@type": "SoftwareApplication",
  name: "Converto",
  applicationCategory: "MultimediaApplication",
  operatingSystem: "Any",
  offers: {
    "@type": "Offer",
    price: "0",
    priceCurrency: "USD",
  },
  url: siteUrl,
  description:
    "Free online file converter for audio, video, and image formats.",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(organizationSchema) }}
        />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(webSiteSchema) }}
        />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(softwareSchema) }}
        />
        {children}
      </body>
    </html>
  );
}