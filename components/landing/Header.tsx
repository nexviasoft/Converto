"use client";

import React from "react";
import { cx } from "@/components/ui";

const NavLink = ({ href, label, active }: { href: string; label: string; active: boolean }) => (
  <a className={cx("relative text-sm transition hover:text-white", active ? "text-white" : "text-white/70")} href={href}>
    {label}
    <span
      className={cx(
        "absolute -bottom-2 left-0 h-[2px] w-full rounded-full transition",
        active ? "bg-gradient-to-r from-violet-300 via-fuchsia-200 to-sky-200 opacity-100" : "opacity-0"
      )}
    />
  </a>
);

export default function Header({
  sections,
  activeId,
  isScrolled,
  googlePlayUrl,
  onlineUrl,
  onOpenInterstitial,
}: {
  sections: Array<{ id: string; label: string }>;
  activeId: string;
  isScrolled: boolean;
  googlePlayUrl: string;
  onlineUrl: string;
  onOpenInterstitial: (url: string) => void;
}) {
  return (
    <header
      className={cx(
        "sticky top-0 z-40 border-b border-white/10 backdrop-blur transition",
        isScrolled ? "bg-[#070614]/88" : "bg-[#070614]/78"
      )}
    >
      <div className={cx("mx-auto flex max-w-7xl items-center justify-between px-4 transition", isScrolled ? "py-2.5" : "py-3")}>
        <div className="flex items-center gap-3">
          <div className={cx("flex items-center justify-center overflow-hidden transition", isScrolled ? "h-10 w-10" : "h-12 w-12")}>
            <img
              src="/brand/converto-logo.svg"
              alt="Converto logo"
              className={cx(
                "object-contain transition drop-shadow-[0_8px_24px_rgba(0,0,0,0.35)]",
                isScrolled ? "h-9 w-9" : "h-11 w-11"
              )}
            />
          </div>

          <div className="flex flex-col justify-center leading-tight">
            <span className="text-base font-semibold">Converto</span>
            <span className="text-xs text-white/60">by NexviaSoft</span>
          </div>
        </div>

        <nav className="hidden items-center gap-6 md:flex">
          {sections.map((s) => (
            <NavLink key={s.id} href={`#${s.id}`} label={s.label} active={activeId === s.id} />
          ))}
        </nav>

        <div className="flex items-center gap-2">
          <a
            href={googlePlayUrl}
            onClick={(e) => {
              e.preventDefault();
              onOpenInterstitial(googlePlayUrl);
            }}
            className="hidden rounded-2xl bg-white/10 px-4 py-2 text-sm text-white ring-1 ring-white/10 hover:bg-white/15 transition sm:inline-flex"
          >
            Get the app
          </a>

          <a href={onlineUrl} className="relative overflow-hidden rounded-2xl bg-white px-4 py-2 text-sm font-semibold text-black hover:bg-white/90 transition">
            <span className="relative z-10">Try online</span>
            <span className="pointer-events-none absolute -left-20 top-0 h-full w-20 rotate-12 bg-white/40 blur-md opacity-40 animate-[shine_2.8s_ease-in-out_infinite]" />
          </a>
        </div>
      </div>
    </header>
  );
}