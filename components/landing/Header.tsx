"use client";

import React from "react";
import Link from "next/link";
import { Show, SignInButton, UserButton } from "@clerk/nextjs";
import { cx } from "@/components/ui";

const NavLink = ({
  href,
  label,
  active,
}: {
  href: string;
  label: string;
  active: boolean;
}) => (
  <a
    className={cx(
      "relative text-sm transition hover:text-white",
      active ? "text-white" : "text-white/70"
    )}
    href={href}
  >
    {label}
    <span
      className={cx(
        "absolute -bottom-2 left-0 h-[2px] w-full rounded-full transition",
        active
          ? "bg-gradient-to-r from-violet-300 via-fuchsia-200 to-sky-200 opacity-100"
          : "opacity-0"
      )}
    />
  </a>
);

export default function Header({
  sections,
  activeId,
  isScrolled,
  onlineUrl,
}: {
  sections: Array<{ id: string; label: string }>;
  activeId: string;
  isScrolled: boolean;
  onlineUrl: string;
}) {
  return (
    <header
      className={cx(
        "sticky top-0 z-40 border-b border-white/10 backdrop-blur transition",
        isScrolled ? "bg-[#070614]/88" : "bg-[#070614]/78"
      )}
    >
      <div
        className={cx(
          "mx-auto flex max-w-7xl items-center justify-between px-4 transition",
          isScrolled ? "py-2.5" : "py-3"
        )}
      >
        <div className="flex items-center gap-3">
          <Link href="/" className="flex items-center gap-3">
            <div
              className={cx(
                "flex items-center justify-center overflow-hidden transition",
                isScrolled ? "h-10 w-10" : "h-12 w-12"
              )}
            >
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
          </Link>
        </div>

        <nav className="hidden items-center gap-6 md:flex">
          {sections.map((s) => (
            <NavLink
              key={s.id}
              href={`#${s.id}`}
              label={s.label}
              active={activeId === s.id}
            />
          ))}
        </nav>

        <div className="flex items-center gap-3">
          <Link
            href="/pro"
            className={cx(
              "group relative hidden h-10 items-center overflow-hidden rounded-2xl px-4 text-sm font-semibold text-white transition sm:inline-flex",
              "border border-violet-300/20 bg-[linear-gradient(135deg,rgba(139,92,246,0.22),rgba(236,72,153,0.18))]",
              "shadow-[0_8px_30px_rgba(124,58,237,0.22)] hover:-translate-y-[1px]",
              "hover:border-violet-200/35 hover:shadow-[0_10px_36px_rgba(168,85,247,0.30)]"
            )}
          >
            <span className="pointer-events-none absolute inset-0 opacity-0 transition-opacity duration-300 group-hover:opacity-100">
              <span className="absolute inset-0 bg-[radial-gradient(circle_at_top_left,rgba(255,255,255,0.22),transparent_35%)]" />
              <span className="absolute inset-0 bg-[linear-gradient(120deg,transparent_20%,rgba(255,255,255,0.15)_45%,transparent_70%)] translate-x-[-120%] group-hover:translate-x-[120%] transition-transform duration-700" />
            </span>

            <span className="relative z-10 flex items-center gap-2">
              <span className="h-2 w-2 rounded-full bg-violet-200 shadow-[0_0_14px_rgba(196,181,253,0.95)]" />
              <span>Pro</span>
              <span className="rounded-full bg-white/10 px-2 py-0.5 text-[10px] font-bold uppercase tracking-[0.12em] text-violet-100">
                New
              </span>
            </span>
          </Link>

          <a
            href={onlineUrl}
            className="relative inline-flex h-10 items-center overflow-hidden rounded-2xl bg-white px-4 text-sm font-semibold text-black transition hover:bg-white/90"
          >
            <span className="relative z-10">Try online</span>
            <span className="pointer-events-none absolute -left-20 top-0 h-full w-20 rotate-12 bg-white/40 blur-md opacity-40 animate-[shine_2.8s_ease-in-out_infinite]" />
          </a>

          <div className="relative flex h-10 w-10 shrink-0 items-center justify-center">
            <Show when="signed-out">
              <SignInButton mode="modal">
                <button
                  type="button"
                  className="inline-flex h-10 items-center rounded-2xl bg-white/8 px-3 text-sm font-medium text-white/80 ring-1 ring-white/10 transition hover:bg-white/12 hover:text-white"
                >
                  Sign in
                </button>
              </SignInButton>
            </Show>

            <Show when="signed-in">
              <div className="flex h-10 w-10 items-center justify-center">
                <UserButton
                  showName={false}
                  appearance={{
                    elements: {
                      userButtonBox: "h-10 w-10 flex items-center justify-center",
                      avatarBox: "h-10 w-10 ring-1 ring-white/10 rounded-full",
                      userButtonTrigger:
                        "h-10 w-10 flex items-center justify-center rounded-full outline-none",
                      userButtonPopoverCard:
                        "mt-2 mr-0 rounded-2xl overflow-hidden shadow-2xl",
                    },
                  }}
                />
              </div>
            </Show>
          </div>
        </div>
      </div>
    </header>
  );
}