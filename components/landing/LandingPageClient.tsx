"use client";

import React, { useEffect, useMemo, useRef, useState } from "react";
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
import HomeResourceSections from "@/components/landing/sections/HomeResourceSections";
import { PRO_PUBLIC, WAITLIST_PUBLIC } from "@/lib/siteReadiness";

export default function LandingPageClient() {
  const googlePlayUrl: string | null = null;
  const onlineUrl = "/converter";

  const sections = useMemo(
    () => [
      { id: "features", label: "Features" },
      { id: "how", label: "How it works" },
      ...(PRO_PUBLIC ? [{ id: "pricing", label: "Free vs Pro" }] : []),
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
  const [waitlistCount, setWaitlistCount] = useState(0);

  const emailInputRef = useRef<HTMLInputElement | null>(null);

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

  const onAndroidAppClick = () => {
    showToast(
      "Android app coming soon",
      "The mobile version of Converto is currently in development."
    );
  };

  const openInterstitialFor = (url: string) => {
    pendingUrlRef.current = url;
    setInterstitialOpen(true);
  };

  const continueAfterInterstitial = () => {
    const url = pendingUrlRef.current;
    setInterstitialOpen(false);
    pendingUrlRef.current = null;

    setTimeout(() => {
      if (url) window.location.href = url;
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
    if (!WAITLIST_PUBLIC) return;

    try {
      const v = localStorage.getItem("converto_waitlist_joined_v1");
      if (v === "1") setJoined(true);
    } catch {}
  }, []);

  useEffect(() => {
    if (!WAITLIST_PUBLIC) return;

    const loadWaitlistCount = async () => {
      try {
        const res = await fetch("/api/waitlist/count");
        const data = await res.json();
        setWaitlistCount(data.count ?? 0);
      } catch {
        setWaitlistCount(0);
      }
    };

    loadWaitlistCount();
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
          .sort(
            (a, b) => (b.intersectionRatio ?? 0) - (a.intersectionRatio ?? 0)
          )[0];

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

  useEffect(() => {
    if (!WAITLIST_PUBLIC) return;

    const scrollToEarlyAccess = () => {
      if (window.location.hash !== "#early-access") return;

      const el = document.getElementById("early-access");
      if (!el) return;

      requestAnimationFrame(() => {
        el.scrollIntoView({
          behavior: "smooth",
          block: "center",
        });
      });
    };

    const timeout = window.setTimeout(scrollToEarlyAccess, 80);

    window.addEventListener("hashchange", scrollToEarlyAccess);

    return () => {
      window.clearTimeout(timeout);
      window.removeEventListener("hashchange", scrollToEarlyAccess);
    };
  }, []);

  const validateEmail = (v: string) =>
    /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v.trim());

  const focusWaitlistInput = () => {
    const early = document.getElementById("early-access");
    early?.scrollIntoView({ behavior: "smooth", block: "center" });

    window.setTimeout(() => {
      emailInputRef.current?.focus({ preventScroll: true });
      emailInputRef.current?.select();
    }, 520);
  };


  const onJoin = async (e: React.FormEvent) => {
    e.preventDefault();
    const v = email.trim().toLowerCase();

    if (!validateEmail(v)) {
      setEmailError("Please enter a valid email address.");
      showToast("Invalid email", "Try again with a correct address.");
      return;
    }

    setEmailError(null);

    try {
      const res = await fetch("/api/waitlist", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email: v }),
      });

      const data = await res.json();

      if (!res.ok) {
        const message =
          data?.error || data?.message || "Something went wrong. Please try again.";

        setEmailError(message);
        showToast("Could not join", message);
        return;
      }

      setJoined(true);
      setEmail("");
      setWaitlistCount((prev) => prev + 1);

      try {
        localStorage.setItem("converto_waitlist_joined_v1", "1");
      } catch {}

      showToast(
        "You're on the waitlist!",
        "We’ll notify you when online conversion goes live."
      );
    } catch {
      setEmailError("Something went wrong. Please try again.");
      showToast("Server error", "Please try again in a moment.");
    }
  };

  return (
    <div className="min-h-screen bg-[#181337] bg-[radial-gradient(ellipse_at_top_left,rgba(139,92,246,0.24),transparent_50%),radial-gradient(ellipse_at_bottom_right,rgba(59,130,246,0.20),transparent_48%),radial-gradient(ellipse_at_center,rgba(255,255,255,0.055),transparent_46%)] text-white selection:bg-white/20">
      <div className="pointer-events-none fixed inset-0 -z-10">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top_left,rgba(168,85,247,0.18),transparent_58%),radial-gradient(ellipse_at_bottom_right,rgba(59,130,246,0.16),transparent_54%)]" />
        <div className="absolute inset-0 opacity-[0.16] [background:linear-gradient(to_right,rgba(255,255,255,0.04)_1px,transparent_1px),linear-gradient(to_bottom,rgba(255,255,255,0.04)_1px,transparent_1px)] [background-size:72px_72px]" />
      </div>

      <Header
        sections={sections}
        activeId={activeId}
        isScrolled={isScrolled}
        onlineUrl={onlineUrl}
      />

      <main>
        <HeroSection
          googlePlayUrl={googlePlayUrl}
          onlineUrl={onlineUrl}
          onOpenInterstitial={openInterstitialFor}
          onAndroidAppClick={onAndroidAppClick}
        />

        <FeaturesSection />
        <HowSection />

        {PRO_PUBLIC ? (
          <PricingSection
            googlePlayUrl={googlePlayUrl}
            onlineUrl={onlineUrl}
            onOpenInterstitial={openInterstitialFor}
            onAndroidAppClick={onAndroidAppClick}
            showToast={showToast}
            onNotifyMe={focusWaitlistInput}
          />
        ) : null}

        {WAITLIST_PUBLIC ? (
          <section id="early-access" className="scroll-mt-32">
            <TrustWaitlistSection
              email={email}
              joined={joined}
              emailError={emailError}
              setEmail={setEmail}
              onJoin={onJoin}
              waitlistCount={waitlistCount}
              inputRef={emailInputRef}
            />
          </section>
        ) : null}

        <FaqSection />

        <HomeResourceSections />

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
        onAndroidAppClick={onAndroidAppClick}
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