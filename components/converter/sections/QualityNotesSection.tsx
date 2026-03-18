type QualityNotesSectionProps = {
  inputLabel: string;
  outputLabel: string;
  qualityNotes: string;
  tips: string[];
};

export default function QualityNotesSection({
  inputLabel,
  outputLabel,
  qualityNotes,
  tips,
}: QualityNotesSectionProps) {
  return (
    <section className="mx-auto mt-6 max-w-[1100px]">
      <div className="rounded-[28px] bg-white/10 p-6 ring-1 ring-white/10 shadow-[0_18px_55px_rgba(0,0,0,0.25)]">
        <div className="text-[11px] font-semibold uppercase tracking-[0.18em] text-white/45">
          Quality and conversion tips
        </div>

        <h2 className="mt-3 text-xl font-semibold tracking-tight text-white">
          Quality notes for {inputLabel} to {outputLabel}
        </h2>

        <p className="mt-3 max-w-[75ch] text-sm leading-6 text-white/60">
          {qualityNotes}
        </p>

        <div className="mt-6 grid gap-3 md:grid-cols-2">
          {tips.map((tip, index) => (
            <div
              key={`${tip}-${index}`}
              className="rounded-2xl bg-white/5 p-4 ring-1 ring-white/10"
            >
              <div className="text-xs font-semibold uppercase tracking-[0.16em] text-white/40">
                Tip {index + 1}
              </div>
              <p className="mt-2 text-sm leading-6 text-white/65">{tip}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}