"use client";

import React, { useEffect, useMemo, useRef, useState } from "react";
import Link from "next/link";
import Image from "next/image";

import Header from "@/components/landing/Header";
import Footer from "@/components/landing/Footer";

type BillingType = "monthly" | "yearly";

const monthlyPrice = 4.99;
const yearlyPrice = 39;

const proHighlights = [
  {
    title: "Advanced export controls",
    text: "Trim, bitrate, sample rate, audio channels and cleaner output settings for users who want more control.",
    icon: "/pro-icons/advanced-export-controls.png",
  },
  {
    title: "Higher limits",
    text: "Move beyond the basic free flow with larger file support and a more comfortable conversion experience.",
    icon: "/pro-icons/higher-limits.png",
  },
  {
    title: "Batch conversion",
    text: "Convert multiple files in one workflow instead of repeating the same steps manually every time.",
    icon: "/pro-icons/batch-conversion.png",
  },
];

const proFeatures = [
  {
    title: "Trim before export",
    desc: "Cut unnecessary parts before downloading.",
    badge: "Editing",
  },
  {
    title: "Audio bitrate selection",
    desc: "Choose lighter or higher-quality output.",
    badge: "Audio",
  },
  {
    title: "Sample rate presets",
    desc: "Useful for cleaner compatibility and export control.",
    badge: "Audio",
  },
  {
    title: "Mono / stereo selection",
    desc: "Adjust channel output for your use case.",
    badge: "Channels",
  },
  {
    title: "Batch conversion",
    desc: "Convert multiple files in one go.",
    badge: "Workflow",
  },
  {
    title: "Priority workflow",
    desc: "A smoother experience for repeat usage.",
    badge: "Speed",
  },
  {
    title: "Higher file limits",
    desc: "More room for heavier files and larger jobs.",
    badge: "Limits",
  },
  {
    title: "Priority support",
    desc: "Faster help when you actually need it.",
    badge: "Support",
  },
];

const comparisonRows = [
  { label: "Max file size", free: "50 MB", pro: "1 GB" },
  { label: "Batch conversion", free: "—", pro: "Up to 50 files" },
  { label: "Trim tools", free: "—", pro: "Included" },
  { label: "Audio bitrate control", free: "—", pro: "64k to 320k" },
  { label: "Sample rate options", free: "—", pro: "22.05 / 32 / 44.1 / 48 kHz" },
  { label: "Audio channels", free: "—", pro: "Mono / Stereo" },
  { label: "Priority queue", free: "—", pro: "Included" },
  { label: "Support", free: "Standard", pro: "Priority support" },
];

const useCases = [
  {
    title: "For heavier workflows",
    text: "Useful when you convert often, deal with bigger files, or want to stop repeating the same steps every day.",
  },
  {
    title: "For cleaner exports",
    text: "Tune output settings instead of settling for one default path every time.",
  },
  {
    title: "For teams and repeat use",
    text: "A better fit when Converto becomes part of your regular workflow rather than a one-off tool.",
  },
];

const faqs = [
  {
    q: "What does Converto Pro unlock?",
    a: "Converto Pro unlocks advanced controls like trim, bitrate, sample rate, channel selection, batch conversion, higher file limits, and a smoother workflow for heavy usage.",
  },
  {
    q: "Does free stay available?",
    a: "Yes. The free experience stays available for quick conversions. Pro is meant for users who need more control, higher limits, and better workflow comfort.",
  },
  {
    q: "Can I cancel anytime?",
    a: "Yes. You can manage and cancel your subscription before the next renewal cycle.",
  },
  {
    q: "Is checkout secure?",
    a: "For now, early access signups are handled through the landing page waitlist while checkout is being finalized.",
  },
];

export default function ConvertoProPricingPage() {
  const googlePlayUrl: string | null = null;
  const onlineUrl = "/converter";

  const sections = useMemo(
    () => [
      { id: "features", label: "Features" },
      { id: "how", label: "Why Pro" },
      { id: "pricing", label: "Free vs Pro" },
      { id: "faq", label: "FAQ" },
    ],
    []
  );

  const [billing, setBilling] = useState<BillingType>("yearly");
  const [openedFaq, setOpenedFaq] = useState<number | null>(0);
  const [isScrolled, setIsScrolled] = useState(false);
  const [activeId, setActiveId] = useState<string>("features");
  const observerRef = useRef<IntersectionObserver | null>(null);

  useEffect(() => {
    const onScroll = () => setIsScrolled(window.scrollY > 8);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    const ids = sections.map((s) => s.id);
    const els = ids
      .map((id) => document.getElementById(id))
      .filter(Boolean) as HTMLElement[];

    if (!els.length) return;

    observerRef.current?.disconnect();
    observerRef.current = new IntersectionObserver(
      (entries) => {
        const visible = entries
          .filter((e) => e.isIntersecting)
          .sort((a, b) => (b.intersectionRatio ?? 0) - (a.intersectionRatio ?? 0))[0];

        if (visible?.target?.id) setActiveId(visible.target.id);
      },
      {
        root: null,
        threshold: [0.2, 0.35, 0.5, 0.65],
        rootMargin: "-20% 0px -55% 0px",
      }
    );

    els.forEach((el) => observerRef.current?.observe(el));
    return () => observerRef.current?.disconnect();
  }, [sections]);

  const monthlyEquivalent = yearlyPrice / 12;
  const displayPrice = billing === "monthly" ? monthlyPrice : monthlyEquivalent;
  const billedText =
    billing === "monthly"
      ? "Billed monthly"
      : `Billed yearly as $${yearlyPrice.toFixed(2)}`;
  const savingText = `$${(monthlyPrice * 12 - yearlyPrice).toFixed(2)} yearly savings`;

  const onAndroidAppClick = () => {
    window.alert("Android app coming soon");
  };

  const openInterstitialFor = (url: string) => {
    window.location.href = url;
  };

  const handleCheckout = () => {
    window.location.href = "/#early-access";
  };

  return (
    <div className="min-h-screen bg-[#151233] text-white selection:bg-white/20">
      <div className="pointer-events-none fixed inset-0 -z-10">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,rgba(168,85,247,0.22),transparent_60%),radial-gradient(ellipse_at_bottom,rgba(59,130,246,0.18),transparent_55%),radial-gradient(ellipse_at_center,rgba(255,255,255,0.08),transparent_45%)]" />
        <div className="absolute inset-0 opacity-20 [background:linear-gradient(to_right,rgba(255,255,255,0.045)_1px,transparent_1px),linear-gradient(to_bottom,rgba(255,255,255,0.045)_1px,transparent_1px)] [background-size:72px_72px]" />
      </div>

      <Header
        sections={sections}
        activeId={activeId}
        isScrolled={isScrolled}
        onlineUrl={onlineUrl}
      />

      <main>
        <section className="mx-auto max-w-6xl px-4 pb-8 pt-10 sm:px-6 lg:px-8 lg:pt-14">
          <div className="grid items-center gap-8 lg:grid-cols-[1.02fr_0.98fr]">
            <div>
              <div className="inline-flex rounded-full bg-white/8 px-3 py-1 text-[11px] font-medium text-white/75 ring-1 ring-white/10">
                Converto Pro
              </div>

              <h1 className="mt-4 max-w-2xl text-3xl font-semibold tracking-tight text-white sm:text-4xl lg:text-5xl">
                Upgrade when you need more control, higher limits, and faster workflows.
              </h1>

              <p className="mt-4 max-w-xl text-sm leading-6 text-white/65 sm:text-[15px]">
                Converto Pro keeps the same clean Converto feel, then adds the extras that actually matter for repeat users: batch conversion, advanced export controls, and a more comfortable workflow.
              </p>

              <div className="mt-5 flex flex-wrap gap-2">
                <span className="rounded-full bg-white/8 px-3 py-1 text-[11px] font-medium text-white/75 ring-1 ring-white/10">Trim</span>
                <span className="rounded-full bg-white/8 px-3 py-1 text-[11px] font-medium text-white/75 ring-1 ring-white/10">Bitrate</span>
                <span className="rounded-full bg-white/8 px-3 py-1 text-[11px] font-medium text-white/75 ring-1 ring-white/10">Sample rate</span>
                <span className="rounded-full bg-white/8 px-3 py-1 text-[11px] font-medium text-white/75 ring-1 ring-white/10">Channels</span>
                <span className="rounded-full bg-white/8 px-3 py-1 text-[11px] font-medium text-white/75 ring-1 ring-white/10">Batch conversion</span>
                <span className="rounded-full bg-white/8 px-3 py-1 text-[11px] font-medium text-white/75 ring-1 ring-white/10">No watermarks</span>
              </div>

              <div className="mt-6 flex flex-wrap gap-3">
                <a
                  href="#checkout"
                  className="inline-flex rounded-full bg-white px-5 py-3 text-sm font-semibold text-black transition hover:bg-white/90"
                >
                  Get Pro
                </a>
                <Link
                  href="/converter"
                  className="inline-flex rounded-full bg-white/8 px-5 py-3 text-sm font-semibold text-white/80 ring-1 ring-white/10 transition hover:bg-white/12 hover:text-white"
                >
                  Try free converter
                </Link>
              </div>

              <div className="mt-4 text-xs text-white/45">
                Intro pricing that feels accessible now, while still positioning Pro as the premium upgrade.
              </div>
            </div>

            <div className="mx-auto w-full max-w-[420px]">
              <div className="rounded-[30px] bg-[#0f0c24] p-3 ring-1 ring-white/10 shadow-[0_24px_60px_rgba(0,0,0,0.38)]">
                <div className="rounded-[26px] border border-white/10 bg-[#141034] p-4">
                  <div className="flex items-center justify-between text-[11px]">
                    <span className="text-white/70">Converto Pro</span>
                    <span className="font-medium text-emerald-300">● Online</span>
                  </div>

                  <div className="mt-4 rounded-[22px] bg-white/5 p-4 ring-1 ring-white/10">
                    <div className="flex items-start justify-between gap-3">
                      <div>
                        <div className="text-sm font-semibold">Unlock advanced controls</div>
                        <div className="mt-1 text-xs text-white/55">Simple pricing for repeat users</div>
                      </div>
                      <div className="rounded-full bg-emerald-400/15 px-2.5 py-1 text-[10px] font-semibold text-emerald-300">
                        Save yearly
                      </div>
                    </div>

                    <div className="mt-4 grid grid-cols-2 gap-2 rounded-full bg-white/5 p-1 ring-1 ring-white/10">
                      <button
                        type="button"
                        onClick={() => setBilling("monthly")}
                        className={`rounded-full px-4 py-2 text-xs font-semibold transition ${
                          billing === "monthly" ? "bg-white text-black" : "text-white/70"
                        }`}
                      >
                        Monthly
                      </button>
                      <button
                        type="button"
                        onClick={() => setBilling("yearly")}
                        className={`rounded-full px-4 py-2 text-xs font-semibold transition ${
                          billing === "yearly" ? "bg-white text-black" : "text-white/70"
                        }`}
                      >
                        Yearly
                      </button>
                    </div>

                    <div className="mt-4 rounded-[20px] bg-[linear-gradient(180deg,#221b52_0%,#1a153f_100%)] p-4 ring-1 ring-white/10">
                      <div className="flex items-end gap-2">
                        <span className="text-4xl font-semibold">${displayPrice.toFixed(2)}</span>
                        <span className="pb-1 text-sm text-white/60">/ month</span>
                      </div>

                      {billing === "yearly" ? (
                        <>
                          <div className="mt-2 text-xs text-white/55">{billedText}</div>
                          <div className="mt-1 text-xs font-medium text-emerald-300">{savingText}</div>
                        </>
                      ) : (
                        <>
                          <div className="mt-2 text-xs text-white/55">{billedText}</div>
                          <div className="mt-1 text-xs text-white/40">Switch to yearly for a better deal</div>
                        </>
                      )}
                    </div>

                    <div className="mt-4 grid grid-cols-2 gap-3">
                      <div className="rounded-[16px] bg-white/5 p-3 ring-1 ring-white/10">
                        <div className="text-[11px] text-white/45">Exports</div>
                        <div className="mt-1 text-sm font-semibold">More control</div>
                      </div>
                      <div className="rounded-[16px] bg-white/5 p-3 ring-1 ring-white/10">
                        <div className="text-[11px] text-white/45">Workflow</div>
                        <div className="mt-1 text-sm font-semibold">Less repetition</div>
                      </div>
                    </div>

                    <button
                      type="button"
                      onClick={handleCheckout}
                      className="group relative mt-5 inline-flex w-full items-center justify-center overflow-hidden rounded-full bg-white px-4 py-3 text-sm font-semibold text-black shadow-[0_12px_30px_rgba(255,255,255,0.18)] transition-all duration-150 hover:-translate-y-0.5 hover:bg-white/95 hover:shadow-[0_18px_40px_rgba(255,255,255,0.22)] active:translate-y-[1px] active:scale-[0.985] active:bg-white/90 active:shadow-[inset_0_3px_10px_rgba(0,0,0,0.18),0_8px_18px_rgba(255,255,255,0.10)]"
                    >
                      <span className="absolute inset-0 bg-[linear-gradient(120deg,transparent_0%,rgba(255,255,255,0.45)_35%,transparent_70%)] opacity-0 transition-opacity duration-200 group-hover:opacity-100" />
                      <span className="relative z-10 flex items-center gap-2">
                        Join Early Access
                        <span className="transition-transform duration-150 group-hover:translate-x-0.5 group-active:translate-x-0">
                          ↗
                        </span>
                      </span>
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        <section id="features" className="mx-auto max-w-6xl px-4 py-10 sm:px-6 lg:px-8">
          <div className="text-center">
            <div className="text-[12px] font-semibold uppercase tracking-[0.18em] text-white/45">
              Why Converto
            </div>
            <h2 className="mt-3 text-3xl font-semibold tracking-tight text-white sm:text-4xl">
              A converter that feels premium.
            </h2>
            <p className="mx-auto mt-4 max-w-3xl text-sm leading-6 text-white/60 sm:text-[15px]">
              No clutter. No confusing settings. Just the options you actually need — with performance-first defaults.
            </p>
          </div>

          <div className="mt-8 grid gap-4 md:grid-cols-3">
            {proHighlights.map((item) => (
              <div
                key={item.title}
                className="group rounded-[26px] bg-white/10 px-5 py-6 text-center ring-1 ring-white/10 shadow-[0_18px_55px_rgba(0,0,0,0.25)] transition duration-300 hover:-translate-y-1 hover:bg-white/[0.12]"
              >
                <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-[20px] bg-[#211a4a] ring-1 ring-white/10 shadow-[0_10px_35px_rgba(139,92,246,0.22)] transition duration-300 group-hover:shadow-[0_12px_45px_rgba(139,92,246,0.35)]">
                  <Image
                    src={item.icon}
                    alt={item.title}
                    width={42}
                    height={42}
                    className="h-12 w-12 object-contain transition duration-300 group-hover:scale-110"
                    unoptimized
                  />
                </div>

                <h3 className="mt-5 text-xl font-semibold tracking-tight text-white">
                  {item.title}
                </h3>

                <p className="mx-auto mt-3 max-w-[280px] text-sm leading-7 text-white/68">
                  {item.text}
                </p>
              </div>
            ))}
          </div>
        </section>

        <section id="how" className="mx-auto max-w-5xl px-4 py-8 sm:px-6 lg:px-8">
          <div className="text-center">
            <div className="text-[11px] font-semibold uppercase tracking-[0.18em] text-white/45">
              What Pro adds
            </div>
            <h2 className="mt-3 text-2xl font-semibold tracking-tight text-white sm:text-3xl">
              Extra tools that fit naturally into Converto.
            </h2>
            <p className="mx-auto mt-3 max-w-2xl text-sm leading-6 text-white/65">
              Not a bloated dashboard. Just practical upgrades that make sense for frequent conversion work.
            </p>
          </div>

          <div className="mt-7 grid items-stretch gap-4 lg:grid-cols-[1.15fr_0.85fr]">
            <div className="flex h-full flex-col rounded-[26px] border border-white/10 bg-[linear-gradient(180deg,rgba(255,255,255,0.11),rgba(255,255,255,0.07))] p-5 shadow-[0_18px_55px_rgba(0,0,0,0.25)] backdrop-blur-sm">
              <div>
                <div className="text-[11px] font-semibold uppercase tracking-[0.22em] text-white/45">
                  Included in Pro
                </div>

                <h3 className="mt-3 text-xl font-semibold tracking-tight text-white sm:text-2xl">
                  Built for users who convert more often
                </h3>

                <p className="mt-2 max-w-xl text-sm leading-6 text-white/62">
                  Better export control, less repetitive work, and a smoother overall flow.
                </p>

                <div className="mt-3 inline-block rounded-full border border-emerald-300/20 bg-emerald-400/10 px-3 py-1 text-[11px] font-semibold text-emerald-300">
                  8 Pro upgrades
                </div>
              </div>

              <div className="mt-5 grid flex-1 gap-3 sm:grid-cols-2">
                {proFeatures.map((feature) => (
                  <div
                    key={feature.title}
                    className="rounded-[20px] border border-white/10 bg-[linear-gradient(180deg,rgba(255,255,255,0.08),rgba(255,255,255,0.04))] p-4 shadow-[inset_0_1px_0_rgba(255,255,255,0.04)] transition duration-300 hover:-translate-y-1 hover:border-violet-300/20 hover:bg-[linear-gradient(180deg,rgba(255,255,255,0.1),rgba(255,255,255,0.05))] hover:shadow-[0_14px_30px_rgba(88,28,135,0.18)]"
                  >
                    <div className="flex justify-end">
                      <div className="rounded-full border border-white/10 bg-white/6 px-2.5 py-1 text-[10px] font-semibold uppercase tracking-[0.12em] text-white/55">
                        {feature.badge}
                      </div>
                    </div>

                    <div className="mt-3 text-[15px] font-semibold tracking-tight text-white">
                      {feature.title}
                    </div>

                    <div className="mt-2 text-[13px] leading-6 text-white/58">
                      {feature.desc}
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div className="flex h-full flex-col gap-4">
              {useCases.map((item) => (
                <div
                  key={item.title}
                  className="flex-1 rounded-[24px] border border-white/10 bg-[linear-gradient(180deg,rgba(255,255,255,0.12),rgba(255,255,255,0.08))] p-5 shadow-[0_18px_55px_rgba(0,0,0,0.25)] backdrop-blur-sm transition duration-300 hover:bg-[linear-gradient(180deg,rgba(255,255,255,0.14),rgba(255,255,255,0.09))] hover:shadow-[0_20px_60px_rgba(88,28,135,0.22)]"
                >
                  <div className="text-lg font-semibold tracking-tight text-white sm:text-xl">
                    {item.title}
                  </div>
                  <div className="mt-3 text-sm leading-7 text-white/68">
                    {item.text}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        <section id="pricing" className="mx-auto max-w-5xl px-4 py-8 sm:px-6 lg:px-8">
          <div className="text-center">
            <div className="text-[11px] font-semibold uppercase tracking-[0.18em] text-white/45">
              Free vs Pro
            </div>
            <h2 className="mt-3 text-2xl font-semibold tracking-tight text-white sm:text-3xl">
              Clear limits. Honest value.
            </h2>
            <p className="mx-auto mt-3 max-w-2xl text-sm leading-6 text-white/65">
              Free is still great for quick jobs. Pro is for people who want more control, higher limits, and better workflow comfort.
            </p>
          </div>

          <div className="mt-7 overflow-hidden rounded-[24px] bg-white/10 ring-1 ring-white/10 shadow-[0_18px_55px_rgba(0,0,0,0.25)]">
            <div className="grid grid-cols-3 border-b border-white/10 bg-white/5 text-sm font-medium text-white/70">
              <div className="px-4 py-4">Feature</div>
              <div className="px-4 py-4">Free</div>
              <div className="px-4 py-4">Pro</div>
            </div>
            {comparisonRows.map((row, index) => (
              <div
                key={row.label}
                className={`grid grid-cols-3 text-sm ${
                  index !== comparisonRows.length - 1 ? "border-b border-white/10" : ""
                }`}
              >
                <div className="bg-white/[0.03] px-4 py-4 text-white/85">{row.label}</div>
                <div className="px-4 py-4 text-white/60">{row.free}</div>
                <div className="px-4 py-4 font-medium text-white">{row.pro}</div>
              </div>
            ))}
          </div>
        </section>

        <section id="checkout" className="mx-auto max-w-5xl px-4 py-8 sm:px-6 lg:px-8">
          <div className="grid gap-5 lg:grid-cols-[0.9fr_1.1fr]">
            <div className="rounded-[24px] bg-white/10 p-5 ring-1 ring-white/10 shadow-[0_18px_55px_rgba(0,0,0,0.25)]">
              <div className="text-[11px] font-semibold uppercase tracking-[0.18em] text-white/45">
                Checkout
              </div>
              <h2 className="mt-3 text-2xl font-semibold tracking-tight text-white sm:text-3xl">
                Ready to unlock Pro?
              </h2>
              <p className="mt-3 text-sm leading-6 text-white/65">
                Keep the same clean Converto experience, then add the controls and limits that make repeated conversion work easier.
              </p>

              <div className="mt-6 space-y-3 text-sm text-white/70">
                <div>• Early access signup</div>
                <div>• Launch updates</div>
                <div>• Priority interest tracking</div>
                <div>• Great fit for heavier usage</div>
              </div>

              <div className="mt-6 rounded-[20px] bg-white/5 p-4 ring-1 ring-white/10">
                <div className="text-xs text-white/50">Selected plan</div>
                <div className="mt-1 text-base font-semibold text-white">
                  Converto Pro ({billing})
                </div>
                <div className="mt-3 text-3xl font-semibold text-white">
                  {billing === "monthly"
                    ? `$${monthlyPrice.toFixed(2)}`
                    : `$${yearlyPrice.toFixed(2)}`}
                </div>
                <div className="mt-1 text-xs text-white/55">{billedText}</div>
                {billing === "yearly" && (
                  <div className="mt-1 text-xs text-emerald-300">{savingText}</div>
                )}
              </div>
            </div>

            <div className="rounded-[24px] bg-white/10 p-5 ring-1 ring-white/10 shadow-[0_18px_55px_rgba(0,0,0,0.25)]">
              <div className="mb-5 rounded-[20px] bg-[linear-gradient(135deg,rgba(139,92,246,0.14),rgba(236,72,153,0.10))] p-4 ring-1 ring-violet-300/15">
                <div className="flex items-center justify-between gap-3">
                  <div>
                    <div className="text-sm font-semibold text-white">Early access pricing</div>
                    <div className="mt-1 text-xs text-white/60">
                      Simple starting price for early adopters
                    </div>
                  </div>
                  <div className="rounded-full bg-white/10 px-3 py-1 text-[10px] font-semibold uppercase tracking-[0.12em] text-violet-100">
                    Most popular
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-2 rounded-full bg-white/5 p-1 ring-1 ring-white/10">
                <button
                  type="button"
                  onClick={() => setBilling("monthly")}
                  className={`rounded-full px-4 py-2 text-sm font-semibold transition ${
                    billing === "monthly" ? "bg-white text-black" : "text-white/70"
                  }`}
                >
                  Monthly
                </button>
                <button
                  type="button"
                  onClick={() => setBilling("yearly")}
                  className={`rounded-full px-4 py-2 text-sm font-semibold transition ${
                    billing === "yearly" ? "bg-white text-black" : "text-white/70"
                  }`}
                >
                  Yearly
                </button>
              </div>

              <div className="mt-5 rounded-[20px] bg-white/5 p-5 ring-1 ring-white/10">
                <div className="text-sm font-semibold text-white">Join early access</div>
                <div className="mt-2 text-sm leading-6 text-white/60">
                  Click below to join the early access waitlist for your selected plan while checkout is being finalized.
                </div>

                <div className="mt-4 rounded-[16px] bg-white/[0.04] p-4 ring-1 ring-white/10">
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-white/60">Plan</span>
                    <span className="font-semibold text-white">
                      {billing === "monthly" ? "Monthly" : "Yearly"}
                    </span>
                  </div>
                  <div className="mt-2 flex items-center justify-between text-sm">
                    <span className="text-white/60">Price</span>
                    <span className="font-semibold text-white">
                      {billing === "monthly"
                        ? `$${monthlyPrice.toFixed(2)} / month`
                        : `$${yearlyPrice.toFixed(2)} / year`}
                    </span>
                  </div>
                </div>

                <button
                  type="button"
                  onClick={handleCheckout}
                  className="group relative mt-5 h-12 w-full overflow-hidden rounded-full bg-white text-sm font-semibold text-black shadow-[0_12px_30px_rgba(255,255,255,0.18)] transition-all duration-150 hover:-translate-y-0.5 hover:bg-white/95 hover:shadow-[0_18px_40px_rgba(255,255,255,0.22)] active:translate-y-[1px] active:scale-[0.985] active:bg-white/90 active:shadow-[inset_0_3px_10px_rgba(0,0,0,0.18),0_8px_18px_rgba(255,255,255,0.10)]"
                >
                  <span className="absolute inset-0 bg-[linear-gradient(120deg,transparent_0%,rgba(255,255,255,0.45)_35%,transparent_70%)] opacity-0 transition-opacity duration-200 group-hover:opacity-100" />
                  <span className="relative z-10 flex h-full items-center justify-center gap-2">
                    Join Early Access
                    <span className="transition-transform duration-150 group-hover:translate-x-0.5 group-active:translate-x-0">
                      ↗
                    </span>
                  </span>
                </button>

                <p className="mt-3 text-xs text-white/45">
                  You’ll be redirected to the landing page early access section.
                </p>
              </div>
            </div>
          </div>
        </section>

        <section id="faq" className="mx-auto max-w-4xl px-4 py-10 sm:px-6 lg:px-8">
          <div className="text-center">
            <div className="text-[11px] font-semibold uppercase tracking-[0.18em] text-white/45">
              FAQ
            </div>
            <h2 className="mt-3 text-3xl font-semibold tracking-tight text-white sm:text-4xl">
              Common questions.
            </h2>
            <p className="mx-auto mt-4 max-w-2xl text-sm leading-6 text-white/60 sm:text-[15px]">
              Everything important about pricing, access, and how Pro fits into the Converto workflow.
            </p>
          </div>

          <div className="mt-8 space-y-3">
            {faqs.map((item, index) => {
              const isOpen = openedFaq === index;
              return (
                <div
                  key={item.q}
                  className="overflow-hidden rounded-[20px] bg-white/10 ring-1 ring-white/10 shadow-[0_18px_55px_rgba(0,0,0,0.2)]"
                >
                  <button
                    type="button"
                    onClick={() => setOpenedFaq(isOpen ? null : index)}
                    className="flex w-full items-center justify-between px-5 py-4 text-left"
                  >
                    <span className="text-base font-semibold text-white">{item.q}</span>
                    <span className="text-white/50">{isOpen ? "−" : "+"}</span>
                  </button>

                  {isOpen && (
                    <div className="px-5 pb-5 text-sm leading-7 text-white/65 sm:text-[15px]">
                      {item.a}
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </section>
      </main>

      <Footer
        googlePlayUrl={googlePlayUrl}
        onOpenInterstitial={openInterstitialFor}
        onToastSupport={() => window.alert("Support: support@converto.tools")}
        onAndroidAppClick={onAndroidAppClick}
      />
    </div>
  );
}