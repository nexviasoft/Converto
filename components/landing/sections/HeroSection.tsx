"use client";

import React from "react";
import { Badge, GooglePlayBadge, Pill } from "@/components/ui";
import PhoneMock from "../PhoneMock";

export default function HeroSection({
  googlePlayUrl,
  onlineUrl,
  onOpenInterstitial,
  onAndroidAppClick,
}: {
  googlePlayUrl: string | null;
  onlineUrl: string;
  onOpenInterstitial: (url: string) => void;
  onAndroidAppClick: () => void;
}) {
  return (
    <section className="mx-auto max-w-6xl px-4 pb-10 pt-12 sm:pt-16">
      <div className="grid gap-10 md:grid-cols-2 md:items-center">
        <div>
          <Badge>Beta: Online converter launching soon</Badge>

          <h1 className="mt-4 text-4xl font-semibold tracking-tight sm:text-5xl">
            Convert files in seconds.
            <span className="block bg-gradient-to-r from-violet-200 via-fuchsia-200 to-sky-200 bg-clip-text text-transparent">
              Fast • Clean • No nonsense.
            </span>
          </h1>

          <p className="mt-4 max-w-xl text-base leading-7 text-white/70">
            Converto helps you convert images, documents, and (soon) videos with a simple, modern
            experience. Start on mobile today — and use the online converter when it drops.
          </p>

          <div className="mt-6 flex flex-wrap items-center gap-2">
            <Pill>JPG • PNG • WEBP • PDF</Pill>
            <Pill>MP4 • MOV • MKV (server beta)</Pill>
            <Pill>No watermarks</Pill>
          </div>

          <div className="mt-8 flex flex-col gap-3 sm:flex-row sm:items-center">
            <a
              href={onlineUrl}
              className="relative inline-flex h-12 items-center justify-center rounded-2xl bg-white px-6 text-sm font-semibold text-black transition hover:scale-[1.02] active:scale-[0.98]"
            >
              <span className="relative z-10">Try online</span>
              <span className="absolute inset-0 rounded-2xl bg-gradient-to-r from-violet-300/40 via-fuchsia-300/30 to-sky-300/40 blur-lg opacity-0 transition hover:opacity-100" />
            </a>

            {googlePlayUrl ? (
              <a
                href={googlePlayUrl}
                onClick={(e) => {
                  e.preventDefault();
                  onOpenInterstitial(googlePlayUrl);
                }}
                className="inline-flex"
              >
                <GooglePlayBadge />
              </a>
            ) : (
              <button
                type="button"
                onClick={onAndroidAppClick}
                className="inline-flex h-12 items-center justify-center rounded-2xl bg-white/10 px-5 text-sm font-medium text-white/70 ring-1 ring-white/10 transition cursor-not-allowed"
              >
                Android App — Coming Soon
              </button>
            )}
          </div>

          <p className="mt-3 text-xs text-white/60">
            Privacy-first: files are processed locally in the app (online conversion will use
            strict limits and auto-deletion).
          </p>

          <div className="mt-6 grid gap-3 sm:grid-cols-3">
            {[
              { t: "Local processing", d: "Images & docs convert on-device." },
              { t: "Auto-delete", d: "Web files removed shortly after." },
              { t: "No clutter", d: "Only the settings you need." },
            ].map((x) => (
              <div key={x.t} className="rounded-3xl bg-white/10 p-4 ring-1 ring-white/10">
                <div className="text-sm font-semibold">{x.t}</div>
                <div className="mt-1 text-xs text-white/70">{x.d}</div>
              </div>
            ))}
          </div>
        </div>

        <div className="grid gap-4">
          <PhoneMock />
        </div>
      </div>
    </section>
  );
}