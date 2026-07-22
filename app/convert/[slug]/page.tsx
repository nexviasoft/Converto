import { SITE_URL } from "@/lib/siteUrl";
import type { Metadata } from "next";
import { notFound } from "next/navigation";
import ConverterPageContent from "@/components/converter/ConverterPageContent";
import { getConverterContent } from "@/lib/converterContent";
import {
  INDEXABLE_CONVERTER_SLUGS,
  isIndexableConverterSlug,
} from "@/lib/indexingPolicy";
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
    return `${input} to ${output} Converter for Audio Extraction`;
  }

  if (isVideoFmt(input) && isVideoFmt(output)) {
    return `${input} to ${output} Video Converter Online`;
  }

  if (isImageFmt(input) && isImageFmt(output)) {
    return `${input} to ${output} Image Converter Online`;
  }

  if (isAudioFmt(input) && isAudioFmt(output)) {
    return `${input} to ${output} Audio Converter Online`;
  }

  return `${input} to ${output} Converter Online`;
}

function buildMetaDescription(input: string, output: string) {
  if (isVideoFmt(input) && isAudioFmt(output)) {
    return `Convert ${input} to ${output} online with Converto. Extract audio from video for music, lectures, interviews, podcasts, and everyday listening workflows.`;
  }

  if (isVideoFmt(input) && isVideoFmt(output)) {
    return `Convert ${input} to ${output} online with Converto. Improve playback compatibility, sharing, and video support across browsers, devices, and apps.`;
  }

  if (isImageFmt(input) && isImageFmt(output)) {
    return `Convert ${input} to ${output} online with Converto. Change image format for compression, compatibility, transparency needs, upload workflows, and simpler sharing.`;
  }

  if (isAudioFmt(input) && isAudioFmt(output)) {
    return `Convert ${input} to ${output} online with Converto. Switch audio format for better compatibility, storage efficiency, playback support, and everyday listening.`;
  }

  return `Convert ${input} to ${output} online with Converto. Fast file conversion for compatibility, sharing, storage, and practical everyday workflow needs.`;
}

function buildSeoTitle(input: string, output: string) {
  if (isVideoFmt(input) && isAudioFmt(output)) {
    return `Convert ${input} to ${output} online and extract audio`;
  }

  if (isVideoFmt(input) && isVideoFmt(output)) {
    return `Convert ${input} to ${output} online`;
  }

  if (isImageFmt(input) && isImageFmt(output)) {
    return `Convert ${input} to ${output} images online`;
  }

  if (isAudioFmt(input) && isAudioFmt(output)) {
    return `Convert ${input} to ${output} audio online`;
  }

  return `Convert ${input} to ${output} online`;
}

function buildSeoDescription(input: string, output: string) {
  if (isVideoFmt(input) && isAudioFmt(output)) {
    return `Free online ${input} to ${output} converter for extracting usable audio from video files in a quick and simple workflow.`;
  }

  if (isVideoFmt(input) && isVideoFmt(output)) {
    return `Free online ${input} to ${output} converter designed for smoother compatibility, sharing, and practical video delivery workflows.`;
  }

  if (isImageFmt(input) && isImageFmt(output)) {
    return `Free online ${input} to ${output} converter built for image compatibility, compression, sharing, and upload-ready file changes.`;
  }

  if (isAudioFmt(input) && isAudioFmt(output)) {
    return `Free online ${input} to ${output} converter for everyday audio compatibility, smaller files, and easier playback across devices.`;
  }

  return `Free online ${input} to ${output} converter. Fast and simple file conversion for practical everyday use.`;
}

export function generateStaticParams() {
  return INDEXABLE_CONVERTER_SLUGS.map((slug) => ({ slug }));
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const resolvedParams = await params;
  const parsed = parseSlug(resolvedParams?.slug);

  if (!parsed) {
    return {
      title: "Page not found",
      description: "This conversion page does not exist.",
      robots: {
        index: false,
        follow: false,
      },
    };
  }

  const { slug, inputUpper, outputUpper } = parsed;
  const canonicalUrl = `${SITE_URL}/convert/${slug}`;
  const customContent = getConverterContent(slug);
  const indexable = isIndexableConverterSlug(slug) && Boolean(customContent);
  const title = customContent?.headline ?? buildMetaTitle(inputUpper, outputUpper);
  const description =
    customContent?.seoIntro ?? buildMetaDescription(inputUpper, outputUpper);

  return {
    title,
    description,
    robots: {
      index: indexable,
      follow: true,
      googleBot: {
        index: indexable,
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

export default async function ConvertSlugPage({ params }: PageProps) {
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
      seoMode="convert"
      seoTitle={buildSeoTitle(inputUpper, outputUpper)}
      seoDescription={buildSeoDescription(inputUpper, outputUpper)}
      suggestedInput={suggestedInput}
      suggestedOutput={suggestedOutput}
      rawInputLabel={input}
      rawOutputLabel={output}
      customContent={getConverterContent(slug)}
      adsEligible={isIndexableConverterSlug(slug)}
    />
  );
}
