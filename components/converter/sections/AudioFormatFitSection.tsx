import React from "react";

export default function AudioFormatFitSection({
  inputLabel,
  outputLabel,
}: {
  inputLabel: string;
  outputLabel: string;
}) {
  return (
    <section className="mx-auto mt-6 max-w-[1100px]">
      <div className="grid gap-4 lg:grid-cols-3">
        <div className="rounded-[28px] bg-white/10 p-6 ring-1 ring-white/10 shadow-[0_18px_55px_rgba(0,0,0,0.25)]">
          <div className="text-[11px] font-semibold uppercase tracking-[0.18em] text-white/45">Listening fit</div>
          <p className="mt-3 text-sm leading-6 text-white/60">Use {outputLabel} when you want a more practical playback copy for common devices and apps.</p>
        </div>
        <div className="rounded-[28px] bg-white/10 p-6 ring-1 ring-white/10 shadow-[0_18px_55px_rgba(0,0,0,0.25)]">
          <div className="text-[11px] font-semibold uppercase tracking-[0.18em] text-white/45">Editing fit</div>
          <p className="mt-3 text-sm leading-6 text-white/60">Keep the original {inputLabel} if you may need a stronger source file for editing or archival work later.</p>
        </div>
        <div className="rounded-[28px] bg-white/10 p-6 ring-1 ring-white/10 shadow-[0_18px_55px_rgba(0,0,0,0.25)]">
          <div className="text-[11px] font-semibold uppercase tracking-[0.18em] text-white/45">Next step</div>
          <p className="mt-3 text-sm leading-6 text-white/60">If {outputLabel} is not the right balance, nearby audio formats are easier to test from the same workflow.</p>
        </div>
      </div>
    </section>
  );
}
