"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { DISPLAY_NAME } from "@/lib/claim";
import { cn } from "@/lib/utils";

function NavLink({
  href,
  label,
  pathname,
}: {
  href: string;
  label: string;
  pathname: string;
}) {
  const active = pathname === href || pathname.startsWith(`${href}/`);
  return (
    <Link
      href={href}
      className={cn(
        "text-sm transition-colors",
        active
          ? "font-medium text-[var(--color-accent)]"
          : "text-muted-foreground hover:text-foreground",
      )}
    >
      {label}
    </Link>
  );
}

export function StudioShell({
  children,
  title,
  description,
}: {
  children: React.ReactNode;
  title: string;
  description?: string;
}) {
  const pathname = usePathname();

  return (
    <div className="ledger-field flex min-h-full flex-1 flex-col">
      <header className="border-b border-[color-mix(in_srgb,var(--color-rule)_35%,transparent)] bg-[color-mix(in_srgb,var(--color-paper)_92%,white)]">
        <div className="mx-auto flex w-full max-w-6xl flex-col gap-4 px-6 py-4 sm:px-10">
          <div className="flex flex-wrap items-baseline justify-between gap-3">
            <Link
              href="/"
              className="font-[family-name:var(--font-display)] text-lg font-semibold tracking-tight text-foreground"
            >
              {DISPLAY_NAME}
            </Link>
            <p className="font-[family-name:var(--font-mono)] text-[0.7rem] uppercase tracking-[0.16em] text-muted-foreground">
              Soft-sim · not live billing SOR
            </p>
          </div>
          <nav aria-label="Studio primary" className="flex flex-wrap gap-x-4 gap-y-2">
            <NavLink href="/commitments" label="Commitments" pathname={pathname} />
            <NavLink href="/coverage" label="Coverage" pathname={pathname} />
            <NavLink href="/gaps" label="Gaps" pathname={pathname} />
            <NavLink href="/renewals" label="Renewals" pathname={pathname} />
            <NavLink href="/imports" label="Imports" pathname={pathname} />
            <NavLink href="/compare" label="Compare" pathname={pathname} />
            <NavLink href="/scoreboard" label="Scoreboard" pathname={pathname} />
          </nav>
        </div>
      </header>

      <main className="mx-auto w-full max-w-6xl flex-1 px-6 py-8 sm:px-10">
        <div className="mb-8">
          <h1 className="font-[family-name:var(--font-display)] text-3xl font-semibold tracking-tight text-foreground">
            {title}
          </h1>
          {description ? (
            <p className="mt-2 max-w-2xl text-sm leading-relaxed text-muted-foreground">
              {description}
            </p>
          ) : null}
        </div>
        {children}
      </main>
    </div>
  );
}
