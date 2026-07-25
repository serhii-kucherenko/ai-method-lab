"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import { StudioShell } from "@/components/studio-shell";

const CHECKLIST = [
  { id: "honesty", label: "Read the honesty fence", href: "/honesty" },
  { id: "signals", label: "Create or review a pv pack", href: "/signals" },
  { id: "cohorts", label: "Configure a cohort", href: "/cohorts" },
  { id: "exposures", label: "Register an exposure", href: "/exposures" },
  { id: "compare", label: "Run an A/B compare", href: "/compare" },
  { id: "settings", label: "Invite a member and export", href: "/settings" },
] as const;

export function OnboardingPage() {
  const [done, setDone] = useState<Record<string, boolean>>({});
  const progress = useMemo(() => {
    const n = CHECKLIST.filter((c) => done[c.id]).length;
    return Math.round((n / CHECKLIST.length) * 100);
  }, [done]);

  return (
    <StudioShell
      title="Onboarding"
      subtitle="Checklist with visible progress for first-run PV causal soft-sim."
    >
      <p className="mb-2 text-sm font-medium">Progress: {progress}%</p>
      <div className="mb-6 h-2 overflow-hidden rounded bg-[var(--studio-gauze-soft)]">
        <div
          className="score-bar h-full bg-[var(--pc-teal)]"
          style={{ width: `${progress}%` }}
        />
      </div>
      <ul className="space-y-3">
        {CHECKLIST.map((c) => (
          <li
            key={c.id}
            className="flex flex-wrap items-center justify-between gap-2 rounded-lg border border-[var(--studio-line)] bg-[var(--studio-panel)] px-4 py-3"
          >
            <label className="flex items-center gap-2">
              <input
                type="checkbox"
                checked={!!done[c.id]}
                onChange={(e) =>
                  setDone((d) => ({ ...d, [c.id]: e.target.checked }))
                }
              />
              <span>{c.label}</span>
            </label>
            <Link href={c.href} className="text-sm text-[var(--pc-teal)] underline">
              {c.href}
            </Link>
          </li>
        ))}
      </ul>
    </StudioShell>
  );
}

export default OnboardingPage;
