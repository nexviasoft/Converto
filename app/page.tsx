"use client";

import React, { useEffect, useMemo, useRef, useState } from "react";
import Link from "next/link";
import AdSenseScript from "@/components/ads/AdsenseScript";

import Header from "@/components/landing/Header";
import Footer from "@/components/landing/Footer";
import Toast from "@/components/landing/Toast";
import InterstitialAd from "@/components/landing/InterstitialAd";

import HeroSection from "@/components/landing/sections/HeroSection";
import FeaturesSection from "@/components/landing/sections/FeaturesSection";
import HowSection from "@/components/landing/sections/HowSection";
import PricingSection from "@/components/landing/sections/PricingSection";
import TrustWaitlistSection from "@/components/landing/sections/TrustWaitlistSection";
import FaqSection from "@/components/landing/sections/FaqSection";

const popularConversions = [
  { href: "/convert/mp4-to-mp3", label: "MP4 to MP3" },
  { href: "/convert/mp4-to-wav", label: "MP4 to WAV" },
  { href: "/convert/webm-to-mp3", label: "WEBM to MP3" },
  { href: "/convert/flac-to-mp3", label: "FLAC to MP3" },
  { href: "/convert/mov-to-mp4", label: "MOV to MP4" },
  { href: "/convert/mp4-to-gif", label: "MP4 to GIF" },
];

export default function LandingPage() {
  const googlePlayUrl = "#";
  const onlineUrl = "/converter";

  const sections = useMemo(
    () => [
      { id: "features", label: "Features" },
      { id: "how", label: "How it works" },
      { id: "pricing", label: "Free vs Pro" },
      { id: "faq", label: "FAQ" },
    ],
    []
  );

  const [isScrolled, setIsScrolled] = useState(false);
  const [activeId, setActiveId] = useState<string>("features");
  const observerRef = useRef<IntersectionObserver | null>(null);

  const [email, setEmail] = useState("");
  const [emailError, setEmailError] = useState<string | null>(null);
  const [joined, setJoined] = useState(false);

  const [toastOpen, setToastOpen] = useState(false);
  const [toastTitle, setToastTitle] = useState("Done!");
  const [toastDesc, setToastDesc] = useState<string | undefined>(undefined);

  const [interstitialOpen, setInterstitialOpen] = useState(false);
  const pendingUrlRef = useRef<string | null>(null);

  const showToast = (t: string, d?: string) => {
    setToastTitle(t);
    setToastDesc(d);
    setToastOpen(true);
  };

  const openInterstitialFor = (url: string) => {
    pendingUrlRef.current = url;
    setInterstitialOpen(true);
  };

  const continueAfterInterstitial = () => {
    const url = pendingUrlRef.current || googlePlayUrl;
    setInterstitialOpen(false);
    pendingUrlRef.current = null;

    setTimeout(() => {
      if (url && url !== "#") window.location.href = url;
    }, 160);
  };

  const closeInterstitial = () => {
    setInterstitialOpen(false);
    pendingUrlRef.current = null;
  };

  useEffect(() => {
    const onScroll = () => setIsScrolled(window.scrollY > 8);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    try {
      const v = localStorage.getItem("converto_waitlist_joined_v1");
      if (v === "1") setJoined(true);
    } catch {}
  }, []);

  useEffect(() => {
    const ids = sections.map((s) => s.id);
    const els = ids.map((id) => document.getElementById(id)).filter(Boolean) as HTMLElement[];
    if (!els.length) return;

    observerRef.current?.disconnect();
    observerRef.current = new IntersectionObserver(
      (entries) => {
        const visible = entries
          .filter((e) => e.isIntersecting)
          .sort((a, b) => (b.intersectionRatio ?? 0) - (a.intersectionRatio ?? 0))[0];

        if (visible?.target?.id) setActiveId(visible.target.id);
      },
      { root: null, threshold: [0.2, 0.35, 0.5, 0.65], rootMargin: "-20% 0px -55% 0px" }
    );

    els.forEach((el) => observerRef.current?.observe(el));
    return () => observerRef.current?.disconnect();
  }, [sections]);

  const validateEmail = (v: string) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v.trim());

  const onJoin = (e: React.FormEvent) => {
    e.preventDefault();
    const v = email.trim();

    if (!validateEmail(v)) {
      setEmailError("Please enter a valid email address.");
      showToast("Invalid email", "Try again with a correct address.");
      return;
    }

    setEmailError(null);
    setJoined(true);

    try {
      localStorage.setItem("converto_waitlist_joined_v1", "1");
    } catch {}

    showToast("You're on the waitlist!", "We’ll notify you when online conversion goes live.");
  };

  return (
    <div className="min-h-screen bg-[#151233] text-white selection:bg-white/20">
      <AdSenseScript />

      <div className="pointer-events-none fixed inset-0 -z-10">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,rgba(168,85,247,0.22),transparent_60%),radial-gradient(ellipse_at_bottom,rgba(59,130,246,0.18),transparent_55%),radial-gradient(ellipse_at_center,rgba(255,255,255,0.08),transparent_45%)]" />
        <div className="absolute inset-0 opacity-20 [background:linear-gradient(to_right,rgba(255,255,255,0.045)_1px,transparent_1px),linear-gradient(to_bottom,rgba(255,255,255,0.045)_1px,transparent_1px)] [background-size:72px_72px]" />
      </div>

      <Header
        sections={sections}
        activeId={activeId}
        isScrolled={isScrolled}
        googlePlayUrl={googlePlayUrl}
        onlineUrl={onlineUrl}
        onOpenInterstitial={openInterstitialFor}
      />

      <main>
        <HeroSection
          googlePlayUrl={googlePlayUrl}
          onlineUrl={onlineUrl}
          onOpenInterstitial={openInterstitialFor}
        />

        <FeaturesSection />
        <HowSection />

        <PricingSection
          googlePlayUrl={googlePlayUrl}
          onlineUrl={onlineUrl}
          onOpenInterstitial={openInterstitialFor}
          showToast={showToast}
        />

        <TrustWaitlistSection
          email={email}
          joined={joined}
          emailError={emailError}
          setEmail={setEmail}
          onJoin={onJoin}
        />

        <FaqSection />

        <section className="mx-auto mt-16 max-w-5xl px-4 pb-8">
          <div className="rounded-[28px] bg-white/10 p-6 ring-1 ring-white/10 shadow-[0_18px_55px_rgba(0,0,0,0.25)]">
            <div className="text-[11px] font-semibold uppercase tracking-[0.18em] text-white/45">
              Popular conversion paths
            </div>

            <h2 className="mt-3 text-2xl font-semibold tracking-tight text-white">
              Start with the most common format conversions
            </h2>

            <p className="mt-3 max-w-[70ch] text-sm leading-6 text-white/65">
              Converto helps with common audio and video conversion tasks such as MP4 to MP3,
              WEBM to MP3, FLAC to MP3, MOV to MP4, and other everyday browser-based workflows.
            </p>

            <div className="mt-6 flex flex-wrap gap-3">
              {popularConversions.map((item) => (
                <Link
                  key={item.href}
                  href={item.href}
                  className="inline-flex rounded-full bg-white/8 px-4 py-2 text-sm font-medium text-white/80 ring-1 ring-white/10 transition hover:bg-white/12 hover:text-white"
                >
                  {item.label}
                </Link>
              ))}

              <Link
                href="/formats"
                className="inline-flex rounded-full bg-white px-4 py-2 text-sm font-semibold text-black transition hover:bg-white/90"
              >
                Explore all format guides
              </Link>
            </div>
          </div>
        </section>

        <section className="mx-auto max-w-5xl px-4 pb-16">
          <div className="rounded-[28px] bg-white/10 p-6 ring-1 ring-white/10 shadow-[0_18px_55px_rgba(0,0,0,0.25)]">
            <div className="text-[11px] font-semibold uppercase tracking-[0.18em] text-white/45">
              About Converto
            </div>

            <h2 className="mt-3 text-2xl font-semibold tracking-tight text-white">
              Free online file converter for audio, video, and image formats
            </h2>

            <p className="mt-3 text-sm leading-6 text-white/65">
              Converto is a browser-based file converter built for quick everyday tasks. You can
              convert common audio, video, and lightweight animated image files without installing
              extra software. The goal is a clean workflow, simple format selection, and direct
              downloads for fast results.
            </p>

            <p className="mt-4 text-sm leading-6 text-white/65">
              Popular use cases include extracting audio from video, changing playback formats,
              converting video for compatibility, and turning animated GIF content into more
              flexible video outputs. Converto is designed to be simple, fast, and focused.
            </p>
          </div>
        </section>

        <style>{`
          @keyframes shine {
            0% { transform: translateX(-120px) rotate(12deg); opacity: 0; }
            20% { opacity: .35; }
            50% { opacity: .45; }
            80% { opacity: .25; }
            100% { transform: translateX(520px) rotate(12deg); opacity: 0; }
          }
        `}</style>
      </main>

      <Footer
        googlePlayUrl={googlePlayUrl}
        onOpenInterstitial={openInterstitialFor}
        onToastSupport={() => showToast("Support", "Email: support@converto.tools")}
      />

      <Toast
        open={toastOpen}
        title={toastTitle}
        desc={toastDesc}
        onClose={() => setToastOpen(false)}
      />
      <InterstitialAd
        open={interstitialOpen}
        onClose={closeInterstitial}
        onContinue={continueAfterInterstitial}
      />
    </div>
  );
}