import { SITE_URL } from "@/lib/siteUrl";
import type { Metadata } from "next";
import { notFound } from "next/navigation";
import ConverterPageContent from "@/components/converter/ConverterPageContent";
import {
  isAudioFmt,
  isImageFmt,
  isSupportedConversion,
  isVideoFmt,
  mapSlugPartToFmt,
} from "@/lib/conversionRules";

type PageProps = {
  params: Promise<{
    slug: string;
  }>;
};


function parseSlug(slug?: string | null) {
  if (!slug || typeof slug !== "string") return null;

  const [input, output] = slug.split("-to-");
  if (!input || !output) return null;

  const suggestedInput = mapSlugPartToFmt(input);
  const suggestedOutput = mapSlugPartToFmt(output);

  if (
    !suggestedInput ||
    !suggestedOutput ||
    !isSupportedConversion(suggestedInput, suggestedOutput)
  ) {
    return null;
  }

  return {
    slug,
    input,
    output,
    suggestedInput,
    suggestedOutput,
    inputUpper: suggestedInput,
    outputUpper: suggestedOutput,
  };
}

function buildMetaTitle(input: string, output: string) {
  if (isVideoFmt(input) && isAudioFmt(output)) {
    return `Batch ${input} to ${output} Converter`;
  }

  if (isVideoFmt(input) && isVideoFmt(output)) {
    return `Batch ${input} to ${output} Video Converter`;
  }

  if (isImageFmt(input) && isImageFmt(output)) {
    return `Batch ${input} to ${output} Image Converter`;
  }

  if (isAudioFmt(input) && isAudioFmt(output)) {
    return `Batch ${input} to ${output} Audio Converter`;
  }

  return `Batch ${input} to ${output} Converter`;
}

function buildMetaDescription(input: string, output: string) {
  return `Batch convert ${input} to ${output} online with Converto. Upload multiple files, keep one shared output format, and download the converted results together as a ZIP archive.`;
}

function buildSeoTitle(input: string, output: string) {
  return `Batch convert ${input} to ${output} online`;
}

function buildSeoDescription(input: string, output: string) {
  return `Free online batch ${input} to ${output} converter for folders, repeated exports, and multi-file workflows with one shared target format.`;
}

export function generateStaticParams() {
  // Batch routes remain available on demand, but are intentionally not
  // pre-rendered or indexed until each route has substantial unique content.
  return [];
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const resolvedParams = await params;
  const parsed = parseSlug(resolvedParams?.slug);

  if (!parsed) {
    return {
      title: "Page not found",
      description: "This batch conversion page does not exist.",
      robots: {
        index: false,
        follow: false,
      },
    };
  }

  const { slug, inputUpper, outputUpper } = parsed;
  const canonicalUrl = `${SITE_URL}/convert/batch/${slug}`;
  const title = buildMetaTitle(inputUpper, outputUpper);
  const description = buildMetaDescription(inputUpper, outputUpper);

  return {
    title,
    description,
    robots: {
      index: false,
      follow: true,
      googleBot: {
        index: false,
        follow: true,
      },
    },
    alternates: {
      canonical: canonicalUrl,
    },
    openGraph: {
      title,
      description,
      url: canonicalUrl,
      siteName: "Converto",
      type: "website",
    },
    twitter: {
      card: "summary_large_image",
      title,
      description,
    },
  };
}

export default async function ConvertBatchSlugPage({ params }: PageProps) {
  const resolvedParams = await params;
  const parsed = parseSlug(resolvedParams?.slug);

  if (!parsed) notFound();

  const {
    slug,
    input,
    output,
    suggestedInput,
    suggestedOutput,
    inputUpper,
    outputUpper,
  } = parsed;

  return (
    <ConverterPageContent
      slug={slug}
      seoMode="batch"
      seoTitle={buildSeoTitle(inputUpper, outputUpper)}
      seoDescription={buildSeoDescription(inputUpper, outputUpper)}
      suggestedInput={suggestedInput}
      suggestedOutput={suggestedOutput}
      rawInputLabel={input}
      rawOutputLabel={output}
      adsEligible={false}
    />
  );
}
