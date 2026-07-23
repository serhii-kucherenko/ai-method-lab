"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";

const NAV = [
  { href: "/", label: "Landing" },
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
        <header className="border-b border-[var(--hrd-line)]/60 bg-[color-mix(in_srgb,var(--hrd-paper)_70%,transparent)]/80 backdrop-blur-sm">
          <div className="mx-auto flex max-w-5xl items-center justify-between gap-4 px-4 py-4 sm:px-6">
            <span className="sr-only">Heart Rhythm Desk</span>
            <nav className="ml-auto flex flex-wrap items-center gap-x-4 gap-y-2 text-sm text-[var(--hrd-muted)]">
              <Link
                href="/jobs"
                className="font-medium text-[var(--hrd-teal-deep)] transition-colors hover:text-[var(--hrd-teal)]"
              >
                Open desk
              </Link>
              <Link
                href="/honesty"
                className="transition-colors hover:text-[var(--hrd-teal-deep)]"
              >
                Honesty
              </Link>
            </nav>
          </div>
        </header>
        <main className="mx-auto w-full max-w-5xl flex-1 px-4 sm:px-6">
          {children}
        </main>
      </div>
    );
  }

  return (
    <div className="flex min-h-full flex-col">
      <header className="border-b border-[var(--hrd-line)]/80 bg-[color-mix(in_srgb,var(--hrd-paper)_88%,white)]/90 backdrop-blur-sm">
        <div className="mx-auto flex max-w-5xl flex-col gap-3 px-4 py-4 sm:px-6">
          <Link
            href="/"
            className="font-[family-name:var(--font-display)] text-2xl tracking-tight text-[var(--hrd-ink)] sm:text-3xl"
          >
            Heart Rhythm Desk
          </Link>
          <nav className="flex flex-wrap gap-x-4 gap-y-2 text-sm text-[var(--hrd-muted)]">
            {NAV.map((item) => {
              const active =
                item.href === "/"
                  ? pathname === "/"
                  : pathname.startsWith(item.href);
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  className={cn(
                    "transition-colors hover:text-[var(--hrd-teal-deep)]",
                    active &&
                      "hrd-nav-active font-medium text-[var(--hrd-teal-deep)]",
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
      <footer className="border-t border-[var(--hrd-line)]/70 px-4 py-5 text-sm text-[var(--hrd-muted)] sm:px-6">
        <div className="mx-auto max-w-5xl space-y-1">
          <p>
            Workflow experiment inspired by the paper — not a clinical ECG
            reader and not a replacement for the authors&apos; model.
          </p>
          <p>
            <a
              className="text-[var(--hrd-teal)] underline-offset-2 hover:underline"
              href="https://arxiv.org/abs/2607.14613v1"
            >
              Paper
            </a>
            {" · "}
            <a
              className="text-[var(--hrd-teal)] underline-offset-2 hover:underline"
              href="https://github.com/Open-EXG/AG-SCL-for-Long-Tailed-ECG"
            >
              Authors&apos; code
            </a>
          </p>
        </div>
      </footer>
    </div>
  );
}
