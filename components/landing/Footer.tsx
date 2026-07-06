"use client";

import React from "react";
import { ANDROID_APP_PUBLIC, PRO_PUBLIC } from "@/lib/siteReadiness";

const groups = [
  {
    title: "Product",
    links: [
      { href: "/converter", label: "Converter" },
      { href: "/formats", label: "Formats" },
      { href: "/compare", label: "Compare" },
      ...(PRO_PUBLIC ? [{ href: "/pro", label: "Pro" }] : []),
    ],
  },
  {
    title: "Resources",
    links: [
      { href: "/formats/mp4", label: "MP4 guide" },
      { href: "/compare/mp4-vs-webm", label: "MP4 vs WEBM" },
      { href: "/contact", label: "Support" },
      { href: "/about", label: "About" },
    ],
  },
  {
    title: "Legal",
    links: [
      { href: "/privacy", label: "Privacy" },
      { href: "/cookies", label: "Cookies" },
      { href: "/terms", label: "Terms" },
      { href: "/contact", label: "Contact" },
    ],
  },
];

type FooterProps = {
  googlePlayUrl?: string | null;
  onOpenInterstitial?: (url: string) => void;
  onToastSupport?: () => void;
  onAndroidAppClick?: () => void;
};

export default function Footer({
  googlePlayUrl = null,
  onOpenInterstitial,
  onAndroidAppClick,
}: FooterProps = {}) {
  return (
    <footer className="relative z-10 border-t border-white/10 bg-[#0d0a20]/88 backdrop-blur-xl">
      <div className="mx-auto max-w-6xl px-4 py-10 sm:px-6 lg:px-8">
        <div className="grid gap-8 md:grid-cols-[1.1fr_2fr]">
          <div>
            <div className="text-sm text-white/70">
              <span className="font-semibold text-white">Converto</span>{" "}
              <span className="text-white/50">•</span> by NexviaSoft
            </div>
            <p className="mt-3 max-w-sm text-sm leading-6 text-white/52">
              A focused online converter with practical format guides, compare pages, and a clean workflow for everyday file changes.
            </p>
            <div className="mt-5 flex flex-wrap gap-2 text-xs text-white/50">
              <span className="rounded-full border border-white/10 bg-white/[0.06] px-3 py-1">Free: 50MB</span>
              <span className="rounded-full border border-white/10 bg-white/[0.06] px-3 py-1">Privacy-first</span>
              <span className="rounded-full border border-white/10 bg-white/[0.06] px-3 py-1">No signup required</span>
            </div>
          </div>

          <div className="grid gap-6 sm:grid-cols-3">
            {groups.map((group) => (
              <div key={group.title}>
                <div className="text-[11px] font-semibold uppercase tracking-[0.18em] text-white/38">
                  {group.title}
                </div>
                <div className="mt-3 grid gap-2 text-sm text-white/58">
                  {group.links.map((link) => (
                    <a key={link.href} href={link.href} className="transition hover:text-white">
                      {link.label}
                    </a>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="mt-8 flex flex-col gap-4 border-t border-white/10 pt-6 text-xs text-white/45 sm:flex-row sm:items-center sm:justify-between">
          <div className="flex flex-wrap items-center gap-x-4 gap-y-2">
            <a
              className="transition hover:text-white"
              href="mailto:support@converto.tools?subject=Converto%20Support"
              aria-label="Email support@converto.tools"
            >
              support@converto.tools
            </a>
            {googlePlayUrl ? (
              <a
                className="transition hover:text-white"
                href={googlePlayUrl}
                onClick={
                  onOpenInterstitial
                    ? (event) => {
                        event.preventDefault();
                        onOpenInterstitial(googlePlayUrl);
                      }
                    : undefined
                }
              >
                Get the app
              </a>
            ) : ANDROID_APP_PUBLIC ? (
              <button
                type="button"
                onClick={onAndroidAppClick}
                className="text-white/45 transition hover:text-white"
              >
                Android app — Coming soon
              </button>
            ) : null}
          </div>

          <span className="whitespace-nowrap text-white/30">
            © {new Date().getFullYear()} NexviaSoft. Version 2.1.0
          </span>
        </div>
      </div>
    </footer>
  );
}
