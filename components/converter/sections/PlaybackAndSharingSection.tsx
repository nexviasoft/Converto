import React from "react";

export default function PlaybackAndSharingSection({
  inputLabel,
  outputLabel,
}: {
  inputLabel: string;
  outputLabel: string;
}) {
  return (
    <section className="mx-auto mt-6 max-w-[1100px]">
      <div className="rounded-[28px] bg-white/10 p-6 ring-1 ring-white/10 shadow-[0_18px_55px_rgba(0,0,0,0.25)]">
        <div className="text-[11px] font-semibold uppercase tracking-[0.18em] text-white/45">Playback and sharing</div>
        <h3 className="mt-3 text-lg font-semibold text-white">Why {inputLabel} to {outputLabel} often works well for delivery</h3>
        <div className="mt-5 grid gap-4 md:grid-cols-3">
          <div className="rounded-2xl bg-white/5 p-4 ring-1 ring-white/10">
            <div className="text-sm font-semibold text-white">Compatibility</div>
            <p className="mt-2 text-sm leading-6 text-white/60">Make the file easier to open across browsers, phones, laptops, and common apps.</p>
          </div>
          <div className="rounded-2xl bg-white/5 p-4 ring-1 ring-white/10">
            <div className="text-sm font-semibold text-white">Sharing</div>
            <p className="mt-2 text-sm leading-6 text-white/60">Use a route that feels more practical for uploads, messaging, and everyday handoff.</p>
          </div>
          <div className="rounded-2xl bg-white/5 p-4 ring-1 ring-white/10">
            <div className="text-sm font-semibold text-white">Fallback path</div>
            <p className="mt-2 text-sm leading-6 text-white/60">When one video target is not ideal, nearby output formats are easier to explore from the same page.</p>
          </div>
        </div>
      </div>
    </section>
  );
}
