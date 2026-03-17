"use client";

import React from "react";
import { FAQItem, SectionTitle } from "@/components/ui";

export default function FaqSection() {
  return (
    <section id="faq" className="mx-auto max-w-6xl px-4 py-14">
      <SectionTitle
        kicker="FAQ"
        title="Quick answers."
        desc="Transparent limits and a clean experience — that’s the goal."
      />

      <div className="mt-10 grid gap-4 md:grid-cols-2">

        <FAQItem
          q="Is Converto free to use?"
          a="Yes. Converto offers a free plan designed for quick conversions. You can convert common file formats without creating an account. The Pro version will unlock higher limits, batch conversion, and additional features."
        />

        <FAQItem
          q="Which file formats are supported?"
          a="Converto supports a wide range of formats including audio, video, and images.

Audio: MP3, WAV, M4A, AAC, OGG, OPUS, FLAC, AIFF, WMA, AMR

Video: MP4, WEBM, MOV, MKV, AVI, WMV, FLV, M4V, MPG, MPEG, 3GP

Images: GIF, PNG, JPG, WEBP, BMP, TIFF, ICO, AVIF"
        />

        <FAQItem
          q="Do you store my files?"
          a="No. Most conversions run directly in your browser. If a server conversion is required, files are automatically deleted shortly after the process finishes."
        />

        <FAQItem
          q="Is Converto safe to use?"
          a="Yes. Converto is designed with privacy in mind. Files are processed locally whenever possible and temporary server files are automatically deleted."
        />

        <FAQItem
          q="How large can uploaded files be?"
          a="The free version currently supports files up to 50MB. Higher limits will be available with Converto Pro."
        />

        <FAQItem
          q="Can I convert multiple files at once?"
          a="Batch conversion is planned for the Pro version. The free version focuses on quick single-file conversions."
        />

        <FAQItem
          q="Does Converto work on mobile devices?"
          a="Yes. Converto works in modern mobile browsers. A dedicated mobile app is also planned for the future."
        />

        <FAQItem
          q="When will Converto Pro be available?"
          a="Pro features will launch after the beta phase is stable. The goal is to keep pricing simple, transparent, and student-friendly."
        />

      </div>
    </section>
  );
}