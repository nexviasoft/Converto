"use client";

import React from "react";

export const cx = (...c: Array<string | false | null | undefined>) => c.filter(Boolean).join(" ");

export const Badge = ({ children }: { children: React.ReactNode }) => (
  <span className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/10 px-3 py-1 text-xs text-white/80 backdrop-blur">
    <span className="relative h-1.5 w-1.5 rounded-full bg-emerald-400">
      <span className="absolute inset-0 animate-ping rounded-full bg-emerald-400/60" />
    </span>
    {children}
  </span>
);

export const Pill = ({ children }: { children: React.ReactNode }) => (
  <span className="rounded-full bg-white/10 px-3 py-1 text-xs text-white/70 ring-1 ring-white/10">{children}</span>
);

export const SectionTitle = ({ kicker, title, desc }: { kicker: string; title: string; desc: string }) => (
  <div className="mx-auto max-w-2xl text-center">
    <p className="text-xs font-semibold tracking-widest text-white/60">{kicker}</p>
    <h2 className="mt-2 text-2xl font-semibold text-white sm:text-3xl">{title}</h2>
    <p className="mt-3 text-sm leading-6 text-white/70">{desc}</p>
  </div>
);

export const FeatureCard = ({
  title,
  desc,
  icon,
  accent = "from-violet-500/15 via-fuchsia-500/10 to-sky-500/15",
}: {
  title: string;
  desc: string;
  icon: React.ReactNode;
  accent?: string;
}) => (
  <div className="group relative overflow-hidden rounded-3xl bg-white/10 p-6 ring-1 ring-white/10 shadow-[0_10px_30px_rgba(0,0,0,0.22)] transition hover:-translate-y-0.5 hover:bg-white/12">
    <div className={cx("pointer-events-none absolute inset-0 opacity-0 transition group-hover:opacity-100", "bg-gradient-to-r", accent)} />
    <div className="relative mb-4 flex items-center justify-center">
      <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-black/20 ring-1 ring-white/10 backdrop-blur leading-none">
        {icon}
      </div>
    </div>
    <div className="relative text-center">
      <h3 className="text-base font-semibold text-white">{title}</h3>
      <p className="mt-2 text-sm leading-6 text-white/70">{desc}</p>
    </div>
  </div>
);

export const FAQItem = ({ q, a }: { q: string; a: string }) => (
  <details className="group rounded-3xl bg-white/10 p-5 ring-1 ring-white/10 transition hover:bg-white/12">
    <summary className="flex cursor-pointer list-none items-center justify-between gap-3 text-sm font-semibold text-white">
      <span>{q}</span>
      <span className="grid h-8 w-8 place-items-center rounded-2xl bg-white/10 ring-1 ring-white/10 transition group-open:rotate-45">
        <svg width="14" height="14" viewBox="0 0 14 14" fill="none" xmlns="http://www.w3.org/2000/svg">
          <path d="M7 1V13" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
          <path d="M1 7H13" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
        </svg>
      </span>
    </summary>
    <p className="mt-3 text-sm leading-6 text-white/70">{a}</p>
  </details>
);

export const GooglePlayBadge = ({ className = "" }: { className?: string }) => (
  <span
    className={cx(
      "inline-flex h-12 items-center gap-3 rounded-2xl bg-black/25 px-4 ring-1 ring-white/15 hover:bg-black/20 transition",
      className
    )}
    aria-label="Get it on Google Play"
  >
    <svg width="28" height="28" viewBox="0 0 24 24" fill="none" className="shrink-0">
      <defs>
        <linearGradient id="gp_grad" x1="3" y1="3" x2="21" y2="21" gradientUnits="userSpaceOnUse">
          <stop stopColor="#34D399" />
          <stop offset="0.5" stopColor="#A78BFA" />
          <stop offset="1" stopColor="#60A5FA" />
        </linearGradient>
      </defs>
      <path d="M6 4.5v15l12-7.5L6 4.5Z" fill="url(#gp_grad)" />
      <path d="M6 4.5L14 12" stroke="rgba(255,255,255,0.45)" strokeWidth="0.6" />
      <path d="M6 19.5L14 12" stroke="rgba(255,255,255,0.45)" strokeWidth="0.6" />
    </svg>

    <span className="flex flex-col leading-tight">
      <span className="text-[10px] font-semibold tracking-widest text-white/70">GET IT ON</span>
      <span className="text-[15px] font-extrabold text-white">Google Play</span>
    </span>
  </span>
);