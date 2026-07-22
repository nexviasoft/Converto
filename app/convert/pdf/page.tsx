import { SITE_URL } from "@/lib/siteUrl";
import type { Metadata } from "next";
import ConverterPageContent from "@/components/converter/ConverterPageContent";


export const metadata: Metadata = {
  title: "PDF Tools Online | Create PDF, Split PDF, PDF to Image",
  description:
    "Use Converto PDF tools to create PDFs from images, split PDFs by page range, and export PDF pages as PNG, JPG, or WEBP from one focused workflow.",
  robots: {
    index: true,
    follow: true,
  },
  alternates: {
    canonical: `${SITE_URL}/convert/pdf`,
  },
  openGraph: {
    title: "PDF Tools Online | Create PDF, Split PDF, PDF to Image",
    description:
      "Create PDFs from images, split PDFs by page range, and export PDF pages as PNG, JPG, or WEBP with Converto.",
    url: `${SITE_URL}/convert/pdf`,
    siteName: "Converto",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "PDF Tools Online",
    description:
      "Create PDFs from images, split PDFs, and export PDF pages as images with Converto.",
  },
};

export default function ConvertPdfPage() {
  return (
    <ConverterPageContent
      seoMode="pdf"
      pdfTool="to_pdf"
      seoTitle="PDF tools online"
      seoDescription="Create PDFs from images, split PDFs by page range, and export PDF pages as PNG, JPG, or WEBP from one focused page in Converto."
    />
  );
}
