import React from "react";

type ConversionInsightsSectionProps = {
  inputLabel: string;
  outputLabel: string;
  whyConvert: string;
  useCases: string[];
  qualityNotes: string;
  tips: string[];
};

export default function ConversionInsightsSection({
  inputLabel,
  outputLabel,
  whyConvert,
  useCases,
  qualityNotes,
  tips,
}: ConversionInsightsSectionProps) {
  const topUseCases = useCases.slice(0, 3);
  const topTips = tips.slice(0, 4);

  return (
    <section className="mx-auto mt-6 max-w-[1100px]">
      <div className="rounded-[26px] bg-white/10 p-5 ring-1 ring-white/10 shadow-[0_18px_55px_rgba(0,0,0,0.25)]">
        <div className="text-[10px] font-semibold uppercase tracking-[0.2em] text-white/42">
          Conversion insights
        </div>

        <h2 className="mt-2 text-lg font-semibold tracking-tight text-white">
          Why {inputLabel} to {outputLabel} works well
        </h2>

        <p className="mt-3 max-w-[78ch] text-sm leading-6 text-white/60">
          {whyConvert}
        </p>

        <div className="mt-5 grid gap-4 lg:grid-cols-[1.05fr_0.95fr]">
          <div className="rounded-[22px] bg-white/5 p-4 ring-1 ring-white/10">
            <div className="text-[10px] font-semibold uppercase tracking-[0.2em] text-white/42">
              Common reasons
            </div>
            <div className="mt-3 space-y-2.5">
              {topUseCases.map((item, index) => (
                <div
                  key={`${item}-${index}`}
                  className="rounded-2xl bg-white/[0.04] px-4 py-3 ring-1 ring-white/8"
                >
                  <p className="text-sm leading-6 text-white/64">{item}</p>
                </div>
              ))}
            </div>
          </div>

          <div className="rounded-[22px] bg-white/5 p-4 ring-1 ring-white/10">
            <div className="text-[10px] font-semibold uppercase tracking-[0.2em] text-white/42">
              Quality and tips
            </div>

            <p className="mt-3 text-sm leading-6 text-white/60">{qualityNotes}</p>

            <div className="mt-4 grid gap-3 sm:grid-cols-2">
              {topTips.map((tip, index) => (
                <div
                  key={`${tip}-${index}`}
                  className="rounded-2xl bg-white/[0.04] p-3.5 ring-1 ring-white/8"
                >
                  <div className="text-[10px] font-semibold uppercase tracking-[0.18em] text-white/38">
                    Tip {index + 1}
                  </div>
                  <p className="mt-2 text-sm leading-6 text-white/64">{tip}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
