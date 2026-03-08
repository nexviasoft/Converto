"use client";

import React from "react";

const cx = (...c: Array<string | false | null | undefined>) => c.filter(Boolean).join(" ");

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

export default function PrivacySection() {
  return (
    <section id="privacy" className="mx-auto max-w-6xl px-4 py-14">
      <SectionTitle
        kicker="PRIVACY"
        title="Privacy-first by design."
        desc="We aim to keep your data minimal, temporary, and purposeful — without creepy tracking."
      />

      <div className="mt-10 grid gap-4 md:grid-cols-2">
        <div className="rounded-3xl bg-white/10 p-6 ring-1 ring-white/10">
          <div className="text-base font-semibold">What happens to your files?</div>
          <ul className="mt-4 space-y-3 text-sm text-white/70">
            {[
              "Mobile app (images/docs): processed on-device when possible.",
              "Online demo: runs in your browser; files stay in-memory and are cleared when you refresh.",
              "Server beta (planned): uploads are temporary and auto-deleted after a short window.",
            ].map((x) => (
              <li key={x} className="flex gap-2">
                <span className="mt-1.5 h-1.5 w-1.5 rounded-full bg-white/40" />
                <span>{x}</span>
              </li>
            ))}
          </ul>

          <p className="mt-4 text-xs text-white/55">
            Note: This is a friendly summary, not legal advice. For strict legal wording, see the full Privacy page.
          </p>

          <a
            href="/privacy"
            className="mt-5 inline-flex h-11 items-center justify-center rounded-2xl bg-white/10 px-4 text-sm font-semibold text-white ring-1 ring-white/10 hover:bg-white/15 transition"
          >
            Read full Privacy Policy
          </a>
        </div>

        <div className="rounded-3xl bg-white/10 p-6 ring-1 ring-white/10">
          <div className="text-base font-semibold">Ads & analytics (AdSense)</div>
          <ul className="mt-4 space-y-3 text-sm text-white/70">
            {[
              "We may show ads to support free usage (Google AdSense).",
              "Third-party vendors may use cookies/identifiers to show relevant ads.",
              "You can adjust ad personalization settings in your Google account.",
            ].map((x) => (
              <li key={x} className="flex gap-2">
                <span className="mt-1.5 h-1.5 w-1.5 rounded-full bg-white/40" />
                <span>{x}</span>
              </li>
            ))}
          </ul>

          <div className="mt-5 rounded-2xl bg-black/20 p-4 ring-1 ring-white/10">
            <div className="text-sm font-semibold">Contact</div>
            <div className="mt-1 text-sm text-white/70">support@converto.tools</div>
          </div>
        </div>
      </div>
    </section>
  );
}