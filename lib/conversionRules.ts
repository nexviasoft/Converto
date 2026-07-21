export type TargetFmt =
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

export const AUDIO_TARGETS: TargetFmt[] = [
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
];

export const VIDEO_TARGETS: TargetFmt[] = [
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
];

// Public image formats. TIFF and ICO are enabled again now that the backend
// has stable presets for both directions.
export const IMAGE_INPUT_FORMATS: TargetFmt[] = [
  "GIF",
  "PNG",
  "JPG",
  "WEBP",
  "BMP",
  "TIFF",
  "ICO",
  "AVIF",
];

export const IMAGE_TARGETS: TargetFmt[] = [
  "GIF",
  "PNG",
  "JPG",
  "WEBP",
  "BMP",
  "TIFF",
  "ICO",
  "AVIF",
];

// ICO is a purpose-built icon output, so animated GIF input is not offered as
// an ICO source. ICO input is converted only to practical raster formats.
const ICO_INPUT_TARGETS: TargetFmt[] = [
  "PNG",
  "JPG",
  "WEBP",
  "BMP",
  "TIFF",
  "AVIF",
];

const GIF_INPUT_TARGETS: TargetFmt[] = [
  "PNG",
  "JPG",
  "WEBP",
  "BMP",
  "TIFF",
  "AVIF",
];

// Video can produce an animation or practical still/thumbnail formats. ICO and
// TIFF stay image-to-image only because they are not sensible video exports.
export const VIDEO_VISUAL_TARGETS: TargetFmt[] = [
  "GIF",
  "PNG",
  "JPG",
  "WEBP",
];

export const ALL_FILE_FORMATS: TargetFmt[] = [
  ...AUDIO_TARGETS,
  ...VIDEO_TARGETS,
  ...IMAGE_INPUT_FORMATS,
];

export const ALL_TARGET_OPTIONS: TargetFmt[] = [
  ...AUDIO_TARGETS,
  ...VIDEO_TARGETS,
  ...IMAGE_TARGETS,
];

export function normalizeFormat(value?: string | null): string | null {
  if (!value) return null;
  return value.toString().trim().toUpperCase();
}

export function isAudioFmt(fmt: string | null | undefined) {
  return Boolean(fmt && AUDIO_TARGETS.includes(fmt as TargetFmt));
}

export function isVideoFmt(fmt: string | null | undefined) {
  return Boolean(fmt && VIDEO_TARGETS.includes(fmt as TargetFmt));
}

export function isImageFmt(fmt: string | null | undefined) {
  return Boolean(fmt && IMAGE_INPUT_FORMATS.includes(fmt as TargetFmt));
}

export function getAvailableTargets(inputFmt?: string | null): TargetFmt[] {
  const fmt = normalizeFormat(inputFmt) as TargetFmt | null;
  let targets: TargetFmt[];

  if (isAudioFmt(fmt)) {
    targets = AUDIO_TARGETS;
  } else if (isVideoFmt(fmt)) {
    targets = [
      ...AUDIO_TARGETS,
      ...VIDEO_TARGETS,
      ...VIDEO_VISUAL_TARGETS,
    ];
  } else if (fmt === "ICO") {
    targets = ICO_INPUT_TARGETS;
  } else if (fmt === "GIF") {
    targets = GIF_INPUT_TARGETS;
  } else if (isImageFmt(fmt)) {
    targets = IMAGE_TARGETS;
  } else {
    targets = ALL_TARGET_OPTIONS;
  }

  return targets.filter((target) => target !== fmt);
}

export function isSupportedConversion(
  inputFmt?: string | null,
  outputFmt?: string | null,
) {
  const input = normalizeFormat(inputFmt) as TargetFmt | null;
  const output = normalizeFormat(outputFmt) as TargetFmt | null;

  if (!input || !output || input === output) return false;
  if (!ALL_FILE_FORMATS.includes(input)) return false;
  if (!ALL_TARGET_OPTIONS.includes(output)) return false;
  return getAvailableTargets(input).includes(output);
}

export function isSupportedConversionHref(href: string) {
  const match = href.match(
    /^\/convert\/(?:batch\/)?([^/?#]+)-to-([^/?#]+)/i,
  );

  if (!match) return true;

  const input = mapSlugPartToFmt(match[1]);
  const output = mapSlugPartToFmt(match[2]);
  return isSupportedConversion(input, output);
}

export function mapSlugPartToFmt(value: string): TargetFmt | null {
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
