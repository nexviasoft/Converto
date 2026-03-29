"use client";

import Link from "next/link";

const cx = (...c: Array<string | false | null | undefined>) =>
  c.filter(Boolean).join(" ");

export default function SimpleTopBar({
  shellMax = "max-w-[1700px]",
}: {
  shellMax?: string;
}) {
  return (
    <header className="sticky top-0 z-40 border-b border-white/10 bg-[#05040F]/80 backdrop-blur">
      <div
        className={cx(
          "mx-auto flex items-center justify-between px-4 py-3 sm:px-5 xl:px-6",
          shellMax
        )}
      >
        <Link href="/" className="group inline-flex items-center gap-3">
          <img
            src="/brand/converto-logo.svg"
            alt="Converto logo"
            className="h-10 w-10 object-contain drop-shadow-[0_8px_24px_rgba(0,0,0,0.35)]"
          />

          <span className="leading-tight">
            <span className="block text-[15px] font-semibold tracking-tight text-white">
              Converto
            </span>
            <span className="block -mt-0.5 text-[11px] text-white/50">
              by NexviaSoft
            </span>
          </span>
        </Link>

        <div className="flex items-center gap-4">
          <Link href="/formats" className="text-sm text-white/70 transition hover:text-white">
            Formats
          </Link>
          <Link href="/compare" className="text-sm text-white/70 transition hover:text-white">
            Compare
          </Link>
          <Link href="/terms" className="text-sm text-white/70 transition hover:text-white">
            Terms
          </Link>
          <Link href="/privacy" className="text-sm text-white/70 transition hover:text-white">
            Privacy
          </Link>
        </div>
      </div>
    </header>
  );
}