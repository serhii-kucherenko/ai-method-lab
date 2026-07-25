"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import { StudioShell } from "@/components/studio-shell";

const CHECKS = [
  { id: "honesty", label: "Read the honesty fence", href: "/honesty" },
  { id: "packs", label: "Create or open a pathway pack", href: "/packs" },
  { id: "cohorts", label: "Configure at least one cohort", href: "/cohorts" },
  { id: "screens", label: "Configure a screen recipe", href: "/screens" },
  { id: "equity", label: "Open an equity gate", href: "/equity" },
  { id: "compare", label: "Run a dual A/B compare", href: "/compare" },
  { id: "settings", label: "Review org, members, webhook", href: "/settings" },
] as const;

export function OnboardingPage() {
  const [done, setDone] = useState<Record<string, boolean>>({});
  const progress = useMemo(() => {
    const n = CHECKS.filter((c) => done[c.id]).length;
    return Math.round((n / CHECKS.length) * 100);
  }, [done]);

  return (
    <StudioShell
      title="Onboarding"
      subtitle="Checklist with visible progress for first-run equity-access setup."
    >
      <div className="mb-6">
        <p className="text-sm font-medium">Progress {progress}%</p>
        <div className="mt-2 h-2 overflow-hidden rounded-full bg-[var(--studio-gauze-soft)]">
          <div
            className="score-bar h-full bg-[var(--ae-teal)]"
            style={{ width: `${progress}%` }}
          />
        </div>
      </div>
      <ul className="space-y-3">
        {CHECKS.map((item) => (
          <li
            key={item.id}
            className="flex items-center justify-between gap-3 rounded-lg border bg-white p-4"
          >
            <label className="flex items-center gap-3 text-sm">
              <input
                type="checkbox"
                checked={!!done[item.id]}
                onChange={(e) =>
                  setDone((prev) => ({ ...prev, [item.id]: e.target.checked }))
                }
              />
              {item.label}
            </label>
            <Link href={item.href} className="text-sm underline text-[var(--ae-teal)]">
              Open
            </Link>
          </li>
        ))}
      </ul>
    </StudioShell>
  );
}

export default OnboardingPage;
