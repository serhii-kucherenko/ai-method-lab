"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";

const DESK_NAV = [
  { href: "/jobs", label: "Jobs" },
  { href: "/lifecycle", label: "Lifecycle" },
  { href: "/scenario", label: "Scenario" },
  { href: "/batch", label: "Batch" },
  { href: "/audit", label: "Audit" },
  { href: "/goldens", label: "Goldens" },
  { href: "/honesty", label: "Honesty" },
  { href: "/settings", label: "Settings" },
];

export function DeskShell({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const isLanding = pathname === "/";

  if (isLanding) {
    return (
      <div className="flex min-h-full flex-col">
        <header className="absolute inset-x-0 top-0 z-10">
          <div className="mx-auto flex max-w-5xl items-center justify-between px-4 py-5 sm:px-6">
            <span className="sr-only">Heart Scan Desk</span>
            <Link
              href="/jobs"
              className="ml-auto text-sm font-medium text-[var(--hsd-steel)] underline-offset-2 hover:underline"
            >
              Open desk
            </Link>
          </div>
        </header>
        <main className="mx-auto w-full max-w-5xl flex-1 px-4 pt-16 pb-8 sm:px-6">
          {children}
        </main>
      </div>
    );
  }

  return (
    <div className="flex min-h-full flex-col">
      <header className="border-b border-[var(--hsd-line)]/80 bg-[color-mix(in_srgb,var(--hsd-paper)_88%,white)]/90 backdrop-blur-sm">
        <div className="mx-auto flex max-w-5xl flex-col gap-3 px-4 py-4 sm:px-6">
          <div className="flex flex-wrap items-baseline justify-between gap-3">
            <Link
              href="/jobs"
              className="font-[family-name:var(--font-display)] text-2xl tracking-tight text-[var(--hsd-ink)] sm:text-3xl"
            >
              Heart Scan Desk
            </Link>
            <Link
              href="/"
              className="text-sm text-[var(--hsd-muted)] underline-offset-2 hover:underline"
            >
              Landing
            </Link>
          </div>
          <nav className="flex flex-wrap gap-x-4 gap-y-2 text-sm text-[var(--hsd-muted)]">
            {DESK_NAV.map((item) => {
              const active = pathname.startsWith(item.href);
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  className={cn(
                    "transition-colors hover:text-[var(--hsd-steel-deep)]",
                    active &&
                      "hsd-nav-active font-medium text-[var(--hsd-steel-deep)]",
                  )}
                >
                  {item.label}
                </Link>
              );
            })}
          </nav>
        </div>
      </header>
      <main className="mx-auto w-full max-w-5xl flex-1 px-4 py-8 sm:px-6">
        {children}
      </main>
      <footer className="border-t border-[var(--hsd-line)]/70 px-4 py-5 text-sm text-[var(--hsd-muted)] sm:px-6">
        <div className="mx-auto max-w-5xl space-y-1">
          <p>
            Workflow experiment inspired by the paper — not a commercial LLM API
            gateway and not a replacement for the authors&apos; system. Never
            brand the authors' foundation model as the product name.
          </p>
          <p>
            <a
              className="text-[var(--hsd-steel)] underline-offset-2 hover:underline"
              href="https://arxiv.org/abs/2607.11287v1"
            >
              Paper
            </a>
            {" · Authors' code: none published"}
          </p>
        </div>
      </footer>
    </div>
  );
}
