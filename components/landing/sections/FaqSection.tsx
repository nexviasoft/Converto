"use client";

import React from "react";
import { FAQItem, SectionTitle } from "@/components/ui";
import { ANDROID_APP_PUBLIC, PRO_PUBLIC } from "@/lib/siteReadiness";

export default function FaqSection() {
  return (
    <section id="faq" className="mx-auto max-w-6xl px-4 py-14">
      <SectionTitle
        kicker="FAQ"
        title="Quick answers."
        desc="Clear limits, simple format choices, and a conversion flow users can understand before uploading."
      />

      <div className="mt-10 grid gap-4 md:grid-cols-2">
        <FAQItem
          q="Is Converto free to use?"
          a={
            PRO_PUBLIC
              ? "Yes. Converto includes a free converter for quick everyday file tasks. Free usage has practical limits, while Pro adds higher limits, batch workflows, and advanced export controls."
              : "Yes. Converto includes a free converter for quick everyday file tasks, with clear format support and practical file-size limits."
          }
        />

        <FAQItem
          q="Which file formats are supported?"
          a="Converto supports common audio, video, image, and PDF workflows. Audio routes include MP3, WAV, M4A, AAC, OGG, OPUS, FLAC, AIFF, WMA, and AMR. Video routes include MP4, WEBM, MOV, MKV, AVI, WMV, FLV, M4V, MPG, MPEG, and 3GP. Image routes include GIF, PNG, JPG, WEBP, BMP, TIFF, ICO, and AVIF."
        />

        <FAQItem
          q="Do you store my files?"
          a="Converto is built around temporary processing. Browser-based conversions stay in the browser where possible. Server-assisted conversions are intended to be short-lived and removed after processing."
        />

        <FAQItem
          q="Is Converto safe to use?"
          a="Converto is designed for everyday conversion tasks with clear limits, visible processing states, and privacy-focused copy. You should only upload files you have the right to process."
        />

        <FAQItem
          q="How large can uploaded files be?"
          a={
            PRO_PUBLIC
              ? "The free converter currently presents a 50MB limit for quick online conversions. Pro can provide higher limits for heavier workflows."
              : "The free converter currently presents a 50MB limit for quick online conversions."
          }
        />

        <FAQItem
          q="Can I convert multiple files at once?"
          a={
            PRO_PUBLIC
              ? "The site includes a batch conversion flow for supported routes. Pro can expand limits and provide a more comfortable multi-file workflow."
              : "The project includes a batch conversion flow for supported routes, while the main public experience focuses on reliable single-file conversions."
          }
        />

        <FAQItem
          q="Does Converto work on mobile devices?"
          a={
            ANDROID_APP_PUBLIC
              ? "Yes. The web converter works in modern mobile browsers, and a dedicated Android experience is also being prepared."
              : "Yes. The web converter is designed to work in modern mobile browsers, and the layout avoids relying on desktop-only controls."
          }
        />

        <FAQItem
          q="Why are there format guides and comparison pages?"
          a="They make the site more useful than a bare upload box. Users can compare file types, understand output choices, and then jump into the right conversion route."
        />
      </div>
    </section>
  );
}
