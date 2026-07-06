"use client";

import React from "react";
import { GooglePlayBadge, Pill } from "@/components/ui";
import PhoneMock from "../PhoneMock";
import { ANDROID_APP_PUBLIC } from "@/lib/siteReadiness";

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
          <div className="inline-flex items-center gap-2 rounded-full bg-white/8 px-3 py-1 text-[11px] font-medium text-white/70 ring-1 ring-white/10">
            <span className="h-1.5 w-1.5 rounded-full bg-emerald-300 shadow-[0_0_16px_rgba(110,231,183,.75)]" />
            Online converter is live
          </div>

          <h1 className="mt-4 text-4xl font-semibold tracking-tight sm:text-5xl">
            Convert files online.
            <span className="block bg-gradient-to-r from-violet-200 via-fuchsia-200 to-sky-200 bg-clip-text text-transparent">
              Fast, clean, and simple.
            </span>
          </h1>

          <p className="mt-4 max-w-xl text-base leading-7 text-white/70">
            Converto helps you convert everyday audio, video, image, and PDF files from one focused workspace. Choose a file, pick an output format, and download the result without digging through confusing settings.
          </p>

          <div className="mt-6 flex flex-wrap items-center gap-2">
            <Pill>MP3 • WAV • FLAC</Pill>
            <Pill>MP4 • WEBM • MOV</Pill>
            <Pill>PNG • JPG • WEBP</Pill>
            <Pill>PDF tools</Pill>
          </div>

          <div className="mt-8 flex flex-col gap-3 sm:flex-row sm:items-center">
            <a
              href={onlineUrl}
              className="relative inline-flex h-12 items-center justify-center rounded-2xl bg-white px-6 text-sm font-semibold text-black transition hover:scale-[1.02] active:scale-[0.98]"
            >
              <span className="relative z-10">Try online converter</span>
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
            ) : ANDROID_APP_PUBLIC ? (
              <button
                type="button"
                onClick={onAndroidAppClick}
                className="inline-flex h-12 items-center justify-center rounded-2xl bg-white/10 px-5 text-sm font-medium text-white/70 ring-1 ring-white/10 transition cursor-not-allowed"
              >
                Android app — Coming soon
              </button>
            ) : null}
          </div>

          <p className="mt-3 text-xs leading-5 text-white/60">
            No signup required for quick conversions. Free web uploads use practical limits, clear states, and temporary processing.
          </p>

          <div className="mt-6 grid gap-3 sm:grid-cols-3">
            {[
              { t: "50MB free limit", d: "Good for quick everyday files." },
              { t: "Temporary files", d: "Server jobs are treated as short-lived." },
              { t: "No clutter", d: "Only the controls you actually need." },
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
