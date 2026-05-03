import React from "react";

export default function ThumbnailAndPreviewSection({
  inputLabel,
  outputLabel,
}: {
  inputLabel: string;
  outputLabel: string;
}) {
  return (
    <section className="mx-auto mt-6 max-w-[1100px]">
      <div className="grid gap-4 lg:grid-cols-2">
        <div className="rounded-[28px] bg-white/10 p-6 ring-1 ring-white/10 shadow-[0_18px_55px_rgba(0,0,0,0.25)]">
          <div className="text-[11px] font-semibold uppercase tracking-[0.18em] text-white/45">Visual export</div>
          <h3 className="mt-3 text-lg font-semibold text-white">Turn {inputLabel} into a lighter visual asset</h3>
          <p className="mt-3 text-sm leading-6 text-white/60">
            This route is useful for thumbnails, previews, poster frames, and quick visual exports where the full video is no longer necessary.
          </p>
        </div>
        <div className="rounded-[28px] bg-white/10 p-6 ring-1 ring-white/10 shadow-[0_18px_55px_rgba(0,0,0,0.25)]">
          <div className="text-[11px] font-semibold uppercase tracking-[0.18em] text-white/45">Common uses</div>
          <div className="mt-4 flex flex-wrap gap-3">
            {[
              `${outputLabel} for previews`,
              "Poster frames",
              "Quick web visuals",
              "Social and upload assets",
            ].map((item) => (
              <span key={item} className="inline-flex rounded-full border border-white/10 bg-white/5 px-3 py-2 text-sm text-white/70">
                {item}
              </span>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
