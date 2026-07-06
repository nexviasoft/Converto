"use client";

import React from "react";
import { FeatureCard, SectionTitle } from "@/components/ui";

export default function FeaturesSection() {
  return (
    <section id="features" className="mx-auto max-w-6xl px-4 py-14">
      <SectionTitle
        kicker="WHY CONVERTO"
        title="A converter that feels premium."
        desc="A clean interface, focused conversion routes, useful format guides, and sensible defaults for everyday file tasks."
      />

      <div className="mt-10 grid gap-4 md:grid-cols-3">
        <FeatureCard
          title="Fast default workflow"
          desc="Start with common conversion presets and avoid unnecessary settings before you get a result."
          accent="from-emerald-500/15 via-violet-500/10 to-sky-500/15"
          icon={<img src="/brand/icons/lightning.png" alt="Lightning" className="block h-13 w-13 object-contain select-none" draggable={false} />}
        />
        <FeatureCard
          title="Clear file handling"
          desc="Free web conversions use practical limits and visible processing states instead of vague black-box uploads."
          accent="from-sky-500/15 via-violet-500/10 to-fuchsia-500/15"
          icon={<img src="/brand/icons/privacy.png" alt="Privacy" className="block h-9 w-9 object-contain select-none" draggable={false} />}
        />
        <FeatureCard
          title="Useful guides included"
          desc="Format and comparison pages help users choose outputs before converting audio, video, images, or PDFs."
          accent="from-violet-500/15 via-fuchsia-500/10 to-amber-500/15"
          icon={<img src="/brand/icons/unlock.png" alt="Guides" className="block h-9 w-9 object-contain select-none" draggable={false} />}
        />
      </div>
    </section>
  );
}
