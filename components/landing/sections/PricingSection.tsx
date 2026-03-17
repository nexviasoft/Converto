"use client";

import React from "react";
import { SectionTitle } from "@/components/ui";

export default function PricingSection({
  googlePlayUrl,
  onlineUrl,
  onOpenInterstitial,
  onAndroidAppClick,
  showToast,
}: {
  googlePlayUrl: string | null;
  onlineUrl: string;
  onOpenInterstitial: (url: string) => void;
  onAndroidAppClick: () => void;
  showToast: (t: string, d?: string) => void;
}) {
  return (
    <section id="pricing" className="mx-auto max-w-6xl px-4 py-14">
      <SectionTitle
        kicker="FREE VS PRO"
        title="Clear limits. Honest value."
        desc="Free is great for quick conversions. Pro is built for power users — with student-friendly pricing in mind."
      />

      <div className="mt-10 grid gap-4 md:grid-cols-2">
        <div className="relative overflow-hidden rounded-3xl bg-white/10 p-6 ring-1 ring-white/10">
          <div className="flex items-center justify-between">
            <div className="text-base font-semibold">Free</div>
            <span className="rounded-full bg-white/10 px-3 py-1 text-xs text-white/70 ring-1 ring-white/10">
              Generous
            </span>
          </div>

          <ul className="mt-4 space-y-3 text-sm text-white/70">
            {[
              "Local browser conversion (privacy-friendly)",
              "Core formats: JPG • PNG • WEBP • MP3 • MP4",
              "Basic conversion quality",
              "File size limit: 50MB",
              "Auto delete after 15 minutes",
              "No signup required",
            ].map((x) => (
              <li key={x} className="flex gap-2">
                <span className="mt-1.5 h-1.5 w-1.5 rounded-full bg-white/40" />
                <span>{x}</span>
              </li>
            ))}
          </ul>

          <div className="mt-6">
            <a
              href={onlineUrl}
              className="inline-flex h-12 w-full items-center justify-center rounded-2xl bg-white/10 px-5 text-sm font-semibold text-white ring-1 ring-white/10 transition hover:bg-white/15"
            >
              Try online (beta)
            </a>
          </div>
        </div>

        <div className="relative overflow-hidden rounded-3xl bg-white/10 p-6 ring-1 ring-white/10 shadow-[0_20px_60px_rgba(0,0,0,0.30)]">
          <div className="pointer-events-none absolute inset-0 bg-gradient-to-r from-violet-500/15 via-fuchsia-500/10 to-sky-500/15" />
          <div className="relative flex items-center justify-between">
            <div className="text-base font-semibold">Pro</div>
            <span className="rounded-full bg-emerald-400/15 px-3 py-1 text-xs text-emerald-200 ring-1 ring-emerald-300/20">
              Best for creators
            </span>
          </div>

          <ul className="relative mt-4 space-y-3 text-sm text-white/70">
            {[
              "Larger file size limits",
              "Faster server processing",
              "Batch conversion (multi-file)",
              "Access to all premium formats",
              "Priority conversion queue",
              "Extended file retention",
            ].map((x) => (
              <li key={x} className="flex gap-2">
                <span className="mt-1.5 h-1.5 w-1.5 rounded-full bg-emerald-300/80" />
                <span>{x}</span>
              </li>
            ))}
          </ul>

          <div className="relative mt-6 grid gap-3 sm:grid-cols-2">
            {googlePlayUrl ? (
              <a
                href={googlePlayUrl}
                onClick={(e) => {
                  e.preventDefault();
                  onOpenInterstitial(googlePlayUrl);
                }}
                className="inline-flex h-12 items-center justify-center rounded-2xl bg-white/10 px-5 text-sm font-semibold text-white ring-1 ring-white/10 transition hover:bg-white/15"
              >
                Get the app
              </a>
            ) : (
              <button
                type="button"
                onClick={onAndroidAppClick}
                className="inline-flex h-12 items-center justify-center rounded-2xl bg-white/10 px-5 text-sm font-semibold text-white/70 ring-1 ring-white/10 transition cursor-not-allowed"
              >
                Android app — Coming soon
              </button>
            )}

            <button
              type="button"
              onClick={() =>
                showToast("Pro is coming!", "We’ll enable Pro after beta stability is confirmed.")
              }
              className="inline-flex h-12 items-center justify-center rounded-2xl bg-white px-5 text-sm font-semibold text-black transition hover:bg-white/90"
            >
              Notify me
            </button>
          </div>

          <p className="relative mt-3 text-xs text-white/60">
            Pricing goal: student-friendly, transparent, no dark patterns.
          </p>
        </div>
      </div>
    </section>
  );
}