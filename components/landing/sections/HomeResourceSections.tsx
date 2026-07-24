"use client";

import Image from "next/image";
import Link from "next/link";
import React from "react";

const popularConversions = [
  { href: "/convert/mp4-to-mp3", label: "MP4 to MP3" },
  { href: "/convert/png-to-jpg", label: "PNG to JPG" },
  { href: "/convert/webp-to-png", label: "WEBP to PNG" },
  { href: "/convert/png-to-ico", label: "PNG to ICO" },
  { href: "/convert/jpg-to-png", label: "JPG to PNG" },
  { href: "/convert/mov-to-mp4", label: "MOV to MP4" },
  { href: "/convert/mp4-to-gif", label: "MP4 to GIF" },
  { href: "/convert/tiff-to-jpg", label: "TIFF to JPG" },
];

const formatChips = [
  { href: "/formats/mp4", label: "MP4 guide" },
  { href: "/formats/mp3", label: "MP3 guide" },
  { href: "/formats/webp", label: "WEBP guide" },
];

const compareChips = [
  { href: "/compare/mp4-vs-mkv", label: "MP4 vs MKV" },
  { href: "/compare/flac-vs-mp3", label: "FLAC vs MP3" },
  { href: "/compare/mp4-vs-mov", label: "MP4 vs MOV" },
  { href: "/compare/mp3-vs-wav", label: "MP3 vs WAV" },
];

function cx(...classes: Array<string | false | null | undefined>) {
  return classes.filter(Boolean).join(" ");
}

function SectionIcon({ src, alt }: { src: string; alt: string }) {
  return (
    <span className="grid h-6 w-6 place-items-center rounded-[10px] border border-violet-200/24 bg-violet-400/16 shadow-[0_0_24px_rgba(139,92,246,0.22)]">
      <Image src={src} alt={alt} width={16} height={16} className="h-4 w-4 object-contain" unoptimized />
    </span>
  );
}

function Kicker({
  children,
  iconSrc,
  iconAlt,
  tooltip,
}: {
  children: React.ReactNode;
  iconSrc: string;
  iconAlt: string;
  tooltip?: string;
}) {
  return (
    <div className="flex items-center gap-2 text-[11px] font-semibold uppercase tracking-[0.22em] text-white/56">
      <SectionIcon src={iconSrc} alt={iconAlt} />
      <span>{children}</span>
      {tooltip ? (
        <span className="group/tooltip relative -translate-y-[2px] inline-flex" tabIndex={0}>
          <span className="grid h-[18px] w-[18px] place-items-center rounded-full border border-violet-200/26 bg-violet-400/12 shadow-[0_0_18px_rgba(139,92,246,0.18)] transition group-hover/tooltip:border-violet-200/40 group-hover/tooltip:bg-violet-400/18 group-hover/tooltip:shadow-[0_0_22px_rgba(139,92,246,0.28)] group-focus/tooltip:border-violet-200/40 group-focus/tooltip:bg-violet-400/18 group-focus/tooltip:shadow-[0_0_22px_rgba(139,92,246,0.28)]">
            <svg width="10" height="10" viewBox="0 0 12 12" fill="none" aria-hidden="true" className="text-white/85">
              <path d="M4.85 4.25a1.48 1.48 0 0 1 2.84.56c0 .64-.34.97-.82 1.33-.43.32-.67.58-.67 1.07v.2" stroke="currentColor" strokeWidth="1.35" strokeLinecap="round" strokeLinejoin="round"/>
              <circle cx="6" cy="9.15" r=".72" fill="currentColor"/>
            </svg>
          </span>
          <span className="pointer-events-none absolute left-1/2 top-[calc(100%+10px)] z-20 w-56 -translate-x-1/2 rounded-2xl border border-white/10 bg-[#15113a]/95 px-3 py-2 text-[11px] font-medium normal-case leading-5 tracking-normal text-white/78 opacity-0 shadow-[0_20px_50px_rgba(0,0,0,0.45)] transition duration-200 group-hover/tooltip:translate-y-0 group-hover/tooltip:opacity-100 group-focus/tooltip:translate-y-0 group-focus/tooltip:opacity-100">
            {tooltip}
          </span>
        </span>
      ) : null}
    </div>
  );
}

function PillLink({ href, children, primary = false }: { href: string; children: React.ReactNode; primary?: boolean }) {
  return (
    <Link
      href={href}
      className={cx(
        "group inline-flex items-center gap-1 whitespace-nowrap rounded-full px-3 py-1.5 text-[11px] font-semibold transition duration-300 hover:-translate-y-0.5 sm:px-3.5 sm:text-[12px]",
        primary
          ? "bg-white text-black shadow-[0_12px_34px_rgba(255,255,255,0.14)] hover:bg-white/92 hover:shadow-[0_18px_44px_rgba(255,255,255,0.18)]"
          : "border border-white/10 bg-white/[0.075] text-white/82 hover:border-violet-200/30 hover:bg-violet-400/14 hover:text-white hover:shadow-[0_0_26px_rgba(139,92,246,0.20)]",
      )}
    >
      {children}
      {primary ? <span className="transition group-hover:translate-x-0.5">→</span> : null}
    </Link>
  );
}

function Visual({ src, alt, className = "", imageClassName = "" }: { src: string; alt: string; className?: string; imageClassName?: string }) {
  return (
    <div className={cx("pointer-events-none relative mx-auto hidden lg:block", className)}>
      <div className="absolute inset-6 rounded-full bg-violet-500/18 blur-3xl" />
      <Image
        src={src}
        alt={alt}
        width={920}
        height={920}
        className={cx("relative h-full w-full object-contain drop-shadow-[0_26px_70px_rgba(93,63,211,0.34)]", imageClassName)}
        unoptimized
      />
    </div>
  );
}

function HomeCard({
  kicker,
  kickerIconSrc,
  kickerIconAlt,
  kickerTooltip,
  title,
  desc,
  chips,
  primary,
  image,
  imageAlt,
}: {
  kicker: string;
  kickerIconSrc: string;
  kickerIconAlt: string;
  kickerTooltip: string;
  title: string;
  desc: string;
  chips: { href: string; label: string }[];
  primary: { href: string; label: string };
  image: string;
  imageAlt: string;
}) {
  return (
    <section className="group relative overflow-hidden rounded-[30px] border border-violet-300/16 bg-[#1f1b43]/70 p-5 shadow-[0_24px_90px_rgba(14,11,38,0.38)] backdrop-blur transition duration-300 hover:-translate-y-0.5 hover:border-violet-300/28 hover:bg-[#251f4f]/78 hover:shadow-[0_30px_100px_rgba(73,51,158,0.28)] sm:p-6">
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_82%_38%,rgba(139,92,246,0.24),transparent_26%),radial-gradient(circle_at_18%_0%,rgba(255,255,255,0.08),transparent_30%)] opacity-90" />
      <div className="pointer-events-none absolute inset-0 opacity-[0.18] [background-image:radial-gradient(rgba(255,255,255,0.45)_1px,transparent_1px)] [background-size:22px_22px]" />

      <div className="relative grid gap-4 lg:grid-cols-[minmax(0,1fr)_160px] lg:items-center xl:grid-cols-[minmax(0,1fr)_182px]">
        <div>
          <Kicker iconSrc={kickerIconSrc} iconAlt={kickerIconAlt} tooltip={kickerTooltip}>
            {kicker}
          </Kicker>
          <h2 className="mt-4 max-w-[14ch] text-[22px] font-semibold tracking-tight text-white sm:max-w-none sm:text-[26px] sm:leading-[1.16]">
            {title}
          </h2>
          <p className="mt-3 max-w-[58ch] text-[13px] leading-6 text-white/66 sm:text-sm">
            {desc}
          </p>

          <div className="mt-5 flex max-w-full flex-wrap gap-2">
            {chips.map((chip) => (
              <PillLink key={chip.href} href={chip.href}>
                {chip.label}
              </PillLink>
            ))}
            <PillLink href={primary.href} primary>
              {primary.label}
            </PillLink>
          </div>
        </div>

        <Visual src={image} alt={imageAlt} className="h-[146px] w-[146px] xl:h-[168px] xl:w-[168px]" />
      </div>
    </section>
  );
}

export default function HomeResourceSections() {
  return (
    <section className="mx-auto max-w-6xl px-4 pb-16 pt-12 sm:px-6 lg:px-8">
      <div className="grid gap-5 lg:grid-cols-2">
        <HomeCard
          kicker="Format guides"
          kickerIconSrc="/images/vnext/section-icons/format-guides.png"
          kickerIconAlt="Format guides icon"
          kickerTooltip="Practical explainers that help you understand what each format is best for before converting."
          title="Learn the formats before you convert"
          desc="Explore the most important audio and video formats, understand where they are used, and jump into in-depth conversion guides with practical examples."
          chips={formatChips}
          primary={{ href: "/formats", label: "Open format hub" }}
          image="/images/vnext/format-guides-visual.png"
          imageAlt="Purple format guide visual"
        />

        <HomeCard
          kicker="Compare formats"
          kickerIconSrc="/images/vnext/section-icons/compare-formats.png"
          kickerIconAlt="Compare formats icon"
          kickerTooltip="Side-by-side comparisons for popular formats based on quality, file size, compatibility, and use case."
          title="Compare formats before choosing an output"
          desc="Not sure which file type makes more sense? Compare popular audio and video formats by quality, file size, compatibility, and use cases."
          chips={compareChips}
          primary={{ href: "/compare", label: "Open compare hub" }}
          image="/images/vnext/compare-formats-visual.png"
          imageAlt="Purple format comparison visual"
        />
      </div>

      <section className="group relative mt-5 overflow-hidden rounded-[32px] border border-violet-300/16 bg-[#1f1b43]/70 p-6 shadow-[0_24px_90px_rgba(14,11,38,0.38)] backdrop-blur transition duration-300 hover:border-violet-300/28 hover:bg-[#251f4f]/78 sm:p-7 lg:p-8">
        <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_88%_12%,rgba(168,85,247,0.22),transparent_30%),radial-gradient(circle_at_10%_100%,rgba(59,130,246,0.12),transparent_34%)]" />
        <div className="pointer-events-none absolute inset-0 opacity-[0.16] [background-image:radial-gradient(rgba(255,255,255,0.45)_1px,transparent_1px)] [background-size:22px_22px]" />

        <div className="relative">
          <Kicker
            iconSrc="/images/vnext/section-icons/about-converto.png"
            iconAlt="Practical conversion guides icon"
            tooltip="Independent practical guides covering privacy, audio quality settings, and image compression choices."
          >
            Practical guides
          </Kicker>
          <div className="mt-4 grid gap-6 lg:grid-cols-[minmax(0,0.9fr)_minmax(0,1.1fr)] lg:items-start">
            <div>
              <h2 className="text-2xl font-semibold tracking-tight text-white sm:text-[28px]">Make better choices before you convert</h2>
              <p className="mt-4 max-w-[62ch] text-sm leading-7 text-white/66">Read clear, hand-written guides about file handling, audio bitrate and sample rate, and modern image compression. Each guide includes practical recommendations rather than generic format definitions.</p>
              <div className="mt-5"><PillLink href="/guides" primary>Open all guides</PillLink></div>
            </div>
            <div className="grid gap-3 sm:grid-cols-3">
              {[
                { href: "/guides/how-converto-handles-files", title: "How files are handled", desc: "Browser vs server processing and safer upload choices." },
                { href: "/guides/audio-bitrate-sample-rate", title: "Audio settings", desc: "Choose sensible bitrate and sample-rate values." },
                { href: "/guides/image-compression-formats", title: "Image compression", desc: "JPG, PNG, WEBP, and AVIF explained." },
              ].map((guide, index) => (
                <Link key={guide.href} href={guide.href} className="rounded-2xl border border-white/10 bg-white/[0.055] p-4 transition hover:-translate-y-0.5 hover:border-violet-200/25 hover:bg-violet-400/[0.10]">
                  <div className="text-xs font-semibold text-violet-200">0{index + 1}</div>
                  <div className="mt-3 text-sm font-semibold text-white">{guide.title}</div>
                  <div className="mt-2 text-xs leading-5 text-white/52">{guide.desc}</div>
                </Link>
              ))}
            </div>
          </div>
        </div>
      </section>

      <section className="group relative mt-5 overflow-hidden rounded-[32px] border border-violet-300/16 bg-[#1f1b43]/70 p-6 shadow-[0_24px_90px_rgba(14,11,38,0.38)] backdrop-blur transition duration-300 hover:border-violet-300/28 hover:bg-[#251f4f]/78 sm:p-7 lg:p-8">
        <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_82%_50%,rgba(139,92,246,0.24),transparent_28%),radial-gradient(circle_at_20%_100%,rgba(59,130,246,0.12),transparent_36%)]" />
        <div className="pointer-events-none absolute inset-0 opacity-[0.16] [background-image:radial-gradient(rgba(255,255,255,0.45)_1px,transparent_1px)] [background-size:22px_22px]" />

        <div className="relative grid gap-6 lg:grid-cols-[minmax(0,1fr)_250px] lg:items-center xl:grid-cols-[minmax(0,1fr)_280px]">
          <div>
            <Kicker
              iconSrc="/images/vnext/section-icons/popular-conversions.png"
              iconAlt="Popular conversions icon"
              tooltip="Quick shortcuts to the conversion routes people use most often in everyday workflows."
            >
              Popular conversion pairs
            </Kicker>
            <h2 className="mt-4 text-2xl font-semibold tracking-tight text-white sm:text-[28px]">
              Start with the most common format conversions
            </h2>
            <p className="mt-4 max-w-[68ch] text-sm leading-7 text-white/66">
              Converto helps you move between the formats you use every day: MP4 to MP3, FLAC to MP3, MOV to MP4, and other everyday converter combinations.
            </p>

            <div className="mt-5 flex max-w-[720px] flex-wrap gap-2">
              {popularConversions.map((item) => (
                <PillLink key={item.href} href={item.href}>
                  {item.label}
                </PillLink>
              ))}
              <PillLink href="/formats" primary>
                Explore all format pairs
              </PillLink>
              <PillLink href="/compare">Compare formats</PillLink>
            </div>
          </div>

          <Visual
            src="/images/vnext/home-popular-conversions-visual.png"
            alt="Purple multi-format conversion visual"
            className="h-[240px] w-[240px] xl:h-[280px] xl:w-[280px]"
          />
        </div>
      </section>

      <section className="group relative mt-5 overflow-hidden rounded-[32px] border border-violet-300/16 bg-[#1f1b43]/70 p-6 shadow-[0_24px_90px_rgba(14,11,38,0.38)] backdrop-blur transition duration-300 hover:border-violet-300/28 hover:bg-[#251f4f]/78 sm:p-7 lg:p-8">
        <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_82%_48%,rgba(139,92,246,0.22),transparent_28%),radial-gradient(circle_at_16%_100%,rgba(59,130,246,0.12),transparent_36%)]" />
        <div className="pointer-events-none absolute inset-0 opacity-[0.16] [background-image:radial-gradient(rgba(255,255,255,0.45)_1px,transparent_1px)] [background-size:22px_22px]" />

        <div className="relative grid gap-6 lg:grid-cols-[minmax(0,1fr)_300px] lg:items-center xl:grid-cols-[minmax(0,1fr)_340px]">
          <div>
            <Kicker
              iconSrc="/images/vnext/section-icons/about-converto.png"
              iconAlt="About Converto icon"
              tooltip="A short overview of what Converto offers and how it keeps online conversions simple."
            >
              About Converto
            </Kicker>
            <h2 className="mt-4 text-2xl font-semibold tracking-tight text-white sm:text-[28px]">
              Free online file converter for audio, video, and image formats
            </h2>
            <p className="mt-4 max-w-[68ch] text-sm leading-7 text-white/66">
              Converto is a browser-based file converter built for speed, privacy, and ease of use. Convert your files online with no software to install, with a clean workflow and reliable results for everyday formats.
            </p>
            <p className="mt-4 max-w-[68ch] text-sm leading-7 text-white/62">
              Regularly updated to improve format support, performance, and clarity. Converto is free for everyday conversions with limits shown before you upload.
            </p>
          </div>

          <Visual
            src="/images/vnext/home-about-visual.png"
            alt="Purple cloud, shield and media visual"
            className="h-[240px] w-[240px] xl:h-[280px] xl:w-[280px]"
          />
        </div>
      </section>
    </section>
  );
}
