"use client";

import React from "react";

export default function Footer({
  googlePlayUrl,
  onOpenInterstitial,
  onToastSupport,
  onAndroidAppClick,
}: {
  googlePlayUrl: string | null;
  onOpenInterstitial: (url: string) => void;
  onToastSupport: () => void;
  onAndroidAppClick: () => void;
}) {
  return (
    <footer className="border-t border-white/10">
      <div className="mx-auto flex max-w-6xl flex-col gap-4 px-4 py-10 sm:flex-row sm:items-center sm:justify-between">
        
        <div className="text-sm text-white/70">
          <span className="font-semibold text-white">Converto</span>{" "}
          <span className="text-white/50">•</span> by NexviaSoft
        </div>

        <div className="flex flex-wrap gap-3 text-sm text-white/60">
          <a className="transition hover:text-white" href="#features">
            Features
          </a>

          <a className="transition hover:text-white" href="#how">
            How
          </a>

          <a className="transition hover:text-white" href="/converter">
            Online
          </a>

          <a className="transition hover:text-white" href="#pricing">
            Free vs Pro
          </a>

          <a className="transition hover:text-white" href="#faq">
            FAQ
          </a>

          <a className="transition hover:text-white" href="/formats">
            Formats
          </a>

          <a className="transition hover:text-white" href="/compare">
            Compare
          </a>

          {googlePlayUrl ? (
            <a
              className="transition hover:text-white"
              href={googlePlayUrl}
              onClick={(e) => {
                e.preventDefault();
                onOpenInterstitial(googlePlayUrl);
              }}
            >
              Get the app
            </a>
          ) : (
            <button
              type="button"
              onClick={onAndroidAppClick}
              className="cursor-not-allowed text-white/60 transition hover:text-white"
            >
              Android app — Coming soon
            </button>
          )}
        </div>

        <div className="flex flex-wrap gap-3 text-xs text-white/50">

          <a className="transition hover:text-white" href="/about">
            About
          </a>

          <a className="transition hover:text-white" href="/contact">
            Contact
          </a>

          <a className="transition hover:text-white" href="/privacy">
            Privacy
          </a>

          <a className="transition hover:text-white" href="/terms">
            Terms
          </a>

          <a
            className="transition hover:text-white"
            href="mailto:support@converto.tools"
            onClick={onToastSupport}
          >
            Support
          </a>

          <span className="text-white/30">
            © {new Date().getFullYear()} NexviaSoft
          </span>

        </div>
      </div>
    </footer>
  );
}