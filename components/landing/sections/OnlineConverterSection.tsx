"use client";

import React, { useEffect, useState } from "react";
import AdUnit, { AD_SLOTS } from "@/components/ads/AdUnit";

export default function OnlineConverterSection({
  showToast,
}: {
  showToast: (t: string, d?: string) => void;
}) {
  const [dummy] = useState(true);

  useEffect(() => {
    if (dummy) return;
    showToast("Converter", "Online converter section placeholder.");
  }, [dummy, showToast]);

  return (
    <section id="converter" className="mx-auto max-w-4xl px-4 py-20">
      <AdUnit slot={AD_SLOTS.IN_CONTENT} className="mt-6" />
    </section>
  );
}
