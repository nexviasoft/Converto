"use client";

import React from "react";

function SectionTitle({
  kicker,
  title,
  desc,
}: {
  kicker: string;
  title: string;
  desc: string;
}) {
  return (
    <div className="mx-auto max-w-2xl text-center">
      <p className="text-xs font-semibold tracking-widest text-white/60">{kicker}</p>
      <h2 className="mt-2 text-2xl font-semibold text-white sm:text-3xl">{title}</h2>
      <p className="mt-3 text-sm leading-6 text-white/70">{desc}</p>
    </div>
  );
}

export default function TermsSection() {
  return (
    <section id="terms" className="mx-auto max-w-6xl px-4 py-14">
      <SectionTitle
        kicker="TERMS"
        title="Simple, fair terms."
        desc="Use Converto responsibly. Keep it legal. We keep it transparent."
      />

      <div className="mt-10 grid gap-4 md:grid-cols-2">
        <div className="rounded-3xl bg-white/10 p-6 ring-1 ring-white/10">
          <div className="text-base font-semibold">Acceptable use</div>
          <ul className="mt-4 space-y-3 text-sm text-white/70">
            {[
              "Don’t upload illegal content or content you don’t have rights to process.",
              "Don’t abuse the service (automation/spam, bypassing limits, or harming infrastructure).",
              "We may enforce limits to keep the service stable for everyone.",
            ].map((x) => (
              <li key={x} className="flex gap-2">
                <span className="mt-1.5 h-1.5 w-1.5 rounded-full bg-white/40" />
                <span>{x}</span>
              </li>
            ))}
          </ul>

          <a
            href="/terms"
            className="mt-5 inline-flex h-11 items-center justify-center rounded-2xl bg-white/10 px-4 text-sm font-semibold text-white ring-1 ring-white/10 hover:bg-white/15 transition"
          >
            Read full Terms
          </a>
        </div>

        <div className="rounded-3xl bg-white/10 p-6 ring-1 ring-white/10">
          <div className="text-base font-semibold">Disclaimer & reliability</div>
          <ul className="mt-4 space-y-3 text-sm text-white/70">
            {[
              "Conversions are provided “as is” — results can vary by codec and device.",
              "We’re not responsible for lost data; keep backups of important files.",
              "Beta features may change, pause, or be removed for stability.",
            ].map((x) => (
              <li key={x} className="flex gap-2">
                <span className="mt-1.5 h-1.5 w-1.5 rounded-full bg-white/40" />
                <span>{x}</span>
              </li>
            ))}
          </ul>

          <div className="mt-5 rounded-2xl bg-black/20 p-4 ring-1 ring-white/10">
            <div className="text-xs font-semibold tracking-widest text-white/60">LAST UPDATED</div>
            <div className="mt-1 text-sm text-white/70">{new Date().toLocaleDateString()}</div>
          </div>
        </div>
      </div>
    </section>
  );
}