"use client";

import React from "react";
import { cx } from "@/components/ui";

export default function TrustWaitlistSection({
  email,
  joined,
  emailError,
  setEmail,
  onJoin,
}: {
  email: string;
  joined: boolean;
  emailError: string | null;
  setEmail: (v: string) => void;
  onJoin: (e: React.FormEvent) => void;
}) {
  return (
    <section className="mx-auto max-w-6xl px-4 py-10">
      <div className="rounded-3xl bg-gradient-to-r from-violet-500/15 via-fuchsia-500/10 to-sky-500/15 p-6 ring-1 ring-white/10">
        <div className="grid gap-6 md:grid-cols-2 md:items-center">
          <div>
            <p className="text-xs font-semibold tracking-widest text-white/60">TRUST & PRIVACY</p>
            <h3 className="mt-2 text-xl font-semibold">Built with privacy in mind</h3>
            <p className="mt-2 text-sm text-white/70">
              Mobile conversions run locally for images & documents. Online conversion will use strict limits and auto-deletion.
            </p>

            <div className="mt-4 grid gap-3 sm:grid-cols-3">
              {[
                { t: "Local by default", d: "No upload needed for images/docs." },
                { t: "Auto-delete", d: "Short retention on the web." },
                { t: "Minimal logs", d: "Only what’s needed to run." },
              ].map((x) => (
                <div key={x.t} className="rounded-3xl bg-white/10 p-4 ring-1 ring-white/10">
                  <div className="text-sm font-semibold">{x.t}</div>
                  <div className="mt-1 text-xs text-white/70">{x.d}</div>
                </div>
              ))}
            </div>
          </div>

          <form onSubmit={onJoin} className="flex flex-col gap-3 sm:flex-row">
            <div className="flex-1">
              <input
                type="email"
                value={email}
                disabled={joined}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="you@example.com"
                className={cx(
                  "h-12 w-full rounded-2xl bg-black/20 px-4 text-sm text-white placeholder:text-white/40 ring-1 outline-none transition",
                  emailError ? "ring-rose-400/40 focus:ring-rose-300/40" : "ring-white/10 focus:ring-white/20",
                  joined ? "opacity-60" : ""
                )}
              />
              {emailError ? <p className="mt-2 text-xs text-rose-200">{emailError}</p> : null}
            </div>

            <button
              type="submit"
              disabled={joined}
              className={cx(
                "h-12 rounded-2xl px-5 text-sm font-semibold transition",
                joined ? "bg-white/15 text-white/70 ring-1 ring-white/10" : "bg-white text-black hover:bg-white/90"
              )}
            >
              {joined ? "Joined" : "Join waitlist"}
            </button>
          </form>
        </div>
      </div>
    </section>
  );
}