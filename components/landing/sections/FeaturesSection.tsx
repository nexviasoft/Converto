"use client";

import React from "react";
import { FeatureCard, SectionTitle } from "@/components/ui";

export default function FeaturesSection() {
  return (
    <section id="features" className="mx-auto max-w-6xl px-4 py-14">
      <SectionTitle
        kicker="WHY CONVERTO"
        title="A converter that feels premium."
        desc="No clutter. No confusing settings. Just the options you actually need — with performance-first defaults."
      />

      <div className="mt-10 grid gap-4 md:grid-cols-3">
        <FeatureCard
          title="Lightning-fast defaults"
          desc="Smart presets that keep files small and quality high."
          accent="from-emerald-500/15 via-violet-500/10 to-sky-500/15"
          icon={<img src="/brand/icons/lightning.png" alt="Lightning" className="block h-14 w-14 object-contain select-none" draggable={false} />}
        />
        <FeatureCard
          title="Privacy-first"
          desc="Mobile app processes images & documents locally."
          accent="from-sky-500/15 via-violet-500/10 to-fuchsia-500/15"
          icon={<img src="/brand/icons/privacy.png" alt="Privacy" className="block h-9 w-9 object-contain select-none" draggable={false} />}
        />
        <FeatureCard
          title="Free vs Pro done right"
          desc="Pro unlocks higher limits and premium formats."
          accent="from-violet-500/15 via-fuchsia-500/10 to-amber-500/15"
          icon={<img src="/brand/icons/unlock.png" alt="Unlock" className="block h-9 w-9 object-contain select-none" draggable={false} />}
        />
      </div>
    </section>
  );
}