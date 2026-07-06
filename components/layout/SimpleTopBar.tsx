"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

const cx = (...c: Array<string | false | null | undefined>) =>
  c.filter(Boolean).join(" ");

const navItems = [
  { href: "/formats", label: "Formats" },
  { href: "/compare", label: "Compare" },
  { href: "/guides", label: "Guides" },
  { href: "/terms", label: "Terms" },
  { href: "/privacy", label: "Privacy" },
  { href: "/contact", label: "Contact" },
];

export default function SimpleTopBar({
  shellMax = "max-w-[1320px]",
}: {
  shellMax?: string;
}) {
  const pathname = usePathname();

  return (
    <header className="sticky top-0 z-50 border-b border-violet-400/40 bg-[#0b091c]/95 shadow-[0_2px_0_rgba(139,92,246,0.22),0_10px_30px_rgba(4,3,16,0.30)] backdrop-blur-xl">
      <div
        className={cx(
          "mx-auto flex min-h-[70px] items-center justify-between gap-4 px-4 sm:px-6 lg:px-8",
          shellMax,
        )}
      >
        <Link href="/" className="group inline-flex shrink-0 items-center gap-3" aria-label="Converto home">
          <img
            src="/brand/converto-logo.svg"
            alt="Converto logo"
            className="h-9 w-9 object-contain drop-shadow-[0_0_16px_rgba(139,92,246,0.42)] transition duration-300 group-hover:scale-[1.04]"
          />

          <span className="border-r border-white/8 pr-4 leading-tight">
            <span className="block text-[17px] font-semibold tracking-tight text-white">
              Converto
            </span>
            <span className="mt-0.5 block text-[11px] text-white/52">
              by NexviaSoft
            </span>
          </span>
        </Link>

        <nav className="min-w-0 overflow-x-auto [scrollbar-width:none] [&::-webkit-scrollbar]:hidden" aria-label="Primary navigation">
          <div className="flex min-w-max items-center gap-1 sm:gap-2">
            {navItems.map((item) => {
              const active =
                item.href === "/"
                  ? pathname === "/"
                  : pathname === item.href || pathname.startsWith(`${item.href}/`);

              return (
                <Link
                  key={item.href}
                  href={item.href}
                  aria-current={active ? "page" : undefined}
                  className={cx(
                    "rounded-lg px-3 py-2.5 text-[13px] font-medium transition duration-200 sm:px-3.5",
                    active
                      ? "border border-violet-300/12 bg-violet-500/12 text-violet-200 shadow-[inset_0_1px_0_rgba(255,255,255,0.04),0_0_24px_rgba(139,92,246,0.12)]"
                      : "text-white/68 hover:bg-white/[0.055] hover:text-white",
                  )}
                >
                  {item.label}
                </Link>
              );
            })}
          </div>
        </nav>
      </div>
    </header>
  );
}
