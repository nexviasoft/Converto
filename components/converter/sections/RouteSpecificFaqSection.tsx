type FaqItem = {
  q: string;
  a: string;
};

type RouteSpecificFaqSectionProps = {
  inputLabel: string;
  outputLabel: string;
  faq: FaqItem[];
};

export default function RouteSpecificFaqSection({
  inputLabel,
  outputLabel,
  faq,
}: RouteSpecificFaqSectionProps) {
  return (
    <section className="mx-auto mt-6 max-w-[1100px]">
      <div className="rounded-[28px] bg-white/10 p-6 ring-1 ring-white/10 shadow-[0_18px_55px_rgba(0,0,0,0.25)]">
        <div className="text-[11px] font-semibold uppercase tracking-[0.18em] text-white/45">
          FAQ
        </div>

        <h2 className="mt-3 text-xl font-semibold tracking-tight text-white">
          Common questions about {inputLabel} to {outputLabel}
        </h2>

        <div className="mt-6 space-y-3">
          {faq.map((item, index) => (
            <div
              key={`${item.q}-${index}`}
              className="rounded-2xl bg-white/5 p-5 ring-1 ring-white/10"
            >
              <h3 className="text-base font-semibold text-white">{item.q}</h3>
              <p className="mt-3 text-sm leading-6 text-white/60">{item.a}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}