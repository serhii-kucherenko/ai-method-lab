"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { DISPLAY_NAME } from "@/claim";
import { cn } from "@/lib/utils";

const NAV = [
  { href: "/campaigns", label: "Campaigns" },
  { href: "/reagents", label: "Reagents" },
  { href: "/loops", label: "Loops" },
  { href: "/runs", label: "Runs" },
  { href: "/compare", label: "Compare" },
  { href: "/scoreboard", label: "Scoreboard" },
  { href: "/flows", label: "Flows" },
  { href: "/demo", label: "Demo" },
  { href: "/onboarding", label: "Onboarding" },
  { href: "/pricing", label: "Pricing" },
  { href: "/settings", label: "Settings" },
  { href: "/honesty", label: "Honesty" },
] as const;

export function StudioShell({
  children,
  title,
  subtitle,
}: {
  children: React.ReactNode;
  title: string;
  subtitle?: string;
}) {
  const pathname = usePathname();
  return (
    <div className="min-h-screen bg-[var(--studio-bg)] text-[var(--studio-ink)]">
      <header className="border-b border-[var(--studio-line)] bg-[color-mix(in_srgb,var(--studio-panel)_92%,transparent)] backdrop-blur-sm">
        <div className="mx-auto flex max-w-6xl flex-wrap items-center justify-between gap-4 px-4 py-4">
          <Link
            href="/"
            className="font-[family-name:var(--font-display)] text-xl tracking-tight text-[var(--rl-teal)]"
          >
            {DISPLAY_NAME}
          </Link>
          <nav className="flex flex-wrap gap-1 text-sm">
            {NAV.map((item) => {
              const active =
                pathname === item.href || pathname.startsWith(`${item.href}/`);
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  className={cn(
                    "rounded-md px-2.5 py-1.5 transition-colors",
                    active
                      ? "bg-[var(--studio-accent-soft)] text-[var(--studio-ink-deep)]"
                      : "text-[color-mix(in_srgb,var(--studio-ink)_55%,transparent)] hover:bg-[var(--studio-gauze-soft)] hover:text-[var(--studio-ink)]",
                  )}
                >
                  {item.label}
                </Link>
              );
            })}
          </nav>
        </div>
      </header>
      <main className="mx-auto max-w-6xl px-4 py-8">
        <div className="mb-8">
          <h1 className="font-[family-name:var(--font-display)] text-3xl text-[var(--studio-ink)]">
            {title}
          </h1>
          {subtitle ? (
            <p className="mt-2 max-w-2xl text-[color-mix(in_srgb,var(--studio-ink)_60%,transparent)]">
              {subtitle}
            </p>
          ) : null}
        </div>
        {children}
      </main>
    </div>
  );
}
