type FormatOverviewSectionProps = {
  inputLabel: string;
  outputLabel: string;
  whatIsInput: string;
  whatIsOutput: string;
};

export default function FormatOverviewSection({
  inputLabel,
  outputLabel,
  whatIsInput,
  whatIsOutput,
}: FormatOverviewSectionProps) {
  return (
    <section className="mx-auto mt-6 max-w-[1100px]">
      <div className="rounded-[28px] bg-white/10 p-6 ring-1 ring-white/10 shadow-[0_18px_55px_rgba(0,0,0,0.25)]">
        <div className="text-[11px] font-semibold uppercase tracking-[0.18em] text-white/45">
          Format overview
        </div>

        <h2 className="mt-3 text-xl font-semibold tracking-tight text-white">
          Understanding {inputLabel} and {outputLabel}
        </h2>

        <div className="mt-6 grid gap-4 md:grid-cols-2">
          <div className="rounded-2xl bg-white/5 p-5 ring-1 ring-white/10">
            <h3 className="text-base font-semibold text-white">What is {inputLabel}?</h3>
            <p className="mt-3 text-sm leading-6 text-white/60">{whatIsInput}</p>
          </div>

          <div className="rounded-2xl bg-white/5 p-5 ring-1 ring-white/10">
            <h3 className="text-base font-semibold text-white">What is {outputLabel}?</h3>
            <p className="mt-3 text-sm leading-6 text-white/60">{whatIsOutput}</p>
          </div>
        </div>
      </div>
    </section>
  );
}