"use client";

import { useState } from "react";
import Link from "next/link";
import { StudioShell } from "@/components/studio-shell";

const CHECKS = [
  {
    id: "honesty",
    label: "Read honesty fence (soft-sim only)",
    href: "/honesty",
  },
  {
    id: "queries",
    label: "Create or open a query pack",
    href: "/queries",
  },
  {
    id: "locales",
    label: "Configure at least one locale suite",
    href: "/locales",
  },
  {
    id: "answers",
    label: "Add an answer rubric",
    href: "/answers",
  },
  {
    id: "compare",
    label: "Run an A/B compare",
    href: "/compare",
  },
  {
    id: "settings",
    label: "Review org / export / webhook settings",
    href: "/settings",
  },
] as const;

export function OnboardingPage() {
  const [done, setDone] = useState<Record<string, boolean>>({});
  const completed = CHECKS.filter((c) => done[c.id]).length;
  const progress = Math.round((completed / CHECKS.length) * 100);

  return (
    <StudioShell
      title="Onboarding"
      subtitle="Checklist with visible progress for first-run care-query soft-sim setup."
    >
      <div className="mb-6">
        <p className="text-sm font-medium">Progress {progress}%</p>
        <div className="mt-2 h-2 overflow-hidden rounded bg-[var(--studio-gauze-soft)]">
          <div
            className="score-bar h-full bg-[var(--cq-teal)]"
            style={{ width: `${progress}%` }}
          />
        </div>
      </div>
      <ul className="space-y-3">
        {CHECKS.map((c) => (
          <li
            key={c.id}
            className="flex flex-wrap items-center justify-between gap-2 rounded-lg border border-[var(--studio-line)] bg-[var(--studio-panel)] px-4 py-3"
          >
            <label className="flex items-center gap-2 text-sm">
              <input
                type="checkbox"
                checked={Boolean(done[c.id])}
                onChange={(e) =>
                  setDone((d) => ({ ...d, [c.id]: e.target.checked }))
                }
              />
              {c.label}
            </label>
            <Link href={c.href} className="text-sm underline text-[var(--cq-teal)]">
              Open
            </Link>
          </li>
        ))}
      </ul>
      <p className="mt-6 text-sm">
        <Link href="/flows" className="underline text-[var(--cq-teal)]">
          See all flows
        </Link>
      </p>
    </StudioShell>
  );
}

export default OnboardingPage;
