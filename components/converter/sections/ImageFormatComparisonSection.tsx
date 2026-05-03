import React from "react";

export default function ImageFormatComparisonSection({
  inputLabel,
  outputLabel,
}: {
  inputLabel: string;
  outputLabel: string;
}) {
  return (
    <section className="mx-auto mt-6 max-w-[1100px]">
      <div className="rounded-[28px] bg-white/10 p-6 ring-1 ring-white/10 shadow-[0_18px_55px_rgba(0,0,0,0.25)]">
        <div className="text-[11px] font-semibold uppercase tracking-[0.18em] text-white/45">Quick format comparison</div>
        <h3 className="mt-3 text-lg font-semibold text-white">{inputLabel} and {outputLabel} usually differ in size, transparency, and upload fit</h3>
        <div className="mt-5 grid gap-4 md:grid-cols-3">
          <div className="rounded-2xl bg-white/5 p-4 ring-1 ring-white/10">
            <div className="text-sm font-semibold text-white">File size</div>
            <p className="mt-2 text-sm leading-6 text-white/60">One format may be lighter for sharing, while the other can be better for preserving specific image properties.</p>
          </div>
          <div className="rounded-2xl bg-white/5 p-4 ring-1 ring-white/10">
            <div className="text-sm font-semibold text-white">Transparency and graphics</div>
            <p className="mt-2 text-sm leading-6 text-white/60">Check whether transparency or crisp graphic edges matter before replacing the original file.</p>
          </div>
          <div className="rounded-2xl bg-white/5 p-4 ring-1 ring-white/10">
            <div className="text-sm font-semibold text-white">Upload compatibility</div>
            <p className="mt-2 text-sm leading-6 text-white/60">Some sites and apps prefer one image target over another, especially for web forms and previews.</p>
          </div>
        </div>
      </div>
    </section>
  );
}
