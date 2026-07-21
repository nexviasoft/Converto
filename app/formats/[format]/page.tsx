import type { Metadata } from "next";
import Link from "next/link";
import Image from "next/image";
import { notFound } from "next/navigation";
import SimpleTopBar from "@/components/layout/SimpleTopBar";
import Footer from "@/components/landing/Footer";
import AdsterraBanner728x90 from "@/components/ads/AdsterraBanner728x90";
import AdsterraBanner320x50 from "@/components/ads/AdsterraBanner320x50";
import AdsterraBanner300x250 from "@/components/ads/AdsterraBanner300x250";
import { formatData, allFormats } from "@/lib/formatData";

type PageProps = {
  params: Promise<{
    format: string;
  }>;
};

const siteUrl =
  process.env.NEXT_PUBLIC_SITE_URL?.replace(/\/$/, "") ||
  "https://www.converto.tools";

const cx = (...c: Array<string | false | null | undefined>) =>
  c.filter(Boolean).join(" ");

export function generateStaticParams() {
  return allFormats.map((item) => ({
    format: item.slug,
  }));
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const resolvedParams = await params;
  const data = formatData[resolvedParams.format];

  if (!data) {
    return {
      title: "Format not found | Converto",
      description: "The requested format page does not exist.",
      robots: {
        index: false,
        follow: false,
      },
    };
  }

  return {
    title: `${data.metaTitle} | Converto`,
    description: data.metaDescription,
    alternates: {
      canonical: `${siteUrl}/formats/${data.slug}`,
    },
    openGraph: {
      title: `${data.metaTitle} | Converto`,
      description: data.metaDescription,
      url: `${siteUrl}/formats/${data.slug}`,
      siteName: "Converto",
      type: "article",
    },
    twitter: {
      card: "summary_large_image",
      title: `${data.metaTitle} | Converto`,
      description: data.metaDescription,
    },
  };
}

function categoryText(category: string) {
  if (category === "audio") return "Audio format";
  if (category === "video") return "Video format";
  return "Image format";
}

function SectionLabel({ children }: { children: React.ReactNode }) {
  return (
    <div className="text-[11px] font-semibold uppercase tracking-[0.22em] text-white/45">
      {children}
    </div>
  );
}

function GlassCard({
  children,
  className = "",
}: {
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <div
      className={cx(
        "rounded-[28px] border border-violet-300/18 bg-[#272151]/66 shadow-[0_24px_80px_rgba(20,16,48,0.34)] transform-gpu transition duration-300 hover:border-violet-300/34 hover:shadow-[0_0_0_1px_rgba(139,92,246,0.18),0_28px_90px_rgba(75,60,160,0.30)]",
        className,
      )}
    >
      {children}
    </div>
  );
}

function Pill({ children }: { children: React.ReactNode }) {
  return (
    <span className="rounded-full border border-violet-200/14 bg-white/10 px-4 py-2 text-sm text-white/82 shadow-[inset_0_1px_0_rgba(255,255,255,0.08)] transition hover:border-violet-200/28 hover:bg-violet-400/14 hover:shadow-[0_0_22px_rgba(139,92,246,0.20)]">
      {children}
    </span>
  );
}

function SoftListItem({ children }: { children: React.ReactNode }) {
  return (
    <li className="rounded-[22px] border border-violet-200/14 bg-white/[0.075] px-4 py-3 text-sm leading-6 text-white/72 shadow-[inset_0_1px_0_rgba(255,255,255,0.06)] transition duration-300 hover:border-violet-300/28 hover:bg-violet-400/12 hover:text-white hover:shadow-[0_0_24px_rgba(139,92,246,0.16)]">
      {children}
    </li>
  );
}

type InfoTileAccent = "violet" | "fuchsia" | "sky" | "emerald";

const infoTileAccentStyles: Record<
  InfoTileAccent,
  { icon: string; glow: string; line: string; number: string }
> = {
  violet: {
    icon: "border-violet-200/20 bg-violet-400/14 text-violet-100 shadow-[0_0_24px_rgba(139,92,246,0.18)]",
    glow: "bg-violet-400/18",
    line: "via-violet-300/75",
    number: "text-violet-200/55",
  },
  fuchsia: {
    icon: "border-fuchsia-200/20 bg-fuchsia-400/12 text-fuchsia-100 shadow-[0_0_24px_rgba(217,70,239,0.16)]",
    glow: "bg-fuchsia-400/16",
    line: "via-fuchsia-300/70",
    number: "text-fuchsia-200/50",
  },
  sky: {
    icon: "border-sky-200/20 bg-sky-400/12 text-sky-100 shadow-[0_0_24px_rgba(56,189,248,0.16)]",
    glow: "bg-sky-400/16",
    line: "via-sky-300/70",
    number: "text-sky-200/50",
  },
  emerald: {
    icon: "border-emerald-200/20 bg-emerald-400/12 text-emerald-100 shadow-[0_0_24px_rgba(52,211,153,0.16)]",
    glow: "bg-emerald-400/14",
    line: "via-emerald-300/65",
    number: "text-emerald-200/50",
  },
};

function InfoTile({
  title,
  desc,
  icon,
  accent,
  number,
}: {
  title: string;
  desc: React.ReactNode;
  icon: React.ReactNode;
  accent: InfoTileAccent;
  number: string;
}) {
  const style = infoTileAccentStyles[accent];

  return (
    <div className="group relative min-h-[154px] overflow-hidden rounded-[24px] border border-violet-200/14 bg-[linear-gradient(145deg,rgba(50,42,101,0.84),rgba(34,29,75,0.76))] p-5 shadow-[inset_0_1px_0_rgba(255,255,255,0.07),0_16px_42px_rgba(13,10,35,0.16)] transition duration-300 hover:-translate-y-1 hover:border-violet-200/30 hover:bg-[linear-gradient(145deg,rgba(58,48,119,0.90),rgba(39,32,86,0.84))] hover:shadow-[inset_0_1px_0_rgba(255,255,255,0.09),0_22px_50px_rgba(36,24,87,0.28)]">
      <div
        className={cx(
          "pointer-events-none absolute inset-x-8 top-0 h-px bg-gradient-to-r from-transparent to-transparent opacity-90",
          style.line,
        )}
      />
      <div
        className={cx(
          "pointer-events-none absolute -right-10 -top-12 h-32 w-32 rounded-full opacity-70 blur-3xl transition duration-300 group-hover:opacity-100",
          style.glow,
        )}
      />

      <div className="relative flex h-full flex-col">
        <div className="flex items-start justify-between gap-4">
          <span
            className={cx(
              "grid h-10 w-10 shrink-0 place-items-center rounded-[14px] border",
              style.icon,
            )}
          >
            {icon}
          </span>
          <span
            className={cx(
              "pt-1 text-[10px] font-semibold tracking-[0.24em]",
              style.number,
            )}
            aria-hidden="true"
          >
            {number}
          </span>
        </div>

        <div className="mt-5 text-[10px] font-semibold uppercase tracking-[0.20em] text-white/45">
          {title}
        </div>
        <div className="mt-2 text-sm font-medium leading-6 text-white/80">
          {desc}
        </div>
      </div>
    </div>
  );
}

function LinkPill({
  href,
  children,
  primary = false,
}: {
  href: string;
  children: React.ReactNode;
  primary?: boolean;
}) {
  return (
    <Link
      href={href}
      className={cx(
        "inline-flex rounded-full px-5 py-3 text-sm font-semibold transition duration-300 hover:-translate-y-0.5",
        primary
          ? "bg-gradient-to-r from-violet-500 to-blue-500 text-white shadow-[0_14px_34px_rgba(99,102,241,0.28)] hover:shadow-[0_0_36px_rgba(139,92,246,0.42)]"
          : "border border-violet-200/14 bg-white/9 text-white/85 hover:border-violet-200/34 hover:bg-violet-400/16 hover:text-white hover:shadow-[0_0_26px_rgba(139,92,246,0.24)]",
      )}
    >
      {children}
    </Link>
  );
}

function FormatGlyph({ category, className = "h-7 w-7" }: { category: string; className?: string }) {
  if (category === "audio") {
    return (
      <svg viewBox="0 0 24 24" className={className} fill="none" aria-hidden="true">
        <path d="M9 18.5a3 3 0 1 1-2-2.83V6.6c0-.72.5-1.34 1.2-1.5l8.3-1.84A1.5 1.5 0 0 1 18.32 4.7v10.8a3 3 0 1 1-2-2.83V7.06L9 8.68v9.82Z" fill="currentColor" />
      </svg>
    );
  }

  if (category === "image") {
    return (
      <svg viewBox="0 0 24 24" className={className} fill="none" aria-hidden="true">
        <path d="M5.75 4h12.5A2.75 2.75 0 0 1 21 6.75v10.5A2.75 2.75 0 0 1 18.25 20H5.75A2.75 2.75 0 0 1 3 17.25V6.75A2.75 2.75 0 0 1 5.75 4Zm0 2A.75.75 0 0 0 5 6.75v8.75l3.44-3.45a1.5 1.5 0 0 1 2.12 0l2.2 2.2.72-.72a1.5 1.5 0 0 1 2.12 0L19 16.93V6.75a.75.75 0 0 0-.75-.75H5.75Zm9.75 5a1.5 1.5 0 1 1 0-3 1.5 1.5 0 0 1 0 3Z" fill="currentColor" />
      </svg>
    );
  }

  return (
    <svg viewBox="0 0 24 24" className={className} fill="none" aria-hidden="true">
      <path d="M7.5 5.6v12.8c0 1.18 1.3 1.9 2.3 1.26l9.95-6.4a1.5 1.5 0 0 0 0-2.52L9.8 4.34C8.8 3.7 7.5 4.42 7.5 5.6ZM4 7.25a1.25 1.25 0 1 1 2.5 0v9.5a1.25 1.25 0 1 1-2.5 0v-9.5Z" fill="currentColor" />
    </svg>
  );
}

function FeatureIcon({
  kind,
  className = "h-5 w-5",
}: {
  kind:
    | "check"
    | "spark"
    | "screen"
    | "crop"
    | "pen"
    | "transparency"
    | "globe-image"
    | "share-image"
    | "layers"
    | "headphones"
    | "waveform"
    | "archive";
  className?: string;
}) {
  const shared = {
    fill: "none",
    stroke: "currentColor",
    strokeWidth: 1.9,
    strokeLinecap: "round" as const,
    strokeLinejoin: "round" as const,
  };

  if (kind === "check") {
    return (
      <svg viewBox="0 0 24 24" className={className} aria-hidden="true">
        <rect x="4.5" y="4.5" width="15" height="15" rx="4" {...shared} />
        <path {...shared} d="m8.5 12.2 2.2 2.3 4.8-5" />
      </svg>
    );
  }

  if (kind === "spark") {
    return (
      <svg viewBox="0 0 24 24" className={className} aria-hidden="true">
        <path {...shared} d="m12 4.8 1.5 3.7 3.7 1.5-3.7 1.5-1.5 3.7-1.5-3.7-3.7-1.5 3.7-1.5L12 4.8Z" />
        <path {...shared} d="m18 4.8.7 1.6 1.6.7-1.6.7-.7 1.6-.7-1.6-1.6-.7 1.6-.7.7-1.6Z" />
      </svg>
    );
  }

  if (kind === "headphones") {
    return (
      <svg viewBox="0 0 24 24" className={className} aria-hidden="true">
        <path {...shared} d="M5 13v-1a7 7 0 0 1 14 0v1" />
        <path {...shared} d="M5 13h2.2a1.8 1.8 0 0 1 1.8 1.8v3.4A1.8 1.8 0 0 1 7.2 20H6.8A1.8 1.8 0 0 1 5 18.2V13Z" />
        <path {...shared} d="M19 13h-2.2a1.8 1.8 0 0 0-1.8 1.8v3.4a1.8 1.8 0 0 0 1.8 1.8h.4a1.8 1.8 0 0 0 1.8-1.8V13Z" />
      </svg>
    );
  }

  if (kind === "waveform") {
    return (
      <svg viewBox="0 0 24 24" className={className} aria-hidden="true">
        <path {...shared} d="M4 12h2l1.5-5 3 10 3-12 2.5 9 1.5-4 1.5 2h1" />
      </svg>
    );
  }

  if (kind === "archive") {
    return (
      <svg viewBox="0 0 24 24" className={className} aria-hidden="true">
        <rect x="4" y="5" width="16" height="4" rx="1.5" {...shared} />
        <path {...shared} d="M6 9v9.5A1.5 1.5 0 0 0 7.5 20h9a1.5 1.5 0 0 0 1.5-1.5V9" />
        <path {...shared} d="M9.5 13h5" />
      </svg>
    );
  }

  if (kind === "screen") {
    return (
      <svg viewBox="0 0 24 24" className={className} aria-hidden="true">
        <rect x="4" y="5" width="16" height="12" rx="2.5" {...shared} />
        <path {...shared} d="M9 19h6" />
      </svg>
    );
  }

  if (kind === "crop") {
    return (
      <svg viewBox="0 0 24 24" className={className} aria-hidden="true">
        <path {...shared} d="M8 4v12a2 2 0 0 0 2 2h10" />
        <path {...shared} d="M4 8h12a2 2 0 0 1 2 2v10" />
      </svg>
    );
  }

  if (kind === "pen") {
    return (
      <svg viewBox="0 0 24 24" className={className} aria-hidden="true">
        <path {...shared} d="m14.5 5.5 4 4" />
        <path {...shared} d="M5 19l3.6-.6L18.5 8.5a1.8 1.8 0 0 0 0-2.5l-.5-.5a1.8 1.8 0 0 0-2.5 0L5.6 15.4 5 19Z" />
      </svg>
    );
  }

  if (kind === "transparency") {
    return (
      <svg viewBox="0 0 24 24" className={className} aria-hidden="true">
        <path {...shared} d="M5 5h14v14H5z" />
        <path {...shared} d="M5 12h14M12 5v14" />
        <path {...shared} d="M5 5l14 14M19 5 5 19" />
      </svg>
    );
  }

  if (kind === "globe-image") {
    return (
      <svg viewBox="0 0 24 24" className={className} aria-hidden="true">
        <circle cx="10" cy="10" r="6.5" {...shared} />
        <path {...shared} d="M3.5 10h13M10 3.5c1.8 1.8 2.8 4.1 2.8 6.5S11.8 14.7 10 16.5M10 3.5C8.2 5.3 7.2 7.6 7.2 10s1 4.7 2.8 6.5" />
        <rect x="13.5" y="13.5" width="7" height="5.5" rx="1.3" {...shared} />
        <path {...shared} d="m14.7 17 1.7-1.8 1.6 1.5 1.4-1.4 1.1 1.7" />
      </svg>
    );
  }

  if (kind === "share-image") {
    return (
      <svg viewBox="0 0 24 24" className={className} aria-hidden="true">
        <rect x="4" y="5" width="11" height="9" rx="2" {...shared} />
        <path {...shared} d="m5.5 12.2 2.6-2.6 2.3 2.3 2-2 1.1 1.5" />
        <circle cx="11.8" cy="8.2" r="1.1" fill="currentColor" />
        <circle cx="18.5" cy="8" r="1.4" {...shared} />
        <circle cx="19.5" cy="15.5" r="1.4" {...shared} />
        <circle cx="15.8" cy="17.8" r="1.4" {...shared} />
        <path {...shared} d="m17.2 8.8-1 7.6m2.2-6 1.1 3.8m-2.7 2.7 1.7-.6" />
      </svg>
    );
  }

  return (
    <svg viewBox="0 0 24 24" className={className} aria-hidden="true">
      <path {...shared} d="m12 5 7 4-7 4-7-4 7-4Z" />
      <path {...shared} d="m5 12 7 4 7-4" />
      <path {...shared} d="m5 15 7 4 7-4" />
    </svg>
  );
}

function FeatureRow({
  text,
  icon,
}: {
  text: string;
  icon: React.ReactNode;
}) {
  return (
    <div className="flex items-center gap-4 rounded-[18px] border border-violet-200/14 bg-[#2b2558]/70 px-4 py-3 shadow-[inset_0_1px_0_rgba(255,255,255,0.05)] transition duration-300 hover:border-violet-300/28 hover:bg-[#332b68]/74 hover:shadow-[0_0_24px_rgba(139,92,246,0.16)]">
      <div className="grid h-12 w-12 shrink-0 place-items-center rounded-[14px] border border-violet-200/16 bg-[radial-gradient(circle_at_top,rgba(167,139,250,0.20),transparent_72%),rgba(255,255,255,0.04)] text-violet-100 shadow-[inset_0_1px_0_rgba(255,255,255,0.07)]">
        {icon}
      </div>
      <div className="text-sm font-medium leading-6 text-white/82">{text}</div>
    </div>
  );
}

function SettingsBadge({ children }: { children: React.ReactNode }) {
  return (
    <span className="rounded-full border border-violet-300/16 bg-violet-400/14 px-3 py-1 text-xs font-semibold uppercase tracking-[0.08em] text-violet-100/78 shadow-[inset_0_1px_0_rgba(255,255,255,0.05)]">
      {children}
    </span>
  );
}

function SettingsRow({
  title,
  desc,
  iconKind,
  badge,
}: {
  title: string;
  desc: string;
  iconKind: Parameters<typeof FeatureIcon>[0]["kind"];
  badge: string;
}) {
  return (
    <div className="group relative overflow-hidden rounded-[22px] border border-violet-300/18 bg-[#2a2458]/72 p-4 shadow-[inset_0_1px_0_rgba(255,255,255,0.05)] transition duration-300 hover:-translate-y-0.5 hover:border-violet-300/30 hover:bg-[#312a64]/76 hover:shadow-[0_0_30px_rgba(139,92,246,0.16)] sm:p-5">
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_top_right,rgba(139,92,246,0.12),transparent_28%)] opacity-90" />
      <div className="relative flex items-center gap-4">
        <div className="grid h-[72px] w-[72px] shrink-0 place-items-center rounded-[18px] border border-violet-300/22 bg-[radial-gradient(circle_at_top,rgba(167,139,250,0.22),transparent_72%),rgba(255,255,255,0.04)] text-violet-100 shadow-[inset_0_1px_0_rgba(255,255,255,0.07),0_0_24px_rgba(139,92,246,0.14)]">
          <FeatureIcon kind={iconKind} className="h-9 w-9" />
        </div>
        <div className="min-w-0 flex-1">
          <div className="flex items-start justify-between gap-4">
            <div>
              <div className="text-xl font-semibold tracking-tight text-white">{title}</div>
              <div className="mt-2 text-sm leading-6 text-white/68 sm:text-[15px]">{desc}</div>
            </div>
            <div className="hidden shrink-0 sm:block">
              <SettingsBadge>{badge}</SettingsBadge>
            </div>
          </div>
          <div className="mt-3 flex items-center justify-between sm:hidden">
            <SettingsBadge>{badge}</SettingsBadge>
          </div>
        </div>
      </div>
    </div>
  );
}

function settingVisualMeta(label: string) {
  const value = label.toLowerCase();
  if (value.includes("archive")) {
    return { icon: "archive" as const, badge: "Preserve" };
  }
  if (value.includes("transparen")) {
    return { icon: "transparency" as const, badge: "Preserve" };
  }
  if (value.includes("edit") || value.includes("production")) {
    return { icon: "layers" as const, badge: "Create" };
  }
  if (value.includes("photo") || value.includes("share") || value.includes("sharing")) {
    return { icon: "share-image" as const, badge: "Share" };
  }
  if (value.includes("static extraction")) {
    return { icon: "screen" as const, badge: "Extract" };
  }
  if (value.includes("short") || value.includes("loop")) {
    return { icon: "crop" as const, badge: "Loop" };
  }
  if (value.includes("further optimization")) {
    return { icon: "spark" as const, badge: "Refine" };
  }
  if (value.includes("website") || value.includes("browser") || value.includes("web optimization") || value.includes("web efficiency") || value.includes("smaller")) {
    return { icon: "globe-image" as const, badge: "Optimize" };
  }
  if (value.includes("compatibility") || value.includes("playback support")) {
    return { icon: "screen" as const, badge: "Compatible" };
  }
  if (value.includes("quality") || value.includes("lossless")) {
    return { icon: "waveform" as const, badge: "Quality" };
  }
  if (value.includes("casual") || value.includes("listen") || value.includes("spoken") || value.includes("mobile playback") || value.includes("audio extraction") || value.includes("apple-friendly playback")) {
    return { icon: "headphones" as const, badge: "Listen" };
  }
  return { icon: "spark" as const, badge: "Use" };
}

function whyUseIcon(index: number) {
  const icons = ["check", "check", "check"] as const;
  return icons[index] ?? "check";
}

function bestForIcon(index: number) {
  const icons = ["spark", "screen", "pen"] as const;
  return icons[index] ?? "spark";
}

function FormatMark({
  category,
  label,
  convertHref,
}: {
  category: string;
  label: string;
  convertHref: string;
}) {
  const initials = label.slice(0, 4).toUpperCase();
  const typeLabel = categoryText(category);

  return (
    <div className="hidden shrink-0 lg:block lg:justify-self-end lg:pr-3 xl:pr-5">
      <div className="relative w-[286px] rounded-[34px] xl:w-[300px] border border-white/14 bg-white/[0.085] p-4 shadow-[0_30px_90px_rgba(0,0,0,0.30),inset_0_1px_0_rgba(255,255,255,0.08)] backdrop-blur">
        <div className="pointer-events-none absolute -inset-10 rounded-full bg-violet-400/18 blur-3xl" />
        <div className="pointer-events-none absolute -bottom-8 right-6 h-24 w-24 rounded-full bg-blue-400/16 blur-2xl" />

        <div className="relative flex items-center justify-between gap-3">
          <span className="rounded-full border border-white/10 bg-white/10 px-3 py-1 text-[11px] font-semibold uppercase tracking-[0.16em] text-white/52">
            {category}
          </span>
          <span className="rounded-full bg-emerald-400/14 px-3 py-1 text-[11px] font-semibold text-emerald-200">
            supported
          </span>
        </div>

        <div className="relative mt-5 rounded-[28px] border border-white/12 bg-[#221c49]/82 p-6 text-center shadow-[inset_0_1px_0_rgba(255,255,255,0.06)]">
          <div className="pointer-events-none absolute inset-x-8 top-6 h-20 rounded-full bg-white/5 blur-2xl" />
          <div className="relative mx-auto grid h-16 w-16 place-items-center rounded-2xl bg-white text-black shadow-[0_14px_34px_rgba(255,255,255,0.15)]">
            <FormatGlyph category={category} />
          </div>
          <div className="relative mt-4 text-4xl font-black tracking-tight text-white">
            {initials}
          </div>
          <div className="relative mt-2 text-[11px] font-semibold uppercase tracking-[0.18em] text-white/42">
            {typeLabel}
          </div>
        </div>

        <div className="relative mt-4 grid grid-cols-2 gap-2 text-xs font-semibold">
          <Link
            href="#format-guide"
            className="rounded-full border border-white/10 bg-white/[0.075] px-3 py-2 text-center text-white/68 transition hover:border-violet-200/30 hover:bg-violet-400/14 hover:text-white"
          >
            Guide
          </Link>
          <Link
            href={convertHref}
            className="rounded-full border border-violet-200/24 bg-gradient-to-r from-violet-500/85 to-blue-500/85 px-3 py-2 text-center text-white shadow-[0_10px_26px_rgba(99,102,241,0.24)] transition hover:-translate-y-0.5 hover:shadow-[0_0_28px_rgba(139,92,246,0.34)]"
          >
            Convert
          </Link>
        </div>
      </div>
    </div>
  );
}

export default async function FormatDetailPage({ params }: PageProps) {
  const resolvedParams = await params;
  const data = formatData[resolvedParams.format];

  if (!data) notFound();

  const PAGE_MAX = "max-w-[1320px]";
  const CENTER_MAX = "max-w-[1240px]";

  const faqSchema =
    data.faq && data.faq.length > 0
      ? {
          "@context": "https://schema.org",
          "@type": "FAQPage",
          mainEntity: data.faq.map((item) => ({
            "@type": "Question",
            name: item.question,
            acceptedAnswer: {
              "@type": "Answer",
              text: item.answer,
            },
          })),
        }
      : null;

  const compareSchema = data.formatComparison
    ? {
        "@context": "https://schema.org",
        "@type": "Article",
        headline: `${data.label} format guide`,
        description: data.metaDescription,
        mainEntityOfPage: `${siteUrl}/formats/${data.slug}`,
        author: {
          "@type": "Organization",
          name: "NexviaSoft",
        },
        publisher: {
          "@type": "Organization",
          name: "NexviaSoft",
          url: siteUrl,
        },
      }
    : null;

  const breadcrumbSchema = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: [
      {
        "@type": "ListItem",
        position: 1,
        name: "Home",
        item: siteUrl,
      },
      {
        "@type": "ListItem",
        position: 2,
        name: "Formats",
        item: `${siteUrl}/formats`,
      },
      {
        "@type": "ListItem",
        position: 3,
        name: data.label,
        item: `${siteUrl}/formats/${data.slug}`,
      },
    ],
  };

  return (
    <>
      <SimpleTopBar shellMax={PAGE_MAX} />

      <main className="relative isolate min-h-screen overflow-x-hidden bg-[#181337] bg-[radial-gradient(ellipse_at_top_left,rgba(139,92,246,0.22),transparent_52%),radial-gradient(ellipse_at_bottom_right,rgba(59,130,246,0.22),transparent_48%)] pt-4 text-white selection:bg-violet-300/25">
        {faqSchema ? (
          <script
            type="application/ld+json"
            dangerouslySetInnerHTML={{ __html: JSON.stringify(faqSchema) }}
          />
        ) : null}

        {compareSchema ? (
          <script
            type="application/ld+json"
            dangerouslySetInnerHTML={{ __html: JSON.stringify(compareSchema) }}
          />
        ) : null}

        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbSchema) }}
        />

        <div className="pointer-events-none fixed inset-0 z-0 overflow-hidden">
          <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top_left,rgba(139,92,246,0.22),transparent_52%),radial-gradient(ellipse_at_bottom_right,rgba(59,130,246,0.22),transparent_48%),radial-gradient(ellipse_at_center,rgba(255,255,255,0.05),transparent_46%)]" />
          <div className="absolute inset-0 opacity-[0.14] [background:linear-gradient(to_right,rgba(255,255,255,0.04)_1px,transparent_1px),linear-gradient(to_bottom,rgba(255,255,255,0.04)_1px,transparent_1px)] [background-size:72px_72px]" />
        </div>

        <div
          className={cx(
            "relative z-10 mx-auto px-4 py-10 sm:px-6 lg:px-8 lg:py-14",
            PAGE_MAX,
          )}
        >
          <div className={cx("mx-auto w-full", CENTER_MAX)}>
            <nav
              aria-label="Breadcrumb"
              className="mb-4 flex flex-wrap items-center gap-2 px-1 text-xs text-white/45"
            >
              <Link href="/" className="transition hover:text-white/80">
                Home
              </Link>
              <span aria-hidden="true" className="text-white/25">/</span>
              <Link href="/formats" className="transition hover:text-white/80">
                Formats
              </Link>
              <span aria-hidden="true" className="text-white/25">/</span>
              <span className="text-white/68" aria-current="page">
                {data.label}
              </span>
            </nav>

            <section className="relative overflow-hidden rounded-[34px] border border-violet-300/18 bg-[#282151]/68 px-6 py-8 shadow-[0_32px_110px_rgba(18,14,45,0.38)] sm:px-8 sm:py-10 lg:px-10 lg:py-12">
              <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_top_right,rgba(139,92,246,0.24),transparent_26%),radial-gradient(circle_at_bottom_left,rgba(59,130,246,0.20),transparent_34%),linear-gradient(135deg,rgba(255,255,255,0.06),transparent_45%)]" />
              <div className="pointer-events-none absolute -right-20 -top-20 h-56 w-56 rounded-full bg-violet-400/22 blur-3xl" />
              <div className="pointer-events-none absolute -bottom-24 -left-20 h-56 w-56 rounded-full bg-blue-400/16 blur-3xl" />

              <div className="relative grid gap-8 lg:grid-cols-[minmax(0,1fr)_300px] lg:items-start">
                <div className="min-w-0">
                  <SectionLabel>{categoryText(data.category)}</SectionLabel>

                  <h1 className="mt-4 max-w-4xl text-4xl font-bold tracking-tight text-white sm:text-5xl lg:text-6xl">
                    {data.title}
                  </h1>

                  <p className="mt-5 max-w-3xl text-sm leading-7 text-white/72 sm:text-base">
                    {data.intro}
                  </p>

                  <div className="mt-6 flex flex-wrap gap-3">
                    <Pill>Practical format guide</Pill>
                    <Pill>Common conversions</Pill>
                    <Pill>Comparison-ready</Pill>
                  </div>

                  <div className="mt-8 flex flex-wrap gap-3">
                    <LinkPill href="/formats" primary>
                      Back to formats
                    </LinkPill>

                    <LinkPill href="/converter">Open Converter</LinkPill>

                    {data.commonConversions[0] ? (
                      <LinkPill href={data.commonConversions[0].href}>
                        Try {data.commonConversions[0].label}
                      </LinkPill>
                    ) : null}
                  </div>
                </div>

                <FormatMark
                  category={data.category}
                  label={data.label}
                  convertHref={data.commonConversions[0]?.href || "/converter"}
                />
              </div>
            </section>

            <AdsterraBanner728x90 className="mt-6" />
            <AdsterraBanner320x50 className="mt-6" />

            <section id="format-guide" className="mt-10 scroll-mt-24">
              <GlassCard className="relative overflow-hidden p-5 sm:p-7">
                <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_top_left,rgba(139,92,246,0.13),transparent_30%),radial-gradient(circle_at_bottom_right,rgba(59,130,246,0.10),transparent_32%)]" />
                <div className="pointer-events-none absolute right-7 top-7 hidden h-16 w-24 opacity-25 sm:block [background-image:radial-gradient(rgba(196,181,253,0.72)_1px,transparent_1px)] [background-size:9px_9px]" />

                <div className="relative">
                  <div className="mb-6 flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
                    <div>
                      <SectionLabel>Format snapshot</SectionLabel>
                      <h2 className="mt-2 text-2xl font-semibold tracking-tight text-white sm:text-3xl">
                        {data.label} at a glance
                      </h2>
                    </div>
                    <p className="max-w-xl text-sm leading-6 text-white/58 sm:text-right">
                      Quick facts to help you understand where {data.label} fits before you convert.
                    </p>
                  </div>

                  <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
                    <InfoTile
                      title="Type"
                      desc={categoryText(data.category)}
                      icon={<FormatGlyph category={data.category} className="h-5 w-5" />}
                      accent="violet"
                      number="01"
                    />
                    <InfoTile
                      title="Best for"
                      desc={data.bestFor.slice(0, 2).join(", ")}
                      icon={<FeatureIcon kind="spark" className="h-5 w-5" />}
                      accent="fuchsia"
                      number="02"
                    />
                    <InfoTile
                      title="Popular conversion"
                      desc={data.commonConversions[0]?.label || `${data.label} conversion`}
                      icon={<FeatureIcon kind="layers" className="h-5 w-5" />}
                      accent="sky"
                      number="03"
                    />
                    <InfoTile
                      title="Recommended"
                      desc={data.category === "image" ? "Web and sharing workflows" : data.category === "audio" ? "Playback and extraction" : "Playback, uploads, and sharing"}
                      icon={<FeatureIcon kind="check" className="h-5 w-5" />}
                      accent="emerald"
                      number="04"
                    />
                  </div>
                </div>
              </GlassCard>
            </section>

            <section className="mt-10 grid gap-6 lg:grid-cols-2">
              <GlassCard className="relative overflow-hidden p-6 sm:p-7">
                <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_top_right,rgba(139,92,246,0.12),transparent_28%)]" />
                <div className="pointer-events-none absolute right-5 top-5 hidden h-12 w-12 opacity-35 sm:block [background-image:radial-gradient(rgba(167,139,250,0.7)_1px,transparent_1px)] [background-size:8px_8px]" />

                <div className="relative">
                  <h2 className="text-2xl font-semibold tracking-tight text-white">
                    Why people use {data.label}
                  </h2>

                  <div className="mt-5 space-y-3">
                    {data.whyUse.map((item, index) => (
                      <FeatureRow
                        key={item}
                        text={item}
                        icon={<FeatureIcon kind={whyUseIcon(index)} className="h-5 w-5" />}
                      />
                    ))}
                  </div>
                </div>
              </GlassCard>

              <GlassCard className="p-6 sm:p-7">
                <h2 className="text-2xl font-semibold tracking-tight text-white">
                  Best use cases for {data.label}
                </h2>

                <div className="mt-5 space-y-3">
                  {data.bestFor.map((item, index) => (
                    <FeatureRow
                      key={item}
                      text={item}
                      icon={<FeatureIcon kind={bestForIcon(index)} className="h-5 w-5" />}
                    />
                  ))}
                </div>
              </GlassCard>
            </section>

            {data.deepGuideIntro ? (
              <section className="mt-10">
                <GlassCard className="relative overflow-hidden p-6 sm:p-7 lg:p-8">
                  <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_84%_18%,rgba(139,92,246,0.22),transparent_24%),radial-gradient(circle_at_top_right,rgba(255,255,255,0.07),transparent_30%),radial-gradient(circle_at_bottom_left,rgba(99,102,241,0.12),transparent_36%)]" />
                  <div className="pointer-events-none absolute right-4 top-1/2 hidden -translate-y-1/2 lg:block xl:right-8">
                    <div className="absolute inset-6 rounded-full bg-violet-500/22 blur-3xl" />
                    <Image
                      src="/images/deep-guide-visual.png"
                      alt="Practical format workflow visual"
                      width={520}
                      height={346}
                      className="relative w-[300px] object-contain opacity-95 drop-shadow-[0_0_54px_rgba(139,92,246,0.38)] xl:w-[340px]"
                      unoptimized
                    />
                  </div>

                  <div className="relative lg:pr-[320px] xl:pr-[370px]">
                    <SectionLabel>In-depth guide</SectionLabel>

                    <h2 className="mt-3 max-w-3xl text-2xl font-semibold tracking-tight text-white sm:text-3xl">
                      Understanding {data.label} in practical workflows
                    </h2>

                    <p className="mt-4 max-w-4xl pr-0 text-sm leading-7 text-white/72 sm:text-base">
                      {data.deepGuideIntro}
                    </p>

                    {data.technicalPoints?.length ? (
                      <div className="mt-6 grid gap-3">
                        {data.technicalPoints.map((item) => (
                          <div
                            key={item}
                            className="rounded-[22px] border border-violet-200/14 bg-white/[0.075] px-4 py-3 text-sm leading-6 text-white/72 shadow-[inset_0_1px_0_rgba(255,255,255,0.06)]"
                          >
                            {item}
                          </div>
                        ))}
                      </div>
                    ) : null}
                  </div>
                </GlassCard>
              </section>
            ) : null}

            {data.bestConversionSettings?.length ? (
              <section className="mt-10">
                <GlassCard className="relative overflow-hidden p-6 sm:p-7 lg:p-8">
                  <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_top_right,rgba(139,92,246,0.14),transparent_26%),radial-gradient(circle_at_bottom_left,rgba(99,102,241,0.08),transparent_32%)]" />
                  <div className="pointer-events-none absolute right-10 top-8 hidden h-40 w-[32%] opacity-30 lg:block [background-image:radial-gradient(rgba(167,139,250,0.55)_1px,transparent_1px)] [background-size:8px_8px] [mask-image:linear-gradient(90deg,transparent,black_18%,black_82%,transparent)]" />
                  <div className="pointer-events-none absolute right-0 top-6 hidden h-44 w-[40%] opacity-20 lg:block [background:radial-gradient(circle_at_center,rgba(139,92,246,0.42)_0%,transparent_58%),repeating-radial-gradient(circle_at_78%_34%,rgba(139,92,246,0.25)_0_2px,transparent_2px_10px)] [mask-image:linear-gradient(180deg,transparent,black_24%,black_100%)]" />

                  <div className="relative">
                    <SectionLabel>Practical settings</SectionLabel>

                    <h2 className="mt-3 text-2xl font-semibold tracking-tight text-white sm:text-3xl lg:text-[3rem] lg:leading-[1.08]">
                      Best conversion settings for {data.label}
                    </h2>

                    <p className="mt-3 max-w-4xl text-sm leading-7 text-white/68 sm:text-base">
                      These are practical starting points for users who want a better
                      balance of compatibility, file size, quality, and workflow
                      convenience when converting {data.label}-related files.
                    </p>

                    <div className="mt-7 grid gap-4 md:grid-cols-2">
                      {data.bestConversionSettings.map((item) => {
                        const meta = settingVisualMeta(item.label);
                        return (
                          <SettingsRow
                            key={item.label}
                            title={item.label}
                            desc={item.value}
                            iconKind={meta.icon}
                            badge={meta.badge}
                          />
                        );
                      })}
                    </div>
                  </div>
                </GlassCard>
              </section>
            ) : null}

            {data.formatComparison ? (
              <section className="mt-10">
                <GlassCard className="p-6 sm:p-7">
                  <SectionLabel>Comparison</SectionLabel>

                  <h2 className="mt-3 text-2xl font-semibold tracking-tight text-white sm:text-3xl">
                    {data.formatComparison.title}
                  </h2>

                  <div className="mt-6 grid gap-3">
                    {data.formatComparison.points.map((point) => (
                      <div
                        key={point}
                        className="rounded-[22px] border border-violet-200/14 bg-white/[0.075] px-4 py-3 text-sm leading-6 text-white/72 shadow-[inset_0_1px_0_rgba(255,255,255,0.06)]"
                      >
                        {point}
                      </div>
                    ))}
                  </div>
                </GlassCard>
              </section>
            ) : null}

            <AdsterraBanner300x250 className="mt-10" />

            <section className="mt-10">
              <GlassCard className="p-6 sm:p-7">
                <SectionLabel>Common conversions</SectionLabel>

                <h2 className="mt-3 text-2xl font-semibold tracking-tight text-white sm:text-3xl">
                  Popular {data.label} conversion paths
                </h2>

                <p className="mt-3 max-w-3xl text-sm leading-6 text-white/66">
                  These are some of the most practical conversion routes people use
                  when working with {data.label} files in everyday compatibility,
                  editing, playback, sharing, extraction, and optimization workflows.
                </p>

                <div className="mt-6 flex flex-wrap gap-3">
                  {data.commonConversions.map((item) => (
                    <Link
                      key={item.href}
                      href={item.href}
                      className="rounded-full bg-gradient-to-r from-violet-500 to-blue-500 px-4 py-2 text-sm font-semibold text-white shadow-[0_12px_28px_rgba(99,102,241,0.25)] transition duration-300 hover:-translate-y-0.5 hover:shadow-[0_0_28px_rgba(139,92,246,0.38)]"
                    >
                      {item.label}
                    </Link>
                  ))}
                </div>
              </GlassCard>
            </section>

            <section className="mt-10">
              <GlassCard className="relative overflow-hidden p-6 sm:p-7 lg:p-8">
                <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_78%_48%,rgba(59,130,246,0.20),transparent_32%),radial-gradient(circle_at_92%_20%,rgba(139,92,246,0.24),transparent_28%),linear-gradient(135deg,rgba(255,255,255,0.035),transparent_48%)]" />
                <div className="pointer-events-none absolute -right-20 -top-20 h-64 w-64 rounded-full bg-violet-400/18 blur-3xl" />
                <div className="pointer-events-none absolute -bottom-24 right-10 h-64 w-64 rounded-full bg-blue-400/16 blur-3xl" />

                <div className="relative grid gap-8 lg:grid-cols-[minmax(0,1fr)_360px] lg:items-center">
                  <div className="min-w-0">
                    <SectionLabel>Related formats</SectionLabel>

                    <h2 className="mt-3 max-w-2xl text-2xl font-semibold tracking-tight text-white sm:text-3xl">
                      Explore similar formats
                    </h2>

                    <p className="mt-3 max-w-3xl text-sm leading-6 text-white/66">
                      If you are comparing workflows, compression behavior, compatibility,
                      playback support, or output quality, these related formats are worth
                      checking before you convert.
                    </p>

                    <div className="mt-6 flex flex-wrap gap-3">
                      {data.relatedFormats.map((item) => (
                        <LinkPill key={item.href} href={item.href}>
                          {item.label}
                        </LinkPill>
                      ))}
                    </div>
                  </div>

                  <div className="pointer-events-none relative hidden min-h-[220px] lg:block">
                    <div className="absolute inset-0 rounded-full bg-violet-500/20 blur-3xl" />
                    <img
                      src="/images/format-related-visual.png"
                      alt="Explore similar file formats"
                      className="relative ml-auto w-[340px] translate-x-8 translate-y-3 object-contain drop-shadow-[0_0_46px_rgba(139,92,246,0.34)] transition duration-300"
                      loading="lazy"
                      decoding="async"
                    />
                  </div>
                </div>
              </GlassCard>
            </section>

            {data.faq?.length ? (
              <section className="mt-10">
                <GlassCard className="p-6 sm:p-7">
                  <SectionLabel>FAQ</SectionLabel>

                  <h2 className="mt-3 text-2xl font-semibold tracking-tight text-white sm:text-3xl">
                    Common questions about {data.label}
                  </h2>

                  <div className="mt-6 space-y-4">
                    {data.faq.map((item) => (
                      <div
                        key={item.question}
                        className="rounded-[22px] border border-violet-200/14 bg-[#292351]/62 p-4 shadow-[inset_0_1px_0_rgba(255,255,255,0.06)] transition duration-300 hover:border-violet-300/28 hover:bg-[#33296b]/70"
                      >
                        <h3 className="text-base font-semibold text-white">
                          {item.question}
                        </h3>
                        <p className="mt-2 text-sm leading-6 text-white/70">
                          {item.answer}
                        </p>
                      </div>
                    ))}
                  </div>
                </GlassCard>
              </section>
            ) : null}

            <section className="mt-10 grid gap-6 lg:grid-cols-2">
              <GlassCard className="p-6 sm:p-7">
                <h2 className="text-2xl font-semibold tracking-tight text-white sm:text-3xl">
                  Start from the converter
                </h2>
                <p className="mt-3 text-sm leading-6 text-white/66">
                  If you already know your target format, you can jump directly
                  into the converter and start with a {data.label}-related workflow
                  right away.
                </p>

                <div className="mt-6 flex flex-wrap gap-3">
                  <LinkPill href="/converter" primary>
                    Open Converter
                  </LinkPill>

                  {data.commonConversions[0] ? (
                    <LinkPill href={data.commonConversions[0].href}>
                      {data.commonConversions[0].label}
                    </LinkPill>
                  ) : null}
                </div>
              </GlassCard>

              <GlassCard className="relative overflow-hidden p-6 sm:p-7">
                <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_top_right,rgba(255,255,255,0.10),transparent_30%),radial-gradient(circle_at_bottom_left,rgba(59,130,246,0.16),transparent_36%)]" />

                <div className="relative">
                  <h2 className="text-2xl font-semibold tracking-tight text-white sm:text-3xl">
                    Browse more format guides
                  </h2>
                  <p className="mt-3 text-sm leading-6 text-white/66">
                    Converto includes guides for audio, video, and image workflows.
                    These pages help users understand where each format fits before
                    converting and which route makes the most sense.
                  </p>

                  <div className="mt-6 flex flex-wrap gap-3">
                    <LinkPill href="/formats" primary>
                      Open formats hub
                    </LinkPill>

                    <LinkPill href="/compare">Compare formats</LinkPill>
                  </div>
                </div>
              </GlassCard>
            </section>
          </div>
        </div>
      </main>
      <Footer />
    </>
  );
}
