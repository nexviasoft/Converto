"use client";

import React from "react";
import { FAQItem, SectionTitle } from "@/components/ui";

export default function FaqSection() {
  return (
    <section id="faq" className="mx-auto max-w-6xl px-4 py-14">
      <SectionTitle kicker="FAQ" title="Quick answers." desc="Transparent limits and a clean experience — that’s the goal." />
      <div className="mt-10 grid gap-4 md:grid-cols-2">
        <FAQItem q="Is Converto free?" a="Yes. The free tier covers most quick conversions. Pro unlocks higher limits, batch conversion, and premium formats." />
        <FAQItem q="Do you store my files?" a="Mobile conversions (images/docs) are local. Online conversions will be auto-deleted shortly after completion." />
        <FAQItem q="Will you add an online video converter?" a="Yes. We’re building a server-side beta to avoid crashes on low-end phones. Strict limits and auto-deletion will apply." />
        <FAQItem q="Can I convert multiple files at once?" a="Batch conversion is planned for Pro. Free will focus on quick single-file tasks." />
        <FAQItem q="Will there be quality controls?" a="You’ll get simple presets (Small / Balanced / High). No overwhelming sliders." />
        <FAQItem q="When will Pro be available?" a="After we validate stability in beta. The plan is to keep pricing student-friendly and transparent." />
        <FAQItem q="Does it work offline?" a="For images & documents on mobile: yes (local). Online conversion requires internet." />
        <FAQItem q="What devices are supported?" a="Android first (Google Play). More platforms are on the roadmap once stability is locked." />
      </div>
    </section>
  );
}