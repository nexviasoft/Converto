"use client";

import React, { useEffect } from "react";
import { cx } from "@/components/ui";

export default function Toast({
  open,
  title,
  desc,
  onClose,
}: {
  open: boolean;
  title: string;
  desc?: string;
  onClose: () => void;
}) {
  useEffect(() => {
    if (!open) return;
    const t = setTimeout(onClose, 3200);
    return () => clearTimeout(t);
  }, [open, onClose]);

  return (
    <div
      className={cx(
        "fixed bottom-5 left-1/2 z-[99] w-[92%] max-w-md -translate-x-1/2 transition",
        open ? "opacity-100 translate-y-0" : "pointer-events-none translate-y-3 opacity-0"
      )}
      role="status"
      aria-live="polite"
    >
      <div className="rounded-3xl bg-[#0D0B18]/70 backdrop-blur ring-1 ring-white/15 shadow-[0_20px_60px_rgba(0,0,0,0.45)] p-4">
        <div className="flex items-start gap-3">
          <div className="mt-0.5 grid h-9 w-9 place-items-center rounded-2xl bg-white/10 ring-1 ring-white/10">
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none">
              <path d="M20 6L9 17l-5-5" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
          </div>
          <div className="flex-1">
            <div className="text-sm font-semibold text-white">{title}</div>
            {desc ? <div className="mt-1 text-xs text-white/70">{desc}</div> : null}
          </div>
          <button
            onClick={onClose}
            className="grid h-9 w-9 place-items-center rounded-2xl bg-white/10 ring-1 ring-white/10 hover:bg-white/15 transition"
            aria-label="Close"
          >
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none">
              <path d="M18 6L6 18" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
              <path d="M6 6l12 12" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
            </svg>
          </button>
        </div>
      </div>
    </div>
  );
}