import React from "react";

type RouteFamily =
  | "audio_to_audio"
  | "video_to_audio"
  | "video_to_video"
  | "video_to_image"
  | "image_to_image"
  | "general";

type CompareCard = {
  title: string;
  body: string;
  tone: "solid" | "soft" | "outline";
  accent?: string;
};

function getCompareCards(
  family: RouteFamily,
  inputLabel: string,
  outputLabel: string
): CompareCard[] {
  if (family === "video_to_audio") {
    return [
      {
        title: `${outputLabel} as the practical copy`,
        body: `When the visual layer stops mattering, ${outputLabel} becomes the lighter everyday version for listening, storage, and sharing.`,
        tone: "solid",
        accent: "text-emerald-200",
      },
      {
        title: `${inputLabel} as the source version`,
        body: `Keep the original ${inputLabel} when the video may still matter later or when you may want a stronger source for extraction again.`,
        tone: "soft",
      },
      {
        title: `Best alternative next`,
        body: `If ${outputLabel} feels too final or too compressed, test WAV or FLAC for a less convenience-focused result.`,
        tone: "outline",
      },
    ];
  }

  if (family === "image_to_image") {
    return [
      {
        title: `Format fit matters more than habit`,
        body: `The better image format depends on whether you care about transparency, weight, web delivery, editing comfort, or upload rules.`,
        tone: "solid",
        accent: "text-fuchsia-200",
      },
      {
        title: `Watch the tradeoff`,
        body: `${inputLabel} and ${outputLabel} are rarely “better” in every direction. One usually wins on size while the other wins on handling or clarity.`,
        tone: "soft",
      },
      {
        title: `Good next test`,
        body: `If ${outputLabel} still feels wrong, compare WEBP, PNG, and JPG from the same source to find the better publishing fit.`,
        tone: "outline",
      },
    ];
  }

  if (family === "audio_to_audio") {
    return [
      {
        title: `Listening copy vs source copy`,
        body: `${outputLabel} is often the easier file to carry around, while ${inputLabel} may still be the smarter file to keep as your stronger source.`,
        tone: "solid",
        accent: "text-cyan-200",
      },
      {
        title: `Playback is usually the win`,
        body: `This kind of route is often less about “quality upgrades” and more about choosing what behaves better on real devices.`,
        tone: "soft",
      },
      {
        title: `Alternative path`,
        body: `If ${outputLabel} is not the right balance, test another nearby audio format before leaving the route.`,
        tone: "outline",
      },
    ];
  }

  if (family === "video_to_video") {
    return [
      {
        title: `Delivery-first thinking`,
        body: `${outputLabel} often wins when your main job is playback, sharing, browser support, or sending the file to someone else.`,
        tone: "solid",
        accent: "text-sky-200",
      },
      {
        title: `The source still matters`,
        body: `${inputLabel} may remain the better original if it came from a production workflow, camera export, or archive-friendly setup.`,
        tone: "soft",
      },
      {
        title: `When to test another target`,
        body: `If ${outputLabel} still feels awkward, compare another playback-friendly video format rather than forcing one route.`,
        tone: "outline",
      },
    ];
  }

  if (family === "video_to_image") {
    return [
      {
        title: `Motion becomes asset`,
        body: `${outputLabel} is useful when you only need the frame, preview, thumbnail, or lightweight visual and not the full moving file.`,
        tone: "solid",
        accent: "text-amber-200",
      },
      {
        title: `This is not the same job`,
        body: `You are no longer optimizing for playback here. You are optimizing for selection, display, preview, or reuse.`,
        tone: "soft",
      },
      {
        title: `Try another image flavor`,
        body: `If ${outputLabel} is not the right visual result, compare PNG, JPG, or GIF depending on clarity and weight.`,
        tone: "outline",
      },
    ];
  }

  return [];
}

function getCardClass(tone: CompareCard["tone"]) {
  if (tone === "solid") {
    return "border-white/10 bg-[linear-gradient(135deg,rgba(255,255,255,0.12),rgba(255,255,255,0.05))]";
  }

  if (tone === "outline") {
    return "border-dashed border-white/14 bg-black/20";
  }

  return "border-white/10 bg-white/[0.05]";
}

export default function FormatQuickCompare({
  family,
  inputLabel,
  outputLabel,
}: {
  family: RouteFamily;
  inputLabel: string;
  outputLabel: string;
}) {
  const cards = getCompareCards(family, inputLabel, outputLabel);

  if (!cards.length) return null;

  return (
    <section className="mx-auto mt-6 max-w-[1100px]">
      <div className="overflow-hidden rounded-[28px] border border-white/10 bg-white/[0.08] p-5 ring-1 ring-white/10 shadow-[0_18px_55px_rgba(0,0,0,0.24)]">
        <div className="flex flex-col gap-3 md:flex-row md:items-end md:justify-between">
          <div>
            <div className="text-[10px] font-semibold uppercase tracking-[0.2em] text-white/42">
              Quick compare
            </div>
            <h3 className="mt-2 text-lg font-semibold text-white">
              Think in roles, not just extensions
            </h3>
            <p className="mt-2 max-w-[68ch] text-sm leading-6 text-white/60">
              This block compares the route as a decision: which file acts as the source, which one acts as the practical copy, and what alternative is worth testing next.
            </p>
          </div>

          <div className="rounded-full border border-white/10 bg-black/20 px-3 py-2 text-[11px] font-semibold text-white/55">
            {inputLabel} → {outputLabel}
          </div>
        </div>

        <div className="mt-5 grid gap-3 md:grid-cols-3">
          {cards.map((card, index) => (
            <div
              key={card.title}
              className={[
                "rounded-[24px] border p-4 ring-1 ring-white/10 shadow-[0_14px_40px_rgba(0,0,0,0.16)]",
                getCardClass(card.tone),
              ].join(" ")}
            >
              <div className="flex items-center justify-between gap-3">
                <div className="text-[10px] font-semibold uppercase tracking-[0.18em] text-white/38">
                  View {index + 1}
                </div>
                <div className={`text-[10px] font-semibold uppercase tracking-[0.18em] ${card.accent ?? "text-white/45"}`}>
                  {card.tone === "solid"
                    ? "Primary"
                    : card.tone === "soft"
                    ? "Context"
                    : "Alternative"}
                </div>
              </div>

              <div className="mt-4 text-base font-semibold leading-7 text-white">
                {card.title}
              </div>

              <p className="mt-3 text-sm leading-6 text-white/62">{card.body}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}