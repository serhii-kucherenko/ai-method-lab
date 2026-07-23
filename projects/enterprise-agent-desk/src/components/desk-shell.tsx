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
            <span className="sr-only">Enterprise Agent Desk</span>
            <Link
              href="/jobs"
              className="ml-auto text-sm font-medium text-[var(--ead-teal)] underline-offset-2 hover:underline"
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
      <header className="border-b border-[var(--ead-line)]/80 bg-[color-mix(in_srgb,var(--ead-paper)_88%,white)]/90 backdrop-blur-sm">
        <div className="mx-auto flex max-w-5xl flex-col gap-3 px-4 py-4 sm:px-6">
          <div className="flex flex-wrap items-baseline justify-between gap-3">
            <Link
              href="/jobs"
              className="font-[family-name:var(--font-display)] text-2xl tracking-tight text-[var(--ead-ink)] sm:text-3xl"
            >
              Enterprise Agent Desk
            </Link>
            <Link
              href="/"
              className="text-sm text-[var(--ead-muted)] underline-offset-2 hover:underline"
            >
              Landing
            </Link>
          </div>
          <nav className="flex flex-wrap gap-x-4 gap-y-2 text-sm text-[var(--ead-muted)]">
            {DESK_NAV.map((item) => {
              const active = pathname.startsWith(item.href);
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  className={cn(
                    "transition-colors hover:text-[var(--ead-teal-deep)]",
                    active &&
                      "std-nav-active font-medium text-[var(--ead-teal-deep)]",
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
      <footer className="border-t border-[var(--ead-line)]/70 px-4 py-5 text-sm text-[var(--ead-muted)] sm:px-6">
        <div className="mx-auto max-w-5xl space-y-1">
          <p>
            Workflow experiment inspired by the paper — not a live monitoring
            course product and not a replacement for the authors&apos; monitoring
            platform.
          </p>
          <p>
            <a
              className="text-[var(--ead-teal)] underline-offset-2 hover:underline"
              href="https://arxiv.org/abs/2607.17331v1"
            >
              Paper
            </a>
            {" · "}
            <span>Authors&apos; code: none published with this paper</span>
          </p>
        </div>
      </footer>
    </div>
  );
}
