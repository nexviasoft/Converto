// app/layout.tsx
import type { Metadata } from "next";
import "./globals.css";

const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || "https://converto.tools";

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
  title: {
    default: "Converto — Fast file converter",
    template: "%s — Converto",
  },
  description:
    "Convert images, documents, and (soon) videos with a clean, premium experience. Simple presets. No nonsense.",
  applicationName: "Converto",
  authors: [{ name: "NexviaSoft" }],
  creator: "NexviaSoft",
  publisher: "NexviaSoft",
  category: "Technology",
  alternates: {
    canonical: "/",
  },
  openGraph: {
    type: "website",
    url: "/",
    title: "Converto — Fast file converter",
    description:
      "Convert images, documents, and (soon) videos with a clean, premium experience.",
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
    title: "Converto — Fast file converter",
    description:
      "Convert images, documents, and (soon) videos with a clean, premium experience.",
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

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}