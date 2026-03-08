"use client";

import React from "react";
import { SectionTitle } from "@/components/ui";

export default function HowSection() {
  return (
    <section id="how" className="mx-auto max-w-6xl px-4 py-14">
      <SectionTitle
        kicker="HOW IT WORKS"
        title="Simple in 3 steps."
        desc="Whether on mobile or web, Converto keeps the flow clean and predictable."
      />

      <div className="mt-10 grid gap-4 md:grid-cols-3">
        {[
          { n: "01", t: "Pick a file", d: "Choose a video, image, or document. We validate formats instantly." },
          { n: "02", t: "Select output", d: "Pick the format you need. Defaults are tuned for speed and compatibility." },
          { n: "03", t: "Convert & share", d: "Download, share, or save. Recents keep your workflow quick." },
        ].map((s) => (
          <div key={s.n} className="rounded-3xl bg-white/10 p-6 ring-1 ring-white/10 transition hover:-translate-y-0.5 hover:bg-white/12">
            <div className="text-xs font-semibold tracking-widest text-white/60">{s.n}</div>
            <div className="mt-2 text-base font-semibold">{s.t}</div>
            <p className="mt-2 text-sm leading-6 text-white/70">{s.d}</p>
          </div>
        ))}
      </div>
    </section>
  );
}