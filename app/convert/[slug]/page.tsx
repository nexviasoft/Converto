import type { Metadata } from "next";
import { notFound } from "next/navigation";
import ConverterPageContent from "@/components/converter/ConverterPageContent";

type TargetFmt =
  | "MP3"
  | "WAV"
  | "M4A"
  | "AAC"
  | "OGG"
  | "OPUS"
  | "FLAC"
  | "AIFF"
  | "WMA"
  | "AMR"
  | "MP4"
  | "WEBM"
  | "MOV"
  | "MKV"
  | "AVI"
  | "WMV"
  | "FLV"
  | "M4V"
  | "MPG"
  | "MPEG"
  | "3GP"
  | "GIF"
  | "PNG"
  | "JPG"
  | "WEBP"
  | "BMP"
  | "TIFF"
  | "ICO"
  | "AVIF";

type PageProps = {
  params: Promise<{
    slug: string;
  }>;
};

const SITE_URL =
  process.env.NEXT_PUBLIC_SITE_URL?.replace(/\/$/, "") || "https://converto.tools";

const AUDIO_FORMATS = [
  "mp3",
  "wav",
  "m4a",
  "aac",
  "ogg",
  "opus",
  "flac",
  "aiff",
  "wma",
  "amr",
] as const;

const VIDEO_FORMATS = [
  "mp4",
  "webm",
  "mov",
  "mkv",
  "avi",
  "wmv",
  "flv",
  "m4v",
  "mpg",
  "mpeg",
  "3gp",
] as const;

const IMAGE_FORMATS = [
  "gif",
  "png",
  "jpg",
  "webp",
  "bmp",
  "tiff",
  "ico",
  "avif",
] as const;

function buildPairSlugs(
  fromFormats: readonly string[],
  toFormats: readonly string[]
): string[] {
  const slugs: string[] = [];

  for (const from of fromFormats) {
    for (const to of toFormats) {
      if (from === to) continue;
      slugs.push(`${from}-to-${to}`);
    }
  }

  return slugs;
}

function unique(items: string[]) {
  return [...new Set(items)];
}

function mapSlugPartToFmt(value: string): TargetFmt | null {
  const v = value.toLowerCase();

  if (v === "mp3") return "MP3";
  if (v === "wav") return "WAV";
  if (v === "m4a") return "M4A";
  if (v === "aac") return "AAC";
  if (v === "ogg") return "OGG";
  if (v === "opus") return "OPUS";
  if (v === "flac") return "FLAC";
  if (v === "aiff" || v === "aif") return "AIFF";
  if (v === "wma") return "WMA";
  if (v === "amr") return "AMR";

  if (v === "mp4") return "MP4";
  if (v === "webm") return "WEBM";
  if (v === "mov") return "MOV";
  if (v === "mkv") return "MKV";
  if (v === "avi") return "AVI";
  if (v === "wmv") return "WMV";
  if (v === "flv") return "FLV";
  if (v === "m4v") return "M4V";
  if (v === "mpg") return "MPG";
  if (v === "mpeg") return "MPEG";
  if (v === "3gp") return "3GP";

  if (v === "gif") return "GIF";
  if (v === "png") return "PNG";
  if (v === "jpg" || v === "jpeg") return "JPG";
  if (v === "webp") return "WEBP";
  if (v === "bmp") return "BMP";
  if (v === "tiff" || v === "tif") return "TIFF";
  if (v === "ico") return "ICO";
  if (v === "avif") return "AVIF";

  return null;
}

function parseSlug(slug?: string | null) {
  if (!slug || typeof slug !== "string") return null;

  const [input, output] = slug.split("-to-");
  if (!input || !output) return null;

  const suggestedInput = mapSlugPartToFmt(input);
  const suggestedOutput = mapSlugPartToFmt(output);

  if (!suggestedInput || !suggestedOutput) return null;

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

function isAudioFmt(fmt: string) {
  return [
    "MP3",
    "WAV",
    "M4A",
    "AAC",
    "OGG",
    "OPUS",
    "FLAC",
    "AIFF",
    "WMA",
    "AMR",
  ].includes(fmt);
}

function isVideoFmt(fmt: string) {
  return [
    "MP4",
    "WEBM",
    "MOV",
    "MKV",
    "AVI",
    "WMV",
    "FLV",
    "M4V",
    "MPG",
    "MPEG",
    "3GP",
  ].includes(fmt);
}

function isImageFmt(fmt: string) {
  return ["GIF", "PNG", "JPG", "WEBP", "BMP", "TIFF", "ICO", "AVIF"].includes(fmt);
}

function buildMetaTitle(input: string, output: string) {
  if (isVideoFmt(input) && isAudioFmt(output)) {
    return `${input} to ${output} Converter for Audio Extraction | Converto`;
  }

  if (isVideoFmt(input) && isVideoFmt(output)) {
    return `${input} to ${output} Video Converter Online | Converto`;
  }

  if (isImageFmt(input) && isImageFmt(output)) {
    return `${input} to ${output} Image Converter Online | Converto`;
  }

  if (isAudioFmt(input) && isAudioFmt(output)) {
    return `${input} to ${output} Audio Converter Online | Converto`;
  }

  return `${input} to ${output} Converter Online | Converto`;
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
  const slugs = unique([
    ...buildPairSlugs(AUDIO_FORMATS, AUDIO_FORMATS),
    ...buildPairSlugs(VIDEO_FORMATS, AUDIO_FORMATS),
    ...buildPairSlugs(VIDEO_FORMATS, VIDEO_FORMATS),
    ...buildPairSlugs(VIDEO_FORMATS, IMAGE_FORMATS),
    ...buildPairSlugs(IMAGE_FORMATS, IMAGE_FORMATS),
  ]);

  return slugs.map((slug) => ({ slug }));
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const resolvedParams = await params;
  const parsed = parseSlug(resolvedParams?.slug);

  if (!parsed) {
    return {
      title: "Page not found | Converto",
      description: "This converter route does not exist.",
      robots: {
        index: false,
        follow: false,
      },
    };
  }

  const { slug, inputUpper, outputUpper } = parsed;
  const canonicalUrl = `${SITE_URL}/convert/${slug}`;
  const title = buildMetaTitle(inputUpper, outputUpper);
  const description = buildMetaDescription(inputUpper, outputUpper);

  return {
    title,
    description,
    robots: {
      index: true,
      follow: true,
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
      seoTitle={buildSeoTitle(inputUpper, outputUpper)}
      seoDescription={buildSeoDescription(inputUpper, outputUpper)}
      suggestedInput={suggestedInput}
      suggestedOutput={suggestedOutput}
      rawInputLabel={input}
      rawOutputLabel={output}
    />
  );
}