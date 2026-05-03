import React from "react";
import FormatOverviewSection from "@/components/converter/sections/FormatOverviewSection";
import RouteSpecificFaqSection from "@/components/converter/sections/RouteSpecificFaqSection";
import ExtractAudioBenefitsSection from "@/components/converter/sections/ExtractAudioBenefitsSection";
import PlaybackAndSharingSection from "@/components/converter/sections/PlaybackAndSharingSection";
import ThumbnailAndPreviewSection from "@/components/converter/sections/ThumbnailAndPreviewSection";
import ImageFormatComparisonSection from "@/components/converter/sections/ImageFormatComparisonSection";
import AudioFormatFitSection from "@/components/converter/sections/AudioFormatFitSection";
import ConversionInsightsSection from "@/components/converter/sections/ConversionInsightsSection";

type RouteFamily =
  | "audio_to_audio"
  | "video_to_audio"
  | "video_to_video"
  | "video_to_image"
  | "image_to_image"
  | "general";

type ConverterPageContentEntry = {
  headline?: string;
  seoIntro?: string;
  quickAnswer?: string;

  intro: string;
  whatIsInput: string;
  whatIsOutput: string;
  whyConvert: string;

  bestFor?: string[];
  avoidIf?: string[];
  howToSteps?: string[];

  useCases: string[];
  qualityNotes: string;
  tips: string[];

  trustNote?: string;
  relatedConversions?: string[];

  faq: Array<{ q: string; a: string }>;
};

function cx(...classes: Array<string | false | null | undefined>) {
  return classes.filter(Boolean).join(" ");
}

function RouteNarrativePanel({
  family,
  content,
  inputLabel,
  outputLabel,
}: {
  family: RouteFamily;
  content: ConverterPageContentEntry;
  inputLabel: string;
  outputLabel: string;
}) {
  const familyTone =
    family === "video_to_audio"
      ? "This route is mostly about removing visual weight and keeping only the useful sound."
      : family === "video_to_video"
      ? "This route is mostly about making playback, upload, and sharing smoother."
      : family === "video_to_image"
      ? "This route is mostly about turning motion into a reusable visual asset."
      : family === "image_to_image"
      ? "This route is mostly about picking the image format that fits the job better."
      : family === "audio_to_audio"
      ? "This route is mostly about choosing the listening or editing format that makes more sense next."
      : "This route is mostly about practical format switching.";

  return (
    <section className="mx-auto mt-6 max-w-[1100px]">
      <div className="grid gap-4 lg:grid-cols-[1.15fr_0.85fr]">
        <div className="rounded-[28px] border border-white/10 bg-[linear-gradient(135deg,rgba(255,255,255,0.09),rgba(255,255,255,0.04))] p-6 ring-1 ring-white/10 shadow-[0_20px_60px_rgba(0,0,0,0.22)]">
          <div className="text-[10px] font-semibold uppercase tracking-[0.2em] text-white/42">
            Route perspective
          </div>

          <h2 className="mt-3 text-[22px] font-semibold tracking-[-0.02em] text-white md:text-[26px]">
            {content.headline ?? `${inputLabel} to ${outputLabel}`}
          </h2>

          <p className="mt-3 text-sm leading-7 text-white/68">
            {content.quickAnswer ?? content.seoIntro ?? content.intro}
          </p>

          <div className="mt-5 rounded-[22px] border border-white/10 bg-black/20 p-4">
            <div className="text-[10px] font-semibold uppercase tracking-[0.18em] text-white/40">
              Route reading
            </div>
            <p className="mt-2 text-sm leading-6 text-white/62">{familyTone}</p>
          </div>
        </div>

        <div className="grid gap-4">
          <div className="rounded-[24px] border border-white/10 bg-white/[0.07] p-5 ring-1 ring-white/10 shadow-[0_18px_50px_rgba(0,0,0,0.18)]">
            <div className="text-[10px] font-semibold uppercase tracking-[0.18em] text-white/42">
              Quick answer
            </div>
            <p className="mt-3 text-sm leading-6 text-white/65">
              {content.quickAnswer ??
                `${inputLabel} to ${outputLabel} is mainly useful when the current format is not the best fit for playback, sharing, editing, or upload.`}
            </p>
          </div>

          {content.trustNote ? (
            <div className="rounded-[24px] border border-emerald-400/15 bg-emerald-500/[0.08] p-5 ring-1 ring-emerald-400/10 shadow-[0_18px_50px_rgba(0,0,0,0.18)]">
              <div className="text-[10px] font-semibold uppercase tracking-[0.18em] text-emerald-200/80">
                Trust note
              </div>
              <p className="mt-3 text-sm leading-6 text-emerald-50/80">{content.trustNote}</p>
            </div>
          ) : null}
        </div>
      </div>
    </section>
  );
}

function DecisionStrip({
  title,
  items,
  tone = "default",
}: {
  title: string;
  items: string[];
  tone?: "default" | "good" | "warn";
}) {
  if (!items.length) return null;

  const toneClass =
    tone === "good"
      ? "border-emerald-400/15 bg-emerald-500/[0.08]"
      : tone === "warn"
      ? "border-amber-400/15 bg-amber-500/[0.08]"
      : "border-white/10 bg-white/[0.06]";

  return (
    <div className={cx("rounded-[24px] border p-5 ring-1 ring-white/10", toneClass)}>
      <div className="text-[10px] font-semibold uppercase tracking-[0.18em] text-white/42">
        {title}
      </div>

      <ul className="mt-4 space-y-3">
        {items.map((item) => (
          <li key={item} className="flex gap-3">
            <span className="mt-2 inline-flex h-2 w-2 shrink-0 rounded-full bg-white/45" />
            <span className="text-sm leading-6 text-white/65">{item}</span>
          </li>
        ))}
      </ul>
    </div>
  );
}

function RouteDecisionMatrix({
  content,
}: {
  content: ConverterPageContentEntry;
}) {
  const bestFor = content.bestFor ?? [];
  const avoidIf = content.avoidIf ?? [];
  const howToSteps = content.howToSteps ?? [];

  if (!bestFor.length && !avoidIf.length && !howToSteps.length) return null;

  return (
    <section className="mx-auto mt-6 max-w-[1100px]">
      <div className="grid gap-4 lg:grid-cols-3">
        <DecisionStrip title="Best for" items={bestFor} tone="good" />
        <DecisionStrip title="Avoid if" items={avoidIf} tone="warn" />
        <DecisionStrip title="How it usually goes" items={howToSteps} />
      </div>
    </section>
  );
}

function RelatedRouteChips({
  items,
}: {
  items: string[];
}) {
  if (!items.length) return null;

  return (
    <section className="mx-auto mt-6 max-w-[1100px]">
      <div className="rounded-[26px] border border-white/10 bg-white/[0.07] p-5 ring-1 ring-white/10 shadow-[0_18px_55px_rgba(0,0,0,0.22)]">
        <div className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
          <div>
            <div className="text-[10px] font-semibold uppercase tracking-[0.2em] text-white/42">
              Nearby conversion thinking
            </div>
            <h3 className="mt-2 text-lg font-semibold text-white">
              Related routes people often test next
            </h3>
          </div>

          <div className="text-xs text-white/45">
            Great for internal linking and route continuation
          </div>
        </div>

        <div className="mt-4 flex flex-wrap gap-2">
          {items.map((item) => (
            <span
              key={item}
              className="inline-flex rounded-full border border-white/10 bg-black/20 px-3 py-2 text-xs font-semibold text-white/70"
            >
              {item.replaceAll("-", " ").toUpperCase()}
            </span>
          ))}
        </div>
      </div>
    </section>
  );
}

export default function RouteAwareContentSections({
  family,
  customContent,
  activeInputLabel,
  activeOutputLabel,
}: {
  family: RouteFamily;
  customContent: ConverterPageContentEntry;
  activeInputLabel?: string | null;
  activeOutputLabel?: string | null;
}) {
  const inputLabel = activeInputLabel ?? "FILE";
  const outputLabel = activeOutputLabel ?? "FILE";

  const overview = (
    <FormatOverviewSection
      inputLabel={inputLabel}
      outputLabel={outputLabel}
      whatIsInput={customContent.whatIsInput}
      whatIsOutput={customContent.whatIsOutput}
    />
  );

  const insights = (
    <ConversionInsightsSection
      inputLabel={inputLabel}
      outputLabel={outputLabel}
      whyConvert={customContent.whyConvert}
      useCases={customContent.useCases}
      qualityNotes={customContent.qualityNotes}
      tips={customContent.tips}
    />
  );

  const faq = (
    <RouteSpecificFaqSection
      inputLabel={inputLabel}
      outputLabel={outputLabel}
      faq={customContent.faq}
    />
  );

  const narrative = (
    <RouteNarrativePanel
      family={family}
      content={customContent}
      inputLabel={inputLabel}
      outputLabel={outputLabel}
    />
  );

  const matrix = <RouteDecisionMatrix content={customContent} />;

  const related = (
    <RelatedRouteChips items={customContent.relatedConversions ?? []} />
  );

  if (family === "video_to_audio") {
    return (
      <>
        {narrative}
        {matrix}
        <ExtractAudioBenefitsSection inputLabel={inputLabel} outputLabel={outputLabel} />
        {overview}
        {insights}
        {related}
        {faq}
      </>
    );
  }

  if (family === "video_to_video") {
    return (
      <>
        {narrative}
        {matrix}
        <PlaybackAndSharingSection inputLabel={inputLabel} outputLabel={outputLabel} />
        {overview}
        {related}
        {insights}
        {faq}
      </>
    );
  }

  if (family === "video_to_image") {
    return (
      <>
        {narrative}
        {matrix}
        <ThumbnailAndPreviewSection inputLabel={inputLabel} outputLabel={outputLabel} />
        {related}
        {overview}
        {insights}
        {faq}
      </>
    );
  }

  if (family === "image_to_image") {
    return (
      <>
        {narrative}
        {matrix}
        <ImageFormatComparisonSection inputLabel={inputLabel} outputLabel={outputLabel} />
        {overview}
        {insights}
        {related}
        {faq}
      </>
    );
  }

  if (family === "audio_to_audio") {
    return (
      <>
        {narrative}
        {matrix}
        <AudioFormatFitSection inputLabel={inputLabel} outputLabel={outputLabel} />
        {related}
        {overview}
        {insights}
        {faq}
      </>
    );
  }

  return (
    <>
      {narrative}
      {matrix}
      {overview}
      {insights}
      {related}
      {faq}
    </>
  );
}