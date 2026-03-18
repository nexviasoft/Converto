type UseCasesSectionProps = {
  inputLabel: string;
  outputLabel: string;
  whyConvert: string;
  useCases: string[];
};

export default function UseCasesSection({
  inputLabel,
  outputLabel,
  whyConvert,
  useCases,
}: UseCasesSectionProps) {
  return (
    <section className="mx-auto mt-6 max-w-[1100px]">
      <div className="rounded-[28px] bg-white/10 p-6 ring-1 ring-white/10 shadow-[0_18px_55px_rgba(0,0,0,0.25)]">
        <div className="text-[11px] font-semibold uppercase tracking-[0.18em] text-white/45">
          Why people use this conversion
        </div>

        <h2 className="mt-3 text-xl font-semibold tracking-tight text-white">
          Why convert {inputLabel} to {outputLabel}?
        </h2>

        <p className="mt-3 max-w-[75ch] text-sm leading-6 text-white/60">
          {whyConvert}
        </p>

        <div className="mt-6 grid gap-3">
          {useCases.map((item, index) => (
            <div
              key={`${item}-${index}`}
              className="rounded-2xl bg-white/5 px-4 py-4 ring-1 ring-white/10"
            >
              <p className="text-sm leading-6 text-white/65">{item}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}