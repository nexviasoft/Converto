import React from "react";

type RouteFamily =
  | "audio_to_audio"
  | "video_to_audio"
  | "video_to_video"
  | "video_to_image"
  | "image_to_image"
  | "general";

type HeroMeta = {
  eyebrow: string;
  headline: string;
  detail: string;
  bestFor: string;
  commonResult: string;
  goodAlternative: string;
  accentClass: string;
  surfaceClass: string;
  glowClass: string;
};

function getSummaryMeta(family: RouteFamily): HeroMeta {
  if (family === "video_to_audio") {
    return {
      eyebrow: "Audio extraction route",
      headline: "Pull the sound out and leave the visual weight behind",
      detail:
        "Best when the real value is the voice, soundtrack, lecture, podcast, or interview inside the source video.",
      bestFor: "Audio extraction",
      commonResult: "Smaller listening copy",
      goodAlternative: "WAV or AAC",
      accentClass: "text-emerald-200",
      surfaceClass:
        "bg-[linear-gradient(135deg,rgba(16,185,129,0.16),rgba(255,255,255,0.04))] border-emerald-400/20",
      glowClass:
        "bg-[radial-gradient(circle_at_top_left,rgba(16,185,129,0.22),transparent_42%),radial-gradient(circle_at_bottom_right,rgba(255,255,255,0.08),transparent_38%)]",
    };
  }

  if (family === "video_to_video") {
    return {
      eyebrow: "Playback route",
      headline: "Reshape a heavy or awkward video into a more practical copy",
      detail:
        "Useful when sharing, uploading, browser playback, or everyday compatibility matters more than the original container.",
      bestFor: "Playback and sharing",
      commonResult: "More practical delivery file",
      goodAlternative: "MP4 or WEBM",
      accentClass: "text-sky-200",
      surfaceClass:
        "bg-[linear-gradient(135deg,rgba(59,130,246,0.16),rgba(255,255,255,0.04))] border-sky-400/20",
      glowClass:
        "bg-[radial-gradient(circle_at_top_left,rgba(59,130,246,0.2),transparent_42%),radial-gradient(circle_at_bottom_right,rgba(255,255,255,0.08),transparent_38%)]",
    };
  }

  if (family === "video_to_image") {
    return {
      eyebrow: "Visual export route",
      headline: "Freeze motion into something lighter, simpler, and more reusable",
      detail:
        "Strong for thumbnails, poster frames, previews, and fast visual assets that do not need the full video anymore.",
      bestFor: "Thumbnails and previews",
      commonResult: "Light visual asset",
      goodAlternative: "PNG or JPG",
      accentClass: "text-amber-200",
      surfaceClass:
        "bg-[linear-gradient(135deg,rgba(245,158,11,0.16),rgba(255,255,255,0.04))] border-amber-400/20",
      glowClass:
        "bg-[radial-gradient(circle_at_top_left,rgba(245,158,11,0.22),transparent_42%),radial-gradient(circle_at_bottom_right,rgba(255,255,255,0.08),transparent_38%)]",
    };
  }

  if (family === "image_to_image") {
    return {
      eyebrow: "Image optimization route",
      headline: "Switch image formats based on fit, not habit",
      detail:
        "Useful when size, transparency, upload rules, editing comfort, or web delivery matter more than the current extension.",
      bestFor: "Lighter uploads",
      commonResult: "Better web fit",
      goodAlternative: "WEBP or PNG",
      accentClass: "text-fuchsia-200",
      surfaceClass:
        "bg-[linear-gradient(135deg,rgba(217,70,239,0.16),rgba(255,255,255,0.04))] border-fuchsia-400/20",
      glowClass:
        "bg-[radial-gradient(circle_at_top_left,rgba(217,70,239,0.22),transparent_42%),radial-gradient(circle_at_bottom_right,rgba(255,255,255,0.08),transparent_38%)]",
    };
  }

  if (family === "audio_to_audio") {
    return {
      eyebrow: "Audio format route",
      headline: "Choose the audio format that matches the next job better",
      detail:
        "Great when you want a playback copy, a smaller shareable file, or a format better suited to your listening setup.",
      bestFor: "Playback fit",
      commonResult: "Smaller or more compatible audio",
      goodAlternative: "MP3 or FLAC",
      accentClass: "text-cyan-200",
      surfaceClass:
        "bg-[linear-gradient(135deg,rgba(34,211,238,0.16),rgba(255,255,255,0.04))] border-cyan-400/20",
      glowClass:
        "bg-[radial-gradient(circle_at_top_left,rgba(34,211,238,0.22),transparent_42%),radial-gradient(circle_at_bottom_right,rgba(255,255,255,0.08),transparent_38%)]",
    };
  }

  return {
    eyebrow: "Flexible route",
    headline: "Move into a more useful format without leaving the workflow",
    detail:
      "Good for quick everyday conversions when the destination format matters more than the original file structure.",
    bestFor: "Quick conversions",
    commonResult: "Faster format switching",
    goodAlternative: "Try another nearby target",
    accentClass: "text-white",
    surfaceClass:
      "bg-[linear-gradient(135deg,rgba(255,255,255,0.08),rgba(255,255,255,0.04))] border-white/12",
    glowClass:
      "bg-[radial-gradient(circle_at_top_left,rgba(255,255,255,0.12),transparent_42%),radial-gradient(circle_at_bottom_right,rgba(255,255,255,0.08),transparent_38%)]",
  };
}

function SignalPill({
  label,
  value,
}: {
  label: string;
  value: string;
}) {
  return (
    <div className="rounded-2xl border border-white/10 bg-black/20 px-4 py-3">
      <div className="text-[10px] font-semibold uppercase tracking-[0.18em] text-white/40">
        {label}
      </div>
      <div className="mt-2 text-sm font-semibold leading-6 text-white/92">
        {value}
      </div>
    </div>
  );
}

export default function RouteHeroHighlights({ family }: { family: RouteFamily }) {
  const meta = getSummaryMeta(family);

  return (
    <section className="mx-auto mt-7 max-w-[1100px]">
      <div className="grid gap-3 lg:grid-cols-[1.35fr_0.85fr]">
        <div
          className={[
            "relative overflow-hidden rounded-[28px] border p-5 shadow-[0_24px_70px_rgba(0,0,0,0.28)] ring-1 ring-white/10",
            meta.surfaceClass,
          ].join(" ")}
        >
          <div className={["pointer-events-none absolute inset-0", meta.glowClass].join(" ")} />

          <div className="relative">
            <div className={`text-[10px] font-semibold uppercase tracking-[0.22em] ${meta.accentClass}`}>
              {meta.eyebrow}
            </div>

            <div className="mt-3 flex flex-col gap-5 md:flex-row md:items-end md:justify-between">
              <div className="max-w-[620px]">
                <h2 className="text-[22px] font-semibold leading-tight tracking-[-0.02em] text-white md:text-[26px]">
                  {meta.headline}
                </h2>
                <p className="mt-3 text-sm leading-6 text-white/65">
                  {meta.detail}
                </p>
              </div>

              <div className="grid w-full max-w-[220px] grid-cols-3 gap-2 md:block md:space-y-2">
                <div className="rounded-2xl border border-white/10 bg-white/8 px-3 py-2 text-center">
                  <div className="text-[10px] uppercase tracking-[0.18em] text-white/38">
                    Route
                  </div>
                  <div className="mt-1 text-sm font-semibold text-white">
                    {family.replaceAll("_", " ")}
                  </div>
                </div>
                <div className="rounded-2xl border border-white/10 bg-white/6 px-3 py-2 text-center">
                  <div className="text-[10px] uppercase tracking-[0.18em] text-white/38">
                    Output feel
                  </div>
                  <div className="mt-1 text-sm font-semibold text-white">
                    Practical
                  </div>
                </div>
                <div className="rounded-2xl border border-white/10 bg-white/6 px-3 py-2 text-center">
                  <div className="text-[10px] uppercase tracking-[0.18em] text-white/38">
                    Goal
                  </div>
                  <div className="mt-1 text-sm font-semibold text-white">
                    Better fit
                  </div>
                </div>
              </div>
            </div>

            <div className="mt-5 grid gap-3 md:grid-cols-3">
              <SignalPill label="Best for" value={meta.bestFor} />
              <SignalPill label="Common result" value={meta.commonResult} />
              <SignalPill label="Good alternative" value={meta.goodAlternative} />
            </div>
          </div>
        </div>

        <div className="grid gap-3 sm:grid-cols-3 lg:grid-cols-1">
          <div className="rounded-[24px] border border-white/10 bg-white/[0.07] p-4 ring-1 ring-white/10 shadow-[0_16px_44px_rgba(0,0,0,0.2)]">
            <div className="text-[10px] font-semibold uppercase tracking-[0.18em] text-white/40">
              What this block does
            </div>
            <p className="mt-3 text-sm leading-6 text-white/62">
              It frames the route as a real product decision, not just a converter widget.
            </p>
          </div>

          <div className="rounded-[24px] border border-white/10 bg-black/20 p-4 ring-1 ring-white/10 shadow-[0_16px_44px_rgba(0,0,0,0.2)]">
            <div className="text-[10px] font-semibold uppercase tracking-[0.18em] text-white/40">
              Why it feels better
            </div>
            <p className="mt-3 text-sm leading-6 text-white/62">
              The main panel now behaves like a route intro while the side stack behaves like compact decision support.
            </p>
          </div>

          <div className="rounded-[24px] border border-dashed border-white/12 bg-white/[0.04] p-4 ring-1 ring-white/10 shadow-[0_16px_44px_rgba(0,0,0,0.2)]">
            <div className="text-[10px] font-semibold uppercase tracking-[0.18em] text-white/40">
              Result
            </div>
            <p className="mt-3 text-sm leading-6 text-white/62">
              Less “three same cards in a row”, more “specialized route panel”.
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}