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
  | "MP4"
  | "WEBM"
  | "MOV"
  | "GIF";

type PageProps = {
  params: Promise<{
    slug: string;
  }>;
};

const SITE_URL =
  process.env.NEXT_PUBLIC_SITE_URL?.replace(/\/$/, "") || "https://converto.tools";

const AUDIO_FORMATS = ["mp3", "wav", "m4a", "aac", "ogg", "opus", "flac"] as const;
const VIDEO_FORMATS = ["mp4", "webm", "mov"] as const;
const IMAGE_FORMATS = ["gif"] as const;

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
  if (v === "mp4") return "MP4";
  if (v === "webm") return "WEBM";
  if (v === "mov") return "MOV";
  if (v === "gif") return "GIF";

  if (
    v === "mkv" ||
    v === "avi" ||
    v === "wmv" ||
    v === "flv" ||
    v === "mpg" ||
    v === "mpeg" ||
    v === "m4v" ||
    v === "3gp" ||
    v === "ts" ||
    v === "mts" ||
    v === "m2ts"
  ) {
    return "MP4";
  }

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
    inputUpper: input.toUpperCase(),
    outputUpper: output.toUpperCase(),
  };
}

export function generateStaticParams() {
  const slugs = unique([
    ...buildPairSlugs(AUDIO_FORMATS, AUDIO_FORMATS),
    ...buildPairSlugs(VIDEO_FORMATS, AUDIO_FORMATS),
    ...buildPairSlugs(VIDEO_FORMATS, VIDEO_FORMATS),
    ...buildPairSlugs(VIDEO_FORMATS, IMAGE_FORMATS),
    ...buildPairSlugs(IMAGE_FORMATS, VIDEO_FORMATS),
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

  const title = `${inputUpper} to ${outputUpper} Converter Online Free | Converto`;
  const description = `Convert ${inputUpper} to ${outputUpper} online for free with Converto. Fast browser-based file conversion for quick audio, video, and format compatibility tasks.`;

  return {
    title,
    description,
    robots: {
      index: true,
      follow: true,
    },
    alternates: {
      canonical: `${SITE_URL}/convert/${slug}`,
    },
    openGraph: {
      title,
      description,
      url: `${SITE_URL}/convert/${slug}`,
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
    input,
    output,
    suggestedInput,
    suggestedOutput,
    inputUpper,
    outputUpper,
  } = parsed;

  return (
    <ConverterPageContent
      seoTitle={`Convert ${inputUpper} to ${outputUpper} online`}
      seoDescription={`Free online ${inputUpper} to ${outputUpper} converter. Fast, simple, browser-based, and built for quick everyday file conversion tasks.`}
      suggestedInput={suggestedInput}
      suggestedOutput={suggestedOutput}
      rawInputLabel={input}
      rawOutputLabel={output}
    />
  );
}