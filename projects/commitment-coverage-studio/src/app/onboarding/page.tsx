"use client";

import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { DISPLAY_NAME } from "@/lib/claim";

const STORAGE_KEY = "ccs-onboarding-progress-v1";

type ChecklistId = "connect" | "import" | "match" | "gap" | "renew";

function loadDone(): Set<ChecklistId> {
  if (typeof window === "undefined") return new Set();
  try {
    const raw = window.localStorage.getItem(STORAGE_KEY);
    if (!raw) return new Set();
    const parsed = JSON.parse(raw) as unknown;
    if (!Array.isArray(parsed)) return new Set();
    const allowed = new Set<ChecklistId>([
      "connect",
      "import",
      "match",
      "gap",
      "renew",
    ]);
    return new Set(
      parsed.filter((id): id is ChecklistId => allowed.has(id as ChecklistId)),
    );
  } catch {
    return new Set();
  }
}

export default function OnboardingPage() {
  const [done, setDone] = useState<Set<ChecklistId>>(new Set());
  const [hydrated, setHydrated] = useState(false);

  useEffect(() => {
    setDone(loadDone());
    setHydrated(true);
  }, []);

  useEffect(() => {
    if (!hydrated) return;
    window.localStorage.setItem(STORAGE_KEY, JSON.stringify([...done]));
  }, [done, hydrated]);

  const progress = useMemo(() => {
    const count = done.size;
    const total = 5;
    const percent = Math.round((count / total) * 100);
    return { count, total, percent };
  }, [done]);

  function toggle(id: ChecklistId) {
    setDone((prev) => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });
  }

  const items: {
    id: ChecklistId;
    label: string;
    href: "/commitments" | "/imports" | "/coverage" | "/gaps" | "/renewals";
    cta: string;
  }[] = [
    {
      id: "connect",
      label: "Connect a soft-sim cloud account",
      href: "/commitments",
      cta: "Open commitments",
    },
    {
      id: "import",
      label: "Import usage for the renewal window",
      href: "/imports",
      cta: "Open imports",
    },
    {
      id: "match",
      label: "Match commitments to coverage dollars",
      href: "/coverage",
      cta: "Open coverage",
    },
    {
      id: "gap",
      label: "Review gap findings before renewal",
      href: "/gaps",
      cta: "Open gaps",
    },
    {
      id: "renew",
      label: "Draft a renewal pack (buy / reduce / hold)",
      href: "/renewals",
      cta: "Open renewals",
    },
  ];

  return (
    <main className="ledger-field flex flex-1 flex-col">
      <article className="mx-auto w-full max-w-3xl flex-1 px-6 py-16 sm:px-12 sm:py-24">
        <p className="font-[family-name:var(--font-mono)] text-xs font-medium uppercase tracking-[0.2em] text-muted-foreground">
          {DISPLAY_NAME}
        </p>
        <h1 className="mt-4 font-[family-name:var(--font-display)] text-3xl font-semibold tracking-tight text-foreground sm:text-4xl">
          Onboarding
        </h1>
        <p className="mt-4 max-w-2xl text-base leading-relaxed text-muted-foreground">
          First-run checklist for the soft-sim desk. Mark steps done as you walk
          connect → import → match → gap → renew. Progress is saved in this
          browser only via localStorage.
        </p>

        <div className="mt-10" aria-live="polite">
          <p className="font-[family-name:var(--font-mono)] text-xs font-medium uppercase tracking-[0.18em] text-muted-foreground">
            Progress
          </p>
          <p className="mt-2 text-sm text-foreground">
            {progress.count} of {progress.total} complete ({progress.percent}%)
          </p>
          <div
            className="mt-3 h-2 w-full max-w-md overflow-hidden rounded-sm bg-[color-mix(in_srgb,var(--color-rule)_18%,transparent)]"
            role="progressbar"
            aria-valuenow={progress.percent}
            aria-valuemin={0}
            aria-valuemax={100}
          >
            <div
              className="h-full bg-[var(--color-accent)] transition-[width] duration-300 ease-out"
              style={{ width: `${progress.percent}%` }}
            />
          </div>
        </div>

        <ul className="mt-12 space-y-0 divide-y divide-border/60 border-y border-border/60">
          {items.map((item) => {
            const checked = done.has(item.id);
            return (
              <li
                key={item.id}
                className="flex flex-col gap-4 py-6 sm:flex-row sm:items-center sm:justify-between"
              >
                <label className="flex max-w-xl cursor-pointer items-start gap-3 text-sm">
                  <input
                    type="checkbox"
                    checked={checked}
                    onChange={() => toggle(item.id)}
                    className="mt-0.5 size-4 accent-[var(--color-accent)]"
                  />
                  <span
                    className={
                      checked
                        ? "text-muted-foreground line-through"
                        : "text-foreground"
                    }
                  >
                    {item.label}
                  </span>
                </label>
                {item.href === "/commitments" ? (
                  <Button asChild variant="outline" size="sm">
                    <Link href="/commitments">{item.cta}</Link>
                  </Button>
                ) : null}
                {item.href === "/imports" ? (
                  <Button asChild variant="outline" size="sm">
                    <Link href="/imports">{item.cta}</Link>
                  </Button>
                ) : null}
                {item.href === "/coverage" ? (
                  <Button asChild variant="outline" size="sm">
                    <Link href="/coverage">{item.cta}</Link>
                  </Button>
                ) : null}
                {item.href === "/gaps" ? (
                  <Button asChild variant="outline" size="sm">
                    <Link href="/gaps">{item.cta}</Link>
                  </Button>
                ) : null}
                {item.href === "/renewals" ? (
                  <Button asChild variant="outline" size="sm">
                    <Link href="/renewals">{item.cta}</Link>
                  </Button>
                ) : null}
              </li>
            );
          })}
        </ul>

        <div className="mt-12 flex flex-wrap gap-3">
          <Button asChild>
            <Link href="/flows">Browse flows</Link>
          </Button>
          <Button asChild variant="outline">
            <Link href="/demo">Guided demo</Link>
          </Button>
        </div>
      </article>
    </main>
  );
}
