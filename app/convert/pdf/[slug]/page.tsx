import type { Metadata } from "next";
import { notFound } from "next/navigation";
import ConverterPageContent from "@/components/converter/ConverterPageContent";

type PdfSlug = "split" | "to-png" | "to-jpg" | "to-webp";

type PageProps = {
  params: Promise<{
    slug: string;
  }>;
};

const SITE_URL =
  process.env.NEXT_PUBLIC_SITE_URL?.replace(/\/$/, "") ||
  "https://www.converto.tools";

function parsePdfSlug(slug?: string | null) {
  const normalized = String(slug || "").toLowerCase();

  if (normalized === "split") {
    return {
      slug: "split" as PdfSlug,
      pdfTool: "split_pdf" as const,
      title: "Split PDF Online | Extract Selected Pages | Converto",
      description:
        "Split PDF files online with Converto. Extract selected pages by page range and download a smaller PDF in a focused workflow.",
      seoTitle: "Split PDF online",
      seoDescription:
        "Upload a PDF, choose the page range you want to keep, and download the extracted PDF file with Converto.",
      canonicalPath: "/convert/pdf/split",
      suggestedOutput: "PDF" as const,
    };
  }

  if (normalized === "to-png") {
    return {
      slug: "to-png" as PdfSlug,
      pdfTool: "pdf_to_image" as const,
      title: "PDF to PNG Converter Online | Converto",
      description:
        "Convert PDF pages to PNG online with Converto. Export page previews, visuals, and document pages as PNG images.",
      seoTitle: "Convert PDF to PNG online",
      seoDescription:
        "Upload a PDF and export its pages as PNG images in Converto.",
      canonicalPath: "/convert/pdf/to-png",
      suggestedOutput: "PNG" as const,
    };
  }

  if (normalized === "to-jpg") {
    return {
      slug: "to-jpg" as PdfSlug,
      pdfTool: "pdf_to_image" as const,
      title: "PDF to JPG Converter Online | Converto",
      description:
        "Convert PDF pages to JPG online with Converto. Export page previews, shared visuals, and document pages as JPG images.",
      seoTitle: "Convert PDF to JPG online",
      seoDescription:
        "Upload a PDF and export its pages as JPG images in Converto.",
      canonicalPath: "/convert/pdf/to-jpg",
      suggestedOutput: "JPG" as const,
    };
  }

  if (normalized === "to-webp") {
    return {
      slug: "to-webp" as PdfSlug,
      pdfTool: "pdf_to_image" as const,
      title: "PDF to WEBP Converter Online | Converto",
      description:
        "Convert PDF pages to WEBP online with Converto. Export lighter page previews and document visuals as WEBP images.",
      seoTitle: "Convert PDF to WEBP online",
      seoDescription:
        "Upload a PDF and export its pages as WEBP images in Converto.",
      canonicalPath: "/convert/pdf/to-webp",
      suggestedOutput: "WEBP" as const,
    };
  }

  return null;
}

export function generateStaticParams() {
  return [
    { slug: "split" },
    { slug: "to-png" },
    { slug: "to-jpg" },
    { slug: "to-webp" },
  ];
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const resolvedParams = await params;
  const parsed = parsePdfSlug(resolvedParams?.slug);

  if (!parsed) {
    return {
      title: "Page not found | Converto",
      description: "This PDF tools route does not exist.",
      robots: {
        index: false,
        follow: false,
      },
    };
  }

  const canonicalUrl = `${SITE_URL}${parsed.canonicalPath}`;

  return {
    title: parsed.title,
    description: parsed.description,
    robots: {
      index: true,
      follow: true,
    },
    alternates: {
      canonical: canonicalUrl,
    },
    openGraph: {
      title: parsed.title,
      description: parsed.description,
      url: canonicalUrl,
      siteName: "Converto",
      type: "website",
    },
    twitter: {
      card: "summary_large_image",
      title: parsed.title,
      description: parsed.description,
    },
  };
}

export default async function ConvertPdfSlugPage({ params }: PageProps) {
  const resolvedParams = await params;
  const parsed = parsePdfSlug(resolvedParams?.slug);

  if (!parsed) notFound();

  return (
    <ConverterPageContent
      seoMode="pdf"
      pdfTool={parsed.pdfTool}
      seoTitle={parsed.seoTitle}
      seoDescription={parsed.seoDescription}
      suggestedOutput={parsed.pdfTool === "pdf_to_image" ? parsed.suggestedOutput : undefined}
    />
  );
}
