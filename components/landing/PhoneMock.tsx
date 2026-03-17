"use client";

import React from "react";

export default function PhoneMock() {
  return (
    <div className="relative mx-auto max-w-md rounded-[36px] bg-black/30 p-3 ring-1 ring-white/15 shadow-[0_30px_80px_rgba(0,0,0,0.55)]">
      <div className="rounded-[30px] bg-[#0B0A14] ring-1 ring-white/10 overflow-hidden">
        <div className="h-10 flex items-center justify-between px-4 text-xs text-white/60">
          <span className="font-medium text-white/70">Converto</span>

          <img
            src="/brand/nexviasoft-logo.svg"
            alt="NexviaSoft"
            className="h-5 w-5 object-contain opacity-90 drop-shadow-[0_8px_18px_rgba(0,0,0,0.55)]"
          />

          <span className="inline-flex items-center gap-1">
            <span className="h-1.5 w-1.5 rounded-full bg-emerald-400" />
            Online 
          </span>
        </div>

        <div className="p-4">
          <div className="rounded-3xl bg-white/10 p-4 ring-1 ring-white/10">
            <div className="flex items-center justify-between">
              <div className="text-sm font-semibold">Quick Convert</div>
              <span className="text-xs text-white/60">Local • Private</span>
            </div>

            <div className="mt-3 grid gap-3">
              <div className="rounded-2xl bg-black/20 p-3 ring-1 ring-white/10">
                <div className="text-[11px] text-white/60">From</div>
                <div className="mt-1 text-sm font-semibold">PNG</div>
              </div>
              <div className="rounded-2xl bg-black/20 p-3 ring-1 ring-white/10">
                <div className="text-[11px] text-white/60">To</div>
                <div className="mt-1 text-sm font-semibold">WEBP</div>
              </div>

              <button className="h-11 rounded-2xl bg-white px-4 text-sm font-semibold text-black hover:bg-white/90 transition">
                Convert
              </button>

              <div className="rounded-2xl bg-black/20 p-3 ring-1 ring-white/10">
                <div className="flex items-center justify-between text-[11px] text-white/60">
                  <span>Optimized preset</span>
                  <span>Quality: High</span>
                </div>
                <div className="mt-2 h-2 overflow-hidden rounded-full bg-white/10 ring-1 ring-white/10">
                  <div className="h-full w-[72%] bg-gradient-to-r from-emerald-300/80 via-violet-300/80 to-sky-300/80" />
                </div>
              </div>
            </div>
          </div>

          <div className="mt-4 grid grid-cols-2 gap-3">
            <div className="rounded-3xl bg-white/10 p-4 ring-1 ring-white/10">
              <div className="text-xs text-white/60">Recents</div>
              <div className="mt-1 text-sm font-semibold">One-tap re-run</div>
            </div>
            <div className="rounded-3xl bg-white/10 p-4 ring-1 ring-white/10">
              <div className="text-xs text-white/60">Share</div>
              <div className="mt-1 text-sm font-semibold">Instant export</div>
            </div>
          </div>
        </div>

        <div className="h-10 bg-[radial-gradient(ellipse_at_top,rgba(168,85,247,0.18),transparent_60%)]" />
      </div>
    </div>
  );
}