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
        <header className="border-b border-[var(--pvd-line)]/60 bg-[color-mix(in_srgb,var(--pvd-paper)_70%,transparent)]/80 backdrop-blur-sm">
          <div className="mx-auto flex max-w-5xl items-center justify-between gap-4 px-4 py-4 sm:px-6">
            <span className="sr-only">Pathology Vision Desk</span>
            <nav className="ml-auto flex flex-wrap items-center gap-x-4 gap-y-2 text-sm text-[var(--pvd-muted)]">
              <Link
                href="/jobs"
                className="font-medium text-[var(--pvd-rose-deep)] transition-colors hover:text-[var(--pvd-rose)]"
              >
                Open desk
              </Link>
              <Link
                href="/honesty"
                className="transition-colors hover:text-[var(--pvd-rose-deep)]"
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
      <header className="border-b border-[var(--pvd-line)]/80 bg-[color-mix(in_srgb,var(--pvd-paper)_88%,white)]/90 backdrop-blur-sm">
        <div className="mx-auto flex max-w-5xl flex-col gap-3 px-4 py-4 sm:px-6">
          <Link
            href="/"
            className="font-[family-name:var(--font-display)] text-2xl tracking-tight text-[var(--pvd-ink)] sm:text-3xl"
          >
            Pathology Vision Desk
          </Link>
          <nav className="flex flex-wrap gap-x-4 gap-y-2 text-sm text-[var(--pvd-muted)]">
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
                    "transition-colors hover:text-[var(--pvd-rose-deep)]",
                    active &&
                      "pvd-nav-active font-medium text-[var(--pvd-rose-deep)]",
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
      <footer className="border-t border-[var(--pvd-line)]/70 px-4 py-5 text-sm text-[var(--pvd-muted)] sm:px-6">
        <div className="mx-auto max-w-5xl space-y-1">
          <p>
            Workflow experiment inspired by the paper — not a clinical
            diagnostic tool and not a replacement for the authors&apos; model.
          </p>
          <p>
            <a
              className="text-[var(--pvd-rose)] underline-offset-2 hover:underline"
              href="https://arxiv.org/abs/2607.09526v1"
            >
              Paper
            </a>
            {" · "}
            <a
              className="text-[var(--pvd-rose)] underline-offset-2 hover:underline"
              href="https://github.com/WonderLandxD/ALICE"
            >
              Authors&apos; code
            </a>
          </p>
        </div>
      </footer>
    </div>
  );
}
