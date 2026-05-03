import React from "react";

export default function ExtractAudioBenefitsSection({
  inputLabel,
  outputLabel,
}: {
  inputLabel: string;
  outputLabel: string;
}) {
  const points = [
    `Keep the soundtrack from ${inputLabel} without storing the full video.`,
    `Create a lighter ${outputLabel} file for playlists, notes, commutes, or review.`,
    `Useful for lectures, podcasts, voice clips, and spoken content workflows.`,
  ];

  const bestFor = [
    "Music clips and soundtrack-only exports",
    "Lectures, interviews, and voice-heavy recordings",
    "Smaller files for mobile listening",
  ];

  return (
    <section className="mx-auto mt-6 max-w-[1100px]">
      <div className="rounded-[26px] bg-white/10 p-5 ring-1 ring-white/10 shadow-[0_18px_55px_rgba(0,0,0,0.25)]">
        <div className="grid gap-4 lg:grid-cols-[1.1fr_0.9fr]">
          <div className="rounded-[22px] bg-white/5 p-4 ring-1 ring-white/10">
            <div className="text-[10px] font-semibold uppercase tracking-[0.2em] text-white/42">
              Extract audio benefits
            </div>
            <h3 className="mt-2 text-lg font-semibold text-white">
              Why {inputLabel} to {outputLabel} is a strong audio-first route
            </h3>

            <div className="mt-4 space-y-2.5">
              {points.map((point) => (
                <div
                  key={point}
                  className="flex gap-3 rounded-2xl bg-white/[0.04] px-4 py-3 ring-1 ring-white/8"
                >
                  <span className="mt-2 h-1.5 w-1.5 shrink-0 rounded-full bg-emerald-300" />
                  <span className="text-sm leading-6 text-white/64">{point}</span>
                </div>
              ))}
            </div>
          </div>

          <div className="rounded-[22px] bg-white/5 p-4 ring-1 ring-white/10">
            <div className="text-[10px] font-semibold uppercase tracking-[0.2em] text-white/42">
              Best for
            </div>

            <div className="mt-4 grid gap-2.5">
              {bestFor.map((item) => (
                <div
                  key={item}
                  className="rounded-2xl bg-white/[0.04] px-4 py-3 ring-1 ring-white/8 text-sm leading-6 text-white/64"
                >
                  {item}
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
