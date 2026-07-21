import Link from "next/link";
import type { EditorialGuide } from "@/lib/editorialGuides";
import AdsterraNativeBanner from "@/components/ads/AdsterraNativeBanner";

function GuideIcon({ index }: { index: number }) {
  const paths = [
    "M12 3v18M3 12h18",
    "M5 12l4 4L19 6",
    "M4 6h16M4 12h16M4 18h10",
    "M6 4h12v16H6zM9 8h6M9 12h6M9 16h4",
  ];

  return (
    <span className="grid h-10 w-10 shrink-0 place-items-center rounded-2xl border border-violet-200/20 bg-violet-400/12 text-violet-100 shadow-[0_0_30px_rgba(139,92,246,0.16)]">
      <svg width="18" height="18" viewBox="0 0 24 24" fill="none" aria-hidden="true">
        <path d={paths[index % paths.length]} stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
      </svg>
    </span>
  );
}

export default function EditorialGuidePage({ guide }: { guide: EditorialGuide }) {
  return (
    <main className="min-h-screen bg-[#151233] bg-[radial-gradient(circle_at_12%_0%,rgba(139,92,246,0.20),transparent_32%),radial-gradient(circle_at_92%_16%,rgba(59,130,246,0.14),transparent_32%)] px-4 py-12 text-white sm:px-6 lg:px-8">
      <div className="mx-auto max-w-6xl">
        <nav aria-label="Breadcrumb" className="flex flex-wrap items-center gap-2 text-xs text-white/48">
          <Link href="/" className="transition hover:text-white">Home</Link>
          <span>/</span>
          <Link href="/guides" className="transition hover:text-white">Guides</Link>
          <span>/</span>
          <span className="text-white/72">{guide.shortTitle}</span>
        </nav>

        <header className="relative mt-6 overflow-hidden rounded-[34px] border border-violet-300/18 bg-[#201b46]/78 p-7 shadow-[0_30px_100px_rgba(9,6,30,0.42)] backdrop-blur sm:p-10">
          <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_86%_10%,rgba(168,85,247,0.22),transparent_28%),radial-gradient(circle_at_12%_100%,rgba(59,130,246,0.14),transparent_34%)]" />
          <div className="pointer-events-none absolute inset-0 opacity-[0.13] [background-image:radial-gradient(rgba(255,255,255,0.55)_1px,transparent_1px)] [background-size:24px_24px]" />

          <div className="relative max-w-4xl">
            <div className="inline-flex items-center gap-2 rounded-full border border-violet-200/18 bg-violet-400/10 px-3 py-1.5 text-[11px] font-semibold uppercase tracking-[0.18em] text-violet-100/80">
              <span className="h-1.5 w-1.5 rounded-full bg-violet-200 shadow-[0_0_12px_rgba(196,181,253,0.85)]" />
              {guide.eyebrow}
            </div>
            <h1 className="mt-5 text-4xl font-semibold tracking-tight sm:text-5xl sm:leading-[1.08]">
              {guide.title}
            </h1>
            <p className="mt-5 max-w-3xl text-base leading-8 text-white/68 sm:text-lg">
              {guide.summary}
            </p>
            <div className="mt-6 flex flex-wrap gap-2 text-xs text-white/52">
              <span className="rounded-full border border-white/10 bg-white/[0.06] px-3 py-1.5">Updated {guide.updated}</span>
              <span className="rounded-full border border-white/10 bg-white/[0.06] px-3 py-1.5">{guide.readingTime}</span>
              <span className="rounded-full border border-white/10 bg-white/[0.06] px-3 py-1.5">Written by NexviaSoft</span>
            </div>
          </div>
        </header>

        <div className="mt-6 grid gap-6 lg:grid-cols-[minmax(0,1fr)_280px] lg:items-start">
          <article className="space-y-6">
            <section className="rounded-[28px] border border-white/10 bg-white/[0.07] p-6 shadow-[0_20px_70px_rgba(0,0,0,0.22)] sm:p-7">
              <div className="text-[11px] font-semibold uppercase tracking-[0.2em] text-white/42">Key takeaways</div>
              <div className="mt-5 grid gap-3 md:grid-cols-3">
                {guide.highlights.map((highlight, index) => (
                  <div key={highlight} className="rounded-2xl border border-violet-200/12 bg-violet-400/[0.08] p-4 text-sm leading-6 text-white/72">
                    <div className="mb-3 text-xs font-semibold text-violet-200">0{index + 1}</div>
                    {highlight}
                  </div>
                ))}
              </div>
            </section>

            {guide.sections.map((section, index) => (
              <div key={section.id}>
                <section id={section.id} className="scroll-mt-24 rounded-[28px] border border-white/10 bg-[#201b46]/62 p-6 shadow-[0_18px_60px_rgba(0,0,0,0.20)] sm:p-8">
                <div className="flex items-start gap-4">
                  <GuideIcon index={index} />
                  <div className="min-w-0 flex-1">
                    <h2 className="text-2xl font-semibold tracking-tight text-white">{section.title}</h2>

                    {section.paragraphs?.map((paragraph) => (
                      <p key={paragraph} className="mt-4 text-[15px] leading-8 text-white/68">{paragraph}</p>
                    ))}

                    {section.bullets ? (
                      <ul className="mt-5 grid gap-3">
                        {section.bullets.map((bullet) => (
                          <li key={bullet} className="flex gap-3 rounded-2xl border border-white/8 bg-white/[0.045] px-4 py-3 text-sm leading-6 text-white/70">
                            <span className="mt-2 h-1.5 w-1.5 shrink-0 rounded-full bg-violet-300" />
                            <span>{bullet}</span>
                          </li>
                        ))}
                      </ul>
                    ) : null}

                    {section.table ? (
                      <div className="mt-6 overflow-x-auto rounded-2xl border border-white/10">
                        <table className="min-w-full border-collapse text-left text-sm">
                          <thead className="bg-white/[0.07] text-white/78">
                            <tr>
                              {section.table.headers.map((header) => (
                                <th key={header} className="whitespace-nowrap px-4 py-3 font-semibold">{header}</th>
                              ))}
                            </tr>
                          </thead>
                          <tbody className="divide-y divide-white/8 text-white/64">
                            {section.table.rows.map((row) => (
                              <tr key={row.join("|")} className="bg-black/[0.08] align-top">
                                {row.map((cell, cellIndex) => (
                                  <td key={`${cell}-${cellIndex}`} className="min-w-[150px] px-4 py-3.5 leading-6">{cell}</td>
                                ))}
                              </tr>
                            ))}
                          </tbody>
                        </table>
                      </div>
                    ) : null}

                    {section.note ? (
                      <div className="mt-6 rounded-2xl border border-sky-300/16 bg-sky-400/[0.08] p-5">
                        <div className="text-sm font-semibold text-sky-100">{section.note.title}</div>
                        <p className="mt-2 text-sm leading-7 text-white/68">{section.note.text}</p>
                      </div>
                    ) : null}
                  </div>
                </div>
                </section>

                {index === 1 ? <AdsterraNativeBanner className="mt-6" /> : null}
              </div>
            ))}

            <section className="rounded-[28px] border border-white/10 bg-[#201b46]/62 p-6 sm:p-8">
              <div className="text-[11px] font-semibold uppercase tracking-[0.2em] text-white/42">FAQ</div>
              <h2 className="mt-3 text-2xl font-semibold tracking-tight">Common questions</h2>
              <div className="mt-5 grid gap-3">
                {guide.faq.map((item) => (
                  <details key={item.question} className="group rounded-2xl border border-white/10 bg-white/[0.045] p-5">
                    <summary className="cursor-pointer list-none pr-6 text-sm font-semibold text-white/88 marker:hidden">
                      {item.question}
                    </summary>
                    <p className="mt-3 text-sm leading-7 text-white/64">{item.answer}</p>
                  </details>
                ))}
              </div>
            </section>
          </article>

          <aside className="space-y-5 lg:sticky lg:top-24">
            <nav aria-label="Guide contents" className="rounded-[26px] border border-white/10 bg-[#201b46]/72 p-5 shadow-[0_18px_60px_rgba(0,0,0,0.20)]">
              <div className="text-[11px] font-semibold uppercase tracking-[0.18em] text-white/42">In this guide</div>
              <div className="mt-4 grid gap-1.5">
                {guide.sections.map((section, index) => (
                  <a key={section.id} href={`#${section.id}`} className="rounded-xl px-3 py-2.5 text-sm leading-5 text-white/60 transition hover:bg-white/[0.06] hover:text-white">
                    <span className="mr-2 text-violet-200/70">{index + 1}.</span>{section.title}
                  </a>
                ))}
              </div>
            </nav>

            <section className="rounded-[26px] border border-violet-300/16 bg-violet-400/[0.08] p-5">
              <div className="text-[11px] font-semibold uppercase tracking-[0.18em] text-violet-100/64">Related resources</div>
              <div className="mt-4 grid gap-3">
                {guide.relatedLinks.map((link) => (
                  <Link key={link.href} href={link.href} className="rounded-2xl border border-white/10 bg-black/[0.08] p-4 transition hover:border-violet-200/24 hover:bg-violet-400/[0.08]">
                    <div className="text-sm font-semibold text-white">{link.label}</div>
                    <div className="mt-1 text-xs leading-5 text-white/52">{link.description}</div>
                  </Link>
                ))}
              </div>
            </section>
          </aside>
        </div>
      </div>
    </main>
  );
}
