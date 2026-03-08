"use client";

import React from "react";

export default function Footer({
  googlePlayUrl,
  onOpenInterstitial,
  onToastSupport,
}: {
  googlePlayUrl: string;
  onOpenInterstitial: (url: string) => void;
  onToastSupport: () => void;
}) {
  return (
    <footer className="border-t border-white/10">
      <div className="mx-auto flex max-w-6xl flex-col gap-4 px-4 py-10 sm:flex-row sm:items-center sm:justify-between">
        <div className="text-sm text-white/70">
          <span className="font-semibold text-white">Converto</span> <span className="text-white/50">•</span> by NexviaSoft
        </div>

        <div className="flex flex-wrap gap-3 text-sm text-white/60">
          <a className="hover:text-white transition" href="#features">Features</a>
          <a className="hover:text-white transition" href="#how">How</a>
          <a className="hover:text-white transition" href="converter">Online</a>
          <a className="hover:text-white transition" href="#pricing">Free vs Pro</a>
          <a className="hover:text-white transition" href="#faq">FAQ</a>
          <a
            className="hover:text-white transition"
            href={googlePlayUrl}
            onClick={(e) => {
              e.preventDefault();
              onOpenInterstitial(googlePlayUrl);
            }}
          >
            Get the app
          </a>
        </div>

        <div className="flex flex-wrap gap-3 text-xs text-white/50">
          <a className="hover:text-white transition" href="privacy">Privacy</a>
          <a className="hover:text-white transition" href="terms">Terms</a>
          <a className="hover:text-white transition" href="mailto:support@converto.tools" onClick={onToastSupport}>
            Support
          </a>
          <span className="text-white/30">© {new Date().getFullYear()} NexviaSoft</span>
        </div>
      </div>
    </footer>
  );
}