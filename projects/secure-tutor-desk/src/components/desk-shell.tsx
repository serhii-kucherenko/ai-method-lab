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
            <span className="sr-only">Secure Tutor Desk</span>
            <Link
              href="/jobs"
              className="ml-auto text-sm font-medium text-[var(--std-teal)] underline-offset-2 hover:underline"
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
      <header className="border-b border-[var(--std-line)]/80 bg-[color-mix(in_srgb,var(--std-paper)_88%,white)]/90 backdrop-blur-sm">
        <div className="mx-auto flex max-w-5xl flex-col gap-3 px-4 py-4 sm:px-6">
          <div className="flex flex-wrap items-baseline justify-between gap-3">
            <Link
              href="/jobs"
              className="font-[family-name:var(--font-display)] text-2xl tracking-tight text-[var(--std-ink)] sm:text-3xl"
            >
              Secure Tutor Desk
            </Link>
            <Link
              href="/"
              className="text-sm text-[var(--std-muted)] underline-offset-2 hover:underline"
            >
              Landing
            </Link>
          </div>
          <nav className="flex flex-wrap gap-x-4 gap-y-2 text-sm text-[var(--std-muted)]">
            {DESK_NAV.map((item) => {
              const active = pathname.startsWith(item.href);
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  className={cn(
                    "transition-colors hover:text-[var(--std-teal-deep)]",
                    active &&
                      "std-nav-active font-medium text-[var(--std-teal-deep)]",
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
      <footer className="border-t border-[var(--std-line)]/70 px-4 py-5 text-sm text-[var(--std-muted)] sm:px-6">
        <div className="mx-auto max-w-5xl space-y-1">
          <p>
            Workflow experiment inspired by the paper — not a live tutoring
            course product and not a replacement for the authors&apos; tutoring
            platform.
          </p>
          <p>
            <a
              className="text-[var(--std-teal)] underline-offset-2 hover:underline"
              href="https://arxiv.org/abs/2607.14601v1"
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
