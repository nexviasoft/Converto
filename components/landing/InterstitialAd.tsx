"use client";

import React, { useEffect } from "react";

const cx = (...c: Array<string | false | null | undefined>) => c.filter(Boolean).join(" ");

export default function InterstitialAd({
  open,
  onClose,
  onContinue,
}: {
  open: boolean;
  onClose: () => void;
  onContinue: () => void;
}) {
  useEffect(() => {
    if (!open) return;

    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };

    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [open, onClose]);

  return (
    <div
      className={cx(
        "fixed inset-0 z-[120] transition",
        open ? "opacity-100" : "pointer-events-none opacity-0"
      )}
      aria-hidden={!open}
    >
      <div className="absolute inset-0 bg-black/65 backdrop-blur-sm" onClick={onClose} />

      <div className="relative mx-auto mt-24 w-[92%] max-w-xl">
        <div className="rounded-3xl bg-[#0D0B18]/85 ring-1 ring-white/15 shadow-[0_30px_90px_rgba(0,0,0,0.65)] p-4">
          <div className="flex items-start justify-between gap-3">
            <div>
              <div className="text-sm font-semibold text-white">Quick sponsor</div>
              <div className="mt-1 text-xs text-white/60">
                This keeps free conversions sustainable.
              </div>
            </div>

            <button
              onClick={onClose}
              className="grid h-9 w-9 place-items-center rounded-2xl bg-white/10 ring-1 ring-white/10 hover:bg-white/15 transition"
              aria-label="Close"
              type="button"
            >
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none">
                <path d="M18 6L6 18" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
                <path d="M6 6l12 12" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
              </svg>
            </button>
          </div>

          <div className="mt-4 rounded-3xl bg-white/10 p-4 ring-1 ring-white/10">
            <div className="text-sm font-semibold text-white">Converto is growing</div>
            <div className="mt-1 text-xs text-white/65">
              Want the fastest experience? Get the Android app — local processing for images & docs.
            </div>
          </div>

          <div className="mt-4 grid gap-2 sm:grid-cols-2">
            <button
              type="button"
              onClick={onContinue}
              className="h-11 rounded-2xl bg-white px-4 text-sm font-semibold text-black hover:bg-white/90 transition"
            >
              Continue
            </button>

            <button
              type="button"
              onClick={onClose}
              className="h-11 rounded-2xl bg-white/10 px-4 text-sm font-semibold text-white ring-1 ring-white/10 hover:bg-white/15 transition"
            >
              Not now
            </button>
          </div>

          <p className="mt-3 text-[11px] text-white/45">
            Tip: You can disable personalized ads via your Google settings.
          </p>
        </div>
      </div>
    </div>
  );
}